import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// One owner for the motion lifecycle. React StrictMode and preference changes
// revert every tween, trigger and listener before creating a fresh scene.
export default function usePortfolioMotion() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let dispose = () => {};
    let paused = document.documentElement.dataset.motion === 'paused';
    function setup() {
      dispose();
      const root = document.documentElement;
      document.querySelectorAll('.reveal,.reveal-left').forEach(el => el.classList.add('visible'));
      if (preference.matches || paused) return;
      gsap.registerPlugin(ScrollTrigger);
      root.classList.add('motion-enhanced');
      const cleanups = [];
      const context = gsap.context(() => {
        const intro = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.15 } });
        intro.from('.hero-name', { y: 65, opacity: 0, rotateX: 14, transformOrigin: '50% 100%' }, 0)
          .from('.hero-tag', { clipPath: 'inset(0 100% 0 0)', ease: 'steps(40)', duration: 1.7 }, .2)
          .from('.hero-desc,.hero-cta-row', { y: 28, opacity: 0, stagger: .14 }, .4)
          .from('.hero-location', { opacity: 0, y: 15 }, .65)
          .from('.stat-item', { y: 45, opacity: 0, scale: .91, stagger: .13, ease: 'back.out(1.35)' }, .55)
          .from('.hero-orbits', { scale: .75, opacity: 0, duration: 2 }, 0);
        gsap.to('.hero-grid', { y: 95, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } });
        gsap.to('.hero-orbits', { y: 130, rotation: 25, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
        gsap.to('.hero-halo', { y: -75, stagger: .1, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.8 } });
        gsap.to('.reading-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } });
        document.querySelectorAll('section:not(#hero)').forEach(section => {
          gsap.fromTo(section, { '--section-sweep': '0%' }, { '--section-sweep': '100%', ease: 'none', scrollTrigger: { trigger: section, start: 'top 95%', end: 'top 25%', scrub: .8 } });
        });
        // Skip nested reveal nodes so animations do not compound, and skip
        // horizontal timeline items because their native scroll stays independent.
        const selectors = '.section-title,.section-label,.reveal,.reveal-left,.visual-card,.evidence-item,.credential-card,.tool-group';
        [...document.querySelectorAll(selectors)].filter(el => !el.closest('#hero,.exp-list') && !el.parentElement.closest(selectors) && !el.closest('[hidden]')).forEach((el, index) => {
          const isImage = el.matches('.evidence-item,.credential-card');
          gsap.from(el, {
            opacity: 0, y: isImage ? 38 : 30,
            x: el.classList.contains('reveal-left') ? -35 : 0,
            scale: isImage ? .965 : 1,
            rotateX: el.classList.contains('project-wrap') ? 7 : 0,
            duration: .85, delay: (index % 3) * .045, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 94%', once: true }, clearProps: 'transform,opacity'
          });
        });
        document.querySelectorAll('.bar-fill').forEach(el => gsap.from(el, { scaleX: 0, transformOrigin: 'left center', duration: 1.4, ease: 'power3.inOut', scrollTrigger: {trigger: el, start: 'top 92%', once: true} }));
      });
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll('.tool-group,.project-wrap,.stat-item,.hobby-card,.btn-primary,.btn-outline').forEach(el => {
          const button = el.matches('.btn-primary,.btn-outline');
          const move = event => {
            const rect = el.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width, y = (event.clientY - rect.top) / rect.height;
            el.style.setProperty('--spot-x', `${x * 100}%`); el.style.setProperty('--spot-y', `${y * 100}%`);
            gsap.to(el, button ? { x: (x-.5)*9, y: (y-.5)*9, duration:.35, overwrite:'auto' } : { rotationY:(x-.5)*5, rotationX:(.5-y)*4, transformPerspective:900, duration:.45, overwrite:'auto' });
          };
          const reset = () => gsap.to(el, {x:0,y:0,rotationX:0,rotationY:0,duration:.6,overwrite:'auto',clearProps:'transform'});
          el.addEventListener('pointermove', move); el.addEventListener('pointerleave', reset);
          cleanups.push(() => { el.removeEventListener('pointermove',move); el.removeEventListener('pointerleave',reset); gsap.killTweensOf(el); el.style.removeProperty('transform'); });
        });
      }
      // Images and font swaps change section heights. Keep trigger geometry fresh.
      const refresh = () => ScrollTrigger.refresh();
      document.querySelectorAll('details').forEach(el => { el.addEventListener('toggle',refresh); cleanups.push(() => el.removeEventListener('toggle',refresh)); });
      document.querySelectorAll('img').forEach(img => { img.addEventListener('load',refresh); cleanups.push(() => img.removeEventListener('load',refresh)); });
      let live = true;
      document.fonts?.ready.then(() => { if(live) refresh(); });
      const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => ScrollTrigger.refresh()) : null;
      const projects = document.querySelector('#projects');
      if (projects) resizeObserver?.observe(projects);
      dispose = () => {
        live = false; resizeObserver?.disconnect(); cleanups.forEach(cleanup => cleanup()); context.revert(); root.classList.remove('motion-enhanced');
      };
    }
    const toggle = event => { paused = event.detail; setup(); };
    setup();
    preference.addEventListener('change', setup);
    window.addEventListener('portfolio-motion', toggle);
    return () => { dispose(); preference.removeEventListener('change',setup); window.removeEventListener('portfolio-motion',toggle); };
  }, []);
}
