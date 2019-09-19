<!--审片 近24小时详情-->
<template>
  <div class="whose-piece content">
    <div class="navigation-cut clear">
      <div class="fl">
        <span></span>
        <span>近24小时审片业务详情</span>
      </div>
      <ul class="fr">
        <li>
          <router-link to="resourdeOption">总体资源消耗率</router-link>
        </li>
        <li>审片资源消耗</li>
        <li>近24小时审片业务详情</li>
      </ul>
    </div>

    <div class="table-details block-area">
      <!--筛选条件-->
      <div class="condition">
        <!--排序-->
        <div class="sort">
          <span class="sort-name">排序：</span>
          <span class="time" @click="sortBySelectCondition($event,1)">开始时间<i class="icon" v-bind:class="isAscStartTime?'wb-arrow-up':'wb-arrow-down'"></i></span>
          <span class="time" @click="sortBySelectCondition($event,2)">结束时间<i class="icon" v-bind:class="isAscEndTime?'wb-arrow-up':'wb-arrow-down'"></i></span>
          <span class="active time" @click="sortBySelectCondition($event,3)">审片时长<i class="icon" v-bind:class="isDurationAsc?'wb-arrow-up':'wb-arrow-down'"></i></span>
          <!--<span class="duration time">处理时长<i class="icon wb-arrow-down"></i></span>-->
        </div>

        <!--审查状态-->
        <div class="name investigate-status">
          <div class="sort-name">
            <i></i>
            <span>审查状态</span>
          </div>
          <div class="select-down dropdown">
            <div>
              <input v-model="examineStatus"/>
              <span  class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down" ></i></span>
              <ul class="no-header down-content dropdown-menu">
                <li @click="selectExamineStatus(0,'全部')">全部</li>
                <li @click="selectExamineStatus(1,'通过')">通过</li>
                <li @click="selectExamineStatus(1,'退回')">退回</li>
              </ul>
            </div>

          </div>
        </div> <!--审查状态  end-->

        <!--审片人员-->
        <div class="redact-user">
          <div class="sort-name">
            <i></i>
            <span>审片人员</span>
          </div>
          <div class="select-down dropdown">
            <div>
              <input v-model="redirectUser">
              <span  class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down"></i></span>

              <ul class="has-header down-content dropdown-menu">
                <li @click="selectRedirectUser(0,'所有成员')" >
                  <span><img src="./../../assets/all-header.png"/></span>
                  <span>所有成员</span>
                </li>
                <li  @click="selectRedirectUser(1,item)" v-for="item in listCensorUser">
                  <span>{{getUserName(item)}}</span>
                  <span>{{item}}</span>
                </li>
              </ul>
            </div>

          </div>
        </div><!--审片人员 end-->

        <!--栏目-->
        <div class="programa">
          <div class="sort-name">
            <i></i>
            <span>栏目</span>
          </div>
          <div class="select-down dropdown">
            <div>
              <input v-model="programaName"/>
              <span class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down"></i></span>

              <ul class="no-header down-content dropdown-menu">
                <li @click="selectProgramaName(0,'全部')">全部</li>
                <li @click="selectProgramaName(1,item)" v-for="item in listProgramName">{{item}}</li>
              </ul>
            </div>
          </div>
        </div> <!--栏目  end-->

      </div><!--筛选条件  end-->
      <!--表格内容-->
      <div class="table-content">
        <table style="table-layout: fixed">
          <thead>
          <tr>
            <!--<th>任务名称</th>-->
            <th class="name">主机名称</th>
            <th class="comm-time">开始时间</th>
            <th class="comm-time">结束时间</th>
            <th class="comm-duration">审查时长</th>
            <th class="comm-status">审查状态</th>
            <th class="comm-user">审片人员</th>
            <th class="comm-program">栏目</th>
          </tr>
          </thead>
        </table>
        <div class="scroll-table">
          <table style="table-layout: fixed">
            <tbody>
            <tr v-for="item in tableData">
              <td class="name">{{item.host}}</td>
              <td class="comm-time">{{item.starttime}}</td>
              <td class="comm-time">{{item.endtime}}</td>
              <td class="comm-duration">{{item.censortimelength}}ms</td>
              <td class="comm-status" v-bind:class="getExamineStatus(item.censorresult)">{{item.censorresult}}</td>
              <td class="comm-user">{{item.censoruser}}</td>
              <td class="comm-program">{{item.programname}}</td>
            </tr>
            </tbody>
          </table>
        </div>

      </div><!--表格内容  end-->

      <!--页码-->
      <div class="page clear">
        <div class="cut-page-number fl">
          <div>每页条数</div>
          <div class="select-down dropdown">
            <div>
              <input v-model="pageSize"/>
              <span class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down"></i></span>
              <ul class="page-number down-content dropdown-menu">
                <li @click="pageSizeLengthCut(15)">15</li>
                <li @click="pageSizeLengthCut(20)">20</li>
                <li @click="pageSizeLengthCut(25)">25</li>
                <li @click="pageSizeLengthCut(30)">30</li>
              </ul>
            </div>

          </div>
          <div>总条数 {{total}}，共 {{totalPages}} 页</div>
        </div>

        <div class="page-number fr">
          <div class="page-turning" id="paging"></div>
          <div class="go-page">
            <span>
              <input v-model="goToPageNum" @keyup="changeBorderColor()" type="number"/>
            </span>
            <span @click="goToPage()">GO</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {GlobalVar} from '../../../static/js/utils'
  import {DateUtils} from '../../../static/js/DateUtils'

  export default {
    name:'whosePiece',
    data(){
      return{
        /*  审查状态  */
        examineStatus:'全部',
        /*审片人员*/
        redirectUser:'全部',
        /*栏目*/
        programaName:'全部',
        tableData:[],
        businessType:'审片',
        businessSn:'',
        goToPageNum:1,
        totalPages:1,//总页数
        total:'',//总条数
        listCensorUser:[],//用户名
        listProgramName:[],//栏目名称
        isDurationAsc:true, //处理时长是否是 升序
        isAscStartTime:true,//开始时间是否是 升序
        isAscEndTime:true,//结束时间是否是 升序
        pageNum:1,//当前页码
        pageSize:15,//每页显示的个数
        objFormate:"",//目标格式
        ascDesc:'asc',
        sortField:'censorTimeLength',//选择的条件
        programName:'',//节目名称
        examineUser:'',//审查人
        examineResult:'',//审查结果
        selectUrl:'&first=&second=&third=',
      }
    },
    methods:{
      getUserName:function (name) {
        return name.substring(name.length-2,name.length);
      },
      /*  审查状态  */
      selectExamineStatus:function (falg,status) {
        var self = this;
        self.examineStatus = status;
        if(Number(falg) == 1){
          this.examineResult = status;
        }else{
          this.examineResult = '';
        }
        this.selectUrl = '&first='+this.examineResult+'&second='+this.examineUser+'&third='+this.programName;
        getAllData(self,this.selectUrl);
      },
      getExamineStatus:function (status) {
        if(status == '通过'){
          return 'pass';
        }else{
          return 'no-pass';
        }
      },
      /*审片人员*/
      selectRedirectUser:function (flag,name) {
        var self = this;
        self.redirectUser = name;
        if(Number(flag) == 1){
          this.examineUser = name;
        }else{
          this.examineUser = '';
        }
        this.selectUrl = '&first='+this.examineResult+'&second='+this.examineUser+'&third='+this.programName;
        getAllData(self,this.selectUrl);
      },
      /*栏目*/
      selectProgramaName:function (flag,name) {
        var self = this;
        self.programaName = name;
        if(Number(flag) == 1){
          this.programName = name;
        }else{
          this.programName = '';
        }
        this.selectUrl = '&first='+this.examineResult+'&second='+this.examineUser+'&third='+this.programName;
        getAllData(self,this.selectUrl);
      },
      sortBySelectCondition:function (event,flag) {
        var self = this;
        $(event.target).parents('div.sort').find('span.time').removeClass('active');
        $(event.target).addClass('active');
        //开始时间：starttime,结束时间：finishtime,处理时长:handletimeS
        //按照选择的条件排序
        //升序asc 降序desc
        if(Number(flag) == 1){
          //开始时间
          this.isAscStartTime = !this.isAscStartTime;
          this.sortField = 'startTime';
          this.ascDesc = this.isAscStartTime?'asc':'desc';
        }else if(Number(flag) == 2){
          //结束时间
          this.isAscEndTime = !this.isAscEndTime;
          this.sortField = 'endTime';
          this.ascDesc = this.isAscEndTime?'asc':'desc';
        }else{
          //处理时长
          this.isDurationAsc = !this.isDurationAsc;
          this.sortField = 'censorTimeLength';
          this.ascDesc = this.isDurationAsc?'asc':'desc';
        }
        getAllData(self,self.selectUrl);
      },
      pageSizeLengthCut:function (pageSize) {
        var self = this;
        this.pageNum = 1;
        this.pageSize = pageSize;
        getAllData(self,this.selectUrl);
      },
      goToPage:function () {
        var self = this;
        if(Number(this.goToPageNum)<=Number(this.totalPages) && Number(this.goToPageNum)>0){
          this.pageNum = this.goToPageNum;
          getAllData(self,this.selectUrl);
        }else{
          $('.page .page-number>div.go-page').css('border-color','#ff6c60');
        }
      },
      changeBorderColor:function () {
        $('.page .page-number>div.go-page').css('border-color','#cccccc');
      }
    },
    updated:function () {
      GlobalVar.setScroll('down-content');
      GlobalVar.setScroll('scroll-table');
    },
    mounted:function () {
      var self = this;
      var receiveBusiness = GlobalVar.getSessionStorageJson('whose-piece');
      if(!GlobalVar.isEmptyObject(receiveBusiness)){
        self.programaName = receiveBusiness.programaName;
        self.businessType = receiveBusiness.businessType;
        self.businessSn = receiveBusiness.businessSn;
      }

      var router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      }
      GlobalVar.setHistoryRouter(router);
      getUserList(self);
      getAllData(self,self.selectUrl);
    }
  }




  //页码
  function pageNumber(pageCount,current,self) {
    $("#paging").CreatePage({
      pageCount: pageCount,//总页数
      current: current,//当前页码
      backFn: function (page) {
        self.pageNum = page;
        //page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
        getAllData(self,self.selectUrl);
      }
    });
  }

  /*
  * first 审查结果
  * second 审查人
  * third 节目名称
  * sortField 排序字段 startTime，endTime,censorTimeLength
  * ascDesc 升序asc 降序desc
  * pageNum 当前页数
  * pageSize 页面大小
  *  ///consumeBusTotal/busTaskInfo/censor
  * */
  function getAllData(self,selectUrl) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlNameW +'consumeBusTotal/busTaskInfo/censor?ascDesc='+self.ascDesc+'&pageNum='+self.pageNum+'&pageSize='+self.pageSize+
      '&sortField='+self.sortField+selectUrl,
      success:function(result){
        if(Number(result.status) == 200){
          self.totalPages = result.data.pages;
          self.total = result.data.total;
          self.tableData = result.data.rows;
          pageNumber(self.totalPages,1,self);
        }
      },error:function (e) {}
    })
  }

  /*
  * 得到审片人和节目名称
  * busTaskInfo/censorFilterList
  * */
  function getUserList(self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlNameW +'consumeBusTotal/busTaskInfo/censorFilterList',
      success:function (result) {
        if(Number(result.status) == 200){
          self.listCensorUser = result.data.listCensorUser;
          self.listProgramName = result.data.listProgramName;
        }
      },error:function (e) {}
    })

  }
</script>


<style scoped>
  @import "../../../static/css/nearly24-details.css";

  .investigate-status ul.down-content{
    height:109px;
  }
  .condition .sort i{
    display: none;
  }
  .condition .sort>span.active i{
    display: inline-block;
  }

  .condition .sort>span.active{
    background-color: #18d96e;
    color: #ffffff;
  }
  div.select-down ul.has-header li>span:first-child {
    width: 29px;
    height: 29px;
    line-height: 32px;
  }


  .table-content th.name,
  .table-content td.name{
    width: 20%;
  }

  .table-content th.comm-time,
  .table-content td.comm-time{
    width: 15%;
  }

  .table-content th.comm-duration,
  .table-content td.comm-duration{
    width: 10%;
  }

  .table-content th.comm-program,
  .table-content td.comm-program{
    width: 20%;
  }

  .table-content th.comm-status,
  .table-content td.comm-status{
    width: 10%;
  }

  .table-content th.comm-user,
  .table-content td.comm-user{
    width: 10%;
  }

  .page .page-number>div.go-page>span input{
    width: 100%;
    border: none;
    border-radius: 4px;
    height: 24px;
    padding-left: 10px;
  }
  .page div.select-down ul.down-content{
    top:-117px;
  }
  .dropdown-menu{
    min-width:55px;
  }


</style>
