<template>

</template>

<script>
  import Vue from 'vue'
  import { GlobalVar } from "../../../static/js/utils";
  import template from '../Packages/MainContainer.vue'

  Vue.component(template.name, template);
  export default {
    name: "history-scheduling",
    mounted() {
      let router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      };
      GlobalVar.setHistoryRouter(router);
    }
  }
</script>

<style scoped>

</style>
