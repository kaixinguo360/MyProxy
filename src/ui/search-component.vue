<template>
  <div class="search-box">
    <input class="search-input" v-model="url"
           @keyup.enter="location.href=proxyUrl"
           @mousedown="$event.stopPropagation()"/>
    <a :href="proxyUrl" target="_self"><RoundButton>Go</RoundButton></a>
    <a :href="url" target="_self"><RoundButton>To</RoundButton></a>
    <RoundButton @click="toggleProxy()">{{optional?'Off':'On'}}</RoundButton>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import RoundButton from './round-button-component.vue';

import {ModifiedWindow} from '../main';
import {ProxyService} from '../utils/proxy-service';
declare var window: ModifiedWindow;

@Component({
  components: {RoundButton}
})
export default class SearchComponent extends Vue {
  
  url = window.__location.href;
  location = window.location;
  proxyService: ProxyService = window.proxyService;
  
  get proxyUrl() {
    return this.proxyService.proxy(this.url, true);
  }
  get optional() {
    return this.proxyService.optional;
  }

  toggleProxy() {
    ProxyService.setOptional(!this.proxyService.optional);
  }
}
</script>

<style scoped>
.search-box {
  display: flex;
  flex-direction: row;
  height: 30px;
  margin: 0 4px;
  overflow: auto;
}
.search-box > a {
  text-decoration: none;
}
.search-input {
  flex: 1 1 auto;
  
  width: 200px;
  height: 30px;
  padding: 0 10px;
  margin-right: 4px;
  font-size: 15px;
  
  border-radius: 15px;
  border: none;
  
  color: #424242;
  background-color: #F5F5F5;

  overflow: hidden;
}
.search-input:focus {
  width: 296px;
  height: 26px;
  padding: 0 8px;
  border: solid #cce2f5 2px;
  background-color: white;
}
.search-input:focus:hover {
  background-color: white;
}
.search-input:hover {
  background-color: #EEEEEE;
}
</style>

