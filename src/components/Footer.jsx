import { Layer } from './Layer.jsx';

export default function Footer({ onReplay, canReplay }) {
  return (
    <footer>
      <Layer as="p">© 2026 Bapan. Designed in Nox &amp; Crimson. Built from first principles.</Layer>
      <Layer as="p">
        Running 24/7 from Kuwait.{' '}
        {canReplay && (
          <button type="button" onClick={onReplay}>Replay build</button>
        )}
      </Layer>
    </footer>
  );
}
