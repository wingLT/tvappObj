<template>
  <!--后台服务器配置建议-->
  <div class="server-suggest content">
    <div class="navigation-cut clear">
      <div class="fl">
        <span></span>
        <span>后台服务器配置建议</span>
      </div>
    </div>

    <div class="suggest-content block-area">

      <div class="table table-title">
        <table>
          <thead>
          <tr>
            <th class="type">业务类型</th>
            <th class="t-time">虚拟机</th>
            <th class="t-time">CPU</th>
            <th class="t-time">内存</th>
            <th class="t-time">磁盘</th>
            <th class="operate">操作</th>
          </tr>
          </thead>
        </table>
      </div>
      <div class="table table-body">
        <table v-for="item in tableData">
          <tbody>
          <tr>
            <td :rowspan="getRowspan(item.list)" class="type">
              <span>{{item.hostName}}</span>
            </td>
            <td class="t-time">（宿主机）</td>
            <td class="t-time">{{item.hostCpu}}核</td>
            <td class="t-time">{{item.hostMem}}G</td>
            <td class="t-time">{{item.hostDisk}}G</td>
            <td class="operate" :rowspan="getRowspan(item.list)">
              <span @click="editorAndSave($event)"><i class="edit"></i><span>编辑</span></span>
              <span><i class="reset"></i>重置</span>
            </td>
          </tr>
          <tr class="editable" v-for="lists in item.list">
            <!--<td class="t-time"><input  v-bind:value="lists.devName"/></td>-->
            <td class="t-time">{{lists.devName}}</td>
            <td class="t-time"><input v-bind:value="lists.cpu+'核'"/></td>
            <td class="t-time"><input v-bind:value="lists.mem+'G'"/></td>
            <td class="t-time"><input v-bind:value="lists.disk+'G'"/></td>
          </tr>
          </tbody>
        </table>


      </div>
    </div>
  </div>
</template>
<script>
  import {GlobalVar} from '../../../../static/js/utils'
  import {DateUtils} from '../../../../static/js/DateUtils'

  export default {
    name: 'serverSuggest',
    data() {
      return {
        operateData:[],
        tableData:[],
        currentTime:DateUtils.format(new Date(),'yyyy-MM-dd')
      }
    },
    methods:{
      getRowspan:function (list) {
        return list.length + 1;
      },
      editorAndSave:function(evet){
        return;
        //编辑保存
        var isExist =  $(evet.target).parents('table.edit-active').length;
        if(Number(isExist) == 1){
          //表示是要保存   保存====>编辑
          $('.table-body table.edit-active td.operate>span:first-child>span').text('编辑');
          $(evet.target).parents('table.edit-active').find('input').attr("readonly","readonly");
          $(evet.target).parents('table').removeClass('edit-active');
        }else{
          $(evet.target).parents('table').addClass('edit-active');
          $(evet.target).parents('table.edit-active').find('input').removeAttr('readonly');
          $(evet.target).parents('table.edit-active').find('input').focus();
          //表示是要编辑   编辑====>保存
          $('.table-body table.edit-active td.operate>span:first-child>span').text('保存');
        }
      },
    },
    mounted: function () {
      var self = this;
      var router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      }
      GlobalVar.setHistoryRouter(router);
      GlobalVar.setScroll('table-body');
      getDayData(self.currentTime,self);
    }
  }

  /*
  *得到某天的数据
  * */
  function getDayData(time,self) {
    $.ajax({
      url:GlobalVar.urlName+'server/vmConfiger',
      type: "GET",
      success:function (data) {
        if(Number(data.status) == 200){
          self.operateData = data.data;
          self.tableData = data.data;
        }
      },
      error:function () {

      }
    })
  }



</script>

<style scoped>
  @import "../../../../static/css/configuration-suggest.css";
  .suggest-content {
    width: 1600px;
    height: 823px;
    border-radius: 2px;
    margin-top: 19px;
    padding: 30px;
  }
  /*表格*/
  .table {
    width: 1540px;
  }

  .table-body {
    margin-top: -23px;
  }

  table .t-time {
    width: 17%;
  }

  table .operate {
    width: 15%;
  }

  table .type {
    width: 11%;
  }

  .table-body table td {
    height: 70px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .table-body table td input{

  }

  .table-body table .operate i.edit {
    background-image: url("../../../assets/edit-table.png");
  }

  .table-body table .operate i.reset {
    background-image: url("../../../assets/reset.png");
  }

  .table-body table .operate > span{
    cursor: not-allowed;
  }
  .table-body table .type > span{
    padding: 0 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
