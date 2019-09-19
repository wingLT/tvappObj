<template>
  <div class="resource-rank-details content">
    <div class="navigation-cut clear">
      <div class="fl">
        <span></span>
        <span>{{businessType}}资源消耗排名详情</span>
      </div>
      <ul class="fr">
        <li>
          <router-link to="resourdeOption">总体资源消耗率</router-link>
        </li>
        <li>{{businessType}}资源消耗</li>
      </ul>
    </div>
    <!--排名详情-->
    <div class="block-area ranking-details">
      <div class="top-title clear">
        <div class="fl" v-show="isServer">
          <div class="device-type">设备类型</div>
          <div class="select-down dropdown">
            <div>
              <input v-model="selectedContent"/>
              <span  class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down"></i></span>

              <ul class="down-content dropdown-menu">
                <li @click="machineCut('physical','物理机')">物理机</li>
                <li @click="machineCut('vm','虚拟机')">虚拟机</li>
              </ul>
            </div>

          </div>
        </div>
        <ul class="fr time-cut">
          <!--<li>当前</li>-->
          <li @click="cutResourceHistory(1)" data-id="1">1天</li>
          <li @click="cutResourceHistory(7)" data-id="7">7天</li>
          <!--<li class="active">30天</li>-->
        </ul>
      </div>

      <div class="details-map">
        <div>
          <h3>总体</h3>
          <div class="ranking-map">
            <div class="scroll-map" id="totalMap"></div>
          </div>
        </div>
        <div>
          <h3>CPU</h3>
          <div class="ranking-map">
            <div class="scroll-map" id="cupMap"></div>
          </div>
        </div>
        <div>
          <h3>内存</h3>
          <div class="ranking-map">
            <div class="scroll-map" id="memMap"></div>
          </div>
        </div>
        <div>
          <h3>磁盘</h3>
          <div class="ranking-map">
            <div class="scroll-map" id="diskMap"></div>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
  import echarts from 'echarts'
  import Swiper from '../../../static/js/swiper'
  import {GlobalVar} from '../../../static/js/utils'
  import {DateUtils} from '../../../static/js/DateUtils'

  export default {
    name: 'resourceRankingDetails',
    data() {
      return {
        businessType:'',
        isServer:false,
        enName:'',
        timeFlag:'',
        value:20,
        selectedContent:'物理机',
        vmOrPhysical:'physical',
//        vmOrPhysical:'vm',
        totalMap:'',
        cupMap:'',
        memMap:'',
        diskMap:'',
        allData:[],
        mapHeight:'',//图像的高度
      }
    },
    methods:{
      cutResourceHistory:function (timeFalg) {
        var self = this;
        $('.ranking-details .scroll-map').scrollTop(0);
        $(event.target).parent().find('li').removeClass('active');
        $(event.target).addClass('active');
        self.timeFlag = timeFalg;
        destroyEcharts(self);
        if(self.isServer){
          gerServerRanking(this.timeFlag,this.vmOrPhysical,self);
        }else{
          requestPort(self);
        }

      },
      machineCut:function (enName,znName) {
        var self = this;
        this.vmOrPhysical = enName;
        this.selectedContent = znName;
        destroyEcharts(self);
        gerServerRanking(this.timeFlag,this.vmOrPhysical,self);
      }
    },
    updated:function () {
      var self = this;
//      GlobalVar.setScroll('ranking-map');
    },
    mounted: function () {
      var self = this;
      var routerName  = self.businessType+'排名详情';
      var router = {
        url: this.$route.path,
        name:routerName,
        className: 'active'
      }
      GlobalVar.setHistoryRouter(router);
      //获取传输过来的数据
      var receiveBusiness = GlobalVar.getSessionStorageJson('ranking-details');
      self.businessType = receiveBusiness.businessType;
      self.enName = receiveBusiness.enName;
      self.timeFlag = receiveBusiness.timeFlag;
      $('ul.time-cut').find('li').removeClass('active');
      $('ul.time-cut').find('li[data-id="'+self.timeFlag+'"]').addClass('active');
      var isServer = window.sessionStorage.getItem('isServer');
      if(isServer == 'true'){
        self.isServer = true;
        self.businessType = '后台服务器'
        gerServerRanking(self.timeFlag,self.vmOrPhysical,self);
      }else{
        self.isServer = false;
        requestPort(self);
      }

    },
    beforeDestroy:function () {
      var self = this;
      destroyEcharts(self);
    }
  }


  /*销毁*/
  function destroyEcharts(self) {
    if(self.totalMap  && !self.totalMap.isDisposed()){
      self.totalMap.clear();           //释放图形资源
      self.totalMap.dispose();
    }
    if(self.cupMap  && !self.cupMap.isDisposed()){
      self.cupMap.clear();           //释放图形资源
      self.cupMap.dispose();
    }
    if(self.memMap  && !self.memMap.isDisposed()){
      self.memMap.clear();           //释放图形资源
      self.memMap.dispose();
    }
    if(self.diskMap  && !self.diskMap.isDisposed()){
      self.diskMap.clear();           //释放图形资源
      self.diskMap.dispose();
    }

  }


  /*=========================================后台服务器的排名==============================*/

  /*
  * 得到服务器的排名情况
  * timeFlag：时间标志
  * vmOrPhysical：物理机还是虚拟机  vm or physical
  * vmPhysicalOrder/{timeFlag}/{vmOrPhysical}
  * */
  function gerServerRanking(timeFlag,vmOrPhysical,self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlName+'vmPhysicalOrder/'+timeFlag+'/'+vmOrPhysical,
      success:function (result) {
        if(Number(result.status) == 200){
          handleServerData(result.data,self)
        }
      },error:function (e) {}
    })
  }

  /*
  * 处理后台服务器的排行的数据
  * */
  function handleServerData(data,self) {

    if(!GlobalVar.isEmptyObject(data)){
      var consumeList = data.consumeList?data.consumeList:[];
      var mapHeight = consumeList.length * 43;
      $('.ranking-details .scroll-map').css('height',mapHeight+'px');
      GlobalVar.setScroll('ranking-map');
      var cpuList = data.cpuList?data.cpuList:[];
      var diskUtilList = data.diskUtilList?data.diskUtilList:[];
      var memList = data.memList?data.memList:[];
      self.totalMap = echarts.init(document.getElementById('totalMap'));
      self.cupMap = echarts.init(document.getElementById('cupMap'));
      self.memMap = echarts.init(document.getElementById('memMap'));
      self.diskMap = echarts.init(document.getElementById('diskMap'));
      getServerMapData(consumeList,self.totalMap);
      getServerMapData(cpuList,self.cupMap);
      getServerMapData(memList,self.memMap);
      getServerMapData(diskUtilList,self.diskMap);
    }
  }

  /*得到绘制图形需要的数据*/
  function getServerMapData(data,mapName) {
    var value = [];
    var yData = [];
    var names = [];
    var colorName = '#fbb321';
    var len = data.length;
    for(var i = 0;i<data.length;i++){
      value.push(data[i].value);
      names.push(data[i].key);
      yData.push('Top'+(len--));
    }
    rankingMap(value,colorName,yData,mapName,names);
  }


  /*======================================业务排名================================*/

  /*
  * 请求接口（业务的排名情况）
  * */
  function requestPort(self) {
    getBusConsumeOrder(self.enName,self.timeFlag,self);
    getBusinessRankingData(self.enName,self.timeFlag,'cpu',self.cupMap,'cupMap',self);
    getBusinessRankingData(self.enName,self.timeFlag,'mem',self.memMap,'memMap',self);
    getBusinessRankingData(self.enName,self.timeFlag,'diskUtil',self.diskMap,'diskMap',self);
  }


  /*
  * 得到总体的数据（业务）
  * busName：业务类型
  * timeFlag：时间标示
  * nameMap：echarts对象
  * self：vue对象
  *
  * comsumeTotal/busConsumeOrder/{busName}/{timeFlag}
  * */
  function getBusConsumeOrder(busName,timeFlag,self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlName+'comsumeTotal/busConsumeOrder/'+busName+'/'+timeFlag,
      success:function (data) {
        if(Number(data.status) == 200 && data.msg=="OK"){
          var value = [];
          var yData = [];
          var names = [];
          var colorName = '#fbb321';
          if(!GlobalVar.isEmptyObject(data.data)){
            var allData = data.data;
            self.mapHeight = allData.length * 43;
            $('.ranking-details .scroll-map').css('height',self.mapHeight+'px');
            GlobalVar.setScroll('ranking-map');
            var len = allData.length;
            for(var i = 0;i<allData.length;i++){
              yData.push('Top'+(len--));
              names.push(allData[i].devName);
              value.push(allData[i].consumeUse);
              self.allData.push(allData[i].consumeUse);
            }
            self.totalMap = echarts.init(document.getElementById('totalMap'));
            rankingMap(value,colorName,yData,self.totalMap,names);
          }else{
            self.totalMap = echarts.init(document.getElementById('totalMap'));
            rankingMap(value,colorName,yData,self.totalMap,names);
          }

        }
      },
      error:function (e) {}
    })
  }

  /*
  * 请求 cpu mem diskUtil （业务）
  * busName：业务类型
  * timeFlag：时间标示
  * rescourceName：排名的资源名字（cpu mem diskUtil）
  * nameMap：echarts对象
  * comsumeTotal/busConsumeCptOrder/{type}/{timeFlag}/{rescourceName}
  * */
  function getBusinessRankingData(busName,timeFlag,rescourceName,nameMap,idName,self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlName+'comsumeTotal/busConsumeCptOrder/'+busName+'/'+timeFlag+'/'+rescourceName,
      success:function (data) {
        if(Number(data.status) == 200 && data.msg=="OK"){
          if(!GlobalVar.isEmptyObject(data.data)){
            var allData = data.data.cpuList;
            self.mapHeight = allData.length * 43;
            $('.ranking-details .scroll-map').css('height',self.mapHeight+'px');
            nameMap = echarts.init(document.getElementById(idName));
            handleBusinessData(allData,nameMap);
          }
        }
      },
      error:function (e) {}
    })

  }

  /*
  * 处理数据
  * */
  function handleBusinessData(data,nameMap) {
    var value = [];
    var yData = [];
    var names = [];
    var colorName = '#fbb321';
    var len = data.length;
    for(var i = 0;i<data.length;i++){
      yData.push('Top'+(len--));
      names.push(data[i].key);
      value.push(data[i].value);
    }
    rankingMap(value,colorName,yData,nameMap,names)
  }


  /*========================================公用绘图===================================*/
  /*
  * 绘制排名图形
  * value：值（数组）
  * colorName：颜色值
  * yData:Y轴的值（用来排序的名字 ：列如Top1,Top2....）
  * nameMap：echarts对象
  * names：实际需要的名字
  * */
  function rankingMap(value,colorName,yData,nameMap,names) {
    var  option = {
      tooltip: {
        axisPointer: {
          type: 'shadow'
        },
        formatter:function (params) {
          var dataIndex = params.dataIndex;
          return names[dataIndex];
        }
      },
      grid: {
        top:'0',
        left: '10px',
        right: '50px',
        bottom: '1px',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle:{
            type:'dotted',
            color:'#bbbbbb'
          }
        },
        axisLabel: {
          show:false
        }
      },
      yAxis: {
        type: 'category',
        data: yData,
//        max:32,
        axisTick: {
          show: false
        },
        "axisLine": {
          show: true,
          lineStyle: {
            color: '#eeeeee'
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#151b22'
          }
        },
        "axisTick": {
          "show": false
        },
        axisLabel: {
          interval:0,//显示每一个点
          textStyle: {
            color: '#666666'
          }
        }
      },
      series: [
        {
          name: '设备',
          type: 'bar',
          data: value,
          barWidth: 16,
          barGap: 16,
          smooth: true,
          barCateGoryGap:32,
          legendHoverLink:false,
          hoverAnimation: false,
          itemStyle: {
            normal: {
              color:colorName,
              label: {
                show: true,
                color:'#555555',
                position: 'right',
                formatter: function(params){
                  var num =  Number(params.data).toFixed(2);
                  return num+'%';
                }
              }
            }
          }
        }
      ]
    };
    nameMap.setOption(option, true);
  }

</script>

<style scoped>
  .resource-rank-details > div {
    margin-top: 19px;
  }

  .ranking-details {
    width: 1600px;
    height: 823px;
    border-radius: 2px;
    padding:  0 14px;
  }

  .ranking-details .top-title{
    height: 66px;
    line-height: 66px;
    border-bottom: solid 1px #cccccc;
    margin-bottom: 20px;
  }

  .ranking-details .top-title>div>div{
    display: inline-block;
    vertical-align: top;
  }

  .ranking-details .top-title div.select-down>div{
    margin-top: 13px;
  }
  .ranking-details .top-title div.select-down>div input{
    vertical-align: top;
  }

  .ranking-details .top-title div.select-down ul.down-content{
    height: 74px;
    top: 52px;
  }

  .ranking-details .details-map>div{
    display: inline-block;
    vertical-align: top;
    width: 378px;
    height: 724px;
    border-radius: 2px;
    border: solid 1px #dddddd;
  }

  .ranking-details .device-type{
    font-size: 16px;
    color: #666666;
    display: inline-block;
    margin-right: 11px;
  }

  .ranking-details .details-map>div>h3{
    text-align: center;
    font-size: 16px;
    color: #666666;
    width: 374px;
    height: 55px;
    line-height: 55px;
    font-weight: bold;
    background-color: #f5f5f5;
    padding: 0;
    margin: 0;
  }
  .ranking-details .details-map>div:nth-child(2),
  .ranking-details .details-map>div:nth-child(3){
    margin: 0 12px;
  }
  .ranking-details .details-map>div>div.ranking-map{
    height: 667px;
    width: 100%;
    overflow: hidden;
  }

  .ranking-details .details-map>div>div.ranking-map .scroll-map{
    height: 667px;
    /*height: 100%;*/
    width: 98%;
    margin-top: 15px;
  }

  /*scroll-map*/
  /*.progress{*/
    /*width: 266px;*/
    /*height: 16px;*/
    /*overflow: hidden;*/
     /*background-color: #e4eaec;*/
     /*border-radius: 0;*/
     /*-webkit-box-shadow: none;*/
     /*box-shadow: none;*/
    /*position: relative;*/
  /*}*/

  /**/
</style>
