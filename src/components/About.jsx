import { Layer } from './Layer.jsx';
import { ABOUT } from '../data.js';

export default function About() {
  return (
    <section id="about" className="pad">
      <Layer className="slabel mono">{'// 01.00 SEC_ABOUT INDEX [01/04]'}</Layer>
      <Layer className="eyebrow mono">Engineer profile</Layer>
      <Layer as="h2">Background &amp; Philosophy</Layer>

      <div className="about">
        <div className="panel">
          {ABOUT.paragraphs.map((p) => (
            <Layer as="p" type key={p.slice(0, 24)}>{p}</Layer>
          ))}
          <Layer as="p" className="quote">{ABOUT.quote}</Layer>
        </div>
        <div className="feats">
          {ABOUT.feats.map((f) => (
            <Layer className="feat" key={f.idx}>
              <span className="mono">{f.idx}</span>
              <h4>{f.title}</h4>
              <p>{f.text}</p>
            </Layer>
          ))}
        </div>
      </div>

      <div className="tl">
        {ABOUT.timeline.map((t) => (
          <Layer key={t.when}>
            <span className="mono">{t.when}</span>
            <b>{t.title}</b>
            <span>{t.org}</span>
          </Layer>
        ))}
      </div>
    </section>
  );
}
