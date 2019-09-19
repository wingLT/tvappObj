//global variable
var SetScroll = (function () {
    return {

      /*设置滚动条 */
      setScroll: function (str) {
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
          autohidemode: "cursor",// // 隐藏滚动条的方式,
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
        $("." + str).getNiceScroll().show(); //显示弹窗
        $("." + str).getNiceScroll().resize(); //检测滚动条是否重置大小（当窗口改变大小时）
      },
    }
  })();
