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

  const endpointSetting = process.env.GOOGLE_APPS_SCRIPT_URL?.trim();
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!endpointSetting || !sharedSecret) {
    return jsonError("Borang RSVP belum dikonfigurasi. Sila hubungi pihak penganjur.", 503);
  }

  let endpoint: URL;
  try {
    endpoint = new URL(endpointSetting);
  } catch {
    return jsonError("Konfigurasi RSVP tidak sah.", 503);
  }

  if (
    endpoint.protocol !== "https:" ||
    endpoint.hostname !== "script.google.com" ||
    !endpoint.pathname.startsWith("/macros/s/") ||
    !endpoint.pathname.endsWith("/exec")
  ) {
    return jsonError("Konfigurasi RSVP tidak sah.", 503);
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: sharedSecret,
        fullName,
        attendance,
        pax,
        wishes,
      }),
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });

    const responseText = await response.text();
    let result: { ok?: boolean };
    try {
      result = JSON.parse(responseText) as { ok?: boolean };
    } catch {
      return jsonError("Maaf, RSVP anda belum dapat direkodkan. Sila cuba lagi sebentar.", 502);
    }

    if (!response.ok || result.ok !== true) {
      return jsonError("Maaf, RSVP anda belum dapat direkodkan. Sila cuba lagi sebentar.", 502);
    }

    return Response.json({ message: "RSVP anda telah diterima." }, { status: 201 });
  } catch {
    console.error("Google Apps Script RSVP request failed.");
    return jsonError("Maaf, RSVP anda belum dapat direkodkan. Sila cuba lagi sebentar.", 502);
  }
}
