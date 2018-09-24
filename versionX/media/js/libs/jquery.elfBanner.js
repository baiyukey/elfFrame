//author:baiyukey@qq.com
//version:0.0.9
//轮播图插件
;(function($){
  $.fn.extend({
    "elfBanner":function(val){
      $(this) ? eval(null) : alert("对象未找到");
      val=$.extend({
        'duration':5000,
        "method":"fade",//horizontal,fade
        "callback":null
      },val);
      var $box=$(this);
      var $boxUl=$box.find("ul");
      var $currentLi;
      var $willCurrLi;
      var currentLiLeft;
      //var willCurrLiLeft;
      var willStep=1;
      var countLink=$box.find(".button .number a").length;
      var ulWidth=$boxUl.find("li:eq(0)").innerWidth();
      var ulHeight=$boxUl.find("li:eq(0)").innerHeight();
      var play=function(){
        clearPlay();
        window["bannerBoxAutoPlay"]=setInterval(function(){$box.find(".button a.next").trigger("click")},val.duration);
      };
      var clearPlay=function(){
        if(typeof window["bannerBoxAutoPlay"]!=="undefined"){
          clearInterval(window["bannerBoxAutoPlay"]);
        }
      };
      var horizontalAnimate=function(willIndex){
        $currentLi=$boxUl.find("li.current");
        $willCurrLi=$currentLi.parent().children().eq(willIndex);
        willStep=$currentLi.index()<willIndex ? 1 : -1;
        currentLiLeft=(0-willStep)*ulWidth;
        //willCurrLiLeft=willStep*10;
        //$willCurrLi.css({"left":willStep*ulWidth});
        $currentLi.removeClass("current")[$.fn.smooth ? "smoothStop" : "stop"](true,true).css({
          "z-index":1,
          "opacity":1
        })[$.fn.smooth ? "smooth" : "animate"]({
          "left":currentLiLeft,
          opacity:0
        },1000,function(){$currentLi.hide()},"Linear");
        $willCurrLi.addClass("current")[$.fn.smooth ? "smoothStop" : "stop"](true,true).css({
          "left":willStep*ulWidth,
          "z-index":2,
          "opacity":0.0
        }).show()[$.fn.smooth ? "smooth" : "animate"]({"left":0,"opacity":0.5},600,false,"Linear")[$.fn.smooth ? "smooth" : "animate"]({
          "left":0,
          "opacity":1
        },1000,function(){},"Linear");
      };
      var fadeAnimate=function(willIndex){
        $boxUl.find("li.current")[$.fn.smooth ? "smoothStop" : "stop"](true,false).css({
          //"opacity":0,
          "left":0,
          "top":0
        });//.removeClass("current");
        $boxUl.find("li").eq(willIndex)[$.fn.smooth ? "smoothStop" : "stop"](true,false).css({
          "opacity":0,
          "left":0,
          "top":0
        });//.addClass("current");
        $boxUl.find("li.current").show()[$.fn.smooth ? "smooth" : "animate"]({"opacity":0},1500,false,"Linear");
        $boxUl.find("li:eq("+willIndex+")").show()[$.fn.smooth ? "smooth" : "animate"]({"opacity":1},1500,false,"Linear").addClass("current").siblings().removeClass("current");
      };
      var clickNumber=function(event){
        event.preventDefault();
        var $this=$(this);
        if($this.hasClass("prev")||$this.hasClass("next")) return false;
        var willIndex=$(this).index();
        $(this).addClass("current").siblings("a").removeClass("current");
        switch(val.method){
          case "horizontal":
            horizontalAnimate(willIndex);
            break;
          case "fade":
            fadeAnimate(willIndex);
            break;
          default :
            fadeAnimate(willIndex);
            break;
        }
      };
      var clickNext=function(event){
        event.preventDefault();
        $box.find(".button .number a.current").index()===(countLink-1) ? $box.find(".button .number a:first").trigger("click") : $box.find(".button .number a.current").next("a").click();
      };
      var clickPrev=function(event){
        event.preventDefault();
        $box.find(".button .number a.current").index()===0 ? $box.find(".button .number a:last").trigger("click") : $box.find(".button .number a.current").prev("a").click();
      };
      var initBannerBox=function(){
        play();
        if(val.callback!==null) val.callback.call(this);
      };
      $box.off("click");
      $box.off("mouseenter");
      $box.off("mouseleave");
      $box.on("click",".button .number a",clickNumber);
      $box.on("click",".button a.prev",clickPrev);
      $box.on("click",".button a.next",clickNext);
      $box.on("mouseenter",this,clearPlay);
      $box.on("mouseleave",this,play);
      if($.inArray($box[0].style.position,["relative","absolute"])<0) $box.css({"position":"relative"});
      $box.find(".button").css({
        "position":"absolute",
        "z-index":2,
        "user-select":"none"
      }).find(".number").css({
        "display":"inline-block"
      }).find("a:eq(0)").addClass("current").siblings().removeClass("current");//addCurr
      $boxUl.css({
        "position":"relative",
        "z-index":1,
        "height":ulHeight,
        "overflow":"hidden",
        "list-style-type":"none"
      }).find("li").not(":first").css({
        "opacity":0,
        "position":"absolute"
      }).hide();
      $boxUl.find("li:first").addClass("current").css({
        "opacity":1,
        "position":"absolute"
      }).show();
      initBannerBox();
      return $box;
    }
  });
})(jQuery);