import $ from 'jquery'
import Vue from 'vue';

import RootComponent from './root-component.vue';
import {log} from "../utils/log-utils";

// ----- Init ----- //
export default function init() {

  // Create root element
  const rootId = 'hook-ui-root';
  $('body').prepend(`<div id="${rootId}"></div>`);
  new Vue({ render: (h) => h(RootComponent) }).$mount(`#${rootId}`);

  // Log
  log('UI', 'INIT');
}
