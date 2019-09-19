<template>
  <main-container>
    <div class="operation-tool-container">
      <div class="tool-container-left">
        <div class="tool-info-title">
          <p>巡检异常一览</p>
        </div>
        <div class="info-content">
          <div class="info-content-red">
            <div class="info-content-red-content">
              <div>异常警告</div>
              <div>
                <div class="info-content-red-content-digital">{{exceptionCount}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="info-content-botton">
          <div class="info-content-botton-content">
            <div class="info-content-botton-content-time">
              <div class="time-png">
                <img src="../../../src/assets/shijianduan.png" alt="">
              </div>
              <div class="time-alarm">最新告警时间</div>
              <div class="time-new">
                {{newestExceptionTime}}
                2017-1-2 <br>10:30:30
                <!--<div>2017-1-2</div>-->
                <!--<div>10:30:30</div>-->
              </div>
            </div>
            <div class="plan-inspection">
              <div class="vertical"></div>
              <div>计划巡检</div>
            </div>
          </div>
        </div>
      </div>
      <div class="tool-container-right">
        <div class="tool-nav">
          <div class="active" @click="switcher($event,true)">巡检列表</div>
          <div @click="switcher($event,false)">巡检历史</div>
          <div id="jihua">
            <span><img @click="xunjianPlan($event,true)" src="../../assets/xunjianjihua.png" alt=""></span>
            <span @click="xunjianPlan($event,true)">巡检计划</span>
          </div>
        </div>
        <!--巡检列表-->
        <div class="tool-content list" v-if="isDevice">
          <!--内容列表-->
          <div class="tool-content-list">
            <div class="tool-content-list-1" v-for="item in inspectionListData">
              <div class="tool-content-list-1-left">
                <div class="tool-content-list-1-left-content">
                  <div class="shuju-png">
                    <div class="shuju-src">
                      <img class="img-png" src="../../assets/shujuku.png" alt="">
                    </div>
                    <div class="shuju-ming">
                      <span class="shuju-ming-text1">{{item.name}}</span>
                      <br>
                      <span class="shuju-ming-text2">上次巡检时间：{{item.lastUpdateTime}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tool-content-list-1-right">
                <div class="tool-content-list-1-right-content">
                  <div class="tool-content-list-1-right-content-tubiao">
                    <div class="did-see">未查看
                      <div class="digital"  @click="seeBaogao($event,true,item.id)">{{item.unread}}</div>
                    </div>
                    <div class="tubiao-da">
                      <span class="tubiao"><img   @click="clickSetupPng($event,true,item.id)"  src="../../assets/shezhi_active.png" alt=""></span>
                      <span class="tubiao tubiao-zhong"><img @click="clickPlayPng($event,true,item.id)"  src="../../assets/jiance.png" alt=""></span>
                      <span class="tubiao tubiao-last"><img  @click="shanPng($event)"  src="../../assets/shanchu.png" alt=""></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--新增数据-->
            <div class="new-shuju">
              <div class="new-shuju-content">
                <span><img  @click="updataShu($event,true)" src="../../assets/+.png" alt=""></span>
                <span class="new-shuju-text">新增数据库集群</span>
              </div>
            </div>
          </div>
          <!--分页-->
          <div class="page clear fenye" style="margin-top: 8px">
            <div class="page-number fr">
              <div class="page-turning" id="paging1"></div>
              <div class="go-page">
                <span>
                  <input type="number" v-model="goToPage" @keyup="changeBorderColor()"/>
                </span>
                <span @click="appointToPage()">GO</span>
              </div>
            </div>
          </div>
        </div>
        <!--巡检历史-->
        <div class="tool-content list" v-if="!isDevice">
          <!--头部-->
          <div>
            <!--搜索-->
            <div class="device-search-input">
              <input  @keyup.13="show($event)"  v-model="KeyLike" type="text" placeholder="输入名称或关键字进行搜索"/>
              <span></span>
            </div>
            <!--日期选择器-->
            <div class="block">
              <span class="demonstration "></span>
              <el-date-picker
                @change="choose"
                class="data-choose"
                v-model="value1"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <!--下拉选择器-->
            <div class="inspection-status">
              <div class="inspection-status-text"><span>巡检状况</span></div>
              <div class="select-inspection-status">
                <el-select @change="choose" v-model="valueZ" placeholder="全部">
                  <el-option
                    v-for="(item,index) in optionsZ"
                    :key="index"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="inspection-status">
              <div class="inspection-status-text"><span>查看情况</span></div>
              <div class="select-inspection-status">
                <el-select @change="choose" v-model="valueQ" placeholder="全部">
                  <el-option
                    v-for="(item,index) in optionsQ"
                    :key="index"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </div>
            </div>
            <span class="export-png"><img src="../../assets/daochu_01.png" alt=""></span>
          </div>
          <!--列表-->
          <div class="list-zong">
            <div class="list-zong1" v-for="item in historyListData">
              <div class="list-zong1-choose">
                <div>
                  <el-checkbox v-model="item.isRead">{{item.time}}</el-checkbox>
                </div>
              </div>
              <div class="list-zong1-content">
                <div class="list-zong1-content-left">
                  <div class="list-zong1-content-left-content">
                    <div class="list-zong1-content-left-content-shu"></div>
                    <div class="list-zong1-content-left-content-qiu"></div>
                  </div>
                </div>
                <div class="list-zong1-content-center">
                  <div class="list-zong1-content-center-kuang">
                    <el-checkbox v-model="item.isRead"></el-checkbox>
                  </div>
                  <div class="list-zong1-content-center-shujuku">
                    <div>
                      <div class="shujuku-tu">
                        <img class="shujuku-png" src="../../assets/shujuku.png" alt="">
                      </div>
                      <div class="shujuku-zong">
                        <span class="shujuku-ming">{{item.checkHistoryItemVOs[0].name}}</span> <br>
                        <span class="shujuku-time">{{item.checkHistoryItemVOs[0].time}}</span>
                      </div>
                      <div class="shujuku-condition">
                        <span class="shujuku-condition1">异常</span>
                        <span class="shujuku-condition2">自动检测</span>
                        <span class="shujuku-condition3">已查看</span>
                      </div>
                    </div>
                  </div>
                  <div class="list-zong1-content-center-shujuku-abnormal">
                    <div class="shujuku-abnormal">
                      异常状态
                    </div>
                    <div class="shujuku-abnormal-shu">{{item.checkHistoryItemVOs[0].exceptionCount}}</div>
                  </div>
                </div>
                <div class="list-zong1-content-right">
                  <img @click="seeHistoryList($event,true,item.checkHistoryItemVOs[0].recordId)" src="../../assets/chakan.png" alt="">
                </div>
              </div>
            </div>
          </div>
          <!--分页-->
          <div class="page clear fenye" style="margin-top: 8px">
            <div class="page-number fr">
              <div class="page-turning" id="paging"></div>
              <div class="go-page">
            <span>
              <input type="number" v-model="goToPage" @keyup="changeBorderColor()"/>
            </span>
                <span @click="appointToPage()">GO</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <!--添加设备分类类别-->

    <!--新增巡检计划-->
    <el-dialog :visible.sync="isShow" width="1000px">
      <div slot="title" class="new-background-background-top">
        <div class="new-top-left">
          <div class="new-top-left-green"></div>
          <div class="new-top-left-text">新增巡检计划</div>
        </div>
        <!--<div class="new-top-right">-->
          <!--<img   @click="cancelShu($event,true)"   src="../../assets/guanbi_01.png" alt="">-->
        <!--</div>-->
      </div>
      <div class="new-background-background new-background-background-plan">
        <div class="new-background-background-center">
          <div class="new-background-background-center-content">
            <div>
              <div class="choose-shujuku">选择数据库</div>
              <el-checkbox v-model="checked1">开启检查</el-checkbox>
            </div>
            <div>
              <div class="choose-data">选择日期</div>
              <el-checkbox-group
                v-model="checkedCities1"
                :min="1"
                :max="7">
                <el-checkbox v-for="week in weeks" :label="week" :key="week">星期{{week}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div>
              <div class="perform-time">执行时间</div>
              <el-time-picker
                v-model="value2"
                format="HH:mm"
                :picker-options="{
      selectableRange: '9:30:00 - 17:30:00'
    }"
                placeholder="任意时间点">
              </el-time-picker>
            </div>
          </div>
        </div>
        <div class="new-background-background-button">
          <div @click="newPlan($event,false)"   class="confirm">
            确认
          </div>
          <div @click="cancelShu($event,false)"  class="cancel">
            取消
          </div>
        </div>
      </div>
    </el-dialog>
    <!--巡检计划弹窗-->
    <el-dialog :visible.sync="isShow1" width="1000px">
      <div  slot="title"  class="new-background-background-top">
        <div class="new-top-left">
          <div class="new-top-left-green"></div>
          <div class="new-top-left-text">巡检计划</div>
        </div>
        <!--<div class="new-top-right">-->
          <!--<img @click="planTanguan($event,false)"  src="../../assets/guanbi_01.png" alt="">-->
        <!--</div>-->
      </div>
      <div class="new-background-background">
        <div class="new-background-background-center">
          <div class="new-background-background-center-content">
            <div class="new-inspection-plan">
              <div>
                <span ><img @click="updataPlan($event,true)"  src="../../assets/+++.png" alt=""></span>
                <span>新增巡检计划</span>
              </div>
            </div>
            <div class="inspection-plan-list">
              <div class="inspection-plan-list-1" v-for="item in inspectionPlan">
                <div class="inspection-plan-list-1-kaiguan">
                  <el-switch
                    v-model="item.isEnabled"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </div>
                <div class="inspection-plan-list-1-jihua">
                  {{item.name}}
                </div>
                <div class="inspection-plan-list-1-shijian">
                  <div>
                    <span v-for="(items,index) in item.weeks">星期{{item.weeks[index]}}</span>
                    <!--<span>星期{{item.weeks[1]}}</span>-->
                    <!--<span>星期{{item.weeks[2]}}</span>-->
                    <span>{{item.time}}</span>
                  </div>
                  <div class="inspection-plan-list-1-shijian-qian">{{item.checkPlamNodeVOs[0].name}}</div>
                </div>
                <div class="inspection-plan-list-1-tubiao">
                  <span><img @click="seeXunjianPlan(item.id)"  src="../../assets/bianji.png" alt=""></span>
                  <span><img @click="deleteXunjianPlan()"  class="inspection-plan-list-1-tubiao-shanchu" src="../../assets/shanchu.png" alt=""></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="new-background-background-button">
          <div @click="planTanque($event,false)" class="confirm">
            确认
          </div>
          <div  @click="planTanguan($event,false)"   class="cancel">
            取消
          </div>
        </div>
      </div>
    </el-dialog>
    <!--重要提醒弹窗-->
    <el-dialog :visible.sync="isShow2" width="550px">
      <div slot="title" class="new-background-important-top">
        <span class="tixing-png"><img src="../../assets/zhongyaotixing.png" alt=""></span>
        <span class="tixing-text">重要提醒</span>
        <!--<span class="tixing-guanbi-png"><img  @click="clooseImportant($event,false)" src="../../assets/guanbi_01.png" alt=""></span>-->
      </div>
      <div class="new-background-important-content">
        <div class="new-background-important-content-center">
          连接成功！
        </div>
      </div>
    </el-dialog>
    <!--设置弹窗-->
    <el-dialog :visible.sync="isShow3"  width="700px">
      <div slot="title" class="new-background-setup-top">
        <div class="new-background-setup-top-choose">
          <span>选择数据库</span>
          <div class="new-background-setup-top-choose-select">
            <el-select v-model="valueChoose"  placeholder="请选择">
              <el-option
                v-for="(item,index) in options1"
                :key="index"
                :value="item.label">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="new-background-setup-top-name">
          <span>数据库名称</span>
          <div class="new-background-setup-top-name-input">
            <el-input v-model="input1" placeholder="请输入内容"></el-input>
          </div>
        </div>
      </div>
      <div class="new-background-setup">
        <div class="new-background-setup-center">
          <div class="new-background-setup-center-left">
            <div class="new-background-setup-center-left1">
              <span class="new-background-setup-center-left1-span1">访问地址</span>
              <div class="new-background-setup-center-left1-input" id="inputAdress">
                <el-input v-model="inputAdress" placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="new-background-setup-center-left1">
              <span class="new-background-setup-center-left1-span2">端口号</span>
              <div class="new-background-setup-center-left1-input" id="inputIp">
                <el-input v-model="inputIp" placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="new-background-setup-center-left1">
              <span class="new-background-setup-center-left1-span3">用户名</span>
              <div class="new-background-setup-center-left1-input" id="inputUsername">
                <el-input v-model="inputUsername" placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="new-background-setup-center-left1">
              <span class="new-background-setup-center-left1-span4">密码</span>
              <div class="new-background-setup-center-left1-input" id="inputPasscord">
                <el-input v-model="inputPasscord" placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="new-background-setup-center-left1">
              <span class="new-background-setup-center-left1-span5">数据库盘符地址</span>
              <div class="new-background-setup-center-left1-input">
                <el-input v-model="inputDrive" placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="new-background-setup-center-left1">
              <span class="new-background-setup-center-left1-span6">日志地</span>
              <div class="new-background-setup-center-left1-input">
                <el-input v-model="inputLog" placeholder="请输入内容"></el-input>
              </div>
            </div>
          </div>
          <div class="new-background-setup-center-right">
            <div class="new-background-setup-center-right-content">
              <div class="new-background-setup-center-right-content-top">
                命中率警告阈值设置
              </div>
              <div class="new-background-setup-center-right-content-center">
                <div class="new-background-setup-center-right-content-center-1">
                  <span>查询缓存命中率</span>
                  <div class="new-background-setup-center-right-content-center-1-jishu">
                    <el-input-number style="width:85px;height:40px;" type="number" v-model="num1" controls-position="right" @change="handleChange" :min="0" :max="100"></el-input-number>
                  </div>
                  <div class="fenhao">%</div>
                </div>
                <div class="new-background-setup-center-right-content-center-1">
                  <span>线程缓存命中率</span>
                  <div class="new-background-setup-center-right-content-center-1-jishu">
                    <el-input-number style="width:85px;height:40px; " v-model="num2" controls-position="right" @change="handleChange" :min="0" :max="100"></el-input-number>
                  </div>
                  <div class="fenhao">%</div>
                </div>
                <div class="new-background-setup-center-right-content-center-1">
                  <span>索引缓冲读命中率</span>
                  <div class="new-background-setup-center-right-content-center-1-jishu">
                    <el-input-number style="width:85px;height:40px; " v-model="num3" controls-position="right" @change="handleChange" :min="0" :max="100"></el-input-number>
                  </div>
                  <div class="fenhao">%</div>
                </div>
                <div class="new-background-setup-center-right-content-center-1">
                  <span>索引缓冲写命中率</span>
                  <div class="new-background-setup-center-right-content-center-1-jishu">
                    <el-input-number style="width:85px;height:40px; " v-model="num4" controls-position="right" @change="handleChange" :min="0" :max="100"></el-input-number>
                  </div>
                  <div class="fenhao">%</div>
                </div>
                <div class="new-background-setup-center-right-content-center-1">
                  <span>InnoDB缓冲读命中率</span>
                  <div class="new-background-setup-center-right-content-center-1-jishu">
                    <el-input-number style="width:85px;height:40px; " v-model="num5" controls-position="right" @change="handleChange" :min="0" :max="100"></el-input-number>
                  </div>
                  <div class="fenhao">%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="new-background-setup-button">
          <div class="new-background-setup-button-1"  @click="testConnection($event,true)">测试连接</div>
          <div class="new-background-setup-button-2"  @click="saveSetup($event,false)">保存</div>
          <div class="new-background-setup-button-3"  @click="clooseSetup($event,false)">取消</div>
        </div>
      </div>
    </el-dialog>
    <!--错误日志弹窗-->
    <el-dialog :visible.sync="isShow4" width="550px">
      <div slot="titie" class="new-background-err-top">
        <div class="new-background-err-top-orange"></div>
        <div class="new-background-err-top-text">错误日志</div>
        <div class="new-background-err-top-guanbi">
          <img @click="rizhiGuan($event,false)" src="../../assets/guanbi_01.png" alt="">
        </div>
      </div>
      <div class="new-background-err">
        <div class="new-background-err-content">
          <div class="new-background-err-content-center">
            <div class="new-background-err-content-center-1">
              <div>2017-11-22 16:55:53</div>
              <div>
                <div> &nbsp;  &nbsp; &nbsp; shell> mv host_name.err host_name.err-old</div>
                <div>   &nbsp; &nbsp; &nbsp; shell> mysqladmin flush-logs</div>
                <div>  &nbsp; &nbsp; &nbsp;  shell> mv host_name.err-old backup-directory</div>
                <br>
              </div>
            </div>
            <div class="new-background-err-content-center-1">
              <div>2017-11-22 16:55:53</div>
              <div>
                <div> &nbsp;  &nbsp; &nbsp; shell> mv host_name.err host_name.err-old</div>
                <div>   &nbsp; &nbsp; &nbsp; shell> mysqladmin flush-logs</div>
                <div>  &nbsp; &nbsp; &nbsp;  shell> mv host_name.err-old backup-directory</div>
                <br>
              </div>
            </div>
            <div class="new-background-err-content-center-1">
              <div>2017-11-22 16:55:53</div>
              <div>
                <div> &nbsp;  &nbsp; &nbsp; shell> mv host_name.err host_name.err-old</div>
                <div>   &nbsp; &nbsp; &nbsp; shell> mysqladmin flush-logs</div>
                <div>  &nbsp; &nbsp; &nbsp;  shell> mv host_name.err-old backup-directory</div>
                <br>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--查看报告-->
    <el-dialog :visible.sync="isShow5" width="750px">
      <div slot="title" class="new-background-inspection-top">
        <div class="new-background-inspection-top-content">
          <div><img src="../../assets/shujuku.png" alt=""></div>
          <div class="shujuku-inspection-zong">
            <div>
              <span class="shujuku-name" v-model="tempTableDataName">{{tempTableDataName}}</span>
              <span class="shujuku-way">自动检测</span>
            </div>
            <div>
              <span class="shujuku-date">{{tempTableDataTime}}</span>
              <span class="shujuku-times"></span>
            </div>
          </div>
          <div class="shujuku-inspection-png">
            <img src="../../assets/jiance.png" alt="">
          </div>
          <div class="shujuku-inspection-daochu-png">
            <img src="../../assets/daochu_02.png" alt="">
          </div>
        </div>
      </div>
      <div class="new-background-inspection" >
        <el-carousel height="550px" arrow="always" trigger="click" :autoplay="false">
          <el-carousel-item  v-for="(item,index) in tempTableData" :key="index">
            <div class="new-background-inspection-content">
              <el-table
                :data="item"
                height="493"
                class="text-center"
                border
                style="width: 566px">
                <el-table-column
                  prop="date"
                  style="color:#555555;font-size: 16px;"
                  label="巡检内容"
                  width="223px">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="状态"
                  width="139px">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="数据记录">
                </el-table-column>
              </el-table>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!--<div class="xuanze">-->
        <!--<div class="zuo-png"><img src="../../assets/zuo_01.png" alt=""></div>-->
        <!--<div class="you-png"><img src="../../assets/you_01.png" alt=""></div>-->
      <!--</div>-->
    </el-dialog>
    <!--正在检测-->
    <el-dialog :visible.sync="isShow6"  width="680px">
      <div slot="title" class="new-background-jiance-top">
        <div class="new-background-jiance-top-content">
          <div>
            <img src="../../assets/shujuku.png" alt="">
          </div>
          <div class="jiancenew-background-jiance-text">
            <div class="jiancenew-background-jiance-text-shen">数据库集群-01</div>
            <div>正在检测...</div>
          </div>
          <div class="jiancenew-background-jiance-png" >
            <img  @click="stopDetection()"  src="../../assets/jiancezhong.png" alt="">
          </div>
        </div>
      </div>
      <div class="new-background-jiance" >
        <!--<div class="new-background-jiance-guanbi">-->
          <!--<img @click="clooseNowJian($event,false)" src="../../assets/guanbi_01.png" alt="">-->
        <!--</div>-->
        <div class="new-background-jiance-center">
          <div class="new-background-jiance-center-left">
            <div class="first-qiu"></div>
            <div class="first-xian"></div>
            <div class="second">
              <div class="second-left">
                <div class="second-left-qiu"></div>
                <div class="second-left-xian"></div>
              </div>
              <div class="second-right">
                <div class="second-right-text1">数据库存储</div>
                <div class="second-right-text2">检查数据库用到的S5600T上的LUN的绑定磁盘状态</div>
              </div>
            </div>
            <div class="third">
              <div class="third-left">
                <div class="third-left-qiu"></div>
                <div class="third-left-xian"></div>
              </div>
              <div class="third-right">
                <div class="third-right-text1">数据库盘服务检查</div>
                <div class="third-right-text2">检查数据库的系统盘是否正常</div>
                <div class="third-right-text3">已将异常记录到异常报告中</div>
              </div>
            </div>
            <div class="fourth">
              <div class="fourth-left">
                <div class="fourth-left-qiu"></div>
                <div class="fourth-left-xian"></div>
              </div>
              <div class="fourth-right">
                <div class="fourth-right-text1">数据库盘空间检查</div>
                <div class="fourth-right-text2">检查数据盘使用情况</div>
              </div>
            </div>
            <div class="fifth">
              <div class="fifth-left">
                <div class="fifth-left-qiu"></div>
                <div class="fifth-left-xian"></div>
              </div>
              <div class="fifth-right">
                <div class="fifth-right-text1">日志</div>
                <div class="fifth-right-text2">数据库错误日志抓取</div>
              </div>
            </div>
            <div class="sixth">
              <div class="sixth-left">
                <div class="sixth-left-qiu"></div>
              </div>
              <div class="sixth-right">
                <div class="sixth-right-text1">数据库巡检已完成</div>
                <div class="sixth-right-text2">巡检详细报告已记录在巡检历史中</div>
              </div>
            </div>
          </div>
          <div class="new-background-jiance-center-right">
            <div  @click="seeRizhi($event,true)" class="right-first">
              查看日志
            </div>
            <div @click="seeBaogao($event,true)" class="right-second">
              查看报告
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--颜色选择器-->
    <!--<div class="choose-color-background">-->
      <!--<div class="choose-color-background-left">-->
        <!--<div class="color1"></div>-->
        <!--<div class="color2"></div>-->
        <!--<div class="color3"></div>-->
        <!--<div class="color4"></div>-->
        <!--<div class="color5"></div>-->
        <!--<div class="color6"></div>-->
        <!--<div class="color7"></div>-->
      <!--</div>-->
      <!--<div class="choose-color-background-right">-->
        <!--<div class="color8"></div>-->
        <!--<div class="color9"></div>-->
      <!--</div>-->
    <!--</div>-->
  </main-container>
</template>

<script>
  import Vue from 'vue'
  import './equipment-home.css'
  import { GlobalVar } from "../../../static/js/utils";
  import template from '../Packages/MainContainer.vue'

  Vue.component(template.name,template);
  const cityOptions = ['1', '2', '3', '4', '5', '6', '7'];
  export default {
    name: "d-b-polling",
    data() {
      return {
        outerVisible1:true,
        isShow:false,
        isShow1:false,
        isShow2:false,
        isShow3:false,
        isShow4:false,
        isShow5:false,
        isShow6:false,
        isDevice: true,
        isDeviceType: false,
        pageNum: 0,
        pageSize: 10,
        goToPage: 10,
        total: 10,
        totalPages: 1,
        deviceDispose: '添加设备',
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        formLabelWidth: '120px',
        /*左侧统计数据*/
        totalData: {},
        deviceFlag: '设备名称',
        /*右侧设备列表信息*/
        deviceListParameter: {
          deviceKeyLike: '',
          ipLike: '',
          deviceTypeId: '',
          sortField: 'name',
          ascDesc: 'asc',
          pageNum: 1,
          pageSize: 31,
        },
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
        form: {
          id: null,
          name: '',
          devTypeId: null,
          location: '',
          code: '',
          ip: ''
        },
        formData: {},
        deviceTypes: [],
        deviceTypesParameter: {
          id: null,
          name: '',
          ico: '',
        },
        time: '',
        input: '',
        deviceOrMaintain: '添加维护类别',
        checked: false,
        checkedCities1: ['3', '5'],
        weeks: cityOptions,
//        value2: new Date(2016, 9, 10, 18, 40),
        value2:'',
        value1: '',
        valueZ:'',
        valueQ:'',
        optionsZ: [{
          value: '选项1',
          label: '全部'
        }, {
          value: '选项2',
          label: '异常'
        }, {
          value: '选项3',
          label: '正常'
        }],
        optionsQ: [{
          value: '选项1',
          label: '全部'
        }, {
          value: '选项2',
          label: '已查看'
        }, {
          value: '选项3',
          label: '未查看'
        }],
        value: '',
        checked1:true,
        checked2:false,
        value3:true,
        valueChoose:'',
        options1: [{
          value: '选项1',
          label: 'mysql'
        }],
        input1:'',
        input2:'',
        num8: 0,
        tableData3: [],
        //获取巡检列表数据
        inspectionListData:{
        },
        //获取巡检历史列表
        historyListData:{
        },
        KeyLike:'',
        //测试连接
        testConnectionmsg:{},
        outerVisible:false,
        Array:{
        },
        //获取巡检计划列表
        inspectionPlan:{
        },
        inputAdress:'',
        inputIp:'',
        inputUsername:'',
        inputPasscord:'',
        inputDrive:'',
        inputLog:'',
        num1:'50',
        num2:'50',
        num3:'50',
        num4:'50',
        num5:'50',
//        seeBaogaoLength:'',
//        seeBaogaoText:{},
        tempTableData:[],
        tempTableDataName:'',
        tempTableDataTime:'',
        getDeviceListL:'',
        exceptionCount:'',
        newestExceptionTime:'',

      }
    },
    created() {
//      logSmallDotLine();
//      infoPush();
//      this.getStatistics();
//      this.getDeviceList(0);
      console.log(222)
      this.getinspectionListData();
      this.gethistoryListData();
      this.getInspectionPlan();
    },
    methods: {
      switcher(e, boo) {
        $(e.currentTarget).siblings().removeClass('active');
        $(e.currentTarget).addClass('active');
        this.isDevice = boo;
        pageNumber(23, 1, this, 'paging1');
      }      ,
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
        this.dialogFormVisible = false;
        /*切换*/
      },
      appointToPage() {

      },
      changeBorderColor() {

      },
      /*提交设备类别*/
      selectImage(str, e) {
        $(e.currentTarget).parent().siblings().find('div.type-img-info').removeClass('active');
        $(e.currentTarget).addClass('active');
        this.deviceTypesParameter.ico = str;
      },
      /*添加类别*/
      addType(str) {
        this.dialogFormVisible2 = true;
        this.deviceOrMaintain = str;
        if (str === '添加设备类别') {
          this.isDeviceType = true
        } else {
          this.isDeviceType = false
        }
      },
      submitType() {
        this.dialogFormVisible2 = false;
        // if(this.deviceTypesParameter.name === '' || this.deviceTypesParameter){
        //
        // }
      },
//     点击新增数据库集群
      updataShu(e, boo) {
       console.log("新增数据库集群")
        this.isShow3 = boo;
      } ,
      //测试连接   勾勾
      testConnection(e,boo){
        let self = this;
        console.log("点击测试连接")
//        this.isShow3 = true;
        this.isShow2 = boo;
        $.ajax({
          type: "get",
          url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheck/testLink?type=mysql&ip=127.0.0.1&username=root&userpwd=123456&port=3306",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          success: function (result) {
            console.log(result);
            if (Number(result.status) == 200) {
              console.log("测试连接")
              console.log(result.msg)
              self.testConnectionmsg = result.msg;
            }
          },
          error: function (result) {
            console.log("测试连接失败")
            console.log(result);
          }
        })
      },
      //关闭设置
      clooseSetup(e,boo){
        console.log("关闭设置")
        this.isShow3 = boo;
      },
      //保存设置    新增数据库巡检  需要传值  勾勾
      saveSetup(e,boo){
        let self = this;
        console.log(self.valueChoose)
        console.log(self.input1)
        console.log(self.inputIp)
        console.log(self.inputAdress)
        console.log(self.inputUsername)
        console.log(self.inputPasscord)
        console.log(self.inputDrive)
        console.log(self.inputLog)
        console.log(self.num1)
        console.log(self.num2)
        console.log(self.num3)
        console.log(self.num4)
        console.log(self.num5)
        let valueChoose=self.valueChoose   //mysql
        let input1=self.input1   //数据库名称
        let inputIp=self.inputIp     //端口号
        let inputAdress=self.inputAdress   //172.16.6.14
        let inputUsername=self.inputUsername    //用户名
        let inputPasscord=self.inputPasscord    //密码
        let inputDrive=self.inputDrive    //盘符
        let inputLog=self.inputLog    //日志
        let num1=self.num1
        let num2=self.num2
        let num3=self.num3
        let num4=self.num4
        let num5=self.num5
//        this.isShow3 = boo;

        if(inputAdress==''){
          $("#inputAdress").css(
            {
              border:"1px solid red"
            }
          )
        }
        if(inputIp==''){
          $("#inputIp").css(
            {
              border:"1px solid red"
            }
          )
        }
        if(inputUsername==''){
          $("#inputUsername").css(
            {
              border:"1px solid red"
            }
          )
        }
       if(inputPasscord==''){
          $("#inputPasscord").css(
            {
              border:"1px solid red"
            }
          )
        }
        if(inputAdress!==''&&inputAdress!=''&&inputUsername!=''&&inputPasscord!=''){
          self.isShow3 = boo;
          $.ajax({
            type: "POST",
            url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheck?type="+valueChoose+"&ip="+inputAdress
            +"&username="+inputUsername+"&userpwd="+inputPasscord+"&port="+inputIp+"&keyBufferReadHits="+num1+"&keyBufferWriteHits="+num2
            +"&innodbBufferReadHits="+num3+"&queryCacheHits="+num4+"&threadCacheHits="+num5+"&nodeName="+input1+"&ip="+inputAdress+"&driveDisk="+inputDrive+"&logAddr="+inputLog,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            success: function (result) {
              if (Number(result.status) == 200) {
                console.log("点击设置png")
                console.log(result.data)
                self.inspectionListData = result.data;
              }
            },
            error: function (result) {
              console.log("点击保存失败")
              console.log(result);
            }
          })
        }
      },
      //关闭重要提醒
      clooseImportant(e,boo){
        console.log("关闭重要弹窗")
        this.isShow2 = boo;
      },
      //点击取消新增巡检计划
      cancelShu(e,boo){
        this.isShow = boo;
      },
      //点击确定新增计划    勾勾  id未确定
      newPlan(e,boo){
        this.isShow = boo;
        let self = this;
        console.log(self.checkedCities1)
        let checkedCities1Num=self.checkedCities1
        console.log(checkedCities1Num)
        var d = new Date(self.value2);
        let youWantTime=d.getHours() + ':' + d.getMinutes();
        console.log(youWantTime)
        $.ajax({
          type: "post",
          url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheckPlan?nodeIds=20&weeks="+checkedCities1Num+"&time="+youWantTime,
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          success: function (result) {
            console.log(result)
            if (Number(result.status) == 200) {
              console.log("新增计划成功")
            }
          },
          error: function (result) {
            console.log("新增计划失败")
            console.log(result);
          }
        })
      },
      //计数器
      handleChange(value) {
        console.log(value);
      },
      //点击设置png     勾勾
      clickSetupPng(e,boo,id){
        let self = this;
        let shuListid=id
        console.log(shuListid)
        console.log("点击设置png点击事件")
        this.isShow3 = boo;
        $.ajax({
          type: "get",
          url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheck/"+shuListid,
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          success: function (result) {
            if (Number(result.status) == 200) {
              console.log("点击设置png")
              console.log(result.data)
              //查看数组，传值
              self.valueChoose=result.data.type
              self.input1=result.data.nodeName
              self.inputIp=result.data.port
              self.inputAdress=result.data.ip
              self.inputUsername=result.data.username
              self.inputPasscord=result.data.userpwd
              self.inputDrive=result.data.driveDisk
              self.inputLog=result.data.logAddr
              self.num1=result.data.innodbBufferReadHits
              self.num2=result.data.keyBufferReadHits
              self.num3=result.data.keyBufferWriteHits
              self.num4=result.data.queryCacheHits
              self.num5=result.data.threadCacheHits
            }
          },
          error: function (result) {
            console.log("点击设置png失败")
            console.log(result);
          }
        })
      },
      //点击播放png   没有进入url  400
      clickPlayPng(e,boo,id){
        let self = this;
        this.isShow6 = boo;
        let shuListid=id
        console.log("点击播放png点击事件")
        $.ajax({
          type: "get",
          url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheck/start/"+shuListid,
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          success: function (result) {
            console.log(result);
            if (Number(result.status) == 200) {
              console.log("点击播放png")
              console.log(result)
            }
          },
          error: function (result) {
            console.log("点击播放png失败")
            console.log(result);
          }
        })
      },
      //关闭正在检测
      clooseNowJian(e,boo){
        this.isShow6 = boo;
      },
      //查看巡检历史列表   编号错误 活动数据
      seeHistoryList(e,boo,id){
        this.isShow5 = boo;
        this.outerVisible=boo;
        let self = this;
        let shuHistoryid=id
        console.log(shuHistoryid)
        //查看数据库的所有巡检计划
        $.ajax({
          type: "get",
          url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheck/getUnreadCheckReport/20",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          success: function (result) {
            if (Number(result.status) == 200) {

//              self.seeBaogaoLength=result.data.length
//              self.seeBaogaoText=result.data
              var data = result.data;
              /*
              *
              *  tableData3: [ {
                date: 'ss',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
              }],
              * */
              console.log(result.data)
              for(var i = 0;i<data.length;i++){
                var tempData = data[i].checkReportItemModels;
                self.tempTableDataName=data[i].name
                self.tempTableDataTime=data[i].lastUpdateTime
                var ss = [];
                for(var j = 0;j<tempData.length;j++){
//                  self.tableData3.push
                  ss.push({
                    date:tempData[j].checkContent,
                    name:tempData[j].normal,
                    address:tempData[j].id
                  })
                }
                self.tempTableData.push(ss);
//                console.log(data[i])
              }
            }
          },
          error: function (result) {
            console.log("查看报告失败")
            console.log(result);
          }
        })
        //查看后变为true
//        $.ajax({
//          type: "get",
//          url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheck/record/readStatusTrue/149",
//          headers: {
//            "Content-Type": "application/json; charset=utf-8"
//          },
//          success: function (result) {
//            console.log(result)
//            if (Number(result.status) == 200) {
//              console.log("查看巡检历史列表变为true")
//            }
//          },
//          error: function (result) {
//            console.log("查看巡检历史列表变为true失败")
//            console.log(result);
//          }
//        })
      },
      //新增巡检计划
      updataPlan(e,boo){
        this.isShow = boo;
      },
      //巡检计划弹窗关闭
      planTanguan(e,boo){
        this.isShow1 = boo;
        this.outerVisible=boo;
      },
      //巡检计划弹窗确认
      planTanque(e,boo){
        this.isShow1 = boo;
        this.outerVisible=boo;
      },
      //查看日志
      seeRizhi(e,boo){
        this.isShow4 = boo;
      },
      //查看报告   勾勾
      seeBaogao(e,boo,id){
        this.isShow5 = boo;
        let shuListid=id
        let self = this;
        $.ajax({
          type: "get",
          url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheck/getUnreadCheckReport/"+shuListid,
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          success: function (result) {
            if (Number(result.status) == 200) {

//              self.seeBaogaoLength=result.data.length
//              self.seeBaogaoText=result.data
              var data = result.data;
              /*
              *
              *  tableData3: [ {
                date: 'ss',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
              }],
              * */
              console.log(result.data)
              for(var i = 0;i<data.length;i++){
                var tempData = data[i].checkReportItemModels;
                self.tempTableDataName=data[i].name
                self.tempTableDataTime=data[i].lastUpdateTime
                var ss = [];
                for(var j = 0;j<tempData.length;j++){
//                  self.tableData3.push
                  ss.push({
                    date:tempData[j].checkContent,
                    name:tempData[j].normal,
                    address:tempData[j].id
                  })
                }
                self.tempTableData.push(ss);
//                console.log(data[i])
              }
            }
          },
          error: function (result) {
            console.log("查看报告失败")
            console.log(result);
          }
        })
      },
      //错误日志弹窗关
      rizhiGuan(e,boo){
        this.isShow4 = boo;
      },
      //查看报告弹窗关
      baogaoGuan(e,boo){
        this.isShow5 = boo;
      },
      //获取巡检列表数据    勾勾
      getinspectionListData(){
        let self = this;
        $.ajax({
          type: "get",
          url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheck/index",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          success: function (result) {
            if (Number(result.status) == 200) {
              console.log("获取巡检列表数据")
              console.log("1212")
              console.log(result.data.databaseNodeItemVOs)
              self.inspectionListData = result.data.databaseNodeItemVOs;
              self.exceptionCount=result.data.exceptionCount
              self.newestExceptionTime=result.data.newestExceptionTime
            }
          },
          error: function (result) {
            console.log(result);
          }
        })
      },
      //获取巡检历史列表   勾勾
      gethistoryListData(){
        let self = this;
        console.log(self.KeyLike)
        console.log(self.value1)
        console.log(self.valueZ)
        console.log(self.valueQ)
        $.ajax({
          type: "get",
          url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheckHistory?number=120&page=1&name=0", //&time=2018-01&isRead=true&normal=false
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          success: function (result) {
            if (Number(result.status) == 200) {
              console.log("获取巡检历史列表")
              console.log(result.data)
              self.historyListData = result.data;
            }
          },
          error: function (result) {
            console.log(result);
          }
        })
      },
      //删除巡检列表数据    勾勾
      shanPng(e){
        console.log("删除巡检列表数据点击事件")
        let self = this;
        $.ajax({
          type: "get",
          url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheck/10",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          success: function (result) {
            console.log(result)
            if (Number(result.status) == 200) {
              console.log("删除巡检列表数据成功")
              self.historyListData = result.data;
            }
          },
          error: function (result) {
            console.log("删除巡检列表数据失败")
            console.log(result);
          }
        })
      },
      //巡检计划
      xunjianPlan(e,boo){
        this.isShow1=boo
      },
      //获取巡检计划列表  勾勾
      getInspectionPlan(){
        let self = this;
        $.ajax({
          type: "get",
          url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheckPlan/index?page=1&number=10",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          success: function (result) {
//            console.log(result.data)
            if (Number(result.status) == 200) {
              console.log("获取巡检计划列表")
              console.log(result.data)
              self.inspectionPlan = result.data;
            }
          },
          error: function (result) {
            console.log("获取巡检计划列表失败")
            console.log(result);
          }
        })
      },
      //删除巡检历史   400
      deleteXunjianPlan(){
        let self = this;
        $.ajax({
          type: "get",
          url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheckPlan/16",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          success: function (result) {
            console.log(result)
            if (Number(result.status) == 200) {
              console.log("删除巡检历史")
            }
          },
          error: function (result) {
            console.log("删除巡检历史失败")
            console.log(result);
          }
        })
      },
      //停止巡检  勾勾
      stopDetection(){
        let self = this;
        $.ajax({
          type: "get",
          url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheck/cancel/11",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          success: function (result) {
            console.log(result)
            if (Number(result.status) == 200) {
              console.log("停止巡检")
            }
          },
          error: function (result) {
            console.log("停止巡检失败")
            console.log(result);
          }
        })
      },
      //查看巡检计划
      seeXunjianPlan(id){
        let self = this;
        self.isShow=true;
        console.log(id)
        $.ajax({
          type: "get",
          url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheckPlan/"+id,
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          success: function (result) {
            if (Number(result.status) == 200) {
              console.log("查看巡检计划")
              console.log(result.data)
              console.log(result.data.time)
              self.value2=result.data.time
              self.checkedCities1=result.data.weeks
            }
          },
          error: function (result) {
            console.log("查看巡检计划失败")
            console.log(result);
          }
        })
      },
      show(e){
        let self=this
        if(e.keyCode == 13){
          console.log(self.KeyLike)
          console.log(self.value1)
          var d = new Date(self.value1);
          let youWantTime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
          console.log(youWantTime)
          console.log(self.valueZ)
          console.log(self.valueQ)
          let isRead=self.valueZ
          let isRead1;
          switch (isRead)
          {
            case '全部':isRead1='';break;
            case '正常':isRead1= true;break;
            case '异常':isRead1=false;break;
          }
          let normal=self.valueQ
          let normal1;
          switch (normal)
          {
            case '全部':normal1='';break;
            case '已查看':normal1= true;break;
            case '未查看':normal1=false;break;
          }
          let name=self.KeyLike
          $.ajax({
            type: "get",
            url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheckHistory?number=120&page=1&name="+name+"&time="+youWantTime+"&normal="+normal1+"&isRead="+isRead1, //&time=2018-01&isRead=true&normal=false
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            success: function (result) {
              if (Number(result.status) == 200) {
                console.log("获取巡检历史列表")
                console.log(result.data)
                self.historyListData = result.data;
              }
            },
            error: function (result) {
              console.log(result);
            }
          })

        }
      },
      choose() {
        let self=this

          console.log(self.KeyLike)
          console.log(self.value1)
          var d = new Date(self.value1);
          let youWantTime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
          console.log(youWantTime)
          console.log(self.valueZ)
          console.log(self.valueQ)
          let isRead=self.valueZ
          let isRead1;
          switch (isRead)
          {
            case '全部':isRead1='';break;
            case '正常':isRead1= true;break;
            case '异常':isRead1=false;break;
          }
          let normal=self.valueQ
          let normal1;
          switch (normal)
          {
            case '全部':normal1='';break;
            case '已查看':normal1= true;break;
            case '未查看':normal1=false;break;
          }
          let name=self.KeyLike
          $.ajax({
            type: "get",
            url: "http://192.168.0.29:8002/hisicompass-dbcheck/databaseCheckHistory?number=120&page=1&name="+name+"&time="+youWantTime+"&normal="+normal1+"&isRead="+isRead1, //&time=2018-01&isRead=true&normal=false
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            success: function (result) {
              if (Number(result.status) == 200) {
                console.log("获取巡检历史列表")
                console.log(result.data)
                self.historyListData = result.data;
              }
            },
            error: function (result) {
              console.log(result);
            }
          })

      }

    },
    mounted() {
      let router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      };
      GlobalVar.setHistoryRouter(router);
      pageNumber(23, 1, this, 'paging');
      pageNumber(23, 1, this, 'paging1');
//      logSmallDotLine();
    },
    updated() {
//      logSmallDotLine();
    }
  }
//  function pageNumber(pageCount, current, self, id) {
//    $("#paging1").CreatePage({
//      pageCount: pageCount,//总页数
//      current: current,//当前页码
//      backFn: function (page) {
//        console.log(page)
////        self.deviceListParameter.pageNum = page;
////        page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
////        self.getDeviceList(1);
//      }
//    });
//  }
  function pageNumber(pageCount, current, self, id) {
    $("#"+id).CreatePage({
      pageCount: pageCount,//总页数
      current: current,//当前页码
      backFn: function (page) {
        console.log(page)
//        self.deviceListParameter.pageNum = page;
        //page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
//        self.getDeviceList(1);
      }
    });
  }

  // 消息推送
//  function infoPush() {
//    console.log("消息推送")
//    var wsServer = 'ws://192.168.0.29:8002/hisicompass-dbcheck/websocketDatabaseCheck';
//    var websocket = new WebSocket(wsServer);
//    websocket.onopen = function(evt) {onOpen(evt)};
//    websocket.onclose = function(evt) {onClose(evt)};
//    websocket.onmessage = function(evt) {onMessage(evt)};
//    websocket.onerror = function(evt) {onError(evt)};
//    function onOpen(evt) {console.log("Connected to WebSocket server.");}
//    function onClose(evt) {console.log("Disconnected");}
//    function onMessage(evt) {
//      var timeStamp = startPolling.currentTimeStamp;
//      var data = JSON.parse(evt.data);
//      console.log("消息推送是"+data)
////		console.info
//
//      (data);
//      if(data.isFinish == "true"){
//        startPolling.pollingHint = '检测完成'
//      }
//      if(!startPolling.isStopPolling){
//        if(timeStamp == data.timeStamp){
//          startPolling.pollingData.push(data);
//        }
//      }
//    }
//    function onError(evt) {console.log('Error occured: ' + evt.data);}
//  }


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
    /*width: 137px;*/
    /*min-height: 1px;*/
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
    padding-bottom: 30px;
    padding-top: 30px;
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
    /*width: calc(100% - 151px);*/
    box-sizing: border-box;
    position: relative;
    width: 373px;
    height: 40px;
    margin-left: 30px;
  }

  .device-search-input input {
    text-align: left !important;
    text-indent: 25px;
    width: 100%;
    height: 40px;
  }

  .device-search-input span {
    position: absolute;
    background: url("../../assets/huiche.png") no-repeat 50% 50%;
    width: 17px;
    height: 37px;
    line-height: 40px;
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
    min-height: calc(100% - 184px);
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

  .type-img-info.image1 {
    background: url("../../assets/01.png") no-repeat 50% 50%;
  }

  .type-img-info.image2 {
    background: url("../../assets/02.png") no-repeat 50% 50%;
  }

  .type-img-info.image3 {
    background: url("../../assets/03.png") no-repeat 50% 50%;
  }

  .type-img-info.image4 {
    background: url("../../assets/04.png") no-repeat 50% 50%;
  }

  .type-img-info.image5 {
    background: url("../../assets/05.png") no-repeat 50% 50%;
  }

  .type-img-info.image6 {
    background: url("../../assets/06.png") no-repeat 50% 50%;
  }

  .type-img-info.image7 {
    background: url("../../assets/07.png") no-repeat 50% 50%;
  }

  .type-img-info.image8 {
    background: url("../../assets/08.png") no-repeat 50% 50%;
  }

  .type-img-info.image9 {
    background: url("../../assets/09.png") no-repeat 50% 50%;
  }

  .type-img {
    width: 100%;
  }


  .info-content-red{
    height: 170px;
    width: 170px;
    background-color: rgb(255,108,96);
    border-radius: 2px;
    margin: auto;
    margin-top: 30px;
  }
  .info-content-red-content{
    height: 59px;
    width: 72px;
    /*outline: 1px solid white;*/
    margin: auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
  .info-content-red-content:first-child{
    color:rgb(255,255,255) ;
    font-size: 18px;
  }
  .info-content-red-content-digital{
    width: 20px;
    height: 30px;
    color:rgb(255,255,255) ;
    font-size: 38px;
    margin: auto;
  }
  .info-content-botton{
    width: 100%;
    height: 345px;
    /*border: 1px solid red;*/
  }
  .info-content-botton-content-time{
    margin-top: 50px;
    height: 110px;
    width: 122px;
    /*outline:1px solid pink;*/
    margin-left: auto;
    margin-right: auto;
  }
  .time-png{
    height: 20px;
    width: 20px;
    margin: auto;
  }
  .time-alarm{
    font-family: MicrosoftYaHei;
    margin-top: 11px;
    font-size: 16px;
    text-align: center;
    color: rgb(153,153,153);
  }
  .time-new{
    height: 50px;
    margin-top: 20px;
    font-size: 22px;
    text-align: center;
    color: rgb(85,85,85);
  }
  .vertical{
    height: 23px;
    width: 1px;
    background-color: #999999;
    margin: auto;
    margin-top: 50px;
    margin-bottom: 20px;
  }
  .plan-inspection{
    margin-top: 20px;
    color:rgb(255,108,96);
    font-size: 18px;
    text-align: center;
  }
  .page{
    /*border:1px solid red;*/
  }
  .tool-content-list{
    width: 1320px;
    /*border:1px solid pink;*/
    position: relative;
    margin-left: 30px;
  }
  .tool-content-list-1{
    width: 635px;
    height: 117px;
    background-color: #f5f5f5;
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .tool-content-list-1-left{
    width: 416px;
    height: 100%;
    overflow:hidden;
    /*border-right: 1px solid #c1c1c1;*/
    display: inline-block;
  }
  .tool-content-list-1-left-content{
    width: 262px;
    height: 44px;
    margin-top: 36px;
    margin-left: 20px;
    /*outline: 1px solid palevioletred;*/
    display: inline-block;
  }
  .shuju-png{
    display: inline-block;
  }
  .shuju-ming{
    width: 200px;
    display: inline-block;
    /*outline: 1px solid green;*/
    margin-left: 10px;
    vertical-align: baseline;
  }
  .shuju-src{
    width: 46px;
    height: 43px;
    /*outline: 1px solid red;*/
    display: inline-block;
  }
  .img-png{
    vertical-align: baseline;
  }
  .shuju-ming-text1{
    font-size: 16px;
    color: #707070;
  }
  .shuju-ming-text2{
    font-size: 12px;
    color:#b3b3b3
  }
  .tool-content-list-1-right{
    display: inline-block;
    width: 216px;
    height: 100%;
    /*outline: 1px solid red;*/
    float: right;
    overflow: hidden;
  }
  .tool-content-list-1-right-content{
    width: 192px;
    height: 80px;
    border-left: 1px solid #c1c1c1;   /*留*/
    display: inline-block;
    margin-top: 19px;
  }
  .tool-content-list-1-right-content-tubiao{
    margin-top:18px;
    width: 178px;
    height:42px;
    margin-left: 20px;
    /*outline: 1px solid red;*/
    display: inline-block;
  }
  .did-see{
    width: 48px;
    height:42px;
    font-size: 16px;
    color: rgb(85,85,85);
    position: relative;
    text-align: center;
    display: inline-block;
  }
  .digital{
    font-size: 20px;
    color:rgb(251,179,33);
    display: inline-block;
  }
  .tubiao-da{
    width: 92px;
    margin-left: 38px;
    display: inline-block;
    position: relative;
    top:-40px;
    left: 38px;
  }
  .tubiao-da img{
    /*vertical-align: baseline;*/
  }
  .tubiao-zhong{
    margin-left: 8px;
    /*margin-right: 10px;*/
  }
  .tubiao-last{
    margin-left: 8px;
  }
  .new-shuju{
    width: 635px;
    height: 117px;
    background-color: #f5f5f5;
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .new-shuju-content{
    margin-left: 244px;
    margin-top: 46px;
    width: 158px;
    height: 25px;
  }
  .new-shuju-content>span>img{
    cursor: pointer;
  }
  .new-shuju-text{
    margin-left: 10px;
    color: rgb(85,85,85);
    font-size: 16px;
  }

  /*新增*/
  .new-background{
    position: absolute;
    top:0px;
    left:0px;
    width: 1903px;
    height: 100%;
    background-color: rgba(220, 220, 220, 0.2);
    overflow-x: hidden;

  }
  .new-background-background{
    width: 907px;
    /*height: 410px;*/
    background-color: rgb(255,255,255);
    border-radius: 10px;
    position: relative;
    /*left: 507px;*/
    /*top:245px;*/
  }
  .new-background-background-top{
    height: 72px;
    width: 100%;
    /*border-bottom: 1px solid #d3d3d3;*/
    position: relative;
  }
  .new-top-left{
    width: 124px;
    height: 18px;
    position: relative;
    top: 27px;
    left: 28px;
  }
  .new-top-left-green{
    width: 8px;
    height: 18px;
    background-color: rgb(37,219,118);
  }
  .new-top-left-text,.new-top-left-green{
    display: inline-block;
  }
  .new-top-left-text{
    margin-left: 10px;
    color: rgb(85,85,85);
    font-size: 16px;
    position: relative;
    top: -3px;
  }
  .new-top-right{
    display: inline-block;
    position: relative;
    left:858px;
    top: 10px;
  }
  .new-background-background-center{
    /*height: 269px;*/
    position: relative;
  }
  .new-background-background-center-content{
    /*height: 204px;*/
    /*position: relative;*/
    /*top:21px;*/
    /*left:30px;*/
    /*margin-top: 21px;*/
    margin-left: 30px;
    /*outline:1px solid red;*/
  }
  .choose-shujuku{
    font-size: 14px;
    color: rgb(85,85,85);
  }
  .choose-data{
    font-size: 14px;
    color: rgb(85,85,85);
    margin-top: 29px;
  }
  .perform-time{
    font-size: 14px;
    color: rgb(85,85,85);
    margin-top: 29px;
  }
  .new-background-background-button{
    height: 68px;
    background-color: rgb(245,245,245);
    position: relative;
  }
  .confirm{
    width: 160px;
    background-color: rgb(88,201,243);
    border-radius: 2px;
    color:white;
    font-size: 16px;
    text-align: center;
    line-height: 40px;
    position: relative;
    left:547px;
    top: 14px;
    display: inline-block;
  }
  .cancel{
    width: 160px;
    line-height: 40px;
    position: relative;
    color:white;
    background-color: rgb(193,193,193);
    border-radius: 2px;
    font-size: 16px;
    text-align: center;
    display: inline-block;
    left:553px;
    top:14px;
  }
  .new-background-background-plan{
    z-index: 1;
  }

/*列表*/
  .data-choose{
    margin-left: 10px;
  }
  .inspection-status{
    width: 230px;
    height: 36px;
    /*outline:1px solid red;*/
    margin-left: 20px;
    position: relative;
    top: -7px;
    display: inline-block;
  }
  .block{
    display: inline-block;
  }
  .inspection-status-text{
    /*line-height:36px;*/
    width: 83px;
    height: 17px;
    border-left:10px solid #18d96e;
    position: relative;
    top:9px;
    display: inline-block;
  }
  .inspection-status-text span{
    line-height: 17px;
    position: relative;
    left:9px;
    top:-2px;
  }
  .select-inspection-status{
    width: 134px;
    height: 36px;
    margin-left: 13px;
    display: inline-block;
    position: absolute;
    top:-2px;
  }
  .export-png{
    position: relative;
    left:120px;
  }
  .list-zong1{
    width: 1290px;
    height: 157px;
    margin-left: 30px;
    margin-top: 20px;
    /*outline: 1px solid red;*/
  }
  .list-zong1-choose{
    width: 1290px;
    height: 40px;
    background-color: #f5f5f5;
  }
  .list-zong1-choose>div{
    line-height: 40px;
    margin-left: 10px;
  }
  .list-zong1-content{
    width: 1290px;
    height: 117px;
    /*border: 1px solid green;*/
    position: relative;
  }
  .list-zong1-content-left,.list-zong1-content-center{
    display: inline-block;
  }
  .list-zong1-content-left{
    width: 49px;
    height: 100%;
    position: relative;
  }
  .list-zong1-content-left-content{
    height: 67px;
    width: 12px;
    /*outline: 1px solid deeppink;*/
    margin-left: 14px;
  }
  .list-zong1-content-left-content-shu{
    width: 1px;
    height: 58px;
    background-color: #c1c1c1;
    margin-left: 6px;
  }
  .list-zong1-content-left-content-qiu{
    width: 12px;
    height: 12px;
    border-radius: 6px;
    background-color: #18d96e;
    margin-top: 2px;
  }
  .list-zong1-content-center{
    width: 646px;
    height: 117px;
    /*outline: 1px solid purple;*/
    position: absolute;
  }
  .list-zong1-content-center-kuang{
    position: relative;
    top: 28px;
    display: inline-block;
  }
  .el-checkbox__inner{
    width: 20px;
    height: 20px;
  }
  .list-zong1-content-center-shujuku{
    width: 507px;
    height: 117px;
    /*outline:1px solid darkblue;*/
    display: inline-block;
    margin-left: 20px;
  }
  .shujuku-png{
    position: relative;
    top:24px;
  }
  .shujuku-ming{
    font-family: MicrosoftYaHei;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0px;
    letter-spacing: 0px;
    color: #555555;
  }
  .shujuku-time{
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0px;
    letter-spacing: 0px;
    color: #999999;
  }
  .shujuku-tu,.shujuku-zong,.shujuku-condition{
    display: inline-block;
  }
  .shujuku-zong{
    position: relative;
    top:35px;
    left:11px;
  }
  .shujuku-condition{
    width: 275px;
    height: 20px;
    position: relative;
    left:50px;
    top:25px;
    /*outline: 1px solid palevioletred;*/
  }
  .shujuku-condition span{
    width: 76px;
    height: 20px;
  }
  .shujuku-condition1{
    width: 76px;
    height: 20px;
    border: solid 1px #ff6c60;
    color: #ff6c60;
    font-size: 14px;
  }
  .shujuku-condition2{
    width: 76px;
    height: 20px;
    border: solid 1px #58c9f3;
    color: #58c9f3;
    font-size: 14px;
    margin-left: 10px;
    margin-right: 10px;
  }
  .shujuku-condition3{
    width: 76px;
    height: 20px;
    border: solid 1px  #fbb321;
    color:#fbb321;
    font-size: 14px;
  }
  .shujuku-condition span{
    display: inline-block;
    text-align: center;
    line-height: 20px;
  }
  .list-zong1-content-center-shujuku-abnormal{
    display: inline-block;
    height: 80px;
    width: 98px;
    border-left:1px solid #c1c1c1;
    position: absolute;
    top:19px;
  }
  .shujuku-abnormal{
    width: 64px;
    height: 17px;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0px;
    letter-spacing: 0px;
    color: #555555;
    position: relative;
    top:37px;
    left:20px;
  }
  .shujuku-abnormal-shu{
    width: 10px;
    height: 17px;
    font-family: MicrosoftYaHei;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0px;
    letter-spacing: 0px;
    color: #ff6c60;
    position: relative;
    left: 19px;
    top: 40px;
  }
  .list-zong1-content-right{
    display: inline-block;
    position: absolute;
    top:51px;
    left:1189px;
  }

  /*巡检计划弹窗*/
  .new-inspection-plan{
    width: 847px;
    height: 36px;
    border: solid 1px #e6e6e6;
    position: relative;
  }
  .new-inspection-plan>div{
    width: 123px;
    height: 20px;
    position: relative;
    left:362px;
    top:8px;
  }
  .inspection-plan-list{
    /*position: relative;*/
    /*top:20px;*/
    margin-top: 20px;
  }
  .inspection-plan-list-1{
    width: 847px;
    height: 66px;
    background-color: #f5f5f5;
    position: relative;
    /*outline: 1px solid red;*/
    margin-bottom: 10px;
  }
  .inspection-plan-list-1-kaiguan{
    position: relative;
    left:32px;
    top:25px;
    display: inline-block;
    /*outline: 1px solid red;*/
  }
  .inspection-plan-list-1-jihua{
    display: inline-block;
    width: 42px;
    height: 16px;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0px;
    letter-spacing: 0px;
    color: #555555;
    position: relative;
    left:50px;
    top:25px;
    /*outline: 1px solid red;*/
  }
  .inspection-plan-list-1-shijian{
    /*width: 175px;*/
    height: 34px;
    /*outline: 1px solid red;*/
    display: inline-block;
    position: absolute;
    left: 164px;
    top:13px;
  }
  .inspection-plan-list-1-shijian span{
    line-height: 0px;
    letter-spacing: 0px;
    color: #555555;
    font-size: 14px;
    margin-right: 20px;
  }
  .inspection-plan-list-1-shijian-qian{
    line-height: 0px;
    letter-spacing: 0px;
    color: #888888;
    font-size:14px;
    margin-top: 15px;
  }
  .inspection-plan-list-1-tubiao{
    display: inline-block;
    position: absolute;
    top:24px;
    left: 763px;
  }
  .inspection-plan-list-1-tubiao-shanchu{
    position: relative;
    left:18px;
  }

  /*重要提醒弹窗*/
  .new-background-important{
    width: 500px;
    height: 200px;
    position: absolute;
    left: 710px;
    top:385px;
    background-color: #ffffff;
    border-radius: 10px;
    z-index: 2;
  }
  .new-background-important-top{
    height: 50px;
    /*border-bottom: 1px solid #a9a9a9;*/
    background-color: #ffffff;
  }
  .new-background-important-top span{
    display: inline-block;
  }
  .tixing-png{
    margin-top:12px;
    margin-left:30px;
  }
  .tixing-text{
    margin-top: 16px;
    margin-left: 10px;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0px;
    letter-spacing: 0px;
    color: #555555;
  }
  .tixing-guanbi-png{
    margin-top: 17px;
    margin-left: 317px;
  }
  .new-background-important-content{
    height: 149px;
    position: relative;
  }
  .new-background-important-content-center{
    width: 440px;
    height: 80px;
    background-color: #f5f5f5;
    position: relative;
    top: 20px;
    left: 30px;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0px;
    letter-spacing: 0px;
    color: #555555;
    text-align: center;
    line-height: 80px;
  }

  /*设置弹窗*/
  .new-background-setup{
    width: 676px;
    /*height: 480px;*/
    background-color: #ffffff;
    border-radius: 10px;
    position: relative;
    /*top:300px;*/
    /*left:622px;*/
  }
  .new-background-setup-top{
    height: 72px;
    /*border-bottom: 1px solid #d3d3d3;*/
  }
  .new-background-setup-top-choose{
    width: 258px;
    height: 36px;
    position: relative;
    top: 18px;
    left: 30px;
    display: inline-block;
  }
  .new-background-setup-top-choose span{
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0px;
    letter-spacing: 0px;
    color: #555555;
    line-height: 17px;
  }
  .new-background-setup-top-choose-select{
    width: 160px;
    height: 36px;
    display: inline-block;
    margin-left: 9px;
  }
  .new-background-setup-top-name{
    display: inline-block;
    width: 300px;
    height: 36px;
    position: relative;
    top: 18px;
    left: 30px;
  }
  .new-background-setup-top-name span{
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0px;
    letter-spacing: 0px;
    color: #555555;
    line-height: 17px;
    display: inline-block;
  }
  .new-background-setup-top-name-input{
    display: inline-block;
    width: 200px;
    margin-left: 10px;
  }
  .new-background-setup-top-guanbi{
    display: inline-block;
    position: relative;
    left: 58px;
    top: 17px;
  }
  .new-background-setup-center{
    height: 339px;
    /*outline: 1px solid red;*/
    overflow: hidden;
  }
  .new-background-setup-center-left{
    width: 319px;
    height: 299px;
    /*outline: 1px solid green;*/
    margin-top: 20px;
    margin-left: 30px;
    float: left;
  }
  .new-background-setup-center-left1{
    position: relative;
    height: 32px;
    margin-bottom: 20px;
  }
  .new-background-setup-center-left1 span{
    width: 99px;
    height: 14px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 32px;
    /*letter-spacing: 28px;*/
    color: #555555;
    /*text-align: center;*/
    display: inline-block;
    text-align: justify;
    text-align-last: justify;

  }
  .new-background-setup-center-left1-input{
    display: inline-block;
    width: 200px;
    /*height: 32px;*/
    float: right;
  }
  .new-background-setup-center-right{
    width: 288px;
    height: 299px;
    float: left;
    margin-left: 20px;
    background-color: #f5f5f5;
    position: relative;
    top:20px;
  }
  .new-background-setup-center-right-content{
    /*width: 238px;*/
    height: 259px;
    position: relative;
    top: 20px;
    left: 20px;
    /*outline: 1px solid green;*/
  }
  .new-background-setup-center-right-content-top{
    width: 145px;
    height: 17px;
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0px;
    letter-spacing: 0px;
    color: #555555;
  }
  .new-background-setup-center-right-content-center{
    width: 100%;
    height: 203px;
    /*outline: 1px solid red;*/
    margin-top: 19px;
  }
  .new-background-setup-center-right-content-center span{
    width: 140px;
    height: 14px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0px;
    color: #555555;
    text-align: justify;
    text-align-last: justify;
    display: inline-block;
  }
  .new-background-setup-center-right-content-center-1-jishu{
    width: 87px;
    height: 40px;
    background-color: #ffffff;
    border-radius: 4px;
    border: solid 1px #cccccc;
    display: inline-block;
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .fenhao{
    display: inline-block;
    margin-left: 5px;
  }
  .new-background-setup-button{
    width: 673px;
    height: 68px;
    background-color: #f5f5f5;
    /*outline: 1px solid green;*/
  }
  .new-background-setup-button div{
    float: left;
  }
  .new-background-setup-button-1{
    width: 120px;
    height: 40px;
    background-color: #18d96e;
    border-radius: 2px;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 40px;
    letter-spacing: 0px;
    color: #ffffff;
    text-align: center;
    margin-left: 30px;
    margin-top: 14px;
  }
  .new-background-setup-button-2{
    width: 160px;
    height: 40px;
    background-color: #ff6c60;
    border-radius: 2px;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 40px;
    letter-spacing: 0px;
    color: #ffffff;
    text-align: center;
    margin-top: 14px;
    margin-left: 166px;
  }
  .new-background-setup-button-3{
    width: 160px;
    height: 40px;
    background-color: #c1c1c1;
    border-radius: 2px;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 40px;
    letter-spacing: 0px;
    color: #ffffff;
    text-align: center;
    margin-top: 14px;
    margin-left: 10px;
  }

  /*<!--错误日志弹窗-->*/
  .new-background-err{
    width: 500px;
    /*height: 500px;*/
    background-color: #ffffff;
    border-radius: 10px;
    position: relative;
    /*top: 210px;*/
    /*left:790px;*/
    z-index: 1;
  }
  .new-background-err-top{
    height: 72px;
    /*border-bottom: 1px solid #d3d3d3;*/
  }
  .new-background-err-top div{
    float: left;
  }
  .new-background-err-top-orange{
    width: 10px;
    height: 20px;
    background-color: #fbb321;
    margin-left: 30px;
    margin-top: 26px;
  }
  .new-background-err-top-text{
    width: 80px;
    height: 20px;
    font-family: MicrosoftYaHei-Bold;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 20px;
    letter-spacing: 0px;
    color: #555555;
    margin-left: 20px;
    margin-top: 26px;
  }
  .new-background-err-top-guanbi{
    margin-left: 321px;
    margin-top: 26px;
  }
  .new-background-err-content{
    height: 428px;
    /*outline: 1px solid red;*/
    position: relative;
  }
  .new-background-err-content-center{
    width: 435px;
    height: 351px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #555555;
    /*outline: 1px solid green;*/
  }
  .new-background-err-content-center-1{
    border-bottom: 1px solid #d3d3d3;
    border-bottom-style:dashed;
  }

  /*巡检内容*/
  .new-background-inspection{
    width: 690px;
    /*height: 715px;*/
    background-color: #ffffff;
    border-radius: 10px;
    position: relative;
    /*left: 615px;*/
    /*top:183px;*/
    overflow: hidden;
    z-index: 1;
    text-align: center;
  }
  .new-background-inspection-guanbi{
    margin-top: 27px;
    margin-left: 641px;
  }
  .new-background-inspection-top{
    width: 570px;
    height: 100px;
    background-color: #f5f5f5;
    position: relative;
    left: 60px;
    margin-top: 26px;
  }
  .new-background-inspection-top-content{
    width: 530px;
    height: 44px;
    position: relative;
    left: 20px;
    top:28px;
    /*outline:1px solid red;*/
  }
  .new-background-inspection-top-content>div{
    float: left;
  }
  .shujuku-name{
    width: 116px;
    height: 19px;
    font-family: MicrosoftYaHei;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 19px;
    letter-spacing: 0px;
    color: #555555;
  }
  .shujuku-way{
    width: 77px;
    height: 20px;
    background-color: rgba(51, 150, 251, 0.1);
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 20px;
    letter-spacing: 0px;
    color: #3396fb;
    margin-left: 20px;
  }
  .shujuku-date{
    width: 142px;
    height: 12px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 12px;
    letter-spacing: 0px;
    color: #999999;
  }
  .shujuku-times{
    width: 142px;
    height: 12px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 12px;
    letter-spacing: 0px;
    color: #999999;
  }
  .shujuku-inspection-zong{
    margin-left: 11px;
  }
  .shujuku-inspection-png{
    margin-left: 199px;
  }
  .shujuku-inspection-daochu-png{
    margin-left: 10px;
  }
  .new-background-inspection-content{
    width: 570px;
    height: 493px;
    border: solid 1px #d3d3d3;
    margin-left: 60px;
    margin-top: 10px;
    float: left;
    text-align: center;
    /*outline: 1px solid red;*/
  }

  /*正在检测*/
  .new-background-jiance{
    width: 630px;
    /*height: 587px;*/
    background-color: #ffffff;
    border-radius: 10px;
    position: relative;
    /*left:645px;*/
    /*top:247px;*/
    overflow: hidden;
  }
  .new-background-jiance-guanbi{
    margin-top: 27px;
    margin-left: 581px;
  }
  .new-background-jiance-top{
    width: 570px;
    height: 100px;
    background-color: #f5f5f5;
    margin-top: 26px;
    margin-left: 30px;
  }
  .new-background-jiance-top-content{
    width: 530px;
    height: 44px;
    position: relative;
    top:28px;
    left:20px;
    /*outline: 1px solid red;*/
  }
  .new-background-jiance-top-content>div{
    float: left;
  }
  .jiancenew-background-jiance-text{
    margin-left: 11px;
  }
  .jiancenew-background-jiance-png{
    margin-left: 330px;
  }
  .jiancenew-background-jiance-text-shen{
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #555555;
    position: relative;
    /*top:*/
  }
  .new-background-jiance-center{
    width: 536px;
    height: 339px;
    /*outline:1px solid red;*/
    margin-left: 64px;
    position: relative;
  }
  .new-background-jiance-center>div{
    float: left;
  }
  .new-background-jiance-center-left{
    width: 347px;
    height: 339px;
    /*outline: 1px solid green;*/
  }
  .first-qiu{
    width: 12px;
    height: 12px;
    background-color: #18d96e;
    border-radius: 6px;
  }
  .first-xian{
    width: 1px;
    height: 24px;
    background-color: #c1c1c1;
    margin-left: 6px;
  }
  .second{
    overflow: hidden;
  }
  .second>div{
    float: left;
  }
  .second-left{
    width: 12px;
    height: 59px;
  }
  .second-left-qiu{
    width: 12px;
    height: 12px;
    background-color: #18d96e;
    border-radius: 6px;
  }
  .second-left-xian{
    width: 1px;
    height: 47px;
    background-color: #c1c1c1;
    margin-left: 6px;
  }
  .second-right{
    margin-left: 14px;
  }
  .second-right-text1{
    width: 80px;
    height: 17px;
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 17px;
    letter-spacing: 0px;
    color: #18d96e;
  }
  .second-right-text2{
    width: 318px;
    height: 14px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 14px;
    letter-spacing: 0px;
    color: #999999;
    margin-top: 6px;
  }
  .third{
    overflow: hidden;
  }
  .third>div{
    float: left;
  }
  .third-left{
    width: 12px;
    height: 85px;
  }
  .third-left-qiu{
    width: 12px;
    height: 12px;
    background-color: #ff6c60;
    border-radius: 6px;
  }
  .third-left-xian{
    width: 1px;
    height: 73px;
    background-color: #c1c1c1;
    margin-left: 6px;
  }
  .third-right{
    margin-left: 14px;
  }
  .third-right-text1{
    width: 129px;
    height: 17px;
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 17px;
    letter-spacing: 0px;
    color: #ff6c60;
  }
  .third-right-text2{
    width: 182px;
    height: 14px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 14px;
    letter-spacing: 0px;
    color: #999999;
    margin-top: 6px;
  }
  .third-right-text3{
    width: 180px;
    height: 14px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 14px;
    letter-spacing: 0px;
    color: #ff6c60;
    margin-top: 10px;
  }

  .fourth{
    overflow: hidden;
  }
  .fourth>div{
    float: left;
  }
  .fourth-left{
    width: 12px;
    height: 59px;
  }
  .fourth-left-qiu{
    width: 12px;
    height: 12px;
    background-color: #58c9f3;
    border-radius: 6px;
  }
  .fourth-left-xian{
    width: 1px;
    height: 59px;
    background-color: #c1c1c1;
    margin-left: 6px;
  }
  .fourth-right{
    margin-left: 14px;
  }
  .fourth-right-text1{
    width: 129px;
    height: 17px;
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 17px;
    letter-spacing: 0px;
    color: #58c9f3;
  }
  .fourth-right-text2{
    width: 182px;
    height: 14px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 14px;
    letter-spacing: 0px;
    color: #999999;
    margin-top: 6px;
  }

  .fifth{
    overflow: hidden;
  }
  .fifth>div{
    float: left;
  }
  .fifth-left{
    width: 12px;
    height: 59px;
  }
  .fifth-left-qiu{
    width: 12px;
    height: 12px;
    background-color: #fbb321;
    border-radius: 6px;
  }
  .fifth-left-xian{
    width: 1px;
    height: 59px;
    background-color: #c1c1c1;
    margin-left: 6px;
  }
  .fifth-right{
    margin-left: 14px;
  }
  .fifth-right-text1{
    width: 129px;
    height: 17px;
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 17px;
    letter-spacing: 0px;
    color: #fbb321;
  }
  .fifth-right-text2{
    width: 182px;
    height: 14px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 14px;
    letter-spacing: 0px;
    color: #999999;
    margin-top: 6px;
  }

  .sixth{
    overflow: hidden;
  }
  .sixth>div{
    float: left;
  }
  .sixth-left{
    width: 12px;
    height: 59px;
  }
  .sixth-left-qiu{
    width: 12px;
    height: 12px;
    background-color: #18d96e;
    border-radius: 6px;
  }
  .sixth-right{
    margin-left: 14px;
  }
  .sixth-right-text1{
    width: 129px;
    height: 17px;
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 17px;
    letter-spacing: 0px;
    color: #18d96e;
  }
  .sixth-right-text2{
    width: 210px;
    height: 14px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 14px;
    letter-spacing: 0px;
    color: #999999;
    margin-top: 6px;
  }

  .new-background-jiance-center-right{
    width: 76px;
    height: 79px;
    /*outline: 1px solid green;*/
    margin-left: 113px;
    margin-top: 165px;
  }
  .right-first{
    width: 76px;
    height: 20px;
    border: solid 1px #fbb321;
    text-align: center;
    color: #fbb321;
    font-size: 14px;
    line-height: 20px;
  }
  .right-second{
    width: 76px;
    height: 20px;
    border: solid 1px #18d96e;
    text-align: center;
    color: #18d96e;
    font-size: 14px;
    line-height: 20px;
    margin-top: 39px;
  }

  /*颜色选择器*/
  /*.choose-color-background{*/
    /*width: 220px;*/
    /*height: 245px;*/
    /*position: fixed;*/
    /*bottom: 116px;*/
    /*right: 17px;*/
    /*background-color: white;*/
    /*!*outline: 1px solid red;*!*/
    /*overflow: hidden;*/
  /*}*/
  /*.choose-color-background>div{*/
    /*float: left;*/
  /*}*/
  /*.choose-color-background-left{*/
    /*width: 48px;*/
    /*height: 194px;*/
    /*margin-left: 28px;*/
    /*margin-top: 28px;*/
  /*}*/
  /*.choose-color-background-right{*/
    /*height: 75px;*/
    /*width: 50px;*/
    /*margin-left: 20px;*/
    /*margin-top: 57px;*/
  /*}*/
  /*.choose-color-background-left>div{*/
    /*margin-bottom: 15px;*/
  /*}*/
  /*.color1{*/
    /*width: 48px;*/
    /*height:16px ;*/
    /*background-color: #c10f01;*/
  /*}*/
  /*.color2{*/
    /*width: 48px;*/
    /*height:16px ;*/
    /*background-color: #ff6c60;*/
  /*}*/
  /*.color3{*/
    /*width: 48px;*/
    /*height:16px ;*/
    /*background-color: #fbb321;*/
  /*}*/
  /*.color4{*/
    /*width: 48px;*/
    /*height:16px ;*/
    /*background-color: #58c9f3;*/
  /*}*/
  /*.color5{*/
    /*width: 48px;*/
    /*height:16px ;*/
    /*background-color: #18d96e;*/
  /*}*/
  /*.color6{*/
    /*width: 48px;*/
    /*height:16px ;*/
    /*background-color: #e6e6e6;*/
  /*}*/
  /*.color7{*/
    /*width: 48px;*/
    /*height:16px ;*/
    /*background-color: #f5f5f5;*/
  /*}*/
  /*.color8{*/
    /*width: 48px;*/
    /*height:16px ;*/
    /*background-color: #ff1200;*/
  /*}*/
  /*.color9{*/
    /*width: 48px;*/
    /*height:16px ;*/
    /*background-color: #3396fb;*/
    /*position: relative;*/
    /*top:44px;*/
  /*}*/

  /*分页*/
  .fenye{
    position: absolute;
    top:calc(100% - 50px);
    float: right;
    right: 0px;
    /*top:900px;*/
    /*left:1350px;*/
  }

  #jihua{
    display: inline-block;
    position: relative;
    left:742px;
    background-color: rgba(230, 230, 230, 0);
    cursor: pointer;
    width: auto;
  }
  .zuo-png{
    position: absolute;
    top:343px;
    left: 23px;
    z-index: 2;
  }
  .you-png{
    position: absolute;
    top:343px;
    left: 690px;
    z-index: 2;
  }

</style>
