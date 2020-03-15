<template>
  <div class="counter" v-on:click="$emit('open')">
    {{resourceService.size}}
  </div>
</template>

<script lang="ts">
  import {ModifiedWindow} from '../main';

  declare var window: ModifiedWindow;
export default { data: () => ({
    resourceService: window.resourceService
}) }
</script>

<style scoped>
.counter {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 44px;
  height: 44px;
  
  font-weight: 600;
  font-size: 17px;
  
  color: #757575;
  cursor: pointer;
}
.counter:hover {
  background-color: #E0E0E0;
}
</style>

