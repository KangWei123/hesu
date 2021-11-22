<template>
  <div class="passenger-tab-container">
    <el-tabs v-model="currentTab" class="passenger-tab">
      <el-tab-pane label="客流量" :name="TAB_ENUM.passengerNum"></el-tab-pane>
      <el-tab-pane label="客户量" :name="TAB_ENUM.customerNum"></el-tab-pane>
      <el-tab-pane label="新客户量" :name="TAB_ENUM.newCustomerNum"></el-tab-pane>
      <el-tab-pane label="老客户量" :name="TAB_ENUM.oldCustomerNum"></el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
  /** 类型枚举 */
  const TAB_ENUM = {
    passengerNum: 'passengerNum',
    customerNum: 'customerNum',
    newCustomerNum: 'newCustomerNum',
    oldCustomerNum: 'oldCustomerNum'
  };

  export default {
    name: 'PassengerTab',
    model: {
      prop: 'currentTab'
    },

    data() {
      return {
        TAB_ENUM,
        currentTab: TAB_ENUM.passengerNum
      };
    },

    watch: {
      currentTab(newVal, oldVal) {
        this.$emit('input', newVal);
      }
    }
  };
</script>

<style lang="less">
  .passenger-tab-container {
    display: flex;
    justify-content: center;
    .passenger-tab {
      display: inline-block;

      .el-tabs__content {
        flex: 1;
        width: 100%;

        .el-tab-pane {
          height: 100%;
        }
      }

      .el-tabs__nav-wrap::after {
        background: none;
      }
    }
  }
</style>
