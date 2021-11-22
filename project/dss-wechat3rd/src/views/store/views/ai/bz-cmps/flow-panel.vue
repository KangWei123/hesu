<template>
  <div class="flow-panel">
    <div class="title">
      {{ data.description }}
    </div>
    <div class="number flow-num">
      {{ data.passengerFlowCount }}
    </div>
    <div>
      <span class="label">会员次数：</span>
      <span class="number vip-num">{{ data.vipCount }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
</script>

<style scoped lang="less">
.flow-panel {
  border-radius: 4px;

  .title {
    color: rgba(50, 255, 234, 1);
    font-size: 24px;
    font-family: 'PingFangSC-Regular';
  }

  .label {
    color: #fff;
    font-size: 24px;
  }

  .flow-num {
    color: rgba(50, 255, 234, 1);
    font-size: 60px;
    line-height: 55px;
  }

  .vip-num {
    font-size: 40px;
    line-height: 37px;
    color: rgba(255, 255, 255, 1);
  }
}
</style>
