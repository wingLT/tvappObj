<template>
  <main-container>
    <div class="operation-tool-container">
      <div class="tool-container-left">
        <div class="tool-info-title">
          <p>设备维护统计</p>
        </div>
        <div class="info-content">
          <div class="info-div">
            <p>{{totalData.countMaintainLog}}</p>
            <p>维护日志</p>
          </div>
          <div class="info-div">
            <p>{{totalData.countMaintainLogWithDays}}</p>
            <p>近30天维护日志数</p>
          </div>
          <div class="info-div">
            <p>{{totalData.countDevice}}</p>
            <p>设备总数</p>
          </div>
          <div class="info-div">
            <p style="font-size: 22px">{{totalData.lastLogTime}}</p>
            <p>最近记录时间</p>
          </div>
        </div>
        <p>更多统计查看 ></p>
      </div>
      <div class="tool-container-right">
        <div class="tool-nav">
          <div class="active" @click="switcher($event,true)">设备列表</div>
          <div @click="switcher($event,false)">维护日志</div>
        </div>
        <!--设备列表-->
        <div class="tool-content" v-if="isDevice" v-loading="loading">
          <!--搜索-->
          <div class="device-title">
            <div class="device-search">
              <div class="select-down dropdown">
                <div class="device-search-select">
                  <input type="text" v-model="deviceFlag" class="dropdown-toggle"
                         data-toggle="dropdown"
                         readonly placeholder="设备名称"/>
                  <span class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down"></i></span>
                  <ul class="no-header down-content dropdown-menu">
                    <li @click="deviceFlag = '设备名称'">设备名称</li>
                    <li @click="deviceFlag = '设备IP'">设备IP</li>
                  </ul>
                </div>
                <div class="device-search-input">
                  <input v-model="KeyLike" @keyup.13="getDeviceList(0)" type="text" placeholder="输入名称或关键字进行搜索"/>
                  <span @click="getDeviceList(0)"></span>
                </div>
              </div>
            </div>
            <div class="type-setting" @click="typeSetting">分类设置</div>
          </div>
          <!--筛选-->
          <div class="content-select">
            <div class="content-select-left">
              <span class="select-span active" @click="selectSpan($event,null,null)">全部设备</span>
              <span class="select-span" v-for="(list,index) in deviceTypes" @click="selectSpan($event,list.id,null)"
                    :key="index">{{list.name}}</span>
            </div>
            <div class="content-select-right">
              <span class="select-span active" @click="selectSpan($event,null,'name')">默认名称排序</span>
              <span class="select-span" style="margin: 0" @click="selectSpan($event,null,'log_time')">维护时间排序</span>
            </div>
          </div>
          <!--设备列表内容-->
          <div class="device-content">
            <el-row :gutter="8">
              <el-col style="width: 160px;">
                <div class="device-info" style="cursor: pointer" @click="modifyDevice('添加设备',null)">
                  <div class="device-state add" style="top: 28px"></div>
                  <p style="top: 34px">添加设备</p>
                </div>
              </el-col>
              <el-col style="width: 160px;" v-for="(list,index) in deviceList" :key="index">
                <div class="device-info">
                  <div style="min-height: 1px;height: 100%;z-index: 1" @click="showDeviceLog(list.id)">
                    <div class="device-state" :class="list.ico"></div>
                    <p style="top: 23px">{{list.name}}</p>
                    <p style="color: #888">{{list.ip}}</p>
                  </div>
                  <div class="device-hidden">
                    <div @click="modifyDevice('修改设备',list)">编辑</div>
                    <div @click="deleteDevice(list.id)">删除</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="page clear" style="margin-top: 8px">

            <div class="page-number fr">
              <div class="page-turning" id="paging"></div>
              <div class="go-page">
            <span>
              <input type="number" v-model="deviceListParameter.pageNum" @keyup="appointToPage()"/>
            </span>
                <span @click="appointToPage()">GO</span>
              </div>
            </div>

          </div>

        </div>
        <!--维护日志-->
        <div class="tool-content" v-if="!isDevice">
          <div class="device-title">
            <el-date-picker
              v-model="time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd"
              @change="changeLogsTime(time)"
              end-placeholder="结束日期" style="width: 412px;border-radius: 0;border: none">
            </el-date-picker>
          </div>
          <div class="content-select">
            <div class="content-select-left">
              <span class="select-span active" @click="selectSpan1($event,null)">全部设备</span>
              <span class="select-span" v-for="(list,index) in deviceTypes" @click="selectSpan1($event,list.id)"
                    :key="index">{{list.name}}</span>
            </div>
            <div class="content-select-right">
              <span class="print-span"></span>
            </div>
          </div>
          <div class="device-content">
            <ul class="history-list">
              <li class="row" v-for="(list,index) in logsList" :key="index">
                <i></i>
                <div class="img-name fl">
                  <div :class="list.ico" style="width: 100%;height: 48px"></div>
                  <div>{{list.devName}}</div>
                  <div>{{list.ip}}</div>
                </div>
                <div class="item-content fr">
                  <div>
                    <span class="item-name">{{list.title}}</span>
                    <!--<span class="item-error">{{list.devName}}</span>-->

                    <span>
												<ul class="type-list">
													<li v-for="d in list.maintainTypeList">{{d.name}}</li>
												</ul>
											</span>
                    <span class="item-personnel">{{list.userName}}</span>
                    <!--<div class="item-operate fr">-->
                    <!--<span>编辑</span>-->
                    <!--<span>删除</span>-->
                    <!--</div>-->
                  </div>
                  <div>{{list.logTime}}</div>
                  <div>{{list.logDesc}}</div>
                </div>

              </li>
            </ul>
          </div>
          <!--<div class="page clear" style="margin-top: 8px">-->

          <!--<div class="page-number fr">-->
          <!--<div class="page-turning" id="paging1"></div>-->
          <!--<div class="go-page">-->
          <!--<span>-->
          <!--<input type="number" v-model="goToPage" @keyup="appointToPage1()"/>-->
          <!--</span>-->
          <!--<span @click="appointToPage1()">GO</span>-->
          <!--</div>-->
          <!--</div>-->

          <!--</div>-->
        </div>
      </div>
    </div>
    <!--设备列表弹窗-->
    <el-dialog :visible.sync="dialogFormVisible" width="500px">
      <span slot="title" style="font-size: 16px;font-weight: bold;color: #555"><i class="i-icon"></i> {{deviceDispose}}</span>
      <el-form :model="form" :rules="rules" ref="form" label-position="top" size="small" :inline="true">
        <el-form-item label="设备名称" :label-width="formLabelWidth" style="width: 100%" prop="name">
          <el-input v-model="form.name" auto-complete="off" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备类别" :label-width="formLabelWidth" prop="devTypeId">
          <el-select v-model="form.devTypeId" placeholder="请选择设备类别">
            <el-option v-for="(list,index) in deviceTypes" :key="index" :label="list.name" :value="list.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备位置" prop="location" :label-width="formLabelWidth" style="width: 230px;margin-right: 0">
          <el-input v-model="form.location" placeholder="请输入设备位置"></el-input>
        </el-form-item>
        <el-form-item label="设备条码" prop="code" :label-width="formLabelWidth" style="width: 215px">
          <el-input v-model="form.code" placeholder="请输入设备条码"></el-input>
        </el-form-item>
        <el-form-item label="设备IP" prop="ip" :label-width="formLabelWidth" style="width: 230px;margin-right: 0">
          <el-input v-model="form.ip" placeholder="请输入设备IP"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 120px;background-color: #58c9f3;border-radius: 0;border-color: rgba(0,0,0,0)"
                   type="primary" size="small" @click="submitData('form')">确 定
        </el-button>
        <el-button style="border-radius: 0;width: 120px;" type="info" size="small" @click="resetForm('form');">取
          消
        </el-button>
      </div>
    </el-dialog>
    <!--分类管理弹窗-->
    <el-dialog :visible.sync="dialogFormVisible1" width="543px" class="dialogFormVisible1">
      <span slot="title">&nbsp;</span>
      <div class="type-title">
        <i></i>
        <span>维护类别管理</span>
      </div>
      <div class="type-container">
        <div @click="addType('添加维护类别',null)"> +</div>
        <div v-for="(list,index) in maintainTypes"><b style="font-weight: 500;display: block">{{list.name}}</b>
          <span @click="deleteDeviceType(list.id,'maintainTypes')"></span>
        </div>
      </div>
      <div class="type-title">
        <i></i>
        <span>设备类别管理</span>
      </div>
      <div class="type-container">
        <div @click="addType('添加设备类别',null)"> +</div>
        <div v-for="(list,index) in deviceTypes" :key="index">
          <b style="font-weight: 500;display: block" @click="addType('修改设备类别',list)">{{list.name}}</b>
          <span @click="deleteDeviceType(list.id,'maintainDeviceTypes')"></span>
        </div>
      </div>
      <el-dialog :visible.sync="dialogFormVisible2" width="500px" append-to-body top="22vh">
        <span slot="title" style="font-size: 16px;font-weight: bold;color: #555"><i class="i-icon"></i>{{deviceOrMaintain}}</span>

        <el-input v-model="deviceTypesParameter.name" placeholder="在此处设置类别名称" style="width: 100%;text-align: center"
                  class="new-input"></el-input>
        <div v-if="isDeviceType">
          <div style="padding: 20px 0;text-align: center;font-weight: bold;">展示样式选择</div>
          <div class="type-img">
            <el-row :gutter="10">
              <el-col :span="6" v-for="item in imgages" :key="item">
                <div class="type-img-info" :class="'image'+item"
                     @click="selectImage('image'+item,$event)"></div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button style="width: 120px;background-color: #58c9f3;border-radius: 0;border-color: rgba(0,0,0,0)"
                     type="primary" size="small" @click="submitType()">确认添加
          </el-button>
          <el-button style="border-radius: 0;width: 120px;" type="info" size="small"
                     @click="dialogFormVisible2 = false">取 消
          </el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <!--添加设备分类类别-->
    <!--查看单个设备日志情况-->
    <el-dialog :visible.sync="dialogFormVisible3" class="dialogFormVisible3">
      <span slot="title">&nbsp;</span>
      <div class="top">
        <ul>
          <li>
            <div style="width: 36px;height: 38px;background-size: contain;margin-right: 5px"
                 :class="maintainDevices.ico"></div>
            <div>
              <span>{{maintainDevices.name}}</span>
              <span>{{maintainDevices.ip}}</span>
            </div>
          </li>
          <li>
            <span style="color: #555">{{maintainDevices.logNum}}</span>
            <span class="gray-text">日志总数</span>
          </li>
          <li>
            <span style="color: #555">{{maintainDevices.location}}</span>
            <span class="gray-text">设备位置</span>
          </li>
          <li>
            <span><img src="../../assets/dayin.png"/></span>
            <span @click="addLogToDevice(maintainDevices.id)">＋</span>
          </li>
        </ul>
      </div>
      <div class="log-content">
        <div>
          <span>
            <i class="dot"></i>
          </span>
        </div>
        <div id="logContent">
          <ul>
            <li class="log-time">
              <i class="dot"></i>
              <el-date-picker
                v-model="time1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                value-format="yyyy-MM-dd"
                @change="changeDateRangeTime(time1)"
                end-placeholder="结束日期" style="width: 412px;border-radius: 0;border: none">
              </el-date-picker>
            </li>
            <li v-for="(list,index) in maintainDevicesLogs">
              <i class="dot"></i>
              <p>
                <span class="log-type-title">{{list.title}}</span>
                <span class="log-type" v-for="(type,key) in list.maintainTypeList" :key="key">{{type.name}}</span>
                <span class="log-username">{{list.userName}}</span>

              </p>
              <p class="log-record-time">{{list.logTime}}</p>
              <p class="log-record-content">{{list.logDesc}}</p>
            </li>
          </ul>
        </div>
      </div>
      <el-dialog :visible.sync="dialogFormVisible4" width="500px" top="28vh" :modal="false">
        <span slot="title" style="font-size: 16px;font-weight: bold;color: #555"><i class="i-icon"></i> 新增维护日志</span>
        <el-form :model="logs" :rules="logsRules" ref="logs" label-position="top" size="small" :inline="true">
          <el-form-item label="日志标题" :label-width="formLabelWidth" style="width: 100%" prop="title">
            <el-input v-model="logs.title" auto-complete="off" placeholder="请输入日志标题"></el-input>
          </el-form-item>
          <el-form-item label="维护类别" :label-width="formLabelWidth" prop="maintainTypeId">
            <el-select v-model="logs.maintainTypeId" placeholder="请选择维护类别">
              <el-option v-for="(list,index) in maintainTypes" :key="index" :label="list.name"
                         :value="list.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维护人员" :label-width="formLabelWidth" prop="userId">
            <el-select v-model="logs.userId" placeholder="请选择维护人员">
              <el-option v-for="(list,index) in maintainUser" :key="index" :label="list.userName"
                         :value="list.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日志描述" prop="logDesc" :label-width="formLabelWidth" style="width: 100%">
            <el-input type="textarea" resize="none" v-model="logs.logDesc" placeholder="请输入日志描述"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-checkbox v-model="logs.addRepository" :true-label="1" :false-label="0" style="float: left">放入知识库
          </el-checkbox>
          <el-button style="width: 120px;background-color: #58c9f3;border-radius: 0;border-color: rgba(0,0,0,0)"
                     type="primary" size="small" @click="submitData1('logs')">确 定
          </el-button>
          <el-button style="border-radius: 0;width: 120px;" type="info" size="small"
                     @click="resetForm('logs');dialogFormVisible4=false">取
            消
          </el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </main-container>
</template>

<script>
  import Vue from 'vue'
  import './equipment-home.css'
  import { GlobalVar } from "../../../static/js/utils";
  import template from '../Packages/MainContainer.vue'

  Vue.component(template.name, template);

  export default {
    name: "operations-tool",
    data() {
      return {
        isDevice: true,
        isDeviceType: false,
        pageNum: 0,
        pageSize: 10,
        goToPage: null,
        total: 10,
        totalPages: 1,
        loading: false,
        loading1: false,
        deviceDispose: '添加设备',
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        dialogFormVisible4: false,
        formLabelWidth: '120px',
        KeyLike: '',
        imgages: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        /*左侧统计数据*/
        totalData: {},
        deviceFlag: '设备名称',
        /*右侧设备列表信息*/
        deviceListParameter: {
          deviceKeyLike: '',
          ipLike: '',
          deviceTypeId: '',
          sortField: 'name',
          ascDesc: 'desc',
          pageNum: 1,
          pageSize: 31,
        },
        deviceListParameter1: {
          typeId: null,
          startTime: '',
          endTime: '',
        },
        logsList: [],
        deviceListFlag: 0,
        deviceList: [],
        rules: {
          name: [
            {required: true, message: '请输入设备名称', trigger: 'blur'},
          ],
          ip: [
            {required: true, message: '请输入设备IP', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入设备条码', trigger: 'blur'}
          ],
          location: [
            {required: true, message: '请输入设备位置', trigger: 'blur'}
          ],
          devTypeId: [
            {required: true, message: '请选择设备类别', trigger: 'change'}
          ],
        },
        logsRules: {
          title: [
            {required: true, message: '请输入日志标题', trigger: 'blur'},
          ],
          userId: [
            {required: true, message: '请选择维护人员', trigger: 'change'}
          ],
          maintainTypeId: [
            {required: true, message: '请选择维护类别', trigger: 'change'}
          ],
          logDesc: [
            {required: true, message: '请输入日志描述', trigger: 'blur'}
          ]
        },
        form: {
          id: null,
          name: '',
          devTypeId: null,
          location: '',
          code: '',
          ip: ''
        },
        logs: {
          logId: null,
          userId: null,
          devId: null,
          title: '',
          logDesc: '',
          maintainTypeId: null,
          addRepository: 1,
        },
        formData: {},
        deviceTypes: [],
        maintainTypes: [],
        maintainUser: [],
        maintainDevices: {},
        maintainDevicesLogs: [],
        deviceTypesParameter: {
          id: null,
          name: '',
          ico: '',
        },
        time: [new Date().getFullYear() + '-' + (Number(new Date().getMonth()) + 1) + '-' + new Date().getDate(),
          new Date().getFullYear() + '-' + (Number(new Date().getMonth()) + 1) + '-' + new Date().getDate()],
        time1: [new Date().getFullYear() + '-' + (Number(new Date().getMonth()) + 1) + '-' + new Date().getDate(),
          new Date().getFullYear() + '-' + (Number(new Date().getMonth()) + 1) + '-' + new Date().getDate()],
        input: '',
        deviceOrMaintain: '添加维护类别',
      }
    },
    created() {
      logSmallDotLine();
      this.getStatistics();
      this.getDeviceList(0);
    },
    methods: {
      /*获取统计信息*/
      getStatistics() {
        let self = this;
        $.ajax({
          type: 'get',
          url: GlobalVar.newUrl + '/maintainDeviceCount/count',
          success: function (result) {
            if (result.status === 200) {
              self.totalData = result.data;
            }
          },
          error: function (result) {
            console.log(result);
          }
        });
        /*获取设备类别*/
        $.ajax({
          type: 'get',
          url: GlobalVar.newUrl + '/maintainDeviceTypes/listAll',
          success: function (result) {
            self.deviceTypes = result.data;
          }
        });
        /*获取维护类别*/
        $.ajax({
          type: 'get',
          url: GlobalVar.newUrl + '/maintainTypes/listAll',
          success: function (result) {
            self.maintainTypes = result.data;
          }
        });
        /*获取维护人员*/
        $.ajax({
          type: 'get',
          url: GlobalVar.newUrl + '/maintainLogs/listAllUser',
          success: function (result) {
            self.maintainUser = result.data;
          }
        })
      },
      /*通过设备IP获取设备信息*/
      selectSpan(e, id, flag) {
        $(e.currentTarget).siblings('span').removeClass('active');
        if (flag === null) {
          this.deviceListParameter.deviceTypeId = id;
          $(e.currentTarget).addClass('active');
        } else {
          if ($(e.currentTarget).hasClass('active') === true) {
            if (this.deviceListFlag === 0) {
              this.deviceListParameter.ascDesc = 'asc';
              this.deviceListFlag = 1;
            } else {
              this.deviceListParameter.ascDesc = 'desc';
              this.deviceListFlag = 0;
            }
          } else {
            this.deviceListFlag = 0;
            this.deviceListParameter.ascDesc = 'desc';
            $(e.currentTarget).addClass('active');
          }
          this.deviceListParameter.sortField = flag;
        }
        this.getDeviceList(0);
      },
      /*获取设备列表信息*/
      getDeviceList(flag) {
        let self = this;
        this.loading = true;
        if (this.deviceFlag === '设备名称') {
          this.deviceListParameter.deviceKeyLike = this.KeyLike;
          this.deviceListParameter.ipLike = '';
        } else {
          this.deviceListParameter.deviceKeyLike = '';
          this.deviceListParameter.ipLike = this.KeyLike;
        }
        $.ajax({
          type: 'get',
          url: GlobalVar.newUrl + '/maintainDevice/list',
          data: this.deviceListParameter,
          success: function (result) {
            if (result.status === 200) {
              self.deviceList = result.data.rows;
              self.loading = false;
              if (flag === 0) {
                pageNumber(Math.ceil(result.data.total / 31), 1, self, 'paging');
              }
            }
          }, error: function () {
            self.loading = false;
          }
        });
      },
      switcher(e, boo) {
        $(e.currentTarget).siblings().removeClass('active');
        $(e.currentTarget).addClass('active');
        this.isDevice = boo;
        if (boo === false) {
          this.getLogs()
        }else{
          this.getDeviceList(0);
        }
      },

      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
        this.dialogFormVisible = false;
        /*切换*/

      },
      /*删除设备*/
      deleteDevice(id) {
        let self = this;
        this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $.ajax({
            url: GlobalVar.newUrl + '/maintainDevice/delete/' + id,
            type: 'get',
            success: function (result) {
              if (result.status === 200) {
                self.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                self.getDeviceList(1);
                self.getStatistics();
              }
            }
          });
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      /*查看设备日志*/
      showDeviceLog(id) {
        let self = this;
        this.dialogFormVisible3 = true;
        $.ajax({
          type: 'get',
          url: GlobalVar.newUrl + '/maintainDevice/key/' + id,
          success: function (result) {
            if (result.status === 200) {
              self.maintainDevices = result.data;
              self.getLogsByCondition(id);
            }
          }
        });
      },
      changeDateRangeTime(value) {
        this.getLogsByCondition(this.maintainDevices.id)
      },
      /*通过条件获取日志列表*/
      getLogsByCondition(id) {
        let self = this;
        /*/maintainLogs/list*/
        $.ajax({
          type: 'get',
          url: GlobalVar.newUrl + '/maintainLogs/list',
          data: {devId: id, startTime: self.time1[0] + ' 00:00:00', endTime: self.time1[1] + ' 24:00:00'},
          success: function (result) {
            if (result.status === 200) {
              self.maintainDevicesLogs = result.data
            }
          }
        });
      },
      appointToPage(num) {
        let self = this;
        this.$nextTick(() => {
          $('.current').attr('class', 'tcdNumber');
          for (let i = 0; i < $('.tcdNumber').length; i++) {
            if (self.deviceListParameter.pageNum === $('.tcdNumber').eq(i).text()) {
              $('.tcdNumber').eq(i).attr('class', 'current');
            }
          }
          self.getDeviceList(1)
        });

      }, appointToPage1(num) {
        this.$nextTick(() => {
          for (let i = 0; i < $('.tcdNumber').length; i++) {

          }
        });

        this.getDeviceList(1)
      },
      /*处理设备*/
      modifyDevice(str, list) {
        this.dialogFormVisible = true;
        this.deviceDispose = str;
        let self = this;
        $.ajax({
          type: 'get',
          url: GlobalVar.newUrl + '/maintainDeviceTypes/listAll',
          success: function (result) {
            self.deviceTypes = result.data;
          }
        });
        this.$nextTick(() => {
          self.$refs.form.resetFields();
          if (str === '修改设备') {
            self.form = {
              id: list.id,
              name: list.name,
              devTypeId: list.devTypeId,
              location: list.location,
              code: list.code,
              ip: list.ip
            };
          }
        });


      },
      /*提交新增设备*/
      submitData(formName) {
        let self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            $.ajax({
              type: 'post',
              url: GlobalVar.newUrl + '/maintainDevice/revise',
              data: this.form,
              success: function (result) {
                if (result.status === 200) {
                  self.getDeviceList(0);
                  self.dialogFormVisible = false;
                  self.$message({type: 'success', message: '提交成功!'});
                }
              }
            })
          } else {
            return false;
          }
        });

      },
      /**/
      /*分类设置*/
      typeSetting() {
        this.dialogFormVisible1 = true;
        let self = this;
        $.ajax({
          type: 'get',
          url: GlobalVar.newUrl + '/maintainDeviceTypes/listAll',
          success: function (result) {
            self.deviceTypes = result.data;
          }
        });
        $.ajax({
          type: 'get',
          url: GlobalVar.newUrl + '/maintainTypes/listAll',
          success: function (result) {
            self.maintainTypes = result.data;
          }
        })
      },
      /*提交设备类别*/
      selectImage(str, e) {
        $(e.currentTarget).parent().siblings().find('div.type-img-info').removeClass('active');
        $(e.currentTarget).addClass('active');
        this.deviceTypesParameter.ico = str;
      },
      /*添加类别*/
      addType(str, data) {
        this.dialogFormVisible2 = true;
        this.deviceOrMaintain = str;
        if (str === '添加维护类别') {
          this.isDeviceType = false
        } else {
          this.isDeviceType = true
        }
        $('.type-img-info').removeClass('active');
        if (data === null) {
          this.deviceTypesParameter.id = null;
          this.deviceTypesParameter.name = '';
          this.deviceTypesParameter.ico = '';
        } else {
          this.deviceTypesParameter.id = data.id;
          this.deviceTypesParameter.name = data.name;
          this.deviceTypesParameter.ico = data.ico;
          this.$nextTick(() => {
            $('.' + data.ico).addClass('active');
          });
        }
      },
      submitType() {
        let self = this;
        if (self.deviceOrMaintain === '添加维护类别' || self.deviceOrMaintain === '修改维护类别') {
          if (this.deviceTypesParameter.name === '') {
            this.$message({message: '请输入类别名称!', type: 'error'});
          } else {
            $.ajax({
              type: 'post',
              url: GlobalVar.newUrl + '/maintainTypes/revise',
              data: this.deviceTypesParameter,
              success: function (result) {
                if (result.status === 200) {
                  self.$message({message: '类别添加成功!', type: 'success'});
                  self.dialogFormVisible2 = false;
                  self.deviceTypesParameter.ico = '';
                  self.deviceTypesParameter.name = '';
                  self.getStatistics();
                }
              }
            })
          }
        } else {
          if (this.deviceTypesParameter.name === '' || this.deviceTypesParameter.ico === '') {
            this.$message({message: '请输入类别名称或选择类别样式!', type: 'error'})
          } else {
            $.ajax({
              type: 'post',
              url: GlobalVar.newUrl + '/maintainDeviceTypes/revise',
              data: this.deviceTypesParameter,
              success: function (result) {
                if (result.status === 200) {
                  self.$message({message: '类别添加成功!', type: 'success'});
                  self.dialogFormVisible2 = false;
                  self.deviceTypesParameter.ico = '';
                  self.deviceTypesParameter.name = '';
                  self.getStatistics();
                }
              }
            })
          }
        }

      },
      deleteDeviceType(id, string) {
        let self = this;
        /*/maintainTypes/delete/{typeId}*/
        let str = '';
        if (string === 'maintainTypes') {
          str = '是否删除该维护类别'
        } else {
          str = '删除该设备类别将会删除该类别下的所有设备, 是否继续?'
        }
        this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $.ajax({
            type: 'get',
            url: GlobalVar.newUrl + '/' + string + '/delete/' + id,
            success: function (result) {
              if (result.status === 200) {
                self.$message({message: '删除成功!', type: 'success'});
                self.dialogFormVisible2 = false;
                self.getStatistics();
              }
            }
          })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      /*给某个设备添加日志*/
      addLogToDevice(id) {
        this.dialogFormVisible4 = true;
        this.logs.devId = id;
      },
      /*提交添加*/
      submitData1(formName) {
        let self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            $.ajax({
              type: 'post',
              url: GlobalVar.newUrl + '/maintainLogs/revise',
              data: self.logs,
              success: function (result) {
                if (result.status === 200) {
                  self.$message({message: '添加成功!', type: 'success'});
                  self.dialogFormVisible4 = false;
                  self.getStatistics();
                  self.getDeviceList(1);
                  self.showDeviceLog(self.logs.devId);
                  self.$nextTick(() => {
                    self.$refs[formName].resetFields();
                  })
                }
              }
            })
          } else {
            return false;
          }
        });
      },

      /*维护日志接口*/
      /*时间筛选*/
      changeLogsTime(value) {
        this.deviceListParameter1.startTime = this.time[0] + ' 00:00:00';
        this.deviceListParameter1.endTime = this.time[1] + ' 24:00:00';
        this.getLogs();
      },
      /*通过点击设备类别筛选日志*/
      selectSpan1(e, id) {
        $(e.currentTarget).siblings('span').removeClass('active');
        $(e.currentTarget).addClass('active');
        this.deviceListParameter1.typeId = id;
        this.getLogs();
      },
      getLogs() {
        let self = this;
        self.loading1 = true;
        $.ajax({
          type: 'get',
          url: GlobalVar.newUrl + '/maintainLogs/list',
          data: this.deviceListParameter1,
          success: function (result) {
            if (result.status === 200) {
              self.loading1 = false;
              self.logsList = result.data;
            }
          }, error: function () {
            self.loading1 = false;
          }
        });
      }
    },
    mounted() {
      let router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      };
      GlobalVar.setHistoryRouter(router);
      logSmallDotLine();
    },

    updated() {
      logSmallDotLine();
    }
  }

  function pageNumber(pageCount, current, self, id) {
    $("#" + id).CreatePage({
      pageCount: pageCount,//总页数
      current: current,//当前页码
      backFn: function (page) {
        self.deviceListParameter.pageNum = page;
        $('#goToPage').val(page);
        //page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
        self.getDeviceList(1);
      }
    });
  }

  function logSmallDotLine() {
    if ($('.history-list').find('li:first-child').find('div.line').length <= 0) {
      $('.history-list').find('li').find('div.line').remove();
      $('.history-list').find('li:first-child i').before('<div class="line"></div>');
      $('.history-list').find('li:last-child i').before('<div class="line"></div>');
    }
    if ($('.history-list').find('li:last-child').find('div.line').length <= 0) {
      $('.history-list').find('li').find('div.line').remove();
      $('.history-list').find('li:last-child i').before('<div class="line"></div>');
      $('.history-list').find('li:first-child i').before('<div class="line"></div>');
    }
//	$('.history-list').find('li:last-child i').before('<div class="line"></div>');

    var fh = $('.history-list').find('li.row:first-child').height();
    $('.history-list').find('li:first-child div.line').css('height', ((Number(fh) + 45) / 2) + 'px');


    var lh = $('.history-list').find('li.row:last-child').height();
    $('.history-list').find('li:last-child div.line').css('height', ((Number(lh) + 45) / 2) + 'px');
  }
</script>

<style scoped>
  .operation-tool-container {
    width: 100%;
    min-height: 1px;
  }

  .operation-tool-container > div {
    float: left;
    height: calc(100vh - 204px);
    overflow: auto;
    position: relative;
  }

  .tool-container-left {
    width: 230px;
    background-color: #fff;
    margin-right: 20px;
  }

  .tool-container-right {
    width: 1350px;
  }

  .tool-info-title {
    margin-top: 20px;
    font-weight: bold;
    border-left: 10px solid #18d96e;
    padding-left: 10px;
    color: #555;
  }

  .info-content {
    width: 137px;
    min-height: 1px;
    margin: 0 auto;
  }

  .info-div {
    padding: 29px 0;
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
    box-sizing: border-box;
  }

  .info-div:last-child {
    border-bottom: 1px solid rgba(0, 0, 0, 0);
  }

  .info-div > p:nth-child(1) {
    font-size: 38px;
    margin-bottom: 0;
  }

  .info-div > p:nth-child(2) {
    font-size: 16px;
    margin-bottom: 0;
  }

  .tool-container-left > p {
    text-align: center;
    position: relative;
    /*margin-top: 120px;*/
    top: 80px;
    color: #58c9f3;
    font-size: 16px;
    cursor: pointer;
  }

  .tool-nav {
    font-size: 18px;
    color: #555;
    font-weight: bold;
  }

  .tool-nav > div {
    float: left;
    border-top: 6px solid rgba(0, 0, 0, 0);
    width: 220px;
    height: 50px;
    line-height: 44px;
    box-sizing: border-box;
    text-align: center;
    background-color: #e6e6e6;
    margin-right: 4px;
    cursor: pointer;
  }

  .tool-nav > div.active {
    border-top: 6px solid #18d96e;
    background-color: #fff;
  }

  .tool-content {
    height: calc(100% - 50px);
    overflow: auto;
    background-color: #fff;
    margin-top: 50px;
    box-sizing: border-box;
    padding: 30px;
  }

  .device-title {
    height: 40px;
    position: relative;
    width: 100%;
  }

  .device-title > div {
    display: inline-block;
  }

  .device-search {
    width: 513px;
    height: 40px;
    background-color: #f2f2f2;
    border: 1px solid #eaeaea;
    box-sizing: border-box;
  }

  .device-search-select {
    width: 131px;
    height: 100%;
    float: left;
    position: relative;
    border-right: 1px #eaeaea solid !important;
  }

  div.select-down > div {
    border: none;
  }

  div.select-down ul.down-content {
    width: 131px;
    left: -10px;
    box-sizing: border-box;
  }

  div.select-down > div input {
    background-color: #f2f2f2;
    text-align: center;
    border-right: 1px #eaeaea solid !important;
    padding: 0;
    height: 39px;
  }

  div.select-down > div > span {
    position: absolute;
    right: 0;
    top: 0;
    background-color: #f2f2f2;
    height: 38px;
    line-height: 38px;
  }

  .device-search > input {
    float: left;
  }

  .device-search-input {
    float: left;
    width: calc(100% - 151px);
    box-sizing: border-box;
    position: relative;
  }

  .device-search-input input {
    text-align: left !important;
    text-indent: 25px;
    width: 100%;
  }

  .device-search-input span {
    position: absolute;
    background: url("../../assets/huiche.png") no-repeat 50% 50%;
    width: 17px;
    height: 12px;
    top: 0;
    right: 17px !important;
  }

  .type-setting {
    position: absolute;
    right: 0;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    width: 88px;
    text-align: right;
    background: url("../../assets/shezhi_active.png") no-repeat 0 50%;
  }

  .content-select {
    height: 32px;
    margin: 25px 0 15px 0;
    width: 100%;
  }

  .content-select > div {
    float: left;
    height: 100%;
    width: 60%;
  }

  .content-select > div:last-child {
    text-align: right;
    width: 40%;
  }

  .select-span {
    margin-right: 4px;
    border: 1px solid rgba(0, 0, 0, 0);
    color: #555;
    padding: 7px 12px;
    cursor: pointer;
    border-radius: 16px;
  }

  .select-span.active {
    border: 1px solid #58c9f3;
    color: #58c9f3;
  }

  .device-content {
    width: 100%;
    position: relative;
    /*height: calc(100% - 184px);*/
    /*overflow: auto;*/
    /*height: auto;*/
    min-height: calc(100% - 160px);
    overflow: hidden;
  }

  .device-info {
    width: 152px;
    height: 117px;
    background-color: #f5f5f5;
    margin-bottom: 8px;
    position: relative;
    text-align: center;
    cursor: pointer;
  }

  .page .page-number > div {
    display: inline-block;
    vertical-align: top;
  }

  .page .page-number > div.go-page {
    width: 88px;
    height: 28px;
    border-radius: 4px;
    border: solid 1px #cccccc;
    margin-left: 19px;
  }

  .go-page input {
    width: 32px;
    height: 24px;
    border: none;
  }

  .page .page-number > div.go-page > span {
    float: left;
    height: 100%;
    line-height: 28px;
    text-align: center;
    font-size: 14px;
    width: 50%;
    outline: none;
  }

  .page .page-number > div.go-page > span:last-child {
    color: #ffffff;
    background-color: #18d96e;
    cursor: pointer;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .device-state {
    width: 100%;
    height: 28px;
    position: relative;
    top: 20px;
  }

  .device-state.add {
    background: url("../../assets/+.png") no-repeat 50% 50%;
  }

  .device-state.computer {
    background: url("../../assets/shebei_01.png") no-repeat 50% 50%;
  }

  .device-state.computer1 {
    background: url("../../assets/6.png") no-repeat 50% 50%;
  }

  .device-info p {
    margin: 0;
    position: relative;
    top: 20px;
    color: #555;
  }

  .device-info div.device-hidden {
    position: absolute;
    bottom: 0;
    width: 100%;
    opacity: 0;
    transition: 0.3s;
    z-index: 2;
  }

  .device-info div.device-hidden > div {
    background-color: rgba(0, 0, 0, 0.3);
  }

  .device-info div.device-hidden > div:hover {
    background-color: rgba(0, 0, 0, 0.5) !important;
  }

  .device-info div.device-hidden > div:nth-child(1) {
    border-right: 1px solid #fff;
  }

  .device-info div.device-hidden > div {
    float: left;
    box-sizing: border-box;
    width: 50%;
    color: #fff;
    cursor: pointer;
  }

  .device-info:hover div.device-hidden {
    opacity: 1;
  }

  .print-span {
    position: absolute;
    background: url("../../assets/dayin.png") no-repeat 50% 50%;
    width: 34px;
    height: 34px;
    right: 0;
    top: -5px;
    cursor: pointer;
  }

  .content-select-right {
    position: relative;
  }

  .type-title {
    padding: 11px 20px;
    background-color: #f5f5f5;
  }

  .type-title i {
    display: inline-block;
    width: 8px;
    background-color: #18d96e;
    height: 16px;
    position: relative;
    top: 2px;
    margin-right: 8px;
  }

  .type-title span {
    font-size: 16px;
    font-weight: bold;
    color: #555;
  }

  .type-container {
    padding: 20px 0;
    position: relative;
  }

  .type-container > div {
    position: relative;
    padding: 6px;
    display: inline-block;
    border: 1px solid #18d96e;
    color: #555;
    border-radius: 5px;
    text-align: center;
    min-width: 70px;
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .type-container > div:nth-child(1) {
    width: 60px !important;
    min-width: 60px !important;
    font-size: 16px;
    cursor: pointer;
  }

  .type-container > div:hover {
    color: #18d96e;
  }

  .type-container > div:hover span {
    opacity: 1;
  }

  .type-container > div > span {
    position: absolute;
    cursor: pointer;
    opacity: 0;
    transition: 0.3s;
    background: url("../../assets/-.png") no-repeat 50% 50%;
    width: 15px;
    height: 15px;
    top: -7px;
    right: -7px;
    z-index: 2;
  }

  .i-icon {
    margin-right: 8px;
  }

  .type-img-info {
    width: 102px;
    height: 80px;
    box-sizing: border-box;
    cursor: pointer;
    border: 1px solid #ccc;
    margin-bottom: 10px;
  }

  .type-img-info:hover {
    border: 1px solid #18d96e;
  }

  .type-img-info.active {
    border: 1px solid #18d96e;
  }

  .image1 {
    background: url("../../assets/01.png") no-repeat 50% 50%;
  }

  .image2 {
    background: url("../../assets/02.png") no-repeat 50% 50%;
  }

  .image3 {
    background: url("../../assets/03.png") no-repeat 50% 50%;
  }

  .image4 {
    background: url("../../assets/04.png") no-repeat 50% 50%;
  }

  .image5 {
    background: url("../../assets/05.png") no-repeat 50% 50%;
  }

  .image6 {
    background: url("../../assets/06.png") no-repeat 50% 50%;
  }

  .image7 {
    background: url("../../assets/07.png") no-repeat 50% 50%;
  }

  .image8 {
    background: url("../../assets/08.png") no-repeat 50% 50%;
  }

  .image9 {
    background: url("../../assets/09.png") no-repeat 50% 50%;
  }

  .type-img {
    width: 100%;
  }

  .log-time i {
    color: #f5f5f5 !important;
  }

</style>
