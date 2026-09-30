import { useEffect, useRef } from "react";
import { asset } from "../lib/asset.js";
export default function Navigation() {
  const linksRef = useRef(null);
  useEffect(() => {
    const list = linksRef.current;
    const links = [...list.querySelectorAll('a')];
    let active = null, frame = 0;
    function line(link) {
      if (!link) { list.style.setProperty('--line-opacity', '0'); return; }
      const box = link.getBoundingClientRect(), parent = list.getBoundingClientRect();
      list.style.setProperty('--line-x', `${box.left - parent.left + list.scrollLeft}px`);
      list.style.setProperty('--line-width', `${box.width}px`);
      list.style.setProperty('--line-opacity', '1');
    }
    function update() {
      frame = 0;
      const candidates = links.map(link => ({ link, top: document.querySelector(link.hash)?.getBoundingClientRect().top ?? Infinity })).filter(item => item.top < window.innerHeight * .45);
      active = candidates.sort((a,b) => b.top - a.top)[0]?.link || null;
      links.forEach(link => { if(link === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
      if (!list.matches(':hover') && !list.contains(document.activeElement)) line(active);
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    const hover = event => { const link = event.target.closest('a'); if (link) line(link); };
    const leave = () => line(active);
    list.addEventListener('pointerover', hover); list.addEventListener('pointerleave', leave);
    list.addEventListener('focusin', hover); list.addEventListener('focusout', leave);
    window.addEventListener('scroll', queue, {passive:true}); window.addEventListener('resize', queue);
    update();
    return () => {
      cancelAnimationFrame(frame);
      list.removeEventListener('pointerover', hover); list.removeEventListener('pointerleave', leave);
      list.removeEventListener('focusin', hover); list.removeEventListener('focusout', leave);
      window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue);
    };
  }, []);
  return (
    <nav aria-label="Main navigation">
      <a
        className="nav-logo-link"
        href="#hero"
        aria-label="Chirantan Dutta Banik | home"
      >
        <img
          alt="Chirantan Dutta Banik logo"
          className="nav-logo-img"
          src={asset("assets/brand/logo.png")}
          width="64"
          height="64"
        />
      </a>
      <ul className="nav-links" ref={linksRef}>
        <li>
          <a href="#case-studies">{"Results"}</a>
        </li>
        <li>
          <a href="#about">{"About"}</a>
        </li>
        <li>
          <a href="#experience">{"Experience"}</a>
        </li>
        <li>
          <a href="#projects">{"Projects"}</a>
        </li>
        <li>
          <a href="#skills">{"Skills"}</a>
        </li>
        <li>
          <a href="#contact">{"Contact"}</a>
        </li>
      <li className="nav-indicator" aria-hidden="true"/>
      </ul>
    </nav>
  );
}
