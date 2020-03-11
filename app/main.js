import initApiHook from './hook/api-hook.js';
import initDomHook from './hook/dom-hook.js';
import initServiceWorker from './hook/sw-hook.js';

initServiceWorker();
initApiHook(ORIGIN + PATH);
initDomHook();
// history.pushState('','', PATH);
