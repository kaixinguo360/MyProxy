import {debug, isProxied, log, proxy} from '../utils';

// ----- Utils Functions ----- //
function submitNode(node) {
  if (!node.tagName) { return; }
  const tagName = node.tagName.toLowerCase();
  switch (tagName) {
    case "img":
      log('DOM_HOOK', 'img', node.src); break;
  }
}
function proxyNode(node, attribute) {
  const url = node[attribute];
  if (!isProxied(url)) {
    submitNode(node);
    const proxied = proxy(url);
    node[attribute] = proxied;
    debug('DOM_HOOK', `The ${node.tagName}.${attribute} attribute was proxied.`,
      '\n-->', url, '\n<--', proxied);
  }
}
function childListChanged(mutation) {
  Array.from(mutation.addedNodes).forEach(node => {
    if (!node.tagName) { return; }
    const tagName = node.tagName.toLowerCase();
    switch (tagName) {
      case 'img':
        proxyNode(node, 'src'); break;
      case 'a':
        proxyNode(node, 'href'); break;
      case 'form':
        proxyNode(node, 'action'); break;
      default: return;
    }
  });
}
function attributesChanged(mutation) {
  const node = mutation.target;
  const attribute = mutation.attributeName;
  proxyNode(node, attribute);
}

// ----- Init ----- //
export default function init() {

  // Add Mutation Observer
  const observer = new MutationObserver(mutations => {
    for(let mutation of mutations) {
      switch (mutation.type) {
        case "childList": childListChanged(mutation); break;
        case "attributes": attributesChanged(mutation); break;
      }
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['src', 'href', 'action'],
    childList: true,
    subtree: true
  });

  // Log
  log('DOM_HOOK', 'INIT');
}
