import type { Metadata } from "next";
import { EventView } from "@/components/InvitationViews";

export const metadata: Metadata = { title: "Atur Cara Majlis" };

export default function EventPage() {
  return <EventView />;
}
