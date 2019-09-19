<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import upload from "../static/lib/js/yfslImgUpload"
  import "../static/lib/css/imgPlugin.css"


  export default {
    name: 'app',
    mounted() {}
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f5f5f5;
  }
</style>
