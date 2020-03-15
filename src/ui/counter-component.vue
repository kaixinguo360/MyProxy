<template>
  <div class="counter" v-on:click="$emit('open')">
    {{resourceService.size}}
  </div>
</template>

<script lang="ts">
import {Component, Inject, Vue} from 'vue-property-decorator';
import {ResourceService} from '../utils/resource-service';

@Component
export default class CounterComponent extends Vue {
  @Inject() resourceService!: ResourceService;
}
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

