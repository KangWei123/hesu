<template>
  <div
    class="grid-item"
    :style="style"
  >
    <slot v-if="layoutCfg && layoutCfg.isInited"></slot>
  </div>
</template>

<script>
import bus from './bus.js';
import { setTopLeft, setTransform, setTopLeft_rem, setTransform_rem } from './utils.js';

export default {
  inject: ['layoutInfo'],
  props: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    w: {
      type: Number,
      default: 150
    },
    h: {
      type: Number,
      default: 30
    },
    z: {
      type: Number,
      default: null
    },
    type: {
      type: String,
      default: 'scale' // rem rem方式缩放, scale scale方式缩放，responsive 响应式不缩放
    }
  },
  data() {
    return {
      useCssTransforms: true, // 启用trnasform作定位（GPU支持），比top, left性能好
      forceUpdate: false,
      layoutCfg: null
    };
  },
  computed: {
    style() {
      if (!this.layoutCfg) {
        return {};
      }
      let style = {};
      switch (this.type) {
        case 'responsive': {
          style = this.styleResponsive();
          break;
        }
        case 'scale': {
          style = this.styleScale();
          break;
        }
        case 'rem': {
          style = this.styleRem();
          break;
        }
      }
      style.zIndex = this.z;
      return style;
    }
  },
  created() {
    bus.$on('layout-ready', this.onLayoutReady);
    bus.$on('layout-resize', this.onResize);
  },
  beforeDestroy() {
    bus.$off('layout-ready', this.onLayoutReady);
    bus.$off('layout-resize', this.onResize);
  },
  mounted() {
    if (this.layoutInfo.isInited) {
      this.layoutCfg = this.layoutInfo;
    }
  },
  methods: {
    // 栅格响应式计算宽度，高度，位置
    calcPos(colWidth) {
      const { rowHeight, margin } = this.layoutCfg;
      const left = Math.round(colWidth * this.x + (this.x + 1) * margin[0]);
      const top = Math.round(rowHeight * this.y + (this.y + 1) * margin[1]);
      const width = Math.round(colWidth * this.w + Math.max(0, this.w - 1) * margin[0]);
      const height = Math.round(rowHeight * this.h + Math.max(0, this.h - 1) * margin[1]);
      return {
        left,
        top,
        width,
        height
      };
    },
    calcColWidth() {
      const { colNum, width, margin } = this.layoutCfg;
      // 列宽度 =（父级容器宽度 - 列间距）/ colNum列数
      const colWidth = (width - margin[0] * (colNum + 1)) / colNum;
      return colWidth;
    },
    // 自适应计算宽度和高度不会缩放
    styleResponsive() {
      if (!this.layoutCfg) {
        return {};
      }
      // 栅格响应式布局，colNum必须大于0
      const colWidth = this.calcColWidth();
      const pos = this.calcPos(colWidth);

      if (this.useCssTransforms) {
        return setTransform(pos.top, pos.left, pos.width, pos.height);
      } else {
        return setTopLeft(pos.top, pos.left, pos.width, pos.height);
      }
    },
    // 根据分辨率计算大小
    calcColWidth_Size() {
      const { colNum, margin, size } = this.layoutCfg;
      // 列宽度 =（父级容器宽度 - 列间距）/ colNum列数
      const colWidth = (size.width - margin[0] * (colNum + 1)) / colNum;
      return colWidth;
    },
    // 缩放，通过scale来
    styleScale() {
      const { width, size, minWidth } = this.layoutCfg;
      const scale = Math.max(minWidth, width) / size.width;
      let pos = {
        top: this.y,
        left: this.x,
        width: this.w,
        height: this.h
      };
      if (this.colNum > 0) {
        // colNum === 0，非栅格布局，直接应用x,y,w,h
        const colWidth = this.calcColWidth_Size();
        pos = this.calcPos(colWidth);
      }
      if (this.useCssTransforms) {
        return setTransform(pos.top, pos.left, pos.width, pos.height, scale);
      } else {
        return setTopLeft(pos.top, pos.left, pos.width, pos.height, scale);
      }
    },
    // 缩放，通过rem来
    styleRem() {
      let pos = {
        top: this.y,
        left: this.x,
        width: this.w,
        height: this.h
      };
      if (this.colNum > 0) {
        // colNum === 0，非栅格布局，直接应用x,y,w,h
        const colWidth = this.calcColWidth_Size();
        pos = this.calcPos(colWidth);
      }
      if (this.useCssTransforms) {
        return setTransform_rem(pos.top, pos.left, pos.width, pos.height, 100, 'rem');
      } else {
        return setTopLeft_rem(pos.top, pos.left, pos.width, pos.height, 100, 'rem');
      }
    },
    onLayoutReady($parent) {
      this.layoutCfg = this.layoutInfo;
    },
    // 窗口改变
    onResize(e) {
      this.layoutCfg = this.layoutInfo;
    }
  }
};
</script>

<style scoped lang="less">
.grid-item {
  position: absolute;
  left: 0;
  top: 0;
  transition-property: transform;
  transition: all 0.2s ease;
  transform-origin: 0 0;
}
</style>
