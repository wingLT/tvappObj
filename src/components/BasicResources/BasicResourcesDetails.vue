<template>
  <div class="content">
    <div class="navigation-cut clear">
      <ul class="fr">
        <li>
          <router-link to="/">基础资源监控</router-link>
        </li>
        <li>服务器</li>
      </ul>
    </div>

    <!--所有的内容-->
    <div class="all-content clear">

      <!--左边的内容-->
      <div class="left-content">
        <!--基础信息-->
        <div class="basic-info block-area">
          <div>
            <p><span>设备名称</span><span>{{basicData.devName}}</span></p>
            <p><span>故障总数</span><span>{{basicData.exceptionCount}}</span></p>
          </div>
          <div>
            <p><span>起</span><span>{{basicData.startTime}}</span></p>
            <p class="fr"><span>止</span><span>{{basicData.endTime}}</span></p>
          </div>
        </div> <!--基础信息 end-->

        <!--故障分布-->
        <div class="failure-distribution block-area">
          <div class="title"><span>故障分布</span></div>
          <div style="margin-top: 15px">
            <table style="table-layout: fixed">
              <thead>
                <tr>
                  <th>故障位置</th>
                  <th>故障次数</th>
                  <th>故障占比</th>
                </tr>
              </thead>
            </table>
          </div>
          <div class="failure-table" id="failureTable">
            <table style="table-layout: fixed">
              <tbody>
              <tr>
                <td>cpu</td>
                <td>{{baseCpuData.key}}</td>
                <td>{{baseCpuData.value}}%</td>
              </tr>
              <tr>
                <td>内存</td>
                <td>{{baseMemData.key}}</td>
                <td>{{baseMemData.value}}%</td>
              </tr>
              <tr>
                <td>磁盘</td>
                <td>{{baseDiskData.key}}</td>
                <td>{{baseDiskData.value}}%</td>
              </tr>
              <tr>
                <td>网络</td>
                <td>{{baseNetData.key}}</td>
                <td>{{baseNetData.value}}%</td>
              </tr>
              <tr>
                <td>进程</td>
                <td>{{processData.key}}</td>
                <td>{{processData.value}}%</td>
              </tr>
              </tbody>
            </table>
          </div>

        </div> <!--故障分布  end-->

        <!--设备详情-->
        <div class="device-info block-area">
          <div class="title">
            <span>设备详情</span>
          </div>

          <ul>
            <li>
              <span>进程数:</span>
              <span>{{baseDetails.baseProcess}}个</span>
            </li>
            <li>
              <span>磁盘:</span>
              <span>{{baseDetails.baseDisk}}G</span>
            </li>
            <li>
              <span>cpu:</span>
              <span>{{baseDetails.baseCpu}}核</span>
            </li>
            <li>
              <span>内存:</span>
              <span>{{baseDetails.baseMem}}G</span>
            </li>
          </ul>
        </div><!--设备详情  end-->

      </div>

      <!--右边的内容-->
      <div class="right-content fr">

        <!--故障历史统计-->
        <div class="history-map block-area">
          <div class="clear">
            <div class="title">
              <span>故障历史统计</span>
            </div>
            <ul class="time-cut">
              <li class="active" @click="getDataByTime(1,$event)">1天</li>
              <li @click="getDataByTime(7,$event)">7天</li>
            </ul>
          </div>
          <div id="breakdownHistoryMap" class="clear"></div>
        </div>
        <!--故障历史统计  end-->

        <!--资源历史统计-->
        <div class="key-index block-area">
          <div class="top">
            <div class="title">
              <span>关键指标历史统计</span>
            </div>
            <ul class="history-lend">
              <li>
                <i style="background-color: #ec4545;"></i>
                <span>CPU</span>
              </li>
              <li>
                <i style="background-color: #ffa628;"></i>
                <span>内存</span>
              </li>
              <li>
                <i style="background-color: #31afe3;"></i>
                <span>磁盘</span>
              </li>

            </ul>
          </div>
          <div id="keyIndexMap"></div>
        </div>
        <!--资源历史统计 end-->

        <!--故障详情-->
        <div class="error-detail block-area">
          <div class="title">
            <span>故障详情</span>
          </div>
          <div class="error-detail-table">
            <table style="table-layout: fixed;">
              <thead>
              <tr>
                <th>序号</th>
                <th>故障编号</th>
                <th>故障时间</th>
                <th>
                  <a class="dropdown-toggle" data-toggle="dropdown">
                    <span>故障类别</span>
                    <i class="icon wb-triangle-down"></i>
                  </a>
                  <ul id="equipmentType" class="dropdown-menu">
                    <li @click="getWarningByLevel(-1)">全部</li>
                    <li @click="getWarningByLevel(1)">风险预警</li>
                    <li @click="getWarningByLevel(4)">故障告警</li>

                  </ul>
                </th>
                <th>
                  <a class="dropdown-toggle" data-toggle="dropdown">
                    <span>故障位置</span>
                    <i class="icon wb-triangle-down"></i>
                  </a>
                  <ul id="equipmentPosition" class="dropdown-menu">
                    <li @click="getWarningByPositon(-1)">全部</li>
                    <li @click="getWarningByPositon(1,'cpu_util')">CPU</li>
                    <li @click="getWarningByPositon(1,'mem_util')">内存</li>
                    <li @click="getWarningByPositon(1,'disk_util.inband')">磁盘</li>
                    <li @click="getWarningByPositon(1,'process')">进程</li>
                  </ul>
                </th>
                <th>描述信息</th>

              </tr>
              </thead>
            </table>
            <div class="table-content" id="breakdownTable">
              <table style="table-layout: fixed;">
                <tbody>
                <tr v-for="(item,index) in breakdownDetailsData">
                  <td>{{index + 1}}</td>
                  <td>{{getSerialNumber(item.level,item.id)}}</td>
                  <td>{{item.htime}}</td>
                  <td>{{getLevel(item.level)}}</td>
                  <td>{{item.chName}}</td>
                  <td>{{item.chName}}超过{{item.minVal}}</td>
                </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
        <!--故障详情  end-->
      </div>


    </div>

    <!--hover的弹窗-->
    <!--<div class="resource-hover resource-details-hover">-->
      <!--<div>-->
        <!--<div class="title">-->
          <!--<span>资源详情 </span>-->
          <!--<span>2017-11-29  14:08</span>-->
        <!--</div>-->
        <!--<ul>-->
          <!--<li><i style="background-color: #ff6c60;"></i>内存使用率：50%</li>-->
          <!--<li><i style="background-color: #fbb321;"></i>CPU使用率：50%</li>-->
          <!--<li><i style="background-color: #58c9f3;"></i>磁盘使用率：50%</li>-->
        <!--</ul>-->
      <!--</div>-->
    <!--</div>-->

  </div>
</template>

<script>
  import echarts from 'echarts'
  import { GlobalVar } from "../../../static/js/utils";
  export  default {
    name:'basic-resource-details',
    data(){
      return{
        budHealMap:'',
        keyIndexMap:'',
        timeData:[],
        cpuData:[],
        cpuDataLine:[],
        memory:[],
        memoryBaseLine:[],
        diskData:[],
        diskBaseLine:[],

        resourceId:'',
        timeFlag:1,
        basicData:{},
        historyItemVOs:[],//故障历史

        baseDetails:{},
        baseNetData:{},
        baseCpuData:{},
        baseDiskData:{},
        baseMemData:{},
        processData:{},
        breakdownDetailsData:[],
        warnType:'',//故障类型
        warnPosition:''//故障位置
      }
    },
    methods:{
      getWarningByPositon:function (flag,warnPosition) {
        var self = this;
        if(Number(flag) == -1){
          self.warnPosition = '';
        }else{
          self.warnPosition = warnPosition;
        }
        getBreakdownDetailsData(self.resourceId,self.timeFlag,self.warnPosition,self.warnType,self);
      },
      getWarningByLevel:function (level) {
        var self = this;
        if(Number(level) == -1){
          self.warnType = '';
        }else{
          self.warnType = level;
        }
        getBreakdownDetailsData(self.resourceId,self.timeFlag,self.warnPosition,self.warnType,self);
      },
      getSerialNumber:function(level,id){
        var serialNumber = '';
        if(Number(level) == 1){
          serialNumber = 'riskWarning'+id;
        }else{
          serialNumber = 'faultWarning'+id;
        }
        return serialNumber;
      },
      getLevel:function(level){
        var serialNumber = '';
        if(Number(level) == 1){
          serialNumber = '风险预警';
        }else{
          serialNumber = '故障告警';
        }
        return serialNumber;
      },
      getDataByTime:function(timeFlag,event){
        let self = this;
        this.timeFlag = timeFlag;
        $(event.target).parent().find('li').removeClass('active');
        $(event.target).addClass('active');
        getHistoryBasicData(self.resourceId,self.timeFlag,self);
        getBaseInfo(self.resourceId,self);
        getIndexData(self.resourceId,self.timeFlag,self);
      },
    },
    mounted() {
      let router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      };
      GlobalVar.setHistoryRouter(router);
      let self = this;
      self.resourceId = window.sessionStorage.getItem('RESOURCEID');
      self.budHealMap = echarts.init(document.getElementById('breakdownHistoryMap'));
      self.keyIndexMap = echarts.init(document.getElementById("keyIndexMap"));
      getHistoryBasicData(self.resourceId,self.timeFlag,self);
      getBaseInfo(self.resourceId,self);
      getIndexData(self.resourceId,self.timeFlag,self);
      getBreakdownDetailsData(self.resourceId,self.timeFlag,'','',self);

    },
    updated(){
      GlobalVar.setScroll('table-content');
    }


  }

  /*
   *单台设备-基础数据和故障历史统计
   * devId:设备id
   * day:天数
   * */
  function getHistoryBasicData(devId,day,self){
    $.ajax({
      type:'get',
      url:GlobalVar.ddmUrl+'/hisicompass-baseresource/baseResource/getHistory?devId='+devId+'&day='+day,
      data:{},
      success:function (result) {
        if(result.success){
          self.basicData = result.data;
          self.historyItemVOs = result.data.historyItemVOs;
          handleHistryFaultData(self.historyItemVOs,self);
        }
      }
    })
  }

  /*
 *单台设备-基础信息（故障分布，设备详情）
 * */

  function getBaseInfo(devId,self){
      $.ajax({
        type:'get',
        url:GlobalVar.ddmUrl+'/hisicompass-baseresource/baseResource/getDeviceExceptionCount?devId='+devId,
        data:{},
        success:function (result) {
          if(result.success){

            self.baseNetData = result.data.net;
            self.baseCpuData = result.data.cpu;
            self.baseDiskData = result.data.disk;
            self.baseMemData = result.data.mem;
            self.processData = result.data.process;
            self.baseDetails = result.data;
          }
        }
      })
  }


  /*
 *单台设备 指标信息
 * devId：设备id
 * day:时间标志
 * */
  function getIndexData(devId,day,self){
    $.ajax({
      type:'get',
      url:GlobalVar.ddmUrl+'/hisicompass-baseresource/baseResource/getMetricHistory?devId='+devId+'&day='+day,
      data:{},
      success:function (result) {
        if(result.success){
          handleResourceData(result.data,self);
        }
      }
    })
  }

  /*
  * 处理指标信息的数据
  * */
  function  handleResourceData(data,self) {
    var memData = [];
    var memBaseLines=[];
    var cpuData = [];
    var cpuBaseLines = [];
    var diskData = [];
    var diskBaseLines = [];
    var timeData = [];
    if(!GlobalVar.isEmptyObject(data)){
      var mems = data.mem;
      for(var i = 0;i<mems.nodes.length;i++){
        memData.push(mems.nodes[i].value);
        timeData.push(mems.nodes[i].key);
        memBaseLines.push(mems.baseLine);
      }
      var cpus = data.cpu;
      for(var i =0 ;i<cpus.nodes.length;i++){
        cpuData.push(cpus.nodes[i].value);
        cpuBaseLines.push(cpus.baseLine);
      }
      var disks = data.disk;
      for(var i =0;i<disks.nodes.length;i++){
        diskData.push(disks.nodes[i].value);
        diskBaseLines.push(disks.baseLine);
      }
    }
    self.timeData = timeData;
    self.cpuData = cpuData;
    self.cpuDataLine = cpuBaseLines;
    self.memory = memData;
    self.memoryBaseLine = memBaseLines;
    self.diskData = diskData;
    self.diskBaseLine = diskBaseLines;
    keyIndicatorsMap(self);

  }


  /*
 *	得到故障详情的数据
 *  devId:设备id
 *  timeFlag：时间标志
 *  enName：故障位置
 *  warnType：故障类别
 * */
  function getBreakdownDetailsData(devId,timeFlag,enName,warnType,self){
    $.ajax({
      type:'get',
      url:GlobalVar.ddmUrl+'/hisicompass-baseresource/fault/single/'+devId+'/'+timeFlag+'?pageNum=1&pageSize=10000&enName='+enName+'&warnType='+warnType,
      success:function (result) {
        if(Number(result.status) == 200){
          self.breakdownDetailsData = result.data.rows;
        }
      }
    })
  }

  /*
   * 处理故障历史统计的数据
   * */
  function handleHistryFaultData(data,self) {
    var xData = [];
    var allValue = [];
    if(!GlobalVar.isEmptyObject(data)){
      for(var i=0;i<data.length;i++){
        xData.push(data[i].time);
        allValue.push(data[i].exceptionCount);
      }
    }
    breakdownHistoryMap(xData, allValue,self);
  }

  /*
   * 故障历史统计图
   * */
  function breakdownHistoryMap(xData, allValue,self) {
    var option = {
      tooltip: {
        show: true,
        trigger: 'item',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        enterable: true,
        formatter: function(params) {
          var dataIndex = params.dataIndex;
          var data = self.historyItemVOs[dataIndex];
          //historyItemVOs
          var html = [];
          html.push('<div class="resource-hover history-resource-hover">');
          html.push('<div>');
          html.push('<div class="title">');
          html.push('<span>故障统计</span><span>'+data.time+'</span>');
          html.push('</div>');
          html.push('<ul>');
          html.push('<li><i style="background-color: #58c9f3;"></i>故障数：'+data.exceptionCount+'个</li>');
          html.push('<li><i style="background-color: #58c9f3;"></i>故障位置: '+data.exceptionLocal+'</li>');
          html.push('</ul>');
          html.push('</div>');
          html.push('</div>');
          return html.join('');
//          return getBreakdownHistoryHtml(dataIndex);
        },
      },
      center: ['50%', '50%'],
      grid: {
        top: '10px',
        left: '40px',
        right: '8px',
        bottom: '5px',
      },
      xAxis: {
        type: 'category',
        "axisLine": {
          lineStyle: {
            color: '#64696f',
            type: 'solid'
          }
        },
        axisLine: {
          show: true,
        },
        "axisTick": {
          "show": false
        },
        axisLabel: {
          formatter: function() {
            return "";
          }
        },
        data: xData,
        boundaryGap: false, //两端空白
      },
      yAxis: {
        type: 'value',
        "axisLine": {
          lineStyle: {
            color: '#eeeeee',
            type: 'solid'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#bbbbbb',
            type: 'dotted'
          }
        },
        axisLabel: {
          show: true,
          formatter: function(value) {
            return value;
          },
          textStyle: {
            color: '#555555'
          }

        },
        axisTick: {
          show: false
        },
        boundaryGap: [0, '25%']
      },
      series: [{
        type: 'line',
        symbolSize: 8,
        lineStyle: {
          normal: {
            color: '#039adb',
            width: 2,
          },
        },
        "itemStyle": {
          "normal": {
            "color": "#039adb"
          }
        },
        areaStyle: {
          normal: {
            color: '#9bdff8'
          }
        },
        data: allValue
      }]
    };
    self.budHealMap.setOption(option, true);

  }


  /*
   * 关键指标历史统计
   * */
  function keyIndicatorsMap(self) {
    var line_step = false;
    var option = {
      width: "100%",
      title: {},
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        },
        formatter: function(params) {
          var dataIndex = params[0].dataIndex;
          //value  cpuData  memory  diskData
//          console.log(self.cpuData);
          var html = [];
          html.push('<div class="resource-hover resource-details-hover">');
          html.push('<div>');
          html.push('<div class="title">');
          html.push('<span>资源详情</span><span>2017-11-29  14:08</span>');
          html.push('</div>');
          html.push('<ul>');
          html.push('<li><i style="background-color: #ff6c60;"></i>内存使用率：'+self.memory[dataIndex]+'%</li>');
          html.push('<li><i style="background-color: #fbb321;"></i>CPU使用率：'+self.cpuData[dataIndex]+'%</li>');
          html.push('<li><i style="background-color: #58c9f3;"></i>磁盘使用率：'+self.diskData[dataIndex]+'%</li>');
          html.push('</ul>');
          html.push('</div>');
          html.push('</div>');
          return html.join('');
        }
      },
      axisPointer: {
        link: {
          xAxisIndex: 'all'
        }
      },
      grid: [{
        left: "3%",
        right: '2%',
        top: '5px',
        height: '29%'
      }, {
        left: "3%",
        right: '2%',
        top: '34%',
        height: '29%'
      }, {
        left: "3%",
        right: '2%',
        top: '65%',
        height: '29%'
      }],
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisLine: {
          onZero: true,
          show: true,
          lineStyle: {
            color: '#ebebeb',
            type: 'solid'
          }
        },
        data: self.timeData,
        axisTick: {
          show: false
        },
        axisLabel: {
          formatter: function() {
            return "";
          }
        }
      }, {
        gridIndex: 1,
        type: 'category',
        boundaryGap: false,
        axisLine: {
          onZero: true,
          show: true,
          lineStyle: {
            color: '#ebebeb',
            type: 'solid'
          }
        },
        data: self.timeData,

        axisTick: {
          show: false
        },
        axisLabel: {
          formatter: function() {
            return "";
          }
        }
      }, {
        gridIndex: 2,
        type: 'category',
        boundaryGap: false,
        axisLine: {
          onZero: true,
          show: true,
          lineStyle: {
            color: '#ebebeb',
            type: 'solid'
          }
        },
        data: self.timeData,
        axisTick: {
          show: false
        },
        axisLabel: {
          formatter: function() {
            return "";
          }
        }
      }],

      yAxis: [{
        type: 'value',
        nameLocation: 'middle',
        nameTextStyle: {
          color: "#ffffff"
        },
        nameGap: 50,
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#ebebeb'
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#151b22'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#555555'
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
        axisLine: {
          lineStyle: {
            color: '#ebebeb'
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
            color: '#555555'
          }
        }
      }, {
        gridIndex: 2,
        type: 'value',
        nameLocation: 'middle',
        nameTextStyle: {
          color: "#ffffff"
        },
        nameGap: 50,
        inverse: false,
        axisLine: {
          lineStyle: {
            color: '#ebebeb'
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#151b22'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#555555'
          }
        }
      }],

      series: [{
        name: 'CPU',
        type: 'line',
        symbolSize: 8,
        hoverAnimation: false,
        data: self.cpuData,
        smooth: true,
        zlevel: 20,
        itemStyle: {
          normal: {
            color: '#ec4545'
          }
        },
      },
        {
          name: 'CPU基线',
          smooth: true,
          type: 'line',
          symbolSize: 0,
          symbol: 'circle',
          data: self.cpuDataLine,
          zlevel: 18,
          lineStyle: {
            normal: {
              color: '#c0c0c0',
              width: 2,
            },
          },
        },
        {
          name: '内存',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbolSize: 8,
          smooth: true,
          hoverAnimation: false,
          data: self.memory,
          zlevel: 20,
          itemStyle: {
            normal: {
              color: '#ffa628'
            }
          },
        },
        {
          name: '内存基线',
          smooth: true,
          xAxisIndex: 1,
          yAxisIndex: 1,
          type: 'line',
          symbolSize: 0,
          symbol: 'circle',
          data: self.memoryBaseLine,
          zlevel: 18,
          lineStyle: {
            normal: {
              color: '#c0c0c0',
              width: 2,
            },
          },
        },
        {
          name: '磁盘',
          type: 'line',
          xAxisIndex: 2,
          yAxisIndex: 2,
          symbolSize: 8,
          smooth: true,
          hoverAnimation: false,
          data: self.diskData,
          zlevel: 20,
          itemStyle: {
            normal: {
              color: '#31afe3'
            }
          },
        },
        {
          name: '磁盘基线',
          smooth: true,
          type: 'line',
          xAxisIndex: 2,
          yAxisIndex: 2,
          symbolSize: 0,
          symbol: 'circle',
          data: self.diskBaseLine,
          zlevel: 18,
          lineStyle: {
            normal: {
              color: '#c0c0c0',
              width: 2,
            },
          },
        },



      ]
    };
    self.keyIndexMap.setOption(option,true);
  }
</script>

<style scoped>

  /*div.content{*/
    /*padding-bottom: 46px;*/
  /*}*/
  div.all-content >div{
    display: inline-block;
    vertical-align: top;
  }
  div.block-area{
    background-color: #ffffff;
    border-radius: 2px;
  }

  /*左边的内容*/
  div.left-content>div{
    width: 480px;
  }

  /*基础信息*/
  .basic-info{
    height: 184px;
    border-top: 8px solid #fbb321;
  }

  .basic-info p{
    display: inline-block;
    vertical-align: top;
    padding: 0;
    margin: 0;
  }

  .basic-info>div{
    width: 80%;
    margin: 0 auto;
  }

  .basic-info>div:first-child{
    /*margin: 37px auto 27px auto;*/
    margin: 16px auto 17px auto;
  }

  .basic-info>div:first-child>p:last-child{
    /*margin-left: 20px;*/
  }

  .basic-info>div>p>span{
    display: inline-block;
    vertical-align: middle;
  }

  .basic-info>div:first-child>p{
    display: block;
  }


  .basic-info>div:first-child>p>span:first-child{
    padding: 1px 10px;
    background-color: #fbb321;
    border-radius: 12px;
    font-size: 16px;
    color: #ffffff;
    margin-right: 10px;

  }
  .basic-info>div:first-child>p>span:last-child{
    font-size: 26px;
    color: #555555;
    font-weight: bold;
  }

  .basic-info>div:last-child>p>span:first-child{
    font-size: 14px;
    color: #FFFFFF;
    display: inline-block;
    width: 26px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    background-color: #18d96e;
    border-radius: 50%;
    margin-right: 4px;
  }

  .basic-info>div:last-child>p>span:last-child{
    font-size: 16px;
    color: #555555;
  }

  .basic-info>div:last-child{
    border-top: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
    height: 43px;
    line-height: 43px;
  }


  /*故障分布*/
  div.failure-distribution{
    height: 321px;
    margin: 20px 0;
  }

  div.failure-distribution div.title{
    height: 50px;
    line-height: 50px;
    background-color: #fbb321;
    font-size: 16px;
    color: #FFFFFF;
    font-weight: bold;
    padding-left: 20px;
  }

  div.failure-distribution table{
    width: 90%;
    margin: 0 auto;
    text-align: center;
  }

  div.failure-distribution  table thead tr{
    background-color: #f5f5f5;
  }

  div.failure-distribution  table tr th,
  div.failure-distribution  table tr td{
    height: 38px;
    text-align: center;
    border: 1px solid #eeeeee;
  }

  div.failure-distribution table tbody tr:hover td{
    color: #ff6c60;
  }

  div.failure-distribution #failureTable{
    height:191px;
  }

  /*设备详情*/

  div.device-info{
    height: 260px;
  }

  div.device-info>div{
    width: 90%;
    margin: 0 auto;
  }

  div.device-info div.title{
    height: 50px;
    font-size: 16px;
    line-height: 50px;
    border-bottom: 1px solid #eeeeee;
    color: #666666;
    font-weight: bold;
  }

  div.device-info ul{
    list-style: none;
    width: 90%;
    margin: 0 auto;
  }

  div.device-info ul li{
    line-height: 44px;
  }

  div.device-info ul li span{
    margin-left: 10px;
    display: inline-block;
    font-size: 14px;
    color: #555555;
  }



  /*左边的内容*/

  div.right-content>div{
    width: 1100px;
  }

  div.right-content div.block-area div.title{
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #eeeeee;
  }


  div.right-content div.block-area div.title span{
    font-size: 16px;
    color: #555555;
    font-weight: bold;
  }


  /*故障历史*/
  div.history-map{
    height: 245px;
  }

  div.history-map>div{
    position: relative;
    width: 97%;
    margin: 0 auto;
  }

  div.history-map ul.time-cut{
    position: absolute;
    right: 0;
    top: 10px;
  }

  div.history-map #breakdownHistoryMap{
    width: 97%;
    height: 158px;
    margin: 10px auto;
  }

  /*资源历史统计*/
  .right-content div.key-index{
    height: 416px;
    margin: 20px 0;
  }

  .right-content div.key-index div.top{
    position: relative;
    width: 97%;
    margin: 0 auto;
  }

  .right-content div.key-index ul.history-lend{
    list-style: none;
    position: absolute;
    left: 136px;
    top: 12px;
  }

  .right-content div.key-index ul.history-lend li{
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    color: #666666;
    margin: 0 5px;
  }

  .right-content div.key-index ul.history-lend li>i,
  .right-content div.key-index ul.history-lend li>span{
    display: inline-block;
    vertical-align: middle;
  }
  .right-content div.key-index ul.history-lend li>i{
    width: 14px;
    height: 14px;
    border-radius: 2px;
  }

  .right-content div.key-index div#keyIndexMap{
    width: 97%;
    height: 332px;
    margin: 15px auto 0 auto;
  }

  /*故障详情*/

  .error-detail{
    height: 216px;
  }
  .error-detail>div{
    width: 97%;
    margin: 0 auto;
  }

  .error-detail table thead th{
    background-color: #f5f5f5;
    height: 33px;
    border: 1px solid #eeeeee;
  }

  .dropdown-menu {
    text-align: center;
    top: 0;
    min-width: 85px;
    background-color: transparent;
  }
  .error-detail-table{
    margin-top: 19px;
    table-layout: fixed;
    margin-bottom: 46px;
  }
  .error-detail-table table{
    width: 100%;
    text-align: center;
  }
  .error-detail-table table thead th,
  .error-detail-table table td{
    width: 16.66666666666667%;
  }
  .error-detail-table table td{
    color: #555555;
    height: 33px;
  }

  .error-detail-table .table-content{
    height: 100px;
    overflow: hidden;
  }
  .error-detail-table table td{
    border: 1px solid #eeeeee;
  }

  .error-detail-table table thead a{
    color: #aaaaaa;
  }
  .error-detail-table table thead ul {
    list-style: none;
    position: absolute;
    width: 85px;
    padding: 0;
    margin-top: 31px;
    /*display: none;*/
    left: 50%;
    transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
    -moz-transform: translate(-50%, 0);
    -o-transform: translate(-50%, 0);
  }
  .error-detail-table table thead ul li {
    height: 27px;
    line-height: 27px;
    /*background-color: #282a2c;*/
    cursor: pointer;
    font-size: 12px;
    /*border: solid 1px #cccccc;*/
    background-color: #ffffff;
  }
  .error-detail-table table thead ul li:hover {
    /*background-color:  #36383b;;*/
    background-color: #f5f5f5;
  }
  .error-detail-table>table>tr{
    padding: 20px;
  }
  .error-detail-table>table>thead>tr>th{
    text-align: center !important;
    padding: 5px;
    position: relative;
  }
  .error-detail-table>table>tbody>tr>td{
    padding: 10px;
    color: #FFFFFF;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .error-detail-table>table>thead>tr{
    color: #aaaaaa;
  }
  .error-detail-table>table>thead>tr>th>div{
    padding: 0 30px;
  }
  .error-detail-table img{
    margin-left: 10px;
  }
</style>
