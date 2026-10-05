// Pointer motion stays on decorative layers; document geometry never moves.
const heroes = [...document.querySelectorAll('.hero')];
const motionQuery = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const targets = [...document.querySelectorAll('.title-line, .section h2, .contact h2, .text-link, .contact-link')];
const motionItems = targets.map(target => {
  const surface = document.createElement('span');
  surface.className = 'motion-surface';
  while (target.firstChild) surface.append(target.firstChild);
  target.append(surface);
  target.classList.add('motion-target');
  return { target, surface };
});
let frame = 0;
let lastPointer = null;
const pending = new Map();
function schedule() {
  if (!frame) frame = requestAnimationFrame(render);
}
function render() {
  frame = 0;
  if (!motionQuery.matches) return;
  if (lastPointer) {
    const hero = lastPointer.hero;
    const grid = hero.querySelector('.hero-grid');
    const rect = hero.getBoundingClientRect();
    const x = lastPointer.x - rect.left;
    const y = lastPointer.y - rect.top;
    if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
      hero.classList.add('is-tracking');
      grid.style.setProperty('--pointer-x', `${x}px`);
      grid.style.setProperty('--pointer-y', `${y}px`);
      grid.style.setProperty('--cell-x', `${Math.floor(x / 24) * 24}px`);
      grid.style.setProperty('--cell-y', `${Math.floor(y / 24) * 24}px`);
    } else {
      hero.classList.remove('is-tracking');
      lastPointer = null;
    }
  }
  for (const [item, point] of pending) {
    const rect = item.target.getBoundingClientRect();
    const amount = item.target.classList.contains('title-line') ? 8 : 4;
    const x = Math.max(-1, Math.min(1, (point.x - rect.left) / rect.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (point.y - rect.top) / rect.height * 2 - 1));
    item.surface.style.setProperty('--shift-x', `${x * amount}px`);
    item.surface.style.setProperty('--shift-y', `${y * amount * .6}px`);
    item.target.classList.add('is-hovered');
  }
  pending.clear();
}
heroes.forEach(hero => {
hero.addEventListener('pointermove', event => {
  if (!motionQuery.matches || event.pointerType === 'touch') return;
  lastPointer = { hero, x: event.clientX, y: event.clientY };
  schedule();
});
hero.addEventListener('pointerleave', () => {
  lastPointer = null;
  hero.classList.remove('is-tracking');
});
});
function resetItem(item) {
  pending.delete(item);
  item.target.classList.remove('is-hovered');
  item.surface.style.removeProperty('--shift-x');
  item.surface.style.removeProperty('--shift-y');
}
motionItems.forEach(item => {
  item.target.addEventListener('pointermove', event => {
    if (!motionQuery.matches || event.pointerType === 'touch') return;
    pending.set(item, { x: event.clientX, y: event.clientY });
    schedule();
  });
  item.target.addEventListener('pointerleave', () => resetItem(item));
  item.target.addEventListener('pointercancel', () => resetItem(item));
});
function resetMotion() {
  cancelAnimationFrame(frame);
  frame = 0;
  lastPointer = null;
  heroes.forEach(hero => hero.classList.remove('is-tracking'));
  motionItems.forEach(resetItem);
}
window.addEventListener('scroll', resetMotion, { passive: true });
window.addEventListener('blur', resetMotion);
motionQuery.addEventListener('change', resetMotion);
document.addEventListener('visibilitychange', () => { if (document.hidden) resetMotion(); });
