import $ from 'jquery'
import Vue from 'vue';

import {log} from '../utils';
import RootComponent from './root-component.vue';

// ----- Init ----- //
export default function init() {

  // Create root element
  const rootId = 'hook-ui-root';
  $('body').prepend(`<div id="${rootId}"></div>`);
  new Vue({ render: (h) => h(RootComponent) }).$mount(`#${rootId}`);

  // Log
  log('UI', 'INIT');
}
