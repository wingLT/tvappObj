<template>
  <main-container>
    <!--默认排班管理开始-->
    <div class="schedul-box">
      <div class="schedul-header">
        <div class="chedulhea-fl">
          <div class="day-time">
            <span>
              <input readonly v-model="currentTime"/>
            </span>
            <span class="time-icon" id="timeSelect"></span>
          </div>
        </div>
        <div class="chedulhea-fr">
          <ul>
            <li>
              <a href="javascript:;" @click="reportExcel()">一键导出</a>
              <!--<router-link to="">一键导出</router-link>-->
            </li>
            <li>
              <!--<a href="javascript:;">排班模板</a>-->
              <router-link to="./SchedulingTemplate">排班模板</router-link>
            </li>
            <li>
              <router-link to="./WorkStatistics">工作统计</router-link>
              <!--<a href="javascript:;">工作统计</a>-->
            </li>
          </ul>
        </div>
      </div>
      <div class="schedul-content">
        <div class="table-content col-md-12" id="chedulingList">
          <!--固定头部-->
          <div class="header">
            <!--<div class="table-headers">-->
            <!--<div class="table-headers-title"></div>-->
            <!--<div class="table-headers-content"></div>-->
            <!--<div class="table-headers-content"></div>-->
            <!--<div class="table-headers-content"></div>-->
            <!--</div>-->
            <!--              :data="tableData3"
-->
            <el-table
              style="width: 100%;"
              :data="tableData3"
              @row-click="rowClick"
              height="640">
              <el-table-column
                fixed
                label="日期"
                prop="date"
                align="center"
                header-align="center"
                width="120">
              </el-table-column>
              <el-table-column align="center" label="星期" prop="week" fixed width="120"
                               header-align="center">
              </el-table-column>
              <el-table-column :label="label.title" header-align="center" v-for="(label,index) in s" :key="index">
                <el-table-column align="center" :render-header="renderHeader" width="150" header-align="center" v-for="(list,key) in label.s1" :prop="'names'+key" :key="key">
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top" :disabled="!(scope.row['names'+key].length>4)">
                      <p v-for="(p,s) in scope.row['names'+key]">姓名: {{ p }}</p>

                      <div style="position: relative" slot="reference" class="name-wrapper">
                        <span :style="i>4?'display: none;':''" style="margin-left: 10px;display: inline-block"
                              v-for="(tag,i) in scope.row['names'+key]" :key="i">{{tag}}</span>
                        <span v-if="scope.row['names'+key].length>4">...</span>
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>

              </el-table-column>


            </el-table>
          </div>

        </div>

      </div>
    </div>
    <!--默认排班管理结束-->

  </main-container>
</template>

<script>
  import Vue from 'vue'
  import {GlobalVar} from "../../../static/js/utils";
  import MainContainer from "../Packages/MainContainer";
  import {DateUtils} from '../../../static/js/DateUtils'
  import laydate from '../../../static/laydate/laydate'

  var TemplateWithMonth = {
    "data": [{
      "id": 161,
      "name": "A班"
    },
      {
        "id": 269,
        "name": "B班"
      },
      {
        "id": 267,
        "name": "C班"
      },
      {
        "id": 261,
        "name": "D班"
      },
      {
        "id": 246,
        "name": "E班"
      },
      {
        "id": 218,
        "name": "F班"
      }
      ,
      {
        "id": 209,
        "name": "G班"
      }
    ],
    "msg": "OK",
    "status": 200
  };
  var ScheduleCondition = {
    "data": [{
      "date": "2018-03-01",
      "templates": [{
        "id": null,
        "template": {
          "id": 161,
          "name": "模板名称"
        },
        "userReportInfos": null,
        "hisiScheduleTempTasks": null
      },
        {
          "id": "null",
          "template": {
            "id": 269,
            "name": "Joker"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
        {
          "id": null,
          "template": {
            "id": 267,
            "name": "测试ss"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        }
      ],
      "weekday": "星期四"
    },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      },
      {
        "date": "2018-03-01",
        "templates": [{
          "id": null,
          "template": {
            "id": 161,
            "name": "模板名称"
          },
          "userReportInfos": null,
          "hisiScheduleTempTasks": null
        },
          {
            "id": "null",
            "template": {
              "id": 269,
              "name": "Joker"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          },
          {
            "id": null,
            "template": {
              "id": 267,
              "name": "测试ss"
            },
            "userReportInfos": null,
            "hisiScheduleTempTasks": null
          }
        ],
        "weekday": "星期四"
      }],
    "msg": "OK",
    "status": 200
  };

  $(function () {
    GlobalVar.setScroll('content-body');
    tableScroll();
  });
  export default {
    components: {MainContainer},
    name: "scheduling",
    data() {
      return {
        tableHeader: [
          {name: '长白班', time: '10:00-19:00'},
          {name: '早班', time: '10:00-19:00'},
          {name: '中班', time: '10:00-19:00'},
          {name: '晚班', time: '10:00-19:00'},
          {name: '机动班', time: '10:00-19:00'},
          {name: '轮班', time: '09:00-20:00'},
          {name: '长白班', time: '10:00-19:00'},
          {name: '播出班', time: '11:00-24:00'},
          {name: '轮班', time: '09:00-20:00'},
          {name: '长白班', time: '10:00-19:00'},
          {name: '播出班', time: '11:00-24:00'},
        ],
        tableHeader1: [],
        tableTitle: [], //表格的title
        tableBodyData: [], //table里面的内容
        allTemplate: [],

        hasBeforeDay: 'non-before-day',
        hasAfterDay: 'has-after-day',
        currentTime: DateUtils.format(new Date(), 'yyyy年MM月'),
        currentTimeInput: DateUtils.format(new Date(), 'yyyy-MM-dd'),
        minTime: DateUtils.format(new Date(), 'yyyy-MM-dd'),
        maxTime: '',
        s: [
          {
            title: '6楼MDC监控机房', s1: [
              {sche: '长白班', time: '10:00-19:00', names: ['温超', '唐志刚', '罗立新', '陈托文', '林盛容', '唐立', '林盛容', '林盛容',]},
              {sche: '早班', time: '10:00-19:00', names: ['温超', '唐志刚']},
              {sche: '中班', time: '10:00-19:00', names: ['温超']},
              {sche: '晚班', time: '10:00-19:00', names: ['温超', '唐志刚', '罗立新']},
              {sche: '机动班', time: '10:00-19:00', names: ['温超', '唐志刚']},
            ],
          },
          {
            title: '三楼编辑区', s1: [
              {sche: '轮班', time: '09:00-20:00-09:00', names: ['温超']},
              {sche: '长白班', time: '10:00-19:00', names: ['温超', '唐志刚', '罗立新', '陈托文', '林盛容', '唐立', '林盛容', '林盛容',]},
              {sche: '播出班', time: '11:00-24:00', names: ['温超', '唐志刚']},
            ]
          },
          {
            title: '三楼编辑区', s1: [
              {sche: '轮班', time: '09:00-20:00-09:00', names: ['温超']},
              {sche: '长白班', time: '10:00-19:00', names: ['温超', '唐志刚', '罗立新', '陈托文', '林盛容', '唐立', '林盛容', '林盛容',]},
              {sche: '播出班', time: '11:00-24:00', names: ['温超', '唐志刚']},
            ]
          }],
        tableData3: [
          {
            date: '2016-05-03',
            week: '星期五',
            names0: ['温超', '唐志刚', '罗立新', '陈托文', '林盛容', '唐立', '林盛容', '林盛容',],
            names1: ['温超', '唐志刚', '罗立新', '陈托文', '林盛容', '唐立', '林盛容', '林盛容',],
            names2: ['温超', '唐志刚'],
            names3: ['温超'],
            names4: ['温超', '林盛容'],
            names5: ['罗立新', '陈托文', '林盛容', '唐立', '林盛容', '林盛容',],
            names6: ['温超'],
            names7: ['温超'],
            names8: ['温超'],
            names9: ['温超'],
            names10: ['温超'],
          }, {
            date: '2016-05-04',
            week: '星期六',
            names0: ['温超', '唐志刚', '罗立新', '陈托文',],
            names1: ['温超', '唐志刚', '罗立新', '陈托文',],
            names2: ['温超', '唐志刚'],
            names3: ['温超'],
            names4: ['温超', '林盛容'],
            names5: ['罗立新', '陈托文', '林盛容', '唐立', '林盛容', '林盛容',],
            names6: ['温超'],
            names7: ['温超'],
            names8: ['温超'],
            names9: ['温超'],
            names10: ['温超'],
          }, {
            date: '2016-05-05',
            week: '星期日',
            names0: ['温超', '唐志刚',],
            names1: ['温超', '唐志刚',],
            names2: ['温超', '唐志刚'],
            names3: ['温超'],
            names4: ['温超', '林盛容'],
            names5: ['罗立新', '陈托文',],
            names6: ['温超'],
            names7: ['温超'],
            names8: ['温超'],
            names9: ['温超'],
            names10: ['温超'],
          },
        ]
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
      // 时间选择器
      laydate.render({
        elem: '#timeSelect',
        format: 'yyyy年MM月',//指定元素
        min: self.minTime,
        max: self.maxTime,
        change: function (value, date) {
        },
        done: function (value, date) {
          self.currentTime = value;
          var currStr = DateUtils.parse(value, 'yyyy-MM');
          var currTime = DateUtils.format(new Date(currStr), 'yyyy-MM');
          if (new Date(currTime).getTime() > new Date(self.minTime).getTime() && new Date(currTime).getTime() < new Date(self.maxTime).getTime()) {
            self.hasAfterDay = 'has-after-day';
            self.hasBeforeDay = 'has-before-day';
          }
          if (new Date(currTime).getTime() == new Date(self.minTime).getTime()) {
            self.hasBeforeDay = 'non-before-day';
            self.hasAfterDay = 'has-after-day';
          }
          if (new Date(currTime).getTime() == new Date(self.maxTime).getTime()) {
            self.hasAfterDay = 'non-after-day';
            self.hasBeforeDay = 'has-before-day';
          }
          $('#timeSelect').text('');
        }
      });

      self.getTableTitle();
      self.showCurrentMonthData();
    },
    methods: {
      // 导出表格
      reportExcel: function () {
        method5(chedulingList);
      },

      hoverDom: function (e, index) {
        $('#contentBody').find('table tbody tr:nth-child(' + (index + 1) + ')').addClass('hover');
        $('.fix-left-row').find('table tbody tr:nth-child(' + (index + 1) + ')').addClass('hover');
      },
      noHoverDom: function (e, index) {
        $('#contentBody').find('table tbody tr:nth-child(' + (index + 1) + ')').removeClass('hover');
        $('.fix-left-row').find('table tbody tr:nth-child(' + (index + 1) + ')').removeClass('hover');
      },
      getTime: function (str) {
        var data = DateUtils.format(new Date(str), 'yyyy年MM月dd日');
        return data.split('年')[1];
      },
      //得到table的标题
      getTableTitle: function () {
        const self = this;
        self.tableTitle = [];
        var data = TemplateWithMonth;
        // console.log(data);
        if (Number(data.status) == 200 && data.msg == 'OK') {
          self.tableTitle = [];
          if (data.data.length > 0) {
            for (var i = 0; i < data.data.length; i++) {
              self.tableTitle.push(data.data[i].name);
              self.allTemplate = data.data;
              self.$nextTick(function () {
                tableScroll();
              })
            }
          }
        }
      },

      //得到月份的数据
      showCurrentMonthData: function () {
        const self = this;
        var data = ScheduleCondition;
        if (Number(data.status) == 200 && data.msg == 'OK') {
          if (data.data.length > 0) {
            self.tableBodyData = data.data;
            self.$nextTick(function () {
              tableScroll();
            })

          }
        }

      },
      getLocationTr: function (data) {
        //获取当前的日期并和日历进行匹配，并添加id进行索引
        var getData = new Date(data + ' 00:00:00');
        var curentData = DateUtils.format(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        var getCurentData = new Date(curentData);
        if (getData.getTime() == getCurentData.getTime()) {
          return 'locationTr';
        } else {
          return '';
        }
      },
      /*处理表格*/
      renderHeader(h, {s, $index}) {
        // console.log($index)
        return [h('p', {}, [this.tableHeader[$index].name]), h('p', {}, ['(' + this.tableHeader[$index].time + ')'])]

      },
      disposeTable(s, s1, s2) {
        // console.log(s)
        // console.log(s1)
        // console.log(s2)
      },
      /*某一行被点击*/
      rowClick(row) {
        const self = this;
        self.$router.push({path: './WorkContent'});
        // console.log(123)
        // console.log(row)
      }
    },

  }

  //table的滑动的处理
  function tableScroll() {
    $('#contentBody').on('scroll', function () {
      var scrollLeft = $(this).scrollLeft();
      var scrollTop = $(this).scrollTop();
      /*头部左右滚动的时候一起滚动 */
      $('div.table-content>div.header>table').css({
        'transform': 'translateX(' + (-scrollLeft) + 'px)',
        '-ms-transform': 'translateX(' + (-scrollLeft) + 'px)',
        '-moz-transform': 'translateX(' + (-scrollLeft) + 'px)',
        '-webkit-transform': 'translateX(' + (-scrollLeft) + 'px)',
        '-o-transform': 'translateX(' + (-scrollLeft) + 'px)'
      })
      if (Number(scrollLeft) > 0) {
        $('div.table-content>div.fix-left-row').css('display', 'block');
        /*左边滚动的时候一起滚动 */
        $('.fix-left-row>table>tbody').css({
          'transform': 'translateY(' + (-scrollTop) + 'px)',
          '-ms-transform': 'translateY(' + (-scrollTop) + 'px)',
          '-moz-transform': 'translateY(' + (-scrollTop) + 'px)',
          '-webkit-transform': 'translateY(' + (-scrollTop) + 'px)',
          '-o-transform': 'translateY(' + (-scrollTop) + 'px)'
        })
      } else {
        $('div.table-content>div.fix-left-row').css('display', 'none');
      }
    })

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
  @import "../../../static/css/configuration-suggest.css";

  /*========默认排班管理页面样式开始========*/
  .schedul-box {
    width: 100%;
    padding: 37px 30px 30px 30px;
    background: #ffffff;
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }

  .schedul-header {
    height: 36px;
    line-height: 36px;
    margin-bottom: 30px;
    overflow: hidden;
    position: relative;
  }

  .chedulhea-fl {
    float: left;
  }

  .chedulhea-fr {
    float: right;
  }

  /*时间选择器*/
  .schedul-header > div.chedulhea-fl .day-time {
    cursor: pointer;
    font-size: 20px;
  }

  .schedul-header > div.chedulhea-fl .day-time span.time-icon {
    width: 21px;
    height: 19px;
    background-image: url("../../assets/calendar.png");
  }

  .schedul-header > div.chedulhea-fl .day-time > span.time-icon:hover {
    background-image: url("../../assets/calendar-hover.png");
  }

  .schedul-header > div.chedulhea-fl .day-time > span {
    display: inline-block;
    vertical-align: top;
  }

  .schedul-header > div.chedulhea-fl .day-time input {
    border: none;
    width: 111px;
    color: #555555;
    outline: none;
  }

  .schedul-header > div.chedulhea-fl .day-time > span:last-child {
    margin-top: 6px;
  }

  /*//按钮组*/
  .chedulhea-fr ul {
    overflow: hidden;
    position: relative;
  }

  .chedulhea-fr ul > li {
    float: left;
    width: 116px;
    height: 32px;
    line-height: 32px;
    border: 2px solid #18d96e;
    text-align: center;
    margin-left: 20px;
  }

  .chedulhea-fr ul > li > a {
    font-size: 16px;
    color: #18d96e;
  }

  /*=====表格===*/
  /*表格内容 */

  div.table-content {
    /*margin-top: 34px;*/
    width: 1540px;
    padding: 0;
    position: relative;
    overflow: hidden;
  }

  div.table-content > div {
    /*width: 100%;*/
  }

  div.table-content > div.content-body {
    height: 880px;
    /*height: 616px;*/
    width: 100%;
  }

  div.table-content > div.header > table {
    width: 100%;
    background-color: #edecec;
    transform: translateX(0);
    -ms-transform: translateX(0);
    -moz-transform: translateX(0);
    -webkit-transform: translateX(0);
    -o-transform: translateX(0);
  }

  div.table-content > div.fix-left-row {
    position: absolute;
    top: 0;
    display: none;
    z-index: 1001;
  }

  div.table-content > div.fix-left-row table {
    position: relative;
  }

  div.table-content > div.fix-left-row table {
    /*width: 209px;*/
  }

  div.table-content > div.fix-left-row table thead {
    position: absolute;
    background-color: #f5f5f5;
    z-index: 10009;
  }

  div.table-content > div.fix-left-row table tbody {
    top: 110px;
    position: absolute;
    z-index: 10001;
    background-color: #f5f5f5;
  }

  div.table-content > div.fix-left-row > table {
    background-color: #f5f5f5;
  }

  div.table-content > div.header > table tr {
    height: 110px;
  }

  div.table-content > div.content-body table {
    width: 100%;
  }

  div.table-content > div.header > table th,
  div.table-content > div.content-body table th {
    font-size: 18px;
    color: #555555;
    text-align: center;
    font-weight: bold;
  }

  div.table-content > div.header > table tr th {
    /*width: 14.285%;*/
    width: 220px;
  }

  div.table-content > div.content-body > table tr td {
    /*width: 14.285%;*/
    width: 220px;
  }

  div.table-content > div.content-body > table tr:nth-child(even) {
    background-color: #f5f5f5;
  }

  div.table-content > div.fix-left-row > table tr:nth-child(even) {
    background-color: #f5f5f5;
  }

  div.table-content > div.header > table th.date-title,
  div.table-content > div.content-body table th.date-title,
  div.table-content > div.fix-left-row table th.date-title,
  div.table-content > div.fix-left-row table td.date-title,
  div.table-content > div.content-body table td.date-title {
    /*width: 109px;*/
    width: 220px;
  }

  div.table-content > div.header > table th.week-title,
  div.table-content > div.content-body table th.week-title,
  div.table-content > div.fix-left-row table th.week-title,
  div.table-content > div.fix-left-row table td.week-title,
  div.table-content > div.content-body table td.week-title {
    /*width: 100px;*/
    width: 220px;
  }

  div.table-content > div.header > table th.variable-title,
  div.table-content > div.content-body table th.variable-title,
  div.table-content > div.fix-left-row table th.variable-title,
  div.table-content > div.fix-left-row table td.variable-title,
  div.table-content > div.content-body table td.variable-title {
    /*width: 188px;*/
    width: 220px;
  }

  div.table-content > div.content-body table th,
  div.table-content > div.fix-left-row table th {
    width: 220px;
    text-align: center;
    font-size: 18px;
    color: #555555;
    background: #edecec;
    font-weight: bold;
  }

  div.table-content > div.fix-left-row table th {
    border-right: 1px solid #dddddd;
  }

  div.table-content > div.header table th,
  div.table-content > div.fix-left-row table th,
  div.table-content > div.fix-left-row table td,
  div.table-content > div.content-body table td {
    /*border-top: 1px solid #dddddd;*/
    border-left: 1px solid #dddddd;
  }

  div.table-content > div.fix-left-row table tr:last-child td,
  div.table-content > div.content-body table tr:last-child td {
    /*border-bottom: 1px solid rgba(34, 46, 60, 1);*/
  }

  div.table-content > div.header table tr th:last-child,
  div.table-content > div.fix-left-row table tr td:last-child,
  div.table-content > div.content-body table tr td:last-child {
    border-right: 1px solid #dddddd;
  }

  div.table-content > div.fix-left-row table thead tr {
    height: 110px;
  }

  div.table-content > div.content-body table tr {
    height: 66px;
  }

  div.table-content > div.fix-left-row table tr td:first-child > span,
  div.table-content > div.content-body table tr td:first-child > span {
    display: inline-block;
    height: 100%;
    width: 100%;
    text-align: center;
    border-left: 4px solid transparent;
    transition: all .3s;
  }

  /*div.table-content>div.fix-left-row table tr:hover td:first-child>span ,
  div.table-content>div.content-body table tr:hover td:first-child>span {
      border-left: 4px solid rgba(15, 137, 253, 1);
      transition: all .3s;
  }

  div.table-content>div.fix-left-row table tr:hover ,
  div.table-content>div.content-body table tr:hover {
      background-color: rgba(27, 38, 50, 1);
      transition: all .3s;
  }*/
  /*  测试 */

  div.table-content > div.fix-left-row table tr.hover td:first-child > span,
  div.table-content > div.content-body table tr.hover td:first-child > span {
    border-left: 6px solid #18d96e;
    transition: all .3s;
  }

  div.table-content > div.fix-left-row table tr.hover,
  div.table-content > div.content-body table tr.hover {
    background-color: #f5f5f5;
    transition: all .3s;
  }

  div.table-content > div.fix-left-row table td,
  div.table-content > div.content-body table td {
    font-size: 14px;
    color: #555555;
    text-align: center;
  }

  div.table-content > div.content-body table td.date-title,
  div.table-content > div.fix-left-row table td.date-title,
  div.table-content > div.content-body table td.week-title,
  div.table-content > div.fix-left-row table td.week-title {
    width: 220px;
    font-size: 14px;
    font-weight: normal;
    line-height: 66px;
  }

  div.table-content > div.content-body table td.variable-title > span,
  div.table-content > div.content-body table td i {
    display: inline-block;
    vertical-align: top;
    /*width: 68px;*/
    width: 220px;
    height: 22px;
    line-height: 22px;
    margin: 4px 2px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  div.table-content > div.content-body table td.variable-title > span.red {
    background-color: #DF4E5C;
  }

  div.table-content > div.content-body table td.variable-title > span.green {
    background-color: #46C36F;
  }

  div.table-content > div.content-body table td.variable-title i {
    font-style: normal;
    color: #AAAAAA;
  }

  /*========默认排班管理页面样式结束========*/
</style>
