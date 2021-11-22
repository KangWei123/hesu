import activityAPI from '@/dss-wechat3rd/src/api/activity.js';
const object = (function() {
  function instance() {}

  /**
   * 获取自定义页
   * @param callBack 定时队列回调
   * @return instance.id 定时队列的id
   */
  instance.getCustomPage = function(customPages, disablePages, callBack) {
    const x = [];
    (customPages || []).forEach(item => {
      const obj = {
        value: JSON.stringify({
          index: item.index,
          name: item.name
        }),
        label: item.name
      };
      const exist = (disablePages || []).find(path => {
        // eslint-disable-next-line no-unused-expressions
        return item.index === path;
      });
      if (disablePages && disablePages.length && exist) {
        obj.disabled = 'false';
      }
      x.push(obj);
    });
    instance.customPages = x;
    callBack && callBack();
  };

  /**
   * 获取活动
   * @param callBack 回调
   */
  instance.getDefaultPage = function(defaultPage, disablePages, callBack) {
    const x = [];
    console.log('disablePages', disablePages);
    (defaultPage || []).forEach(item => {
      const obj = {
        value: JSON.stringify({
          index: item.realPath,
          name: item.name
        }),
        label: item.name
      };
      const exist = (disablePages || []).find(path => {
        return item.realPath.includes(path) || !item.able;
      });
      if (disablePages && disablePages.length && exist) {
        obj.disabled = 'false';
      }
      x.push(obj);
    });
    instance.defaultPages = x;
    callBack && callBack();
  };

  instance.customPages = [];
  instance.defaultPages = [];
  return instance;
})();
export default object;
