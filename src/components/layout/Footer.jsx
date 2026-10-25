import { Link } from 'react-router-dom';
import { ADMIN_WHATSAPP_URL } from '../../config.js';

const SOCIAL_LINKS = [
  { href: 'https://instagram.com', short: 'IG', name: 'Instagram' },
  { href: 'https://tiktok.com', short: 'TT', name: 'TikTok' },
  { href: ADMIN_WHATSAPP_URL, short: 'WA', name: 'WhatsApp' },
];

export function Footer() {
  return (
    <footer className="foot">
      <div><div className="logo">FloraGift</div><p>Little flowers, meaningful moments.</p></div>
      <div><h4 aria-level="2">Quick Links</h4><Link to="/">Home</Link><Link to="/toko">Shop</Link><Link to="/find">Find Your Bloom</Link><Link to="/about">About</Link></div>
      <div><h4 aria-level="2">Customer Care</h4><Link to="/kontak">Contact</Link><Link to="/lacak">Track Order</Link><Link to="/riwayat">Order History</Link></div>
      <div>
        <h4 aria-level="2">Follow Us</h4>
        <div className="social">
          {SOCIAL_LINKS.map(({ href, short, name }) => (
            <a key={name} href={href}><span aria-hidden="true">{short}</span><span className="sr-only">{name}</span></a>
          ))}
        </div>
      </div>
      <p className="copy">© 2026 FloraGift. All rights reserved.</p>
    </footer>
  );
}
