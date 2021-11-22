<template>
  <div class="hot-area-container" @select.prevent>
    <div
      @mousedown="onCanvasMouseDown"
      @mousemove="onCanvasMouseMove"
      @mouseup="onCanvasMouseUp"
      class="canvas"
      :style="canvasStyle"
    >
      <div
        class="drag"
        v-for="(item, index) in HotAreaData"
        @click="onPickArea(index)"
        :key="item.id"
        :style="{
          width: item.shape.width + 'px',
          height: item.shape.height + 'px',
          top: item.shape.top + 'px',
          left: item.shape.left + 'px'
        }"
        :class="index === picked ? 'active' : ''"
      >
        <span class="layer-tip" :class="item.selected ? '' : 'hide'"> {{ item.name || '双击设置' }}</span>
        <span class="layer-close" @click="onDeleteArea(index)" :class="item.selected ? '' : 'hide'"></span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  HotAreaData,
  addHotArea,
  updateLastHotAreaLayout,
  tryToMarkLastHotAreaComplete,
  removeTheHotArea
} from './config';

const config = {
  drawing: false,
  newProps: {}
};
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    maxWidth: {
      type: Number,
      default: 325
    }
  },
  computed: {
    canvasStyle: function() {
      if (!this.canvasWidth || !this.canvasHeight) return {};
      const rate = this.canvasWidth / this.canvasHeight;
      const realWidth = this.canvasWidth > this.maxWidth ? this.maxWidth : this.canvasWidth;
      const realHeight = realWidth / rate;
      return {
        width: realWidth + 'px',
        height: realHeight + 'px',
        'background-image': 'url(' + this.src + ')',
        'background-size': '100% 100%'
      };
    }
  },
  data() {
    return {
      HotAreaData,
      picked: -1,
      canvasWidth: 0,
      canvasHeight: 0
    };
  },
  watch: {
    src(newSrc, oldSrc) {
      newSrc !== oldSrc && this.initBackground();
    }
  },
  mounted() {
    this.initBackground();
  },
  methods: {
    invokePickRow(index) {
      this.picked = index;
    },
    initBackground() {
      const self = this;
      const img = new Image();
      img.src = this.src;
      img.onload = function() {
        self.canvasWidth = this.width;
        self.canvasHeight = this.height;
        console.log('this.width == ', this.width, 'this.height==', this.height);
        self.$emit('imgLoaded', {
          width: this.width,
          height: this.height
        });
      };
    },
    onPickArea(index) {
      this.picked = index;
      this.$emit('picked', index);
    },
    onDeleteArea(index) {
      removeTheHotArea(index);
      this.change();
    },
    change() {
      this.$emit('change');
    },
    onCanvasMouseDown(e) {
      const { offsetX, offsetY, screenX, screenY } = e;
      if (!config.drawing) {
        config.drawing = true;
        config.newProps = {
          screenX,
          screenY,
          offsetX,
          offsetY,
          left: offsetX,
          top: offsetY,
          width: 0,
          height: 0
        };
        addHotArea(config.newProps);
      }
    },
    onCanvasMouseMove(e) {
      if (!config.drawing) return;
      const { screenX, screenY } = e;
      const props = config.newProps;
      const width = screenX - props.screenX;
      const height = screenY - props.screenY;
      const absWidth = Math.abs(width);
      const absHeight = Math.abs(height);
      props.left = props.offsetX - (width >= 0 ? 0 : absWidth);
      props.top = props.offsetY - (height >= 0 ? 0 : absHeight);
      props.width = absWidth;
      props.height = absHeight;
      updateLastHotAreaLayout(props);
    },
    onCanvasMouseUp() {
      if (config.drawing) {
        const props = config.newProps;
        config.drawing = false;
        config.newProps = {};
        if (tryToMarkLastHotAreaComplete(props)) {
          this.onPickArea(HotAreaData.length - 1);
          this.change();
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.hot-area-container {
  border: 1px dashed #979797;
  position: relative;

  .canvas {
    cursor: crosshair;
    overflow: hidden;
  }

  .drag {
    position: absolute;
    border: 1px solid #0092fd;
    background-color: rgba(59, 212, 252, 0.5);
    opacity: 0.5;
    cursor: pointer;
    z-index: 1;
  }

  .drag .hide {
    display: none;
  }

  .active {
    z-index: 200;
    background-color: rgba(59, 212, 252, 1);
  }

  .layer-tip {
    position: relative;
    width: 100%;
    display: inline-block;
    font-size: 12px;
    color: #000;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    z-index: -1;
  }

  .layer-close {
    background: url(./close.png) no-repeat;
    width: 24px;
    height: 23px;
    cursor: pointer;
    position: absolute;
    top: -10px;
    right: -8px;
    z-index: 2;
  }
}
</style>
