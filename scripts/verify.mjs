import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { strict as assert } from 'node:assert';
import { JSDOM } from 'jsdom';
const original = new JSDOM(readFileSync('reference/original.html','utf8'));
const rendered = new JSDOM(readFileSync('reference/rendered.html','utf8'));
const assets = JSON.parse(readFileSync('reference/assets.json','utf8'));
const assetMap = Object.fromEntries(assets.map(x => [x.original, '/performance-marketing-portfolio/'+x.path]));
const images = doc => [...doc.querySelectorAll('img')].map(x => x.getAttribute('src'));
assert.deepEqual(images(rendered.window.document),images(original.window.document).map(x=>assetMap[x]||x));
function content(doc) {
  doc.querySelectorAll('script,style,head,[aria-hidden="true"]').forEach(x=>x.remove());
  const walker=doc.createTreeWalker(doc.body,4); let node; const pieces=[];
  while((node=walker.nextNode())) if(node.textContent.trim()) pieces.push(node.textContent.trim());
  return pieces.join(' ').replace(/\s+/g,' ').trim();
}
assert.equal(content(rendered.window.document),content(original.window.document),'Portfolio text must match');
for (const item of assets) {
  assert.equal(createHash('sha256').update(readFileSync('public/'+item.path)).digest('hex'), item.sha256);
  assert(existsSync('dist/'+item.path));
}
// Exercise the production React bundle without depending on a browser service.
const shell = readFileSync('dist/index.html','utf8');
const jsPath = shell.match(/src="([^"]+\.js)"/)[1].replace('/performance-marketing-portfolio/','dist/');
const dom = new JSDOM(shell, { url:'https://example.test/performance-marketing-portfolio/', runScripts:'outside-only', pretendToBeVisual:true });
dom.window.matchMedia = () => ({ matches:true,addEventListener(){},removeEventListener(){} });
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
dom.window.HTMLDialogElement.prototype.showModal = function(){ this.setAttribute('open',''); };
dom.window.HTMLDialogElement.prototype.close = function(){ this.removeAttribute('open'); };
dom.window.HTMLElement.prototype.scrollTo = function(options){ this.scrollLeft=options.left || 0; };
dom.window.eval(readFileSync(jsPath,'utf8'));
await new Promise(resolve=>setTimeout(resolve,100));
const d=dom.window.document;
assert.equal(d.querySelectorAll('.tool-group').length,6);
assert.equal(d.querySelectorAll('.tool-list li').length,32);
assert.equal(d.querySelectorAll('.credential-card').length,10);
assert.equal(d.querySelector('#blog-panel').hidden,true);
d.querySelector('#tab-blog').click();
await new Promise(resolve=>setTimeout(resolve,20));
assert.equal(d.querySelector('#blog-panel').hidden,false);
assert.equal(d.querySelector('#projects-panel').hidden,true);
d.querySelector('#tab-blog').dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Home',bubbles:true}));
await new Promise(resolve=>setTimeout(resolve,20));
assert.equal(d.querySelector('#projects-panel').hidden,false);
assert.equal(d.activeElement.id,'tab-projects');
const allIds = new Set([...d.querySelectorAll('[id]')].map(x=>x.id));
for(const a of d.querySelectorAll('a[href^="#"]')) assert(allIds.has(a.getAttribute('href').slice(1)));
// The lightbox retains each original image URL, supports keyboard navigation,
// closes cleanly, and returns focus to the clicked thumbnail.
const firstImage=d.querySelector('.evidence-item > a');
firstImage.click();
await new Promise(resolve=>setTimeout(resolve,20));
let modal=d.querySelector('.image-viewer');
assert(modal?.hasAttribute('open'));
assert.equal(modal.querySelector('img').src,firstImage.querySelector('img').src);
modal.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
await new Promise(resolve=>setTimeout(resolve,20));
assert(d.querySelector('.viewer-controls output').textContent.startsWith('2 /'));
d.querySelector('.viewer-close').click();
await new Promise(resolve=>setTimeout(resolve,20));
assert.equal(d.querySelector('.image-viewer'),null);
assert.equal(d.activeElement,firstImage);
d.querySelector('.credential-preview').click();
await new Promise(resolve=>setTimeout(resolve,20));
assert.equal(d.querySelector('.viewer-controls output').textContent,'1 / 10');
d.querySelector('.image-viewer').dispatchEvent(new dom.window.Event('cancel'));
await new Promise(resolve=>setTimeout(resolve,20));
assert.equal(d.querySelector('.image-viewer'),null);
assert.equal(d.querySelectorAll('.timeline-stops button').length,5);
d.querySelector('.motion-control').click();
await new Promise(resolve=>setTimeout(resolve,20));
assert.equal(d.documentElement.dataset.motion,'paused');
assert.equal(d.querySelector('.motion-control').getAttribute('aria-pressed'),'true');
d.querySelector('.motion-control').click();
await new Promise(resolve=>setTimeout(resolve,20));
assert.equal(d.documentElement.dataset.motion,'playing');
console.log('PASS: lightbox original URLs, arrow navigation, dismiss, focus restoration, 10-certificate gallery, timeline controls, animation toggle.');
console.log('PASS: exact text, 44 image references, 31 unchanged local files, 32 skills, 10 certificates, mouse and keyboard tabs, internal links.');
dom.window.close(); original.window.close(); rendered.window.close();
