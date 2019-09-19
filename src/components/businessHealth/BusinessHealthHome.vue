<!--业务健康度-->
<template>
  <div class="businessHealthHome content">
    <!--业务图-->
    <ul class="business">
      <li @click="businessCut(index,item.bus.name,item.bus.id,item.bus.useType)" v-bind:class="index==0?'active':''" v-for="(item,index) in businessData">
        <div class="business-map"></div>
        <span>{{item.bus.name}}</span>
      </li>
      <li @click="getFaultStatistic($event)">
        <div>
          <!--<router-link to="/businessHealthDegree/faultStatistic">-->
          <img src="./../../assets/guzhang.png"/>
          <!--</router-link>-->
        </div>
        <span>故障统计</span>
      </li>
      <!--<li class="breakdown-count">-->
        <!--<div>-->
          <!--<img src="./../../assets/shujutoushi.png"/>-->
        <!--</div>-->
        <!--<span>数据透视</span>-->
      <!--</li>-->
      <li>
        ＋
      </li>
    </ul>
    <!--健康度-->
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
           <div id="presentHealthMap" @click="showPresentHealthDegreeDetails()"></div>
           <!--当前健康度趋势hover的详情-->
           <div class="present-health-details" v-show="isShowDetails">
             <div>
               <ul class="hover-content">
                 <li v-for="item in currentHealth">
                   <div class="details-map-c"></div>
                   <div class="rise-and-decline" v-bind:class="getClassName(item.change)">
                     <!--wb-arrow-down-->
                     <!--<i class="icon " v-bind:class="item.change<0?'wb-arrow-down':'wb-arrow-up'"></i>-->
                     <i class="icon " v-bind:class="getChangeClass(item.change)"></i>
                     <span>{{item.change}}</span>
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
            <!--<span class="more fr">查看更多...</span>-->
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
            <!--<span class="more fr">查看更多...</span>-->
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
        <!--健康度历史统计-->
        <div class="history-health-degree block-area">
          <div class="title">
            <span>{{businessType}}业务健康度历史统计</span>
            <ul class="fr time-cut">
              <!--<li @click="cutHealthDegree($event,1)">1小时</li>-->
              <li class="active" @click="cutHealthDegree($event,2)">1天</li>
              <li @click="cutHealthDegree($event,3)">7天</li>
              <!--<li class="active" @click="cutHealthDegree($event,4)">30天</li>-->
            </ul>
          </div>
          <div id="historyHealth"></div>
          <div class="start-end-time">
            <div class="fl">{{startTime}}</div>
            <div class="fr">{{endTime}}</div>
          </div>
        </div><!--健康度历史统计  end-->
        <!--运行状态-->
        <div class="running-status block-area">
          <div class="title">
            <img src="./../../assets/yunxingzhuangtai.png"/>
            <span>运行状态</span>
          </div>
          <table style="table-layout:fixed;">
            <thead>
              <tr>
                <th>类型</th>
                <th>资源</th>
                <!--<th>正常</th>-->
                <th>预警</th>
                <th>告警</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in operationStatus">
                <th>{{item.devTypeName}}</th>
                <th>{{item.totalSize}}</th>
                <!--<th>{{item.normalSize}}</th>-->
                <th>{{item.earlySize}}</th>
                <th>{{item.warnSize}}</th>
              </tr>
            </tbody>
          </table>
        </div><!--运行状态  end-->

        <!--业务健康度影响TOP10-->
        <div class="health-degree-top10 block-area">
          <div class="title">
            <img src="./../../assets/yewujiankangduyingxiang.png"/>
            <span>业务健康度影响TOP10</span>
          </div>
          <div id="TopTen">
            <div id="topTenMap"></div>
            <ul>
              <li v-for="item in topTenName">
                <span class="vertical-center" :title="item">{{item}}</span>
              </li>
            </ul>
          </div>
        </div>
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

  export  default {
    name:'businessHealthHome',
    data(){
      return{
        timeFlag:2,//时间标识
        businessType:'',//业务类型
        busId:'',//业务id
        busIndex:'',
        startTime:'',//开始时间
        endTime:'',//结束时间
        allBusiness:[],//所有的业务
        operationStatus:[],//运行状态
        currentHealth:'',//当前健康度
        newHealthValue:80,//当前最新健康值
        historyHealthMap:'',
        presentHealthMap:'',
        newestHealthMap:'',
        healthTopTen:'',
        businessData:[],//所有的业务
        /* top10数据 */
        topTenData:[
          {
            'devHealth':20,
            'devName':'PC-1',
            'metricName':'网络'
          },
          {
            'devHealth':50,
            'devName':'PC-2',
            'metricName':'CPU'
          },
          {
            'devHealth':60,
            'devName':'PC-3',
            'metricName':'CPU3'
          },
          {
            'devHealth':66,
            'devName':'PC-4',
            'metricName':'存储'
          },
          {
            'devHealth':70,
            'devName':'PC-5',
            'metricName':'数据库'
          },
          {
            'devHealth':75,
            'devName':'PC-6',
            'metricName':'数据库1'
          },
        ],
        topTenName:[],
        barData:[],
        barBgData:[],
        barCategory:[],
        /*历史健康度数据*/
        hisiBusDevHealths:[],
        /*risk*/
        riskWarnData:[],//风险预警
        faultWarnData:[],//故障预警
        isShowDetails:false,
        allBusinessMaps:[],//所有的业务的map
        hiddenBarMap:[],//所有隐藏的bar的图形的集合
        trendBallMaps:[]
      }
    },
    methods:{
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
      showPresentHealthDegreeDetails:function () {
        if(this.currentHealth.length>0){
          this.isShowDetails = !this.isShowDetails;
        }
      },
      cutHealthDegree:function (event,index) {
        var self = this;
        $('ul.time-cut').find('li').removeClass('active');
        $(event.target).addClass('active');
        self.timeFlag = index;
        if(self.historyHealthMap  && !self.historyHealthMap.isDisposed()){
          self.historyHealthMap.clear();           //释放图形资源
          self.historyHealthMap.dispose();
        }
        getBusHealthHistoryDataByTime(self.timeFlag,self.busId,self);
      },
      getTimeFormater:function (time) {
        if(time){
          return GlobalVar.getTimeByTimestamp(time.toString());
        }else{
          return "";
        }
      },
      getFaultStatistic:function () {
        this.$router.push({ path: '/businessHealthDegree/faultStatistic'});
      },
      businessCut:function (index,name,id,useType) {
        var self = this;
        self.isShowDetails = false;
        self.businessType = name;
        self.busIndex = index;
        self.busId = id;
        $('ul.business').find('li').removeClass('active');
        $('ul.business').find('li:nth-child('+(index + 1)+')').addClass('active');
        destroyEcharts(self);
        getAllData(self.timeFlag,id,self);
      },
      getClassName:function (value) {
        if(value<0){
          return 'decline';
        }else{
          return  'rise';
        }
      }
    },
    mounted:function(){
      var self = this;
      //添加历史路由
      var router = {
        url:this.$route.path,
        name:this.$route.name,
        className:'active'
      }
//      console.log(this.$route.path)
      GlobalVar.setHistoryRouter(router);
      self.businessType =this.$route.params.businessType;
      self.busIndex = this.$route.params.index;
      self.busId= this.$route.params.busId;
      getAllBusiness(self);
      $(document).click(function(e){
        e = window.event || e;
        var obj = e.srcElement || e.target;
        var len = $(e.target).parents('#presentHealthMap').length;
        if(Number(len) == 0){
            self.isShowDetails = false;
        }
      })
    },
    updated:function () {
      var self = this;
      var len = self.barData.length;
      var height = Math.floor(Number(399/len));
      $('div#TopTen ul li').css('height',height+'px');
      if(self.busIndex){
        $('ul.business').find('li').removeClass('active');
        $('ul.business').find('li:nth-child('+(self.busIndex+1)+')').addClass('active');
      }

      this.$nextTick(function () {
        var businessMaps = document.getElementsByClassName('business-map');
        var businessValue = [];
        for(var i = 0;i<self.businessData.length;i++){
          businessValue.push(self.businessData[i].healthVaue);
        }
        if(businessMaps){
          for(var i = 0;i<businessMaps.length;i++){
            //PublicMap.setBusinessMap(businessValue[i],businessMaps[i],GlobalVar.getBusinessColor(businessValue[i]));
            setBusinessMap(businessValue[i],businessMaps[i],GlobalVar.getBusinessColor(businessValue[i]),self);
          }
        }
      })

      handleCurrentHealthHover(self);

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
    //销毁echars里面的数据，重新绘图渲染
    if(self.historyHealthMap  && !self.historyHealthMap.isDisposed()){
      self.historyHealthMap.clear();           //释放图形资源
      self.historyHealthMap.dispose();
    }
    if(self.presentHealthMap  && !self.presentHealthMap.isDisposed()){
      self.presentHealthMap.clear();           //释放图形资源
      self.presentHealthMap.dispose();
    }

    if(self.newestHealthMap  && !self.newestHealthMap.isDisposed()){
      self.newestHealthMap.clear();           //释放图形资源
      self.newestHealthMap.dispose();
    }
    if(self.healthTopTen  && !self.healthTopTen.isDisposed()){
      self.healthTopTen.clear();           //释放图形资源
      self.healthTopTen.dispose();
    }
    for (var i = 0;i<self.hiddenBarMap.length;i++){
      if(self.hiddenBarMap[i]  && !self.hiddenBarMap[i].isDisposed()){
        self.hiddenBarMap[i].clear();           //释放图形资源
        self.hiddenBarMap[i].dispose();
      }
    }
    //self.allBusinessMaps
    for (var i = 0;i<self.allBusinessMaps.length;i++){
      if(self.allBusinessMaps[i]  && !self.allBusinessMaps[i].isDisposed()){
        self.allBusinessMaps[i].clear();           //释放图形资源
        self.allBusinessMaps[i].dispose();
      }
    }
    for (var i = 0;i<self.trendBallMaps.length;i++){
      if(self.trendBallMaps[i]  && !self.trendBallMaps[i].isDisposed()){
        self.trendBallMaps[i].clear();           //释放图形资源
        self.trendBallMaps[i].dispose();
      }
    }
    //trendBallMaps
  }
  /*
  * 得到半圆 所有的业务
  * */
  function setBusinessMap(healthValue,className,colorName,self) {
    var myEcharts = echarts.init(className);
    var option = {
      center: ['50%', '50%'],
      title: {
        x: '45%',
        y: '10%',
        textAlign: "center",
        textStyle: {
          fontWeight: 'normal',
          fontSize: 14
        },
        subtextStyle: {
          fontWeight: 'bold',
          fontSize: 14,
          color: '#555555'
        }
      },
      series: [
        {
          name: ' ',
          type: 'pie',
          radius: ['80%', '100%'],
          avoidLabelOverlap: false,
//          startAngle: 225,
          startAngle: 180,
          color: [colorName, "transparent"],
          hoverAnimation: false,
          legendHoverLink: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '14',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{
            value: 25,
            name: '1'
          }, {
            value: 25,
            name: '2'
          }]
        },
        {
          name: '',
          type: 'pie',
          radius: ['80%', '100%'],
          avoidLabelOverlap: false,
//          startAngle: 317,
          startAngle: 0,
          color: ["#dfdfdf", "transparent"],
          hoverAnimation: false,
          legendHoverLink: false,
          clockwise: false,
          itemStyle:{
            normal:{
              borderColor:"transparent",
              borderWidth:"20"
            },
            emphasis:{
              borderColor:"transparent",
              borderWidth:"20"
            }
          }
          ,
          z:10,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '14',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{
            name: ''
          }, {
            name: ''
          }
          ]
        }

      ]
    };

    var setInterValMap = setTimeout(function() {
      var value = healthValue;
      // console.log(value)
      var value_ = (100 - value) * 180 / 360;
      option.title.subtext = value;
      option.series[1].data[0].value = value_;
      option.series[1].data[1].value = 100 - value_;
      myEcharts.setOption(option, true);
      self.allBusinessMaps.push(myEcharts);
    }, 100);
  }

  /*当前健康度趋势的hover的数据处理*/
  function handleCurrentHealthHover(self) {
    self.hiddenBarMap = [];
    self.trendBallMaps = [];
    var detailsMaps = document.getElementsByClassName('details-map-c');
    var detailsBars = document.getElementsByClassName('bar-details');
    var changeData = []; //上升或者下降的值
    var healthVale = [];//健康度的值
    var category = [];//关联的指标的名字
    var barData = [];//关联的指标的值
    if(!GlobalVar.isEmptyObject(self.currentHealth)){
      var data = self.currentHealth;
      for(var i = 0;i<data.length;i++){
        var temCategory = [];
        var temBarData = [];
        var temData = data[i].devHealthTopVOs;
        if(!GlobalVar.isEmptyObject(temData)){
          var len = temData.length - 1;
//          for(var j = 0;j<temData.length;j++){
          for(var j = len;j>=0;j--){
            temBarData.push(parseInt(temData[j].devHealth));
            var name = temData[j].devName;
//          temCategory.push(temData[j].devName);
            temCategory.push(name.substring(name.length - 5,name.length));
          }

        }
        category.push(temCategory);
        barData.push(temBarData);
        changeData.push(data[i].change);
        healthVale.push(data[i].health);
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
      initeNewestHealth(detailsMaps[i],healthVale[i],colors,borderColor,self);
    }
    for(var i = 0;i<detailsBars.length;i++){
      getBar(barData[i],category[i],detailsBars[i],self);
    }
  }

  /*
  * 获取业务
  * //DeviceMetricHealth/getAllBus
  * */
  function getAllBusiness(self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlHealth+'DeviceMetricHealth/getAllBus',
      success:function (result) {
        if(Number(result.status) == 200){
          self.businessData = result.data;
          if(!GlobalVar.isEmptyObject(result.data)){
            if(!self.busId){
              self.busId = result.data[0].bus.id;
            }
            if(!self.businessType){
              self.businessType = result.data[0].bus.name;
            }
            getAllData(self.timeFlag,self.busId,self);
          }
        }
        //businessData
      },
      error:function (e) {}
    })
  }


  /*
  * 得到历史数据通过时间
  * */
  function getBusHealthHistoryDataByTime(type,busId,self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlHealth+'DeviceMetricHealth/'+type+'/index/'+busId,
      success:function (result) {
        if(Number(result.status) == 200){
          self.hisiBusDevHealths = result.data.historyHealth?result.data.historyHealth:[];
          getBusHealthHistoryData(self);
        }
      },
      error:function (e) {}
    })
  }

  /*
  * 得到所有的数据
  * type 1.2.3.4 分别代表小时、天、周、月 最近一@type所有设备的健康值
  * busId 首页选择的业务id
  * //DeviceMetricHealth{type}/index/{busId}
  * */
  function getAllData(type,busId,self) {
    //初始化echarts图
    self.presentHealthMap = echarts.init(document.getElementById('presentHealthMap'));
    self.newestHealthMap = echarts.init(document.getElementById('newestHealthMap'));
    $.ajax({
      type:'get',
      url:GlobalVar.urlHealth+'DeviceMetricHealth/'+type+'/index/'+busId,
      success:function (result) {
        if(Number(result.status) == 200){
          self.topTenData = result.data.deHealthTopTenVOs?result.data.deHealthTopTenVOs:[];
          self.operationStatus = result.data.devInfo?result.data.devInfo:[];
          var newHealthValue = result.data.newHealth?result.data.newHealth:0;
          var data = GlobalVar.getHandleCircleData(newHealthValue);
          PublicMap.getNewestHealth(self.newestHealthMap,newHealthValue,data);
          self.currentHealth = result.data.healthSituations?result.data.healthSituations:[];
          self.hisiBusDevHealths = result.data.historyHealth?result.data.historyHealth:[];
          self.riskWarnData = result.data.earlyWarnVOs?result.data.earlyWarnVOs:[];
          self.faultWarnData = result.data.warnVOs?result.data.warnVOs:[];
          getTopTenData(self);
          getBusHealthHistoryData(self);
          handleCurrentHealthData(self);
        }
      },
      error:function (e) {}
    })
  }

  /*处理当前健康度的趋势的数据*/
  function handleCurrentHealthData(self) {
    var currentData = [];
    var changeData = [];
    var data = self.currentHealth;
    if(!GlobalVar.isEmptyObject(data)){
      for(var i = 0;i<data.length;i++){
        currentData.push(data[i].health);
        changeData.push(data[i].change);
      }
    }
    initePresentHealth(self,currentData);
  }

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
    self.hiddenBarMap.push(myEcharts);
  }


  /*得到历史业务健康度*/
  function getBusHealthHistoryData(self) {
    var data = self.hisiBusDevHealths;
    var historyHealthData = [];
    var historyHealthName = [];
    if(!GlobalVar.isEmptyObject(data)){
      var len = data.length - 1;
      for(var i = len;i>=0;i--){
        historyHealthData.push(data[i].value);
        historyHealthName.push(data[i].key);
      }
      self.startTime = '起'+(historyHealthName[0]?historyHealthName[0]:DateUtils.format(new Date(),'yyyy-MM-dd HH:ss:mm'));
      var endTime = historyHealthName[historyHealthName.length - 1]?historyHealthName[historyHealthName.length - 1]:DateUtils.format(new Date(),'yyyy-MM-dd HH:ss:mm');
      self.endTime =  '止'+endTime;
    }else{
      self.startTime = '';
      self.endTime = '';
    }
    initeBusHealthMap(self,historyHealthName,historyHealthData);
  }

  //得到topTen的数据
  function getTopTenData(self) {
    var data = self.topTenData;
    var sortName = [];//排序的名字
    var devIds = [];
    self.barBgData = [];
    self.barData = [];
    self.barCategory = [];
    self.topTenName = [];
    if(!GlobalVar.isEmptyObject(data)){
//      var len = data.length - 1;
//      for(var i = len;i>=0;i--){
      for(var i = 0;i<data.length;i++){

        self.barData.push(Number(data[i].devHealth));
        self.barBgData.push(Number(100));
        self.barCategory.push(data[i].devName);
        self.topTenName.push(data[i].metricName);
        devIds.push(data[i].devId);
        sortName.push('Top'+(i+1));
      }
    }
    healthTopTen(self,self.barCategory, self.barData,self.barBgData,sortName.reverse(),devIds);
  }

  /*健康度排行榜 top10*/
  function healthTopTen(self,category,barData,bgData,sortName,devIds) {
    if(self.healthTopTen  && !self.healthTopTen.isDisposed()){
      self.healthTopTen.clear();           //释放图形资源
      self.healthTopTen.dispose();
    }
    self.healthTopTen = echarts.init(document.getElementById('topTenMap'));
    var colors = [];
      for(var i = 0;i<barData.length;i++){
        colors.push(getColor(barData[i]));
      }
    var option = {
      tooltip: {
        show:true,
//        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter:function (params) {
          var dataIndex = params.dataIndex;
          return category[dataIndex];
//          console.log(params)
        }
      },
      grid: {
        top: '0',
        left: '3%',
        right: '4%',
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
          data: sortName,
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
                  num =  Math.round(Number(num));
                  return num+'%';
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
              barBorderRadius: 7
            },
            normal: {
              barBorderRadius: 7,
              color:function (params) {
//                return getColor(params.data);
                return '#18d96e';
              },
              label: {
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
    self.healthTopTen.setOption(option);

    self.healthTopTen.on('click',function (params) {
      var dataIndex = params.dataIndex;
//      var devId = self.topTenData[dataIndex].devId;
      var devId = devIds[dataIndex];
      var businessDetails = {
        equipmentType:self.businessType,
        devId:devId,
        timeFlag:self.timeFlag,
        equipmentName:category[dataIndex]
      }
      // 1  0
      GlobalVar.setSessionStorageJson('BUSINESSDETAILS',businessDetails);

      if(self.businessType == '转码'){
        window.sessionStorage.setItem('tempTopFlag',dataIndex);
      }
      //DeviceMetricHealth/{type}/devHealth/{devId}
      self.$router.push(
        {
          path: '/singleBusinessHealth',
//          name:'单个业务健康度',
//          params:{
//            name:params.name,
//            equipmentType:'合成'
//          }
        })
    })
  }


  /*
   *水晶球
   *className：类名
   * value：值
   * colors：颜色值
   */
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
//            borderColor: '#49d088',
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


  /*当前健康度趋势图*/
  function initePresentHealth(self,currentData) {
    var xAxisData = [];
    var yAxisData = currentData;
    for(var i = 0;i<yAxisData.length;i++){
      xAxisData.push('设备');
    }
    var option = {
      title: {
        show:false
      },
      tooltip: {
//        show:true,
//        trigger:'axis'
//        formatter:function (params) {}
      },
      center: ['50%', '50%'],
      grid: {
        top: '0',
        left: '4px',
        right: '0',
        bottom: '4px',
      },
      legend: {
        show:false,
        data: ['趋势图']
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
          formatter: function(params) {
            return '';
          }
        },
        boundaryGap : [ 0, '23%' ]
      },
      series: [{
        name: '趋势图',
        type: 'line',
        symbolSize:0,
        avoidLabelOverlap: false,
        hoverAnimation: false,
        legendHoverLink: false,
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
        itemStyle: {
          normal: {
            color: '#34de80'
          }
        }
      }]
    };
    self.presentHealthMap.setOption(option,true);
  }


  /*
 * 清空当前实例，会移除实例中所有的组件和图表。清空后调用 getOption 方法返回一个{}空对象。
 * budHealMap.clear();
 * 销毁实例，实例销毁后无法再被使用。
 * budHealMap.dispose();
 * xAxisData：X轴的值
 * yAxisData：所有的数据：相当于Y轴的值
 * */

  /*业务健康历史趋势图*/
  function initeBusHealthMap(self,xAxisData,yAxisData) {
    self.historyHealthMap =  echarts.init(document.getElementById('historyHealth'));
    var option = {
      title: {
        show:false
      },
      tooltip: {
        show:true,
        trigger:'axis'
//        formatter:function (params) {
//        }
      },
      center: ['50%', '50%'],
      grid: {
        top: '10px',
        left: '30px',
        right: '10px',
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
        max:100,
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
//        showAllSymbol:true,
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
    self.historyHealthMap.setOption(option,true);
    //self.busId
    self.historyHealthMap.on('click',function (params) {
      var dataIndex = params.dataIndex;
      var time = xAxisData[dataIndex];
      getDataByTime(self,time);
    })
  }


  /*
  * 通过点击时间得到数据
  * //      /DeviceMetricHealth/healthTime/{busId}?time=2018-01-15 17:08:35
  * */
  function getDataByTime(self,time) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlHealth+'DeviceMetricHealth/healthTime/'+self.busId+'?time='+time,
      success:function (result) {
        if(Number(result.status) == 200){
          self.topTenData = result.data.deHealthTopTenVOs?result.data.deHealthTopTenVOs:[];
          self.operationStatus = result.data.devInfo?result.data.devInfo:[];
          getTopTenData(self);
        }

      },error:function (e) {}
    })

  }

  /*得到颜色*/
  function getColor(num) {
    var colorName = '';
    if(Number(num)>90){
      colorName = '#c10f00';
    }else  if(Number(num)>80){
      colorName = '#ff6c60';
    }else if(Number(num)>65){
      colorName = '#fbb321';
    }else  if(Number(num)>60){
      colorName = '#57c9f2';
    }else{
      colorName ='#18d96e';
    }
    return colorName;
  }

</script>

<style scoped>


  .block-area>div.title{
    font-size: 16px;
    color: #555555;
    font-weight: bold;
    height: 49px;
    line-height: 49px;
    border-bottom: 1px solid #eeeeee;
  }

  ul.business{
    height: 130px;
    padding: 0;
    /*margin: 19px 0 21px 0;*/
    margin: 19px 0 -10px 0;
  }
  ul.business li{
    width: 130px;
    height: 90px;
    display: inline-block;
    vertical-align: top;
    background-color: #ffffff;
    text-align: center;
    border: solid 1px #cccccc;
    position: relative;
    margin-right: 4px;
  }
  ul.business li:last-child{
    line-height: 90px;
    font-size: 37px;
    cursor: pointer;
  }

  ul.business li>span{
    display: block;

    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #555555;
    margin-top: -45px;
  }


  ul.business li>div{
    width: 70px;
    height: 70px;
    margin: 15px auto;
  }

  ul.business li.active{
    border: solid 2px rgba(24, 217, 110, 0.8);
  }

  /*左边的内容*/
  div.health-degree>div.fl>div.map>div{
    display: inline-block;
    vertical-align: top;
    height: 230px;
    width: 230px;
    padding: 0 14px;
  }

  div.health-degree>div.fl div.present-health-degree{
    margin-left: 16px;
  }


  div#presentHealthMap{
    width: 202px;
    height: 152px;
    margin-top: 20px;
    cursor: pointer;

  }

  div#newestHealthMap{
    height: 143px;
    width: 143px;
    margin: 20px auto 0 auto;
  }

  /*风险预警 故障告警*/
  div.health-degree div.risk-Warning,
  div.health-degree div.fault-Warning{
    width: 480px;
    height: 363px;
    border-radius: 2px;
  }

  div.health-degree div.risk-Warning,
  div.health-degree div.running-status{
    margin: 20px 0;
  }
  div.health-degree div.risk-Warning  div.title,
  div.health-degree div.fault-Warning div.title{
    color: #ffffff;
    padding: 0 14px;
  }


  div.health-degree div.fault-Warning div.title{
    background: #ff6c60;
  }

  div.health-degree div.risk-Warning  div.title{
    background-color: #fbb321;
  }

  div.health-degree div.risk-Warning  div.title img,
  div.health-degree div.fault-Warning div.title img{
    vertical-align: top;
    margin-top: 12px;
    margin-right: 4px;
  }

  div.health-degree div.risk-Warning  div.title .more,
  div.health-degree div.fault-Warning div.title .more{
    font-size: 14px;
    font-weight: normal;
  }

  div.health-degree div.risk-Warning table,
  div.health-degree div.fault-Warning table{
    width: 450px;
    margin: 15px auto;
    border: solid 1px #eeeeee;
    font-size: 14px;
  }

  div.health-degree>div.fl table thead tr{
     height: 38px;
  }

  div.health-degree>div.fl table tbody tr{
    height: 40px;
  }
  div.health-degree>div.fl table thead tr{
    background-color: #f5f5f5;
    color: #333333;
  }

  div.health-degree>div.fl table  tr th,
  div.health-degree>div.fl table  tr td{
    font-weight: normal;
    text-align: center;
    width: 33.3%;
    padding: 0 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  div.health-degree>div.fl table  tr td{
    color: #555555;
  }

  div.health-degree>div.fl table  tr td,
  div.health-degree>div.fl table tr th{
    border: solid 1px #eeeeee;
  }

  /*block-area*/
  /*右边区域*/
  div.health-degree>div.fr>div.history-health-degree{
    width: 1100px;
    padding-left: 14px;
    height: 230px;
    position: relative;
  }

  div.health-degree>div.fr div.title>img{
    margin-right: 4px;
  }

  div#historyHealth{
    height: 132px;
    width: 1071px;
    margin: 20px 0 0 0 ;
  }

  div.health-degree div.start-end-time{
    position: absolute;
    border-bottom: 0;
    width: 97%;
    font-size: 14px;
    color: #555555;
  }

  /*运行状态*/
  div.health-degree div.running-status{
    width: 1100px;
    /*height: 250px;*/
    min-height:250px;
    border-radius: 2px;
    padding: 0 14px 10px 14px;
  }
  div.health-degree>div.fr table{
    font-size: 14px;
    width: 1072px;
    min-height:172px;
    /*height: 172px;*/
    border: solid 1px #eeeeee;
    margin: 14px auto;
  }

  div.health-degree>div.fr table th,
  div.health-degree>div.fr table td{
    border: solid 1px #eeeeee;
    text-align: center;
    font-weight: normal;
  }


  div.health-degree>div.fr table thead tr{
    height: 33px;
    background-color: #f5f5f5;
    color: #333333;
  }


  div.health-degree>div.fr table tbody tr{
    height: 35px;
  }

  /*业务健康度影响TOP10*/
  div.health-degree-top10{
    width: 1100px;
    height: 476px;
    border-radius: 2px;
    padding: 0 14px;

  }

  div.health-degree-top10 div#TopTen{
    width: 1072px;
    height: 399px;
    margin: 10px auto;
    border: solid 1px #eeeeee;
    position: relative;
  }
  div.health-degree-top10 div#topTenMap{
    /*width: 1072px;*/
    height: 399px;
    width: 1048px;
  }

  div.health-degree-top10 div#TopTen ul{
    position: absolute;
    right: 2px;
    top: 0;
  }

  div.health-degree-top10 div#TopTen ul li{
    display: block;
    font-size: 14px;
    line-height: 36px;
    color: #555555;
    text-align: center;
    position: relative;
    width: 60px;
    height: 36px;

  }

  div.health-degree-top10 div#TopTen ul li>span{
    display: block;
    width: 60px;
    height: 36px;
    background-color: #f5f5f5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }


  /*当前健康度趋势的hover的图*/

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
    /*display: none;*/
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
    width: 257px;
    height: 157px;
  }
  ul.hover-content .rise-and-decline{
    float: right;
    text-align: center;
    margin-top: -86px;
    /*margin-right: 40px;*/
    margin-right: 38px;
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
