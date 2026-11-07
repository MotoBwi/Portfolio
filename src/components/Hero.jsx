import { Layer, Count, Chips } from './Layer.jsx';
import { HERO } from '../data.js';

const TITLE = 'PORTFOLIO'.split('');

export default function Hero() {
  return (
    <section id="top">
      <h1 className="mega" id="mega" data-layer="" aria-label="Portfolio">
        {TITLE.map((c, i) => (
          <span key={i} aria-hidden="true" style={{ '--i': i }}>{c}</span>
        ))}
      </h1>

      <div className="hero-grid">
        <div>
          <Layer as="span" className="hello">Hello, I'm</Layer>
          <Layer className="name">BAPAN.</Layer>
          <div>
            <Layer className="tag mono"><i></i>{HERO.tag}</Layer>
          </div>
          <Layer as="p" type className="lede">{HERO.lede}</Layer>
          <Layer className="btnrow mono">
            <a className="bl" href="#contact">Initiate dispatch →</a>
            <a className="bd" href="#work">Explore architecture</a>
          </Layer>
          <Layer className="stats">
            {HERO.stats.map((s) => (
              <div key={s.label}>
                <b className={s.red ? '' : 'w'}>
                  <Count n={s.n} />
                  {s.suffix}
                </b>
                <span>{s.label}</span>
              </div>
            ))}
          </Layer>
        </div>

        <div>
          <Layer className="portrait">
            <div className="ph">
              <img src={`${import.meta.env.BASE_URL}me.webp`} alt="Bapan, ML engineer" width="1000" height="1250" decoding="async" />
            </div>
            <div className="badge-on mono"><i></i>Systems online</div>
          </Layer>
        </div>

        <div className="rt-col">
          {HERO.runtime.map((r) => (
            <Layer className="rt" key={r.idx}>
              <div className="top mono"><b>{r.idx}</b><span>{r.label}</span></div>
              <h4>{r.title}</h4>
              <p>{r.text}</p>
              <Chips items={r.chips} />
            </Layer>
          ))}
        </div>
      </div>
    </section>
  );
}
