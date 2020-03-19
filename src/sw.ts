/// <reference lib="WebWorker" />
import {decodeUrl, ProxyService} from './utils/proxy-service';

declare var self: ServiceWorkerGlobalScope;

// ----- Proxy Service ----- //
const proxyService = new ProxyService();

// ----- Event Listener ----- //
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('fetch', e => e.respondWith(handleFetch(e)));

// ----- Fetch Handlers ----- //
function handleFetch(event: FetchEvent): Promise<any> {
  const request = event.request;

  if (request.url.startsWith(location.origin)) {
    const path = request.url.substr(location.origin.length);
    if (path.startsWith('/proxy/hook.js') || path.startsWith('/sockjs-node/')) {
      return fetch(request);
    } else if (path.startsWith('/proxy/')) {
      return handleFetch_SamePath(event);
    } else {
      return handleFetch_SameOrigin(event);
    }
  } else {
    return beforeRequest(event, request.url);
  }
}
function handleFetch_SamePath(event: FetchEvent): Promise<any> {
  const request = event.request;

  // get encodeUrl
  let encodeUrl: string;
  if (request.url.startsWith(location.origin + '/proxy/static/')) {
    encodeUrl = request.url.substr((location.origin + '/proxy/static/').length);
  } else if (request.url.startsWith(location.origin + '/proxy/page/')) {
    encodeUrl = request.url.substr((location.origin + '/proxy/page/').length);
  } else {
    throw new Error(`Can't recognize this url: ${request.url}`);
  }

  // get url
  let url: string;
  try {
    url = decodeUrl(encodeUrl);
  } catch (e) {
    return getClientBase(event.clientId).then(base => {
      const urlStr = proxyService.absolute(encodeUrl, base);
      return beforeRequest(event, urlStr);
    });
  }

  const base = new URL(url);
  return afterRequest(event, request, base);
}
function handleFetch_SameOrigin(event: FetchEvent): Promise<any> {
  return getClientBase(event.clientId).then(base => {
    const origin = base.origin;
    const path = event.request.url.substr(location.origin.length);
    const urlStr = origin + path;
    return beforeRequest(event, urlStr);
  });
}

// ----- Request & Response ----- //
function beforeRequest(event: FetchEvent, url: string) {
  const request = event.request;
  const base = new URL(url);
  const proxyUrl = proxyService.proxy(url, request.destination, base);
  const req = (proxyUrl !== url) ? new Request(proxyUrl, request) : request;

  postMessage(event.clientId, 'request', {
    destination: request.destination, url
  });

  return afterRequest(event, req, base);
}
function afterRequest(event: FetchEvent, request: Request, base: URL) {
  return fetch(request)
    .then(res => res.ok ?
      handleResponse(event, res, base) :
      handleException(event, res, base))
    .catch(() => handleException(event, null, base));
}
function handleResponse(event: FetchEvent, response: Response, base: URL) {
  const request = event.request;
  switch (request.destination) {

    case 'script':
      return response.text().then(text => {
        const body = text.replace(/location/g, '__location');
        return makeResponse(body, 200, response.headers);
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
          .replace(/(<\s*head[^>]*>)/g, `$1\n`
            + `<script>ORIGIN='${origin}';PATH='${path}';</script>\n`
            + `<script src='/proxy/hook.js'></script>\n`
            + `<meta name='referrer' content='never'>\n`);
        return makeResponse(body, 200, response.headers);
      });

    case 'style':
      return response.text().then(text => {
        text = text.replace(
          /url\s*\(\s*([^\s]*)\s*\)/g,
          (...str) => `url(${proxyService.absolute(str[1], base)})`
        );
        return makeResponse(text, 200, response.headers);
      });

    default:
      return response;
  }
}

// ----- Exception Handlers ----- //
function handleException(event: FetchEvent, response: Response | null, base: URL): Response | Promise<any> {
  const request = event.request;
  if (request.destination === 'document') {
    return showFail(event, response, base);
  } else {
    return makeResponse('fetch failed', 504);
  }
}
function showFail(event: FetchEvent, response: Response | null, base: URL) {
  const request = event.request;
  const title = response ? response.statusText : 'Network Error';
  const body = `
                    <h3>${title}</h3>
                    <br>Origin URL: ${base.href}
                    <br>Proxy URL: ${request.url}
                    ${response?`<br>Status: ${response.status}`:''}
  `;
  return handleResponse(event, makeHtmlResponse(title, body), base);
}

// ----- Utils ----- //
function makeHtmlResponse(title: string, body: string) {
  return makeResponse(`
                    <html lang="CN-zh">
                    <head><title>${title}</title></head>
                    <body>${body}</body>
                    </html>
    `, 200, {
    'content-type': 'text/html'
  });
}
function makeResponse(body: any, status = 200, headers: any = {}): Response {
  headers['access-control-allow-origin'] = '*';
  return new Response(body, {status, headers});
}
function getClientBase(clientId: string): Promise<URL> {
  return self.clients.get(clientId).then(client => {
    if (!client.base) {
      const encodeUrl = client.url.substr(client.url.lastIndexOf('/') + 1);
      const urlStr = decodeUrl(encodeUrl);
      client.base = new URL(urlStr);
    }
    return client.base;
  });
}
function postMessage(clientId: string, type: string, data: any) {
  return self.clients.get(clientId).then(client => {
    client.postMessage({ type, data });
  });
}
