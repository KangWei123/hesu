<template>
  <!-- 判断有门店id，则展示原本的模块页面内容 -->
  <div v-if="(!!curStore && !!curStore.id) || !checkStore">
    <slot></slot>
  </div>

  <!-- 无门店id，则提示选择门店 -->
  <div class="switch-store-tip" v-else>
    <img class="avatar" :src="SelectStoreIcon" />
    <div class="tip__main">需选择{{ env.BUSINESS_CENTER ? '项目' : storeLabel }}后，才能进行操作</div>
    <div class="tip__sub">点击侧导航左上角，可切换到具体{{ env.BUSINESS_CENTER ? '项目' : storeLabel }}</div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import SelectStoreIcon from './select-store-tip.png';

  export default {
    name: 'SwitchStoreTip',
    props: {
      storeLabel: {
        type: String,
        default: '门店',
      },
      checkStore: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      ...mapState({
        curStore: 'curStore',
        env: 'env',
      }),
    },
    data() {
      return {
        SelectStoreIcon,
      };
    },
  };
</script>

<style lang="less" scoped>
  @import '@/dss-common/style/wkt-constants.less';
  @contentHeight: 58px;
  @contentMargin: 20px;
  @footerHeight: 44px;

  .switch-store-tip {
    min-height: calc(100vh - @header-height - @contentHeight - @contentMargin - @footerHeight);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fff;

    .tip__main {
      font-size: 12px;
      color: #8b9db3;
      line-height: 17px;
      margin: 8px 0 12px;
    }

    .tip__sub {
      font-size: 12px;
      color: #3793ff;
      line-height: 17px;
      position: relative;

      &::before {
        content: '';
        width: 4px;
        height: 4px;
        background: #3793ff;
        border-radius: 4px;
        position: absolute;
        left: -10px;
        top: 6px;
      }
    }

    img {
      width: 361px;
      height: 246px;
    }
  }
</style>
