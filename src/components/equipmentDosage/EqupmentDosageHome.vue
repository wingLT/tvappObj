<template>
  <div class="equipment">
    <section class="equipment-content">
      <div class="content">
        <h2>equipment</h2>
      </div>

    </section>
  </div>
</template>
<script>
  import {GlobalVar} from '../../../static/js/utils'
export default {
  name:'equipment',
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
  }

}
</script>

<style scoped></style>
