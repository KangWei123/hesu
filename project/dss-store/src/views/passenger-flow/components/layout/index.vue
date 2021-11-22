<template>
  <div class="dss-layout" :style="style">
    <slot></slot>
  </div>
</template>

<script>
import bus from './bus.js';

export default {
  props: {
    // 栅格布局时有用，colNum =0时，此属性无效
    rowHeight: {
      type: Number,
      default: 5
    },
    // 栅格布局，有多少个栅格，如果为0则表示不是栅格布局，则grid-item里的x,y,w,h为实际的值，不是栅格值
    colNum: {
      type: Number,
      default: 100
    },
    // 大小:屏幕大小
    size: {
      type: Object,
      default() {
        return {
          width: 1920,
          height: 1080
        };
      }
    },
    // colNum =0 时，此属性忽略
    margin: {
      type: Array,
      default() {
        return [1, 1];
      }
    },
    // 大屏最小宽度
    minWidth: {
      type: Number,
      default: 1000
    },
    // 布局方式，auto,rem，rem会设置
    type: {
      type: String,
      default: 'auto'
    },
    // 默认rem大小，此属性不要修改
    defaultRem: {
      type: Number,
      default: 100
    }
  },
  provide() {
    this._layoutInfo = { isInited: false };
    return {
      layoutInfo: this._layoutInfo
    };
  },
  computed: {
    style() {
      return {
        minWidth: this.minWidth + 'px'
      };
    }
  },
  watch: {
    defaultRem(val) {
      this.resize({ defaultRem: val });
    },
    minWidth(minWidth) {
      this.resize({ minWidth });
    },
    margin(margin) {
      this.resize({ margin });
    },
    size(size) {
      this.resize({ size });
    },
    colNum(colNum) {
      this.resize({ colNum });
    },
    rowHeight(rowHeight) {
      this.resize({ rowHeight });
    }
  },
  created() {
    this._html = document.documentElement;
    if (this.type === 'rem') {
      this._html.style.fontSize = this.defaultRem + 'px';
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
    this.setLayoutInfo();

    bus.$emit('layout-ready', this);
    this.resize();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    setLayoutInfo() {
      const $el = this.$el;
      this._layoutInfo.isInited = true;
      this._layoutInfo.colNum = this.colNum;
      this._layoutInfo.rowHeight = this.rowHeight;
      this._layoutInfo.width = $el.clientWidth || 100;
      this._layoutInfo.height = $el.clientWidth;
      this._layoutInfo.margin = this.margin;
      this._layoutInfo.size = this.size;
      this._layoutInfo.minWidth = this.minWidth;
      this._layoutInfo.defaultRem = this.defaultRem;
    },
    onResize(e) {
      if (this._reisizeThreadId) {
        clearTimeout(this._reisizeThreadId);
        this._reisizeThreadId = null;
      }
      this._reisizeThreadId = setTimeout(() => {
        this._reisizeThreadId = null;
        bus.$emit('layout-befor-resize', { rowHeight: this.rowHeight, colNum: this.colNum });
        this.resize();
        bus.$emit('layout-after-resize', { rowHeight: this.rowHeight, colNum: this.colNum });
      }, 300);
      //this.resize();
    },
    resize(parmas = {}) {
      this.resetRem();
      this._layoutInfo.width = this.$el.clientWidth;
      this._layoutInfo.height = this.$el.clientHeight;
      for (let key in parmas) {
        this._layoutInfo[key] = parmas[key];
      }
      bus.$emit('layout-resize', this._layoutInfo);
    },
    resetRem() {
      const bodyWidth = document.body.clientWidth;
      const width = Math.max(this.minWidth, bodyWidth);
      this._html.style.fontSize = (width * 100) / this.size.width + 'px';
    }
  }
};
</script>

<style scoped >

.dss-layout {
  position: relative;

}

</style>
