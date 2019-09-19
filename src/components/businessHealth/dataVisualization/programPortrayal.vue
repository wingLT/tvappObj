<!--节目画像-->

<template>


</template>

<script>


  function radarMap() {
   var option = {
      title: {
        text: '多雷达图'
      },
      tooltip: {
        trigger: 'axis'
      },

      radar: [
        {
          indicator: [
            {text: '编辑效率', max: 100},
            {text: '成片比', max: 100},
            {text: '编辑复杂度', max: 100},
            {text: '成片数', max: 100},
            {text: '用户体验度', max: 100},
            {text: '退稿率', max: 100}
          ],
          center: ['25%','40%'],
          radius: 80
        }


      ],
      series: [
        {
          type: 'radar',
          tooltip: {
            trigger: 'item'
          },
          itemStyle: {normal: {areaStyle: {type: 'default'}}},
          data: [
            {
              value: [60,73,85,40,20,52],
              name: '栏目画像'
            }
          ]
        },

      ]
    };
  }

  function barMap() {
    var option = {
      color: ['#3398DB'],
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : [
        {
          name:'用机时间',
          type:'bar',
          barWidth: '60%',
          data:[10, 52, 200, 334, 390, 330, 220]
        }
      ]
    };
  }

  function lineMap() {
    var option = {

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          lineStyle: {
            color: '#57617B'
          }
        }
      },

      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#57617B'
          }
        },
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      }],
      yAxis: [{
        type: 'value',
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#57617B'
          }
        },
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: 14
          }
        },
        splitLine: {
          lineStyle: {
            color: '#57617B'
          }
        }
      }],
      series: [{
        name: '南宁-曼芭',
        type: 'line',
        smooth: true,
        lineStyle: {
          normal: {
            width: 1
          }
        },
        areaStyle: {
          normal: {
            color:'rgba(237,169,83,1)'
          }
        },
        itemStyle: {
          normal: {
            color: 'rgb(137,189,27)'
          }
        },
        data: [96.3,96.4,97.5,95.6,98.1,94.8,89.6,94.1,80.1,52.4,75.8,94.7]
      }, {
        name: '桂林-曼芭',
        type: 'line',
        smooth: true,
        lineStyle: {
          normal: {
            width: 1
          }
        },
        areaStyle: {
          normal: {
            color:'rgba(255,167,160,1)'
          }
        },
        itemStyle: {
          normal: {
            color: 'rgb(0,136,212)'
          }
        },
        data: [97.3,99.2,99.3,100.0,99.6,90.6,80.0,91.5,69.8,67.5,90.4,84.9]
      }, {
        name: '南宁-甲米',
        type: 'line',
        smooth: true,
        lineStyle: {
          normal: {
            width: 1
          }
        },
        areaStyle: {
          normal: {
            color:'rgba(155,223,248,1)'
          }
        },
        itemStyle: {
          normal: {
            color: 'rgb(219,50,51)'
          }
        },
        data: [84.2,81.0,67.5,72.1,43.7,88.5,91.9,101.8,79.7,87.6,92.9,0]
      }, ]
    };
  }

</script>

<style></style>
