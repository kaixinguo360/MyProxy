import {log, proxy} from '../utils';

// ----- Utils Functions ----- //

// ----- Init ----- //
export default function init() {
  const observer = new MutationObserver(mutations =>
    mutations
      .filter(m => m.addedNodes.length)
      .forEach((mutation) => {
        Array.from(mutation.addedNodes)
          .filter(node => node.src || node.href || node.action)
          .forEach(node => {
            node.src = node.src ? proxy(node.src) : node.src;
            node.href = node.href ? proxy(node.href) : node.href;
            node.action = node.action ? proxy(node.action) : node.action;
          })
      })
  );
  observer.observe(document.documentElement, {
    childList: true,
    attributes: true,
    subtree: true,
    attributeFilter: ['src', 'href', 'action']
  });

  // Log
  log('DOM_HOOK', 'INIT');
}
