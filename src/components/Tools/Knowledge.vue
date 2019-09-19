<template>
  <main-container class="main-container">
    <!--跳转头-->
    <div class="skip-header">
      <div class="head-fr">
        <span class="green-font">管理工具</span> /
        <span>知识库</span>
      </div>
    </div>
    <!--知识库主体-->
    <div class="know-box col-md-12" id="knBox" v-cloak>
      <!--知识库内容-->
      <!--左侧内容-->
      <div class="col-md-3 content-box" id="contentMenu" style="border-right: 20px solid #f5f5f5">
        <p class="class-title">
          <span class="title-side"></span>
          <span>知识分类</span>
          <img src="../../assets/shezhilan.png" alt="set" @click="addKnowClass()"/>
        </p>
        <ul class="knClass">
          <li>
            <a @click="getKnowledgeById(0)"><i class="dot-yellow"></i>全部（{{totalCount}}）</a>
          </li>
          <li v-for="item in menuList">
            <a @click="getKnowledgeById(item.id)"><i class="dot-gray"></i>{{item.menuName}}（{{item.contentItemSize}}）</a>
            <ul>
              <li v-for="subMenu in item.childMenus">
                <a @click="getKnowledgeById(subMenu.id)">{{subMenu.menuName}}（{{subMenu.contentItemSize}}）</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="col-md-9 content-box" id="contentBox">
        <div class="search-head">
          <!--头部搜索框，新增知识按钮-->
          <div class="" style="position: relative;padding: 0;float: left;" id="searchBox">
            <input type="text" @keyup.13="getKnowledgeByKeywords()" id="searchKn" placeholder="输入名称活或关键字进行搜索" v-model="searchContent" />
            <img src="../../assets/huiche.png" alt="searchDelete" @click="getKnowledgeByKeywords()"/>
          </div>
          <span id="addKn" class="" @click="addKnowData()">
					<img src="../../assets/xinzengzhishi.png" alt="add"/>新增知识
				</span>

        </div>
        <ul class="knBox">
          <li v-for="item in contentList">
            <p class="p-title">
              <span class="knle-title content-text"
                    @click="hrefContent(item.id)">【{{item.root}}】{{item.title}}</span>
              <span class="spanClass span-green">{{item.menuName}}</span>

              <span class="spanAttach" v-if="item.haveFile">附</span>
            </p>
            <p class="p-content content-text"><span>{{removeHTMLTag(item.content)}}</span></p>
            <p class="p-author">撰写人：{{item.user}}&nbsp;&nbsp;|&nbsp;&nbsp;更新日期：{{item.updateTime.substring(0,4)}}年{{item.updateTime.substring(4,6)}}月{{item.updateTime.substring(6,8)}}日</p>
            <span class="knbn-box">
              <i class="kn-edit" @click="editKnowlege(item.id)"></i>
              <i class="kn-delete" @click="deleteKnow(item.id)"></i>
            </span>
          </li>
        </ul>
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
                    <li @click="selectPageNumber(20)">20</li>
                  </ul>
                </div>

              </div>
              <div>总条数 {{total}}，共 {{totalPages}} 页</div>
            </div>

            <div class="page-number fr">
              <div class="page-turning" id="paging"></div>
              <div class="go-page">
            <span>
              <input type="number" v-model="gotoPage" @keyup="changeBorderColor()"/>
            </span>
                <span @click="gotoPageClick()">GO</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
    <!--新增分类弹窗-->
    <el-dialog :visible.sync="dialogFormVisible" width="907px">
      <span slot="title" style="font-size: 16px;font-weight: bold;color: #555">
        <i class="i-icon" style="width: 8px;"></i>
        新增分类
      </span>
      <div class="dialog-body" style="overflow:hidden;">
        <div class="col-md-11" style="padding: 0;width: 100%;">
          <div id="clBox">
            <p class="p-add"><span @click="addFirstMenu()"><i>+</i>新增一级分类</span></p>
            <div id="allMenu" class="all-menu" tabindex="1" style="outline: none;">
              <ul class="class-list">
                <li class="cl1-li first-meun" v-for="(list,index) in allMeunList">
                  <a class="a-level1">
                    <i data-toggle="collapse"  class="fold-yellow" v-bind:href="['#menuId'+index]"></i>
                    <input data-menuid="76" v-model="list.menuName" @blur="updateMenuName(list.id,$event)">
                  </a>
                  <span class="btn-gp">
                  <img src="../../assets/shang.png" alt="moveup" data-id="76" title="上移" @click="moveFirstMenu(index,1)">
                  <img src="../../assets/xia.png" alt="movedown" title="下移" @click="moveFirstMenu(index,-1)">
                  <img src="../../assets/ding.png" alt="movetop" title="置顶" @click="moveTopAndBottomFirstMenu(index,1)">
                  <img src="../../assets/di.png" alt="movebottom" title="置底" @click="moveTopAndBottomFirstMenu(index,-1)">
                  <img src="../../assets/guanbi_03.png" @click="deleteMenu(1,list.id)" alt="movedelete"
                       style="margin-left: 50px;">
                </span>
                  <ul  class="collapse" v-bind:id="['menuId'+index]">
                    <li class="child-meun" v-for="(item,listIndex) in list.childMenu"><a class="a-level2"><img src="../../assets/dot-yellow.png"
                                                                                      class="dot-yellow">
                      <input data-menuid="87" data-paremntmenuid="76" v-model="item.menuName" @blur="updateMenuName(item.id,$event)">
                      <i class="btn-gp btn-gp-gray">
                        <img src="../../assets/shang.png" alt="moveup" title="上移" @click="moveSecondMenu(index,listIndex,1)">
                        <img src="../../assets/xia.png" alt="movedown" title="下移" @click="moveSecondMenu(index,listIndex,-1)">
                        <img src="../../assets/ding.png" alt="movetop" title="置顶" @click="moveTopAndBottomSecondMenu(index,listIndex,list.id,item.menuSort,1)">
                        <img src="../../assets/di.png" alt="movebottom" title="置底" @click="moveTopAndBottomSecondMenu(index,listIndex,list.id,item.menuSort,-1)">
                        <img src="../../assets/guanbi_03.png" @click="deleteMenu(-1,list.id,item.id)" alt="movedelete"
                             style="margin-left: 50px;">
                      </i></a>
                    </li>
                    <li><a class="a-level2">
                    <span style="text-align: center;" @click="addSubMenu(index,list.id)">
                      <i>+</i>新增二级分类
                    </span></a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--删除弹窗-->
    <el-dialog :visible.sync="deleteVisible" width="500px">
      <div slot="title" style="font-size: 16px;font-weight: bold;color: #555">
        <i class="icon-waring"></i>
        <span>重要提醒</span>
      </div>
      <div class="dele-info">
        <p>{{deleteHint}}？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 120px;background-color: #ff6c60;border-radius: 0;border-color: rgba(0,0,0,0)"
                   type="primary" size="small" @click="affirmDelete()">确认删除
        </el-button>
        <el-button style="border-radius: 0;width: 120px;" @click="hidePop()" type="info" size="small">取 消
        </el-button>
      </div>
    </el-dialog>
    <!--新增知识-->
    <el-dialog :visible.sync="addKnowVisible" width="907px" class="modal-box">
      <div class="content-title">
        <!--<el-form model="form" rules="rules" ref="form" label-position="top" size="small" :inline="true">-->
        <el-form ref="form" label-position="top" :rules="rules"  size="small" :model="form">
          <div class="col-md-12" style="overflow: hidden;padding: 0;">
            <p class="p-title"><span class="title-side"></span>分类</p>
            <div class="p-select" style="float: left;">
              <el-form-item label="" prop="typeName" style="float: left;">
                <el-select placeholder="请选择" v-model="form.typeName" @change="getFirstMenu()">
                  <el-option v-for="(list,index) in menuList" :key="index" :label="list.menuName" :value="list.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" prop="secondName" style="float: left;margin-left: 10px;">
                <el-select placeholder="请选择" v-model="form.secondName">
                  <el-option v-for="(list,index) in secondMenuList" :key="index" :label="list.menuName" :value="list.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="col-md-12" style="overflow:hidden;padding: 0;">
            <p class="p-title" style="margin: 0;"><span class="title-side"></span>主题</p>
            <p class="p-select" style="width: 70%;float: left;margin: 0 0 0 10px;">
              <el-form-item label="" style="width: 100%" prop="name">
                <el-input auto-complete="off" placeholder="在此输入主题" v-model="form.name"></el-input>
              </el-form-item>
            </p>
          </div>
          <div class="col-md-12" style="overflow:hidden;padding: 0;">
            <p class="p-title"><span class="title-side"></span>正文</p>
            <div class="p-select" style="width: 95%; padding: 10px;">
              <textarea id="newsEditor" name="content" style="height: 360px;width: 100%;border: 1px solid #cccccc"></textarea>
            </div>
          </div>
          <div class="col-md-12" style="overflow:hidden;padding: 0;">
            <p class="p-title"><span class="title-side"></span>附件</p>
            <div class="p-select" style="width: 95%;">
              <form id="formData" method="post">
              <span class="add-attach">
              <i>+</i>
              </span>
                <input @click="uploadingEnclosure()" type="file" id="fileLoad" name="file" multiple="multiple"
                       accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
              application/msexcel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,
              image/jpeg,image/png,image/gif,application/vnd.ms-powerpoint,
              application/vnd.openxmlformats-officedocument.presentationml.presentation,
              text/plain" >
              </form>
              <ul class="p-select attach-list" id="attachList">
                <li v-for="(attach,index) in enclosureList">
                  <div class="attach-name png" >
                    <span class="file-name">{{attach.oldName}}</span>
                    <img src="../../assets/move-delete.png" alt="delete" @click="deleteEnclosure(attach.url,index)"/>
                    <a :href="attach.url" :download="attach.newName">
                      <img src="../../assets/kn-download.png" alt="download"/>
                    </a>

                  </div>
                </li>
                <div class="progress">
                  <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45"
                       aria-valuemin="0" aria-valuemax="100" style="width: 100%">
                    <span class="sr-only">45% Complete</span>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="submitKnowledge('form')" :disabled="submitDisabled" style="width: 120px;background-color: #58c9f3;border-radius: 0;border-color: rgba(0,0,0,0)"
                   type="primary" size="small">发 表
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
  import ElFooter from "../../../node_modules/element-ui/packages/footer/src/main.vue";
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";

  Vue.component(template.name, template);
  $(function () {
    GlobalVar.setScroll('all-menu');

  });
  export default {
    components: {
      ElForm,
      ElFooter,
      MainContainer},
    name: "knowledge",
    data() {
      return {
        isFirstGetData:true,
        deleteHint:'确定要删除该知识吗',
        gotoPage:1,
        pageNum: 1,//当前页码
        pageSize: 10,//每页显示的条数
        total: 10,//总条数
        totalPages: 1,//总页数
        menuId:0,//当前选择的菜单的id，默认显示全部 0
        searchContent: "",//搜索的内容
        dialogFormVisible: false,//新增分类
        deleteVisible: false,//删除弹窗
        addKnowVisible: false,//新增知识
        totalCount:'0',//总条数
        menuList:[],//菜单集合
        contentList:[],//知识库内容list
        allMeunList:[],
        secondMenuList:[],
        deleteMenuId:'',
        deleteParentId:5,
        isDateMenu:true,//true是删除菜单，false是删除知识
        enclosureList:[],//附件的集合
        form:{
          typeName:'',
          secondName:'',
          name:''
        },
        themeName:'',//主题名字
        contentId:'',
        editor:'',//富文本
        submitDisabled:false,
        deleteKnowlegeId:'',
        rules:{
          typeName:[
            {required: true, message: '请选择菜单', trigger: 'change'}
           ],
          secondName:[
            {required: true, message: '请选择菜单', trigger: 'change'}
          ],
          name:[
            {required: true, message: '请输入主题', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      let self = this;
      let router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      };
      GlobalVar.setHistoryRouter(router);
      //得到所有的数据
      getAllData(self.menuId,self.pageNum,self.pageSize,self.searchContent,self);


    },
    methods: {
      removeHTMLTag:function (str) {
        str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
        //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
        str = str.replace(/&nbsp;/ig, ''); //去掉&nbsp;
        str = str.replace(/\s/g, ''); //将空格去掉
        //console.log(str)
        return str;
      },
      selectPageNumber: function (falg) {
        let self = this;
        self.isFirstGetData = false;
        self.pageNum = 1;
        self.pageSize = falg;
        getAllData(self.menuId,self.pageNum,self.pageSize,self.searchContent,self);
      },
      gotoPageClick:function () {
        var self = this;
        if(gotoPage>0){
          self.pageNum = gotoPage;
          getAllData(self.menuId,self.pageNum,self.pageSize,self.searchContent,self);
        }
      },
      /*==========================================菜单操作============= */
      //修改菜单的名字
      updateMenuName:function (id,e) {
        let menuName = $(e.target).val();
        updateMenuName(id,menuName);
      },
      //移动一级菜单
      moveFirstMenu:function (index,flag) {
        var self = this;
        var menuId1;
        var sortId1;
        var menuId2;
        var sortId2;
        var clickData = this.allMeunList[index];
        menuId1 = Number(clickData.id);
        sortId1 = Number(clickData.menuSort);
        if(flag > 0){
          //上移
          if(index != 0){
            //需要和之交换的的菜单
            var moveData = this.allMeunList[Number(index) - 1];
            menuId2 = Number(moveData.id);
            sortId2 = Number(moveData.menuSort);
            moveMenu(menuId1,menuId2,sortId1,sortId2,self);
          }
        }else{
          //下移
          if(index < (Number(this.allMeunList.length) - 1)){
            var moveData = this.allMeunList[Number(index) + 1];
            menuId2 = Number(moveData.id);
            sortId2 = Number(moveData.menuSort);
            moveMenu(menuId1,menuId2,sortId1,sortId2,self);
          }
        }
      },
      //置顶和置底一级菜单
      moveTopAndBottomFirstMenu:function (index,flag) {
        var self = this;
        if(flag> 0){
          //置顶
          if(Number(index) != 0) {
            var data = this.allMeunList;
            var menuIds = [];
            for(var i = 0;i<=index;i++){
              menuIds.push(Number(data[i].id));
            }
            moveTopOrBottom(menuIds,0,self);
          }
        }else{
          //置底
          if(index < (Number(this.allMeunList.length) - 1)) {
            var data = this.allMeunList;
            var menuIds = [];
            for(var i = index;i<data.length;i++){
              menuIds.push(Number(data[i].id));
            }
            moveTopOrBottom(menuIds,1,self);
          }
        }
      },

      //移动二级菜单
      moveSecondMenu:function (parentIndex,index,flag) {
        var self = this;
        var menuId1;
        var sortId1;
        var menuId2;
        var sortId2;
        if(flag>0){
          //上移
          if(index != 0) {
            //被点击的菜单
            var clickData = this.allMeunList[parentIndex].childMenu[index];
            menuId1 = Number(clickData.id);
            sortId1 = Number(clickData.menuSort);
            //需要和之交换的的菜单
            var moveData = this.allMeunList[parentIndex].childMenu[Number(index) - 1];
            menuId2 = Number(moveData.id);
           sortId2 = Number(moveData.menuSort);
            moveMenu(menuId1, menuId2, sortId1, sortId2,self);
          }
        }else{
          //下移
          if(index < (Number(this.allMeunList[parentIndex].childMenu.length) - 1)) {
            //被点击的菜单
            var clickData = this.allMeunList[parentIndex].childMenu[index];
            menuId1 = Number(clickData.id);
            sortId1 = Number(clickData.menuSort)
            //需要和之交换的的菜单
            var moveData = this.allMeunList[parentIndex].childMenu[Number(index) + 1];
            menuId2 = Number(moveData.id);
            sortId2 = Number(moveData.menuSort)
            moveMenu(menuId1, menuId2, sortId1, sortId2,self);
          }
        }

      },
      /*置顶和置底二级菜单*/
      moveTopAndBottomSecondMenu:function (parentIndex, index,parentId,sortId,flag) {
        var self = this;
        if(flag> 0){
          //置顶
          if(Number(index) != 0) {

            var data = this.allMeunList[parentIndex].childMenu;
            var menuIds = [];
            for(var i = 0;i<=index;i++){
              menuIds.push(Number(data[i].id));
            }
            moveTopOrBottom(menuIds,0,this);

          }
        }else{
          //置底
          if(index < (Number(this.allMeunList[parentIndex].childMenu.length) - 1)) {
            //被点击的菜单
            var data = this.allMeunList[parentIndex].childMenu;
            var menuIds = [];
            for(var i = index;i<data.length;i++){
              menuIds.push(Number(data[i].id));
            }
            moveTopOrBottom(menuIds,1,self);
          }
        }
      },
      //新增一级菜单
      addFirstMenu:function () {
        var self = this;
        var len = this.allMeunList.length;
        addFirstMenuAjax('一级菜单' + len,self);
      },
      //新增二级菜单
      addSubMenu:function (parentIndex,parentId) {
        var self = this;
        var len = this.allMeunList[parentIndex].childMenu.length;
        addSubMenuAjax('二级菜单'+len, parentId,self);
      },
      //删除菜单
      deleteMenu:function (flag,parentId,menuId) {
        this.deleteVisible = true;
        var self = this;
        self.isDateMenu = true;
        if(flag>0){
          //删除一级
          self.deleteHint = '删除该菜单后，下面的二级菜单会一起删除，你确定要删除';
          self.deleteMenuId = parentId;
          self.deleteParentId = 5;
        }else{
          //删除二级
          self.deleteHint = '你确定要删除';
          self.deleteMenuId = menuId;
          self.deleteParentId = parentId;
        }

      },
      //确认删除
      affirmDelete:function () {
        var self = this;
        if(self.isDateMenu){
          //删除菜单
          deleteMenu(self.deleteMenuId,self.deleteParentId,self);
        }else{
          //删除知识
          deleteKnowledgeById(self,self.deleteKnowlegeId);
        }
      },

      // 新增分类弹窗
      addKnowClass: function () {
        const self = this;
        self.dialogFormVisible = true;
        getAllMenu(self);
      },

      /*===========================知识库===========*/
      //通过id得到知识库列表
      getKnowledgeById:function (id) {
        var self = this;
        self.menuId = id;
        self.isFirstGetData = false;
        getAllData(self.menuId,self.pageNum,self.pageSize,self.searchContent,self);
      },
      //通过关键字搜索知识
      getKnowledgeByKeywords:function () {
        var self = this;
        getAllData(self.menuId,self.pageNum,self.pageSize,self.searchContent,self);

      },

      //上传附件
      uploadingEnclosure:function () {
        var self = this;
        uploadingEnclosureAjax(self);
      },

      //删除附件
      deleteEnclosure:function (url,index) {
        var self = this;
        //enclosureList
        $.ajax({
          type: "get",
          url: GlobalVar.ddmUrl+"/hisicompass-knowledge/knowledge/contentFileDelete",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          data: {
            "url": url
          },
          success: function(result) {
            if(Number(result.status) == 200) {
              self.enclosureList.splice(index,1);
            }
          }
        })
      },

      //菜单联动
      getFirstMenu:function () {
        var self = this;
        self.form.secondName = '';
        self.secondMenuList = [];
        var id = this.form.typeName;
        for(var i = 0;i<self.menuList.length;i++){
          if(self.menuList[i].id == id){
              self.secondMenuList = self.menuList[i].childMenus;
          }
        }
      },

      //编辑知识
      editKnowlege:function (id) {
        var self = this;
        self.addKnowVisible = true;
        self.contentId = id;
        self.enclosureList = [];
        if(!self.editor){
          richText('textarea[name="content"]',self);
        }
        getKnowlegeById(id,self);
      },

      //提交知识
      submitKnowledge:function (form) {
        var self = this;
        if(self.submitDisabled){
          return
        }
        self.$refs[form].validate((valid) => {
          if (valid) {
            //验证通过
            self.isFirstGetData = false;
            var childMenu  = [];
            var parentMenuId = this.form.typeName;
            var childMenuId = this.form.secondName;
            var childMenuName;
            var parentMenuName;

            for(var i = 0;i<self.allMeunList.length;i++){
              if(Number(self.allMeunList[i].id) == Number(parentMenuId)){
                parentMenuName = self.allMeunList[i].menuName;
                childMenu = self.allMeunList[i].childMenu;
                for(var j = 0;j<childMenu.length;j++){
                  if(Number(childMenu[j].id) == Number(childMenuId)){
                    childMenuName = childMenu[j].menuName;
                  }
                }
              }
            }

            var menuVO = {
              "parentMenuId": parentMenuId,
              "childMenuId": childMenuId,
              "parentMenuName": parentMenuName,
              "childMenuName": childMenuName
            }
            var content ={
              "id": self.contentId,
              "menuId": childMenuId,
//          "title": self.themeName,
              "title": self.form.name,
              "root": "手动添加",
              "user": 'admin',
              "userId": 1,
              "updateTime": getTime(),
              "content":self.editor.html(),
              "haveFile": null,
              "menuName": childMenuName
            }
             addAndModifKnowledge(self,menuVO,content);

          } else {
            return false;
          }
        });




      },

      // 删除知识弹窗出现
      deleteKnow: function (id) {
        const self = this;
        self.deleteVisible = true;
        self.isDateMenu = false;
        self.deleteHint = '确定要删除该知识吗';
        self.deleteKnowlegeId = id;
      },
      //新增知识弹窗
      addKnowData: function () {
        const self = this;
        self.contentId = '';
        self.addKnowVisible = true;
        self.enclosureList = [];
        self.form.typeName = '';
        self.form.secondName = '';
//        self.themeName = '';
        self.form.name = '';
        if(!self.editor){
          richText('textarea[name="content"]',self);
        }else{
          self.editor.html('');
        }
      },

      //隐藏弹窗
      hidePop: function () {
        this.deleteVisible = false;
      },

    }

  }


  //得的时间  20180309105109
  function  getTime() {
    var time = new Date();
    var knMonth = "";
    var knDate = "";
    var knHour = "";
    var knMinute = "";
    var knSecond = "";
    if(String(time.getMonth() + 1).length < 2) {
      knMonth = "0" + (time.getMonth() + 1).toString();
    } else {
      knMonth = String(time.getMonth() + 1)
    }
    if(String(time.getDate()).length < 2) {
      knDate = "0" + time.getDate().toString();
    } else {
      knDate = time.getDate();
    }
    if(String(time.getHours()).length < 2) {
      knHour = "0" + time.getHours().toString();
    } else {
      knHour = time.getHours()
    }
    if(String(time.getMinutes()).length < 2) {
      knMinute = "0" + time.getMinutes().toString();
    } else {
      knMinute = time.getMinutes()
    }
    if(String(time.getSeconds()).length < 2) {
      knSecond = "0" + time.getSeconds().toString();
    } else {
      knSecond = time.getSeconds()
    }
    var submitTime = '' + time.getFullYear() + knMonth + knDate + knHour + knMinute + knSecond;
    return submitTime;
  }


  /*=======================知识库===========================*/
  /*富文本*/
  function richText(K,self) {
    self.$nextTick(function () {
      self.editor = KindEditor.create(K,{
        items: [
          'formatblock', 'fontname', 'fontsize', '|',
          'forecolor', 'hilitecolor', 'bold', 'italic', '|',
          'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', '|',
          'insertorderedlist', 'insertunorderedlist', 'lineheight', '|',
          'image', 'multiimage'
        ],
        resizeType: 0,
        uploadJson: GlobalVar.ddmUrl+'/hisicompass-knowledge/knowledge/pictureUpload',
        allowPreviewEmoticons: false,
        allowImageRemote:false,
        //调用kindeditor的afterCreate回调函数对kindeditor功能进行“扩展”，实现图片粘贴上传。
        afterCreate: function() {
          var editerDoc = this.edit.doc; //得到编辑器的文档对象
          //监听粘贴事件, 包括右键粘贴和ctrl+v
          //监听粘贴事件, 包括右键粘贴和ctrl+v
          $(editerDoc).bind('paste', null, function(e) {
            /*获得操作系统剪切板里的项目，e即kindeditor,
                     *kindeditor创建了originalEvent(源事件)对象，
                     *并指向了浏览器的事件对象，而chrome浏览器
                     *需要通过clipboardData(剪贴板数据)对象的items
                     *获得复制的图片数据。
                     */
            var ele = e.originalEvent.clipboardData.items;
            for(var i = 0; i < ele.length; ++i) {
              //判断文件类型
              if(ele[i].kind == 'file' && ele[i].type.indexOf('image/') !== -1) {
                var file = ele[i].getAsFile(); //得到二进制数据
                //创建表单对象，建立name=value的表单数据。
                var formData = new FormData();
                formData.append("file", file); //name,value

                //用jquery Ajax 上传二进制数据
                $.ajax({
                  url: GlobalVar.ddmUrl+'/hisicompass-knowledge/knowledge/pictureUpload',
                  type: 'POST',
                  data: formData,
                  // 告诉jQuery不要去处理发送的数据
                  processData: false,
                  // 告诉jQuery不要去设置Content-Type请求头
                  contentType: false,
                  dataType: "json",
                  beforeSend: function() {
                    //console.log("正在进行，请稍候");
                  },
                  success: function(responseStr) {
                    //上传完之后，生成图片标签回显图片，假定服务器返回url。
                    var src = responseStr.url;
                    var imgTag = "<img src='" + src + "' border='0' width='200'/>";

                    //console.info(imgTag);
                    //kindeditor提供了一个在焦点位置插入HTML的函数，调用此函数即可。
                    self.editor.insertHtml(imgTag);

                  },
                  error: function(responseStr) {
                    console.log("error");
                  }
                });
              }
            }
          });
        },
        afterUpload : function(url, data, name) { //上传文件后执行的回调函数，必须为3个参数
          if(name=="image" || name=="multiimage"){ //单个和批量上传图片时
            var img = new Image(); img.src = url;
            img.onload = function(){ //图片必须加载完成才能获取尺寸
              if(img.width>200) self.editor.html(self.editor.html().replace('<img src="' + url + '"','<img src="' + url + '" width="200"'))
            }
          }
        }
      });
    })
  }


  /*上传附件*/
  function uploadingEnclosureAjax(self) {
    $("#fileLoad").unbind('change').change(function() {
      $("#formData").attr("action", GlobalVar.ddmUrl+"/knowledge/fileUpload");
      //不对字符编码。 在使用包含文件上传控件的表单时，必须使用该值。
      $("#formData").attr("enctype", "multipart/form-data");
      var formData = new FormData();
      for(var i = 0; i < document.getElementById("fileLoad").files.length; i++) {
        formData.append("file", document.getElementById("fileLoad").files[i]);
      }
      if(formData.has('file')) {
        $.ajax({
          type: "post",
//          url: GlobalVar.ddmUrl+"/hisicompass-knowledge/knowledge/fileUpload",
          url: GlobalVar.ddmUrl+"/zuul/hisicompass-knowledge/knowledge/fileUpload",
          contentType: false,
          processData: false,
          data: formData,
          beforeSend: function(XMLHttpRequest) {
            $('.progress').show();
          },
          success: function(result) {
            if(Number(result.status) == 200){
              $('.progress').hide();
              if(!GlobalVar.isEmptyObject(result.data)){
                for(var i= 0;i<result.data.length;i++){
                  self.enclosureList.push(result.data[i]);
                }
              }
               $('#fileLoad').val('');
            }
          }
        });
      }
    })
  }


  /*
  *得到所有的数据
  * menuId  查看全部内容传0（菜单的id）
  * pageNum  当前页码
  * pageSize  每页条数
  * searchLike  搜索内容 （标题，和内容的模糊搜索）
  */
  function getAllData(menuId,pageNum,pageSize,searchLike,self) {
    $.ajax({
      url:GlobalVar.ddmUrl+'/hisicompass-knowledge/knowledge/index',
      type: "get",
      data: {
        "menuId": menuId,
        "searchLike": searchLike,
        "pageNum": pageNum,
        "pageSize": pageSize
      },
      success:function (result) {
        if(Number(result.status) == 200){
          if(self.isFirstGetData){
            self.menuList = result.data.menuList;
          }
          self.totalCount = result.data.totalSize;
          self.contentList = result.data.contentList.rows;
          self.total = result.data.contentList.total;
          self.totalPages = result.data.contentList.pages;
          self.pageNum = result.data.contentList.pageNum;
          self.pageSize = result.data.contentList.pageSize;

          pageNumber(self.totalPages, self.pageNum, self)
        }

      },error:function (e) {

      }
    })
  }

  /*
  * 通过id删除知识库
  * */
  function deleteKnowledgeById(self,contentId) {
      $.ajax({
        type:'post',
        url:GlobalVar.ddmUrl+"/hisicompass-knowledge/knowledge/deleteContent",
        data: {
          "contentId": contentId
        },
        success:function (result) {
          if(Number(result.status) == 200){
            self.deleteVisible = false;
            getAllData(self.menuId,self.pageNum,self.pageSize,self.searchContent,self);
          }
        },error:function (e) {console.log(e)}
      })
  }

  /*
  * 通过id获取知识的详情
  * */
  function getKnowlegeById(contentId,self) {
    $.ajax({
      type:'post',
      url:GlobalVar.ddmUrl+"/hisicompass-knowledge/knowledge/contentEditPre",
      data: {
        "contentId": contentId
      },
      success:function (result) {
        if(Number(result.status) == 200){
          self.enclosureList = result.data.attachmentList;
          self.editor.html(result.data.content.content);
//          self.themeName = result.data.content.title;
          self.form.name = result.data.content.title;
          var menuVO = result.data.menuVO;
          for(var i = 0;i<self.menuList.length;i++){
            if(self.menuList[i].menuName == menuVO.parentMenuName){
              self.form.typeName = self.menuList[i].id;
              self.form.secondName = menuVO.childMenuId;
              self.secondMenuList = self.menuList[i].childMenus;
            }
          }
        }
      },error:function (e) {console.log(e)}
    })
  }

  /*
  * 添加和修改知识库
  * */
  function addAndModifKnowledge(self,menuVO,content) {
    var datas = {
      "menuVO": menuVO,
      "content": content,
      "attachmentList": self.enclosureList
    }
    $.ajax({
      type: "post",
      url: GlobalVar.ddmUrl+"/hisicompass-knowledge/knowledge/contentAddSave",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      data: JSON.stringify(datas),
      beforeSend: function(XMLHttpRequest) {
        self.submitDisabled = true;
      },
      success: function(result) {
        if(Number(result.status) == 200) {
          self.addKnowVisible = false;
          self.submitDisabled = false;
          getAllData(self.menuId,self.pageNum,self.pageSize,self.searchContent,self);
        }
      }
    })
  }


  /*=====================================菜单===================*/
  /*
  * 获取 所有的菜单
  * */
  function getAllMenu(self) {
    $.ajax({
      type:'post',
      url:GlobalVar.ddmUrl+"/hisicompass-knowledge/knowledge/menuEditPre",
      data: {},
      success:function (result) {
        if(Number(result.status) == 200){
          self.allMeunList = result.data;
        }
      },error:function (e) {console.log(e)}
    })
  }

  /*
  * 菜单移动
  * menuId1:被点击的菜单的id
  * menuId2:需要与之交换的菜单的id
  * menuId2：被点击的菜单的排序id
  * sortId2:需要与之交换的菜单的排序id
  * */
  function moveMenu(menuId1,menuId2,sortId1,sortId2,self) {
    $.ajax({
      type:'post',
      url:GlobalVar.ddmUrl+"/hisicompass-knowledge/knowledge/menuSwap",
      data: {
        menuId1: menuId1,
        menuId2: menuId2,
        sortId1: sortId1,
        sortId2: sortId2
      },
      success:function (result) {
        if(Number(result.status) == 200){
          getAllMenu(self)
        }

      },error:function (e) {console.log(e)}
    })
  }

  /*
  * 置顶和置底菜单
  * menuIds":[3,1,2], 因为我传给你的菜单已经根据sortid是排序后的了，此处需要你传给我从sortid最小到当前置顶sortid的菜单id,置底也是当前id到最大sortID的菜单号
  * type:1   如果是置顶传0，置底传1
  * */
  function moveTopOrBottom(menuIds,type,self) {
    var data = {
      "menuIds":menuIds,
      "type":type
    }
    $.ajax({
      type: "post",
      url: GlobalVar.ddmUrl+"/hisicompass-knowledge/knowledge/menuExtreme",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      data: JSON.stringify(data),
      success: function(result) {
        if(Number(result.status) == 200) {
          getAllMenu(self);
        }
      }
    })
  }

  /*
  * 修改菜单的名字
  * menuId:菜单id
  * menuName:菜单的名字
  * */
  function updateMenuName(menuId,menuName) {
    $.ajax({
      type:'post',
      url:GlobalVar.ddmUrl+"/hisicompass-knowledge/knowledge/menuEdit",
      data: {
        menuId: menuId,
        menuName: menuName
      },
      success:function (result) {
        if(Number(result.status) == 200){
          //修改成功
        }
      },error:function (e) {console.log(e)}
    })
  }

  /*
  * 新增一级菜单
  * /knowledge/menuAddFirst
  * */
  function addFirstMenuAjax(menuName,self) {
    $.ajax({
      type:'post',
      url:GlobalVar.ddmUrl+"/hisicompass-knowledge/knowledge/menuAddFirst",
      data: {
        menuName: menuName
      },
      success:function (result) {
        if(Number(result.status) == 200){
          getAllMenu(self);
        }
      },error:function (e) {console.log(e)}
    })
  }

  /*
  * 新增二级菜单
  * menuName:菜单名字
  * parentId:
  * */
  function  addSubMenuAjax(menuName,parentId,self) {
    $.ajax({
      type:'post',
      url:GlobalVar.ddmUrl+"/hisicompass-knowledge/knowledge/menuAddSecond",
      data: {
        menuName: menuName,
        parentId:Number(parentId)
      },
      success:function (result) {
        if(Number(result.status) == 200){
          getAllMenu(self);
        }
      },error:function (e) {console.log(e)}
    })
  }

  /*
  * 删除菜单
  * menuId:菜单id
  * parentId:父级菜单id
  * */
  function deleteMenu(menuId,parentId,self){
    $.ajax({
      type:'post',
      url:GlobalVar.ddmUrl+"/hisicompass-knowledge/knowledge/menuDelete",
      data: {
        menuId:menuId,
        parentId:parentId
      },
      success:function (result) {
        if(Number(result.status) == 200){
          self.deleteVisible = false;
          getAllMenu(self);
        }
      },error:function (e) {console.log(e)}
    })
  }




  /*
  * pageCount:总页数
  * current:当前页码
  * */
  function pageNumber(pageCount, current, self) {
    $("#paging").CreatePage({
      pageCount: pageCount,//总页数
      current: current,//当前页码
      backFn: function (page) {
        self.pageNum = page;
        //page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
        getAllData(self.menuId,self.pageNum,self.pageSize,self.searchContent,self);
      }
    });
  }



</script>

<style scoped>
  /*#allMenu::-webkit-scrollbar {display:none}*/
  .main-container {
    padding-top: 0;
    overflow: hidden;
  }

  /*==========跳转头样式开始=========*/
  .skip-header {
    width: 100%;
    height: 76px;
    line-height: 76px;
    overflow: hidden;
    position: relative;
  }

  .skip-header .head-fr {
    float: right;
    margin-right: 31px;
  }

  .skip-header .head-fr > span {
    font-size: 14px;
    color: #555555;
    cursor: pointer;
  }

  .skip-header .head-fr > span:first-child {
    margin-right: 10px;
  }

  .skip-header .head-fr > span:last-child {
    margin-left: 10px;
  }

  .skip-header .head-fr .green-font {
    color: #18d96e;
  }

  /*==========跳转头样式结束=========*/
  /*==========知识库主体样式开始=========*/
  .know-box, .content-box {
    padding: 0;
  }

  #contentMenu {
    /*width: 415px;*/
  }

  .content-box {
    background: #ffffff;
    border-radius: 2px;
    height: 822px;
  }

  .content-box p.class-title {
    height: 18px;
    margin: 28px 20px 0 0;
    line-height: 18px;
    text-indent: 12px;
    position: relative;
  }

  .content-box p.class-title .title-side,
  .pop-title .title-side {
    display: inline-block;
    height: 22px;
    width: 10px;
    background: #18d96e;
    position: absolute;
    top: 0;
    left: 0;
  }

  .content-box p.p-title span {
    font-size: 18px;
    color: #555555;
    font-weight: normal;
  }

  .content-box p.p-content span {
    font-size: 14px;
    color: #3399fb;
    font-weight: normal;
  }

  .content-box p span:nth-child(2) {
    display: inline-block;
    margin-left: 20px;
    vertical-align: middle;
  }

  .content-box p img {
    float: right;
    cursor: pointer;
  }

  /*ul li 列表部分*/
  ul li {
    list-style: none;
  }

  .knClass {
    padding: 0;
    margin: 20px;
  }

  .knClass li a {
    display: inline-block;
    color: #555555;
    font-size: 16px;
    height: 36px;
    line-height: 36px;
    text-indent: 30px;
    width: 100%;
    cursor: pointer;
    position: relative;
  }

  .knClass li a i {
    display: inline-block;
    width: 5px;
    height: 5px;
    position: absolute;
    top: 16px;
    left: 16px;
  }

  .knClass li a i.dot-yellow {
    background: url(../../assets/dot-yellow.png) no-repeat 50% 50%;
  }

  .knClass li a i.dot-gray {
    background: url(../../assets/dot-yellow.png) no-repeat 50% 50%;
  }

  .knClass li a:hover,
  .knl2-active {
    background: #f5f5f5;
  }

  .knClass li ul li a {
    color: #a5b2ca;
  }

  /*右边条目样式部分*/
  .search-head {
    margin: 30px 30px;
    padding: 0;
    overflow: hidden;
    position: relative;
  }

  #searchKn {
    width: 512px;
    height: 40px;
    border: 1px solid #eaeaea;
    background: #f2f2f2;
    /*background: #f2f2f2 url(../../assets/huiche.png) no-repeat 98% 50%;*/
    outline: none;
    color: #888888;
    font-size: 14px;
    text-indent: 22px;
  }
  #searchBox > img{
    display: inline-block;
    position: absolute;
    right: 16px;
    bottom: 16px;
    cursor: pointer;
  }

  #addKn {
    float: right;
    line-height: 40px;
    display: inline-block;
    font-size: 16px;
    color: #555555;
    text-align: right;
    cursor: pointer;
  }

  #addKn img {
    margin-right: 7px;
  }

  .knBox {
    margin: 30px 30px;
    padding: 0;
    height: 460px;
    overflow: auto;
  }

  .knBox li {
    display: inline-block;
    width: 100%;
    padding: 17px 30px;
    position: relative;
  }

  .knBox li {
    background: #f5f5f5;
    margin-bottom: 10px;
  }

  .knBox li p {
    margin: 0;
    padding: 2px;
  }

  .knBox li p.p-title {
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    line-height: 18px;
  }

  .knle-title:hover {
    text-decoration: underline;
  }

  .knBox li p.p-title span.spanClass,
  .knBox li p.p-title span.spanAttach {
    display: inline-block;
    font-size: 12px;
    padding: 0px 6px;
    margin-right: 15px;
  }

  .knle-title {
    margin-right: 15px;
  }

  .knBox li p.p-title span.span-green {
    border: 1px solid #58c9f3;
    color: #58c9f3;
  }

  .knBox li p.p-title span.span-blue {
    margin-left: 0;
    border: 1px solid #0f89fd;
    color: #0f89fd;
    margin-right: 3px;
  }

  .knBox li p.p-title span.spanAttach {
    border: 1px solid #ff4f4f;
    color: #ff4f4f;
  }

  .knBox li p.p-content {
    color: #a5b6ca;
    font-size: 15px;
    width: 70%;
  }

  .knBox li p.p-author {
    color: #aaaaaa;
    font-size: 14px;
  }

  .knbn-box {
    position: absolute;
    top: 24px;
    right: 40px;
  }

  .knbn-box i {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: 20px;
    cursor: pointer;
  }

  .knbn-box .kn-edit {
    background: url(../../assets/bianji.png) no-repeat 50% 50%;
  }

  .knbn-box .kn-delete {
    background: url(../../assets/shanchu.png) no-repeat 50% 50%;
  }

  /*翻页部分样式*/
  /*页码 */
  .page-box {
    width: 95%;
    margin: 30px 30px;
    padding: 0;
    position: absolute;
    bottom: 0;
  }

  .page {
    position: relative;
  }

  .page div.cut-page-number > div {
    display: inline-block;
    vertical-align: top;
  }

  .page div.cut-page-number > div:first-child,
  .page div.cut-page-number > div:last-child {
    margin-top: 4px;
  }

  .page div.cut-page-number > div.select-down {
    height: 28px;
    width: 54px;
    margin-right: 16px;
  }

  .page div.cut-page-number > div.select-down > div {
    width: 54px;
  }

  .page div.cut-page-number > div.select-down input {
    width: 28px;
  }

  .page div.cut-page-number > div.select-down span {
    background-color: transparent;
    width: 10px;
  }

  .page div.cut-page-number > div.select-down i {
    font-size: 20px;
  }

  .page div.select-down ul.down-content {
    width: 55px;
    min-width:55px;
    height: auto;
  }

  .page div.select-down ul.down-content li {
    height: 28px;
    line-height: 28px;
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

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  div.select-down > div > span {
    line-height: 28px !important;
    height: 28px !important;
  }

  div.select-down > div {
    height: 28px;
  }

  div.select-down > div input {
    height: 25px;
  }

  .go-page input {
    width: 32px;
    height: 24px;
    border: none;
  }

  /*==========知识库主体样式结束=========*/
  /*==========新增分类弹窗样式开始========*/
  .el-dialog__body {
    overflow: hidden;
    /*padding: 30px;*/
  }

  p.p-add {
    text-align: center;
  }

  p.p-add span {
    display: inline-block;
    font-size: 14px;
    width: 100%;
    height: 42px;
    border: 1px solid #e6e6e6;
    color: #555555;
    line-height: 40px;
    cursor: pointer;
  }

  p.p-add span i {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 22px;
    border-radius: 50%;
    color: #ffffff;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    margin-right: 22px;
    background: #18d96e;
  }

  #allMenu {
    overflow: auto;
    height: 430px;
  }

  .class-list {
    /*margin: 30px;*/
    padding: 0;
    height: 539px;
    /*min-height: 539px;*/
    /*overflow: auto;*/
    /*overflow: hidden;*/
  }

  .class-list > li {
    margin-top: 20px;
    position: relative;
  }

  .class-list input {
    background-color: transparent;
    border: none;
    outline: none;
  }

  .class-list > li input {
    width: 50%;
  }

  .class-list > li li input {
    border: 1px solid #e6e6e6;
    height: 42px;
    padding-left: 10px;
  }

  .class-list li a {
    display: inline-block;
    width: 100%;
    height: 66px;
    color: #555555;
    line-height: 66px;
    text-indent: 100px;
    position: relative;
  }

  .class-list li.cl1-li a.a-level1 {
    background: #f5f5f5;
  }

  /*.class-list li.cl1-li:nth-child(odd) a.a-level1{*/
  /*background: #283543;*/
  /*}*/

  /*.class-list li.cl1-li:nth-child(even) a.a-level1{*/
  /*background: #192431;*/
  /*}*/

  .class-list li a.a-level1 i {
    display: inline-block;
    width: 19px;
    height: 19px;
    position: absolute;
    top: 24px;
    left: 42px;
    cursor: pointer;
  }

  i.fold-yellow {
    background: url(../../assets/fold-yellow.png) no-repeat 50% 50%;
  }

  i.fold-gray {
    background: url(../../assets/fold-gray.png) no-repeat 50% 50%;
  }

  .btn-gp {
    margin-right: 30px;
    top: 0;
    right: 0;
    position: absolute;
    height: 66px;
    line-height: 66px;
  }

  .btn-gp img {
    margin-left: 30px;
    cursor: pointer;
  }

  .btn-gp-gray img {
    /*opacity: 0.5;*/
  }

  .btn-gp-gray img:nth-last-child(1) {
    opacity: 1;
  }

  a.a-level2 {
    cursor: pointer;
  }

  a.a-level2 span {
    display: inline-block;
    height: 42px;
    width: 50%;
    border: 1px solid #e6e6e6;
    line-height: 40px;
    text-indent: 44px;
  }

  a.a-level2 span > i {
    padding: 2px 6px;
    width: 20px;
    height: 20px;
    line-height: 22px;
    border-radius: 50%;
    color: #ffffff;
    /*color: #000000;*/
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    margin-right: 22px;
    margin-left: -22px;
    background: #18d96e;
  }

  a.a-level2:hover .dot-yellow {
    display: block;
  }

  .dot-yellow {
    position: absolute;
    top: 30px;
    left: 80px;
    display: none;
  }

  /*==========新增分类弹窗样式结束========*/
  /*==========删除弹窗开始==========*/
  .dele-info {
    width: 440px;
    height: 80px;
    line-height: 80px;
    margin: 0 auto;
    background: #f5f5f5;
    text-align: center;
  }

  .dele-info p {
    font-size: 16px;
    color: #555555;
  }

  .icon-waring {
    float: left;
    margin-right: 10px;
    display: inline-block;
    width: 26px;
    height: 26px;
    background: url("../../assets/zhongyaotixing.png") no-repeat 50% 50%;
    background-size: 100%;
    vertical-align: middle;
  }

  /*==========删除弹窗结束==========*/
  /*==========新增知识弹窗样式开始========*/
  .modal-box  .el-dialog__header {
    display: none;
  }

  .content-box {
    height: 646px;
  }

  .content-title {
    overflow: hidden;
  }

  .content-title .p-title {
    float: left;
    color: #555555;
    font-size: 16px;
    position: relative;
    text-indent: 12px;
    height: 32px;
    line-height: 32px;
  }

  .content-title .p-title .title-side {
    display: inline-block;
    height: 18px;
    width: 5px;
    background: #25db76;
    border-radius: 2px;
    position: absolute;
    top: 6px;
    left: 0;
  }

  .p-select {
    /*margin: 16px 28px;*/
    margin-left: 10px;
    position: relative;
  }

  .el-form-item {
    margin-bottom: 22px;
  }

  #formData {
    position: relative;
  }

  .select-box {
    width: 34%;
    position: relative;
    display: inline-block;
    margin-right: 8%;
  }

  .kn-select {
    width: 100%;
    height: 40px;
    /*background: #182028 url(../../img/kn-dropdown.png) no-repeat 90% 50%;*/
    text-indent: 24px;
    color: #fff;
  }

  .select-1 {
    border: 1px solid #cccccc;
    outline: none;
  }

  .select-2 {
    border: 1px solid #cccccc;
  }

  .select-list {
    position: absolute;
    width: 100%;
    background: #182028;
    border: 1px solid #0f89fd;
    border-radius: 0;
    top: 37px;
    min-width: 100%;
    color: #fff;
    max-height: 140px;
    overflow: auto;
  }

  .select-2 + ul {
    border: 1px solid #46c36f;
  }

  .select-list li {
    line-height: 32px;
    color: #fff;
    text-indent: 24px;
    cursor: pointer;
    overflow-x: hidden;
    height: 32px;
  }

  .select-list li:hover {
    background: #283543;
  }

  .kn-title {
    width: 100%;
    height: 40px;
    background: #182028;
    border: 1px solid #46525e;
    color: #fff;
    text-indent: 20px;
    outline: none;
  }

  #submit {
    width: 120px;
    height: 30px;
    background: #0f89fd;
    color: #fff;
    font-size: 16px;
    border: none;
    outline: none;
    float: right;
  }

  span.add-attach {
    display: inline-block;
    width: 100%;
    height: 32px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    font-size: 25px;
    line-height: 26px;
    font-weight: 600;
    color: #fff;
    text-align: center;
  }

  span.add-attach > i {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 22px;
    border-radius: 50%;
    color: #ffffff;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    margin-right: 22px;
    background: #18d96e;
  }

  #fileLoad {
    width: 100%;
    height: 32px;
    position: absolute;
    top: 43px;
    left: 0;
    opacity: 0;
  }

  .attach-list {
    margin-top: 20px;
  }

  div.attach-name {
    margin: 24px 0;
    line-height: 24px;
    padding-left: 38px;
    position: relative;
    text-indent: -10px;
    padding-right: 48px;
  }

  span.file-name {
    color: #555555;
    margin-left: 10px;
    cursor: pointer;
    display: inline-block;
    width: 45%;
    /*white-space: nowrap;*/
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
  }

  span.file-name:hover {
    text-decoration: underline;
  }

  i.file-word {
    /*background: url(../../img/kn-word.png) no-repeat 50% 50%;*/
  }

  .progress {
    height: 8px;
    background: #283543;
  }

  .progress-bar {
    /*background: #2c445b;*/
  }

  #fileList {
    overflow: auto;
  }

  .doc,
  .docx {
    /*background: url(../../img/kn-word.png) no-repeat 0% 50%;*/
  }

  .xls,
  .xlsx {
    /*background: url(../../img/kn-excel.png) no-repeat 0% 50%;*/
  }

  .pdf {
    /*background: url(../../img/kn-pdf.png) no-repeat 0% 50%;*/
  }

  .txt {
    /*background: url(../../img/kn-txt.png) no-repeat 0% 50%;*/
  }

  .ppt,
  .pptx {
    /*background: url(../../img/kn-ppt.png) no-repeat 0% 50%;*/
  }

  .jpg,
  .gif,
  .png {
    background: url(../../assets/kn-img.png) no-repeat 0% 50%;
  }

  .progress {
    display: none;
  }

  img[alt='download'] {
    cursor: pointer;
    /*position: absolute;*/
    /*top: 50%;*/
    /*left: 230px;*/
    margin-top: -6px;
  }

  .progress-bar {
    background-color: #2c445b;
  }

  img[alt='delete'] {
    /*position: absolute;*/
    /*top: 50%;*/
    /*left: 200px;*/
    /*margin-top: -5px;*/
    cursor: pointer;
    margin: -4px 10px 0 10px;
  }

  [v-cloak] {
    display: none !important;
  }

  /*ele-uploud样式*/
  .upload-demo {
    position: relative;
  }

  .el-upload {
    width: 100%;
    margin-bottom: 15px;
  }

  /*==========新增知识弹窗样式结束========*/


</style>
