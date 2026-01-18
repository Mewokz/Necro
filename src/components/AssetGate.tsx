import { useEffect, useMemo, useRef, useState } from "react";

type AssetGateProps = {
  children: React.ReactNode;
};

type LoadStep = {
  label: string;
  weight: number;
  run: () => Promise<void>;
};

const MIN_LOADING_TIME_MS = 5000;
const TICK_MS = 60;
const PROGRESS_CAP_BEFORE_READY = 96;

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function preloadImage(src: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

async function waitForFontsReady() {
  const fonts = document.fonts;
  if (!fonts) return;
  await fonts.ready;
}

type BootLogLine = {
  id: number;
  text: string;
  status?: "OK" | "WARN" | "FAIL" | "SKIP";
};

export function AssetGate({ children }: AssetGateProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Initializing");
  const [ready, setReady] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const targetProgressRef = useRef(0);

  const [logs, setLogs] = useState<BootLogLine[]>([]);
  const logIdRef = useRef(1);

  const addLog = (text: string, status?: BootLogLine["status"]) => {
    const id = logIdRef.current++;
    setLogs((prev) => [...prev, { id, text, status }]);
  };

  const steps: LoadStep[] = useMemo(
    () => [
      {
        label: "Loading fonts",
        weight: 45,
        run: async () => {
          addLog("Mounting font faces");
          await waitForFontsReady();
          addLog("Font subsystem ready", "OK");
        },
      },
      {
        label: "Loading background",
        weight: 35,
        run: async () => {
          addLog("Loading background asset");
          try {
            // если у тебя нет bg.jpg — либо добавь в public/assets/bg.jpg,
            // либо закомментируй следующую строку
            await preloadImage("/assets/bg.jpg");
            addLog("Background loaded", "OK");
          } catch (e) {
            console.warn(e);
            addLog("Background missing or failed", "WARN");
          }
        },
      },
      {
        label: "Finalizing",
        weight: 20,
        run: async () => {
          addLog("Finalizing interface modules");
          // небольшая финализация (создаёт “вес”)
          await sleep(220);
          await sleep(180);
          await sleep(240);
          addLog("Interface modules online", "OK");
        },
      },
    ],
    [],
  );

  useEffect(() => {
    let cancelled = false;

    // Плавный “boot-like” прогресс
    const tick = setInterval(() => {
      setProgress((p) => {
        const target = targetProgressRef.current;
        if (p >= target) return p;

        const remaining = target - p;

        // Нерегулярность (как у реального boot)
        const jitter =
          remaining > 18
            ? Math.floor(Math.random() * 4) + 2 // 2..5
            : Math.floor(Math.random() * 2) + 1; // 1..2

        const step = Math.min(remaining, Math.max(1, jitter));
        return Math.min(target, p + step);
      });
    }, TICK_MS);

    function requestSkip() {
      if (cancelled) return;
      setSkipped(true);
      addLog("Operator override", "SKIP");
      targetProgressRef.current = 100;
      setProgress(100);
      setReady(true);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === "Escape") requestSkip();
    }

    function onPointerDown() {
      requestSkip();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);

    async function run() {
      const start = performance.now();

      const totalWeight = steps.reduce((sum, s) => sum + s.weight, 0);
      let doneWeight = 0;

      targetProgressRef.current = 3;
      addLog("Boot sequence start", "OK");

      for (const s of steps) {
        if (cancelled) return;

        setStage(s.label);

        try {
          await s.run();
        } catch (e) {
          console.warn(e);
          addLog(`Step failed: ${s.label}`, "WARN");
        }

        doneWeight += s.weight;
        const pct = Math.round((doneWeight / totalWeight) * 100);

        // ❗ до истечения MIN_LOADING_TIME_MS не даём прогрессу дойти до 100
        targetProgressRef.current = Math.max(
          targetProgressRef.current,
          Math.min(pct, PROGRESS_CAP_BEFORE_READY),
        );
      }

      const elapsed = performance.now() - start;
      const remaining = MIN_LOADING_TIME_MS - elapsed;

      if (remaining > 0) {
        addLog("Synchronizing timers");
        await sleep(remaining);
        addLog("Timer sync complete", "OK");
      }

      if (cancelled || skipped) return;

      // unlock 100%
      targetProgressRef.current = 100;
      await sleep(300);

      if (!cancelled) {
        addLog("System ready", "OK");
        setReady(true);
      }
    }

    run();

    return () => {
      cancelled = true;
      clearInterval(tick);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [steps, skipped]);

  if (ready) return <>{children}</>;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        backgroundColor: "rgb(var(--ui-bg))",
        color: "rgb(var(--ui-text))",
        fontFamily:
          '"IBM Plex Mono Local", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      }}
    >
      {/* dead military overlay */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-55"
          style={{
            background:
              "radial-gradient(900px circle at 22% 18%, rgba(124,196,160,0.08), transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-45"
          style={{
            background:
              "radial-gradient(1100px circle at 82% 25%, rgba(199,168,91,0.06), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 scanlines" />
      </div>

      <div
        className="relative w-full max-w-lg rounded-2xl border p-6"
        style={{
          borderColor: "rgb(var(--ui-border))",
          backgroundColor: "rgba(11,18,14,0.55)",
        }}
      >
        <div className="flex items-center justify-between">
          <p
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: "rgb(var(--ui-text))" }}
          >
            SYSTEM BOOT
          </p>
          <p
            className="text-xs tabular-nums"
            style={{ color: "rgb(var(--ui-muted))" }}
          >
            {progress}%
          </p>
        </div>

        <p className="mt-4 text-sm" style={{ color: "rgb(var(--ui-text))" }}>
          {stage}
        </p>

        <div
          className="mt-4 h-2 w-full rounded-full overflow-hidden border"
          style={{
            borderColor: "rgb(var(--ui-border-2))",
            backgroundColor: "rgba(9,14,11,0.55)",
          }}
        >
          <div
            className="h-full transition-[width] duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: "rgb(var(--ui-warn))",
              opacity: 0.85,
            }}
          />
        </div>

        <div
          className="mt-5 rounded-xl border p-3"
          style={{
            borderColor: "rgb(var(--ui-border-2))",
            backgroundColor: "rgba(9,14,11,0.55)",
          }}
        >
          <div className="max-h-40 overflow-hidden pr-2 text-xs leading-relaxed font-mono">
            {logs.slice(-10).map((l) => (
              <div key={l.id} className="flex items-start gap-2">
                <span style={{ color: "rgb(var(--ui-muted-2))" }}>›</span>
                <span style={{ color: "rgb(var(--ui-text))" }}>{l.text}</span>
                {l.status && (
                  <span
                    className="ml-auto tabular-nums"
                    style={{
                      color:
                        l.status === "OK"
                          ? "rgb(var(--ui-ok))"
                          : l.status === "WARN"
                            ? "rgb(var(--ui-warn))"
                            : l.status === "FAIL"
                              ? "rgb(var(--ui-danger))"
                              : "rgb(var(--ui-muted))",
                    }}
                  >
                    [{l.status}]
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <p
          className="mt-4 text-[11px]"
          style={{ color: "rgb(var(--ui-muted))" }}
        >
          Press <span style={{ color: "rgb(var(--ui-text))" }}>Enter</span> or{" "}
          <span style={{ color: "rgb(var(--ui-text))" }}>Esc</span> to skip.
          Click anywhere to override.
        </p>
      </div>
    </div>
  );
}
