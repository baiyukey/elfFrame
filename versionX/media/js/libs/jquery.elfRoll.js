//使元素内容按照指定的方法进行滚动
//author:baiyukey@qq.com
//version:0.1.01
;(function($){
  $.fn.extend({
    "elfRoll":function(_val){
      var rollBox=$(this);
      var val=$.extend({
        "perSpeed":30,//滚动速度，单位毫秒，数值越小速度越快
        "perDelay":0,//滚动延迟，单位毫秒，数值越小间隔时间越短
        "perStep":1,//步进，即每次移动的像素
        "direction":"left"//方向 left(默认)/right/up/down
      },_val);
      var perSpeed=parseInt(val.perSpeed);
      var perDelay=parseInt(val.perDelay);
      var perStep=parseInt(val.perStep);
      var direction=val.direction;
      if(!$.fn.smooth){
        $.fn.smooth=$.fn.animate;
        $.fn.smoothStop=$.fn.stop;
      }
      var roll=function(){
        var $this=$(this);
        var $rollCont=$this.find(".wrapCont");//滚动对象
        if($rollCont.length===0){
          $this.wrapInner("<div class='wrapCont'></div>");
          $this.append($this.html());
          $rollCont=$this.find(".wrapCont");//滚动对象
        }
        var moveVertical=function(){
          $rollCont.removeAttr("style");
          var contH=parseInt($rollCont.outerHeight());
          var moveIntervalFnt=function(){//滚动
            if($this[0]["isPause"]===true) return false;
            if(perStep>0&&$this["scrollTop"]()>=contH){
              $this["scrollTop"]($this["scrollTop"]()-contH);
            }
            if(perStep<0&&$this["scrollTop"]()+perStep<=0){
              $this["scrollTop"]($this["scrollTop"]()+contH);
            }
            $this.smoothStop(true,true).smooth({"scrollTop":(parseInt($this["scrollTop"]())+perStep)},perSpeed,function(){
              if($this[0]["isPause"]===true) return false;
              $this[0]["perMoveTimeout"]=setTimeout(moveIntervalFnt,perDelay);
            },"Linear");
          };
          (contH-Math.abs(perStep))<$this.innerHeight() ? $rollCont.eq(1).hide() : $rollCont.eq(1).show();
          $this["scrollLeft"](0);
          //if(typeof($this[0]["moveInterval"])!=="undefined") clearInterval($this[0]["moveInterval"]);
          $this[0]["isPause"]=false;
          moveIntervalFnt();
          $this.on("mouseleave",this,function(){
            $this[0]["isPause"]=false;
            moveIntervalFnt();
          });
          $this.on("mouseenter",this,function(){
            $this[0]["isPause"]=true;
          });
        };
        var moveHorizontal=function(){
          $rollCont.css({"float":"left"}).eq(1).css({
            "margin-left":$rollCont.outerWidth(),
            "margin-top":-$rollCont.outerHeight()
          });
          var scrollLeft;
          var contW=parseInt($rollCont.outerWidth());
          var moveIntervalFnt=function(){//滚动
            if($this[0]["isPause"]===true) return false;
            if(perStep>0&&$this["scrollLeft"]()>=contW){
              $this["scrollLeft"]($this["scrollLeft"]()-contW);
            }
            if(perStep<0&&$this["scrollLeft"]()+perStep<=0){
              $this["scrollLeft"]($this["scrollLeft"]()+contW);
            }
            $this.smoothStop(true,true).smooth({"scrollLeft":(parseInt($this["scrollLeft"]())+perStep)},perSpeed,function(){
              if($this[0]["isPause"]===true) return false;
              $this[0]["perMoveTimeout"]=setTimeout(moveIntervalFnt,perDelay);
            },"Linear");
          };
          (contW-Math.abs(perStep))<$this.innerWidth() ? $rollCont.eq(1).hide() : $rollCont.eq(1).show();
          $this["scrollTop"](0);
          //if(typeof($this[0]["moveInterval"])!=="undefined") clearInterval($this[0]["moveInterval"]);
          $this[0]["isPause"]=false;
          moveIntervalFnt();
          $this.off("mouseleave",this).on("mouseleave",this,function(){
            $this[0]["isPause"]=false;
            moveIntervalFnt();
          });
          $this.off("mouseenter",this).on("mouseenter",this,function(){
            $this[0]["isPause"]=true;
          });
        };
        $this[0]["isPause"]=true;
        $this.smoothStop(true,true);
        if(typeof($this[0]["perMoveTimeout"]!=="undefined")) clearTimeout($this[0]["perMoveTimeout"]);
        $this.off("mouseenter mouseleave").css({
          "display":"block",
          "overflow":"hidden"
        });
        $rollCont.show();
        switch(direction){
          case("up"):
            moveVertical();
            break;
          case("down"):
            perStep=0-Math.abs(perStep);
            moveVertical();
            break;
          case("left"):
            moveHorizontal();
            break;
          case("right"):
            perStep=0-Math.abs(perStep);
            moveHorizontal();
            break;
          default:
            alert("\tdirection参数输入错误！\ndirection参数提示\:up(默认)，down，left，right。\n已经恢复默认up。 ");
            moveVertical();
            break;
        }
      };
      rollBox.each(roll);
      return this.each(function(){});
    },
    "elfRollPause":function(){//停止滚动,正时mouseleave事件无效
      var rollPause=function(){
        $(this)[0]["isPause"]=true;
      };
      $(this).each(rollPause);
      return this.each(function(){});
    },
    "elfRollPlay":function(){//继续滚动
      var rollPlay=function(){
        $(this)[0]["isPause"]=false;
      };
      $(this).each(rollPlay);
      return this.each(function(){});
    }
  });
})(jQuery);