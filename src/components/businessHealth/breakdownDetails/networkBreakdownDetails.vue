<!--存储的故障详情-->
<template>
  <div class="network-breakdown content ">
    <div class="navigation-cut clear">

      <ul class="fr">
        <li>
          <router-link to="/businessHealthDegree/faultStatistic">故障统计</router-link>
        </li>
        <li>网络故障详情</li>
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
              <div><span>PC-1</span></div>
              <div>设备名称</div>
            </li>
            <li>
              <div><span>12</span></div>
              <div>故障总数</div>
            </li>
            <li>
              <div><span>存储</span></div>
              <div>设备类型</div>
            </li>
            <li>
              <div><span class="hight-risk">高危</span></div>
              <div>设备状态</div>
            </li>
          </ul>
        </div>

        <!--设备详情-->
        <div style="display: none;" class="type-details block-area">
          <div class="title">
            <span>设备详情</span>
          </div>
          <div>
            <table style="table-layout: fixed">
              <tr>
                <td>产品类型</td>
                <td>万兆以太网交换机</td>
              </tr>
              <tr>
                <td>应用层次</td>
                <td>二层</td>
              </tr>
              <tr>
                <td>传输速率</td>
                <td>10/100Mbps</td>
              </tr>
              <tr>
                <td>交换方式</td>
                <td>存储-转发</td>
              </tr>
              <tr>
                <td>背板宽带</td>
                <td>256Gbps</td>
              </tr>
              <tr>
                <td>包转发率</td>
                <td>72Mbps</td>
              </tr>
              <tr>
                <td>MAC地址表</td>
                <td>16K</td>
              </tr>
              <tr>
                <td>端口数量</td>
                <td>24个</td>
              </tr>
              <tr>
                <td>端口描述</td>
                <td>24个10/100/1000Base-T端口</td>
              </tr>
              <tr>
                <td>控制端口</td>
                <td>4个100/1000Base-X千兆Combo口</td>
              </tr>
              <tr>
                <td>扩展模块</td>
                <td>1个堆叠扩展插槽</td>
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
              <li>7天</li>
              <li class="active">30天</li>
              <li>全部</li>
            </ul>
          </div>
          <div id="breakdownHistoryMap"></div>
          <div class="y-time">
            <div class="fl">起 2017-11-29 10:30:35</div>
            <div class="fr">止 2017-11-30 10:30:35</div>
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
            <tr v-for="item in tableData">
              <!---->
              <!--<td v-bind:class="getClassName(index)" v-for="(list,index) in item">{{list}}</td>-->
              <td v-bind:class="getClassName(index)" v-for="(list,index) in item">
                <span>{{list}}</span>
                <div class="hover-content" v-if="isShow(list)">{{list}}</div>
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
    name:'networkBreakdownDetails',
    data(){
      return{
        breakdownHistoryMap:'',
        tableData:[]
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
        if(content.length>=33){
          return true;
        }else {
          return false;
        }
      }
    },
    updated:function () {

    },
    mounted:function () {
      var self = this;
      var router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      }
      GlobalVar.setHistoryRouter(router);
      self.breakdownHistoryMap = echarts.init(document.getElementById('breakdownHistoryMap'));
      var xAxisData = [];
      var yAxisData = [];
      for(var i = 0;i<30;i++){
        yAxisData.push(Math.ceil(Math.random()*100));
        xAxisData.push('2017-12-'+i);
      }
      //
      getBreakdownHistoryMapNew(self.breakdownHistoryMap);
//      getBreakdownHistoryMap(self.breakdownHistoryMap,xAxisData,yAxisData);

      for(var i = 1;i<30;i++){
        var arr = [];
        arr.push('00'+i);
        arr.push('Warining00'+i);
        arr.push('2017-12-23 10:32');
        arr.push('VM1');
        arr.push('故障告警');
        arr.push('CPU');
        arr.push('丢包率超过40%丢包率超过40%丢包率超过40%丢包率超过40%');
        self.tableData.push(arr);
      }
      GlobalVar.setScroll('table-body');
    }
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

  /*故障历史的图1*/
  function getBreakdownHistoryMapNew(mapName) {
    var startTime = 1515498005716;
    var dataCount = 5;
    var categories = ['1次', '2次', '3次'];
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
//    console.log(data);
    var option = {
      tooltip: {
        formatter: function(params) {
          return params.marker + params.name + ': ' + params.value[3] + ' ms';
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
          var height = api.size([0, 1])[1] * 0.6;

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
    /*height: 179px;*/
    height:267px;
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

  .breakdown-type ul li>div:first-child>span.danger{
    border-bottom: 3px solid #ff6c60;
    color: #ff6c60;
  }

  /*高危*/
  .breakdown-type ul li>div:first-child>span.hight-risk{
    border-bottom: 3px solid #c10f01;
    color: #c10f01;
  }


  .breakdown-type ul li>div:last-child{
    font-size: 16px;
  }

  .type-details{
    width: 480px;
    height: 599px;
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
    height: 520px;
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
    width: 1572px;
    /*width: 1072px;*/
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
