"use client";

import { useEffect, useId, useRef, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Heart, LoaderCircle, LockKeyhole, MapPin, Send, Users, X } from "lucide-react";
import { useRsvp } from "./RsvpProvider";
import styles from "./RsvpForm.module.css";

export function RsvpForm() {
  const id = useId();
  const { draft, fieldErrors, errorMessage, isSubmitting, receipt, updateDraft, submit } = useRsvp();
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const fieldId = (field: string) => `${id}-${field}`;

  useEffect(() => {
    if (receipt) successHeadingRef.current?.focus({ preventScroll: true });
  }, [receipt]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await submit(String(formData.get("website") ?? ""));
  }

  if (receipt) {
    const attending = receipt.attendance === "Hadir";
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <span className={styles.successIcon} aria-hidden="true">
          {attending ? <Check size={30} strokeWidth={1.5} /> : <Heart size={30} strokeWidth={1.5} />}
        </span>
        <p className={styles.eyebrow}>JAWAPAN TELAH DITERIMA</p>
        <h3 ref={successHeadingRef} tabIndex={-1}>{attending ? "Jumpa di hari bahagia!" : "Terima kasih atas ingatan anda"}</h3>
        <p>
          {attending
            ? `Terima kasih, ${receipt.fullName}. Kami menantikan kehadiran anda untuk meraikan detik istimewa ini bersama.`
            : `Terima kasih, ${receipt.fullName}. Kami memahami anda tidak dapat hadir. Doa dan ingatan anda tetap bermakna buat kami.`}
        </p>
        <div className={styles.receipt}>
          <span>{attending ? <Users size={18} aria-hidden="true" /> : <Heart size={18} aria-hidden="true" />}</span>
          <strong>{attending ? `${receipt.pax} orang` : "Tidak dapat hadir"}</strong>
          <small>{attending ? "Termasuk diri anda" : "Jawapan anda telah direkodkan"}</small>
        </div>
        <Link className={styles.successLink} href={attending ? "/lokasi" : "/majlis"}>
          {attending ? <MapPin size={16} aria-hidden="true" /> : <Heart size={16} aria-hidden="true" />}
          {attending ? "Lihat lokasi majlis" : "Lihat butiran majlis"}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <span className={styles.signoff}>Dengan kasih, bakal mempelai</span>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-busy={isSubmitting}>
      <p className={styles.requiredHint}><span aria-hidden="true">*</span> Ruangan wajib diisi</p>

      <div className={styles.field}>
        <label htmlFor={fieldId("fullName")}>Nama penuh <span aria-hidden="true">*</span></label>
        <input
          className={styles.textInput}
          id={fieldId("fullName")}
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Nama anda"
          value={draft.fullName}
          onChange={(event) => updateDraft("fullName", event.target.value)}
          minLength={2}
          maxLength={120}
          required
          disabled={isSubmitting}
          aria-invalid={fieldErrors.fullName ? true : undefined}
          aria-describedby={fieldErrors.fullName ? fieldId("fullName-error") : undefined}
        />
        {fieldErrors.fullName && <p id={fieldId("fullName-error")} className={styles.fieldError} role="alert">{fieldErrors.fullName}</p>}
      </div>

      <fieldset className={styles.field} disabled={isSubmitting} aria-describedby={fieldErrors.attendance ? fieldId("attendance-error") : undefined}>
        <legend>Dapatkah anda hadir? <span aria-hidden="true">*</span></legend>
        <div className={styles.attendanceOptions}>
          {[
            { value: "Hadir" as const, title: "Ya, saya hadir", detail: "Raikan bersama", icon: Heart },
            { value: "Tidak Hadir" as const, title: "Tidak dapat hadir", detail: "Titipkan doa dari jauh", icon: X },
          ].map(({ value, title, detail, icon: Icon }) => (
            <label className={`${styles.attendanceTile} ${draft.attendance === value ? styles.selectedTile : ""}`} key={value}>
              <input
                type="radio"
                name="attendance"
                value={value}
                checked={draft.attendance === value}
                onChange={() => updateDraft("attendance", value)}
                required
                aria-invalid={fieldErrors.attendance ? true : undefined}
              />
              <span className={styles.attendanceIcon} aria-hidden="true"><Icon size={21} strokeWidth={1.5} /></span>
              <span className={styles.attendanceText}><strong>{title}</strong><small>{detail}</small></span>
              <span className={styles.tileCheck} aria-hidden="true">{draft.attendance === value && <Check size={11} strokeWidth={2.4} />}</span>
            </label>
          ))}
        </div>
        {fieldErrors.attendance && <p id={fieldId("attendance-error")} className={styles.fieldError} role="alert">{fieldErrors.attendance}</p>}
      </fieldset>

      {draft.attendance === "Hadir" && (
        <fieldset className={styles.field} disabled={isSubmitting} aria-describedby={`${fieldId("guest-hint")}${fieldErrors.guestCount ? ` ${fieldId("guestCount-error")}` : ""}`}>
          <legend>Bilangan tetamu <span aria-hidden="true">*</span></legend>
          <div className={styles.guestOptions}>
            {[1, 2, 3, 4, 5].map((count) => (
              <label className={`${styles.guestOption} ${draft.guestCount === String(count) ? styles.selectedGuest : ""}`} key={count}>
                <input
                  type="radio"
                  name="guestCount"
                  value={count}
                  checked={draft.guestCount === String(count)}
                  onChange={() => updateDraft("guestCount", String(count))}
                  required
                  aria-invalid={fieldErrors.guestCount ? true : undefined}
                />
                <strong>{count}</strong><span>orang</span>
              </label>
            ))}
          </div>
          <p className={styles.hint} id={fieldId("guest-hint")}><Users size={13} aria-hidden="true" /> Termasuk diri anda.</p>
          {fieldErrors.guestCount && <p id={fieldId("guestCount-error")} className={styles.fieldError} role="alert">{fieldErrors.guestCount}</p>}
        </fieldset>
      )}

      <div className={styles.field}>
        <label htmlFor={fieldId("wishes")}>Ucapan buat pasangan <span className={styles.optional}>(pilihan)</span></label>
        <textarea
          className={styles.textInput}
          id={fieldId("wishes")}
          name="wishes"
          rows={3}
          maxLength={500}
          placeholder="Semoga berbahagia hingga ke syurga…"
          value={draft.wishes}
          onChange={(event) => updateDraft("wishes", event.target.value)}
          disabled={isSubmitting}
          aria-invalid={fieldErrors.wishes ? true : undefined}
          aria-describedby={`${fieldId("wishes-hint")}${fieldErrors.wishes ? ` ${fieldId("wishes-error")}` : ""}`}
        />
        <p className={styles.characterCount} id={fieldId("wishes-hint")}>{draft.wishes.length} / 500 aksara</p>
        {fieldErrors.wishes && <p id={fieldId("wishes-error")} className={styles.fieldError} role="alert">{fieldErrors.wishes}</p>}
      </div>

      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={fieldId("website")}>Biarkan ruangan ini kosong</label>
        <input id={fieldId("website")} name="website" type="text" tabIndex={-1} autoComplete="off" disabled={isSubmitting} />
      </div>

      {errorMessage && <p className={styles.errorMessage} role="alert" aria-live="assertive">{errorMessage}</p>}

      <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className={styles.spinner} size={18} aria-hidden="true" /> : <Send size={17} strokeWidth={1.7} aria-hidden="true" />}
        {isSubmitting ? "Sedang menghantar…" : "Hantar jawapan RSVP"}
      </button>
      <p className={styles.footnote}><LockKeyhole size={12} aria-hidden="true" /> Maklumat anda hanya digunakan untuk urusan majlis.</p>
    </form>
  );
}
