/**
 * Created by Administrator on 2017/6/4.
 */
$(function(){
  $(function(){

    let h=0.1;//window.innerHeight/20;
    let t=(window.innerHeight-h)/2;
    let val={"position":[[-1,t],[-1,h+t],[window.innerWidth/2,h/2+t]],"logo":$("#logo"),"drawRect":true};
    let clickLogin=function(){
      location.href="index.html";
    };
    $(".mainContent").css({"height":window.innerHeight,"margin-top":0});
    $("#menu").hide();
    $("body").initTriangle(val);
    $(document).on("click","#loginButton",clickLogin);
  });
}); 