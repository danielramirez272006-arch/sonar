// Measure before writing so nested labels are enlarged once, not cumulatively.
// Only font sizes change; root rem units, images and container widths stay intact.
export function enlargeTextOnly(factor, scope = document.body) {
  const originals = new Map();
  let frame;
  const withoutTransitions = callback => {
    const elements = new Set([...originals.keys(), ...scope.querySelectorAll('*')]);
    const transitions = [];
    for (const element of elements) {
      if (!(element instanceof HTMLElement)) continue;
      transitions.push([element, element.style.getPropertyValue('transition-property'), element.style.getPropertyPriority('transition-property')]);
      element.style.setProperty('transition-property', 'none', 'important');
    }
    callback();
    // Commit both restoration and scaling before re-enabling CSS transitions.
    // Otherwise transition-all exposes an intermediate font size on each pass.
    void scope.offsetWidth;
    for (const [element, value, priority] of transitions) {
      if (value) element.style.setProperty('transition-property', value, priority);
      else element.style.removeProperty('transition-property');
    }
  };
  const restore = () => {
    for (const [element, { value, priority }] of originals) {
      if (value) element.style.setProperty('font-size', value, priority);
      else element.style.removeProperty('font-size');
    }
    originals.clear();
  };
  const apply = () => withoutTransitions(() => {
    restore();
    const measurements = [];
    for (const element of scope.querySelectorAll('*')) {
      if (!(element instanceof HTMLElement) || element.closest('script, style, svg, canvas, .material-symbols-outlined, [data-text-size-ignore]')) continue;
      const hasText = [...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      if (!hasText && !element.matches('input, textarea, select')) continue;
      const size = parseFloat(getComputedStyle(element).fontSize);
      if (!Number.isFinite(size)) continue;
      originals.set(element, { value: element.style.getPropertyValue('font-size'), priority: element.style.getPropertyPriority('font-size') });
      measurements.push([element, size]);
    }
    for (const [element, size] of measurements) element.style.setProperty('font-size', `${size * factor}px`, 'important');
  });
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(apply);
  };
  apply();
  const observer = new MutationObserver(schedule);
  observer.observe(scope, { childList: true, subtree: true, characterData: true });
  window.addEventListener('resize', schedule);
  return () => {
    observer.disconnect();
    window.removeEventListener('resize', schedule);
    cancelAnimationFrame(frame);
    withoutTransitions(restore);
  };
}
