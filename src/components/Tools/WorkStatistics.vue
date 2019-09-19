<template>
  <main-container class="main-container">
    <!--工作统计头部-->
    <div class="work-head">
      <div class="wh-cont">
        <h3>工作统计</h3>
        <div class="search-group">
          <i></i>
          <span class="sear-lab">工作时间:</span>
          <div class="time-group">
            <el-input placeholder="年/月/日" id="timeyms1"></el-input>
            <img src="../../assets/rili.png"/>
          </div>
          <span class="sear-lab" style="margin-left: 10px;">或</span>
          <div class="time-group">
            <el-input placeholder="年/月/日" id="timeyms2"></el-input>
            <img src="../../assets/rili.png"/>
          </div>
        </div>
        <div class="search-group">
          <i></i>
          <span class="sear-lab">排班分类</span>
          <el-select v-model="value" placeholder="全部">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-group">
          <i></i>
          <span class="sear-lab">排班模板</span>
          <el-select v-model="tempName" placeholder="全部">
            <el-option
              v-for="item in chedulTemp"
              :key="item.value"
              :label="item.label"
              :value="item.tempName">

            </el-option>
          </el-select>
        </div>
        <div class="search-group">
          <i></i>
          <span class="sear-lab actor-box">参与者</span>
          <el-select v-model="actor" placeholder="全部">
            <div class="actor-serc"><input type="text" placeholder="查找人员"/></div>
            <el-option
              v-for="item in actors"
              :key="item.actor"
              :label="item.label"
              :value="item.actor">
                <ul class="actor-list">
                  <li>
                    <div class="actor-fl">
                      <span :class="item.label.length>=3?'orange-bg':'gray-bg'">{{ item.label }}</span>
                      <span>{{ item.label }}</span>
                    </div>
                    <div class="actor-fr"><img src="../../assets/grayduihao.png"/></div>
                  </li>
                </ul>
            </el-option>
          </el-select>
        </div>
        <span class="sech-btn">查询</span>
        <!--<router-link to="./WorkContent" class="sech-btn">查询</router-link>-->
      </div>
    </div>
    <!--工作统计主体-->
    <div class="work-box">
      <div class="work-cont">
        <div class="wc-fl">
          <ul>
            <li class="work-list">
              <div class="graybg list-block">
                <span>总共</span>
                <h2>356条</h2>
              </div>
            </li>
            <li class="work-list">
              <div class="greenbg list-block">
                <span>已完成</span>
                <h2>350条</h2>
                <i class="switch" style="cursor: pointer;" data-toggle="collapse" data-target="#demo">+</i>
              </div>
              <!--<i class="switch" style="cursor: pointer;">+</i>-->
              <ul id="demo" class="collapse in task-hide">
                <!--<ul class="task-hide">-->
                <li>按时完成320条</li>
                <li>逾期完成30条</li>
              </ul>
            </li>
            <li class="work-list">
              <div class="bluebg list-block">
                <span>进行中</span>
                <h2>4条</h2>
                <i class="switch" style="cursor: pointer;" data-toggle="collapse" data-target="#underway">+</i>
              </div>
              <ul id="underway" class="collapse in task-hide">
                <li>正常进行中20条</li>
                <li>核查中30条</li>
                <li>复审中30条</li>
              </ul>
            </li>
            <li class="work-list">
              <div class="redbg list-block">
                <span>已逾期</span>
                <h2>4条</h2>
              </div>
            </li>
          </ul>
        </div>
        <div class="wc-fr">
          <div class="workcon-body">
            <div class="table table-title">
              <table>
                <thead>
                <tr>
                  <th class="normal">任务名称</th>
                  <th class="normal">排班分类</th>
                  <th class="normal">排班模板</th>
                  <th class="big">工作内容</th>
                  <th class="min">开始时间</th>
                  <th class="min">结束时间</th>
                  <th class="min">参与者</th>
                  <th class="normal">任务状态</th>
                </tr>
                </thead>
              </table>
            </div>
            <div class="table table-body">
              <tr class="">
                <td class="normal">
                  <span>检查磁盘</span>
                </td>
                <td class="normal">
                  <p>六楼MDC监控机房</p>
                </td>
                <td class="normal">
                  <p>生产网络数据库巡检</p>
                </td>
                <td class="big">
                  <p>检查数据盘K盘使用情况检查数据盘K盘使用情况检查数据盘K盘使用情况数</p>
                </td>
                <td class="min">
                  <p>2017-12-20 15:20:30</p>
                </td>
                <td class="min">
                  <p>2017-12-20 18:20:00</p>
                </td>
                <td class="min">
                  <p>小明</p>
                </td>
                <td class="normal">
                  <p>
                    <span style="color: #18d96e;">已完成 /</span>
                    <span style="color: #18d96e;">按时完成</span>
                  </p>
                </td>
              </tr>
              <tr class="">
                <td class="normal">
                  <span>检查K盘磁盘</span>
                </td>
                <td class="normal">
                  <p>三楼监控机房</p>
                </td>
                <td class="normal">
                  <p>A班</p>
                </td>
                <td class="big">
                  <p>检查数据盘K盘使用情况</p>
                </td>
                <td class="min">
                  <p>2017-12-20 15:20:30</p>
                </td>
                <td class="min">
                  <p>2017-12-20 18:20:00</p>
                </td>
                <td class="min">
                  <p>安茜</p>
                </td>
                <td class="normal">
                  <p>
                    <span style="color: #18d96e;">已完成 /</span>
                    <span style="color: #ff6c60;">逾期完成</span>
                  </p>
                </td>
              </tr>
              <tr class="">
                <td class="normal">
                  <span>检查磁盘</span>
                </td>
                <td class="normal">
                  <p>八楼编辑区</p>
                </td>
                <td class="normal">
                  <p>B班</p>
                </td>
                <td class="big">
                  <p>检查数据库用到的S5600T上的LUN的绑定磁盘状态、心跳线转态是否正常;</p>
                </td>
                <td class="min">
                  <p>2017-12-20 15:20:30</p>
                </td>
                <td class="min">
                  <p>2017-12-20 18:20:00</p>
                </td>
                <td class="min">
                  <p>方芳</p>
                </td>
                <td class="normal">
                  <p>
                    <span style="color: #57c9f2;">正常进行中</span>
                  </p>
                </td>
              </tr>
              <tr class="">
                <td class="normal">
                  <span>日志检查</span>
                </td>
                <td class="normal">
                  <p>五楼高清单机系统</p>
                </td>
                <td class="normal">
                  <p>C班</p>
                </td>
                <td class="big">
                  <p>日志检查五楼高清单机系统</p>
                </td>
                <td class="min">
                  <p>2017-12-20 15:20:30</p>
                </td>
                <td class="min">
                  <p>2017-12-20 18:20:00</p>
                </td>
                <td class="min">
                  <p>蔡小明</p>
                </td>
                <td class="normal">
                  <p>
                    <span style="color: #fbb321;">进行中 /</span>
                    <span style="color: #fbb321;">核查中</span>
                  </p>
                </td>
              </tr>
              <tr class="">
                <td class="normal">
                  <span>检查K盘磁盘</span>
                </td>
                <td class="normal">
                  <p>MPC调度岗</p>
                </td>
                <td class="normal">
                  <p>生产网络数据库巡检</p>
                </td>
                <td class="big">
                  <p>检查数据盘K盘使用情况</p>
                </td>
                <td class="min">
                  <p>2017-12-20 15:20:30</p>
                </td>
                <td class="min">
                  <p>2017-12-20 18:20:00</p>
                </td>
                <td class="min">
                  <p>张红</p>
                </td>
                <td class="normal">
                  <p>
                    <span style="color: #c10f00;">已逾期</span>
                  </p>
                </td>
              </tr>
              <tr class="">
                <td class="normal">
                  <span>检查磁盘</span>
                </td>
                <td class="normal">
                  <p>六楼MDC监控机房</p>
                </td>
                <td class="normal">
                  <p>生产网络数据库巡检</p>
                </td>
                <td class="big">
                  <p>检查数据盘K盘使用情况</p>
                </td>
                <td class="min">
                  <p>2017-12-20 15:20:30</p>
                </td>
                <td class="min">
                  <p>2017-12-20 18:20:00</p>
                </td>
                <td class="min">
                  <p>小明</p>
                </td>
                <td class="normal">
                  <p>
                    <span style="color: #555555;">已完成 /</span>
                    <span style="color: #555555;">按时完成</span>
                  </p>
                </td>
              </tr>
            </div>
            <!--翻页部分-->
            <div class="page-box">
              <div class="page clear">
                <div class="cut-page-number fl">
                  <div>每页条数</div>
                  <div class="select-down dropdown">
                    <div>
                      <input v-model="pageSize"/>
                      <span class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down"></i></span>
                      <ul class="page-number down-content dropdown-menu">
                        <li @click="selectPageNumber(10)">10</li>
                        <li @click="selectPageNumber(15)">15</li>
                      </ul>
                    </div>

                  </div>
                  <div>总条数 {{total}}，共 {{totalPages}} 页</div>
                </div>

                <div class="page-number fr">
                  <div class="page-turning" id="paging"></div>
                  <div class="go-page">
            <span>
              <input type="number" v-model="gotoPage"/>
            </span>
                    <span @click="gotoPageClick()">GO</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main-container>
</template>

<script>
  import Vue from 'vue'
  import {GlobalVar} from "../../../static/js/utils";
  import MainContainer from "../Packages/MainContainer";
  import {PublicMap} from "../../../static/js/PublicMap";
  import template from '../Packages/MainContainer.vue'
  import Swiper from '../../../static/js/swiper'
  import laydate from '../../../static/laydate/laydate'
  import './ToolPub.css'
  // import './WorkStatis.css'

  export default {
    name: "work-statistics",
    data() {
      return {
        gotoPage: 10,
        pageNum: 1,//当前页码
        pageSize: 10,//每页显示的条数
        total: 6,//总条数
        totalPages: 1,//总页数
        options: [{//排班分类
          value: '选项1',
          label: '全部'
        }, {
          value: '选项2',
          label: '三楼编辑区'
        }, {
          value: '选项3',
          label: '八楼编辑区'
        }, {
          value: '选项4',
          label: 'MPC调度岗'
        }, {
          value: '选项5',
          label: '五楼高清单机系统'
        }],
        value: '',
        chedulTemp: [{//排班模板
          tempName: '选项1',
          label: '全部'
        }, {
          tempName: '选项2',
          label: '生产网络数据库巡检'
        }, {
          tempName: '选项3',
          label: 'A班'
        }, {
          tempName: '选项4',
          label: 'B班'
        }, {
          tempName: '选项5',
          label: 'C班'
        }],
        tempName: '',
        actors: [{//参与者
          actor: '选项1',
          label: '所有成员'
        }, {
          actor: '选项2',
          label: '安茜'
        }, {
          actor: '选项3',
          label: '蔡小明'
        }, {
          actor: '选项4',
          label: '方芳'
        }, {
          actor: '选项5',
          label: '张红'
        }],
        actor: '',
      }
    },
    mounted() {
      let router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      };
      GlobalVar.setHistoryRouter(router);
      $('.collapse').collapse()
      // 分页
      pageNumber(1, 1, this)
      // 时间插件1 timeyms1
      laydate.render({
        elem: '#timeyms1',
        format: 'yyyy年MM月dd日'

      });
      laydate.render({
        elem: '#timeyms2',
        format: 'yyyy年MM月dd日'

      });

    },
    methods: {
      // 翻页
      selectPageNumber: function (falg) {
        let self = this;
        self.pageNum = 1;
        self.pageSize = falg;
        // getAllData(self,this.selectUrl);
      },
    }
  }

  function pageNumber(pageCount, current, self) {
    $("#paging").CreatePage({
      pageCount: pageCount,//总页数
      current: current,//当前页码
      backFn: function (page) {
        self.pageNum = page;
        //page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
        // getAllData(self, self.selectUrl);
      }
    });
  }
</script>

<style scoped>
  /*============工作统计头部样式开始===========*/
  .work-head {
    color: #555555;
    background: #ffffff;
    padding: 30px;
    border-radius: 2px;
    margin-bottom: 20px;
  }

  .work-head .wh-cont {
    height: 36px;
    line-height: 36px;
    color: #555555;
    font-size: 16px;
  }

  .work-head .wh-cont h3 {
    margin: 0;
    float: left;
    font-weight: bold;
    font-size: 18px;
    line-height: 36px;
  }

  .work-head .wh-cont .search-group {
    margin-left: 30px;
    float: left;
    height: 36px;
    line-height: 36px;
  }

  .wh-cont .search-group > i {
    display: inline-block;
    margin-top: 10px;
    float: left;
    width: 10px;
    height: 16px;
    border-radius: 2px;
    background: #18d96e;
    vertical-align: middle;
    margin-right: 10px;
  }

  .wh-cont .search-group .sear-lab {
    display: inline-block;
    float: left;
    margin-right: 18px;
  }

  .wh-cont .search-group .time-group {
    float: left;
    position: relative;
  }

  .wh-cont .search-group .time-group > img {
    position: absolute;
    top: 8px;
    right: 8px;
  }
/*!*=============参与者样式开始==========*!*/
  /*.search-group .actor-box {*/
  /*}*/

  /*.search-group .actor-con {*/

  /*}*/

  /*.search-group .actor-con .actor-serc {*/
    /*padding: 10px;*/
    /*display: inline-block;*/
    /*height: 24px !important;*/
    /*line-height: 24px !important;*/
    /*border: 1px solid #cccccc;*/
  /*}*/
  /*.actor-con .actor-serc > input {*/
    /*border: none;*/
    /*outline: none;*/
  /*}*/

  /*.search-group .actor-con .actor-list {*/

  /*}*/
  /*.search-group .actor-con .actor-list li{*/
    /*overflow: hidden;*/
    /*height: 35px;*/
    /*line-height: 35px;*/
  /*}*/
  /*.search-group .actor-con .actor-list li:hover{*/
    /*background: #f5f5f5;*/
  /*}*/
  /*.actor-list li .actor-fl{*/
    /*float: left;*/
  /*}*/
  /*.actor-list li .actor-fr{*/
    /*float: right;*/
  /*}*/



  /*!*=============参与者样式结束==========*!*/
  .work-head .wh-cont .sech-btn {
    float: right;
    width: 120px;
    height: 36px;
    background: #57c9f2;
    color: #ffffff;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
  }

  /*============工作统计头部样式结束===========*/

  /*============工作统计主体样式开始===========*/

  .work-box {
    clear: both;
  }

  .work-box .work-cont {
    overflow: hidden;
    position: relative;
  }

  /*============工作统计左边样式开始===========*/
  .work-box .work-cont .wc-fl {
    float: left;
    padding: 30px;
    background: #ffffff;
    border-radius: 2px;
  }

  .work-box .work-cont .wc-fl ul .work-list {
    margin-bottom: 20px;
    text-align: center;
    color: #FFFFFF;
  }

  .wc-fl ul .work-list .list-block {
    width: 170px;
    height: 100px;
    border-radius: 2px;
  }

  .work-cont .wc-fl ul .work-list .task-hide li {
    height: 40px;
    line-height: 40px;
    background: #e6e6e6;
    color: #555555;
    margin-bottom: 1px;
    border-radius: 2px;
  }

  .work-cont .wc-fl .graybg {
    background: #bcbcbc;
  }

  .work-cont .wc-fl .greenbg {
    background: #18d96e;
  }

  .work-cont .wc-fl .bluebg {
    background: #57c9f2;
  }

  .work-cont .wc-fl .redbg {
    background: #ff6c60;
  }

  .wc-fl ul .work-list .list-block > span {
    display: inline-block;
    margin-top: 24px;
    font-size: 18px;
    line-height: 18px;
  }

  .wc-fl ul .work-list .list-block > h2 {
    font-size: 26px;
    color: #ffffff;
    margin: 0;
  }

  /*============工作统计左边样式结束===========*/
  /*============工作统计右边样式开始===========*/
  .work-box .work-cont .wc-fr {
    float: right;
    width: 84.5%;
    color: #555555;
  }

  .work-cont .wc-fr .workcon-body {
    padding: 30px;
    background: #ffffff;
    border-radius: 2px;
  }

  table {
    width: 100%;
  }

  .table {
    margin-bottom: 0;
  }

  .table-title tr {
    height: 66px;
    background-color: #e9e9e9;
  }

  .table-title tr th {
    text-align: center;
    font-size: 18px;
    font-weight: normal;
  }

  .table-title tr th.normal {
    width: 10%;
  }

  .table-title tr th.big {
    width: 15%;
  }

  .table-title tr th.min {
    width: 7%;
  }

  .table-body {
    height: 630px;
    outline: none;
    overflow: auto;
    border-collapse: collapse;
  }

  .table-body tr {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e4e4e4;
    transition: .3s;
  }

  .table-body tr td.normal {
    width: 10%;
  }

  .table-body tr td.big {
    width: 15%;
  }

  .table-body tr td.min {
    width: 7%;
  }

  .table-body tr td {
    height: 100%;
    width: 100%;
    text-align: center;
    font-size: 14px;
    font-weight: normal;
  }

  .table-body tr td > p {
    display: inline-block;
    vertical-align: middle;
    line-height: 20px;
    width: 100%;
    margin-bottom: 0;
    padding: 0;
    transition: .3s;
  }

  .table-body tr td > span {
    display: inline-block;
    height: 60px;
    line-height: 60px;
    width: 100%;
    /*transition: .3s;*/
  }

  .table-body tr td p span {
    cursor: pointer;
  }

  .table-body tr:first-child td > span {
    border-left: 4px solid transparent;
  }

  .table-body tr:hover {
    background: #f5f5f5;
  }

  .table-body tr:hover td:first-child > span {
    border-left: 4px solid #18d96e;
  }

  /*============工作统计右边样式结束===========*/
  .page-box {
    width: 100%;
    position: relative;
    margin: 30px 0 30px 0;
  }

  .page div.cut-page-number > div.select-down > div {
    width: 44px;
    height: 28px;

  }

  .page div.cut-page-number > div.select-down input {
    width: 17px;
    height: 28px;
    padding-left: 1px;
  }

  div.select-down ul.down-content {
    top: 30px;
  }

  /*============工作统计主体样式结束===========*/
</style>






