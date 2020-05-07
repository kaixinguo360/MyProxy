import ULocation from 'ulocation';
import {debug} from './log-utils';

export function createFakeLocation(href: string): Location {
  let __location = new ULocation(href);
  __location.reload = () => location.reload();
  __location.replace = (url: string) => location.replace(url);
  __location.__proto__ = Location.prototype;
  (window as any).__location = __location;
  (document as any).__location = __location;
  return __location;
}
export function fakeProperty(object: any, key: string, fakeValue: any) {
  Object.defineProperty(object, key, {
    get() {
      debug('Fake Property', `GET ${object}.${key} (=${fakeValue})`);
      return fakeValue;
    },
    set(value) {
      debug('Fake Property', `SET ${object}.${key} (=${value})`);
      fakeValue = value;
    },
    configurable: true
  });
}
export function fakeFunction(object: any, key: string, fakeFunction: (raw: (...args: any) => any, ...args: any) => any) {
  const raw = object[key];
  object[key] = (...args: any[]) => {
    debug('Fake Function', `CALL ${object}.${key}(${args.join(', ')})`);
    return fakeFunction ? fakeFunction(raw, ...args) : undefined;
  };
}
