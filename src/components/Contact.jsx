import { useRef, useState } from 'react';
import { Layer } from './Layer.jsx';
import { SITE } from '../data.js';

export default function Contact() {
  const [label, setLabel] = useState('Copy Email Address');
  const mailRef = useRef(null);

  const flash = (text, ms) => {
    setLabel(text);
    setTimeout(() => setLabel('Copy Email Address'), ms);
  };
  const fallback = () => {
    const r = document.createRange();
    r.selectNodeContents(mailRef.current);
    const s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
    flash('Press Ctrl/Cmd+C', 2200);
  };
  const copy = () => {
    try {
      navigator.clipboard.writeText(SITE.email).then(() => flash('Copied ✓', 1600), fallback);
    } catch {
      fallback();
    }
  };

  return (
    <section id="contact" className="pad">
      <Layer className="slabel mono">{'// 04.00 SEC_CONNECT INDEX [04/04]'}</Layer>
      <Layer className="eyebrow mono" style={{ display: 'inline-block' }}>Direct connect</Layer>
      <Layer as="h2" type>Let's Architect Something Extraordinary.</Layer>
      <Layer as="p" type className="sub">
        Available for production ML systems, self-hosted infrastructure design and technical consulting worldwide.
      </Layer>
      <Layer className="mailrow">
        <b ref={mailRef}>{SITE.email}</b>
        <button className="cta" type="button" onClick={copy}>{label}</button>
      </Layer>
      <Layer className="links">
        {SITE.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
        ))}
      </Layer>
    </section>
  );
}
