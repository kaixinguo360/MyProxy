import {debug, log} from '../utils/log-utils';
import {ResourceService} from '../utils/resource-service';
import {direct} from '../utils/url-utils';

export class ServiceWorkerHook {

  private readonly resourceService: ResourceService;
  private readonly href: string;

  // ----- Init ----- //
  constructor(resourceService: ResourceService, href: string) {
    if (!('serviceWorker' in navigator)) {
      log('SW_HOOK', 'UNSUPPORTED');
      throw new Error('[UNSUPPORTED] -> Service Worker');
    }

    this.resourceService = resourceService;
    this.href = href;
    
    this.installServiceWorker();
    this.registerMessageListener();
    
    log('SW_HOOK', 'INIT');
  }
  private installServiceWorker() {
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
  private registerMessageListener() {
    navigator.serviceWorker.addEventListener('message', (e: MessageEvent) => {
      let message = e.data;
      switch (message.type) {
        case 'request':
          return this.handleRequest(message.data);
        default:
          log('SW_HOOK', 'UNSUPPORTED MESSAGE', message);
      }
    });
  }
  
  // ----- Utils Functions ----- //
  private handleRequest(request: {url: string, destination: string}) {
    debug('SW_HOOK', 'REQUEST', request.url, request);
    const url = direct(request.url);
    switch (request.destination) {
      case "image":
        return this.resourceService.add({type: 'image', url, source: this.href});
      case "video":
        return this.resourceService.add({type: 'video', url, source: this.href});
      case "audio":
        return this.resourceService.add({type: 'audio', url, source: this.href});
    }
  }
}
