import ULocation from 'ulocation';
import {log, proxy} from '../utils';

// ----- Utils Functions ----- //
function fakeProperty(object, key, fakeValue) {
  Object.defineProperty(object, key, {
    get() {
      log('Fake Property', `GET ${object}.${key} (=${fakeValue})`);
      return fakeValue;
    },
    set(value) {
      log('Fake Property', `SET ${object}.${key} (=${value})`);
      fakeValue = value;
    },
    configurable: true
  });
}
function fakeFunction(object, key, fakeFunction) {
  const raw = object[key];
  object[key] = (...args) => {
    log('Fake Function', `CALL ${object}.${key}(${args.join(', ')})`);
    return fakeFunction ? fakeFunction(raw, ...args) : undefined;
  };
}

// ----- Init ----- //
export default function init(href) {
  const urlObj = new URL(href);

  let __location = new ULocation(href);
  __location.reload = () => location.reload();
  __location.replace = (url) => location.replace(url);
  __location.__proto__ = Location.prototype;
  window.__location = __location;
  document.__location = __location;

  // TODO
  fakeFunction(window, 'open', (raw, url, ...args) => raw(proxy(url), ...args));
  fakeFunction(history, 'replaceState', (raw, data, title, url) => raw.call(history, data, title, proxy(url)));
  fakeFunction(history, 'pushState', (raw, data, title, url) => raw.call(history, data, title, proxy(url)));
  fakeProperty(document, 'domain', urlObj.hostname);
  fakeProperty(document, 'URL', urlObj.href);

  // Log
  log('API_HOOK', 'INIT');
}
