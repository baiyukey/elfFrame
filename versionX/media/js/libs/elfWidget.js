//window["$"]=jQuery;
$(function(){
  var pri={
    fadeTime:typeof(window["myPage"].fadeTime)!=="undefined" ? window["myPage"].fadeTime : 300,
    isIn:function(x,y,$zoom){
      if(!$zoom|| !$zoom.offset()) return false;
      var zoomX=[$zoom.offset().left,$zoom.offset().left+$zoom.outerWidth()];
      var zoomY=[$zoom.offset().top,$zoom.offset().top+$zoom.outerHeight()];
      return x>=zoomX[0]&&x<=zoomX[1]&&y>=zoomY[0]&&y<=zoomY[1];
    },
    getTheDate:function(strDate){
      return eval('new Date('+strDate.replace(/\d+(?=-[^-]+$)/,function(a){ return parseInt(a,10)-1; }).match(/\d+/g)+')');
    },//例如将"2014-01-01"转换为标准时间类型
    formatTime:function(intDate){
      var thisDate=new Date(intDate);
      
      function repairN(N){
        return N<10 ? "0"+N : N.toString();
      }//日期小于10，在日期前面用“0”补齐
      return thisDate.getFullYear()+"-"+(repairN(thisDate.getMonth()+1))+"-"+repairN(thisDate.getDate());
    },//例如将1433384063360转换为"2015-06-04"
    //function-组件
    ripple:function(e){
      e.preventDefault();
      var $this=$(e.target).closest("a");
      $this=$this.length===0 ? $(e.target).closest(".hasRipple") : $this;
      if($this.length===0||$this.hasClass("disable")) return false;
      var posX=$this.offset().left;
      var posY=$this.offset().top;
      var buttonWidth=parseInt($this.width());
      var buttonHeight=parseInt($this.height());
      var maxZoon=Math.min(200,Math.max(buttonHeight,buttonWidth));
      var thisId="ripple"+new Date().getTime();
      $(".ripple").remove();
      $this.prepend('<section class="ripple" id="'+thisId+'"></section>');
      var x=e.pageX-posX-(maxZoon/2);
      var y=e.pageY-posY-(maxZoon/2);
      $("#"+thisId).css({
        width:maxZoon,
        height:maxZoon,
        top:y+'px',
        left:x+'px'
      }).addClass("rippleEffect");
    },
    tagSelect:function(event){
      event.preventDefault();
      var $target=$(event.target).closest("li");
      var run=function(){
        $target.addClass("curr").siblings().removeClass("curr");
        $target.closest("section").children("div.liPage").hide();
        $target.closest("section").children("div.liPage:eq("+$target.index()+")").show();//.siblings("div.liPage").hide();
      };
      if(!$target.hasClass("disable")){
        run();
        pri.ripple(event);
      }
    },
    clickCheckbox:function(event){
      event.preventDefault();
      var $thisCheckbox=$(event.target).closest("a");
      var errId=$thisCheckbox.closest(".multiSelect ").attr("indicate")||$thisCheckbox.closest(".checkboxGroup").attr("indicate")||0;
      var run=function(){
        $thisCheckbox.hasClass("select") ? $thisCheckbox.removeClass("select") : $thisCheckbox.addClass("select");
        if(Number(errId)!==0) $("#errorItem"+errId).remove();
      };
      $thisCheckbox.hasClass("disable") ? eval(null) : run();
    },
    clickRadio:function(event){
      event.preventDefault();
      var $thisRadio=$(event.target).closest("a");
      var $thisRadioGroup=$thisRadio.closest(".radioGroup");
      var $thisError=$thisRadioGroup.length>0&&$thisRadioGroup[0].hasAttribute("indicate") ? $("#errorItem"+$thisRadio.closest(".radioGroup").attr("indicate")) : null;
      var run=function(){
        if($thisRadio.hasClass("select")) return false;
        if($thisRadioGroup.length>0) $thisRadioGroup.find(".radio").removeClass("select");
        $thisRadio.addClass("select");
        if($thisError) $thisError.remove();
      };
      $thisRadio.hasClass("disable") ? eval(null) : run();
    },
    clickDownListLi:function(event){
      event.preventDefault();
      if($(this).hasClass("disable")) return false;
      var $this=$(this).closest("li");
      var thisText=$.trim($(this).text());
      var $thisSelector=$this.closest("div").find(".listSelected");
      var listSelecterType=$thisSelector[0].tagName.toUpperCase();
      var run=function(){
        $this.addClass("curr").siblings("li").removeClass("curr");
        switch(listSelecterType){
          case "INPUT":
            $thisSelector.val(thisText).attr("placeholder",thisText).click();
            //$thisSelector.trigger("click");
            break;
          case "A":
            $thisSelector.find("span").text(thisText);
            break;
          default :
            //console.log(listSelecterType);
            break;
        }
      };
      run();
    },
    clickOutDownList:function(event){
      var $this=$("body");
      if(typeof(event)!=="undefined"){
        event.preventDefault();
        event.stopPropagation();
        $this=$(this);
      }
      var runThis=function(_window){
        if($this.hasClass("listSelected")){
          if(_window!==window.top) runThis(_window.parent);
          return false;
        }
        else{
          $(_window.document).find("div.downList.unfold").each(function(i,ele){
            $(ele).find(".listSelected").trigger("click");
          });
          _window.document.removeEventListener("click",pri.clickOutDownList);
          $(_window.document).off("focus","input,textarea",pri.clickOutDownList);
        }
        if(_window!==window.top){
          runThis(_window.parent);
        }
      };
      runThis(window);
    },
    clickDownList:function(event){
      event.preventDefault();
      var $this=$(this).closest(".downList");
      var $thisSelector=$this.find(".listSelected");
      if($this.hasClass("disable")) return false;
      var thisType=$thisSelector[0].tagName.toUpperCase();
      if(thisType==="B"){
        $this.find(".listSelected").trigger("click");
        return false;
      }
      var thisValue=$.trim(thisType==="INPUT" ? $thisSelector.val() : $thisSelector.text());
      var run=function(){
        if($this.find("ul").length===0) $this.append('<ul></ul>');
        $this.find("ul").attr("style","");
        var bodyH=$("body").height();
        var thisT=$this.offset().top;
        var thisB=bodyH-thisT;
        var thisH=$this.find("ul").outerHeight()+$this.children(".listSelected").outerHeight()-1;
        var customShow=function(m){
          if(typeof(m)!=="undefined"&&m==="old"){
            if(thisH>thisB){
              $this.find("ul").attr("style","");
              $this.find("ul").css({
                "height":thisB-(thisB/10),
                "overflow-y":"scroll"
              });
            }//送给喜欢传统操作方式的朋友，并且下拉菜单永远在下边，不管下边的空间有多少。
          }
          else{
            if(thisH>thisB&&thisH<thisT){
              $this.find("ul").css({"margin-top":(-1*thisH)});
            }
          }
        };
        var createThisUl=function(){
          var thisDownListData=$this[0]["data-downList"]||window[$this.attr("id")+"Data"]||[];//下拉菜单默认数据是以该下拉菜单的id+”Data“为名称的页面变量
          var thisListHtml='';
          for(var ii=0; ii<thisDownListData.length; ii++){
            thisListHtml+='<li '+(thisDownListData[ii].text.toString()===thisValue.toString() ? 'class="curr"' : '')+'><a data-value="'+thisDownListData[ii]["value"]+'" href="#">'+thisDownListData[ii]["text"]+'</a></li>';
          }
          $this.find("ul").removeClass("fuse").html(thisListHtml);
          if(thisDownListData.length===0){
            if(thisType==="INPUT") $this.find("input.listSelected").attr("placeholder","无选择项...");
            if(thisType==="A") $this.find("a.listSelected").find("span").text("无选择项...");
          }
        };
        customShow("old");
        if($this.hasClass("unfold")){
          if(thisType==="INPUT"){
            if($this.hasClass("searchMore")&&$.trim($thisSelector.val())!==""){
              $thisSelector.attr("placeholder",$thisSelector.val());
            }//控件如果有searchMore的类则保留已输入的内容
            else{
              $thisSelector.val($thisSelector.attr("placeholder"));
            }
          }
          $this.off("click","ul li a",pri.clickDownListLi);//下拉菜单选择
          $this.removeClass("unfold");
          //关于其它错误提示可能会叠加到下拉菜单的问题
          $(".indicate[data-style]").each(function(i,e){$(e).attr("style",$(e).attr("data-style")).show().removeAttr("data-style");});
        }
        else{
          if(thisType==="INPUT"){
            $thisSelector.val("");
            $this.find("ul").removeAttr("data-focus-index").find("li").removeClass("focusBg");//清除上下键选择生成的样式
          }
          $this.off("click","ul li a",pri.clickDownListLi);//下拉菜单选择
          $this.on("click","ul li a",pri.clickDownListLi);//下拉菜单选择
          $this.addClass("unfold");
          //关于其它错误提示可能会叠加到下拉菜单的问题
          $(".indicate:visible").each(function(i,e){$(e).attr("data-style",$(e).attr("style")).hide();});
        }
        if(typeof(window[$this.attr("id")+"Data"])!=="undefined") createThisUl();
        $("div.downList.unfold").not($this).find(".listSelected").trigger("click");
        document.removeEventListener("click",pri.clickOutDownList);
        document.addEventListener("click",pri.clickOutDownList);
        $(document).off("focus","input,textarea",pri.clickOutDownList);
        $(document).on("focus","input,textarea",pri.clickOutDownList);
        var checkOutDownList=function(){
          if(document.activeElement.tagName.toUpperCase()==="IFRAME"){
            pri.clickOutDownList();
            clearInterval(window.listenCheckOutDownList);
          }
        };
        if(typeof(window.listenCheckOutDownList)!=="undefined") clearInterval(window.listenCheckOutDownList);
        window.listenCheckOutDownList=setInterval(checkOutDownList,100);
      };
      run();
    },
    mouseenterDownListA:function(){
      var isEllipsis=function(dom){
        var checkDom=dom.cloneNode(true),
          parent,
          flag;
        checkDom.style.width=dom.offsetWidth+'px';
        checkDom.style.height=dom.offsetHeight+'px';
        checkDom.style.overflow='auto';
        checkDom.style.position='absolute';
        checkDom.style.zIndex= -1;
        checkDom.style.opacity=0;
        checkDom.style.whiteSpace="nowrap";
        checkDom.innerHTML=dom.innerHTML;
        parent=dom.parentNode;
        parent.appendChild(checkDom);
        flag=checkDom.scrollWidth>checkDom.offsetWidth;
        parent.removeChild(checkDom);
        return flag;
      };
      this.run=function(){
        var $this=$(this);
        if(isEllipsis(this)){
          var hideTip=function(){$this.elfBubbleExit();};
          $this.elfBubble({
            "angle":"left",
            "html":'<p class="pd10 font12 downListTitle" style="width:350px;">'+$this.text()+'</p>',
          });
          $this.one("mouseleave",this,hideTip);
          $this.one("click",this,hideTip);
          $this.closest(".downList").one("input propertychange","input.listSelected",hideTip);
        }
      };
      return this;
    },//鼠标经过下拉菜单项,如果内容显示ellipsis,则显示tip
    checkDownListKeyup:function(e){
      var $thisDownList=$(e.target).hasClass("listSelected")||$(e.target).parent().hasClass("listSelected") ? $(e.target).closest("div.downList") : null;
      var thisEq;
      var keyUpRun=function(thisKey){
        var fixDownList=function($downList,eq){
          typeof(eq)==="undefined" ? eq=0 : null;
          if(eq>=$downList.children("ul:visible").children("li").length){
            eq=0;
          }
          else if(eq<0){
            eq=$downList.children("ul:visible").children("li").length-1;
            eq<0 ? eq=0 : null;
          }
          $downList.find("li a").removeClass("focusBg");
          $downList.find("ul:visible").eq(0).attr("data-focus-index",eq).find("li:eq("+eq+")").find("a").addClass("focusBg");
        };
        if(thisKey===13){
          e.preventDefault();
          var selectThis=function(){
            thisEq=$thisDownList.find("ul").attr("data-focus-index");//||$thisDownList.find("ul").find("li.curr").index();
            if($(e.target)[0].tagName.toUpperCase()==="INPUT"){
              if($thisDownList.children("ul:visible").length===0){
                $thisDownList.find(".listSelected").trigger("click");
              }
              else{
                //thisEq=$thisDownList.find("ul").attr("data-focus-index")||$thisDownList.find("ul").find("li.curr").index();
                $thisDownList.children("ul:visible").find("li:eq("+thisEq+") a").trigger("click");
              }
            }
            else{
              $thisDownList.children("ul").find("li:eq("+thisEq+") a").trigger("click");
              $thisDownList.setSelectVal({"text":$.trim($thisDownList.children("ul:eq(0)").find("li").eq(thisEq).text())});
            }//兼容系统的快捷键Tab
            fixDownList($thisDownList,thisEq);
          };
          selectThis();
        }//敲击回车键
        else if(thisKey===9){
          e.preventDefault();
          $(e.target).trigger("click");
        }//敲击Tab键
        else if(thisKey===27){
          e.preventDefault();
          if($thisDownList!==null&&$thisDownList.hasClass("unfold")){
            $thisDownList.find(".listSelected").trigger("click");
          }
        }//敲击ESC键
        else if(thisKey===38){
          e.preventDefault();
          if($thisDownList!==null){
            thisEq=$thisDownList.children("ul:visible").eq(0).attr("data-focus-index")||$thisDownList.children("ul:eq(0)").find("li").length;
            thisEq--;
            fixDownList($thisDownList,thisEq);
          }
        }//敲击上键
        else if(thisKey===40){
          e.preventDefault();
          if($thisDownList!==null){
            thisEq=$thisDownList.children("ul:visible").eq(0).attr("data-focus-index")|| -1;
            thisEq++;
            fixDownList($thisDownList,thisEq);
          }//敲击下键
        }
        else{
          var createList=function(listArr){
            var reHtml='';
            for(var key in listArr){
              if(listArr.hasOwnProperty(key)){
                reHtml+='<li><a data-value="'+listArr[key]["value"]+'" href="#">'+listArr[key]["text"]+'</a></li>';
              }
            }
            return reHtml;
          };
          //if($.inArray(e.getKey(),[9,13,27,38,40])>=0) return false;
          var $thisDownListlist=$(e.target).closest(".downList");
          var $thisInput=$thisDownListlist.children(".listSelected");
          $thisDownListlist.hasClass("unfold") ? eval(null) : $thisInput.trigger("click");//与下一行不可颠倒
          if(!$thisDownListlist[0].hasAttribute("id")) $thisDownListlist.attr("id","downList"+new Date().getTime());
          if(typeof(window[$thisDownListlist.attr("id")+"Data"])==="undefined"&& !$thisDownListlist.children("ul:eq(0)").hasClass("fuse")){
            window[$thisDownListlist.attr("id")+"Data"]=[];
            $thisDownListlist.children("ul:eq(0)").find("li").each(function(i,e){
              window[$thisDownListlist.attr("id")+"Data"].push({
                "text":$(e).find("a").text(),
                "value":$(e).find("a")[0].hasAttribute("data-value") ? $(e).find("a").attr("data-value") : $(e).find("a").text()
              });
            })
          }
          if(typeof(window[$thisDownListlist.attr("id")+"Data"])==="undefined") return false;
          var thisListData=window[$thisDownListlist.attr("id")+"Data"];
          if($thisInput[0].tagName.toUpperCase()==="INPUT"){
            var inputVal=$.trim($thisInput.val());
            if(inputVal===""){
              $thisDownListlist.children("ul:eq(0)").removeClass("fuse").html(createList(thisListData));
            }
            else{
              if(typeof(Fuse)!=="function"){
                console.log("缺少juse.js,搜索功能取消");
                return false;
              }
              var thisSearch=new Fuse(thisListData,{keys:["text"]});
              var result=thisSearch.search(inputVal);
              $thisDownListlist.children("ul:eq(0)").addClass("fuse").html(createList(result));
            }
          }
        }// 按键抬起搜索d+Data数据,默认格式[{"text":"abc","value":"abc"},...]
      };
      keyUpRun(e.getKey());
    },//下拉输入框及下拉
    clickSwitch:function(event){
      event.preventDefault();
      var $this=$(event.target).closest("a");
      var run=function(){
        $this.hasClass("on") ? $this.removeClass("on") : $this.addClass("on");
      };
      $this.hasClass("disable") ? eval(null) : run();
    },
    clickInputFile:function(event){
      event.preventDefault();
      var $thisInput=$(this);
      var $trueInput=$(this).parent().find("input[type='file']").eq(0);
      var syncVal=function(){
        var fileName=$trueInput.val().split("\\").pop();
        $thisInput.val(fileName);
      };
      $trueInput.off("change");
      $trueInput.on("change",this,syncVal);
      $thisInput.blur();
      $trueInput.trigger("reset").trigger("focus").click();
    },
    enterTitle:function(e){
      e.preventDefault();
      var $this=$(this);
      if($this.attr("data-elfBubble")) return false;
      var thisTitle=$this.attr("data-title") ? $this.attr("data-title").toDecimal() : $this.attr("title").toDecimal();
      var onlyShowTop=$this[0].tagName==="INPUT"||$this[0].tagName==="TEXTAREA"||($this.height()<50);
      var $elfBubble;
      var showTitle=function(e){
        var contentId="title_"+new Date().getTime();
        var moveTitle=function(e){
          e.preventDefault();
          e.stopPropagation();
          if(typeof($elfBubble)==="undefined"||$elfBubble.length===0){
            showTitle(e);
            return false;
          }
          if(Number(e.pageX)!==0&&Number(e.pageY)!==0){
            $elfBubble.css({
              "left":(e.pageX-$elfBubble.width()/2),
              "top":!onlyShowTop ? (e.pageY-$elfBubble.outerHeight()-20) : $elfBubble.offset().top//没考虑气泡显示到页面外部的情况
            });
          }
        };
        var hideTitle=function(e){
          if(e) $this.off("mousemove");
          var $contentId=$("#"+contentId);
          var $contentIdText=$("#"+contentId+"Text");
          if($contentId.length===0) return false;
          var size={
            "outerHeight":$contentId.outerHeight(),
            "innerWidth":$contentId.width(),
            "innerHeight":$contentId.height()
          };
          var hideLineId=function(){
            $contentIdText.empty();
            var lineId="lineId"+new Date().getTime();
            $contentId.append('<div style="width:'+size.innerWidth+'px;position:absolute;top:'+(size.outerHeight/2)+'px;"><p id="'+lineId+'" style="margin:0 auto;width:'+size.innerWidth+'px;height:1px;font-size:0;background:-webkit-linear-gradient(left, rgba(255, 255, 255,0), rgba(255, 255, 255,1) 20%, rgba(255, 255, 255, 1) 80%, rgba(255, 255, 255, 0));opacity:0"></p></div>');
            $("#"+lineId).smooth({
              "opacity":1,
              "width":1,
              "height":1
            },pri.fadeTime*0.75,false,"Linear").smooth({"opacity":0},0,function(){
              $contentId.remove();
              $this.elfBubbleExit(function(){$this.attr("title",$this.attr("data-title")).removeAttr("data-title");});
            },"Linear");
          };
          $contentIdText.smoothStop(true,true).css({"height":size.innerHeight}).smooth({
            "height":1,
            "margin-top":size.innerHeight/2-1
          },pri.fadeTime*0.75,false,"Linear");
          $contentIdText.find("p").smoothStop(true,true).css({"height":size.innerHeight}).smooth({"margin-top":0-(size.innerHeight/2-1)},pri.fadeTime*0.75,hideLineId,"Linear");
          $("#"+$this.attr("data-elfBubble")).find("svg").smoothStop(true,false).smoothOut(pri.fadeTime,false);
        };
        if(Number(e.pageX)!==0&&Number(e.pageY)!==0) $this.elfBubble({
          "x":e.pageX,
          "y":!onlyShowTop ? e.pageY : $this.offset().top,
          "html":'<div class="font12 break" style="padding:10px;max-width:300px;position:relative;z-index:1;" id="'+contentId+'"><div style="display:block;overflow:hidden;" id="'+contentId+'Text"><p style="text-align:justify;line-height:18px;">'+thisTitle+'</p></div></div>',
          "callback":function(){
            $elfBubble=$("#"+contentId).parent();
            $this.off("mousemove").on("mousemove",moveTitle);
            $this.one("mouseleave",hideTitle);
            if($this[0].tagName==="IMG") setTimeout(hideTitle,Math.max(1000,thisTitle.length*200));
          }
        });
      };
      if($this.closest(".ui-datepicker").length>0|| !$this.attr("title")||$this.attr("title")==="") return false;
      $this.attr("data-title",$this.attr("title")).removeAttr("title");
      showTitle(e);
    },
    enterEllipsis:function(e){
      e.preventDefault();
      var $this=$(this);
      if($this.attr("data-title")) return false;
      var isEllipsis=function(dom){
        var checkDom=dom.cloneNode(true),
          parent,
          flag;
        checkDom.style.width=dom.offsetWidth+'px';
        checkDom.style.height=dom.offsetHeight+'px';
        checkDom.style.overflow='auto';
        checkDom.style.position='absolute';
        checkDom.style.zIndex= -1;
        checkDom.style.opacity=0;
        checkDom.style.whiteSpace="nowrap";
        checkDom.innerHTML=dom.innerHTML;
        parent=dom.parentNode;//parent如果是td,则需要将checkDom放在td中的相对定位的元素中
        parent.appendChild(checkDom);
        flag=checkDom.scrollWidth>checkDom.offsetWidth;
        parent.removeChild(checkDom);
        return flag;
      };
      if(isEllipsis(this)){
        $this.attr("title",(["INPUT","TEXTAREA"].indexOf($this[0]["tagName"])>=0 ? $this.val() : $this.text())).trigger("mouseenter");
      }
      else{
        $this.removeAttr("title");
      }
    },
    clickInputNumber:function(e){
      e.preventDefault();
      var $this=$(this);
      var $thisInput=$this.closest(".inputNumber").find("input");
      var thisNumber=$thisInput.val();
      var thisStyle=document.defaultView.getComputedStyle($thisInput[0],null);
      var paddingLeft=parseInt(thisStyle.textIndent)+parseInt(thisStyle.paddingLeft);
      var paddingRight=parseInt(thisStyle.perspectiveOrigin.split(" ")[1])+parseInt(thisStyle.paddingLeft);
      var numberWidth=0;//输入的数值宽度
      var runThis=function(){
        if($this.hasClass("add")){
          thisNumber++;
        }
        else if($this.hasClass("subtract")){
          thisNumber--
        }
        thisNumber=Math.max($thisInput.attr("min")||Number.NEGATIVE_INFINITY,thisNumber);
        thisNumber=Math.min($thisInput.attr("max")||Number.POSITIVE_INFINITY,thisNumber);
        numberWidth=($thisInput.attr("max")||$thisInput.val()).toString().length*parseInt(thisStyle.fontSize)+paddingLeft+paddingRight;
        if(numberWidth>parseInt(thisStyle.width)) $thisInput.css({"width":numberWidth});
        $thisInput.val(thisNumber).focus();
      };
      var waitRunThis=function(){
        if(typeof(window.intervalInputNumber)!=="undefined") clearInterval(window.intervalInputNumber);
        window.intervalInputNumber=setInterval(runThis,100);
      };
      runThis();
      if(typeof(window.waitContinueInput)!=="undefined") clearTimeout(window.waitContinueInput);
      window.waitContinueInput=setTimeout(waitRunThis,700);
      $(document).on("mouseup","body",function(){
        if(typeof(window.waitContinueInput)!=="undefined") clearTimeout(window.waitContinueInput);
        if(typeof(window.intervalInputNumber)!=="undefined") clearInterval(window.intervalInputNumber);
      });
    },
    InputNumber:function(e){
      e.preventDefault();
      var $thisInput=$(this);
      var runThis=function(event){
        var thisNumber=$thisInput.val();
        thisNumber=Math.max($thisInput.attr("min")||Number.NEGATIVE_INFINITY,thisNumber);
        thisNumber=Math.min($thisInput.attr("max")||Number.POSITIVE_INFINITY,thisNumber);
        $thisInput.val(thisNumber);
        if(typeof(event)==="undefined"){
          $(document).trigger("mouseover");
        }//setTimeout执行的runThis
        else{
          if(typeof(window.waitInputNumber)!=="undefined") clearTimeout(window.waitInputNumber);
        }
      };
      if(typeof(window.waitInputNumber)!=="undefined") clearTimeout(window.waitInputNumber);
      window.waitInputNumber=setTimeout(runThis,5000);
      $(document).one("mouseover",this,runThis);
    },
    enableDrag:function(){
      //with($thisPanel){
      var baseX,
        baseY,
        eX,
        eY,
        bodyW,
        bodyH,
        moveX,
        moveY;
      var $thisPanel=$(this);
      var $body=$("body");
      baseX=$thisPanel.offset().left;
      baseY=$thisPanel.offset().top;
      eX=event.pageX;
      eY=event.pageY;
      bodyW=$body.width();
      bodyH=$body.height();
      var moveThis=function(e){
        e.preventDefault();
        moveX=e.pageX-eX+baseX;
        moveY=e.pageY-eY+baseY;
        if(e.pageX<0||e.pageY<0||e.pageX>bodyW||e.pageY>bodyH) return false;
        $thisPanel.css({
          "left":$thisPanel.width()===bodyW ? 0 : moveX,
          "top":moveY
        });
      };
      var moveUp=function(){
        document.removeEventListener("mousemove",moveThis);
        document.removeEventListener("mouseup",moveUp);
        $("body").css({
          "-moz-user-select":"",
          "-webkit-user-select":"",
          "-ms-user-select":"",
          "-khtml-user-select":"",
          "user-select":""
        });
      };
      $thisPanel.css({
        "cursor":"move",
        "position":"absolute"
      });
      $body.css({
        "-moz-user-select":"none",
        "-webkit-user-select":"none",
        "-ms-user-select":"none",
        "-khtml-user-select":"none",
        "user-select":"none"
      });
      document.addEventListener("mousemove",moveThis);
      document.addEventListener("mouseup",moveUp);
    },//拖拽功能,
    alertImg:function(){
      var $this=$(this);
      var fileName=$this.attr("src").split("/").pop().split(".")[0];
      var imgBoxId="img"+fileName.replace(/[^\w\s]/g,"_");
      var alertCallback=function(){
        $imgBox=$("#"+imgBoxId,window.top.document);
        $thisImg=$imgBox.find("img");
        var blurBg=function(_io){
          var io=_io||"on";
          var $header=$(window.top.document).find("header");
          var $main=$(window.top.document).find(".main");
          var $footer=$(window.top.document).find("footer");
          if(io==="on"){
            $header.addClass("blur");
            $main.addClass("blur");
            $footer.addClass("blur");
          }
          else{
            $header.removeClass("blur");
            $main.removeClass("blur");
            $footer.removeClass("blur");
          }
        };
        var dblclick=function(e){
          e.stopPropagation();
          var runThis=function(){
            var thisCss={};
            if($thisImg[0].style.width==="100%"){
              var originalSize=$thisImg.attr("data-original-size");
              thisCss={
                "width":originalSize.split("*")[0],
                "left":($(window.top.document).width()-originalSize.split("*")[0])/2,
                "top":($(window.top).height()-originalSize.split("*")[1])/2+$(window.top).scrollTop()
              };
            }
            else{
              thisCss={
                "width":"100%",
                "left":0,
                "top":$(window.top).scrollTop()
              };
            }
            $thisImg.smooth(thisCss);
          };
          runThis();
        };
        var blurClick=function(e){
          e.stopPropagation();
          if(pri.isIn(e.pageX,e.pageY,$thisImg)===false){
            $imgBox.elfAlertExit({
              "callback":function(){
                $thisImg.off("dblclick",dblclick);
                $thisImg.removeAttr("data-original-size");
              }
            });
          }
        };
        $thisImg.css({
          "width":"100%"
        }).css({
          "left":0,
          "top":Math.max(0,($(window.top).height()-$thisImg.height())/2+$(window.top).scrollTop())
        });
        //blurBg("on");
        $thisImg.off("dblclick").on("dblclick",dblclick);
        $imgBox.off("click").on("click",blurClick);
        $imgBox.closest(".showPanel").find(".elfAlertClose").css({
          "top":"-20px",
          "position":"fixed"
        }).smooth({"top":0});//.one("click",function(){blurBg("off");});
        if($.fn.hasOwnProperty("elfDrag")) $thisImg.elfDrag();
      };
      var $imgBox=$("#"+imgBoxId,"body");
      if($imgBox.length===0){
        $("body").append('<div id="'+imgBoxId+'" style="display:none;"><img src="'+($this.attr("data-src") ? $this.attr("data-src") : $this.attr("src"))+'"  style="display:block;position:absolute;"></div>');
        $imgBox=$("#"+imgBoxId);
      }
      var $thisImg=$imgBox.find("img");
      $thisImg.attr("data-original-size",$this.width()+"*"+$this.height());
      $imgBox.css({
        "width":$(window.top.document).width(),
        "height":$(window.top.document).height()
      }).elfAlert({
        "fadeTime":pri.fadeTime,
        "animate":0,
        "callback":alertCallback
      });
    },
    clickHasList:function(){
      var $this=$(this);
      var clickHasList=function(){
        var $thisParent=$this.parent();
        if($thisParent.hasClass("unfold")){
          $thisParent.removeClass("unfold")
        }
        else{
          $thisParent.addClass("unfold");
        }
      };
      if($this.hasClass("hasList")) clickHasList();
    },
    inputErrReset:function(){
      var $indicates=$(".indicate");
      if($("[indicate]").length===0){
        $indicates.remove();
        return false;
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
    },
    triggerSubmit:function(evt){
      //    evt=(evt) ? evt : ((window.event) ? window.event : ""); //兼容IE和Firefox获得keyBoardEvent对象
      //    var key=evt.keyCode ? evt.keyCode : evt.which; //兼容IE和Firefox获得keyBoardEvent对象的键值
      var $thisInput=$(evt.target);
      var key=evt.getKey();
      if(key===13){
        if($thisInput.hasClass("listSelected")&&$thisInput.parent().hasClass("unfold")) return false;//排除downList在展开时触发submit
        if($thisInput.attr("type")==="search"&&$(".searchHistory.unfold").length>0) return false;//排除搜索框历史在展开时触发submit
        evt.preventDefault();
        $thisInput.blur();
        if($thisInput.closest("form").find("a.submit").length=1){
          $thisInput.closest("form").find("a.submit").trigger("click");
        }
        else if($thisInput.closest("form").find("a.submit").length>1){
          $thisInput.closest("form").find("a.submit").find(":visible").eq(0).trigger("click");
        }
        else{
          $thisInput.closest("div.alertCont").find("form.alertButtonBox").find("a.submit").eq(0).trigger("click");
        }
      }
    }
  };
  $.fn.extend({
    'setSelectVal':function(_val){
      var val=$.extend({
        "text":"",
        "value":"",
        callback:null,
        callbackArr:[]
      },_val);
      val.text=val.text.toString();
      val.value=val.value.toString();
      var $thisDownList=$(this);
      var $listSelected=$thisDownList.find(".listSelected").eq(0);
      var selectorType=$listSelected[0].tagName.toUpperCase();
      var $thisLi=$thisDownList.children("ul").find("li");
      var selectSuccess=false;
      var $thisA=null;
      var getText=function(thisVal){
        var thisText="";
        for(var i=0; i<$thisLi.length; i++){
          $thisA=$thisLi.eq(i).children("a:eq(0)");
          if(typeof($thisA.attr("data-value"))!=="undefined"&&$thisA.attr("data-value")===thisVal){
            thisText=$thisA.text();
            break;
          }
        }
        return thisText;
      };
      var getVal=function(thisText){
        var thisVal="";
        for(var i=0; i<$thisLi.length; i++){
          $thisA=$thisLi.eq(i).children("a:eq(0)");
          if($thisA.text()===thisText){
            thisVal=$thisA.attr("data-value");
          }
        }
        return thisVal||"";
      };
      if(val.text===""&&val.value!==""){
        val.text=getText(val.value);
      }
      else if(val.text!==""&&val.value===""){
        val.value=getVal(val.text);
      }
      for(var i=0; i<$thisLi.length; i++){
        $thisA=$thisLi.eq(i).children("a:eq(0)");
        if($thisA.attr("data-value")&&$thisA.attr("data-value")===val.value){
          selectSuccess=true;
        }
        else if($thisA[0].hasAttribute("data-value")&&$thisA.attr("data-value")===""&&val.value===""){
          selectSuccess=true;
        }
        else if(typeof($thisA.attr("data-value"))==="undefined"&&$thisA.text()===val.text){
          selectSuccess=true;
        }
        if(selectSuccess){
          $thisLi.eq(i).addClass("curr").siblings("li").removeClass("curr");
          break;
        }
      }
      if(selectSuccess){
        if(selectorType==="INPUT"){
          $listSelected.val(val.text).attr("placeholder",val.text);
          if(val.callback!==null) val.callback.call(this,val.callbackArr);
        }
        else if(selectorType==="A"){
          $listSelected.find("span").text(val.text);
          if(val.callback!==null) val.callback.call(this,val.callbackArr);
        }
        return this.each(function(){});
      }
      else{
        if(selectorType==="INPUT"&&$thisDownList.hasClass("searchMore")){
          $listSelected.val("").attr("placeholder",val.text||val.value);
        }
        return this.each(function(){});
        //alert("下拉菜单值未成功赋值。");
      }
      //if($thisDownList.hasClass("unfold")) $thisDownList.children(".listSelected").trigger("click");
    },//设置下拉菜单值
    'getSelectVal':function(){
      var reData;
      var $thisDownList=$(this);
      var $current=$thisDownList.find("li.curr").find("a");
      var getThisInput=function(){
        var $listSelected=$thisDownList.find("input.listSelected");
        return {
          "value":$listSelected.val(),
          'text':$listSelected.val()
        }
      };
      if($current.length===0){
        if($thisDownList.hasClass("searchMore")){
          reData=getThisInput();
        }
        else{
          reData={
            "value":"",
            "text":""
          };
        }
      }
      else{
        reData={
          "value":$current.attr("data-value") ? $.trim($current.attr("data-value")) : "",
          'text':$.trim($current.text())
        };
      }
      /*if($thisDownList.hasClass("searchMore")&&$thisDownList.find("input.listSelected").length>0&&reData===null){
       reData=getThisInput();
       }*/
      return reData;
    },//获取下拉菜单的值及文字
    'setCheckboxGroup':function(_numberOrArray){//Number||Array 值Number代表勾选前几项,Array代表勾选值为什么的复选框
      //用于操作复选框组
      //author:baiyu@qq.com
      //version:0.00.001
      //date:2018-03-30 22:53:58
      var $thisGroup=$(this);
      if(typeof(_numberOrArray)==="object"&&_numberOrArray.length>=0){
        $thisGroup.find("a.checkbox").each(function(ii,ele){
          if(_numberOrArray.indexOf(ele.getAttribute("data-value"))>=0){
            $(ele).addClass("select");
          }
          else{
            $(ele).removeClass("select");
          }
        });
      }
      else if(typeof(_numberOrArray)==="number"&&_numberOrArray>=0){//选择前几项,0代表清空
        $thisGroup.find("a.checkbox").each(function(ii,ele){
          if(ii<_numberOrArray){
            $(ele).addClass("select");
          }
          else{
            $(ele).removeClass("select");
          }
        });
      }
      else if(typeof(_numberOrArray)==="number"&&_numberOrArray<0){//_numberOrArray为负数时为反选,例如-1
        $thisGroup.find("a.checkbox").each(function(ii,ele){
          if($(ele).hasClass("select")){
            $(ele).removeClass("select");
          }
          else{
            $(ele).addClass("select");
          }
        });
      }
      else{
        if(typeof(console.log)!=="undefined") console.log("%c$.fn.setCheckboxGroup参数无效","color:red");
      }
      return this.each(function(){});
    },//设置复选组
    'getCheckboxGroup':function(){
      var reArr=[];
      var $thisGroup=$(this);
      $thisGroup.find("a.checkbox.select").each(function(ii,ele){
        reArr.push({
          "value":ele.getAttribute("data-value"),
          'text':$.trim($(ele).text())
        });
      });
      return reArr;
    },//获取复选组的值
    'setRadioGroup':function(val){
      var $thisGroup=$(this);
      $thisGroup.find("a.radio").removeClass("select");
      $thisGroup.find("a.radio").each(function(ii,ele){
        if(ele.getAttribute("data-value")===val){
          $(ele).addClass("select");
        }
      });
      return this.each(function(){});
    },//设置单选组
    'getRadioGroup':function(){
      var $selected=$(this).find('a.radio.select');
      if($selected.length===0) return undefined;
      return ({
        "value":$selected.eq(0).attr("data-value"),
        'text':$.trim($selected.eq(0).text())
      });
    },//获取单选组的值
    'bindCopyButton':function(buttonHtml){
      var thisRandom=new Date().getTime()+"_";
      $(this).each(function(i,ele){
        $(ele).after('<div id="copyButtonParent'+thisRandom+i+'" class="copyButtonParent" style="display:inline-block;">'+buttonHtml+'</div>');
        var clipboard=new Clipboard('#'+"copyButtonParent"+thisRandom+i,{text:function(){return $(ele).val()||$(ele).text();}});
        clipboard.on('success',function(){
          if($.fn.markIndicate){
            $(ele).markIndicate({"font":"复制成功!"});
          }
          else{
            alert("复制成功!")
          }
        });
        clipboard.on('error',function(){
          alert('您的浏览器由于不支持复制功能，请自行手动复制如下内容：\n'+$(ele).val()||$(ele).text());
        });
      });
      return this.each(function(){});
    },//在元素后生成一个复制按钮并绑定
    'setCopyButton':function(_$button){
      var $textBox=$(this);
      var $button=_$button;
      var thisText=function(){return $.trim($textBox.val()||$textBox.text())};
      var clipboard=new Clipboard($button[0],{text:thisText});
      clipboard.on('success',function(){
        $textBox.markIndicate({"font":"复制成功!"});
      });
      clipboard.on('error',function(){
        alert('您的浏览器由于不支持复制功能，请自行手动复制如下内容：\n'+thisText());
      });
      return this.each(function(){});
    },//在元素设置一个已经存在的按钮做为复制按钮
    'setWelcome':function(){//{}中的内容可搜索了解更多 
      var holiday={
        '1.1':'{元旦}快乐！2018祝您发发发!',
        '2.14':'{情人节}快乐！',
        '3.8':'今天是	{国际妇女节}。',
        '4.1':'今天是{愚人节}。',
        '5.1':'{劳动节}快乐！',
        '5.4':'{中国青年节}快乐！',
        '5.31':'今天是{世界无烟日}。',
        '6.1':'今天是{儿童节}。',//'6.17':'今天是{世界防治荒漠化和干旱日}。',
        '6.20':'今天是{世界难民日}。',
        '6.23':'今天是{国际奥林匹克日}。',
        '6.25':'今天是{全国土地日}。',
        '6.26':'今天是{国际禁毒日}、{联合国宪章日}。',
        '7.1':'今天是{中国建党节}、	{香港回归}纪念日。',
        '7.7':'今天是{中国人民抗日战争纪念日}。',
        '7.11':'今天是{世界人口日}、{世界海事日}。',
        '7.26':'今天是{世界语言创立日}。',
        '8.1':'今天是{建军节}。',
        '8.6':'今天是{国际电影节}。',
        '8.8':'今天是{中国男子节}(爸爸节)。',
        '8.15':'今天是{日本正式宣布无条件投降日}(1945)。',
        '9.1':'今天是{全国中小学开学日}。',
        '9.3':'今天{	抗日战争胜利纪念日}。',
        '9.8':'今天是{国际扫盲日}。',
        '9.10':'今天是{教师节}、{世界预防自杀日}。',
        '9.16':'今天是{国际臭氧层保护日}。',
        '9.18':'今天是{中国国耻日}。',
        '9.20':'今天是{全国爱牙日}、{全国公民道德宣传日}。',
        '9.21':'今天是{国际和平日}。',
        '9.22':'今天是{无车日}。',
        '9.27':'今天是{世界旅游日}。',
        '9.28':'今天是{世界教师节}、{孔子诞辰日}。',
        '10.1':'{国庆节}快乐！',
        '10.10':'今天是{辛亥革命纪念日}(1911)。',
        '10.16':'今天是{世界粮食日}。',
        '10.24':'今天是{联合国日}。',
        '11.7':'今天是{苏联十月革命纪念日}。',
        '11.11':'今天是{光棍节}, 请先思后行。',
        '11.16':'今天是{国际容忍日}(网络攻击除外)。',
        '12.1':'今天是{世界艾滋病日}！艾滋病主要通过血液、精液、乳汁和尿液传播。',
        '12.24':'{平安夜}快乐!...♩♪♫♬平安的夜,有雪花飞满天',
        '12.25':'{圣诞节}快乐！',//以下为特殊节日,注意及时更新
        '2.16':'{春节}快乐！青松云安全正在为您保驾护航, 并祝您新年大吉,身体健康,万事如意!',//2018
        '3.2':'{元宵佳节}快乐！',//2018
        '3.18':'{龙头节}快乐！',//2018
        '4.5':'今天是{清明节}。',//2018
        '6.18':'今天是{端午节}。',//2018
        '8.17':'{七夕节}快乐！',//2018
        '9.24':'{中秋节}快乐！',//2018
        '10.17':'今天是{重阳节}。',//2018
        '5.13':'今天是{母亲节},祝天下的母亲幸福安康！',//5月第二个星期日//2018
        '6.17':'今天{世界防治荒漠化和干旱日},也是{父亲节},祝天下的父亲幸福安康！',//6月第三个星期日//2018
        '11.23':'今天是{感恩节},知恩图报,善莫大焉。',//11月第四个星期四//2017
        '12.22':'{冬至}快乐! 吃饺子不怕冷'//2017
      };
      var tips=['通过headLoader.js加载,不依赖浏览器缓存,响应迅速急您所急.'];
      var thisUser=$.cookie("nickname")||"亲";
      var selectOne=function(arr,_i){return typeof(_i)!=="undefined" ? arr[_i] : arr[Math.abs(Math.floor(Math.random()*arr.length-0.0000000000000001))]};
      var divination=function(){
        var getMonthWeek=function(){
          var today=new Date(); //获取当前时间
          var y=today.getFullYear();
          var m=today.getMonth()+1;
          var d=today.getDate();
          var date=new Date(y,parseInt(m)-1,d),
            w=date.getDay(),
            d2=date.getDate();
          return Math.ceil((d2+6-w)/7);
        };
        var thisDate=new Date();
        var timer={
          "year":thisDate.getFullYear(),
          "month":thisDate.getFullYear()+""+thisDate.getMonth(),
          "week":thisDate.getFullYear()+""+thisDate.getMonth()+""+getMonthWeek(),
          "day":(thisDate.getTime()/(1000*60*60*24)).toFixed(0)
        };
        this.timer="day"; //day:日,week:周,month:月,year:年
        this.userName="";
        this.data=[];
        this.getData=function(_length){
          if(this.userName===""){
            alert("敢问施主大名?");
            return false;
          }
          if(this.data.length===0){
            alert("缺少易经数据.");
            return false;
          }
          var nameCode="";
          for(var i=0; i<this.userName.length; i++){
            nameCode+=this.userName.charCodeAt(i).toString();
          }
          nameCode+=timer[this.timer].toString();
          //nameCode=nameCode.replace(/0/g,"");
          var thisData=this.data;
          var times=3;//抽几轮
          var currentTime=0;
          var selectData={};
          var currentIndex=0;
          var sectionSize=Math.round(thisData.length/nameCode.length);
          var fix=function(_length){
            var length=_length;
            this.getIndex=function(_thisIndex){
              var thisIndex=_thisIndex;
              if(thisIndex>length){
                thisIndex=thisIndex%length;
              }
              return thisIndex;
            };
          };
          var selectCount=0;
          var fixIndex=new fix(thisData.length-1);
          var sortArr=[];
          currentIndex=Number(nameCode)%thisData.length;
          selectData[currentIndex.toString()]={
            "content":thisData[currentIndex],
            "count":nameCode.length*times
          };
          selectCount=selectData[currentIndex.toString()].count;
          var runThis=function(){
            for(i=0; i<nameCode.length; i++){
              if(currentTime>=times) break;
              currentIndex=currentIndex+Number(nameCode.charAt(i))+sectionSize;
              if(currentIndex>thisData.length) currentTime++;
              currentIndex=fixIndex.getIndex(currentIndex);
              selectCount++;
              if(!selectData[currentIndex.toString()]){
                selectData[currentIndex.toString()]={
                  "content":thisData[currentIndex],
                  "count":1
                };
              }
              else{
                selectData[currentIndex.toString()]["count"]++;
              }
            }
            if(currentTime<times){
              runThis();
            }
            else{
              sortArr=[];
              var i=0;
              for(var k in selectData){
                selectData[k]["percent"]=(selectData[k]["count"]/selectCount)*100;
                sortArr.push(selectData[k]);
                i++;
              }
              sortArr=sortArr.sort(function(a,b){return b["count"]-a["count"]});
              sortArr=sortArr.splice(0,typeof(_length)!=="undefined" ? Number(_length) : sortArr.length);
            }
          };
          runThis();
          return sortArr;
        };
      };//需要设置this.data,this.userName,this.timer,通过this.getData(_length)得出降序数组
      var guessData=new divination();//this.data,this.userName,this.timer....返回this.getData(_length)数组
      guessData.data=["发财","买彩券中奖","艳遇","有人请吃饭","遇到贵人","遇到开心的事","得到老板的赞赏","收到红包","不用加班","看到喜欢的人","抢红包手气最佳","又牛了一点","完成一个心愿","打游戏会赢","变得更迷人了","表白会成功","收到爱慕者的礼物","收到祝福","想买的宝贝恰好特价","粉丝又涨了","有人想你了","许个愿望会实现"];
      guessData.userName=thisUser;
      guessData.timer="day";//day:日,week:周,month:月,year:年
      var todayData=guessData.getData(2);
      var textArr=[];
      for(var i=0; i<todayData.length; i++){
        textArr.push(todayData[i]["content"]+'(概率'+todayData[i]["percent"].toFixed(2)+'%)');
      }
      var guessString='';
      if(textArr.length>0){
        guessString='掐指一算，您今天的时运: '+textArr.join(", ")+'';
      }
      else{
        guessString="";
      }
      var helloData=[{
        "time":0,
        "greeting":"深夜好",
        "say":"天道酬勤，必须地！"
      },{
        "time":3,
        "greeting":"凌晨好",
        "say":"请保重身体，你好我也好！"
      },{
        "time":6,
        "greeting":"早上好",
        "say":"晨光一闪,幸福满满！"
      },{
        "time":9,
        "greeting":"上午好",
        "say":guessString
      },{
        "time":12,
        "greeting":"中午好",
        "say":guessString
      },{
        "time":13,
        "greeting":"下午好",
        "say":guessString
      },{
        "time":17,
        "greeting":"傍晚好",
        "say":"为你今天的工作点个赞, 没毛病!"
      },{
        "time":19,
        "greeting":"晚上好",
        "say":"久仰久仰，名字很响"
      },{
        "time":23.5,
        "greeting":"午夜好",
        "say":"辛苦了, 别怕,有我。"
      }];//time必须为先后顺序
      var $welcomeBox=$(this);
      var thisDate=new Date();
      var passedTimes=0;
      var nextIntervalDelayH=0;
      var nextIntervalDelayMM=0;
      var thisK=0;
      var runThis=function(){
        thisDate=new Date();
        passedTimes=thisDate.getHours()+thisDate.getMinutes()/60;//今天已经过去的时间
        for(var k=0; k<helloData.length; k++){
          if(passedTimes>=helloData[k].time){
            thisK=k;
          }
        }
        var reHoliday=function(){
          var thisHolidy=holiday[(thisDate.getMonth()+1)+'.'+thisDate.getDate()]||"";
          if(thisHolidy!==""){
            thisHolidy=thisHolidy.replace(/{.+}/g,'<a href="https://www.baidu.com/s?wd=$&" target="_blank" title="点击了解更多...">$&</a>').replace(/[{}]/g,"");
          }
          return thisHolidy!=="" ? thisHolidy : false;
        };
        var thisWelcome='<p class="fLeft"><span class="font20">'+helloData[thisK].greeting+'，</span><span class="font20 striking">'+thisUser+'</span></p>';
        thisWelcome+='<p class="fLeft mgl20 font12">';
        thisWelcome+=(reHoliday() ? '<span>'+reHoliday()+'</span><br>' : '<span class="displayB font0 mgt8"></span>');
        thisWelcome+='<span>'+helloData[thisK].say+'</span>';
        thisWelcome+='</p>';
        thisWelcome+='<p class="displayIB font12  radius1em pd3  grayBg mgt5 fRight hidden"><i class="iconPushpin font16 mgl5 vTop" style="transform: rotate(30deg);margin-top:-0.25em;"></i><span class="mgl5 mgr5">'+selectOne(tips)+'</span></p>';
        $welcomeBox.addClass("fClear").html(thisWelcome);
        nextIntervalDelayH=typeof(helloData[thisK+1])!=="undefined" ? helloData[thisK+1].time-passedTimes : 24-passedTimes;
        nextIntervalDelayMM=(nextIntervalDelayH*60*60*1000)-(thisDate.getSeconds()*1000);
        setTimeout(runThis,nextIntervalDelayMM);
      };
      runThis();
      return this.each(function(){});
    },//设置为欢迎语
    "elfProgress":function(_val){
      /*
       * 进度条插件
       * author:baiyukey@qq.com
       * version:0.1.3
       * 2017年9月16日.
       */
      var $this=$(this);
      if(typeof(_val)==="undefined") return $this[0]["currentPercent"]||0;
      var val=$.extend({
        "number":0,//目标百分比
        "time":300,//完成动画时长
        "color":$(this).css("color"),//进度条颜色
        "fontSize":0,
        "colorX":"",//进度条与百分比数值交叉部分的颜色
        "callback":null,
        "callbackArr":""
      },_val);
      var reContrastColor=function(_thisColor){
        var rgb=_thisColor.replace(/[rgba()]/g,'').split(",");
        var reValue=function(value){
          var a=255-value;
          if(a>85&&a<170){
            a=a-128>0 ? 85 : 170;
          }
          return a;
        };
        return "rgba("+reValue(rgb[0])+','+reValue(rgb[1])+','+reValue(rgb[2])+','+(rgb[3]|1)+')'
      };
      if(val.colorX==="") val.colorX=reContrastColor(val.color);
      val.fontSize=val.fontSize===0 ? parseInt(val.fontSize) : $this.innerHeight()/3*2;
      var fixedLength=val.number.toString().split(".").length>=2 ? val.number.toString().split(".")[1].length : 0;//百分比小数点后保留几位
      val.number=Math.min(Number(val.number),Number((100).toFixed(fixedLength)));
      val.number=Math.max(Number(val.number),Number((0).toFixed(fixedLength)));
      var thisDateTime=new Date().getTime();
      var endTime=thisDateTime+Number(val.time);
      if(!$this[0]["currentPercent"]) $this[0]["currentPercent"]=0;
      $this[0]["elfProgressId"]="elfProgress"+thisDateTime;
      var currentPercent=Number($this[0]["currentPercent"]);
      var elfProgressId=$this[0]["elfProgressId"];
      var thisWidth=$this.width();
      var currentWidth=(currentPercent/100)*thisWidth;
      var changeWidth=((Math.abs(val.number-currentPercent)/100)*thisWidth);
      var changeTimes=Math.max(1,val.time/(1000/60));//按照每秒60帧计算
      var perChangeWidth=changeWidth/changeTimes;
      if(val.number<currentPercent){
        perChangeWidth=0-perChangeWidth;
      }
      var $thisBar=$this.find("span.currentBackground").length>0 ? $this.find("span.currentBackground").smoothStop(true,false) : $this.append('<span class="currentBackground"  style="width:0;"></span>').find("span.currentBackground");
      var $percentText=$this.find("span.percentText").length>0 ? $this.find("span.percentText") : $this.append('<span class="percentText"></span>').find("span.percentText");
      $thisBar.css({
        "background-color":val.color,
        "height":($this.innerHeight()-parseInt($this.css("padding-top"))-parseInt($this.css("padding-bottom")))
      });
      $percentText.css({
        "position":"absolute",
        "line-height":($this.innerHeight()-parseInt($this.css("padding-top"))-parseInt($this.css("padding-bottom")))+"px",
        "height":($this.innerHeight()-parseInt($this.css("padding-top"))-parseInt($this.css("padding-bottom")))+"px",
        "left":$this.css("padding-left"),
        "top":$this.css("padding-top"),
        "font-size":($this.innerHeight()<12 ? 0 : Math.max(12,val.fontSize)),
        "width":$this.innerWidth()-parseInt($this.css("padding-left"))-parseInt($this.css("padding-right"))
      });
      var setCurrentVal=function(){
        if($this[0].elfProgressId!==elfProgressId) return false;//id改变,说明中途重新执行了elfProgress
        thisDateTime=new Date().getTime();
        if(thisDateTime>endTime){
          currentPercent=val.number;
        }
        else{
          currentWidth+=perChangeWidth;
          currentPercent=Math.min(99.9999999,currentWidth/thisWidth*99.9999999);//保证时间未结束前,不让当前值等于目标值
          if(perChangeWidth>0&&currentPercent>val.number) currentPercent=val.number;
          if(perChangeWidth<0&&currentPercent<val.number) currentPercent=val.number;
        }
        $this[0]["currentPercent"]=currentPercent;
        $percentText.text(Number(currentPercent).toFixed(fixedLength)+"%");
        $percentText.css({
          'background':'-webkit-gradient(linear, left top,right top,  color-stop(0%,'+val.colorX+'), color-stop('+currentPercent+'%,'+val.colorX+'), color-stop('+currentPercent+'%,'+val.color+'))',//进度条未接触时为#369eac
          '-webkit-background-clip':'text',
          '-webkit-text-fill-color':'transparent'
        });
        if(thisDateTime<endTime){
          $thisBar.css({'width':currentPercent+'%'});
          requestAnimationFrame(setCurrentVal);
        }
        else{
          $thisBar.smooth({'width':val.number+'%'},1000/60*2,false,"Linear");
          if(val.callback!==null) val.callback.call(this,val.callbackArr);
        }
      };
      setCurrentVal();
      return this.each(function(){});
    },//实例等添加
    "elfCircleProgress":function(_val){
      //author:baiyukey@qq.com
      //version:qs_0.00.003
      //2018-07-30 16:23:28
      let $this=$(this);
      if(typeof(_val)==="undefined") return $(this)[0]["circlePercent"]||0;
      let val=$.extend({
        "number":0,
        "formatter":$this[0]["formatter"]||"[number]",
        "duration":1000,
        "callback":false,
        "callbackArr":undefined
      },(/\d/.test(_val) ? {number:parseFloat(_val)} : _val));
      $this[0]["formatter"]=val.formatter;
      $this[0]["animating"]="finish";
      let endTime=new Date().getTime()+val.duration;
      let runThis=function(){
        $this[0]["animating"]="begin";
        let originalVal=/\d/.test($this[0]["circlePercent"]) ? Number($this[0]["circlePercent"]) : 0;
        let activeVal=originalVal;//动画每帧的百分比数值
        let targetVal=Math.max(0,Math.min(100,Number(val.number)));//动画最终的百分比数值
        let animateTime=val.duration/(1000/60);
        let thisTween={
          easeIn:function(t,b,c,d){
            return c*(t/=d)*t+b;
          },
          easeOut:function(t,b,c,d){
            return -c*(t/=d)*(t-2)+b;
          },
          easeInOut:function(t,b,c,d){
            if((t/=d/2)<1) return c/2*t*t+b;
            return -c/2*((--t)*(t-2)-1)+b;
          }
        };
        let thisTime=0;
        let reHtml=function(_number){
          return val.formatter ? val.formatter.replace('[number]',_number) : "";
        };
        let isTimeOver=false;
        let animateFrame=function(){
          if($this[0]["animating"]==="finish") return false;
          isTimeOver=new Date().getTime()>=endTime;
          activeVal=thisTween[targetVal>originalVal ? "easeOut" : "easeIn"](thisTime,originalVal,targetVal-originalVal,animateTime);
          thisTime++;
          if((targetVal<=originalVal&&activeVal<=targetVal&&isTimeOver)||(targetVal>=originalVal&&activeVal>=targetVal&&isTimeOver)||isTimeOver){
            activeVal=targetVal;
            $this[0]["animating"]="finish";
            $this[0]["circlePercent"]=targetVal;
          }
          else{
            //activeVal=activeVal.toFixed(0);
            requestAnimationFrame(animateFrame);
          }
          $this[0]["circlePercent"]=activeVal;
          if(activeVal===targetVal&&isTimeOver&&val.callback) val.callback.call(this,val.callbackArr);
          $this.find(".text").html(reHtml(activeVal.toFixed(0))).end().find(".turboIn").find("svg").find("circle").attr("stroke-dasharray",activeVal/100*106.81415022205297+",106.81415022205297");
        };
        if(/\d/.test($this[0]["circlePercent"])){
          animateFrame();
        }
        else{
          $this.addClass("circlePercent").html('<b class="turboInOut" style="font-size:100px;user-select:none;"><i class="text">'+targetVal+'</i><i class="turboOut"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 40 40"><circle xmlns="http://www.w3.org/2000/svg" fill="rgba(0,0,0,0)" stroke=" rgba(255,255,255,.25)" stroke-width="1px" stroke-dasharray="55,6.261056745000964,55,6.261056745000964" r="19.5" cx="20" cy="20"></circle></svg></i><i class=""><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 40 40"><circle xmlns="http://www.w3.org/2000/svg" fill="rgba(0,0,0,0)" stroke="rgba(255,255,255,.25)" stroke-width="2px" stroke-dasharray="106.81415022205297,106.81415022205297" r="17" cx="20" cy="20"></circle></svg></i><i class="turboIn"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 40 40"><circle xmlns="http://www.w3.org/2000/svg" fill="rgba(0,0,0,0)" stroke="rgba(255,255,255,.5)" stroke-width="2px" stroke-dasharray='+targetVal/100*106.81415022205297+',106.81415022205297 r="17" cx="20" cy="20"></circle></svg>'+'</i></b>');
          animateFrame();
        }
      };
      requestAnimationFrame(runThis);
      return this.each(function(){});
    },
    "elfBubble":function(_val){
      var $thisEle=$(this);
      var val=$.extend({
        x:0,
        y:0,
        angle:'bottom',
        html:"",
        fadeTime:0,
        callback:null
      },_val);
      var angleMargin=15;
      var elfBubbleId='';
      var elfBubbleTimes=0;
      if($thisEle[0].hasAttribute("data-elfBubble")){
        elfBubbleId=$thisEle.attr("data-elfBubble");
      }
      else{
        elfBubbleId="elfBubble"+new Date().getTime()+"_"+val.fadeTime;
        $thisEle.attr("data-elfBubble",elfBubbleId);
        $("body").append('<div class="'+val.angle+' displayNone" id="'+elfBubbleId+'"></div>');
      }
      var $thisTalkBubble=$("#"+elfBubbleId);
      if($thisTalkBubble.html()!==val.html) $thisTalkBubble.html(val.html);
      if(/</.test($.trim(val.html))===false||($thisTalkBubble.children()&&$thisTalkBubble.children().eq(0)[0].style.position!=="relative")){
        $thisTalkBubble.html('<div style="position:relative;z-index:1">'+val.html+'</div>');
      }
      if($thisTalkBubble.outerHeight()>$(window).innerHeight()) return false;
      var calculate=function(val){
        var x=0,
          y=0,
          angleEvent=0;
        if(val.angle==="bottom"){
          y=Number(val.y)>0 ? val.y-$thisTalkBubble.outerHeight()-angleMargin : $thisEle.offset().top-$thisTalkBubble.outerHeight()-angleMargin;
          x=Number(val.x)>0 ? val.x-($thisTalkBubble.outerWidth()/2) : $thisEle.offset().left+(($thisEle.outerWidth()-$thisTalkBubble.outerWidth())/2);
          angleEvent=180;
        }
        else if(val.angle==="top"){
          y=Number(val.y)>0 ? val.y : $thisEle.offset().top+$thisEle.outerHeight()+angleMargin;
          x=Number(val.x)>0 ? val.x-($thisTalkBubble.outerWidth()/2) : $thisEle.offset().left+(($thisEle.outerWidth()-$thisTalkBubble.outerWidth())/2);
          angleEvent=0;
        }
        else if(val.angle==="left"){
          y=Number(val.y)>0 ? val.y-($thisTalkBubble.outerHeight()/2) : $thisEle.offset().top+(($thisEle.outerHeight()-$thisTalkBubble.outerHeight())/2);
          x=Number(val.x)>0 ? val.x-angleMargin : $thisEle.offset().left+$thisEle.outerWidth()+angleMargin;
          angleEvent=270;
        }
        else if(val.angle==="right"){
          y=Number(val.y)>0 ? val.y-($thisTalkBubble.outerHeight()/2) : $thisEle.offset().top+(($thisEle.outerHeight()-$thisTalkBubble.outerHeight())/2);
          x=Number(val.x)>0 ? val.x-$thisTalkBubble.outerWidth()-angleMargin : $thisEle.offset().left-$thisTalkBubble.outerWidth()-angleMargin;
          angleEvent=90;
        }
        elfBubbleTimes++;
        if(elfBubbleTimes<2){
          if(y<0&&val.angle==="bottom"){
            val.angle="top";
            $thisTalkBubble.removeClass("bottom").addClass("top");
            calculate(val);
            return false;
          }
          else if(y+$thisTalkBubble.outerHeight()>$(document).height()&&val.angle==="top"){
            val.angle="bottom";
            $thisTalkBubble.removeClass("top").addClass("bottom");
            calculate(val);
            return false;
          }
          else if(x<0&&val.angle==="right"){
            val.angle="left";
            //val.x=0;
            //val.y=0;
            $thisTalkBubble.removeClass("right").addClass("left");
            calculate(val);
            return false;
          }
          else if(x+$thisTalkBubble.outerWidth()>$("body").width()&&val.angle==="left"){
            val.angle="right";
            //val.x=0;
            //val.y=0;
            $thisTalkBubble.removeClass("left").addClass("right");
            calculate(val);
            return false;
          }
        }
        x=Math.max(x,(1+$thisTalkBubble.outerWidth()/2));
        x=Math.min(x,Number($(window).innerWidth()-$thisTalkBubble.outerWidth()-1));
        val.x=x;
        val.y=y;
        val.angleEvent=angleEvent;
      };
      var callback=function(){
        if(val.callback!==null) val.callback.call(this);
      };
      calculate(val);
      $thisTalkBubble.css({
        "position":"absolute",
        "left":val.x,
        "top":val.y,
        "z-index":999999
      }).show().elfBackground({
        'fill':'rgba(0, 0, 0, 0.8)',
        'borderColor':'rgba(64, 255, 248, 0.4)',
        "talkBubble":{
          "angle":val.angleEvent,//角度
          "distance":13,//距离
          "beginWidth":12//喇叭口宽度
        }
      });
      setTimeout(callback,val.fadeTime);
      return this.each(function(){});
    },
    "elfBubbleExit":function(_callback){
      var $thisArr=$(this);
      var runAll=function(){
        var runThis=function(i,ele){
          var $thisEle=$(ele);
          var elfBubbleId=$thisEle[0].hasAttribute("data-elfBubble") ? $thisEle.attr("data-elfBubble") : "";
          if(elfBubbleId==="") return false;
          var $thisBubble=$("#"+elfBubbleId);
          var fadeTime=parseInt(elfBubbleId.split("_")[1]);
          var over=function(){
            $thisBubble.remove();
            if(typeof(_callback)!=="undefined"&&i===($thisArr.length-1)) _callback.call(this);
          };
          $thisEle.removeAttr("data-elfBubble");
          $thisBubble.fadeOut(fadeTime);
          over();
        };
        $thisArr.each(runThis);
      };
      if(typeof(window.elfBubbleExitTimeout)==="undefined") clearTimeout(window.elfBubbleExitTimeout);
      window.elfBubbleExitTimeout=setTimeout(runAll,pri.fadeTime);
      return this.each(function(){});
    },
    "confirm":function(confirmFunction,_message){
      var $this=$(this);
      var runConfirm=function(confirmFunction){
        var thisId="delBubble"+new Date().getTime();
        var message=_message ? '<p style="padding:0 0 10px 0;">'+_message+'</p>' : ' ';
        var thisHtml='<div id="'+thisId+'" class="noBreak confirmBubble font12 center" style="padding:10px 5px;">'+message+'<a class="button submit" style="width:6em;"><span><i class="iconOk mgr3"></i>确定</a><a class="button mgl5" style="width:6em;"><span class="contrast"><i class="iconRemove mgr3"></i>取消</span></a></div>';
        var runOne=function(event){
          var $submit=$("#"+thisId).find("a.submit");
          if(pri.isIn(event.pageX,event.pageY,$submit)){
            if(typeof(confirmFunction)==="function") confirmFunction.call(this);
          }
          $this.elfBubbleExit(function(){
            $this.removeAttr("data-delete-bubble-id");
          });
        };
        $this.elfBubble({
          "angle":"left",
          "html":thisHtml,
          "fadeTime":pri.fadeTime,
          "callback":function(){$(document).one("click",runOne);}
        });
      };
      $(".confirmBubble").each(function(i,e){
        var $e=$(e);
        $e.elfBubbleExit(function(){
          $e.removeAttr("data-delete-bubble-id");
        });
      });
      if(typeof(window.confirmBubbleTimeout)!=="undefined") clearTimeout(window.confirmBubbleTimeout);
      window.confirmBubbleTimeout=setTimeout(runConfirm,200,confirmFunction);
      return this.each(function(){});
    },
    "inputErr":function(text){
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
          }
          //$("#errorIndicate"+$thisInput.attr("indicate")).remove();
          var i=new Date().getTime();
          var thisInfo=(typeof errInfo==="undefined"||errInfo===null||errInfo==="") ? $thisInput.attr('data-msg')||'输入错误' : errInfo;
          var animateRepeat=6;
          var animateTime=pri.fadeTime*1.5/animateRepeat;
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
              },animateTime*animateRepeat+100);
            };
            $thisInput.off("keyup").one("keyup",this,clearIndicate);
            if($thisInput[0].tagName.toUpperCase!=="INPUT") $thisInput.off("click").one("click",this,clearIndicate);
          };
          $thisInput.smoothStop(true,true).smooth({"margin-left":(thisML+5)},animateTime,false,"Linear").smooth({"margin-left":thisML},animateTime,false,"Linear").smooth({"margin-left":(thisML+5)},animateTime,false,"Linear").smooth({"margin-left":thisML},animateTime,false,"Linear").smooth({"margin-left":(thisML+5)},animateTime,false,"Linear").smooth({"margin-left":thisML},animateTime,shakeOver,"Linear");
          //$thisInput.on("mouselea",this,function(event){$("#errorIndicate"+$thisInput.attr("indicate")).smoothOut();});
        };
        typeof(timeout)==="undefined" ? runThis() : setTimeout(runThis,timeout);
      };
      inputErr($(this),text);
      return this.each(function(){});
    },
    "initData":function(_thisData){
      var run=function(i,e){
        var $this=$(e);
        var initDownList=function(){
          var $selector=$this.find(".listSelected");
          var selectorType="A";
          if($this.find(".listSelected").length===0){
            if($this.hasClass("search")){
              $this.prepend('<input type="text" placeholder="输入搜索" class="listSelected" title="请选择..."><b></b>');
              selectorType="INPUT";
            }
            else if($this.hasClass("searchMore")){
              $this.prepend('<input type="text" placeholder="输入搜索,保留输入" class="listSelected" title="请选择..."><b></b>');
              selectorType="INPUT";
            }
            else{
              $this.prepend('<a class="listSelected" href="#"><span>请选择...</span></a><b></b>');
              selectorType="A";
            }
          }
          else{
            selectorType=$selector[0].tagName.toUpperCase();
          }
          var thisDownListData=_thisData||window[$this.attr("id")+"Data"]||[];//下拉菜单默认数据是以该下拉菜单的id+”Data“为名称的页面变量
          var thisListHtml='';
          for(var ii=0; ii<thisDownListData.length; ii++){
            thisListHtml+='<li '+(ii===0 ? 'class=""' : '')+'><a data-value="'+thisDownListData[ii]["value"]+'" href="#">'+thisDownListData[ii]["text"]+'</a></li>';
          }
          if($this.find("ul").length===0){
            $this.append('<ul>'+thisListHtml+'</ul>');
          }
          else{
            $this.find("ul").html(thisListHtml);
          }
          var selectedText=thisDownListData.length===0 ? "请选择..." : "请选择...";//thisDownListData[0]["text"];
          if(selectorType==="INPUT"){
            selectedText=$this.find("input").attr("placeholder")||selectedText;
            if(!$this.find("input").attr("data-placeholder")) $this.find("input").attr("data-placeholder",selectedText);
            $selector.attr("placeholder",$this.find("input").attr("data-placeholder")).val("");
          }
          if(selectorType==="A") $selector.find("span").text(selectedText);
          $this[0]["data-downList"]=thisDownListData;
        };
        var initGear=function(){
          var initThis=function(){
            var thisData=_thisData||window[$this.attr("id")+"Data"]||[];//下拉菜单默认数据是以该下拉菜单的id+”Data“为名称的页面变量
            var thisHtml='';
            for(var ii=0; ii<thisData.length; ii++){
              thisHtml+='<span class="dataItem" style="display:inline-block;position:relative;z-index:1" data-value="'+thisData[ii]["value"]+'" >'+thisData[ii]["text"]+'</span>';
            }
            thisHtml+='<b class="flag dataBackground" style="display:none; position:absolute; z-index:0;"></b><b class="flag dataIndicator" style="display:none; position:absolute;z-index:0;"></b>';
            $this.css({
              "position":"relative",
              "user-select":"none",
              "cursor":"pointer",
              "vertical-align":"middle"
            }).html(thisHtml);
            var $thisItem=$this.find(".dataItem").eq(0);
            if($thisItem.length!==0){
              var itemData={
                "text":$.trim($thisItem.text()),
                "value":$thisItem.attr("data-value")
              };
              $this.setValue(itemData);
            }
          };
          var activeDrag=function(e){
            e.preventDefault();
            var $thisItem=$(this);
            if(!$thisItem.hasClass("current")||$this.hasClass("readOnly")||$this.hasClass("disable")) return false;
            var $flagDataBackground=$(this).parent().find(".flag.dataBackground");
            var maxLeft=$this.find(".dataItem:last").offset().left-$this.offset().left-1;
            var thisItemMousedownLeft=e.pageX-$thisItem.offset().left;
            var dragMove=function(e){
              $flagDataBackground.css({
                "left":Math.min(Math.max(e.pageX-$this.offset().left-thisItemMousedownLeft,-1),maxLeft)
              });
            };
            var dragFinish=function(event){
              var flagCenter=$flagDataBackground.offset().left+($flagDataBackground.outerWidth()/2);
              var $currentItem=false;
              var flagLeftIn=$flagDataBackground.offset().left-$this.offset().left;
              if(flagLeftIn=== -1||flagLeftIn===0){
                $currentItem=$this.find(".dataItem:first");
              }
              else if($flagDataBackground.offset().left===$this.find(".dataItem:last").offset().left-1){//边框为1
                $currentItem=$this.find(".dataItem:last");
              }
              else{
                if($currentItem===false){
                  $this.find(".dataItem").each(function(i,e){
                    if(pri.isIn(event.pageX,event.pageY,$(e))){
                      $currentItem=$(e);
                    }
                  });
                }//第一套操作习惯根据焦点坐标定位判断 
                if($currentItem===false){
                  $this.find(".dataItem").each(function(i,e){
                    if(flagCenter>=$(e).offset().left&&flagCenter<=($(e).offset().left+$(e).outerWidth())){
                      $currentItem=$(e);
                    }
                  });
                }//第二套操作习惯根据活动背景中线坐标定位判断
                if($currentItem===false){
                  var flagLeft=$flagDataBackground.offset().left;
                  var target=flagLeft>=$thisItem.offset().left ? "right" : "left";
                  $this.find(".dataItem").each(function(i,e){
                    if(target==="right"&&flagLeft<=$(e).offset().left){
                      $currentItem=$(e);
                      return false;
                    }
                    else if(target==="left"&&flagLeft+1>=$(e).offset().left){//flagLeft最小值为-1
                      $currentItem=$(e);
                      //return false;
                    }
                  });
                }//第三套操作习惯根据活动背景移动方向和左右边框定位判断
                if($currentItem===false){
                  $currentItem=$this.find(".dataItem:first");
                } //三套方案最后还是无法根据用户操作定位,臣妾真是做不到了
              }
              var itemData={
                "text":$.trim($currentItem.text()),
                "value":$currentItem.attr("data-value")
              };
              setTimeout(function(){$this.setValue(itemData);},200);
              $(document).off("mousemove","body");
            };
            $(document).on("mousemove","body",dragMove);
            $(document).one("mouseup","body",dragFinish);
          };
          var clickDataItem=function(e){
            e.preventDefault();
            var $thisItem=$(this);
            if($this.hasClass("disable")||$this.hasClass("readOnly")||$thisItem.hasClass("current")||$thisItem.hasClass("disable")) return false;
            var itemData={
              "text":$.trim($thisItem.text()),
              "value":$thisItem.attr("data-value")
            };
            $this.setValue(itemData);
          };
          var enterDataItem=function(){
            if($this.hasClass("readOnly")||$this.hasClass("disable")) return false;
            $(this).addClass("hover");
          };
          var leaveDataItem=function(){
            if($this.hasClass("readOnly")||$this.hasClass("disable")) return false;
            $(this).removeClass("hover");
          };
          initThis();
          $this.off("click").on("click",this,function(e){e.preventDefault();});
          $this.off("mousedown",".dataItem.current").on("mousedown",".dataItem.current",activeDrag);
          $this.off("click",".dataItem:not(.current)").on("click",".dataItem:not(.current)",clickDataItem);
          $this.off("mouseenter",".dataItem").on("mouseenter",".dataItem",enterDataItem);
          $this.off("mouseleave",".dataItem").on("mouseleave",".dataItem",leaveDataItem);
        };
        if($this.hasClass("downList")) initDownList();
        if($this.hasClass("switchGear")) initGear();
      };
      $(this).each(run);
      return this.each(function(){});
    },//用于组件的数据初始化,例如下拉菜单等
    "setGear":function(_data){
      var $this=$(this);
      var $dataItem=$this.find(".dataItem");
      var changeCurrent=function(_$currentDataItem){
        $this.removeClass("zero").find(".dataItem.current").removeClass("current");
        if(_$currentDataItem.index()===0) $this.addClass("zero");
        _$currentDataItem.addClass("current");
        var $flagBlock=$this.find(".flag.dataBackground");
        $flagBlock.smoothStop(true,false).css({
          //"width":0,
          "height":_$currentDataItem.innerHeight()
        }).show().smooth({
          "width":_$currentDataItem.outerWidth(),
          "height":_$currentDataItem.innerHeight(),
          "left":_$currentDataItem.offset().left-$this.offset().left-2,
          "top":_$currentDataItem.offset().top-$this.offset().top-2
        },pri.fadeTime||200);
        var $flagIndicate=$this.find(".flag.dataIndicator");
        $flagIndicate.smoothStop(true,false).show().smooth({
          "width":10,
          "height":10,
          "left":_$currentDataItem.offset().left-$this.offset().left+((_$currentDataItem.outerWidth()-10)/2)-1,
          "top":($this.innerHeight()-10)/2-1
        },pri.fadeTime||200);
        return $this.each(function(){});
      };
      if(typeof(_data["text"])==="undefined"&& typeof(_data["value"])==="undefined"){
        console.log('setValue(_data)的参数格式应该为{"text":"xxx","value":"xxx"},其中text,value至少包含一项');
        return false;
      }
      if(typeof(_data["text"])!=="undefined"&& typeof(_data["value"])!=="undefined"){
        $dataItem.each(function(i,e){
          if($(e).attr("data-value")===_data["value"].toString()&&$.trim($(e).text())===_data["text"].toString()){
            changeCurrent($(e));
            return false;
          }
        });
      }
      else if(typeof(_data["text"])!=="undefined"){
        $dataItem.each(function(i,e){
          if($.trim($(e).text())===_data["text"].toString()){
            changeCurrent($(e));
            return false;
          }
        });
      }
      else if(typeof(_data["value"])!=="undefined"){
        $dataItem.each(function(i,e){
          if($(e).attr("data-value")===_data["value"].toString()){
            changeCurrent($(e));
            return false;
          }
        });
      }
      else{
        console.log('setValue错误异常');
        return false;
      }
    },
    "setValue":function(_data){
      //参数格式应该为{"text":""xxx,"value":"xxx"},其中text,value至少包含一项
      if(typeof(_data)==="undefined") return false;
      var $this=$(this);
      if(typeof(_data)==="undefined") return false;
      if($this.hasClass("switchGear")){
        $this.setGear(_data);
      }
      else if($this.hasClass("downList")){
        $this.setSelectVal(_data);
      }
      else if($this.hasClass("checkboxGroup")){
        $this.setCheckboxGroup(_data);
      }
      else if($this.hasClass("radioGroup")){
        $this.setRadioGroup(_data);
      }
      else if($this.hasClass("elfKeywordGroup")){
        if($.fn.hasOwnProperty("elfKeyword")){
          $this.elfKeyword(_data);
        }
        else{
          if(console) console.log("%c请确认是否已经成功加载插件jquery.elfKeyword.js,了解更多请移步到UI精灵http://www.uielf.com","color:red");
        }
      }
      else if($this.hasClass("inputNumber")){
        $this.find("input").val(_data).trigger("input");
        $(document).trigger("mouseover");
      }
      else if($this.hasClass("elfNumber")){
        $this.setElfNumber(_data);
      }
      else if($this.hasClass("elfProgress")){
        $this.elfProgress(_data);
      }
      else if($this.hasClass("elfCircleProgress")){
        $this.elfCircleProgress(_data);
      }
    },//设定组件的值通用方法
    "getValue":function(){
      var $this=$(this);
      if($this.length===0){
        console.log('%c抱歉! 未检测到此控件:$("'+$this["selector"]+'")',"color:red");
        return false;
      }
      var reData=undefined;
      var reGearData=function(){
        return {
          "text":$.trim($this.find(".dataItem.current").text()),
          "value":$this.find(".dataItem.current").attr("data-value")
        }
      };
      if($this.hasClass("switchGear")){
        reData=reGearData();
      }
      else if($this.hasClass("downList")){
        reData=$this.getSelectVal();
      }
      else if($this.hasClass("checkboxGroup")){
        reData=$this.getCheckboxGroup();
      }
      else if($this.hasClass("radioGroup")){
        reData=$this.getRadioGroup();
      }
      else if($this.hasClass("elfKeywordGroup")){
        if($.fn.hasOwnProperty("getElfKeyword")){
          reData=$this.getElfKeyword();
        }
        else{
          if(console) console.log("%c请确认是否已经成功加载插件jquery.elfKeyword.js,了解更多请移步到UI精灵http://www.uielf.com","color:red");
        }
      }
      else if($this.hasClass("inputNumber")){
        $(document).trigger("mouseover");
        reData=Number($this.find("input").val());
      }
      else if($this.hasClass("elfNumber")){
        reData=Number($this.find("input").val());
      }
      else if($this.hasClass("elfProgress")){
        reData=Number($this.elfProgress())
      }
      else if($this.hasClass("elfCircleProgress")){
        reData=Number($this.elfCircleProgress())
      }
      return reData;
    }//获取组件的值的通用方法
  });
  $.fn.extend({
    "elfNumber":function(_val){
      /*
       author:baiyukey@qq.com
       version:0.01.01
       */
      var $this=$(this);
      var val=$.extend({
        "max":0,//Number | 最大值 | 必选项
        "min":0,//Number | 最小值,默认0 | 可选项
        "stepValue":0,//Number | 最小值到最大值之间生成多少个数值刻度,默认10 | 可选项
        "range":false//Boolean | 是否可以选择一个数字范围个,默认否| 可选项(功能未完成)
      },_val);
      if(val.stepValue===0) val.stepValue=val.max/10;
      var elfNumberDrag=function(event){
        event.preventDefault();
        var $this=$(event.target);
        var $elfNumber=$this.closest(".elfNumber");
        var $thisBar=$elfNumber.find(".bar");
        var $thisInput=$elfNumber.find("input.elfNumberInput");
        var mouseX=0;
        var thisPercent=0;
        var thisBarWidth=$thisBar.width();
        var minX=$thisBar.offset().left;
        var maxX=minX+thisBarWidth;
        var minValue=parseInt($thisInput.attr("min"));
        var maxValue=parseInt($thisInput.attr("max"));
        var elfNumberButtonMove=function(event){
          mouseX=event.pageX;
          if(mouseX<=minX){
            thisPercent=0;
          }
          else if(mouseX>=maxX){
            thisPercent=1;
          }
          else{
            thisPercent=(mouseX-minX)/thisBarWidth;
          }
          $thisBar.find("span").css({"width":thisPercent*100+"%"});
          $thisInput.val(parseInt((maxValue-minValue)*thisPercent)+minValue);
          //more
        };
        var elfNumberMouseup=function(){
          var $elfNumberCurr=$(".elfNumber.curr");
          if($elfNumberCurr.length>0){
            document.removeEventListener("mousemove",elfNumberButtonMove);
            document.removeEventListener("mouseup",elfNumberMouseup);//放开滑块
            $elfNumberCurr.setElfNumber().removeClass("curr");
          }
          else{
            eval(null);
          }
        };
        $thisBar.closest(".elfNumber").addClass("curr").find("a").removeClass("curr");
        document.addEventListener("mousemove",elfNumberButtonMove);
        document.addEventListener("mouseup",elfNumberMouseup);//放开滑块
      };
      var clickelfNumberVal=function(event){
        var thisVal=parseInt($(event.target).attr("data-value"));
        $(event.target).closest("div.elfNumber").setElfNumber(thisVal);
      };
      var elfNumberInputKeyup=function(event){
        event.preventDefault();
        var inputOver=function(){
          var runThis=function(){
            var minValue=Number($(event.target).attr("min"));
            var maxValue=Number($(event.target).attr("max"));
            var thisVal=$(event.target).val() ? Number($(event.target).val()) : minValue;
            if(thisVal<=minValue){
              thisVal=minValue;
            }
            else if(thisVal>=maxValue){
              thisVal=maxValue;
            }
            else{
              eval(null);
            }
            $(event.target).closest(".elfNumber").setElfNumber(thisVal);
          };
          $(event.target).off("blur").one("blur",this,runThis);
        };
        typeof(window.inputTimeout)!=="undefined" ? clearTimeout(window.inputTimeout) : null;
        window.inputTimeout=setTimeout(inputOver,200);
      };
      $this.addClass("elfNumber").empty();
      val.step=Math.ceil((val.max-val.min)/val.stepValue);
      val.step=Math.min(val.step,$this.width()/3);//保护机制,防止浏览器崩溃
      var returnValue=function(_i){
        if(_i===0){
          return val.min;//min 
        }
        else if(_i===val.step){
          return val.max;//max
        }
        else{
          return val.stepValue*i+val.min-(val.min%val.stepValue);
        }
      };
      var thisHtml='<span class="font14 vMiddle">当前值</span><input type="number" class="M vMiddle elfNumberInput mgl10" dataType="Range" placeholder="'+val.min+'~'+val.max+'" min="'+val.min+'" max="'+val.max+'" data-msg="数值必须在'+val.min+'~'+val.max+'之间">';
      thisHtml+='<div class="val">';
      var thisValue=0;
      var thisPercent=0;
      var prevPercent=0;
      for(var i=0; i<=val.step; i++){
        thisValue=returnValue(i);
        thisPercent=(i===0 ? 0 : (thisValue-val.min)/(val.max-val.min)*100);
        thisHtml+='<a style="margin-left:'+thisPercent+'%;text-indent:-'+(thisValue.toString().length/4+0.25)+'em;'+(i!==0&&thisPercent-prevPercent<3 ? ('margin-top:-'+(i%2)+'em') : '')+'" data-value="'+thisValue+'" class="'+(i===0 ? "curr" : "")+'">'+thisValue+'</a>';
        prevPercent=thisPercent;
      }
      thisHtml+='</div>';
      thisHtml+='<p class="bar"><span style="width:0"></span><a href="#" class="elfNumberButton"><b></b></a></p>';
      $this.html(thisHtml).find("input").val(val.min);
      $this.off("click","a").on("click","a",function(event){
        event.preventDefault();
      });//滑块a链接屏蔽
      $this.off("click",".val a").on("click",".val a",clickelfNumberVal);//点击滑块刻度值
      $this.off("click","input.elfNumberInput").on("click","input.elfNumberInput",elfNumberInputKeyup);//滑块输入框按键抬起
      $this.off("mousedown","a.elfNumberButton").on("mousedown","a.elfNumberButton",elfNumberDrag);//按下滑块按钮
      $this.off("keyup","input.elfNumberInput").on("keyup","input.elfNumberInput",elfNumberInputKeyup);//滑块输入框按键抬起
      return this.each(function(){});
    },
    "setElfNumber":function(_val){
      var $thisBar=$(this).find("p.bar");
      var $thisInput=$(this).find("input.elfNumberInput");
      var minValue=Number($thisInput.attr("min"));
      var maxValue=Number($thisInput.attr("max"));
      var thisVal=typeof(_val)!=="undefined" ? _val : $thisInput.val()||minValue;
      thisVal=Math.min(Math.max(thisVal,minValue),maxValue);
      var thisPercent=0;
      if(thisVal<=minValue){
        thisPercent=0;
      }
      else if(thisVal>=maxValue){
        thisPercent=100;
      }
      else{
        thisPercent=(thisVal-minValue)/(maxValue-minValue)*100;
      }
      $(this).find(".val").find("a").each(function(index,element){
        $(element).attr("data-value").toString()===thisVal.toString() ? $(element).addClass("curr") : $(element).removeClass("curr");
      });
      $thisBar.find("span").smooth({"width":thisPercent+"%"},pri.fadeTime);
      $thisInput.val(thisVal);
      return this.each(function(){});
    }//滑块设置值
  });
  $.fn.extend({
    elfDate:function(_val){
      //日期时间插件,可以实现选择单个日期(时间),或者一个日期(时间)范围
      //author:baiyukey@qq.com
      //version:qs_0.00.001
      //date:2018-04-09 14:14:04
      var newDate=new Date();
      var val=$.extend({
        "date":newDate.getTime(),//初始化时间,默认为现在
        "dateFormat":"YY/MM/DD hh:mm:ss",//年/月/日 小时:分钟:秒,同时也为elfDate.get()返回的日期格式,注意YY,MM,DD,hh,mm,ss关键字不可更改
        "weekFonts":"日,一,二,三,四,五,六",//日期表格的星期单位
        "weekStart":1,//默认周一开始,索引数值依据weekFonts
        "pageLength":3//每页显示几个月,默认为2
      },typeof(_val)==="string"||typeof(_val)==="number" ? {"date":Number(_val)} : _val);
      var $this=$(this);
      var subId=new Date().getTime();
      var yearBoxId=["yearBox",subId].join("");
      var monthBoxId=["monthBox",subId].join("");
      var monthContentId=["monthContent",subId].join("");
      var weekBoxId=["weekBox",subId].join("");
      var timeBoxId=["timeBox",subId].join("");
      var reFebruaryDays=function(year){
        return 28+(year%100===0 ? (year%400===0 ? 1 : 0) : (year%4===0 ? 1 : 0));
      };//是否为闰年
      var formatDate=function(_yy,_mm,_dd){
        return val.format.replace(/[yY]+/,_yy).replace(/[mM]+/,_mm).replace(/(date)|d+|D+/,_dd);
      };
      var elfDateSelected=function(){
        var renData=[];
        $this.find(".selected").children().each(function(i,e){
          var thisData=[];
          $(e).find("a").each(function(_i,_e){
            thisData.push(Number($(_e).text().replace(/[^\d]+/g,"")));
          });
          renData.push(thisData);
        });
        return renData;
      };
      var clickDate=function(event){
        event.preventDefault();
        var $leftRight=$(this);
        var date,
          year,
          month,
          day;
        day=("0"+this.innerText).substr(-2);
        date=elfDateSelected()[0];
        year=date[0];
        month=date[1];
        if($leftRight.hasClass("prev")) month--;
        else if($leftRight.hasClass("next")) month++;
        if(month===0){
          if(year>1970){
            month=12;
            year--;
          }
          else{
            month=1;
            year=1970;
          }
        }
        else if(month===13){
          month=1;
          year++
        }
        month=("0"+month).substr(-2);
        //var reDate=formatDate(year,month,day);
      };
      var activeHotKey=function(e){
        var showHelpTimes=3;
        if(!document.getElementById("elfDateHelp")){
          $("body").append('<p style="position:absolute;font-size:0.75rem;display:none;z-index:999998" id="elfDateHelp"><i class="iconKeyboard font16"></i><span class="vMiddle mgl5">敲击W,S,A,D键可改变数值&nbsp;</span></p>');
        }
        if(typeof($this[0]["showHelp"])==="undefined"){
          $this[0]["showHelp"]=0;
          $this[0]["showHelpSwitch"]=0;
        }
        var $thisHelp=$("#elfDateHelp");
        if($this[0]["showHelp"]<showHelpTimes&&$this[0]["showHelpSwitch"]===0){
          $this[0]["showHelpSwitch"]=1;
          $thisHelp.smoothStop(true,false).css({
            "left":$this.offset().left+$this.outerWidth()-$thisHelp.width(),
            "top":$this.offset().top-$thisHelp.height(),
            "opacity":1
          }).show().smoothOut(3000,function(){
            $this[0]["showHelp"]+=1;
            $this[0]["showHelpSwitch"]=0;
          });
        }
        var downElfHotKey=function(e){
          var getKey=function(_e){
            var e=_e||window.event; //兼容IE和Firefox获得keyBoardEvent对象
            return e.keyCode ? e.keyCode : e.which; //兼容IE和Firefox获得keyBoardEvent对象的键值
          };
          var reEq=function(_step){
            var thisIndex=$this.find(".selected").find("a.hover").index();
            var maxIndex=$this.find(".selected").find("a").length;
            if(thisIndex+_step>=maxIndex){
              return 0;
            }
            else if(thisIndex+_step<0){
              return maxIndex;
            }
            else{
              return thisIndex+_step;
            }
          };
          var runThis=function(thisKey){
            var $thisButton=null;
            if(thisKey===87){
              $thisButton=$this.find(".adjustFlag").find(".minus").trigger("click");
            }//敲击W(上)
            else if(thisKey===83){
              $thisButton=$this.find(".adjustFlag").find(".add").trigger("click");
            }//敲击S(下)
            if(thisKey===65){
              $this.find(".selected").find("a:eq("+reEq(-1)+")").trigger("mouseenter");
            }//敲击A(左)
            else if(thisKey===68){
              $this.find(".selected").find("a:eq("+reEq(1)+")").trigger("mouseenter");
            }//敲击D(右)
            else{
            }
            if($thisButton){
              $thisButton.removeClass("active").addClass("active");
              $(document).one("keyup",function(e){
                $thisButton.removeClass("active");
              })
            }
          };
          var key=getKey(e);
          if(typeof($this[0]["waitRunElfHotKey"])!=="undefined") clearTimeout($this[0]["waitRunElfHotKey"]);
          $this[0]["waitRunElfHotKey"]=setTimeout(runThis,1000/50,key);
        };
        window.document.addEventListener("keydown",downElfHotKey);
        $this.off("mouseleave").one("mouseleave",this,function(){window.document.removeEventListener("keydown",downElfHotKey);});
      };
      var smoothControl=function(event){
        event.preventDefault();
        var controlThis=function(_$this){
          var $adjustFlag=$this.find(".adjustFlag").smoothStop(true,false);
          $adjustFlag.css({"height":_$this.height()+$adjustFlag.find("a").height()*2});
          var left=_$this.offset().left-$this.offset().left+(_$this.width()/2);
          var top=_$this.offset().top-$this.offset().top-$adjustFlag.find("a").height();
          $adjustFlag.show().smooth({
            "left":left,
            "top":top
          });
        };
        $(this).addClass("activeControl").siblings().removeClass("activeControl");
        var clearHover=function(){
          $this.find(".dateHeader").find("a.hover").removeClass("hover");
        };
        if($(this).hasClass("dateHeader")){
          var $hover=$(this).find("a.hover").length>0 ? $(this).find("a.hover") : $(this).find("a:eq(2)").addClass("hover");//默认第一个时间的日期
          $(this).find(".selected").off("mouseenter","a").on("mouseenter","a",function(e){
            $(this).addClass("hover").siblings("a").removeClass("hover");
            controlThis($(this));
          });
          if($hover) controlThis($hover);
        }
        else{
          clearHover();
          controlThis($(this));
        }
      };
      var selectedChange=function(_e){
        _e.preventDefault();
        var $thisButton=$(this);
        var changeDate=function(){
          var selectedValue=elfDateSelected()[0];
          if(!selectedValue||selectedValue.length===0) return false;
          var year=selectedValue[0];
          var month=selectedValue[1];
          var monthDays=[31,reFebruaryDays(year),31,30,31,30,31,31,30,31,30,31]; //各月份的总天数
          var currentKey=$this.find(".selected").find("a.hover").attr("class").split(/\s+/)[0];
          ["year","month","day","hour","minute","second"].forEach(function(e,i){
            if(typeof(selectedValue[i])!=="undefined"&&currentKey===e){
              $thisButton.hasClass("add") ? selectedValue[i]++ : selectedValue[i]--;
            }
          });
          if(selectedValue.length>=3&&selectedValue[2]<=0){//日期为0时
            selectedValue[1]--;//月份减1
            selectedValue[2]=(selectedValue[1]<=1) ? monthDays[11] : monthDays[selectedValue[1]-1];
          }
          else if(selectedValue.length>=3&&selectedValue[2]>monthDays[selectedValue[1]-1]){//当前日期大于当月最大日期时
            selectedValue[1]++;//月份加1
            selectedValue[2]=1;//日期为1
          }
          if(selectedValue.length>=2&&selectedValue[1]<=0){
            if(selectedValue[0]>1970){
              selectedValue[0]--;
              selectedValue[1]=12;
            }
            else{
              selectedValue[0]=1970;
              selectedValue[1]=1;
            }
          }
          else if(selectedValue.length>=2&&selectedValue[1]>12){
            selectedValue[1]=1;
            selectedValue[0]++;
          }
          //createPanel.apply(this,selectedValue);
          $this.elfDateSet(selectedValue,true);//selectedValue=[年,月,日]
          //$adjustFlag.removeClass("disable");
        };
        var scrollMonth=function(){
          var monthIdSplit=$this.find(".dateContent").find(".monthBox").find(".monthContent").find(".dayBoxPage.showing .dayBox"+($thisButton.hasClass("add") ? ":last" : ":first")).attr("id").split("_");
          var monthDays=[31,reFebruaryDays(monthIdSplit[1]),31,30,31,30,31,31,30,31,30,31]; //各月份的总天数
          var step=$thisButton.hasClass("add") ? 1000*60*60*24*monthDays[monthIdSplit[2]-1]+1 : -1000*60*60*24-1;
          var selectedValue=new Date(new Date([monthIdSplit[1],monthIdSplit[2],1].join("/")).getTime()+step).toLocaleDateString().split(/\D+/g);
          selectedValue[0]=Number(selectedValue[0]);
          selectedValue[1]=Number(selectedValue[1]);
          selectedValue[2]=1;
          $this.elfDateSet(selectedValue,false);//selectedValue=[年,月,日]
        };
        $this.find(".dateHeader").hasClass("activeControl") ? changeDate() : scrollMonth();
      };
      var clickDay=function(e){
        e.preventDefault();
        var thisDay=$(this).attr("data-day");
        $this.elfDateSet(thisDay.split(/\D/),true);
      };
      var mousedownA=function(e){
        if(typeof(e)!=="undefined") e.preventDefault();
        var $this=$(this);
        $this.addClass("active");
        $this.one("mouseup keyup",function(){
          $this.removeClass("active");
        })
      };
      var initThis=function(){
        $this[0].dateFormat=val.dateFormat;
        $this[0].weekFonts=val.weekFonts;
        $this[0].weekStart=val.weekStart;
        $this[0].pageLength=val.pageLength;
        $this.attr("data-subId",subId).addClass("elfDate").css({"position":"relative"}).html('<div class="dateHeader"><div class="selected"></div></div><div class="dateContent"><div class="yearBox" id="'+yearBoxId+'" style="display:none;"></div><div class="monthBox" id="'+monthBoxId+'" style="display:none;"><div class="weekBox" id="'+weekBoxId+'"></div><div class="monthContent" id="'+monthContentId+'"></div></div><div class="timeBox" id="'+timeBoxId+'"  style="display:none;"></div></div><div class="adjustFlag" style="display:none;"><a href="#" class="minus"></a><a href="#" class="add"></a></div>');
        var thisArgument=[];
        if(typeof(val.date)==="string"){
          thisArgument=val.date.split(/[^\d]+/);
        }
        else{
          var aDate=new Date(val.date);
          thisArgument=[aDate.getFullYear(),aDate.getMonth()+1,aDate.getDate(),aDate.getHours(),aDate.getMinutes(),aDate.getSeconds()];
        }
        $this.find(".dateHeader").off("mouseenter").on("mouseenter",smoothControl);
        $this.find(".dateContent").off("mouseenter").on("mouseenter",smoothControl);
        $this.off("click",".adjustFlag a").on("click",".adjustFlag a",selectedChange);
        $this.find(".dateHeader").off("click","a").on("click","a",function(){
          var thisDate=$this.elfDateGet().split(/\D/);
          $this.elfDateSet(thisDate,false);
        });
        $this.off("click",".dateContent .date").on("click",".dateContent .date",clickDate);
        $this.off("mousedown","a").on("mousedown","a",mousedownA);
        $this.off("mouseenter").on("mouseenter",this,activeHotKey);
        $this.off("click",".monthContent .day").on("click",".monthContent .day",clickDay);
        $this.elfDateSet(thisArgument,true);
      };
      initThis();
      return this.each(function(){});
    },
    elfDateGet:function(){
      var $this=$(this);
      var dateFormat=$this[0].dateFormat.toString();
      var dateFormatArr=dateFormat.split(/[^YyMmDdHhSs]+/);
      var $values=$this.find(".selected").find("a");
      if($values.length===0) return "";
      dateFormatArr.forEach(function(e,i){
        dateFormat=dateFormat.replace(e,$values.filter(":eq("+i+")").text().replace(/[^\d]+/g,""));
      });
      return dateFormat;
    },
    elfDateSetRange:function(_value){
      var v=$.extend({
        "start":new Date().getTime(),//初始化时默认的开始时间
        "end":"2970/01/01 08:00:00",//初始化时默认的结束时间
        "range":0,//默认是大时间范围,单位天,0代表不限
        "minDate":"1970/01/01 08:00:00",//默认最小可选时间
        "maxDate":new Date().getTime()//默认最在可选时间
      },_value);
    },
    elfDateSet:function(_values,_isChange){
      //fullDate{}为参数日期,子值为字符串
      //currentDate{}为当前日期,子值为字符串
      var $this=$(this);
      if(typeof($this[0]["data-elfDateSet"])!=="undefined"&&$this[0]["data-elfDateSet"]!=="success") return false;
      $this[0]["data-elfDateSet"]="noSuccess";
      var values=typeof(_values)!=="undefined" ? _values : [1970,1,1,8,0,0];//[年,月,日,小时,分钟,秒]
      var isChange=typeof(_isChange)!=="undefined"&&_isChange===true;
      var fullDate={};
      var weekFonts=$this[0].weekFonts.split(",");
      var weekStart=$this[0].weekStart;
      var pageLength=$this[0].pageLength;
      var selectedHtml='<div style="display:inline-block;">'+$this[0].dateFormat+'</div>';//.replace("hh","00").replace("mm","00").replace("ss","00");
      var subId=$this.attr("data-subId");
      var monthBoxId=["monthBox",subId].join("");
      var monthContentId=["monthContent",subId].join("");
      var weekBoxId=["weekBox",subId].join("");
      var yearBoxId=["yearBox",subId].join("");
      var timeBoxId=["timeBox",subId].join("");
      var previousDate=$this.elfDateGet();
      for(var k=0; k<values.length; k++){
        switch(k){
          case 0://年份
            fullDate.year=Math.max(1970,Number(values[k])).toString();
            break;
          case 1://月份
            fullDate.month=("00"+Math.min(12,Math.max(1,Number(values[k])))).substr(-2);
            break;
          case 2://日期
            fullDate.day=("00"+Math.min(31,Math.max(1,Number(values[k])))).substr(-2);
            break;
          case 3://小时
            fullDate.hour=("00"+(values[k]<0 ? 23 : values[k]%24)).substr(-2);
            break;
          case 4://分钟
            fullDate.minute=("00"+(values[k]<0 ? 59 : values[k]%60)).substr(-2);
            break;
          case 5://秒
            fullDate.second=("00"+(values[k]<0 ? 59 : values[k]%60)).substr(-2);
            break;
          default:
            break;
        }
      }
      if($this.find(".selected").html()===""){
        selectedHtml=selectedHtml.replace("ss","_ss").replace("YY",'<a class="year">'+fullDate.year+'</a>').replace("MM",'<a class="month">'+fullDate.month+'</a>').replace("DD",'<a class="day">'+fullDate.day+'</a>').replace("hh",'<a class="hour">'+fullDate.hour+'</a>').replace("mm",'<a class="minute">'+fullDate.minute+'</a>').replace("_ss",'<a class="second">'+fullDate.second+'</a>');
        $this.find(".selected").html(selectedHtml);
        $this[0]["data-date"]=fullDate;
      }
      else if(isChange){
        var thisKey='';
        $this.find(".selected").find("a").each(function(i,e){
          thisKey=$(e).attr("class").split(/\s+/)[0];
          if(fullDate[thisKey]){
            $(e).html(fullDate[thisKey]);
          }
          else{
            fullDate[thisKey]=$(e).text();
          }
        });
        $this[0]["data-date"]=fullDate;
      }
      if(typeof($this[0]["data-date"])==="undefined") return false;
      var currentDate=$this[0]["data-date"];
      var createYearPanel=function(){
        var year=parseInt(currentDate.year);
        var yearPanelId=["year",subId].join("");
        if(document.getElementById(yearPanelId)===null){
          $this.find(".dateContent").append('<div class="yearBox" id="'+yearPanelId+'">year</div>');
        }
        var $yearPanel=$("#"+yearPanelId);
        $yearPanel.empty();
        $yearPanel.smoothIn().siblings().smoothOut();
      };
      var createMonthPanel=function(){
        var year=Number(fullDate.year);
        var month=Number(fullDate.month);
        var reFebruaryDays=function(year){
          return 28+(year%100===0 ? (year%400===0 ? 1 : 0) : (year%4===0 ? 1 : 0));
        };//是否为闰年
        var monthDays=[31,reFebruaryDays(fullDate.year),31,30,31,30,31,31,30,31,30,31]; //各月份的总天数
        var thisDay;
        var reMonthHtml=function(_thisYear,_thisMonth){
          var newYear=_thisYear;
          var newMonth=_thisMonth;
          var theMonth=1;//从1开始
          var weekHtml='',
            dayHtml='';
          var reCurrentCss=function(_year,_month,_day){
            return _year===Number(currentDate.year)&&_month===Number(currentDate.month)&&_day===Number(currentDate.day) ? 'current' : '';
          };
          var firstDateWeek;//星期几
          for(var n=0; n<12; n++){//每次创建一年的月份
            theMonth=n+1;
            firstDateWeek=new Date(year,(theMonth-1),1).getDay();//星期几
            if(n<pageLength) weekHtml+="<ul><li>";
            if(theMonth===1||pageLength===1||theMonth%pageLength===1) dayHtml+='<div class="dayBoxPage" style="position:relative;">';
            dayHtml+='<div id="'+["dayBox",newYear,("00"+theMonth).substr(-2),subId].join("_")+'" class="dayBox '+(newYear===Number(currentDate.year)&&theMonth===Number(currentDate.month) ? 'current' : '')+'" ><ul>';
            //计算1号在第几列公式
            //weekStart日历的第一列是周几  例如:第一列是周 2      6    5      4     7
            //firstDateWeek当月的1号是周几 例如:1号是周     5      2    2      4      7
            //计算1号在第几列                                                  4      4    5      1      1
            //  计算1号在第几列公式
            var firstDateColumn=firstDateWeek-weekStart>0 ? firstDateWeek-weekStart+1 : (firstDateWeek-weekStart+7)%7+1;
            var rowsLength=Math.ceil((monthDays[theMonth-1]+firstDateColumn-1)/7); //表格所需要行数
            var prevMonthDays=theMonth<=1 ? monthDays[monthDays.length-1] : monthDays[theMonth-2];
            var currMonthDays=monthDays[theMonth-1];
            var dataDayArr=[newYear,theMonth,1];
            for(var i=0; i<rowsLength; i++){ //表格的行
              dayHtml+='<li>';
              for(var column=1; column<=weekFonts.length; column++){ //表格每行的单元格
                if(i===0&&n<pageLength) weekHtml+='<a class="week">'+weekFonts[(column-1+weekStart)%7]+'</a>';
                thisDay=i*weekFonts.length+column-firstDateColumn+1; //计算日期
                if(thisDay<=0){//上月日期
                  dataDayArr[0]=theMonth<=1 ? newYear-1 : newYear;
                  dataDayArr[1]=theMonth<=1 ? 12 : (theMonth-1);
                  dataDayArr[2]=prevMonthDays+thisDay;
                  if(dataDayArr[0]<1970) dataDayArr=["","",""];
                  dayHtml+='<a  class="day gray prev"'+(dataDayArr[0]==="" ? 'style="visibility:hidden;"' : '')+'" data-day="'+dataDayArr.join("_")+'"><span>'+dataDayArr[2]+'</span></a>';
                }
                else if(thisDay>currMonthDays){//下月日期
                  dataDayArr[1]=theMonth>=12 ? 1 : (theMonth+1);
                  dataDayArr[2]=thisDay-currMonthDays;
                  dayHtml+='<a class="day gray next" data-day="'+dataDayArr.join("_")+'"><span >'+dataDayArr[2]+'</span></a>';
                }
                else{//当月日期
                  dataDayArr=[newYear,theMonth,thisDay];
                  dayHtml+='<a class="day '+reCurrentCss(newYear,theMonth,thisDay)+'" data-day="'+dataDayArr.join("_")+'"><span>'+dataDayArr[2]+'</span></a>';
                }
              }
              dayHtml+='</li>';
            }
            if(n<pageLength) weekHtml+='</li></ul>';
            dayHtml+='</ul><div class="bigMonthFonts"><span class="theYear">'+newYear+'</span><br><span class="theMonth">'+("00"+theMonth).substr(-2)+'</span></div></div>';
            if(theMonth===12||theMonth%pageLength===0) dayHtml+='</div>';
          }
          return {
            "month":newMonth,
            "week":weekHtml,
            "day":dayHtml
          }
        };
        var animateMonthBox=function(){
          var previousYear=parseInt(previousDate);
          var perMonthHeight=[];
          $this.find(".dayBox").each(function(i,e){
            perMonthHeight.push($(e).outerHeight());
            //$(e).css({"height":$(e).parent().height()});
          });
          var scrollTop=0;
          for(var i=1; i<month/pageLength; i++){
            scrollTop+=Math.max.apply(this,perMonthHeight.splice(0,pageLength));
          }
          var thisHeight=Math.max.apply(this,perMonthHeight.splice(0,pageLength));
          var $monthContent=$("#"+monthContentId);
          var $thisDayBox=$("#"+dayBoxId);
          $thisDayBox.parent().addClass("showing").find(".dayBox").css({"height":thisHeight}).end().siblings().removeClass("showing");
          $monthContent.css({
            "width":($this.find(".dayBox:eq(0)").outerWidth()+1)*pageLength-1,//每个pageBox右边有1像素的margin-right
            "height":thisHeight
          });
          if(year>previousYear&&month===1){
            $monthContent.smoothStop().scrollTop(0).find(".dayBoxPage:eq(0)").css({"margin-top":thisHeight}).smooth({"margin-top":0},0,function(){
              $monthContent.scrollTop(scrollTop);
            });
          }
          else if(year<previousYear&&month===12){
            $monthContent.smoothStop().scrollTop(0).find(".dayBoxPage:eq(0)").css({"margin-top":0-scrollTop-thisHeight}).smooth({"margin-top":0-scrollTop},0,function(){
              $monthContent.find(".dayBoxPage:eq(0)").css({"margin-top":0}).end().scrollTop(scrollTop);
            });
          }
          else{
            $monthContent.smoothStop(true,false).smooth({"scrollTop":scrollTop});
          }
          if($thisDayBox.parent().find(".dayBox.current").length>0){
            $("#"+weekBoxId).find('ul:eq('+(currentDate.month%pageLength===0 ? pageLength-1 : currentDate.month%pageLength-1)+')').addClass("current").siblings().removeClass("current");
          }
          else{
            $("#"+weekBoxId).find("ul").removeClass("current");
          }
        };
        var $monthBox=$("#"+monthBoxId);
        var dayBoxId=["dayBox",year,("00"+month).substr(-2),subId].join("_");
        var $thisDayBox=$("#"+dayBoxId);
        if($thisDayBox.length>0){
          if(isChange){
            $("#"+monthContentId).find(".dayBox.current").find(".day.current").removeClass("current").end().removeClass("current");
            $thisDayBox.addClass("current").find(".day[data-day="+[year,month,Number(currentDate.day)].join("_")+"]").addClass("current");
          }
          setSuccess();
        }
        else{
          var monthBoxHtml=reMonthHtml(year,month);
          $("#"+weekBoxId).html(monthBoxHtml.week);
          $monthBox.find(".monthContent").attr("id",monthContentId).html(monthBoxHtml.day);
          $monthBox.show().siblings().hide().empty();//隐藏年,时间面板
          setTimeout(setSuccess,100);
        }
        animateMonthBox();
      };
      var createTimePanel=function(){
        console.log("timePanel");
      };
      var setSuccess=function(){ $this[0]["data-elfDateSet"]="success";};
      if(!typeof(currentDate.day)&& typeof(currentDate.second)){
        createTimePanel();
      }
      else if(typeof(currentDate.month)){
        createMonthPanel();
      }
      else if(typeof(currentDate.year)){
        createYearPanel();
      }
    }
  });
  $.fn.extend({
    //使元素显示为一个数字时钟
    //author:baiyukey@qq.com
    //version:0.00.001
    //date:2018-05-02 23:29:24
    "elfClock":function(_val){
      var val=$.extend({"format":"YY/MM/DD hh:mm:ss"},_val);
      //12小时制使用hh:mm:ss
      //24小时制使用HH:mm:ss
      var $this=$(this).addClass("elfClock");
      var newDate=new Date();
      var thisHtml='';
      var prependZero=function(_val,_template){
        var template=typeof(_template)!=="undefined" ? _template : "00";//默认返回2位
        return ((typeof(_template)!=="undefined" ? _template : "00")+_val).substr(0-template.length);
      };
      var reFuseTime=function(_hour){
        switch(_hour){
          case 23:
          case 0:
            return "午夜";
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            return "凌晨";
          case 6:
          case 7:
            return "清晨";
          case 8:
          case 9:
          case 10:
            return "上午";
          case 11:
          case 12:
            return "中午";
          case 13:
          case 14:
          case 15:
          case 16:
            return "下午";
          case 17:
          case 18:
            return "傍晚";
          case 19:
          case 20:
          case 21:
          case 22:
            return "晚上";
          default :
            return "?";
        }
      };
      var runThis=function(){
        newDate=new Date();
        thisHtml=val.format;
        thisHtml=thisHtml.replace("YY",newDate.getFullYear().toString()).replace("MM",prependZero(newDate.getMonth()+1)).replace("DD",prependZero(newDate.getDate())).replace("mm",prependZero(newDate.getMinutes())).replace(/([^a])(ss)/g,"$1"+prependZero(newDate.getSeconds()).replace("ms",prependZero(newDate.getMilliseconds(),"000")));
        if(val.format.indexOf("hh")>0){
          if(newDate.toLocaleString().indexOf("午")>0){
            thisHtml=thisHtml.replace("hh",('<span class="unit">'+reFuseTime(newDate.getHours())+'</span>'+(newDate.getHours()===12 ? 12 : prependZero(newDate.getHours()%12))));
          }
          else{
            thisHtml=thisHtml.replace("hh",('<span class="unit">'+(newDate.getHours()<12 ? 'AM' : 'PM')+'</span>'+prependZero(newDate.getHours()%12)));
          }
        }
        else{
          thisHtml=thisHtml.replace("HH",prependZero(newDate.getHours()));
        }
        $this.html(thisHtml);
      };
      if(typeof($this[0]["elfClockInterval"])!=="undefined") clearInterval($this[0]["elfClockInterval"]);
      $this[0]["elfClockInterval"]=setInterval(runThis,1000);
    }
  });
  var timePicker=function(o){
    return function(date,inst){
      $(document.getElementById("timePanel")).remove();
      $(window.top.document.getElementById("timePanel")).remove();
      var thisTime=o.timeFormat||"hh:mm:ss";
      var dateTimeSplit=o.dateTimeSplit||" ";
      var timeArr=[12,30,30];
      var $this=$(inst.input[0]);
      $this.lastVal ? console.log(inst.lastVal.split(dateTimeSplit)) : null;
      var lastValue=inst.lastVal ? inst.lastVal.split(dateTimeSplit)[1] : null;
      if(lastValue){
        timeArr=[];
        timeArr.push(lastValue.substr(0,2));
        timeArr.push(lastValue.substr(3,2));
        timeArr.push(lastValue.substr(6,2));
      }
      $this.attr("disabled","disabled");
      $this.after('<form class="displayIB border whiteBg timePanel" id="timePanel" style="position:absolute;left:'+$this.offset().left+'px;top:'+($this.offset().top+inst.input[0].offsetHeight)+'px; "><p class="pd20"><input type="number" datatype="Range" data-msg="0~23" min="0" max="23" placeholder="时" value="'+timeArr[0]+'">:<input type="number" datatype="Range" data-msg="0~60" min="0" max="60" placeholder="分" value="'+timeArr[1]+'">:<input type="number" datatype="Range" data-msg="0~60" min="0" max="60" placeholder="秒" value="'+timeArr[2]+'"></p><p class="bottomLine"></p><p class="center pd10"><a class="button mgl5 reset" href="#"><span class="gray">还原</span></a><a class="button mgl3 setNow" href="#"><span class="gray">现在</span></a><a class="button mgl3 setDefault" href="#"><span class="gray">默认</span></a></p><p class="bottomLine"></p><p class="center pd10 mgb5"><a class="button submit" href="#"><span>确&nbsp;&nbsp;&nbsp;定</span></a><a class="button cancel mgl10" href="#"><span class="contrast">取&nbsp;&nbsp;&nbsp;消</span></a></p></form>');
      var $timePanel=$("#timePanel");
      var fixTime=function(arr){
        for(var k in arr){
          if(arr.hasOwnProperty(k)){
            arr[k]="s0"+parseInt(Math.abs(arr[k]));
            arr[k]=arr[k].slice(-2);
          }
        }
        arr[0]>=24 ? arr[0]=23 : null;
        arr[0]<0 ? arr[0]=0 : null;
        arr[1]>=60 ? arr[1]=59 : null;
        arr[1]<0 ? arr[1]=0 : null;
        arr[2]>=60 ? arr[2]=59 : null;
        arr[2]<0 ? arr[2]=0 : null;
        return arr;
      };
      var setNowPanel=function(event){
        event.preventDefault();
        var date=new Date();
        var thisTimeArr=[date.getHours(),date.getMinutes(),date.getSeconds()];
        thisTimeArr=fixTime(thisTimeArr);
        $timePanel.find("input:eq(0)").val(thisTimeArr[0]);
        $timePanel.find("input:eq(1)").val(thisTimeArr[1]);
        $timePanel.find("input:eq(2)").val(thisTimeArr[2]);
      };//现在
      var resetPanel=function(event){
        event.preventDefault();
        $timePanel.find("input:eq(0)").val(timeArr[0]);
        $timePanel.find("input:eq(1)").val(timeArr[1]);
        $timePanel.find("input:eq(2)").val(timeArr[2]);
      };//还原
      var setDefaultPanel=function(event){
        event.preventDefault();
        var thisTimeArr=["00","00","00"];
        $timePanel.find("input:eq(0)").val(thisTimeArr[0]);
        $timePanel.find("input:eq(1)").val(thisTimeArr[1]);
        $timePanel.find("input:eq(2)").val(thisTimeArr[2]);
      };//现在
      var submitPanel=function(event){
        event.preventDefault();
        $this.removeAttr("disabled");
        timeArr=[$timePanel.find("input:eq(0)").val(),$timePanel.find("input:eq(1)").val(),$timePanel.find("input:eq(2)").val()];
        timeArr=fixTime(timeArr);
        thisTime=thisTime.replace("hh",timeArr[0].toString());
        thisTime=thisTime.replace("mm",timeArr[1].toString());
        thisTime=thisTime.replace("ss",timeArr[2].toString());
        $this.val(date+dateTimeSplit+thisTime);
        $timePanel.off("click","a").remove();
      };//确定
      var blurInput=function(){
        timeArr=[$timePanel.find("input:eq(0)").val(),$timePanel.find("input:eq(1)").val(),$timePanel.find("input:eq(2)").val()];
        timeArr=fixTime(timeArr);
        $timePanel.find("input:eq(0)").val(timeArr[0].toString());
        $timePanel.find("input:eq(1)").val(timeArr[1].toString());
        $timePanel.find("input:eq(2)").val(timeArr[2].toString());
      };//输入框失焦
      var cancelPanel=function(event){
        event.preventDefault();
        $this.removeAttr("disabled");
        $this.val(inst.lastVal);
        $timePanel.off("click","a").remove();
      };
      $timePanel.off("click","a");
      $timePanel.on("click","a.setNow",setNowPanel);
      $timePanel.on("click","a.submit",submitPanel);
      $timePanel.on("click","a.reset",resetPanel);
      $timePanel.on("click","a.setDefault",setDefaultPanel);
      $timePanel.on("click","a.cancel",cancelPanel);
      $timePanel.off("blur","input");
      $timePanel.on("blur","input",blurInput);
    };
  };//dateFormat:'yy-mm-dd',maxDate:'0d',onSelect:timePicker({timeFormat:'hh:mm:ss',dateTimeSplit:' '})
  var tryDrag=function(_i){
    var i=_i||0;
    if(i>20) return false;
    if($.fn.hasOwnProperty("elfDrag")){
      $(".elfDrag").elfDrag({"$target":$("body")});
    }//draggable类的元素可拖动}
    else{
      setTimeout(tryDrag,300,i++);
    }
  };
  tryDrag();
  //on
  $(document).on("keypress","form input",pri.triggerSubmit);//回车提交表单
  $(document).on("click","a.dis",function(event){
    event.preventDefault();
  });
  $(document).on("click","a.button",pri.ripple);
  $(document).on("click",".hasRipple",pri.ripple);
  $(document).on("click","section.tagPage>ul.menu li a",pri.tagSelect);//一级标签页
  $(document).on("click","section.tagPage2>ul.menu li a",pri.tagSelect);//二级标签页
  $(document).on("click","a.checkbox",pri.clickCheckbox);//复选框
  $(document).on("click","a.radio",pri.clickRadio);//单选按钮
  $(document).on("click","a.switch,a.switchPlus,a.switchCss3",pri.clickSwitch);//开关按钮!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!注意项目中不要关联,可能会得到开关的反值,此处仅用于测试
  $(document).on("click","div.downList .listSelected,div.downList b",pri.clickDownList);//点击下拉菜单
  $(document).on("mouseenter","div.downList ul li a",pri.mouseenterDownListA().run);
  $(document).on("keyup","div.downList .listSelected",pri.checkDownListKeyup);//下拉菜单快捷键
  $(document).on("mousedown","div.file input[type='text']",pri.clickInputFile);
  $(document).on("mouseenter","*[title]",pri.enterTitle);//鼠标经过带有title属性的元素显示title
  $(document).on("mouseenter",".ellipsis",pri.enterEllipsis);
  $(document).on("mouseenter","*[data-title]",pri.enterTitle);//鼠标经过带有title属性的元素显示title
  $(document).on("mousedown",".inputNumber a.subtract,.inputNumber a.add",pri.clickInputNumber);
  $(document).on("click",".inputNumber a.subtract,.inputNumber a.add",function(e){e.preventDefault()});
  $(document).on("blur","input[type=number]",pri.InputNumber);
  $(document).on("input propertychange","input[type=number]",pri.InputNumber);
  $(document).on("dblclick","img.handle",pri.alertImg);
  $(document).on("click","a.hasList",pri.clickHasList);
  //$(document).on("keyup","input.hasList");//搜索输入框
  //bugRepair
  $(document).on("click","a.byAlertClose",pri.inputErrReset);
  $(document).on("click","a.cancel",pri.inputErrReset);
  $(document).on("click",".pageNumberBox a",pri.inputErrReset);
  var initDataInterval=function(){
    var widget=[".downList[id]",".switchGear[id]"];
    var success=0;
    var overTime=new Date().getTime()+30000;//超时时间30秒
    var runThis=function(){
      widget.forEach(function(_e,_i){
        var emptyLength=0;
        $(_e).each(function(i,e){
          if($(e).html()===""){
            if(typeof(window[$(e).attr("id")+"Data"])!=="undefined"){
              $(e).initData();
            }
            else{
              emptyLength++;
            }
          }
        });
        if(emptyLength===0) success++;
      });
      if(success<widget.length&&new Date().getTime()<overTime) setTimeout(runThis,200);
    };
    runThis();
  };
  initDataInterval();
});