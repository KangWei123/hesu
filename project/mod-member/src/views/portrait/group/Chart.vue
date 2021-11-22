<template>
  <div
    class="dmp_echart_item portrait_group_chart"
    :class="{ 'full-screen': isFullScreen }"
    @keyup.esc="closeFullscreen"
  >
    <i v-show="isFullScreen" class="el-icon-close close" @click="closeFullscreen"></i>
    <el-tooltip class="item" effect="light" content="查看指标数据详情" placement="top">
      <i class="fa fa-list-alt detail_info" @click="viewDetailInfo"></i>
    </el-tooltip>
    <el-tooltip class="item" effect="light" content="全屏切换" placement="top">
      <i class="fa fa-expand fullscreen" @click="toggleFullscreen"></i>
    </el-tooltip>
    <div class="dmp_echart_title">
      <span class="dh_slh w_70">[ {{ title }} ] </span>
    </div>
    <div
      v-show="hasData"
      class="dmp_echart_content population-con"
      ref="chart"
      :style="{ height: height, width: width }"
    ></div>

    <div v-if="!hasData" class="echars-tip dmp_echart_empty hide">没有查询到数据!</div>
    <p class="hint" v-if="isFullScreen">按ESC键退出全屏</p>
  </div>
</template>

<script>
  import echarts from 'echarts';

  function fireResize() {
    if (typeof Event === 'function') {
      const evt = new Event('resize');
      if (window.dispatchEvent) {
        window.dispatchEvent(evt);
      } else {
        window.fireEvent(evt);
      }
    } else {
      const resizeEvent = window.document.createEvent('UIEvents');
      resizeEvent.initUIEvent('resize', true, false, window, 0);
      if (window.dispatchEvent) {
        window.dispatchEvent(resizeEvent);
      } else {
        window.fireEvent(resizeEvent);
      }
    }
  }

  export default {
    name: 'Chart',
    props: {
      options: null,
      height: {
        type: String,
        default: '100%',
      },
      width: {
        type: String,
        default: '100%',
      },
      svg: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        isFullScreen: false,
      };
    },
    computed: {
      hasData() {
        if (this.options && this.options.series) {
          return true;
        }
        return false;
      },
    },
    watch: {
      options: {
        deep: true,
        handler() {
          this.render();
        },
      },
      isFullScreen(val) {
        const type = val ? 'hidden' : '';
        setTimeout(() => {
          document.body.style.overflow = type;
        }, 200);
      },
    },
    methods: {
      render() {
        if (this.chart && this.options) {
          this.chart.setOption(this.options);
        }
      },
      resize() {
        this.chart && this.chart.resize();
      },
      closeFullscreen() {
        this.isFullScreen = false;
        setTimeout(() => {
          fireResize();
        }, 100);
      },
      toggleFullscreen() {
        this.isFullScreen = !this.isFullScreen;
        setTimeout(() => {
          fireResize();
        }, 300);
      },
      viewDetailInfo() {
        this.$emit('view-data');
      },
    },
    mounted() {
      this.chart = echarts.init(this.$refs.chart, null, {
        renderer: this.svg ? 'svg' : 'canvas',
      });
      this.render();
      window.addEventListener('resize', this.resize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize);
      const bodyStyle = document.body.style;
      if (bodyStyle.overflow === 'hidden') {
        bodyStyle.overflow = '';
      }
    },
  };
</script>

<style lang="less" scoped>
  .full-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 99.9%;
    background: #fff;
    z-index: 1;
    transition: all 0.2s;
    box-sizing: border-box;

    .close {
      font-size: 30px;
      position: absolute;
      right: 10px;
      top: 54px;
      color: #333333;
      cursor: pointer;
    }

    .hint {
      font-size: 18px;
      color: red;
      text-align: center;
      position: relative;
      bottom: 20px;
    }

    .dmp_echart_content {
      height: calc(100% - 58px) !important;
    }
  }
</style>
