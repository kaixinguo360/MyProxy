<template>
  <div>
    <div class="overlay" v-show="isOpen" @click="close()"></div>
    <div class="panel root-container" ref="container" v-show="isOpen">
      <ContainerComponent @close="close()"></ContainerComponent>
    </div>
    <div class="panel" ref="hover" v-draggable="draggableOptions">
      <CounterComponent @open="isOpen?close():open()"></CounterComponent>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Provide, Vue} from 'vue-property-decorator'
import ContainerComponent from './container-component.vue';
import CounterComponent from './counter-component.vue';
import draggable from './draggable-directive';
import {ModifiedWindow} from '../main';
declare var window: ModifiedWindow;

@Component({
  components: {
    ContainerComponent,
    CounterComponent
  },
  directives: {
    draggable
  }
})
export default class RootComponent extends Vue {

  @Provide() resourceService = window.resourceService;
  isOpen = false;
  draggableOptions = {
    top: 24,
    left: 24,
    marginX: 18,
    marginY: 12,
    key: 'hover',
    moveCallback: () => this.move()
  };
  
  open() {
    this.isOpen = true;
    this.move();
  }
  close() {
    this.isOpen = false;
  }
  move() {
    const hover: HTMLElement = this.$refs.hover as HTMLElement;
    const container: HTMLElement = this.$refs.container as HTMLElement;

    const hoverX = hover.offsetLeft + hover.offsetWidth / 2;
    const hoverY = hover.offsetTop + hover.offsetHeight / 2;

    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;

    const centerX = windowWidth / 2;
    const centerY = windowHeight / 2;

    const marginX = this.draggableOptions.marginX;
    const marginY = this.draggableOptions.marginY;
    
    // Magic numbers
    const dX = 22, dY = 34, threshold = 300;

    container.style.top = 'unset';
    container.style.bottom = 'unset';
    container.style.left = 'unset';
    container.style.right = 'unset';

    let targetX, targetY;
    if (hoverX < centerX) {
      targetX = (hoverX < threshold) ? marginX : (hoverX - dX);
      container.style.left = `${targetX}px`;
    } else {
      targetX = (windowWidth - hoverX < threshold) ? marginX : (windowWidth - (hoverX + dX));
      container.style.right = `${targetX}px`;
    }
    if (hoverY < centerY) {
      targetY = hoverY + dY;
      container.style.top = `${targetY}px`;
    } else {
      targetY = windowHeight - (hoverY - dY);
      container.style.bottom = `${targetY}px`;
    }
    container.style.maxWidth = `${windowWidth - targetX - marginX}px`;
    container.style.maxHeight = `${windowHeight - targetY - marginY}px`;
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  z-index: 2147483647;
  top: 0; bottom: 0;
  left: 0; right: 0;
  background-color: #0000004d;
}
.panel {
  position: fixed;
  overflow: hidden;
  z-index: 2147483647;

  font-size: 16px;
  font-family: arial, sans-serif;

  border-radius: 22px;
  background: white;
  box-shadow: 1px 1px 4px 0 #00000066;
}
.root-container {
  height: 100%;
}
</style>
