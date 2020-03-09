import ULocation from 'ulocation';
import { log, proxy } from '../utils';

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
    }
  });
}
function fakeFunction(object, key, fakeFunction) {
  const raw = object[key];
  const fake = fakeFunction || ((raw, ...args) => raw(args));
  object[key] = (...args) => {
    log('Fake Function', `CALL ${object}.${key}(${args.join(', ')})`);
    return fake(raw, ...args);
  };
}

// ----- Init ----- //
export default function init(href) {
  log('API_HOOK', `INIT ${href}`);

  let __location = new ULocation(href);
  __location.reload = () => location.reload();
  __location.replace = (url) => location.replace(url);
  __location.__proto__ = Location.prototype;
  window.__location = __location;

  // TODO
  fakeFunction(window, 'open', (raw, url) => raw(proxy(url)));

}
