<template>
  <div class="com-header">
    <span class="com-header-title">
      {{ name }}
      <el-tooltip
        v-if="showToolTip"
        class="item hover-pointer"
        effect="dark"
        :content="toolTipContent"
        placement="top-start"
      >
        <i class="question">?</i>
      </el-tooltip>
    </span>
    <span class="com-column" v-if="isManager">
      <el-checkbox v-model="dataSource.isLock">锁定本组件，门店引用本页面时不可更改。</el-checkbox>
    </span>
  </div>
</template>

<script>
  import './css/common.less';
  import { mapState } from 'vuex';

  export default {
    name: 'EditHeader',
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
      name: {
        type: String,
        default: '',
      },
      showToolTip: {
        type: Boolean,
        default: false,
      },
      toolTipContent: {
        type: String,
        default: '',
      },
    },
    data() {
      return {};
    },
    computed: {
      ...mapState({
        roleList: 'roleList',
      }),
      // 管理员
      isManager() {
        return !!~this.roleList.split(',').indexOf('common_role_enterprise');
      },
    },
  };
</script>

<style lang="less" scoped>
  .com-header {
    margin-top: 5px;
    border-bottom: none;

    .com-header-title {
      padding-left: 16px;
      position: relative;
    }

    .com-header-title::before {
      content: '';
      width: 4px;
      height: 16px;
      background: #ff8341;
      position: absolute;
      top: 4px;
      left: 0;
    }

    span {
      font-weight: 500;
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Medium;
      color: #303133;
    }
  }

  .question {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    text-align: center;
    line-height: 14px;
    font-size: 12px;
    color: #909399;
    display: inline-block;
    vertical-align: middle;
    font-style: normal;
    background-color: #eaedf5;
    font-family: PingFangSC-Regular;
    position: relative;
    top: -2px;
  }
</style>
