"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";

export type Attendance = "Hadir" | "Tidak Hadir";

type RsvpDraft = {
  fullName: string;
  attendance: Attendance | "";
  guestCount: string;
  wishes: string;
};

type FieldErrors = Partial<Record<keyof RsvpDraft, string>>;

type RsvpReceipt = {
  fullName: string;
  attendance: Attendance;
  pax: number;
};

type RsvpContextValue = {
  draft: RsvpDraft;
  fieldErrors: FieldErrors;
  errorMessage: string;
  isSubmitting: boolean;
  receipt: RsvpReceipt | null;
  updateDraft: <Field extends keyof RsvpDraft>(field: Field, value: RsvpDraft[Field]) => void;
  submit: (website: string) => Promise<void>;
};

const initialDraft: RsvpDraft = {
  fullName: "",
  attendance: "",
  guestCount: "1",
  wishes: "",
};

const failureMessage = "Maaf, jawapan anda belum dapat direkodkan. Sila cuba lagi sebentar.";
const RsvpContext = createContext<RsvpContextValue | null>(null);

export function RsvpProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<RsvpDraft>(initialDraft);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<RsvpReceipt | null>(null);
  const draftRef = useRef<RsvpDraft>(initialDraft);
  const submissionRef = useRef(false);
  const completedRef = useRef(false);

  function updateDraft<Field extends keyof RsvpDraft>(field: Field, value: RsvpDraft[Field]) {
    if (submissionRef.current || completedRef.current) return;

    const updatedDraft = { ...draftRef.current, [field]: value };
    draftRef.current = updatedDraft;
    setDraft(updatedDraft);
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }));
    setErrorMessage("");
  }

  async function submit(website: string) {
    // This guard remains mounted while the guest moves between invitation pages.
    if (submissionRef.current || completedRef.current) return;

    const values = draftRef.current;
    const fullName = values.fullName.trim();
    const wishes = values.wishes.trim();
    const validationErrors: FieldErrors = {};

    if (fullName.length < 2 || fullName.length > 120) {
      validationErrors.fullName = "Masukkan nama penuh antara 2 hingga 120 aksara.";
    }
    if (values.attendance !== "Hadir" && values.attendance !== "Tidak Hadir") {
      validationErrors.attendance = "Sila pilih sama ada anda dapat hadir.";
    }
    const pax = values.attendance === "Hadir" ? Number(values.guestCount) : 0;
    if (values.attendance === "Hadir" && (!Number.isInteger(pax) || pax < 1 || pax > 5)) {
      validationErrors.guestCount = "Pilih bilangan tetamu antara 1 hingga 5 orang.";
    }
    if (wishes.length > 500) {
      validationErrors.wishes = "Ucapan mestilah tidak melebihi 500 aksara.";
    }

    setFieldErrors(validationErrors);
    setErrorMessage("");
    if (Object.keys(validationErrors).length > 0) return;

    submissionRef.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          attendance: values.attendance,
          pax,
          wishes,
          website: website.trim(),
        }),
      });
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          result && typeof result === "object" && "message" in result && typeof result.message === "string"
            ? result.message
            : failureMessage;
        setErrorMessage(message);
        return;
      }

      completedRef.current = true;
      setReceipt({ fullName, attendance: values.attendance as Attendance, pax });
    } catch {
      setErrorMessage("Sambungan terganggu. Sila semak internet anda dan cuba lagi.");
    } finally {
      submissionRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <RsvpContext.Provider value={{ draft, fieldErrors, errorMessage, isSubmitting, receipt, updateDraft, submit }}>
      {children}
    </RsvpContext.Provider>
  );
}

export function useRsvp() {
  const context = useContext(RsvpContext);
  if (!context) throw new Error("RsvpForm must be rendered inside RsvpProvider.");
  return context;
}
