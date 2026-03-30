import { useEffect, useRef, useCallback } from "react";

function isSoundEnabled(): boolean {
  try {
    const saved = localStorage.getItem("soundEffects");
    return saved ? JSON.parse(saved) : true;
  } catch {
    return true;
  }
}

function getSoundVolume(): number {
  try {
    const saved = localStorage.getItem("soundVolume");
    return saved ? parseInt(saved, 10) / 100 : 0.7;
  } catch {
    return 0.7;
  }
}

export function useSound() {
  const play = useCallback((src: string) => {
    if (!isSoundEnabled()) return;
    const audio = new Audio(src);
    audio.volume = getSoundVolume();
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
    audio.volume = getSoundVolume() * 0.4; // bg music quieter relative to volume
    audioRef.current = audio;
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src]);
}
