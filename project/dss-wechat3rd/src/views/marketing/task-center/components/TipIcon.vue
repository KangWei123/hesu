<template>
  <el-popover :placement="placement" :title="title" trigger="hover" width="400">
    <i class="icon-tip" slot="reference"></i>
    <div class="tip-icon-content">
      <p :key="index" v-for="(item, index) in content">
        <span class="title" v-show="title==true">{{ item.title }}：</span>
        <span class="content">{{ item.text }}</span>
      </p>
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '指标说明'
    },
    // 指标位置
    placement: {
      type: String,
      default: 'right-start'
    },
    // 提示内容
    content: {
      type: Array,
      required: true
    },
    // title显示
    flag: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="less" scoped>
.icon-tip {
  display: inline-block;
  vertical-align: middle;
  top: -1px;
  margin-left: 8px;
  width: 18px;
  height: 18px;
  background-image: url('../../../../images/question-mark.png');
  // background-image: url('@/dss-wechat3rd/src/images/question-mark.png');
  cursor: pointer;
}
.tip-icon-content {
  p {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .title {
    display: inline-block;
    text-align: right;
    font-weight: bolder;
  }
}
</style>
