$.fn.extend({
  //author:baiYu
  //site:www.uiElf.com
  //version:0.00.009
  smooth:function(_css,_ms,_callback,_thisTween){
    //_thisTween:Linear,easeIn,easeOut,easeInOut,或者tween的任一子key ......高级用法:{type:"Cubic","ease":"easeOut"}...默认Linear
    var tween={
      /*
       * Tween.js
       * t: current time (当前次数)
       * b: beginning value（初始值）
       * c: change in value（变化量）
       * d: duration（执行次数,每次1/60秒）
       */
      Linear:function(t,b,c,d){ return c*t/d+b; },
      Quad:{
        easeIn:function(t,b,c,d){
          return c*(t/=d)*t+b;
        },
        easeOut:function(t,b,c,d){
          return -c*(t/=d)*(t-2)+b;
        },
        easeInOut:function(t,b,c,d){
          if((t/=d/2)<1) return c/2*t*t+b;
          return -c/2*((--t)*(t-2)-1)+b;
        }
      },
      Cubic:{
        easeIn:function(t,b,c,d){
          return c*(t/=d)*t*t+b;
        },
        easeOut:function(t,b,c,d){
          return c*((t=t/d-1)*t*t+1)+b;
        },
        easeInOut:function(t,b,c,d){
          if((t/=d/2)<1) return c/2*t*t*t+b;
          return c/2*((t-=2)*t*t+2)+b;
        }
      },
      Quart:{
        easeIn:function(t,b,c,d){
          return c*(t/=d)*t*t*t+b;
        },
        easeOut:function(t,b,c,d){
          return -c*((t=t/d-1)*t*t*t-1)+b;
        },
        easeInOut:function(t,b,c,d){
          if((t/=d/2)<1) return c/2*t*t*t*t+b;
          return -c/2*((t-=2)*t*t*t-2)+b;
        }
      },
      Quint:{
        easeIn:function(t,b,c,d){
          return c*(t/=d)*t*t*t*t+b;
        },
        easeOut:function(t,b,c,d){
          return c*((t=t/d-1)*t*t*t*t+1)+b;
        },
        easeInOut:function(t,b,c,d){
          if((t/=d/2)<1) return c/2*t*t*t*t*t+b;
          return c/2*((t-=2)*t*t*t*t+2)+b;
        }
      },
      Sine:{
        easeIn:function(t,b,c,d){
          return -c*Math.cos(t/d*(Math.PI/2))+c+b;
        },
        easeOut:function(t,b,c,d){
          return c*Math.sin(t/d*(Math.PI/2))+b;
        },
        easeInOut:function(t,b,c,d){
          return -c/2*(Math.cos(Math.PI*t/d)-1)+b;
        }
      },
      Expo:{
        easeIn:function(t,b,c,d){
          return (t===0) ? b : c*Math.pow(2,10*(t/d-1))+b;
        },
        easeOut:function(t,b,c,d){
          return (t===d) ? b+c : c*(-Math.pow(2,-10*t/d)+1)+b;
        },
        easeInOut:function(t,b,c,d){
          if(t===0) return b;
          if(t===d) return b+c;
          if((t/=d/2)<1) return c/2*Math.pow(2,10*(t-1))+b;
          return c/2*(-Math.pow(2,-10* --t)+2)+b;
        }
      },
      Circ:{
        easeIn:function(t,b,c,d){
          return -c*(Math.sqrt(1-(t/=d)*t)-1)+b;
        },
        easeOut:function(t,b,c,d){
          return c*Math.sqrt(1-(t=t/d-1)*t)+b;
        },
        easeInOut:function(t,b,c,d){
          if((t/=d/2)<1) return -c/2*(Math.sqrt(1-t*t)-1)+b;
          return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b;
        }
      },
      Elastic:{
        easeIn:function(t,b,c,d,a,p){
          var s;
          if(t===0) return b;
          if((t/=d)===1) return b+c;
          if(typeof p==="undefined") p=d*.3;
          if(!a||a<Math.abs(c)){
            s=p/4;
            a=c;
          }
          else{
            s=p/(2*Math.PI)*Math.asin(c/a);
          }
          return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
        },
        easeOut:function(t,b,c,d,a,p){
          var s;
          if(t===0) return b;
          if((t/=d)===1) return b+c;
          if(typeof p==="undefined") p=d*.3;
          if(!a||a<Math.abs(c)){
            a=c;
            s=p/4;
          }
          else{
            s=p/(2*Math.PI)*Math.asin(c/a);
          }
          return (a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b);
        },
        easeInOut:function(t,b,c,d,a,p){
          var s;
          if(t===0) return b;
          if((t/=d/2)===2) return b+c;
          if(typeof p==="undefined") p=d*(.3*1.5);
          if(!a||a<Math.abs(c)){
            a=c;
            s=p/4;
          }
          else{
            s=p/(2*Math.PI)*Math.asin(c/a);
          }
          if(t<1) return -.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
          return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;
        }
      },
      Back:{
        easeIn:function(t,b,c,d,s){
          if(typeof s==="undefined") s=1.70158;
          return c*(t/=d)*t*((s+1)*t-s)+b;
        },
        easeOut:function(t,b,c,d,s){
          if(typeof s==="undefined") s=1.70158;
          return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;
        },
        easeInOut:function(t,b,c,d,s){
          if(typeof s==="undefined") s=1.70158;
          if((t/=d/2)<1) return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;
          return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;
        }
      },
      Bounce:{
        easeIn:function(t,b,c,d){
          return tween.Bounce.easeOut(d-t,0,c,d)+b;
        },
        easeOut:function(t,b,c,d){
          if((t/=d)<(1/2.75)){
            return c*(7.5625*t*t)+b;
          }
          else if(t<(2/2.75)){
            return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b;
          }
          else if(t<(2.5/2.75)){
            return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;
          }
          else{
            return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;
          }
        },
        easeInOut:function(t,b,c,d){
          if(t<d/2){
            return tween.Bounce.easeIn(t*2,0,c,d)*.5+b;
          }
          else{
            return tween.Bounce.easeOut(t*2-d,0,c,d)*.5+c*.5+b;
          }
        }
      }
    };
    var $this=$(this);
    var numberReg=/^[+\-\d.]*/;
    var pxReg=/top|right|bottom|left|width|height|margin|padding|font-size/;
    var thisTween=!_thisTween ? tween.Linear : (typeof _thisTween==="string" ? (_thisTween==="Linear" ? tween.Linear : (typeof(tween[_thisTween])!=="undefined" ? tween[_thisTween]["easeInOut"] : tween["Cubic"][_thisTween])) : (tween[_thisTween["type"]][_thisTween["ease"]]));
    var thisArguments=arguments;
    var runThis=function(argument){
      var _css=argument[0][0];
      var _ms=typeof(argument[0][1])==="function" ? 300 : argument[0][1];
      var _callback=typeof(argument[0][1])==="function" ? argument[0][1] : argument[0][2];
      var originalCss={};
      var ableCss={};
      var getValue=function(_$this,k){
        if(typeof(_$this[0][k])!=="undefined") return _$this[0][k];
        return _$this[0]["style"][k] ? _$this[0]["style"][k] : (window.getComputedStyle(_$this[0])[k]==="auto" ? "0" : window.getComputedStyle(_$this[0])[k]);
      };
      var setValue=function(_$this,_k,_value){
        if(typeof(_$this[0][k])!=="undefined") _$this[0][_k]=_value;
        else _$this[0].style[_k]=_value;
      };
      for(var k in _css){
        if(numberReg.test(_css[k])){
          originalCss[k]=getValue($this,k);
          ableCss[k]=_css[k];
        }
        else{
          setValue($this,k,_css[k])
        }
      }
      var ms=Number(_ms)||200;
      var start=0,
        beginNumber=0,
        changeNumber=0,
        during=ms/(1000/60);
      var thisUnit="px";
      var thisValue="0"+thisUnit;
      var perAnimate=function(){
        for(var k in ableCss){
          beginNumber=parseFloat(originalCss[k]);
          changeNumber=parseFloat(ableCss[k])-parseFloat(originalCss[k]);
          thisUnit=ableCss[k].toString().replace(numberReg,"")!=="" ? ableCss[k].toString().replace(numberReg,"") : (pxReg.test(k) ? "px" : "");
          thisValue=thisTween(start,beginNumber,changeNumber,during)+thisUnit;
          setValue($this,k,thisValue);
        }
        if(start<during){
          if($this[0].smoothFreeze===false&&$this[0].smoothThrough===false){
            start++;
            if(start>during) start=during;
            requestAnimationFrame(perAnimate);
          }
          else if($this[0].smoothFreeze===true&&$this[0].smoothThrough===false){
            delete $this[0].argumentsSort;
          }
          else if($this[0].argumentsSort&&$this[0].smoothThrough===true){
            start=during;
            if($this[0].argumentsSort.length===0){
              perAnimate();
            }
            else{
              var thisArgument=$this[0].argumentsSort.pop();
              $this.css(thisArgument[0]);
              if(typeof(thisArgument[2])==="function") thisArgument[2].call(this);
              delete $this[0].argumentsSort;
            }
          }
        }
        else{
          if(typeof(_callback)==="function") _callback.call(this);
          if($this[0].argumentsSort){
            if($this[0].argumentsSort.length>1){
              runThis($this[0].argumentsSort.splice(0,1));
            }
            else if($this[0].argumentsSort.length===1){
              runThis($this[0].argumentsSort.splice(0,1));
              requestAnimationFrame(function(){delete $this[0].argumentsSort});
            }
            else if($this[0].argumentsSort.length===0){
              delete $this[0].argumentsSort;
            }
          }
        }
      };
      perAnimate();
    };
    if($this[0]){
      var pushSort=function(){
        if(typeof($this[0].argumentsSort)==="undefined"){
          $this[0].smoothFreeze=false;
          $this[0].smoothThrough=false;
          $this[0].argumentsSort=[];
          $this[0].argumentsSort.push(thisArguments);
          runThis($this[0].argumentsSort.splice(0,1));
        }
        else{
          $this[0].argumentsSort.push(thisArguments);
        }
      };
      requestAnimationFrame(pushSort);
    }
    return this.each(function(){});
  },
  smoothStop:function(_freeze,_through){
    var $this=$(this);
    if(!$this[0]) return this.each(function(){});
    $this[0].smoothFreeze=typeof(_freeze)!=="undefined" ? _freeze : true;//冻结
    $this[0].smoothThrough=typeof(_through)!=="undefined" ? _through : true;//直达
    return this.each(function(){});
  },
  smoothOut:function(_ms,_callback){
    var $this=$(this);
    $this.smooth({"opacity":0},Number(_ms||200),typeof _callback==="function" ? _callback : false,"Linear");
    setTimeout(function(){$this.css({"display":"none"},0);},Number(_ms||200));
    return this.each(function(){});
  },
  smoothIn:function(_ms,_callback){
    var computedStyle=window.getComputedStyle($(this)[0]);
    var targetOpacity=Number(computedStyle.opacity)===0 ? 1 : computedStyle.opacity;
    var targetDisplay=computedStyle.display==="none" ? "inherit" : computedStyle.display;
    $(this).css({
      "display":targetDisplay,
      "opacity":0
    }).smooth({"opacity":targetOpacity},Number(_ms||200),typeof _callback==="function" ? _callback : false,"Linear");
    return this.each(function(){});
  }
});