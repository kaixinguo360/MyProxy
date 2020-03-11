import {log} from './utils';
import initApiHook from './hook/api-hook.js';
import initDomHook from './hook/dom-hook.js';
import initServiceWorker from './hook/sw-hook.js';

const href = ORIGIN + PATH;
log('INIT', `${href}`);

initServiceWorker();
initApiHook(href);
initDomHook();
