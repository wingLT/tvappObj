<template>
  <!--业务健康度-->

  <div class="businessHealthHome content">
    <router-view/>
  </div>
</template>

<script>
  import {GlobalVar} from '../../../static/js/utils'
  export default {
    name:'businessHome',
    data(){
      return{
      }
    },
    mounted:function () {
      var self = this;
      //添加历史路由
//      var router = {
//        url:this.$route.path,
//        name:this.$route.name,
//        className:'active'
//      }
//      GlobalVar.setHistoryRouter(router);
    }
  }

</script>

<style scoped>
</style>
