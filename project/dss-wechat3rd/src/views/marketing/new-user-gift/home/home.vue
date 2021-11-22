<template>
  <div class="gift-home">
    
    <div class="gift-home-top">
      <img class="cover"
          :src="coverSource" />
      <div class="gift-tips">
        <div class="tip-1"> 首次登陆小程序即赠送优惠券，获取用户好感，刺激用户消费。</div>
        <div class="tip-2"> 建议：在优惠券功能中创建几张优惠券，不放入领券中心，在此处调用。</div>
      </div>
      
    </div>
    <!-- <div class="gift-tips">
      <div class="tip-1"> 首次登陆小程序即赠送优惠券，获取用户好感，刺激用户消费。</div>
      <div class="tip-2"> 建议：在优惠券功能中创建几张优惠券，不放入领券中心，在此处调用。</div>
    </div>
    <img class="cover"
         :src="coverSource" /> -->
    <activity-table class="activity-container" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ActivityTable from '../component/activity-table.vue';
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
export default {
  mixins: [industryHelperMixin],
  components: {
    ActivityTable
  },

  data() {
    return {};
  },

  computed: {
    ...mapState({
      env: 'env'
    }),

    coverSource() {
      return this.mGetNewUserGiftImage();
    }
  }
};
</script>

<style lang="less">
@import '~@/dss-common/style/wkt-constants.less';
.gift-home {
  // padding: 20px;
  // position: relative;
  min-height: calc(100vh - 200px);

  .el-table {
    padding-top: 0px;
  }
  .gift-home-top {
    position: relative;
    padding: 24px 20px;
    margin-bottom: 10px;
    background: #fff;
  }

  .gift-tips {
    padding: 24px;
    width: 65%;
    background:#f5f7fa;
    // border: 1px solid @border-color;
    font-size: @small-font;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: @black-color;
    display: inline-block;
    position: absolute;
    left: 180px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    border-radius: 4px;
    margin-left: 24px;

    .tip-1 {
      color: @ui-font-color-black;
    }

    .tip-2 {
      margin-top: 8px;
      color: @ui-font-color-darkGrey;
    }
  }

  .activity-container {
    // max-width: 1170px;
    // margin-left: 330px;
  }

  .cover {
    // width: 300px;
    // height: 540px;
    width: 156px;
    height: 277px;
    // position: absolute;
    // left: 20px;
    // top: 120px;
  }
}
</style>
