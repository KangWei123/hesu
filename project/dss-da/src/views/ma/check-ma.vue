<template>
  <div class="wkb-empty-page-container">
    <div class="empty-page" v-if="!hasMa">
      <span>{{emptyTitle}}</span>
      <el-button type="text" @click="gotoBindMa">前去绑定</el-button>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'check-ma',
    props: {
      emptyTitle: {
        type: String,
        default: '尚未绑定小程序'
      },
      pageHeight: {
        type: String,
        default: 'calc(100vh - 60px)'
      }
    },
    computed: {
      ...mapState({
        wxAuthInfo: 'wxAuthInfo'
      }),
      hasMa() {
        return this.wxAuthInfo && this.wxAuthInfo.wxMaAppId;
      }
    },
    mounted() {
      this.$emit('checked', this.hasMa);
    },
    methods: {
      gotoBindMa() {
        window.top.location.href = '/wkb.html#/setting/wx/mp/version';
      }
    }
  };
</script>

<style lang="less">
  .wkb-empty-page-container {
    width: 100%;
    height: 100%;
    position: relative;

    .empty-page {
      width: 100%;
      text-align: center;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
