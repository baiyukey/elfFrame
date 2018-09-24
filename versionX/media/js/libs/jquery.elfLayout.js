/* 
 法律说明:本插件对应的发明专利(中国发明专利:ZL201310215942.7)已受法律保护,对于营利机构或商业用户您需要联系作者申请一个授权才可使用.非营利机构或个人免费开放;
 插件依赖:本插件依赖jQuery库;
 see: https://github.com/baiyukey/elfLayout for details
 版本:v0.00.13
 */
;(function($){
  $.fn.extend({
    "elfLayout":function(_val){
      $(this).elfLayoutExit();
      var val=$.extend({
        "scale":"no",
        "referenceY":null,
        "referenceX":null,
        "callback":false
      },_val);
      var $this=$(this);
      var $verticalElement=$(this);
      var $horizontalElement=$(this);
      var $referenceY=$(val.referenceY);
      var $referenceX=$(val.referenceX);
      //获取参数
      var scale=val.scale;//元素是否与页面同比滚动，默认"no"，即同步滚动
      var margin,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight;
      //定义相关变量
      var scrolledPercentY,
        scrolledPercentX;
      var scrolledPerSizeY,
        scrolledPerSizeX;//每次滚动条滚动的距离，向下为正向上为负
      var elementH,
        elementW;
      var elementX,
        elementY;
      var boxH,
        boxW;
      var currWinH,
        currWinW;
      var beginY,
        endY,
        addY;
      var beginX,
        endX,
        addX;
      var elementScrollFreeY,
        elementScrollFreeX;
      var referenceScrollFreeY,
        referenceScrollFreeX;//纵向参照物滚动空间
      var scrollYBefore,
        scrollXBefore;
      var scrollY,
        scrollX;
      var winY,
        winX;
      var winYBefore=0,
        winXBefore=0;
      var newTime=new Date().getTime();
      var dataElfLayoutId="dataElfLayoutId"+newTime;
      var styleRecordIdName="data_style_record_"+newTime;
      //$(this).elfLayoutExit();
      //判断滚动操作方向
      window[dataElfLayoutId]={};
      //初始化
      var winInitialize=function(){
        //referenceY.removeAttr("style");
        //$verticalElement.removeAttr("style");
        //高度初始值开始
        margin=parseInt($this.css("margin"));
        marginTop=parseInt($this.css("margin-top"));
        marginBottom=parseInt($this.css("margin-bottom"));
        marginLeft=parseInt($this.css("margin-left"));
        marginRight=parseInt($this.css("margin-right"));
        $this.attr("data_elflayout_id",dataElfLayoutId);
        $referenceX.attr("data_elflayout_id",dataElfLayoutId);
        $referenceY.attr("data_elflayout_id",dataElfLayoutId);
        if(val.referenceY!==null){
          if($referenceY.outerHeight()<$verticalElement.outerHeight()){
            $referenceY=$verticalElement;
            $verticalElement=$(val.referenceY);
          }
          if(!$referenceY[0].hasAttribute(styleRecordIdName)) $referenceY.attr(styleRecordIdName,($referenceY.attr("style")||""));
          if(!$verticalElement[0].hasAttribute(styleRecordIdName)) $verticalElement.attr(styleRecordIdName,($verticalElement.attr("style")||""));
          currWinH=parseInt($(window).innerHeight());
          beginY=parseInt($referenceY.offset().top);
          endY=parseInt($referenceY.offset().top)+parseInt($referenceY.height());
          elementH=parseInt($verticalElement.outerHeight())+marginTop+marginBottom;
          boxH=parseInt($referenceY.outerHeight());
          elementX=$verticalElement.offset().left;
          if(boxH<=currWinH&&elementH<=currWinH){addY=0;}
          if(elementH>currWinH){
            $verticalElement.innerHeight(currWinH-marginTop-marginBottom);
            elementScrollFreeY=elementH-currWinH;
            addY=0;
          }
          else if(elementH<currWinH){
            $verticalElement.innerHeight(elementH);
            elementScrollFreeY=0;
            addY=beginY+currWinH-$verticalElement.offset().top-elementH;
          }
          endY=endY+addY;
          referenceScrollFreeY=endY-beginY-currWinH;
          //scrollVertical();
        }
        //高度初始值结束
        //宽度初始值开始
        else if(val.referenceX!==null){
          if(boxW<=currWinW&&elementW<=currWinW){return false}
          if($referenceX.outerWidth()<$horizontalElement.outerWidth()){
            $referenceX=$horizontalElement;
            $horizontalElement=$(val.referenceX);
          }
          if(!$horizontalElement[0].hasAttribute(styleRecordIdName)) $horizontalElement.attr("style",$horizontalElement.attr(styleRecordIdName));
          if(!$referenceX[0].hasAttribute(styleRecordIdName)) $referenceX.attr("style",$referenceX.attr(styleRecordIdName));
          $horizontalElement.css({"overflow":"hidden"});
          currWinW=parseInt($(window).innerWidth());
          beginX=parseInt($referenceX.offset().left);
          endX=parseInt($referenceX.offset().left)+parseInt($referenceX.width());
          elementW=parseInt($horizontalElement.outerWidth())+marginLeft+marginRight;
          boxW=parseInt($referenceX.outerWidth());
          elementY=$verticalElement.offset().top;
          if(elementW>currWinW){
            $horizontalElement.innerWidth(currWinW-marginLeft-marginRight);
            elementScrollFreeX=elementW-currWinW;
            addX=0;
          }
          else if(elementW<currWinW){
            $horizontalElement.innerWidth(elementW);
            elementScrollFreeX=0;
            addX=beginX+currWinW-$horizontalElement.offset().left-elementW;
          }
          endX=endX+addX;
          referenceScrollFreeX=endX-beginX-currWinW;
        }
        if(val.callback) val.callback.call(this);
        //宽度初始值结束
        window.addEventListener("scroll",window[dataElfLayoutId].scrollDirection);//监听滚动窗口
        window.addEventListener("resize",window[dataElfLayoutId].waitResizeFinish);//监听窗口改变大小
        var $reference=$(val.referenceX||val.referenceY);
        var getElementsSize=function(){return [$reference.width(),$reference.height()].join("&")};
        var currentSize=getElementsSize();
        var sizeChange=function(){
          if((getElementsSize()===currentSize)||($reference[0].style.position==="fixed")||($reference[0].style.position==="absolute")) return false;//fixed表示正在滚动中,absolute表示已滚动到页尾
          var currentScroll=[$(window).scrollLeft(),$(window).scrollTop()];
          val.callback=function(){window.scrollTo(currentScroll[0],currentScroll[1])};
          $this.elfLayout(val);
        };
        if(typeof(window[dataElfLayoutId].listenSize)!=="undefined") clearInterval(window[dataElfLayoutId].listenSize);
        window[dataElfLayoutId].listenSize=setInterval(sizeChange,500);//监听元素动态改变尺寸
      };
      window[dataElfLayoutId].scrollDirection=function(){
        winY=$(window).scrollTop();
        winX=$(window).scrollLeft();
        if(winY!==winYBefore&&val.referenceY!==null&&referenceScrollFreeY>0){
          scrollVertical();
          winYBefore=winY;
        } //纵向滚动
        if(winX!==winXBefore&&val.referenceX!==null&&referenceScrollFreeX>0){
          scrollHorizontal();
          winXBefore=winX;
        } //横向滚动
      };
      window[dataElfLayoutId].waitResizeFinish=function(){
        if(typeof(window[dataElfLayoutId].resizeWindow)!=="undefined") clearTimeout(window[dataElfLayoutId].resizeWindow);
        window[dataElfLayoutId].resizeWindow=setTimeout(function(){
          var currentScroll=[$(window).scrollLeft(),$(window).scrollTop()];
          val.callback=function(){window.scrollTo(currentScroll[0],currentScroll[1]);};//最原始的callback不必执行
          $this.elfLayout(val);
        },500);
      };
      //纵向滚动操作
      var scrollVertical=function(){
        scrollY=$(document).scrollTop();
        if(scrollY>beginY&&(scrollY+currWinH)<endY){
          $verticalElement.css({
            "position":"fixed",
            "width":$verticalElement.width(),
            "height":currWinH-marginTop-marginBottom,
            "overflow":"hidden",
            "top":"0",
            "left":elementX,
            "margin-top":marginTop,
            "margin-left":marginLeft,
            "margin-right":marginRight
          });
          if(scale==="yes"&&elementH>currWinH){
            scrolledPercentY=(scrollY-beginY)/referenceScrollFreeY;
            $verticalElement.scrollTop(scrolledPercentY*elementScrollFreeY);
            $("#val").html(Math.round(scrolledPercentY*100)+"%");//同比移动时滚动进度显示
          }
          else if(scale==="no"&&elementH>currWinH){
            scrolledPerSizeY=scrollY-scrollYBefore;
            $verticalElement.scrollTop($verticalElement.scrollTop()+scrolledPerSizeY);
            scrollYBefore=scrollY;
          }
        }
        else if(scrollY>beginY&&(scrollY+currWinH)>=endY){
          $verticalElement.css({
            "position":"absolute",
            "top":"0",
            "width":$verticalElement.width(),
            "margin-top":(endY-currWinH+marginTop),
            "overflow":"hidden"
          }).scrollTop(elementScrollFreeY);
        }
        else if(scrollY<beginY){
          $verticalElement.attr("style",$verticalElement.attr(styleRecordIdName));
          $referenceY.attr("style",$referenceY.attr(styleRecordIdName));
        }
      };
      //横向滚动操作
      var scrollHorizontal=function(){
        scrollX=$(document).scrollLeft();
        //elementY=$horizontalElement.offset().top;
        if(scrollX>beginX&&(scrollX+currWinW)<endX){
          if($("#appendTemp").length<=0) $horizontalElement.after("<div id='appendTemp' style='width:"+elementW+"px; height:"+$horizontalElement.height()+"px; visibility:hidden'></div>");//占位,防止页面发生变化
          $horizontalElement.css({
            "position":"fixed",
            "width":currWinW-marginLeft-marginRight,
            "overflow":"hidden",
            "left":"0",
            "top":elementY,
            "margin-top":marginTop,
            "margin-left":marginLeft,
            "margin-right":marginRight
          });
          if(scale==="yes"&&elementW>currWinW){
            scrolledPercentX=((scrollX-beginX)/referenceScrollFreeX).toFixed(2);
            $horizontalElement.scrollLeft(scrolledPercentX*elementScrollFreeX);
            $("#val").html(parseInt(scrolledPercentX*100).toString()+"%");
          }
          else if(scale==="no"&&elementW>currWinW){
            scrolledPerSizeX=scrollX-scrollXBefore;
            $horizontalElement.scrollLeft($horizontalElement.scrollLeft()+scrolledPerSizeX);//怎么样才能平滑滚动呢？
            scrollXBefore=scrollX;
          }
        }
        else if(scrollX>beginX&&(scrollX+currWinW)>=endX){
          $horizontalElement.css({
            "position":"absolute",
            "left":"0px",
            "margin-left":(endX-currWinW+marginLeft),
            "overflow":"hidden"
          }).scrollLeft(elementScrollFreeX);
          //$("#appendDiv").length>0 ? $("#appendDiv").remove() : null;
        }
        else if(scrollX<=beginX){
          $("#appendTemp").remove();
          $horizontalElement.attr("style",$horizontalElement.attr(styleRecordIdName));
          $referenceX.attr("style",$referenceX.attr(styleRecordIdName));
        }
      };
      winInitialize();
      return this;
    },//elfLayout  end;
    "elfLayoutExit":function(){
      //data_elflayout_id="dataElfLayoutId1508603013566"
      var dataElfLayoutId=$(this).attr("data_elflayout_id");
      if(!dataElfLayoutId) return false;
      var thisStyleRecord="data_style_record_"+dataElfLayoutId.replace("dataElfLayoutId","");
      $("[data_elflayout_id="+dataElfLayoutId+"]").each(function(i,e){
        $(e).attr("style",$(e).attr(thisStyleRecord));
        $(e).removeAttr(thisStyleRecord);
        $(e).removeAttr("data_elflayout_id");
      });
      window.removeEventListener("scroll",window[dataElfLayoutId].scrollDirection);
      window.removeEventListener("resize",window[dataElfLayoutId].waitResizeFinish);
      if(typeof(window[dataElfLayoutId].listenSize)!=="undefined") clearInterval(window[dataElfLayoutId].listenSize);
      return this;
    }
    //elfLayoutExit  end;
  })
})(jQuery);