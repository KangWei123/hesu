(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{0:function(e,t,o){"use strict";var n=o(5),s=o.n(n),r=o(6),i=o.n(r);o(14),o(15);let c=5e3;var a=function(e){const t=document.body;let o={showClose:!0,type:"error",duration:4e3};if(e)for(const t in e)o[t]=e[t];let n=`<i class="el-message__icon el-icon-${o.type}"></i>`+`<p class="dss-common-msg__content"><span>${o.message}</span></p>`;const s=document.createElement("div");s.className=`dss-common-msg dss-common-msg--${o.type}`,s.style.zIndex=c++,s.innerHTML=n,t.appendChild(s),setTimeout(()=>{t.removeChild(s)},o.duration)};const u=Object.prototype.toString,p=s.a.create({baseURL:"",timeout:6e4,transformRequest:function(e,t,o){return i.a.stringify(e)},headers:{"Cache-Control":"no-cache","Content-Type":"application/x-www-form-urlencoded","X-Requested-With":"XMLHttpRequest"}}),l=(e,t="error")=>{a({showClose:!0,type:t,duration:4e3,message:e})};function m(e){Object.keys(e).forEach(t=>{""!==e[t]&&null!==e[t]||delete e[t]})}p.interceptors.request.use(e=>{if("post"===e.method){const t={...e.data};m(t);const o=(e.url+"").toLocaleLowerCase();if(!(0===e.url.indexOf("http"))&&(o.indexOf("/dsp/")>-1||o.indexOf("/dmp/")>-1))for(const e in t){const o=u.call(t[e]);"[object Object]"!==o&&"[object Array]"!==o||(t[e]=JSON.stringify(t[e]))}e.data=t}else"get"===e.method&&(e.params={_t:Date.parse(new Date)/1e3,...e.params},m(e.params));return e},(function(e){return Promise.reject(e)})),p.interceptors.response.use(e=>{const{data:t,config:o}=e;if((!t.success||"false"===t.success)&&200!==t.code){const e=t.errorMessage||t.message||"未知错误",n=t.errorCode||t.code||-1e3;return o.hidden||l(`${o.action}失败：${e}`),401===n&&setTimeout(()=>{const e=encodeURIComponent(window.location.href);window.top.location.href=`/login.html?gotoUrl=${e}`},1e3),Promise.reject({code:n,message:e})}return t||{}},e=>{if(!e.config.hidden){let t=e.message;e.response&&403===e.response.status?t="您没有该权限":e.response&&502===e.response.status?t="系统升级中，请稍后重试":e.response&&504===e.response.status&&(t="系统超时，请重试"),l(`${e.config.action}失败：${t}`)}return Promise.reject(e)}),p.json=(e,t,o)=>{let n="[object Array]"===Object.prototype.toString.call(t);const s={headers:{"Content-Type":"application/json"},transformRequest:function(e,o){return n?JSON.stringify(t):JSON.stringify(e)}},r=Object.assign(s,o);return p.post(e,t,r)};t.a=p},14:function(e,t){Promise.prototype.always=function(e){return this.then(e,e)},Promise.prototype.done=function(e,t){return t||(t=e=>e),this.then(e,t)},Promise.prototype.fail=function(e){return this.then(e=>e,e)}},15:function(e,t,o){},16:function(e,t){e.exports=common},2:function(e,t,o){"use strict";var n=o(0);function s(){const e=encodeURIComponent(window.location.href);window.top.location.href=`/login.html?gotoUrl=${e}`}t.a={WpSchema:"/wp",postPayLoadData:function(e,t,o){return n.a.post(e,t,{headers:{"Content-Type":"application/json"},transformRequest:function(e){return JSON.stringify(e)},action:o})},getUserInfoWP:()=>n.a.get("/wp/loginV2/query",{action:"获取wx用户信息"}),getEmployeePositionList:()=>n.a.get("/wp/employee/query/position/list",{action:"查询职位列表"}),queryUserMenu:()=>n.a.get("/wp/login/queryUserMenu?source=3",{action:"获取用户菜单"}),queryUserManagement:()=>n.a.get("/wp/login/queryUserComponent?source=1",{action:"获取用户管理员权限"}),queryUserComponent:()=>n.a.get("/wp/login/queryUserComponent?source=3",{action:"获取用户权限组件"}),getUserTemplate:e=>n.a.get("/wp/sellerTemplate/get",{action:"获取用户单个店铺模板配置",params:e}),changeApp:e=>n.a.get("/wp/app/choose",{action:"切换店铺",params:e}),checkWpLogin(e=!0){return new Promise((t,o)=>{this.getUserInfoWP().then(e=>{const{data:n}=e;return e.success&&n.login?t(e):(s(),e.success=!1,o(e))},t=>(console.log("checkLogin catch",JSON.stringify(t)),e&&s(),o(t)))})},changeStore:e=>n.a.get("/wp/store/change",{action:"切换店铺",params:{storeId:e}}),queryList:e=>n.a.get("/wp/warehouse/queryList",{action:"获取仓库列表",params:e})}},22:function(e,t,o){"use strict";var n=o(16),s=o(2),r=n.utils.services,i=s.a.WpSchema;t.a={getWorkWechatAuthInfo:function(e){return r.get(i+"/wxwork/auth/get_auth_info",{action:"获取企业微信授权信息",params:e})},confirmWorkWechatAuthCode:function(e){return r.post(i+"/wxwork/auth/confirm",e,{action:"确认企业微信授权临时码"})}}},5:function(e,t){e.exports=common.axios},6:function(e,t){e.exports=common.qs},71:function(e,t,o){"use strict";o.r(t);var n=o(22);var s,r,i={suite_id:"wwc2940513e67953b0"},c=(s=window.location.search,(r=s.substring(s.lastIndexOf("?")+1))?JSON.parse('{"'+decodeURIComponent(r).replace(/"/g,'\\"').replace(/&/g,'","').replace(/=/g,'":"')+'"}'):{});i.auth_code=c.auth_code;var a=document.querySelector(".container .title"),u=document.querySelector(".container .content");n.a.confirmWorkWechatAuthCode({suiteId:i.suite_id,authCode:i.auth_code}).then((function(){a.innerHTML="恭喜授权企业微信成功"})).catch((function(){a.innerHTML="抱歉授权企业微信失败，请重试"})).finally((function(){u.style.visibility="visible",function e(){var t=document.getElementById("time");t.innerHTML=t.innerHTML-1,0==t.innerHTML&&(window.location.href="/authorization.html"),setTimeout(e,1e3)}()}))}},[[71,0]]]);
//# sourceMappingURL=work_wechat_authorization_success.ec542937.chunk.js.map