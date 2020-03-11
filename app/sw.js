import {absUrl, decodeUrl, proxy} from './utils';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('fetch', e => e.respondWith(handleFetch(e)));

function makeRes(body, status = 200, headers = {}) {
  headers['access-control-allow-origin'] = '*';
  return new Response(body, {status, headers});
}

function handleFetch(event) {
  const request = event.request;
  
  if (request.url.startsWith(location.origin + '/proxy/hook.js') || request.url.startsWith(location.origin + '/sockjs-node/')) {
    return fetch(request);
  } else if (request.url.startsWith(location.origin + '/proxy/')) {
    const encodeUrl = request.url.substr(request.url.lastIndexOf('/') + 1);
    const url = decodeUrl(encodeUrl);
    const base = new URL(url);
    return fetch(request)
      .then(res => processResponse(res, request, base))
      .catch(() => makeRes('fetch failed', 504));
  } else if (request.url.startsWith(location.origin)) {
    return self.clients.get(event.clientId).then(client => {
      if (!client.urlObj) {
        const encodeUrl = client.url.substr(client.url.lastIndexOf('/') + 1);
        const urlStr = decodeUrl(encodeUrl);
        client.urlObj = new URL(urlStr);
      }
      const origin = client.urlObj.origin;
      const path = request.url.substr(location.origin.length);
      const urlStr = origin + path;
      return fetchResponse(urlStr, request);
    });
  } else {
    return fetchResponse(request.url, request);
  }
}

function fetchResponse(url, request) {
  const base = new URL(url);
  const proxyUrl = proxy(url, base);
  const req = new Request(proxyUrl, request);
  return fetch(req)
    .then(res => processResponse(res, request, base))
    .catch(() => makeRes('fetch failed', 504));
}

function processResponse(response, request, base) {
  switch (request.destination) {
    
    case 'script':
      return response.text().then(text => {
        const body = text.replace(/location/g, '__location');
        return makeRes(body, 200, response.headers);
      });
      
    case 'document':
      return response.text().then(text => {
        const origin = base.origin;
        const path = base.href.substr(base.origin.length);
        const body = text
          
          // location -> __location
          .replace(/([^.])location/g, '$1__location')
          .replace(/(window\s*\.\s*)location/g, '$1__location')
          .replace(/(document\s*\.\s*)location/g, '$1__location')
          
          // <meta...> -> null
          .replace(/<meta[^<>]+name=['"]referrer['"][^<>]+>/g, '')
          
          // hook.js -> <head...>
          .replace(/<\s*head[^>]*>/g, `<head>\n`
            + `<script>ORIGIN='${origin}';PATH='${path}';</script>\n` 
            + `<script src='/proxy/hook.js'></script>\n`
            + `<meta name='referrer' content='never'>\n`);
        return makeRes(body, 200, response.headers);
      });
      
    case 'style':
      return response.text().then(text => {
        text = text.replace(
          /url\s*\(\s*([^\s]*)\s*\)/g,
          (...str) => `url(${absUrl(str[1], base)})`
        );
        return makeRes(text, 200, response.headers);
      });
      
    default:
      return response;
  }
}
