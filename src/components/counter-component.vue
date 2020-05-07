<template>
  <div class="counter">
    <RoundButton @click="$emit('open')">{{resourceService.size}}</RoundButton>
  </div>
</template>

<script lang="ts">
import {Component, Inject, Vue} from 'vue-property-decorator';
import {ResourceService} from '../services/resource-service';
import RoundButton from './round-button-component.vue';

@Component({
  components: {RoundButton}
})
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
}
</style>

