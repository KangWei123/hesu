// 主题组件，无渲染组件，只是简单的把属性传给子组件
export default {
  name: 'theme',
  render(h) {
    const theme = this.$attrs; // 通过 $attrs 可以拿到使用该组件时定义的 props，而无需声明有哪些 props
    const merge = vNode => {
      if (!vNode.tag) {
        return;
      }
      if (vNode.componentOptions) {
        let props = vNode.componentOptions.propsData;
        props = Object.assign({}, theme, props);
        vNode.componentOptions.propsData = props;
      } else {
        if (!vNode.data) {
          return;
        }
        let attrs = vNode.data.attrs || {};
        attrs = Object.assign({}, theme, attrs);
        vNode.data.attrs = attrs;
      }
    };
    this.$slots.default.map(vNode => merge(vNode));
    Object.keys(this.$attrs).forEach(key => {
      this.$attrs[key] = null;
    });
    return this.$slots.default[0]; // 直接返回，无需额外渲染
  }
};
