<template>
  <div class="select-container">
    <div class="select-header">
      <slot name="tag"></slot> {{ label }} <span class="select-btn" @click="handleShowSelector">选择会员</span>
    </div>
    <div class="content" v-if="selectedItem.id">
      <div class="content-item">
        <span class="label">会员姓名：</span>
        <span>{{ selectedItem.realname || selectedItem.nickname || selectedItem.wxNickname }}</span>
      </div>
      <div class="content-item">
        <span class="label">会员一账通ID：</span>
        <span>{{ selectedItem.uniqueAccountId }}</span>
      </div>
      <div class="content-item">
        <span class="label">会员手机号：</span>
        <span>{{ selectedItem.phone }}</span>
      </div>
      <div class="content-item">
        <span class="label">渠道名称：</span>
        <div>{{ selectedItem.channelName }}</div>
      </div>
    </div>
    <select-dialog ref="dialog" @selected="handleSelected" :check-function="checkFunction" />
  </div>
</template>

<script>
  import SelectDialog from './select-dialog.vue';

  export default {
    name: 'MemberSelect',
    components: {
      SelectDialog,
    },
    props: {
      label: {
        type: String,
        default: '',
      },
      checkFunction: {
        type: Function,
        default() {
          return true;
        },
      },
      member: {
        type: Object,
        default() {
          return {};
        },
      },
      extParams: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        selectedItem: {},
      };
    },
    watch: {
      member() {
        this.selectedItem = this.member;
      },
    },
    methods: {
      handleShowSelector() {
        this.$refs.dialog.show();
      },
      handleSelected([member]) {
        this.selectedItem = member;
        this.$emit('selected', this.extParams, member);
      },
    },
  };
</script>

<style lang="less" scoped>
  .select-container {
    min-width: 350px;
    .select-header {
      display: flex;
      align-items: center;
    }
    .select-btn {
      color: #1890ff;
      cursor: pointer;
    }
    .content {
      border: 1px solid #eff4fa;
      border-radius: 3px;
    }
    .content-item {
      display: flex;
      .label {
        min-width: 110px;
        text-align: right;
        margin-right: 80px;
      }
    }
  }
</style>
