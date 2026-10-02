"use client";

import { useState, type FormEvent } from "react";
import { Check, LoaderCircle, Send } from "lucide-react";

type Attendance = "Hadir" | "Tidak Hadir";

export function RsvpForm() {
  const [attendance, setAttendance] = useState<Attendance>("Hadir");
  const [guestCount, setGuestCount] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const wishes = String(formData.get("wishes") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          attendance,
          pax: attendance === "Hadir" ? Number(guestCount) : 0,
          wishes,
          website,
        }),
      });
      const result: { message?: string } = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Maaf, RSVP anda belum dapat dihantar. Sila cuba lagi sebentar.");
      }
      setSubmitted(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Maaf, RSVP anda belum dapat dihantar. Sila cuba lagi sebentar.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rsvp-success" role="status" aria-live="polite">
        <span className="success-icon"><Check size={25} strokeWidth={1.6} /></span>
        <p className="eyebrow">TERIMA KASIH</p>
        <h3>Jawapan anda telah diterima</h3>
        <p>Terima kasih kerana meluangkan masa. Kehadiran dan doa anda amat bermakna buat kami.</p>
        <span className="success-signoff">Salam kasih, bakal mempelai</span>
      </div>
    );
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="fullName">Nama penuh <span aria-hidden="true">*</span></label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Nama seperti pada kad jemputan"
          minLength={2}
          maxLength={120}
          required
        />
      </div>

      <fieldset className="form-field">
        <legend>Kehadiran anda <span aria-hidden="true">*</span></legend>
        <div className="attendance-options">
          <label className={"attendance-option" + (attendance === "Hadir" ? " selected" : "")}>
            <input
              type="radio"
              name="attendance"
              value="Hadir"
              checked={attendance === "Hadir"}
              onChange={() => setAttendance("Hadir")}
              required
            />
            <span className="custom-radio" aria-hidden="true" />
            <span><strong>Joyfully Accept</strong><small>Dengan sukacitanya hadir</small></span>
          </label>
          <label className={"attendance-option" + (attendance === "Tidak Hadir" ? " selected" : "")}>
            <input
              type="radio"
              name="attendance"
              value="Tidak Hadir"
              checked={attendance === "Tidak Hadir"}
              onChange={() => setAttendance("Tidak Hadir")}
              required
            />
            <span className="custom-radio" aria-hidden="true" />
            <span><strong>Regretfully Decline</strong><small>Dukacita tidak dapat hadir</small></span>
          </label>
        </div>
      </fieldset>

      {attendance === "Hadir" && (
        <div className="form-field guest-count-field">
          <label htmlFor="guestCount">Bilangan tetamu <span aria-hidden="true">*</span></label>
          <select
            id="guestCount"
            name="guestCount"
            value={guestCount}
            onChange={(event) => setGuestCount(event.target.value)}
            required
          >
            {[1, 2, 3, 4, 5].map((count) => (
              <option value={count} key={count}>{count} orang</option>
            ))}
          </select>
          <span className="field-hint">Termasuk diri anda.</span>
        </div>
      )}

      <div className="form-field">
        <label htmlFor="wishes">Ucapan buat pasangan <span className="optional-label">(pilihan)</span></label>
        <textarea
          id="wishes"
          name="wishes"
          rows={4}
          maxLength={500}
          placeholder="Titipkan doa dan ucapan anda di sini…"
        />
      </div>

      <div className="honeypot-field" aria-hidden="true">
        <label htmlFor="website">Biarkan ruangan ini kosong</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}

      <button className="submit-rsvp-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="loading-icon" size={17} /> : <Send size={16} strokeWidth={1.7} />}
        {isSubmitting ? "Sedang menghantar…" : "Hantar pengesahan"}
      </button>
      <p className="form-footnote">Maklumat anda hanya digunakan untuk urusan majlis.</p>
    </form>
  );
}
