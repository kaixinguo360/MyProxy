import {debug, log} from '../utils';

// ----- Utils Functions ----- //
function messageEventListener(e) {
  let message = e.data;
  switch (message.type) {
    case 'request':
      return handleRequest(message.data);
    default:
      log('SW_HOOK', 'UNSUPPORTED MESSAGE', message);
  }
}
function handleRequest(request) {
  debug('SW_HOOK', 'REQUEST', request);
  switch (request.destination) {
    case "image":
      log('SW_HOOK', 'image', request.url); break;
    case "video":
      log('SW_HOOK', 'video', request.url); break;
    case "audio":
      log('SW_HOOK', 'audio', request.url); break;
  }
}

// ----- Init ----- //
export default function init() {
  if (! 'serviceWorker' in navigator) {
    log('SW_HOOK', 'UNSUPPORTED')
  }

  // Install Service Worker
  navigator.serviceWorker
    .register('/proxy/hook-sw.js', { scope: '/proxy/' })
    .then(e => {
      if (!e.active) {
        window.location.reload();
        log('SW_HOOK', 'INSTALLED');
      }
    })
    .catch(error => log('SW_HOOK', 'FAILED ' + error));

  // Register Event Listener
  navigator.serviceWorker.addEventListener('message', messageEventListener);

  // Log
  log('SW_HOOK', 'INIT');
}
