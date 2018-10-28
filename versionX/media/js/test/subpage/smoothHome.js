/**
 * Created by Administrator on 2017/7/23.
 */
$(function(){
  var quickTest=function(){
    console.log("quickTest");
    if($(this).attr("id")==="quickTest"){
      $("#testArea").smooth({"width":800},function(){$("#testArea").html('#testArea为尺寸为<span class="striking">800</span>*150像素')});
    }
    else if($(this).attr("id")==="quickTest2"){
      $("#testArea").smooth({"width":500},function(){$("#testArea").html('#testArea为尺寸为500*150像素')});
    }
  };
  elf.iframeResize();
  $(document).on("click","#quickTest",quickTest);
  $(document).on("click","#quickTest2",quickTest);
});  