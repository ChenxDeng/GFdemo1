document.querySelectorAll('.hero').forEach(hero => {
  const grid = hero?.querySelector('.hero-grid');
  if (!grid) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const ambient = document.createElement('div');
  ambient.className = 'grid-ambient';
  ambient.innerHTML = '<span class="ambient-field"></span><span class="ambient-origin"><span class="ambient-core"></span><span class="ambient-ray"></span><span class="ambient-ray"></span><span class="ambient-ray"></span><span class="ambient-ray"></span></span>';
  grid.append(ambient);
  let visible = false;
  let hovering = hero.matches(':hover');
  let timer;
  function enabled() { return visible && !hovering && !document.hidden && !reducedMotion.matches; }
  function stop() {
    clearTimeout(timer);
    ambient.classList.remove('is-running');
  }
  function schedule(delay = 1800 + Math.random() * 2600) {
    timer = setTimeout(() => {
      if (!enabled()) return;
      const {width, height} = grid.getBoundingClientRect();
      // Snap the source to an actual grid intersection, with space around it.
      const x = Math.round(width * (.12 + Math.random() * .76) / 24) * 24;
      const y = Math.round(height * (.18 + Math.random() * .68) / 24) * 24;
      ambient.style.setProperty('--ambient-x', `${x}px`);
      ambient.style.setProperty('--ambient-y', `${y}px`);
      ambient.classList.add('is-running');
    }, delay);
  }
  ambient.querySelector('.ambient-field').addEventListener('animationend', () => {
    ambient.classList.remove('is-running');
    if (enabled()) schedule();
  });
  function update() { stop(); if (enabled()) schedule(); }
  hero.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    hovering = true;
    stop();
  });
  hero.addEventListener('pointerleave', () => { hovering = false; update(); });
  hero.addEventListener('pointercancel', () => { hovering = false; update(); });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    update();
  }, {threshold: .15}).observe(hero);
  document.addEventListener('visibilitychange', update);
  reducedMotion.addEventListener('change', update);
});
