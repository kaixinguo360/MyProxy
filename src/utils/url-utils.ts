
// ----- Util Functions ----- //

export function encodeUrl(url: string) {
  return btoa(url)
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
export function decodeUrl(url: string) {
  return atob(url.replace(/-/g, '+').replace(/_/g, '/'));
}

export function isSpecialUrl(url: string) {
  return url === null
    || url === undefined
    || url.startsWith('javascript:')
    || url.startsWith('data:');
}
export function isAbsoluteUrl(url: string) {
  return isSpecialUrl(url) || url.startsWith('http://') || url.startsWith('https://');
}
export function isProxyUrl(url: string) {
  return isSpecialUrl(url) || url.startsWith(location.origin + '/proxy/');
}
export function isDirectUrl(url: string) {
  return isSpecialUrl(url) || (isAbsoluteUrl(url) && !url.startsWith(location.origin));
}

export function absoluteUrl(url: string, base: URL) {
  if (isAbsoluteUrl(url)) { return url; }
  
  const origin = base.origin;
  const path = base.href.substr(base.origin.length);
  if (url.startsWith('//')) {
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
  if (isProxyUrl(url)) { return url; }
  
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
  if (isDirectUrl(url)) { return url; }
  
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
