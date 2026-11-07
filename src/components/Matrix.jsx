import { useState } from 'react';
import { Layer, Chips } from './Layer.jsx';
import { CATS, SYS, ALSO_RUNNING } from '../data.js';

const pad2 = (n) => String(n).padStart(2, '0');
const count = (id) => (id === 'all' ? SYS.length : SYS.filter((s) => s.cat === id).length);

export default function Matrix() {
  const [filter, setFilter] = useState('all');
  return (
    <section id="matrix" className="pad">
      <Layer className="slabel mono">{'// 03.00 SEC_MATRIX INDEX [03/04]'}</Layer>
      <Layer className="eyebrow mono">Engineering index</Layer>
      <Layer as="h2">The Systems Matrix</Layer>
      <Layer as="p" type className="sub">
        Specialized architectures spanning ML serving, replicated data, self-hosted infrastructure and shipped products.
      </Layer>

      <Layer className="filters" role="group" aria-label="Filter systems">
        {CATS.map((c) => (
          <button key={c.id} type="button" className="fbtn" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
            {c.label} ({count(c.id)})
          </button>
        ))}
      </Layer>

      {/* Cards stay mounted and use `hidden`, so the engine builds them when a filter reveals them. */}
      <div className="mgrid">
        {SYS.map((s, i) => (
          <Layer as="article" className="mcell" key={s.title} hidden={!(filter === 'all' || s.cat === filter)}>
            <div className="mtop">
              <span className="badge">{s.tag}</span>
              <em>#SYS-{pad2(i + 1)}</em>
            </div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <Chips items={s.chips} />
          </Layer>
        ))}
      </div>

      <Layer className="also">
        <span className="mono">Also running</span>
        {ALSO_RUNNING.map((a) => (
          <span className="chip" key={a}>{a}</span>
        ))}
      </Layer>
    </section>
  );
}
