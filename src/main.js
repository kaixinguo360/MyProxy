import $ from 'jquery';
import {log} from './utils';
import initApiHook from './hook/api-hook';
import initDomHook from './hook/dom-hook';
import initServiceWorker from './hook/sw-hook';
import initUI from './app/init';

(function init() {
  if (window.initialized) { return; }
  window.initialized = true;

  const href = ORIGIN + PATH;
  log('INIT', `${href}`);

  initServiceWorker();
  initApiHook(href);
  initDomHook();
  $(initUI);
})();

