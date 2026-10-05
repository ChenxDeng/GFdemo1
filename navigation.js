const sectionLinks = [...document.querySelectorAll('.nav-competition a')];
const pageSections = sectionLinks.map(link => document.querySelector(link.hash));
let navigationPending = false;
function updateNavigation() {
  const threshold = document.querySelector('.site-header').getBoundingClientRect().height + innerHeight * .25;
  let active = pageSections[0];
  for (const section of pageSections) {
    if (section.getBoundingClientRect().top <= threshold) active = section;
  }
  for (const link of sectionLinks) {
    if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  navigationPending = false;
}
function queueNavigation() {
  if (!navigationPending) { navigationPending = true; requestAnimationFrame(updateNavigation); }
}
addEventListener('scroll', queueNavigation, {passive:true});
addEventListener('resize', queueNavigation);
updateNavigation();

// Match anchor offsets to the rendered header at every responsive width.
const navigationHeader = document.querySelector('.site-header');
function measureHeader() {
  document.documentElement.style.setProperty('--header-height', `${navigationHeader.getBoundingClientRect().height}px`);
}
new ResizeObserver(measureHeader).observe(navigationHeader);
measureHeader();
