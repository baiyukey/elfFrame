/*
 author:baiyukey@qq.com
 version:0.01.01
 使html元素可拖动
 */
;$.fn.extend({
  "elfDrag":function(_val){
    var val=$.extend({
      "$target":false
    },_val);
    var pri={
      fadeTime:typeof(window["myPage"].fadeTime)!=="undefined" ? window["myPage"].fadeTime : 0,
      isIn:function(x,y,$zoom){
        if(!$zoom|| !$zoom.offset()) return false;
        var zoomX=[$zoom.offset().left,$zoom.offset().left+$zoom.outerWidth()];
        var zoomY=[$zoom.offset().top,$zoom.offset().top+$zoom.outerHeight()];
        return x>=zoomX[0]&&x<=zoomX[1]&&y>=zoomY[0]&&y<=zoomY[1];
      }
    };
    var run=function(i,e){
      var $this=$(e);
      if(val.$target===false) val.$target=$this.parent();
      var initThis=function(){
        $this.attr("data-style",$this.attr("style")||"");
      };
      var dragActive=function(_event){
        var event=_event;
        var runThis=function(){
          var baseLeft,
            baseTop,
            mousedownX,
            mousedownY,
            bodyW,
            bodyH,
            moveX,
            moveY;
          var $body=$this.closest("body");
          baseLeft=$this.offset().left;
          baseTop=$this.offset().top;
          mousedownX=event.pageX;
          mousedownY=event.pageY;
          bodyW=$body.width();
          bodyH=$body.height();
          var center={
            "X":baseLeft+($this.outerWidth()/2),
            "Y":baseTop+($this.outerHeight()/2)
          };
          var origin=["left","top"];
          var rotate={
            "X":0,
            "Y":0
          };
          var maxRotate={
            "X":10,
            "Y":Math.min(10,$this.outerWidth()/$this.outerHeight()*10)
          };
          rotate.X=center.Y-mousedownY>0 ? Math.min(maxRotate.X,center.Y-mousedownY) : Math.max(0-maxRotate.X,center.Y-mousedownY);
          rotate.Y=center.X-mousedownX>0 ? Math.min(maxRotate.Y,center.X-mousedownX) : Math.max(0-maxRotate.Y,center.X-mousedownX);
          origin[0]=mousedownX>center.X ? "right" : "left";
          origin[1]=mousedownY>center.Y ? "bottom" : "top";
          var foundTarget=function(_event){
            var $thisTarget=false;
            val.$target.each(function(i,e){
              if(pri.isIn(_event.pageX,_event.pageY,$(e))){
                $thisTarget=$(e);
                return false;
              }
            });
            return $thisTarget;
          };
          var moveThis=function(e){
            e.preventDefault();
            moveX=e.pageX-mousedownX+baseLeft;
            moveY=e.pageY-mousedownY+baseTop;
            if(e.pageX<0||e.pageY<0||e.pageX>bodyW||e.pageY>bodyH) return false;
            $this.addClass("moving").css({
              "position":"absolute",
              "left":$this.width()===bodyW ? 0 : moveX,
              "top":moveY
            });
            var positionPreview=function(_event){
              var showPosition=function(){
                if($thisTarget===false) return false;//加个保险
                var $dragPosition=$("#dragPosition");
                if($dragPosition.length===0){
                  $("body").append('<div class="dragPosition" id="dragPosition" style="display:none;"></div>');
                  $dragPosition=$("#dragPosition");
                }
                $dragPosition.css({
                  "width":$this.outerWidth(),
                  "height":$this.outerHeight(),
                  "background":"rgba(255,0,0,0.2)"
                });
                var $thisChildren=$thisTarget.children().not($this).not("#dragPosition");
                if($thisChildren.length>=1){
                  var $mousedownChildren=false;
                  $thisChildren.each(function(i,e){
                    if(pri.isIn(_event.pageX,_event.pageY,$(e))){
                      $mousedownChildren=$(e);
                      return false;
                    }
                  });
                  if($mousedownChildren!==false){
                    $dragPosition.insertAfter($mousedownChildren);
                    $dragPosition.show()
                  }
                  else{
                    $dragPosition.appendTo($thisTarget);
                    $dragPosition.show()
                  }
                }
                else{
                  $dragPosition.appendTo($thisTarget);
                  $dragPosition.show()
                }
              };
              var $thisTarget=foundTarget(_event);
              if($thisTarget===false){
                $("#dragPosition").remove()//使提醒元素消失
              }//没有接收区域
              else{//有接收区域
                if(!$thisTarget.find($this).length>0){ //目标容器不是其父元素时
                  //$("#dragPosition").remove();//使提醒元素消失
                  showPosition();
                }
                else{//目标元素是其父元素时
                  if($thisTarget[0].tagName!=="BODY"){ //目标容器中还包含其它元素,目标容器也不是body
                    showPosition();
                  }
                  else{
                    $("#dragPosition").hide()//使提醒元素消失
                  }
                }
              }
            };
            if(typeof(window.waitMoveThisTimeout)!=="undefined") clearTimeout(window.waitMoveThisTimeout);
            window.waitMoveThisTimeout=setTimeout(positionPreview,300,e);
          };
          var moveUp=function(event){
            $body[0].removeEventListener("mousemove",moveThis);
            $body[0].removeEventListener("mouseup",moveUp);
            $this.css({"cursor":"auto"}).removeClass("dragActive");
            $body.css({
              "-moz-user-select":"",
              "-webkit-user-select":"",
              "-ms-user-select":"",
              "-khtml-user-select":"",
              "user-select":""
            });
            if(typeof(window.waitMoveThisTimeout)!=="undefined") clearTimeout(window.waitMoveThisTimeout);
            $("#dragPosition").remove();
            var insertTarget=function(){
              if($thisTarget===false) return false;//加个保险
              if(!$this.hasClass("moving")){
                $this.removeClass("moving");
                return false;
              }
              else{
                $this.removeClass("moving");
              }
              var $thisChildren=$thisTarget.children().not($this).not("#dragPosition");
              if($thisChildren.length>=1){
                var $mousedownChildren=false;
                $thisChildren.each(function(i,e){
                  if(pri.isIn(event.pageX,event.pageY,$(e))){
                    $mousedownChildren=$(e);
                    return false;
                  }
                });
                if($mousedownChildren!==false){
                  $this.insertAfter($mousedownChildren);
                  $this.attr("style",$this.attr("data-style"));
                }
                else{
                  $this.appendTo($thisTarget);
                  $this.attr("style",$this.attr("data-style"));
                }
              }
              else{
                $this.appendTo($thisTarget);
                $this.attr("style",$this.attr("data-style"));
              }
            };
            var $thisTarget=foundTarget(event);
            //var $thisTarget=$this;
            if($thisTarget===false){
              $this.attr("style",$this.attr("data-style"));
            }//没有接收区域
            else{//有接收区域
              if(!$thisTarget.find($this).length>0){ //目标容器不是其父元素时
                insertTarget();
              }
              else{//目标元素是其父元素时
                if($thisTarget.children().length>1&&$thisTarget[0].tagName!=="BODY"){ //目标容器中还包含其它元素同时目标容器不是body
                  insertTarget();
                }
                $this.css({
                  "z-index":"initial",
                  "transform":"initial",
                  "transform-origin":"initial",
                  "-webkit-transform":"initial",
                  "-webkit-transform-origin":"initial"
                });
              }
            }
          };
          $this.removeClass("dragHover").addClass("dragActive").css({
            //"position":"absolute",
            "-webkit-transform":"rotateX("+rotate.X+"deg) rotateY("+rotate.Y+"deg)",
            "-webkit-transform-origin":origin.join(" "),
            "z-index":999999
          });
          //$this.parent().addClass("dragParent");
          $this.css({"cursor":"move"});
          $body.css({
            "-moz-user-select":"none",
            "-webkit-user-select":"none",
            "-ms-user-select":"none",
            "-khtml-user-select":"none",
            "user-select":"none"
          });
          $body[0].removeEventListener("mousemove",moveThis);
          $body[0].removeEventListener("mouseup",moveUp);
          $body[0].addEventListener("mousemove",moveThis);
          $body[0].addEventListener("mouseup",moveUp);
        };
        if($this.hasClass("readOnly")||$this.hasClass("disable")) return false;
        runThis();
      };
      var enterThis=function(){
        if($this.hasClass("readOnly")||$this.hasClass("disable")) return false;
        $(this).addClass("dragHover");
      };
      var leaveThis=function(){
        if($this.hasClass("readOnly")||$this.hasClass("disable")) return false;
        $(this).removeClass("dragHover");
      };
      initThis();
      //$this.off("click").on("click",this,function(e){e.preventDefault();});
      $this.off("mousedown").on("mousedown",dragActive);
      $this.off("mouseenter").on("mouseenter",enterThis);
      $this.off("mouseleave").on("mouseleave",leaveThis);
    };
    $(this).each(run);
    return this.each(function(){});
  }
});//使指定元素在指定指定元素内部区域可拖动