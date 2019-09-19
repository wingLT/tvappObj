<template>
  <main-container class="main-container">
    <!--跳转头-->
    <div class="skip-header">
      <div class="head-fr">
        <!--<span class="green-font">排班管理</span> /-->
        <router-link to="./Scheduling">排班管理</router-link>
        /
        <router-link to="./SchedulingTemplate">排班模板</router-link>
        /
        <router-link to="" class="green-font">历史排班模板</router-link>
        <!--<span>排班管理</span> /-->
        <!--<span>排班模板</span> /-->
        <!--<span>历史排班模板</span>-->
      </div>
    </div>
    <!--历史排班模板主体部分-->
    <div class="hisychedu-temp">
      <div class="hisytemp-fl">
        <div class="hsyfl-head">
          <i></i>
          <span>历史排班模板</span>
        </div>
        <div class="hisy-list">
          <ul>
            <li class="active">
              <i class="dot"></i>
              <span>排班模板2017-12-06 15:51:51</span>
              <i class="delete">X</i>
            </li>
            <li v-for="list in 4" @click="chedulClick(list)">
              <i class="dot"></i>
              <span>排班模板2017-12-06 15:51:51</span>
              <i class="delete">X</i>
            </li>
          </ul>
        </div>
      </div>
      <div class="hisytemp-fr">
        <!--历史排班模板头部部分-->
        <div class="temp-head">
          <div class="th-fl">
            <i></i>
            <span>排班分类</span>
          </div>
          <div class="th-fr">
            <ul>
              <li><a href="javascript:;">一键导出</a></li>
            </ul>
          </div>
        </div>
        <!--&lt;!&ndash;历史排班模板中心部分&ndash;&gt;-->
        <div class="temp-content" style="clear: both;">
          <!--排班模板左边部分-->
          <div class="temcon-fl">
            <ul>
              <li class="clas-active">六楼MDC监控机房</li>
              <li>六楼编辑区</li>
              <li>MPC调度岗</li>
              <li>五楼5-1、高清单机系统</li>
              <li>三楼编辑区</li>
              <li>八楼编辑区</li>
              <li>四楼媒咨主干收录系统</li>
              <li>新媒体</li>
            </ul>
          </div>
          <!--排班模板右边部分-->
          <div class="temcon-fr">
            <div class="row">
              <div class="col-md-6 list-block" v-for="list in 3">
                <!--<div class="col-md-4 list-block">-->
                <div style="border: 1px solid #e1e1e1;height: 100%;border-radius: 2px;">
                  <div class="col-md-12 tc-head">
                    <div class="tchea-fl">
                      <i></i>
                      <span>生产网络数据库巡检</span>
                    </div>
                    <div class="tchea-fr">
                      <ul>
                        <li @click="lookPop()">查看</li>
                      </ul>
                    </div>
                  </div>
                  <div class="col-md-12 tc-body">
                    <ul>
                      <li v-for="(list,index) in arr">
                        <div class="search-fl">
                          <span class="search-txt">{{ list }}</span>
                          <i>|</i>
                          <span class="search-txt">10:30-11:00</span>
                          <i>|</i>
                          <span class="search-txt">每天</span>
                          <span class="search-txt">每天</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--查看弹窗-->
    <el-dialog :visible.sync="workConEditVisible" width="1130px" heigh="605px" style="overflow:hidden;">
      <!--头部-->
      <div slot="title" class="dialog-head">
        <div class="workcon-head">
          <div class="hea-chunk">
            <p>排班编号MB0001</p>
            <h3>生产网络数据库巡检</h3>
          </div>
        </div>
      </div>
      <!--主体-->
      <div class="dialog-body">
        <div class="wcpop-tier">
          <span class="wcpop-label">子任务</span>
          <ul>
            <li class="green-bg" @click="popStatus(1)">09:00-12:00</li>
            <li @click="popStatus(2)">12:00-15:00</li>
            <li @click="popStatus(3)">15:00-18:00</li>
          </ul>
        </div>
        <div class="">
          <div class="workpop-body">
            <div class="table table-title">
              <table>
                <thead>
                <tr>
                  <th class="">名称</th>
                  <th class="big">工作内容</th>
                  <th class="">开始时间</th>
                  <th class="">结束时间</th>
                  <th class="">频率</th>
                  <th class="">汇报方式</th>
                  <th class="">设备IP</th>
                </tr>
                </thead>

                <tbody>
                <tr>
                  <td class="">
                    检查磁盘
                  </td>
                  <td class="big">
                    <p>检查数据库用到的S5600T上的LUN的绑定磁盘状态，心跳线状态是否正常；检查数据库K盘使用情况</p>
                  </td>
                  <td class="">10:30</td>
                  <td class="">11:00</td>
                  <td class="">每天</td>
                  <td class="">备注</td>
                  <td class="big">114.114.114.114</td>
                </tr>
                <tr>
                  <td class="">
                    日志检查
                  </td>
                  <td class="big">
                    <p>检查数据盘K盘使用情况</p>
                  </td>
                  <td class="">10:30</td>
                  <td class="">11:00</td>
                  <td class="">周三、周六</td>
                  <td class="">备注</td>
                  <td class="big">192.168.164.114</td>
                </tr>
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>


  </main-container>

</template>

<script>
  import Vue from 'vue'
  import {GlobalVar} from "../../../static/js/utils";
  import MainContainer from "../Packages/MainContainer";
  import {PublicMap} from "../../../static/js/PublicMap";
  import template from '../Packages/MainContainer.vue'
  import Swiper from '../../../static/js/swiper'

  Vue.component(template.name, template);

  function clickChedulClass() {
    $('.temcon-fl ul li').click(function () {
      $(this).addClass('clas-active');
      $(this).siblings().removeClass('clas-active');
    });
    $('.hisy-list ul li').click(function () {
      $(this).addClass('active');
      $(this).siblings().removeClass('active');
    });
  };
  $(function () {// 初始化内容
    // clickChedulClass()
  });
  export default {
    name: "history-scheduling-template",
    data() {
      return {
        arr: ['检查数据K盘', '日志检查'],

        workConEditVisible: false,
      }
    },
    mounted() {
      const self = this;
      let router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      };
      GlobalVar.setHistoryRouter(router);

      clickChedulClass();
      self.$nextTick(function () {
        clickChedulClass();
        // console.log("sdfs")
      })

    },
    methods: {
      popStatus: function () {
        $('.wcpop-tier ul li').click(function () {
          $(this).addClass('green-bg');
          $(this).siblings().removeClass('green-bg');
        })
      },
      //查看 弹窗的显示
      lookPop: function () {
        const self = this;
        self.workConEditVisible = true;
      },
      //历史排班模板点击切换
      chedulClick: function (index) {
        switch (index) {
          case 1:
            this.arr = ['日志检查', '检查数据K盘'];
            break;
          case 2:
            this.arr = ['检查数据K盘', '日志检查'];
            break;
          case 3:
            this.arr = ['日志检查', '检查数据K盘'];
            break;
        }
      },
    },
  }
</script>

<style scoped>
  .hisychedu-temp .hisytemp-fl {
  }

  .hisychedu-temp {
    border-radius: 2px;
    position: relative;
    overflow: hidden;
  }

  .hisychedu-temp .hisytemp-fl {
    float: left;
    width: 374px;
    padding: 22px 30px 30px 30px;
    background: #ffffff;
  }

  .hisytemp-fl .hsyfl-head {
    position: relative;
    margin-bottom: 15px;
  }

  .hisychedu-temp .hisytemp-fl .hsyfl-head > i {
    width: 10px;
    height: 22px;
    background: #18d96e;
    position: absolute;
    left: -30px;
    top: 5px;
  }

  em, i {
    font-style: normal;
  }

  .hisychedu-temp .hisytemp-fl .hsyfl-head > span {
    color: #555555;
    font-size: 20px;
    font-weight: bold;
  }

  .hisytemp-fl .hisy-list {
    height: 660px;
  }

  .hisytemp-fl .hisy-list ul li {
    color: #555555;
    font-size: 16px;
    width: 100%;
    height: 34px;
    line-height: 34px;
    position: relative;
  }

  .hisytemp-fl .hisy-list ul li i.dot {
    width: 5px;
    height: 5px;
    background-color: #c1c1c1;
    border-radius: 50%;
    left: 10px;
    position: absolute;
    vertical-align: middle;
    top: 16px;
    transition: all .3s;
  }

  .hisytemp-fl .hisy-list ul li.active i.dot {
    background-color: rgba(253, 189, 15, 1);
  }

  .hisytemp-fl .hisy-list ul li > span {
    width: 90%;
    display: block;
    margin: 0 auto;
    padding: 0 4px 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hisytemp-fl .hisy-list ul li i.delete {
    position: absolute;
    right: 10px;
    top: 0;
    color: #ff4f4f;
    cursor: pointer;
    display: none;
  }

  .active {
    background-color: #f5f5f5;
    color: #555555;
    transition: all .3s;
  }

  .hisytemp-fl .hisy-list ul li:hover {
    background-color: #f5f5f5;
    color: #555555;
    transition: all .3s;
  }

  .hisytemp-fl .hisy-list ul li:hover .delete {
    display: block;
  }

  .hisychedu-temp .hisytemp-fr {
    float: left;
    width: 76%;
    margin-left: 10px;
    padding: 22px 30px 30px 30px;
    background: #ffffff;
  }

  .temp-head {
    height: 36px;
    line-height: 36px;
    margin-bottom: 30px;
    /*overflow: hidden;*/
    position: relative;
  }

  .temp-head .th-fl {
    float: left;
    position: relative;
  }

  .temp-head .th-fl > i {
    width: 10px;
    height: 22px;
    background: #18d96e;
    position: absolute;
    left: -30px;
    top: 8px;
  }

  .temp-head .th-fl > span {
    color: #555555;
    font-size: 20px;
    font-weight: bold;
  }

  .temp-head .th-fr {
    float: right;
  }

  .temp-head .th-fr ul li {
    float: left;
    width: 116px;
    height: 36px;
    line-height: 36px;
    border: 2px solid #18d96e;
    text-align: center;
    margin-left: 20px;
  }

  .temp-head .th-fr ul {
    overflow: hidden;
    margin-bottom: 0;
  }

  .temp-head .th-fr ul li a {
    font-size: 16px;
    color: #18d96e;
  }

  /*=============排班模板中心部分样式开始=========*/
  .temp-content {
    clear: both;
    overflow: hidden;
    position: relative;
  }

  .temp-content .temcon-fl {
    float: left;
    overflow: auto;
    height: 640px;
  }

  .temp-content .temcon-fl ul {

  }

  .temp-content .temcon-fl ul li {
    width: 230px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: #f5f5f5;
    margin-bottom: 20px;
    font-size: 16px;
    color: #555555;
    border-radius: 2px;
    cursor: pointer;
    transition: .3s;
  }

  .temp-content .temcon-fl ul li:hover {
    background: #18d96e !important;
    color: #ffffff !important;
  }

  .clas-active {
    background: #18d96e !important;
    color: #ffffff !important;
  }

  .temp-content .temcon-fr {
    float: left;
    width: 80%;
  }

  .temcon-fr .row {
    height: 640px;
    overflow: auto;
  }

  .temcon-fr .list-block {
    padding: 0;
    border-left: 20px solid #ffffff;
    border-bottom: 20px solid #ffffff;
    height: 350px;
  }

  .temcon-fr .list-block .tc-head {
    overflow: hidden;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    background: #e3e3e3;
    font-size: 16px;
    color: #555555;
  }

  .temcon-fr .list-block .tc-head .tchea-fl {
    float: left;
  }

  .list-block .tc-head .tchea-fl > i {
    display: inline-block;
    vertical-align: middle;
    width: 14px;
    height: 14px;
    background: #18d96e;
    margin-right: 10px;
  }

  .list-block .tc-head .tchea-fl > span {
    font-weight: bold;
  }

  .temcon-fr .list-block .tc-head .tchea-fr {
    float: right;
  }

  .list-block .tc-head .tchea-fr ul li {
    height: 50px;
    line-height: 50px;
    float: left;
    margin-left: 10px;
    cursor: pointer;
  }

  .temcon-fr .list-block .tc-body {
    padding: 10px 0 0 0;
    /*height: 280px;*/
    overflow: hidden;
    position: relative;
  }

  .tc-body ul li {
    height: 34px;
    line-height: 34px;
    padding: 0 20px;
    font-size: 14px;
    color: #555555;
    cursor: pointer;
    transition: .3s;
  }

  .tc-body ul li:hover {
    background: #efefef;
  }

  .tc-body .search-fl {
    float: left;
  }

  .tc-body .search-fl ul li {

  }

  .tc-body ul li span.search-txt {

  }

  .tc-body ul li > i {

  }

  .tc-body .search-fr {
    float: right;
  }

  .list-block .con-last {
    display: inline-block;
    text-align: center;
    color: #555555;
    position: relative;
    top: 50%;
    left: 50%;
    cursor: pointer;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .list-block .con-last > span:first-child {
    font-size: 50px;
    display: block;
    color: #18d96e;
  }

  .list-block .con-last > span:last-child {
    font-weight: bold;
    font-size: 16px;
  }

  /*弹框头部样式开始*/
  .workcon-head {
    overflow: hidden;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .workcon-head .hea-chunk {
    color: #555555;
    float: left;
  }

  .workcon-head .hea-chunk:nth-child(1) {
    border-right: 1px solid #d3d3d3;
    padding-right: 30px;
  }

  .workcon-head .hea-chunk:nth-child(2) {
    padding: 0 70px 0 30px;
  }

  .workcon-head .hea-chunk > p {
    margin: 0;
    line-height: 30px;
  }

  .workcon-head .hea-chunk > h3 {
    margin: 0;
    font-weight: bold;
  }

  .hea-chunk .tier {
    overflow: hidden;
  }

  .hea-chunk .tier > span {
    float: left;
    /*display: inline-block;*/
    margin-left: 10px;
    text-align: center;
    /*cursor: pointer;*/
  }

  .hea-chunk .tier > span:nth-child(2),
  .table tbody tr td > p > span:nth-child(1) {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius: 50%;
    background: #58c9f3;
    color: #ffffff;
    cursor: pointer;
    font-size: 10px;
  }

  .hea-chunk .tier > span:nth-child(3),
  .table tbody tr td > p > span:nth-child(2) {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #bcbcbc;
    color: #ffffff;
    cursor: pointer;
  }

  /*弹窗主体样式开始*/
  .dialog-body {
    font-size: 14px;
    color: #555555;
    overflow: hidden;
  }

  .dialog-body .wcpop-tier {
    height: 28px;
    line-height: 28px;
  }

  .dialog-body .wcpop-tier .wcpop-label {
    display: inline-block;
    float: left;
  }

  .dialog-body .wcpop-tier ul {
    float: left;
    /*border: 1px solid #cccccc;*/
    margin-left: 46px;
  }

  .dialog-body .wcpop-tier ul li {
    float: left;
    text-align: center;
    line-height: 28px;
    padding: 0 16px;
    border-top: 1px solid #cccccc;
    border-left: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
    cursor: pointer;
  }

  .dialog-body .wcpop-tier ul li:hover,
  .dialog-body .wcpop-tier ul li.green-bg {
    background: #18d96e;
    border-top: 1px solid #18d96e;
    border-left: 1px solid #18d96e;
    border-bottom: 1px solid #18d96e;
    color: #ffffff;
  }

  .dialog-body .wcpop-tier ul li:last-child {
    border-right: 1px solid #cccccc;
  }

  /*弹窗表格*/
  .dialog-body .workpop-body {
    margin-top: 27px;
    overflow: hidden;
  }

  .workpop-body .table {
    width: 96%;
    margin-left: 4%;
  }

  table {
    width: 100%;
    border: 1px solid #cccccc;
  }

  .workpop-body .table thead tr {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #cccccc;
  }

  .table {
    margin-bottom: 0;
  }

  .table thead tr th.big {
    width: 15%;
  }

  .table tbody tr {
    border-bottom: 1px solid #cccccc;
  }

  .table thead tr th,
  .table tbody tr td {
    font-weight: normal;
    text-align: center;
    position: relative;
  }

  .sear-chunk {
    position: absolute;
    top: 15px;
    left: -38px;
  }

  .table tbody tr td > p {
    line-height: 20px;
  }

  /*==========工作内容编辑弹窗样式结束==========*/


</style>
