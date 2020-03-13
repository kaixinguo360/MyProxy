
// ----- Util Functions ----- //

export function log(flag, ...messages) {
  console.log('[' + flag + ']', ...messages);
}
export function debug(flag, ...messages) {
  console.debug('[' + flag + ']', ...messages);
}

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
