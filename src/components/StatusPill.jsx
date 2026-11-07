const DOTS = ['#ff7a8a', '#ffb86b', '#ffe36b', '#6bf0a6', '#6bd6ff', '#b79cff'];

/** Bottom status pill: agents and layers counter, tour controls, then "Built by ... Replay" when finished. */
export default function StatusPill({ s, actions }) {
  const p = s.total ? s.done / s.total : 1;
  const agents = 16 + Math.round(12 * p);
  const cls = [s.complete ? 'done' : '', s.hidden ? 'hide' : ''].join(' ').trim();

  return (
    <div id="pill" className={cls} role="group" aria-label="Page build status">
      <span className="dots">
        {DOTS.map((c) => (
          <i key={c} style={{ '--c': c }} />
        ))}
      </span>
      <span className="pm">
        <b id="pa">{s.complete ? `Built by 28 agents in ${s.seconds}s` : `${agents} agents`}</b>
        <span id="pl">{s.complete ? '' : s.booted ? `${s.done} / ${s.total} layers` : 'Scanning page…'}</span>
      </span>
      <span className="meter"><i id="pf" style={{ width: `${p * 100}%` }} /></span>
      <button className={`pb${s.touring ? ' on' : ''}`} id="ptour" type="button" onClick={actions.toggleTour}>
        {s.touring ? 'Touring' : 'Tour'}
      </button>
      <button className="pb" id="pspeed" type="button" aria-label="Tour speed" onClick={actions.cycleSpeed}>{s.speed}×</button>
      <button className="pb" id="pfx" type="button" aria-label="Toggle agent cursors" title="Toggle agent cursors" onClick={actions.toggleFx}>✦</button>
      <button className="pb cy" id="pgo" type="button" onClick={actions.hide}>Go live</button>
      <button className="pb" id="prep" type="button" onClick={actions.replay}>Replay</button>
      <button className="pb" id="px" type="button" aria-label="Hide status" onClick={actions.hide}>×</button>
    </div>
  );
}
