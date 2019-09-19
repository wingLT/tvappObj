<template>
  <!--单台服务器资源消耗-->
  <div class="content single-resource clear">
    <div class="navigation-cut">
      <ul>
        <li>
          <router-link to="resourdeOption">总体资源消耗率</router-link>
        </li>
        <li>{{businessType}}资源消耗</li>
      </ul>
    </div>
    <div class="fl">
      <!--单台服务器资源消耗-->
      <div class="total-resource block-area">
        <div class="title ">
          <span>{{businessType}}资源消耗（{{serverName}}）</span>
        </div>
        <div id="totalResourceMap"></div>
      </div><!--单台服务器资源消耗  end-->

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
      <div class="microservice block-area expect-resource-free">
        <div class="title ">
          <span>微服务资源消耗明细</span>
        </div>
        <table style="table-layout:fixed;">
          <thead>
          <tr>
            <th>资源类型</th>
            <th>总体</th>
            <th>CPU</th>
            <th>内存</th>
            <th>磁盘</th>
          </tr>
          </thead>
        </table>
       <div class="table-content">
         <table style="table-layout:fixed;">
           <tbody>
           <tr v-for="item in microserviceData">
             <td :title="item.serverName">{{item.serverName}}</td>
             <td>{{item.consume}}%</td>
             <td>{{getToFixed(item.cpu)}}%</td>
             <td>{{getToFixed(item.mem)}}%</td>
             <td>{{item.diskUtil}}%</td>
           </tr>
           </tbody>
         </table>
       </div>
      </div> <!--微服务资源消耗明细  end-->


    </div>
    <div class="fr">
      <!--资源消耗历史统计-->
      <div class="block-area resource-history">
        <div class="title ">
          <span>资源消耗历史统计</span>
          <ul class="fr time-cut">
            <li data-id="1" @click="cutResourceHistory($event,1)">1天</li>
            <li data-id="7" @click="cutResourceHistory($event,7)">7天</li>
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

      <!--资源消耗侧重排名-->
      <div class="block-area resource-ranking">
        <div class="title ">
          <span>资源消耗侧重排名</span>
        </div>
        <div id="resourceRankingMap"></div>
      </div><!--资源消耗侧重排名-->

      <!--资源池资源消耗曲线-->
      <div class="resource-pool block-area">

        <div class="title ">
          <span>资源池资源消耗曲线</span>
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
        <div class="resource-pool-map">
          <div class="y-name">
            <div>起 {{resourcePoolStartTime}}</div>
            <div class="fr">止 {{resourcePoolEndTime}}</div>
          </div>
          <div id="resourcePoolMap"></div>
        </div>
      </div><!--资源池资源消耗曲线-->

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
    name: 'singleSeverResource',
    data() {
      return {
        totalResourceMap:'',//总体资源消耗率
        resourceRankingMap:'',//资源消耗侧重排名
        resourcePoolMap:'',//资源池资源消耗曲线
        resourceHistoryMap:'',//资源消耗历史统计
        resourceActualHistory:[],//资源消耗历史统计的历史数据
        consumePredict:{},//预期资源的消耗
        microserviceData:[],//微服务资源消耗明细的数据
        serverName:'',
        timeFlag:'',
        clickTime:'',
        businessType:'',
        isPhysics:false,
        id:'',
        resourcePoolStartTime:'',
        resourcePoolEndTime :'',
        isHeightLight:false,//是否高亮
      }
    },
    methods: {
      cutResourceHistory:function (event,timeFlag) {
        var self = this;
        self.timeFlag = timeFlag;
        $(event.target).parent().find('li').removeClass('active');
        $(event.target).addClass('active');
        getAllData(self);
        getResourcePoolData(self);
      },
      timeTransform:function (time) {
        return Math.round(time);
      },
      getToFixed:function (val) {
        if(GlobalVar.isNumber(val)){
          return val.toFixed(2);
        }else{
          return '';
        }

      }
    },
    updated:function () {
      GlobalVar.setScroll('table-content');
    },
    mounted: function () {
      var self = this;
      var receiveBusiness = GlobalVar.getSessionStorageJson('SINGLE-SERVER-DATA');
      self.serverName = receiveBusiness.equipmentName;
      self.timeFlag = receiveBusiness.timeFlag;
      self.clickTime = receiveBusiness.clickTime;
      self.businessType = receiveBusiness.businessType;
      self.isPhysics = receiveBusiness.isPhysics;
      self.id = receiveBusiness.id;
      var router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      }
      GlobalVar.setHistoryRouter(router);
      $('ul.time-cut').find('li').removeClass('active');
      $('ul.time-cut').find('li[data-id="'+self.timeFlag+'"]').addClass('active');

      self.totalResourceMap = echarts.init(document.getElementById('totalResourceMap'));
      self.resourceRankingMap = echarts.init(document.getElementById('resourceRankingMap'));
      self.resourcePoolMap = echarts.init(document.getElementById('resourcePoolMap'));

      getAllData(self);
      //微服务资源消耗明细
      microserviceServerConsume(self);
      //资源池的消耗
      getResourcePoolData(self);
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
    if(self.resourceRankingMap  && !self.resourceRankingMap.isDisposed()){
      self.resourceRankingMap.clear();           //释放图形资源
      self.resourceRankingMap.dispose();
    }
    if(self.resourceHistoryMap  && !self.resourceHistoryMap.isDisposed()){
      self.resourceHistoryMap.clear();           //释放图形资源
      self.resourceHistoryMap.dispose();
    }
  }

  /*
  * 获取所有的数据
  * ///serverConsume/singleServer/{time}  devId  物理机传  vmId 虚拟机传
  * */
  function getAllData(self) {
    var requestUrl;
    if(self.isPhysics){
      //物理机
      requestUrl = GlobalVar.urlName+'serverConsume/singleServer/'+self.timeFlag+'?devId='+self.id+'&vmId=';
    }else{
      //虚拟机
     requestUrl = GlobalVar.urlName+'serverConsume/singleServer/'+self.timeFlag+'?devId=&vmId='+self.id;
    }
    $.ajax({
      type:'get',
      url:requestUrl,
      success:function (result) {
        if(Number(result.status) == 200){
          if(!GlobalVar.isEmptyObject(result.data)){
            handleAllData(result.data,self);
          }
        }
      },error:function (e) {}
    })

  }

  /*
  * 处理所有的数据
  * */
 function handleAllData(data,self) {
   self.consumePredict = data.consumePredict?data.consumePredict:{};

   /*单台服务器资源消耗*/
   var currentConsume = data.currentConsume?data.currentConsume:0;
   PublicMap.getPieMap('#18d96e',self.totalResourceMap,Math.round(Number(currentConsume)));
   /*得到资源消耗历史统计的数据*/
   var consumeList = data.consumeList;
   var forecastConsumeJsonArray = data.forecastConsumeJsonArray;
   var consumeData = [];
   var allTime = [];
   var historyLen;
   if(!GlobalVar.isEmptyObject(consumeList)){
     var data = consumeList;
     historyLen = data.length;
     for(var i = 0;i<data.length;i++){
       consumeData.push(data[i].value);
       allTime.push(data[i].key);
     }
   }
   if(!GlobalVar.isEmptyObject(forecastConsumeJsonArray)){
     var data = forecastConsumeJsonArray;
     for(var i = 0;i<data.length;i++){
       consumeData.push((data[i] * 100).toFixed(2));
//       consumeData.push((data[i]).toFixed(2));
       allTime.push('');
     }
   }
   var consumeRateData = GlobalVar.getHistoryAndForecastData(consumeData, allTime, historyLen);
   var historyData = consumeRateData.historyData;
   var forecastData = consumeRateData.forecastData;
   var actualShowTime = consumeRateData.actualShowTime;
   resourceHistoryMap(self,historyData,forecastData,allTime,actualShowTime,historyLen);
 }

  /*
  * 得到资源消耗侧重排名
  * /consumeOrder/vmOrPhysical?devId=74&time=2018-01-13%2012:05:00&vmId=
  * */
 function resourceRanking(self) {
   var time  = '2018-01-13 12:05:00'
   var url;
   if(self.isPhysics){
     url  = 'consumeOrder/vmOrPhysical?devId='+self.id+'&time='+self.clickTime+'&vmId='
//     url  = 'consumeOrder/vmOrPhysical?devId='+self.id+'&time='+time+'&vmId=';
   }else{
     url  = 'consumeOrder/vmOrPhysical?vmId='+self.id+'&time='+self.clickTime+'&devId='
//     url  = 'consumeOrder/vmOrPhysical?vmId='+self.id+'&time='+time+'&devId='
   }
   $.ajax({
     type:'get',
     url:GlobalVar.urlName+url,
     success:function (result) {
        if(Number(result.status) == 200){
          handleResourceRankingData(result.data.content,self);
        }
     },error:function (e) {}
   })
 }


 /*
 * 处理资源消耗侧重排名的数据
 * */
 function handleResourceRankingData(data,self) {
    if(!GlobalVar.isEmptyObject(data)){
      var content = JSON.parse(data);
      var weight = content.weight;
      var cpu = weight.CPU?weight.CPU[0].toFixed(2):0;
      var disk = weight.DISK?weight.DISK[0].toFixed(2):0;
      var rem = weight.RAM?weight.RAM[0].toFixed(2):0;
      var singleBar = [cpu,rem,disk];
      var singleYBar = ['CPU','内存','磁盘'];
      var option = PublicMap.getCrosswiseBarMap(singleBar,'#58c9f3',singleYBar,false);
      self.resourceRankingMap .setOption(option,true);
    }
 }

 /*
 * 获取微服务资源消耗明细的数据
 * vmOrPhysical  vm or physical
 * id  物理机时传devId vm 时传vmId
 * microService/{vmOrPhysical}/{id}
 * */
 function microserviceServerConsume(self) {
   var vmOrPhysical;
   if(self.isPhysics){
     vmOrPhysical = 'physical';
   }else {
     vmOrPhysical = 'vm';
   }
   $.ajax({
     type:'get',
//     url:GlobalVar.urlName+'microService/'+vmOrPhysical+'/'+self.id+'?time=',
     url:GlobalVar.urlName+'microService/'+vmOrPhysical+'/'+self.id+'?time='+self.clickTime,
     success:function (result) {
       if(Number(result.status) == 200){
         self.microserviceData = result.data;
       }
     },error:function (e) {}
   })
 }


 /*
 * 得到资源池资源消耗的数据
 *  ///vmOrPhysical/usage/{timeFlag}
 * */
 function getResourcePoolData(self) {
   var requestUrl;
   if(self.isPhysics){
     //物理机
    requestUrl = GlobalVar.urlName+'vmOrPhysical/usage/'+self.timeFlag+'?devId='+self.id+'&vmId=';
   }else{
     //虚拟机
     requestUrl = GlobalVar.urlName+'vmOrPhysical/usage/'+self.timeFlag+'?devId=&vmId='+self.id;
   }
   $.ajax({
     type:'get',
     url:requestUrl,
     success:function (result) {
       if(Number(result.status) == 200){
         if(!GlobalVar.isEmptyObject(result.data)){
           handleResourcePoolData(result.data, self)
         }
       }

     },error:function (e) {}
   })

 }
  /*
  * 处理资源池资源消耗的数据
  * */
  function handleResourcePoolData(data, self) {
    var cpuList = data.cpuList;
    var diskUtilList = data.diskUtilList;
    var memList = data.memList;

    var cpuData = [];
    var diskData = [];
    var memData = [];
    var allTime = [];
    for (var i = 0; i < cpuList.length; i++) {
      cpuData.push(cpuList[i].value);
      allTime.push(cpuList[i].key);
    }

    self.resourcePoolStartTime = allTime[0];
    self.resourcePoolEndTime = allTime[allTime.length - 1];

    for (var i = 0; i < diskUtilList.length; i++) {
      diskData.push(diskUtilList[i].value);
    }
    for (var i = 0; i < memList.length; i++) {
      memData.push(memList[i].value);
    }
    resourcePoolMap(allTime, cpuData, diskData, memData, self);
  }


  /*资源池资源消耗曲线*/
  function resourcePoolMap(allTime,cpuData,diskData,memData,self) {
    var option = {
      tooltip:{
        trigger:'axis',
        formatter:function (params) {
          var dataIndex = params[0].dataIndex;
          var html = [];
          html.push('<div id="detailsMap" class="server-resource-line">');
          html.push('<div>');
          html.push('<div class="title">');
          html.push('<span></span><span>资源消耗</span><span class="time">' + allTime[dataIndex] +'</span>');
          html.push('</div>');
          html.push('<ul>');
          html.push('<li><div><span>' + cpuData[dataIndex] + '%</span></div> <p>CPU</p></li>');
          html.push('<li><div><span>' + diskData[dataIndex] + '%</span></div> <p>磁盘</p></li>');
          html.push('<li><div><span>' + memData[dataIndex] + '%</span></div> <p>内存</p></li>');
          html.push('</ul>');
          html.push('</div>')
          html.push('</div>');
          return html.join('');
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: allTime,
        axisTick:{
          show:false
        },
        splitLine:{
          show:false
        },
        axisLabel: {
          show:false
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
        left: '0',
        right: '10px',
        bottom: '0',
        top:'10px',
        containLabel: true
      },
      yAxis: {
        "axisLine": {
          show: true,
          lineStyle: {
            width:2,
            color: '#eeeeee'
          }
        },
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
          color:'#555555',
//          formatter:function (val) {
//            return val+'%'
//          }
        }

      },
      series: [
        {
          name: 'CPU',
          type: 'line',
          symbolSize:8,
          data:cpuData,
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
          itemStyle: {
            normal: {
              color: '#58c9f3',
            }
          }
        },
        {
          name: '磁盘',
          type: 'line',
          symbolSize:8,
          data:diskData,
          lineStyle: {
            normal: {
              color: '#fbb321',
              width: 2,
            },
          },
          areaStyle: {
            normal: {
              color: '#f8f8f8'
            }
          },
          itemStyle: {
            normal: {
              color: '#fbb321',
            }
          }
        },
        {
          name: '内存',
          type: 'line',
          symbolSize:8,
          data:memData,
          lineStyle: {
            normal: {
              color: '#ff6c60',
              width: 2,
            },
          },
          areaStyle: {
            normal: {
              color: '#f8f8f8'
            }
          },
          itemStyle: {
            normal: {
              color: '#ff6c60',
            }
          }
        }
      ]
    };
    self.resourcePoolMap.setOption(option,true);
  }

  /*资源消耗历史统计*/
  function resourceHistoryMap(self,historyData,forecastData,actualTime,showEndTime,historyLen) {
    if(self.resourceHistoryMap  && !self.resourceHistoryMap.isDisposed()){
      self.resourceHistoryMap.clear();           //释放图形资源
      self.resourceHistoryMap.dispose();
    }
    self.resourceHistoryMap = echarts.init(document.getElementById('resourceHistoryMap'));
    var option = {
      tooltip:{
        show:true,
        trigger:'axis',
        formatter:function (params) {
          var dataIndex = params[0].dataIndex;
          var html = [];
          if(dataIndex>historyLen){}else{
            html.push('<div id="detailsMap">');
            html.push('<div>');
            html.push('<div class="title">');
            html.push('<span></span><span>资源消耗</span><span class="time">'+actualTime[dataIndex]+'</span>');
            html.push('</div>');
            html.push('<ul>');
            html.push('<li><div><span>'+historyData[dataIndex]+'%</span></div> <p>资源消耗率</p></li>');
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
          type:'slider',
          textStyle:false,
          start: 0,
          end: 100,
        },
        //下面这个属性是里面拖到
        {
          type: 'inside',
          show: true,
          xAxisIndex: [0],
          textStyle:false,
          start: 0,//默认为1
          end: 100//默认为100
        }
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
          show:false,
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
        left: '0',
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
          show:false
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
    for (var i = 0; i < actualTime.length; i++) {
      var allTimeContent = DateUtils.format(new Date(actualTime[i]), 'yyyy-MM-dd HH:mm:ss');
      if (new Date(allTimeContent).getTime() == new Date(currentClickTime).getTime()) {
        self.isHeightLight = true;
        PublicMap.echartHeightLight(option, self.resourceHistoryMap, i);
      } else {
        self.isHeightLight = false;
      }
    }

    //当前最新的时间
    var newestTime = actualTime[Number(historyLen) - 1];
    //如果存在高亮，时间就是高亮的数据的时间，如果没有高亮，时间就是最新的时间
    if (self.isHeightLight) {
      var time = self.clickTime;
      //资源消耗侧重排名
      resourceRanking(self);
    } else {
      self.clickTime = newestTime;
      resourceRanking(self);
    }

    self.resourceHistoryMap.on('click',function (params) {
      var dataIndex = params.dataIndex;
      if(dataIndex<historyLen){
        self.clickTime = actualTime[dataIndex];
        resourceRanking(self);
      }
    })
  }

</script>
<style scoped>
  .navigation-cut{
    text-align: right;
  }

  /*.single-resource>div{*/
    /*margin-top: 19px;*/
  /*}*/

  .total-resource,
  .resource-history,
  .resource-ranking,
  .resource-pool{
    padding: 0 14px;
  }

  .total-resource.block-area>div.title,
  .resource-pool.block-area>div.title,
  .resource-history.block-area>div.title,
  .resource-ranking.block-area>div.title{
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
    padding: 0 14px;
    font-size: 16px;
    color: #ffffff;
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

  .expect-resource table thead tr,
  .microservice table thead tr{
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
  }

  .expect-resource table td,
  .microservice table td{
    color: #555555;
  }

  /*微服务资源消耗明细*/
  .microservice{
    width: 480px;
    height: 281px;
  }
  .microservice div.title{
    margin-bottom: 10px;
  }

  .microservice table{
    width: 452px;
    /*height: 202px;*/
    border: solid 1px #eeeeee;
    margin: 0 auto;
  }

  .microservice table thead tr{
    height: 38px;
  }

  .microservice table th,
  .microservice table td{
    text-align: center;
    height: 40px;
    line-height: 40px;
    border: solid 1px #eeeeee;
    width: 14%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .microservice table thead tr>th:first-child,
  .microservice table tbody tr>td:first-child{
    width: 30%;
  }
  .microservice div.table-content{
    height:167px;
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


  /*资源消耗侧重排名*/
  .resource-ranking{
    width: 1100px;
    height: 213px;
    margin: 19px 0;
    border-radius: 2px;
  }

  .resource-ranking div#resourceRankingMap{
    width: 100%;
    height: 134px;
    margin-top: 20px;
  }

  /*资源池资源消耗曲线*/
  .resource-pool{
    width: 1100px;
    height: 338px;
    border-radius: 2px;
  }
  .resource-pool-map{
    position: relative;
  }
  .resource-pool div.y-name{
    position: absolute;
    width: 100%;
    bottom: -31px;

  }

  #resourcePoolMap{
    width: 100%;
    margin-top: 22px;
    height: 215px;
  }
  .resource-pool div.title ul.legend{
    list-style: none;
  }

  .resource-pool div.title ul.legend,
  .resource-pool div.title span{
    display: inline-block;
  }

  .resource-pool>div.title>ul.legend li{
    display: inline-block;
  }

  .resource-pool >div.title>ul.legend{
    font-size: 14px;
    color: #555555;
    margin-left: 38px;
    vertical-align: top;
  }

  .resource-pool >div.title>ul.legend i{
    display: inline-block;
    width: 20px;
    height: 4px;
    border-radius: 2px;
    vertical-align: middle;
    margin-right: 6px;
  }


  .resource-pool >div.title>ul.legend li:first-child i{
    background-color: #58c9f3;
  }
  .resource-pool >div.title>ul.legend li:nth-child(2){
    margin:  0 17px;
  }

  .resource-pool >div.title>ul.legend li:nth-child(2) i{
    background-color: #fbb321;
  }
  .resource-pool >div.title>ul.legend li:last-child i{
    background-color: #ff6c60;
  }

  div.y-name>div{
    display: inline-block;
    vertical-align: top;
    width: 83px;
    text-align: center;
    font-size: 12px;
    color: #555555;
  }
</style>
