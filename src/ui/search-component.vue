<template>
  <div class="box">
    <input v-model="url" @keyup.enter="submit(url)"/>
    <button @click="submit(url)">Go</button>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {proxy} from '../utils/url-utils';
import {ModifiedWindow} from '../main';
declare var window: ModifiedWindow;

@Component
export default class SearchComponent extends Vue {
  
  url = window.__location?.href;
  
  submit(url: string) {
    localStorage.removeItem('proxy_ui@isOpen');
    location.href = proxy(url);
  }
}
</script>

<style scoped>
.box {
  display: flex;
  flex-direction: row;
  height: 30px;
  overflow: auto;
}
.box > input {
  flex: 1 1 auto;
  
  width: 300px;
  height: 30px;
  padding: 0 10px;
  font-size: 15px;
  
  border-radius: 15px;
  border-style: none;
  
  color: #424242;
  background-color: #F5F5F5;

  overflow: hidden;
}
.box > button {
  flex: 0 0 auto;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;
  margin-left: 4px;
  
  border-radius: 15px;
  border-style: none;

  background-color: #E0E0E0;
  color: white;
  
  cursor: pointer;
}
</style>

