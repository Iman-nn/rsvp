export const wedding = {
  couple: {
    bride: "Alya Sofea",
    groom: "Haris Imran",
  },
  date: {
    // ISO 8601 with Malaysia's UTC+08:00 offset. Countdown uses this exact instant.
    iso: "2027-03-14T10:00:00+08:00",
    label: "Ahad, 14 Mac 2027",
    short: "14.03.2027",
    rsvpDeadline: "Sebelum 1 Mac 2027",
  },
  venue: {
    name: "Dewan Seri Melur",
    address: "No. 12, Jalan Melur Indah, Presint 8, 62000 Putrajaya, Malaysia",
    mapQuery: "Dewan Seri Melur, Putrajaya",
  },
  schedule: [
    { time: "10:00 pagi", title: "Ketibaan tetamu", note: "Silakan menikmati juadah yang disediakan." },
    { time: "11:00 pagi", title: "Akad nikah", note: "Detik bermakna penyatuan dua hati." },
    { time: "12:30 tengah hari", title: "Jamuan & persandingan", note: "Raikan bersama keluarga dan sahabat." },
  ],
  contacts: [
    { role: "Wakil pihak lelaki", name: "Encik Ahmad", phone: "60123456789", displayPhone: "+60 12-345 6789" },
    { role: "Wakil pihak perempuan", name: "Puan Salmah", phone: "60198765432", displayPhone: "+60 19-876 5432" },
  ],
  gift: {
    bankName: "Nama Bank",
    accountName: "Alya Sofea & Haris Imran",
    accountNumber: "0000000000",
    qrImage: "https://placehold.co/480x480/faf8f2/68755f?text=DuitNow+QR",
  },
  images: {
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=88",
    hero: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2200&q=88",
    details: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1500&q=85",
    location: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1300&q=85",
  },
  musicSrc: "/audio/wedding-song.mp3",
} as const;

export const mapsLinks = {
  google:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(wedding.venue.mapQuery),
  waze: "https://waze.com/ul?q=" + encodeURIComponent(wedding.venue.mapQuery) + "&navigate=yes",
};
