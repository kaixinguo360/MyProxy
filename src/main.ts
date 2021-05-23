import * as $ from 'jquery';

import initUI from './ui/init';
import {log} from './utils/log-utils';
import {ResourceService} from './utils/resource-service';

import {DomHook} from './hook/dom-hook';
import {ApiHook} from './hook/api-hook';
import {ServiceWorkerHook} from './hook/sw-hook';
import {ProxyService} from './utils/proxy-service';

(function init() {
  if (window.initialized) { return; }
  window.initialized = true;

  const origin = typeof(ORIGIN) !== "undefined" ? ORIGIN : location.origin;
  const path = typeof(PATH) !== "undefined" ? PATH : location.pathname;
  const standalone = typeof(API) !== "undefined";
  const api = standalone ? API : undefined;

  const href = origin + path;
  log('INIT', href);

  ProxyService.init();

  const proxyService = new ProxyService(standalone, href);
  const resourceService = new ResourceService(proxyService, api);
  window.proxyService = proxyService;
  window.resourceService = resourceService;
  
  window.domHook = new DomHook(resourceService, proxyService, href);
  if (!standalone) {
    window.apiHook = new ApiHook(proxyService, href);
    window.swHook = new ServiceWorkerHook(resourceService, proxyService, href);
  } else {
    (window as any).__location = location;
    (document as any).__location = location;
  }

  $(() => {
    const vue = initUI();
    window.domHook.addBypassElement(vue.$el);
  });
})();

declare var ORIGIN: string;
declare var PATH: string;
declare var API: string;
declare var window: ModifiedWindow;

export class ModifiedWindow extends Window {
  public initialized!: boolean;
  public resourceService!: ResourceService;
  public proxyService!: ProxyService;
  public domHook!: DomHook;
  public swHook!: ServiceWorkerHook;
  public apiHook!: ApiHook;
  public __location!: Location;
}
