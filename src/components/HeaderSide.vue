<template>
<div class="headerSide">
  <section class="head">
    <div class="header-nav clear content">
      <div class="logo fl">
        <p>Hisi <span>Compass</span></p>
        <p>BTV运维数据平台</p>
      </div>
      <ul class="fl nav-parent">
        <!--<li>-->
          <!--<router-link to="/">-->
            <!--<img src="./../assets/shouye.png"/>-->
            <!--<span>首页</span>-->
          <!--</router-link>-->
        <!--</li>-->
        <li>
          <router-link to="/">
            <img src="./../assets/jichuziyuanjiankong.png"/>
            <span>基础管理监控</span>
          </router-link>
        </li>
        <li>
          <!--<router-link to="businessHealthHome">-->
          <router-link to="/businessHealthDegree">
            <img src="./../assets/yewujiankangdu.png"/>
            <span>业务健康度</span>
          </router-link>
        </li>
        <li>
          <a>
            <img src="./../assets/ziyuanyouhuapeizhi.png"/>
            <span>资源优化配置</span>
          </a>
          <ul>
            <li>
              <router-link to="/resourdeOption">资源消耗</router-link>
            </li>
            <li>
              <router-link to="/businessSuggest">业务配置建议</router-link>
            </li>
            <li>
              <router-link to="/serverSuggest">服务器配置建议</router-link>
            </li>
          </ul>
        </li>
        <!--<li>-->
          <!--<router-link to="/equipmentDosageHome">-->
            <!--<img src="./../assets/shebeiyongliang.png"/>-->
            <!--<span>设备用量</span>-->
          <!--</router-link>-->
        <!--</li>-->
        <!--<li>-->
          <!--<router-link to="/warningCenter">-->
            <!--<img src="./../assets/gaojingzhongxin.png"/>-->
            <!--<span>告警中心</span>-->
          <!--</router-link>-->
        <!--</li>-->
        <li>
          <a>
            <img src="./../assets/yunweigongju.png"/>
            <span>运维工具</span>
          </a>
          <ul style="height: 94px">
            <li>
              <router-link to="/Operations">设备维护</router-link>
            </li>
            <li>
              <router-link to="/DBPolling">数据库巡检</router-link>
            </li>
          </ul>
        </li>
        <li>
          <a>
            <img src="./../assets/gaojingzhongxin.png"/>
            <span>管理工具</span>
          </a>
          <ul style="height: 94px">
            <li>
              <router-link to="/Tool/Scheduling">排班管理</router-link>
            </li>
            <li>
              <router-link to="/Tool/Knowledge">知识库</router-link>
            </li>
          </ul>
        </li>
        <li>
          <router-link to="/Setting">
            <img src="./../assets/xitongpeizhi.png"/>
            <span>系统配置</span>
          </router-link>
        </li>
      </ul>
      <div class="fr operation">
        <span class="logo-name">北京电视台</span>
        <div class="username dropdown">
          <img src="./../assets/touxiang.png"/>
          <span class="dropdown-toggle" data-toggle="dropdown">Joker<i><img src="./../assets/xialajiantou.png"/></i></span>
          <ul class="dropdown-menu">
            <li @click="modificationPass()">修改密码</li>
            <li @click="logOut()">退出登录</li>
          </ul>
        </div>
        <span class="setting">
          <img src="./../assets/shezhi.png"/>
        </span>
      </div>
    </div>
  </section>
  <section v-show="histoyeRouter.length>0">
    <div class="header-tab content">
      <ul>
        <li v-for="(item,index) in histoyeRouter" v-bind:class="item.className">
          <a @click="toRouterPath(item.url,$event,index)" >{{item.name}}<i class="icon pe-close" @click="deleteHistoryRouter(index,$event)"></i></a>
        </li>
      </ul>
    </div>
  </section>
  <router-view/>
</div>
</template>

<script>
  import {GlobalVar} from '../../static/js/utils'
  export default {
   name:'headerSide',
   data(){
     return{
       histoyeRouter:[]
     }
   },
   methods:{
     modificationPass:function () {
       //修改密码
     },
     logOut:function () {
       //退出登录
     },
     toRouterPath:function (path,e,index) {
       //GlobalVar.historyRouter[index].className = 'active';
       $(e.target).parents('ul').find('li').removeClass('active');
       $(e.target).parent().addClass('active');
       this.$router.push({ path: path });
     },
     deleteHistoryRouter:function (index,e) {
       e.cancelBubble = true;
       GlobalVar.historyRouter.splice(index,1);
       if(GlobalVar.historyRouter.length>0){
            if((GlobalVar.historyRouter.length - 1)>=index){
              this.$router.push({ path: GlobalVar.historyRouter[index].url });
            }else{
              this.$router.push({ path: GlobalVar.historyRouter[index - 1].url });
            }
       }
     }
   },
   mounted:function () {
     this.histoyeRouter = GlobalVar.historyRouter;
   }
 }

</script>
<style scoped>

  ul.nav-parent>li{
    margin: 0 10px;
  }

  .dropdown-menu{
    min-width: 124px;
  }

  section{
    box-shadow: 0px 1px 0px 0px #dcdcdc;
    background-color: #ffffff;
  }
  section.head{
    height: 88px;
  }
  ul{
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ul.nav-parent li,
  div.header-tab ul li{
    display: inline-block;
    vertical-align: top;
  }
  .logo{
    margin-right: 66px;
  }

  .logo p{
    padding:0;
    color: #555555;
    margin: 0;
  }
  .logo p:first-child{
    font-size: 20px;
    margin-top: 11px;
  }
  .logo p:first-child span{
    color: #18d96e;
  }

  .logo p:last-child{
    font-size: 18px;
  }

  ul.nav-parent>li{
    text-align: center;
    width: 120px;
    height: 88px;
    cursor: pointer;
    position: relative;

  }
  ul.nav-parent>li>a{
    display: block;
    height: 88px;
  }

  ul.nav-parent>li>a.router-link-exact-active{
    background-color: #f5f5f5;
  }
  ul.nav-parent>li:hover{
    background-color: #f5f5f5;
  }

  ul.nav-parent>li>a>img{
    margin-top: 11px;
  }
  ul.nav-parent>li>a>span{
    display: block;
    font-size: 14px;
    font-weight: bold;
    color: #555555;
    margin-top: 2px;
  }
  ul.nav-parent>li>a{
    text-decoration: none;
  }

  ul.nav-parent>li>ul{
    position: absolute;
    width: 188px;
    height: 148px;
    border-radius: 4px;
    border: solid 1px #cccccc;
    z-index: 101;
    background-color: #ffffff;
    top: 78px;
    display: none;
  }

  ul.nav-parent>li>ul>li{
    display: block;
    width: 148px;
    height: 40px;
    margin: 4px auto ;
    line-height: 40px;
    background-color: #f5f5f5;
  }
  ul.nav-parent>li>ul>li>a{
    font-size: 14px;
    display: block;
    color: #555555;
  }
  ul.nav-parent>li>ul>li>a:hover{
    text-decoration: none;
    background-color: #e6e6e6;
  }

  ul.nav-parent>li:hover ul{
    display: block;
  }

  div.operation>span,
  div.operation>div{
    display: inline-block;
    color: #555555;
  }
  div.operation span.logo-name{
    font-size: 16px;
    font-weight: bold;
    line-height: 88px;
  }

  div.operation div.username{
    margin: 0 31px;
    font-size: 14px;
    position: relative;
  }

  div.operation div.username>span{
    display: inline-block;
    margin: 0 4px;
    cursor: pointer;
  }

  div.operation div.username>span i{
    display: inline;
    margin-left: 4px;
  }

  div.operation div.username ul{
    position: absolute;
    bottom: -86px;
    width: 124px;
    height: 74px;
    background-color: #ffffff;
    border: solid 1px #cccccc;
    border-radius: 4px;
    padding: 0;
    margin: 0;
    z-index: 101;
  }
  div.operation div.username ul li{
    padding: 0;
    margin: 0;
    display: block;
    height: 36px;
    font-size: 14px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;

  }

  div.operation div.username ul li:hover{
    background-color: #f5f5f5;
  }

  div.operation span.setting{
    width:64px;
    height: 88px;
    text-align: center;
    vertical-align: top;
    line-height: 88px;
    background-color: #f5f5f5;
    cursor: pointer;
  }

  div.header-tab{
    height: 40px;
    background-color: #ffffff;
    font-size: 12px;
    position: relative;
    margin-top: 1px;
  }

  div.header-tab ul{
    position: absolute;
    bottom: 0;
    height: 32px;
    text-align: center;
  }


  div.header-tab ul li a{
    display: block;
    /*line-height: 27px;*/
    color: #555555;
    /*width: 100px;*/
    padding: 0 20px;
    position: relative;
    height: 32px;
    line-height: 32px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    text-decoration: none;

  }

  div.header-tab ul li a i{
    width: 8px;
    height: 8px;
    color: #676767;
    position: absolute;
    right: 9px;
    top: 0px;
    font-size: 16px;
    font-weight: bold;
    display: none;
  }

  div.header-tab ul li.active a{
    background-color: #f5f5f5;
    border-top:1px solid #d3d3d3;
    border-left:1px solid #d3d3d3;
    border-right:1px solid #d3d3d3;
    height: 33px;
  }

  div.header-tab ul li.active a i{
    display: block;
  }


  /**/
</style>
