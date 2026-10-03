"use client";

import { Music2, Play, Volume2, VolumeX } from "lucide-react";

type AudioPlayerProps = {
  isPlaying: boolean;
  isMuted: boolean;
  canPlay: boolean;
  onToggle: () => void;
};

export function AudioPlayer({ isPlaying, isMuted, canPlay, onToggle }: AudioPlayerProps) {
  return (
    <button
      type="button"
      className={"audio-toggle" + (isPlaying && !isMuted ? " audio-toggle-playing" : "")}
      onClick={onToggle}
      aria-label={
        !canPlay
          ? "Mainkan muzik latar"
          : isPlaying
            ? isMuted ? "Bunyikan muzik" : "Senyapkan muzik"
            : "Mainkan muzik latar"
      }
      aria-pressed={isPlaying && !isMuted}
      title={
        !canPlay
          ? "Muzik tidak tersedia buat masa ini"
          : isPlaying
            ? isMuted ? "Bunyikan muzik" : "Senyapkan muzik"
            : "Mainkan muzik latar"
      }
    >
      {isPlaying ? isMuted ? <VolumeX size={18} /> : <Volume2 size={18} /> : canPlay ? <Play size={17} fill="currentColor" /> : <Music2 size={18} />}
      <span className="sr-only">
        {!canPlay ? "Muzik belum tersedia" : isPlaying ? isMuted ? "Muzik sedang disenyapkan" : "Muzik sedang dimainkan" : "Muzik dijeda"}
      </span>
    </button>
  );
}
