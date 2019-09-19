<template>
  <!--单台资源消耗-->
  <div class="content single-resource clear">
    <div class="navigation-cut">
      <ul>
        <li>
          <router-link to="resourdeOption">总体资源消耗率</router-link>
        </li>
        <li>{{businessType}}资源消耗</li>
      </ul>
    </div>
    <div class="clear">
      <div class="fl">
        <!--单台资源消耗-->
        <div class="total-resource block-area">
          <div class="title ">
            <!--<span>单台{{businessType}}资源消耗</span>-->
            <span>{{businessType}}资源消耗（{{equipmentName}}）</span>
          </div>
          <div id="totalResourceMap"></div>
        </div><!--单台资源消耗  end-->

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

        <!--近24小时任务处理详情-->
        <div class="nearly24 block-area" v-show="isHaveNearly24Map">
          <div class="title ">
            <span>近24小时任务处理详情</span>
          </div>
          <div id="nearly24Map"></div>
        </div> <!--近24小时任务处理详情  end-->

      </div>
      <div class="fr">
        <!--资源消耗历史统计-->
        <div class="block-area resource-history">
          <div class="title ">
            <span>资源消耗历史统计</span>
            <ul class="fr time-cut">
              <li data-id="1"  @click="cutResourceHistory(1,$event)">1天</li>
              <li data-id="7" @click="cutResourceHistory(7,$event)">7天</li>
              <!--<li class="active" data-id="30">30天</li>-->
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



  </div>
</template>

<script>
  import echarts from 'echarts'
  import Swiper from '../../../static/js/swiper'
  import {GlobalVar} from '../../../static/js/utils'
  import {DateUtils} from '../../../static/js/DateUtils'
  import {PublicMap} from '../../../static/js/PublicMap'

  export default {
    name: 'singleResource',
    data() {
      return {
        businessType: '',//业务类型
        equipmentName: '',//设备名字
        devId: '',//设备id
        id:'',
        timeFlag: '',
        clickTime: '',
        totalResourceMap: '',//总体资源消耗率
        resourceRankingMap: '',//资源消耗侧重排名
        resourcePoolMap: '',//资源池资源消耗曲线
        resourceHistoryMap: '',//资源消耗历史统计
        resourceActualHistory: [],//资源消耗历史统计的历史数据
        forecastConsumeJsonArray: [],//资源消耗的预测的数据
        nearly24Map: '',//近24小时任务处理详情
        isHaveNearly24Map:true,//是否有近24小时的出处理详情
        isHeightLight: false,//是否高亮
        historyLen: '',//历史数据的长度
        resourcePoolStartTime: '',
        resourcePoolEndTime: '',
        consumePredict: ''//预期资源消耗
      }
    },
    methods: {
      cutResourceHistory: function (timeFlag,event) {
        var self = this;
        self.timeFlag = timeFlag;
        $(event.target).parent().find('li').removeClass('active');
        $(event.target).addClass('active');

        getAllData(self.devId, self.timeFlag, self);
        /*资源池资源消耗曲线*/
        getResourcePoolData(self.devId, self.timeFlag, self);
      },
      timeTransform: function (time) {
        //时间 截取
        return Math.round(time);
      },
    },
    mounted: function () {
      var self = this;
      //得到传送过来的值
      var receiveBusiness = GlobalVar.getSessionStorageJson('single-business-data');
      self.businessType = receiveBusiness.businessType;
      self.equipmentName = receiveBusiness.equipmentName;
      self.timeFlag = receiveBusiness.timeFlag;
      self.clickTime = receiveBusiness.clickTime;
      self.devId = receiveBusiness.devId;
      self.id = receiveBusiness.id;
      $('ul.time-cut').find('li').removeClass('active');
      $('ul.time-cut').find('li[data-id="' + self.timeFlag + '"]').addClass('active');
      var routerName = '单台' + self.businessType + '资源消耗';
      var router = {
        url: this.$route.path,
        name: routerName,
        className: 'active'
      }
      GlobalVar.setHistoryRouter(router);

      self.totalResourceMap = echarts.init(document.getElementById('totalResourceMap'));
      self.resourceRankingMap = echarts.init(document.getElementById('resourceRankingMap'));
      self.resourcePoolMap = echarts.init(document.getElementById('resourcePoolMap'));

      self.nearly24Map = echarts.init(document.getElementById('nearly24Map'));

      getAllData(self.devId, self.timeFlag, self,self.id);

      /*资源池资源消耗曲线*/
      getResourcePoolData(self.devId, self.timeFlag, self);

      getNearly24Data(self.devId,self);
    },
    beforeDestroy:function () {
      var self = this;

      destroyEcharts(self);
    }
  }

  /*
  * 销毁echarts
  * */
  function destroyEcharts(self){
    if(self.totalResourceMap  && !self.totalResourceMap.isDisposed()){
      self.totalResourceMap.clear();           //释放图形资源
      self.totalResourceMap.dispose();
    }
    if(self.resourceRankingMap  && !self.resourceRankingMap.isDisposed()){
      self.resourceRankingMap.clear();           //释放图形资源
      self.resourceRankingMap.dispose();
    }
    if(self.resourcePoolMap  && !self.resourcePoolMap.isDisposed()){
      self.resourcePoolMap.clear();           //释放图形资源
      self.resourcePoolMap.dispose();
    }
    if(self.nearly24Map  && !self.nearly24Map.isDisposed()){
      self.nearly24Map.clear();           //释放图形资源
      self.nearly24Map.dispose();
    }
    if(self.resourceHistoryMap  && !self.resourceHistoryMap.isDisposed()){
      self.resourceHistoryMap.clear();           //释放图形资源
      self.resourceHistoryMap.dispose();
    }
  }
  /*
  * 得到所有的数据
  * devId：设备id
  * timeFlag：时间标识
  * self：vue对象
  * */
  function getAllData(devId, timeFlag, self,id) {
    $.ajax({
      type: 'get',
      url: GlobalVar.urlName + 'comsumeTotal/singleConsume/' + devId + '/' + timeFlag,
      success: function (data) {
        if (Number(data.status) == 200 && data.msg == 'OK') {
          handleDallData(data.data, self);
        }
      },
      error: function (e) {
      }
    })
  }

  /*处理所有的数据*/
  function handleDallData(data, self) {
    if (!GlobalVar.isEmptyObject(data)) {
      var currentConsume = data.currentConsume;
      //forecastConsumeJsonArray
      PublicMap.getPieMap('#18d96e', self.totalResourceMap, Math.round(currentConsume));
      self.consumePredict = data.consumePredict?data.consumePredict:{};
      var consumeList = data.consumeList;//取出来的历史的数据
      self.historyLen = consumeList.length;
      var historyLen = consumeList.length;
      var forecastConsumeList = data.forecastConsumeJsonArray;//取出来的预测的数据
      var consumeRateData = [];
      var allTime = [];
      if (!GlobalVar.isEmptyObject(consumeList)) {
        for (var i = 0; i < consumeList.length; i++) {
          consumeRateData.push(consumeList[i].value);
          allTime.push(consumeList[i].key);
        }
      }

      if (!GlobalVar.isEmptyObject(forecastConsumeList)) {
        for (var i = 0; i < forecastConsumeList.length; i++) {
//          consumeRateData.push((forecastConsumeList[i] * 100).toFixed(2));
          consumeRateData.push((forecastConsumeList[i]).toFixed(2));
          allTime.push('');
        }
      }
      var consumeRateData = GlobalVar.getHistoryAndForecastData(consumeRateData, allTime, historyLen);
      var consumeRate = consumeRateData.historyData;
      var forecastConsume = consumeRateData.forecastData
      var actualShowTime = consumeRateData.actualShowTime;
      /*资源消耗历史统计*/
      resourceHistoryMap(self, consumeRate, forecastConsume, allTime, actualShowTime);
    }

  }

  /*
  * 得到近24小时任务处理详情的数据
  * devId:设备id
  * consumeBusTotal/busDevTaskInfo/{devId}
  * */
  function getNearly24Data(devId,self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlNameW+'consumeBusTotal/busDevTaskInfo/'+devId,
      success:function (data) {
          if(Number(data.status) == 200){
            if(!GlobalVar.isEmptyObject(data.data)){
              handleNealry24Data(data.data,self)
//              getBreakdownHistoryMap(data.data,self);
              self.isHaveNearly24Map = true;
            }else {
              self.isHaveNearly24Map = false;
            }
          }
      },
      error:function (e) {}
    })
  }

  /*
  * 得到资源消耗侧重排名的数据
  * devId:设备id
  * time：某个时间点
  * */
  function getResourceRankingData(devId, time, self) {
    $.ajax({
      type: 'get',
      url:GlobalVar.urlName+'comsumeTotal/singleConsumeOrder/'+devId+'?time='+time,
//      url: GlobalVar.urlName + 'comsumeTotal/singleConsumeOrder/' + devId + '?time=2018-01-13 12:05:00',
      success: function (data) {
        if (Number(data.status) == 200 && data.msg == 'OK') {
          if (!GlobalVar.isEmptyObject(data.data)) {
            if (!GlobalVar.isEmptyObject(data.data.content)) {
              var content = JSON.parse(data.data.content);
              resourceRankingMap(self, content);
            }
          }
        }
      },
      error: function (e) {
      }
    })
  }


  /*资源消耗侧重排名*/
  function resourceRankingMap(self, data) {
    var weight = data.weight;
    var cpu = weight.CPU ? (weight.CPU[0] ).toFixed(2) : 0;
    var disk = weight.DISK ? (weight.DISK[0]).toFixed(2) : 0;
    var ram = weight.RAM ? (weight.RAM[0] ).toFixed(2) : 0;
    var singleBar = [cpu, disk, ram];
    var singleYBar = ['CPU', '磁盘', '内存'];
    var option = PublicMap.getCrosswiseBarMap(singleBar, '#58c9f3', singleYBar, true);
    self.resourceRankingMap.setOption(option, true);
//    window.onresize = function () {
//      //重置容器高宽
//      self.resourceRankingMap.resize();
//    };
  }


  /*
  * 得到资源池资源消耗的数据
  * devId:设备名称
  * timeFlag：时间标识
  * */
  function getResourcePoolData(devId, timeFlag, self) {
    $.ajax({
      type: 'get',
      url: GlobalVar.urlName + 'comsumeTotal/singleCptUse/' + devId + '/' + timeFlag,
      success: function (data) {
        if (Number(data.status) == 200 && data.msg == 'OK') {
          if (!GlobalVar.isEmptyObject(data.data)) {
            handleResourcePoolData(data.data, self);
          }
        }
      },
      error: function (e) {
      }
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
  function resourcePoolMap(allTime, cpuData, diskData, memData, self) {
    var option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          var dataIndex = params[0].dataIndex;
          var html = [];
          html.push('<div id="detailsMap" class="server-resource-line">');
          html.push('<div>');
          html.push('<div class="title">');
          html.push('<span></span><span>资源消耗</span><span class="time">' + allTime[dataIndex] + '</span>');
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
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        "axisLine": {
          show: true,
          lineStyle: {
            width: 2,
            color: '#eeeeee'
          }
        },
      },
      grid: {
        left: '30px',
        right: '10px',
        bottom: '0',
        top: '10px',
        containLabel: true
      },
      yAxis: {
        "axisLine": {
          show: true,
          lineStyle: {
            width: 2,
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
          show: true,
          color:'#555555',
          formatter: '{value} %'
        }

      },
      series: [
        {
          name: 'CPU',
          type: 'line',
          symbolSize: 8,
          data: cpuData,
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
          symbolSize: 8,
          data: diskData,
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
          symbolSize: 8,
          data: memData,
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
    self.resourcePoolMap.setOption(option);
  }

  /*资源消耗历史统计*/
  function resourceHistoryMap(self, historyData, forecastData, actualTime, showEndTime) {
    if(self.resourceHistoryMap  && !self.resourceHistoryMap.isDisposed()){
      self.resourceHistoryMap.clear();           //释放图形资源
      self.resourceHistoryMap.dispose();
    }
    self.resourceHistoryMap = echarts.init(document.getElementById('resourceHistoryMap'));
    var len = self.historyLen - 1;
    var option = {
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter: function (params) {
          var dataIndex = params[0].dataIndex;
          var html = [];
          if (params[0].dataIndex > len) {

          } else {
            html.push('<div id="detailsMap">');
            html.push('<div>');
            html.push('<div class="title">');
//            html.push('<span></span><span>资源消耗</span><span class="time">'+actualTime[params[0].dataIndex]+'</span>');
            html.push('<span></span><span>资源消耗</span><span class="time">' + actualTime[dataIndex] + '</span>');
            html.push('</div>');
            html.push('<ul>');
            html.push('<li><div><span>' + params[0].value + '%</span></div> <p>资源消耗率</p></li>');
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
          type: 'slider',
          start: 0,
          end: 100,
          textStyle:false,
          labelFormatter: function (value) {
            return '';
          }
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
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false,
          color: '#666666',
          formatter: '{value}'
        },
        "axisLine": {
          show: true,
          lineStyle: {
            width: 2,
            color: '#eeeeee'
          }
        },
      },

      grid: {
        left: '40px',
        right: '10px',
        bottom: '45px',
        top: '10px',
//        containLabel: true
      },
      yAxis: {
        splitNumber:2,
          "axisLine": {
          show: true,
          lineStyle: {
            width: 2,
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
          show: true,
          color:'#555555',
          formatter: '{value} %'
        }

      },
      series: [
        {
          name: '消耗率',
          type: 'line',
          symbolSize: 8,
//          showAllSymbol: true,
          data: historyData,
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
          name: '消耗率',
          type: 'line',
          symbolSize: 8,
          data: forecastData,
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
    var newestTime = actualTime[Number(self.historyLen) - 1];
    //如果存在高亮，时间就是高亮的数据的时间，如果没有高亮，时间就是最新的时间
    if (self.isHeightLight) {
      var time = self.clickTime;
      getResourceRankingData(self.devId, time, self);
    } else {
      self.clickTime = newestTime;
      getResourceRankingData(self.devId, newestTime, self);
    }

    self.resourceHistoryMap.on('click',function (params) {
      var dataIndex = params.dataIndex;
//      console.log(self.historyLen)
      if(dataIndex<self.historyLen){
        self.clickTime = actualTime[dataIndex];
        //资源消耗侧重排名
        getResourceRankingData(self.devId, self.clickTime, self);
      }

    })
  }


  /*近24小时任务处理详情hover的html数据*/
  function getNeayly24HoverHtml(params) {
    var html = [];
    html.push('<div id="nearly24HoverDetails">');
    html.push('<div>');
    html.push('<div class="title"><span></span><span>任务详情</span></div>');
    html.push('<div class="item"><span>开始时间:</span><span>2018-01-02  18:30:30</span></div>');
    html.push('<div class="item"><span>处理时长:</span><span>50分钟</span></div>');
    html.push('<div class="item"><span>编辑:</span><span>唐丽</span></div>');
    html.push('<div class="item"><span>栏目:</span><span>养生堂</span></div>');
    html.push('</div></div>');
    return html.join('');
  }

  /*近24小时任务处理详情*/
  function nearly24Map(self,startTime,finnishTimes,taskNames,actualTaskNames,handleTimes) {
    var option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          var dataIndex = params[0].dataIndex;
          var html = [];
          html.push('<div id="nearly24HoverDetails">');
          html.push('<div>');
          html.push('<div class="title"><span></span><span>任务详情</span></div>');
          html.push('<div class="item"><span>开始时间:</span><span>'+DateUtils.format(startTime[dataIndex],'yyyy-MM-dd HH:mm:ss')+'</span></div>');
          html.push('<div class="item"><span>结束时间:</span><span>'+DateUtils.format(finnishTimes[dataIndex],'yyyy-MM-dd HH:mm:ss')+'</span></div>');
          html.push('<div class="item"><span>处理时长:</span><span>'+Math.floor(handleTimes[dataIndex]/60) + '分' + handleTimes[dataIndex]%60 +　'秒'+'</span></div>');
          html.push('<div class="item"><span>名称:</span><span style="display: inline-block;vertical-align:middle;width: 200px;white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">'+actualTaskNames[dataIndex]+'</span></div>');
          html.push('</div></div>');
          return html.join('');
        }
      },
      grid: {
        top: '0',
        left: '0',
        right: '30px',
        bottom: '1px',
        containLabel: true
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted',
            color: '#bbbbbb'
          }
        },
        axisTick: {
          show: false
        },
        "axisLine": {
          show: true,
          lineStyle: {
            width: 2,
            color: '#eeeeee'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#555555'
          }
        },
      },

      yAxis: {
        type: 'category',
        axisTick: {
          show: false
        },
        "axisLine": {
          show: true,
          lineStyle: {
            width: 2,
            color: '#eeeeee'
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#151b22'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#555555'
          }
        },
//        data: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七', '任务八', '任务九', '任务十']
        data: taskNames

      },

      series: [
        {
          name: '开始时间',
          type: 'bar',
          stack: '总量',
          barWidth: '10px',
          itemStyle: {normal: {color: 'rgba(0,0,0,0)'}},
          data:startTime
        },

        {
          name: '结束时间',
          type: 'bar',
          stack: '总量',
          barWidth: '10px',
          itemStyle: {normal: {color: '#18d96e'}},
          data:finnishTimes
        }

      ]
    };
    self.nearly24Map.setOption(option, true);
  }

  /*处理近24小时任务处理详情*/
  function handleNealry24Data(data,self) {
    //startTime  finishTime  taskName  handletimeS
    var startTimes =  [];
    var finnishTimes = [];
    var taskNames = [];
    var handleTimes = [];
    var actualTaskNames = [];
    for(var i = 0;i<data.length;i++){
      startTimes.push(new Date(data[i].startTime));
      finnishTimes.push(new Date(data[i].finishTime));
      taskNames.push('任务'+(i+1));
      handleTimes.push(data[i].handletimeS);
      actualTaskNames.push(data[i].taskName);
    }
    nearly24Map(self,startTimes,finnishTimes,taskNames,actualTaskNames,handleTimes)
  }


  /*测试*/
  function getBreakdownHistoryMap(datas,self) {
//    var startTime = new Date('2017-12-12 00:12:10').getTime();  1516070151947   1516070305169
    //
    var startTime = new Date('2018-01-15 14:34:37').getTime();
    var colors = ['#fbb321', '#58c9f3', '#ff6c60', '#18d96e', '#fff9a0', '#a0ffa2', '#b6a0ff', '#ffa0f5'];
    var categories = ['1'];
    var data = [];
    var types = datas;
    for (var i = 0; i < categories.length; i++) {
      var time = types[0].startTime;
      var baseTime = new Date(types[0].startTime).getTime();
//      var baseTime = types[0].startTime;

      for (var j = 0; j < types.length; j++) {
        var duration = Number(types[j].handletimeS) * 1000;
        data.push({
          name: types[j].taskName,
          itemStyle: {
            normal: {
              color: colors[Math.floor(Math.random()*7)]
            }
          },
          value: [i, baseTime, baseTime += duration, duration]
//          value: [i, types[i].startTime,types[i].finishTime, duration]
        });
        baseTime += Math.round(Math.random() * 2000);
      }
      console.log(data)
    }

    var option = {
      tooltip: {
        formatter: function (params) {
          console.log(params)
          return getNeayly24HoverHtml(params);
        }
      },
      legend: {
        data: ['bar', 'error']
      },
      center: ['50%', '50%'],
      grid: {
        top: '0',
        left: '0',
        right: '30px',
        bottom: '0',
        containLabel: true
      },
      xAxis: {
        type:'time',
        scale: true,
        axisLabel: {
          textStyle: {
            color: '#555555'
          },
          formatter: function (val) {
//            console.log(val)
            var ss = GlobalVar.getTimeByTimestamp(val);
//            console.log(ss);
            return DateUtils.format(new Date(new Date(val)),'HH:mm:ss');
//            return Math.max(0, val - startTime) + ' ms';
          }
        },
        axisTick: {
          show: false
        },
        "axisLine": {
          show: true,
          lineStyle: {
            width: 2,
            color: '#eeeeee'
          }
        },
        splitLine: {
          show: true,
          lineStyle:{
            type:'dotted',
            color:'#bbbbbb'
          }
        },
//        axisLabel: {
//          show: false,
//          textStyle: {
//            color: '#555555'
//          },
//          formatter:function (params) {
//            var ss = GlobalVar.getTimeByTimestamp('1515498005716')
////            return DateUtils.format(new Date(new Date(params)),'yyyy-MM-dd HH:mm:ss');
//            return '';
//          }
//        },
      },
      yAxis: {
        data: categories,
        axisTick: {
          show: false
        },
        "axisLine": {
          show: true,
          lineStyle: {
            width: 2,
            color: '#eeeeee'
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#151b22'
          }
        },
        axisLabel: {
          show: false,
          textStyle: {
            color: '#555555'
          },

        },
      },
      series: [{
        type: 'custom',
        renderItem: function (params, api) {
          var categoryIndex = api.value(0);
          var start = api.coord([api.value(1), categoryIndex]);
          var end = api.coord([api.value(2), categoryIndex]);
          var height = 16;
//          var height = api.size([0, 1])[1] * 0.6;
          return {
            type: 'rect',
            shape: echarts.graphic.clipRectByRect({
              x: start[0],
              y: start[1] - height / 2,
              width: end[0] - start[0],
              height: height
            }, {
              x: params.coordSys.x,
              y: params.coordSys.y,
              width: params.coordSys.width,
              height: params.coordSys.height
            }),
            style: api.style()
          };
        },
        itemStyle: {
          normal: {
            opacity: 0.8
          }
        },
        encode: {
          x: [1, 2],
          y: 0
        },
        data: data
      }]
    };
    self.nearly24Map.setOption(option, true);
  }

</script>
<style scoped>
  .navigation-cut {
    text-align: right;
  }


  .total-resource,
  .resource-history,
  .resource-ranking,
  .resource-pool,
  .nearly24 {
    padding: 0 14px;
  }

  .total-resource.block-area > div.title,
  .resource-pool.block-area > div.title,
  .resource-history.block-area > div.title,
  .resource-ranking.block-area > div.title,
  .nearly24.block-area > div.title {
    border-bottom: 1px solid #eeeeee;
  }

  .block-area > div.title {
    font-size: 16px;
    color: #555555;
    font-weight: bold;
    height: 49px;
    line-height: 49px;
  }

  /*非编资源消耗率*/
  .total-resource {
    width: 480px;
    height: 297px;
    background-color: #ffffff;
    border-radius: 2px;
  }

  .total-resource > div#totalResourceMap {
    width: 172px;
    height: 172px;
    margin: 34px auto 0 auto;
  }

  /*预期资源消耗*/
  .expect-resource {
    width: 480px;
    height: 241px;
    border-radius: 2px;
    margin: 19px 0;
  }

  .expect-resource > div.title {
    background-color: #fbb321;
  }

  .expect-resource-free > div.title {
    background-color: #18d96e;
    padding: 0 14px;
    font-size: 16px;
    color: #ffffff;
  }

  .expect-resource > div.title {
    padding: 0 14px;
    font-size: 16px;
    color: #ffffff;
  }

  .expect-resource table {
    width: 452px;
    height: 162px;
    margin: 10px auto;
    font-size: 14px;
    border: solid 1px #eeeeee;
  }

  .expect-resource table thead tr {
    background-color: #f5f5f5;
    color: #333333;
  }

  .expect-resource table th,
  .expect-resource table td {
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: solid 1px #eeeeee;
    width: 20%;
  }

  .expect-resource table td {
    color: #555555;
  }

  /*近24小时任务处理详情*/
  .nearly24 {
    width: 480px;
    margin-top: 20px;
    height: 281px;
    /*width: 100%;*/
    /*height:210px;*/
  }

  .nearly24 #nearly24Map {
    height: 210px;
    /*height:140px;*/
    /*width: 100%;*/
    width: 452px;
    margin-top: 14px;
  }

  /*资源消耗历史统计*/
  .resource-history {
    width: 1100px;
    height: 268px;
    /*height: 299px;*/
    border-radius: 2px;
  }

  .resource-history .resource-history-map {
    width: 100%;
    height: 190px;
    /*height: 222px;*/
    position: relative;
    margin-top: 22px;
  }

  .resource-history .resource-history-map div.y-name {
    position: absolute;
    bottom: 10px;
    width: 100%;
  }

  .resource-history #resourceHistoryMap {
    width: 100%;
    /*height:145px;*/
    height: 180px;
  }

  /*资源消耗侧重排名*/
  .resource-ranking {
    width: 1100px;
    height: 213px;
    /*height: 240px;*/
    margin: 19px 0;
    border-radius: 2px;
  }

  .resource-ranking div#resourceRankingMap {
    width: 100%;
    height: 134px;
    /*height: 161px;*/
    margin-top: 20px;
  }

  /*资源池资源消耗曲线*/
  .resource-pool {
    /*width: 100%;*/
    width: 1100px;
    height: 338px;
    border-radius: 2px;
  }

  .resource-pool-map {
    position: relative;
  }

  .resource-pool div.y-name {
    position: absolute;
    width: 100%;
    bottom: -31px;

  }

  #resourcePoolMap {
    width: 100%;
    margin-top: 22px;
    height: 215px;
  }

  .resource-pool div.title ul.legend {
    list-style: none;
  }

  .resource-pool div.title ul.legend,
  .resource-pool div.title span {
    display: inline-block;
  }

  .resource-pool > div.title > ul.legend li {
    display: inline-block;
  }

  .resource-pool > div.title > ul.legend {
    font-size: 14px;
    color: #555555;
    margin-left: 38px;
    vertical-align: top;
  }

  .resource-pool > div.title > ul.legend i {
    display: inline-block;
    width: 20px;
    height: 4px;
    border-radius: 2px;
    vertical-align: middle;
    margin-right: 6px;
  }

  .resource-pool > div.title > ul.legend li:first-child i {
    background-color: #58c9f3;
  }

  .resource-pool > div.title > ul.legend li:nth-child(2) {
    margin: 0 17px;
  }

  .resource-pool > div.title > ul.legend li:nth-child(2) i {
    background-color: #fbb321;
  }

  .resource-pool > div.title > ul.legend li:last-child i {
    background-color: #ff6c60;
  }

  div.y-name > div {
    display: inline-block;
    vertical-align: top;
    width: 83px;
    text-align: center;
    font-size: 12px;
    color: #555555;
  }


</style>
