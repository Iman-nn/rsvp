import type { Metadata } from "next";
import { LocationView } from "@/components/InvitationViews";

export const metadata: Metadata = { title: "Lokasi Majlis" };

export default function LocationPage() {
  return <LocationView />;
}
