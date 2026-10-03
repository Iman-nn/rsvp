import type { Metadata } from "next";
import { ContactView } from "@/components/InvitationViews";

export const metadata: Metadata = { title: "Hubungi Keluarga" };

export default function ContactPage() {
  return <ContactView />;
}
