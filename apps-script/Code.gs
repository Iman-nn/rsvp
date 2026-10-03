function doPost(e) {
  var data;
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOutput({ ok: false, message: "Permintaan tidak sah." });
    }
    data = JSON.parse(e.postData.contents);
  } catch (error) {
    return jsonOutput({ ok: false, message: "Permintaan tidak sah." });
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return jsonOutput({ ok: false, message: "Permintaan tidak sah." });
  }

  var properties = PropertiesService.getScriptProperties();
  var expectedSecret = properties.getProperty("WEBHOOK_SECRET");
  if (!expectedSecret || typeof data.secret !== "string" || data.secret !== expectedSecret) {
    return jsonOutput({ ok: false, message: "Tidak dibenarkan." });
  }

  var fullName = typeof data.fullName === "string" ? data.fullName.trim() : "";
  var attendance = data.attendance;
  if (data.wishes !== undefined && typeof data.wishes !== "string") {
    return jsonOutput({ ok: false, message: "Ucapan tidak sah." });
  }
  var wishes = typeof data.wishes === "string" ? data.wishes.trim() : "";
  var pax = typeof data.pax === "number" ? data.pax : NaN;

  if (fullName.length < 2 || fullName.length > 120) {
    return jsonOutput({ ok: false, message: "Nama tidak sah." });
  }
  if (attendance !== "Hadir" && attendance !== "Tidak Hadir") {
    return jsonOutput({ ok: false, message: "Status kehadiran tidak sah." });
  }
  if (wishes.length > 500) {
    return jsonOutput({ ok: false, message: "Ucapan terlalu panjang." });
  }
  if (attendance === "Hadir" && (Math.floor(pax) !== pax || pax < 1 || pax > 5)) {
    return jsonOutput({ ok: false, message: "Bilangan tetamu tidak sah." });
  }

  var spreadsheetId = properties.getProperty("SPREADSHEET_ID");
  var sheetName = properties.getProperty("SHEET_NAME") || "RSVP";
  if (!spreadsheetId) {
    return jsonOutput({ ok: false, message: "Spreadsheet belum dikonfigurasi." });
  }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return jsonOutput({ ok: false, message: "Sila cuba lagi." });
  }

  try {
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      return jsonOutput({ ok: false, message: "Tab spreadsheet tidak ditemui." });
    }

    sheet.appendRow([
      new Date().toISOString(),
      safeTextCell(fullName),
      attendance,
      attendance === "Hadir" ? pax : 0,
      safeTextCell(wishes),
    ]);
    return jsonOutput({ ok: true });
  } catch (error) {
    console.error("RSVP append failed.");
    return jsonOutput({ ok: false, message: "Tidak dapat menyimpan RSVP." });
  } finally {
    lock.releaseLock();
  }
}

function safeTextCell(value) {
  var firstCharacter = value.charAt(0);
  return "=-+@".indexOf(firstCharacter) >= 0 ? "'" + value : value;
}

function jsonOutput(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
