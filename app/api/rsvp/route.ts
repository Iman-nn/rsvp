import { google } from "googleapis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RsvpBody = {
  fullName?: unknown;
  attendance?: unknown;
  pax?: unknown;
  wishes?: unknown;
  website?: unknown;
};

function jsonError(message: string, status: number) {
  return Response.json({ message }, { status });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 8_000) {
    return jsonError("Permintaan terlalu besar.", 413);
  }

  let body: RsvpBody;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return jsonError("Permintaan tidak sah.", 400);
    }
    body = parsed as RsvpBody;
  } catch {
    return jsonError("Permintaan tidak sah.", 400);
  }

  // Quietly accept honeypot submissions so basic bots do not learn the field is monitored.
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return Response.json({ message: "RSVP anda telah diterima." }, { status: 202 });
  }

  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const attendance = body.attendance;
  if (body.wishes !== undefined && typeof body.wishes !== "string") {
    return jsonError("Ucapan mestilah dalam format teks.", 400);
  }
  const wishes = typeof body.wishes === "string" ? body.wishes.trim() : "";
  const paxValue = typeof body.pax === "number" ? body.pax : Number.NaN;

  if (fullName.length < 2 || fullName.length > 120) {
    return jsonError("Sila masukkan nama penuh (2 hingga 120 aksara).", 400);
  }
  if (attendance !== "Hadir" && attendance !== "Tidak Hadir") {
    return jsonError("Sila pilih status kehadiran.", 400);
  }
  if (wishes.length > 500) {
    return jsonError("Ucapan mestilah tidak melebihi 500 aksara.", 400);
  }

  let pax = 0;
  if (attendance === "Hadir") {
    if (!Number.isInteger(paxValue) || paxValue < 1 || paxValue > 5) {
      return jsonError("Bilangan tetamu mestilah antara 1 hingga 5 orang.", 400);
    }
    pax = paxValue;
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const configuredPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!spreadsheetId || !serviceAccountEmail || !configuredPrivateKey) {
    return jsonError("Borang RSVP belum dikonfigurasi. Sila hubungi pihak penganjur.", 503);
  }

  const privateKey = configuredPrivateKey.replaceAll("\\n", "\n");
  const sheetName = (process.env.GOOGLE_SHEETS_SHEET_NAME || "RSVP").trim();
  const escapedSheetName = sheetName.replace(/'/g, "''");
  const range = "'" + escapedSheetName + "'!A:E";

  try {
    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        majorDimension: "ROWS",
        values: [[new Date().toISOString(), fullName, attendance, pax, wishes]],
      },
    });

    return Response.json({ message: "RSVP anda telah diterima." }, { status: 201 });
  } catch {
    console.error("Google Sheets RSVP append failed.");
    return jsonError("Maaf, RSVP anda belum dapat direkodkan. Sila cuba lagi sebentar.", 502);
  }
}
