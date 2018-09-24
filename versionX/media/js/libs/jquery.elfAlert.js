/*
 * author:baiyukey@qq.com
 * version:0.6.0
 * update:2018.07.12
 */
$(function(){
  $.fn.extend({
    "elfAlert":function(val){
      val=$.extend({
        "fadeTime":320,
        "mark":true,
        "markOpacity":0.15,
        "markColor":"#FFF",
        "callback":false,
        "callbackArr":null,
        "closeBtn":true,
        "animate":100,
        "linkLine":false,// 按钮与窗体之间创建一根连线
        "scroll":false//默认禁止窗口滚动
      },val);
      val.animate=val.linkLine ? 0 : val.animate;
      val.mark=val.linkLine ? false : val.mark;
      var $window,
        $document;
      $window=$(window.top);
      $document=$(window.top.document);
      var $alertCont=$(this);
      if($alertCont.length===0){
        alert("对象未找到");
        return false;
      }
      var alertTitleHeight=0;
      var alertId=(Math.random()*1000).toFixed(0);
      var alertContOuterWidth=$alertCont.outerWidth();
      var alertContOuterHeight=$alertCont.outerHeight();
      var alertContHeight=$alertCont.height();
      var alertContDisplay=$alertCont.css("display");
      if(alertContOuterHeight>$document.height()){
        alertContHeight=$document.height()-(alertContOuterHeight-alertContHeight);
        alertContOuterHeight=$document.height();
      }
      var bodyMarkId="bodyMark_"+alertId;
      var disableMarkId="disableMark_"+alertId;
      var showPanelId="showPanel_"+alertId;
      var recordPlaceId="recordPlace_"+alertId;
      var closeBtnId="closeBtn_"+alertId;
      var bodyMarkHtml='<div id="'+bodyMarkId+'" class="bodyMark" style="position:absolute; width:'+$document.width()+'px; height:'+$document.height()+'px; z-index:888888; left:0; top:0; background:'+val.markColor+'; display:none;_position:absolute;_height:'+$document.outerHeight()+';"></div>';
      var showPanelHtml='<div id="'+showPanelId+'" data-fade-time="'+val.fadeTime+'" data-history-display="'+alertContDisplay+'" class="showPanel" style="display:none; width:'+alertContOuterWidth+'px; height:'+alertContOuterHeight+'px; position:absolute;_position:absolute; left:0; top:0;"><a href="#" id="'+closeBtnId+'" class="elfAlertClose" style="position:absolute; right:0; top:0; display:block; z-index:1;"></a><div class="elfAlertCont" style="position:absolute;padding:0;"></div></div><div id="'+disableMarkId+'" class="disableMark" style="position:absolute; display:none; width:'+$document.width()+'px; height:'+$document.height()+'px; z-index:999999; left:0; top:0; background:#ffffff;_position:absolute;_height:'+$document.outerHeight()+';"></div>';
      if(val.linkLine){
        var $source=val.linkLine.type==="custom" ? val.linkLine.target : $(val.linkLine.target);
        if(window!==window.top){
          var $thisWindow=$(window.top.document).find('iframe[src="'+window.location.pathname+'"]');
        }
        var sourceLeft=$source.offset().left+($thisWindow.length>0 ? $thisWindow.offset().left : 0);
        var sourceTop=$source.offset().top+($thisWindow.length>0 ? $thisWindow.offset().top : 0);
        var sourceWidth=$source.outerWidth();
        var line={
          linePath:[],
          sourceBorderPath:[],
          stroke:"#FFFFFF",
          fill:"#FFFFFF",
          lineWidth:"1"
        };
        line.linePath.push("M"+(Math.round(sourceLeft)-0.5)+' '+(Math.round(sourceTop)-0.5));
        line.linePath.push("L"+(Math.round(sourceLeft)-0.5)+' '+(Math.round(sourceTop)-0.5));
        line.sourceBorderPath.push('M'+(Math.round(sourceLeft)-0.5)+' '+(Math.round(sourceTop)+5)+' l 0 -5.5 l 5.5 0');
        line.sourceBorderPath.push('M'+(Math.round(sourceLeft+sourceWidth)+0.5)+' '+(Math.round(sourceTop)+5)+' l 0 -5.5 l -5.5 0');
        line.sourceBorderPath.push('M'+(Math.round(sourceLeft+sourceWidth)+0.5)+' '+(Math.round(sourceTop+$source.outerHeight())-5)+' l 0 5.5 l -5.5 0');
        line.sourceBorderPath.push('M'+(Math.round(sourceLeft)-0.5)+' '+(Math.round(sourceTop+$source.outerHeight())-5)+' l 0 5.5 l 5.5 0');
        var $bodyMarkSvg=$document.find("#bodyMarkSvg");
        var $thisLine=$document.find('#'+showPanelId+'Line');
        var $thisSourceBorder=$document.find('#'+showPanelId+'SourceBorder');
        if($bodyMarkSvg.length===0){
          var bodyMarkSvg='<svg id="bodyMarkSvg" xmlns="http://www.w3.org/2000/svg" version="1.1" class="bodyMarkSvg" style="position:absolute; width:'+$document.width()+'px; height:'+$document.height()+'px; z-index:888889; left:0; top:0;">';//页面仅允许一个svg 
          var thisLIneHtml='<path id="'+showPanelId+'Line" d="'+line.linePath.join(" ")+'" stroke="'+line.stroke+'" stroke-width="'+line.lineWidth+'" fill="none"></path>';
          var thisSourceBorderHtml='<path id="'+showPanelId+'SourceBorder" d="'+line.sourceBorderPath.join(" ")+'" stroke="'+line.stroke+'" stroke-width="'+line.lineWidth+'" fill="none"></path>';
          $document.find("body").append(bodyMarkSvg+thisSourceBorderHtml+thisLIneHtml+'</svg>');//补全svg节点
          $bodyMarkSvg=$document.find("#bodyMarkSvg");
          $thisLine=$document.find('#'+showPanelId+'Line');
          $thisSourceBorder=$document.find('#'+showPanelId+'SourceBorder');
        }
        else{
          if($thisLine.length===0){
            var linePath=document.createElementNS("http://www.w3.org/2000/svg","path");
            linePath.id=showPanelId+"Line";
            linePath.setAttribute("d",line.linePath.join(" "));
            linePath.setAttribute("stroke",line.stroke);
            linePath.setAttribute("stroke-width",line.lineWidth);
            linePath.setAttribute("fill","none");
            $bodyMarkSvg.append(linePath);
            $thisLine=$document.find('#'+showPanelId+'Line');
          }
          else{
            $thisLine.attr("d",line.linePath.join(" "));
            $thisLine.attr("stroke",line.stroke);
            $thisLine.attr("stroke-width",line.strokeWidth);
          }
          if($thisSourceBorder.length===0){
            var sourceBorderPath=document.createElementNS("http://www.w3.org/2000/svg","path");
            sourceBorderPath.id=showPanelId+"SourceBorder";
            sourceBorderPath.setAttribute("d",line.sourceBorderPath.join(" "));
            sourceBorderPath.setAttribute("stroke",line.stroke);
            sourceBorderPath.setAttribute("stroke-width",line.lineWidth);
            sourceBorderPath.setAttribute("fill","none");
            $bodyMarkSvg.append(sourceBorderPath);
            $thisSourceBorder=$document.find('#'+showPanelId+'SourceBorder');
          }
          else{
            $thisSourceBorder.attr("d",line.sourceBorderPath.join(" "));
            $thisSourceBorder.attr("stroke",line.stroke);
            $thisSourceBorder.attr("stroke-width",line.strokeWidth);
          }
        }
        $thisLine.show();
        $thisSourceBorder.show();
        $bodyMarkSvg.show();
      }
      $document.find("body").append(bodyMarkHtml);
      $document.find("body").append(showPanelHtml);
      $alertCont.before('<div id="'+recordPlaceId+'" style="display:none;"></div>');
      var $bodyMark=$document.find("#"+bodyMarkId);
      var $showPanel=$document.find("#"+showPanelId);
      var $disableMark=$document.find("#"+disableMarkId);
      var $recordPlace=$alertCont.closest("body").find("#"+recordPlaceId);
      var getShowPanelXy=function(){
        var alertX=($document.width()-alertContOuterWidth)*0.5;
        var alertY=0;
        var scrollTop=$document.scrollTop();
        if((scrollTop+alertContOuterHeight)>$document.height()){
          alertY=$document.height()-alertContOuterHeight;
        }
        else{
          alertY=scrollTop+(($window.height()-alertContOuterHeight)*0.4);
          alertY<scrollTop ? alertY=scrollTop : null;
        }
        alertY=Math.max(0,alertY);
        this.alertX=alertX;
        this.alertY=alertY;
      };
      var lineTo=function(_x,_y){
        if(val.linkLine===false) return false;
        //修正哪个边角引出
        var thisX=($showPanel.offset().left+($showPanel.outerWidth()/2))>(sourceLeft+(sourceWidth/2)) ? _x : (_x+$showPanel.outerWidth());
        var thisY=_y+($showPanel.find(".alertTitle").length>0 ? $showPanel.find(".alertTitle").height() : 0)+1;
        thisY=Math.round(thisY)+0.5;
        line.linePath[0]='M'+(Number(thisX)!==Number(_x) ? sourceLeft : sourceLeft+sourceWidth)+' '+sourceTop;//thisX!=_x时,面板右边角连线
        line.linePath[1]='L'+(thisX+(Number(thisX)!==Number(_x) ? 10 : -10))+' '+thisY;
        line.linePath[2]=' '+thisX+' '+thisY;
        $thisLine.attr("d",line.linePath.join(" "));
      };
      var convertZ=function(){
        $document.find(".showPanel").css({"z-index":999996});
        $(this).closest(".showPanel").css({"z-index":999997});
      };
      var showPanelLoaded=function(){
        $disableMark.hide();
        $alertCont.find("div.alertTitle").length>0 ? alertTitleHeight=$alertCont.find(".alertTitle").outerHeight() : null;//如果弹出中包含div.alertTitle
        if($showPanel.find("div.alertCont").length>0){
          var $thisCont=$showPanel.find("div.alertCont");
          $thisCont.css({
            "height":(alertContHeight-parseInt($thisCont.css("padding-top"))-parseInt($thisCont.css("padding-bottom"))-alertTitleHeight),
            "overflow-y":"auto"
          });
        }//如果弹出中包含div.alertCont
        /*if(typeof($window[0].onresize)==="function"&&$window[0].onresize.name!=="fixMarkSize"){
         $window[0].oldOnResize=$window[0].onresize;//oldOnResize永远不可能是fixMarkSize
         }
         $window[0].onresize=fixMarkSize;*/
        fixMarkSize();
        val.callback&&typeof(val.callback)==="function" ? val.callback.call(this,val.callbackArr) : null;
        $showPanel.find("input[type='text']:visible").length>0 ? $showPanel.find("input[type='text']:visible:eq(0)").focus() : $showPanel.find("textarea:eq(0)").focus();
      };
      var fixMarkSize=function(){
        $document.find(".bodyMark").css({
          "width":$window.width(),
          "height":$document.height()
        });
        $document.find(".disableMark").css({
          "width":$window.width(),
          "height":$document.height()
        });
        // if(typeof($window[0].oldOnResize)!=="undefined") $window[0].oldOnResize.call(this);
      };
      var showAlert=function(){
        $alertCont.show().insertBefore($showPanel.find("div.elfAlertCont"));
        var panelXy={};
        if(val.linkLine){
          panelXy.alertX=sourceLeft-$showPanel.outerWidth()-50;
          panelXy.alertX=Math.max(sourceWidth+50,panelXy.alertX);
          panelXy.alertX=Math.min(($document.width()-$showPanel.outerWidth()),panelXy.alertX);
          panelXy.alertY=sourceTop-($showPanel.outerHeight()/2)-50;
          panelXy.alertY=Math.max(0,panelXy.alertY);
          panelXy.alertY=Math.min($document.height()-$showPanel.height(),panelXy.alertY);
        }
        else{
          panelXy=new getShowPanelXy();
        }
        $disableMark.css({
          "opacity":"0.01",
          "display":"block"
        });
        $showPanel.css({
          "left":panelXy.alertX,
          "top":(panelXy.alertY-val.animate),
          "z-index":999998,
          "opacity":"0.1",
          "display":"block"
        });
        if($.fn.smooth){
          $showPanel.smoothStop(true,false).smooth({
            "top":(panelXy.alertY),
            "opacity":"1"
          },val.fadeTime,showPanelLoaded,"easeOut");
        }
        else{
          $showPanel.stop(true,false).animate({
            "top":(panelXy.alertY),
            "opacity":"1"
          },val.fadeTime,showPanelLoaded);
        }
        lineTo(panelXy.alertX,panelXy.alertY);
      };
      var exitAlert=function(event){
        event.preventDefault();
        var clearThis=function(){
          if($(("#"+recordPlaceId)).length===0){
            if(!$document|| !$document[0].getElementsByTagName('iframe')|| !$document[0].getElementsByTagName('iframe')[0].contentWindow) return false;
            $($document[0].getElementsByTagName('iframe')[0].contentWindow.document).find("#"+recordPlaceId).after($showPanel.find($alertCont).css({"display":alertContDisplay}));
          }
          else{
            $("#"+recordPlaceId).after($showPanel.find($alertCont).css({"display":alertContDisplay}));
          }
          $recordPlace.after($showPanel.find($alertCont).css({"display":alertContDisplay}));
          $recordPlace.remove();
          $showPanel.remove();
          $disableMark.remove();
          if($document.find(".bodyMark.wantShow").length>1){
            $bodyMark.siblings(".bodyMark.wantShow:eq(0)").show();
            $bodyMark[$.fn.smooth ? "smoothStop" : "stop"](true,false).remove();
          }
          else if($document.find(".bodyMark.wantShow").length===1){
            $bodyMark[$.fn.smooth ? "smoothStop" : "stop"](true,false);
            if($bodyMark.hasClass("wantShow")){
              $bodyMark[$.fn.smooth ? "smoothOut" : "fadeOut"](val.fadeTime,function(){$bodyMark.remove()});
            }
            else{
              $bodyMark[$.fn.smooth ? "smoothStop" : "stop"](true,false).remove();
            }
          }
          else{
            $bodyMark[$.fn.smooth ? "smoothStop" : "stop"](true,false).remove();
          }
          if(val.linkLine!==false){
            $thisLine.remove();
            $thisSourceBorder.remove();
            $bodyMarkSvg.hide();
          }
          if(!val.scroll) removeUnScroll();
          /*
           if($document.find(".showPanel:visible").length===0){
           if(typeof($window[0].oldOnResize)==="function"){
           $window[0].onresize=$window[0].oldOnResize ? $window[0].oldOnResize : null;
           $window[0].oldOnResize=undefined;
           }
           else{
           $window[0].onresize=null;
           }
           }
           */
        };
        $disableMark.show();
        $showPanel.off("click","#"+closeBtnId);
        if(val.linkLine){
          //line.linePath[1]=line.linePath[0].replace("M","L");
          $thisLine.attr("d","");
        }
        if($.fn.smooth){
          $showPanel.smoothStop(true,false).smooth({
            "top":($showPanel.offset().top-val.animate),
            "opacity":0
          },val.fadeTime,clearThis,"easeIn");
        }
        else{
          $showPanel.stop(true,false).animate({
            "top":($showPanel.offset().top-val.animate),
            "opacity":0
          },val.fadeTime,clearThis);
        }
      };
      var unScroll=function(){
        var currentScrollTop=$document.scrollTop();
        $document.on('scroll.unable',function(e){
          $document.scrollTop(currentScrollTop);
        })
      };//禁止滚动条滚动
      var removeUnScroll=function(){
        $document.off("scroll.unable");
      };//移除禁止滚动条滚动
      if(val.closeBtn===false) $document.find("#"+closeBtnId).hide();
      if(val.mark){
        $bodyMark.addClass("wantShow").css("opacity",val.markOpacity);
        if($document.find(".bodyMark.wantShow").length===1){
          $document.find(".bodyMark.wantShow").eq(0)[$.fn.smooth ? "smoothIn" : "smoothIn"](300,showAlert);
        }
        else if($document.find(".bodyMark.wantShow").length>1){
          $document.find(".bodyMark.wantShow").eq(0)[$.fn.smooth ? "smoothIn" : "smoothIn"](0,showAlert).siblings(".bodyMark.wantShow").hide();
        }
        else{
          showAlert();
        }
      }
      else{
        showAlert();
      }
      if(val.linkLine!==false) $document.one("click","#bodyMarkSvg",exitAlert);
      if(!val.scroll) unScroll();
      $showPanel.on("click","#"+closeBtnId,exitAlert);
      $showPanel.on("click","a.cancel",exitAlert);
      $showPanel.find(".alertTitle").off("mousedown");
      $showPanel.on("mousedown",".alertTitle",function(event){
        //with($showPanel){
        var baseX,
          baseY,
          eX,
          eY,
          bodyW,
          bodyH,
          moveX,
          moveY;
        baseX=$showPanel.offset().left;
        baseY=$showPanel.offset().top;
        eX=event.pageX;
        eY=event.pageY;
        bodyW=$showPanel.closest("body").width();
        bodyH=$showPanel.closest("body").height();
        var moveThis=function(e){
          moveX=e.pageX-eX+baseX;
          moveY=e.pageY-eY+baseY;
          if(moveX<=0) return false;
          if(moveX>=(bodyW-$showPanel.width())) return false;
          if(moveY<=0) return false;
          if(moveY>=(bodyH-$showPanel.height())) return false;
          $showPanel.css({
            "left":moveX,
            "top":moveY
          });
          lineTo(moveX,moveY);
        };
        $showPanel.css({"cursor":"move"});
        var thisUserSelect=window.getComputedStyle($("body")[0])["user-select"];
        $showPanel.closest("body").css({
          "-moz-user-select":"none",
          "-webkit-user-select":"none",
          "-ms-user-select":"none",
          "-khtml-user-select":"none",
          "user-select":"none"
        });
        var moveFinish=function(){
          $document[0].removeEventListener("mousemove",moveThis);
          $document[0].removeEventListener("mouseup",moveFinish);
          $showPanel.css({"cursor":""});
          $showPanel.closest("body").css({
            "-moz-user-select":thisUserSelect,
            "-webkit-user-select":thisUserSelect,
            "-ms-user-select":thisUserSelect,
            "-khtml-user-select":thisUserSelect,
            "user-select":thisUserSelect
          });
        };
        $document[0].addEventListener("mousemove",moveThis);
        $document[0].addEventListener("mouseup",moveFinish);
      });
      $showPanel.on("mousedown",this,convertZ);
      if($document.find(".bodyMark").length>0) $document.find(".bodyMark").off("click").on("click",function(){
        if($document.find(".showPanel").length===1){
          $document.find(".showPanel").find(".elfAlertClose").trigger("click");
          $document.find(".bodyMark").off("click");
        }
      });
      //$showPanel.on("click","input.cancel",exitAlert);//如果有取消按钮
      return $alertCont;
    },
    "elfAlertExit":function(val){
      var $this=$(this);
      var showPanelId=$this.closest(".showPanel").attr("id");
      var thisOpacity=$("#"+showPanelId).css("opacity");
      var $document=$(window.top.document);
      val=$.extend({
        "fadeTime":parseInt($document.find("#"+showPanelId).attr("data-fade-time")),
        "callback":false,
        "callbackArr":null,
        "animate":100
      },val);
      var checkSuccess=function(){
        if($document.find("#"+showPanelId).length===1&&$document.find("#"+showPanelId).css("opacity")===thisOpacity){
          var thisId=showPanelId.replace("showPanel","");
          var alertContDisplay=$document.find("#"+showPanelId).attr("data-history-display");
          var $recordPlace=$("#recordPlace"+thisId);
          var clearThis=function(){
            if($recordPlace.length===0){
              $($document[0].getElementsByTagName('iframe')[0].contentWindow.document).find("#recordPlace"+thisId).after($("#showPanel"+thisId).find($this).css({"display":alertContDisplay}));
              $($document[0].getElementsByTagName('iframe')[0].contentWindow.document).find("#recordPlace"+thisId).remove();
            }
            else{
              $recordPlace.after($("#showPanel"+thisId).find($this).css({"display":alertContDisplay}));
              $recordPlace.remove();
            }
            $document.find("#disableMark"+thisId).remove();
            $document.find("#showPanel"+thisId).remove();
            if($document.find(".bodyMark.wantShow").length>1){
              $document.find("#bodyMark"+thisId).siblings(".bodyMark.wantShow:eq(0)").show();
              $document.find("#bodyMark"+thisId)[$.fn.smooth ? "smoothStop" : "stop"](true,false).remove();
            }
            else if($document.find(".bodyMark.wantShow").length===1){
              if($document.find("#bodyMark"+thisId).hasClass("wantShow")){
                $document.find("#bodyMark"+thisId)[$.fn.smooth ? "smoothStop" : "stop"](true,false);
                $document.find("#bodyMark"+thisId)[$.fn.smooth ? "smoothOut" : "fadeOut"](val.fadeTime,function(){$document.find("#bodyMark"+thisId).remove()});
              }
              else{
                $document.find("#bodyMark"+thisId)[$.fn.smooth ? "smoothStop" : "stop"](true,false).remove();
              }
            }
            else{
              $document.find("#bodyMark"+thisId)[$.fn.smooth ? "smoothStop" : "stop"](true,false).remove();
            }
            /*if($document.find(".showPanel:visible").length===0){
             if(typeof($window[0].oldOnResize)==="function"){
             $window[0].onresize=$window[0].oldOnResize ? $window[0].oldOnResize : null;
             $window[0].oldOnResize=undefined;
             }
             }*/
            val.callback&&typeof(val.callback)==="function" ? val.callback.call(this,val.callbackArr) : null;
          };
          $document.find("#"+showPanelId+"Line").remove();
          $document.find("#"+showPanelId+"SourceBorder").remove();
          //$document.find("#bodyMarkSvg").hide(); 
          if($.fn.smooth){
            $document.find("#showPanel"+thisId).smoothStop(true,false).smooth({
              "top":($document.find("#showPanel"+thisId).offset().top-(val.linkLine ? 0 : val.animate)),
              "opacity":0
            },val.fadeTime,clearThis,"easeIn");
          }
          else{
            $document.find("#showPanel"+thisId).stop(true,false).animate({
              "top":($document.find("#showPanel"+thisId).offset().top-(val.linkLine ? 0 : val.animate)),
              "opacity":0
            },val.fadeTime).fadeOut(0,clearThis);
          }
        }//未成功退出的强制退出
        else{
          val.callback&&typeof(val.callback)==="function" ? val.callback.call(this,val.callbackArr) : null;
        }
      };
      $this.closest(".showPanel").find("a.elfAlertClose").trigger("click");
      setTimeout(checkSuccess,val.fadeTime);
      return $(this);
    }
  });
});