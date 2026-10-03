"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { wedding } from "@/lib/wedding";
import styles from "./ShareInvitationButton.module.css";

type ShareInvitationButtonProps = {
  className?: string;
};

export function ShareInvitationButton({ className }: ShareInvitationButtonProps) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  async function shareInvitation() {
    setBusy(true);
    setMessage("");
    setCopied(false);

    const url = new URL("/", window.location.origin).href;
    const title = `Jemputan ${wedding.couple.bride} & ${wedding.couple.groom}`;
    const text = `Dengan penuh kasih, kami menjemput anda meraikan majlis perkahwinan kami pada ${wedding.date.label}.`;

    try {
      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
          setMessage("Terima kasih kerana berkongsi jemputan kami.");
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
        }
      }

      if (!navigator.clipboard?.writeText) {
        setMessage("Pautan belum dapat disalin. Sila salin alamat jemputan melalui bar alamat pelayar.");
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      setMessage("Pautan jemputan telah disalin. Anda boleh kongsikannya kepada keluarga dan sahabat.");
    } catch {
      setMessage("Pautan belum dapat disalin. Sila cuba lagi atau salin alamat melalui bar alamat pelayar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
      <button type="button" className={styles.button} onClick={shareInvitation} disabled={busy}>
        {copied ? <Check size={18} aria-hidden="true" /> : <Share2 size={18} aria-hidden="true" />}
        <span>{busy ? "Sebentar ya…" : copied ? "Pautan disalin" : "Kongsi jemputan"}</span>
      </button>
      <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">
        {message}
      </p>
    </div>
  );
}
