//定义关键字输入框
//author:baiyukey@qq.com
//version:1.01.01
$.fn.extend({
  "elfKeyword":function(_val){
    var val=$.extend({
      "placeholder":'请在此输入',
      "initData":[],//初始化的数值  2`
      "refuseData":[],//输入匹配,但是不允许输入的数值
      "refuseDataReason":"不允许的字符",
      "regExp":/.+/,
      "inputErr":"不匹配的字符",
      "callback":undefined,//初始化完成的回调
      "inputCallback":undefined//有效输入后的回调
    },_val);
    var $this=$(this);
    $this.addClass("elfKeywordGroup");
    $this.find(".keyword").remove();
    var keywordHtml=[];
    for(var i=0; i<val.initData.length; i++){
      keywordHtml.push('<span class="keyword">'+val.initData[i]+'</span>');
    }
    $this.prepend(keywordHtml.join(''));
    if($this.find("input").length===0){
      $this.append('<input type="text" placeholder="'+val.placeholder+'" style="width:10em;">');
    }
    else{
      $this.find("input").attr("placeholder",val.placeholder);
    }
    var $thisInput=$this.find("input");
    var keyword={
      "input":function(e){
        var key=e.getKey();
        switch(key){
          case 13://回车
            keyword.inputFinish();
            break;
          case 32://空格
            keyword.inputFinish();
            break;
          case 8://回退
            keyword.removeLast();
            break;
          default:
            break;
        }
      },
      "inputFinish":function(_isBlur){
        var refuseData=$this.attr("data-refuse-value").split(",");
        var existedData=$this.getElfKeyword();
        var inputData=$.trim($thisInput.val()).replace(/[\s\,]+/g,",").split(",");
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
        $(".indicate").remove();
        $("[indicate]").removeAttr("indicate");
        inputData=removeRepeat(inputData);
        var inputKeywords=[];
        inputData.forEach(function(e,i){
          if(e!==""&&e!==" ") inputKeywords.push(e);
        });
        if(inputKeywords.length===0) return false;
        var errKeywords=[];
        var refuseKeywords=[];
        var repeatKeywords=[];
        inputKeywords.forEach(function(e,i){
          if(!val.regExp.test(e)) errKeywords.push(e);
          if($.inArray(e,refuseData)>=0) refuseKeywords.push(e);
          if($.inArray(e,existedData)>=0) repeatKeywords.push(e);
        });
        if(refuseKeywords.length>0){
          $this.inputErr(val.refuseDataReason+':'+refuseKeywords.join(","));
        }
        else if(errKeywords.length>0){
          $this.inputErr(val.inputErr+':'+errKeywords.join(","));
        }
        else if(repeatKeywords.length>0){
          $this.inputErr('重复的数据:'+repeatKeywords.join(","));
        }
        else{
          inputKeywords.forEach(function(e,i){
            if($this.find(".keyword").length>0){
              $this.find(".keyword:last").after('<span class="keyword">'+e+'</span>');
            }
            else{
              $this.prepend('<span class="keyword">'+e+'</span>');
            }
          });
          if(typeof(val.inputCallback)==="function") val.inputCallback.call(this);
          $thisInput[0].value="";
          setTimeout(function(){
            if(typeof("_isBlur")==="undefined") $thisInput[0].focus();
          },50);//防止敲击空格造成的回充 
        }
      },
      "removeLast":function(){
        if($thisInput.val()!=="") return false;
        $(".indicate").remove();
        $("[indicate]").removeAttr("indicate");
        $this.find(".keyword:last").remove();
        if(typeof(val.inputCallback)==="function") val.inputCallback.call(this);
      },
      "remove":function(e){
        e.preventDefault();
        $(".indicate").remove();
        $("[indicate]").removeAttr("indicate");
        $(this).closest(".keyword").remove();
        setTimeout(function(){
          $this.find("input")[0].focus();
        },500);
        if(typeof(val.inputCallback)==="function") val.inputCallback.call(this);
      },
      "focus":function(e){
        $this.addClass("focus");
        $this.find("input")[0].focus();
        $(document).one("mousedown",keyword.blur);
      },
      "blur":function(e){
        var isIn=function(x,y,$zoom){
          if(!$zoom|| !$zoom.offset()) return false;
          var zoomX=[$zoom.offset().left,$zoom.offset().left+$zoom.outerWidth()];
          var zoomY=[$zoom.offset().top,$zoom.offset().top+$zoom.outerHeight()];
          return x>=zoomX[0]&&x<=zoomX[1]&&y>=zoomY[0]&&y<=zoomY[1];
        };
        if(isIn(e.pageX,e.pageY,$this)){
          $(document).one("mousedown",keyword.blur)
        }
        else{
          $(".indicate").remove();
          $("[indicate]").removeAttr("indicate");
          $this.find("input").val($.trim($this.find("input").val()));
          $this.removeClass("focus");
          keyword.inputFinish(true);
        }
      }
    };
    $this.attr("data-reset-value",val.initData.join(","));
    $this.attr("data-refuse-value",val.refuseData.join(","));
    $this.attr("data-refuse-reason",val.refuseDataReason);
    $this.attr("data-input-err",val.inputErr);
    $this.attr("data-regexp",val.regExp);
    $this.find("input").val("");
    $(".indicate").remove();
    $("[indicate]").removeAttr("indicate");
    //on
    $(document).off("click",".keyword",keyword.remove).on("click",".keyword",keyword.remove);
    $this.off("click").on("click",keyword.focus);
    $this.off("keydown","input").on("keydown","input",keyword.input);
    if(typeof(val.callback)==="function") val.callback.call(this);
  },
  "resetElfKeyword":function(){
    var $this=$(this);
    var resetData=$this.attr("data-reset-value").split(",");
    var keywordHtml=[];
    for(var i=0; i<resetData.length; i++){
      if(resetData[i]!=="") keywordHtml.push('<span class="keyword">'+resetData[i]+'</span>');
    }
    $this.find(".keyword").remove();
    $this.prepend(keywordHtml.join(''));
    $this.find("input").val("");
    $(".indicate").remove();
    $("[indicate]").removeAttr("indicate");
  },
  "setElfKeyword":function(_arr){
    if(typeof(_arr)==="undefined"){
      if(typeof(elf)!=="undefined"&&typeof(elf.alertInfo)!=="undefined") elf.alertInfo("数据无效,请检查参数");
      return false;
    }
    var $this=$(this);
    var thisRregexp=eval($this.attr("data-regexp"));
    var refuseData=$this.attr("data-refuse-value").split(",");
    var resetData=_arr;
    var keywordHtml=[];
    var refuseKeywords=[];
    var errKeywords=[];
    for(var i=0; i<resetData.length; i++){
      if($.inArray(resetData[i],refuseData)>=0) refuseKeywords.push(resetData[i]);
      if(thisRregexp.test(resetData[i])){
        keywordHtml.push('<span class="keyword">'+resetData[i]+'</span>');
      }
      else{
        errKeywords.push(resetData[i]);
      }
    }
    if(refuseKeywords.length>0){
      console.log("setKeyword方法未成功执行("+$this.attr("data-refuse-reason")+"):"+refuseKeywords.join(","));
      return false;
    }
    else if(errKeywords.length>0){
      console.log("setKeyword方法未成功执行("+$this.attr("data-input-err")+"):"+errKeywords.join(","));
      return false;
    }
    $this.find(".keyword").remove();
    $this.prepend(keywordHtml.join(''));
    $this.attr("data-reset-value",_arr.join(","));
  },
  "getElfKeyword":function(){
    var returnData=[];
    $(this).find(".keyword").each(function(i,e){
      returnData.push($.trim($(e).text()));
    });
    return returnData;
  }
});