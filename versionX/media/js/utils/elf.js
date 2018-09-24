//elf.js为方法库,封装了一些常用方法的并做公共函数公开给其它模块
//作者:白宇
//email:baiyukey@qq.com
window.elf=(function(){
  //var
  var thisProtocol=document.location.protocol||"http:";
  var thisServer=document.location.host;
  var ajaxServer=thisProtocol+'//'+thisServer+'/api';
  var loginErr=0;
  var $document=window.top.location.host===window.location.host ? $(window.top.document) : $(document);
  var val={
    version:function(){return 'byAdmin'+(new Date().getMonth()+1)+new Date().getDate()+Math.ceil((new Date().getHours()+1)/2)},
    animateConvert:3,//iframe转场动画(1:右滑退出左滑进入,2:左右滑动,3:上下滑动,4:渐隐渐出,5:无动画)
    protocol:thisProtocol,
    ajaxServer:ajaxServer,
    ajaxErr:{
      times:0,
      maxTimes:3
    },
    dataDir:window.dataDir||window.top.dataDir,//form mainPage.js
    perms:[0,1,2],//dir_[perms][i//许可访问,关联leftmenu]
    pageRows:6,
    perPageButtonCount:10,
    cssDefault:'default',
    fadeTime:typeof(window.fadeTime)!=="undefined" ? window.fadeTime : 300,
    alertTime:5000//弹窗默认提示时间
  };
  //function
  var loginStatus=function(){
    var isLogin=false;
    $.ajax({
      url:ajaxServer+"/isLogin/",
      timeout:5000,
      data:"csrfmiddlewaretoken="+$.cookie("csrftoken"),
      dataType:"json",
      type:"POST",
      async:false,
      error:function(){
        isLogin=false;
      },
      success:function(data){
        isLogin=data["data"]["status"]===1;
      }
    });
    return isLogin;
  };
  var myAjax=function(url,data,_method,success,_loader,thisAsync,_fromCache){
    if(typeof(window.top.myAjaxCache)==="undefined") window.top.myAjaxCache={};
    var csrftoken="";
    var paramData=typeof(data)!=="string" ? $.param(data) : data;
    var method=_method||"POST";
    var loader=_loader||"show";
    var async=typeof(thisAsync)!=="undefined" ? thisAsync : true;//默认异步
    var ajaxLoaderId="loader"+reRandom();
    if(method==="POST"||method==="PUT"||method==="DELETE"){
      //$.cookie("csrftoken") ? csrftoken = "&csrfmiddlewaretoken=" + $.cookie("csrftoken") : null;
      csrftoken=$.cookie("csrftoken") ? $.cookie("csrftoken") : "";
    }
    var fixMultiLoader=function(){
      if($document.find("i.ajaxLoader").length===0){
        //$("body").find("img.ajaxLoader").remove();
        typeof window.checkLoader!=="undefined" ? clearInterval(window.checkLoader) : null;
      }
      else{
        $document.find("i.ajaxLoader:eq(0)").show().removeClass("hidden").siblings("i.ajaxLoader").addClass("hidden").hide();
      }
    };
    if(loader==="show"){
      //$document.find("i.ajaxLoader").hide();
      $("body").append('<i class="iconSpinner rotate  ajaxLoader" id="'+ajaxLoaderId+'" style="display:none;"></i>');
      $("#"+ajaxLoaderId).elfAlert({
        "mark":false,
        "fadeTime":val.fadeTime,
        "closeBtn":false,
        "animate":0
      });
      fixMultiLoader();
      typeof window.checkLoader!=="undefined" ? window.clearInterval(window.checkLoader) : null;
      window.checkLoader=setInterval(fixMultiLoader,500);
    }
    var beforeSendFnt=function(xhr){
      csrftoken ? xhr.setRequestHeader("X-CSRFToken",csrftoken) : null;
    };
    var fun201=function(){
      var logoutBack=function(){
        if(window.top.location.pathname.replace("/static","")!=="/accounts/login.html"){
          alertInfo("由于账户已退出登录，数据请求被拒绝，即将为您返回登录页面。",function(){
            window.top.location.href="../accounts/login.html"
          });
        }
      };
      //unloadCss();
      //$.removeCookie("cssDir");
      //$.removeCookie("cssDir",{"path":"/"});
      $.removeCookie("username");
      $.removeCookie("username",{"path":"/"});
      $.removeCookie("csrftoken",{"path":"/"});
      $.removeCookie("sessionid",{"path":"/"});
      $.removeCookie("cartLength",{"path":"/"});
      $.removeCookie("currentDomain",{"path":"/"});
      loginErr+=1;
      if(loginErr===1){
        logoutBack();
      }
      else{
        console.log ? console.log("当前账户未登录!") : null;
      }
    };//防止重复提示未登录
    var removeLoader=function(thisId){
      var $thisLoader=$document.find("#"+thisId);
      $thisLoader=$thisLoader.length>0 ? $thisLoader : $("#"+thisId);
      if($thisLoader.length>0) $thisLoader.elfAlertExit();
      setTimeout(function(){$thisLoader.remove()},500);
    };
    var completeFnt=function(_thisData){
      setTimeout(function(){removeLoader(ajaxLoaderId)},0);
      var thisData=$.extend({
        message:_thisData&&_thisData["responseJSON"]&&_thisData["responseJSON"]["message"] ? _thisData["responseJSON"]["message"] : "未知错误",
        return_code:_thisData&&_thisData["responseJSON"]&&_thisData["responseJSON"]["return_code"] ? parseInt(_thisData["responseJSON"]["return_code"]) : parseInt(_thisData.status)
      },_thisData);
      switch(thisData.return_code){
        case 404 :
          thisData.message='接口地址不存在.';
          break;
        case 500 :
          thisData.message='程序跑偏了.';
          break;
        default :
          break;
      }
      if($.inArray(thisData.return_code,[1,14,15,21,127,200,201])<0){
        var emailData={
          //cc:"baiyukey@hotmail.com",//抄送
          subject:'#异常反馈:'+window.location.host+'存在问题,'+window.document.title+'_'+thisData.message+'(#'+thisData.return_code+')',
          body:window.encodeURI("FormData="+JSON.stringify(data)+"\n\n"+"data="+thisData.responseText.substr(0,1000))
        };
        var thisReport='<b>'+thisData.message+'(#'+thisData.return_code+')</b><a class="mgl3" target="_blank" href="mailto:baiyukey@gmail.com?'+$.param(emailData)+'" style="text-decoration:none;">点此发送反馈邮件</a>';
        alertInfo(thisReport,null,'',60000);
      }
    };
    var ajaxErr=function(){
      val.ajaxErr.times=val.ajaxErr.times===val.ajaxErr.maxTimes ? 1 : val.ajaxErr.times+1;
      console.log ? console.log('%c网络连接失败！','color:#FF0000;font-size:'+val.ajaxErr.times+'em') : null;
    };
    var ajaxed=function(data){
      //$document.find("#loader").elfAlertExit();
      //$document.find("#"+ajaxLoaderId).elfAlertExit();
      switch(data.return_code){
        case 1:
          setCache(data);
          success.call(this,data);
          break;
        case 14 :
          alertInfo(data["message"],function(){
            $("#loaderForScan").elfAlertExit()
          });
          break;
        case 15 :
          alertInfo(data["message"],function(){
            $("#loaderForScan").elfAlertExit()
          });
          break;
        case 21 :
          setCache(data);
          success.call(this,data);
          break;
        case 201 :
          fun201();
          break;
        case 127 :
          alertInfo(data["msg"],function(){
            $('#payButton').hide().removeAttr("href");
            $("#deadlinePrice").text("--");
            $("#totalPrice").text("--");
          });//购买接口验证错误*/
          break;
        default:
          break;
      }
    };
    var getCache=function(){
      var fromCache=typeof(_fromCache)!=="undefined" ? _fromCache : false;
      var thisKey=url.replace(/\//g,"_")+paramData+val.version();
      if(typeof(window.top.myAjaxCache[thisKey])!=="undefined"&&fromCache===true){
        return window.top.myAjaxCache[thisKey];
      }
      else{
        return null;
      }
    };
    var setCache=function(thisData){
      window.top.myAjaxCache[url.replace(/\//g,"_")+paramData+val.version()]=thisData;
    };
    var thisCache=getCache();
    if(thisCache!==null){
      ajaxed(thisCache);
      removeLoader(ajaxLoaderId);
    }
    else{
      $.ajax({
        beforeSend:beforeSendFnt,
        url:ajaxServer+url,
        data:data,
        type:method,
        dataType:"json",
        timeout:62000,
        async:async,
        error:ajaxErr,
        success:ajaxed,
        complete:completeFnt
      });
    }
  };
  var reRandom=function(i){
    i=i||100000;
    return (Math.random()*i).toFixed(0);
  };
  var selectOne=function(arr){return arr[Math.abs(Math.floor(Math.random()*arr.length-0.0000000000000001))]};
  var alertInfo=function(str,callback,callbackArr,alertTime){
    alertTime=(alertTime) ? alertTime : val.alertTime;
    callbackArr=(callbackArr) ? callbackArr : "";
    var $Document=$(window.top.document);
    var fadeTime=val.fadeTime;
    var subtractTime=100;
    var id=new Date().getTime();
    var thisId="alertWin"+id;
    var thisCloseBtn="alertInfoBtn"+id;
    var tempInputId="tempInput"+id;
    var alertHtml='<div id="'+thisId+'" class="alert" style="width:380px;display:none;"><div class="alertTitle"><p>请注意！</p></div><div class="alertContent font12"><p class="pd20">'+str+'</p><form class="alertButtonBox hidden" '+(alertTime<2000 ? 'style="display:none;"' : '')+'><a class="button submit" id="'+thisCloseBtn+'" href="#" style="width:8em;"><span>'+(alertTime/1000).toFixed(0)+'秒后返回</span></a><input type="text" id="'+tempInputId+'" style="width:1px; height:0;padding:0;border:none;font-size:0;"></form></div></div>';
    
    function closeButtonChange(){
      if(alertTime===0){
        closeAlertInfo();
      }
      else if(alertTime>=10000){
        $Document.find("#"+thisCloseBtn).closest("form").removeClass("hidden");
        $Document.find("#"+thisCloseBtn+" span").html("返&nbsp;&nbsp;回");
      }
      else if(alertTime>1000&&alertTime<10000){
        $Document.find("#"+thisCloseBtn).closest("form").removeClass("hidden");
        $Document.find("#"+thisCloseBtn+" span").html((alertTime*0.001).toFixed(0)+"秒后返回");
      }
      else{
        $Document.find("#"+thisCloseBtn).removeClass("submit").closest("form").addClass("hidden");
      }
      alertTime-=subtractTime;
    }
    
    function closeAlertInfo(event){
      event ? event.preventDefault() : null;
      clearInterval(alertInfoInterval);
      $Document.find("#"+thisCloseBtn).removeClass("submit");
      //clearTimeout(alertTimeout);
      var closeCallback=function(){
        $Document.find("#"+thisId).remove();
        $document.find("#leftFlagBg").smooth({"opacity":"1"},fadeTime);
      };
      $Document.find("#"+thisId).elfAlertExit({"callback":closeCallback});
      typeof callback==="function" ? callback.call(this,callbackArr) : null;
    }
    
    $document.find("#leftFlagBg").smooth({"opacity":"0.1"},fadeTime);
    //$Document.find("body").append(alertHtml);
    $Document.find("body").append(alertHtml);
    $Document.find("#"+thisId).elfAlert({"fadeTime":fadeTime});
    $Document.find("#"+tempInputId).focus();
    $Document.find("#"+thisCloseBtn).on("click",this,closeAlertInfo);
    closeButtonChange();
    //var alertTimeout = setTimeout(closeAlertInfo, alertTime);
    var alertInfoInterval=setInterval(closeButtonChange,subtractTime);
    setTimeout(function(){
      var $thisId=$("#"+thisId);
      $Document.find("#"+thisId) ? $Document.find("#"+thisId).elfAlertExit().remove() : null;
      $thisId ? $thisId.elfAlertExit().remove() : null;
    },(alertTime+fadeTime+100));//加个保险
  };//替代alert(str)
  function confirmAlert(fntName,_fntKey,_confirmCont,_confirmButtonText,_width,_dangerLevel){
    var $document=$(window.top.document);
    var fntKey=_fntKey||[];
    var confirmCont=_confirmCont||'<p class="pd20 font12">您确认该操作吗？</p>';
    var confirmButtonText=_confirmButtonText||"确  定";
    var width=_width||500;
    var dangerLevel=typeof(_dangerLevel)==="undefined" ? 0 : Number(_dangerLevel);
    var dangerLevelData={
      0:{
        markColor:"#000",
        markOpacity:0.15,
        hasCheckbox:false
      },
      1:{
        markColor:"#994449",
        markOpacity:0.15,
        hasCheckbox:true
      },
      2:{
        markColor:"#994449",
        markOpacity:0.2,
        hasCheckbox:false
      },
      3:{
        markColor:"#994449",
        markOpacity:0.2,
        hasCheckbox:true
      }
    }[dangerLevel];
    var id=new Date().getTime();
    var confirmId="confirm"+id;
    var confirmContId="confirmCont"+id;
    var confirmSubmitId="confirmSubmit"+id;
    var confirmCancelId="confirmCancel"+id;
    var tempInputId="tempInput"+id;
    var hasConfirmDiv=function(){
      $document.find("#"+confirmId).width(width).find("div.alertCont").removeAttr("style").end().find(".checkSubmit").removeClass("displayNone,displayIB").addClass(dangerLevelData.hasCheckbox ? "displayNone" : "displayIB").end().find(confirmSubmitId).removeClass("disable").addClass(dangerLevelData.hasCheckbox ? "disable" : "").find("span").html('&nbsp;&nbsp;&nbsp;&nbsp;'+confirmButtonText+'&nbsp;&nbsp;&nbsp;&nbsp;');
      $document.find("#"+confirmContId).html(confirmCont);
    };
    var noConfirmDiv=function(){
      $document.find("body").append('<div id="'+confirmId+'" class="alert" style="width:'+width+'px; display:none;"><div class="alertTit"><p>请注意！</p></div><div class="alertCont"><div id="'+confirmContId+'">'+confirmCont+'</div><form class="alertButtonBox"><p class="'+(dangerLevelData.hasCheckbox ? "displayIB" : "displayNone")+' pd0020 mgb16 center checkSubmit" style="border:1px solid transparent;position:relative;top:-8px;"><a class="font12 checkbox"><span>我已阅读</span></a></p><p><a class="'+(dangerLevelData.hasCheckbox ? "disable" : "")+' button submit" id="'+confirmSubmitId+'" href="#"><span>&nbsp;&nbsp;&nbsp;&nbsp;'+confirmButtonText+'&nbsp;&nbsp;&nbsp;&nbsp;</span></a>&nbsp;&nbsp;&nbsp;&nbsp;<a class="button cancel" id="'+confirmCancelId+'" href="#"><span class="contrast">&nbsp;&nbsp;&nbsp;&nbsp;取  消&nbsp;&nbsp;&nbsp;&nbsp;</span></a><input type="text" id="'+tempInputId+'" style="width:1px; height:0;padding:0;border:none;font-size:0;"></p></form></div></div>');
    };
    $document.find("#"+confirmId).length>0 ? hasConfirmDiv() : noConfirmDiv();
    var alertSuccess=function(){
      if(dangerLevel>=2) $document.find("#"+confirmId).removeClass("dangerShadow").addClass("dangerShadow");
      $document.find("#"+tempInputId).focus();
      $document.find("#leftFlagBg").smooth({"opacity":"0.1"},val.fadeTime*2);
      var thisCloseId=$document.find("#"+confirmId).closest("div.showPanel").find("a.byAlertClose").attr("id");
      var clearConfirmPanel=function(_confirmId){
        var $confirm=$document.find("#"+_confirmId);
        if(typeof $confirm[0]["waitClearOther"]!=="undefined") clearTimeout($confirm[0]["waitClearOther"]);
        $confirm[0]["waitClearOther"]=setTimeout(function(){
          $confirm.remove();
          if($document.find(".bodyMark").length===0) $document.find("#leftFlagBg").css({"opacity":"1"});
        },val.fadeTime*2+200);
      };
      if(dangerLevelData.hasCheckbox) $document.find("#"+confirmId).find(".checkSubmit").off("click").on("click",".checkbox",function(){
        var $this=$(this);
        var runThis=function(){
          if($this.hasClass("select")){
            $document.find("#"+confirmSubmitId).removeClass("disable");
          }
          else{
            $document.find("#"+confirmSubmitId).addClass("disable");
          }
        };
        setTimeout(runThis,50);
      });
      $document.on("click",("#"+confirmSubmitId),function(event){
        event.preventDefault();
        if($(this).hasClass("disable")){
          $document.find("#"+confirmId).find(".checkSubmit").inputErr("需要先勾选此项!");
          return false;
        }
        $document.find("#"+confirmSubmitId).removeClass("submit");
        fntName.call(this,fntKey);
        $document.find("#"+confirmId).byAlertExit();
        clearConfirmPanel(confirmId);
      });
      $document.on("click","#"+thisCloseId,function(event){
        event.preventDefault();
        $document.find("#"+confirmSubmitId).removeClass("submit");
        clearConfirmPanel(confirmId);
        $document.find(".indicate").remove();
      });
      $document.on("click",("#"+confirmCancelId),function(event){
        event.preventDefault();
        $document.find("#"+confirmSubmitId).removeClass("submit");
        clearConfirmPanel(confirmId);
        $document.find(".indicate").remove();
      });
    };
    $document.find("#"+confirmId).byAlert({
      "fadeTime":val.fadeTime,
      "markColor":dangerLevelData.markColor,
      "markOpacity":dangerLevelData.markOpacity,
      "callback":alertSuccess
    });
  }//替代confirm(),fntName是函数名,fntKey是函数参数，confirmCont是确认信息内容!!!!!!!!!!!!!!!!!!极简方式建议使用$(ele).confirm(callback);
  var request=function(paras){
    var url=window.location.href;
    var paraString=url.substring(url.indexOf("?")+1,url.length).split("&");
    var paraObj={};
    var i,
      j;
    for(i=0; j=paraString[i]; i++){
      paraObj[j.substring(0,j.indexOf("=")).toLowerCase()]=j.substring(j.indexOf("=")+1,j.length);
    }
    var returnValue=paraObj[paras.toLowerCase()];
    if(typeof(returnValue)==="undefined"){
      return "";
    }
    else{
      return returnValue;
    }
  };//获取URL传递变量
  var resetForm=function(id){
    document.getElementById(id) ? document.getElementById(id).reset() : window.top.document.getElementById(id).reset();
  };//清空form表单
  var inputErr=function(_$thisInput,errInfo,timeout){
    var runThis=function(){
      var $thisInput=_$thisInput;
      if($thisInput.attr("type")==="file") $thisInput=_$thisInput.parent();
      if(typeof($thisInput.attr("baseStyle"))!=="undefined"){
        $thisInput.attr('style',$thisInput.attr("baseStyle"));
      }
      else{
        $thisInput.attr('baseStyle',$thisInput.attr("style")||"");
      }
      if(typeof($thisInput.attr("indicate"))!=="undefined"){
        $("#errorIndicate"+$thisInput.attr("indicate")).remove();
        $thisInput.removeAttr("indicate");
        setTimeout(function(){
          elf.iframeResize();
        },500);
      }
      //$("#errorIndicate"+$thisInput.attr("indicate")).remove();
      var i=reRandom();
      var thisInfo=(typeof errInfo==="undefined"||errInfo===null||errInfo==="") ? $thisInput.attr('data-msg')||'输入错误' : errInfo;
      var animateRepeat=6;
      var animateTime=val.fadeTime*1.5/animateRepeat;
      $thisInput.attr("indicate",i);
      $("body").append('<div class="indicate displayNone" id="errorIndicate'+i+'"></div>');
      var $thisErrorItem=$("#errorIndicate"+i);
      $thisErrorItem.text(thisInfo.replace(/\d+:/,""));
      //setTimeout(function(){
      $thisErrorItem.smoothStop(true,true).css({
        "position":"absolute",
        "left":$thisInput.offset().left,
        "top":$thisInput.offset().top+$thisInput.outerHeight(),
        "width":$thisInput.outerWidth(),
        "opacity":0,
        "z-index":999999
      }).show().smoothIn(animateTime*animateRepeat);
      var thisML=parseInt($thisInput.css("margin-left"));
      //},451);
      var shakeOver=function(){
        $thisInput.attr("style",$thisInput.attr("baseStyle"));
        //$thisInput.removeAttr("baseStyle");
        $("[indicate]").eq(0).focus();
        var clearIndicate=function(){
          var $thisIndicate=$("#errorIndicate"+$thisInput.attr("indicate"));
          $thisIndicate.smoothOut(animateTime*animateRepeat);
          setTimeout(function(){
            $(".indicate").each(function(i,e){
              //$(e).css({"top":$(e).offset().top-16});
              setTimeout(function(){
                var $errorIndicate=$("[indicate="+$(e).attr("id").replace("errorIndicate","")+"]");
                if($errorIndicate.length!==0) $(e).css({"top":$errorIndicate.offset().top+$errorIndicate.outerHeight()});
              },i*animateTime);
            });
            $thisIndicate.remove();
            $thisInput.removeAttr("indicate");
            $thisInput.removeAttr("baseStyle");
            elf.iframeResize();
          },animateTime*animateRepeat+100);
        };
        if($.inArray($thisInput[0].tagName.toUpperCase(),["INPUT","TEXTAREA"]).length>=0){
          $thisInput.off("keyup",this,clearIndicate);
          $thisInput.one("keyup",this,clearIndicate);
        }
        else{
          $thisInput.off("click",this,clearIndicate);
          $thisInput.one("click",this,clearIndicate);
        }
        elf.iframeResize();
      };
      $thisInput.smoothStop(true,true).smooth({"margin-left":(thisML+5)},animateTime,false,"Linear").smooth({"margin-left":thisML},animateTime,false,"Linear").smooth({"margin-left":(thisML+5)},animateTime,false,"Linear").smooth({"margin-left":thisML},animateTime,false,"Linear").smooth({"margin-left":(thisML+5)},animateTime,false,"Linear").smooth({"margin-left":thisML},animateTime,shakeOver,"Linear");
      //$thisInput.on("mouselea",this,function(event){$("#errorIndicate"+$thisInput.attr("indicate")).smoothOut();});
    };
    typeof(timeout)==="undefined" ? runThis() : setTimeout(runThis,timeout);
  };
  var inputErrReset=function(){
    var $indicates=$(".indicate");
    if($("[indicate]").length===0){
      $indicates.remove();
    }
    $indicates.each(function(i,e){
      var $errorIndicate=$("[indicate="+$(e).attr("id").replace("errorIndicate","")+"]");
      if($errorIndicate.length!==0){
        $(e).css({"top":$errorIndicate.offset().top+$errorIndicate.outerHeight()});
      }
      else{
        $(e).remove();
      }
    })
  };
  var validator={
    Require:/.+/,
    Email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    Phone:/^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/,
    Mobile:/^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/,
    Url:/^(http|https):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"]){0,6000}$/,//第一个点后最长6000
    UnChinese:/^[^\u4e00-\u9fa5](\s*[^\u4e00-\u9fa5])*$/,//不允许汉字，中间允许空格
    Path:/^\/[A-Za-z0-9\_\-]{0,255}[\/A-Za-z0-9\_\-]{0,255}$/,
    Referer:/^http:\/\/[A-Za-z0-9][\.A-Za-z0-9]{3,1024}[^\.\/]$/,
    UserAgent:/^[A-Za-z0-9\/\_\-]{1,1024}$/,
    IdCard:/^\d{15}(\d{2}[A-Za-z0-9])?$/,
    Currency:/^\d+(\.\d+)?$/,
    Number:/^\d+$/,
    Zip:/^[1-9]\d{5}$/,
    QQ:/^[1-9]\d{4,9}$/,
    Integer:/^[-\+]?\d+$/,
    Double:/^[-\+]?\d+(\.\d+)?$/,
    English:/^[A-Za-z]+$/,
    Chinese:/^[\u0391-\uFFE5\s]+$/,
    UnSafe:/^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
    Captcha:/^[a-z\d]{6}$/,
    Ip:/^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-4])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-4])){3}$/,
    Domain:/^([a-zA-Z0-9\u4E00-\u9FA5][-a-zA-Z0-9\u4E00-\u9FA5]{0,62}(\.))+((com)|(net)|(org)|(gov\.cn)|(info)|(cc)|(com\.cn)|(net\.cn)|(org\.cn)|(biz)|(tv)|(cn)|(mobi)|(name)|(sh)|(ac)|(io)|(tw)|(com\.tw)|(hk)|(com\.hk)|(ws)|(travel)|(us)|(tm)|(la)|(me)|(me\.uk)|(org\.uk)|(ltd\.uk)|(plc\.uk)|(in)|(eu)|(it)|(jp)|(so)|(asia)|(co)|(tel)|(cm)|(\u4e2d\u56fd))$/,
    HostName:/(^[a-zA-Z0-9][-a-zA-Z0-9]{0,49}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,49})*$)|(^@$)|(^\*$)|(^\*\.[a-zA-Z0-9][-a-zA-Z0-9]{0,49}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,49})*$)/,
    IsSafe:function(str){return !this.UnSafe.test(str)},
    SafeString:"this.IsSafe(value)",
    Limit:"this.limit(value.length,getAttribute('min'),  getAttribute('max'))",
    LimitB:"this.limit(this.LenB(value), getAttribute('min'), getAttribute('max'))",
    Date:"this.IsDate(value, getAttribute('min'), getAttribute('format'))",//Repeat : "value === document.getElementsByName(getAttribute('to'))[0].value",
    Repeat:"value === document.getElementById(getAttribute('to')).value",
    Range:"parseInt(getAttribute('min')) <= value && value <= parseInt(getAttribute('max'))",
    Compare:"this.compare(value,getAttribute('operator'),getAttribute('to'))",
    Custom:"this.Exec(value, getAttribute('regexp'))",
    Group:"this.MustChecked(getAttribute('name'), getAttribute('min'), getAttribute('max'))",
    UserName:"this.IsUserName(value)",
    DomainIp:"this.IsDomainIp(value)",
    FilterIp:"this.IsFilterIp(value)",
    ErrorItem:[document.forms[0]],
    ErrorMessage:["以下原因导致提交失败：\t\t\t\t"],
    validate:function($thisForm,mode){
      var i,
        ii;
      var obj=$thisForm[0]||$("body");//$thisForm[0] jquery元素转js元素
      //var count=obj.elements.length;//只计算input，textarea，select等组件
      var $thisData=$(obj).find("[datatype]");
      var count=$thisData.length;//只计算.datatype
      this.ErrorMessage.length=1;
      var defaultMsg="";
      this.ErrorItem.length=1;
      this.ErrorItem[0]=obj;
      $("div.indicate").remove();
      var _dataType,
        _disabled,
        value;
      for(i=0; i<count; i++){
        with($thisData[i]){
          _dataType=getAttribute("datatype");
          _disabled=getAttribute("disabled");
          if($thisData.eq(i).hasClass("downList")){
            value=$thisData.eq(i).getValue().value;
          }//下拉菜单
          else if($thisData.eq(i).hasClass("radioGroup")){
            value=$thisData.eq(i).find("a.radio.select").length>0 ? $thisData.eq(i).find("a.radio.select")[0].getAttribute("data-value") : ""
          }//单选组
          else if($thisData.eq(i).hasClass("checkboxGroup")){
            var min=parseInt(getAttribute("min"))||0;
            var max=parseInt(getAttribute("max"))||$thisData.eq(i).find("a.checkbox").length;
            var reData=[];
            $thisData.eq(i).find("a.checkbox").each(function(i,thisCheckbox){
              if($(thisCheckbox).hasClass("select")){
                reData.push(thisCheckbox.getAttribute("data-value"));
              }
            });
            value=reData.length>=min&&reData.length<=max ? reData : "";
          }//多选组
          if(_disabled==="disabled"|| typeof(_dataType)==="object"|| typeof(this[_dataType])==="undefined"|| !$thisData.eq(i).is(":visible")) continue;
          if(!getAttribute("require")&&value==="") continue;
          if(getAttribute("require")==="false"&&value==="") continue;
          this.ClearState($thisData.eq(i)[0]);
          switch(_dataType){
            case "Date" :
            case "Repeat" :
            case "Range" :
            case "Compare" :
            case "Custom" :
            case "Group" :
            case "Limit" :
            case "LimitB" :
            case "SafeString" :
            case "UserName" :
            case "DomainIp":
            case "FilterIp":
              //this[_dataType]是字符串
              if(typeof(value)!=="object"){
                if(!eval(this[_dataType])){
                  defaultMsg=value==="" ? "不能为空！" : "数值错误！";
                  this.AddError(i,getAttribute("data-msg")||defaultMsg);
                }
              }
              else{
                var valueCopy=value;
                for(ii=0; ii<valueCopy.length; ii++){
                  value=valueCopy[ii];
                  if(!eval(this[_dataType])){
                    defaultMsg=value==="" ? "不能为空！" : "数值错误！";
                    this.AddError(i,getAttribute("data-msg")||defaultMsg);
                    break;
                  }
                }
                value=valueCopy;
              }//value的object类型只有数组
              break;
            default ://this[_dataType]是正则
              defaultMsg="";
              if(typeof(value)!=="object"){
                if(!this[_dataType].test(value)){
                  defaultMsg=value==="" ? "不能为空！" : "数值错误！";
                  this.AddError(i,getAttribute("data-msg")||defaultMsg);
                }
              }
              else{
                for(ii=0; ii<value.length; ii++){
                  if(!this[_dataType].test(value[ii])){
                    defaultMsg=value==="" ? "不能为空！" : "数值错误！";
                    this.AddError(i,getAttribute("data-msg")||defaultMsg);
                    break;
                  }
                }
              }
              break;
          }
        }
      }
      if(this.ErrorMessage.length>1){
        mode=mode||1;
        var errCount=this.ErrorItem.length;
        switch(mode){
          case 2 :
            for(i=1; i<=errCount; i++){
              this.ErrorItem[i].style.color="red";
              console.log(this.ErrorItem[i]);
            }
            break;
          case 1 :
            alert(this.ErrorMessage.join("\n"));
            this.ErrorItem[1].focus();
            break;
          case 3 :
            i=1;
            var thisErrorItem=this.ErrorItem;
            var thisErrorMessage=this.ErrorMessage;
            var showErr=function(){
              if(i<errCount){
                function runThis(){
                  inputErr($(thisErrorItem[i]),thisErrorMessage[i]);
                  i+=1;
                  showErr();
                }
                
                i===1 ? setTimeout(runThis,0) : setTimeout(runThis,500);
              }
            };
            showErr();
            break;
          default :
            alert(this.ErrorMessage.join("\n"));
            break;
        }
        return false;
      }
      else{
        //$(".indicate").remove();
      }
      return true;
    },
    limit:function(len,min,max){
      min=min||0;
      max=max||Number.MAX_VALUE;
      return min<=len&&len<=max;
    },
    LenB:function(str){//一个汉字或全角占2个字符
      return str.replace(/[^\x00-\xff]/g,"**").length;
    },
    ClearState:function(elem){
      with(elem){
        $(elem).parent().next("span.cl1").html("");
        if(style.color==="red") style.color="";
        var lastNode=parentNode.childNodes[parentNode.childNodes.length-1];
        if(lastNode.id==="__ErrorMessagePanel") parentNode.removeChild(lastNode);
      }
    },
    AddError:function(index,str){
      this.ErrorItem[this.ErrorItem.length]=$(this.ErrorItem).find("[datatype]:eq("+index+")");//this.ErrorItem[0].elements[index];
      this.ErrorMessage[this.ErrorMessage.length]=this.ErrorMessage.length+":"+str;
    },
    Exec:function(op,reg){
      return (new RegExp(reg.replace(/(^\/)|(\/$)/g,""),"g").test(op));
    },
    compare:function(_op1,operator,_op2){
      var op1=Number(_op1),
        op2=Number(_op2);
      switch(operator){
        case "NotEqual":
          return (op1!==op2);
        case "GreaterThan":
          return (op1>op2);
        case "GreaterThanEqual":
          return (op1>=op2);
        case "LessThan":
          return (op1<op2);
        case "LessThanEqual":
          return (op1<=op2);
        default:
          return (op1===op2);
      }
    },
    MustChecked:function(name,_min,_max){
      var groups=document.getElementsByName(name);
      var hasChecked=0;
      var min=Number(_min)||1;
      var max=Number(_max)||groups.length;
      for(var i=groups.length-1; i>=0; i--) if(groups[i].checked) hasChecked++;
      return (min<=hasChecked&&hasChecked<=max);
    },
    IsDate:function(op,min,_formatString){
      var formatString=_formatString||"ymd";
      var GetFullYear=function(y){return ((y<30 ? "20" : "19")+y)|0;};
      var m,
        year,
        month,
        day;
      switch(formatString){
        case "ymd" :
          m=op.match(new RegExp("^((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})$"));
          if(m===null) return false;
          day=m[6];
          month=m[5]--;
          year=(m[2].length===4) ? m[2] : GetFullYear(parseInt(m[3],10));
          break;
        case "dmy" :
          m=op.match(new RegExp("^(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))$"));
          if(m===null) return false;
          day=m[1];
          month=m[3]--;
          year=(m[5].length===4) ? m[5] : GetFullYear(parseInt(m[6],10));
          break;
        default :
          break;
      }
      if(!parseInt(month)) return false;
      month=month===12 ? 0 : month;
      var date=new Date(year,month,day);
      return (typeof(date)==="object"&&year===date.getFullYear()&&month===date.getMonth()&&day===date.getDate());
    },
    IsUserName:function(value){
      return this.Email.test(value)||this.Mobile.test(value);
    },
    IsDomainIp:function(value){
      var reSpaceCheck=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
      var forbid=["0.0.0.0","255.255.255.255"];
      for(var i=0; i<forbid.length; i++){
        if(value===forbid[i]){
          return false;
        }
      }
      if(reSpaceCheck.test(value)&&validator.Ip.test(value)){
        value.match(reSpaceCheck);
        if(RegExp.$1<=255&&RegExp.$1>=0&&RegExp.$2<=255&&RegExp.$2>=0&&RegExp.$3<=255&&RegExp.$3>=0&&RegExp.$4<=255&&RegExp.$4>=0){
          if(RegExp.$1===0||RegExp.$4===0||RegExp.$4===255){//所有开头为0或所有末尾为0或末尾为255的ip地址：0.X.X.X、X.X.X.0、X.X.X.255
            return false;
          }
          else if(RegExp.$1===10&&RegExp.$2>=0&&RegExp.$2<=255&&RegExp.$3>=0&&RegExp.$3<=255&&RegExp.$4>=0&&RegExp.$4<=255){//10.0.0.0~10.255.255.255
            return false;
          }
          else if(RegExp.$1===172&&RegExp.$2>=16&&RegExp.$2<=31&&RegExp.$3>=0&&RegExp.$3<=255&&RegExp.$4>=0&&RegExp.$4<=255){//172.16.0.0~172.31.255.255
            return false;
          }
          else if(RegExp.$1===192&&RegExp.$2===168&&RegExp.$3>=0&&RegExp.$3<=255&&RegExp.$4>=0&&RegExp.$4<=255){//192.168.0.0~192.168.255.255
            return false;
          }
          else if(RegExp.$1===127&&RegExp.$2>=0&&RegExp.$2<=255&&RegExp.$3>=0&&RegExp.$3<=255&&RegExp.$4>=0&&RegExp.$4<=255){//127.0.0.0~127.255.255.255
            return false;
          }
          else if(RegExp.$1>=224&&RegExp.$1<=240&&RegExp.$2>=0&&RegExp.$2<=255&&RegExp.$3>=0&&RegExp.$3<=255&&RegExp.$4>=0&&RegExp.$4<=255){//224.0.0.0--240.255.255.255
            return false;
          }
          else if(RegExp.$1===255&&RegExp.$2>=0&&RegExp.$2<=255&&RegExp.$3>=0&&RegExp.$3<=255&&RegExp.$4>=0&&RegExp.$4<=255){//255.0.0.0--255.255.255.255
            return false;
          }
          else if(RegExp.$1===255&&RegExp.$2===255&&RegExp.$3>=0&&RegExp.$3<=255&&RegExp.$4>=0&&RegExp.$4<=255){//255.255.0.0--255.255.255.255
            return false;
          }
          else if(RegExp.$1===255&&RegExp.$2===255&&RegExp.$3===255&&RegExp.$4>=0&&RegExp.$4<=255){//255.255.255.0--255.255.255.255
            return false;
          }
          else{
            return true;
          }
        }
        else{
          return false;
        }
      }
      else{
        return false;
      }
    },
    IsFilterIp:function(value){
      function checkThree(value){
        var reSpaceCheck=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        var forbid=["0.0.0.0","255.255.255.255"];
        for(var i=0; i<forbid.length; i++){
          if(value===forbid[i]){
            return false;
          }
        }
        if(reSpaceCheck.test(value)){
          value.match(reSpaceCheck);
          if(RegExp.$1<=255&&RegExp.$1>=0&&RegExp.$2<=255&&RegExp.$2>=0&&RegExp.$3<=255&&RegExp.$3>=0&&RegExp.$4<=255&&RegExp.$4>=0){
            if(RegExp.$1===0){//所有开头为0或所有末尾为0或末尾为255的ip地址：0.X.X.X、X.X.X.0、X.X.X.255
              return false;
            }
            else if(RegExp.$1===127){//127.0.0.0~127.255.255.255
              return false;
            }
            else if(RegExp.$1>=224){//224.0.0.0--255.255.255.255
              return false;
            }
            else{
              return true;
            }
          }
          else{
            return false;
          }
        }
        else{
          return false;
        }
      }
      
      var val=value.split(".");
      if(val.length!==4) return false;
      var valLast=val[3].split("/");
      if(valLast.length===1&&valLast[0]!==0){
        if(valLast[0]<=255||valLast[0]>=1||/^[0-9]*$/.test(valLast[0])){
          eval(null)
        }
        else{
          return false;
        }
        return checkThree(value);//暂时合法
      }//无/号
      else if(valLast.length===2&&valLast[1]>=1&&valLast[1]<=32){
        var newValue=value.substr(0,value.indexOf("/"));
        if(valLast[0]===0&&valLast[1]===32) return false;
        if(valLast[0]<=255||valLast[0]>=1||/^[0-9]*$/.test(valLast[0])){
          eval(null);
        }
        else{
          return false;
        }
        return checkThree(newValue);//暂时合法
      }//有/号
      else{
        return false;
      }
    }
  };//验证,仅支持form
  var cutStr=function(str,len){
    var realLong=0;
    var cutLong=0;
    for(var i=0; i<str.length; i++){
      realLong+=/^[\u4e00-\u9fa5]$/.test(str[i]) ? 2 : 1;
      cutLong+=realLong<=len ? 1 : 0;
    }
    return realLong>len ? (str.substr(0,cutLong)+'...') : str;
    //3个点占用一个字符
  };//截取字符串，一个中文占2个字节。
  var cutInsert=function(thisStr,n,insert){
    var thisString="_"+thisStr;
    var newData="";
    for(var i=thisString.toString().length; i>0; i-=n){
      i<=n ? newData=thisString.substring(0,i)+newData : newData=insert+thisString.substring(i-n,i)+newData;
    }
    newData=newData.substr(1);
    newData.substr(0,1)==="," ? newData=newData.substr(1) : null;
    return newData.toString();
  };//thisStr:字符串，n:间隔字符数，insert:要插入的字符
  var cutData=function(data,pageCurr,perLength){
    perLength=perLength||val.pageRows;
    var pageCount=Math.ceil(data.length/perLength);
    var pageData=[];
    var minI=(pageCurr-1)*perLength;
    var maxI=minI+perLength;
    maxI>data.length ? maxI=data.length : null;
    var returnData={
      "pageCurr":pageCurr,
      "pageCount":pageCount||1,
      "pageData":[]
    };
    for(var i=minI; i<maxI; i++){
      data[i] ? pageData.push(data[i]) : null;
    }
    returnData.pageData=pageData;
    return returnData;
  };//数组，当前页数,每页条数
  var filterData=function(data,thisKey,thisValue){
    var returnData=[];
    for(var i=0; i<data.length; i++){
      if(typeof(data[i][thisKey])==="object"){
        if(Object.prototype.toString.call(data[i][thisKey])==='[object Array]') data[i][thisKey].sort();
        if(Object.prototype.toString.call(thisValue)==='[object Array]') thisValue.sort();
        if(JSON.stringify(data[i][thisKey])===JSON.stringify(thisValue)) returnData.push(data[i]);
      }
      else{
        if(data[i][thisKey].toString()===thisValue.toString()) returnData.push(data[i]);
      }
    }
    return returnData;
  };//arr=[{id:0,value:[2,3,4,5,1]},{id:1,value:333},{id:2,value:{a:1,b:2}}] 例如：filterData(arr,"value",[1,2,3,4,5])
  var deleteKey=function(data,thisKey,thisValue){
    var returnData=[];
    for(var i=0; i<data.length; i++){
      if(typeof(data[i][thisKey])==="object"){
        if(Object.prototype.toString.call(data[i][thisKey])==='[object Array]') data[i][thisKey].sort();
        if(Object.prototype.toString.call(thisValue)==='[object Array]') thisValue.sort();
        if(JSON.stringify(data[i][thisKey])!==JSON.stringify(thisValue)) returnData.push(data[i]);
      }
      else{
        if(data[i][thisKey].toString()!==thisValue.toString()) returnData.push(data[i]);
      }
    }
    return returnData;
  };//arr=[{id:0,value:[2,3,4,5,1]},{id:1,value:333},{id:2,value:{a:1,b:2}}] 例如：deleteKey(arr,"value",[1,2,3,4,5])
  var deepCopy=function(obj){
    var reObj,
      k,
      b;
    if((b=(obj instanceof Array))||obj instanceof Object){
      reObj=b ? [] : {};
      for(k in obj){
        if(obj[k] instanceof Array||obj[k] instanceof Object){
          reObj[k]=deepCopy(obj[k]);
        }
        else{
          reObj[k]=obj[k];
        }
      }
    }
    return reObj;
  };
  var clickPageBoxLink=function(callback,data,perLength){
    return function(event){
      event.preventDefault();
      var thisPerLength;
      var pageCurrent=1;
      var pageCount=1;
      var thisData={};
      var thisFnt=typeof(callback)!=="function" ? eval(callback) : callback;
      thisPerLength=typeof(perLength)!=="undefined" ? perLength : val.pageRows;
      try{
        if($(event.target).hasClass("jumpButton")){
          pageCurrent=parseInt($(event.target).closest("p").find("input.inputPageNum").val());
          pageCount=parseInt($(event.target).closest("p").find("span.pageCount").text().split("/").slice(-1));
          pageCurrent>=pageCount ? pageCurrent=pageCount : null;
          pageCurrent<=0 ? pageCurrent=1 : null;
        }
        else{
          pageCurrent=parseInt($(event.target).attr("id"))+1;
        }
        thisData=typeof(data)!=="object" ? cutData(eval(data),pageCurrent,thisPerLength) : cutData(data,pageCurrent,thisPerLength);
        if(thisData.pageData.length>0){
          thisFnt.call(this,thisData);
        }
        else{
          if(pageCurrent===1){
            thisFnt.call(this,thisData);
          }
          else{
            pageCurrent-=1;
            thisData=cutData(data,pageCurrent,thisPerLength);
            thisFnt.call(this,thisData);
          }
        }
      }
      catch(e){
        console.log ? console.log(e) : null;
      }
    }
  };//(回调函数,[数据数组],每页数据个数)//点击页码按钮及跳转，！注意，数据数组不是回调函数的参数，回调函数参数通过cutData()函数返回
  var encodeHex=function(str){
    var res=[];
    for(var i=0; i<str.length; i++) res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
    return encodeURIComponent("@"+res.join(""));
  };
  var decodeHex=function(_str){
    var str=decodeURIComponent(_str).substr(1,_str.length);
    var arr=[];
    var l=4;
    for(var i=0; i<(str.length/l); i++){
      arr[i]=str.substr(i*l,l);
    }
    return unescape("\%u"+arr.join("\%u"));
  };
  var ipToNum=function(ip){
    var num;
    ip=ip.split(".");
    num=Number(ip[0])*256*256*256+Number(ip[1])*256*256+Number(ip[2])*256+Number(ip[3]);
    num=num>>>0;
    return num;
  };//IP转成数字
  var numToIp=function(num){
    var str;
    var tt=[];
    tt[0]=(num>>>24)>>>0;
    tt[1]=((num<<8)>>>24)>>>0;
    tt[2]=(num<<16)>>>24;
    tt[3]=(num<<24)>>>24;
    str=String(tt[0])+"."+String(tt[1])+"."+String(tt[2])+"."+String(tt[3]);
    return str;
  };//数字转成IP
  var objToStr=function(o){
    var r=[];
    if(typeof o==="string") return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
    if(typeof o==="object"){
      if(!o.sort){
        for(var i in o) r.push("\""+i+"\":"+objToStr(o[i]));
        if(!!document.all&& !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){
          r.push("toString:"+o.toString.toString());
        }
        r="{"+r.join()+"}"
      }
      else{
        for(var i=0; i<o.length; i++) r.push(objToStr(o[i]))
        r="["+r.join()+"]"
      }
      return r;
    }
    return o.toString();
  };//object转string
  var removeRepeat=function(thisArr){
    var reArr=[];
    var temp={};
    for(var i=0; i<thisArr.length; i++){
      if(!temp[thisArr[i]]){
        reArr.push(thisArr[i]);
        temp[thisArr[i]]=true;
      }
    }
    return reArr;
  };//数组去重
  var iframeResize=function(_val){
    if(typeof(iframeResize)!=="undefined") clearTimeout(iframeResize);
    var run=function(_val){
      var subHeight=0;
      $(window.top.document).find("#elfFramePages").css({"height":"auto"});
      //$(window.top.document).find("#elfFramePages").parent().css({"height":"auto"});
      $(window.top.document).find("#elfFramePages").find("iframe").css({"height":"auto"});
      if(window!==window.top){
        subHeight=_val||Math.max($("body").outerHeight(),Number($("html").height()),($(window.top).height()-$(window.top.document).find("#elfFramePages").offset().top));
      }
      else{
        var $iframeBox=$("#elfFramePages");
        subHeight=_val||Math.max(Number($iframeBox.find("iframe").eq(0).contents().height()),($(window).height()-$iframeBox.offset().top));
      }
      var leftMenuHeight=0;
      $(window.top.document).find("#leftMenu").contents().each(function(i,e){
        leftMenuHeight+=$(e).outerHeight();
      });
      subHeight=Math.max(subHeight,leftMenuHeight);
      if(document.all) subHeight+=4;
      if(window.opera) subHeight+=1;
      $(window.top.document).find("#elfFramePages").css({"height":subHeight});
      $(window.top.document).find("#elfFramePages").find("iframe").css({"height":subHeight});
    };
    window.iframeResize=setTimeout(run,window.top.myPage.fadeTime+100,_val);
  };
  var localStorageSize=function(){
    if(!window.localStorage){
      console.log('浏览器不支持localStorage');
    }
    var size=0;
    for(var item in window.localStorage){
      if(window.localStorage.hasOwnProperty(item)){
        size+=window.localStorage.getItem(item).length;
      }
    }
    size=(size/1024).toFixed(2);
    console.log('当前localStorage已使用'+size+'KB,\n'+'剩余容量'+(5000-size).toFixed(2)+"KB");
    return 5000-size;
  };
  var countCode=function(){
    //var _hmt=_hmt||[];
    var hm=document.createElement("script");
    hm.src="//hm.baidu.com/hm.js?959954df06dc52f0840ef019a550c1eb";
    var s=document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm,s);
  };//baidu count
  var study=function(_keyName){
    var keyName=_keyName;
    var thisData=[];
    if(typeof(localStorage)==="undefined"){
      alert("为了使用学习功能,请将您的浏览器升级到现代浏览器,例如chrome等");
      return false;
    }
    if(!localStorage.getItem(keyName)){
      localStorage.setItem(keyName,"[]");
    }
    thisData=JSON.parse(localStorage.getItem(keyName));
    this.maxLength=localStorage.getItem(keyName+"MaxLength")||0;//默认0条
    localStorage.setItem(keyName+"MaxLength",this.maxLength);
    this.setItem=function(_value){
      if(typeof(_value)!=="undefined"&&_value!=="") thisData.unshift(_value.replace(/'/g,""));
      thisData=elf.removeRepeat(thisData);
      if(thisData.length>this.maxLength) thisData.splice(this.maxLength);
      localStorage.setItem(keyName,elf.objToStr(thisData));
      localStorage.setItem(keyName+"MaxLength",this.maxLength);
    };
    this.getData=function(){
      thisData=JSON.parse(localStorage.getItem(keyName));
      //thisData=thisData.splice(this.maxLength);
      return thisData.slice(0,this.maxLength);
    };
    this.clear=function(){
      localStorage.setItem(keyName,"[]");
      thisData=[];
    };
  };
  var share=function(){
    window._bd_share_config={
      common:{
        bdText:'自定义分享内容',
        bdDesc:'自定义分享摘要',
        bdUrl:'自定义分享url地址',
        bdPic:'自定义分享图片'
      },
      share:[{
        "bdSize":16
      }],
      slide:[{
        bdImg:0,
        bdPos:"right",
        bdTop:100
      }],
      image:[{
        viewType:'list',
        viewPos:'top',
        viewColor:'black',
        viewSize:'16',
        viewList:['qzone','tsina','huaban','tqq','renren','sqq']
      }],
      selectShare:[{
        "bdSelectMiniList":['qzone','tqq','sqq','renren'],
        "bdContainerClass":'rightArticle'
      },{
        "bdSelectMiniList":['qzone','tqq','sqq'],
        "bdContainerClass":'newsContent'
      }]
    };
    //(function() {
    var share=document.createElement("script");
    share.src='http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion='+ ~(-new Date()/36e5);
    var s=document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(share,s);
    //})();
  };//baidu Share
  $.Event.prototype.getKey=function(){
    var evt=this||window.event; //兼容IE和Firefox获得keyBoardEvent对象
    return evt.keyCode ? evt.keyCode : evt.which; //兼容IE和Firefox获得keyBoardEvent对象的键值
  };
  String.prototype.toDecimal=function(){
    var strArr=this.split('');
    for(var i=0; i<this.length; i++){
      switch(this.charAt(i)){
        case '<':
          strArr.splice(i,1,'&#60;');
          break;
        case '>':
          strArr.splice(i,1,'&#62;');
          break;
        case '\"':
          strArr.splice(i,1,'&#34;');
          break;
        case '\'':
          strArr.splice(i,1,'&#39;');
          break;
        case '&':
          strArr.splice(i,1,'&#38;');
      }
    }
    return strArr.join('');
  };
  return ({
    val:val,
    loginStatus:loginStatus,
    myAjax:myAjax,
    reRandom:reRandom,//返回5位随机整数
    selectOne:selectOne,//随机返回数组中的任意一个
    alertInfo:alertInfo,
    confirmAlert:confirmAlert,
    request:request,//获取URL传递变量
    resetForm:resetForm,
    inputErr:inputErr,//在元素的页面位置弹出错误提示
    inputErrReset:inputErrReset,//在元素的页面位置弹出错误提示
    validator:validator,
    cutStr:cutStr,//按照指定长度切割字符串,用"..."结尾
    cutInsert:cutInsert,
    cutData:cutData,//返回数组中的一部分
    filterData:filterData,//查询字典为单位的数组,结果可能是多个
    deleteKey:deleteKey,//删除字典为单位的数组,结果可能是多个
    deepCopy:deepCopy,//深复制
    clickPageBoxLink:clickPageBoxLink,
    encodeHex:encodeHex,
    decodeHex:decodeHex,
    ipToNum:ipToNum,
    numToIp:numToIp,
    objToStr:objToStr,//对象转字符串,解决JSON.stringify()无法转换函数的问题
    md5:$.md5,
    removeRepeat:removeRepeat,//数组去重
    iframeResize:iframeResize,//iframe大小自适应
    localStorageSize:localStorageSize,//返回localStorage已使用及剩余大小
    countCode:countCode,//百度统计
    study:study,
    share:share//分享
  });
})();