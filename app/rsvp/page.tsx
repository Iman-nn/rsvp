import type { Metadata } from "next";
import { RsvpView } from "@/components/InvitationViews";

export const metadata: Metadata = { title: "Sahkan Kehadiran" };

export default function RsvpPage() {
  return <RsvpView />;
}
