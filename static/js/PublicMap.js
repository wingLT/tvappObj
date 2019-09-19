import echarts from 'echarts'
var PublicMap = (function () {
  return{
    /*
    * 得到半圆
    *
    * */
    setBusinessMap:function (healthValue,className,colorName) {
      var myEcharts = echarts.init(className);
      var option = {
        center: ['50%', '50%'],
        title: {
          x: '45%',
          y: '10%',
          textAlign: "center",
          textStyle: {
            fontWeight: 'normal',
            fontSize: 14
          },
          subtextStyle: {
            fontWeight: 'bold',
            fontSize: 14,
            color: '#555555'
          }
        },
        series: [
          {
            name: ' ',
            type: 'pie',
            radius: ['80%', '100%'],
            avoidLabelOverlap: false,
//          startAngle: 225,
            startAngle: 180,
            color: [colorName, "transparent"],
            hoverAnimation: false,
            legendHoverLink: false,
            animation: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '14',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [{
              value: 25,
              name: '1'
            }, {
              value: 25,
              name: '2'
            }]
          },
          {
            name: '',
            type: 'pie',
            radius: ['80%', '100%'],
            avoidLabelOverlap: false,
//          startAngle: 317,
            startAngle: 0,
            color: ["#dfdfdf", "transparent"],
            hoverAnimation: false,
            legendHoverLink: false,
            clockwise: false,
            itemStyle:{
              normal:{
                borderColor:"transparent",
                borderWidth:"20"
              },
              emphasis:{
                borderColor:"transparent",
                borderWidth:"20"
              }
            }
            ,
            z:10,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '14',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [{
              name: ''
            }, {
              name: ''
            }
            ]
          }

        ]
      };

      var setInterValMap = setTimeout(function() {
        var value = healthValue;
        // console.log(value)
        var value_ = (100 - value) * 180 / 360;
        option.title.subtext = value;
        option.series[1].data[0].value = value_;
        option.series[1].data[1].value = 100 - value_;
        myEcharts.setOption(option, true);
      }, 100);
    },
    /*
    * 得到圆形图（无返回值）
    * colorName:颜色名字
    * mapName：echarts
    * value：值
    * */
    getPieMap:function (colorName,mapName,value) {
      var paddingData = [25, 0, 0, 80];
      if(value == 100){
        paddingData = [25, 0, 0, 110];
      }else if(value>=10){
        paddingData = [25, 0, 0, 80];
      }else{
        paddingData = [25, 0, 0, 50];
      }
      var nuUse = 100-value;
      var option = {
        tooltip : {
          show : false
        },
        legend : {
          orient : 'vertical',
          x : 'left',
          data : [ '未使用', '已使用' ]
        },
        center : [ '50%', '50%' ],
        toolbox: {
          "show": false,
          feature: {
            saveAsImage: {}
          }
        },

        series: [ {
          type: 'pie',
          radius : [ '98%', '75%' ],
          avoidLabelOverlap : false,
          legendHoverLink : false,
          hoverAnimation : false,
          label: {
            normal: {
              position: 'center'
            }
          },
          data: [{
            value: value,
            name: '消耗率',
            itemStyle: {
              normal: {
                color: colorName
              }
            },
            label: {
              normal: {
                formatter: ''+value+'',
                textStyle: {
                  color: '#555555',
                  fontSize: 56
                }
              }
            }
          }, {
            value: nuUse,
            name: '占位',
            avoidLabelOverlap : false,
            legendHoverLink : false,
            hoverAnimation : false,
            tooltip: {
              show: false
            },
            itemStyle: {
              normal: {
                color: '#f4f4f4'
              }
            },
            label: {
              normal: {
                textStyle: {
                  color: '#555555',
                  fontSize: 14
                },
                padding:paddingData,
                formatter: '%'
              }
            }
          }]
        }]
      }

      mapName.setOption(option,true);


    },

    /*
    * 得到柱状图（无返回值）
    * mapName：echarts
    * cpuValue：cpu的值
    * diskValue：磁盘的值
    * memoryValue：内存的值
    * */
    getBarMap:function (mapName,cpuValue,diskValue,memoryValue) {
      var  option = {
        center : [ '50%', '50%' ],
        tooltip: {
          show:false
        },
        grid: {
          top: '20px',
          left: '50px',
          right: '0',
          bottom: '20px',
        },
        xAxis: [
          {
            type: 'category',
            data: ['当前','前五分钟','前十分钟','峰值'],
            "axisLine": {
              lineStyle: {
                color: '#eeeeee',
                type: 'solid'
              }
            },
            axisTick:{
              show:false
            },
            axisLabel: {
              color: '#666666',
              formatter: '{value}'
            }
            /*eeeeee*/
          }
        ],
        yAxis: [
          {
            type: 'value',
            "axisLine": {
              lineStyle: {
                color: 'transparent',
                type: 'solid'
              }
            },
            axisTick:{
              show:false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#bbbbbb',
                type: 'dotted'
              }
            },
            axisLabel: {
              color: '#666666',
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name:'cup',
            type:'bar',
            data:cpuValue,
            label: {
              //图形上的文本标签
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#555555',
                  fontStyle: 'bold',
                  fontFamily: '微软雅黑',
                  fontSize: 16,
                },
                formatter: function(params){
                  return params.data+'%';
                }
              },
            },
            itemStyle:{
              normal:{
                color:'#58c9f3'
              }
            }
          },
          {
            name:'磁盘',
            type:'bar',
            data:diskValue,
            label: {
              //图形上的文本标签
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#555555',
                  fontStyle: 'bold',
                  fontFamily: '微软雅黑',
                  fontSize: 16,
                },
                formatter: function(params){
                  return params.data+'%';
                }
              },
            },
            itemStyle:{
              normal:{
                color:'#fbb321'
              }
            }
          },
          {
            name:'内存',
            type:'bar',
            data:memoryValue,
            label: {
              //图形上的文本标签
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#555555',
                  fontStyle: 'bold',
                  fontFamily: '微软雅黑',
                  fontSize: 16,
                },
                formatter: function(params){
                  return params.data+'%';
                }
              },
            },
            itemStyle:{
              normal:{
                color:'#ff6c60'
              }
            }
          }
        ]
      };
      mapName.setOption(option,true);

    },

    /*
    * 得到纵向的柱状图（有返回值）
    * value：值（数组）
    * colorName：颜色值
    * yData：y轴的值（数组）
    * isPercent：是否显示百分比
    * 返回值：option（对象）
    * */
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
                      // var num =  Math.round(Number(params.data));
                      // var num =  Math.round(Number(params.data));
                      return params.data+'%';
                    }else{}

                  }
                }
              }
            }
          }
        ]
      };
      return option;
    },

    /*
    * 当前最新健康度  (一个球图)  无返回值
    * mapName:echarts对象
    * value：值
    * data：球的波浪的值（数组，目前的数组的长度为3）
    * */
    getNewestHealth:function (mapName,value,data) {
      var option = {
        center: ['50%', '50%'],
        grid: {
          top: '0',
          left: '4px',
          right: '0',
          bottom: '4px',
        },
        series: [{
          type: 'liquidFill',
          animation: true,
          waveAnimation: true,
          data: data,
          color: ['#34de7f','#a3f0c5'],
          waveLength: '80%',
          amplitude: 3,
          radius: '95%',
          label: {
            normal: {
              formatter: function() {
                return ''+value+'';
              },
              textStyle: {
                fontSize: 46,
                color: '#fff'
              },
              position: ['50%', '50%']
            }
          },
          outline: {
            itemStyle: {
              borderColor: '#49d088',
              borderWidth: 2
            },
            borderDistance: 0
          },
          itemStyle: {
            normal: {
              backgroundColor: '#fff'
            }
          }
        }]

      };
      mapName.setOption(option,true);
    },


    /*
    * 趋势图（就是一个折线图）  无返回值
    * mapName：echarts对象
    * xAxisData：x轴的值
    * yAxisData：Y轴的值
    * */
    getTrendMap:function (mapName,xAxisData,yAxisData) {
      var option = {
        tooltip: {
          show:false
        },
        center: ['50%', '50%'],
        grid: {
          top: '0',
          left: '4px',
          right: '0',
          bottom: '4px',
        },
        legend: {
          show:false,
          data: ['趋势图']
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          "axisLine": {
            lineStyle: {
              color: '#eeeeee',
              type: 'solid'
            }
          },
          axisTick:{
            show:false
          },
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
          "axisLine": {
            lineStyle: {
              color: '#eeeeee',
              type: 'solid'
            }
          },
          axisTick:{
            show:false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#214877',
              type: 'dotted'
            }
          },
          axisLabel: {
            formatter: function(params) {
              return '';
            }
          },
          boundaryGap : [ 0, '23%' ]
        },
        series: [{
          name: '趋势图',
          type: 'line',
          symbolSize:0,
          data: yAxisData,
          lineStyle: {
            normal: {
              color: '#34de80',
              width: 2,
            },
          },
          "itemStyle": {
            "normal": {
              "color": "#1ab394"
            }
          },
          itemStyle: {
            normal: {
              color: '#34de80'
            }
          }
        }]
      };
      mapName.setOption(option,true);
    },

    /*
    * 得到面积折线图 （无返回值）
    * mapName：echarts对象
    *  xAxisData：x轴的值
    * yAxisData：Y轴的值
    * */
    getAreaLineMap:function (mapName,xAxisData,yAxisData) {
      var option = {
        title: {
          show:false
        },
        tooltip: {
          show:true,
          formatter:function (params) {

          }
        },
        center: ['50%', '50%'],
        grid: {
          top: '10px',
          left: '30px',
          right: '0',
          bottom: '10px',
        },
        legend: {
          show:false,
          data: ['健康度']
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          "axisLine": {
            lineStyle: {
              color: '#eeeeee',
              type: 'solid'
            }
          },
          axisTick:{
            show:false
          },
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
          "axisLine": {
            lineStyle: {
              color: '#eeeeee',
              type: 'solid'
            }
          },
          axisTick:{
            show:false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#214877',
              type: 'dotted'
            }
          },
          axisLabel: {
            show:true,
            color:'#555555'
            // formatter: function(params) {
            //   return '';
            // }
          },
          boundaryGap : [ 0, '23%' ]
        },
        series: [{
          name: '健康度',
          type: 'line',
          symbolSize:8,
          showAllSymbol: true,//每个点都显示
          data: yAxisData,
          lineStyle: {
            normal: {
              color: '#34de80',
              width: 2,
            },
          },
          "itemStyle": {
            "normal": {
              "color": "#1ab394"
            }
          },
          areaStyle: {
            normal: {
              color:'#daf9e8'
            }
          },
//        areaStyle: {
          //渐变色
//          normal: {
//            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
//              offset: 0,
//              color: '#ea899b'
//            }, {
//              offset: 1,
//              color: '#fff'
//            }], false)
//          }
//        },
          itemStyle: {
            normal: {
              color: '#34de80'
            }
          }
        }]
      };
      mapName.setOption(option,true);
    },


    /*
    * 得到有阴影的横向的bar图（无返回值）
    * mapName：echarts对象
    * category：Y轴的值（数组）
    * barData：X轴的值（数组）
    * colorName：颜色值,
    * hoverHtml:鼠标hover的时候显示的内容
    * */
    getHasShadowBarMap:function (mapName,category,barData,colorName,hoverHtml) {
      var bgData = [];
      if(barData){
        for(var i = 0;i<barData.length;i++){
          bgData.push(100);
        }
      }
      var option = {
        tooltip: {
          show:true,
          // trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter:function (params) {
            return PublicMap.getHoverHtml(params);
          }
        },
        grid: {
          top: '0',
          left: '2%',
          right: '0',
          bottom: '0',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: function() {
              return "";
            }
          }
        },
        yAxis: [
          {
            type: 'category',
            data: category,
            splitLine: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#555555',
                fontSize: 12
              }
            },
            axisTick: {
              show: false
            },
            offset: 10,
            nameTextStyle: {
              fontSize: 12
            }
          },
          {
            type : 'category',
            data : category,
            axisLine: {show:false},
            axisTick: {show:false},
            axisLabel: {show:false},
            splitArea: {show:false},
            splitLine: {show:false}
          }
        ],
        series: [
          {
            name:'背景',
            type:'bar',
            barWidth: 10,
            barGap: 10,
            yAxisIndex:1,
            legendHoverLink:false,
            silent:true,
            //颜色需要有透明度
            itemStyle: {
              emphasis: {
                barBorderRadius: 2
              },
              normal: {
                barBorderRadius: 2,
                color:'rgba(254, 245, 245,0.5)',
                label: {
                  show: true,
                  color:'#555555',
                  position: 'right',
                  formatter: function(params){
                    var num = barData[params.dataIndex];
                    return num;
                  }
                }
              }
            },
            data:bgData
          },
          {
            name: '',
            type: 'bar',
            data: barData,
            barWidth: 10,
            barGap: 10,
            smooth: true,
            legendHoverLink:false,
            itemStyle: {
              emphasis: {
                barBorderRadius: 2
              },
              normal: {
                barBorderRadius: 2,
                color:colorName,
                label: {
                  show: false,
                  position: 'right',
                  formatter: function(params){
                    // var num =  Math.round(Number(params.data));
                    // return num+'%';
                  }
                }
              }
            }
          }
        ]
      };
      mapName.setOption(option);
    },

    /*
    * 得到hover的数据：主要用于消耗排名
    * params：hover 图形的时候得到的一个对象
    * */
    getHoverHtml:function (params) {
      var html = [];
      html.push('<div id="detailsMap" class="shadow-hover">');
      html.push('<div>');
      html.push('<div class="title">');
      html.push('<span></span><span>CPU指标关联关系</span>');
      html.push('</div>');
      for(var i = 0;i<4;i++){
        var itemHtml = [];
        itemHtml.push('<div class="item">');
        itemHtml.push('<span>磁盘读字节速率率</span>');
        itemHtml.push('<div class="progress">');
        itemHtml.push('<div class="progress-bar progress-bar-success" role="progressbar" :aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%;">');
        itemHtml.push('</div></div>');
        itemHtml.push('</div>');
        html.push(itemHtml.join(''));
      }

      return html.join('');
    },


    /*
    * echart高亮
    * option：echarts的option对象
    * echart：echarts对象
    * dataIndex：需要高亮的下标
    * */
    echartHeightLight:function (option,echart,dataIndex) {
      //高亮的点
      var currentIndex = option.series[0].data.length;
      // 取消之前高亮的图形
      echart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex
      });
      // 高亮当前图形
      echart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: dataIndex
      });
      // 显示 tooltip
      echart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: dataIndex
      });
    }
    ,
    deviceAverages:function (id, textName, subtext,color1,color2) {
      var unused = 0;
      var vColor = color1;
      var unColor = color2;
      // unused = 100 - subtext;
      if(subtext == 0){
        unused = 100;
      }else{
        unused = 100 / subtext;
      }
      var coloSize = 26; //字体
      var topsroll = "30%"; //文字高度
      var deviceAveragePieMap = echarts.init(document.getElementById(id));
      deviceAveragePieMap.clear();
      var option = {
        title: {
          text: subtext, //(percent * 100),//主标题
          x: 'center',
          y: topsroll,
          textStyle: {
            color: '#333',
            fontSize: 22,
            fontWeight: "bold",
            fontFamily: "Microsoft Yahei"
          },
          subtext: textName, //副标题
          subtextStyle: {
            color: '#aaa',
            fontSize: 15,
            fontFamily: "Microsoft Yahei"
          },
          itemGap: 5,
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: ['未使用', '已使用']
        },
        center: ['50%', '50%'],
        series: [{
          name: '访问来源',
          type: 'pie',
          radius: ['100%', '70%'],
          avoidLabelOverlap: false,
          legendHoverLink: false,
          hoverAnimation: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{
            itemStyle: {
              normal: {
                color: vColor
              }
            },
            value: subtext,
            name: '已用'

          }, {
            itemStyle: {
              normal: {
                color: unColor,
              }
            },
            value: unused,
            name: '未用'

          }]
        }]
      };
      deviceAveragePieMap.setOption(option,true);
      var pieMaps = [];
      pieMaps.push(deviceAveragePieMap)
      setTimeout(function(){
        window.onresize = function () {
          //重置容器高宽
          for(var i = 0; i < pieMaps.length; i++){
            pieMaps[i].resize();
          }
        };
      },200);

    }


  }
})();

export {
  PublicMap
}
