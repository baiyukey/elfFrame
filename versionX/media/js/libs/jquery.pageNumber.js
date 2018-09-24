//author:baiyukey@qq.com
//version:0.2.9
;(function($){
  $.fn.extend({
    "pageNumber":function(_val){
      var val=$.extend({
        "pageCount":0,
        "pageCurrent":1,
        "perPageButtonCount":8,
        "callback":false,
        "callbackArr":null,
        "keyEvent":true//键盘快快捷键开关
      },_val);
      var $this=$(this);
      var pageCount=Number(val.pageCount);//总页数
      var pageCurrent=Number(val.pageCurrent);//当前页码数初始为1
      var perPageButtonCount=Number(val.perPageButtonCount);//每页页码按钮数
      var pageButtonStart;//页码HTML头
      var pageButtonMiddle;//页码HTML中
      var pageButtonEnd;//页码HTML尾 
      var jumpBox='';//跳转相关HTML
      var pageNumMin;//页码段最小值
      var pageNumMax;//页码段最大值
      var inputJumpNumber;
      var pageIdMark="page"+$(this).attr("id");//保证页码id的唯一性
      var returnCurr=function(id){return id===pageCurrent ? "pageNum current curr" : "pageNum"};
      pageCount<=0 ? pageCount=1 : null;
      pageNumMin=pageCurrent-(pageCurrent%perPageButtonCount);//返回一个比a小并且可以被b整除的数字,用于计算"页码段"的最小值
      pageNumMax=pageNumMin+perPageButtonCount-1;
      pageNumMin=pageNumMin===0 ? 1 : pageNumMin;
      pageNumMax=pageNumMax>pageCount ? pageCount : pageNumMax;
      pageCurrent=pageCurrent>pageCount ? pageCount : pageCurrent;
      pageButtonStart=pageCurrent===1 ? "" : '<a id="0___'+pageIdMark+'" href="#" class="homePageLink">首页</a><a id="'+(pageCurrent-2)+'__'+pageIdMark+'" href="#" class="prevPageLink">上页</a>';
      pageButtonMiddle=pageNumMin>=perPageButtonCount ? '<a id="'+(pageNumMin-2)+'_'+pageIdMark+'" href="#" class="pagePrev">..'+(pageNumMin-1)+'</a>' : '';
      for(var i=pageNumMin; i<=pageNumMax; i++){
        pageButtonMiddle+=('<a id="'+(i-1)+''+pageIdMark+'" href="#" class="'+returnCurr(i)+'">'+i+'</a>');
      }
      pageButtonMiddle+=pageNumMax<pageCount ? '<a id="'+pageNumMax+'_'+pageIdMark+'" href="#" class="pageNext">'+(pageNumMax+1)+'..</a>' : '';
      pageButtonEnd=pageCurrent===pageCount ? '<span class="lastPageIndicate">当前是末页！</span>' : '<a id="'+pageCurrent+'__'+pageIdMark+'" href="#" class="nextPageLink">下页</a><a id="'+(pageCount-1)+'___'+pageIdMark+'" href="#" class="lastPageLink">末页</a>';
      pageButtonEnd+=('<span class="pageCount">'+pageCurrent+'/'+pageCount+'</span>');
      if(pageCount>1){
        if(pageCurrent===pageCount||pageCurrent<0){
          inputJumpNumber=1;
        }
        else if(pageCurrent>pageCount){
          inputJumpNumber=pageCount;
        }
        else{
          inputJumpNumber=pageCurrent+1;
        }
        jumpBox='<p class="displayIB jumpBox"><span>&nbsp;&nbsp;跳转到：</span><input type="number" class="inputPageNum" value="'+inputJumpNumber+'" min="1" max='+pageCount+'><a href="#" class="jumpButton">Go</a></p>';
      }
      $this.addClass("pageNumberBox").html('<p class="pageBox">'+pageButtonStart+pageButtonMiddle+pageButtonEnd+'</p>'+jumpBox);
      if(pageButtonEnd!==""){
        $this.find("input.inputPageNum").on("keyup",this,function(evt){
          evt=(evt) ? evt : ((window.event) ? window.event : ""); //兼容IE和Firefox获得keyBoardEvent对象
          var key=evt.keyCode ? evt.keyCode : evt.which; //兼容IE和Firefox获得keyBoardEvent对象的键值
          if(parseInt($(this).val())>parseInt($(this).attr("max"))) $(this).val($(this).attr("max"));
          if(key===13){
            $this.find("a.jumpButton").trigger("click").trigger("keyup");
          }
        });
      }
      var getCurrentPageNumberBox=function(_window){
        var thisWindow=typeof(_window)==="undefined" ? window : _window;
        var $thisPageNumberBox=thisWindow ? $(thisWindow.document).find(".pageNumberBox.current").eq(0) : [];
        if($thisPageNumberBox.length===0&&thisWindow!==window.top){
          getCurrentPageNumberBox(thisWindow.parent);
          return false;
        }
        if($thisPageNumberBox.length===0) $thisPageNumberBox=false;
        return $thisPageNumberBox;
      };
      var checkThisKey=function(evt){
        var runThis=function(){
          var $pageNumberBox=getCurrentPageNumberBox();
          if(!$pageNumberBox) return false;
          evt=(evt) ? evt : ((window.event) ? window.event : ""); //兼容IE和Firefox获得keyBoardEvent对象
          var key=evt.keyCode ? evt.keyCode : evt.which; //兼容IE和Firefox获得keyBoardEvent对象的键值
          var clickLeftRight=function(thisKey){
            if(thisKey===37&&pageCurrent>1){
              $pageNumberBox.find("a.prevPageLink").trigger("click");
            }//左键
            else if(thisKey===39&&pageCurrent<pageCount){
              $pageNumberBox.find("a.nextPageLink").trigger("click");
            }//右键
          };
          if($("body").find("input:focus").length===0){
            clickLeftRight(key);
          }
        };
        if(typeof(window.waitCheckPageBoxKey)!=="undefined") clearTimeout(window.waitCheckPageBoxKey);
        window.waitCheckPageBoxKey=setTimeout(runThis,100);
      };
      var enterThisBox=function(){
        var $pageNumberBox=getPageNumberBoxes();
        var showHelpTimes=3;//最多显示3次help;
        $pageNumberBox.removeClass("current");
        var $thisPageNumberBox=$(this);
        $thisPageNumberBox.addClass("current");
        if(pageCount<=1) return false;//只有一个页码时不提示左右键翻页
        if(!document.getElementById("pageBoxHelp")){
          $("body").append('<p style="position:absolute;font-size:0.75rem;line-height:'+$thisPageNumberBox.height()+'px;display:none;z-index:9999999" id="pageBoxHelp"><i class="iconKeyboard font16 vTop"></i><span class="vMiddle mgl5">敲击 &larr; &rarr; 左右键可翻页&nbsp;</span></p>');
        }
        if(typeof($thisPageNumberBox[0]["showHelp"])==="undefined"){
          $thisPageNumberBox[0]["showHelp"]=0;
          $thisPageNumberBox[0]["showHelpSwitch"]=0;
        }
        var $thisHelp=$("#pageBoxHelp");
        if($thisPageNumberBox[0]["showHelp"]<showHelpTimes&&$thisPageNumberBox[0]["showHelpSwitch"]===0){
          $thisPageNumberBox[0]["showHelpSwitch"]=1;
          var thisAlign=window.getComputedStyle($thisPageNumberBox[0])["text-align"];
          var helpCss={
            "top":0,
            "left":0
          };
          if(thisAlign==="left"){
            helpCss.top=$thisPageNumberBox.find(".pageBox").offset().top;
            helpCss.left=$thisPageNumberBox.find(".pageBox").offset().left+$thisPageNumberBox.find(".pageBox").width()+$thisPageNumberBox.find(".jumpBox:visible").outerWidth()+15;
          }
          else if(thisAlign==="right"){
            helpCss.top=$thisPageNumberBox.find(".pageBox").offset().top;
            helpCss.left=$thisPageNumberBox.find(".pageBox").offset().left-$thisHelp.width()-5;
          }
          else{
            helpCss.top=$thisPageNumberBox.find(".pageBox").offset().top-$thisHelp.height()-5;
            helpCss.left=$thisPageNumberBox.find(".pageBox").offset().left+($thisPageNumberBox.find(".pageBox").width()+$thisPageNumberBox.find(".jumpBox:visible").outerWidth()-$thisHelp.width())/2;
          }
          $thisHelp.smoothStop(true,false).css({
            "left":helpCss.left,
            "top":helpCss.top,
            "opacity":1
          }).show().smoothOut(3000,function(){
            $thisPageNumberBox[0]["showHelp"]+=1;
            $thisPageNumberBox[0]["showHelpSwitch"]=0;
            if($thisPageNumberBox[0]["showHelp"]<showHelpTimes) $this.one("mouseenter",this,enterThisBox);
          });
        }
      };
      var leaveThisBox=function(){
        $("#pageBoxHelp").stop(true,false).fadeOut();
        $this.one("mouseenter",this,enterThisBox);
      };
      var getPageNumberBoxes=function(){
        var $pageNumberBox=$(".pageNumberBox");
        var $iframe=typeof(window.top.document)!=="undefined" ? $(window.top.document.getElementsByTagName("iframe")) : [];
        for(var i=0; i<$iframe.length; i++){
          if($iframe.eq(i)[0].src.indexOf(window.location.hostname)<0) continue;
          $pageNumberBox=$pageNumberBox.add($(window.top.document.getElementsByTagName("iframe")[i].contentDocument.getElementsByClassName("pageNumberBox")));
        }
        return $pageNumberBox
      };//获取当前页面包括iframe中的pageNumberBox
      var bindKeyup=function(){
        if(window){
          var $pageNumberBox=getPageNumberBoxes();
          $pageNumberBox.removeClass("current");
          if($this.is(":visible")||$pageNumberBox.filter(":visible").length===0) $this.addClass("current");
          $this.one("mouseenter",this,enterThisBox);
          if(window!==window.top) $(window.top).off("keyup").on("keyup",checkThisKey);
          $(window).off("keyup").on("keyup",checkThisKey);
          if(val.callback) val.callback.call(this,val.callbackArr);
        }
        else{
          setTimeout(bindKeyup,100);
        }
      };
      if(val.keyEvent!==false) bindKeyup();
      if(val.callback) val.callback.call(this,val.callbackArr);
      return this.each(function(){});
    }
  });
})(jQuery);