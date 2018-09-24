/**
 * Created by baiyu on 2016/9/13
 */
(function(){
  window.min=/^((192\.168|172\.([1][6-9]|[2]\d|3[01]))(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){2}|10(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){3})|(localhost)$/.test(window.location.hostname) ? "" : ".min";//headLoader读取js,css会加在文件格式与文件名之间
  window.elfFramePage=["testIndex","componentIndex"];//testIndex.html等页面采用了elfFrame框架
  window["myPage"]={
    dataDir:"/media/",//页面所需数据(例如js,css,image)的基础路径
    fadeTime:300//页内的动画过渡时间
  };//headLoader的配置信息
  //以上为最基础的信息,不能删除
  if(elfFramePage.length>0){
    window["elfFrame"]={};
    for(let i=0; i<elfFramePage.length; i++){
      window["elfFrame"][elfFramePage[i]]={
        animateConvert:3//iframe转场动画(0:无动画1:右滑退出左滑进入,2:左右滑动,3:上下滑动,4:渐隐渐出)默认0
        //homePage:"/componentSubpage/home.html"//框架子页首页 也可在#page标签定义data-src
      };
    }
  }
})();