<template>
    <div class="main-container">
      <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "main-container"
    }
</script>

<style scoped>
  .main-container{
    width: 1600px;
    margin: 0 auto;
    padding-bottom: 46px;
    box-sizing: border-box;
    padding-top: 15px;
    /*min-height: 100%;*/
   min-height: calc(100vh - 136px);
  }

</style>
