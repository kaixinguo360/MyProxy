<template>
  <div class="root">
    <ContainerComponent v-if="isOpen" @close="setOpen(false)"></ContainerComponent>
    <CounterComponent v-else @open="setOpen(true)"></CounterComponent>
  </div>
</template>

<script lang="ts">
import {Component, Provide, Vue} from 'vue-property-decorator'
import ContainerComponent from './container-component.vue';
import CounterComponent from './counter-component.vue';
import {ModifiedWindow} from '../main';
declare var window: ModifiedWindow;

@Component({
  components: {
    ContainerComponent,
    CounterComponent
  }
})
export default class RootComponent extends Vue {
  
  isOpen: boolean;
  @Provide() resourceService = window.resourceService;
  
  constructor() {
    super();
    this.isOpen = Boolean(localStorage.getItem('proxy_ui@isOpen'));
  }
  
  setOpen(isOpen: boolean) {
    isOpen ? localStorage.setItem('proxy_ui@isOpen', 'true') : localStorage.removeItem('proxy_ui@isOpen');
    this.isOpen = isOpen;
  }
}
</script>

<style scoped>
.root {
  position: fixed;
  overflow: hidden;
  z-index: 2147483647;

  top: 24px;
  right: 24px;
  max-width: calc(100vw - 48px);

  font-size: 16px;
  font-family: arial, sans-serif;

  border-radius: 22px;
  background: white;
  box-shadow: 1px 1px 4px 0 #00000066;
}
</style>
