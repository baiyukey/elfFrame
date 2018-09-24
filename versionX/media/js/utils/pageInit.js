/**
 * Created by Administrator on 2017/6/19.
 * 外部公开页所需的动态样式初始化
 */
$(function(){
  var initMenu=function(){
    var thisPathname=window.top.location.pathname;
    $("a[href]","#menu").removeClass("current").each(function(i,e){
      if($(e).attr("href")===thisPathname) $(e).addClass("current");
    });
  };
  var initCode=function(){
    $('code').each(function(i,block){
      var thisHtml=$(block).html();
      thisHtml=thisHtml.replace(/\n *| */,"").replace(/\n */g,"\n").replace(/ {2,}/g," ");
      //thisHtml=thisHtml.replace(/[\r\n]/g,"\r    ");
      // if($(block).hasClass("javascript")) thisHtml=thisHtml;
      $(block).html(thisHtml);
      hljs.highlightBlock(block);
    });
  };
  var clickLeftMenuA=function(event){
    event.preventDefault();
    var $this=$(this);
    var thisText=$.trim($(this).text());
    var $thisH5=false;
    var h5Index=0;
    if($this.hasClass("curr")) return false;
    $("h5","#contentRight").each(function(i,e){
      h5Index=i;
      if($.trim($(e).text())===thisText){
        $thisH5=$(e);
        return false;
      }
    });
    if($thisH5!==false){
      setTimeout(function(){
        $("a","#leftMenu").removeClass("current");
        $this.addClass("current");
        $thisH5.parent().addClass("indicateBg").siblings().removeClass("indicateBg");
      },400);
      $("html,body").smooth({"scrollTop":$thisH5.offset().top-(h5Index===0 ? $thisH5.offset().top : 11)},500);
    }
  };
  var scrollWindow=function(){
    var runThis=function(){
      if(location.pathname.split("/").pop()==="componentIndex.html") return false;
      var $thisA=false;
      $("h5","#contentRight").each(function(i,e){
        if($(e).offset().top>=$(window).scrollTop()){
          var thisText=$.trim($(e).text());
          $thisA=$("a","#leftMenu").filter(":contains('"+thisText+"')");
          $(e).parent().addClass("indicateBg").siblings().removeClass("indicateBg");
          return false;
        }
      });
      if($thisA===false) $thisA=$("a","#leftMenu").eq(0);
      $("a","#leftMenu").removeClass("current");
      $thisA.addClass("current");
    };
    if(typeof(window.waitScrollTopStop)!=="undefined") clearTimeout(window.waitScrollTopStop);
    window.waitScrollTopStop=setTimeout(runThis,100);
  };
  $(document).on("click","#leftMenu a",clickLeftMenuA);//左右样式联动
  $(window).on("scroll",this,scrollWindow);
  initMenu();
  initCode();
});