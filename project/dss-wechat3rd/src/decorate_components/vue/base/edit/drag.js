let draging = null;
let drag = {
  //目标元素的类名
  nodeClassName: 'img-preview',
  //目标子元素的类名
  nodeChildName: 'img',
  //数据集
  list: [],
  //使用事件委托，将目标元素的事件委托给容器
  ondragstart(event) {
    //console.log("start");
    //firefox设置了setData后元素才能拖动！！！！
    event.dataTransfer.setData('te', event.target.innerText); //不能使用text，firefox会打开新tab
    draging = event.target;
  },

  ondragover(event) {
    event.stopPropagation();
    let target = event.target;
    //因为dragover会发生在容器上，所以要判断是不是目标元素
    if (target.className === drag.nodeClassName || target.className === drag.nodeChildName) {
      if (target.className === drag.nodeChildName) {
        target = target.parentNode;
      }
      if (target !== draging) {
        let targetRect = target.getBoundingClientRect();
        let dragingRect = draging.getBoundingClientRect();
        if (target) {
          if (target.animated) {
            return;
          }
        }
        //拖拽数组顺序更改
        let delArr = drag.list.splice(drag._index(target), 1, drag.list[drag._index(draging)]);
        drag.list[drag._index(draging)] = delArr[0];
        drag._animate(dragingRect, target);
        drag._animate(targetRect, draging);
      }
    }
  },

  //获取元素在父元素中的index
  _index(el) {
    let index = 0;

    if (!el || !el.parentNode) {
      return -1;
    }

    while (el && (el = el.previousElementSibling)) {
      //console.log(el);
      index++;
    }

    return index;
  },

  _animate(prevRect, target) {
    let ms = 300;

    if (ms) {
      let currentRect = target.getBoundingClientRect();

      if (prevRect.nodeType === 1) {
        prevRect = prevRect.getBoundingClientRect();
      }

      drag._css(target, 'transition', 'none');
      drag._css(
        target,
        'transform',
        'translate3d(' + (prevRect.left - currentRect.left) + 'px,' + (prevRect.top - currentRect.top) + 'px,0)'
      );

      target.offsetWidth; // 触发重绘
      //放在timeout里面也可以
      // setTimeout(function() {
      //     _css(target, 'transition', 'all ' + ms + 'ms');
      //     _css(target, 'transform', 'translate3d(0,0,0)');
      // }, 0);
      drag._css(target, 'transition', 'all ' + ms + 'ms');
      drag._css(target, 'transform', 'translate3d(0,0,0)');

      clearTimeout(target.animated);
      target.animated = setTimeout(function() {
        drag._css(target, 'transition', '');
        drag._css(target, 'transform', '');
        target.animated = false;
      }, ms);
    }
  },

  //给元素添加style
  _css(el, prop, val) {
    let style = el && el.style;

    if (style) {
      if (val === void 0) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
          val = document.defaultView.getComputedStyle(el, '');
        } else if (el.currentStyle) {
          val = el.currentStyle;
        }

        return prop === void 0 ? val : val[prop];
      } else {
        if (!(prop in style)) {
          prop = '-webkit-' + prop;
        }

        style[prop] = val + (typeof val === 'string' ? '' : 'px');
      }
    }
  }
};
export default drag;
