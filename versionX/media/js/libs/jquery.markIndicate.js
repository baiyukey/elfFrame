//在jQuery元素(集合)上临时建立一个透明提示层后渐隐消失并删除,常用于修改及删除条目等操作后的短暂提示.
//author:baiyukey@qq.com
//version:0.00.007
//updateDate:2018.05.09
$.fn.extend({
  "markIndicate":function(_val){
    var $this=$(this);
    var __val=typeof(_val)==="string" ? {text:_val} : _val;
    var val=$.extend({
      text:"操作成功!",
      color:"#fff",
      background:"rgba(0,150,150,1)",
      callback:undefined,
      option:undefined,
      waitMs:-1
    },__val);
    var pri={
      "fadeTime":typeof(window.myPage)!=="undefined" ? window.myPage.fadeTime : 256
    };
    if(val.waitMs=== -1) val.waitMs=Math.max(pri.fadeTime*2,val.text.length*120);
    if(typeof($.fn.smooth)==="undefined") $.fn.smooth=$.fn.animate;
    var perIndicate=function(_i,_e){
      var i=_i;
      var $thisItem=$(_e);
      var runThis=function(){
        var thisItemStyle=document.defaultView.getComputedStyle($thisItem[0],null);
        var thisStyle={
          "width":(parseFloat(thisItemStyle["width"])+parseFloat(thisItemStyle["border-left-width"])+parseFloat(thisItemStyle["border-right-width"])+parseFloat(thisItemStyle["padding-left"])+parseFloat(thisItemStyle["padding-right"]))+"px",
          "height":(parseFloat(thisItemStyle["height"])+parseFloat(thisItemStyle["border-top-width"])+parseFloat(thisItemStyle["border-bottom-width"])+parseFloat(thisItemStyle["padding-top"])+parseFloat(thisItemStyle["padding-bottom"]))+"px",
          "left":$thisItem.offset().left+"px",
          "top":$thisItem.offset().top+"px",
          "borderRadius":thisItemStyle["border-radius"]||"0px"
        };
        var thisMarkId="tempHostMark"+new Date().getTime()+i;
        var thisLineBox=thisMarkId+"LineBox";
        var emptyInfo=function(){
          var $thisLineBox=$("#"+thisLineBox);
          if($thisLineBox.length===0) return false;
          var size={
            "width":$thisLineBox.width(),
            "height":$thisLineBox.height()
          };
          var lineId=thisMarkId+"line";
          $thisLineBox.append('<div style="text-align:justify;width:'+size.width+'px;position:absolute;top:'+(size.height/2)+'px;"><p id="'+lineId+'" style="margin:0 auto;width:'+Math.min(size.width*0.9,val.text.length*12*3)+'px;height:1px;font-size:0;background:-webkit-linear-gradient(left, rgba(255, 255, 255,0), rgba(255, 255, 255,1) 20%, rgba(255, 255, 255, 1) 80%, rgba(255, 255, 255, 0));opacity:0"></p></div>');
          $("#"+lineId).smooth({
            "opacity":1,
            "width":1,
            "height":1
          },pri.fadeTime,false,"Linear").smooth({"opacity":0},pri.fadeTime).smooth({"opacity":1},pri.fadeTime,false,"Linear").smooth({"opacity":0},pri.fadeTime,function(){
            $thisLineBox.remove();
          },"Linear");
        };
        $("body").append('<div id="'+thisMarkId+'" class="markIndicate" style="position:absolute; width:'+thisStyle.width+'; height:'+thisStyle.height+'; line-height:'+thisStyle.height+'; left:'+thisStyle.left+'; top:'+thisStyle.top+';border-radius:'+thisStyle.borderRadius+';z-index:999998;text-align:center;font-size:0.75rem; background-color:rgba(49, 151, 169, 0.9);color:#FFFFFF;opacity:0"><p style="display:inline-block;line-height:12px;overflow:hidden;vertical-align:middle;" id="'+thisMarkId+'Text">'+val.text+'</p></div><div id="'+thisLineBox+'" style="position:absolute; width:'+thisStyle.width+'; height:'+thisStyle.height+'; line-height:'+thisStyle.height+'; left:'+thisStyle.left+'; top:'+thisStyle.top+';border-radius:'+thisStyle.borderRadius+';z-index:999999;">&nbsp;</div>');
        $("#"+thisMarkId).smooth({"opacity":1},pri.fadeTime,false,"Linear").smooth({},val.waitMs,function(){
          if(typeof(val.callback)==="function"&&(i+1)===$this.length) val.callback.call(this,val.option);
          $("#"+thisMarkId+"Text").smooth({"line-height":"1px"},pri.fadeTime,false,"Linear");
        }).smooth({},pri.fadeTime/2,emptyInfo).smooth({"opacity":0},pri.fadeTime,function(){
          $("#"+thisMarkId).remove();
        },"Linear");
      };
      setTimeout(runThis,pri.fadeTime*i);
    };
    $this.each(perIndicate);
    return this.each(function(){});
  }
});