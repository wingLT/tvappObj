<template>
  <main-container class="main-container">
    <!--工作内容头部-->
    <div class="wc-head">
      <div class="wch-fl">
        <!--<span class="back-home">＜ 返回月</span>-->
        <router-link to="./Scheduling" class="back-home">＜ 返回月</router-link>
        <div class="time-selec">
          <input type="text" id="timeym"/>
          <img src="../../assets/rili.png"/>
        </div>
      </div>
      <div class="wch-fr">
        <ul>
          <li>
            <i class="gray-icon"></i>
            <span>未指派人员</span>
          </li>
          <li>
            <i class="red-icon"></i>
            <span>已逾期</span>
          </li>
          <li>
            <i class="orange-icon"></i>
            <span>核查中</span>
          </li>
          <li>
            <i class="blue-icon"></i>
            <span>复审中</span>
          </li>
          <li>
            <i class="green-icon"></i>
            <span>已完成</span>
          </li>
        </ul>
      </div>
    </div>
    <!--工作内容主体-->
    <div class="wc-content">
      <ul>
        <!--<li class="list-block" v-for="list in 8">-->
        <!--<li class="list-block">-->
        <li class="list-block" v-for="list in tempList">
          <div class="wc-tit">
            <h3>{{ list.tempTit }}</h3>
            <img src="../../assets/daochu.png"/>
          </div>
          <div class="wc-list">
            <ul>
              <!--<li class="blue-bg" v-for="temlist in list.temArr">-->
              <li :class="temlist.bgStyle" v-for="(temlist,index) in list.temArr">
                <span class="wc-txt">{{ temlist.tempName }}</span>
                <span class="wcbtn-group">
              <img src="../../assets/bianjiff.png" @click="workConEditPop(list,temlist)" class="wctxt-edit"/>
              <img src="../../assets/chakanff.png" class="wctxt-look"/>
              </span>
              </li>
              <!--<li class="orange-bg">-->
              <!--<span class="wc-txt">生产网数据库巡检</span>-->
              <!--<span class="wcbtn-group">-->
              <!--<img src="../../assets/bianjiff.png" @click="workConEditPop()" class="wctxt-edit"/>-->
              <!--<img src="../../assets/chakanff.png" class="wctxt-look"/>-->
              <!--</span>-->
              <!--</li>-->

              <!--<li class="green-bg">-->
              <!--<span class="wc-txt">检查数据库</span>-->
              <!--<span class="wcbtn-group">-->
              <!--<img src="../../assets/bianjiff.png" @click="workConEditPop()" class="wctxt-edit"/>-->
              <!--<img src="../../assets/chakanff.png" class="wctxt-look"/>-->
              <!--</span>-->
              <!--</li>-->
              <!--<li class="red-bg">-->
              <!--<span class="wc-txt">检查K盘</span>-->
              <!--<span class="wcbtn-group">-->
              <!--<img src="../../assets/bianjiff.png" @click="workConEditPop()" class="wctxt-edit"/>-->
              <!--<img src="../../assets/chakanff.png" class="wctxt-look"/>-->
              <!--</span>-->
              <!--</li>-->

              <!--<li class="gray-bg">-->
              <!--<span class="wc-txt">生产网数据库巡检</span>-->
              <!--<span class="wcbtn-group">-->
              <!--<img src="../../assets/bianjiff.png" @click="workConEditPop()" class="wctxt-edit"/>-->
              <!--<img src="../../assets/chakanff.png" class="wctxt-look"/>-->
              <!--</span>-->
              <!--</li>-->

            </ul>
          </div>
        </li>

      </ul>
    </div>
    <!--工作内容编辑弹窗-->
    <el-dialog :visible.sync="workConEditVisible" width="1130px" heigh="605px" style="overflow:hidden;">
      <!--头部-->
      <div slot="title" class="dialog-head">
        <div class="workcon-head">
          <div class="hea-chunk">
            <p>排班编号MB0001</p>
            <h3>{{ tempList.tempTit }}</h3>
          </div>
          <div class="hea-chunk">
            <el-checkbox v-model="checked" class="">是否指定人到任务</el-checkbox>
          </div>
          <div class="hea-chunk">
            <div class="tier" style="margin-bottom: 5px">
              <span>核查</span>
              <span>唐丽</span>
              <span class="add-user">+</span>
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
            <div class="tier">
              <span>复审</span>
              <span>唐丽</span>
              <span class="add-user">+</span>
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
                  <th class="">指定人</th>
                </tr>
                </thead>

                <tbody>
                <tr>
                  <td class="">
                    {{ tempName }}
                    <div class="sear-chunk">
                      <el-checkbox v-model="srachecked" class=""></el-checkbox>
                    </div>
                  </td>
                  <td class="big">
                    <p>检查数据库用到的S5600T上的LUN的绑定磁盘状态，心跳线状态是否正常；检查数据库K盘使用情况</p>
                  </td>
                  <td class="">10:30</td>
                  <td class="">11:00</td>
                  <td class="">每天</td>
                  <td class="">备注</td>
                  <td class="big">114.114.114.114</td>
                  <td class="normal">
                    <p>
                      <span class="pop-search">唐丽</span>
                      <span>+</span>
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
                    </p>
                  </td>
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
  import template from '../Packages/MainContainer.vue'
  import laydate from '../../../static/laydate/laydate'
  import "./workStatis.css"

  Vue.component(template.name, template);
  export default {
    name: "work-content",
    data() {
      return {
        workConEditVisible: false,
        checked: true,
        srachecked: true,
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

        tempList: [{
          tempTit: "六楼MDC监控机房",
          temArr: [{
            bgStyle: "green-bg",
            tempName: "检查数据库"
          }, {
            bgStyle: "red-bg",
            tempName: "检查K盘"
          }]
        }, {
          tempTit: "六楼编辑区",
          temArr: [{
            bgStyle: "green-bg",
            tempName: "检查网络"
          }, {
            bgStyle: "green-bg",
            tempName: "检查分配空间"
          }, {
            bgStyle: "blue-bg",
            tempName: "检查存储"
          }, {
            bgStyle: "green-bg",
            tempName: "检查数据库"
          }]
        }, {
          tempTit: "MPC调度岗",
          temArr: [{
            bgStyle: "green-bg",
            tempName: "检查数据库"
          }, {
            bgStyle: "red-bg",
            tempName: "检查存储"
          }, {
            bgStyle: "green-bg",
            tempName: "检查微服务"
          }, {
            bgStyle: "green-bg",
            tempName: "检查进程"
          },]
        }, {
          tempTit: "高清单机系统",
          temArr: [{
            bgStyle: "green-bg",
            tempName: "检查进程"
          }, {
            bgStyle: "green-bg",
            tempName: "检查数据库"
          }, {
            bgStyle: "blue-bg",
            tempName: "检查存储"
          }]
        },{
          tempTit: "三楼编辑区",
          temArr: [{
            bgStyle: "green-bg",
            tempName: "检查网络"
          }, {
            bgStyle: "green-bg",
            tempName: "检查分配空间"
          }, {
            bgStyle: "green-bg",
            tempName: "检查存储"
          }, {
            bgStyle: "green-bg",
            tempName: "检查数据库"
          }]
        },{
          tempTit: "八楼编辑区",
          temArr: [{
            bgStyle: "green-bg",
            tempName: "检查网络"
          }, {
            bgStyle: "green-bg",
            tempName: "检查分配空间"
          }, {
            bgStyle: "green-bg",
            tempName: "检查存储"
          }]
        },],
        tempName: "",
      }
    },
    mounted() {
      let router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      };
      GlobalVar.setHistoryRouter(router);
      // 时间插件1 timeyms1
      laydate.render({
        elem: '#timeym',
        format: 'yyyy年MM月',
        done: function (value, date) {
          $('#timeym input').val(value)
          // console.log(value)
        }

      });
    },
    methods: {
      popStatus: function () {
        $('.wcpop-tier ul li').click(function () {
          $(this).addClass('green-bg');
          $(this).siblings().removeClass('green-bg');
        })
      },
      // 工作内容编辑弹窗
      workConEditPop: function (data,temlist) {
        const self = this;
        // console.log(temlist);
        self.tempList.tempTit = data.tempTit;
        self.tempName = temlist.tempName;
        // console.log(temlist.tempName);
        self.workConEditVisible = true;
      },
      // 工作内容编辑弹窗隐藏
      workConEditHidePop: function () {
        const self = this;
        self.workConEditVisible = false;
      },
    }
  }
</script>

<style scoped>
  /*==========工作内容头部样式开始==========*/
  .wc-head {
    position: relative;
    overflow: hidden;
    height: 22px;
    line-height: 22px;
    font-size: 16px;
    color: #555555;
    margin: 15px 0 30px 0;
  }

  .wc-head .wch-fl {
    float: left;
  }

  .wc-head .wch-fl .back-home {
    text-decoration: none;
    color: #555555;
    cursor: pointer;
    float: left;
  }

  .wc-head .wch-fl .time-selec {
    float: left;
    width: 140px;
    margin-left: 40px;
    position: relative;
  }

  .wch-fl .time-selec > input {
    font-size: 20px;
    width: 100%;
    height: 22px;
    line-height: 22px;
    outline: none;
    border: none;
    background: transparent;
    vertical-align: text-top;
  }

  .wch-fl .time-selec > img {
    position: absolute;
    right: 0;
    top: 3px;
  }

  .wc-head .wch-fr {
    float: right;
  }

  .wc-head .wch-fr ul li {
    margin-left: 30px;
    height: 22px;
    line-height: 22px;
    float: left;
  }

  .wc-head .wch-fr ul li i {
    display: inline-block;
    width: 28px;
    height: 18px;
    border-radius: 2px;
    margin-right: 10px;
    vertical-align: text-top;
  }

  .wc-head .wch-fr ul li i.gray-icon {
    background: #bcbcbc;
  }

  .wc-head .wch-fr ul li i.red-icon {
    background: #ff6c60;
  }

  .wc-head .wch-fr ul li i.orange-icon {
    background: #fbb321;
  }

  .wc-head .wch-fr ul li i.blue-icon {
    background: #58c9f3;
  }

  .wc-head .wch-fr ul li i.green-icon {
    background: #18d96e;
  }

  /*==========工作内容头部样式结束==========*/
  /*==========工作内容主体样式开始==========*/
  /*.wc-content::-webkit-scrollbar{*/
  /*display: none;*/
  /*}*/
  .wc-content {
    /*overflow: hidden;*/
    width: 100%;
    height: 795px;
    overflow-y: hidden;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
  }

  .wc-content ul .list-block {
    display: inline-block;
    padding: 30px 14px;
    height: 795px;
    background: #ffffff;
    border-radius: 2px;
    margin-right: 20px;
    width: 322px;
    vertical-align: top;
  }

  .wc-content ul .list-block .wc-tit {
    text-align: center;
    overflow: hidden;
    margin-bottom: 20px;
  }

  .wc-content ul .list-block .wc-tit > h3 {
    display: inline-block;
    margin: 0;
    font-size: 16px;
    color: #555555;
    font-weight: bold;
  }

  .wc-content ul .list-block .wc-tit > img {
    float: right;
    cursor: pointer;
  }

  .list-block .wc-list {
  }

  .list-block .wc-list ul li {
    height: 46px;
    line-height: 46px;
    padding: 0 20px;
    border-radius: 5px;
    font-size: 14px;
    color: #ffffff;
    margin-bottom: 20px;
  }

  .list-block .wc-list ul li.blue-bg {
    background: #58c9f3;
  }

  .list-block .wc-list ul li.orange-bg {
    background: #fbb321;
  }

  .list-block .wc-list ul li.red-bg {
    background: #ff6c60;
  }

  .list-block .wc-list ul li.gray-bg {
    background: #bcbcbc;
  }

  .list-block .wc-list ul li.green-bg {
    background: #18d96e;
  }

  .wc-list ul li .wcbtn-group {
    float: right;
    cursor: pointer;
  }

  .wc-list ul li .wcbtn-group > img:last-child {
    margin-left: 20px;
  }

  /*==========工作内容主体样式结束==========*/
  /*==========工作内容编辑弹窗样式开始==========*/
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

  /*.workpop-body .table-body {*/
  /*!*overflow: hidden;*!*/
  /*}*/

  /*.workpop-body .table-body tr {*/
  /*height: 54px;*/
  /*line-height: 54px;*/
  /*border-left: 1px solid #cccccc;*/
  /*border-bottom: 1px solid #cccccc;*/
  /*border-right: 1px solid #cccccc;*/
  /*}*/

  /*.workpop-body .table-body tr td {*/
  /*text-align: center;*/
  /*position: relative;*/
  /*}*/

  /*.sear-chunk {*/
  /*position: absolute;*/
  /*top: 10px;*/
  /*left: -38px;*/
  /*}*/

  /*.workpop-body .table-body tr td > p {*/
  /*line-height: 20px;*/
  /*vertical-align: middle;*/
  /*}*/

  /*.workpop-body .table-body tr td.big {*/
  /*width: 15%;*/
  /*}*/

  /*==========工作内容编辑弹窗样式结束==========*/
</style>












