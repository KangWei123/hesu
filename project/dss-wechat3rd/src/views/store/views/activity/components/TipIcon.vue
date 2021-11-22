<template>
  <el-popover :title="title" trigger="hover" :placement="placement" v-if="tip">
    <i class="key-icon icon-tip" slot="reference"></i>
    <div class="tip-icon-content">
      <p v-for="(item, index) in tip.content" :key="index">
        <span class="title">{{ item.title }}：</span>
        <span class="content">{{ item.text }}</span>
      </p>
    </div>
  </el-popover>
</template>

<script>
  import utils from '@/dss-common/utils';

  export default {
    props: {
      title: {
        type: String,
        default: '指标说明'
      },
      // 指标说明
      name: {
        type: String
      },
      // 指标位置
      placement: {
        type: String,
        default: 'right-start'
      }
    },
    computed: {
      tip() {
        if (!this.name) {
          return;
        }
        if (!this.$store.state.tips) {
          return;
        }

        let value = this.$store.state.tips.find(item => item.name === this.name);
        if (!value) {
          return;
        }

        let tip = utils.plain(value);
        tip.content = JSON.parse(value.content);

        return tip;
      }
    }
  };
</script>

<style lang="less" scoped>
  .key-icon.icon-tip {
    display: inline-block;
    vertical-align: middle;
    top: -1px;
    margin-left: 8px;
    width: 18px;
    height: 18px;
    background-image: url('../../../../../../../dss-common/img/icons/tip.png');
    cursor: pointer;
  }

  // 弹出框在body下面
  .tip-icon-content {
    p {
      margin-top: 5px;
      margin-bottom: 5px;
    }

    .title {
      display: inline-block;
      text-align: right;
    }
  }
</style>
