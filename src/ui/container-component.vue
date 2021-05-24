<template>
  <div class="myui-container">
    <SearchComponent class="myui-search-container"></SearchComponent>
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
.myui-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 8px;
  height: calc(100% - 16px);
}
.myui-search-container {
  margin-bottom: 4px;
}
</style>

