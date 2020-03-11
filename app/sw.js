import {absUrl, decodeUrl, proxy} from './utils';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('fetch', e => e.respondWith(handleFetch(e)));

// ----- Handlers ----- //
function handleFetch(event) {
  const request = event.request;
  
  if (request.url.startsWith(location.origin)) {
    const path = request.url.substr(location.origin.length);
    if (path.startsWith('/proxy/hook.js') || path.startsWith('/proxy/add') || path.startsWith('/sockjs-node/')) {
      return fetch(request);
    } else if (path.startsWith('/proxy/')) {
      return handleSamePathUrl(event, request);
    } else {
      return handleSameOriginUrl(event, request);
    }
  } else {
    return fetchResponse(request.url, request);
  }
}
function handleSamePathUrl(event, request) {
  let encodeUrl, url;

  // get encodeUrl
  if (request.url.startsWith(location.origin + '/proxy/static/')) {
    encodeUrl = request.url.substr((location.origin + '/proxy/static/').length);
  } else if (request.url.startsWith(location.origin + '/proxy/page/')) {
    encodeUrl = request.url.substr((location.origin + '/proxy/page/').length);
  }

  // get url
  try {
    url = decodeUrl(encodeUrl);
  } catch (e) {
    return getClientBase(event.clientId).then(base => {
      const urlStr = absUrl(encodeUrl, base);
      return fetchResponse(urlStr, request);
    });
  }

  const base = new URL(url);
  return fetch(request)
    .then(res => processResponse(res, request, base))
    .catch(() => makeRes('fetch failed', 504));
}
function handleSameOriginUrl(event, request) {
  return getClientBase(event.clientId).then(base => {
    const origin = base.origin;
    const path = request.url.substr(location.origin.length);
    const urlStr = origin + path;
    return fetchResponse(urlStr, request);
  });
}

// ----- Response ----- //
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

// ----- Utils ----- //
function makeRes(body, status = 200, headers = {}) {
  headers['access-control-allow-origin'] = '*';
  return new Response(body, {status, headers});
}
function getClientBase(clientId) {
  return self.clients.get(clientId).then(client => {
    if (!client.base) {
      const encodeUrl = client.url.substr(client.url.lastIndexOf('/') + 1);
      const urlStr = decodeUrl(encodeUrl);
      client.base = new URL(urlStr);
    }
    return client.base;
  });
}
