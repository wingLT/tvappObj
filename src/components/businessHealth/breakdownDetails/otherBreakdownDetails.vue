<!--主机和数据库的故障详情-->
<template>
  <div class="other-breakdown content">
    <div class="navigation-cut clear">
      <ul class="fr">
        <li>
          <router-link to="/businessHealthDegree/faultStatistic">故障统计</router-link>
        </li>
        <li>{{equipmentType}}故障详情</li>
      </ul>
    </div>

    <div class="clear">
      <div class="fl">
        <!--设备名字-->
        <div class="block-area breakdown-type">
          <div class="title">
            <span>转码</span>
          </div>
          <ul>
            <li>
              <div><span>{{mainframeName}}</span></div>
              <div>设备名称</div>
            </li>
            <li>
              <div><span>{{faultCount}}</span></div>
              <div>故障总数</div>
            </li>
            <li>
              <div><span>{{mainframeType}}</span></div>
              <div>设备类型</div>
            </li>
            <li>
              <div><span class="normal">{{mainframeStatus}}</span></div>
              <div>设备状态</div>
            </li>
          </ul>
        </div><!--设备名字  end-->

        <!--设备详情-->
        <div class="equipment equipment-details block-area">
          <div class="title">
            <span>设备详情</span>
          </div>
          <table style="table-layout: fixed">
            <thead>
              <tr>
                <th>设备名称</th>
                <th>CPU</th>
                <th>内存</th>
                <th>磁盘</th>
              </tr>
            </thead>
          </table>
          <div class="equipment-table" >
            <table style="table-layout: fixed">
              <tbody>
              <tr v-for="item in deviceDetails">
                <td>{{item.devName}}</td>
                <td>{{item.cpu}}核</td>
                <td>{{item.mem}}g</td>
                <td>{{item.disk}}g</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div><!--设备详情 end-->

        <!--软件列表-->
        <div class="equipment equipment-list block-area">
          <div class="title">
            <span>软件列表</span>
            <ul class="fr" style="display: none">
              <li class="active">内存</li>
              <li>频率</li>
              <li>时间</li>
            </ul>
          </div>
          <table style="table-layout: fixed">
            <thead>
            <tr>
              <th>设备名称</th>
              <th>软件1</th>
              <th>软件2</th>
              <th>软件3</th>
            </tr>
            </thead>
          </table>
          <div class="equipment-table" >
            <table style="table-layout: fixed">
              <tbody>
              <tr v-for="item in hostSoftwares">
                <td>{{item.devName}}</td>
                <td v-for="(list,index) in item.softwareName" v-if="index<3">{{list}}</td>
                <!--<td v-for="(list,index) in item.softwareName" v-if="index==1">{{list}}</td>-->
                <!--<td v-for="(list,index) in item.softwareName" v-if="index==2">{{list}}</td>-->
              </tr>
              </tbody>
            </table>
          </div>
        </div> <!--设备列表  end-->

        <!--故障分布统计-->
        <div class="block-area distribution-statistics">
          <div class="title">
            <span>故障分布统计</span>
            <ul class="legend fr">
              <li>
                <i class="cpu"></i>
                <span>PC1</span>
              </li>
              <li>
                <i class="web-in"></i>
                <span>VM1</span>
              </li>
              <li>
                <i class="databse"></i>
                <span>VM2</span>
              </li>
              <li>
                <i class="disk"></i>
                <span>VM23</span>
              </li>
            </ul>
          </div>
          <ul class="statistics">
            <li>
              <div class="statistics-map" id="fualtTotal"></div>
              <p>故障总数</p>
            </li>
            <li>
              <div class="statistics-map" id="fualtWarn"></div>
              <p>故障告警</p>
            </li>
            <li>
              <div class="statistics-map" id="fualtEarly"></div>
              <p>风险预警</p>
            </li>
          </ul>
        </div><!--故障分布统计  end-->
      </div>
      <div class="fr">
        <!--故障历史-->
        <div class="breakdown-history block-area">
          <div class="title">
            <span class="fl">故障历史</span>
            <ul class="legend fl">
              <li>
                <i class="cpu"></i>
                <span>CPU</span>
              </li>
              <li>
                <i class="web-in"></i>
                <span>网络</span>
              </li>
              <li>
                <i class="databse"></i>
                <span>数据库</span>
              </li>
              <li>
                <i class="disk"></i>
                <span>存储</span>
              </li>
            </ul>
            <ul class="fr time-cut">
              <li class="active" @click="cutTimeFlag($event,7)">7天</li>
              <li @click="cutTimeFlag($event,30)">30天</li>
            </ul>
          </div>
          <div id="breakdownHistoryMap"></div>
          <div class="y-time">
            <!--<div class="fl">起 2017-11-29 10:30:35</div>-->
            <div class="fl">{{startTime}}</div>
            <div class="fr">{{endTime}}</div>
            <!--<div class="fr">止 2017-11-30 10:30:35</div>-->
          </div>
        </div> <!--故障历史  end-->

        <!--故障详情-->
        <div class="breakdown-details block-area">
          <div class="title">
            <span>故障详情</span>
          </div>
          <div>
            <table  style="table-layout: fixed">
              <thead>
              <tr>
                <th class="serial-num">序号</th>
                <!--<th class="same-num">故障编号</th>-->
                <th class="same-num">故障时间</th>
                <th class="same-num">设备名称</th>
                <th class="two-same">故障类别</th>
                <th class="two-same">故障位置</th>
                <th class="describe">描述信息</th>
              </tr>
              </thead>
            </table>
            <div class="table-body">
              <table  style="table-layout: fixed">
                <tbody>
                <tr v-for="item in faultDetails">
                  <td class="serial-num">
                    <span>{{item.index}}</span>
                  </td>
                  <!--<td>-->
                    <!--<span></span>-->
                  <!--</td>-->
                  <td class="same-num">
                    <span>{{item.time}}</span>
                  </td>
                  <td class="same-num">
                    <span>{{item.devName}}</span>
                  </td>
                  <td class="two-same">
                    <span>{{item.type}}</span>
                  </td>
                  <td class="two-same">
                    <span>{{item.metricName}}</span>
                  </td>
                  <td class="describe">
                    <span>{{item.content}}</span>
                  </td>
                  <!---->
                  <!--<td v-bind:class="getClassName(index)" v-for="(list,index) in item">{{list}}</td>-->
                  <!--<td v-bind:class="getClassName(index)" v-for="(list,index) in item">-->
                    <!--<span>{{list}}</span>-->
                    <!--<div class="hover-content" v-if="isShow(list)">{{list}}</div>-->
                  <!--</td>-->
                </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div><!--故障详情-->

        <!--故障统计-->
        <div class="breakdown-statistics block-area">
          <div class="title">
            <span class="fl">故障统计</span>
            <div class='equipment-select fl'>
              <span>设备名称</span>
              <div class="select-down dropdown">
                <div>
                  <input v-model="equipmentName"/>
                  <span class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down"></i></span>

                  <div class="dropdown-menu">
                    <ul class="no-header down-content select-equipment">
                      <li @click="cutDevIdBreakdown(0,'全部',0)">全部</li>
                      <!--devId-->
                      <li v-for="item in deviceDetails" @click="cutDevIdBreakdown(item.devId,item.devName,1)">{{item.devName}}</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div id="breakdownStatisticsMap"></div>

        </div><!--故障统计 end-->

      </div>
    </div>


  </div>
</template>

<script>
  import echarts from 'echarts'
  import {GlobalVar} from '../../../../static/js/utils'
  export default {
    name:'otherBreakdownDetails',
    data(){
      return {
        breakdownHistoryMap:'',
        equipmentName:'全部',
        breakdownStatisticsMap:'',
        hostId:'',
        equipmentType:'主机',
        deviceDetails:[],//设备详情
        faultCount:'',//故障总数
        mainframeName:'',//主机名字
        mainframeStatus:'',//状态
        mainframeType:'',//类型
        faultDetails:[],//故障详情
        faultDistribution:[],//故障分布统计的数据
        hostSoftwares:[],//软件列表
        timeFlag:7,
        startTime:'',//开始时间
        endTime:'',//结束时间
        fualtEarlyMap:'',
        fualtTotalMap:'',
        fualtWarnMap:'',
      }
    },
    methods:{
      getClassName:function (index) {
        /*得到table的class*/
        var className = '';
        if(Number(index) == 0){
          className = 'serial-num';
        }else if(Number(index)<4){
          className = 'same-num';
        }else if(Number(index)<6){
          className = 'two-same';
        }else{
          className = 'describe';
        }
        return className;
      },
      isShow:function (content) {
        if(content.length>=20){
          return true;
        }else {
          return false;
        }
      },
      cutDevIdBreakdown:function (devId,name,falg) {
        var self = this;
        this.equipmentName = name;
        if(Number(falg) == 1){
          getFaultStatisticsDataByDevId(self,devId);
        }else{
          getFaultStatisticsData(self)
        }

      },
      cutTimeFlag:function (event,timeFlag) {
        $('ul.time-cut').find('li').removeClass('active');
        $(event.target).addClass('active');
        var self = this;
        self.timeFlag = timeFlag;
        getBreakHistotyData(self);
      }
    },
    updated:function () {
      var self = this;
      GlobalVar.setScroll('table-body');
      GlobalVar.setScroll('equipment-table');
    },
    mounted:function () {
      var self = this;
      var receiveData = GlobalVar.getSessionStorageJson('BREAKDOWN-DETAILS');
      self.hostId = receiveData.hostId;
      self.equipmentType = receiveData.equipmentType;
      self.breakdownHistoryMap = echarts.init(document.getElementById('breakdownHistoryMap'));
      self.breakdownStatisticsMap = echarts.init(document.getElementById('breakdownStatisticsMap'));
      getFaultStatisticsData(self);
      getLeftAllData(self);
      getBreakHistotyData(self);
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
    if(self.breakdownHistoryMap  && !self.breakdownHistoryMap.isDisposed()){
      self.breakdownHistoryMap.clear();           //释放图形资源
      self.breakdownHistoryMap.dispose();
    }
    if(self.breakdownStatisticsMap  && !self.breakdownStatisticsMap.isDisposed()){
      self.breakdownStatisticsMap.clear();           //释放图形资源
      self.breakdownStatisticsMap.dispose();
    }
    if(self.fualtEarlyMap  && !self.fualtEarlyMap.isDisposed()){
      self.fualtEarlyMap.clear();           //释放图形资源
      self.fualtEarlyMap.dispose();
    }
    if(self.fualtTotalMap  && !self.fualtTotalMap.isDisposed()){
      self.fualtTotalMap.clear();           //释放图形资源
      self.fualtTotalMap.dispose();
    }
    if(self.fualtWarnMap  && !self.fualtWarnMap.isDisposed()){
      self.fualtWarnMap.clear();           //释放图形资源
      self.fualtWarnMap.dispose();
    }
  }
  /*
  * 得到故障统计的数据
  * ///fault/host/count/urn:sites:4CB908EA:hosts:172
  * */
  function getFaultStatisticsData(self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlHealth+'fault/host/count/'+self.hostId,
      success:function (result) {
        if(Number(result.status) == 200){
          handleFaultStatisticsData(result.data,self)
        }
      },error:function (e) {}
    })

  }

  /*
  * 通过devId得到故障统计的数据
  * */
  function getFaultStatisticsDataByDevId(self,devId) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlHealth+'fault/host/count/'+self.hostId+'?devId='+devId,
      success:function (result) {
        if(Number(result.status) == 200){
          handleFaultStatisticsData(result.data,self)
        }
      },error:function (e) {}
    })
  }

  //处理故障统计的数据
  function handleFaultStatisticsData(data,self) {
      if(!GlobalVar.isEmptyObject(data)){
        var colors = [];
        var xAxisData = [];
        var value = [];
        for(var i = 0;i<data.length;i++){
          xAxisData.push(data[i].key);
          value.push(data[i].value);
        }
        breakdownStatisticsMap(self,xAxisData,value,colors);
      }
  }


  /*
  * 得到左边所有的数据
  * ///fault/host/left/urn:sites:4CB908EA:hosts:172
  * */
  function getLeftAllData(self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlHealth+'fault/host/left/'+self.hostId,
      success:function (result) {
        if(Number(result.status) == 200){
          self.deviceDetails = result.data.deviceDetails;
          self.faultCount = result.data.faultCount;
          self.mainframeName = result.data.name?result.data.name.substring(result.data.name.length -5,result.data.name.length):'';
          self.mainframeStatus = result.data.status;
          self.mainframeType = result.data.type;
          self.faultDetails = result.data.faultDetails;
          self.hostSoftwares = result.data.hostSoftwares;
          handleFaultDistributionData(result.data.faultDistribution,self);
          GlobalVar.setScroll('select-equipment');
          //faultDistribution
        }
      },error:function (e) {}
    })
  }

  /*
  * 处理故障分布统计的数据
  * */
  function handleFaultDistributionData(data,self) {
    if(!GlobalVar.isEmptyObject(data)){
      //fualtEarly风险预警  fualtTotal 故障总数  fualtWarn 故障告警
      var fualtEarly = data.fualtEarly;
      var fualtEarlyData = [];
      var fualtEarlyNames = [];
      if(!GlobalVar.isEmptyObject(fualtEarly)){
        var len = fualtEarly.length>4?4:fualtEarly.length;
        for(var i = 0;i<len;i++){
          fualtEarlyData.push(fualtEarly[i].faultCount);
          fualtEarlyNames.push(fualtEarly[i].name);
        }
      }
      self.fualtEarlyMap = echarts.init(document.getElementById('fualtEarly'));
      getPieMap(self.fualtEarlyMap,fualtEarlyData,fualtEarlyNames,fualtEarly);

      var fualtTotal = data.fualtTotal;
      var fualtTotalData = [];
      var fualtTotalNames = [];
      if(!GlobalVar.isEmptyObject(fualtTotal)){
        var len = fualtTotal.length>4?4:fualtTotal.length;
        for(var i = 0;i<len;i++){
          fualtTotalData.push(fualtTotal[i].faultCount);
          fualtTotalNames.push(fualtTotal[i].name);
        }
      }
      self.fualtTotalMap = echarts.init(document.getElementById('fualtTotal'));
      getPieMap( self.fualtTotalMap,fualtTotalData,fualtTotalNames,fualtTotal);

      var fualtWarn = data.fualtWarn;
      var fualtWarnData = [];
      var fualtWarnNames = [];
      if(!GlobalVar.isEmptyObject(fualtWarn)){
        var len = fualtWarn.length>4?4:fualtWarn.length;
        for(var i = 0;i<len;i++){
          fualtWarnData.push(fualtWarn[i].faultCount);
          fualtWarnNames.push(fualtWarn[i].name);
        }
      }
      self.fualtWarnMap = echarts.init(document.getElementById('fualtWarn'));
      getPieMap(self.fualtWarnMap,fualtWarnData,fualtWarnNames,fualtWarn);
    }
  }

  /*
  * 得到故障历史的数据
  * fault/host/history/urn:sites:4CB908EA:hosts:172/30
  * */
  function getBreakHistotyData(self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlHealth+'fault/host/history/'+self.hostId+'/'+self.timeFlag,
      success:function (result) {
        if(Number(result.status) == 200){
          if(!GlobalVar.isEmptyObject(result.data)){
            handleBreakHistoryData(result.data,self);
          }
        }
      },error:function (e) {}
    })
  }

  /*
  * 处理故障历史的数据
  * */
  function handleBreakHistoryData(data,self) {
      var baseTime='';
      self.startTime  = '起 '+data[0].startTime;
      self.endTime = '止 '+data[data.length-1].startTime;
      for(var i = 0;i<data.length;i++){
        baseTime = new Date(data[i].startTime).getTime();
        var duration = '';
        var colorName = getColorName(data[i].metricName);
        var startTime = new Date(data[i].startTime);
        var endTime = new Date(data[i].endTime);
        duration = parseInt((endTime - startTime) / 1000);//相差的秒数据
//        duration = parseInt((endTime - startTime));//相差的毫秒数据
        data[i].color = colorName;
        data[i].duration = duration;
      }
    getBreakdownHistoryMap(self.breakdownHistoryMap,data,baseTime)
  }

  /*得到color*/
  function getColorName(metricName) {
    var colorName = '';
    if(metricName =='CPU'){
      colorName = '#fbb321';
    }else if(metricName =='网络'){
      colorName = '#58c9f3';
    }else if(metricName =='数据库'){
      colorName = '#ff6c60';
    }else if(metricName =='存储'){
      colorName = '#18d96e';
    }else{
      //内存
      colorName = '#18d96e';
    }
    return colorName;
  }

  /*故障历史的图*/
  function getBreakdownHistoryMap(mapName,datas,baseTime) {
    var categories = ['1次'];
    var data = [];
    var types = datas;
    for(var i = 0;i<categories.length;i++){
      var baseTime = baseTime;
      for(var j= 0;j<datas.length;j++){
        var startTime = new Date(datas[j].startTime).getTime();
        var endTime = new Date(datas[j].endTime).getTime();
        var duration =datas[j].duration;
        data.push({
          name:datas[j].metricName,
          itemStyle:{
            normal:{
              color:datas[j].color
            }
          },
//          value:[i,startTime,endTime,duration]
          value:[i,baseTime,baseTime+=duration,duration]
        });
        baseTime += Math.round(Math.random()*2000);
//        if((j + 1)<datas.length){
//          baseTime = new Date(datas[j + 1].startTime).getTime();
//        }

      }
    }
    var option = {
      tooltip: {
        formatter: function(params) {
          var dataIndex = params.dataIndex;
          var html = [];
          html.push('<div id="breakdownStatisticsHover">');
          html.push('<ul>');
          html.push('<li>'+params.marker+'<span>开始时间：'+datas[dataIndex].startTime+'</span></li>');
          html.push('<li>'+params.marker+'<span>结束时间：'+datas[dataIndex].endTime+'</span></li>');
          html.push('<li>'+params.marker+'<span>故障类别：'+datas[dataIndex].type+'</span></li>');
          html.push('<li>'+params.marker+'<span>故障位置：'+params.name +'</span></li>');
          html.push('</ul>');
          html.push(' </div>');
//          return params.marker + params.name + ': ' + params.value[3] + ' ms';
          return html.join('');
        }
      },
      legend: {
        data: ['bar', 'error']
      },
      center: ['50%', '50%'],
      grid: {
        top:'0',
        left: '0',
        right: '0',
        bottom: '0',
        containLabel: true
      },
      xAxis: {
        min: startTime,
        scale: true,
        axisLabel: {
          formatter: function(val) {
            return Math.max(0, val - startTime) + ' m';
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
          show: false,
          lineStyle: {
            color: '#151b22'
          }
        },
        axisLabel: {
          show:false,
          textStyle: {
            color: '#555555'
          }
        },
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
          show:false,
          textStyle: {
            color: '#555555'
          }
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
    mapName.setOption(option,true);
  }

  function getBreakdownHistoryMap1(mapName,data,baseTime) {
    var startTime = 1515498005716;
    var dataCount = 5;
    var categories = ['1次','2次'];
    var data = [];
    var types = [{
      name: 'CPU',
      color: '#fbb321'
    }, {
      name: '网络',
      color: '#58c9f3'
    }, {
      name: '数据库',
      color: '#ff6c60'
    }, {
      name: '磁盘',
      color: '#18d96e'
    }];
    for(var i = 0;i<categories.length;i++){
      var baseTime = 1515498005716;
      for(var j= 0;j<dataCount;j++){
        var typeItem = types[Math.round(Math.random()*(types.length - 1))];
        var duration = Math.round(Math.random()*10000);
        data.push({
          name:typeItem.name,
          itemStyle:{
            normal:{
              color:typeItem.color
            }
          },
          value:[i,baseTime,baseTime+=duration,duration]
        });
        baseTime += Math.round(Math.random()*2000);
      }
    }
    var option = {
      tooltip: {
        formatter: function(params) {
          var html = [];
          html.push('<div id="breakdownStatisticsHover">');
          html.push('<ul>');
          html.push('<li>'+params.marker+'<span>开始时间：2017-11-29  14:08</span></li>');
          html.push('<li>'+params.marker+'<span>结束时间：2017-11-29  14:20</span></li>');
          html.push('<li>'+params.marker+'<span>故障类别：故障告警</span></li>');
          html.push('<li>'+params.marker+'<span>故障位置：'+params.name +'</span></li>');
          html.push('</ul>');
          html.push(' </div>');
//          return params.marker + params.name + ': ' + params.value[3] + ' ms';
          return html.join('');
        }
      },
      legend: {
        data: ['bar', 'error']
      },
      center: ['50%', '50%'],
      grid: {
        top:'0',
        left: '0',
        right: '0',
        bottom: '0',
        containLabel: true
      },
      xAxis: {
        min: startTime,
        scale: true,
        axisLabel: {
          formatter: function(val) {
            return Math.max(0, val - startTime) + ' m';
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
          show: false,
          lineStyle: {
            color: '#151b22'
          }
        },
        axisLabel: {
          show:false,
          textStyle: {
            color: '#555555'
          }
        },
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
          show:false,
          textStyle: {
            color: '#555555'
          }
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
    mapName.setOption(option,true);
  }

  //饼图
  function getPieMap(mapName,pieData,names,allData) {
    var option = {
      tooltip : {
        formatter: function (params) {
          var dataIndex = params.dataIndex;
          var html = [];
          html.push('<div  id="pieHover">');
          html.push('<div class="title"><i></i><span>'+names[dataIndex]+'</span></div>');
          html.push('<div>故障次数：'+pieData[dataIndex]+'次</div>');
          html.push('<div>故障占比：'+allData[dataIndex].proportion+'%</div>');
          html.push('</div>');
          return html.join('');
        }
      },
      color:['#18d96e','#fbb321','#58c9f3','#ff6c60'],
      center: ['50%', '50%'],
      series : [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['70%', '100%'],
//          radius : '100%',
          hoverAnimation:false,
//          center: ['50%', '50%'],
          data:pieData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
        }
      ]
    };
    mapName.setOption(option, true);
  }

  /*故障统计图*/
  function breakdownStatisticsMap(self,xAxisData,value,colors) {
    var  colors = ['#ff6c60','#fbb321','#58c9f3','#58c9f3','#58c9f3']
    var  option = {
      tooltip : {
        show:false,
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '2%',
        right: '0',
        bottom: '1%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          data : xAxisData,
          axisTick: {
            alignWithLabel: true
          },
          "axisLine": {
            lineStyle: {
              color: '#eeeeee',
              type: 'solid'
            }
          },
          axisTick:{
            show:false
          },
          axisLabel: {
            color: '#666666',
            fontSize:16,
            formatter: '{value}'
          }
        }
      ],
      yAxis : [
        {
          type : 'value',
          "axisLine": {
            lineStyle: {
              color: 'transparent',
              type: 'solid'
            }
          },
          axisTick:{
            show:false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#bbbbbb',
              type: 'dotted'
            }
          },
          axisLabel: {
            color: '#666666',
            formatter: '{value} 次'
          }
        }
      ],
      series : [
        {
          name:'故障统计',
          type:'bar',
          barWidth: '30%',
          data:value,
          label: {
            //图形上的文本标签
            normal: {
              show: true,
              position: 'top',
              textStyle: {
                color: '#555555',
                fontStyle: 'bold',
                fontFamily: '微软雅黑',
                fontSize: 16,
              },
              formatter: function(params){
                return params.data;
              }
            }
          },
          itemStyle:{
            normal:{
              color:function (params){
                return colors[params.dataIndex];
              }
            }

          }
        }
      ]
    };
    self.breakdownStatisticsMap.setOption(option,true);
  }

</script>

<style scoped>
@import "../../../../static/css/breakdown-details.css";

  /*设备详情 和列表*/
  .equipment.block-area{
    padding: 0;

  }
  .equipment.block-area>div.title{
    border: none;
    padding-left: 14px;
    color: #ffffff;
    margin-bottom: 14px;
  }

  .equipment-details{
    margin: 20px 0;
  }

  .equipment-list ul{
    list-style: none;
    padding: 0;
    margin-top: 12px;
    margin-right: 14px;
    height: 24px;
  }
  .equipment-list ul li{
    float: left;
    height: 24px;
    width: 46px;
    line-height: 24px;
    border: solid 1px #ffffff;
    color: #ffffff;
    text-align: center;
  }

  .equipment-list ul li.active{
    background-color: #ffffff;
    border: solid 1px #ffffff;
    color: #18d96e;
  }
  /*equipment-list*/
  .equipment-details>div.title{
    background-color: #fbb321;
  }
  .equipment-list>div.title{
    background-color: #18d96e;
  }

  .equipment{
    width: 480px;
    height: 281px;
  }
  .equipment table{
    width: 450px;
    font-size: 14px;
    margin: 0 auto;
  }

  .equipment table th{
    text-align: center;
    color: #333333;
    background-color: #f5f5f5;
    font-weight: normal;
    border: solid 1px #eeeeee;
    height: 38px;
    width: 25%;
  }
  .equipment table td{
    color: #555555;
    border: solid 1px #eeeeee;
    padding: 0 10px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 38px;
    width: 25%;
  }
  .equipment div.equipment-table{
    height:153px;
    width: 450px;
    margin: 0 auto;
  }

  /*故障分布统计*/
  .distribution-statistics{
    margin-top: 20px;
    width: 480px;
    height: 251px;
  }

  ul.statistics{
    text-align: center;
  }
  ul.statistics li{
    display: inline-block;
    vertical-align: top;
    text-align: center;
    width: 121px;
    margin: 0 10px;

  }
  ul.statistics li>div{
    height:121px;
    width: 121px;
    margin-top: 18px;
    margin-bottom: 14px;
  }

  ul.statistics li p{
    color: #666666;
    font-weight: bold;
  }




  /*故障详情*/
  .breakdown-details{
    width: 1100px;
    height: 414px;
    margin: 20px 0;
  }

  .breakdown-details table{
    width: 1072px;
    font-size: 14px;
  }

  .breakdown-details div.table-body{
    height: 277px;
  }

  /*故障统计*/
  .breakdown-statistics{
    width: 1100px;
    height: 330px;
  }

  .equipment-select{
    margin-left: 50px;

  }

  .equipment-select>span,
  .equipment-select>div{
    display: inline-block;
    vertical-align: top;
    font-size: 16px;
    color: #666666;
    font-weight: normal;
  }
  div.select-down>div input{
    width: 131px;
    vertical-align: top;
  }
div.select-down>div{
  margin-top: 6px;
}

div.select-down ul.down-content{
  top:0;
  width: 200px;
  left:0;
}

div.select-down ul.down-content li{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

  div.dropdown-menu{
    height: 212px;
    left:8px;
    width: 200px;
  }
</style>
