/**
 * Created by Administrator on 2017/6/4.
 */
$(function(){
  var val={
    "position":[[220.5,-188],[18,50.5],[220.5,50.5]],
    "logo":$("#logo"),
    "drawRect":true
  };
  $("body").initTriangle(val);
  setTimeout(function(){$(".contentLeft").elfLayout({"referenceY":".contentRight"});},2000);
});