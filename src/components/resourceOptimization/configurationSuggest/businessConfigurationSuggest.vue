<template>
  <!--业务配置建议-->
  <div class="business-suggest content">
    <div class="navigation-cut clear">
      <div class="fl">
        <span></span>
        <span>7*24小时业务配置建议</span>
      </div>
    </div>

    <div class="suggest-content block-area">
      <div class="top clear">
        <div class="fl day-cut" v-bind:class="hasBeforeDay" @click="getTheDayBefore()">
          <i class="icon wb-chevron-left" ></i>
          <span>前一天</span>
        </div>
        <div class="day-time">
          <span><input readonly v-model="currentTime"/></span>
          <span class="time-icon" id="timeSelect"></span>
        </div>
        <div class="fr day-cut" v-bind:class="hasAfterDay" @click="getTheDayAfter()">
          <span>后一天</span>
          <i class="icon wb-chevron-right" ></i>
        </div>
      </div>
      <div class="table table-title">
        <table>
          <thead>
          <tr>
            <th class="type">业务类型</th>
            <th class="configuration">配置</th>
            <th class="t-time">0：00-6：00</th>
            <th class="t-time">6：00-12：00</th>
            <th class="t-time">12：00-18：00</th>
            <th class="t-time">18：00-24：00</th>
            <th class="operate">操作</th>
          </tr>
          </thead>
        </table>
      </div>
      <div class="table table-body">
        <table v-for="item in tableData">
          <tbody>
          <tr class="editable">
            <td rowspan="4" class="type">
              <span>{{item.devName}}</span>
            </td>
            <td class="configuration"><span>数量（个）</span></td>
            <td class="t-time" v-for="nums in item.configSuggest.num"><input v-bind:value="nums" readonly/></td>
            <td class="operate" rowspan="4">
              <span @click="editorAndSave($event)"><i class="edit"></i><span>编辑</span></span>
              <span @click="resetContent()"><i class="reset"></i>重置</span>
            </td>
          </tr>
          <tr class="editable">
            <td class="configuration"><span>CPU（核）</span></td>
            <td class="t-time" v-for="cpus in item.configSuggest.cpu"><input v-bind:value="cpus" readonly/></td>
          </tr>
          <tr class="editable">
            <td class="configuration"><span>内存（G）</span></td>
            <td class="t-time" v-for="mems in item.configSuggest.mem"><input v-bind:value="mems" readonly/></td>
          </tr>
          <tr class="editable">
            <td class="configuration"><span>磁盘（GB）</span></td>
            <td class="t-time" v-for="disks in item.configSuggest.disk"><input v-bind:value="disks" readonly/></td>
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
  import laydate from '../../../../static/laydate/laydate'

  export default {
    name: 'businessSuggest',
    data() {
      return {
        hasBeforeDay:'non-before-day',
        hasAfterDay:'has-after-day',
        currentTime:DateUtils.format(new Date(),'yyyy年MM月dd日'),
        currentTimeInput:DateUtils.format(new Date(),'yyyy-MM-dd'),
        minTime:DateUtils.format(new Date(),'yyyy-MM-dd'),
        maxTime:'',
        operateData:[],
        tableData:[]
      }
    },
    methods:{
      //前一天的数据
      getTheDayBefore:function() {
        var self = this;
        var currentTimeStr = DateUtils.parse(this.currentTime, 'yyyy-MM-dd');
        var currentTimeFormat = DateUtils.format(currentTimeStr,'yyyy-MM-dd');
        var beforeTime =  getTimeBeforeAndAfterDay(currentTimeFormat,-1);
        if(new Date(beforeTime).getTime() >= new Date(this.minTime).getTime()){
          this.hasAfterDay = 'has-after-day';
          if(new Date(beforeTime).getTime() == new Date(this.minTime).getTime()){
            this.hasBeforeDay = 'non-before-day';
          }else {
            this.hasBeforeDay = 'has-before-day';
          }
          this.currentTime = DateUtils.format(new Date(beforeTime),'yyyy年MM月dd日');
          getDayData(beforeTime,self);
        }

      },
      //后一天的数据
      getTheDayAfter:function () {
        var self = this;
        var currentTimeStr = DateUtils.parse(this.currentTime, 'yyyy-MM-dd');
        var currentTimeFormat = DateUtils.format(currentTimeStr,'yyyy-MM-dd');
        var beforeTime =  getTimeBeforeAndAfterDay(currentTimeFormat,1);
        if(new Date(beforeTime).getTime() <= new Date(this.maxTime).getTime()){
          this.hasBeforeDay = 'has-before-day';
          if(new Date(beforeTime).getTime() == new Date(this.maxTime).getTime()){
            this.hasAfterDay = 'non-after-day';
          }else{
            this.hasAfterDay = 'has-after-day';
          }
          this.currentTime = DateUtils.format(new Date(beforeTime),'yyyy年MM月dd日');
          getDayData(beforeTime,self);
        }

      },
      //编辑保存
      editorAndSave:function(evet){
        return;
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
      //重置
      resetContent:function () {
      },

    },
    updated:function () {
      GlobalVar.setScroll('table-body');
      ///ddd
    },
    mounted: function () {
      var self = this;
      var router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      }
      GlobalVar.setHistoryRouter(router);
      self.maxTime = getTimeBeforeAndAfterDay(self.minTime,6);

      getDayData(self.currentTimeInput,self);

      laydate.render({
        elem: '#timeSelect',
        format:'yyyy年MM月dd日',//指定元素
        min:self.minTime,
        max:self.maxTime,
        change:function (value, date) {},
        done:function (value, date) {
          self.currentTime = value;
          var currStr = DateUtils.parse(value, 'yyyy-MM-dd');
          var currTime = DateUtils.format(new Date(currStr),'yyyy-MM-dd');
          if(new Date(currTime).getTime()>new Date(self.minTime).getTime() && new Date(currTime).getTime()<new Date(self.maxTime).getTime()){
            self.hasAfterDay = 'has-after-day';
            self.hasBeforeDay = 'has-before-day';
          }
          if(new Date(currTime).getTime() == new Date(self.minTime).getTime()){
            self.hasBeforeDay = 'non-before-day';
            self.hasAfterDay = 'has-after-day';
          }
          if(new Date(currTime).getTime() == new Date(self.maxTime).getTime()){
            self.hasAfterDay = 'non-after-day';
            self.hasBeforeDay = 'has-before-day';
          }
          $('#timeSelect').text('');
          getDayData(currTime,self);
        }
      });
    }
  }

  /*
  *得到某天的数据
  * */
  function getDayData(time,self) {
    $.ajax({
      url:GlobalVar.urlName+'suggestConfig/busSuggest/vm?date='+time,
      type: "GET",
      data:{},
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

  /*
  * 得到某一个时间的前后几天
  * time：时间（格式：yyyy-MM-dd）
  * n:前后的天数（负数为前n天，正数为后n天）
  * */
  function getTimeBeforeAndAfterDay(time,n){
    var timeArr= new Array();
    timeArr = time.split("-");
    var year = timeArr[0];
    var month = timeArr[1];
    var day = timeArr[2];
    var t = new Date(year,month-1,day);
    var str = t.getTime()+n*(1000*60*60*24);
    var newDate = new Date();
    newDate.setTime(str);
    var strYear=newDate.getFullYear();
    var strDay=newDate.getDate();
    if(strDay < 10){
      strDay = "0"+strDay;
    }
    var strMonth=newDate.getMonth()+1;
    if(strMonth < 10){
      strMonth = "0"+strMonth;
    }
    var strDate=strYear+"-"+strMonth+"-"+strDay;
    return strDate;
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

  .suggest-content > div.top .day-cut{
    cursor: pointer;
  }

  .suggest-content > div.top div.non-after-day,
  .suggest-content > div.top div.non-before-day{
    cursor: default;
  }
  /*.suggest-content > div.top div.has-after-day i,*/
  .suggest-content > div.top div.has-after-day,
  .suggest-content > div.top div.has-before-day{
    color: #18d96e;
  }

  .suggest-content > div.top div.non-before-day i{
    /*color: #18d96e;*/
  }

  .suggest-content > div.top i:hover{
    /*color: #18d96e;  non-before-day*/
  }


  .suggest-content > div.top {
    width: 100%;
    text-align: center;
    margin-bottom: 30px;
  }

  .suggest-content > div.top > div {
    display: inline-block;
    vertical-align: top;
    font-size: 16px;
    color: #555555;
  }

  .suggest-content > div.top .day-time {
    cursor: pointer;
    font-size: 20px;
  }

  .suggest-content > div.top .day-time span.time-icon {
    width: 21px;
    height: 19px;
    background-image: url("../../../assets/calendar.png");
  }

  .suggest-content > div.top .day-time > span.time-icon:hover {
    background-image: url("../../../assets/calendar-hover.png");
  }

  .suggest-content > div.top .day-time > span {
    display: inline-block;
    vertical-align: top;
  }

  .suggest-content > div.top .day-time input {
    border: none;
    width: 152px;
    outline: none;
  }

  .suggest-content > div.top .day-time > span:last-child {
    margin-top: 6px;
  }

  /*表格*/
  .table {
    width: 1540px;
    padding: 0;
    /*margin: 0;*/
  }

  .table-body {
    margin-top: -23px;
  }

  table .t-time {
    width: 17%;
  }

  table .operate {
    width: 14%;
  }

  table .configuration {
    width: 6%;
  }

  table .type {
    width: 11%;
  }

  .table-body table td {
    height: 53px;
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

</style>
