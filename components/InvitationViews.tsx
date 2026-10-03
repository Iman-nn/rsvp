"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  Flower2,
  Gift,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Sparkles,
} from "lucide-react";
import { ContactButtons } from "@/components/ContactButtons";
import { Countdown } from "@/components/Countdown";
import { RsvpForm } from "@/components/RsvpForm";
import { ShareInvitationButton } from "@/components/ShareInvitationButton";
import { mapsLinks, wedding } from "@/lib/wedding";
import styles from "./InvitationViews.module.css";

function PageHeading({ eyebrow, title, description, children }: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className={styles.pageHeading}>
      <span className={styles.eyebrow}><span />{eyebrow}</span>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {children}
    </header>
  );
}

function BackToMore() {
  return <Link href="/lagi" className={styles.backLink}><ArrowLeft size={15} /> Kembali ke pilihan</Link>;
}

export function HomeView() {
  return (
    <section className={`${styles.page} ${styles.home}`} aria-labelledby="home-title">
      <div className={styles.homeIntro}>
        <span className={styles.eyebrow}><span />UNDANGAN PERKAHWINAN</span>
        <span className={styles.homeEdition}>{wedding.date.short} <Heart size={13} /></span>
      </div>
      <div className={styles.homeHero}>
        <div className={styles.homeNames}>
          <p className={styles.bismillah} lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <p className={styles.homePrelude}>Dengan izin-Nya,</p>
          <h1 id="home-title">{wedding.couple.bride}<em>&amp;</em>{wedding.couple.groom}</h1>
          <p className={styles.homeTagline}>Dua hati. Satu perjalanan.</p>
          <div className={styles.homeDate}><CalendarDays size={16} strokeWidth={1.5} />{wedding.date.label}</div>
        </div>
        <div className={styles.heroPhotoComposition}>
          <span className={styles.photoHalo} aria-hidden="true" />
          <div className={styles.heroPhoto} style={{ backgroundImage: `url("${wedding.images.hero}")` }} role="img" aria-label="Suasana majlis perkahwinan yang romantik" />
          <div className={styles.photoSeal} aria-hidden="true"><Flower2 size={23} strokeWidth={1.1} /><span>{wedding.couple.bride.slice(0, 1)} &amp; {wedding.couple.groom.slice(0, 1)}</span></div>
          <span className={styles.photoCaption}>THE BEGINNING OF ALWAYS</span>
        </div>
      </div>
      <div className={styles.homeBottom}>
        <div className={styles.homeWelcome}>
          <p className={styles.welcomeSalam}>Assalamualaikum &amp; salam sejahtera.</p>
          <p>Dengan penuh kesyukuran, kami menjemput anda dan keluarga meraikan hari bahagia kami.</p>
          <div className={styles.homeActions}>
            <Link href="/rsvp" className={styles.primaryButton}><Heart size={16} /> Sahkan kehadiran <ArrowUpRight size={16} /></Link>
            <Link href="/majlis" className={styles.textLink}>Lihat atur cara <ArrowRight size={15} /></Link>
          </div>
        </div>
        <div className={styles.countdownPanel}>
          <span className={styles.eyebrow}>MENUJU HARI BAHAGIA</span>
          <Countdown targetDate={wedding.date.iso} />
          <span className={styles.countdownNote}><span /> Tak sabar untuk bertemu anda.</span>
        </div>
      </div>
    </section>
  );
}

export function EventView() {
  const eventDate = new Date(wedding.date.iso);
  const day = new Intl.DateTimeFormat("ms-MY", { day: "2-digit", timeZone: "Asia/Kuala_Lumpur" }).format(eventDate);
  const monthYear = new Intl.DateTimeFormat("ms-MY", { month: "long", year: "numeric", timeZone: "Asia/Kuala_Lumpur" }).format(eventDate);

  return (
    <section className={styles.page}>
      <PageHeading eyebrow="ATUR CARA MAJLIS" title={<>Hari yang<em> dinanti.</em></>} description="Raikan detik bermakna bersama kami." />
      <div className={styles.eventGrid}>
        <div className={styles.eventAside}>
          <div className={styles.dateCard}>
            <span className={styles.eyebrow}>CATATKAN TARIKH</span>
            <strong>{day}</strong>
            <span className={styles.dateMonth}>{monthYear}</span>
            <span className={styles.dateDay}>{wedding.date.label.split(",")[0]}</span>
            <div className={styles.dateCardRule}><Flower2 size={20} strokeWidth={1.2} /></div>
            <span className={styles.dateVenue}>{wedding.venue.name}</span>
            <a href="/api/calendar" className={styles.calendarButton} aria-label="Simpan tarikh majlis dalam kalendar"><CalendarDays size={16} /> Simpan tarikh</a>
          </div>
          <div className={styles.eventPhoto} style={{ backgroundImage: `url("${wedding.images.details}")` }} role="img" aria-label="Hiasan meja majlis perkahwinan" />
        </div>
        <div className={styles.timelineCard}>
          <div className={styles.cardTopline}><span className={styles.eyebrow}>ATUR CARA MAJLIS</span><Clock3 size={18} strokeWidth={1.4} /></div>
          <ol className={styles.timeline}>
            {wedding.schedule.map((item, index) => (
              <li key={item.title}>
                <span className={styles.timelineDot} aria-hidden="true">0{index + 1}</span>
                <div><span className={styles.timelineTime}>{item.time}</span><h2>{item.title}</h2><p>{item.note}</p></div>
              </li>
            ))}
          </ol>
          <div className={styles.eventFootnote}><Sparkles size={16} strokeWidth={1.4} /><p>Datang dengan senyuman, pulang dengan kenangan.</p></div>
        </div>
      </div>
    </section>
  );
}

export function RsvpView() {
  return (
    <section className={`${styles.page} ${styles.rsvpPage}`}>
      <div className={styles.rsvpLayout}>
        <div className={styles.rsvpIntro}>
          <PageHeading eyebrow="SUDI KIRANYA BERSAMA KAMI" title={<>Satu tempat <br /><em>buat anda.</em></>} description="Maklumkan kehadiran anda untuk persiapan majlis." />
          <div className={styles.rsvpDetail}><CalendarDays size={19} strokeWidth={1.4} /><div><strong>{wedding.date.label}</strong><span>{wedding.venue.name}</span></div></div>
          <span className={styles.deadline}><span /> Mohon jawapan {wedding.date.rsvpDeadline.toLowerCase()}.</span>
          <div className={styles.rsvpArt} aria-hidden="true"><span /><Flower2 size={92} strokeWidth={0.75} /><span /></div>
          <p className={styles.rsvpSignoff}>Kehadiran anda,<br /><em>pelengkap kegembiraan kami.</em></p>
        </div>
        <div className={styles.formCard}>
          <div className={styles.cardTopline}><span className={styles.eyebrow}>PENGESAHAN KEHADIRAN</span><Heart size={20} strokeWidth={1.3} /></div>
          <RsvpForm />
        </div>
      </div>
    </section>
  );
}

export function LocationView() {
  return (
    <section className={styles.page}>
      <PageHeading eyebrow="DESTINASI HARI BAHAGIA" title={<>Di sini,<em> kita bertemu.</em></>} description="Ikuti panduan arah untuk hadir meraikan hari istimewa kami." />
      <div className={styles.locationGrid}>
        <div className={styles.locationVisual} aria-hidden="true">
          <div className={styles.locationPhoto} style={{ backgroundImage: `linear-gradient(180deg, rgba(29,50,35,.08), rgba(29,50,35,.62)), url("${wedding.images.location}"), url("${wedding.images.cover}")` }} />
          <div className={styles.locationPhotoLabel}><span>MERAIKAN DUA HATI</span><strong>{wedding.venue.city}</strong><span>{wedding.venue.country}</span></div>
          <div className={styles.locationPin}><MapPin size={30} strokeWidth={1.3} /></div>
          <span className={styles.locationArc} />
        </div>
        <div className={styles.venueCard}>
          <div className={styles.venueIcon}><MapPin size={24} strokeWidth={1.5} /></div>
          <span className={styles.eyebrow}>LOKASI MAJLIS</span>
          <h2>{wedding.venue.name}</h2>
          <p className={styles.address}>{wedding.venue.address}</p>
          <div className={styles.venueDate}><CalendarDays size={16} strokeWidth={1.4} /><span>{wedding.date.label}</span></div>
          <div className={styles.mapActions}>
            <a href={mapsLinks.google} className={styles.primaryButton} target="_blank" rel="noopener noreferrer"><MapPin size={18} /> Google Maps <ArrowUpRight size={17} /></a>
            <a href={mapsLinks.waze} className={styles.secondaryButton} target="_blank" rel="noopener noreferrer"><Navigation size={18} /> Buka Waze <ArrowUpRight size={17} /></a>
          </div>
          <Link href="/hubungi" className={styles.venueHelp}>Perlukan bantuan mencari lokasi? <ArrowRight size={15} /></Link>
        </div>
      </div>
    </section>
  );
}

export function MoreView() {
  return (
    <section className={`${styles.page} ${styles.morePage}`}>
      <PageHeading eyebrow="SEDIKIT LAGI, DENGAN KASIH" title={<>Melengkapkan<em> jemputan.</em></>} description="Hubungi keluarga kami, titipkan tanda kasih atau kongsikan jemputan ini." />
      <div className={styles.moreCards}>
        <Link href="/hubungi" className={styles.moreCard}>
          <span className={styles.moreCardIcon}><MessageCircle size={26} strokeWidth={1.3} /></span>
          <span className={styles.moreCardContent}><span className={styles.eyebrow}>KAMI SEDIA MEMBANTU</span><strong>Hubungi keluarga</strong><span>Wakil pihak lelaki &amp; perempuan</span></span>
          <ArrowUpRight className={styles.moreArrow} size={21} strokeWidth={1.3} />
        </Link>
        <Link href="/hadiah" className={`${styles.moreCard} ${styles.giftMenuCard}`}>
          <span className={styles.moreCardIcon}><Gift size={26} strokeWidth={1.3} /></span>
          <span className={styles.moreCardContent}><span className={styles.eyebrow}>TANDA INGATAN</span><strong>Hadiah &amp; tanda kasih</strong><span>Doa anda hadiah terindah kami</span></span>
          <ArrowUpRight className={styles.moreArrow} size={21} strokeWidth={1.3} />
        </Link>
      </div>
      <div className={styles.blessingCard}>
        <Flower2 size={28} strokeWidth={1.1} aria-hidden="true" />
        <blockquote>“Dan antara tanda-tanda kebesaran-Nya, Dia menciptakan pasangan-pasangan untukmu.”</blockquote>
        <span>SURAH AR-RUM · 30:21</span>
        <div className={styles.shareAction}><ShareInvitationButton /></div>
      </div>
    </section>
  );
}

export function ContactView() {
  return (
    <section className={`${styles.page} ${styles.contactPage}`}>
      <BackToMore />
      <PageHeading eyebrow="SEBARANG PERTANYAAN" title={<>Kami sedia<em> membantu.</em></>} description="Hubungi wakil keluarga untuk pertanyaan tentang majlis dan kehadiran anda." />
      <div className={styles.contactCards}>{wedding.contacts.map((contact) => <ContactButtons key={contact.role} {...contact} />)}</div>
      <p className={styles.contactFootnote}><Heart size={15} strokeWidth={1.5} /> Dengan sukacitanya, kami menantikan kehadiran anda.</p>
    </section>
  );
}

export function GiftView() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(wedding.gift.accountNumber);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopyStatus("idle"), 3500);
  }

  return (
    <section className={`${styles.page} ${styles.giftPage}`}>
      <BackToMore />
      <PageHeading eyebrow="DOA ANDA HADIAH TERINDAH" title={<>Sekecil ingatan,<em> sebesar makna.</em></>} description="Kehadiran dan doa restu anda sudah cukup bermakna. Jika berhasrat menghulurkan tanda kasih, kami menerimanya dengan penuh syukur." />
      <div className={styles.giftGrid}>
        <div className={styles.giftMessage}>
          <span className={styles.giftFlower}><Gift size={27} strokeWidth={1.15} /></span>
          <p className={styles.eyebrow}>TANDA KASIH BUAT MEMPELAI</p>
          <h2>Terima kasih atas<br /><em>ingatan tulus anda.</em></h2>
          <div className={styles.bankCard}>
            <span className={styles.bankName}>{wedding.gift.bankName}</span>
            <strong>{wedding.gift.accountName}</strong>
            <div className={styles.accountRow}><span>{wedding.gift.accountNumber}</span><button type="button" onClick={copyAccount} aria-label="Salin nombor akaun">{copyStatus === "copied" ? <Check size={16} /> : <Copy size={16} />}{copyStatus === "copied" ? "Disalin" : "Salin"}</button></div>
            <span className={styles.copyStatus} role="status" aria-live="polite">{copyStatus === "copied" ? "Nombor akaun berjaya disalin." : copyStatus === "error" ? "Sila salin nombor akaun yang dipaparkan." : " "}</span>
          </div>
        </div>
        <div className={styles.qrCard}>
          <span className={styles.eyebrow}>IMBAS UNTUK MEMBERI</span>
          <div className={styles.qrFrame}><img src={wedding.gift.qrImage} alt="Kod QR DuitNow untuk tanda kasih" width={260} height={260} loading="lazy" onError={(event) => {
            const image = event.currentTarget;
            if (image.dataset.fallback === "true") return;
            image.dataset.fallback = "true";
            image.src = "/images/qr-placeholder.svg";
          }} /></div>
          <span className={styles.qrName}>DuitNow QR</span>
          <p>Dengan kasih, {wedding.couple.bride.split(" ")[0]} &amp; {wedding.couple.groom.split(" ")[0]} <Heart size={12} /></p>
        </div>
      </div>
    </section>
  );
}
