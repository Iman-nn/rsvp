"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Grid2X2, Heart, MailCheck, MapPin } from "lucide-react";
import styles from "./BottomNavigation.module.css";

const destinations = [
  { href: "/", label: "Jemputan", icon: Heart },
  { href: "/majlis", label: "Majlis", icon: CalendarDays },
  { href: "/rsvp", label: "RSVP", icon: MailCheck },
  { href: "/lokasi", label: "Lokasi", icon: MapPin },
  { href: "/lagi", label: "Lagi", icon: Grid2X2 },
] as const;

function isCurrentPage(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/lagi") {
    return ["/lagi", "/hubungi", "/hadiah"].some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.dock} aria-label="Menu jemputan">
      <ul className={styles.items}>
        {destinations.map(({ href, label, icon: Icon }) => {
          const active = isCurrentPage(pathname, href);
          const isRsvp = href === "/rsvp";

          return (
            <li key={href} className={styles.item}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={[
                  styles.link,
                  isRsvp ? styles.rsvpLink : "",
                  active ? styles.active : "",
                ].filter(Boolean).join(" ")}
              >
                <span className={isRsvp ? styles.rsvpIcon : styles.icon}>
                  <Icon size={isRsvp ? 25 : 21} strokeWidth={1.65} aria-hidden="true" />
                </span>
                <span className={styles.label}>{label}</span>
                {active && !isRsvp && <span className={styles.activeDot} aria-hidden="true" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
