import { useState } from 'react';
import { Layer, Count, Chips } from './Layer.jsx';
import { FEATURE, STACK, CARDS } from '../data.js';

function StackExplorer() {
  const [cur, setCur] = useState(0);
  const s = STACK[cur];
  return (
    <>
      <h5>7-Layer Infrastructure Stack</h5>
      <small>Click a layer to inspect the implementation</small>
      <div className="tabs" role="group" aria-label="Infrastructure layers">
        {STACK.map((t, i) => (
          <button key={t.tab} type="button" className="tab" aria-pressed={i === cur} onClick={() => setCur(i)}>
            {t.tab}
          </button>
        ))}
      </div>
      <div className="detail" key={cur} aria-live="polite">
        <span className="mono">Layer 0{cur + 1} // {s.kind}</span>
        <h4>{s.title}</h4>
        <p>{s.text}</p>
        <Chips items={s.chips} />
      </div>
    </>
  );
}

export default function Flagships() {
  return (
    <section id="work" className="pad">
      <Layer className="slabel mono">{'// 02.00 SEC_FLAGSHIPS INDEX [02/04]'}</Layer>
      <Layer className="eyebrow mono">Architectural showcase</Layer>
      <Layer as="h2">Flagship Deployments</Layer>
      <Layer as="p" type className="sub">
        Production systems running around the clock on self-hosted hardware, from storage engines to replicated databases.
      </Layer>

      <div className="feature">
        <Layer>
          <div className="fhead">
            <span className="badge">{FEATURE.badge}</span>
            <span className="mono hw">{FEATURE.hardware}</span>
          </div>
          <h3>{FEATURE.title}</h3>
          <p className="desc">{FEATURE.desc}</p>
        </Layer>

        <Layer className="kpis">
          {FEATURE.kpis.map((k) => (
            <div className="kpi" key={k.label}>
              <b>{k.n != null ? <Count n={k.n} /> : k.text}</b>
              <span>{k.label}</span>
            </div>
          ))}
        </Layer>

        <Layer className="stack">
          <StackExplorer />
        </Layer>
      </div>

      <div className="cards3">
        {CARDS.map((c) => (
          <Layer as="article" className="card" key={c.title}>
            <span className="badge">{c.badge}</span>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
            <ul>
              {c.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="foot">
              <Chips items={c.chips} />
              <em>{c.note}</em>
            </div>
          </Layer>
        ))}
      </div>
    </section>
  );
}
