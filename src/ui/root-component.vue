<template>
  <div>
    <div class="overlay" v-show="isOpen" @click="close()"></div>
    <div class="panel root-container" ref="container" v-show="isOpen">
      <ContainerComponent @close="close()"></ContainerComponent>
    </div>
    <div class="panel hover" ref="hover" v-draggable="draggableOptions">
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
    marginX: 24,
    marginY: 24,
    key: 'hover',
    moveCallback: () => this.move()
  };
  
  created() {
    addEventListener('resize', () => this.move());
  }
  
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
    const windowWidth = document.documentElement.clientWidth;
    const centerX = windowWidth / 2;
    
    // Magic number
    const threshold = 800;
    const marginX = 12;
    const dX = 34;

    container.style.left = 'unset';
    container.style.right = 'unset';

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
  top: 12px;
  height: calc(100vh - 24px);
  max-width: calc(100vw - 24px);
}
.hover {
  cursor: move;
}
</style>
