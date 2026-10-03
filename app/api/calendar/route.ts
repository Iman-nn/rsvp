import { createHash } from "node:crypto";
import { wedding } from "@/lib/wedding";

export const runtime = "nodejs";

function calendarTimestamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeCalendarText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

// RFC 5545 limits each physical line to 75 UTF-8 octets. Fold between
// complete code points, with one continuation space counted on each new line.
function foldCalendarLine(value: string) {
  const encoder = new TextEncoder();
  const lines: string[] = [];
  let current = "";
  let length = 0;

  for (const character of value) {
    const bytes = encoder.encode(character).length;
    if (length + bytes > 75) {
      lines.push(current);
      current = " ";
      length = 1;
    }
    current += character;
    length += bytes;
  }
  lines.push(current);
  return lines.join("\r\n");
}

export async function GET() {
  const start = calendarTimestamp(new Date(wedding.date.iso));
  const uid = createHash("sha256")
    .update(JSON.stringify([wedding.couple.bride, wedding.couple.groom, wedding.date.iso]))
    .digest("hex");
  const title = `Majlis Perkahwinan ${wedding.couple.bride} & ${wedding.couple.groom}`;
  const location = `${wedding.venue.name}, ${wedding.venue.address}`;
  const schedule = wedding.schedule.map((event) => `${event.time}: ${event.title}`).join("\n");
  const description = `Dengan penuh kasih, kami menjemput anda meraikan majlis perkahwinan kami.\n${wedding.date.label}\n\nAtur cara:\n${schedule}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding RSVP//Jemputan Perkahwinan//MS",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}@wedding-rsvp.local`,
    `DTSTAMP:${calendarTimestamp(new Date())}`,
    `DTSTART:${start}`,
    `SUMMARY:${escapeCalendarText(title)}`,
    `LOCATION:${escapeCalendarText(location)}`,
    `DESCRIPTION:${escapeCalendarText(description)}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return new Response(`${lines.map(foldCalendarLine).join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="jemputan-perkahwinan.ics"',
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
