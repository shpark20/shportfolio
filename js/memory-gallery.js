(() => {
  'use strict';

  const gallery = document.getElementById('memory-gallery');
  const previous = document.getElementById('memory-prev');
  const next = document.getElementById('memory-next');
  const range = document.getElementById('memory-range');
  if (!gallery || !previous || !next || !range) return;

  const cards = Array.from(gallery.querySelectorAll('.polaroid'));
  if (!cards.length) {
    previous.disabled = next.disabled = true;
    range.textContent = '0 / 0';
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scheduledFrame = 0;

  const measure = () => {
    const maximum = Math.max(0, gallery.scrollWidth - gallery.clientWidth);
    const left = Math.max(0, Math.min(gallery.scrollLeft, maximum));
    const right = left + gallery.clientWidth;
    // Layout offsets deliberately ignore each print's decorative rotation.
    const visible = [];
    let bestIndex = 0;
    let bestOverlap = -1;
    cards.forEach((card, index) => {
      const overlap = Math.max(0, Math.min(right, card.offsetLeft + card.offsetWidth) - Math.max(left, card.offsetLeft));
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        bestIndex = index;
      }
      if (card.offsetWidth > 0 && overlap >= card.offsetWidth / 2) visible.push(index);
    });
    if (!visible.length) visible.push(bestIndex);
    const finalCard = cards[cards.length - 1];
    return {
      left,
      maximum,
      first: visible[0],
      last: visible[visible.length - 1],
      count: visible.length,
      atStart: left <= Math.max(1, cards[0].offsetLeft),
      atEnd: maximum - left <= 1 || right >= finalCard.offsetLeft + finalCard.offsetWidth - 1
    };
  };

  const update = () => {
    scheduledFrame = 0;
    const state = measure();
    const label = state.first === state.last
      ? `${state.first + 1} / ${cards.length}`
      : `${state.first + 1}–${state.last + 1} / ${cards.length}`;
    if (range.textContent !== label) range.textContent = label;
    previous.disabled = state.atStart;
    next.disabled = state.atEnd;
  };

  const scheduleUpdate = () => {
    if (!scheduledFrame) scheduledFrame = window.requestAnimationFrame(update);
  };

  const advance = direction => {
    const state = measure();
    const targetIndex = Math.max(0, Math.min(cards.length - 1, state.first + direction * state.count));
    const padding = parseFloat(window.getComputedStyle(gallery).paddingLeft) || 0;
    const target = Math.max(0, Math.min(state.maximum, cards[targetIndex].offsetLeft - padding));
    gallery.scrollTo({ left: target, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    scheduleUpdate();
  };

  previous.addEventListener('click', () => advance(-1));
  next.addEventListener('click', () => advance(1));
  gallery.addEventListener('scroll', scheduleUpdate, { passive: true });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(gallery);
    cards.forEach(card => observer.observe(card));
  } else {
    window.addEventListener('resize', scheduleUpdate, { passive: true });
  }
  update();
})();
