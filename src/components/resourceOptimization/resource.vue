<template>
  <div class="content resource clear">

      <div class="fl" v-show="isLoading">
        <!--总体资源消耗率-->
        <div class="total-resource block-area">
          <div class="title ">
            <span>总体资源消耗率</span>
          </div>
          <div id="totalResourceMap"></div>
        </div><!--总体资源消耗率  end-->

        <!--预期资源消耗-->
        <div class="expect-resource block-area">
          <div class="title ">
            <span>预期资源消耗</span>
          </div>
          <table style="table-layout:fixed;">
            <thead>
            <tr>
              <th>资源类型</th>
              <th>0-6</th>
              <th>6-12</th>
              <th>12-18</th>
              <th>18-24</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>CPU</td>
              <td v-for="item in consumePredict.CPU">{{timeTransform(item)}}%</td>
            </tr>
            <tr>
              <td>内存</td>
              <td v-for="item in consumePredict.RAM">{{timeTransform(item)}}%</td>
            </tr>
            <tr>
              <td>磁盘</td>
              <td v-for="item in consumePredict.DISK">{{timeTransform(item)}}%</td>
            </tr>
            </tbody>
          </table>
        </div> <!--预期资源消耗  end-->

        <!--预期资源空闲-->
        <div class="expect-resource-free expect-resource block-area">
          <div class="title ">
            <span>预期资源空闲</span>
          </div>
          <table style="table-layout:fixed;">
            <thead>
            <tr>
              <th>资源类型</th>
              <th>0-6</th>
              <th>6-12</th>
              <th>12-18</th>
              <th>18-24</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>CPU（核）</td>
              <td v-for="item in obligateResource.cpu">{{item}}</td>
            </tr>
            <tr>
              <td>内存（T）</td>
              <td v-for="item in obligateResource.mem">{{item}}</td>
            </tr>
            <tr>
              <td>磁盘（T）</td>
              <td v-for="item in obligateResource.disk">{{item}}</td>
            </tr>
            </tbody>
          </table>
        </div> <!--预期资源空闲  end-->

        <!--近24小时业务汇总 Nearly 24 hours-->
        <div class="block-area nearly24">
          <div class="title ">
            <span>近24小时业务汇总</span>
          </div>
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="item in nearly24Data">
                <div><span>{{item.num}}</span><span>个 </span></div>
                <p class="name">{{item.chName}}</p>
                <p class="details" @click="showNearly24Details(item.chName,item.enName)">查看详情</p>
              </div>

            </div>
            <!-- 如果需要导航按钮 -->
            <div class="swiper-button-prev">
              <i class="icon wb-chevron-left"></i>
            </div>
            <div class="swiper-button-next">
              <i class="icon wb-chevron-right"></i>
            </div>
          </div>
        </div><!--近24小时业务汇总 end-->
      </div>
      <div class="fr"  v-show="isLoading">
        <!--资源消耗历史统计-->
        <div class="resource-history block-area">
          <div class="title">
            <span>资源消耗历史统计</span>
            <ul class="legend">
              <li>
                <i></i>
                <span>消耗率</span>
              </li>
              <li>
                <i></i>
                <span>设备用量</span>
              </li>
            </ul>
            <ul class="fr time-cut">
              <li class="active"  @click="cutResourceHistory($event,1)">1天</li>
              <li @click="cutResourceHistory($event,7)">7天</li>
              <!--<li @click="cutResourceHistory($event,30)">30天</li>-->
            </ul>
          </div>
          <div class="resource-history-map">
            <!--y轴的名字-->
            <div class="y-name">
              <div>
                <span>设备</span>
                <span>用量</span>
              </div>
              <div>消耗率</div>
            </div>
            <!--x轴的字  目前不需要-->
            <div class="x-name" style="display: none">
              <div>起 {{startTime}}</div>
              <!--<div>止 2017-11-29 10:30:35</div>-->
              <div class="fr">预 {{predict}}</div>
            </div>
            <div id="resourceHistoryMap"></div>
          </div>
        </div><!--资源消耗历史统计  end-->

        <!--业务资源消耗分布-->
        <div class="business-resource block-area">
          <div class="title">
            <span>业务资源消耗分布</span>
          </div>
          <table style="table-layout:fixed;">
            <thead>
            <tr>
              <th>业务名称</th>
              <th>业务消耗</th>
              <th>设备用量</th>
              <th>&lt;30%</th>
              <th>30-60%</th>
              <th>60-80%</th>
              <th>80-100%</th>
            </tr>
            </thead>
          </table>
          <div class="table-consume-content">
            <table style="table-layout:fixed;">
              <tbody>
              <tr v-for="item in businessDistribution">
                <td>
                  <span>{{item.useTypeChName}}</span>
                  <i @click="GoResourceConsume(item.useTypeChName,item.type)"></i>
                </td>
                <td>{{item.consumeUse}}%</td>
                <td>{{item.useNum}}</td>
                <td>{{item.gradeOne}}</td>
                <td>{{item.gradeTwo}}</td>
                <td>{{item.gradeThree}}</td>
                <td>{{item.gradeFour}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div> <!--业务资源消耗分布  end-->

        <!--资源池资源消耗-->
        <div class="resource-pool block-area">
          <div class="title">
            <span>资源池资源消耗</span>
            <ul class="legend">
              <li>
                <i></i>
                <span>CPU</span>
              </li>
              <li>
                <i></i>
                <span>磁盘</span>
              </li>
              <li>
                <i></i>
                <span>内存</span>
              </li>
            </ul>
          </div>
          <div id="resourcePoolMap"></div>
        </div> <!--资源池资源消耗  end-->
      </div>

    <!--</el-table>-->

  </div>
</template>

<script>
  import echarts from 'echarts'
  import Swiper from '../../../static/js/swiper'
  import {GlobalVar} from '../../../static/js/utils'
  import {DateUtils} from '../../../static/js/DateUtils'
  import {PublicMap} from '../../../static/js/PublicMap'

  export default {
    name: 'resource',
    data() {
      return {
        totalResourceMap:'',//总体资源消耗率图
        totalResourceValue:'',//总体资源消耗率值
        resourcePoolMap:'',//资源池资源消耗
        resourceHistoryMap:'',//资源消耗历史统计
        clickTime:DateUtils.format(new Date(),'yyyy-MM-dd HH:mm:ss'),//点击的时间
        timeFlag:1,
        /*  资源消耗历史统计  */
        historyConsumeList:[],//历史消耗率
        forecastConsumeList:[],//预测历史消耗率
        historyTotalUseList:[],//历史设备用量
        forecastTotalUseList:[],//预测设备用量
        startTime:'',//开始时间
        endTime:'',//结束时间
        predict:'',//预测时间
        /*业务分布数据*/
        businessDistribution:[],
        nearly24Data:[],//近24小时的数据
        consumePredict:{},//预期资源消耗
        obligateResource:{},//预留资源消耗
        isLoading:true,//加载
        showLoading:'',

      }
    },
    methods: {
      cutResourceHistory:function (event,flag) {
        var self = this;
        self.timeFlag = flag;
        $(event.target).parent().find('li').removeClass('active');
        $(event.target).addClass('active');
        getConsumeData(self,flag,'all');
      },
      showNearly24Details:function (name,businessSn) {
        //显示近24小时详情
        var businessData = {
          businessType:name,
          programaName:'全部',
          businessSn:businessSn
        }
        if(name == '非编'){
          this.$router.push({ path: '/nonLinearEditing'});
          GlobalVar.setSessionStorageJson('non-linear-editing',businessData);
        }else  if(name == '审片'){
          this.$router.push({ path: '/whosePiece'});
          GlobalVar.setSessionStorageJson('whose-piece',businessData);
        }else{
          GlobalVar.setSessionStorageJson('other-nearyly24-details',businessData);
          this.$router.push({ path: '/otherNearyly24Details'});
        }

      },
      GoResourceConsume:function (name,enName) {
        //falg==1是后台服务器
        //后台服务器
        if(name == '后台服务器'){
          //需要保存的数据
          var serverData = {
            timeFlag:this.timeFlag,//时间长度，就是 1小时 1天 7天 30天的切换
            clickTime:this.clickTime,//点击的时间
            businessType:name, //业务类型
            enName:enName//请求时候的名字
          }
          GlobalVar.setSessionStorageJson('server-business-data',serverData);
          this.$router.push({ path: '/serverResource',});
        }else{
          var businessData = {
            timeFlag:this.timeFlag,//时间长度，就是 1小时 1天 7天 30天的切换
            clickTime:this.clickTime,
            businessType:name,
            enName:enName//请求时候的名字
          };
          GlobalVar.setSessionStorageJson('business-data',businessData);
          this.$router.push({ path: '/resouceConsume',});
        }
      },
      timeTransform:function (time) {
        return Math.round(time);
      }
    },
    created:function () {
    },
    updated:function () {
      var self = this;
      nearly24Banner();
      GlobalVar.setScroll('table-consume-content');


      /*加载*/
//      if(this.isLoading){
//        this.showLoading.close();
//      }
    },
    mounted: function () {
      var self = this;
      var router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active',
      }

      GlobalVar.setHistoryRouter(router);

      /*加载*/
//      self.showLoading = this.$loading({
//        lock: true,
//        text: 'Loading',
//        spinner: 'el-icon-loading',
//        background: 'rgba(0, 0, 0,0.2)'
//      });

      getConsumeData(self,1,'all');//近24小时业务汇总
      getNearly24Data(self);
      getObligateResource('all',self);//预留资源
      var autoGetDataInterval = setInterval(function(){
//        autoGetData(self);
      },GlobalVar.autoGetDataTime * 60 * 1000);

    },
    beforeDestroy:function () {
      var self = this;
      if(self.totalResourceMap  && !self.totalResourceMap.isDisposed()){
        self.totalResourceMap.clear();           //释放图形资源
        self.totalResourceMap.dispose();
      }
      if(self.resourcePoolMap  && !self.resourcePoolMap.isDisposed()){
        self.resourcePoolMap.clear();           //释放图形资源
        self.resourcePoolMap.dispose();
      }
      if(self.resourceHistoryMap  && !self.resourceHistoryMap.isDisposed()){
        self.resourceHistoryMap.clear();           //释放图形资源
        self.resourceHistoryMap.dispose();
      }
    }
  }

  /*
  * 自动获取数据
  * 5分钟
  * */
  function autoGetData(self){
   //销毁页面上所有的echars里面的数据，重新绘图渲染
    if(self.totalResourceMap  && !self.totalResourceMap.isDisposed()){
      self.totalResourceMap.clear();           //释放图形资源
      self.totalResourceMap.dispose();
    }
    if(self.resourcePoolMap  && !self.resourcePoolMap.isDisposed()){
      self.resourcePoolMap.clear();           //释放图形资源
      self.resourcePoolMap.dispose();
    }
    if(self.resourceHistoryMap  && !self.resourceHistoryMap.isDisposed()){
      self.resourceHistoryMap.clear();           //释放图形资源
      self.resourceHistoryMap.dispose();
    }
    getConsumeData(self,1,'all');

  }

  /*
  * 请求得到总体资源消耗和消耗历史的数据
  * self：vue对象
  * timeFlag:时间标志 1 7 30
  * businessType：业务类型
  * */
  function getConsumeData(self,timeFlag,businessType) {
    self.totalResourceMap = echarts.init(document.getElementById('totalResourceMap'));


    $.ajax({
      url:GlobalVar.urlName+'comsumeTotal/index/'+timeFlag+'/'+businessType,
      type:'get',
      data:'',
      success:function (data) {
        if(Number(data.status) == 200){
          self.totalResourceValue = data.data.currentConsume;
          self.consumePredict = data.data.consumePredict?data.data.consumePredict:{};

          self.historyConsumeList = data.data.consumeList?data.data.consumeList:[];
          self.forecastConsumeList = [];
          self.forecastTotalUseList = [];
          self.historyTotalUseList = data.data.totalUseList?data.data.totalUseList:[];


          var consumeData = data.data.forecastConsumeJsonArray?data.data.forecastConsumeJsonArray:[];

          for(var i=0;i<consumeData.length;i++){
            var pushData = {
              key:'2018-02-01 12:23:'+i,
              value:consumeData[i]
            }
            self.forecastConsumeList.push(pushData);
          }

          var totalData = data.data.forecastNumJsonArray?data.data.forecastNumJsonArray:[];
          for(var i = 0;i<totalData.length;i++){
            var pushData = {
              key:'2018-02-01 12:23:'+i,
              value:totalData[i]
            }
            self.forecastTotalUseList.push(pushData);
          }

          getResourceHistoryData(self);
          /*总体资源消耗率的圆环图*/
          PublicMap.getPieMap('#58c9f3',self.totalResourceMap,Math.round(self.totalResourceValue));
        }
      },
      error:function (e) {}
    })
  }

  /*
  * 请求预留资源的消耗
  * businessType:业务类型
  * comsumeTotal/consumeTotalService/transcode
  * */
  function getObligateResource(businessType,self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlName+'comsumeTotal/consumeTotalService/'+businessType,
      success:function (result) {
        if(Number(result.status) == 200){
            self.obligateResource = result.data;
        }
      },
      error:function (e) {}
    })
  }

  /*
  * 请求资源池消耗的数据
  * time:某个时间点
  * timeFlag：时间标致
  * self：vue对象
  */
  function getResourcePool(time,self,timeFlag) {
    /*资源池资源消耗柱状图*/
    var cpuValue = [];
    var diskValue = [];
    var memoryValue = [];
    $.ajax({
      url:GlobalVar.urlName+'comsumeTotal/resourceConsumption/all/'+timeFlag+'?time='+time,
//      url:GlobalVar.urlName+'comsumeTotal/resourceConsumption/all/'+timeFlag+'?time=2018-01-13 11:20:17',
      type:'get',
      data:'',
      success:function (data) {
        self.resourcePoolMap = echarts.init(document.getElementById('resourcePoolMap'));
        if(Number(data.status) == 200 && data.msg=='OK'){
          self.isLoading = true;
          cpuValue = data.data.cpuList;
          diskValue = data.data.diskUtilList;
          memoryValue = data.data.memList;
          PublicMap.getBarMap(self.resourcePoolMap,cpuValue,diskValue,memoryValue);
        }
      },
      error:function (e) {}
    })
  }

  /*
  * 得到资源消耗历史统计的数据
  * self：vue对象
  * */
  function getResourceHistoryData(self) {
    if(self.resourceHistoryMap  && !self.resourceHistoryMap.isDisposed()){
      self.resourceHistoryMap.clear();           //释放图形资源
      self.resourceHistoryMap.dispose();
    }
    self.resourceHistoryMap = echarts.init(document.getElementById('resourceHistoryMap'));
    var nameData = ['设备用量', '消耗率'];
    var allEquipmentUsageData = [];
    var allTime = [];
    var historyLen =  self.historyTotalUseList.length;
    /*设备用量*/
    if(!GlobalVar.isEmptyObject(self.historyTotalUseList)){
      var data = self.historyTotalUseList;
      for(var i = 0;i<data.length;i++){
        allEquipmentUsageData.push(data[i].value);
        allTime.push(data[i].key);
      }
      self.startTime = allTime[0];
      self.clickTime = allTime[historyLen - 1];
      self.predict = allTime[allTime.length - 1];
    }
    if(!GlobalVar.isEmptyObject(self.forecastTotalUseList)){
      var forecastData =self.forecastTotalUseList;
      for(var i = 0;i<forecastData.length;i++){
//        allEquipmentUsageData.push((forecastData[i].value*100).toFixed(2));
        allEquipmentUsageData.push((forecastData[i].value).toFixed(2));
        allTime.push(forecastData[i].key);
      }
    }

    var equipmentUsageData = GlobalVar.getHistoryAndForecastData(allEquipmentUsageData,allTime,historyLen);
    var equipmentUsage = equipmentUsageData.historyData;
    var forecastEquipment = equipmentUsageData.forecastData;
    var actualShowTime = equipmentUsageData.actualShowTime;
    /*消耗率*/
    var consumeRateData = [];
    if(!GlobalVar.isEmptyObject(self.historyConsumeList)){
        var data = self.historyConsumeList;
        for(var i = 0;i<data.length;i++){
          if(!GlobalVar.isEmptyObject(data[i])){
            consumeRateData.push(data[i].value);
          }else{
            consumeRateData.push(0);
          }
        }
    }

    if(!GlobalVar.isEmptyObject(self.forecastConsumeList)){
      var forecastData =self.forecastConsumeList;
      for(var i = 0;i<forecastData.length;i++){
//        consumeRateData.push((forecastData[i].value * 100).toFixed(2));
        consumeRateData.push((forecastData[i].value).toFixed(2));
      }
    }
    var consumeRateData = GlobalVar.getHistoryAndForecastData(consumeRateData,allTime,historyLen);
    var consumeRate = consumeRateData.historyData;
    var forecastConsume = consumeRateData.forecastData
    resourceHistoryMap(self,nameData,equipmentUsage,forecastEquipment,consumeRate,forecastConsume,actualShowTime,allTime);

    //请求资源池消耗的数据
    getResourcePool(self.clickTime,self,self.timeFlag);
    //业务分布的数据
    getBusinessDistribution(self.clickTime,self);
//    getBusinessDistribution('2018-01-13 12:05:00',self);

  }

  //业务分布的数据
  function getBusinessDistribution(time,self) {
    $.ajax({
      url:GlobalVar.urlName+'comsumeTotal/resourceDistribution?time='+time,
      type:'get',
      data:'',
      success:function (data) {
        if(Number(data.status) == 200){
          self.businessDistribution = data.data;
        }
      },
      error:function (e) {}
    })
  }


  /*
  * 得到近24小时业务汇总的数据
  * */
  function getNearly24Data(self) {
    //192.168.137.87
    $.ajax({
      type:'get',
      url:GlobalVar.urlNameW+'consumeBusTotal/busTotal',
      success:function (data) {
        if(Number(data.status) == 200 && data.msg=='OK'){
            self.nearly24Data = data.data;
        }
      },
      error:function (e) {}
    })
  }


  /*近24小时业务汇总*/
  function nearly24Banner() {
    var mySwiper = new Swiper('.swiper-container', {
      // 如果需要前进后退按钮
      slidesPerView: 5,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  /*
  *资源消耗历史统计
  *
  * self：vue对象
  * nameData：名字（数组）
  * equipmentUsage：设备用量的历史数据（数组）
  * forecastEquipment：设备用量的预测数据（数组）
  * consumeRate：消耗率的历史数据（数组）
  * forecastConsume：消耗率的预测的数据（数组）
  * allTimeData：对应的所有的时间点（数组）
  * timeDataTwo：实际要显示的时间（数组）
  *
  * */
  function  resourceHistoryMap(self,nameData,equipmentUsage,forecastEquipment,consumeRate,forecastConsume,timeDataTwo,allTimeData) {
    var line_step = false;
    var option = {
      width: "98%",
      tooltip: {
        show:true,
        trigger: 'axis',
        axisPointer: {
          animation: true
        },
        formatter:function (params) {
          var dataIndex = params[0].dataIndex;
          var html = [];
          if(dataIndex<self.historyTotalUseList.length){
            html.push('<div id="detailsMap">');
            html.push('<div>');
            html.push('<div class="title">');
            html.push('<span></span><span>资源消耗</span><span class="time">'+allTimeData[dataIndex]+'</span>');
            html.push('</div>');
            html.push('<ul>');
            html.push('<li><div><span>'+equipmentUsage[dataIndex]+'台</span></div> <p>设备用量</p></li>');
            html.push('<li><div><span>'+consumeRate[dataIndex]+'%</span></div> <p>资源消耗率</p></li>');
            html.push('</ul>');
            html.push('</div>');
            html.push('</div>');
          }
          return html.join('');
        }
      },
      axisPointer : {
        link : {
          xAxisIndex : 'all'
        }
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 0,
          end: 100
        },
        {
          type: 'inside',
          realtime: true,
          xAxisIndex : [ 0, 1 ],
          start: 0,
          end: 100
        },

      ],
      grid: [
        {
        left: "25px",
        right: 0,
        top: '10px',
        height: '40%',
      }, {
        show: true,
        left: "25px",
        right: 0,
        top: '44%',
        height: '40%',
        backgroundColor:'#f8f8f8',
        borderColor :'transparent'
      }],
      xAxis: [
        {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          onZero: true
        },
        data: timeDataTwo,
        show: true,
        "axisLine": {
          lineStyle: {
            color: '#eeeeee',
            type: 'solid'
          }
        },
          "axisTick": {
            "show": false
          },
        axisLabel: {
          color: '#666666',
          formatter: ''
        }
      }, {
        gridIndex: 1,
        type: 'category',
        boundaryGap: false,
        axisLine: {
          onZero: true
        },
        data: timeDataTwo,
        show: true,
        "axisLine": {
          lineStyle: {
            color: '#eeeeee',
            type: 'solid',
            width:1
          }
        },
        "axisTick": {
          "show": false
        },
        axisLabel: {
          show:false,
          //interval:0,// 解决echarts X轴数据显示不全问题
          color: '#666666',
          formatter: '{value}'
        }
      }],

      yAxis: [
        {
        type: 'value',
        nameLocation: 'middle',
        nameTextStyle: {
          color: "#000"
        },
        nameGap: 50,
        position: 'left',
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
          show:false,
          textStyle: {
            color: '#000'
          }
        }

      }, {
        gridIndex: 1,
        type: 'value',
        nameLocation: 'middle',
        nameTextStyle: {
          color: "#ffffff"
        },
        nameGap: 50,
        inverse: false,
        "axisLine": {
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
          show:false,
          textStyle: {
            color: '#000'
          }
        }
      }],

      series: [
        {
          name: nameData[0],
          type: 'line',
          symbolSize: 5,
          hoverAnimation: true,
          data: equipmentUsage,
//          showAllSymbol: true,
          symbol: 'emptyCircle',
          lineStyle: {
            normal: {
              color: '#58c9f3',
              width: 2,
            },
          },
          areaStyle: {
            normal: {
              color: '#f8f8f8'
            }
          },
          smooth: true, //这个就是关键点了，为true是不支持虚线的，实线就用true
          itemStyle: {
            normal: {
              color: '#58c9f3',
              lineStyle: {
                width: 2,
                type: 'solid' //'dotted'虚线 'solid'实线
              }
            }
          }
        },
        {
        name: nameData[0],
        type: 'line',
        symbolSize: 5,
        hoverAnimation: false,
        data: forecastEquipment,
//        showAllSymbol: true,
        symbol: 'emptyCircle',
        lineStyle: {
          normal: {
            color: '#58c9f3',
            width: 2,
          },
        },
        areaStyle: {
          normal: {
            color: '#f8f8f8'
          }
        },
        smooth: false, //这个就是关键点了，为true是不支持虚线的，实线就用true
        itemStyle: {
          normal: {
            color: '#58c9f3',
            lineStyle: {
              width: 2,
              type: 'dotted' //'dotted'虚线 'solid'实线
            }
          }
        },
      },
        {
          name: nameData[1],
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbolSize: 5,
          hoverAnimation: true,
          //consumeRate,forecastConsume
          data: consumeRate,
          lineStyle: {
            normal: {
              color: '#fbb321',
              width: 2,
            },
          },
//          showAllSymbol: true,
          symbol: 'emptyCircle',
          smooth: true, //这个就是关键点了，为true是不支持虚线的，实线就用true
          itemStyle: {
            normal: {
              color: '#fbb321',
              lineStyle: {
                width: 2,
                type: 'solid' //'dotted'虚线 'solid'实线
              }
            }
          },
        },
        {
          name: nameData[1],
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbolSize: 5,
          hoverAnimation: false,
          data: forecastConsume,
//          showAllSymbol: true,
          symbol: 'emptyCircle',
          lineStyle: {
            normal: {
              color: '#fbb321',
              width: 2,
            },
          },
          smooth: false, //这个就是关键点了，为true是不支持虚线的，实线就用true
          itemStyle: {
            normal: {
              color: '#fbb321',
              lineStyle: {
                width: 2,
                type: 'dotted' //'dotted'虚线 'solid'实线
              }
            }
          },
        }
      ]
    };
    self.resourceHistoryMap .setOption(option);
    self.resourceHistoryMap.on('click',function (params) {
      var dataIndex = params.dataIndex;
      if(dataIndex<self.historyTotalUseList.length){
        self.clickTime =  allTimeData[dataIndex];
        //请求资源池消耗的数据
        getResourcePool(self.clickTime,self,self.timeFlag);
        //业务分布的数据
        getBusinessDistribution(self.clickTime,self);
      }

    })
  }



</script>
<style scoped>

  .resource>div{
    margin-top: 19px;
  }
  .total-resource,
  .nearly24,
  .business-resource,
  .resource-pool{
    padding: 0 14px;
  }

  .total-resource.block-area>div.title,
  .nearly24.block-area>div.title,
  .business-resource.block-area>div.title,
  .resource-pool.block-area>div.title,
  .resource-history.block-area>div.title{
    border-bottom: 1px solid #eeeeee;
  }

  .block-area>div.title{
    font-size: 16px;
    color: #555555;
    font-weight: bold;
    height: 49px;
    line-height: 49px;
  }
  /*总体资源消耗率*/
  .total-resource{
    width: 480px;
    height: 297px;
    background-color: #ffffff;
    border-radius: 2px;
  }

  .total-resource>div#totalResourceMap{
    width: 172px;
    height: 172px;
    margin: 34px auto 0 auto;
  }

  /*预期资源消耗*/
  .expect-resource{
    width: 480px;
    height: 241px;
    border-radius: 2px;
    margin: 19px 0;
  }

  .expect-resource>div.title{
    background-color: #fbb321;
  }
  .expect-resource-free>div.title{
    background-color: #18d96e;
  }
  .expect-resource>div.title{
    padding: 0 14px;
    font-size: 16px;
    color: #ffffff;
  }

  .expect-resource table{
    width: 452px;
    height: 162px;
    margin: 10px auto;
    font-size: 14px;
    border: solid 1px #eeeeee;
  }

  .expect-resource table thead tr{
    background-color: #f5f5f5;
    color: #333333;
  }
  .expect-resource table th,
  .expect-resource table td{
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: solid 1px #eeeeee;
    width: 20%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .expect-resource table td{
    color: #555555;
  }

  /*近24小时业务汇总*/

  .nearly24{
    width: 480px;
    height: 243px;
    border-radius: 2px;
  }

  /* */
  .nearly24 .swiper-container{
    width: 465px;
    height: 147px;
    margin: 22px auto;
  }

  .nearly24 .swiper-container>div.swiper-wrapper{
    /*width: 90%;*/
    /*margin: 0 auto;*/
  }

  .nearly24 .swiper-container div.swiper-slide{
    display: inline-block;
    vertical-align: top;
    width: 76px;
    text-align: center;
  }

  .nearly24 .swiper-container div.swiper-slide>div{
    width: 76px;
    height: 76px;
    border-radius: 50%;
    border: solid 1px #58c9f3;
    color: #58c9f3;
    line-height: 76px;
    margin: 0 auto;
  }

  .nearly24 .swiper-container div.swiper-slide>span:first-child{
    font-size: 26px;
    font-weight: bold;
  }

  .nearly24 .swiper-container div.swiper-slide>span:last-child{
    font-size: 12px;
  }

  .nearly24 .swiper-container div.swiper-slide p{
    margin: 0;
  }

  .nearly24 .swiper-container div.swiper-slide p.name{
    font-size: 16px;
    font-weight: bold;
    color: #666666;
    margin: 4px 0;
  }

  .nearly24 .swiper-container div.swiper-slide p.details{
    cursor: pointer;
    font-size: 12px;
  }

  .nearly24 .swiper-container div.swiper-slide p.details:hover{
    color: #58c9f3;
  }
  /**/
  .swiper-button-next, .swiper-button-prev{
    width: 17px;
    height: 50px;
  }

  .swiper-button-next i, .swiper-button-prev i{
    display: block;
    height:18px;
    width: 12px;
    margin: 14px auto 0 auto;
  }

  .swiper-button-next, .swiper-container-rtl .swiper-button-prev{
    right: 0;
    background-image: none;
    background-color: #c1c1c1;
    border-radius: 2px;
    color: #ffffff;

  }
  .swiper-button-prev, .swiper-container-rtl .swiper-button-next{
    left: 0;
    background-image: none;
    background-color: #c1c1c1;
    border-radius: 2px;
    color: #ffffff;
  }

  .swiper-button-next.swiper-button-disabled, .swiper-button-prev.swiper-button-disabled{
    background-color: transparent;
    color: #c1c1c1;
  }

  /*资源消耗历史统计*/
  .resource-history{
    width: 1100px;
    height: 410px;
    border-radius: 2px;
    padding: 0 0 0 14px;
  }
  .resource-history >div.title>ul.legend,
  .resource-history>div>span{
    display: inline-block;
  }
  .resource-history >div.title>ul li{
    display: inline-block;
  }

  .resource-history >div.title>ul{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .resource-history >div.title>ul.legend{
    font-size: 14px;
    color: #555555;
    margin-left: 38px;
    vertical-align: top;
  }

  .resource-history >div.title>ul.legend i{
    display: inline-block;
    width: 20px;
    height: 4px;
    border-radius: 2px;
    vertical-align: middle;
    margin-right: 6px;
  }
  .resource-history >div.title>ul.legend li:first-child{
    margin-right: 18px;
  }
  .resource-history >div.title>ul.legend li:first-child i{
    background-color: #fbb321;
  }

  .resource-history >div.title>ul.legend li:last-child i{
    background-color: #58c9f3;
  }

  .resource-history >div.title>ul.time-cut{
    margin-right: 14px;
  }

  .resource-history .resource-history-map{
    width: 1076px;
    height: 328px;
    position: relative;
    margin-top: 20px;
  }
  /*resource-history-map*/
  .resource-history div#resourceHistoryMap{
    /*width: 1019px;*/
    width: 1000px;
    /*height: 285px;*/
    height: 320px;
    margin-left: 60px;
  }
  .resource-history .resource-history-map div.y-name{
    position: absolute;
    left: 0;
    top: 53px;
    font-size: 14px;
    font-weight: bold;
    color: #555555;
  }

  .resource-history .resource-history-map div.y-name>div{
    background-color: #e6e6e6;
    text-align: center;
    padding: 2px 0;
  }
  .resource-history .resource-history-map div.y-name>div:first-child{
    /*width: 42px;*/
    /*height: 42px;*/
  }
  .resource-history .resource-history-map div.y-name>div:last-child{
    margin-top: 90px;
    padding: 5px 7px;
  }

  .resource-history .resource-history-map div.y-name span{
    display: block;
    margin: 0;
    padding: 0;
  }
  .resource-history .resource-history-map div.x-name{
    position: absolute;
    width: 100%;
    bottom: 16px;
    left: 32px;
  }
  .resource-history .resource-history-map div.x-name>div{
    width: 83px;
    height: 27px;
    font-size: 12px;
    color: #555555;
    text-align: center;
    display: inline-block;
  }

  .resource-history .resource-history-map div.x-name>div:last-child{
    margin-right: 20px;
  }

  /*业务资源消耗分布*/
  .business-resource{
    width: 1100px;
    height: 317px;
    margin: 19px 0;
    border-radius: 2px;
  }
  .business-resource >div.title{
    margin-bottom: 20px;
  }

  .business-resource table{
    width: 1072px;
    font-size: 14px;
  }
  .business-resource .table-consume-content{
    height:206px;
  }

  .business-resource table thead tr{
    background-color: #f5f5f5;
    color: #333333;
  }
  .business-resource table td{
    color: #555555;
  }

  .business-resource table th,
  .business-resource table td{
    height: 33px;
    text-align: center;
    border: solid 1px #eeeeee;
    width: 14.28571428571429%;
  }

  .business-resource table td i{
    height: 14px;
    width: 22px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 7px;
    background-image: url("../../assets/chakan.png");
    cursor: pointer;
  }

  .business-resource table tbody tr:hover i{
    background-image: url("../../assets/chakan-hover.png");
  }

  /*资源池资源消耗*/
  .resource-pool{
    width: 1100px;
    height: 315px;
    border-radius: 2px;
    position: relative;
  }

  .resource-pool #resourcePoolMap{
    height: 223px;
    /*width: 100%;*/
    /*width: 1100px;*/
    width: 1071px;
    margin-top: 23px;
  }
  .resource-pool ul.legend{
    margin: 0;
    padding: 0;
    position: absolute;
    left: 149px;
    top: 0;
  }
  .resource-pool ul.legend li{
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    color: #666666;
    margin: 0 5px;
    font-weight: normal;
  }
  .resource-pool ul.legend li i{
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 2px;
    vertical-align: middle;
  }
  .resource-pool ul.legend li:first-child i{
    background-color: #58c9f3;
  }
  .resource-pool ul.legend li:nth-child(2) i{
    background-color: #fbb321;
  }
  .resource-pool ul.legend li:last-child i{
    background-color: #ff6c60;
  }


</style>
