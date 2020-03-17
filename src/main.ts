import * as $ from 'jquery';

import initUI from './ui/init';
import {log} from './utils/log-utils';
import {ResourceService} from './utils/resource-service';

import {DomHook} from './hook/dom-hook';
import {ApiHook} from './hook/api-hook';
import {ServiceWorkerHook} from './hook/sw-hook';

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

  $(() => {
    const vue = initUI();
    window.domHook?.addBypassElement(vue.$el);
  });
})();

declare var ORIGIN: string;
declare var PATH: string;
declare var window: ModifiedWindow;

export class ModifiedWindow extends Window {
  public initialized?: boolean;
  public resourceService?: ResourceService;
  public domHook?: DomHook;
  public swHook?: ServiceWorkerHook;
  public apiHook?: ApiHook;
  public __location?: Location;
}
