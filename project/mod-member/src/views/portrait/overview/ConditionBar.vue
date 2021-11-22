<template>
  <div class="portrait-condition" :class="isFixed ? 'portrait-condition-container-fixed' : ''">
    <div class="portrait-condition-wrapper">
      <div class="portrait-condition-text">
        <span :class="isBold ? 'bold' : ''" class="condition_title">{{ title }}</span>
      </div>
    </div>
    <div class="portrait-bar-list">
      <div class="action-bar" v-for="(cdn, index) in conditions" :key="index">
        <div v-if="cdn.type === 'symbol'" class="foperator" @click="onChangeSymbol(cdn)">
          <span class="foperator_show">{{ cdn.tag.name }}</span>
        </div>
        <template v-else-if="cdn.type === 'brackets'">
          <span class="title" :title="cdn.tag.name">{{ cdn.tag.name }}</span>
        </template>
        <template v-else>
          <span class="title" :title="cdn.tag.name">{{ cdn.tag.name }}：</span>
          <span class="value" :title="cdn.strValue">{{ cdn.strValue }}</span>
        </template>
      </div>
    </div>
    <!--<div class="portrait-condition-btns">-->
    <!--<button class="cbutton modify primary" @click="modify($event, 1)">-->
    <!--{{primaryBtnText}}-->
    <!--</button>-->
    <!--<button v-if="showBackBtn" class="cbutton clear-btn light" @click="toHistory">返回</button>-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    props: {
      conditions: {
        type: Array,
        default() {
          return [];
        },
      },
      title: {
        type: String,
        default: '已选条件',
      },
      titleText: {
        type: String,
      },
      primaryBtnText: {
        type: String,
        default: '增加条件',
      },
      showBackBtn: {
        type: Boolean,
        default: true,
      },
      isBold: {
        type: Boolean,
        default: false,
      },
      // 是否固定在底部
      isFixed: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      modify() {
        this.$emit('modify');
      },
      toHistory() {
        this.$emit('toHistory');
      },
    },
  };
</script>

<style lang="less" scoped>
  .portrait-condition-container-fixed {
    position: fixed;
    bottom: 0;
    background: #f5f7fa;
  }
  .portrait-condition-wrapper {
    font-size: 20px;
  }

  .portrait-bar-list {
    margin-left: 10px;
  }
  .portrait-condition-text {
    margin-bottom: 10px;
  }
  .action-bar {
    font-size: 14px;
    color: #256eff;
    margin: 0 0 0 10px;
    padding: 0 10px;
    background: #cfdcf1;
    border-radius: 10px;
    .foperator {
      font-size: 14px;
      color: #333333 !important;
    }
    .title {
      background: #cedfff;
      color: #256eff;
    }
    .value {
      background: #cedfff;
      color: #256eff;
    }
  }
</style>
