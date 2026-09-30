import { useEffect, useState } from 'react';
export default function TimelineControls({ track }) {
  const [active, setActive] = useState(0);
  const [total, setTotal] = useState(5);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    setTotal(el.children.length);
    const update = () => {
      const position = el.getBoundingClientRect().left;
      const distances = [...el.children].map(item => Math.abs(item.getBoundingClientRect().left - position));
      setActive(distances.indexOf(Math.min(...distances)));
    };
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, [track]);
  function move(index) {
    const el = track.current;
    const card = el.children[index];
    if (!card) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'paused';
    el.scrollTo({ left: el.scrollLeft + card.getBoundingClientRect().left - el.getBoundingClientRect().left, behavior: reduced ? 'instant' : 'smooth' });
  }
  return <div className="timeline-controls" role="group" aria-label="Career timeline navigation">
    <button type="button" aria-label="Previous career milestone" onClick={() => move(active - 1)} disabled={active === 0}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6"/></svg></button>
    <div className="timeline-stops">{Array.from({length: total}, (_, index) => <button type="button" key={index} aria-label={`Career milestone ${index + 1}`} aria-current={active === index ? 'step' : undefined} onClick={() => move(index)}><span aria-hidden="true"/></button>)}</div>
    <button type="button" aria-label="Next career milestone" onClick={() => move(active + 1)} disabled={active === total - 1}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>
  </div>;
}
