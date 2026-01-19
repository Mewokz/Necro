import { HeaderBar } from "./chrome/HeaderBar";
import { Panel } from "./ui/Panel";
import { StatPill } from "./ui/StatPill";
import { MediaGrid } from "./ui/MediaGrid";
import type { MediaItem } from "./ui/types";
import { UnstableDimmingWord } from "./ui/UnstableDimmingWord";

const GAMES: MediaItem[] = [
  {
    id: "doom",
    kind: "game",
    title: "Pink Valley",
    subtitle: "DOOM II Mod",
    description: "Hate.",
    coverSrc: "/media/games/valley.png",
    status: "pinned",
    href: "https://www.moddb.com/mods/the-pink-valley/downloads/the-pink-valley-11-english-version",
    tags: ["fps", "hate"],
  },
  {
    id: "game-2",
    kind: "game",
    title: "Peripeteia",
    subtitle: "Immersive sim",
    coverSrc: "/media/games/peripeteia.jpg",
    status: "normal",
  },
];

const TRACKS: MediaItem[] = [
  {
    id: "track1",
    kind: "track",
    title: "Awaken",
    subtitle: "Dethklok",
    description: "Metalocalypse",
    coverSrc: "/media/tracks/awaken.png",
    audioSrc: "/media/audio/dethklok_awaken.mp3",
    status: "pinned",
    href: "https://www.youtube.com/watch?v=H2ManC9QcNs&list=RDH2ManC9QcNs&start_radio=1",
    tags: ["Metal"],
  },
  {
    id: "track-2",
    kind: "track",
    title: "Die, Die My Darling",
    subtitle: "Metallica",
    description: "Misfits cover",
    coverSrc: "/media/tracks/die.png",
    status: "normal",
    tags: ["Metal"],
  },
];

export function MainLayout() {
  return (
    <div
      className="min-h-screen text-[rgb(var(--ui-text))]"
      style={{
        backgroundColor: "rgb(var(--ui-bg))",
        fontFamily:
          '"IBM Plex Mono Local", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      }}
    >
      {/* overlays */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-50"
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

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <HeaderBar />

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-5">
            <Panel title="IDENTITY" subtitle="Personal record / brief">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-medium tracking-tight">
                    Profile Summary
                  </h2>
                  <StatPill tone="ok">STATUS: ONLINE</StatPill>
                  <StatPill tone="neutral">CLEARANCE: A1</StatPill>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-[rgb(var(--ui-muted))]">
                  Silly <UnstableDimmingWord>unstable</UnstableDimmingWord>{" "}
                  artist
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <StatPill tone="neutral">ROLE: Student</StatPill>
                  <StatPill tone="neutral">FOCUS: arts</StatPill>
                  <StatPill tone="warn">MODE: BUILDING</StatPill>
                </div>
              </div>
            </Panel>

            <div className="mt-6">
              <Panel title="OPS NOTES" subtitle="Bio / parameters">
                <p className="text-sm leading-relaxed text-[rgb(var(--ui-muted))] flex justify-center">
                  [Data erased]
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <StatRow k="Location" v="USA / Nevada" />
                  <StatRow k="Stack" v="React, TS, Tailwind" />
                  <StatRow k="Interests" v="UI, Engineering" />
                  <StatRow k="Tone" v="Military UI" />
                </div>
              </Panel>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-7">
            <div className="grid gap-6">
              <Panel title="GAMES" subtitle="Pinned / recent">
                <MediaGrid
                  title="Games"
                  libraryLabel="OPEN GAMES"
                  previewCount={4}
                  items={GAMES}
                />
              </Panel>

              <Panel title="MUSIC" subtitle="Pinned / recent">
                <MediaGrid
                  title="Tracks"
                  libraryLabel="OPEN MUSIC"
                  previewCount={4}
                  items={TRACKS}
                />
              </Panel>

              <Panel title="SKILLS" subtitle="Capabilities snapshot">
                <div className="flex flex-wrap gap-2">
                  <StatPill tone="ok">UI Layout</StatPill>
                  <StatPill tone="ok">TypeScript</StatPill>
                  <StatPill tone="neutral">Linux</StatPill>
                  <StatPill tone="neutral">Arduino / ESP32</StatPill>
                  <StatPill tone="warn">Security (learning)</StatPill>
                </div>
              </Panel>
            </div>
          </div>
        </div>

        <FooterLine />
      </div>
    </div>
  );
}

function StatRow({ k, v }: { k: string; v: string }) {
  return (
    <div
      className="rounded-xl border px-3 py-2"
      style={{
        borderColor: "rgb(var(--ui-border-2))",
        backgroundColor: "rgba(9,14,11,0.55)",
      }}
    >
      <p className="text-[11px] tracking-[0.22em] uppercase text-[rgb(var(--ui-muted-2))]">
        {k}
      </p>
      <p className="mt-1 text-sm text-[rgb(var(--ui-text))] truncate">{v}</p>
    </div>
  );
}

function FooterLine() {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-xs text-[rgb(var(--ui-muted-2))]">
      <p className="tracking-[0.22em] uppercase">NECRO // INFO SYSTEM</p>
      <p className="opacity-80">
        UI: dead • motion: precise • clarity: maximum
      </p>
    </div>
  );
}
