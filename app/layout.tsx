import type { Metadata, Viewport } from "next";
import { wedding } from "@/lib/wedding";
import { WeddingInvitation } from "@/components/WeddingInvitation";
import { RsvpProvider } from "@/components/RsvpProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: wedding.couple.bride + " & " + wedding.couple.groom + " | Jemputan Walimatulurus",
  description:
    "Dengan penuh kesyukuran, kami menjemput anda meraikan hari bahagia " +
    wedding.couple.bride +
    " dan " +
    wedding.couple.groom +
    ".",
  applicationName: "Jemputan " + wedding.couple.bride + " & " + wedding.couple.groom,
  openGraph: {
    title: wedding.couple.bride + " & " + wedding.couple.groom + " | Jemputan Walimatulurus",
    description: "Raikan hari bahagia bersama kami.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f6ef",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ms">
      <body>
        <RsvpProvider>
          <WeddingInvitation>{children}</WeddingInvitation>
        </RsvpProvider>
      </body>
    </html>
  );
}
