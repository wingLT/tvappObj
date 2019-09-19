import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import HeaderSide from '../components/HeaderSide.vue'
/*业务健康库*/
import BusinessHealthDegree from '../components/businessHealth/businessHealthDegree.vue'
import BusinessHealthHome from '../components/businessHealth/BusinessHealthHome.vue'
import SingleBusinessHealth from '../components/businessHealth/singleBusinessHealthDegree.vue'
import FaultStatistic from '../components/businessHealth/faultStatistics.vue'
/*故障详情*/
import StorageBreakdownDetails from '../components/businessHealth/breakdownDetails/storageBreakdownDetails.vue'
import NetworkBreakdownDetails from '../components/businessHealth/breakdownDetails/networkBreakdownDetails.vue'
import OtherBreakdownDetails from '../components/businessHealth/breakdownDetails/otherBreakdownDetails.vue'

import EquipmentDosageHome from '../components/equipmentDosage/EqupmentDosageHome.vue'
import WarningCenter from '../components/warningCenter/WarningHome.vue'
/*资源消耗*/
import ResourdeOption from '../components/resourceOptimization/resource.vue'
import ResouceConsume from '../components/resourceOptimization/resoureConsume.vue'
import SingleServerResourceConsume from '../components/resourceOptimization/singleServerResourceConsume.vue'
import SingleResourceConsume from '../components/resourceOptimization/singleResourceConsume.vue'
import ResourceRankingDetails from '../components/resourceOptimization/resourceRankingDetails.vue'
import ServerResource from '../components/resourceOptimization/serverResource.vue'
/*近24小时详情*/
import NonLinearEditing from '../components/nearly24Details/nonLinearEditingDetails.vue'
import WhosePiece from '../components/nearly24Details/whosePieceDetails.vue'
import OtherNearyly24Details from '../components/nearly24Details/otherNearly24Details.vue'
/*配置建议*/
import BusinessSuggest from '../components/resourceOptimization/configurationSuggest/businessConfigurationSuggest.vue'
import ServerSuggest from '../components/resourceOptimization/configurationSuggest/serverCofigurationSuggest.vue'
/*管理工具*/
import Knowledge from '../components/Tools/Knowledge.vue'
import Scheduling from '../components/Tools/Scheduling.vue'
import SchedulingTemplate from '../components/Tools/SchedulingTemplate.vue'
import WorkStatistics from '../components/Tools/WorkStatistics.vue'
import WorkContent from '../components/Tools/WorkContent.vue'
import HistoryScheduling from '../components/Tools/HistoryScheduling.vue'
import HistorySchedulingTemplate from '../components/Tools/HistorySchedulingTemplate.vue'

/*运维工具*/
import Operations from '../components/operationsTool/OperationsTool.vue'
import DBPolling from '../components/operationsTool/DBPolling.vue'
/*基础资源监控*/
import BasicResources from '../components/BasicResources/BasicResources.vue'
import BasicResourcesDetails from '../components/BasicResources/BasicResourcesDetails.vue'
/*管理工具*/
import Tool from '../components/Tools/Tool.vue'
/*系统配置*/
import Setting from '../components/Setting/Setting.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'headerSide',
      component: HeaderSide,
      children: [
        // {
        //   path: '',
        //   name: '首页',
        //   component: Home
        // },
        {
          // path: 'BasicResources',
          path: '',
          name: '基础管理监控',
          component: BasicResources
        },
        {
          path:'BasicResourcesDetails',
          name:'服务器',
          component:BasicResourcesDetails
        },
        {
          path: 'Operations',
          name: '设备维护',
          component: Operations
        },
        {
          path: 'DBPolling',
          name: '数据库巡检',
          component: DBPolling
        },

        {
          path: 'Tool/Scheduling',
          name: '排班管理',
          component: Scheduling
        },
        {
          path: 'Tool/Knowledge',
          name: '知识库',
          component: Knowledge
        }, {
          path: 'Tool/SchedulingTemplate',
          name: '排班模版',
          component: SchedulingTemplate
        }, {
          path: 'Tool/WorkStatistics',
          name: '工作统计',
          component: WorkStatistics
        }, {
            path: 'Tool/WorkContent',
            name: '工作内容',
            component: WorkContent
        }, {
          path: 'Tool/HistoryScheduling',
          name: '历史排班',
          component: WorkStatistics
        }, {
          path: 'Tool/HistorySchedulingTemplate',
          name: '历史排班模版',
          component: HistorySchedulingTemplate
        },
        {
          path: 'Setting',
          name: '系统配置',
          component: Setting
        },
        {
          /*业务健康度*/
          // path:'businessHealthHome',
          path: 'businessHealthDegree',
          name: '总体的业务健康度',
          // component:BusinessHealthHome,
          component: BusinessHealthDegree,
          children: [
            {
              path: '',
              name: '业务健康度',
              component: BusinessHealthHome
            },
            {
              path: 'faultStatistic',
              name: '故障统计',
              component: FaultStatistic
            }
          ]
        },
        {
          /*存储故障详情*/
          path: 'storageBreakdownDetails',
          name: '故障详情',
          component: StorageBreakdownDetails
        },
        {
          /*网络*/
          path: 'networkBreakdownDetails',
          name: '网络故障详情',
          component: NetworkBreakdownDetails
        },
        {
          /*数据库和主机*/
          path: 'otherBreakdownDetails',
          name: '故障详情',
          component: OtherBreakdownDetails
        },
        {
          path: 'singleBusinessHealth',
          name: '单个业务健康度',
          component: SingleBusinessHealth
        },

        {
          /*设备用量*/
          path: 'equipmentDosageHome',
          name: '设备用量',
          component: EquipmentDosageHome
        },
        {
          /*告警中心*/
          path: 'warningCenter',
          name: '告警中心',
          component: WarningCenter
        },
        {
          path: 'resourdeOption',
          name: '总体资源消耗',
          component: ResourdeOption
        },
        {
          /*资源消耗*/
          path: '/resouceConsume',
          name: '资源消耗',
          component: ResouceConsume
        },
        /*单个服务器资源消耗*/
        {
          path: 'singleServerResourceConsume',
          name: '单台服务器资源消耗',
          component: SingleServerResourceConsume,
        },
        /*单个资源消耗*/
        {
          path: 'SingleResourceConsume',
          name: '单台资源消耗',
          component: SingleResourceConsume,
        },
        {
          path: 'resourceRankingDetails',
          name: '排名详情',
          component: ResourceRankingDetails,
        }, {
          path: 'serverResource',
          name: '后台服务资源消耗',
          component: ServerResource
        },
        {
          path: 'nonLinearEditing',
          name: '近24小时非编业务详情',
          component: NonLinearEditing
        },
        {
          path: 'whosePiece',
          name: '近24小时审片业务详情',
          component: WhosePiece
        },
        {
          path: 'otherNearyly24Details',
          name: '近24小时合成业务详情',
          component: OtherNearyly24Details
        },
        {
          path: 'businessSuggest',
          name: '业务配置建议',
          component: BusinessSuggest
        },
        {
          path: 'serverSuggest',
          name: '后台服务器配置建议',
          component: ServerSuggest
        }
      ]
    }
  ]
})
