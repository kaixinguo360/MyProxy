<template>
  <button class="round-button" type="button" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

@Component
export default class ContainerComponent extends Vue {
  @Prop() background!: string;
  @Prop() color!: string;
}
</script>

<style scoped>
.round-button {
  flex: 0 0 auto;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 30px;
  height: 30px;
  border-radius: 15px;
  border-style: none;
  margin: 0 2px;
  padding: 0 6px;

  background-color: #BDBDBD;
  color: white;
  cursor: pointer;
}
.round-button:hover {
  background-color: #9E9E9E;
}
</style>

