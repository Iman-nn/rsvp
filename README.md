# Jemputan Perkahwinan Alya & Haris

Laman jemputan dengan halaman berasingan menggunakan Next.js App Router, TypeScript, Tailwind CSS dan Framer Motion. Menu ikon terapung di bawah menyediakan akses kepada Jemputan, Majlis, RSVP, Lokasi dan Lagi. Butang RSVP berwarna emas berada di tengah; Hubungi dan Hadiah mempunyai halaman sendiri melalui menu Lagi. RSVP direkodkan ke Google Sheets melalui Google Apps Script Web App, tanpa Google Sheets API atau service-account key. Semua butiran acara dalam projek ini ialah contoh; tukar sebelum pautan diterbitkan.

Kulit jemputan dibuka sekali dalam setiap sesi halaman. Muzik terus dimainkan semasa navigasi, dan draf borang, status penghantaran serta mesej berjaya kekal ketika bertukar halaman. Keadaan borang disimpan dalam memori sahaja dan dikosongkan apabila halaman dimuat semula. Tetamu juga boleh memuat turun tarikh majlis sebagai fail kalendar `.ics` atau berkongsi pautan jemputan.

## 1. Sediakan Google Sheet

1. Cipta Google Sheet menggunakan akaun Google yang akan memiliki helaian.
2. Tambah tab bernama RSVP.
3. Masukkan tajuk berikut pada baris pertama:

   Timestamp | Full Name | Attendance | Pax | Wishes

Anda tidak perlu mencipta projek Google Cloud, mengaktifkan Google Sheets API atau berkongsi sheet dengan service account.

## 2. Cipta Apps Script Web App

1. Buka script.google.com dan cipta projek baharu.
2. Gantikan kandungan fail Code.gs dengan kod dalam apps-script/Code.gs projek ini, kemudian simpan.
3. Buka Project Settings → Script properties. Tambah tiga sifat:

   SPREADSHEET_ID — ID spreadsheet daripada URL, antara /d/ dan /edit.
   SHEET_NAME — RSVP.
   WEBHOOK_SECRET — rahsia rawak yang panjang. Cipta satu nilai, kemudian gunakan nilai sama dalam .env.local dan Vercel.

4. Pilih Deploy → New deployment → Web app. Tetapkan Execute as kepada Me dan akses awam yang membenarkan tetamu tanpa log masuk (biasanya dipaparkan sebagai Anyone). Benarkan kebenaran yang diminta semasa deploy. URL deployment mesti berakhir dengan /exec.
5. Simpan URL tersebut. Jika anda mengubah kod Apps Script selepas deploy, buat deployment versi baharu supaya perubahan digunakan.

Web App boleh dicapai secara umum, tetapi hanya route pelayan Next.js menghantar rahsia tersebut. Jangan letak rahsia dalam komponen pelayar atau pemboleh ubah NEXT_PUBLIC.

Apps Script mempunyai kuota penggunaan yang ditetapkan Google dan kuota boleh berubah. Had akaun percuma memadai untuk aliran RSVP biasa; lihat halaman rasmi Google untuk [kuota semasa](https://developers.google.com/apps-script/guides/services/quotas) dan [cara deploy Web App](https://developers.google.com/apps-script/guides/web).

## 3. Tetapkan pemboleh ubah persekitaran

Salin .env.example sebagai .env.local, kemudian isikan:

- GOOGLE_APPS_SCRIPT_URL — URL Web App yang berakhir dengan /exec.
- GOOGLE_APPS_SCRIPT_SECRET — nilai yang sama dengan WEBHOOK_SECRET dalam Script properties.

Contoh:

    GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
    GOOGLE_APPS_SCRIPT_SECRET=masukkan-rahsia-rawak-yang-panjang-di-sini

Jangan commit .env.local. Fail .gitignore mengecualikannya.

## 4. Pasang dan jalankan

Gunakan Node.js 20.9 atau lebih baharu. Dari folder projek:

    npm install
    npm run dev

Buka http://localhost:3000. Borang menghantar data ke route Next.js; route itu mengesahkan input dan menghantar RSVP ke Apps Script. Jika URL atau rahsia belum dikonfigurasi, borang memaparkan ralat dan boleh dicuba semula.

## 5. Ganti butiran jemputan dan aset

Ubah lib/wedding.ts untuk nama pasangan, tarikh dan zon waktu, atur cara, lokasi, wakil keluarga, nombor telefon, butiran akaun dan URL gambar. Pastikan date.iso menggunakan tarikh ISO 8601 bersama ofset Malaysia +08:00.

URL gambar Unsplash dan ilustrasi QR tempatan di public/images/qr-placeholder.svg digunakan sebagai aset sementara. Ilustrasi QR itu tidak boleh digunakan untuk pembayaran; gantikan dengan kod QR DuitNow sebenar. Imej lokasi menggunakan gambar kulit sebagai gantian jika foto utama tidak tersedia. Untuk imej sendiri, letakkannya dalam public/images/ dan ubah images.cover, images.hero, images.details, images.location atau gift.qrImage kepada laluan seperti /images/kulit.jpg. Ubah juga venue.city dan venue.country untuk label lokasi. Semak semua nombor telefon, lokasi, akaun dan QR sebelum menghebahkan jemputan.

## 6. Tambah muzik MP3

Letakkan fail muzik yang anda berhak gunakan di public/audio/wedding-song.mp3. Laluan itu ditetapkan dalam musicSrc di lib/wedding.ts. Muzik mula dimainkan selepas tetamu menekan Buka Jemputan.

## 7. Deploy ke Vercel

Import repositori ke Vercel sebagai projek Next.js. Tambah GOOGLE_APPS_SCRIPT_URL dan GOOGLE_APPS_SCRIPT_SECRET dalam Project Settings → Environment Variables untuk Production (serta Preview jika diperlukan). Kekalkan rahsia sebagai nilai server-side tanpa awalan NEXT_PUBLIC, kemudian redeploy.

## Struktur utama

- app/page.tsx — halaman utama; /majlis, /rsvp, /lokasi, /lagi, /hubungi dan /hadiah mempunyai route masing-masing.
- app/api/calendar/route.ts — muat turun jemputan kalendar berdasarkan konfigurasi majlis.
- app/api/rsvp/route.ts — validasi pelayan dan panggilan ke Apps Script.
- apps-script/Code.gs — pemeriksaan rahsia, validasi dan append ke Google Sheet.
- components/WelcomeCover.tsx — kulit jemputan dan animasi pembukaan.
- components/Countdown.tsx — kiraan detik.
- components/ContactButtons.tsx — pautan WhatsApp dan telefon.
- components/AudioPlayer.tsx — kawalan muzik terapung.
- components/RsvpForm.tsx — validasi, loading dan mesej berjaya.
- components/WeddingInvitation.tsx — shell bersama, kulit jemputan, animasi halaman dan muzik merentas navigasi.
- components/BottomNavigation.tsx — navigasi ikon di bawah dengan RSVP utama di tengah.
- components/InvitationViews.tsx — paparan berasingan untuk semua halaman jemputan.
- components/RsvpProvider.tsx — draf dan status RSVP sepanjang navigasi dalam sesi.
- components/ShareInvitationButton.tsx — perkongsian melalui telefon atau salinan pautan.
- lib/wedding.ts — butiran contoh yang perlu disesuaikan.
