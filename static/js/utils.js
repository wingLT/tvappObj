//global variable
var GlobalVar = (function () {
    return{
      urlName:'http://192.168.0.53:8002/hisicompass-resource-optimization/',
      // urlName:'http://127.0.0.1:8002/hisicompass-resource-optimization/',


      urlNameW:'http://192.168.0.53:8002/hisicompass-resource-optimization/',
      // urlNameW:'http://127.0.0.1:8002/hisicompass-resource-optimization/',


      urlHealth:'http://192.168.0.53:8002/hisicompass-health-compute/',
      // urlHealth:'http://127.0.0.1:8002/hisicompass-health-compute/',

      /*newUrl*/
      newUrl:'http://192.168.0.53:8002/hisicompass-maintain',
      // newUrl:'http://127.0.0.1:8002/hisicompass-maintain',

      // ddmUrl:'http://192.168.0.29:8002',
      ddmUrl:'http://192.168.0.53:8002',
      // ddmUrl:'http://127.0.0.1:8002',

      autoGetDataTime:5,//自动获取数据的时长
      /*历史路由*/
      historyRouter:[],
      setHistoryRouter:function (router) {
        //设置历史路由
        var addUrl = router.url;
        var addUrlIndex = -1;
        if (GlobalVar.historyRouter) {
          for (var i = 0; i < GlobalVar.historyRouter.length; i++) {
            GlobalVar.historyRouter[i].className = '';
            if (GlobalVar.historyRouter[i].url == addUrl) {
              GlobalVar.historyRouter[i].name=router.name;
              addUrlIndex = i;
              GlobalVar.historyRouter[i].className = 'active';
            }
          }

          if (Number(addUrlIndex) >= 0) {
            // GlobalVar.historyRouter.splice(addUrlIndex,1);
            // GlobalVar.historyRouter.push(router);
          } else {
            GlobalVar.historyRouter.push(router);
            // if(GlobalVar.historyRouter.length>=10){
            //   GlobalVar.historyRouter.splice(0,1);
            // }else{
            //
            // }

          }
        }

      },
      /*
     * 把时间戳转换为时间格式
     * 返回值：2015-08-12 13:00:00
     * now：传入的时间戳
     */
      getTimeByTimestamp: function(now) {
        if(!GlobalVar.isEmptyObject(now) && now != "null"){
          var time = new Date(parseInt(now));
          var year = time.getFullYear();
          var month = time.getMonth() + 1;
          var hours = time.getHours();
          var minutes = time.getMinutes();
          var seconds = time.getSeconds();
          var day = time.getDate();
          month = month <= 9 ? month = "0" + month : month;
          day = day <= 9 ? day = "0" + day : day;
          hours = hours <= 9 ? hours = "0" + hours : hours;
          minutes = minutes <= 9 ? minutes = "0" + minutes : minutes;
          seconds = seconds <= 9 ? seconds = "0" + seconds : seconds;
          return year + "-" + month + "-" + day + ' ' + hours + ':' + minutes + ':' + seconds;
        }else{
          return "";
        }

      },
      // 获取当前的时间，并转化为时间戳
      getNowDateChangeTimestamp: function() {
        var data = new Date();
        return Date.parse(data);
      },
      // 是否是字符串
      isString: function(value) {
        return typeof value === 'string';
      },
      // 是否是number类型的数据
      isNumber: function(value) {
        return typeof value === 'number';
      },
      // 是否是boolean值
      isBoolean: function(value) {
        return typeof value === 'boolean';
      },
      /*
       * 是否为空
       * 返回值：布尔值
       * false：表示不为空
       * true：表示为空
       */
      isEmptyObject: function(obj) {
        for(var name in obj) {
          return false;
        }
        return true;
      },
      /*
       * 根据参数名截取Url中的参数值
       * para：键；浏览器上的键值对
       * 使用方法：如：http://localhost:8080/BTVhtml/page/home/index.html?param=12
       * Comm.getParaVal('param');//获取地址上的param的值
       */
      getParaVal: function(para) {
        var regStr = "(^|&|&amp;)" + para + "=" + "([^&]*)(&|$)";
        var reg = new RegExp(regStr);
        var pval = window.location.search.substr(1).match(reg);
        if(pval == null)
          return null
        else
          return decodeURI(pval[2]);
      },
      /*
           * 获得地址栏上的所有URL参数
           * 返回值：一个数组
           */
      getUrlVars: function() {
        var vars = [],
          hash;
        if(window.location.href.indexOf('?') == -1)
          return vars;
        var hashes = window.location.href.slice(
          window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
        }
        return vars;
      },
      // 判断是否为空
      isNull: function(str) {
        if(str.replace(/\s/g, "") == "") {
          return true;
        } else {
          return false;
        }
      },
      /*设置滚动条 */
      setScroll:function(str){
        $("." + str).niceScroll({
          //0f89fd
          /*autohidemode  隐藏滚动条的方式
                 * 可用的值:
                 *  true | // 无滚动时隐藏
                 * "cursor" | // 隐藏
                 * false | // 不隐藏,
                 * "leave" | // 仅在指针离开内容时隐藏
                 * "hidden" | // 一直隐藏
                 * "scroll", // 仅在滚动时显示
                 */
          autohidemode:"cursor",// // 隐藏滚动条的方式,
          cursorcolor: "#c1c1c1", // 改变滚动条颜色，使用16进制颜色值
          cursoropacitymin: 0, // 当滚动条是隐藏状态时改变透明度, 值范围 1 到 0
          cursoropacitymax: .5, // 当滚动条是显示状态时改变透明度, 值范围 1 到 0
          cursorwidth: "5px", // 滚动条的宽度，单位：便素
          cursorborder: "0", // CSS方式定义滚动条边框
          cursorborderradius: "5px", // 滚动条圆角（像素）
          zindex: 999, // 改变滚动条的DIV的z-index值
          scrollspeed: 60, // 滚动速度
          mousescrollstep: 40, // 鼠标滚轮的滚动速度 (像素)
          touchbehavior: false, // 激活拖拽滚动
          hwacceleration: true, // 激活硬件加速
          boxzoom: false, // 激活放大box的内容
          dblclickzoom: true, // (仅当 boxzoom=true时有效)双击box时放大
          gesturezoom: true, // (仅 boxzoom=true 和触屏设备时有效) 激活变焦当out/in（两个手指外张或收缩）
          grabcursorenabled: true // (仅当 touchbehavior=true) 显示“抓住”图标display "grab" icon
        });
        $("."+str).getNiceScroll().show(); //显示弹窗
        $("."+str).getNiceScroll().resize(); //检测滚动条是否重置大小（当窗口改变大小时）
      },

      /*得到纵向的柱状图 mapName*/
      getCrosswiseBarMap:function (value,colorName,yData,isPercent) {
       var  option = {
          tooltip: {
            // show:false,
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter:function () {
              return "";
            }
          },
          grid: {
            top:'0',
            left: '0',
            right: '30px',
            bottom: '1px',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle:{
                type:'dotted',
                color:'#bbbbbb'
              }
            },
            axisLabel: {
              show:false
            }
          },
          yAxis: {
            type: 'category',
            data: yData,
            axisTick: {
              show: false
            },
            "axisLine": {
              show: true,
              lineStyle: {
                color: '#eeeeee'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#151b22'
              }
            },
            "axisTick": {
              "show": false
            },
            axisLabel: {
              textStyle: {
                color: '#666666'
              }
            }
          },
          series: [
            {
              name: '设备',
              type: 'bar',
              data: value,
              barWidth: 16,
              barGap: 16,
              smooth: true,
              legendHoverLink:false,
              hoverAnimation: false,
              itemStyle: {
                normal: {
                  color:colorName,
                  label: {
                    show: true,
                    color:'#555555',
                    position: 'right',
                    formatter: function(params){
                      if(isPercent){
                        var num =  Math.round(Number(params.data));
                        return num+'%';
                      }else{}

                    }
                  }
                }
              }
            }
          ]
        };
       return option;
        // mapName.setOption(option,true);
        // window.onresize = function () {
        //   //重置容器高宽
        //   mapName.resize();
        // };

      },

      /*得到圆的幅度 返回的是一个数组*/
      getHandleCircleData:function (value) {
        var data =[];
        if (Number(value)==100){
          data = [1, 1, 1];
        }else if(Number(value)>=90){
          data = [0.96, 0.90, 0.88];
        }else if(Number(value)>=80){
          data = [0.86, 0.80, 0.78];
        }else if(Number(value)>=70){
          data = [0.76, 0.70, 0.68];
        }else if(Number(value)>=60){
          data = [0.66, 0.60, 0.58];
        }else if(Number(value)>=50){
          data = [0.56, 0.50, 0.48];
        }else if(Number(value)>=40){
          data = [0.46, 0.40, 0.38];
        }else if(Number(value)>=30){
          data = [0.36, 0.30, 0.28];
        }else if(Number(value)>=20){
          data = [0.26, 0.20, 0.18];
        }else if(Number(value)>=10){
          data = [0.16, 0.10, 0.08];
        }else {
          data = [0.06, 0.00, 0.08];
        }
        return data;
      },

      //localStorage
      /*保存一条json的数据*/
      setSessionStorageJson:function (key,jsonData) {
        window.sessionStorage.setItem(key,JSON.stringify(jsonData));
      },
      /*
      * 保存一条json的数据
      * 返回值：json
      * */
      getSessionStorageJson:function (key) {
        return JSON.parse(window.sessionStorage.getItem(key));
      },
      /*
      *得到 历史 和 预测的数据
      * allData: 所有的数据 历史数据和预测数据 （数组）
      * allTime：所有的时间 （数组）
      * historyDataLen:历史数据的长度
      *
      * 返回值 （对象）
      * {
      * historyData：historyData
      * forecastData：forecastData
      * actualShowTime：actualShowTime
      * }
      */
      getHistoryAndForecastData:function (allData,allTime,historyDataLen) {
        var newHistoryData = [];//历史数据
        var newForecastData = [];//预测数据
        var allTime = allTime;//所有的时间
        var actualShowTime = [];//实际显示的时间
        historyDataLen = historyDataLen==0?1:historyDataLen;
        if(allData.length>0){
          for(var i = 0;i<allData.length;i++){
            if(i == (historyDataLen - 1)){
              // actualShowTime.push('止 '+allTime[i]);
              actualShowTime.push(allTime[i]);
              // actualShowTime.push('止 2017-11-29\n\n 10:30:35');
            }else{
              actualShowTime.push('');
            }
            if(i>(historyDataLen - 1)){
              //预测数据
              newHistoryData.push('-');
              newForecastData.push(allData[i]);
            }else{
              //实际数据
              newHistoryData.push(allData[i]);
              newForecastData.push('-');
            }
          }
         newForecastData.splice(historyDataLen - 1, 1, newHistoryData[historyDataLen - 1]);
        }
        return {
          historyData:newHistoryData,
          forecastData:newForecastData,
          actualShowTime:actualShowTime
        }

      },
      /*
       * 得到业务的颜色
       * value:业务值
       * */
      getBusinessColor:function (value) {
        var colorName = '';
        if(Number(value)>=80){
          colorName ='#18d96e';
        }else if(Number(value)>=60){
          colorName = '#fbb321';
        }else{
          colorName = '#c10f00';
        }
        return colorName;
      }

    }
  }

)();

export {
  GlobalVar
}
