/**
 * Created by admin on 2019/6/26.
 * @author lemon<李亦黎>
 */

let adapterIfrNoGap = false,
  adapterIfrHideTop = false,
  adapterIfrMenu = false;
//条件控制界面样式
if (location.search.includes('noGap')) {
  adapterIfrNoGap = true;
}
if (location.search.includes('hideTop')) {
  adapterIfrHideTop = true;
}
if (location.search.includes('hideMenu')) {
  adapterIfrMenu = true;
}

function notifyIfmParent(target, value) {
  console.log('notifyIfmParent', target, value);
  const sender = {};
  sender[target] = value;
  window.parent.postMessage(sender, '*');
  // try{
  //   window.parent.window.wkb_parent_revice(sender);
  // }catch(xe){
  //   console.log(xe);
  // }
}

export default {
  notifyIfmParent,
  adapterIfrNoGap,
  adapterIfrHideTop,
  adapterIfrMenu
};
