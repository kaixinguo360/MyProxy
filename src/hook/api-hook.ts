import ULocation from 'ulocation';
import {proxy} from '../utils/url-utils';
import {log} from '../utils/log-utils';

export class ApiHook {

  // ----- Init ----- //
  constructor(href: string) {
    const urlObj = new URL(href);

    // TODO
    this.createFakeLocation(href);
    this.fakeFunction(window, 'open', (raw, url, ...args) => raw(proxy(url), ...args));
    this.fakeFunction(history, 'replaceState', (raw, data, title, url) => raw.call(history, data, title, proxy(url)));
    this.fakeFunction(history, 'pushState', (raw, data, title, url) => raw.call(history, data, title, proxy(url)));
    this.fakeProperty(document, 'domain', urlObj.hostname);
    this.fakeProperty(document, 'URL', urlObj.href);

    // Log
    log('API_HOOK', 'INIT');
  }

  // ----- Utils Functions ----- //
  createFakeLocation(href: string) {
    let __location = new ULocation(href);
    __location.reload = () => location.reload();
    __location.replace = (url: string) => location.replace(url);
    __location.__proto__ = Location.prototype;
    (window as any).__location = __location;
    (document as any).__location = __location;
  }
  fakeProperty(object: any, key: string, fakeValue: any) {
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
  fakeFunction(object: any, key: string, fakeFunction: (raw: (...args: any) => any, ...args: any) => any) {
    const raw = object[key];
    object[key] = (...args: any[]) => {
      log('Fake Function', `CALL ${object}.${key}(${args.join(', ')})`);
      return fakeFunction ? fakeFunction(raw, ...args) : undefined;
    };
  }
}
