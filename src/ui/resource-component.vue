<template>
  <div class="resource-container"
       :class="{'resource-selected': selected}"
       @click="click"
  >
    <div class="resource-entity">
      <img v-if="resource.type==='image'"
           :src="resource.url" alt=""
           @load="onloadImage($event)"
           @error="onerror('img')"
           @abort="onerror('img')"
      />
      <video v-else-if="resource.type==='video'"
             :src="resource.url"
             preload="metadata"
             @loadedmetadata="onloadVideo($event)"
             @error="onerror('video')"
             @abort="onerror('video')"
      />
      <div v-else-if="resource.type==='audio'">Audio</div>
    </div>
    <div class="resource-title" v-if="title">{{title}}</div>
    <div class="resource-description" v-if="description">{{description}}</div>
    <div class="resource-selector">
      <div class="resource-selector-dot" v-if="selected"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Inject, Prop, Vue} from 'vue-property-decorator';
import {Resource, ResourceService} from '../utils/resource-service';
import {debug} from '../utils/log-utils';

@Component
export default class CounterComponent extends Vue {
  
  @Prop() resource!: Resource;
  @Inject() resourceService!: ResourceService;
  
  selected: boolean = false;
  title: string = 'loading...';
  
  get description() {
    return this.resource.description;
  };
  
  created() {
    this.selected = !!this.resource.selected;
  }

  click() {
    this.resource.selected = !this.resource.selected;
    this.selected = this.resource.selected;
  }

  onloadImage($event: Event) {
    const img = $event.target as HTMLImageElement;
    if (img.naturalWidth <= 50 || img.naturalHeight <= 50) {
      debug('RESOURCE_UI', `IMAGE_TOO_SMALL ${img.naturalWidth}x${img.naturalHeight} ${this.resource.url}`);
      this.resourceService.hide(this.resource.url);
    } else {
      this.title = `${img.naturalWidth}x${img.naturalHeight}`;
    }
  }
  onloadVideo($event: Event) {
    const video = $event.target as HTMLVideoElement;
    this.title = `video:${video.videoWidth}x${video.videoHeight}`;
  }
  onerror(type: string) {
    this.title = `${type}:failed`;
  }
}
</script>

<style scoped>
.resource-container {
  width: 100px;
  height: 100px;
  position: relative;
  border-radius: 12px;
  margin: 1px;
  overflow: hidden;
  cursor: pointer;
  background-color: #F5F5F5;
}
.resource-selected {
  width: 96px;
  height: 96px;
  border-style: solid;
  border-width: 2px;
}

.resource-entity {
  width: 100%;
  height: 100%;
}
.resource-entity > * {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.resource-title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  top: 4px;
  left: 4px;
  height: 16px;
  border-radius: 8px;
  color: #212121;
  background-color: #ffffffcc;
  overflow: hidden;
  font-size: 11px;
  padding: 0 4px;
}

.resource-description {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  bottom: 4px;
  left: 4px;
  right: 4px;
  border-radius: 8px;
  color: #616161;
  background-color: #ffffffe6;
  overflow: hidden;
  font-size: 11px;
  padding: 5px;
  max-height: 48px;
}

.resource-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  border-style: solid;
  border-width: 1px;
}
.resource-selector-dot {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background-color: black;
}
</style>

