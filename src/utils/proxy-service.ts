
// ----- Util Functions ----- //

export function encodeUrl(url: string) {
  return btoa(url)
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
export function decodeUrl(url: string) {
  return atob(url.replace(/-/g, '+').replace(/_/g, '/'));
}

export function isAbsoluteUrl(url: string) {
  return (url.startsWith('http://') || url.startsWith('https://'));
}
export function isProxyUrl(url: string) {
  return url.startsWith(location.origin + '/proxy/');
}
export function isDirectUrl(url: string) {
  return isAbsoluteUrl(url) && !url.startsWith(location.origin);
}

export function absoluteUrl(url: string, base: URL) {
  const origin = base.origin;
  const path = base.href.substr(base.origin.length);
  if (url === null || url === undefined) {
    return url;
  } else  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  } else if (url.startsWith('//')) {
    return location.protocol + url;
  } else if (url.startsWith('/')) {
    return origin + url;
  } else if (url) {
    return origin + path + '/' + url;
  } else {
    return origin + path;
  }
}
export function proxyUrl(url: string, base: URL) {
  const urlStr = absoluteUrl(url, base);

  if (urlStr.startsWith(location.origin + '/proxy/')) {
    return urlStr;
  } else if (urlStr.startsWith(location.origin)) {
    return `${location.origin}/proxy/static/${encodeUrl(
      urlStr.replace(location.origin, base.origin)
    )}`;
  } else {
    return `${location.origin}/proxy/static/${encodeUrl(urlStr)}`;
  }
}
export function directUrl(url: string, base: URL) {
  const urlStr = absoluteUrl(url, base);

  if (urlStr.startsWith(location.origin + '/proxy/')) {
    if (urlStr.startsWith(location.origin + '/proxy/static/')) {
      const encodeUrl = urlStr.substr((location.origin + '/proxy/static/').length);
      return decodeUrl(encodeUrl);
    } else if (urlStr.startsWith(location.origin + '/proxy/page/')) {
      const encodeUrl = urlStr.substr((location.origin + '/proxy/page/').length);
      return decodeUrl(encodeUrl);
    } else {
      throw new Error(`Can not decode this url: ${url}`);
    }
  } else if (urlStr.startsWith(location.origin)) {
    return base.origin + urlStr.substr(location.origin.length);
  } else {
    return urlStr;
  }
}

// ----- Proxy Service ----- //

export class ProxyService {

  private static broadcastChannel= new BroadcastChannel('proxyService@setOptional');
  public static setOptional(optional: boolean) {
    ProxyService.broadcastChannel.postMessage(optional);
    if (optional) {
      localStorage.setItem('proxyService@optional', 'true');
    } else {
      localStorage.removeItem('proxyService@optional');
    }
  }
  public static init() {
    const optional = !!localStorage.getItem('proxyService@optional');
    ProxyService.setOptional(optional);
  }

  public base!: URL;
  public optional!: boolean;
  
  constructor(baseUrl?: string, optional = false) {
    if (baseUrl) {
      this.base = new URL(baseUrl);
    }
    this.optional = optional;

    const broadcastChannel= new BroadcastChannel('proxyService@setOptional');
    broadcastChannel.addEventListener('message', event => {
      this.optional = event.data;
    });
  }

  public absolute(url: string, base?: URL) {
    return absoluteUrl(url, base || this.base);
  }
  public proxy(url: string, force = false, base?: URL) {
    return (force || !this.optional) ? proxyUrl(url, base || this.base) : this.absolute(url, base || this.base);
  }
  public direct(url: string, base?: URL) {
    return directUrl(url, base || this.base);
  }
}
