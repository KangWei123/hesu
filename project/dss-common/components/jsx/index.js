import Vue from 'vue';

/**
 * 用于 JSX 自定义渲染
 * Vue 的 JSX 用法和 React 有较大的差异，详见 https://github.com/vuejs/jsx
 */
export default Vue.extend({
  functional: true,
  name: 'JSXWrapper',
  props: {
    renderer: {
      type: Function,
      required: true,
    },
  },
  render(h, context) {
    return context.props.renderer(h, context);
  },
});
