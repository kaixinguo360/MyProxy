<template>
  <div class="container">
    <div class="head-container">
      <SearchComponent class="search-container"></SearchComponent>
      <RoundButton @click="$emit('close')">{{resourceService.size}}</RoundButton>
    </div>
    <ResourcesComponent></ResourcesComponent>
  </div>
</template>

<script lang="ts">
import {Component, Inject, Vue} from 'vue-property-decorator';
import {ResourceService} from '../utils/resource-service';
import SearchComponent from './search-component.vue';
import ResourcesComponent from './resources-component.vue';
import RoundButton from './round-button-component.vue';

@Component({
  components: {
    SearchComponent,
    ResourcesComponent,
    RoundButton
  }
})
export default class ContainerComponent extends Vue {
  @Inject() resourceService!: ResourceService;
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 8px;
}
.head-container {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  margin-bottom: 4px;
}
.search-container {
  flex: 1 1 auto;
}
</style>

