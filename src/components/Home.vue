<template>
<div class="home">
  <section class="home-content">
    <div class="content">
      <h2>Home</h2>
      <input id="time"/>
    </div>

  </section>

</div>
</template>
<script>
  import {GlobalVar} from '../../static/js/utils'
  import laydate from  '../../static/laydate/laydate'
  export default {
    name:'home',
    data(){
      return{
      }
    },
    mounted:function () {
      var router = {
        url:this.$route.path,
        name:this.$route.name,
        className:'active'
      }
      GlobalVar.setHistoryRouter(router);
      laydate.render({
        elem: '#time' //指定元素
      });
    }

  }
</script>

<style scoped>
  /*@import '../../static/laydate/theme/default/laydate.css';*/
</style>
