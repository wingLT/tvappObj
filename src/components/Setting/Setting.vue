<template>

  <div class="content sys-config">

    <div class="title">
      <span></span>
      <span>告警配置</span>
    </div>

    <!--选择的条件-->
    <div class="select-condition">
      <span>服务器类型：</span>
      <div class="select-down dropdown">
        <div>
          <input v-model="singleDevData.chName" readonly="readonly"/>
          <span class="dropdown-toggle" data-toggle="dropdown"><i class="icon wb-triangle-down"></i></span>
          <ul class="page-number down-content dropdown-menu">
            <li v-for="(item,index) in allData" @click="selectTypeGetData(index)">{{item.chName}}</li>
          </ul>
        </div>
      </div>
    </div> <!--选择的条件  end-->


    <!--配置内容-->
    <div class="config-content">
      <!--故障告警-->
      <div class="break-warning" v-bind:class="breakdownIsEdit?'eidt-status':'save-status'">
        <div class="clear breakdown-name ">
          <div class="fl">
            <span><img src="../../assets/ddm-guzhanggaojing.png"/></span>
            <span>故障告警</span>
          </div>
          <div class="fr">
            <span class="button-span" v-bind:class="breakdownEditOrCancle" @click="editAndCancle(1)">
									{{breakdownIsEdit?'取消':'编辑'}}
								</span>
            <span class="button-span" v-bind:class="breakdownResetOrSave" @click="resetAndSave(1,singleDevData.id)">
									{{breakdownIsEdit?'保存':'重置'}}
								</span>
          </div>
        </div>
        <ul>
          <li>
            <span>CPU使用率高于</span>
            <span class="fr">%</span>
            <span class="fr">
              <input v-model="singleDevData.cpuWarningFour" type="number"/>
              <span class="value">{{singleDevData.cpuWarningFour}}</span>
            </span>
          </li>
          <li>
            <span>磁盘使用率高于</span>
            <span class="fr">%</span>
            <span class="fr">
             <input v-model="singleDevData.diskUtilWaringFour" type="number"/>
             <span class="value">{{singleDevData.diskUtilWaringFour}}</span>
            </span>

          </li>
          <li>
            <span>内存使用率高于</span>
            <span class="fr">%</span>
            <span class="fr">
              <input v-model="singleDevData.memWarningFour" type="number"/>
              <span class="value">{{singleDevData.memWarningFour}}</span>
            </span>
          </li>
          <li>
            <span>进程掉线数量超过</span>
            <span class="fr">%</span>
            <span class="fr">
              <input v-model="singleDevData.processWarningFour" type="number"/>
              <span class="value">{{singleDevData.processWarningFour}}</span>
            </span>
          </li>
        </ul>
      </div><!--故障告警 end-->

      <!--风险预警-->
      <div class="break-warning" v-bind:class="riskIsEdit?'eidt-status':'save-status'">
        <div class="clear breakdown-name">
          <div class="fl">
            <span><img src="../../assets/fengxainyujing.png"/></span>
            <span>风险预警</span>
          </div>
          <div class="fr">
            <span class="button-span" v-bind:class="riskEditOrCancle" @click="editAndCancle(2)">
									{{riskIsEdit?'取消':'编辑'}}
								</span>
            <span class="button-span" v-bind:class="riskResetOrSave" @click="resetAndSave(2,singleDevData.id)">
									{{riskIsEdit?'保存':'重置'}}
								</span>

          </div>
        </div>
        <ul>
          <li>
            <span>CPU使用率高于</span>
            <span class="fr">%</span>
            <span class="fr">
              <input v-model="singleDevData.cpuWarningOne" type="number"/>
              <span class="value">{{singleDevData.cpuWarningOne}}</span>
            </span>
          </li>
          <li>
            <span>磁盘使用率高于</span>
            <span class="fr">%</span>
            <span class="fr">
              <input v-model="singleDevData.diskUtilWaringOne" type="number"/>
              <span class="value">{{singleDevData.diskUtilWaringOne}}</span>
            </span>

          </li>
          <li>
            <span>内存使用率高于</span>
            <span class="fr">%</span>
            <span class="fr">
             <input v-model="singleDevData.memWarningOne" type="number"/>
             <span class="value">{{singleDevData.memWarningOne}}</span>
            </span>
          </li>
          <li>
            <span>进程掉线数量超过</span>
            <span class="fr">%</span>
            <span class="fr">
              <input v-model="singleDevData.processWarningOne" type="number"/>
              <span class="value">{{singleDevData.processWarningOne}}</span>
            </span>
          </li>
        </ul>
      </div><!--风险预警 end-->

    </div><!--配置内容  end-->

  </div>

</template>

<script>
  import {GlobalVar} from "../../../static/js/utils";

  export default {
    name: "setting",
    data() {
      return {
        serverType: '索贝平台',
        breakdownIsEdit:false,
        breakdownEditOrCancle:'eidt',
        breakdownResetOrSave:'reset',
        riskIsEdit:false,
        riskEditOrCancle:'eidt',
        riskResetOrSave:'reset',
        allData:[],
        resetData:[],
        singleDevData:{},
        flagIndex:0,
        devId:''
      }
    },
    mounted() {
      let router = {
        url: this.$route.path,
        name: this.$route.name,
        className: 'active'
      };
      GlobalVar.setHistoryRouter(router);
      let self = this;
      getAllData(self.devId,self);
      getResetData(self.devId,self);
    },
    methods: {
      selectTypeGetData: function (index) {
        this.flagIndex = index;
        this.singleDevData = this.allData[index];
        this.breakdownResetOrSave = 'reset';
        this.breakdownEditOrCancle = 'eidt';
        this.breakdownIsEdit = false;
        this.riskResetOrSave = 'reset';
        this.riskEditOrCancle = 'eidt';
        this.riskIsEdit = false;
      },
      editAndCancle:function (flag) {
        if(Number(flag) == 1){
          //故障告警
          if(this.breakdownEditOrCancle == 'eidt'){
            this.breakdownEditOrCancle = 'cancle';
            this.breakdownResetOrSave = 'save';
            this.breakdownIsEdit = true;
            //编辑
          }else{
            this.breakdownIsEdit = false;
            this.breakdownEditOrCancle = 'eidt';
            this.breakdownResetOrSave = 'reset';
            //取消
            var resetData = this.resetData[this.flagIndex];
            this.singleDevData.cpuWarningFour = resetData.cpuWarningFour;
            this.singleDevData.diskUtilWaringFour = resetData.diskUtilWaringFour;
            this.singleDevData.memWarningFour = resetData.memWarningFour;
            this.singleDevData.processWarningFour = resetData.processWarningFour;
          }
        }else{
          if(this.riskEditOrCancle == 'eidt'){
            this.riskEditOrCancle = 'cancle';
            this.riskResetOrSave = 'save';
            this.riskIsEdit = true;
            //编辑
          }else{
            this.riskIsEdit = false;
            this.riskEditOrCancle = 'eidt';
            this.riskResetOrSave = 'reset';
            //取消
            var resetData = this.resetData[this.flagIndex];
            this.singleDevData.cpuWarningOne = resetData.cpuWarningOne;
            this.singleDevData.diskUtilWaringOne = resetData.diskUtilWaringOne;
            this.singleDevData.memWarningOne = resetData.memWarningOne;
            this.singleDevData.processWarningOne = resetData.processWarningOne;
          }
        }
      },
      resetAndSave:function (flag,id) {
        let self = this;
        if(Number(flag) == 1){
          //故障告警
          if(this.breakdownResetOrSave == 'reset'){
            //重置
            var resetData = this.resetData[this.flagIndex];
            this.singleDevData.cpuWarningFour = resetData.cpuWarningFour;
            this.singleDevData.diskUtilWaringFour = resetData.diskUtilWaringFour;
            this.singleDevData.memWarningFour = resetData.memWarningFour;
            this.singleDevData.processWarningFour = resetData.processWarningFour;

          }else{
            //保存
            saveSysConfig(flag,this.devId,self);
          }
        }else{
          if(this.riskResetOrSave == 'reset'){
            //重置
            var resetData = this.resetData[this.flagIndex];
            this.singleDevData.cpuWarningOne = resetData.cpuWarningOne;
            this.singleDevData.diskUtilWaringOne = resetData.diskUtilWaringOne;
            this.singleDevData.memWarningOne = resetData.memWarningOne;
            this.singleDevData.processWarningOne = resetData.processWarningOne;
          }else{
            //保存
            saveSysConfig(flag,this.devId,self);
          }
        }
      }
    }
  }

  /*
  * 重置的数据
  * */
  function getResetData(devId,self){
    $.ajax({
      type:'get',
      url:GlobalVar.ddmUrl+'/hisicompass-baseresource/warning/vmType?devId='+devId,
      data:{},
      success:function (result) {
        if(Number(result.status) == 200){
          self.resetData = result.data;
        }
      }
    })
  }

  /*
 *得到所有的数据
 * */
  function getAllData(devId,self){
    $.ajax({
      type:'get',
      url:GlobalVar.ddmUrl+'/hisicompass-baseresource/warning/vmType?devId='+devId,
      data:{},
      success:function (result) {
        if(Number(result.status) == 200){
          self.allData = result.data;
          if(!GlobalVar.isEmptyObject(result.data)){
            if(self.allData.length>0){
              self.singleDevData = self.allData[0];
              self.flagIndex = 0;
            }
          }
        }
      }
    })
  }

  /*
  * 保存
  * flag：选择的服务器的标志
  * devId：设备id
  * */
  function saveSysConfig(flag,devId,self) {
    var data = self.singleDevData;
    var urlName;
    if(data.id == null){
      urlName = GlobalVar.ddmUrl+'/hisicompass-baseresource/warning/saveVmType?devId='+devId;
    }else{
      urlName = GlobalVar.ddmUrl+'/hisicompass-baseresource/warning/saveVmType';
    }
    $.ajax({
      type: "POST",
      url: urlName,
      contentType:"application/json",
      data:JSON.stringify(data),
      success: function(result) {
        if(Number(result.status) == 200){
//          getResetData(devId,self);
          if(Number(flag) == 1){
            self.breakdownResetOrSave = 'reset';
            self.breakdownEditOrCancle = 'eidt';
            self.breakdownIsEdit = false;
          }else{
            self.riskResetOrSave = 'reset';
            self.riskEditOrCancle = 'eidt';
            self.riskIsEdit = false;
          }
        }
      }
    })
  }

</script>

<style scoped>

  div.content {
    margin-top: 19px;
    padding-top: 27px;
    padding-left: 30px;
    background-color: #FFFFFF;
  }

  div.select-down > div {
    margin-left: 0;
  }

  div.sys-config > div.title > span {
    font-size: 16px;
    font-weight: bold;
    color: #555555;
    display: inline-block;
    vertical-align: top;
  }

  div.sys-config > div.title > span:first-child {
    width: 8px;
    height: 18px;
    background-color: #18d96e;
    border-radius: 2px;
    margin-top: 3px;
    margin-left: 4px;
  }

  .select-condition {
    margin: 39px 0;
  }

  .select-condition > span,
  .select-condition > div {
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;
    color: #555555;
  }

  .select-condition .select-down {
    /*width: 133px;*/
    /*height: 28px;*/
    background-color: #f5f5f5;
    /*border: solid 1px #e6e6e6;*/
  }

  .select-condition .select-down input {
    background-color: transparent;
    border: none;
    width: 82%;
    padding-left: 10px;
    outline: none;
  }

  .select-condition .select-down i {
    color: #AAAAAA;
    margin-top: 2px;
    cursor: pointer;
  }

  .select-condition ul.down-content li {
    cursor: pointer;
    text-align: center;
  }

  div.select-down ul.down-content {
    left: 0;
    width: 156px;
  }

  .select-condition .down-content {
    height: 180px;
  }

  .dropdown-menu {
    min-width: 135px;
    border-radius: 0;
    left: -2px;
    overflow-y: auto;
  }

  /*配置内容*/
  .config-content > div {
    margin-bottom: 29px;
  }

  .config-content span {
    display: inline-block;
    vertical-align: middle;
  }

  .config-content .breakdown-name {
    width: 520px;
    height: 41px;
    background-color: #f5f5f5;
    line-height: 41px;
    padding: 0 28px;
  }

  .config-content .breakdown-name > div:first-child img {
    margin-top: -6px;
    margin-right: 10px;
  }

  .config-content .breakdown-name > div:first-child {
    font-size: 16px;
    font-weight: bold;
    color: #555555;
  }

  .config-content span.button-span {
    font-size: 14px;
    cursor: pointer;
    margin: 0 4px;
  }

  .config-content span.eidt {
    color: #58c9f3;
  }

  .config-content span.reset {
    color: #ff6c60;
  }

  .config-content span.cancle {
    color: #999999;
  }

  .config-content span.save {
    color: #18d96e;
  }

  .config-content ul {
    padding: 0;
    list-style: none;
    margin-left: 52px;
  }

  .config-content ul li {
    width: 468px;
    height: 41px;
    line-height: 41px;
    background-color: #f5f5f5;
    margin: 5px 0;
    padding: 0 17px;
    color: #555555;
  }

  .config-content div.save-status ul li input {
    display: none;
  }

  .config-content div.eidt-status ul li span.value {
    display: none;
  }

  .config-content div.eidt-status ul li input {
    display: block;
    border: none;
    text-align: center;
    background-color: #e6e6e6;
    width: 124px;
    height: 28px;
    margin-right: 10px;
    margin-top: 6px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

</style>
