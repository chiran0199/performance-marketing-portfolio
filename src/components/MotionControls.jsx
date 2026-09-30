import { useEffect, useState } from 'react';

export default function MotionControls() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.motion = paused ? 'paused' : 'playing';
    window.dispatchEvent(new CustomEvent('portfolio-motion', { detail: paused }));
    return () => { delete document.documentElement.dataset.motion; };
  }, [paused]);
  return <button className="motion-control" type="button" aria-label={paused ? 'Play animations' : 'Pause animations'} aria-pressed={paused} onClick={() => setPaused(!paused)}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{paused ? <path d="m8 5 11 7-11 7Z"/> : <><path d="M8 5v14M16 5v14"/></>}</svg>
  </button>;
}
