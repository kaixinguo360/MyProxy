import {log} from '../../utils/log-utils';
import {createFakeLocation, fakeFunction, fakeProperty} from '../../utils/api-utils';
import {ProxyService} from '../proxy-service';

export class ApiService {

  // ----- Init ----- //
  constructor(proxyService: ProxyService, href: string) {
    const urlObj = new URL(href);
    const __location = createFakeLocation(href);

    // history
    fakeFunction(history, 'replaceState', (raw, data, title, url) => {
      __location.href = proxyService.absolute(url);
      raw.call(history, data, title, proxyService.proxy(url));
    });
    fakeFunction(history, 'pushState', (raw, data, title, url) => {
      __location.href = proxyService.absolute(url);
      raw.call(history, data, title, proxyService.proxy(url));
    });

    // document
    fakeProperty(document, 'domain', urlObj.hostname);
    fakeProperty(document, 'URL', urlObj.href);

    // window
    fakeFunction(window, 'open', (raw, url, ...args) => raw(proxyService.proxy(url), ...args));
    
    // Log
    log('API_HOOK', 'INIT');
  }

}
