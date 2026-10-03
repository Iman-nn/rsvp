"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Heart } from "lucide-react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { WelcomeCover } from "@/components/WelcomeCover";
import { wedding } from "@/lib/wedding";

const pageLabels: Record<string, string> = {
  "/": "Sebuah kisah cinta",
  "/majlis": "Hari yang dinanti",
  "/rsvp": "Kami menanti anda",
  "/lokasi": "Bertemu di sana",
  "/lagi": "Ingatan & kasih",
  "/hubungi": "Wakil keluarga",
  "/hadiah": "Tanda kasih",
};

export function WeddingInvitation({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const mainRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [canPlay, setCanPlay] = useState(true);

  useEffect(() => {
    if (isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (isOpen) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      mainRef.current?.focus({ preventScroll: true });
    }
  }, [pathname, isOpen]);

  function openInvitation() {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setCanPlay(true);
        })
        .catch(() => {
          setIsPlaying(false);
          setCanPlay(false);
        });
    }
    setIsOpen(true);
  }

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.muted = false;
      try {
        await audio.play();
        setCanPlay(true);
      } catch {
        setIsPlaying(false);
        setCanPlay(false);
      }
    } else {
      audio.muted = !audio.muted;
    }
    setIsMuted(audio.muted);
  }

  return (
    <div className="invitation-shell">
      <div className="invitation-content" aria-hidden={!isOpen} inert={!isOpen}>
        <a className="skip-link" href="#invitation-content">Langkau ke kandungan</a>
        <header className="invitation-header">
          <Link className="invitation-brand" href="/" aria-label="Jemputan utama">
            <span className="brand-monogram">
              {wedding.couple.bride.slice(0, 1)}<i>&amp;</i>{wedding.couple.groom.slice(0, 1)}
            </span>
            <span className="brand-caption">THE WEDDING</span>
          </Link>
          <span className="header-page-note">{pageLabels[pathname] ?? "Jemputan perkahwinan"}</span>
          <a className="header-date" href="/api/calendar" aria-label="Simpan tarikh majlis dalam kalendar">
            <CalendarDays size={15} strokeWidth={1.6} />
            <span>{wedding.date.short}</span>
          </a>
        </header>

        <main id="invitation-content" className="invitation-main" ref={mainRef} tabIndex={-1}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
          <footer className="page-signoff">
            <span />
            <p>{wedding.couple.bride.split(" ")[0]} <Heart size={10} /> {wedding.couple.groom.split(" ")[0]}</p>
            <span />
          </footer>
        </main>

        {isOpen && <BottomNavigation />}
      </div>

      <AnimatePresence onExitComplete={() => mainRef.current?.focus({ preventScroll: true })}>
        {!isOpen && <WelcomeCover key="welcome-cover" onOpen={openInvitation} />}
      </AnimatePresence>

      <audio
        ref={audioRef}
        src={wedding.musicSrc}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
        onError={() => {
          setCanPlay(false);
          setIsPlaying(false);
        }}
      />
      {isOpen && (
        <AudioPlayer isPlaying={isPlaying} isMuted={isMuted} canPlay={canPlay} onToggle={toggleMusic} />
      )}
    </div>
  );
}
