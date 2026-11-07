import { memo } from 'react';

/**
 * Marks an element as a "layer" the build engine reveals.
 * With `type`, children must be a plain string: the engine types it out and restores it from data-full.
 * Keep className static on layers, the engine toggles the `built` class directly on the DOM node.
 */
export function Layer({ as: Tag = 'div', type = false, children, ...rest }) {
  const extra = type ? { 'data-type': '', 'data-full': children } : null;
  return (
    <Tag data-layer="" {...extra} {...rest}>
      {children}
    </Tag>
  );
}

/** Animated number. Never re-renders, the engine counts it up when its layer is built. */
export const Count = memo(function Count({ n }) {
  return (
    <span data-count={n} style={{ all: 'unset' }}>
      {n}
    </span>
  );
});

export function Chips({ items }) {
  if (!items || !items.length) return null;
  return (
    <div className="chips">
      {items.map((c) => (
        <span className="chip" key={c}>{c}</span>
      ))}
    </div>
  );
}
