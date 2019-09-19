<!--存储的故障详情-->
<template>
  <div class="storage-breakdown content ">
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
            <span>{{equipmentType}}</span>
          </div>
          <ul>
            <li>
              <div><span>{{name}}</span></div>
              <div>设备名称</div>
            </li>
            <li>
              <div><span>{{faultCount}}</span></div>
              <div>故障总数</div>
            </li>
            <li>
              <div><span>{{type}}</span></div>
              <div>设备类型</div>
            </li>
            <li>
              <div><span class="normal">{{status}}</span></div>
              <div>设备状态</div>
            </li>
          </ul>
        </div>

        <!--设备详情-->
        <div style="display: none" class="type-details block-area">
          <div class="title">
            <span>设备详情</span>
          </div>
          <div>
            <table style="table-layout: fixed">
              <tr>
                <td>产品类型</td>
                <td>企业级网络存储</td>
              </tr>
              <tr>
                <td>扩展端口</td>
                <td>2</td>
              </tr>
              <tr>
                <td>外接端口</td>
                <td>5</td>
              </tr>
              <tr>
                <td>千兆以太网口</td>
                <td>2</td>
              </tr>
              <tr>
                <td>10GbE网口</td>
                <td>2</td>
              </tr>
              <tr>
                <td>处理器</td>
                <td>英特尔至强处理器 D-1521</td>
              </tr>
              <tr>
                <td>产品内存</td>
                <td>6GB DDR3 寄存式</td>
              </tr>
              <tr>
                <td>硬盘盘位</td>
                <td>12</td>
              </tr>
              <tr>
                <td>硬盘容量</td>
                <td>2块146GB SFF SAS硬盘，12块用户自选硬盘</td>
              </tr>

            </table>
          </div>
        </div>

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
            <div class="fl">{{startTime}}</div>
            <div class="fr">{{endTime}}</div>
          </div>
        </div> <!--故障历史  end-->



      </div>
    </div>
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
            <th class="same-num">故障编号</th>
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
              <td class="serial-num"><span>{{item.index}}</span></td>
              <td class="same-num"><span></span></td>
              <td class="same-num"><span>{{item.time}}</span></td>
              <td class="same-num"><span>{{item.devName}}</span></td>
              <td class="two-same"><span>{{item.type}}</span></td>
              <td class="two-same"><span>{{item.metricName}}</span></td>
              <td class="describe">
                <span>{{item.content}}</span>
                <div class="hover-content" v-if="isShow(item.content)">{{item.content}}</div>
              </td>

            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
  import echarts from 'echarts'
  import {GlobalVar} from '../../../../static/js/utils'
  export default{
    name:'storageBreakdownDetails',
    data(){
      return{
        breakdownHistoryMap:'',
        faultCount:'',
        name:'',
        type:'',
        hostId:'',
        equipmentType:'',
        timeFlag:7,
        faultDetails:[],//故障详情
        fualtNodes:[],//故障历史
        startTime:'',
        endTime:'',
        status:''
      }
    },
    methods:{
      isShow:function (content) {
        if(content.length>=33){
          return true;
        }else {
          return false;
        }
      },
      cutTimeFlag:function (event,timeFlag) {
        $('ul.time-cut').find('li').removeClass('active');
        $(event.target).addClass('active');
        var self = this;
        self.timeFlag = timeFlag;
        getDataByTime(self);
      }
    },
    updated:function () {
      GlobalVar.setScroll('table-body');
    },
    mounted:function () {
      var self = this;
      var router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      }
      GlobalVar.setHistoryRouter(router);

      var receiveData = GlobalVar.getSessionStorageJson('BREAKDOWN-DETAILS');
      self.hostId = receiveData.hostId;
      self.equipmentType = receiveData.equipmentType;
      getAllData(self);

//      var xAxisData = [];
//      var yAxisData = [];
//      for(var i = 0;i<30;i++){
//        yAxisData.push(Math.ceil(Math.random()*100));
//        xAxisData.push('2017-12-'+i);
//      }
//      getBreakdownHistoryMapNew(self);
//      getBreakdownHistoryMap(self.breakdownHistoryMap,xAxisData,yAxisData);


    },
    beforeDestroy:function () {
      var self = this;
      if(self.breakdownHistoryMap  && !self.breakdownHistoryMap.isDisposed()){
        self.breakdownHistoryMap.clear();           //释放图形资源
        self.breakdownHistoryMap.dispose();
      }
    }
  }

  /*
  * 通过时间得到数据
  * */
  function getDataByTime(self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlHealth+'fault/host/other/'+self.hostId+'/'+self.timeFlag,
      success:function (result) {
        if(Number(result.status) == 200){
          self.fualtNodes = result.data.fualtNodes;
          self.faultDetails = result.data.faultDetails;
          handleFualtHistoryData(self);
        }
      },error:function (e) {}
    })
  }

  /*
  * 得到所有的数据
  * */
  function getAllData(self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlHealth+'fault/host/other/'+self.hostId+'/'+self.timeFlag,
      success:function (result) {
        if(Number(result.status) == 200){
          self.faultCount = result.data.faultCount;
          self.name = result.data.name?result.data.name.substring(result.data.name.length-4,result.data.name.length):'';
          self.type = result.data.type;
          self.faultDetails = result.data.faultDetails;
          self.fualtNodes = result.data.fualtNodes;
          self.status = result.data.status;
          handleFualtHistoryData(self);
        }
      },error:function (e) {}
    })
  }

  /*
  * 处理故障历史的数据
  * */
  function handleFualtHistoryData(self) {
      var data = self.fualtNodes;
      var baseTime;
      self.startTime  = '起 '+data[0].startTime;
      self.endTime = '止 '+data[data.length-1].startTime;
      if(!GlobalVar.isEmptyObject(data)){
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
        getBreakdownHistoryMapNew(self,baseTime,data)
      }
  }

  /*故障历史的图1*/
  function getBreakdownHistoryMapNew(self,baseTime,allData) {
    if(self.breakdownHistoryMap  && !self.breakdownHistoryMap.isDisposed()){
      self.breakdownHistoryMap.clear();           //释放图形资源
      self.breakdownHistoryMap.dispose();
    }
    self.breakdownHistoryMap = echarts.init(document.getElementById('breakdownHistoryMap'));
    var categories = ['1次'];
    var data = [];
    var types = allData;
    for(var i = 0;i<categories.length;i++){
      var baseTime = baseTime;
      for(var j= 0;j<types.length;j++){
        var startTime = new Date(types[j].startTime).getTime();
        var endTime = new Date(types[j].endTime).getTime();
        var duration =types[j].duration;
        data.push({
          name:types[j].metricName,
          itemStyle:{
            normal:{
              color:types[j].color
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
//    console.log(data);
    var option = {
      tooltip: {
        formatter: function(params) {
          var dataIndex = params.dataIndex;
          var html = [];
          html.push('<div id="breakdownStatisticsHover">');
          html.push('<ul>');
          html.push('<li>'+params.marker+'<span>开始时间：'+allData[dataIndex].startTime+'</span></li>');
          html.push('<li>'+params.marker+'<span>结束时间：'+allData[dataIndex].endTime+'</span></li>');
          html.push('<li>'+params.marker+'<span>故障类别：'+allData[dataIndex].type+'</span></li>');
          html.push('<li>'+params.marker+'<span>故障位置：'+params.name +'</span></li>');
          html.push('</ul>');
          html.push(' </div>');
          return html.join('');
//          return params.marker + params.name + ': ' + params.value[3] + ' ms';
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
            return Math.max(0, val - startTime) + ' ms';
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
//          var height = api.size([0, 1])[1] * 0.6;
          var height = 20;

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
    self.breakdownHistoryMap.setOption(option,true);
  }


  /*故障历史的图*/
  function getBreakdownHistoryMap(mapName,xAxisData,yAxisData) {
    var option = {
      title: {
        show:false
      },
      tooltip: {
        show:true,
        formatter:function (params) {

        }
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
        data: ['故障历史']
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
        name: '健康度',
        type: 'line',
        symbolSize:8,
        showAllSymbol: true,//每个点都显示
        data: yAxisData,
        lineStyle: {
          normal: {
            color: '#fbb321',
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
            color:'#f8f8f8'
          }
        },
        itemStyle: {
          normal: {
            color: '#fbb321'
          }
        }
      }]
    };
    mapName.setOption(option,true);
  }



  /*得到color*/
  function getColorName(metricName) {
    var colorName = '';
    if(metricName.indexOf('CPU')>=0){
      colorName = '#fbb321';
    }else if(metricName.indexOf('网络')>=0){
      colorName = '#58c9f3';
    }else if(metricName.indexOf('数据库')>=0){
      colorName = '#ff6c60';
    }else if(metricName.indexOf('存储')>=0){
      colorName = '#18d96e';
    }else{
      //内存
      colorName = '#18d96e';
    }
    return colorName;
  }



</script>

<style scoped>
  .block-area{
    padding: 0 14px;
    border-radius: 2px;
  }
  .block-area>div.title{
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eeeeee;
    font-size: 16px;
    color: #555555;
    font-weight: bold;
  }

  .breakdown-type{
    width: 480px;
    height:267px;
    /*height: 179px;*/
  }
  .breakdown-type ul{
    list-style: none;
    padding: 0;
    /*margin: 0;*/
    margin-top: 36px;
    text-align: center;
  }

  .breakdown-type ul li{
    display: inline-block;
    vertical-align: top;
    color: #555555;
    margin: 15px 17px;
  }
  .breakdown-type ul li span{
    display: inline-block;
  }

  .breakdown-type ul li>div:first-child{
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  /*58c9f3  danger*/
  .breakdown-type ul li>div:first-child>span{
    border-bottom: 3px solid #58c9f3;
  }

  /*危险*/
  .breakdown-type ul li>div:first-child>span.danger{
    border-bottom: 3px solid #ff6c60;
    color: #ff6c60;
  }

  /*高危*/
  .breakdown-type ul li>div:first-child>span.hight-risk{
    border-bottom: 3px solid #c10f01;
    color: #c10f01;
  }
  /*正常*/
  .breakdown-type ul li>div:first-child>span.normal{
    border-bottom: 3px solid #18d96e;
    color: #18d96e;
  }

  /*.breakdown-type ul li:first-child>div:first-child>span{*/
    /*border-bottom: 3px solid #fbb321;*/
  /*}*/

  /*.breakdown-type ul li:nth-child(2)>div:first-child>span{*/
    /*border-bottom: 3px solid #ff6c60;*/
  /*}*/

  /*.breakdown-type ul li:nth-child(3)>div:first-child>span{*/
    /*border-bottom: 3px solid #58c9f3;*/
  /*}*/

  .breakdown-type ul li>div:last-child{
    font-size: 16px;
  }

  .type-details{
    width: 480px;
    height: 505px;
    margin-top: 20px;
  }
  .type-details.block-area{
    padding: 0;
    border: none;
  }
  .type-details.block-area>div.title{
    background-color: #fbb321;
    color: #ffffff;
    padding-left: 14px;
  }
  .type-details table {
    height: 424px;
    margin: 14px auto;
  }

  .type-details table>tr>td:first-child{
    width: 121px;
    background-color: #f5f5f5;
  }
  .type-details table>tr>td:last-child{
    width: 328px;
  }

  .type-details table td{
    height: 46px;
    border: 1px solid #eeeeee;
    text-align: center;
    font-size: 14px;
    color: #333333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 4px;

  }

  /*故障历史*/
  .breakdown-history{
    width: 1100px;
    height: 268px;
    position: relative;
  }

  .breakdown-history div#breakdownHistoryMap{
    /*height: 145px;*/
    height: 170px;
    width: 1071px;
    margin-top: 10px;
  }

  .breakdown-history .y-time{
    position: absolute;
    bottom: 10px;
    width: 96%;
    font-size: 12px;
    color: #555555;
  }
  .breakdown-history .y-time>div{
    width: 83px;
    text-align: center;
  }

  ul.legend{
    list-style: none;
    margin-left: 40px;
  }
  ul.legend li{
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    color: #666666;
    font-weight: normal;
    margin: 0 10px;
  }
  ul.legend li i,
  ul.legend li span{
    display: inline-block;
    vertical-align: top;
  }
  ul.legend li i{
    width: 14px;
    height: 14px;
    border-radius: 2px;
    margin-top: 17px;
    margin-right: 4px;
  }
  ul.legend li i.cpu{
    background-color: #fbb321;
  }
  ul.legend li i.web-in{
    background-color: #58c9f3;
  }
  ul.legend li i.databse{
    background-color: #ff6c60;
  }
  ul.legend li i.disk{
    background-color: #18d96e;
  }
  /*故障详情*/
  .breakdown-details{
    /*width: 1100px;*/
    width: 100%;
    height: 510px;
    margin-top: 20px;
  }

  .breakdown-details table{
    /*width: 1072px;*/
    width: 1572px;
    font-size: 14px;
  }

  .breakdown-details table tr{
    height: 46px;
  }

  .breakdown-details table thead th{
    background-color: #f5f5f5;
    color: #333333;
    text-align: center;
    font-weight: normal;
    border: 1px solid #eeeeee;
    padding: 0 4px;
  }

  .breakdown-details table tbody td{
    color: #555555;
    text-align: center;
    border: 1px solid #eeeeee;
    padding: 0 4px;
    position: relative;

  }

  .breakdown-details table tbody td>span{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
  .breakdown-details div.table-body{
    /*max-height: 328px;*/
    height: 370px;
  }

  .breakdown-details table tbody td div.hover-content{
    width: 180px;
    min-height: 74px;
    position: absolute;
    background-color: rgba(34, 34, 34, 0.7);
    border-radius: 2px;
    padding: 10px;
    top:-28px;
    right: 0;
    font-size: 14px;
    color: #fefefe;
    display: none;
    text-align: left;
  }

  .breakdown-details table tbody td:hover div.hover-content{
    display: block;
  }
  .serial-num{
    width: 10%;
  }
  .same-num{
    width: 16%;
  }
  .two-same{
    width: 13%;
  }
  .describe{
    width: 31%;
  }
</style>
