# Jemputan Perkahwinan Alya & Haris

Laman jemputan satu halaman menggunakan Next.js App Router, TypeScript, Tailwind CSS, Framer Motion dan Google Sheets API. Semua maklumat acara dalam projek ini ialah contoh. Tukar butiran dalam lib/wedding.ts sebelum pautan diterbitkan.

## 1. Sediakan Google Sheets

1. Cipta projek di Google Cloud Console dan aktifkan Google Sheets API.
2. Cipta satu service account. Jana dan muat turun kunci JSON untuk akaun itu. Simpan fail tersebut dengan selamat; jangan masukkannya ke dalam Git.
3. Cipta Google Sheet, tambah tab bernama RSVP, dan masukkan tajuk ini ke baris pertama:

   Timestamp | Full Name | Attendance | Pax | Wishes

4. Kongsi helaian dengan alamat e-mel service account sebagai Editor. Salin ID spreadsheet daripada URL — bahagian selepas /d/ dan sebelum /edit.

API menggunakan service account pada bahagian pelayan sahaja. Kelayakan Google tidak dihantar kepada pelayar tetamu.

## 2. Tetapkan pemboleh ubah persekitaran

Salin .env.example sebagai .env.local, kemudian isikan nilai sebenar:

- GOOGLE_SHEETS_SPREADSHEET_ID — ID spreadsheet sahaja.
- GOOGLE_SERVICE_ACCOUNT_EMAIL — nilai client_email dalam fail JSON service account.
- GOOGLE_PRIVATE_KEY — nilai private_key dalam fail JSON. Kekalkan tanda petik dan pemisah baris dalam format backslash-n.
- GOOGLE_SHEETS_SHEET_NAME — nama tab, lazimnya RSVP.

Contoh format .env.local:

    GOOGLE_SHEETS_SPREADSHEET_ID=1abc123yourSheetId
    GOOGLE_SERVICE_ACCOUNT_EMAIL=rsvp-writer@your-project.iam.gserviceaccount.com
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nPASTE_KEY_CONTENT_HERE\n-----END PRIVATE KEY-----\n"
    GOOGLE_SHEETS_SHEET_NAME=RSVP

Jangan commit .env.local atau kunci JSON. Fail .gitignore mengecualikan fail rahsia tersebut.

## 3. Pasang dan jalankan

Gunakan Node.js 20.9 atau lebih baharu. Dari folder projek, jalankan:

    npm install
    npm run dev

Buka http://localhost:3000. Penghantaran RSVP akan menulis baris ke helaian yang dikonfigurasi. Jika kelayakan belum diisi, API memulangkan mesej konfigurasi dan borang kekal boleh dicuba semula.

## 4. Ganti butiran jemputan dan aset contoh

Ubah lib/wedding.ts untuk nama pasangan, tarikh dan zon waktu, jadual, lokasi, wakil keluarga, nombor telefon, butiran akaun dan URL gambar. Pastikan date.iso menggunakan tarikh ISO 8601 bersama ofset Malaysia +08:00; jam kira detik membaca nilai itu.

URL gambar Unsplash dan QR placehold.co digunakan terus sebagai aset sementara. Untuk fail sendiri, letakkan imej dalam public/images/, kemudian ubah nilai images.cover, images.hero, images.details, images.location atau gift.qrImage kepada laluan seperti /images/kulit.jpg dan /images/duitnow-qr.png. Semak nombor dan pautan telefon sebelum menghebahkan jemputan.

## 5. Tambah muzik MP3

Letakkan fail muzik yang anda berhak gunakan di public/audio/wedding-song.mp3. Laluan itu telah ditetapkan dalam musicSrc di lib/wedding.ts. Fail akan mula dimainkan selepas tetamu menekan Buka Jemputan, iaitu tindakan pengguna yang diperlukan kebanyakan pelayar untuk membenarkan audio.

## 6. Deploy ke Vercel

Import repositori ini ke Vercel sebagai projek Next.js. Tambah pemboleh ubah GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY dan GOOGLE_SHEETS_SHEET_NAME dalam tetapan Project Settings → Environment Variables untuk Production (serta Preview jika perlu). Kekalkan kunci sebagai nilai rahsia dan redeploy selepas mengubah environment variables.

Sebelum jemputan dikongsi, gantikan semua data contoh, uji pautan lokasi dan nombor telefon, pastikan akaun penerima sepadan dengan QR, dan masukkan tajuk lajur pada baris pertama helaian.

## Struktur utama

- app/page.tsx — halaman utama.
- app/api/rsvp/route.ts — pengesahan pelayan dan append ke Google Sheets.
- components/WelcomeCover.tsx — kulit jemputan dan animasi pembukaan.
- components/Countdown.tsx — kiraan detik.
- components/ContactButtons.tsx — butang WhatsApp dan telefon.
- components/AudioPlayer.tsx — kawalan muzik terapung.
- components/RsvpForm.tsx — borang, validasi pelayar, keadaan loading dan berjaya.
- components/WeddingInvitation.tsx — susun atur dan interaksi satu halaman.
- lib/wedding.ts — butiran contoh yang perlu disesuaikan.
