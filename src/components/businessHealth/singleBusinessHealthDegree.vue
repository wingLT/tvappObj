<template>

  <div class="single-business content">
    <div class="navigation-cut clear">
      <div class="fl">
        <span></span>
        <span>{{equipmentType}}-{{equipmentName}}</span>
      </div>
      <ul class="fr">
        <li>
          <router-link to="businessHealthHome">业务健康度</router-link>
        </li>
        <li>单个设备健康度</li>
      </ul>
    </div>

    <div class="health-degree clear">
      <div class="fl">
        <div class="map">
          <!--当前最新健康度-->
          <div class="newest-health-degree block-area">
            <div class="title">
              <span>当前最新健康度</span>
            </div>
            <div id="newestHealthMap"></div>
          </div>
          <!--当前健康度趋势-->
          <div class="present-health-degree block-area">
            <div class="title">
              <span>当前健康度趋势</span>
            </div>
            <div id="presentHealthMap" @click="showPrentHealthDetails()"></div>
            <!--当前健康度趋势hover的详情-->
            <div class="present-health-details" v-show="isShowPrentHealthDetails">
                <div>
                  <ul class="hover-content">
                    <li v-for="item in presentHealthMapData">
                      <div class="details-map-c"></div>
                      <div class="rise-and-decline" v-bind:class="getClassName(item.change)">
                        <!--wb-arrow-down-->
                        <!--<i class="icon" v-bind:class="item.change<0?'wb-arrow-down':'wb-arrow-up'"></i>-->
                        <i class="icon " v-bind:class="getChangeClass(item.change)"></i>
                        <span>{{item.change}}%</span>
                      </div>
                      <div class="title">
                        <i></i>
                        <span>指标关联度排行</span>
                      </div>
                      <div class="bar-details"></div>
                    </li>
                  </ul>
                </div>
              </div> <!--当前健康度趋势hover的详情  end-->
          </div>
        </div>
        <!--风险预警-->
        <div class="risk-Warning block-area">
          <div class="title">
            <img src="./../../assets/fengianyujing.png"/>
            <span>风险预警</span>
            <span class="more fr">查看更多...</span>
          </div>
          <div>
            <table style="table-layout:fixed;">
              <thead>
              <tr>
                <th>资源名称</th>
                <th>预警时间</th>
                <th>预警信息</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in riskWarnData" v-if="index<6">
                <td>{{item.devName}}</td>
                <td>{{item.time}}</td>
                <td>{{item.content}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div><!--风险预警  end-->
        <!--故障告警-->
        <div class="fault-Warning block-area">
          <div class="title">
            <img src="./../../assets/fengianyujing.png"/>
            <span>故障预警</span>
            <span class="more fr">查看更多...</span>
          </div>
          <div>
            <table style="table-layout:fixed;">
              <thead>
              <tr>
                <th>资源名称</th>
                <th>预警时间</th>
                <th>预警信息</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in faultWarnData" v-if="index<6">
                <td>{{item.devName}}</td>
                <td>{{item.time}}</td>
                <td>{{item.content}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div> <!--故障告警-->

      </div>
      <div class="fr">
        <!--单元历史健康度-->
        <div class="unit-history-health-degree block-area">
          <div class="title">
            <span>单元历史健康度</span>
            <ul class="fr time-cut">
              <li data-id="2" @click="cutHealthDegree($event,2)">1天</li>
              <li data-id="3" @click="cutHealthDegree($event,3)">7天</li>
            </ul>
          </div>
          <div id="unitHistoryHealth"></div>
          <div class="start-end-time">
            <div class="fl">{{startTime}}</div>
            <div class="fr">{{endTime}}</div>
          </div>
        </div><!--单元历史健康度  end-->

        <!--健康度指标关联排行-->
        <div class="block-area relevance-ranking">
          <div class="title">
            <img src="./../../assets/yewujiankangduyingxiang.png"/>
            <span>健康度指标关联排行</span>
          </div>
          <div id="relevanceRankingMap"></div>
        </div> <!--健康度指标关联排行  end-->

      </div>
    </div>

  </div>

</template>
<script>
  import echarts from 'echarts'
  import '../../../static/lib/js/echarts-liquidfill'
  import {GlobalVar} from '../../../static/js/utils'
  import {DateUtils} from '../../../static/js/DateUtils'
  import {PublicMap} from '../../../static/js/PublicMap'
  export default {
    name:'singleBusinessDegree',
    data(){
      return{
        timeFlag:'',
        devId:'',
        equipmentName:'',
        equipmentType:'',
        isShowPrentHealthDetails:false,
        startTime:'',//开始时间
        endTime:'',//结束时间
        newestHealthMap:'',//当前最新健康度
        newestHealthMapValue:'',//当前最新健康度的值
        presentHealthMap:'',//当前健康度趋势
        presentHealthMapData:'',//当前健康度趋势的值
        unitHistoryHealth:'', //单元历史健康度
        unitHistoryHealthData:[],//单元历史健康度的值
        relevanceRankingMap:'',//健康度指标关联排行
        relevanceRankingMapData:[],//健康度指标关联排行的数据
        riskWarnData:[],//风险预警
        faultWarnData:[],//故障预警
        allBarMaps:[],
        trendBallMaps:[],
        tempTopFlag:0//临时的top标志（主要用于转码）
      }
    },
    methods: {
      /*
      * 得到上升或下降或持平的className
      * */
      getChangeClass:function (change) {
        var className = '';
        if(Number(change)>0){
          className = 'wb-arrow-up';
        }else if(Number(change)<0){
          className = 'wb-arrow-down';
        }else{
          className = 'wb-minus';
        }
        return className;
      },
      showPrentHealthDetails:function () {
        this.isShowPrentHealthDetails = !this.isShowPrentHealthDetails;
      },
      cutHealthDegree:function (event,index) {
        $('ul.time-cut').find('li').removeClass('active');
        $(event.target).addClass('active');
        var self = this;
        self.timeFlag = index;
        //type,devId,self
        getHistoryHealthDataByTime(self.timeFlag,self.devId,self);
      },
      getClassName:function (value) {
        if(value<0){
          return 'decline';
        }else{
          return  'rise';
        }
      }
    },
    mounted:function () {
      var self = this;
      var receive = GlobalVar.getSessionStorageJson('BUSINESSDETAILS');
      self.equipmentName = receive.equipmentName;
      self.equipmentType = receive.equipmentType;
      if(self.equipmentType == '转码'){
        self.tempTopFlag = window.sessionStorage.getItem('tempTopFlag');
      }
      //tempTopFlag
      self.timeFlag = receive.timeFlag;
      self.devId = receive.devId;
      $('ul.time-cut').find('li').removeClass('active');
      $('ul.time-cut').find('li[data-id="'+self.timeFlag+'"]').addClass('active');
      //添加历史路由
      var router = {
        url:this.$route.path,
        name:this.$route.name,
        className:'active'
      }
      GlobalVar.setHistoryRouter(router);
      getAllData(self.timeFlag,self.devId,self);
      $(document).click(function(e){
        e = window.event || e;
        var obj = e.srcElement || e.target;
        var len = $(e.target).parents('#presentHealthMap').length;
        if(Number(len) == 0){
          self.isShowPrentHealthDetails = false;
        }
      })

    },
    updated:function () {
      var self = this;
      handlePresentHealthSituation(self);
    },
    beforeDestroy:function () {
      var self = this;
      destroyEcharts(self);
    }
  }

  /*
*
*  //销毁echars里面的数据，重新绘图渲染
* */
  function destroyEcharts(self) {
    if(self.newestHealthMap  && !self.newestHealthMap.isDisposed()){
      self.newestHealthMap.clear();           //释放图形资源
      self.newestHealthMap.dispose();
    }
    if(self.unitHistoryHealth  && !self.unitHistoryHealth.isDisposed()){
      self.unitHistoryHealth.clear();           //释放图形资源
      self.unitHistoryHealth.dispose();
    }
    if(self.presentHealthMap  && !self.presentHealthMap.isDisposed()){
      self.presentHealthMap.clear();           //释放图形资源
      self.presentHealthMap.dispose();
    }
    if(self.relevanceRankingMap  && !self.relevanceRankingMap.isDisposed()){
      self.relevanceRankingMap.clear();           //释放图形资源
      self.relevanceRankingMap.dispose();
    }
    for(var i = 0;i<self.allBarMaps.length;i++){
      if(self.allBarMaps[i]  && !self.allBarMaps[i].isDisposed()){
        self.allBarMaps[i].clear();           //释放图形资源
        self.allBarMaps[i].dispose();
      }
    }
    for(var i = 0;i<self.trendBallMaps.length;i++){
      if(self.trendBallMaps[i]  && !self.trendBallMaps[i].isDisposed()){
        self.trendBallMaps[i].clear();           //释放图形资源
        self.trendBallMaps[i].dispose();
      }
    }
  }


  /*
  * 通过时间得到单元历史的数据
  * */
  function getHistoryHealthDataByTime(type,devId,self) {
    if(self.unitHistoryHealth  && !self.unitHistoryHealth.isDisposed()){
      self.unitHistoryHealth.clear();           //释放图形资源
      self.unitHistoryHealth.dispose();
    }
    /*单元历史健康度*/
    self.unitHistoryHealth = echarts.init(document.getElementById('unitHistoryHealth'));
    $.ajax({
      type:'get',
      url:GlobalVar.urlHealth + 'DeviceMetricHealth/'+type+'/devHealth/'+devId,
      success:function (result) {
        if(Number(result.status) == 200){
          self.unitHistoryHealthData = result.data.historyHealth?result.data.historyHealth:[];
          /*单元历史健康度 */
          var unitXAxisData = [];
          var unitYAxisData = [];
          if(!GlobalVar.isEmptyObject(self.unitHistoryHealthData)){
            var data = self.unitHistoryHealthData;
            var len = data.length - 1;
//            for(var i = 0;i<data.length;i++){
            for(var i = len;i>=0;i--){
              unitYAxisData.push(data[i].value);
              unitXAxisData.push(data[i].key);
            }
            self.startTime = '起'+unitXAxisData[0];
            self.endTime =  '止'+unitXAxisData[unitXAxisData.length - 1];
          }else{
            self.startTime = '';
            self.endTime = '';
          }
          setUnitHistoryHealthMap(self.unitHistoryHealth,unitXAxisData,unitYAxisData,self);
        }
      },
      error:function (e) {}
    })
  }


  /*
  * 通过时间得到数据
  * DeviceMetricHealth/devHealthTime/273?time=2018-01-15%2017:08:35
  * */
  function getDataByTime(devId,time,self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlHealth+'DeviceMetricHealth/devHealthTime/'+devId+'?time='+time,
      success:function (result) {
        if(Number(result.status) == 200){
          self.riskWarnData = result.data.earlyWarnVOs?result.data.earlyWarnVOs:[];
          self.faultWarnData = result.data.warnVOs?result.data.warnVOs:[];
          self.relevanceRankingMapData = result.data.metricRelations?result.data.metricRelations:[];
          handleRankingMapData(self);
        }
      },error:function (e) {}
    })
  }

  /*
  * 获取所有的数据
  * type：type 1.2.3.4 分别代表小时、天、周、月 最近一@type所有设备的健康值
  * devId：设备id
  * // //DeviceMetricHealth/{type}/devHealth/{devId}
  * */
  function getAllData(type,devId,self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlHealth + 'DeviceMetricHealth/'+type+'/devHealth/'+devId,
      success:function (result) {
        if(Number(result.status) == 200){
          self.unitHistoryHealthData = result.data.historyHealth?result.data.historyHealth:[];
          self.newestHealthMapValue = result.data.newHealth;
          self.presentHealthMapData = result.data.devHealthSituationVOs;
          self.riskWarnData = result.data.earlyWarnVOs?result.data.earlyWarnVOs:[];
          self.faultWarnData = result.data.warnVOs?result.data.warnVOs:[];
          self.relevanceRankingMapData = result.data.metricRelations?result.data.metricRelations:[];
          handleAllData(self);
          handleRankingMapData(self);
        }
      },
      error:function (e) {}
    })
  }




  /*
  * 处理健康度指标关联排行的数据
  * */
  function handleRankingMapData(self) {
    self.relevanceRankingMap = echarts.init(document.getElementById('relevanceRankingMap'));
    var category = [];
    var barData = [];
    var html = [];

    var data = self.relevanceRankingMapData;
    if(!GlobalVar.isEmptyObject(data)){
//      var len =data.length - 1;
//      for (var i = len;i>=0;i--){
      for(var i = 0;i<data.length;i++){

        category.push(data[i].metricName);
        barData.push(parseInt(data[i].metricVal));
      }
      if(self.equipmentType == '转码'){
        self.tempTopFlag = window.sessionStorage.getItem('tempTopFlag');
        if(Number(self.tempTopFlag) == 1){
          //top1 转码失败
          //unshift
          category.push('转码失败');
          barData.push(100);
        }else{
          //转码效率低于正常值
          category.push('转码效率低于正常值');
          barData.push(100);
        }
      }
    }
    rankingMap(category,barData,self.relevanceRankingMap,self)
  }


  /*
  * 健康度指标关联排行的数据的图
  * */
  function rankingMap(category,barData,mapName,self) {
    var bgData = [];
    if(barData){
      for(var i = 0;i<barData.length;i++){
        bgData.push(100);
      }
    }
    var option = {
      tooltip: {
        show:true,
        // trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter:function (params) {
          return "";
        }
      },
      grid: {
        top: '0',
        left: '2%',
        right: '0',
        bottom: '0',
        containLabel: true,
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
          show: false
        },
        axisLabel: {
          formatter: function() {
            return "";
          }
        }
      },
      yAxis: [
        {
          type: 'category',
          data: category,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#555555',
              fontSize: 12
            }
          },
          axisTick: {
            show: false
          },
          offset: 10,
          nameTextStyle: {
            fontSize: 12
          }
        },
        {
          type : 'category',
          data : category,
          axisLine: {show:false},
          axisTick: {show:false},
          axisLabel: {show:false},
          splitArea: {show:false},
          splitLine: {show:false}
        }
      ],
      series: [
        {
          name:'背景',
          type:'bar',
          barWidth: 10,
          barGap: 10,
          yAxisIndex:1,
          legendHoverLink:false,
          silent:true,
          //颜色需要有透明度
          itemStyle: {
            emphasis: {
              barBorderRadius: 2
            },
            normal: {
              barBorderRadius: 2,
              color:'rgba(254, 245, 245,0.5)',
              label: {
                show: true,
                color:'#555555',
                position: 'right',
                formatter: function(params){
                  var num = barData[params.dataIndex];
                  return num;
                }
              }
            }
          },
          data:bgData
        },
        {
          name: '',
          type: 'bar',
          data: barData,
          barWidth: 10,
          barGap: 10,
          smooth: true,
          legendHoverLink:false,
          itemStyle: {
            emphasis: {
              barBorderRadius: 2
            },
            normal: {
              barBorderRadius: 2,
//              color:'#18d96e',
              color:function (params) {
                if(self.equipmentType == '转码'){
                  if(barData[params.dataIndex] == 100){
                    return "#ff6c60"
                  }else{
                    return '#18d96e';
                  }
                }else{
                  return '#18d96e';
                }


              },
              label: {
                show: false,
                position: 'right',
                formatter: function(params){
                  // var num =  Math.round(Number(params.data));
                  // return num+'%';
                }
              }
            }
          }
        }
      ]
    };
    mapName.setOption(option);
  }


  /*
  * 处理数据
  * */
  function handleAllData(self) {
    /*当前最新健康度*/
    self.newestHealthMap = echarts.init(document.getElementById('newestHealthMap'));

    /*单元历史健康度*/
    self.unitHistoryHealth = echarts.init(document.getElementById('unitHistoryHealth'));

    /*当前健康度趋势*/
    self.presentHealthMap = echarts.init(document.getElementById('presentHealthMap'));

    /*单元历史健康度 */
    var unitXAxisData = [];
    var unitYAxisData = [];
    if(!GlobalVar.isEmptyObject(self.unitHistoryHealthData)){
      var data = self.unitHistoryHealthData;
      var len = data.length - 1;
//      for(var i = 0;i<data.length;i++){
      for(var i = len;i>=0;i--){
        unitYAxisData.push(data[i].value);
        unitXAxisData.push(data[i].key);
      }
      self.startTime = '起'+unitXAxisData[0];
      self.endTime =  '止'+unitXAxisData[unitXAxisData.length - 1];
    }else{
      self.startTime = '';
      self.endTime = '';
    }
    setUnitHistoryHealthMap(self.unitHistoryHealth,unitXAxisData,unitYAxisData,self);

    /*当前最新健康度*/
    var newestHealthMapValue = self.newestHealthMapValue?self.newestHealthMapValue:0;
    var dataCircle = GlobalVar.getHandleCircleData(newestHealthMapValue);
    PublicMap.getNewestHealth(self.newestHealthMap,newestHealthMapValue,dataCircle);

    /*当前健康度趋势的值*/
    //handlePresentHealthSituation(self);
    if(!GlobalVar.isEmptyObject(self.presentHealthMapData)){
      var data = self.presentHealthMapData;
      var healths = [];//健康值
      var presentXAxisData = [];
      for(var i = 0;i<data.length;i++){
        healths.push(data[i].health);
        presentXAxisData.push('');//填充X轴
      }
      PublicMap.getTrendMap(self.presentHealthMap,presentXAxisData,healths);
    }
  }


  /*
  * 单元历史健康度
  * */
  function setUnitHistoryHealthMap(mapName,xAxisData,yAxisData,self) {
    var option = {
      title: {
        show:false
      },
      tooltip: {
        show:true,
        trigger:'axis'
//        formatter:function (params) {}
      },
      center: ['50%', '50%'],
      grid: {
        top: '10px',
        left: '30px',
        right: '0',
        bottom: '10px',
      },
      legend: {
        show:false,
        data: ['健康度']
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        "axisLine": {
          lineStyle: {
            color: '#eeeeee',
            type: 'solid'
          }
        },
        axisTick:{
          show:false
        },
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        "axisLine": {
          lineStyle: {
            color: '#eeeeee',
            type: 'solid'
          }
        },
        axisTick:{
          show:false
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#214877',
            type: 'dotted'
          }
        },
        axisLabel: {
          show:true,
          color:'#555555'
          // formatter: function(params) {
          //   return '';
          // }
        },
        boundaryGap : [ 0, '23%' ]
      },
      series: [{
        name: '健康度',
        type: 'line',
        symbolSize:8,
//        showAllSymbol: true,//每个点都显示
        data: yAxisData,
        lineStyle: {
          normal: {
            color: '#34de80',
            width: 2,
          },
        },
        "itemStyle": {
          "normal": {
            "color": "#1ab394"
          }
        },
        areaStyle: {
          normal: {
            color:'#daf9e8'
          }
        },
        itemStyle: {
          normal: {
            color: '#34de80'
          }
        }
      }]
    };
    mapName.setOption(option,true);
    mapName.on('click',function (params) {
      var dataIndex = params.dataIndex;
      var time = xAxisData[dataIndex];
      getDataByTime(self.devId,time,self);
    })
  }


  /*
  * 处理当前健康度趋势的值 点击的时候显示的值
  * */
  function handlePresentHealthSituation(self) {
    self.trendBallMaps = [];
    self.allBarMaps = [];
    /*当前健康度趋势hover的内容*/
    var healths = [];//健康值
    var changeData = []; //上升或者下降的值
    var category = [];//关联的指标的名字
    var barData = [];//关联的指标的值
    var detailsMaps = document.getElementsByClassName('details-map-c');
    var detailsBars = document.getElementsByClassName('bar-details');
    if(!GlobalVar.isEmptyObject(self.presentHealthMapData)){
      var data = self.presentHealthMapData;
      for(var i = 0;i<data.length;i++){
        healths.push(data[i].health);
        changeData.push(data[i].change);
        var temCategory = [];
        var temBarData = [];
        var temData = data[i].metricRelations;
        if(!GlobalVar.isEmptyObject(temData)){
          var len = temData.length - 1;
//          for(var j = 0;j<temData.length;j++){
          for(var j = len;j>=0;j--){
            temBarData.push(temData[j].metricVal);
            temCategory.push(temData[j].metricName);
          }
        }
        category.push(temCategory);
        barData.push(temBarData);
      }
    }
    for(var i = 0;i<detailsMaps.length;i++){
      var colors;
      var borderColor;
      if(changeData[i]>=0){
        colors = ['#34de7f','#a3f0c5'];
        borderColor = '#49d088';
      }else{
        colors = ['#da5b51','#e94f42'];
        borderColor = '#e94f42';
      }
      initeNewestHealth(detailsMaps[i],healths[i],colors,borderColor,self);
    }

    for(var i = 0;i<detailsBars.length;i++){
      getBar(barData[i],category[i],detailsBars[i],self);
    }
  }


  /*当前最新健康度图 球*/
  function initeNewestHealth(className,value,colors,borderColor,self) {
    var myEcharts = echarts.init(className);
    var data = GlobalVar.getHandleCircleData(value);

    var option = {
      center: ['50%', '50%'],
      grid: {
        top: '0',
        left: '4px',
        right: '0',
        bottom: '4px',
      },
      series: [{
        type: 'liquidFill',
        animation: true,
        waveAnimation: true,
//        data: [0.76, 0.70, 0.68],
        data: data,
        color: colors,
        waveLength: '80%',
        amplitude: 3,
        radius: '95%',
        label: {
          normal: {
            formatter: function() {
              return ''+value+'';
            },
            textStyle: {
              fontSize: 20,
              color: '#fff',
              fontWeight:'normal'
            },
            position: ['50%', '50%']
          }
        },
        outline: {
          itemStyle: {
            borderColor: borderColor,
            borderWidth: 2
          },
          borderDistance: 0
        },
        itemStyle: {
          normal: {
            backgroundColor: '#fff'
          }
        }
      }]

    };
    myEcharts.setOption(option,true);
    self.trendBallMaps.push(myEcharts);
  }


  /*隐藏的bar的图*/
  function getBar(barData,category,className,self) {
    var myEcharts = echarts.init(className);
    var bgData = [];
    if(barData){
      for(var i = 0;i<barData.length;i++){
        bgData.push(100);
      }
    }
    var option = {
      tooltip: {
        show:true,
        // trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter:function (params) {
//          return PublicMap.getHoverHtml(params);
          return '';
        }
      },
      center: ['50%', '50%'],
      grid: {
        top: '0',
        left: '4%',
        right: '0px',
        bottom: '0',
        containLabel: true,
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
          show: false
        },
        axisLabel: {
          formatter: function() {
            return "";
          }
        }
      },
      yAxis: [
        {
          type: 'category',
          data: category,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#ffffff',
              fontSize: 12
            }
          },
          axisTick: {
            show: false
          },
          offset: 10,
          nameTextStyle: {
            fontSize: 12
          }
        },
        {
          type : 'category',
          data : category,
          axisLine: {show:false},
          axisTick: {show:false},
          axisLabel: {show:false},
          splitArea: {show:false},
          splitLine: {show:false}
        }
      ],
      series: [
        {
          name:'背景',
          type:'bar',
          barWidth: 10,
          barGap: 10,
          yAxisIndex:1,
          legendHoverLink:false,
          silent:true,
          //颜色需要有透明度
          itemStyle: {
            emphasis: {
              barBorderRadius: 2
            },
            normal: {
              barBorderRadius: 2,
//              color:'rgba(254, 245, 245,0.5)',
              color:'#f5f5f5',
              label: {
                show: true,
                color:'#ffffff',
                position: 'right',
                formatter: function(params){
                  var num = barData[params.dataIndex];
                  return num;
                }
              }
            }
          },
          data:bgData
        },
        {
          name: '',
          type: 'bar',
          data: barData,
          barWidth: 10,
          barGap: 10,
          smooth: true,
          legendHoverLink:false,
          itemStyle: {
            emphasis: {
              barBorderRadius: 2
            },
            normal: {
              barBorderRadius: 2,
              color:'#18d96e',
              label: {
                color:'#ffffff',
                show: false,
                position: 'right',
                formatter: function(params){
                   var num =  Math.round(Number(params.data));
                   return num+'%';
                }
              }
            }
          }
        }
      ]
    };
    myEcharts.setOption(option);
    self.allBarMaps.push(myEcharts);
  }


</script>

<style scoped>

@import "../../../static/css/business-health-degree.css";
div#presentHealthMap{
  cursor: pointer;
}

/*单元历史健康度*/
.unit-history-health-degree{
  width: 1100px;
  padding-left: 14px;
  height: 264px;
  position: relative;
}

div#unitHistoryHealth{
  height: 152px;
  width: 1071px;
  cursor: pointer;
  margin: 20px 0 8px 0 ;
}

.unit-history-health-degree div.start-end-time{
  position: absolute;
  border-bottom: 0;
  width: 97%;
  font-size: 14px;
  color: #555555;
}
  /*start-end-time*/


/*健康度指标关联排行*/
.relevance-ranking{
  padding: 0 14px;
  margin-top: 20px;
  width: 1100px;
  height: 712px;
  /*border-radius: 2px;*/
}

.relevance-ranking div#relevanceRankingMap{
  width: 1072px;
  height: 635px;
  border: solid 1px #eeeeee;
  margin: 10px auto;
}
  .present-health-degree{
    position: relative;
  }

.present-health-degree div.present-health-details{
  position: absolute;
  width: 1176px;
  height: 360px;
  background-color: rgba(34, 34, 34, 0.84);
  border-radius: 2px;
  z-index: 102;
  top: -46px;
  left: 193px;

  }


  .present-health-degree div.present-health-details>div{
    width: 1172px;
    margin: 2px auto;
    height: 356px;
    border-radius: 2px;
    border: solid 1px rgba(255, 255, 255, 0.5);
    padding: 10px 18px;
  }
  ul.hover-content{
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
  }

  ul.hover-content>li{
    color: #ffffff;
    display: inline-block;
    vertical-align: top;
    height: 336px;
    width: 272px;
    border-right:  solid 1px #656565;
    padding-left: 18px;
  }
ul.hover-content>li:first-child{
  padding-left:0;
}

  ul.hover-content>li:last-child{
    border-right: none;
  }

  ul.hover-content>li div.details-map-c{
    width: 101px;
    height: 101px;
    margin: 10px auto;
  }

  ul.hover-content>li>div.title{
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }

ul.hover-content>li>div.title i,
ul.hover-content>li>div.title>span{
  display: inline-block;
  vertical-align: top;
}
ul.hover-content>li>div.title i{
  width: 4px;
  height: 16px;
  background-color: #18d96e;
  margin-top: 4px;
  margin-right: 8px;
}

  ul.hover-content>li>div.bar-details{
    /*width: 257px;*/
    height: 157px;
    width: 260px;
  }

ul.hover-content .rise-and-decline{
  float: right;
  text-align: center;
  margin-top: -86px;
  margin-right: 16px;
}
ul.hover-content .rise-and-decline>i,
ul.hover-content .rise-and-decline>span{
  display: block;
}

ul.hover-content .rise-and-decline.rise{
  color: #18d96e;
}

ul.hover-content .rise-and-decline.decline{
  color: #ff6c60;
}

</style>
