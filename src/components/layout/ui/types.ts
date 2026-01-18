export type MediaKind = "game" | "track" | "module";

export type MediaStatus = "normal" | "pinned";

export type MediaItem = {
  id: string;
  kind: MediaKind;
  title: string;
  subtitle?: string;
  description?: string;
  href?: string;
  status?: MediaStatus;
};
