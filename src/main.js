import $ from 'jquery';

import initUI from './ui/init';
import {log} from "./utils/log-utils";
import {ResourceService} from "./utils/resource-service";

import {DomHook} from './hook/dom-hook.ts';
import {ApiHook} from './hook/api-hook';
import {ServiceWorkerHook} from './hook/sw-hook.ts';

(function init() {
  if (window.initialized) { return; }
  window.initialized = true;

  const href = ORIGIN + PATH;
  log('INIT', href);

  const resourceService = new ResourceService();
  window.resourceService = resourceService;
  window.domHook = new DomHook(resourceService, href);
  window.apiHook = new ApiHook(href);
  window.swHook = new ServiceWorkerHook(resourceService, href);

  $(initUI);
})();

