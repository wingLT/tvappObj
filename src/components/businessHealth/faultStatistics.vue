<template>
  <!--故障统计-->
  <div class="fault-statistic content clear">
    <!--业务图-->
    <ul class="business">
      <li @click="businessCut(item.bus.name,item.bus.id,item.bus.useType,index)"  v-for="(item,index) in businessData">
        <div class="business-map"></div>
        <span>{{item.bus.name}}</span>
      </li>
      <li @click="getFaultStatistic($event)" class="breakdown-count active">
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
    <div class="fl all-select block-area">
      <!--故障级别-->
      <div class="system-fault-level">
        <div class="title">
          <i></i>
          <span>{{systemFaultLevelData.chName}}</span>
        </div>
        <div class="select-down dropdown">
          <div>
            <input v-model="systemFaultLevel"/>
            <span  class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down"></i></span>
            <ul class="no-header down-content dropdown-menu">
              <li v-for="item in systemFaultLevelData.nodes" @click="selectFaultLevel(item.value,item.key)">{{item.key}}</li>
            </ul>
          </div>
        </div>
      </div> <!--故障级别  end-->
      <!--设备类型-->
      <div class="equipment-type">
        <div class="title">
          <i></i>
          <span>{{equipmentTypeData.chName}}</span>
        </div>
        <div class="select-down dropdown">
          <div>
            <input v-model="equipmentType"/>
            <span  class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down"></i></span>
            <ul class="no-header down-content dropdown-menu">
              <li v-for="item in equipmentTypeData.nodes" @click="selectEquipmentType(item.value,item.key)">{{item.key}}</li>
            </ul>
          </div>
        </div>
      </div> <!--设备类型  end-->
    </div>
    <!--排名-->
    <div class="fr ranking block-area">
      <div class="title">
        <span>系统故障排名</span>
        <ul class="fr time-cut">
          <li class="active" @click="cutTimeFlag($event,1)">1天</li>
          <li @click="cutTimeFlag($event,7)">7天</li>
        </ul>
      </div>
      <div id="rankingMap"></div>

      <!--页码-->
      <div class="page clear">
        <div class="cut-page-number fl">
          <div>总条数 {{total}}，共 {{pages}} 页</div>
        </div>

        <div class="page-number fr">
          <div class="page-turning" id="paging"></div>
          <div class="go-page">
            <span id="goToPage">
              <input v-model="goToPageValue" type="number" @keyup="changeBorderColor()"/>
            </span>
            <span @click="goToPage()">GO</span>
          </div>
        </div>

      </div>
    </div>


  </div>
</template>

<script>
  import echarts from 'echarts'
  import {GlobalVar} from '../../../static/js/utils'
  import {PublicMap} from '../../../static/js/PublicMap'
  export default {
    name:'faultStatistic',
    data(){
      return{
        //故障级别
        systemFaultLevel:'全部',
        systemFaultLevelValue:-1,
        systemFaultLevelData:[],
        //设备类型
        equipmentType:'全部',
        equipmentTypeValue:-1,
        equipmentTypeData:[],
        page:1,//当前页码
        number:10,//页面大小，每页显示的条数
        rankingMap:'',
        pages:0,//总页数
        total:0,//总条数
        goToPageValue:1,
        timeFlag:1,
        businessData:[],
        allBusinessMaps:[]
      }
    },
    methods:{
      getFaultStatistic:function () {
        $(event.target).parents('ul.business').find('li.breakdown-count').addClass('active');
        this.$router.push({ path: '/businessHealthDegree/faultStatistic'});
      },
      businessCut:function (name,id,useType,index) {
        this.$router.push({
          path: '/businessHealthDegree',
          name:'业务健康度',
          params:{
            busId:id,
            index:index,
            businessType:name
          }
        });
      },
      selectFaultLevel:function (value,name) {
        //故障级别
        var self = this;
        this.systemFaultLevel = name;
        this.systemFaultLevelValue = value;
        getRankingData(self);
      },
      selectEquipmentType:function (value,name) {
        //设备类型
        var self = this;
        this.equipmentType = name;
        this.equipmentTypeValue = value;
        getRankingData(self);
      },
      /*直接跳转到某页*/
      goToPage:function () {
        var self = this;
        self.page = this.goToPageValue;
        if(self.page<=self.pages && self.page>0){
          getRankingData(self);
        }else{
          $('.page .page-number>div.go-page').css('border-color','#ff6c60');
        }

      },
      changeBorderColor:function () {
        $('.page .page-number>div.go-page').css('border-color','#cccccc');
      },
      cutTimeFlag:function (event,timeFlag) {
        $('ul.time-cut').find('li').removeClass('active');
        $(event.target).addClass('active');
        var self = this;
        self.timeFlag = timeFlag;
        getRankingData(self)
      }
    },
    updated:function () {
      var self = this;
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
    },
    mounted:function () {
      var self = this;
      //添加历史路由
      var router = {
        url:this.$route.path,
        name:this.$route.name,
        className:'active'
      }
      GlobalVar.setHistoryRouter(router);
      getAllBusiness(self);
      getAllType(self);
      getRankingData(self);

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
  function destroyEcharts(self){
    if(self.rankingMap  && !self.rankingMap.isDisposed()){
      self.rankingMap.clear();           //释放图形资源
      self.rankingMap.dispose();
    }
    for (var i = 0;i<self.allBusinessMaps.length;i++){
      if(self.allBusinessMaps[i]  && !self.allBusinessMaps[i].isDisposed()){
        self.allBusinessMaps[i].clear();           //释放图形资源
        self.allBusinessMaps[i].dispose();
      }
    }
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
          if(!GlobalVar.isEmptyObject(result.data)){}
        }
        //businessData
      },
      error:function (e) {}
    })
  }

  //页码
  function pageNumber(pages,page,self) {
    $("#paging").CreatePage({
      pageCount: pages,//总页数
      current: page,//当前页码
      backFn: function (page) {
        //page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
        self.page = page;
        getRankingData(self);
      }
    });
  }

  /*
  * 得到排名的数据
  *  fault/index?page=1&number=10&level=1&devType=1
  * */
  function getRankingData(self) {
    var level = self.systemFaultLevelValue;
    var devType = self.equipmentTypeValue;
    var timeFlag = self.timeFlag;
    $.ajax({
      type:'get',
      url:GlobalVar.urlHealth+'fault/index?page='+self.page+'&number='+self.number+'&level='+level+'&devType='+devType+'&time='+timeFlag,
      success:function (result) {
        if(Number(result.status) == 200){
          handleRankingData(result.data.faultDeviceVOs,self);
        }
      },error:function (e) {

      }
    })

  }

  /*
  * 处理排名的数据
  * */
  function handleRankingData(data,self) {
    var yData = [];
    var XData = [];
    var names = [];
    var hostIds = [];
    var isHosts = [];
    if(!GlobalVar.isEmptyObject(data)){
      self.pages = data.pages?data.pages:0;//总页数
      self.total = data.total?data.total:0;//总条数
      pageNumber(self.pages,self.page,self);
      var rows = data.rows?data.rows:[];
      var len = rows.length - 1;
      for(var i = len;i>=0;i--){
        yData.push('Top'+(i+1))
        names.push(rows[i].hostName);
        XData.push(rows[i].faultCount);
        hostIds.push(rows[i].hostId);
        isHosts.push(rows[i].isHost);
      }
      getRanking(self,XData,'#18d96e',yData,names,hostIds,isHosts);
    }

  }


  /*得到所有筛选类型*/
  function getAllType(self) {
    $.ajax({
      type:'get',
      url:GlobalVar.urlHealth+'fault/type',
      success:function (result) {
        if(Number(result.status) == 200){
          handleAllType(result.data,self);;
        }
      },error:function (e) {}
    })
  }

  //处理筛选类型
  function handleAllType(data,self) {
    if(!GlobalVar.isEmptyObject(data)){
      for(var i = 0;i<data.length;i++){
        if(data[i].enName == 'level'){
          //故障级别
          self.systemFaultLevelData = data[i];
        }else if(data[i].enName == 'devType'){
          //设备类型
          self.equipmentTypeData = data[i];
        }
      }
    }
  }


  //排名
  function getRanking(self,value,colorName,yData,names,hostIds,isHosts) {
    if(self.rankingMap  && !self.rankingMap.isDisposed()){
      self.rankingMap.clear();           //释放图形资源
      self.rankingMap.dispose();
    }
    self.rankingMap = echarts.init(document.getElementById('rankingMap'));
    var  option = {
      tooltip: {
        axisPointer: {
          type: 'shadow'
        },
        formatter:function (params) {
          var dataIndex = params.dataIndex;
          return names[dataIndex];
        }
      },
      grid: {
        top:'0',
        left: '0',
        right: '30px',
        bottom: '1px',
        containLabel: true
      },
      xAxis: {
        type: 'value',
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
                }
              }
            }
          }
        }
      ]
    };
    self.rankingMap.setOption(option,true);
    self.rankingMap.on('click',function (params) {
      var dataIndex = params.dataIndex;
      var isHost = isHosts[dataIndex];
      var hostId = hostIds[dataIndex];
      var breakdownDetails = {
        hostId:hostId,
        equipmentType:self.equipmentType
      }
      if(isHost == 'true'){
        GlobalVar.setSessionStorageJson('BREAKDOWN-DETAILS',breakdownDetails);
        self.$router.push({ path: '/otherBreakdownDetails',});
      }else{
        GlobalVar.setSessionStorageJson('BREAKDOWN-DETAILS',breakdownDetails);
        self.$router.push({ path: '/storageBreakdownDetails',});
      }
//      self.$router.push({ path: '/storageBreakdownDetails',});
//      self.$router.push({ path: '/networkBreakdownDetails',});
//      self.$router.push({ path: '/otherBreakdownDetails',});
    })
  }


  /*得到bar的颜色*/
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
  .fault-statistic>div{
    height: 770px;
    border-radius: 2px;
  }
  .fault-statistic>div.all-select{
    width: 290px;
    padding-left: 20px;
  }
  .fault-statistic>div.all-select>div{
    margin-top: 30px;
  }

  .fault-statistic>div.all-select>div>div{
    display: inline-block;
    vertical-align: top;
  }
  .fault-statistic>div.all-select>div>div.title{
    margin-top: 7px;
  }

  .fault-statistic>div.all-select>div>div.title>i,
  .fault-statistic>div.all-select>div>div.title>span{
    display: inline-block;
    vertical-align: top;
  }

  .fault-statistic>div.all-select>div>div.title>i{
    width: 10px;
    height: 16px;
    background-color: #18d96e;
    border-radius: 2px;
    margin-top: 3px;
    margin-right: 10px;
  }

  .fault-statistic>div.ranking{
    width: 1290px;
    padding: 0 14px;
  }

  .fault-statistic>div.ranking div.title{
    height: 68px;
    line-height: 68px;
    border-bottom: 1px solid #eeeeee;
  }

  .fault-statistic>div.ranking div.title>span{
    font-size: 16px;
    color: #555555;
    font-weight: bold;
  }
  #rankingMap{
    width: 1170px;
    height: 560px;
    margin: 40px auto;
  }


  .page div.cut-page-number>div{
    display: inline-block;
    vertical-align: top;
  }

  .page div.cut-page-number>div:first-child,
  .page div.cut-page-number>div:last-child{
    margin-top: 4px;
  }

  .page .page-number>div{
    display: inline-block;
    vertical-align: top;
  }
  .page .page-number>div.go-page{
    width: 88px;
    height: 28px;
    border-radius: 4px;
    border: solid 1px #cccccc;
    margin-left: 19px;
  }
  .page .page-number>div.go-page>span{
    float: left;
    height: 100%;
    line-height: 28px;
    text-align: center;
    font-size: 14px;
    width: 50%;
    outline: none;
  }

  .page .page-number>div.go-page>span:last-child{
    color: #ffffff;
    background-color:  #18d96e;
    cursor: pointer;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .page .page-number>div.go-page>span input{
    border: none;
    height: 24px;
    width: 100%;
    padding-left: 10px;
    border-radius: 4px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }

</style>
