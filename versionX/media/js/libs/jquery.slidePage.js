//用于将指定元素在某元素区域内滑出并突出显示
//author:baiyukey@qq.com
//version:0.00.007
$.fn.extend({
  'slidePage':function(_val){
    var $pageEle=$(this);
    var $body=$("body");
    var thisVal=$.extend({
      "area":$body,
      "method":"left",//String | 滑动方向,left(默认),right,up,down,exit(滑出) | 可选
      "x":"right",//String或者Number | x坐标对齐方式,left,center,right(默认),百分比,或者数字 | 可选
      "y":"top",//String或者Number | y坐标对齐方式,top(默认),middle,bottom,百分比,或者数字 | 可选
      "width":"auto",// String或者Number | 滑出元素的宽度,"auto"(默认,取area宽度,支持百分比),或者数字 | 可选
      "height":"auto",// String或者Number | 滑出元素的高度,"auto"(默认,取area高度,支持百分比),或者数字 | 可选
      "initFnt":null,
      "initFntArr":undefined,
      "callback":null,
      "callbackArr":undefined
    },_val);
    if($.inArray(thisVal.method,["left","right","up","down","exit"])<0){
      console.log("%cmethod的参数只有:left(默认),right,up,down,exit(滑出)","color:red");
      return false;
    }
    var percentReg=/^\d+\.*\d*%$/;
    var NumberReg=/^\d+\.*\d*$/;
    if(NumberReg.test(parseFloat(thisVal.x).toString())===false&&$.inArray(thisVal.x,["left","center","right"])<0){
      console.log("%cx的参数只有:left,center,right(默认),或者数字","color:red");
      return false;
    }
    if(NumberReg.test(parseFloat(thisVal.y).toString())===false&&$.inArray(thisVal.y,["top","middle","bottom"])<0){
      console.log("%cy的参数只有:top(默认),middle,bottom,或者数字","color:red");
      return false;
    }
    var pri={
      "fadeTime":typeof(window.myPage)!=="undefined" ? window.myPage.fadeTime : 0
    };
    if($pageEle.parent().hasClass("slidePageBody")) thisVal.method="exit";
    if(thisVal.method==="exit"){
      $pageEle[0].slidePageCallback=thisVal.callback;
      $pageEle[0].slidePageCallbackArr=thisVal.callbackArr;
      $pageEle.closest(".slidePageBody").find("a.slidePageClose:eq(0)").trigger("click");
      return this.each(function(){});
    }
    var reCss=function(){
      var cs=window.getComputedStyle(thisVal.area[0]);
      var areaInnerWidth=parseFloat(cs["width"])+parseFloat(cs["padding-left"])+parseFloat(cs["padding-right"]);
      var areaInnerHeight=parseFloat(cs["height"])+parseFloat(cs["padding-top"])+parseFloat(cs["padding-bottom"]);
      var areaOuterWidth=areaInnerWidth+parseFloat(cs["border-left-width"])+parseFloat(cs["border-right-width"]);
      var areaOuterHeight=areaInnerHeight+parseFloat(cs["border-top-width"])+parseFloat(cs["border-bottom-width"]);
      //var areaInnerHeight=parseFloat(cs["height"])-parseFloat(cs["border-top-width"])-parseFloat(cs["order-bottom-width"]);
      var reData={
        thisLeft:0,
        thisTop:0,
        thisWidth:thisVal.width==="auto" ? areaInnerWidth : (percentReg.test(thisVal.width) ? parseFloat(thisVal.width)/100*areaInnerWidth : parseFloat(thisVal.width)),
        thisHeight:thisVal.height==="auto" ? areaInnerHeight : (percentReg.test(thisVal.height) ? parseFloat(thisVal.height)/100*areaInnerHeight : parseFloat(thisVal.height)),
        borderRadius:cs["border-radius"]
      };
      if(reData.thisWidth!==areaInnerWidth||reData.thisHeight!==areaInnerHeight){
        var borderRadius=["0","0","0","0"];
        if(reData.thisWidth===areaInnerWidth&&reData.thisHeight!==areaInnerHeight){
          if(thisVal.y==="top"||thisVal.y===0||thisVal.y==="0%"){
            borderRadius[0]=cs["border-top-left-radius"];
            borderRadius[1]=cs["border-top-right-radius"];
          }
          else if(thisVal.y==="bottom"||thisVal.y===100||thisVal.y==="100%"){
            borderRadius[2]=cs["border-bottom-right-radius"];
            borderRadius[3]=cs["border-bottom-left-radius"];
          }
        }
        else if(reData.thisWidth!==areaInnerWidth&&reData.thisHeight===areaInnerHeight){
          if(thisVal.x==="left"||thisVal.x===0||thisVal.x==="0%"){
            borderRadius[0]=cs["border-top-left-radius"];
            borderRadius[3]=cs["border-bottom-left-radius"];
          }
          else if(thisVal.x==="right"||thisVal.x===(areaInnerWidth-reData.thisWidth)){
            borderRadius[1]=cs["border-top-right-radius"];
            borderRadius[2]=cs["border-bottom-right-radius"];
          }
        }
        reData.borderRadius=borderRadius.join(" ");
      }
      var reX=function(_x){
        var xObj={
          "left":thisVal.area.offset().left+parseFloat(cs["border-left"]),
          "center":thisVal.area.offset().left+((areaOuterWidth-reData.thisWidth)/2),
          "right":thisVal.area.offset().left+(areaOuterWidth-reData.thisWidth)-parseFloat(cs["border-left"])
        };
        if(percentReg.test(_x.toString())){//百分比
          return thisVal.area.offset().left+(parseFloat(_x)/100*areaInnerWidth)+parseFloat(cs["border-left"])
        }
        else if(NumberReg.test(parseFloat(_x).toString())){//数字
          return thisVal.area.offset().left+parseFloat(thisVal.area.css("border-left-width"))+parseFloat(_x)+parseFloat(cs["border-left"])
        }
        else{//left/center/right
          return xObj[_x];
        }
      };
      var reY=function(_y){
        var yObj={
          "top":thisVal.area.offset().top+parseFloat(cs["border-top"]),
          "middle":thisVal.area.offset().top+((areaInnerHeight-reData.thisHeight)/2),
          "bottom":thisVal.area.offset().top+Math.max(0,(areaInnerHeight-reData.thisHeight))
        };
        if(percentReg.test(_y.toString())){//百分比
          return thisVal.area.offset().top+(parseFloat(_y)/100*areaInnerHeight);
        }
        else if(NumberReg.test(parseFloat(_y).toString())){//数字
          return thisVal.area.offset().top+parseFloat(thisVal.area.css("border-top-width"))+parseFloat(_y)
        }
        else{//left/center/right
          return yObj[_y];
        }
      };
      reData.thisLeft=reX(thisVal.x);
      reData.thisTop=reY(thisVal.y);
      reData.thisHeight=areaInnerHeight+parseFloat(cs["border-top"])-(reData.thisTop-parseFloat(thisVal.area.offset().top));
      return reData;
    };
    var thisCss=reCss();
    var pageEleOriginalStyle=typeof $pageEle.attr("style")==="undefined" ? '' : $pageEle.attr("style");
    var areaOriginalStyle=typeof thisVal.area.attr("style")==="undefined" ? '' : thisVal.area.attr("style");
    var sizeLinkId=(typeof(thisVal.area.attr("sizeLinkId"))==="undefined"||thisVal.area.attr("sizeLinkId")==="") ? $pageEle.attr("id") : function(){
      var thisSizeLinkIdArr=thisVal.area.attr("sizeLinkId").split(",");
      var thisSizeLinkIdArrTemp=[];
      for(var i=0; i<thisSizeLinkIdArr.length; i++){
        if(thisSizeLinkIdArr[i]!=="") thisSizeLinkIdArrTemp.push(thisSizeLinkIdArr[i]);
      }
      if($.inArray($pageEle.attr("id"),thisSizeLinkIdArrTemp)<0) thisSizeLinkIdArrTemp.push($pageEle.attr("id"));
      return thisSizeLinkIdArrTemp.join(",");
    }();
    var randomId=new Date().getTime();
    var slidePageId="slidePage_"+thisVal.method+"_"+randomId;
    var slidePageControlId="slidePageControl_"+randomId;
    var slidePageBodyId="slidePageBody_"+randomId;
    var newPositionId="newPosition_"+randomId;
    var originalPositionId="originalPosition_"+randomId;
    var slidePageStyle='position:absolute;z-index:100;width:'+thisCss.thisWidth+'px;height:'+thisCss.thisHeight+'px;left:'+thisCss.thisLeft+'px;top:'+thisCss.thisTop+'px;border-radius:'+thisCss.borderRadius+';overflow:hidden;';
    var animateStyle=function(method){
      var reStyle={
        "init":{},//动画开始前
        "finish":{},//动画结束
        "exit":{},//动画退出
        "closeIcon":""
      };
      switch(method){
        case "left" :
          reStyle["init"]={'left':thisCss.thisWidth+'px'};
          reStyle["finish"]={'left':'0px'};
          reStyle["exit"]={'left':thisCss.thisWidth+'px'};
          reStyle["closeIcon"]="iconDoubleAngleRight";
          break;
        case "right":
          reStyle["init"]={'left':(0-thisCss.thisWidth)+'px'};
          reStyle["finish"]={'left':'0px'};
          reStyle["exit"]={'left':(0-thisCss.thisWidth)+'px'};
          reStyle["closeIcon"]="iconDoubleAngleLeft";
          break;
        case "up":
          reStyle["init"]={
            "left":"0px",
            "top":thisCss.thisHeight+'px'
          };
          reStyle["finish"]={"top":'0px'};
          reStyle["exit"]={
            "left":"0px",
            "top":thisCss.thisHeight+'px'
          };
          reStyle["closeIcon"]="iconDoubleAngleDown";
          break;
        case "down":
          reStyle["init"]={
            "left":"0px",
            "top":(0-thisCss.thisHeight)+'px'
          };
          reStyle["finish"]={"top":'0px'};
          reStyle["exit"]={
            "left":"0px",
            "top":(0-thisCss.thisHeight)+'px'
          };
          reStyle["closeIcon"]="iconDoubleAngleUp";
          break;
        default :
          reStyle["init"]={'left':thisCss.thisWidth+'px'};
          reStyle["finish"]={'left':'0px'};
          reStyle["exit"]={'left':thisCss.thisWidth+'px'};
          reStyle["closeIcon"]="";
          break;
      }
      return reStyle;
    };
    var thisAnimateStyle=animateStyle(thisVal.method);
    var closeThisSlide=function(e){
      e.preventDefault();
      if($(this).hasClass("slidePageExit")){
        $(this).closest(".slidePage").find("p.slidePageControl").find("a.slidePageClose").trigger("click");
        return false;
      }
      var $willX=$(this).closest(".slidePage");
      var $pageBody=$(this).closest(".slidePageBody");
      var $originalPosition=$("#originalPosition_"+randomId);
      var $pageEle=$pageBody.children(":eq(1)");
      var originalStyle=$originalPosition.text();
      var sizeLinkIdArr=sizeLinkId.replace($pageEle.attr("id"),"").split(",");
      var sizeLinkIdArrTemp=[];
      for(var i=0; i<sizeLinkIdArr.length; i++){
        if(sizeLinkIdArr[i]!=="") sizeLinkIdArrTemp.push(sizeLinkIdArr[i]);
      }
      sizeLinkId=sizeLinkIdArrTemp.join(",");
      clearInterval(window["fix_slidePage_"+randomId]);
      window.removeEventListener("resize",slidePageResize);
      $pageBody.find("[indicate]").each(function(i,e){
        $("#errorItem"+$(e).attr("indicate")).remove();
      });
      $(this).css("visibility","hidden");
      var resetThis=function(){
        $pageEle.attr("style",originalStyle);
        thisVal.area.attr("style",areaOriginalStyle);
        $originalPosition.replaceWith($pageEle);
        $willX.remove();
        if(typeof($pageEle[0].slidePageCallback)==="function"&&$pageEle[0].slidePageCallbackArr!=="undefined") $pageEle[0].slidePageCallback.apply(this,$pageEle[0].slidePageCallbackArr);
        delete $pageEle[0].slidePageCallback;
        delete $pageEle[0].slidePageCallbackArr;
        if(typeof(elf.iframeResize)!=="undefined") elf.iframeResize();
      };
      if($.fn.smooth){
        $pageBody.smoothStop(true,false).smooth(thisAnimateStyle.exit,pri.fadeTime,resetThis,"easeIn");//先慢后快
      }
      else{
        $pageBody.stop(true,false).animate(thisAnimateStyle.exit,pri.fadeTime,"swing",resetThis);//先慢后快
      }
    };
    var maxHeight=function(idArr){
      var $this;
      var hArr=[];
      for(var i=0; i<idArr.length; i++){
        $this=$("#"+idArr[i]);
        hArr.push(($this.outerHeight()+$this.parent().find(".slidePageControl").outerHeight()));
      }
      return Math.max.apply(this,hArr);
    };
    var fixHeight=function(){
      var slideHeight=maxHeight(thisVal.area.attr("sizeLinkId").split(","));//多个滑层共用一个area时取滑层高度最大值
      slideHeight=Math.max(slideHeight,thisCss.thisHeight);
      $slidePageBody.css("height",slideHeight);
      $("#"+slidePageId).smoothStop(true,false).smooth({"height":slideHeight},pri.fadeTime,false,"Linear");
    };
    var slidePageResize=function(){
      thisCss=reCss();
      slidePageStyle='position:absolute;z-index:100;width:'+thisCss.thisWidth+'px;height:'+thisCss.thisHeight+'px;left:'+thisCss.thisLeft+'px;top:'+thisCss.thisTop+'px;border-radius:'+thisCss.borderRadius+';overflow:hidden;';
      $("#"+slidePageId).attr("style",slidePageStyle);
      $("#"+slidePageBodyId).smoothStop(true,false).smooth({
        "width":thisCss.thisWidth,
        "height":thisCss.thisHeight
      });
    };
    $("div.indicate").remove();
    $body.append('<div class="slidePage"  id="'+slidePageId+'" style="'+slidePageStyle+'"><div id="'+slidePageBodyId+'" class="slidePageBody"'+' style="position:relative;width:'+thisCss.thisWidth+'px;height:'+thisCss.thisHeight+'px"><p id="'+slidePageControlId+'" class="slidePageControl pd5"><a class="slidePageClose" href="#"><i class="'+thisAnimateStyle.closeIcon+' font18"></i>&nbsp;<span style="font-size:0.75rem;vertical-align:middle;">返回</span></a></p><div id="'+newPositionId+'"></div></div></div>');
    $pageEle.after('<div id="'+originalPositionId+'" style="display:none;">'+pageEleOriginalStyle+'</div>');
    $("#"+newPositionId).replaceWith($pageEle);
    var $slidePage=$("#"+slidePageId);
    var $slidePageBody=$("#"+slidePageBodyId);
    var showFinish=function(){
      if($.inArray(thisVal.area[0].tagName.toLowerCase(),["body","article"])>=0&&thisVal.area.offset().top<window.scrollY){
        $("html,body")[$.fn.smooth ? "smooth" : "animate"]({scrollTop:thisVal.area.offset().top},pri.fadeTime);
      }
      if(typeof thisVal.callback==="function") thisVal.callback.call(this,thisVal.callbackArr);
      window["fix_slidePage_"+randomId]=setInterval(fixHeight,500);
    };
    if(typeof thisVal.initFnt==="function") thisVal.initFnt.call(this,thisVal.initFntArr);
    $pageEle.show();
    thisVal.area.attr("sizeLinkId",sizeLinkId);
    if(!$.fn.smooth){
      $slidePageBody.smoothStop(true,false).css(thisAnimateStyle.init).smooth(thisAnimateStyle.finish,pri.fadeTime,showFinish,"easeOut");//先快后慢
    }
    else{
      $slidePageBody.stop(true,false).css(thisAnimateStyle.init).animate(thisAnimateStyle.finish,pri.fadeTime,"swing",showFinish);
    }
    //if(thisVal.area[0].tagName.toUpperCase()!=="BODY") thisVal.area.addClass("blur");
    $slidePage.one("click",".slidePageClose",closeThisSlide);//返回上一页按钮
    $slidePage.one("click",".slidePageExit",closeThisSlide);//.slidePageExit触发返回上一页按钮
    window.removeEventListener("resize",slidePageResize);
    window.addEventListener("resize",slidePageResize);
    return this.each(function(){});
  }
});