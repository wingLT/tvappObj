<template>
  <!--其他 近24小时详情-->
  <div class="other-nearly24 content">
    <div class="navigation-cut clear">
      <div class="fl">
        <span></span>
        <span>近24小时{{businessType}}业务详情</span>
      </div>
      <ul class="fr">
        <li>
          <router-link to="resourdeOption">总体资源消耗率</router-link>
        </li>
        <li>{{businessType}}资源消耗</li>
        <li>近24小时{{businessType}}业务详情</li>
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
          <span class="active time" @click="sortBySelectCondition($event,3)">处理时长<i class="icon" v-bind:class="isDurationAsc?'wb-arrow-up':'wb-arrow-down'"></i></span>
          <span class="time" style="display: none">处理效率</span>
          <!--<span class="duration time">处理时长<i class="icon wb-arrow-down"></i></span>-->
        </div>

        <!--源格式-->
        <div class="name" style="display: none">
          <div class="sort-name">
            <i></i>
            <span>源格式</span>
          </div>
          <div class="select-down dropdown">
            <div>
              <input v-model="sourceFormat"/>
              <span @click="showSourceFormat()" class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down"></i></span>

              <ul class="no-header down-content dropdown-menu" >
                <li @click="selectSourceFormat(0)">全部</li>
                <li @click="selectSourceFormat(1)">源格式1</li>
                <li @click="selectSourceFormat(1)">源格式2</li>
                <li @click="selectSourceFormat(1)">源格式2</li>
                <li @click="selectSourceFormat(1)">源格式2</li>
                <li @click="selectSourceFormat(1)">源格式2</li>
              </ul>
            </div>

          </div>
        </div> <!--源格式  end-->

        <!--目标格式-->
        <div class="redact-user">
          <div class="sort-name">
            <i></i>
            <span>目标格式</span>
          </div>
          <div class="select-down dropdown">
            <div>
              <input v-model="goalFormat">
              <span  class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down"></i></span>
              <ul class="down-content dropdown-menu">
                <li @click="selectGoalFormat(0,'全部')">全部</li>
                <li  @click="selectGoalFormat(1,item)" v-for="item in goalFormatData">{{item}}</li>
              </ul>
            </div>

          </div>
        </div><!--目标格式 end-->

        <!--栏目-->
        <div class="programa" style="display: none">
          <div class="sort-name">
            <i></i>
            <span>栏目</span>
          </div>
          <div class="select-down dropdown">
            <div>
              <input v-model="programaName"/>
              <span @click="showProgramaName()" class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down"></i></span>

              <ul class="down-content dropdown-menu">
                <li @click="selectProgramaName(0)">全部</li>
                <li @click="selectProgramaName(1)">养生堂</li>
                <li @click="selectProgramaName(1)">北京新闻</li>
                <li @click="selectProgramaName(1)">北京新闻</li>
                <li @click="selectProgramaName(1)">北京新闻</li>
                <li @click="selectProgramaName(1)">北京新闻</li>
              </ul>
            </div>

          </div>
        </div> <!--栏目  end-->

      </div><!--筛选条件  end-->
      <!--表格内容-->
      <div class="table-content">
        <table>
          <thead>
          <tr>
            <th>任务名称</th>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>处理时长</th>
            <th>目标格式</th>
            <th style="display: none">源格式</th>
            <th style="display: none">处理效率</th>
            <th style="display: none">栏目</th>
          </tr>
          </thead>
        </table>
        <div class="scroll-table">
          <table>
            <tbody>
            <tr v-for="item in tableData">
              <td >{{item.taskName}}</td>
              <td >{{item.startTime}}</td>
              <td >{{item.endTime}}</td>
              <td >{{item.handleTimes}}s</td>
              <td >{{item.objctFormat}}</td>
              <td style="display: none">源格式</td>
              <td style="display: none">显示处理效率</td>
              <td style="display: none">显示栏目名称</td>
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
              <input  v-model="pageSize"/>
              <span class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down"></i></span>
              <ul class="page-number down-content dropdown-menu">
                <li @click="pageSizeLengthCut(15)">15</li>
                <li @click="pageSizeLengthCut(20)">20</li>
                <li @click="pageSizeLengthCut(25)">25</li>
                <li @click="pageSizeLengthCut(30)">30</li>
              </ul>
            </div>

          </div>
          <div>总条数 {{totalPage}}，共 {{totalNumber}} 页</div>
        </div>

        <div class="page-number fr">
          <div class="page-turning" id="paging"></div>
          <div class="go-page">
            <span id="appointPage">
              <input  @keyup="changeBorderColor()" type="number" v-model="appointPage"/>
            </span>
            <span @click="goAppointPage()">GO</span>
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
    name:'otherNearly24',
    data(){
      return{
        /*  源格式  */
        isShowSourceFormat:false,
        sourceFormat:'全部',
        /*目标格式*/
        goalFormat:'全部',
        goalFormatData:[],
        /*栏目*/
        isShowProgramaName:false,
        programaName:'全部',
        tableData:[],
        cutPageNumber:false,
        businessType:'',
        businessSn:'',

        isDurationAsc:true, //处理时长是否是 升序
        isAscStartTime:true,//开始时间是否是 升序
        isAscEndTime:true,//结束时间是否是 升序
        pageNum:1,//当前页码
        pageSize:15,//每页显示的个数
        objFormate:"",//目标格式
        sortField:'handletimeS',//选择的条件
        ascDesc:'asc',//升序 还是降序
        totalPage:0,//总条数
        totalNumber:1,//总页数
        appointPage:1

      }
    },
    methods:{
      /*  源格式  */
      showSourceFormat:function () {
        this.isShowSourceFormat = !this.isShowSourceFormat;
      },
      selectSourceFormat:function (falg) {
        this.isShowSourceFormat = false;
      },
      /*选择目标格式*/
      selectGoalFormat:function (flag,name) {
        var self = this;
        this.goalFormat = name;
        if(Number(flag)==1){
          this.objFormate = name;
        }else{
          this.objFormate = '';
        }
    getAllData(this.sortField,this.objFormate,this.ascDesc,this.pageNum,this.pageSize,self);
      },
      /*栏目*/
      showProgramaName:function () {
        this.isShowProgramaName = !this.isShowProgramaName;
      },
      selectProgramaName:function () {
        this.isShowProgramaName = false;
      },

      //条件筛选
      sortBySelectCondition:function (event,falg) {
        var self = this;
        $(event.target).parents('div.sort').find('span.time').removeClass('active');
        $(event.target).addClass('active');
        //开始时间：starttime,结束时间：finishtime,处理时长:handletimeS
        //按照选择的条件排序
        //升序asc 降序desc
        if(Number(falg) == 1){
          //开始时间
          this.isAscStartTime = !this.isAscStartTime;
          this.sortField = 'starttime';
          this.ascDesc = this.isAscStartTime?'asc':'desc';
        }else if(Number(falg) == 2){
          //结束时间
          this.isAscEndTime = !this.isAscEndTime;
          this.sortField = 'finishtime';
          this.ascDesc = this.isAscEndTime?'asc':'desc';
        }else{
          //处理时长
          this.isDurationAsc = !this.isDurationAsc;
          this.sortField = 'handletimeS';
          this.ascDesc = this.isDurationAsc?'asc':'desc';
        }
        getAllData(this.sortField,this.objFormate,this.ascDesc,this.pageNum,this.pageSize,self);
      },
      //总页码的切换
      pageSizeLengthCut:function (pageSize) {
        var self = this;
        this.pageNum = 1;
        this.pageSize = pageSize;
        getAllData(this.sortField,this.objFormate,this.ascDesc,this.pageNum,this.pageSize,self);
      },
      //调到指定的页码
      goAppointPage:function () {
        var self = this;
        var currentPage = this.appointPage;
        if(currentPage > self.totalNumber || currentPage<=0){
          $('.page .page-number>div.go-page').css('border-color','#ff6c60');
          //.page .page-number>div.go-page
        }else{
          pageNumber(self,self.totalNumber,Number(currentPage));
        }
      },
      changeBorderColor:function () {
        $('.page .page-number>div.go-page').css('border-color','#cccccc');
      }
    },
    updated:function () {
      var self = this;

      GlobalVar.setScroll('scroll-table');
    },
    mounted:function () {
      var self = this;
      //得到传送过来的值
      var receiveBusiness = GlobalVar.getSessionStorageJson('other-nearyly24-details');
      //if(!GlobalVar.isEmptyObject(receiveBusiness)){
        self.programaName = receiveBusiness.programaName;
        self.businessType = receiveBusiness.businessType;
        self.businessSn = receiveBusiness.businessSn;
      //}

      //近24小时合成业务详情
      var routerName = '近24小时'+self.businessType+'业务详情'
      var router = {
        url: this.$route.path,
        name: routerName,
        className: 'active'
      }
      GlobalVar.setHistoryRouter(router);
      GlobalVar.setScroll('down-content');
      getAllData(this.sortField,this.objFormate,this.ascDesc,this.pageNum,this.pageSize,self);
      getAllObjFormat(self);

    }
  }



  //http://192.168.137.87:8031
  /*
  * sortField:排序字段   starttime  finishtime  handletimeS
  * objFormate:目标格式模糊查询
  * ascDesc:序asc 降序desc
  * pageNum:当前页数
  * pageSize:页面大小
  * */
  function getAllData(sortField,objFormate,ascDesc,pageNum,pageSize,self) {
   //开始时间：starttime,结束时间：finishtime,处理时长:handletimeS
    var urlName = GlobalVar.urlNameW+'consumeBusTotal/busTaskInfo/'+self.businessSn+'?';
    var condition ='first='+objFormate+'&sortField='+sortField+'&ascDesc='+ascDesc+'&pageNum='+pageNum+'&pageSize='+pageSize;
    var url = urlName + condition;
//    console.log(url);
    $.ajax({
      type:'get',
      url:url,
      success:function (data) {
        if(Number(data.status) == 200 && data.msg=="OK"){
          self.tableData = data.data.rows;
          self.totalPage = data.data.total?data.data.total:0;
//          self.totalNumber = Math.ceil(self.total/self.pageSize)==0?1:Math.ceil(self.total/self.pageSize);
          self.totalNumber = data.data.pages;

          pageNumber(self,self.totalNumber,data.data.pageNum);
          //console.log(self.totalPage);
        }

      },
      error:function (e) {}
    })
  }


  /*
  * 得到所有的目标格式
  * */
  function getAllObjFormat(self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlNameW+'consumeBusTotal/busTaskInfo/objFormat',
      success:function (result) {
        if(Number(result.status) == 200){
          self.goalFormatData = result.data;
        }

      },error:function (e) {}
    })
    ///busTaskInfo/objFormat
  }

  //页码
  function pageNumber(self,pageCount,currentPage) {
    $("#paging").CreatePage({
      pageCount: pageCount,//总页数
      current: currentPage,//当前页码
      backFn: function (page) {
        //page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
        getAllData(self.sortField,self.objFormate,self.ascDesc,page,self.pageSize,self);
      }
    });
  }
</script>


<style scoped>
  @import "../../../static/css/nearly24-details.css";

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

  .dropdown-menu{
    min-width:55px;
  }
  .page div.select-down ul.down-content{
    top:-117px;
  }


  table tr>th:first-child,
  table tr>td:first-child{
    /*width: 40%;*/
    width: 32%;
  }
  table tr>th:last-child,
  table tr>td:last-child{
    width: 20%;
  }

  table tr>th:nth-child(2),
  table tr>th:nth-child(3),
  table tr>td:nth-child(2),
  table tr>td:nth-child(3){
    width: 15%;
  }
  table tr>th:nth-child(4),
  table tr>td:nth-child(4){
    width: 10%;
  }

  .page .page-number>div.go-page>span input{
    width: 100%;
    border: none;
    border-radius: 4px;
    height: 24px;
    padding-left: 10px;
  }

</style>
