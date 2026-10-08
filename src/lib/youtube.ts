/**
 * YouTube IFrame API loader + minimal typing, shared by the hero reel and the
 * screening room. The API script is loaded once per page.
 */
// ---- Minimal YouTube IFrame API typing ----
export type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  setVolume(v: number): void;
  seekTo(s: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  loadVideoById(id: string): void;
  destroy(): void;
};
type YTNamespace = {
  Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer;
};
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;
export function loadYouTubeAPI(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (window.YT) resolve(window.YT);
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  });
  return apiPromise;
}

export const YT_PLAYING = 1;
export const YT_ENDED = 0;
