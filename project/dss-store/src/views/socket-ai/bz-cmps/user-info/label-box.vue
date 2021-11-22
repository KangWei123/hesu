<template>
  <div class="label-box">
    <div class="title">{{title}}</div>
    <div class="label-list">
      <p :style='labelStyle' v-for="(item, index) in labelList" :key="index">{{item}}</p>
      <span class="no-data" v-show="!labelList || !labelList.length">{{noDataTip}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    labelList: {
      type: Array,
      default() {
        return [];
      }
    },
    defaultTheme: {
      type: Boolean,
      default: true
    },
    isVip: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    labelStyle() {
      if (this.defaultTheme) {
        return {
          background: 'rgba(50,255,234,0.2)',
          color: '#32FFEA'
        };
      } else {
        return {
          background: 'rgba(255,155,50,0.2)',
          color: '#FF9B32'
        };
      }
    },
    noDataTip() {
      return this.isVip ? '暂无标签' : '用户未注册，暂无数据';
    }
  }
};
</script>

<style lang="less">
.label-box {
  width: 531px;
  height: 118px;
  display: flex;
  position: relative;
  overflow: hidden;
  .title {
    width: 30px;
    height: 118px;
    font-size: 18px;
    text-align: center;
    line-height: 30px;
    -webkit-writing-mode: vertical-rl;
    writing-mode: vertical-rl;
    color: rgba(255, 255, 255, 1);
    background-color: #214F67;
  }
  .label-list {
    flex: 1;
    font-size: 0;

    background: linear-gradient(90deg, rgba(29, 35, 71, 1) 0%, rgba(29, 70, 67, 1) 100%);
    p {
        height: 26px;
        display: inline-block;
        font-size: 18px;
        padding: 0 4px;
        border-radius:2px;
        line-height: 26px;
        margin: 10px 0 0 10px;
    }
  }
  .no-data {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 16px;
    transform: translate(-50%, -50%);
  }
}
</style>
