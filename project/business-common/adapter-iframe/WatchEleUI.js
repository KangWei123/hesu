/**
 * Created by admin on 2019/6/26.
 * @author lemon<李亦黎>
 */
import config from './config';
import Vue from 'vue';

let notifyIfmParent = config.notifyIfmParent;

export default function(ElementUI) {
  //重写element dialog方法=》将控制遮罩层开关变量val暴露出来

  let Dialog = ElementUI.Dialog;
  let DialogWatchVisible = Dialog.watch.visible;
  Dialog.watch.visible = function(val) {
    notifyIfmParent('notifyIfmMask', !!val);
    DialogWatchVisible.call(this, val);
  };

  Vue.use(ElementUI);

  //改写element vue.prototype.$confirm方法=》将控制遮罩层开关变量val暴露出来
  let EleMsgBoxConfirm = ElementUI.MessageBox.confirm;
  Vue.prototype.$confirm = function(message, title, options) {
    notifyIfmParent('notifyIfmMask', true);
    let bc = options.beforeClose;
    if (!bc) {
      options.beforeClose = function(action, context, close) {
        notifyIfmParent('notifyIfmMask', false);
        close.call(context);
      };
    }
    return EleMsgBoxConfirm.call(this, message, title, options);
  };
}
