"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  Flower2,
  Heart,
  MapPin,
  Navigation,
  Sparkles,
} from "lucide-react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ContactButtons } from "@/components/ContactButtons";
import { Countdown } from "@/components/Countdown";
import { RsvpForm } from "@/components/RsvpForm";
import { WelcomeCover } from "@/components/WelcomeCover";
import { mapsLinks, wedding } from "@/lib/wedding";

export function WeddingInvitation() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [canPlay, setCanPlay] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function openInvitation() {
    const audio = audioRef.current;
    if (audio) {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setCanPlay(true);
        })
        .catch(() => {
          setIsPlaying(false);
          setCanPlay(false);
        });
    }
    setIsOpen(true);
  }

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
        setIsMuted(audio.muted);
        setCanPlay(true);
      } catch {
        setIsPlaying(false);
        setCanPlay(false);
      }
    } else {
      audio.muted = !audio.muted;
      setIsMuted(audio.muted);
    }
  }

  async function copyAccountNumber() {
    try {
      await navigator.clipboard.writeText(wedding.gift.accountNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="invitation-shell min-h-screen bg-cream">
      <main aria-hidden={!isOpen} inert={!isOpen}>
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
          animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : 18 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.8, delay: isOpen && !reduceMotion ? 0.12 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className="site-nav">
            <a className="nav-mark" href="#home" aria-label="Ke bahagian utama">
              <span>{wedding.couple.bride.slice(0, 1)} <i>&amp;</i> {wedding.couple.groom.slice(0, 1)}</span>
              <small>{wedding.date.short}</small>
            </a>
            <nav aria-label="Navigasi jemputan">
              <a href="#tentatif">Atur cara</a>
              <a href="#lokasi">Lokasi</a>
              <a href="#hubungi">Hubungi</a>
              <a href="#rsvp">RSVP</a>
              <a href="#hadiah">Hadiah</a>
            </nav>
            <a className="nav-date" href="#rsvp"><CalendarDays size={14} /> {wedding.date.short}</a>
          </header>

          <section
            className="hero-section"
            id="home"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(20,31,24,.24) 0%, rgba(20,31,24,.5) 55%, rgba(20,31,24,.79) 100%), url(" +
                wedding.images.hero +
                ")",
            }}
          >
            <div className="hero-decoration hero-decoration-left" aria-hidden="true"><Flower2 /></div>
            <div className="hero-decoration hero-decoration-right" aria-hidden="true"><Flower2 /></div>
            <div className="hero-content">
              <span className="hero-kicker"><span /> UNDANGAN PERKAHWINAN <span /></span>
              <p className="hero-greeting">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <p className="hero-invite-line">Dengan penuh kesyukuran,</p>
              <h1>
                {wedding.couple.bride}
                <em>&amp;</em>
                {wedding.couple.groom}
              </h1>
              <p className="hero-subtitle">menjemput anda meraikan hari bahagia kami</p>
              <div className="hero-rule" aria-hidden="true"><span /></div>
              <div className="hero-date"><CalendarDays size={17} strokeWidth={1.5} /> {wedding.date.label}</div>
              <Countdown targetDate={wedding.date.iso} />
              <a className="hero-scroll-link" href="#jemputan">
                LIHAT JEMPUTAN <ArrowDown size={14} />
              </a>
            </div>
            <span className="hero-vertical-label">A DAY TO REMEMBER · {wedding.date.short}</span>
          </section>

          <section className="welcome-note-section section-padding" id="jemputan">
            <div className="welcome-note-inner">
              <span className="ornament"><Flower2 size={22} strokeWidth={1.2} /></span>
              <p className="eyebrow">ASSALAMUALAIKUM WARAHMATULLAHI WABARAKATUH</p>
              <h2>Dengan izin-Nya,<br />dua hati menjadi satu.</h2>
              <p className="welcome-note-copy">
                Dengan segala hormat dan penuh rasa syukur, kami sekeluarga menjemput Dato&apos;,
                Datin, Tuan, Puan serta keluarga untuk hadir memeriahkan majlis perkahwinan
                putera dan puteri kami.
              </p>
              <div className="signature-names">{wedding.couple.bride} <span>&amp;</span> {wedding.couple.groom}</div>
            </div>
          </section>

          <section className="event-section section-padding" id="tentatif">
            <div className="section-kicker"><span>01</span><span className="kicker-line" /> HARI YANG DINANTI</div>
            <div className="event-heading-row">
              <div>
                <p className="eyebrow">CATATKAN TARIKH INI</p>
                <h2>Atur cara<br /><em>majlis.</em></h2>
              </div>
              <p className="event-heading-note">Semoga kehadiran anda menyerikan lagi hari istimewa kami.</p>
            </div>
            <div className="event-content-grid">
              <div className="event-photo-wrap">
                <div
                  className="event-photo"
                  role="img"
                  aria-label="Hiasan meja perkahwinan yang elegan"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, rgba(22,32,25,0) 52%, rgba(22,32,25,.43) 100%), url(" +
                      wedding.images.details +
                      ")",
                  }}
                />
                <div className="event-photo-caption"><Sparkles size={15} /> Penuh kesyukuran, kami meraikan</div>
              </div>
              <div className="schedule-list">
                {wedding.schedule.map((item, index) => (
                  <article className="schedule-item" key={item.title}>
                    <div className="schedule-marker"><span>0{index + 1}</span><i /></div>
                    <div>
                      <span className="schedule-time"><Clock3 size={13} /> {item.time}</span>
                      <h3>{item.title}</h3>
                      <p>{item.note}</p>
                    </div>
                  </article>
                ))}
                <div className="schedule-date-note"><CalendarDays size={16} /> {wedding.date.label}</div>
              </div>
            </div>
          </section>

          <section className="location-section section-padding" id="lokasi">
            <div className="location-card">
              <div className="location-copy">
                <div className="section-kicker"><span>02</span><span className="kicker-line" /> BERTEMU DI SANA</div>
                <p className="eyebrow">LOKASI MAJLIS</p>
                <h2>Jemput datang,<br /><em>kami menanti.</em></h2>
                <div className="venue-name"><MapPin size={19} strokeWidth={1.5} /><span>{wedding.venue.name}</span></div>
                <p className="venue-address">{wedding.venue.address}</p>
                <div className="map-actions">
                  <a className="map-button map-primary" href={mapsLinks.google} target="_blank" rel="noreferrer">
                    <MapPin size={16} /> Google Maps <ArrowUpRight size={14} />
                  </a>
                  <a className="map-button map-secondary" href={mapsLinks.waze} target="_blank" rel="noreferrer">
                    <Navigation size={16} /> Buka Waze <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
              <div
                className="location-art"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    "linear-gradient(0deg, rgba(48,64,53,.88), rgba(48,64,53,.76)), url(" +
                    wedding.images.location +
                    ")",
                }}
              >
                <div className="location-art-ring ring-one" />
                <div className="location-art-ring ring-two" />
                <MapPin size={46} strokeWidth={1.1} />
                <span>PUTRAJAYA</span>
                <small>MALAYSIA · 03°N 101°E</small>
              </div>
            </div>
          </section>

          <section className="contact-section section-padding" id="hubungi">
            <div className="section-kicker"><span>03</span><span className="kicker-line" /> KAMI SEDIA MEMBANTU</div>
            <div className="section-heading-centered">
              <p className="eyebrow">SEBARANG PERTANYAAN</p>
              <h2>Ada yang ingin<br /><em>ditanyakan?</em></h2>
              <p>Hubungi wakil keluarga kami. Kami berbesar hati membantu anda.</p>
            </div>
            <div className="contact-grid">
              {wedding.contacts.map((contact) => <ContactButtons key={contact.role} {...contact} />)}
            </div>
          </section>

          <section className="rsvp-section section-padding" id="rsvp">
            <div className="rsvp-layout">
              <div className="rsvp-intro">
                <div className="section-kicker"><span>04</span><span className="kicker-line" /> SAHKAN KEHADIRAN</div>
                <p className="eyebrow">{wedding.date.rsvpDeadline}</p>
                <h2>Sudi kiranya<br /><em>berkongsi hari ini?</em></h2>
                <p className="rsvp-copy">
                  Mohon maklumkan kehadiran anda supaya kami dapat membuat persiapan
                  yang selesa untuk semua tetamu.
                </p>
                <div className="rsvp-date-reminder"><CalendarDays size={16} /> {wedding.date.label}</div>
                <div className="rsvp-flower" aria-hidden="true"><Flower2 size={86} strokeWidth={0.7} /></div>
              </div>
              <div className="rsvp-card">
                <div className="rsvp-card-heading">
                  <span className="eyebrow">BORANG KEHADIRAN</span>
                  <Heart size={18} strokeWidth={1.3} />
                </div>
                <RsvpForm />
              </div>
            </div>
          </section>

          <section className="gift-section section-padding" id="hadiah">
            <div className="section-kicker"><span>05</span><span className="kicker-line" /> INGATAN KASIH</div>
            <div className="gift-panel">
              <div className="gift-copy">
                <span className="gift-flower"><Flower2 size={26} strokeWidth={1.2} /></span>
                <p className="eyebrow">DOA ANDA HADIAH TERINDAH</p>
                <h2>Raikan kami<br /><em>dengan doa.</em></h2>
                <p>
                  Kehadiran dan doa restu anda sudah cukup bermakna buat kami. Jika anda
                  berhasrat menghulurkan tanda kasih, boleh gunakan maklumat di sebelah.
                </p>
                <div className="bank-details">
                  <span>{wedding.gift.bankName}</span>
                  <strong>{wedding.gift.accountName}</strong>
                  <div className="account-number-row">
                    <b>{wedding.gift.accountNumber}</b>
                    <button type="button" className="copy-account-button" onClick={copyAccountNumber}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "Disalin" : "Salin"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="qr-wrap">
                <div className="qr-frame">
                  <img src={wedding.gift.qrImage} alt="Kod QR DuitNow contoh untuk diganti sebelum penerbitan" loading="lazy" />
                </div>
                <span className="qr-label">IMBAS UNTUK MEMBERI</span>
                <span className="qr-caption">DuitNow QR · Gantikan imej contoh sebelum diterbitkan</span>
              </div>
            </div>
          </section>

          <footer className="site-footer">
            <div className="footer-flower" aria-hidden="true"><Flower2 size={22} strokeWidth={1.2} /></div>
            <p className="footer-arabic" lang="ar" dir="rtl">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا</p>
            <p className="footer-blessing">“Dan antara tanda-tanda kebesaran-Nya, Dia menciptakan pasangan-pasangan untukmu.”</p>
            <p className="footer-reference">Surah Ar-Rum, 30:21</p>
            <div className="footer-names">{wedding.couple.bride} <span>&amp;</span> {wedding.couple.groom}</div>
            <p className="footer-date">{wedding.date.label}</p>
            <span className="footer-copyright">DENGAN KASIH, UNTUK SELAMANYA <Heart size={11} /></span>
          </footer>
        </motion.div>
      </main>

      <AnimatePresence>
        {!isOpen && <WelcomeCover key="welcome-cover" onOpen={openInvitation} />}
      </AnimatePresence>

      <audio
        ref={audioRef}
        src={wedding.musicSrc}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
        onError={() => {
          setCanPlay(false);
          setIsPlaying(false);
        }}
      />
      {isOpen && (
        <AudioPlayer
          isPlaying={isPlaying}
          isMuted={isMuted}
          canPlay={canPlay}
          onToggle={toggleMusic}
        />
      )}
    </div>
  );
}
