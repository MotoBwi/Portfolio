import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Flagships from './components/Flagships.jsx';
import Matrix from './components/Matrix.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import StatusPill from './components/StatusPill.jsx';
import useBuildEngine from './hooks/useBuildEngine.js';
import { useScrollFx, useSmoothAnchors } from './hooks/useScrollFx.js';

export default function App() {
  const { enabled, state, actions } = useBuildEngine();
  useScrollFx();
  useSmoothAnchors(actions.stopTour);

  return (
    <>
      {/* fixed visual layers: the engine draws into these, React never touches their children */}
      <div className="glow" />
      <div id="rail" />
      <canvas id="fx" />
      <div id="wfLayer" />
      <div id="selLayer" />
      <div id="hov" className="sel hov">
        <i className="h a" /><i className="h b" /><i className="h c" /><i className="h d" />
        <em className="dim" id="hovdim" />
      </div>

      <Nav />
      <main>
        <Hero />
        <About />
        <Flagships />
        <Matrix />
        <Contact />
      </main>
      <Footer onReplay={actions.replay} canReplay={enabled} />

      {enabled && (
        <>
          <div id="boot" className={state.bootOff ? 'off' : ''}><b>BS</b></div>
          <StatusPill s={state} actions={actions} />
        </>
      )}
    </>
  );
}
