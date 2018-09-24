//elfFrame.js (elfFrame框架引擎)
//作者:baiyukey@qq.com
//版本:0.00.03
//日期:2017.08.19
$(function(){
  //var
  var thisPageName=window.top.location.pathname.split("/").pop().replace(".html","");
  var thisVersion="";
  var subpageLoader=function(){
    var modulesDir="";
    var loadElement=function(_element,_callback){
      var element=_element;
      var $element=$("#"+element);
      var callback=typeof(_callback)!=="undefined" ? _callback : undefined;
      var fileName;
      var ajaxUrl="";
      var oldSubPageId="";
      var newSubPageId="";
      var thisVersion='elfFrame'+reVersion();//每两小时返回一个值
      var ajaxPage=function(_ajaxUrl){
        var ajaxUrl=_ajaxUrl;
        var $oldSubPage=$("#"+oldSubPageId);//旧页面
        var $newSubPage=$("#"+newSubPageId);//新页面
        $newSubPage.attr("src",ajaxUrl);
        var animateWidth=$oldSubPage.width();
        var animateHeight=$oldSubPage.height();
        var animateTime=Math.min(750,window.myPage.fadeTime*2.5);
        var $allLink=$("a[href!='#']");
        var $iframe=$("iframe","#elfFramePages");
        var showHref=$iframe.length>=1 ? $iframe.eq(0).attr("src") : "";
        var hideHref=$iframe.length>1 ? $iframe.eq(1).attr("src") : "";
        var animateFinish=function(){
          $oldSubPage.attr("src","about:blank");//释放内存
          try{
            $oldSubPage[0].contentWindow.document.write('');
            $oldSubPage[0].contentWindow.document.clear();
          }//释放内存
          catch(e){}
          $oldSubPage.remove();
          $($newSubPage[0].contentDocument).ready(function(){
            if(elf&&elf.iframeResize) elf.iframeResize()
          });
          $("#elfFramePages").css({
            "width":"100%",
            "position":"relative"
          }).find("iframe.elfFrameSubPage").css({"width":"100%"});
          if(typeof(callback)!=="undefined") callback.call(this);
        };
        var animateA=function(){
          $oldSubPage.smooth({"left":animateWidth},animateTime);
          $newSubPage.smoothStop(true,false).css({
            "position":"absolute",
            "left":animateWidth
          }).show().smooth({"left":"0"},animateTime,animateFinish);
        };
        var animateB=function(){
          $oldSubPage.smooth({"left":(direction*(0-animateWidth))},animateTime);
          $newSubPage.smoothStop(true,false).css({
            "position":"absolute",
            "left":(direction*animateWidth)
          }).show().smooth({"left":"0"},animateTime,animateFinish);
        };
        var animateC=function(){
          $oldSubPage.smoothStop().smooth({"top":(direction*(0-animateHeight))},animateTime);
          $newSubPage.smoothStop(true,false).css({
            "position":"absolute",
            "top":direction*animateHeight
          }).show().smooth({"top":"0"},animateTime,animateFinish);
        };
        var animateD=function(){
          $oldSubPage.smoothOut(animateTime);
          $newSubPage.smoothStop(true,true).css({
            "position":"absolute",
            "top":0,
            "opacity":0
          }).show().smooth({"opacity":1},animateTime,animateFinish);
        };
        var animateE=function(){
          $oldSubPage.remove();
          $newSubPage.css({
            "position":"absolute",
            "top":0
          });
          setTimeout(function(){
            $newSubPage.show();
            animateFinish()
          },10);
        };
        var animate={
          "0":animateE,
          "1":animateA,
          "2":animateB,
          "3":animateC,
          "4":animateD
        };//1:右滑退出左滑进入,2:左右滑动,3:上下滑动,4:渐隐渐出,5:无动画
        var getEq=function(_src){
          var src=_src ? _src.split("?")[0] : "";
          var eq=-1;
          for(var i=0; i<$allLink.length; i++){
            if($allLink.eq(i).attr("href").replace(/[./]+/,"")===src.replace(/[./]+/,"")){
              eq=i;
              break;
            }
          }
          return eq;
        };
        var showHrefEq=getEq(showHref),
          hideHrefEq=getEq(hideHref);
        var direction=showHrefEq>hideHrefEq ? 1 : -1;
        var thisTimeOut=new Date().getTime()+10000;//加载页面秒超时时间
        //$(document).find("#iframeCss").attr("href",window["elfFrame"][thisPageName].dataDir+"css/"+modulesDir+".css");
        var tryNewPage=function(_animateType){
          if($newSubPage.attr("src")&&$($newSubPage[0].contentWindow.document.body).html()!==""){
            setTimeout(animate[_animateType],0);
          }
          else{
            if(new Date().getTime()>thisTimeOut){
              elf.alertInfo("加载页面超时,请重试.");
              return false;
            }
            if(typeof(window.tryNewPageTimeout!=="undefined")) clearTimeout(window.tryNewPageTimeout);
            window.tryNewPageTimeout=setTimeout(tryNewPage,20,_animateType);
          }
        };
        if($oldSubPage.length>0){
          if(typeof(animate[window["elfFrame"][thisPageName].animateConvert])!=="undefined"&&showHrefEq>=0&&hideHrefEq>=0){
            tryNewPage(window["elfFrame"][thisPageName].animateConvert);
          }
          else if(showHrefEq<0||hideHrefEq<0){
            tryNewPage(0);//无动画
          }
          else{
            tryNewPage(0);//无动画
          }
        }
        else{
          tryNewPage(0);//无动画
        }
      };
      if(element!=="page"){
        $element.empty();
        var thisSrc=$element.attr("data-src");
        ajaxUrl=thisSrc+(/\?/.test(thisSrc) ? "&" : "?")+"v="+thisVersion;
        $element.load(ajaxUrl,loaded(element,callback));
      }
      else{
        var $thisPage=$("#elfFramePages");
        if($thisPage.length===0){
          if(console) console.log("框架页未找到%c#elfFramePages%c,页面加载被中断","color:red;font-size:24px;font-family:'微软雅黑',sans-serif","");
          return false;
        }//没有#elfFramePages不执行
        if($thisPage.find("iframe").length===0) $thisPage.html('<iframe frameborder="0" scrolling="no"></iframe>');
        $("iframe:gt(0)","#elfFramePages").remove();
        $(".showPanel").remove();
        $(".disableMark").remove();
        $("#markDiv").remove();
        try{
          if(location.hash!==""){
            modulesDir=elf.decodeHex(location.hash.replace("#",""));
          }
          else if($thisPage[0].hasAttribute("data-src")){
            modulesDir=$thisPage.attr("data-src").replace(".html","");
            $thisPage.removeAttr("data-src");
          }
          else if(window["elfFrame"][thisPageName]["homePage"]){
            modulesDir=window["elfFrame"][thisPageName]["homePage"].replace(".html","");
          }
          if(modulesDir===""){
            if(console) console.log("%c首页地址错误,程序被中断.","color:#ff0000;");
            return false;
          }
        }
        catch(e){
          if(console){
            console.log('%c可能未定义window["elfFrame"][thisPageName].homePage',"color:#ff0000");
          }
          return false;
        }
        var indexParam=modulesDir.split("?")[1] ? "?"+modulesDir.split("?")[1] : "";
        modulesDir=modulesDir.split("?")[0];
        fileName=modulesDir+".html"+indexParam+(indexParam==="" ? "?" : "&")+"v="+thisVersion;
        var pageWidth=$thisPage.width();
        var pageHeight=$thisPage.height();
        oldSubPageId="oldSubPage"+new Date().getTime();
        newSubPageId="newSubPage"+new Date().getTime();
        $("html,body").smoothStop(true,false).smooth({scrollTop:0},window.myPage.fadeTime*2);
        if($thisPage.find("iframe[src]").length!==0){
          $thisPage.find("iframe[src]:eq(0)").addClass("elfFrameSubPage").attr("id",oldSubPageId).css({
            "position":"absolute",
            "width":pageWidth,
            "height":pageHeight,
            "z-index":1
          }).before('<iframe style="z-index:0;display:none;width:'+pageWidth+'px;height:'+pageHeight+'px" frameborder="0" scrolling="no" class="elfFrameSubPage"  id="'+newSubPageId+'"></iframe>');
        }
        else{
          $thisPage.find("iframe:eq(0)").addClass("elfFrameSubPage").attr("id",newSubPageId).css({
            "width":pageWidth,
            "height":pageHeight,
            "z-index":1
          });
        }
        ajaxUrl=fileName;
        ajaxPage(ajaxUrl);
      }
    };
    var loaded=function(_element,_callback){
      return function(){
        var $element=$("#"+_element);
        $element.off("click").on("click","a",clickA);
        if($element.find(".leftMenu").length>0) leftMenuLoaded();
        if(typeof(_callback)!=="undefined") _callback.call(this);
      }
    };//header,footer,leftMenu执行此函数,page不执行
    var checkBrowser=function(){
      var title="时代在进步！为了更好的用户体验，强烈建议您使用现代浏览器(例如chrome,fireFox等)或IE的最新版本。";
      if($.support.leadingWhitespace===false&&$("#updateIndicate").length===0){
        $("header").attr("title",title);
        $("body").prepend('<div id="updateIndicate" style="width:100%; height:30px; line-height:30px; font-size:13px; color:#f03a08; text-align:center;'+'background:#fcf6df;">'+title+'<a href="http://windows.microsoft.com/zh-cn/internet-explorer/download-ie" target="_blank" style="font-size:1em; '+'color:#3791ed">点此升级</a></div>');
        //setTimeout(function(){$("#updateIndicate").slideUp(500)},10000)
      }
    };
    this.loadElement=loadElement;
    this.checkBrowser=checkBrowser;
  };
  var clickA=function(event){
    var $this=$(this);
    if($this.hasClass("disable")||$this.hasClass("current")) return false;
    var run=function($ele){
      var thisHref=$ele.attr("href");
      var markUrl=thisHref.replace(".html","");
      window.top.location.hash="#"+elf.encodeHex(markUrl);
    };
    if($this[0].hasAttribute("target")){
      if(window!==window.top&&$this.attr("target")==="_self"&&$this[0].hasAttribute("href")&&$.inArray($this.attr("href"),["","#"])<0&&$this.attr("href").indexOf("mailto")<0){
        event.preventDefault();
        run($this);
      }
      if($this.attr("href").indexOf("mailto")>=0&&$this.attr("target")!=="_blank"){
        event.preventDefault();
        $this.attr("target","_blank");
        clickA(event);
      }
      //target如果不是"_self"就爱咋咋的吧
    }
    else{//不含target属性
      event.preventDefault();
      if($this[0].hasAttribute("href")&&$.inArray($this.attr("href"),["","#"])<0) run($this);//不含target属性同时href属性的值是有效的URL
    }
  };
  var leftMenuLoaded=function(){
    var $element=$(".leftMenu");
    var enableId=typeof($.cookie("perms"))!=="undefined" ? elf.decodeHex($.cookie("perms")).split("&") : [];
    var clickLeftMenu=function(){
      var $thisDir=$(this).closest(".hasList");
      var $topDir=$thisDir.parent();
      if($thisDir.length===0) return false;
      var closeDir=function(){
        if(!$topDir.hasClass("unfold")){
          $thisDir.find("ul.dir2").css({"display":"block"}).stop(false,true).slideUp(window.myPage.fadeTime).end().removeClass("unfold");
        }
      };
      var openDir=function(){
        $thisDir.find("ul.dir2").stop(false,true).slideDown(window.myPage.fadeTime).end().addClass("unfold");
        if(!$topDir.hasClass("unfold")){
          $thisDir.siblings("li.hasList").removeClass("unfold").find("ul.dir2").stop(true,true).slideUp(window.myPage.fadeTime);
        }
      };
      $thisDir.hasClass("unfold") ? closeDir() : openDir();
    };
    for(var ii=0; ii<enableId.length; ii++){
      $element.find("#dir_"+enableId[ii]).removeClass("displayNone");
    }
    $element.find("ul.dir").children("li.displayNone").remove();
    $(document).on("click",".leftMenu li.hasList p a",clickLeftMenu);
  };
  var newPageLoaded=function(){
    var changeTitle=function(){
      var iframeTitle=$($(".elfFrameSubPage")[0].contentWindow.document).attr("title");
      $(window.top.document).attr("title",iframeTitle);
    };
    var fixOtherStyle=function(){
      //var modulesDir=$("#elfFramePages").find('iframe:eq(0)').attr("src");
      var thisModulesDir=$(".elfFrameSubPage").eq(0).attr("src").split("?")[0].replace(/[./]+/,"");
      var thisTime=new Date().getTime();
      var runThis=function(){
        var $leftMenuA=$("a[href!=#]","[data-src]").removeClass("current");
        if($leftMenuA.length===0&&(new Date().getTime()-thisTime)<5000){
          if(typeof(window.waitFixLeftMenu)!=="undefined") clearTimeout(window.waitFixLeftMenu);
          window.waitFixLeftMenu=setTimeout(runThis,500);
          return false;
        }
        $leftMenuA.each(function(i,e){
          if($(e).attr("href").replace(/[./]+/,"")===thisModulesDir){
            $(e).addClass("current");
            $(e).closest("li").addClass("unfold");//上一级展开,需要在css里设置unfold样式
          }
        });
      };
      runThis();
    };
    changeTitle();
    fixOtherStyle();
    $($("#elfFramePages").find('iframe')[0].contentWindow.document).on("click","a",clickA);
    $("html,body").smoothStop(true,false).smooth({scrollTop:0});
    $(".showPanel").each(function(index,element){
      if($(element).find(".alertCont")){
        $(element).find(".alertCont").find("p").text()==="网络连接失败！"||$(element).find(".alertCont").text()==="" ? $(element).children(":eq(1)").elfAlertExit() : null;
      }
    });//清除eleFrame可能会报出的弹窗错误
  };
  var reVersion=function(_hours){
    var newDate=new Date();
    var hours=_hours||2;
    hours=Math.min(24,hours);
    var min=/^((192\.168|172\.([1][6-9]|[2]\d|3[01]))(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){2}|10(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){3})|(localhost)$/.test(window.location.hostname) ? "" : ".min";
    return min==="" ? ""+newDate.getTime() : ""+(newDate.getMonth()+1)+newDate.getDate()+Math.ceil((newDate.getHours()+1)/hours);
  };
  var checkUrlChange=function(){
    //监听触发操作  
    var hashChange=function(){
      thisPageLoader.loadElement("page",newPageLoaded);
    };
    if(('onhashchange' in window)&&((typeof(document["documentMode"])==='undefined')||document["documentMode"]===8)){
      window.onhashchange=hashChange;
    }
    else{
      if(typeof(elfHash)==="undefined") window.elfHash=window.location.hash;
      var checkInterval=function(){
        if(window.elfHash!==window.location.hash){
          window.elfHash=window.location.hash;
          hashChange();
        }
      };
      setInterval(checkInterval,150);
    }
  };
  if(typeof(window["elfFrame"])==="undefined"&& typeof(window["elfFrame"][thisPageName])!=="undefined"){
    alert('呃!config.js中未配置window["elfFrame"]["'+thisPageName+'"]或未获取到相关信息,elfFrame已终止');
    return false;
  }
  thisVersion=reVersion();
  var thisPageLoader=new subpageLoader();
  var runThis=function(_e){
    var $e=$(_e);
    var thisId="";
    if($e.attr("id")){
      thisId=$e.attr("id");
    }
    else{
      thisId="elf_"+$e.attr("data-src").replace(/[\\.\/]/g,"_")+"_"+thisVersion;
    }
    $e.attr("id",thisId);
    thisPageLoader.loadElement(thisId);
  };
  $("[data-src]:not(#elfFramePages)").each(function(i,e){
    if($(e).attr("data-src")!=="") runThis(e);
  });
  thisPageLoader.loadElement("page",newPageLoaded);
  thisPageLoader.checkBrowser();
  checkUrlChange();
  //event
});