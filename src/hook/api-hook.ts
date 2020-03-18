import ULocation from 'ulocation';
import {log} from '../utils/log-utils';
import {ProxyService} from '../utils/proxy-service';

export class ApiHook {

  // ----- Init ----- //
  constructor(proxyService: ProxyService, href: string) {
    const urlObj = new URL(href);
    const __location = this.createFakeLocation(href);

    // history
    this.fakeFunction(history, 'replaceState', (raw, data, title, url) => {
      __location.href = proxyService.absolute(url);
      raw.call(history, data, title, proxyService.proxy(url, true));
    });
    this.fakeFunction(history, 'pushState', (raw, data, title, url) => {
      __location.href = proxyService.absolute(url);
      raw.call(history, data, title, proxyService.proxy(url, true));
    });

    // document
    this.fakeProperty(document, 'domain', urlObj.hostname);
    this.fakeProperty(document, 'URL', urlObj.href);

    // window
    this.fakeFunction(window, 'open', (raw, url, ...args) => raw(proxyService.proxy(url, true), ...args));
    
    // Log
    log('API_HOOK', 'INIT');
  }

  // ----- Utils Functions ----- //
  public createFakeLocation(href: string): Location {
    let __location = new ULocation(href);
    __location.reload = () => location.reload();
    __location.replace = (url: string) => location.replace(url);
    __location.__proto__ = Location.prototype;
    (window as any).__location = __location;
    (document as any).__location = __location;
    return __location;
  }
  public fakeProperty(object: any, key: string, fakeValue: any) {
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
  public fakeFunction(object: any, key: string, fakeFunction: (raw: (...args: any) => any, ...args: any) => any) {
    const raw = object[key];
    object[key] = (...args: any[]) => {
      log('Fake Function', `CALL ${object}.${key}(${args.join(', ')})`);
      return fakeFunction ? fakeFunction(raw, ...args) : undefined;
    };
  }
}
