<template>
  <main-container class="main-container">
    <!--跳转头-->
    <div class="skip-header">
      <div class="head-fr">
        <router-link to="./Scheduling">排班管理</router-link>
        /
        <router-link to="" class="green-font">排班模板</router-link>
        <!--<span class="green-font">排班管理</span> /-->
        <!--<span>排班模板</span>-->
      </div>
    </div>
    <!--排班模板主体部分-->
    <div class="chedu-temp">
      <!--排班模板头部部分-->
      <div class="temp-head">
        <div class="th-fl">
          <i></i>
          <span>排班分类</span>
        </div>
        <div class="th-fr">
          <ul data-v-490a7436="" data-v-599c6989="">
            <li><a href="javascript:;">应用</a></li>
            <li><a href="javascript:;" @click="reportExcel()">一键导出</a></li>
            <li>
              <router-link to="./HistorySchedulingTemplate">历史排班</router-link>
              <!--<a href="javascript:;">历史排班</a>-->
            </li>
          </ul>
        </div>
      </div>
      <!--排班模板中心部分-->
      <div class="temp-content">
        <!--排班模板左边部分-->
        <div class="temcon-fl">
          <ul>
            <!--<li class="clas-active" @click="chedulClick(list,index)" v-for="list in boxFlarr">六楼MDC监控机房</li>-->
            <li :class="index == 0?'clas-active':''" @click="chedulClick(list,index)" v-for="(list,index) in boxFlarr">{{ list }}</li>
            <!--<li>六楼编辑区</li>-->
            <!--<li>MPC调度岗</li>-->
            <!--<li>五楼5-1、高清单机系统</li>-->
            <!--<li>三楼编辑区</li>-->
            <!--<li>八楼编辑区</li>-->
            <!--<li>四楼媒咨主干收录系统</li>-->
            <!--<li>新媒体</li>-->
          </ul>
        </div>
        <!--排班模板右边部分-->
        <div class="temcon-fr">
          <div class="row">
            <div class="col-md-4 list-block" v-for="(titName,listIndex) in blockTitName">
              <div :class="['hea-list'+ listIndex]" style="height: 100%;border-radius: 2px;">
                <div style="border: 1px solid #e1e1e1;height: 100%;border-radius: 2px;">
                  <div class="col-md-12 tc-head">
                    <div class="tchea-fl">
                      <i></i>
                      <!--<span>生产网络数据库巡检</span>-->
                      <span>{{ titName }}</span>
                    </div>
                    <div class="tchea-fr">
                      <ul class="hea-staulist">
                        <li @click="addOrEditPop(1,titName)">编辑</li>
                        <li @click="heaEnableClick($event,listIndex)">启用中</li>
                        <li>删除</li>
                      </ul>
                    </div>
                  </div>
                  <div class="col-md-12 tc-body">
                    <ul :class="['status-list'+listIndex]">
                      <li v-for="(list,index) in conArrList">
                        <div class="search-fl">
                          <span class="search-txt">{{ list }}</span>
                          <i>|</i>
                          <span class="search-txt">10:30-11:00</span>
                          <i>|</i>
                          <span class="search-txt">每天</span>
                          <span class="search-txt">每天</span>
                        </div>
                        <div class="search-fr">
                          <span class="" @click="statusCut($event,index,listIndex)">启用中</span>
                          <span class="" @click="deleleTemp1(index,listIndex)">删除</span>
                        </div>

                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!--添加分类按钮-->
            <div class="col-md-4 list-block">
              <div style="border: 1px solid #e1e1e1;height: 100%;border-radius: 2px;">
                <div class="con-last" @click="addOrEditPop(0)"><span>+</span> <span>添加任务分类</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--表格内容-->
    <table class="table table-bordered" id="chedulingList" style="display: none;">
      <tr>
        <th>名称</th>
        <th>工作内容</th>
        <th>开始时间</th>
        <th>结束时间</th>
        <th>评率</th>
        <th>汇报方式</th>
        <th>设备IP</th>
      </tr>
      <tr v-for="list in 4">
        <td>检查数据盘K盘</td>
        <td>检查数据库用到的S5600T上的LUN的绑定磁盘状态，心跳线状态是否正常；检查数据库K盘使用情况</td>
        <td>10:30</td>
        <td>11:30</td>
        <td>每天</td>
        <td></td>
        <td>114.114.114.144</td>
      </tr>
    </table>
    <!--添加任务分类弹窗-->
    <el-dialog :visible.sync="taskClassVisible" width="1130px" heigh="605px" style="overflow:hidden;">
      <!--头部-->
      <div slot="title" class="dialog-head">
        <div class="checkbox-group">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="开启检查"></el-checkbox>
            <el-checkbox label="开启复查"></el-checkbox>
            <el-checkbox label="多点任务"></el-checkbox>
          </el-checkbox-group>
          <i class="tack-icon"></i>
        </div>
        <div class="time-group" @click="timePop">
          <i></i>
          <span>时间段</span>
        </div>
        <div class="time-pop" v-show="timeVisible">
          <div class="timegroun-head">
            <i></i>
            <span>新增时间段</span>
            <i class="dele-btn" @click="timePopHide()">x</i>
          </div>
          <div class="timegroun-content">
            <div class="add-time">
              <span>+</span>
            </div>
            <div class="time-list">
              <ul>
                <li>
                  <div class="timlis-head">
                    <div class="th-fl">时间段1</div>
                    <div class="th-fr">
                      <span class="bluefont">编辑</span>
                      <span class="redfont">删除</span>
                    </div>
                  </div>
                  <div class="timlis-cond">
                    <div class="tc-fl">
                      <span>开始时间</span>
                      <span class="tm-blk">13:00</span>
                    </div>
                    <div class="tc-fr">
                      <span>结束时间</span>
                      <span class="tm-blk">13:00</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="timlis-head">
                    <div class="th-fl">时间段2</div>
                    <div class="th-fr">
                      <span class="greenfont">保存</span>
                      <span class="grayfont">取消</span>
                    </div>
                  </div>
                  <div class="timlis-cond">
                    <div class="tc-fl">
                      <span>开始时间</span>
                      <span class="tm-blk">13:00</span>
                    </div>
                    <div class="tc-fr">
                      <span>结束时间</span>
                      <span class="tm-blk">13:00</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!--主体-->
      <div class="dialog-body">
        <div class="tier-rank">
          <div class="tierank-tit">
            <i></i>
            <span class="tit-name">模板名称</span>
            <el-checkbox v-model="tempName" class="" style="margin-left: 10px;"></el-checkbox>

            <span class="deltem-btn" v-show="popAddHide">删除模板</span>
          </div>
          <div class="tierank-search">
            <input type="text" placeholder="" v-model="TitName"/>
          </div>
        </div>
        <div class="tier-rank">
          <div class="tierank-tit">
            <i></i>
            <span class="tit-name">工作安排</span>
          </div>
          <div id="tableContent" class="table-content"
               style="outline: none;padding-top: 30px;height: 250px;overflow: auto;">
            <!-- 表格内容 -->
            <table id="workTable" class="work-table" border="1" style="table-layout:fixed;">
              <thead>
              <tr>
                <th class="comm-width tab-top" v-for="(list,index) in tabTheadArr">
                  <input type="text" maxlength="15" :value="list" readonly="readonly"/>
                  <!--<input type="text" maxlength="15"/>-->
                  <div>
                    <i class="add" v-if="index==(tabTheadArr[0].length + 4)" @click="addCol()"></i>
                    <i class="reduce" v-if="index>6" @click="reduceCol(index)"></i>
                  </div>
                </th>
                <td class="tab-right" style="width: 115px">
                  <i class="add" @click="addRow()">+</i>
                </td>

                <!--<th class="comm-width" >-->
                <!--<input type="text" maxlength="15" :value="list" readonly="readonly"/>-->

                <!--</th>-->
                <!--<th class="comm-width">-->
                <!--<input type="text" maxlength="15" value="名称" readonly="readonly"/>-->

                <!--</th>-->
                <!--<th class="comm-width">-->
                <!--<input type="text" maxlength="15" value="工作内容" readonly="readonly"/>-->
                <!--</th>-->
                <!--<th class="comm-width">-->
                <!--<input type="text" maxlength="15" value="开始时间" readonly="readonly"/>-->
                <!--</th>-->
                <!--<th class="comm-width">-->
                <!--<input type="text" maxlength="15" value="结束时间" readonly="readonly"/>-->
                <!--</th>-->
                <!--<th class="comm-width">-->
                <!--<input type="text" maxlength="15" value="频率" readonly="readonly"/>-->
                <!--</th>-->
                <!--<th class="comm-width">-->
                <!--<input type="text" maxlength="15" value="汇报方式" readonly="readonly"/>-->
                <!--</th>-->
                <!--<th class="comm-width tab-top">-->
                <!--<input type="text" maxlength="15" value="设备IP" readonly="readonly"/>-->
                <!--&lt;!&ndash;<input type="text" maxlength="15"/>&ndash;&gt;-->
                <!--<div>-->
                <!--<i class="add" @click="addCol()"></i>-->
                <!--<i class="reduce" @click="reduceCol(index)"></i>-->
                <!--</div>-->
                <!--</th>-->

              </tr>
              </thead>
              <tbody style="height: 200px;overflow: hidden;">
              <tr v-show="popAddHide" v-for="(list,index) in tabTrArr">
                <!--<tr v-show="popAddHide">-->
                <td class="comm-width">
                  <input maxlength="15" class="time-class required-input"
                         readonly="readonly" value="检查磁盘"/>
                  <el-checkbox v-model="checked" class=""></el-checkbox>
                </td>
                <td class="comm-width">
                  <p>检查数据库用到的S5600T上的LUN的绑定磁盘状态，心跳线状态是否正常；检查数据库K盘使用情况</p>
                </td>
                <td class="comm-width" id="startTime">
                  <input maxlength="15" class="time-class required-input"
                         readonly="readonly" value="10:30"/>
                  <img src="../../assets/shijianduan_01.png"/>
                </td>
                <td class="comm-width">
                  <input maxlength="15" class="time-class required-input"
                         readonly="readonly" value="11:30" id="endTime"/>
                  <img src="../../assets/shijianduan_01.png"/>
                </td>
                <td class="comm-width">
                  <input maxlength="15" class="time-class required-input"
                         readonly="readonly" value="每天"/>
                  <img src="../../assets/pinlv.png"/>
                </td>
                <td class="comm-width">
                  <el-select v-model="value" placeholder="备注" style="height: 30px;">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </td>
                <td class="comm-width">
                  <input maxlength="15" class="time-class required-input"
                         readonly="readonly" value="114.114.114.144"/>
                </td>

                <td v-for="(item,itemIndex) in list" style="color: #000" v-if="itemIndex>6">{{item}}</td>

                <td class="tab-right" style="position: relative;width: 115px">
                  <i class="add" @click="addRow()"></i>
                  <i class="reduce" @click="reduceRow(index)"></i>
                  <i class="cloud" @click="unloadingPop(index)"></i>
                  <div class="unload-box" :class="['unloadPopclass'+index]" v-show="unloadingVisible">
                    <div class="unload-head">
                      <i></i>
                      <span>移动该任务到</span>
                    </div>
                    <div class="unload-content">
                      <ul>
                        <li class="tem-actv">模板1</li>
                        <li>模板2</li>
                        <li>模板3</li>
                      </ul>
                    </div>
                    <div class="unload-footer">
                      <el-button
                        style="width: 70px;height:30px;background-color: #ff6c60;border-radius: 0;
                  border-color: rgba(0,0,0,0); font-size: 14px;text-align: center;"
                        type="primary" size="small">保 存
                      </el-button>
                      <el-button style="border-radius: 0;width: 70px;height:30px;font-size: 14px;
                  text-align: center;" @click="unloadPopHide(index)" type="info" size="small">关 闭
                      </el-button>
                    </div>
                  </div>
                </td>

              </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!--底部-->
      <div slot="footer" class="dialog-footer">
        <el-button
          style="width: 120px;background-color: #ff6c60;border-radius: 0;border-color: rgba(0,0,0,0);font-size: 16px;"
          type="primary" size="small">保 存
        </el-button>
        <el-button style="border-radius: 0;width: 120px;font-size: 16px;" @click="hidePop()" type="info" size="small">关
          闭
        </el-button>
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
  import './ToolPub.css'
  import laydate from '../../../static/laydate/laydate'

  function clickChedulClass() {
    $('.temcon-fl ul li').click(function () {
      $(this).addClass('clas-active');
      $(this).siblings().removeClass('clas-active');
    });
  };
  $(function () {// 初始化内容

  });

  Vue.component(template.name, template);
  export default {
    name: "scheduling-template",
    data() {
      return {
        taskClassVisible: false,
        unloadingVisible: false,
        timeVisible: false,
        popAddHide: true,
        // arrlist: ["启用中", "启用中", "启用中", "启用中"],
        boxFlarr: ["六楼MDC监控机房","六楼编辑区","MPC调度岗","五楼5-1、高清单机系统","三楼编辑区","八楼编辑区","四楼媒咨主干收录系统","新媒体"],
        blockTitName: ["六楼MDC监控机房","六楼MDC监控机房"],
        TitName: "六楼MDC监控机房",
        conArrList: ['检查数据K盘...', '日志检查...'],
        flag: 0,
        arr: [1, 2, 3, 4],
        HeaEnable: "启用中",
        state: "启用中",
        checkList: ['开启检查', '开启复查', '多点任务'],
        checked: true,
        tempName: true,
        options: [{
          value: '选项1',
          label: '全部'
        }, {
          value: '选项2',
          label: '自定义1'
        }],
        value: '',

        tabTheadArr: ["名称", "工作内容", "开始时间", "结束时间", "频率", "汇报方式", "设备IP"],
        tabTrArr: [[1, 2, 3, 4, 5, 6, 7]],

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
      self.$nextTick(function () {
        // 开始时间
        laydate.render({
          elem: '#startTime',
          type: 'time',
          change: function (value, date) {
          },
          done: function (value, date) {
            // console.log(value)
          }
        });

        laydate.render({
          elem: '#endTime',
          type: 'time',
          change: function (value, date) {
          },
          done: function (value, date) {
            // console.log(value)
          }
        });

      });

      clickChedulClass();

    },
    methods: {
      // 导出表格
      reportExcel: function () {
        method5(chedulingList);
      },
      //左边点击切换右边内容
      chedulClick: function (list,index) {
        switch (index) {
          case 0:
            this.blockTitName = ["六楼MDC监控机房","六楼MDC监控机房"];
            this.conArrList = ['检查数据K盘', '日志检查'];
            break;
          case 1:
            this.blockTitName = ["六楼编辑区","六楼编辑区"];
            this.conArrList = ['日志检查', '检查数据K盘'];
            break;
          case 2:
            this.blockTitName = ["MPC调度岗","MPC调度岗"];
            this.conArrList = ['检查数据K盘', '日志检查'];
            break;
          case 3:
            this.blockTitName = ["五楼5-1、高清单机系统","五楼5-1、高清单机系统"];
            this.conArrList = ['日志检查', '检查数据K盘'];
            break;
          case 4:
            this.blockTitName = ["三楼编辑区","三楼编辑区"];
            this.conArrList = ['检查数据K盘', '日志检查'];
            break;
          case 5:
            this.blockTitName = ["八楼编辑区","八楼编辑区"];
            this.conArrList = ['日志检查', '检查数据K盘'];
            break;
          case 6:
            this.blockTitName = ["四楼媒咨主干收录系统","四楼媒咨主干收录系统"];
            this.conArrList = ['检查数据K盘', '日志检查'];
            break;
          case 7:
            this.blockTitName = ["新媒体","新媒体"];
            this.conArrList = ['日志检查', '检查数据K盘'];
            break;
        }
      },
      // 卡片头状态切换
      heaEnableClick: function (e, listIndex) {
        var ss = $('.hea-list' + listIndex + ' ul.hea-staulist li:nth-child(2)').text();
        // console.log(ss)
        if (ss == '停用') {
          $('.hea-list' + listIndex + ' ul.hea-staulist  li:nth-child(2)').text('启用中');
        } else {
          $('.hea-list' + listIndex + ' ul.hea-staulist  li:nth-child(2)').text('停用');
        }
      },

      //添加行
      addRow: function () {
        const self = this;
        var arr = [];

        for(var i = 0;i<self.tabTheadArr.length;i++){
          arr.push('');
        }

        self.tabTrArr.push(arr);
      },
      //删除行
      reduceRow: function (index) {
        const self = this;
        self.tabTrArr.splice(index, 1)
      },

      //添加列
      addCol: function () {
        const self = this;

        self.tabTheadArr.push("标题")
        for (var i = 0; i < self.tabTrArr.length; i++) {
          self.tabTrArr[i].push('');
        }
      },
      //删除列
      reduceCol: function (index) {
        const self = this;
        self.tabTheadArr.splice(index, 1)
        for (var i = 0; i < self.tabTrArr.length; i++) {
          self.tabTrArr[i].splice(index, 1)
        }
      },

      // 删除
      deleleTemp1: function (index, listIndex) {
        // console.log(listIndex);
        $('.status-list' + listIndex + ' li:nth-child(' + (index + 1) + ')').remove();
      },
      deleleTemp2: function (index) {
        this.arr.splice(index, 1);
      },
      // 启用 停用状态切换
      statusCut: function (e, index, listIndex) {
        // console.log($('.status-list li:nth-child('+(index+1)+')').length);
        var ss = $('.status-list' + listIndex + ' li:nth-child(' + (index + 1) + ')').find('div.search-fr>span:first-child').text();
        if (ss == '停用') {
          $('.status-list' + listIndex + ' li:nth-child(' + (index + 1) + ')').find('div.search-fr>span:first-child').text('启用中');
        } else {
          $('.status-list' + listIndex + ' li:nth-child(' + (index + 1) + ')').find('div.search-fr>span:first-child').text('停用');
        }
      },
      //新增和编辑弹框的显示
      addOrEditPop: function (flag,titName) {
        const self = this;
        if (flag == 0) {//新增
          self.taskClassVisible = true;
          self.tabTheadArr = ["名称", "工作内容", "开始时间", "结束时间", "频率", "汇报方式", "设备IP"];
          self.tabTrArr = [];
          // self.popAddHide = false;
        } else {//编辑
          self.TitName = titName;
          self.taskClassVisible = true;
          self.tabTrArr = [[1, 2, 3, 4, 5, 6, 7]];
          // self.popAddHide = true;
        }
      },

      //转存弹窗
      unloadingPop: function (index) {
       $('.unloadPopclass' + index).toggle();
        // const self = this;
        // self.unloadingVisible = true;
      },
      //时间弹窗
      timePop: function () {
        const self = this;
        self.timeVisible = true;
      },
      // 任务弹窗的隐藏
      hidePop: function () {
        const self = this;
        self.taskClassVisible = false;
      },
      //转存弹窗
      unloadPopHide: function (index) {
        const self = this;
        $('.unloadPopclass' + index).hide();
        // self.unloadingVisible = false;
      },
      //时间弹窗隐藏
      timePopHide: function () {
        const self = this;
        self.timeVisible = false;
      },


    }
  }

  /*================排班管理-导出Excel===============*/
  /*------------------------------------------------------------------------------------- 导出Excel */
  var idTmr;

  function getExplorer() {
    var explorer = window.navigator.userAgent;
    //ie
    if (explorer.indexOf("MSIE") >= 0) {
      return 'ie';
    }
    //firefox
    else if (explorer.indexOf("Firefox") >= 0) {
      return 'Firefox';
    }
    //Chrome
    else if (explorer.indexOf("Chrome") >= 0) {
      return 'Chrome';
    }
    //Opera
    else if (explorer.indexOf("Opera") >= 0) {
      return 'Opera';
    }
    //Safari
    else if (explorer.indexOf("Safari") >= 0) {
      return 'Safari';
    }
  }

  function method5(tableid) {
    if (getExplorer() == 'ie') {
      var curTbl = document.getElementById(tableid);
      var oXL = new ActiveXObject("Excel.Application");
      //创建AX对象Excel
      var oWB = oXL.Workbooks.Add();
      //获取workBook对象
      var xlsheet = oWB.Worksheets(1);
      //激活当前的sheet
      var sel = document.body.createTextRange();
      sel.moveToElementText(curTbl);
      //把表格中的内容移动到textRange
      sel.select();
      //全选textRang中的内容
      sel.execCommand("Copy");
      //辅助TextRang中的内容
      xlsheet.Paste();
      //粘贴到活动的Excel中
      oXL.Visible = true;
      //设置Excel可见属性
      try {
        var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
      } catch (e) {
        print("Nested catch caught " + e);
      } finally {
        oWB.SaveAs(fname);
        oWB.Close(savechanges = false);
        oXL.Quit();
        oXL = null;
        //结束Excel进程，退出完成
        idTmr = window.setInterval("Cleanup();", 1);
      }
    }
    else {
      tableToExcel(tableid)
    }
  }

  function Cleanup() {
    window.clearInterval(idTmr);
    CollectGarbage();
  }

  var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,',
      template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',
      base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)))
      },
      format = function (s, c) {
        return s.replace(/{(\w+)}/g,
          function (m, p) {
            return c[p];
          })
      }
    return function (table, name) {
      if (!table.nodeType) table = document.getElementById(table)
      var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
      window.location.href = uri + base64(format(template, ctx))
    }
  })()
  /*------------------------------------------------------------------------------------- 导出Excel  end*/

</script>

<style scoped>
  .chedu-temp {
    padding: 22px 30px 30px 30px;
    background: #ffffff;
    border-radius: 2px;
    /*overflow: hidden;*/
    position: relative;
  }

  .chedu-temp .temp-head {
    height: 36px;
    line-height: 36px;
    margin-bottom: 30px;
    /*overflow: hidden;*/
    position: relative;
  }

  .chedu-temp .temp-head .th-fl {
    float: left;
    position: relative;
  }

  .chedu-temp .temp-head .th-fl > i {
    width: 10px;
    height: 22px;
    background: #18d96e;
    position: absolute;
    left: -30px;
    top: 8px;
  }

  .chedu-temp .temp-head .th-fl > span {
    color: #555555;
    font-size: 20px;
    font-weight: bold;
  }

  .chedu-temp .temp-head .th-fr {
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
    width: 85%;
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

  /*=============排班模板中心部分样式结束=========*/
  /*=============排班模板任务分类弹窗样式结束=========*/
  /*头部*/
  .dialog-head {
    font-size: 16px;
    font-weight: bold;
    color: #555;
    height: 20px;
    line-height: 20px;
    margin: 10px 0;
  }

  .dialog-head .checkbox-group {
    float: left;
    position: relative;
    margin-right: 40px;
  }

  .dialog-head .tack-icon {
    width: 14px;
    height: 14px;
    background: url("../../assets/？.png") no-repeat 50% 50%;
    background-size: 100%;
    position: absolute;
    top: -3px;
    right: -18px;
  }

  /*时间弹窗*/
  .dialog-head .time-group {
    float: left;
    position: relative;
  }

  .dialog-head div.time-pop {
    width: 310px;
    height: 255px;
    position: absolute;
    top: 47px;
    left: 33.5%;
    background: #ffffff;
    border: 1px solid #cccccc;
    border-radius: 2px;
    padding: 10px 14px;
    z-index: 99;
  }

  .dialog-head div.time-pop .timegroun-head > i:first-child {
    display: inline-block;
    width: 8px;
    height: 18px;
    background: #18d96e;
    border-radius: 2px;
    margin-right: 10px;
    vertical-align: middle;
  }

  .dialog-head div.time-pop .timegroun-head .dele-btn {
    font-style: normal;
    display: inline-block;
    font-weight: normal;
    float: right;
    color: #c1c1c1;
    font-size: 16px;
    cursor: pointer;
  }

  .dialog-head div.time-pop .timegroun-head > span {
    font-weight: bold;
    font-size: 14px;
    color: #555555;
  }

  .timegroun-content {

  }

  .timegroun-content .add-time {
    text-align: center;
    width: 100%;
    height: 36px;
    line-height: 36px;
    border: 1px solid #CCCCCC;
    margin: 14px 0 10px 0;
  }

  .timegroun-content .add-time > span {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 50%;
    color: #FFFFFF;
    background: #19d96e;
    font-size: 16px;
    cursor: pointer;
  }

  .timegroun-content .time-list {
    height: 155px;
    overflow: auto;
  }

  .timegroun-content .time-list ul li {
    padding: 14px 20px;
    background: #f5f5f5;
    margin-bottom: 10px;
    font-size: 14px;
    color: #555555;
  }

  .time-list ul li .timlis-head {
    overflow: hidden;
    position: relative;
  }

  .time-list ul li .timlis-head .th-fl {
    float: left;
    font-weight: bold;
  }

  .time-list ul li .timlis-head .th-fr {
    float: right;
    font-weight: normal;
  }

  .time-list ul li .timlis-head .th-fr > span {
    margin-left: 15px;
  }

  .time-list ul li .timlis-head .th-fr .bluefont {
    color: #58c9f3;
  }

  .time-list ul li .timlis-head .th-fr .redfont {
    color: #ff6060;
  }

  .time-list ul li .timlis-head .th-fr .greenfont {
    color: #18d96e;
  }

  .time-list ul li .timlis-head .th-fr .redfont {
    color: #999999;
  }

  .time-list ul li .timlis-cond {
    margin-top: 10px;
    overflow: hidden;
    font-weight: normal;
    height: 24px;
    line-height: 24px;
  }

  .time-list ul li .timlis-cond .tc-fl {
    float: left;
  }

  .time-list ul li .timlis-cond .tc-fr {
    float: right;
  }

  .time-list ul li .timlis-cond .tm-blk {
    display: inline-block;
    width: 40px;
    height: 24px;
    text-align: center;
  }

  .time-list ul li .timlis-cond .tm-blk:hover {
    background: #e6e6e6;
  }

  .dialog-head .time-group > i {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url("../../assets/shijianduan_01.png") no-repeat 50% 50%;
    background-size: 100%;
    margin-right: 8px;
    vertical-align: top;
  }

  .dialog-head .time-group > span {
    font-weight: normal;
    cursor: pointer;
  }

  /*主体*/
  .dialog-body {
    padding: 0 0 0 17px;
  }

  .dialog-body .tier-rank {
    margin-bottom: 30px;
  }

  .dialog-body .tier-rank .tierank-tit {
    height: 28px;
    line-height: 28px;
    position: relative;
    margin-bottom: 16px;
  }

  .dialog-body .tier-rank .tierank-tit > i {
    width: 8px;
    height: 18px;
    background: #18d96e;
    border-radius: 2px;
    position: absolute;
    top: 5px;
    left: -15px;
  }

  .dialog-body .tier-rank .tierank-tit .tit-name {
    font-weight: bold;
    font-size: 16px;
    color: #555555;
  }

  .dialog-body .tier-rank .tierank-tit .deltem-btn {
    float: right;
    width: 77px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border: 1px solid #ff6c60;
    color: #ff6c60;
    font-size: 14px;
    border-radius: 2px;
    cursor: pointer;
  }

  .dialog-body .tier-rank .tierank-search > input {
    width: 300px;
    height: 36px;
    border: 1px solid #cccccc;
    text-indent: 10px;
    color: #555555;
  }

  /*表格主体*/
  .table-content {

  }

  .work-table {
    border: 1px solid #cccccc;
    border-collapse: collapse;
    width: 87%;
    color: #fff;
    text-align: center;
    font-size: 14px;
    margin: 0 auto;
    margin-left: 4%;
    padding-top: 26px;
    height: 165px;
  }

  .work-table .comm-width {
    width: 100px;
    position: relative;
  }

  .work-table > thead th {
    text-align: center;
    font-weight: normal;
    height: 50px;
    line-height: 50px;
  }

  .work-table > thead th > input,
  .work-table > tbody td > input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    text-align: center;
    font-size: 14px;
    color: #555555;
  }

  .tab-top > div {
    position: absolute;
    width: 100%;
    top: -37px;
    text-align: center;
  }

  .tab-top > div > i {
    margin: 0 5px;
  }

  .work-table tr i {
    width: 22px;
    height: 22px;
    line-height: 22px;
    display: inline-block;
    cursor: pointer;
    margin: 0 2px;
  }

  .add {
    background: url("../../assets/green+.png") no-repeat 50% 50%;
    background-size: 100%;
  }

  .reduce {
    background: url("../../assets/red-.png") no-repeat 50% 50%;
    background-size: 100%;
  }

  .cloud {
    background: url("../../assets/zhuancun.png") no-repeat 50% 50%;
    background-size: 100%;
  }

  .tab-content {
    width: 101.5%;
    /*width: 100%;*/
    height: 200px;
    overflow-x: visible;
    overflow-y: scroll;
    /*overflow: auto;*/
  }

  /*.work-table > .tbody {*/
  /*height: 200px;*/
  /*overflow: hidden;*/
  /*}*/

  .work-table > tbody td {
    height: 40px;
    line-height: 40px;
  }

  .work-table .comm-width > img {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translate(0, -50%);
    -webkit-transform: translate(0, -50%);
    -moz-transform: translate(0, -50%);
    -o-transform: translate(0, -50%);
  }

  .comm-width .el-checkbox {
    position: absolute;
    left: -34px;
    top: 37px;
  }

  .comm-width .tab-right {
    position: absolute;
    top: 42px;
    right: -100px;
  }

  .comm-width > p {
    color: #555555;
    line-height: 18px;
  }

  /*转存样式*/
  .unload-box {
    text-align: left;
    width: 230px;
    position: absolute;
    /*top: 56%;*/
    right: -67%;
    border: 1px solid #cccccc;
    border-radius: 2px;
    background: #FFFFFF;
    z-index: 99;
  }

  .unload-box .unload-head {
    padding: 8px 10px;
    height: 20px;
    line-height: 20px;
    margin-bottom: 20px;
  }

  .unload-box .unload-head > i {
    width: 8px;
    height: 18px;
    background: #18d96e;
    border-radius: 2px;
    margin-right: 6px;
    vertical-align: middle;
  }

  .unload-box .unload-head > span {
    font-size: 14px;
    color: #555555;
    font-weight: bold;
  }

  .unload-box .unload-content {
    text-align: center;
    height: 100px;
    overflow: auto;
    padding: 8px 10px;
  }

  .unload-box .unload-content ul li {
    width: 100%;
    height: 30px;
    line-height: 30px;
    border: 1px solid #cccccc;
    margin-bottom: 10px;
    color: #555555;
  }

  .unload-box .unload-content ul li:hover {
    border: 1px solid #58a9f3 !important;
    background: #58a9f3;
    color: #ffffff;
  }

  .unload-box .unload-content ul li.tem-actv {
    border: 1px solid #58a9f3 !important;
    background: #58a9f3;
    color: #ffffff;
  }

  .unload-box .unload-footer {
    padding-top: 12px;
    height: 50px;
    text-align: center;
    background: #f5f5f5;
  }

  /*=============排班模板任务分类弹窗样式结束=========*/

</style>
