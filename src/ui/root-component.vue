<template>
  <div class="root">{{resourceService.size}}</div>
</template>

<script lang="ts">
  import {ModifiedWindow} from '../main';

  declare var window: ModifiedWindow;
export default {
  data: () => ({
    resourceService: window.resourceService
  })
}
</script>

<style scoped>
.root {
  position: fixed;
  top: 0; right: 0;
  z-index: 2147483647;

  margin: 24px;
  padding: 10px;

  font-size: 16px;
  font-family: arial, sans-serif;
  border-radius: 10px;
  background: white;
  box-shadow: 1px 1px 4px 0 #00000066;
}
.root /deep/ html,
.root /deep/ body,
.root /deep/ div,
.root /deep/ span,
.root /deep/ applet,
.root /deep/ object,
.root /deep/ iframe,
.root /deep/ h1,
.root /deep/ h2,
.root /deep/ h3,
.root /deep/ h4,
.root /deep/ h5,
.root /deep/ h6,
.root /deep/ p,
.root /deep/ blockquote,
.root /deep/ pre,
.root /deep/ a,
.root /deep/ abbr,
.root /deep/ acronym,
.root /deep/ address,
.root /deep/ big,
.root /deep/ cite,
.root /deep/ code,
.root /deep/ del,
.root /deep/ dfn,
.root /deep/ em,
.root /deep/ img,
.root /deep/ ins,
.root /deep/ kbd,
.root /deep/ q,
.root /deep/ s,
.root /deep/ samp,
.root /deep/ small,
.root /deep/ strike,
.root /deep/ strong,
.root /deep/ sub,
.root /deep/ sup,
.root /deep/ tt,
.root /deep/ var,
.root /deep/ b,
.root /deep/ u,
.root /deep/ i,
.root /deep/ center,
.root /deep/ dl,
.root /deep/ dt,
.root /deep/ dd,
.root /deep/ ol,
.root /deep/ ul,
.root /deep/ li,
.root /deep/ fieldset,
.root /deep/ form,
.root /deep/ label,
.root /deep/ legend,
.root /deep/ table,
.root /deep/ caption,
.root /deep/ tbody,
.root /deep/ tfoot,
.root /deep/ thead,
.root /deep/ tr,
.root /deep/ th,
.root /deep/ td,
.root /deep/ article,
.root /deep/ aside,
.root /deep/ canvas,
.root /deep/ details,
.root /deep/ embed,
.root /deep/ figure,
.root /deep/ figcaption,
.root /deep/ footer,
.root /deep/ header,
.root /deep/ hgroup,
.root /deep/ menu,
.root /deep/ nav,
.root /deep/ output,
.root /deep/ ruby,
.root /deep/ section,
.root /deep/ summary,
.root /deep/ time,
.root /deep/ mark,
.root /deep/ audio,
.root /deep/ video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
.root /deep/ article,
.root /deep/ aside,
.root /deep/ details,
.root /deep/ figcaption,
.root /deep/ figure,
.root /deep/ footer,
.root /deep/ header,
.root /deep/ hgroup,
.root /deep/ menu,
.root /deep/ nav,
.root /deep/ section {
  display: block;
}
.root /deep/ body {
  line-height: 1;
}
.root /deep/ ol,
.root /deep/ ul {
  list-style: none;
}
.root /deep/ blockquote,
.root /deep/ q {
  quotes: none;
}
.root /deep/ blockquote:before,
.root /deep/ blockquote:after,
.root /deep/ q:before,
.root /deep/ q:after {
  content: '';
  content: none;
}
.root /deep/ table {
  border-collapse: collapse;
  border-spacing: 0;
}
</style>
