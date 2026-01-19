export type MediaKind = "game" | "track" | "module";
export type MediaStatus = "normal" | "pinned";

export type MediaItem = {
  id: string;
  kind: MediaKind;

  title: string;
  subtitle?: string; // “Platform / tag” или “Artist / genre”
  description?: string;

  coverSrc?: string; // путь к картинке из public/, например "/media/games/doom.png"
  href?: string; // ссылка (страница, spotify, youtube, whatever)

  // Для треков: локальный файл для <audio>
  audioSrc?: string; // например "/media/audio/track1.mp3"

  status?: MediaStatus;
  tags?: string[]; // необязательно
};
