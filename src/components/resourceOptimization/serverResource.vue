<template>
  <!--后台服务器资源消耗-->
  <div class="content resource-consume clear">
    <div class="navigation-cut">
      <ul>
        <li>
          <router-link to="resourdeOption">总体资源消耗率</router-link>
        </li>
        <li>后台服务器资源消耗率</li>
      </ul>
    </div>
    <div class="fl">
      <!--后台服务器资源消耗率-->
      <div class="total-resource block-area">
        <div class="title ">
          <span>{{businessType}}资源消耗率</span>
        </div>
        <div id="totalResourceMap"></div>
      </div><!--后台服务器资源消耗率  end-->

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

      <!--微服务资源消耗明细-->
      <div class="microservice block-area">
        <div class="title ">
          <span>微服务资源消耗明细</span>
        </div>

        <div>
          <table style="table-layout: fixed">
            <thead>
            <tr>
              <th>服务类别</th>
              <th>数量</th>
              <th>资源消耗率</th>
              <th>部署虚拟位置</th>
              <th>部署物理位置</th>
            </tr>
            </thead>
          </table>
         <div class="table-content">
           <table style="table-layout: fixed">
             <tbody>
             <tr v-for="item in microserviceData">
               <td><span>{{item.serverName}}</span></td>
               <td><span>{{item.serverNum}}</span></td>
               <td><span>{{item.consume}}%</span></td>
               <td><span :title="item.vmPosition">{{item.vmPosition}}</span></td>
               <td><span :title="item.physicalPostion">{{item.physicalPostion}}</span></td>
             </tr>


             </tbody>
           </table>
         </div>
        </div>
      </div> <!--微服务资源消耗明细  end-->
    </div>

    <div class="fr">
      <!--资源消耗历史统计-->
      <div class="block-area resource-history">
        <div class="title ">
          <span>资源消耗历史统计</span>
          <ul class="fr time-cut">
            <li data-id="1" @click="cutResourceHistory(1,$event)">1天</li>
            <li data-id="7" @click="cutResourceHistory(7,$event)">7天</li>
            <!--<li class="active" >30天</li>-->
          </ul>
        </div>
        <div class="resource-history-map">
          <div class="y-name" style="display: none">
            <div>起 2017-11-29 10:30:35</div>
            <div class="fr">止 2017-11-29 10:30:35</div>
          </div>
          <div id="resourceHistoryMap"></div>
        </div>
      </div> <!--资源消耗历史统计  end-->


      <!--服务器资源消耗排名 -->
      <div class="server-resource block-area">
        <div class="title">
          <span>服务器资源消耗排名</span>
          <span @click="ShowDetails()">查看详情</span>
        </div>
        <div class="server-resource-map">
          <div class="map-name">
            <div class="fl">
              <span>物理机</span>
            </div>
            <div class="fr">
              <span>虚拟机</span>
            </div>
          </div>
          <div id="physicalMachineMap" class="fl machine-map"></div>
          <div id="virtualMachineMap" class="fr machine-map"></div>
        </div>
      </div><!--服务器资源消耗排名  end-->


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
    name: 'serverresource',
    data() {
      return {
        value:20,
        totalResourceMap:'',//总体资源消耗率
        resourcePoolMap:'',//资源池资源消耗
        resourceHistoryMap:'',//资源消耗历史统计
        businessType:'后台服务器',
        resourceActualHistory:[],
        /*====服务器资源消耗排名====*/
        physicalMachineMap:'',//物理机
        virtualMachineMap:'',//虚拟机
        clickTime:'',
        timeFlag:'',
        businessTypeSn:'server',
        isHeightLight:false,//是否高亮
        consumeList:[],//资源消耗的历史数据
        forecastConsumeJsonArray:[],//资源消耗预测的数据
        currentConsume:0,//当前对的消耗率
        historyLen:0,//消耗的历史数据的长度
        consumePredict:'',//预期资源的消耗
        microserviceData:[],//微服务资源消耗明细
      }
    },
    methods: {
      cutResourceHistory:function (timeFlag,event) {
        var self = this;
        self.timeFlag = timeFlag;
        $(event.target).parent().find('li').removeClass('active');
        $(event.target).addClass('active');
        /*资源消耗*/
        getAllData(self,self.timeFlag,self.businessTypeSn);
      },
      timeTransform:function (time) {
        return Math.round(time);
      },
      ShowDetails:function () {
        window.sessionStorage.setItem('isServer',true);
        //排名详情
        var data = {
          enName:this.businessTypeSn,
          timeFlag:this.timeFlag,
          businessType:this.businessType
        };
        GlobalVar.setSessionStorageJson('ranking-details',data);
        this.$router.push({ path: '/resourceRankingDetails' })
      }
      //后台服务器
    },
    updated:function () {
      GlobalVar.setScroll('table-content');
    },
    mounted: function () {
      var self = this;
      var receiveBusiness = GlobalVar.getSessionStorageJson('server-business-data');
      self.clickTime = receiveBusiness.clickTime;
      self.timeFlag = receiveBusiness.timeFlag;
      self.businessTypeSn = receiveBusiness.enName;
      $('ul.time-cut').find('li').removeClass('active');
      $('ul.time-cut').find('li[data-id="'+self.timeFlag+'"]').addClass('active');

      var router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      }
      GlobalVar.setHistoryRouter(router);

      self.totalResourceMap = echarts.init(document.getElementById('totalResourceMap'));


      self.physicalMachineMap = echarts.init(document.getElementById('physicalMachineMap'));
      self.virtualMachineMap = echarts.init(document.getElementById('virtualMachineMap'));

      /*资源消耗*/
      getAllData(self,self.timeFlag,self.businessTypeSn);
      microserviceServerConsume(self);

    },
    beforeDestroy:function () {
      var self = this;
      destroyEcharts(self);
    }
  }

  /*
  * 销毁页面上所有的echars里面的数据，重新绘图渲染
  * */
  function destroyEcharts(self){
    if(self.totalResourceMap  && !self.totalResourceMap.isDisposed()){
      self.totalResourceMap.clear();           //释放图形资源
      self.totalResourceMap.dispose();
    }
    if(self.resourcePoolMap  && !self.resourcePoolMap.isDisposed()){
      self.resourcePoolMap.clear();           //释放图形资源
      self.resourcePoolMap.dispose();
    }
    if(self.physicalMachineMap  && !self.physicalMachineMap.isDisposed()){
      self.physicalMachineMap.clear();           //释放图形资源
      self.physicalMachineMap.dispose();
    }
    if(self.virtualMachineMap  && !self.virtualMachineMap.isDisposed()){
      self.virtualMachineMap.clear();           //释放图形资源
      self.virtualMachineMap.dispose();
    }
  }

  /*
  * 得到所有的数
  * self：vue的对象
  * timeFlag:时间标识
  * businessType：业务类型（英文）
  * comsumeTotal/index/1/{type}
  * */
  function getAllData(self,timeFlag,businessType) {
    $.ajax({
      url:GlobalVar.urlName+'comsumeTotal/index/'+timeFlag+'/'+businessType,
      type:'get',
      data:'',
      success:function (data) {
        if(Number(data.status) == 200){
          self.consumeList = data.data.consumeList;
          self.forecastConsumeJsonArray  = data.data.forecastConsumeJsonArray;
          self.currentConsume = Math.round(data.data.currentConsume);
          self.consumePredict = data.data.consumePredict?data.data.consumePredict:{};
          PublicMap.getPieMap('#18d96e',self.totalResourceMap,self.currentConsume);
          handleConsume(self);
        }
      },
      error:function (e) {}
    })
  }

  /*
  * 得到资源池的数据
  * timeFlag:时间标示
  * time：时间
  * self：vue对象
  *  ///serverConsume/resourcePool/{timeFlag}?time=2018-01-12%2020:30:00
  * */
  function getResourcePoolData(timeFlag,time,self) {
      $.ajax({
      type:'get',
      url:GlobalVar.urlName+'serverConsume/resourcePool/'+timeFlag+'?time='+time,
//      url:GlobalVar.urlName+'serverConsume/resourcePool/'+timeFlag+'?time=2018-01-12 20:30:00',
      success:function (result) {
        self.resourcePoolMap = echarts.init(document.getElementById('resourcePoolMap'));
        if(Number(result.status) == 200){
          var cpuValue = result.data.cpuList;
          var diskValue = result.data.diskUtilList;
          var memoryValue = result.data.memList;
          PublicMap.getBarMap(self.resourcePoolMap,cpuValue,diskValue,memoryValue);
        }
      },
      error:function (e) {}
    })


  }


  /*处理资源消耗数据*/
  function handleConsume(self) {
    var consumeData = [];
    var allTime = [];
    if(!GlobalVar.isEmptyObject(self.consumeList)){
      var data = self.consumeList;
      self.historyLen = data.length;
      for(var i = 0;i<data.length;i++){
        consumeData.push(Math.round(data[i].value));
        allTime.push(data[i].key);
      }
    }
    if(!GlobalVar.isEmptyObject(self.forecastConsumeJsonArray)){
      var data = self.forecastConsumeJsonArray;
      for(var i = 0;i<data.length;i++){
        consumeData.push((data[i] * 100).toFixed(2));
//        consumeData.push((data[i]).toFixed(2));
        allTime.push('');
      }
    }
    var consumeRateData = GlobalVar.getHistoryAndForecastData(consumeData, allTime, self.historyLen);
    var historyData = consumeRateData.historyData;
    var forecastData = consumeRateData.forecastData;
    var actualShowTime = consumeRateData.actualShowTime;
    resourceHistoryMap(self,historyData,forecastData,allTime,actualShowTime);
  }

  /*
  * 获取物理机排名的数据
  * time:时间点
  *   serverConsume/order
  * */
  function physicsMachine(time,self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlName+'serverConsume/order?time='+time,
//      url:GlobalVar.urlName+'serverConsume/order?time=2018-01-13 12:05:00',
      success:function (result) {
        if(Number(result.status) == 200){
          if(!GlobalVar.isEmptyObject(result.data)){
            handleMachines(result.data,self.physicalMachineMap,self,true);
          }else{
            handleMachines([],self.physicalMachineMap,self,true);
          }
        }
      },error:function (e) {}
    })
  }

  /*
   * 获取虚拟机排名的数据
   * time:时间点
   * */
  function virtualMachineMap(time,self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlName+'serverConsume/vm/order?time='+time,
//      url:GlobalVar.urlName+'serverConsume/order?time=2018-01-13 12:05:00',
      success:function (result) {
        if(Number(result.status) == 200){
          if(!GlobalVar.isEmptyObject(result.data)){
            handleMachines(result.data,self.virtualMachineMap,self,false);
          }else{
            handleMachines([],self.virtualMachineMap,self,false);
          }
        }
      },error:function (e) {}
    })
  }

  /*
  * 处理物理机和虚拟机的数据
  * mapName:echart对象
  * data：数据
  * self：vue对象
  * isPhysics：是否是物理机
  *   serverConsume/vm/order
  * */
  function handleMachines(data,mapName,self,isPhysics) {
    var yData = [];
    var value = [];
    var serverName = [];
    var allData = [];
    if(data.length>0){
      var len = data.length-1;
      for(var i = len;i>=0;i--){
        value.push(data[i].consume);
        yData.push('Top'+(i+1));
        allData.push(data[i]);
        serverName.push(data[i].serverName);
      }
    }
    setMachineMap(mapName,value,'#fbb321',yData,self,allData,isPhysics);
  }


  /*
  * 获取微服务资源消耗明细的数据
  * microService/server
  * */
  function microserviceServerConsume(self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlName+'microService/server',
      success:function (result) {
        if(Number(result.status) == 200){
          self.microserviceData = result.data;
        }

      },
      error:function (e) {}
    })
  }

  /*==============================后台服务器的数据处理=================================*/
  /*服务器资源消耗排名hover的数据*/
  function getMachineMapHoverHtml(dataIndex,allData,isPhysics) {
    var hoverData = allData[dataIndex].list;
    if(!GlobalVar.isEmptyObject(hoverData)){
      var html = [];
      html.push('<div id="detailsMap" class="server">');
      html.push('<div>');
      html.push('<div class="title">');
      if(isPhysics){
        html.push('<span></span><span>'+allData[dataIndex].serverName.substring(0,20)+'...服务消耗排行</span>');
      }else{
        html.push('<span></span><span>'+allData[dataIndex].vmName.substring(0,20)+'...服务消耗排行</span>');
      }
      html.push('</div>');
      for(var i = 0;i<hoverData.length;i++){
        var itemHtml = [];
        itemHtml.push('<div class="item">');
        if(isPhysics){
          itemHtml.push('<span class="name">'+hoverData[i].vmName+'</span>');
        }else{
          itemHtml.push('<span class="name">'+hoverData[i].dockerName+'</span>');
        }
        var consume = 0;
        if(hoverData[i].consume<1){
          consume = 1;
        }else{
          consume = Math.floor(hoverData[i].consume);
        }
        itemHtml.push('<div class="progress">')
        itemHtml.push('<div class="progress-bar progress-bar-success" role="progressbar" :aria-valuenow="'+consume+'" aria-valuemin="0" aria-valuemax="100" style="width: '+consume+'%;">');
        itemHtml.push('</div></div>');
        itemHtml.push('<span>'+hoverData[i].consume+'%</span>');

        itemHtml.push('</div>');
        html.push(itemHtml.join(''));
      }
      return html.join('');
    }else {
      var titleName ;
      if(isPhysics){
        titleName = allData[dataIndex].serverName;
      }else{
        titleName = allData[dataIndex].vmName;
      }
      return titleName;
    }




  }

  /*服务器资源消耗排名*/
  function  setMachineMap(idName,value,colorName,yData,self,allData,isPhysics) {
    var  option = {
      tooltip: {
        axisPointer: {
          type: 'shadow'
        },
        formatter:function (params) {
          var dataIndex = params.dataIndex;
          return getMachineMapHoverHtml(dataIndex,allData,isPhysics);
        }
      },
      grid: {
        top:'0',
        left: '0',
        right: '40px',
        bottom: '1px',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        splitNumber:3,
        boundaryGap: [0, 0.01],
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
                  return params.data+'%';
                }
              }
            }
          }
        }
      ]
    };
    idName.setOption(option,true);
    idName.on('click', function(params) {
      var dataIndex = params.dataIndex;
      //是否是物理机  devId  //虚拟机  vmId
      var id = isPhysics?allData[dataIndex].devId:allData[dataIndex].vmId;
      var equipmentName = isPhysics?allData[dataIndex].serverName:allData[dataIndex].vmName;
      //拿到数据进行数据填充的操作
      var singleServerData = {
        timeFlag:self.timeFlag,
        clickTime:self.clickTime,
        businessType: self.businessType,
        equipmentName:equipmentName,
        isPhysics:isPhysics,
        id:id
      };

      GlobalVar.setSessionStorageJson('SINGLE-SERVER-DATA',singleServerData);
      self.$router.push({ path: '/singleServerResourceConsume' })
    });
  }


  /*资源消耗历史统计*/
  function resourceHistoryMap(self,historyData,forecastData,actualTime,showEndTime) {
    if(self.resourceHistoryMap  && !self.resourceHistoryMap.isDisposed()){
      self.resourceHistoryMap.clear();           //释放图形资源
      self.resourceHistoryMap.dispose();
    }
    self.resourceHistoryMap = echarts.init(document.getElementById('resourceHistoryMap'));
    var len = self.historyLen;
    var option = {
      tooltip:{
        show:true,
        trigger:'axis',
        formatter:function (params) {
          var html = [];
          if(params[0].dataIndex>len){}else{
            html.push('<div id="detailsMap">');
            html.push('<div>');
            html.push('<div class="title">');
            html.push('<span></span><span>资源消耗</span><span class="time">'+actualTime[params[0].dataIndex]+'</span>');
            html.push('</div>');
            html.push('<ul>');
            html.push('<li><div><span>'+historyData[params[0].dataIndex]+'%</span></div> <p>资源消耗率</p></li>');
            html.push('</ul>');
            html.push('</div>')
            html.push('</div>');
          }
          return html.join('');
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
          xAxisIndex : [ 0, 0 ],
          start: 0,
          end: 100
        },
      ],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: showEndTime,
        axisTick:{
          show:false
        },
        splitLine:{
          show:false
        },
        axisLabel: {
          show: false,
          color: '#666666',
          formatter: '{value}'
        },
        "axisLine": {
          show: true,
          lineStyle: {
            width:2,
            color: '#eeeeee'
          }
        },
      },

      grid: {
        left: '25px',
        right: '10px',
        bottom: '45px',
        top:'10px',
//        containLabel: true
      },
      yAxis: {
        "axisLine": {
          show: true,
          lineStyle: {
            width:2,
            color: '#eeeeee'
          }
        },
        splitNumber:1,
        splitLine: {
          show: false,
          lineStyle: {
            color: '#eeeeee'
          }
        },
        "axisTick": {
          "show": false
        },
        axisLabel: {
          show:true,
          color:'#555555'
        }

      },
      series: [
        {
          name: 'CPU',
          type: 'line',
          symbolSize:8,
//          showAllSymbol: true,
          data:historyData,
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
          name: 'CPU',
          type: 'line',
          symbolSize:8,
          data:forecastData,
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
                type: 'dotted' //'dotted'虚线 'solid'实线
              }
            }
          }
        }
      ]
    };
    self.resourceHistoryMap.setOption(option,true);

    //判断是否是高亮：就是查询有没有上个页面传过来的时间点对应的数据，如果有就高亮，如果没有就不高亮
    var currentClickTime = DateUtils.format(new Date(self.clickTime), 'yyyy-MM-dd HH:mm:ss');
    for(var i = 0;i<actualTime.length;i++){
      var allTimeContent = DateUtils.format(new Date(actualTime[i]), 'yyyy-MM-dd HH:mm:ss');
      if(new Date(allTimeContent).getTime() == new Date(currentClickTime).getTime()){
        self.isHeightLight = true;
        //time = self.clickTime;
        PublicMap.echartHeightLight(option,self.resourceHistoryMap,i);
      }else{
        //time = actualTime[actualTime.length-1];
        self.isHeightLight = false;
      }
    }
    var time;
    if(self.isHeightLight){
      time = self.clickTime;
    }else{
      //获取资源池的数据
      time = actualTime[len-1];
      self.clickTime = time;
    }

    getResourcePoolData(self.timeFlag,time,self);
    virtualMachineMap(time,self);
    physicsMachine(time,self);
      //获取资源池的数据
    /*====服务器资源消耗排名======*/
//    physicsMachine('2018-01-13 12:05:00',self);
//    virtualMachineMap('2018-01-13 12:05:00',self);




    //点击当前最新的时间获取数据
    self.resourceHistoryMap.on('click',function (params) {
      var dataIndex = params.dataIndex;
      if(dataIndex<len){
        self.clickTime = actualTime[dataIndex];
        virtualMachineMap(self.clickTime,self);
        physicsMachine(self.clickTime,self);
        getResourcePoolData(self.timeFlag,self.clickTime,self);
      }
    })
  }

</script>
<style scoped>

  /*表格*/
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

  /*主要页面*/
  /*.resource-consume>div{*/
    /*margin-top: 19px;*/
  /*}*/
  .total-resource,
  .resource-pool,
  .resource-history,
  .server-resource{
    padding: 0 14px;
  }

  .total-resource.block-area>div.title,
  .nearly24.block-area>div.title,
  .server-resource.block-area>div.title,
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

  /*单台资源消耗排名*/
  .server-resource{
    width: 1100px;
    height: 310px;
    margin: 19px 0;
    border-radius: 2px;
  }


  .server-resource div.title>span:last-child{
    height: 14px;
    font-weight: normal;
    cursor: pointer;
    float: right;
  }


  /* 服务器资源消耗排名 */
  .server-resource .server-resource-map{
    width: 100%;
    margin-top: 20px;
    position: relative;
    height: 230px;
  }

  .server-resource .server-resource-map>div.machine-map{
    width: 535px;
    vertical-align: top;
    height: 210px;
  }

  .server-resource .server-resource-map>div.machine-map:last-child{
    border-left: 4px solid #eeeeee;
    padding-left: 10px;
  }

  .server-resource .server-resource-map .map-name{
    position: absolute;
    /*top: 208px;*/
    bottom: 0;
    width: 100%;
  }
  .server-resource .server-resource-map .map-name>div{
    display: inline-block;
    vertical-align: top;
    width: 535px;
    font-size: 16px;
    text-align: center;
    color: #666666;
  }
  .server-resource .server-resource-map .map-name>div span{
    display: inline-block;
    width: 200px;
    height: 26px;
    background-color: #f5f5f5;
    text-align: center;
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
    width: 100%;
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
    margin-bottom: 10px;
  }

  .microservice div.table-content{
    /*height:298px;*/
    height:247px;
    margin-top: -1px;
  }


  .microservice table{
    margin: 0 auto;
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


  /*资源消耗历史统计*/
  .resource-history{
    /*padding-left: 14px;*/
    width: 1100px;
    height: 268px;
    border-radius: 2px;
  }

  .resource-history .resource-history-map{
    width: 100%;
    height: 190px;
    position: relative;
    margin-top: 22px;
  }

  .resource-history .resource-history-map div.y-name{
    position: absolute;
    bottom: 10px;
    width: 100%;
  }

  .resource-history #resourceHistoryMap{
    width: 100%;
    /*height:145px;*/
    height: 180px;
  }

  .resource-history  div.y-name>div{
    display: inline-block;
    vertical-align: top;
    width: 83px;
    text-align: center;
    font-size: 12px;
    color: #555555;
  }

</style>
