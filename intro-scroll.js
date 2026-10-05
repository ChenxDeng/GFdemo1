(() => {
  const scene = document.querySelector('.hero-scroll-scene');
  if (!scene) return;
  const stage = scene.querySelector('.hero-stage');
  const tags = stage.querySelector('.hero-tags');
  const title = stage.querySelector('h1');
  const slogan = stage.querySelector('.hero-slogan');
  const details = stage.querySelector('.hero-details');
  const button = stage.querySelector('#register-button');
  const header = document.querySelector('.site-header');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let layout;
  let frame = 0;
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => value * value * (3 - 2 * value);
  function reset() {
    [tags, title, slogan, details].forEach(el => el.style.removeProperty('transform'));
    details.style.removeProperty('opacity');
    button.style.removeProperty('--register-opacity');
    button.style.removeProperty('--register-events');
    button.style.removeProperty('translate');
    details.inert = false;
    button.inert = false;
  }
  function measure() {
    reset();
    scene.classList.remove('is-enhanced');
    scene.style.removeProperty('height');
    if (reducedMotion.matches) { layout = null; return; }
    const bounds = stage.getBoundingClientRect();
    const available = innerHeight - header.getBoundingClientRect().height;
    const gutter = parseFloat(getComputedStyle(stage).paddingLeft);
    const elements = [tags, title, slogan];
    const boxes = elements.map(el => {
      const rect = el.getBoundingClientRect();
      const line = el.querySelector('.title-line');
      return {x:rect.left - bounds.left,y:rect.top - bounds.top,width:line ? line.offsetWidth : rect.width,height:rect.height};
    });
    const scale = Math.max(1, Math.min(1.28, (bounds.width - gutter * 2) / boxes[1].width));
    const sloganScale = Math.min(scale, 1.2);
    const tagGap = Math.min(36, Math.max(22, available * .035));
    const sloganGap = 12;
    const groupHeight = boxes[0].height + tagGap + boxes[1].height * scale + sloganGap + boxes[2].height * sloganScale;
    const titleHalfLine = boxes[1].height * scale / 2;
    const groupTop = Math.max(20, (available - groupHeight) / 2 - titleHalfLine);
    const scales = [1, scale, sloganScale];
    const tops = [groupTop, groupTop + boxes[0].height + tagGap, groupTop + boxes[0].height + tagGap + boxes[1].height * scale + sloganGap];
    const transforms = boxes.map((box, i) => ({
      x:(bounds.width - box.width * scales[i]) / 2 - box.x,
      y:tops[i] - box.y,
      scale:scales[i]
    }));
    const travel = Math.max(360, Math.min(900, available * .9));
    layout = {elements,transforms,travel,detailsShift:Math.max(80, available - (details.getBoundingClientRect().top - bounds.top) + 32)};
    scene.style.height = `${stage.offsetHeight + travel}px`;
    scene.classList.add('is-enhanced');
    render();
  }
  function render() {
    frame = 0;
    if (!layout) return;
    const distance = header.getBoundingClientRect().height - scene.getBoundingClientRect().top;
    const progress = clamp(distance / layout.travel);
    const movement = ease(progress);
    layout.elements.forEach((el, i) => {
      const from = layout.transforms[i];
      el.style.transform = `translate3d(${from.x * (1-movement)}px,${from.y * (1-movement)}px,0) scale(${1+(from.scale-1)*(1-movement)})`;
    });
    const reveal = ease(clamp((progress - .28) / .72));
    details.style.transform = `translate3d(0,${layout.detailsShift * (1-reveal)}px,0)`;
    details.style.opacity = String(reveal);
    details.inert = reveal < .95;
    const registerReveal = ease(clamp((progress - .65) / .35));
    button.style.translate = `0 ${layout.transforms[2].y * (1-movement)}px`;
    button.style.setProperty('--register-opacity', String(registerReveal));
    button.style.setProperty('--register-events', registerReveal < .95 ? 'none' : 'auto');
    button.inert = registerReveal < .95;
  }
  function queue() { if (!frame) frame = requestAnimationFrame(render); }
  addEventListener('scroll', queue, {passive:true});
  addEventListener('resize', measure);
  reducedMotion.addEventListener('change', measure);
  // The navigation skips directly to the complete competition layout.
  document.querySelectorAll('a[href="#competition"]').forEach(link => link.addEventListener('click', event => {
    if (!layout) return;
    event.preventDefault();
    history.pushState(null, '', '#competition');
    scrollTo({top:scrollY + scene.getBoundingClientRect().top - header.getBoundingClientRect().height + layout.travel,behavior:reducedMotion.matches?'instant':'smooth'});
  }));
  measure();
  document.fonts.ready.then(measure);
})();
