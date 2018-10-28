/**
 * Created by baiyu on 2012/9/1.
 * version:0.5.5
 */
$(function(){
  $.fn.extend({
    "initTriangle":function(_val){
      var val=$.extend({
        "position":[[81,476],[1121,476],[413,17]],//三角形三点度坐标
        "fixed":false,//true表示纠正三角位置,使其在元素内居中
        "logo":false,//jquery元素
        "menu":false,//jquery元素
        "active":false,//是否可拖动交叉点改变形状
        "drawRect":false,
        "style":{
          "color":"#556677",
          "background":"#000"
        },
        "callback":false,
        "callbackOption":null
      },_val);
      var style=val.style;//颜色先写死吧
      $(this).css({"background-color":style.background});
      if($(this).find("#triangleCanvas").length===0) $(this).append('<canvas id="triangleCanvas" style="position:absolute; left:0; top:0; z-index:-1;"></canvas>');
      var thisCanvas=document.getElementById("triangleCanvas");
      var triangle=thisCanvas.getContext("2d");
      var borderLine=thisCanvas.getContext("2d");
      var point=thisCanvas.getContext("2d");
      var drawRect=thisCanvas.getContext("2d");
      var triangleStyle={
        "width":0,
        "height":0,
        "fixTop":0,
        "fixLeft":0,
        "marginTop":-100
      };
      var pointStyle={
        "color":"rgba(255,255,255,0.5)",
        "borderColor":"rgba(255,255,255,0.5)",
        "borderWidth":1,
        "radius":10
      };
      var i=0;
      var positions=val.position;
      var points=[];//所有的控制点
      var bodySize=function(){
        var $document=$(document);
        this.width=function(){return Math.max($document.width(),$(window).innerWidth())};
        this.height=function(){return Math.max($document.height(),$(window).innerHeight())};
      };
      var thisBodySize=new bodySize();
      var reDraw=function(){
        thisCanvas.width=thisBodySize.width();
        thisCanvas.height=thisBodySize.height();
        triangle.clearRect(0,0,thisCanvas.width,thisCanvas.height);
        drawTriangle();
        drawPoint();
      };
      var line=function(_x1,_y1,_x2,_y2){
        var ky,
          kx;
        if(_x1===_x2){
          kx=0;
          ky=_y1;
        }
        else if(_y1===_y2){
          kx=_x1;
          ky=0;
        }
        else{
          kx=(_x2-_x1)/(_y2-_y1);
          ky=(_y2-_y1)/(_x2-_x1);
        }
        this.returnX=function(_y){return kx*(_y-_y1)+_x1};
        this.returnY=function(_x){return ky*(_x-_x1)+_y1};
      };
      var rotate=function(_x1,_y1,_x2,_y2){
        var x=Math.abs(_x2-_x1);
        var y=Math.abs(_y2-_y1);
        var z=Math.sqrt(x*x+y*y);
        return (Math.asin(y/z)/Math.PI*180)*(_y2>_y1 ? 1 : -1); //得到的角度
      };
      var drawLine=function(_x1,_y1,_x2,_y2){
        var thisLine=new line(_x1,_y1,_x2,_y2);
        var linePath=[];
        if(_x1===_x2&&_y1!==_y2){
          linePath.push([_x1,0],[_x1,thisCanvas.height]);
        }
        else if(_x1!==_x2&&_y1===_y2){
          linePath.push([0,_y1],[thisCanvas.width,_y1]);
        }
        else if(_x1===_x2&&_y1===_y2){
          return false;
        }
        else{
          linePath.push([0,thisLine.returnY(0)]);
          linePath.push([thisCanvas.width,thisLine.returnY(thisCanvas.width)]);
        }
        borderLine.beginPath();
        borderLine.moveTo(linePath[0][0],linePath[0][1]);
        borderLine.lineTo(linePath[1][0],linePath[1][1]);
        borderLine.closePath();
        borderLine.strokeStyle=style.color;
        borderLine.stroke();
      };
      var leftRight=[];
      var rotateNav=function(){
        points.sort(function(a,b){return a["y"]-b["y"]});
        leftRight=[points[1],points[2]];//三角形底边
        leftRight.sort(function(a,b){return a["x"]-b["x"]});//还是不能很好的把底边计算出来
        var thisRotate=rotate(leftRight[0].x,leftRight[0].y,leftRight[1].x,leftRight[1].y);
        if(val.menu){
          val.menu[0].style.webkitTransform="rotate("+thisRotate+"deg)";
          //console.log("_x1:"+_x1+",_y1:"+_y1+",_x2:"+_x2+",_y2:"+_y2);
          val.menu[0].style.left=((Math.abs(leftRight[0].x-leftRight[1].x)-val.menu[0].offsetWidth)/2+Math.min(leftRight[0].x,leftRight[1].x))+"px";
          val.menu[0].style.top=(Math.abs(leftRight[0].y-leftRight[1].y)/2+val.menu[0].offsetHeight+Math.min(leftRight[0].y,leftRight[1].y))+"px";
        }
        if(val.logo){
          val.logo[0].style.webkitTransform="rotate("+thisRotate+"deg)";
          val.logo[0].style.left=((Math.abs(leftRight[0].x-leftRight[1].x)-val.logo[0].offsetWidth)/2+Math.min(leftRight[0].x,leftRight[1].x))+"px";
          val.logo[0].style.top=(Math.abs(leftRight[0].y-leftRight[1].y)/2-val.logo[0].offsetHeight+Math.min(leftRight[0].y,leftRight[1].y))+"px";
        }
        if(val.drawRect){
          var horizontalLine=new line(leftRight[0].x,leftRight[0].y,leftRight[1].x,leftRight[1].y);
          var verticalLine=new line(points[2].x,points[2].y,leftRight[1].x,leftRight[1].y);
          drawRect.beginPath();
          drawRect.moveTo(leftRight[1].x+1,leftRight[1].y+1);
          drawRect.lineTo(thisCanvas.width,horizontalLine.returnY(thisCanvas.width)+1);
          drawRect.lineTo(thisCanvas.width,thisCanvas.height);
          drawRect.lineTo(verticalLine.returnX(thisCanvas.height)+1,thisCanvas.height);
          drawRect.closePath();
          drawRect.fillStyle="#112233";
          drawRect.fill();
        }
      };
      var drawTriangle=function(){
        triangle.beginPath();
        for(i=0; i<points.length-1; i++){
          if(i===0){
            triangle.moveTo(points[i].x,points[i].y);
          }
          else{
            triangle.lineTo(points[i].x,points[i].y);
          }
        }
        triangle.lineTo(points[i].x,points[i].y);
        triangle.fillStyle=style.color;
        triangle.closePath();
        triangle.fill();
        rotateNav();
        for(i= -1; i<points.length-1; i++){
          if(i=== -1){
            drawLine(points[points.length-1].x,points[points.length-1].y,points[0].x,points[0].y);
          }
          else{
            drawLine(points[i].x,points[i].y,points[i+1].x,points[i+1].y);
          }
        }
      };
      var aPoint=function(_x,_y,_radius,_color,_borderColor){
        this.x=val.fixed ? Math.max(0,_x) : _x;
        this.x=val.fixed ? Math.min(thisCanvas.width,this.x) : this.x;
        this.y=val.fixed ? Math.max(0,_y) : _y;
        this.y=val.fixed ? Math.min(thisCanvas.height,this.y) : this.y;
        this.radius=_radius;
        this.color=_color;
        this.borderColor=_borderColor;
        this.isSelected=false;
      };
      //var addPoints=function(_t,_l,_r){};
      var recordPoints=function(_all){
        points=[];
        for(i=0; i<_all.length; i++){
          var thisRecord=new aPoint(_all[i][0],_all[i][1],pointStyle.radius,pointStyle.color,pointStyle.borderColor);
          points.push(thisRecord);
        }
      };
      var drawPoint=function(){
        var addPoint=function(_fillColor,_borderColor,_borderWidth){
          point.fillStyle=_fillColor;
          point.strokeStyle=_borderColor;
          point.lineWidth=_borderWidth;
          this.draw=function(_record){
            if(_record.selected) point.lineWidth=4;
            point.beginPath();
            point.arc(_record.x,_record.y,_record.radius,Math.PI*0.1,Math.PI*0.4,false);
            point.stroke();
            point.beginPath();
            point.arc(_record.x,_record.y,_record.radius,Math.PI*0.6,Math.PI*0.9,false);
            point.stroke();
            point.beginPath();
            point.arc(_record.x,_record.y,_record.radius,Math.PI*1.1,Math.PI*1.4,false);
            point.stroke();
            point.beginPath();
            point.arc(_record.x,_record.y,_record.radius,Math.PI*1.6,Math.PI*1.9,false);
            point.stroke();
          };
        };
        var thisPoint=new addPoint(pointStyle.color,pointStyle.borderColor,pointStyle.borderWidth);
        for(i=0; i<points.length; i++){
          thisPoint.draw(points[i]);
        }
        //point.fill();
      };
      var selectedPoint=null;
      var mouseDownCanvas=function(e){
        e.preventDefault();
        var x=e.pageX-this.offsetLeft;
        var y=e.pageY-this.offsetTop;
        var distanceFromCenter=0;
        for(i=0; i<points.length; i++){
          distanceFromCenter=Math.sqrt(Math.pow(points[i].x-x,2)+Math.pow(points[i].y-y,2));
          if(distanceFromCenter<=pointStyle.radius){
            points[i].selected=true;
            selectedPoint=points[i];
            reDraw();
            return;
          }
        }
      };
      var mouseUpCanvas=function(){
        if(selectedPoint===null) return false;
        selectedPoint.selected=false;
        selectedPoint=null;
        reDraw();
      };
      var mouseMoveCanvas=function(e){
        e.preventDefault();
        if(selectedPoint===null) return false;
        selectedPoint.x=e.pageX-this.offsetLeft;
        selectedPoint.y=e.pageY-this.offsetTop;
        reDraw();
      };
      var init=function(e){
        var runThis=function(){
          if(points.length>0){
            positions=[];
            for(i=0; i<points.length; i++){
              positions.push([points[i].x-triangleStyle.fixLeft,points[i].y-triangleStyle.fixTop]);
            }
          }
          thisCanvas.width="auto";
          thisCanvas.height="auto";
          thisCanvas.width=thisBodySize.width();
          thisCanvas.height=thisBodySize.height();
          triangleStyle.width=Math.max(positions[0][0],positions[1][0],positions[2][0])-Math.min(positions[0][0],positions[1][0],positions[2][0]);
          triangleStyle.height=Math.max(positions[0][1],positions[1][1],positions[2][1])-Math.min(positions[0][1],positions[1][1],positions[2][1]);
          triangleStyle.fixLeft=val.fixed ? (thisCanvas.width-triangleStyle.width)/2 : 0;
          triangleStyle.fixTop=val.fixed ? (thisCanvas.height-triangleStyle.height)/2+triangleStyle.marginTop : 0;
          for(i=0; i<positions.length; i++){
            positions[i][0]+=triangleStyle.fixLeft;
            positions[i][1]+=triangleStyle.fixTop;
          }
          recordPoints(positions);
          triangle.clearRect(0,0,1000,1000);
          drawTriangle();
          rotateNav();
          if(val.active) drawPoint();
          if(val.callback) val.callback.call(this,val.callbackOption);
        };
        if(typeof(window.waitInitTriangle)!=="undefined") clearTimeout(window.waitInitTriangle);
        if(typeof(e)==="undefined"){
          runThis();
        }
        else{
          window.waitInitTriangle=setTimeout(runThis,100);
        }
      };
      window.removeEventListener("resize",init);
      window.addEventListener("resize",init);
      var $thisBody=$("body");
      var currentBodySize=$thisBody.width()+"*"+$thisBody.height();
      var bodySizeChange=function(){
        if(($thisBody.width()+"*"+$thisBody.height())===currentBodySize) return false;
        currentBodySize=$thisBody.width()+"*"+$thisBody.height();
        init();
      };
      window.listenBodySize=setInterval(bodySizeChange,500);
      if(val.active){
        thisCanvas.removeEventListener("mousedown",mouseDownCanvas);
        thisCanvas.addEventListener("mousedown",mouseDownCanvas);
        thisCanvas.removeEventListener("mouseup",mouseUpCanvas);
        thisCanvas.addEventListener("mouseup",mouseUpCanvas);
        thisCanvas.removeEventListener("mousemove",mouseMoveCanvas);
        thisCanvas.addEventListener("mousemove",mouseMoveCanvas);
      }
      init();
      window.rePoints=function(){
        var arr=[];
        points.forEach(function(e){
          arr.push([e.x,e.y]);
        });
        return arr;
      };
    }
  });
});