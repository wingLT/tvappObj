<template>
  <!--业务资源消耗-->
  <div class="content resource-consume clear">
    <div class="navigation-cut">
      <ul>
        <li>
          <router-link to="resourdeOption">总体资源消耗率</router-link>
        </li>
        <li>{{businessType}}资源消耗</li>
      </ul>
    </div>
    <div class="fl">
      <!--非编资源消耗率-->
      <div class="total-resource block-area">
        <div class="title ">
          <span>{{businessType}}资源消耗率</span>
        </div>
        <div id="totalResourceMap"></div>
      </div><!--非编资源消耗率  end-->

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
            <td v-for="item in expectLeisureResource.cpu">{{item}}</td>
          </tr>
          <tr>
            <td>内存（T）</td>
            <td v-for="item in expectLeisureResource.mem">{{item}}</td>
          </tr>
          <tr>
            <td>磁盘（T）</td>
            <td v-for="item in expectLeisureResource.disk">{{item}}</td>
          </tr>
          </tbody>
        </table>
      </div> <!--预期资源空闲  end-->

      <!--近24小时业务汇总 Nearly 24 hours-->
      <div style="display: none" class="block-area nearly24">
        <div class="title ">
          <span>近24小时业务汇总</span>
        </div>
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div><span>512</span><span>个 </span></div>
              <p class="name">养生堂</p>
              <p class="details" @click="goNearly24Details('养生堂')">查看详情</p>
            </div>
            <div class="swiper-slide">
              <div><span>512</span><span>个 </span></div>
              <p class="name">美食地图</p>
              <p class="details" @click="goNearly24Details('养生堂')">查看详情</p>
            </div>
            <div class="swiper-slide">
              <div><span>512</span><span>个 </span></div>
              <p class="name">美食地图</p>
              <p class="details" @click="goNearly24Details('养生堂')">查看详情</p>
            </div>
            <div class="swiper-slide">
              <div><span>512</span><span>个 </span></div>
              <p class="name">美食地图</p>
              <p class="details" @click="goNearly24Details('养生堂')">查看详情</p>
            </div>
            <div class="swiper-slide">
              <div><span>512</span><span>个 </span></div>
              <p class="name">美食地图</p>
              <p class="details" @click="goNearly24Details('养生堂')">查看详情</p>
            </div>
            <div class="swiper-slide">
              <div><span>512</span><span>个 </span></div>
              <p class="name">美食地图</p>
              <p class="details" @click="goNearly24Details('养生堂')">查看详情</p>
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

    <div class="fr">
      <!--资源消耗率-->
      <div class="resource-history block-area">
        <div class="title">
          <span>{{businessType}}资源消耗率历史统计</span>
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
            <li @click="cutResourceHistory(1)" data-id="1">1天</li>
            <li @click="cutResourceHistory(7)" data-id="7">7天</li>
            <!--<li @click="cutResourceHistory(30)" data-id="30">30天</li>-->
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
          <!--x轴的字   目前不需要-->
          <div class="x-name" style="display: none;">
            <div>起 {{startTime}}</div>
            <!--<div>止 {{endTime}}</div>-->
            <div class="fr">预 2017-11-30 10:30:35</div>
          </div>
          <div id="resourceHistoryMap"></div>
        </div>
      </div><!--资源消耗率  end-->

      <!--单台资源消耗排名-->
      <div class="single-resource block-area">
        <div class="title">
          <span>单台资源消耗排名</span>
          <span @click="ShowDetails()">查看详情</span>
        </div>
        <div id="singleResourceMap"></div>
      </div> <!--单台资源消耗排名  end-->

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

  </div>
</template>

<script>
  import echarts from 'echarts'
  import Swiper from '../../../static/js/swiper'
  import {GlobalVar} from '../../../static/js/utils'
  import {DateUtils} from '../../../static/js/DateUtils'
  import {PublicMap} from '../../../static/js/PublicMap'

  export default {
    name: 'resourceConsume',
    data() {
      return {
//        value:20,
        enName:'',
        totalResourceMap:'',//总体资源消耗率
        totalResourceValue:'',//总体资源消耗率值
        resourcePoolMap:'',//资源池资源消耗
        resourceHistoryMap:'',//资源消耗历史统计
        singleResourceMap:'',//单台资源消耗排名
        businessType:'',//业务类型
        currentClickTime:'',//当前点击的时间
        timeFlag:'',
        consumePredict:{},//预期资源消耗
        expectLeisureResource:{},//预期资源空闲
        /*  资源消耗历史统计  */
        historyConsumeList:[],//消耗率
        forecastConsumeList:[],//预测历史消耗率
        historyTotalUseList:[],//设备用量
        forecastTotalUseList:[],//预测设备用量
        startTime:'',//开始时间
        endTime:'',//结束时间
        predict:'',//预测时间
        isHeightLight:false//是否是高亮
      }
    },
    methods: {
      timeTransform:function (time) {
        return Math.round(time);
      },
      cutResourceHistory:function (timeflag) {
        var self = this;
        $(event.target).parent().find('li').removeClass('active');
        $(event.target).addClass('active');
        getAllData(self,timeflag,self.enName);
      },
      ShowDetails:function () {
        //排名详情
        var data = {
          enName:this.enName,
          timeFlag:this.timeFlag,
          businessType:this.businessType
        };
        GlobalVar.setSessionStorageJson('ranking-details',data);
        window.sessionStorage.setItem('isServer',false);
        this.$router.push({ path: '/resourceRankingDetails' })
      },
      goNearly24Details:function (name) {
        //跳转到当前业务下该栏目的 24小时详情
        var businessData = {
          businessType:this.businessType,
          programaName:name
        }
        if(this.businessType == '非编'){
          GlobalVar.setSessionStorageJson('non-linear-editing',businessData);
          this.$router.push({ path: '/nonLinearEditing' });
        }else if(this.businessType == '审片'){
          GlobalVar.setSessionStorageJson('whose-piece',businessData);
          this.$router.push({ path: '/whosePiece' });
        }else{
          GlobalVar.setSessionStorageJson('other-nearyly24-details',businessData);
          this.$router.push({ path: '/otherNearyly24Details' });
        }
      }
      //后台服务器
    },
    updated:function () {
      var self = this;

    },
    mounted: function () {
      var self = this;
      //得到传送过来的值
      var receiveBusiness = GlobalVar.getSessionStorageJson('business-data');
      self.businessType = receiveBusiness.businessType;
      self.currentClickTime = receiveBusiness.clickTime;
      self.timeFlag = receiveBusiness.timeFlag;
      self.enName = receiveBusiness.enName;
      $('ul.time-cut').find('li').removeClass('active');
      $('ul.time-cut').find('li[data-id="'+self.timeFlag+'"]').addClass('active');

      var routerName = self.businessType +"资源消耗";
      var router = {
        url: this.$route.path,
        name: routerName,
        className: 'active'
      }
      GlobalVar.setHistoryRouter(router);
      getAllData(self,self.timeFlag,self.enName);
      //预期资源空闲
      getExpectLeisureResource(self.enName,self);
      var autoGetDataInterval =setInterval(function(){
//        autoGetData(self);
      },GlobalVar.autoGetDataTime * 60 * 1000);
//      nearly24Banner();
    },
    beforeDestroy:function () {
      var self = this;
      destroyEcharts(self);
    }
  }

  /*
  * 销毁页面上所有的echars里面的数据，重新绘图渲染
  * */
  function destroyEcharts(self) {
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
    if(self.singleResourceMap  && !self.singleResourceMap.isDisposed()){
      self.singleResourceMap.clear();           //释放图形资源
      self.singleResourceMap.dispose();
    }
  }


  /*
 * 自动获取数据
 * */
  function  autoGetData(self) {
    destroyEcharts(self);
    getAllData(self,self.timeFlag,self.enName);
    //预期资源空闲
    getExpectLeisureResource(self.enName,self);
  }


  /*
  * 得到预期资源空闲
  * comsumeTotal/consumeTotalService
  * enName:业务类型的英文名字
  * */
  function getExpectLeisureResource(enName,self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlName+'comsumeTotal/consumeTotalService/'+enName,
      success:function (data) {
        if(Number(data.status) == 200 && data.msg=='OK'){
          self.expectLeisureResource = data.data;
        }
      },
      error:function (e) {}
    })
  }


  /*
  * 资源池消耗的数据
  * timeFlag:时间标识
  * time：某一个时间点
  * businessTypeZn：业务类型的英文
  * self：vue的对象
  * */
  function getResourcePoolConsume(timeFlag,time,businessTypeZn,self) {

    $.ajax({
      url:GlobalVar.urlName+'comsumeTotal/resourceConsumption/'+businessTypeZn+'/'+timeFlag+'?time='+time,
//      url:GlobalVar.urlName+'comsumeTotal/resourceConsumption/'+businessTypeZn+'/'+timeFlag+'?time=2018-01-13 11:27:12',
      type:'get',
      data:'',
      success:function (data) {
        self.resourcePoolMap = echarts.init(document.getElementById('resourcePoolMap'));
        if(Number(data.status) == 200 && data.msg=='OK'){
          var cpuValue = data.data.cpuList;
          var diskValue = data.data.diskUtilList;
          var memoryValue = data.data.memList;
          PublicMap.getBarMap(self.resourcePoolMap,cpuValue,diskValue,memoryValue);
        }
      },
      error:function (e) {}
    })
  }

  /*
  * 得到所有的数
  * self：vue的对象
  * timeFlag:时间标识
  * businessType：业务类型
  * */
  function getAllData(self,timeFlag,businessType) {
    self.totalResourceMap = echarts.init(document.getElementById('totalResourceMap'));
    $.ajax({
      url:GlobalVar.urlName+'comsumeTotal/index/'+timeFlag+'/'+businessType,
      type:'get',
      data:'',
      success:function (data) {
        if(Number(data.status) == 200){
          self.historyConsumeList = data.data.consumeList;
          self.historyTotalUseList = data.data.totalUseList;
          self.forecastConsumeList = data.data.forecastConsumeJsonArray;
          self.forecastTotalUseList = data.data.forecastNumJsonArray;
          self.totalResourceValue = data.data.currentConsume
          self.consumePredict = data.data.consumePredict?data.data.consumePredict:{};
          PublicMap.getPieMap('#18d96e',self.totalResourceMap,Math.round(self.totalResourceValue));
          getResourceHistoryData(self);
        }
      },
      error:function (e) {}
    })
  }


  /*得到资源消耗历史统计的数据*/
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
      //历史值
      var data = self.historyTotalUseList;
      for(var i = 0;i<data.length;i++){
        allEquipmentUsageData.push(Number(data[i].value));
        allTime.push(data[i].key);
      }
    }

    if(!GlobalVar.isEmptyObject(self.forecastTotalUseList)){
      //预测值
      var data = self.forecastTotalUseList;
      for(var i=0;i<data.length;i++){
//        allEquipmentUsageData.push((data[i] *100).toFixed(2));
        allEquipmentUsageData.push((data[i]).toFixed(2));
        allTime.push('');
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
          consumeRateData.push(Math.round(data[i].value));
        }else{
          consumeRateData.push(0);
        }
      }
    }
    if(!GlobalVar.isEmptyObject(self.forecastConsumeList)){
      var data = self.forecastConsumeList;
      for(var i = 0;i<data.length;i++){
//        consumeRateData.push((data[i] * 100).toFixed(2));
        consumeRateData.push((data[i]).toFixed(2));
      }
    }
    var consumeRateData = GlobalVar.getHistoryAndForecastData(consumeRateData,allTime,historyLen);
    var consumeRate = consumeRateData.historyData;
    var forecastConsume = consumeRateData.forecastData
    resourceHistoryMap(self,nameData,equipmentUsage,forecastEquipment,consumeRate,forecastConsume,allTime,actualShowTime);
  }

  /*==============================其他业务的数据处理=============================*/


  /*
  * 得到单台资源消耗排名的数据
  * time:时间点
  * self：vue对象
  * */
  function getSingleData(time,self) {
    if(self.singleResourceMap  && !self.singleResourceMap.isDisposed()){
      self.singleResourceMap.clear();           //释放图形资源
      self.singleResourceMap.dispose();
    }
    self.singleResourceMap = echarts.init(document.getElementById('singleResourceMap'));
    $.ajax({
      url:GlobalVar.urlName+'comsumeTotal/singleResouceOrder/'+self.enName+'?time='+time,
//      url:GlobalVar.urlName+'comsumeTotal/singleResouceOrder/'+self.enName+'?time=2018-01-13 12:05:00',
      type:'get',
      data:'',
      success:function (data) {
        if(Number(data.status) == 200){
            var singleDatas = data.data;
            var len = singleDatas.length-1;
            var consumeUseValues = [];
            var equipmentName = [];
            var devIds = [];
            var ids = [];
            if(!GlobalVar.isEmptyObject(singleDatas)){
              for(var i = len;i>=0;i--){
                consumeUseValues.push(Number(singleDatas[i].consumeUse).toFixed(2));
                equipmentName.push(singleDatas[i].devName);
                devIds.push(singleDatas[i].devId);
                ids.push(singleDatas[i].id);
              }
            }
          singleResourceMap(self,consumeUseValues,equipmentName,devIds,ids);
        }
      },
      error:function (e) {}
    })
  }

  /*
  * 单台资源消耗排名
  * self：vue对象
  * consumeUseValues：值（数组）
  * equipmentName：名字（数组）
  * */
  function singleResourceMap(self,consumeUseValues,equipmentName,devIds,ids) {
    var option = PublicMap.getCrosswiseBarMap(consumeUseValues,'#fbb321',equipmentName,true);
    self.singleResourceMap.setOption(option,true);
    self.singleResourceMap.on('click', function(params) {
      var dataIndex = params.dataIndex;
      //拿到数据进行数据填充的操作
      var singleBusinessData = {
        timeFlag:self.timeFlag,
        clickTime:self.currentClickTime,
        businessType: self.businessType,
        equipmentName:params.name,
        devId:devIds[dataIndex],
        id:ids[dataIndex]
      }
      GlobalVar.setSessionStorageJson('single-business-data',singleBusinessData);
      self.$router.push({ path: '/singleResourceConsume' })
    });

  }



  /*
  * 资源消耗历史统计
  * self：vue对象
  * nameData：名字（数组）
  * equipmentUsage：设备用量的历史数据（数组）
  * forecastEquipment：设备用量的预测数据（数组）
  * consumeRate：消耗率的历史数据（数组）
  * forecastConsume：消耗率的预测的数据（数组）
  * timeData：对应的所有的时间点（数组）
  * timeDataTwo：实际要显示的时间（数组）
  * */
  function  resourceHistoryMap(self,nameData,equipmentUsage,forecastEquipment,consumeRate,forecastConsume,timeData,timeDataTwo) {
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
            html.push('<span></span><span>资源消耗</span><span class="time">'+timeData[dataIndex]+'</span>');
            html.push('</div>');
            html.push('<ul>');
            html.push('<li><div><span>'+equipmentUsage[dataIndex]+'台</span></div> <p>设备用量</p></li>');
            html.push('<li><div><span>'+consumeRate[dataIndex]+'%</span></div> <p>资源消耗率</p></li>');
            html.push('</ul>');
            html.push('</div>')
            html.push('</div>');
          }

          return html.join('');
        }
      },
      axisPointer: {
        link: {
          xAxisIndex: 'all'
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
        left: "10px",
        right: 0,
        top: '10px',
        height: '40%'
      }, {
        show: true,
        left: "10px",
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
        axisLabel: {
          show:false,
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
            width:3
          }
        },
        "axisTick": {
          "show": false
        },
        axisLabel: {
          show:false,
          color: '#666666',
//          formatter: '{value}'
          formatter: ''
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
          textStyle: {
            color: '#ffffff'
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
          textStyle: {
            color: '#ffffff'
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
          showAllSymbol: false,
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
          showAllSymbol: false,
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
          showAllSymbol: false,
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
          showAllSymbol: false,
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
    self.resourceHistoryMap .setOption(option,true);

    //判断是否是高亮：就是查询有没有上个页面传过来的时间点对应的数据，如果有就高亮，如果没有就不高亮
    var currentClickTime = DateUtils.format(new Date(self.currentClickTime), 'yyyy-MM-dd HH:mm:ss');
    for(var i = 0;i<timeData.length;i++){
      var allTimeContent = DateUtils.format(new Date(timeData[i]), 'yyyy-MM-dd HH:mm:ss');
      if(new Date(allTimeContent).getTime() == new Date(currentClickTime).getTime()){
        self.isHeightLight = true;
        PublicMap.echartHeightLight(option,self.resourceHistoryMap,i);
      }else{
        self.isHeightLight = false;
      }
    }

    //当前最新的时间
    var newestTime = timeData[Number(self.historyTotalUseList.length)-1]
    //如果存在高亮，时间就是高亮的数据的时间，如果没有高亮，时间就是最新的时间
    if(self.isHeightLight){
      var time = self.currentClickTime;
      //得到单台的排名和资源池的消耗
      getSingleData(time,self);
      getResourcePoolConsume(self.timeFlag,time,self.enName,self);
    }else{
      self.currentClickTime = newestTime;
      //得到单台的排名和资源池的消耗
      getSingleData(newestTime,self);
      getResourcePoolConsume(self.timeFlag,newestTime,self.enName,self);
    }

    //点击事件
    self.resourceHistoryMap.on('click',function (params) {
      var dataIndex = params.dataIndex;
      if(dataIndex<self.historyTotalUseList.length){
        var time = timeData[dataIndex];
        getSingleData(time,self);
        getResourcePoolConsume(self.timeFlag,time,self.enName,self);
      }

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

</script>
<style scoped>

  /*表格*/
  table{
    margin: 10px auto;
  }
  table,
  table th,
  table td{
    border: solid 1px #eeeeee;
    font-size: 14px;
  }
  table th,
  table td{
    text-align: center;
    height: 40px;
    line-height: 40px;
  }

  table th span,
  table td span{
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 4px;
  }

  table tbody td{
    color: #555555;
  }

  table thead tr{
    background-color: #f5f5f5;
    color: #333333;
  }

  /*定位导航*/
  .navigation-cut{
    text-align: right;
  }
  .navigation-cut ul{
    list-style: none;
    font-size: 14px;
    margin: 0;
  }
  .navigation-cut ul li{
    display: inline-block;
    cursor: pointer;
  }
  .navigation-cut ul li a{
    color: #555555;
    text-decoration: none;
  }


  .navigation-cut ul>li+li:before {
    padding: 0 5px;
    color: #62a8ea;
    content: "/\00a0";
  }

  .navigation-cut ul li:last-child{
    color: #18d96e;
  }

  /*主要页面*/
  .resource-consume>div{
      /*margin-top: 19px;*/
    }
  .total-resource,
  .nearly24,
  .single-resource,
  .resource-pool{
    padding: 0 14px;
  }

  .total-resource.block-area>div.title,
  .nearly24.block-area>div.title,
  .single-resource.block-area>div.title,
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
  /*非编资源消耗率*/
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
  }

  .expect-resource table th,
  .expect-resource table td{
    width: 20%;
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
    width: 1019px;
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
  /*单台资源消耗排名*/
  .single-resource{
    width: 1100px;
    height: 317px;
    margin: 19px 0;
    border-radius: 2px;
  }

  .single-resource div#singleResourceMap{
    width: 100%;
    height: 210px;
    margin-top: 37px;
  }
  .single-resource div.title>span:last-child{
    height: 14px;
    font-weight: normal;
    cursor: pointer;
    float: right;
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
    width: 1070px;
    /*width: 100%;*/
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

  .microservice{
    width: 480px;
    height: 355px;
    border-radius: 2px;
  }

  .microservice>div.title{
    background-color: #18d96e;
    padding: 0 14px;
    font-size: 16px;
    color: #ffffff;
  }
  .microservice div.table-content{
    height:298px;
  }


  .microservice table{
    width: 452px;
    min-height: 276px;
    border: solid 1px #eeeeee;
  }

  .microservice table thead tr>th:first-child,
  .microservice table tbody tr>td:first-child,
  .microservice table tbody tr>td:nth-child(3),
  .microservice table thead tr>th:nth-child(3){
    width: 18%;
  }

  .microservice table tbody tr>td:nth-child(4),
  .microservice table thead tr>th:nth-child(4),
  .microservice table tbody tr>td:nth-child(5),
  .microservice table thead tr>th:nth-child(5){
    width: 25%;
  }

  .microservice table tbody tr>td:nth-child(2),
  .microservice table thead tr>th:nth-child(2){
    width: 12%;
  }




</style>
