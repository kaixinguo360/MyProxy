<template>
  <div class="root">
    <ContainerComponent v-if="isOpen" @close="isOpen=false"></ContainerComponent>
    <CounterComponent v-else @open="isOpen=true"></CounterComponent>
  </div>
</template>

<script lang="ts">
  import ContainerComponent from './container-component.vue';
  import CounterComponent from './counter-component.vue';

  export default {
  data: () => ({isOpen: false}),
  components: {ContainerComponent, CounterComponent},
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
