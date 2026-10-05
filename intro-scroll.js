(() => {
  const intro = document.querySelector('.intro-screen');
  const content = intro?.querySelector('.intro-content');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!content) return;
  let frame = 0;
  function render() {
    frame = 0;
    if (reducedMotion.matches) {
      content.style.removeProperty('--intro-opacity');
      content.style.removeProperty('--intro-shift');
      return;
    }
    const bounds = intro.getBoundingClientRect();
    const header = document.querySelector('.site-header').getBoundingClientRect().height;
    const progress = Math.max(0, Math.min(1, (header - bounds.top) / bounds.height));
    content.style.setProperty('--intro-opacity', String(1 - progress * .9));
    content.style.setProperty('--intro-shift', `${-progress * 24}px`);
  }
  function queue() { if (!frame) frame = requestAnimationFrame(render); }
  addEventListener('scroll', queue, {passive:true});
  addEventListener('resize', queue);
  reducedMotion.addEventListener('change', queue);
  render();
})();
