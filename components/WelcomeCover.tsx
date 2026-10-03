"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MailOpen, Sparkles } from "lucide-react";
import { wedding } from "@/lib/wedding";

type WelcomeCoverProps = {
  onOpen: () => void;
};

export function WelcomeCover({ onOpen }: WelcomeCoverProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="welcome-cover"
      aria-label="Kulit jemputan perkahwinan"
      role="dialog"
      aria-modal="true"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(21,32,25,.3) 0%, rgba(22,32,25,.55) 48%, rgba(19,30,23,.77) 100%), url(" +
          wedding.images.cover +
          ")",
      }}
      initial={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: reduceMotion ? 0 : "-7vh",
        transition: { duration: reduceMotion ? 0.01 : 0.8, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      <div className="cover-grain" aria-hidden="true" />
      <div className="cover-frame">
        <div className="cover-topline">
          <span className="cover-bismillah" lang="ar" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
          <span className="cover-greeting">Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang</span>
        </div>
        <div className="cover-center">
          <span className="cover-overline"><Sparkles size={13} strokeWidth={1.3} /> UNDANGAN WALIMATULURUS</span>
          <p className="cover-intro">Dengan penuh kesyukuran,</p>
          <h1 className="cover-names">
            {wedding.couple.bride}
            <span>&amp;</span>
            {wedding.couple.groom}
          </h1>
          <div className="cover-divider" aria-hidden="true"><span /></div>
          <p className="cover-date">{wedding.date.label}</p>
          <motion.button
            type="button"
            className="open-invitation-button"
            onClick={onOpen}
            animate={reduceMotion ? { scale: 1 } : { scale: [1, 1.025, 1], boxShadow: ["0 9px 28px rgba(17,31,24,.18)", "0 12px 38px rgba(17,31,24,.3)", "0 9px 28px rgba(17,31,24,.18)"] }}
            transition={{ duration: reduceMotion ? 0.01 : 2.8, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Buka Jemputan</span>
            <span className="open-invitation-subtitle">Open invitation</span>
            <MailOpen size={20} strokeWidth={1.5} />
          </motion.button>
        </div>
        <span className="cover-bottom-note">SATU HARI · DUA HATI · SELAMANYA</span>
      </div>
    </motion.section>
  );
}
