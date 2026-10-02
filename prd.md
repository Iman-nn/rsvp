# Product Requirements Document (PRD)

**Project Name:** Digital Wedding RSVP & Invitation Web Application
**Platform:** Web (Mobile-First)
**Environment:** Next.js (Frontend & API) deployed on Vercel
**Database:** Google Sheets API

## 1. Executive Summary

Projek ini bertujuan untuk membina sebuah aplikasi web jemputan perkahwinan satu halaman (*single-page application*) yang elegan, interaktif, dan responsif. Aplikasi ini berfungsi sebagai kad jemputan digital yang menggantikan kad fizikal, membolehkan tetamu melihat butiran majlis, lokasi, menghubungi wakil keluarga, serta menghantar pengesahan kehadiran (RSVP) secara terus ke dalam sistem hamparan pangkalan data (Google Sheets).

## 2. Target Audience

* **Tetamu Jemputan:** Pengguna dari pelbagai peringkat umur yang akan mengakses laman web ini terutamanya melalui telefon pintar (*smartphone*).
* **Tuan Rumah (Pengantin/Keluarga):** Pengguna yang akan memantau data kehadiran RSVP melalui Google Sheets tanpa memerlukan pengetahuan teknikal.

## 3. Tech Stack & Infrastructure

| Komponen | Teknologi Pilihan |
| --- | --- |
| **Frontend Framework** | Next.js (App Router, TypeScript) |
| **Styling** | Tailwind CSS |
| **Animation / Transitions** | Framer Motion |
| **Database** | Google Sheets API (`google-spreadsheet` / `googleapis`) |
| **Icons** | Lucide React / React Icons |
| **Hosting & CI/CD** | Vercel (Hobby Plan - Free Tier) |

## 4. Core Features & Functional Requirements

### 4.1. Welcome Cover (Digital Envelope)

* **Deskripsi:** Halaman pendaratan (*landing page*) yang menutupi skrin utama apabila pautan dibuka.
* **Keperluan UI:** Memaparkan latar belakang estetik, kaligrafi "Bismillah" / Salam, nama pengantin, dan butang "Buka Jemputan".
* **Tingkah Laku (Behavior):**
* Butang perlu mempunyai efek animasi ringan (*pulsing*).
* Apabila diklik, skrin akan pudar (*fade-out*) atau menggelongsor ke atas (*slide-up*) menggunakan Framer Motion.
* Klik ini bertindak sebagai pencetus (*trigger*) untuk memainkan muzik latar secara automatik (melepasi sekatan *autoplay* pelayar web).



### 4.2. Audio Player (Background Music)

* **Deskripsi:** Muzik latar yang dimainkan sepanjang sesi lawatan.
* **Tingkah Laku:** Dimulakan secara automatik selepas *Cover* dibuka. Terdapat butang bulat terapung (*floating button*) di penjuru bawah kanan skrin untuk membenarkan pengguna menyenyapkan (*mute*) atau memainkan semula (*unmute*) muzik.

### 4.3. Hero Section & Countdown Timer

* **Deskripsi:** Paparan utama selepas jemputan dibuka.
* **Keperluan UI:** Nama penuh pengantin, tarikh majlis, dan jam undur (*countdown timer*).
* **Logik Jam Undur:** Mengira baki masa secara automatik (Hari, Jam, Minit, Saat) sehingga tarikh dan masa majlis bermula.

### 4.4. Event Details & Location

* **Deskripsi:** Maklumat tentatif majlis dan panduan arah.
* **Keperluan UI:**
* Jadual atur cara (contoh: Ketibaan Tetamu, Jamuan Makan, Bersanding).
* Nama dewan/lokasi beserta alamat penuh.
* **Integrasi Peta:** Dua butang pautan luar (*external links*) yang besar dan jelas untuk membuka lokasi terus ke aplikasi **Google Maps** dan **Waze**.



### 4.5. Contact & Enquiries

* **Deskripsi:** Nombor perhubungan wakil keluarga jika tetamu perlukan bantuan.
* **Keperluan UI:** Memaparkan sekurang-kurangnya dua wakil (Cth: Pihak Lelaki & Pihak Perempuan).
* **Tingkah Laku:** Setiap nama wakil mempunyai dua butang interaktif:
* **WhatsApp:** Menggunakan pautan `wa.me/<nombor>`.
* **Call:** Menggunakan skema URI `tel:<nombor>`.



### 4.6. RSVP Form System

* **Deskripsi:** Borang interaktif untuk tetamu mengesahkan kehadiran.
* **Medan Data (*Fields*):**
1. *Full Name* (Teks, Wajib)
2. *Attendance Status* (Radio Button: Hadir / Tidak Hadir, Wajib)
3. *Number of Guests* (Dropdown 1-5, Wajib jika 'Hadir')
4. *Wishes / Ucapan* (Text Area, Pilihan)


* **Tingkah Laku:**
* Validasi borang (*client-side validation*) sebelum dihantar.
* Menunjukkan status *Loading* semasa data dihantar.
* Memaparkan mesej berjaya (*Success State*) selepas data direkodkan, dan menyembunyikan borang untuk mengelakkan hantaran berganda (*double submission*).



### 4.7. Virtual Gifting (Money Gift)

* **Deskripsi:** Ruangan untuk sumbangan hadiah berbentuk wang tunai secara digital.
* **Keperluan UI:** Paparan kod QR (DuitNow/Bank tempatan) berserta nombor akaun bank yang boleh disalin (*copy-to-clipboard*).

## 5. Database Schema (Google Sheets)

Aplikasi ini akan menghantar data ke helaian Google Sheets. Helaian tersebut mesti mengandungi tajuk lajur (*column headers*) di baris pertama (Row 1) seperti berikut:

| Column A | Column B | Column C | Column D | Column E |
| --- | --- | --- | --- | --- |
| **Timestamp** | **Full Name** | **Attendance** | **Pax** | **Wishes** |
| *(Auto-generated)* | Ali bin Abu | Hadir | 2 | Selamat Pengantin Baru! |

## 6. Non-Functional Requirements

* **Mobile-First Design:** Susun atur mesti dioptimumkan untuk saiz skrin mudah alih memandangkan 90%+ tetamu akan membuka pautan melalui telefon.
* **Performance:** Laman web mesti dimuatkan dengan pantas. Penggunaan *lazy loading* untuk gambar resolusi tinggi adalah digalakkan.
* **Security:** Kunci API Google Sheets dan e-mel *Service Account* mesti disimpan dengan selamat di dalam *Environment Variables* di Vercel, dan tidak boleh didedahkan di dalam kod bahagian *frontend*.
* **Bot Protection:** (Pilihan untuk masa hadapan) Boleh diintegrasikan dengan sistem penapis spam sekiranya terdapat aktiviti luar biasa.