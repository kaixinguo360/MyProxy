<template>
  <div>
    <div class="myui-overlay" v-show="isOpen" @click="close()"></div>
    <div class="myui-panel myui-root-container" ref="container" v-show="isOpen">
      <ContainerComponent @close="close()"></ContainerComponent>
    </div>
    <div class="myui-panel myui-hover" ref="hover" v-draggable="draggableOptions">
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
    key: 'hover',
    moveCallback: () => this.locate()
  };
  
  created() {
    addEventListener('resize', () => this.locate());
  }
  
  open() {
    this.isOpen = true;
    this.locate();
  }
  close() {
    this.isOpen = false;
  }
  locate() {
    if (!this.isOpen) {
      return;
    }
    
    const hover: HTMLElement = this.$refs.hover as HTMLElement;
    const container: HTMLElement = this.$refs.container as HTMLElement;

    const hoverX = hover.offsetLeft + hover.offsetWidth / 2;
    const windowWidth = window.innerWidth;
    const centerX = windowWidth / 2;
    
    // Magic number
    const threshold = 800;
    const marginX = 12;
    const marginY = 12;
    const dX = 34;

    container.style.left = 'unset';
    container.style.right = 'unset';
    container.style.maxHeight = window.innerHeight - 2 * marginY + 'px';

    if (windowWidth < threshold) {
      container.style.left = `${marginX}px`;
      container.style.right = `${marginX}px`;
    } else {
      if (hoverX < centerX) {
        const left = hoverX + dX;
        container.style.left = `${left}px`;
      } else {
        const right = windowWidth - (hoverX - dX);
        container.style.right = `${right}px`;
      }
    }
  }
}
</script>

<style scoped>
.myui-overlay {
  position: fixed;
  z-index: 2147483647;
  top: 0; bottom: 0;
  left: 0; right: 0;
  background-color: #0000004d;
}
.myui-panel {
  position: fixed;
  overflow: hidden;
  z-index: 2147483647;

  font-size: 16px;
  font-family: arial, sans-serif;

  border-radius: 22px;
  background: white;
  box-shadow: 1px 1px 4px 0 #00000066;
}
.myui-root-container {
  top: 12px;
  height: calc(100vh - 24px);
}
.myui-hover {
  cursor: move;
}
</style>
