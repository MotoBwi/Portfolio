import { useEffect } from 'react';

/** Left red progress rail + hero title parallax. Writes straight to styles to avoid re-rendering on scroll. */
export function useScrollFx() {
  useEffect(() => {
    const rail = document.getElementById('rail');
    const mega = document.getElementById('mega');
    const hero = document.getElementById('top');
    const hov = document.getElementById('hov');
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (rail) rail.style.transform = `scaleY(${h > 0 ? Math.min(1, window.scrollY / h) : 0})`;
      if (mega && hero) {
        const hp = Math.max(0, Math.min(1, window.scrollY / (hero.offsetHeight || 1)));
        mega.style.setProperty('--hp', hp.toFixed(3));
      }
      if (hov) hov.classList.remove('on');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}

/** Smooth in-page anchors. Uses scrollIntoView so the auto tour can own scrollBy. */
export function useSmoothAnchors(stopTour) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      stopTour();
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [stopTour]);
}
