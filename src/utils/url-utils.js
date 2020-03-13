
// ----- Util Functions ----- //

export function encodeUrl(url) {
  return btoa(url)
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
export function decodeUrl(url) {
  return atob(url.replace(/-/g, '+').replace(/_/g, '/'));
}

export function absUrl(url, base) {
  const origin = base ? base.origin : ORIGIN;
  const path = base ? base.href.substr(base.origin.length) : PATH;
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
export function isAbsUrl(url) {
  return (url.startsWith('http://') || url.startsWith('https://'));
}

export function proxy(url, base) {
  const urlStr = absUrl(url, base);

  if (urlStr.startsWith(location.origin + '/proxy/')) {
    return urlStr;
  } else if (urlStr.startsWith(location.origin)) {
    return `${location.origin}/proxy/static/${encodeUrl(
      urlStr.replace(location.origin, base ? base.origin : ORIGIN)
    )}`;
  } else {
    return `${location.origin}/proxy/static/${encodeUrl(urlStr)}`;
  }
}
export function isProxied(url) {
  return url.startsWith(location.origin + '/proxy/');
}

export function direct(url, base) {
  const urlStr = absUrl(url, base);

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
    return (base ? base.origin : ORIGIN) + urlStr.substr(location.origin.length);
  } else {
    return urlStr;
  }
}
export function isDirect(url) {
  return isAbsUrl(url) && !url.startsWith(location.origin);
}
