export default function Nav() {
  return (
    <nav id="nav">
      <a className="logo" href="#top" aria-label="Top">
        <i>B</i>
        <span>BAPAN.</span>
      </a>
      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#work">Flagships</a></li>
        <li><a href="#matrix">Matrix</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <div className="avail mono"><i></i>Available</div>
      <a className="disp mono" href="#contact">Dispatch →</a>
    </nav>
  );
}
