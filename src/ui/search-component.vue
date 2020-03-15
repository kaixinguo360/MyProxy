<template>
  <div class="search-box">
    <input class="search-input" v-model="url" @keyup.enter="submit(url)"/>
    <RoundButton @click="submit(url)">Go</RoundButton>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {proxy} from '../utils/url-utils';
import {ModifiedWindow} from '../main';
import RoundButton from './round-button-component.vue';
declare var window: ModifiedWindow;

@Component({
  components: {RoundButton}
})
export default class SearchComponent extends Vue {
  
  url = window.__location?.href;
  
  submit(url: string) {
    localStorage.removeItem('proxy_ui@isOpen');
    location.href = proxy(url);
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
.search-input {
  flex: 1 1 auto;
  
  width: 300px;
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

