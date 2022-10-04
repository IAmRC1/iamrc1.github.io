var tt=(N,O)=>()=>(O||N((O={exports:{}}).exports,O),O.exports);var rt=tt((Qe,Me)=>{(function(){const O=document.createElement("link").relList;if(O&&O.supports&&O.supports("modulepreload"))return;for(const w of document.querySelectorAll('link[rel="modulepreload"]'))V(w);new MutationObserver(w=>{for(const k of w)if(k.type==="childList")for(const _ of k.addedNodes)_.tagName==="LINK"&&_.rel==="modulepreload"&&V(_)}).observe(document,{childList:!0,subtree:!0});function G(w){const k={};return w.integrity&&(k.integrity=w.integrity),w.referrerpolicy&&(k.referrerPolicy=w.referrerpolicy),w.crossorigin==="use-credentials"?k.credentials="include":w.crossorigin==="anonymous"?k.credentials="omit":k.credentials="same-origin",k}function V(w){if(w.ep)return;w.ep=!0;const k=G(w);fetch(w.href,k)}})();(function(N,O){typeof Qe=="object"&&typeof Me<"u"?Me.exports=O():typeof define=="function"&&define.amd?define(O):N.anime=O()})(globalThis,function(){var N={update:null,begin:null,loopBegin:null,changeBegin:null,change:null,changeComplete:null,loopComplete:null,complete:null,loop:1,direction:"normal",autoplay:!0,timelineOffset:0},O={duration:1e3,delay:0,endDelay:0,easing:"easeOutElastic(1, .5)",round:0},G=["translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective","matrix","matrix3d"],V={CSS:{},springs:{}};function w(e,t,r){return Math.min(Math.max(e,t),r)}function k(e,t){return e.indexOf(t)>-1}function _(e,t){return e.apply(null,t)}var l={arr:function(e){return Array.isArray(e)},obj:function(e){return k(Object.prototype.toString.call(e),"Object")},pth:function(e){return l.obj(e)&&e.hasOwnProperty("totalLength")},svg:function(e){return e instanceof SVGElement},inp:function(e){return e instanceof HTMLInputElement},dom:function(e){return e.nodeType||l.svg(e)},str:function(e){return typeof e=="string"},fnc:function(e){return typeof e=="function"},und:function(e){return e===void 0},nil:function(e){return l.und(e)||e===null},hex:function(e){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(e)},rgb:function(e){return/^rgb/.test(e)},hsl:function(e){return/^hsl/.test(e)},col:function(e){return l.hex(e)||l.rgb(e)||l.hsl(e)},key:function(e){return!N.hasOwnProperty(e)&&!O.hasOwnProperty(e)&&e!=="targets"&&e!=="keyframes"}};function L(e){var t=/\(([^)]+)\)/.exec(e);return t?t[1].split(",").map(function(r){return parseFloat(r)}):[]}function P(e,t){var r=L(e),a=w(l.und(r[0])?1:r[0],.1,100),n=w(l.und(r[1])?100:r[1],.1,100),i=w(l.und(r[2])?10:r[2],.1,100),s=w(l.und(r[3])?0:r[3],.1,100),u=Math.sqrt(n/a),c=i/(2*Math.sqrt(n*a)),f=c<1?u*Math.sqrt(1-c*c):0,d=1,v=c<1?(c*u-s)/f:-s+u;function y(b){var p=t?t*b/1e3:b;return p=c<1?Math.exp(-p*c*u)*(d*Math.cos(f*p)+v*Math.sin(f*p)):(d+v*p)*Math.exp(-p*u),b===0||b===1?b:1-p}return t?y:function(){var b=V.springs[e];if(b)return b;for(var p=0,h=0;;)if(y(p+=1/6)===1){if(++h>=16)break}else h=0;var o=p*(1/6)*1e3;return V.springs[e]=o,o}}function H(e){return e===void 0&&(e=10),function(t){return Math.ceil(w(t,1e-6,1)*e)*(1/e)}}var T,$,re=function(){var e=11,t=1/(e-1);function r(u,c){return 1-3*c+3*u}function a(u,c){return 3*c-6*u}function n(u){return 3*u}function i(u,c,f){return((r(c,f)*u+a(c,f))*u+n(c))*u}function s(u,c,f){return 3*r(c,f)*u*u+2*a(c,f)*u+n(c)}return function(u,c,f,d){if(0<=u&&u<=1&&0<=f&&f<=1){var v=new Float32Array(e);if(u!==c||f!==d)for(var y=0;y<e;++y)v[y]=i(y*t,u,f);return function(p){return u===c&&f===d||p===0||p===1?p:i(b(p),c,d)}}function b(p){for(var h=0,o=1,I=e-1;o!==I&&v[o]<=p;++o)h+=t;var D=h+(p-v[--o])/(v[o+1]-v[o])*t,x=s(D,u,f);return x>=.001?function(A,B,E,Y){for(var m=0;m<4;++m){var g=s(B,E,Y);if(g===0)return B;B-=(i(B,E,Y)-A)/g}return B}(p,D,u,f):x===0?D:function(A,B,E,Y,m){for(var g,S,X=0;(g=i(S=B+(E-B)/2,Y,m)-A)>0?E=S:B=S,Math.abs(g)>1e-7&&++X<10;);return S}(p,h,h+t,u,f)}}}(),ne=(T={linear:function(){return function(e){return e}}},$={Sine:function(){return function(e){return 1-Math.cos(e*Math.PI/2)}},Circ:function(){return function(e){return 1-Math.sqrt(1-e*e)}},Back:function(){return function(e){return e*e*(3*e-2)}},Bounce:function(){return function(e){for(var t,r=4;e<((t=Math.pow(2,--r))-1)/11;);return 1/Math.pow(4,3-r)-7.5625*Math.pow((3*t-2)/22-e,2)}},Elastic:function(e,t){e===void 0&&(e=1),t===void 0&&(t=.5);var r=w(e,1,10),a=w(t,.1,2);return function(n){return n===0||n===1?n:-r*Math.pow(2,10*(n-1))*Math.sin((n-1-a/(2*Math.PI)*Math.asin(1/r))*(2*Math.PI)/a)}}},["Quad","Cubic","Quart","Quint","Expo"].forEach(function(e,t){$[e]=function(){return function(r){return Math.pow(r,t+2)}}}),Object.keys($).forEach(function(e){var t=$[e];T["easeIn"+e]=t,T["easeOut"+e]=function(r,a){return function(n){return 1-t(r,a)(1-n)}},T["easeInOut"+e]=function(r,a){return function(n){return n<.5?t(r,a)(2*n)/2:1-t(r,a)(-2*n+2)/2}},T["easeOutIn"+e]=function(r,a){return function(n){return n<.5?(1-t(r,a)(1-2*n))/2:(t(r,a)(2*n-1)+1)/2}}}),T);function K(e,t){if(l.fnc(e))return e;var r=e.split("(")[0],a=ne[r],n=L(e);switch(r){case"spring":return P(e,t);case"cubicBezier":return _(re,n);case"steps":return _(H,n);default:return _(a,n)}}function ae(e){try{return document.querySelectorAll(e)}catch{return}}function Q(e,t){for(var r=e.length,a=arguments.length>=2?arguments[1]:void 0,n=[],i=0;i<r;i++)if(i in e){var s=e[i];t.call(a,s,i,e)&&n.push(s)}return n}function R(e){return e.reduce(function(t,r){return t.concat(l.arr(r)?R(r):r)},[])}function xe(e){return l.arr(e)?e:(l.str(e)&&(e=ae(e)||e),e instanceof NodeList||e instanceof HTMLCollection?[].slice.call(e):[e])}function se(e,t){return e.some(function(r){return r===t})}function ce(e){var t={};for(var r in e)t[r]=e[r];return t}function le(e,t){var r=ce(e);for(var a in e)r[a]=t.hasOwnProperty(a)?t[a]:e[a];return r}function oe(e,t){var r=ce(e);for(var a in t)r[a]=l.und(e[a])?t[a]:e[a];return r}function Xe(e){return l.rgb(e)?(r=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(t=e))?"rgba("+r[1]+",1)":t:l.hex(e)?(a=e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,function(i,s,u,c){return s+s+u+u+c+c}),n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a),"rgba("+parseInt(n[1],16)+","+parseInt(n[2],16)+","+parseInt(n[3],16)+",1)"):l.hsl(e)?function(i){var s,u,c,f=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(i)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(i),d=parseInt(f[1],10)/360,v=parseInt(f[2],10)/100,y=parseInt(f[3],10)/100,b=f[4]||1;function p(I,D,x){return x<0&&(x+=1),x>1&&(x-=1),x<1/6?I+6*(D-I)*x:x<.5?D:x<2/3?I+(D-I)*(2/3-x)*6:I}if(v==0)s=u=c=y;else{var h=y<.5?y*(1+v):y+v-y*v,o=2*y-h;s=p(o,h,d+1/3),u=p(o,h,d),c=p(o,h,d-1/3)}return"rgba("+255*s+","+255*u+","+255*c+","+b+")"}(e):void 0;var t,r,a,n}function W(e){var t=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(e);if(t)return t[1]}function de(e,t){return l.fnc(e)?e(t.target,t.id,t.total):e}function j(e,t){return e.getAttribute(t)}function fe(e,t,r){if(se([r,"deg","rad","turn"],W(t)))return t;var a=V.CSS[t+r];if(!l.und(a))return a;var n=document.createElement(e.tagName),i=e.parentNode&&e.parentNode!==document?e.parentNode:document.body;i.appendChild(n),n.style.position="absolute",n.style.width=100+r;var s=100/n.offsetWidth;i.removeChild(n);var u=s*parseFloat(t);return V.CSS[t+r]=u,u}function Le(e,t,r){if(t in e.style){var a=t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),n=e.style[t]||getComputedStyle(e).getPropertyValue(a)||"0";return r?fe(e,n,r):n}}function pe(e,t){return l.dom(e)&&!l.inp(e)&&(!l.nil(j(e,t))||l.svg(e)&&e[t])?"attribute":l.dom(e)&&se(G,t)?"transform":l.dom(e)&&t!=="transform"&&Le(e,t)?"css":e[t]!=null?"object":void 0}function ke(e){if(l.dom(e)){for(var t,r=e.style.transform||"",a=/(\w+)\(([^)]*)\)/g,n=new Map;t=a.exec(r);)n.set(t[1],t[2]);return n}}function Ze(e,t,r,a){var n,i=k(t,"scale")?1:0+(k(n=t,"translate")||n==="perspective"?"px":k(n,"rotate")||k(n,"skew")?"deg":void 0),s=ke(e).get(t)||i;return r&&(r.transforms.list.set(t,s),r.transforms.last=t),a?fe(e,s,a):s}function me(e,t,r,a){switch(pe(e,t)){case"transform":return Ze(e,t,a,r);case"css":return Le(e,t,r);case"attribute":return j(e,t);default:return e[t]||0}}function ge(e,t){var r=/^(\*=|\+=|-=)/.exec(e);if(!r)return e;var a=W(e)||0,n=parseFloat(t),i=parseFloat(e.replace(r[0],""));switch(r[0][0]){case"+":return n+i+a;case"-":return n-i+a;case"*":return n*i+a}}function Se(e,t){if(l.col(e))return Xe(e);if(/\s/g.test(e))return e;var r=W(e),a=r?e.substr(0,e.length-r.length):e;return t?a+t:a}function ve(e,t){return Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2))}function Oe(e){for(var t,r=e.points,a=0,n=0;n<r.numberOfItems;n++){var i=r.getItem(n);n>0&&(a+=ve(t,i)),t=i}return a}function Ie(e){if(e.getTotalLength)return e.getTotalLength();switch(e.tagName.toLowerCase()){case"circle":return i=e,2*Math.PI*j(i,"r");case"rect":return 2*j(n=e,"width")+2*j(n,"height");case"line":return ve({x:j(a=e,"x1"),y:j(a,"y1")},{x:j(a,"x2"),y:j(a,"y2")});case"polyline":return Oe(e);case"polygon":return r=(t=e).points,Oe(t)+ve(r.getItem(r.numberOfItems-1),r.getItem(0))}var t,r,a,n,i}function Ee(e,t){var r=t||{},a=r.el||function(f){for(var d=f.parentNode;l.svg(d)&&l.svg(d.parentNode);)d=d.parentNode;return d}(e),n=a.getBoundingClientRect(),i=j(a,"viewBox"),s=n.width,u=n.height,c=r.viewBox||(i?i.split(" "):[0,0,s,u]);return{el:a,viewBox:c,x:c[0]/1,y:c[1]/1,w:s,h:u,vW:c[2],vH:c[3]}}function ze(e,t,r){function a(d){d===void 0&&(d=0);var v=t+d>=1?t+d:0;return e.el.getPointAtLength(v)}var n=Ee(e.el,e.svg),i=a(),s=a(-1),u=a(1),c=r?1:n.w/n.vW,f=r?1:n.h/n.vH;switch(e.property){case"x":return(i.x-n.x)*c;case"y":return(i.y-n.y)*f;case"angle":return 180*Math.atan2(u.y-s.y,u.x-s.x)/Math.PI}}function Te(e,t){var r=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,a=Se(l.pth(e)?e.totalLength:e,t)+"";return{original:a,numbers:a.match(r)?a.match(r).map(Number):[0],strings:l.str(e)||t?a.split(r):[]}}function he(e){return Q(e?R(l.arr(e)?e.map(xe):xe(e)):[],function(t,r,a){return a.indexOf(t)===r})}function Be(e){var t=he(e);return t.map(function(r,a){return{target:r,id:a,total:t.length,transforms:{list:ke(r)}}})}function Ge(e,t){var r=ce(t);if(/^spring/.test(r.easing)&&(r.duration=P(r.easing)),l.arr(e)){var a=e.length;a===2&&!l.obj(e[0])?e={value:e}:l.fnc(t.duration)||(r.duration=t.duration/a)}var n=l.arr(e)?e:[e];return n.map(function(i,s){var u=l.obj(i)&&!l.pth(i)?i:{value:i};return l.und(u.delay)&&(u.delay=s?0:t.delay),l.und(u.endDelay)&&(u.endDelay=s===n.length-1?t.endDelay:0),u}).map(function(i){return oe(i,r)})}function Ke(e,t){var r=[],a=t.keyframes;for(var n in a&&(t=oe(function(i){for(var s=Q(R(i.map(function(d){return Object.keys(d)})),function(d){return l.key(d)}).reduce(function(d,v){return d.indexOf(v)<0&&d.push(v),d},[]),u={},c=function(d){var v=s[d];u[v]=i.map(function(y){var b={};for(var p in y)l.key(p)?p==v&&(b.value=y[p]):b[p]=y[p];return b})},f=0;f<s.length;f++)c(f);return u}(a),t)),t)l.key(n)&&r.push({name:n,tweens:Ge(t[n],e)});return r}function Re(e,t){var r;return e.tweens.map(function(a){var n=function(b,p){var h={};for(var o in b){var I=de(b[o],p);l.arr(I)&&(I=I.map(function(D){return de(D,p)})).length===1&&(I=I[0]),h[o]=I}return h.duration=parseFloat(h.duration),h.delay=parseFloat(h.delay),h}(a,t),i=n.value,s=l.arr(i)?i[1]:i,u=W(s),c=me(t.target,e.name,u,t),f=r?r.to.original:c,d=l.arr(i)?i[0]:f,v=W(d)||W(c),y=u||v;return l.und(s)&&(s=f),n.from=Te(d,y),n.to=Te(ge(s,d),y),n.start=r?r.end:0,n.end=n.start+n.delay+n.duration+n.endDelay,n.easing=K(n.easing,n.duration),n.isPath=l.pth(i),n.isPathTargetInsideSVG=n.isPath&&l.svg(t.target),n.isColor=l.col(n.from.original),n.isColor&&(n.round=1),r=n,n})}var Ce={css:function(e,t,r){return e.style[t]=r},attribute:function(e,t,r){return e.setAttribute(t,r)},object:function(e,t,r){return e[t]=r},transform:function(e,t,r,a,n){if(a.list.set(t,r),t===a.last||n){var i="";a.list.forEach(function(s,u){i+=u+"("+s+") "}),e.style.transform=i}}};function Pe(e,t){Be(e).forEach(function(r){for(var a in t){var n=de(t[a],r),i=r.target,s=W(n),u=me(i,a,s,r),c=ge(Se(n,s||W(u)),u),f=pe(i,a);Ce[f](i,a,c,r.transforms,!0)}})}function Je(e,t){return Q(R(e.map(function(r){return t.map(function(a){return function(n,i){var s=pe(n.target,i.name);if(s){var u=Re(i,n),c=u[u.length-1];return{type:s,property:i.name,animatable:n,tweens:u,duration:c.end,delay:u[0].delay,endDelay:c.endDelay}}}(r,a)})})),function(r){return!l.und(r)})}function De(e,t){var r=e.length,a=function(i){return i.timelineOffset?i.timelineOffset:0},n={};return n.duration=r?Math.max.apply(Math,e.map(function(i){return a(i)+i.duration})):t.duration,n.delay=r?Math.min.apply(Math,e.map(function(i){return a(i)+i.delay})):t.delay,n.endDelay=r?n.duration-Math.max.apply(Math,e.map(function(i){return a(i)+i.duration-i.endDelay})):t.endDelay,n}var qe=0,F=[],Ae=function(){var e;function t(r){for(var a=F.length,n=0;n<a;){var i=F[n];i.paused?(F.splice(n,1),a--):(i.tick(r),n++)}e=n>0?requestAnimationFrame(t):void 0}return typeof document<"u"&&document.addEventListener("visibilitychange",function(){M.suspendWhenDocumentHidden&&(Ne()?e=cancelAnimationFrame(e):(F.forEach(function(r){return r._onDocumentVisibility()}),Ae()))}),function(){e||Ne()&&M.suspendWhenDocumentHidden||!(F.length>0)||(e=requestAnimationFrame(t))}}();function Ne(){return!!document&&document.hidden}function M(e){e===void 0&&(e={});var t,r=0,a=0,n=0,i=0,s=null;function u(m){var g=window.Promise&&new Promise(function(S){return s=S});return m.finished=g,g}var c,f,d,v,y,b,p,h,o=(f=le(N,c=e),d=le(O,c),v=Ke(d,c),y=Be(c.targets),b=Je(y,v),p=De(b,d),h=qe,qe++,oe(f,{id:h,children:[],animatables:y,animations:b,duration:p.duration,delay:p.delay,endDelay:p.endDelay}));u(o);function I(){var m=o.direction;m!=="alternate"&&(o.direction=m!=="normal"?"normal":"reverse"),o.reversed=!o.reversed,t.forEach(function(g){return g.reversed=o.reversed})}function D(m){return o.reversed?o.duration-m:m}function x(){r=0,a=D(o.currentTime)*(1/M.speed)}function A(m,g){g&&g.seek(m-g.timelineOffset)}function B(m){for(var g=0,S=o.animations,X=S.length;g<X;){var q=S[g],J=q.animatable,Z=q.tweens,z=Z.length-1,C=Z[z];z&&(C=Q(Z,function(et){return m<et.end})[0]||C);for(var He=w(m-C.start-C.delay,0,C.duration)/C.duration,je=isNaN(He)?1:C.easing(He),ie=C.to.strings,ye=C.round,we=[],Ue=C.to.numbers.length,U=void 0,ee=0;ee<Ue;ee++){var ue=void 0,Ve=C.to.numbers[ee],_e=C.from.numbers[ee]||0;ue=C.isPath?ze(C.value,je*Ve,C.isPathTargetInsideSVG):_e+je*(Ve-_e),ye&&(C.isColor&&ee>2||(ue=Math.round(ue*ye)/ye)),we.push(ue)}var We=ie.length;if(We){U=ie[0];for(var te=0;te<We;te++){ie[te];var $e=ie[te+1],be=we[te];isNaN(be)||(U+=$e?be+$e:be+" ")}}else U=we[0];Ce[q.type](J.target,q.property,U,J.transforms),q.currentValue=U,g++}}function E(m){o[m]&&!o.passThrough&&o[m](o)}function Y(m){var g=o.duration,S=o.delay,X=g-o.endDelay,q=D(m);o.progress=w(q/g*100,0,100),o.reversePlayback=q<o.currentTime,t&&function(J){if(o.reversePlayback)for(var Z=i;Z--;)A(J,t[Z]);else for(var z=0;z<i;z++)A(J,t[z])}(q),!o.began&&o.currentTime>0&&(o.began=!0,E("begin")),!o.loopBegan&&o.currentTime>0&&(o.loopBegan=!0,E("loopBegin")),q<=S&&o.currentTime!==0&&B(0),(q>=X&&o.currentTime!==g||!g)&&B(g),q>S&&q<X?(o.changeBegan||(o.changeBegan=!0,o.changeCompleted=!1,E("changeBegin")),E("change"),B(q)):o.changeBegan&&(o.changeCompleted=!0,o.changeBegan=!1,E("changeComplete")),o.currentTime=w(q,0,g),o.began&&E("update"),m>=g&&(a=0,o.remaining&&o.remaining!==!0&&o.remaining--,o.remaining?(r=n,E("loopComplete"),o.loopBegan=!1,o.direction==="alternate"&&I()):(o.paused=!0,o.completed||(o.completed=!0,E("loopComplete"),E("complete"),!o.passThrough&&"Promise"in window&&(s(),u(o)))))}return o.reset=function(){var m=o.direction;o.passThrough=!1,o.currentTime=0,o.progress=0,o.paused=!0,o.began=!1,o.loopBegan=!1,o.changeBegan=!1,o.completed=!1,o.changeCompleted=!1,o.reversePlayback=!1,o.reversed=m==="reverse",o.remaining=o.loop,t=o.children;for(var g=i=t.length;g--;)o.children[g].reset();(o.reversed&&o.loop!==!0||m==="alternate"&&o.loop===1)&&o.remaining++,B(o.reversed?o.duration:0)},o._onDocumentVisibility=x,o.set=function(m,g){return Pe(m,g),o},o.tick=function(m){n=m,r||(r=n),Y((n+(a-r))*M.speed)},o.seek=function(m){Y(D(m))},o.pause=function(){o.paused=!0,x()},o.play=function(){o.paused&&(o.completed&&o.reset(),o.paused=!1,F.push(o),x(),Ae())},o.reverse=function(){I(),o.completed=!o.reversed,x()},o.restart=function(){o.reset(),o.play()},o.remove=function(m){Ye(he(m),o)},o.reset(),o.autoplay&&o.play(),o}function Fe(e,t){for(var r=t.length;r--;)se(e,t[r].animatable.target)&&t.splice(r,1)}function Ye(e,t){var r=t.animations,a=t.children;Fe(e,r);for(var n=a.length;n--;){var i=a[n],s=i.animations;Fe(e,s),s.length||i.children.length||a.splice(n,1)}r.length||a.length||t.pause()}return M.version="3.2.1",M.speed=1,M.suspendWhenDocumentHidden=!0,M.running=F,M.remove=function(e){for(var t=he(e),r=F.length;r--;)Ye(t,F[r])},M.get=me,M.set=Pe,M.convertPx=fe,M.path=function(e,t){var r=l.str(e)?ae(e)[0]:e,a=t||100;return function(n){return{property:n,el:r,svg:Ee(r),totalLength:Ie(r)*(a/100)}}},M.setDashoffset=function(e){var t=Ie(e);return e.setAttribute("stroke-dasharray",t),t},M.stagger=function(e,t){t===void 0&&(t={});var r=t.direction||"normal",a=t.easing?K(t.easing):null,n=t.grid,i=t.axis,s=t.from||0,u=s==="first",c=s==="center",f=s==="last",d=l.arr(e),v=parseFloat(d?e[0]:e),y=d?parseFloat(e[1]):0,b=W(d?e[1]:e)||0,p=t.start||0+(d?v:0),h=[],o=0;return function(I,D,x){if(u&&(s=0),c&&(s=(x-1)/2),f&&(s=x-1),!h.length){for(var A=0;A<x;A++){if(n){var B=c?(n[0]-1)/2:s%n[0],E=c?(n[1]-1)/2:Math.floor(s/n[0]),Y=B-A%n[0],m=E-Math.floor(A/n[0]),g=Math.sqrt(Y*Y+m*m);i==="x"&&(g=-Y),i==="y"&&(g=-m),h.push(g)}else h.push(Math.abs(s-A));o=Math.max.apply(Math,h)}a&&(h=h.map(function(S){return a(S/o)*o})),r==="reverse"&&(h=h.map(function(S){return i?S<0?-1*S:-S:Math.abs(o-S)}))}return p+(d?(y-v)/o:v)*(Math.round(100*h[D])/100)+b}},M.timeline=function(e){e===void 0&&(e={});var t=M(e);return t.duration=0,t.add=function(r,a){var n=F.indexOf(t),i=t.children;function s(y){y.passThrough=!0}n>-1&&F.splice(n,1);for(var u=0;u<i.length;u++)s(i[u]);var c=oe(r,le(O,e));c.targets=c.targets||e.targets;var f=t.duration;c.autoplay=!1,c.direction=t.direction,c.timelineOffset=l.und(a)?f:ge(a,f),s(t),t.seek(c.timelineOffset);var d=M(c);s(d),i.push(d);var v=De(i,e);return t.delay=v.delay,t.endDelay=v.endDelay,t.duration=v.duration,t.seek(0),t.reset(),t.autoplay&&t.play(),t},t},M.easing=K,M.penner=ne,M.random=function(e,t){return Math.floor(Math.random()*(t-e+1))+e},M});(function(N){const O=anime.timeline({easing:"easeInOutCubic",duration:600,autoplay:!0}).add({targets:"#loader",opacity:0,duration:800,begin:function(L){window.scrollTo(0,0)}}).add({targets:"#preloader",opacity:0,complete:function(L){document.querySelector("#preloader").style.visibility="hidden",document.querySelector("#preloader").style.display="none"}}).add({targets:".s-header",translateY:[-100,0],opacity:[0,1]},"-=200").add({targets:[".animate-on-load"],translateY:[100,0],opacity:[0,1],delay:anime.stagger(400)}).add({targets:[".letter"],opacity:[.25,1],skewY:5,scale:anime.stagger([.75,1],{from:"center"}),delay:anime.stagger(150,{from:"center"})}),G=anime({targets:".scroll-down",translateY:25,duration:1e3,easing:"easeInOutQuad",direction:"alternate",loop:!0,autoplay:!0}),V=function(){!document.querySelector("#preloader")||(N.classList.add("ss-preload"),window.addEventListener("load",function(){N.classList.remove("ss-preload"),N.classList.add("ss-loaded"),O.play(),G.play()}))},w=function(){const L=document.querySelector(".s-header__menu-toggle"),P=document.querySelector(".s-header__nav-wrap"),H=document.querySelector("body");!(L&&P)||(L.addEventListener("click",function(T){T.preventDefault(),L.classList.toggle("is-clicked"),H.classList.toggle("menu-is-open")}),P.querySelectorAll(".s-header__nav a").forEach(function(T){T.addEventListener("click",function($){window.matchMedia("(max-width: 900px)").matches&&(L.classList.toggle("is-clicked"),H.classList.toggle("menu-is-open"))})}),window.addEventListener("resize",function(){window.matchMedia("(min-width: 901px)").matches&&(H.classList.contains("menu-is-open")&&H.classList.remove("menu-is-open"),L.classList.contains("is-clicked")&&L.classList.remove("is-clicked"))}))},k=function(){const L=document.querySelector(".s-header");if(!L)return;const P=1;window.addEventListener("scroll",function(){window.scrollY>P?L.classList.add("sticky"):L.classList.remove("sticky")})},_=function(){const L=document.querySelectorAll("[data-animate-block]");window.addEventListener("scroll",P);function P(){let H=window.pageYOffset;L.forEach(function(T){const $=window.innerHeight,re=T.offsetTop+$*.1-$,ne=T.offsetHeight,K=re+ne,ae=H>re&&H<=K,Q=T.classList.contains("ss-animated");ae&&!Q&&anime({targets:T.querySelectorAll("[data-animate-el]"),opacity:[0,1],translateY:[100,0],delay:anime.stagger(200,{start:150}),duration:400,easing:"easeInOutCubic",begin:function(R){T.classList.add("ss-animated")}})})}},l=function(){const P=document.querySelector(".ss-go-top");!P||(window.scrollY>=900&&P.classList.add("link-is-visible"),window.addEventListener("scroll",function(){window.scrollY>=900?P.classList.contains("link-is-visible")||P.classList.add("link-is-visible"):P.classList.remove("link-is-visible")}))};(function(){V(),w(),k(),_(),l()})()})(document.documentElement)});export default rt();
