/**
 * 全局注册icon组件
 */

import wkUI from 'wkb-common-ui';
const context = require.context('./', true, /\.svg$/, 'sync');

const REGEXP = /icon-(.*)\.svg/;
context.keys().forEach(module => {
  const name = module.match(REGEXP);
  if (name) {
    wkUI.registerIcon('icon-' + name[1], context(module));
  }
});
