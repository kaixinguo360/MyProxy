import Vue from 'vue';
import {CreateElement} from 'vue/types/vue';

import {log} from '../utils/log-utils';
import RootComponent from './root-component.vue';

// ----- Init ----- //
export default function init() {

  // Create root element
  const host = document.createElement('div');

  const body = document.querySelector('body');
  if (body) {
    body.append(host);
  } else {
    document.documentElement.append(host);
  }

  // Mount vue component
  const vue = new Vue({ render: (h: CreateElement) => h(RootComponent) }).$mount(host);

  // Log
  log('UI', 'INIT');
  
  return vue;
}
