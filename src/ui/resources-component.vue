<template>
  <div class="resources-container">
    <div class="resource-components-container">
      <ResourceComponent
        v-for="resource of resources"
        :resource="resource"
        :key="key(resource)"
      ></ResourceComponent>
    </div>
    <div class="resources-selector-buttons">
      <RoundButton @click="selectAll">{{selectButtonText}}</RoundButton>
      <RoundButton @click="resourceService.save()">Save</RoundButton>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Inject, Vue} from 'vue-property-decorator';
import {Resource, ResourceService} from '../utils/resource-service';
import ResourceComponent from './resource-component.vue';
import RoundButton from './round-button-component.vue';

@Component({
  components: {
    ResourceComponent,
    RoundButton,
  }
})
export default class ContentComponent extends Vue {

  @Inject() resourceService!: ResourceService;
  size = this.resourceService.size;

  get resources() {
    this.size = this.resourceService.size;
    return this.resourceService.getAll();
  }
  get selectButtonText() {
    const size = this.resourceService.size;
    const selected = this.resourceService.selected;
    if (!size || !selected) {
      return 'No selected';
    } else if (size === selected) {
      return `All selected`;
    } else {
      return `${selected} selected`;
    }
  }
  
  key(resource: Resource) {
    return `${resource.url}-${resource.selected}`
  }
  
  selectAll() {
    this.resourceService.selectAll();
    this.$forceUpdate();
  }
}
</script>

<style scoped>
.resources-container {
  height: calc(100% - 38px);
}
.resources-selector-buttons {
  width: 100%;
  margin: 6px 0 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.resource-components-container {
  max-width: 732px;
  max-height: calc(100% - 40px);
  margin: 4px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  overflow-y: auto;
}
</style>
