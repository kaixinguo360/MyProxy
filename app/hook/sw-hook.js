import {log} from '../utils';

// ----- Utils Functions ----- //

// ----- Init ----- //
export default function init() {
  log('SW_HOOK', 'INIT');

  // Install Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/proxy/hook-sw.js', { scope: '/proxy/' })
      .then(e => {
        if (!e.active) {
          window.location.reload();
          log('SW_HOOK', 'INSTALLED');
        }
      })
      .catch(error => log('SW_HOOK', 'FAILED ' + error));
  }
}
