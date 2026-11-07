import { useEffect, useMemo, useRef, useState } from 'react';
import { createEngine, supportsEngine } from '../engine/engine.js';

const INITIAL = { bootOff: false, booted: false, done: 0, total: 0, complete: false, seconds: '0.0', touring: false, speed: 1, fxOff: false, hidden: false };

/** Starts the build engine after mount and exposes its state + controls to React. */
export default function useBuildEngine() {
  const [enabled, setEnabled] = useState(() => supportsEngine());
  const [state, setState] = useState(INITIAL);
  const eng = useRef(null);

  useEffect(() => {
    let e = null;
    if (enabled) {
      try {
        e = createEngine((s) => setState(s));
      } catch (err) {
        console.error('Build engine failed, showing the static page.', err);
      }
    }
    if (!e) {
      document.documentElement.classList.remove('js');
      setEnabled(false);
      window.__ok = true;
      return undefined;
    }
    eng.current = e;
    e.start();
    window.__ok = true;
    return () => { e.destroy(); eng.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actions = useMemo(() => ({
    toggleTour: () => eng.current && eng.current.toggleTour(),
    cycleSpeed: () => eng.current && eng.current.cycleSpeed(),
    toggleFx: () => eng.current && eng.current.toggleFx(),
    hide: () => eng.current && eng.current.hide(),
    replay: () => eng.current && eng.current.replay(),
    stopTour: () => eng.current && eng.current.stopTour(),
  }), []);

  return { enabled, state, actions };
}
