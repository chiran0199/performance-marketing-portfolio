import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const selector = '.evidence-item > a, .credential-preview';
export default function ImageViewer() {
  const [viewer, setViewer] = useState(null);
  const dialog = useRef(null);
  const opener = useRef(null);
  useEffect(() => {
    function open(event) {
      const link = event.target.closest?.(selector);
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const card = link.closest('.evidence-item,.credential-card');
      const group = card.closest('.evidence-grid,.concept-grid,.credential-grid') || card.parentElement;
      const cards = [...group.querySelectorAll('.evidence-item,.credential-card')];
      const items = cards.map(item => {
        const img = item.querySelector('img');
        return { src: img.src, alt: img.alt, caption: item.querySelector('figcaption,h3')?.textContent.trim() || img.alt };
      });
      if (!items.length) return;
      event.preventDefault();
      opener.current = link;
      setViewer({ items, index: cards.indexOf(card) });
    }
    document.addEventListener('click', open);
    return () => document.removeEventListener('click', open);
  }, []);
  useEffect(() => {
    if (!viewer) return;
    const el = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    el.showModal();
    return () => {
      el.close();
      document.body.style.overflow = overflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [!!viewer]);
  const move = direction => setViewer(current => ({...current, index: (current.index + direction + current.items.length) % current.items.length}));
  if (!viewer) return null;
  const item = viewer.items[viewer.index];
  return createPortal(<dialog ref={dialog} className="image-viewer" aria-label="Image viewer" onCancel={() => setViewer(null)} onClick={event => { if (event.target === event.currentTarget) setViewer(null); }} onKeyDown={event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
  }}>
    <button type="button" className="viewer-close" aria-label="Close image viewer" onClick={() => setViewer(null)} autoFocus><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
    <figure>
      <img key={item.src} src={item.src} alt={item.alt}/>
      <figcaption>{item.caption}</figcaption>
    </figure>
    {viewer.items.length > 1 && <div className="viewer-controls">
      <button type="button" aria-label="Previous image" onClick={() => move(-1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg></button>
      <output aria-live="polite">{viewer.index + 1} / {viewer.items.length}</output>
      <button type="button" aria-label="Next image" onClick={() => move(1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg></button>
    </div>}
  </dialog>, document.body);
}
