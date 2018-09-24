/**
 * Created by baiyu on 2016/9/14.
 */
(function(){
  let _baseCss=['global','elficons','elfWidgetDefine','elfWidgetColor','pageDefine','pageColor','dracula'];
  let _baseJs=[];
  let thisPageName=window.top.location.pathname.split("/").pop().split(".")[0];
  if(window!==window.top.window&&window.top.elfFramePage.indexOf(thisPageName)>=0){//elfFrame框架子页面
    _baseCss.push("elfFrameSubPage");
    _baseJs=['libs/jquery.min','libs/jquery.cookie','libs/highlight','libs/clipboard','libs/fuse','libs/jquery.smooth','libs/jquery.elfAlert','libs/jquery.elfBackground','libs/jquery.pageNumber','libs/jquery.setCache','libs/jquery.elfKeyword','libs/jquery.markIndicate','libs/jquery.slidePage','libs/jquery.elfDrag','libs/jquery.elfRoll','libs/jquery.elfBanner','libs/elfWidget','utils/elf','utils/pageInit'];
  }
  else{
    _baseJs=['libs/jquery.min','libs/jquery.cookie','libs/highlight','libs/jquery.smooth','libs/jquery.elfAlert','libs/jquery.elfBackground','libs/elfWidget','utils/elf','utils/pageInit','libs/jquery.initTriangle'];
  }
  _baseCss.push("_css");
  if(window.myPage.fadeTime>0) _baseCss.push("animate");
  if(window===window.top.window&&window.top.elfFramePage.indexOf(thisPageName)>=0){//elfFrame框架
    _baseJs=_baseJs.concat(['libs/jquery.elfLayout','utils/elfFrame','_js']);
  }
  let _loaderData={
    "/pathname/index":{//对特殊的页面添加更多的库
      css:_baseCss,
      js:_baseJs.concat([])
    },
    "default":{
      css:_baseCss,
      js:_baseJs.concat(["_js"])
    }
  };
  let loader=new headLoader();
  loader.dataDir=window.myPage.dataDir;
  let _thisPath=window.location.pathname.replace(".html","");
  if(_loaderData[_thisPath]){
    loader.dataCss=_loaderData[_thisPath].css;
    loader.dataJs=_loaderData[_thisPath].js;
  }
  else{
    loader.dataCss=_loaderData["default"].css;
    loader.dataJs=_loaderData["default"].js;
  }
  loader.run();
})();
