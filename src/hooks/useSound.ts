import { useEffect, useRef, useCallback } from "react";

function isSoundEnabled(): boolean {
  try {
    const saved = localStorage.getItem("soundEffects");
    return saved ? JSON.parse(saved) : true;
  } catch {
    return true;
  }
}

export function useSound() {
  const play = useCallback((src: string) => {
    if (!isSoundEnabled()) return;
    const audio = new Audio(src);
    audio.play().catch(() => {});
  }, []);

  return { play };
}

export function useBackgroundMusic(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isSoundEnabled()) return;

    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src]);
}
