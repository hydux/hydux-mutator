!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.collections=r():(t.hydux=t.hydux||{},t.hydux.collections=r())}("undefined"!=typeof self?self:this,function(){return function(t){function r(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}var e={};return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)},r.p="",r(r.s=5)}([function(t,r,e){"use strict";function n(t){return Object.prototype.toString.call(t).slice(8,-1).toLowerCase()}function i(t){switch(n(t)){case"undefined":case"null":case"boolean":case"number":case"regexp":return t+"";case"date":return"📅"+t.getTime();case"string":return"📝"+t;case"array":return"🔗"+t.map(function(t){return i(t)}).join("⁞");default:if(w){var r=w.get(t);return r||(r=++x,w.set(t,r)),r}return t.hasOwnProperty(_)||(t[_]=++x,o(t,_)),"⭕️"+t[_]}}function o(t,r){Object.defineProperty&&Object.defineProperty(t,r,{enumerable:!1})}function u(t){return t?t.height:0}function f(t,r,e){return{value:r,left:t,right:e,height:Math.max(u(t),u(e))+1}}function a(){throw new Error("[hydux-mutator/map] imposible")}function s(t,r,e){var n=u(t),i=u(e);return n>i+2?t?u(t.left)>=u(t.right)?f(t.left,t.value,f(t.right,r,e)):t.right?f(f(t.left,t.value,t.right.left),t.right.value,f(t.right.right,r,e)):a():a():i>n+2?e?u(e.right)>=u(e.right)?f(f(t,r,e.left),e.value,e.right):e.left?f(f(t,r,e.left.left),e.left.value,f(e.left.right,e.value,e.right)):a():a():f(t,r,e)}function l(t,r,e){if(e){var n=i(t),o=i(e.value[0]);if(n===o)return[!1,e];if(n<o){var u=l(t,r,e.left);return[u[0],s(u[1],e.value,e.right)]}var u=l(t,r,e.right);return[u[0],s(e.left,e.value,u[1])]}return[!0,f(null,[t,r],null)]}function c(t,r){return r?r.left?c(r.value,r.left):r.value:t}function h(t,r,e){return t?s(h(t.left,t.value,t.right),r,e):e}function v(t,r){return t?r?r?s(t,c(r.value,r),h(r.left,r.value,r.right)):a():t:r}function p(t,r){if(r){var e=i(t),n=i(r.value[0]);if(e===n)return[!0,v(r.left,r.right)];if(e<n){var o=p(t,r.left);return[o[0],s(o[1],r.value,r.right)]}var o=p(t,r.right);return[o[0],s(r.left,r.value,o[1])]}return[!1,null]}function d(t,r){if(!r)return!1;var e=i(t),n=i(r.value[0]);return e===n||d(t,e<n?r.left:r.right)}function y(t,r){if(r){var e=i(t),n=i(r.value[0]);return e===n?r.value[1]:y(t,e<n?r.left:r.right)}}function g(t,r){var e,n,i,o,u,i;return b(this,function(f){switch(f.label){case 0:if(!t)return[2];if(!t.left)return[3,4];e=0,n=g(t.left,r),f.label=1;case 1:return e<n.length?(i=n[e],[4,i]):[3,4];case 2:f.sent(),f.label=3;case 3:return e++,[3,1];case 4:return[4,r(t.value)];case 5:if(f.sent(),!t.right)return[3,9];o=0,u=g(t.right,r),f.label=6;case 6:return o<u.length?(i=u[o],[4,i]):[3,9];case 7:f.sent(),f.label=8;case 8:return o++,[3,6];case 9:return[2]}})}var b=this&&this.__generator||function(t,r){function e(t){return function(r){return n([t,r])}}function n(e){if(i)throw new TypeError("Generator is already executing.");for(;a;)try{if(i=1,o&&(u=o[2&e[0]?"return":e[0]?"throw":"next"])&&!(u=u.call(o,e[1])).done)return u;switch(o=0,u&&(e=[0,u.value]),e[0]){case 0:case 1:u=e;break;case 4:return a.label++,{value:e[1],done:!1};case 5:a.label++,o=e[1],e=[0];continue;case 7:e=a.ops.pop(),a.trys.pop();continue;default:if(u=a.trys,!(u=u.length>0&&u[u.length-1])&&(6===e[0]||2===e[0])){a=0;continue}if(3===e[0]&&(!u||e[1]>u[0]&&e[1]<u[3])){a.label=e[1];break}if(6===e[0]&&a.label<u[1]){a.label=u[1],u=e;break}if(u&&a.label<u[2]){a.label=u[2],a.ops.push(e);break}u[2]&&a.ops.pop(),a.trys.pop();continue}e=r.call(t,a)}catch(t){e=[6,t],o=0}finally{i=u=0}if(5&e[0])throw e[1];return{value:e[0]?e[1]:void 0,done:!0}}var i,o,u,f,a={label:0,sent:function(){if(1&u[0])throw u[1];return u[1]},trys:[],ops:[]};return f={next:e(0),throw:e(1),return:e(2)},"function"==typeof Symbol&&(f[Symbol.iterator]=function(){return this}),f};Object.defineProperty(r,"__esModule",{value:!0});var x=0,_="undefined"!=typeof Symbol?Symbol("_hmuid_"):"_hmuid_",w="undefined"!=typeof WeakMap?new WeakMap:null,m=function(){function t(t){if(this._tree=null,this._size=0,t)for(var r=0,e=t;r<e.length;r++){var n=e[r],i=n[0],o=n[1],u=l(i,o,this._tree),f=u[0],a=u[1];this._tree=a,f&&this._size++}}return Object.defineProperty(t.prototype,"size",{get:function(){return this._size},enumerable:!0,configurable:!0}),t.prototype[Symbol.iterator]=function(){return this.entries()},t.prototype.forEach=function(t,r){for(var e=0,n=this.entries();e<n.length;e++){var i=n[e],o=i[0],u=i[1];t.call(r,u,o,this)}},t.prototype.get=function(t){return y(t,this._tree)},t.prototype.has=function(t){return d(t,this._tree)},t.prototype.set=function(r,e){var n=l(r,e,this._tree),i=n[0],o=n[1];if(i){var u=new t;return u._tree=o,u._size++,u}return this},t.prototype.delete=function(r){var e=p(r,this._tree),n=e[0],i=e[1];if(n){var o=new t;return o._tree=i,o._size--,o}return this},t.prototype.keys=function(){return g(this._tree,function(t){return t[0]})},t.prototype.values=function(){return g(this._tree,function(t){return t[1]})},t.prototype.entries=function(){return g(this._tree,function(t){return t})},t}();r.default=m},,,,,function(t,r,e){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=e(6);r.ImmuList=n.default;var i=e(0);r.ImmuMap=i.default;var o=e(8);r.ImmuSet=o.default,r.default={ImmuList:n.default,ImmuMap:i.default,ImmuSet:o.default}},function(t,r,e){"use strict";function n(t,r){var e,n,i;return o(this,function(o){switch(o.label){case 0:e=0,n=t,o.label=1;case 1:return e<n.length?(i=n[e],[4,r(i)]):[3,4];case 2:o.sent(),o.label=3;case 3:return e++,[3,1];case 4:return[2]}})}function i(t){var r;return o(this,function(e){switch(e.label){case 0:r=0,e.label=1;case 1:return r<t?[4,r]:[3,4];case 2:e.sent(),e.label=3;case 3:return r++,[3,1];case 4:return[2]}})}var o=this&&this.__generator||function(t,r){function e(t){return function(r){return n([t,r])}}function n(e){if(i)throw new TypeError("Generator is already executing.");for(;a;)try{if(i=1,o&&(u=o[2&e[0]?"return":e[0]?"throw":"next"])&&!(u=u.call(o,e[1])).done)return u;switch(o=0,u&&(e=[0,u.value]),e[0]){case 0:case 1:u=e;break;case 4:return a.label++,{value:e[1],done:!1};case 5:a.label++,o=e[1],e=[0];continue;case 7:e=a.ops.pop(),a.trys.pop();continue;default:if(u=a.trys,!(u=u.length>0&&u[u.length-1])&&(6===e[0]||2===e[0])){a=0;continue}if(3===e[0]&&(!u||e[1]>u[0]&&e[1]<u[3])){a.label=e[1];break}if(6===e[0]&&a.label<u[1]){a.label=u[1],u=e;break}if(u&&a.label<u[2]){a.label=u[2],a.ops.push(e);break}u[2]&&a.ops.pop(),a.trys.pop();continue}e=r.call(t,a)}catch(t){e=[6,t],o=0}finally{i=u=0}if(5&e[0])throw e[1];return{value:e[0]?e[1]:void 0,done:!0}}var i,o,u,f,a={label:0,sent:function(){if(1&u[0])throw u[1];return u[1]},trys:[],ops:[]};return f={next:e(0),throw:e(1),return:e(2)},"function"==typeof Symbol&&(f[Symbol.iterator]=function(){return this}),f};Object.defineProperty(r,"__esModule",{value:!0});var u=e(7),f=function(){function t(t){this._list=t?u.fromArray(t):u.empty()}return Object.defineProperty(t.prototype,"length",{get:function(){return this._list.length},enumerable:!0,configurable:!0}),t.prototype.toString=function(){return u.toArray(this._list).toString()},t.prototype.toLocaleString=function(){return u.toArray(this._list).toLocaleString()},t.prototype.get=function(t){return u.nth(t,this._list)},t.prototype.set=function(t,r){var e=u.update(t,r,this._list);return this._copy(e)},t.prototype.concat=function(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];for(var n=this._list,i=0,o=r;i<o.length;i++){var f=o[i];n=f instanceof t?u.concat(n,f._list):f instanceof Array?f.reduce(function(t,r){return u.append(r,t)},n):u.append(f,n)}return n.length>this._list.length?this._copy(n):this},t.prototype.join=function(t){var r=t||",";return u.join(r,this._list)},t.prototype.slice=function(t,r){var e=u.slice(t||0,r||this._list.length,this._list);return e.length!==this._list.length?this._copy(e):this},t.prototype.indexOf=function(t,r){var e=this._list;return r&&(e=u.slice(r,this._list.length,e)),u.indexOf(t,e)},t.prototype.every=function(t,r){var e=this,n=0;return u.every(function(i){return t.call(r,i,n++,e)},this._list)},t.prototype.some=function(t,r){var e=this,n=0;return u.some(function(i){return t.call(r,i,n++,e)},this._list)},t.prototype.forEach=function(t,r){var e=this,n=0;u.every(function(i){return t.call(r,i,n++,e),!0},this._list)},t.prototype.map=function(t,r){var e=this,n=0,i=u.map(function(i){return t.call(r,i,n++,e)},this._list);return this._copy(i)},t.prototype.filter=function(t,r){var e=this,n=0,i=u.filter(function(i){return t.call(r,i,n++,e)},this._list);return i.length!==this._list.length?this._copy(i):this},t.prototype.reduce=function(t,r,e){var n=this,i=0;return u.foldl(function(r){return t.call(e,r,i++,n)},r,this._list)},t.prototype.reduceRight=function(t,r,e){var n=this,i=0;return u.foldr(function(r){return t.call(e,r,i++,n)},r,this._list)},t.prototype[Symbol.iterator]=function(){return n(this._list,function(t){return t})},t.prototype.entries=function(){var t=0;return n(this._list,function(r){return[t++,r]})},t.prototype.keys=function(){return i(this._list.length)},t.prototype.values=function(){return n(this._list,function(t){return t})},t.prototype.find=function(t,r){var e=this,n=0;return u.find(function(i){return t.call(r,i,n++,e)},this._list)},t.prototype.findIndex=function(t,r){var e=this,n=0;return u.findIndex(function(i){return t.call(r,i,n++,e)},this._list)},t.prototype._copy=function(r){var e=new t;return e._list=r,e},t}();r.default=f},function(t,r,e){"use strict";function n(t){cr=t}function i(t,r){for(var e=r,n=0;n<t;++n)e=new hr(void 0,[e]);return e}function o(t){for(var r=[],e=0;e<t.length;++e)r[e]=t[e];return r}function u(t,r,e,n){for(var i=e;i<e+n;++i)r.push(t[i])}function f(t,r,e,n,i){for(var o=0;o<i;++o)e[n+o]=t[r+o]}function a(t,r){var e=r.length+1,n=new Array(e);n[0]=t;for(var i=1;i<e;++i)n[i]=r[i-1];return n}function s(t,r,e){var n=a(t,e.array),i=void 0;if(void 0!==e.sizes){i=new Array(e.sizes.length+1),i[0]=r;for(var o=0;o<e.sizes.length;++o)i[o+1]=e.sizes[o]+r}return new hr(i,n)}function l(t){return t.slice().reverse()}function c(t){return t[0]}function h(t){return t[t.length-1]}function v(t,r,e,n,u){var f=n>>r*sr&lr,s=(e>>r*sr&lr)-f;if(void 0!==t.sizes){for(;t.sizes[s]<=e;)s++;e-=0===s?0:t.sizes[s-1]}var l;return s<0?l=a(i(r,u),t.array):(l=o(t.array),l[s]=0===r?u:v(l[s],r-1,e,0===s?n:0,u)),new hr(t.sizes,l)}function p(t,r,e,n){e+=n;for(var i,o=t;r>=0;--r)i=(e>>r*sr&lr)-(n>>r*sr&lr),0!==i&&(n=0),o=o.array[i];return o}function d(t,r,e){for(var n,i=t;void 0!==i.sizes;){for(n=e>>r*sr&lr;i.sizes[n]<=e;)n++;e-=0===n?0:i.sizes[n-1],r--,i=i.array[n]}return p(i,r,e,0)}function y(t){var r=t.sizes,e=t.array;return new hr(void 0===r?void 0:o(r),o(e))}function g(t){return new hr(void 0,t)}function b(t){return new hr(void 0,t.reverse())}function x(t,r){for(var e=0,n=[],i=0;i<t.array.length;++i)e+=_(t.array[i],r-1),n[i]=e;return t.sizes=n,t}function _(t,r){if(0!==r){if(void 0!==t.sizes)return h(t.sizes);var e=_(h(t.array),r-1);return(t.array.length-1<<r*sr)+e}return t.array.length}function w(t,r,e){if(r.length===e)return r.push(t),r;var n=[];return f(r,0,n,0,e),n.push(t),n}function m(t){return t.bits&dr}function z(t){return t.bits>>pr&dr}function k(t){return t.bits>>2*pr}function j(t,r){return t<<pr|r&~(dr<<pr)}function M(t,r){return t|r&~dr}function O(t,r){return t<<2*pr|r&(dr|dr<<pr)}function S(t){return t+(1<<pr)}function A(t){return t+1}function I(t){return t+(1<<2*pr)}function P(t,r,e){return t<<2*pr|r<<pr|e}function L(t){return new yr(t.bits,t.offset,t.length,t.root,t.suffix,t.prefix)}function E(t,r){var e=z(r);if(e<32)return new yr(S(r.bits),r.offset,r.length+1,r.root,r.suffix,w(t,r.prefix,e));var n=L(r);G(n,l(r.prefix));var i=[t];return n.prefix=i,n.length++,n.bits=j(1,n.bits),n}function q(t,r,e){var n=y(t.root);t.root=n;for(var i=1;i<r;++i){if(void 0!==n.sizes)for(var o=0;o<n.sizes.length;++o)n.sizes[o]+=e;var u=y(n.array[0]);n.array[0]=u,n=u}return n}function T(t,r){if(void 0!==r){var e=new Array(r.length+1);e[0]=t;for(var n=0;n<r.length;++n)e[n+1]=r[n]+t;return e}}function W(t,r,e){var n;if(t.root.array.length<ar)n=Math.pow(32,r)-32,t.root=new hr(T(32,t.root.sizes),a(i(r-1,e),t.root.array));else{t.bits=I(t.bits);var o=void 0===t.root.sizes?void 0:[32,h(t.root.sizes)+32];n=0===r?0:Math.pow(32,r+1)-32,t.root=new hr(o,[i(r,e),t.root])}return n}function G(t,r){if(void 0===t.root)return 0===m(t)?(t.bits=M(r.length,t.bits),t.suffix=r):t.root=new hr(void 0,r),t;var e=new hr(void 0,r),n=k(t),o=0;if(void 0!==t.root.sizes){for(var u=0,f=0,a=t.root;void 0!==a.sizes&&f<n;)++f,a.array.length<32&&(u=f),a=a.array[0];if(0!==t.offset){for(var l=q(t,f,32),c=0;c<l.sizes.length;++c)l.sizes[c]+=ar;return l.array[0]=R(l.array[0],n-f-1,t.offset-1>>5,t.offset>>5,e),t.offset=t.offset-ar,t}if(0===u)t.offset=W(t,n,e);else{var h,v=void 0;u>1?(h=q(t,u-1,32),v=h.array[0]):(h=void 0,v=t.root);var p=i(n-u,e);t.offset=Math.pow(32,n-u+1)-32;var d=s(p,32,v);void 0===h?t.root=d:h.array[0]=d}return t}return 0!==t.offset?(o=t.offset-ar,t.root=R(t.root,n-1,t.offset-1>>5,t.offset>>5,e)):o=W(t,n,e),t.offset=o,t}function R(t,r,e,n,u){var f,s=n>>r*sr&lr,l=(e>>r*sr&lr)-s;return l<0?f=a(i(r,u),t.array):(f=o(t.array),f[l]=0===r?u:v(f[l],r-1,e,0===l?n:0,u)),new hr(t.sizes,f)}function U(t,r){var e=m(r);if(e<32)return new yr(A(r.bits),r.offset,r.length+1,r.root,w(t,r.suffix,e),r.prefix);var n=[t],i=g(r.suffix),o=L(r);return Gt(o,i),o.suffix=n,o.length++,o.bits=M(1,o.bits),o}function C(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var e=B(),n=0,i=t;n<i.length;n++){e=U(i[n],e)}return e}function N(t,r){return new yr(2,0,2,void 0,[t,r],vr)}function B(){return new yr(0,0,0,void 0,vr,vr)}function D(t,r){for(var e=B();--r>=0;)e=U(t,e);return e}function F(t){return t.length}function H(t){return 0!==z(t)?h(t.prefix):0!==m(t)?c(t.suffix):void 0}function J(t){return 0!==m(t)?h(t.suffix):0!==z(t)?c(t.prefix):void 0}function K(t,r){var e=z(r),n=m(r),i=r.offset;if(t<e)return r.prefix[e-t-1];if(t>=r.length-n)return r.suffix[t-(r.length-n)];var o=k(r);return void 0===r.root.sizes?p(r.root,o,t-e,i):d(r.root,o,t-e)}function Q(t,r){for(var e=new Array(r.length),n=0;n<r.length;++n)e[n]=t(r[n]);return e}function V(t,r,e){if(0!==e){for(var n=r.array,i=new Array(n.length),o=0;o<n.length;++o)i[o]=V(t,n[o],e-1);return new hr(r.sizes,i)}return new hr(void 0,Q(t,r.array))}function X(t,r,e){for(var n=new Array(e),i=0;i<e;++i)n[i]=t(r[i]);return n}function Y(t,r){return new yr(r.bits,r.offset,r.length,void 0===r.root?void 0:V(t,r.root,k(r)),X(t,r.suffix,m(r)),X(t,r.prefix,z(r)))}function Z(t,r){return Y(function(r){return r[t]},r)}function $(t,r){for(var e=B(),n=t;n<r;++n)e=e.append(n);return e}function tt(t,r,e,n){for(var i=0;i<n;++i)r=t(r,e[i]);return r}function rt(t,r,e,n){for(var i=n-1;0<=i;--i)r=t(r,e[i]);return r}function et(t,r,e,n){var i=e.array;if(0===n)return tt(t,r,i,i.length);for(var o=0;o<i.length;++o)r=et(t,r,i[o],n-1);return r}function nt(t,r,e){var n=m(e),i=z(e);return r=rt(t,r,e.prefix,i),void 0!==e.root&&(r=et(t,r,e.root,k(e))),tt(t,r,e.suffix,n)}function it(t,r){return nt(function(r,e){return t(e)?U(e,r):r},B(),r)}function ot(t,r){return nt(function(r,e){return t(e)?r:U(e,r)},B(),r)}function ut(t,r){return nt(function(r,e){return 0===r.length?e:r+t+e},"",r)}function ft(t,r,e,n){for(var i=r,o=n-1;0<=o;--o)i=t(e[o],i);return i}function at(t,r,e,n){for(var i=r,o=0;o<n;++o)i=t(e[o],i);return i}function st(t,r,e,n){var i=e.array;if(0===n)return ft(t,r,i,i.length);for(var o=r,u=i.length-1;0<=u;--u)o=st(t,o,i[u],n-1);return o}function lt(t,r,e){var n=m(e),i=z(e),o=ft(t,r,e.suffix,n);return void 0!==e.root&&(o=st(t,o,e.root,k(e))),at(t,o,e.prefix,i)}function ct(t){return nt(Nt,B(),t)}function ht(t,r,e,n){for(var i=0;i<n&&t(e[i],r);++i);return i===n}function vt(t,r,e,n){for(var i=n-1;0<=i&&t(e[i],r);--i);return-1===i}function pt(t,r,e,n){var i=e.array;if(0===n)return ht(t,r,i,i.length);for(var o=0;o<i.length&&pt(t,r,i[o],n-1);++o);return o===i.length}function dt(t,r,e){var n=m(e),i=z(e);return vt(t,r,e.prefix,i)&&(void 0!==e.root?pt(t,r,e.root,k(e))&&ht(t,r,e.suffix,n):ht(t,r,e.suffix,n)),r}function yt(t,r){return r.result=r.predicate(t)}function gt(t,r){return dt(yt,{predicate:t,result:!0},r).result}function bt(t,r){return!(r.result=r.predicate(t))}function xt(t,r){return dt(bt,{predicate:t,result:!1},r).result}function _t(t,r){return!xt(t,r)}function wt(t,r){return!r.predicate(t)||(r.result=t,!1)}function mt(t,r){return dt(wt,{predicate:t,result:void 0},r).result}function zt(t,r){return++r.index,!(r.found=cr(t,r.element))}function kt(t,r){var e=dt(zt,{element:t,found:!1,index:-1},r),n=e.found,i=e.index;return n?i:-1}function jt(t,r){return++r.index,!(r.found=r.predicate(t))}function Mt(t,r){var e=dt(jt,{predicate:t,found:!1,index:-1},r),n=e.found,i=e.index;return n?i:-1}function Ot(t,r){return!(r.result=t===r.element)}function St(t,r){return xr.element=t,xr.result=!1,dt(Ot,xr,r).result}function At(t,r){var e=r.iterator.next().value;return r.equals=cr(e,t)}function It(t,r){return t===r||t.length===r.length&&(_r.iterator=r[Symbol.iterator](),_r.equals=!0,dt(At,_r,t).equals)}function Pt(t){for(var r=[],e=0,n=0;n<t.length;++n)e+=t[n].array.length,r[n]=t[n].array.length;var i=Math.ceil(e/ar),o=t.length,u=0;if(!(i+wr>=o)){for(;i+wr<o;){for(;r[u]>ar-wr/2;)++u;var f=r[u];do{var a=Math.min(f+r[u+1],ar);r[u]=a,f-=a-r[u+1],++u}while(f>0);for(var s=u;s<=o-1;++s)r[s]=r[s+1];--u,--o}return r.length=o,r}}function Lt(t,r,e){var n=[];if(void 0!==t)for(var i=0;i<t.array.length-1;++i)n.push(t.array[i]);for(var i=0;i<r.array.length;++i)n.push(r.array[i]);if(void 0!==e)for(var i=1;i<e.array.length;++i)n.push(e.array[i]);return n}function Et(t,r,e){for(var n=[],i=0,o=0,f=0,a=r;f<a.length;f++){var s=a[f],l=t[i].array;if(s===l.length&&0===o)n.push(t[i]),++i;else{for(var c=new hr(void 0,[]);s>0;){var h=l.length-o,v=Math.min(s,h);u(l,c.array,o,v),s>=h?(++i,l=t[i].array,o=0):o+=v,s-=v}e>1&&x(c,e-1),n.push(c)}}return n}function qt(t,r,e,n,i){var o=Lt(t,r,e),u=Pt(o),f=void 0!==u?Et(o,u,n):o;return f.length<=ar?!0===i?new hr(void 0,f):new hr(void 0,[x(new hr(void 0,f),n)]):new hr(void 0,[x(new hr(void 0,f.slice(0,ar)),n),x(new hr(void 0,f.slice(ar)),n)])}function Tt(t,r,e,n,i){if(r>n){var o=Tt(h(t.array),r-1,e,n,!1);return qt(t,o,void 0,r,i)}if(r<n){var o=Tt(t,r,c(e.array),n-1,!1);return qt(void 0,o,e,n,i)}if(0===r)return new hr(void 0,[t,e]);var o=Tt(h(t.array),r-1,c(e.array),n-1,!1);return qt(t,o,e,r,i)}function Wt(t){return t.array[0]instanceof hr?1+Wt(t.array[0]):0}function Gt(t,r){if(void 0===t.root)return 0===z(t)?(t.bits=j(r.array.length,t.bits),t.prefix=l(r.array)):t.root=r,t;var e=k(t),n=t.length-1-z(t),o=0,u=0,f=5*e,a=t.root;for(Math.pow(32,e+1)<n&&(f=0,u=e);f>5;){var s=void 0;void 0===a.sizes?(s=n>>f&lr,n&=~(lr<<f)):(s=a.array.length-1,n-=a.sizes[s-1]),u++,s<lr&&(o=u),a=a.array[s],void 0===a&&(o=u,f=5),f-=5}if(0!==f&&(u++,a.array.length<ar&&(o=u)),0===o){var c=0===u?r:i(u,r),h=new hr(void 0,[t.root,c]);t.root=h,t.bits=I(t.bits)}else{Ut(Rt(t,t,o,r.array.length),e-o).array.push(r)}return t}function Rt(t,r,e,n){var i=y(t.root);r.root=i;for(var o=1;o<e;++o){var u=i.array.length-1;void 0!==i.sizes&&(i.sizes[u]+=n);var f=y(i.array[u]);i.array[u]=f,i=f}return void 0!==i.sizes&&i.sizes.push(h(i.sizes)+n),i}function Ut(t,r){if(0===r)return t;var e=new hr(void 0,[]);t.array.push(e);for(var n=1;n<r;++n){var i=new hr(void 0,[]);e.array[0]=i,e=i}return e}function Ct(t,r){var e=0,n=0,i=0,o=m(t);for(mr[e]=[],i=0;i<o;++i)mr[e][n]=t.suffix[i],32==++n&&(n=0,++e,mr[e]=[]);for(o=z(r),i=0;i<o;++i)mr[e][n]=r.prefix[r.prefix.length-1-i],32==++n&&(n=0,++e,mr[e]=[]);for(o=m(r),i=0;i<o;++i)mr[e][n]=r.suffix[i],32==++n&&(n=0,++e,mr[e]=[]);return e}function Nt(t,r){if(0===t.length)return r;if(0===r.length)return t;var e=t.length+r.length,n=m(r),i=L(t);if(void 0===r.root){for(var o=Ct(t,r),u=0;u<o;++u)i=Gt(i,new hr(void 0,mr[u])),i.length+=mr[u].length,mr[u]=void 0;return i.length=e,i.suffix=mr[o],i.bits=M(mr[o].length,i.bits),mr[o]=void 0,i}i=Gt(i,g(t.suffix)),i.length+=m(t),i=Gt(i,b(r.prefix));var f=Tt(i.root,k(i),r.root,k(r),!0),a=Wt(f);x(f,a);var s=P(a,z(i),n);return new yr(s,0,e,f,r.suffix,i.prefix)}function Bt(t,r,e){var n=z(e),i=m(e),u=L(e);if(t<n){var f=o(u.prefix);f[f.length-t-1]=r,u.prefix=f}else if(t>=e.length-i){var a=o(u.suffix);a[t-(e.length-i)]=r,u.suffix=a}else u.root=v(e.root,k(e),t-n+e.offset,e.offset,r);return u}function Dt(t,r,e){return Bt(r,t(K(r,e)),e)}function Ft(t,r,e,n){var i=n>>r*sr&lr,o=(e>>r*sr&lr)-i;if(0===r)return void(zr=t.array.slice(o).reverse());var u=Ft(t.array[o],r-1,e,0===o?n:0);if(void 0!==u||++o!==t.array.length){var f=t.array.slice(o);return void 0!==u&&(f[0]=u),new hr(t.sizes,f)}}function Ht(t,r,e,n){var i=n>>r*sr&lr,o=(e>>r*sr&lr)-i;if(0===r)return void(zr=t.array.slice(0,o+1));var u=Ht(t.array[o],r-1,e,0===o?n:0);if(void 0!==u||-1!=--o){var f=t.array.slice(0,o+1);return void 0!==u&&(f[f.length-1]=u),new hr(t.sizes,f)}}function Jt(t,r,e,n,i,o){var u=i>>n*sr&lr,f=(t>>n*sr&lr)-u,a=(r>>n*sr&lr)-u;if(0===n)return o.prefix=vr,o.suffix=e.array.slice(f,a+1),o.root=void 0,o.bits=M(a-f+1,0),o;if(f===a){var s=Jt(t,r,e.array[f],n-1,0===f?i:0,o);return void 0!==s.root&&(s.root=new hr(void 0,[s.root])),s}var l=Ft(e.array[f],n-1,t,0===f?i:0);o.bits=j(zr.length,o.bits),o.prefix=zr;var c=Ht(e.array[a],n-1,r,0);if(o.bits=M(zr.length,o.bits),o.suffix=zr,void 0===l&&++f,void 0===c&&--a,f>a)o.bits=O(0,o.bits),o.root=void 0;else{var h=e.array.slice(f,a+1);void 0!==l&&(h[0]=l),void 0!==c&&(h[h.length-1]=c),o.root=new hr(e.sizes,h)}return o}function Kt(t,r,e){var n=e.bits,i=e.length;if(r=Math.min(i,r),t<0&&(t=i+t),r<0&&(r=i+r),r<=t||r<=0||i<=t)return B();if(t<=0&&i<=r)return e;var o=r-t,u=z(e),f=m(e);if(r<=u)return new yr(j(o,0),0,o,void 0,vr,e.prefix.slice(e.prefix.length-r,e.prefix.length-t));var a=i-f;if(a<=t)return new yr(M(o,0),0,o,void 0,e.suffix.slice(t-a,r-a),vr);var s=L(e);return u<=t&&r<=i-f?(Jt(t-u+e.offset,r-u+e.offset-1,e.root,k(e),e.offset,s),void 0!==s.root&&(s.offset+=t-u+z(s)),s.length=r-t,s):(0<t&&(t<u?n=j(u-t,n):(s.root=Ft(s.root,k(e),t-u+e.offset,e.offset),n=j(zr.length,n),s.offset+=t-u+zr.length,u=zr.length,s.prefix=zr),s.length-=t),r<i&&(i-r<f?n=M(f-(i-r),n):(s.root=Ht(s.root,k(e),r-u+s.offset-1,s.offset),void 0===s.root&&(n=O(0,n)),n=M(zr.length,n),s.suffix=zr),s.length-=i-r),s.bits=n,s)}function Qt(t,r){return Kt(0,t,r)}function Vt(t,r){return++r.index,r.predicate(t)}function Xt(t,r){return Kt(0,dt(Vt,{predicate:t,index:-1},r).index,r)}function Yt(t,r){return Kt(dt(Vt,{predicate:t,index:-1},r).index,r.length,r)}function Zt(t,r){return Kt(r.length-t,r.length,r)}function $t(t,r){return[Kt(0,t,r),Kt(t,r.length,r)]}function tr(t,r,e){return Nt(Kt(0,t,e),Kt(t+r,e.length,e))}function rr(t,r){return Kt(t,r.length,r)}function er(t,r){return Kt(0,r.length-t,r)}function nr(t){return Kt(0,-1,t)}function ir(t){return Kt(1,t.length,t)}function or(t,r){return t.push(r),t}function ur(t){return nt(or,[],t)}function fr(t){for(var r=B(),e=0;e<t.length;++e)r=U(t[e],r);return r}Object.defineProperty(r,"__esModule",{value:!0});var ar=32,sr=5,lr=31,cr=function(t,r){return t===r};r.setEquals=n;var hr=function(){function t(t,r){this.sizes=t,this.array=r}return t}();r.Node=hr;var vr=[0],pr=6,dr=63,yr=function(){function t(t,r,e,n,i,o){this.bits=t,this.offset=r,this.length=e,this.root=n,this.suffix=i,this.prefix=o}return t.prototype.space=function(){return Math.pow(ar,k(this)+1)-(this.length-m(this)-z(this)+this.offset)},t.prototype[Symbol.iterator]=function(){return new br(this)},t.prototype["fantasy-land/equals"]=function(t){return It(this,t)},t.prototype["fantasy-land/map"]=function(t){return Y(t,this)},t.prototype["fantasy-land/filter"]=function(t){return it(t,this)},t.prototype["fantasy-land/empty"]=function(){return B()},t.prototype["fantasy-land/concat"]=function(t){return Nt(this,t)},t.prototype["fantasy-land/reduce"]=function(t,r){return nt(t,r,this)},t.prototype.append=function(t){return U(t,this)},t.prototype.nth=function(t){return K(t,this)},t}();r.List=yr;var gr={done:!0,value:void 0},br=function(){function t(t){if(this.list=t,this.stack=[],this.indices=[],this.prefixLeft=z(t),void 0!==t.root){for(var r=t.root.array,e=k(t),n=0;n<e+1;++n)this.stack.push(r),this.indices.push(0),r=c(r).array;this.indices[this.indices.length-1]=-1}else this.indices.push(-1)}return t.prototype.goUp=function(){this.stack.pop(),this.indices.pop()},t.prototype.remaining=function(){var t=h(this.stack),r=h(this.indices);return t.length-r-1},t.prototype.incrementIndex=function(){return++this.indices[this.indices.length-1]},t.prototype.nextInTree=function(){for(;0===this.remaining();)if(this.goUp(),0===this.stack.length)return;this.incrementIndex();for(var t=k(this.list),r=this.indices.length-1;r<t;++r)this.stack.push(h(this.stack)[h(this.indices)].array),this.indices.push(0)},t.prototype.next=function(){if(this.prefixLeft>0)return--this.prefixLeft,{done:!1,value:this.list.prefix[this.prefixLeft]};if(0!==this.stack.length){if(this.nextInTree(),0!==this.stack.length){var t=h(this.stack),r=h(this.indices);return{done:!1,value:t[r]}}this.indices.push(-1)}var e=m(this.list);if(this.indices[0]<e-1){var r=this.incrementIndex();return{done:!1,value:this.list.suffix[r]}}return gr},t}();r.prepend=E,r.append=U,r.list=C,r.pair=N,r.empty=B,r.repeat=D,r.length=F,r.first=H,r.last=J,r.nth=K,r.map=Y,r.pluck=Z,r.range=$,r.foldl=nt,r.reduce=nt,r.filter=it,r.reject=ot,r.join=ut,r.foldr=lt,r.reduceRight=lt,r.flatten=ct,r.every=gt,r.all=gt,r.some=xt,r.any=xt,r.none=_t,r.find=mt,r.indexOf=kt,r.findIndex=Mt;var xr={element:void 0,result:!1};r.includes=St,r.contains=St;var _r={iterator:void 0,equals:!0};r.equals=It;var wr=2,mr=new Array(3);r.concat=Nt,r.update=Bt,r.adjust=Dt;var zr;r.slice=Kt,r.take=Qt,r.takeWhile=Xt,r.dropWhile=Yt,r.takeLast=Zt,r.splitAt=$t,r.remove=tr,r.drop=rr,r.dropLast=er,r.pop=nr,r.init=nr,r.tail=ir,r.toArray=ur,r.fromArray=fr},function(t,r,e){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=e(0),i=function(){function t(t){if(t){for(var r=[],e=0,i=t;e<i.length;e++){var o=i[e];r.push([o,o])}this._map=new n.default(r)}else this._map=new n.default}return Object.defineProperty(t.prototype,"size",{get:function(){return this._map.size},enumerable:!0,configurable:!0}),t.prototype[Symbol.iterator]=function(){return this._map.keys()},t.prototype.add=function(r){var e=this._map.set(r,r);if(e.size>this._map.size){var n=new t;return n._map=e,n}return this},t.prototype.entries=function(){return this._map.entries()},t.prototype.keys=function(){return this._map.keys()},t.prototype.values=function(){return this._map.values()},t.prototype.forEach=function(t,r){var e=this;this._map.forEach(function(r,n,i){return t(r,n,e)},r)},t.prototype.has=function(t){return this._map.has(t)},t}();r.default=i}])});
//# sourceMappingURL=hydux.collections.js.map