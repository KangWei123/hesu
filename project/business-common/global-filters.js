/**
 * 全局安装的 filters
 */
// @ts-check
import * as DateFormat from './filters/date-format-filters';
import * as NumberFormat from './filters/number-format-filters';
import * as StyleFormat from './filters/style-format-filter';

/**
 * @type {Vue.PluginObject<{}>}
 */
const plugin = {
  install(Vue) {
    /**
     * @type {Record<string, Function>}
     */
    const all = {};
    [DateFormat, NumberFormat, StyleFormat].forEach(filters => {
      for (const key in filters) {
        // @ts-expect-error
        const filter = filters[key];
        Vue.filter(key, filter);
        all[key] = filter;
      }
    });

    // 支持编程式访问
    Vue.mixin({
      computed: {
        $filters() {
          return all;
        },
      },
    });
  },
};

export default plugin;
