import {absoluteUrl, directUrl, proxyUrl} from '../utils/url-utils'

// ----- Proxy Service ----- //
export class ProxyService {

  private static defaultStrategy = {};
  private static broadcastChannel= new BroadcastChannel('proxyService@strategy');
  public static setStrategy(strategy: ProxyStrategy) {
    ProxyService.defaultStrategy = strategy;
    ProxyService.broadcastChannel.postMessage(strategy);
    localStorage.setItem('proxyService@strategy', JSON.stringify(strategy));
  }
  public static init() {
    const str = localStorage.getItem('proxyService@strategy');
    const strategy = str ? JSON.parse(str) : {};
    ProxyService.setStrategy(strategy);
  }

  public base!: URL;
  public strategy!: ProxyStrategy;
  
  constructor(baseUrl?: string, strategy?: ProxyStrategy) {
    if (baseUrl) {
      this.base = new URL(baseUrl);
    }
    if (strategy) {
      this.strategy = strategy;
    } else {
      this.strategy = ProxyService.defaultStrategy;
    }

    const broadcastChannel= new BroadcastChannel('proxyService@strategy');
    broadcastChannel.addEventListener('message', event => {
      this.strategy = event.data;
    });
  }

  public absolute(url: string, base?: URL) {
    return absoluteUrl(url, base || this.base);
  }
  public proxy(url: string, type?: string, base?: URL) {
    let isProxy = true;
    if (type) {
      if (type in this.strategy) {
        isProxy = this.strategy[type];
      } else if ('default' in this.strategy) {
        isProxy = this.strategy['default'];
      }
    }
    return isProxy ? proxyUrl(url, base || this.base) : this.direct(url, base || this.base);
  }
  public direct(url: string, base?: URL) {
    return directUrl(url, base || this.base);
  }
}

// ----- Proxy Strategy ----- //
export interface ProxyStrategy {
  [type: string]: boolean;
}
