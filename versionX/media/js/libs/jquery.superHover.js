$.fn.extend({
  //author:baiYu
  //site:www.uiElf.com
  //version:0.00.001
  'superHover':function(_val){
    let that=this;
    if(!that[0]) return console.error("未获取到应用superHover的元素.");
    let thisId=new Date().getTime();
    if(that[0].hasAttribute("data-superHoverId")){
      thisId=that[0].getAttribute("data-superHoverId");
      document.removeEventListener("mousemove",window["superHover"+thisId]);
    }
    else{
      that[0].setAttribute("data-superHoverId",thisId);
    }
    let val=$.extend({
      "children":">*",//String | CSS语句过渡法定义联动的子元素,默认为一级子元素 | 可选项
      "scale":2,//Number | 元素的最大放大倍数,默认2 | 可选项
      "range":3,//Number | 鼠标移动事件同时波及到的元素个数,默认3 | 可选项
      "rangeBy":"width",//String | 雷达感应区的计算范围以子元素宽度或高度为单位,实参包括:"width","height",默认为"width" | 可选项  
      "focusLeft":.5,//Number | 鼠标焦点离元素左边的距离与元素宽度比为何值时元素最大化,范围0-1,默认0.5 | 可选项
      "focusTop":.5,//Number | 鼠标焦点离元素顶边的距离与元素高度比为何值时元素最大化,范围0-1,默认0.5 | 可选项
      "callback":null //Function | 回调函数,默认null | 可选项
    },_val);
    let children=val.children ? that.find(val.children) : that.children();//可控制的子元素
    if(children.length<=0) return console.error("superHover.js未获取到相关的目标元素");
    let p=[],
      i=0;
    for(i=0; i<children.length; i++){
      p.push({
        left:children[i].getBoundingClientRect().left,
        top:children[i].getBoundingClientRect().top,
        width:Number(val.rangeBy==="width" ? children[i].offsetWidth : children[i].offsetHeight)
      });
    }
    let e=undefined,
      focus={
        x:0,
        y:0
      },//元素的焦点坐标
      a=0,//鼠标与元素焦点的X坐标距离
      b=0,//鼠标与元素焦点的Y坐标距离
      c=0,//鼠标与元素焦点的斜线距离
      r=0,//元素的焦点雷达感应区半径
      scale=0;//放大倍数结果
    window["superHover"+thisId]=function(_e){
      e=_e||event;
      for(i=0; i<children.length; i++){
        focus.x=p[i].left+children[i].offsetWidth*val.focusLeft;//元素焦点的X坐标
        focus.y=p[i].top+children[i].offsetHeight*val.focusTop;//元素焦点的Y坐标
        a=e.clientX-focus.x;
        b=e.clientY-focus.y;
        c=Math.sqrt(a*a+b*b);
        r=p[i].width*val.range/2;
        scale=(1-c/r)*(val.scale-1)+1;
        if(scale<1){
          children[i].style.transform="scale(1,1)";
        }
        else{
          children[i].style.transform="scale("+scale+","+scale+")";
          if(val.rangeBy==="height") children[i].style.marginLeft=(scale-1)/2*children[i].offsetWidth+"px";
        }
      }
    };
    document.addEventListener("mousemove",window["superHover"+thisId]);
    if(typeof(val.callback)==="function") val.callback.call(this);
    return this.each(function(){});
  },
});