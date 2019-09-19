<template>
  <main-container>
    <div class="basic-content">
      <ul class="basic-content-ul">
        <li v-for="(item,index) in titleData"  @click="cutTitle(item.enName,index)">
          <p>{{item.chName}}</p>
          <p>{{item.count}}台</p>
          <span></span>
        </li>
      </ul>
    </div>
    <div class="echats-container">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item,index) in swiperData" @click="getTableContentByEnName(item.enName)">
            <div class="echars-info">
              <p>{{item.chName}}</p>
              <div :id="'echart_'+index"></div>
            </div>
          </div>
        </div>
        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-content">
          <div class="swiper-button-prev"></div>
        </div>
        <div class="swiper-button-content1">
          <div class="swiper-button-next"></div>
        </div>
      </div>
    </div>

    <div class="table-template">
      <div class="table-template-input">
        <input type="text" placeholder="输入名称或关键字进行搜素" v-model="devName" @keyup.13="searchTable()"/>
        <span @click="searchTable()"></span>
      </div>
      <div class="template-table-container">
        <table class="template-table" style="table-layout: fixed">
          <thead>
          <th>设备名称</th>
          <th>设备状态</th>
          <th>CPU占用率</th>
          <th>内存使用率</th>
          <th>磁盘使用率</th>
          <th>进程情况</th>
          <th>网络输出速率</th>
          <th>网络接收速率</th>
          </thead>
          <tbody>
          <!--:class="getClassName(item.level)"-->
            <tr v-for="item in tableData"  :class="getClassName(item.level)">
              <td><span class="first-span">{{item.devName}}</span></td>
              <td>{{item.status}}</td>
              <td>{{item.cpu}}</td>
              <td>{{item.mem}}</td>
              <td>{{item.diskUtil}}</td>
              <td>{{item.process}}</td>
              <td>{{item.netOut}}</td>
              <td>{{item.netIn}} <span class="dispose-span" @click="gotoBasicResourceDetils(item.id)"></span> </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="page clear">
        <div class="cut-page-number fl">
          <div>每页条数</div>
          <div class="select-down dropdown">
            <div>
              <input v-model="pageSize"/>
              <span class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down"></i></span>
              <ul class="page-number down-content dropdown-menu">
                <li @click="selectPageNumber(10)">10</li>
                <li @click="selectPageNumber(15)">15</li>
                <li @click="selectPageNumber(20)">20</li>
                <li @click="selectPageNumber(25)">25</li>
                <li @click="selectPageNumber(30)">30</li>
              </ul>
            </div>

          </div>
          <div>总条数 {{total}}，共 {{totalPages}} 页</div>
        </div>

        <div class="page-number fr">
          <div class="page-turning" id="paging"></div>
          <div class="go-page">
            <span>
              <input type="number" v-model="goToPage"/>
            </span>
            <span @click="appointToPage()">GO</span>
          </div>
        </div>

      </div>

    </div>
  </main-container>
</template>

<script>
  import Vue from 'vue'
  import { GlobalVar } from "../../../static/js/utils";
  import { PublicMap } from "../../../static/js/PublicMap";
  import template from '../Packages/MainContainer.vue'
  import Swiper from '../../../static/js/swiper'

  Vue.component(template.name, template);

  export default {
    name: "basic-resources",
    mounted() {
      let router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      };
      GlobalVar.setHistoryRouter(router);
      let self = this;
      getTitle(self);

    },
    created() {
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        goToPage: 10,
        total: 10,
        totalPages: 1,
        titleData:[],
        swiperData:[],
        tableData:[],
        type:'',
        devName:'',
        enName:'',
        setIntervalData:'',
        ifFirstGoto:true,
        indexFlag:0,
        circulationTime:0.2,
        isOpenInterval:false,//定时器是否开启
      }
    },
    methods: {
      selectPageNumber: function (falg) {
        let self = this;
        self.ifFirstGoto = false;
        self.pageNum = 1;
        self.pageSize = falg;
        window.clearInterval(self.setIntervalData);
        getTitleData(self.type,self.devName,self.pageNum,self.pageSize,self.enName,self);
      },
      gotoBasicResourceDetils:function (id) {
        window.sessionStorage.setItem('RESOURCEID',id);
        this.$router.push({path:'/BasicResourcesDetails'});
      },
      cutTitle:function (type,flag) {
        let self = this;
        self.ifFirstGoto = false;
        self.type = type;
        self.indexFlag = flag;
        $('ul.basic-content-ul').find('li').removeClass('active');
        $('ul.basic-content-ul').find('li:nth-child('+(flag+1)+')').addClass('active');
        self.devName = '';
        window.clearInterval(self.setIntervalData);
        getCircleData(type,self);
      },
      searchTable:function () {
        let self = this;
        self.ifFirstGoto = false;
        window.clearInterval(self.setIntervalData);
        getTitleData(self.type,self.devName,self.pageNum,self.pageSize,self.enName,self);
      },
      getTableContentByEnName:function (enName) {
        let self = this;
        self.ifFirstGoto = false;
        self.enName = enName;
        window.clearInterval(self.setIntervalData);
        getTitleData(self.type,self.devName,self.pageNum,self.pageSize,self.enName,self);
      },
      appointToPage:function () {
        var self = this;
        self.ifFirstGoto = false;
        self.pageNum = self.goToPage;
        window.clearInterval(self.setIntervalData);
        if(self.goToPage>0 && self.goToPage < self.totalPages){
          getTitleData(self.type,self.devName,self.pageNum,self.pageSize,self.enName,self);
        }
      },
      getClassName:function (level) {
        let className = '';
        if(level !== undefined){
          if(level == 1){
            //风险预警
            className = 'riskWarn';
          }else if(level == 4){
            //故障告警
            className = 'breakdownWarn';
          }
        }
        return className;
      },
    },
    updated(){
      let self = this;
      if(self.ifFirstGoto){
        var len = 100 / self.titleData.length;
        $('ul.basic-content-ul li:first-child').addClass('active');
        $('ul.basic-content-ul').find('li').css('width',len+'%');
        setIntervalGetData(self);
        autoLogout(self);
      }
    }
  }

  /*循环得到数据*/
  function setIntervalGetData(self) {
    self.isOpenInterval = true;
    self.ifFirstGoto = false;
    var index = self.indexFlag;
    var len = self.titleData.length;
    self.setIntervalData= setInterval(function(){
      index++;
      if(index>=len){
        index = 0;
      }
      $('ul.basic-content-ul li').removeClass('active');
      $('ul.basic-content-ul li:nth-child('+(index+1)+')').addClass('active');
      self.swiperData = self.titleData[index].itemList;
      self.$nextTick(function(){
        mapBanner();
      })
      self.enName = self.titleData[index].enName;
      if(!GlobalVar.isEmptyObject(self.swiperData)){
        self.devId = self.swiperData[0].devId;
      }else{
        self.devId = '';
      }
      getCircleData(self.enName,self);
    },(self.circulationTime) *60*1000)
  }



  /*
 * 检测鼠标和键盘是否在操作中
 * */
  function autoLogout(self) {
    var lastTime = new Date().getTime();
    var currentTime = new Date().getTime();
    var timeOut = 0.5 * 60 * 1000; // 设置超时时间：0.5分
    $(function() {
      /* 鼠标移动事件 */
      $(document).on('mouseover',function(){
        lastTime = new Date().getTime(); // 更新操作时间
        self.isOpenInterval = false;
        window.clearInterval(self.setIntervalData);
      })
      $(document).on('mousedown',function(){
        lastTime = new Date().getTime(); // 更新操作时间
        self.isOpenInterval = false;
        window.clearInterval(self.setIntervalData);
      })
      // 鼠标点击事件
      $(document).on('click',function(){
        lastTime = new Date().getTime(); // 更新操作时间
        self.isOpenInterval = false;
        window.clearInterval(self.setIntervalData);
      })
      $(document).on('dblclick',function(){
        lastTime = new Date().getTime(); // 更新操作时间
        self.isOpenInterval = false;
        window.clearInterval(self.setIntervalData);
      })
      //键盘事件
      $(document).on('keydown',function(){
        lastTime = new Date().getTime(); // 更新操作时间
        self.isOpenInterval = false;
        window.clearInterval(self.setIntervalData);
      })

    });
    var creatTime = setInterval(testTime,1000);
    function testTime() {
      currentTime = new Date().getTime(); // 更新当前时间
      if (currentTime - lastTime > timeOut) { // 判断是否超时
        //开始循环菜单
        if(!self.isOpenInterval){
          setIntervalGetData(self);
        }
      }
    }
  }


  /*得到title的值*/
  function getTitle(self) {
    $.ajax({
      type:'get',
      url:GlobalVar.ddmUrl+'/hisicompass-baseresource/baseResource/getHostTitle?typeId=1',
      success:function (result) {
        if(result.success){
          self.titleData = result.data;
          if(!GlobalVar.isEmptyObject(self.titleData)){
            let type = self.titleData[0].enName;
            self.type = type;
            getCircleData(type,self);
          }
        }

      }
    })
  }

  /*得到圆圈的值*/
  function  getCircleData(type,self) {
    $.ajax({
      type:'get',
      url:GlobalVar.ddmUrl+'/hisicompass-baseresource/baseResource/getExceptionCount?typeId=1&type='+type,
      success:function (result) {
        if(result.success){
            self.swiperData = result.data;
            if(!GlobalVar.isEmptyObject(result.data)){
              self.enName = result.data[0].enName;
            }
           getTitleData(self.type,self.devName,self.pageNum,self.pageSize,self.enName,self);
            self.$nextTick(function () {
              mapBanner();
              handleCircleData(self.swiperData);
            })

        }
      }
    })
  }

  /*轮播*/
  function mapBanner() {
    var mySwiper = new Swiper('.swiper-container', {
      slidesPerView: 4,
      spaceBetween: 9,
      // 如果需要前进后退按钮
      navigation: {
        nextEl: '.swiper-button-content1',
        prevEl: '.swiper-button-content',
      },
      hideOnClick: true,
      hiddenClass: 'my-button-hidden',
    });
    $(".swiper-slide").width(350);
  }

  /*
  *  处理圆圈的数据
  * */
  function  handleCircleData(data) {
    if(!GlobalVar.isEmptyObject(data)){
      var arr = [];
      for(var i = 0;i<data.length;i++){
        var item;
        if(data[i].chName.indexOf('全部')>=0){
          item = {color1: '#58c9f3', color2: '#e6f7fd', value: data[i].count};
        }else if(data[i].chName.indexOf('正常')>=0){
          item = {color1: '#18d96e', color2: '#ddf9e9', value: data[i].count};
        }else{
          item = {color1: '#ff6c60', color2: '#ffe9ef', value: data[i].count};
        }
        arr.push(item);
      }
      for (let i = 0; i < arr.length; i++) {
        PublicMap.deviceAverages('echart_'+i, '台', arr[i].value, arr[i].color1, arr[i].value === 0 ? '#f5f5f5' : arr[i].color2);
      }
    }
    $(window).resize(function () {
      $(".swiper-slide").width(350);
    });
  }


  /*
  * 得到表格数据
  * type：title的名字
  * devName：搜索的关键字
  * page：当前页码
  * number：每页显示的总条数
  * enName：异常，正常还是全部
  * */
  function  getTitleData(type,devName,page,number,enName,self) {
    $.ajax({
      type:'get',
      url:GlobalVar.ddmUrl+'/hisicompass-baseresource/baseResource/getMetrics?typeId=1&type='+type+'&devName='+devName+'&page='+page+'&number='+number+'&enName='+enName,
      success:function (result) {
        if(result.success){
          self.tableData = result.data.rows;
          self.pageSize = result.data.pageSize;
          self.pageNum = result.data.pageNum;
          self.total =result.data.total;
          self.totalPages = result.data.pages;
          if(self.totalPages == 0){
            pageNumber(1, self.pageNum, self);
          }else {
            pageNumber(self.totalPages, self.pageNum, self);
          }
        }
      }
    })

  }


  function pageNumber(pageCount, current, self) {
    $("#paging").CreatePage({
      pageCount: pageCount,//总页数
      current: current,//当前页码
      backFn: function (page) {
        self.pageNum = page;
        //page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
//        getAllData(self, self.selectUrl);
        getTitleData(self.type,self.devName,self.pageNum,self.pageSize,self.enName,self);
      }
    });
  }

</script>

<style scoped>

  .basic-content {
    width: 100%;
    height: 120px;
    background-color: #fff;
  }

  .basic-content-ul {
    padding: 0;
    margin: 0 0 9px 0;
    width: 100%;
    height: 100%;
  }

  .basic-content-ul li {
    float: left;
    text-align: center;
    cursor: pointer;
    height: 100%;
    border-right: 1px solid #e6e6e6;
    box-sizing: border-box;
    position: relative;
    border-top: 10px solid rgba(0, 0, 0, 0);
    padding-top: 20px;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }

  .basic-content-ul li:last-child {
    border-right: none;
  }

  .basic-content-ul li.active {
    border-top: 10px solid #18d96e;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }

  .basic-content-ul li p:nth-child(1) {
    margin: 0;
    font-size: 24px;
    color: #333;
    font-weight: bold;
  }

  .basic-content-ul li p:nth-child(2) {
    font-size: 20px;
    color: #76838f;
    margin-top: -4px;
    font-weight: 500;
  }

  .basic-content-ul li.active span {
    opacity: 1;

  }

  .basic-content-ul li span {
    position: absolute;
    background: url("../../assets/shuangjiantou.png") no-repeat 50% 50%;
    width: 12px;
    height: 12px;
    bottom: 34px;
    right: 19px;
    opacity: 0;
    transition: 0.3s;
  }

  .echats-container {
    margin-top: 9px
  }

  .echats-container, .echars-info {
    height: 245px;
    position: relative;
  }

  .swiper-wrapper {
    box-sizing: border-box;
    margin: 0 86px;
    width: calc(100% - 172px);
  }

  .echars-info {
    background-color: #fff;
    box-sizing: border-box;
    padding: 35px 89px;
  }

  .swiper-slide {
    z-index: -1;
    cursor: pointer;
  }

  .echars-info > p {
    background-color: #f5f5f5;
    border-radius: 10px;
    text-align: center;
  }

  .echars-info > div {
    height: calc(100% - 33px);
    cursor: pointer;
  }

  .swiper-button-content1 > div.swiper-button-next {
    background-image: url("../../assets/you_01.png");
  }

  .swiper-button-content1.swiper-button-disabled > div.swiper-button-next {
    background-image: url("../../assets/you_02.png");
  }

  .swiper-button-content > div.swiper-button-prev {
    background-image: url("../../assets/zuo_01.png");
  }

  .swiper-button-content.swiper-button-disabled > div.swiper-button-prev {
    background-image: url("../../assets/zuo_02.png");
  }

  .swiper-button-content {
    width: 76px;
    height: 245px;
    cursor: pointer;
    background-color: #fff;
    position: absolute;
    left: 0;
    z-index: 99;
    top: 0;
  }

  .swiper-button-next, .swiper-button-prev {
    width: 15px;
    height: 29px;
    background-size: 15px;
  }

  .swiper-button-content1 {
    background-color: #fff;
    cursor: pointer;
    right: 0;
    width: 76px;
    height: 245px;
    position: absolute;
    top: 0;
    z-index: 99;
  }

  .swiper-button-prev {
    left: 31px;
  }

  .swiper-button-next {
    right: 31px;
  }

  .table-template {
    /*height: 834px;*/
    min-height: 834px;
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px 30px;
    margin-bottom: 83px;
    margin-top: 9px;
  }

  /*页码 */
  .page div.cut-page-number > div {
    display: inline-block;
    vertical-align: top;
  }

  .page div.cut-page-number > div:first-child,
  .page div.cut-page-number > div:last-child {
    margin-top: 4px;
  }

  .page div.cut-page-number > div.select-down {
    height: 28px;
    width: 54px;
    margin-right: 16px;
  }

  .page div.cut-page-number > div.select-down > div {
    width: 54px;
  }

  .page div.cut-page-number > div.select-down input {
    width: 28px;
  }

  .page div.cut-page-number > div.select-down span {
    background-color: transparent;
    width: 10px;
  }

  .page div.cut-page-number > div.select-down i {
    font-size: 20px;
  }

  .page div.select-down ul.down-content {
    width: 55px;
    height: auto;
  }

  .page div.select-down ul.down-content li {
    height: 28px;
    line-height: 28px;
  }

  .page .page-number > div {
    display: inline-block;
    vertical-align: top;
  }

  .page .page-number > div.go-page {
    width: 88px;
    height: 28px;
    border-radius: 4px;
    border: solid 1px #cccccc;
    margin-left: 19px;
  }

  .page .page-number > div.go-page > span {
    float: left;
    height: 100%;
    line-height: 28px;
    text-align: center;
    font-size: 14px;
    width: 50%;
    outline: none;
  }

  .page .page-number > div.go-page > span:last-child {
    color: #ffffff;
    background-color: #18d96e;
    cursor: pointer;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  div.select-down > div > span {
    line-height: 28px !important;
    height: 28px !important;
  }

  div.select-down > div {
    height: 28px;
  }

  div.select-down > div input {
    height: 25px;
  }

  .go-page input {
    width: 32px;
    height: 24px;
    border: none;
  }

  .table-template-input {
    width: 513px;
    height: 40px;
    margin-bottom: 20px;
    position: relative;
  }

  .table-template-input input {
    width: 100%;
    background-color: #f2f2f2;
    border: 1px solid #eaeaea;
    height: 40px;
    text-indent: 25px;
  }

  .table-template-input span {
    position: absolute;
    background: url("../../assets/huiche.png") no-repeat 50% 50%;
    width: 17px;
    height: 12px;
    cursor: pointer;
    right: 25px;
    top: 15px;
    color: #888;
  }

  .template-table-container {
    /*height: 626px;*/
    min-height:626px;
    width: 100%;
    margin-bottom: 45px;

  }

  .template-table {
    padding: 0;
    width: 100%;
    box-sizing: border-box;
  }

  /*.template-table th, .template-table td {*/
    /*width: 12.5%;*/
  /*}*/
  .template-table thead{
    /*border-left: 6px solid #e9e9e9;*/
  }
  .template-table thead th {
    height: 66px;
    background-color: #e9e9e9;
    font-size: 18px;
    font-weight: 500;
    color: #555;
    text-align: center;
  }
/*riskWarn  breakdownWarn*/

  .template-table tr.riskWarn td{
    color: #ef9e28;
  }

  .template-table tr.breakdownWarn td{
    color: #ed4447;
  }


  .template-table tr,.template-table td {
    height: 56px;
    box-sizing: border-box;
    text-align: center;
    position: relative;
  }
  .table-template tbody tr:hover .dispose-span{
    opacity: 1;
  }

  .table-template tbody span.first-span{
    display: block;
    height: 56px;
    line-height: 56px;
  }

  .table-template tbody tr:hover span.first-span{
    border-left: 6px solid #18d96e;
  }


  .table-template tbody tr:hover{

    background-color: #f5f5f5;
  }

  .template-table tr.active{
    border-left: 6px solid #18d96e;
  }
  .template-table tr{
    /*border-left: 6px solid rgba(0,0,0,0);*/
  }
  .dispose-span{
    opacity: 0;
    position: absolute;
    background: url("../../assets/....png") no-repeat 50% 50%;
    width: 19px;
    height: 19px;
    right: 10px;
    top: 18px;
    cursor: pointer;
    transition: 0.3s;
  }
  .template-table tr.active .dispose-span{
    opacity: 1;

  }
</style>
