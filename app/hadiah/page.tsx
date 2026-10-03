import type { Metadata } from "next";
import { GiftView } from "@/components/InvitationViews";

export const metadata: Metadata = { title: "Hadiah & Tanda Kasih" };

export default function GiftPage() {
  return <GiftView />;
}
