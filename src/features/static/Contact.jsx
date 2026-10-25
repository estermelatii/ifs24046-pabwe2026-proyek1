import { ADMIN_WHATSAPP_URL } from '../../config.js';
export const Contact = () => (
  <section className="wrap narrow">
    <span className="eyebrow">Contact</span>
    <h1 className="page-title">Hubungi Kami</h1>
    <p className="muted">Ada pertanyaan soal pesanan atau ingin buket custom? Kami siap membantu.</p>
    <div className="contact-cards">
      <a className="cc" href={ADMIN_WHATSAPP_URL} target="_blank" rel="noreferrer"><small>WhatsApp</small><b>0821-6018-3466</b><span>Chat sekarang →</span></a>
      <a className="cc" href="mailto:manurungester477@gmail.com"><small>Email</small><b>manurungester477@gmail.com</b><span>Kirim email →</span></a>
    </div>
  </section>
);
