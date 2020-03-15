<template>
  <div class="container">
    <div class="head-container">
      <SearchComponent class="search-container"></SearchComponent>
      <button class="close-button" @click="$emit('close')">
        {{resourceService.size}}
      </button>
    </div>
    <ContentComponent class="content-container"></ContentComponent>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import SearchComponent from './search-component.vue';
import ContentComponent from './content-component.vue';
import {ModifiedWindow} from '../main';
declare var window: ModifiedWindow;

@Component({
  components: {
    SearchComponent,
    ContentComponent
  }
})
export default class ContainerComponent extends Vue {
  resourceService = window.resourceService;
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
  height: 30px;
  
  margin: 0 4px;
  padding: 0;
}
.content-container {
  margin: 4px;
  padding: 0;
}
.close-button {
  flex: 0 0 auto;
  
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;
  margin-left: 4px;
  border-radius: 15px;
  border-style: none;
  
  background-color: #E0E0E0;
  color: white;
  cursor: pointer;
}
.close-button:hover {
  background-color: #9E9E9E;
}
</style>

