import type { Metadata } from "next";
import { MoreView } from "@/components/InvitationViews";

export const metadata: Metadata = { title: "Lagi Tentang Jemputan" };

export default function MorePage() {
  return <MoreView />;
}
