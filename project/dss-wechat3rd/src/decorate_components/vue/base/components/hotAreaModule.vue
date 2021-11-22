<template>
  <div class="hot-area-module">
    <div class="hot-area-module-container" :style="hotBgStyle" v-if="hotBgStyle">
      <div class="view-drag" v-for="item in viewData" :key="item.id" :style="item.style">
        <!--<span class="layer-tip">{{item.name}}</span>-->
      </div>
    </div>
    <div v-else class="no-data">
      <div>点击编辑图片热区</div>
    </div>
  </div>
</template>
<script>
  import ImageFilter from './image-filter';
  export default {
    props: {
      dataSource: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        isShow: true,
        inv: 2000,
      };
    },
    computed: {
      viewData() {
        const { data, width, marginLeftRight, EditAreaMaxWidth } = this.dataSource;
        if (!data || !data.length) return [];
        const viewData = [];
        const ableMaxWidth = 375 - marginLeftRight * 2;
        const canvasWidth = Math.min(width, ableMaxWidth);
        const scale = canvasWidth / EditAreaMaxWidth;
        data.forEach(item => {
          const style = `
          width:${scale * item.shape.width}px;
          height:${scale * item.shape.height}px;
          line-height:${scale * item.shape.height}px;
          top:${scale * item.shape.top}px;
          left:${scale * item.shape.left}px;
          `;
          viewData.push({ style, name: item.name, id: item.id });
        });
        return viewData;
      },
      hotBgStyle() {
        const { marginLeftRight, radius, marginUp, marginDown, width, height, src } = this.dataSource;
        const canShow = !!src && !!width && height;
        if (!canShow) return false;
        const rate = width / height;
        const ableMaxWidth = 375 - marginLeftRight * 2;
        const canvasWidth = Math.min(width, ableMaxWidth);
        const canvasHeight = canvasWidth / rate;
        return {
          borderRadius: radius + 'px',
          margin: marginUp + 'px ' + marginLeftRight + 'px ' + marginDown + 'px',
          width: canvasWidth + 'px',
          height: canvasHeight + 'px',
          backgroundImage: 'url(' + ImageFilter(src) + ')',
          backgroundSize: '100% 100%',
        };
      },
    },
  };
</script>
<style lang="less">
  .hot-area-module {
    .hot-area-module-container {
      overflow: hidden;
      position: relative;
      box-sizing: border-box;
      height: auto;
      .view-drag {
        position: absolute;
        background-color: rgba(59, 212, 252, 0.5);
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
      }
    }
    .no-data {
      width: 100%;
      height: 188px;
      background-color: #f1f4f9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #303133;
    }
  }
</style>
