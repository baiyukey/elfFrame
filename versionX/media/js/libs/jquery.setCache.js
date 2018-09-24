//赋予输入框自学习功能
//author:baiyukey@qq.com
//version:0.00.001
$.fn.extend({
  "setCache":function(_val){
    var $inputs=$(this);
    var $thisInput=false;
    var cacheLength=typeof(_val)==="number" ? _val : 5;
    var ids;
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
    };//同步elf.study
    var reId=function(_$thisInput){
      var $Input=typeof(_$thisInput)!=="undefined" ? _$thisInput : $thisInput;
      var $thisClosest=$Input.attr("id") ? $Input : $Input.closest("[id]");
      var thisId=$thisClosest.length>0 ? $thisClosest.attr("id") : "publicSearch";
      this.localStorage=thisId;
      this.searchHistory="searchHistory_for_"+thisId;
    };
    var reHistoryList=function(listArr){
      var reHtml='';
      for(var i=0; i<listArr.length; i++){
        reHtml+='<li><a data-value="'+listArr[i]["value"]+'" href="#">'+listArr[i]["text"]+'</a></li>';
      }
      return reHtml;
    };
    var fixOption=function(){
      var $searchHistory=$("#"+ids.searchHistory);
      var maxLength=Number(localStorage.getItem(ids.localStorage+"MaxLength"));
      if(maxLength<=1){
        $searchHistory.find(".searchHistoryOption").find(".subtract").addClass("disable");
      }
      else{
        $searchHistory.find(".searchHistoryOption").find(".subtract").removeClass("disable");
      }
    };
    var fixHistoryList=function(_$this,eq){
      if(typeof(eq)==="undefined") eq= -1;
      if(eq>=_$this.find("ul:visible").children("li").length){
        eq=0;
      }
      else if(eq<0){
        eq=_$this.find("ul:visible").find("li").length-1;
      }
      _$this.find(".focusBg").removeClass("focusBg");
      _$this.find("ul:visible").eq(0).attr("data-focus-index",eq).find("li:eq("+eq+") a").addClass("focusBg");
    };
    var saveThisValue=function(_value){
      var thisValue=$.trim(_value);
      if(thisValue!==""){
        var thisHistory=new study(ids.localStorage);
        thisHistory.maxLength=!localStorage.getItem(ids.localStorage+"MaxLength")||Number(localStorage.getItem(ids.localStorage+"MaxLength"))===0||cacheLength===0 ? cacheLength : Number(localStorage.getItem(ids.localStorage+"MaxLength"));
        thisHistory.setItem(thisValue);
      }
    };
    var clickSearchListLi=function(_$thisInput){
      return function(event){
        event.preventDefault();
        if($(this).hasClass("disable")) return false;
        var $this=$(this);
        var $thisUl=$this.closest("ul");
        var thisText=$.trim($this.find("a").attr("data-value"));
        _$thisInput.val(thisText).trigger("input").removeClass("activeInput");//.attr("placeholder",thisText).click();
        $thisUl.attr("data-focus-index","-1").parent().removeClass("unfold");
        document.removeEventListener("click",clickOutSearchList);
      };
    };
    var clickOutSearchList=function(event){
      event.preventDefault();
      event.stopPropagation();
      //if($(event.target)[0].tagName.toUpperCase()==="INPUT"&&$(event.target).attr("type")==="search"){
      if($(event.target).hasClass("activeInput")){
        return false;
      }
      else if($(event.target).closest(".searchHistory.unfold").length>0) return false;//当前点击的是菜单
      else{
        $(".activeInput").trigger("click");
        document.removeEventListener("click",clickOutSearchList);
      }
    };
    var clickSearchOption=function(e){
      e.preventDefault();
      var $this=$(this);
      if($this.hasClass("disable")) return false;
      var initUl=function(){
        var thisData=new study(ids.localStorage);
        var dataArr=thisData.getData();
        var formatData=[];
        for(var i=0; i<dataArr.length; i++){
          formatData.push({
            "text":dataArr[i],
            "value":dataArr[i]
          });
        }
        $("#"+ids.searchHistory).find("ul").html(reHistoryList(formatData));
      };
      var maxLengthOrder=function(_order){
        var currentMaxLength=localStorage.getItem(ids.localStorage+"MaxLength");
        if(currentMaxLength>1&&_order==="subtract"){
          currentMaxLength--;
        }
        else if(_order==="add"){
          currentMaxLength++;
        }
        localStorage.setItem(ids.localStorage+"MaxLength",currentMaxLength);
        $this.closest(".searchHistoryOption").find(".maxLength").text(currentMaxLength);
        fixOption();
        initUl();
      };
      var clearThis=function(){
        localStorage.setItem(ids.localStorage,"");
        initUl();
      };
      if($this.hasClass("clear")){
        clearThis();
      }
      else if($this.hasClass("subtract")){
        maxLengthOrder("subtract");
      }
      else if($this.hasClass("add")){
        maxLengthOrder("add");
      }
    };
    window.clickElfSetCacheInput=function(event){
      event.preventDefault();
      var $thisInput=$(event.target);
      //ids=new reId();
      if($(this).hasClass("disable")) return false;
      var hideHistoryList=function(_$thisInput){
        var thisId=new reId(_$thisInput);
        var searchHistoryId=thisId.searchHistory;
        var $searchHistory=$("#"+searchHistoryId);
        if(_$thisInput.val()===""&&_$thisInput.attr("placeholder")===_$thisInput.attr("data-placeholder")){
          _$thisInput.val("");
        }
        else if(_$thisInput.val()===""&&_$thisInput.attr("placeholder")!==_$thisInput.attr("data-placeholder")){
          _$thisInput.attr("placeholder",_$thisInput.attr("data-placeholder"));
        }
        else if(_$thisInput.val()!==""){
          _$thisInput.attr("placeholder",_$thisInput.val());
        }
        $searchHistory.removeClass("unfold").find("ul").attr("data-focus-index","-1");
        _$thisInput.removeClass("activeInput");
      };
      var showHistoryList=function(_$thisInput){
        ids=new reId(_$thisInput);
        if(_$thisInput.attr("placeholder")!=="") _$thisInput.attr("data-placeholder",_$thisInput.attr("placeholder"));
        if(cacheLength===0){
          var localData=new study(ids.localStorage);
          localData.maxLength=cacheLength;
          localData.setItem();
        }//为0时先清空缓存,否则保留原来的数据
        var thisId=ids.localStorage;
        var searchHistoryId=ids.searchHistory;
        //var $searchHistory=$("#"+searchHistoryId);
        var $body=$("body");
        var thisInputFontSize=window.getComputedStyle(_$thisInput[0]).fontSize;
        var maxLength=!localStorage.getItem(thisId+"MaxLength")||Number(localStorage.getItem(thisId+"MaxLength"))===0||cacheLength===0 ? cacheLength : Number(localStorage.getItem(thisId+"MaxLength"));
        var $searchHistory=false;
        if(!document.getElementById(searchHistoryId)){
          $body.append('<div class="searchHistory" id="'+searchHistoryId+'"><ul data-focus-index="-1"></ul><div class="searchHistoryOption" style="white-space:nowrap;text-align:right; padding:5px;color:#555555;"><a class="searchOption clear" href="#">清空</a><p style="display:inline-block;margin-left:1em;"><span>最大缓存条数<i class="iconQuestionSign" style="margin:0 0.25em; vertical-align:baseline" title="缓存仅存于本地浏览器中."></i>:</span><a class="searchOption subtract'+(maxLength<=1 ? ' disable' : '')+'" href="#">-</a><span class="maxLength">'+cacheLength+'</span><a class="searchOption add" href="#">+</a></p></div></div>');
          $searchHistory=$("#"+searchHistoryId);
        }
        else{
          $searchHistory=$("#"+searchHistoryId);
        }
        var bodyH=$body.height();
        var thisT=_$thisInput.offset().top;
        var thisB=bodyH-thisT;
        var thisH=$searchHistory.outerHeight()+_$thisInput.outerHeight()-1;
        var customShow=function(m){
          if(typeof(m)!=="undefined"&&m==="old"){
            if(thisH>thisB){
              $searchHistory.attr("style","");
              $searchHistory.css({
                "height":thisB-(thisB/10),
                "overflow-y":"scroll"
              });
            }//送给喜欢传统操作方式的朋友，并且下拉菜单永远在下边，不管下边的空间有多少。
          }
          else{
            if(thisH>thisB&&thisH<thisT){
              $searchHistory.css({"margin-top":(-1*thisH)});
            }
          }
        };
        customShow();
        //if(cacheLength<=0) return false;
        if(_$thisInput.val()===""&&_$thisInput.attr("placeholder")===_$thisInput.attr("data-placeholder")){
          //_$thisInput.val("");
        }
        else{
          _$thisInput.attr("placeholder",_$thisInput.val());
        }
        $searchHistory.find("ul").attr("data-focus-index","-1").find(".focusBg").removeClass("focusBg");//清除上下键选择生成的样式
        $searchHistory.attr("style","").css({
          "font-size":thisInputFontSize,
          "position":"absolute",
          "min-width":_$thisInput.outerWidth(),
          "left":_$thisInput.offset().left,
          "top":_$thisInput.offset().top+_$thisInput.outerHeight()
        }).find(".maxLength").text(maxLength);
        //window[thisId+"Data"]=[];
        var initData=new study(thisId);
        initData.maxLength=maxLength;
        var thisArr=initData.getData();
        var formatData=[];
        for(var i=0; i<thisArr.length; i++){
          formatData.push({
            "text":thisArr[i],
            "value":thisArr[i]
          });
        }
        if(formatData.length>0){
          $searchHistory.find(".searchHistoryOption").show();
          fixOption();
        }
        else{
          $searchHistory.find(".searchHistoryOption").hide();
        }
        $searchHistory.addClass("unfold").find("ul").html(reHistoryList(formatData));
        _$thisInput.addClass("activeInput");
        $searchHistory.off("click","ul li",clickSearchListLi(_$thisInput));//下拉菜单选择
        $searchHistory.one("click","ul li",clickSearchListLi(_$thisInput));//下拉菜单选择
        document.removeEventListener("click",clickOutSearchList);
        document.addEventListener("click",clickOutSearchList);
        $(document).off("click",".searchOption",clickSearchOption);
        $(document).on("click",".searchOption",clickSearchOption);
      };
      //if($searchHistory.hasClass("unfold")){
      if($thisInput.hasClass("activeInput")){
        hideHistoryList($thisInput);
      }
      else{
        $(".activeInput").trigger("click");
        showHistoryList($thisInput);
      }
    };
    window.checkElfSetCacheInputKeyup=function(e){
      if($(e.target).hasClass("disable")) return false;
      var thisId=ids.localStorage;
      var searchHistoryId=ids.searchHistory;
      var $searchHistory=$("#"+searchHistoryId);
      var thisEq;
      var keyUpRun=function(thisKey){
        if(thisKey===13){
          e.preventDefault();
          thisEq=$searchHistory.find("ul:visible").attr("data-focus-index");//||$thisForm.find("ul").find("li.curr").index();
          if(Number(thisEq)>=0){
            $searchHistory.find("ul li:eq("+thisEq+")").trigger("click");
          }
          else{
            saveThisValue($(e.target).val());
            $(e.target).trigger("click");
          }
          fixHistoryList($searchHistory,thisEq);
        }//敲击回车键
        else if(thisKey===9){
          e.preventDefault();
          $(e.target).trigger("click");
        }//敲击Tab键
        else if(thisKey===27){
          e.preventDefault();
          if(document.getElementById(searchHistoryId)&&$searchHistory.hasClass("unfold")){
            $(e.target).trigger("click");
            thisEq= -1;
            fixHistoryList($searchHistory,thisEq);
          }
        }//敲击ESC键
        else if(thisKey===38){
          e.preventDefault();
          if(document.getElementById(searchHistoryId)&&$searchHistory.hasClass("unfold")){
            thisEq=$searchHistory.find("ul").attr("data-focus-index")||$searchHistory.find("ul").find("li").length;
            thisEq--;
            fixHistoryList($searchHistory,thisEq);
          }
        }//敲击上键
        else if(thisKey===40){
          e.preventDefault();
          if(document.getElementById(searchHistoryId)&&$searchHistory.hasClass("unfold")){
            thisEq=$searchHistory.find("ul").attr("data-focus-index")|| -1;
            thisEq++;
            fixHistoryList($searchHistory,thisEq);
          }
        }//敲击下键
        else{
          //var maxLength=Number(localStorage.getItem(thisId+"MaxLength"));
          var maxLength=!localStorage.getItem(thisId+"MaxLength")||Number(localStorage.getItem(thisId+"MaxLength"))===0||cacheLength===0 ? cacheLength : Number(localStorage.getItem(thisId+"MaxLength"));
          if(!document.getElementById(searchHistoryId)){
            var thisInputFontSize=window.getComputedStyle($(e.target)[0]).fontSize;
            $("body").append('<div class="searchHistory" id="'+searchHistoryId+'" style="font-size:'+thisInputFontSize+'"><ul data-focus-index="-1"></ul><div class="searchHistoryOption" style="white-space:nowrap;text-align:right; padding:5px;color:#555555"><a class="control clear" href="#">清空</a><p style="display:inline-block;margin-left:1em;"><span title="缓存仅存于本地浏览器中.">最大缓存条数<i class="iconQuestionSign" style="margin:0 0.25em; vertical-align:baseline"></i>:</span><a class="control subtract'+(maxLength<=1 ? ' disable' : '')+'" href="#">-</a><span class="maxLength">'+maxLength+'</span><a class="control add" href="#">+</a></p></div></div>');
          }
          $searchHistory=$("#"+searchHistoryId);
          $searchHistory.css({
            "position":"absolute",
            "min-width":$(e.target).outerWidth(),
            "left":$(e.target).offset().left,
            "top":$(e.target).offset().top+$(e.target).outerHeight()
          }).addClass("unfold");
          var newData=new study(thisId);
          newData.maxLength=maxLength;
          var studyData=newData.getData();
          var formatData=[];
          for(var i=0; i<studyData.length; i++){
            formatData.push({
              "text":studyData[i],
              "value":studyData[i]
            });
          }
          var inputVal=$.trim($(e.target).val());
          if(inputVal===""){
            $searchHistory.find("ul").html(reHistoryList(formatData));
            $searchHistory.find("maxLength").text(maxLength);
            if(formatData.length===0){
              $searchHistory.find(".searchHistoryOption").hide();
            }
            else{
              $searchHistory.find(".searchHistoryOption").show();
              fixOption()
            }
          }
          else{
            if(typeof(Fuse)!=="function"){
              console.log("缺少juse.js,搜索功能取消");
              return false;
            }
            var thisSearch=new Fuse(formatData,{keys:["text"]});
            var result=thisSearch.search(inputVal);
            $searchHistory.find("ul").html(reHistoryList(result));
            $searchHistory.find(".searchHistoryOption").hide();
          }
        }// 按键抬起搜索d+Data数据,默认格式[{"text":"abc","value":"abc"},...]
      };
      if(typeof(window.waitSaveSearchCache)!=="undefined") clearTimeout(window.waitSaveSearchCache);
      window.waitSaveSearchCache=setTimeout(saveThisValue,3000,$(e.target).val());
      keyUpRun(e.getKey());
    };//搜索输入框及下拉
    $inputs.off("click",clickElfSetCacheInput).on("click",clickElfSetCacheInput);//点击搜索输入框
    $inputs.off("keyup",checkElfSetCacheInputKeyup).on("keyup",checkElfSetCacheInputKeyup);//搜索输入下拉菜单快捷键 
    //$(document).on("keypress","form input",pri.triggerSubmit);//回车提交表单
    return this.each(function(){});
  }
});