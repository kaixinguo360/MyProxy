<template>
  <div class="resources-container">
    <ResourceComponent
      v-for="resource of resources"
      :resource="resource"
      :key="resource.url"
    ></ResourceComponent>
  </div>
</template>

<script lang="ts">
import {Component, Inject, Vue} from 'vue-property-decorator';
import ResourceComponent from './resource-component.vue';
import {ResourceService} from '../utils/resource-service';

@Component({
  components: {ResourceComponent}
})
export default class ContentComponent extends Vue {

  @Inject() resourceService!: ResourceService;
  
  get resources() {
    const size = this.resourceService.size;
    return this.resourceService.getAll();
  }
}
</script>

<style scoped>
.resources-container {
  display: flex;
  flex-wrap: wrap;
  border-radius: 15px;
  justify-content: center;
  overflow-y: auto;
  max-height: calc(100vh - 100px);
}
</style>
