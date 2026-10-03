import { MessageCircle, Phone, UserRound } from "lucide-react";

type ContactButtonsProps = {
  role: string;
  name: string;
  phone: string;
  displayPhone: string;
};

export function ContactButtons({ role, name, phone, displayPhone }: ContactButtonsProps) {
  return (
    <article className="contact-card">
      <div className="contact-card-heading">
        <span className="contact-avatar" aria-hidden="true"><UserRound size={22} strokeWidth={1.4} /></span>
        <span className="contact-role">{role}</span>
        <h3>{name}</h3>
        <p>{displayPhone}</p>
      </div>
      <div className="contact-actions">
        <a
          className="contact-action whatsapp-action"
          href={"https://wa.me/" + phone}
          target="_blank"
          rel="noreferrer"
          aria-label={"WhatsApp " + name}
        >
          <MessageCircle size={17} strokeWidth={1.8} />
          WhatsApp
        </a>
        <a className="contact-action call-action" href={"tel:+" + phone} aria-label={"Telefon " + name}>
          <Phone size={16} strokeWidth={1.8} />
          Telefon
        </a>
      </div>
    </article>
  );
}
