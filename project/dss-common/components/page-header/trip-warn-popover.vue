<template>
  <el-popover
    placement="bottom"
    width="280"
    v-show="showTip"
    popper-class="warn-popover"
    class="trip-warn-popover"
    @show="popoverShow = true"
    @hide="popoverShow = false"
    trigger="click"
  >
    <div>
      <div class="warn-list">
        <div class="warn-label">预警消息</div>
        <div
          class="warn-item"
          :class="tripWarnList.length - 1 === index ? 'clear-border' : ''"
          v-for="(item, index) in tripWarnList"
          :key="index"
        >
          <div class="warn-content">{{ item.warnDesc }}</div>
          <div class="warn-time">{{ item.createTime | time }}</div>
        </div>
      </div>
      <div class="bottom-opt-box" @click="gotoTripPage">
        <span>查看全部</span>
        <i class="more el-icon-arrow-right"></i>
      </div>
    </div>
    <i class="warn-tip" :class="popoverShow ? 'show' : ''" slot="reference">
      <span class="red-dot"></span>
    </i>
  </el-popover>
</template>

<script>
  import tripWarnApi from '@/dss-common/api/tripWarnApi';

  export default {
    name: 'TripWarnPopover',
    data() {
      return {
        popoverShow: false,
        tripWarnList: [],
      };
    },
    computed: {
      showTip() {
        return !!this.tripWarnList.length;
      },
    },
    mounted() {
      this.getTripWarnList();
    },
    methods: {
      getTripWarnList() {
        tripWarnApi
          .getTripWarnList({
            pageNo: 1,
            pageSize: 6,
          })
          .then(res => {
            this.tripWarnList = res.data || [];
          });
      },
      gotoTripPage() {
        window.location.href = '/dsp.html#/autoMarketing/group';
      },
    },
  };
</script>

<style lang="less">
  .trip-warn-popover {
    vertical-align: top !important;
    margin-left: 34px;
    display: inline-block;
    box-sizing: border-box;
    padding-top: 12px;
    .warn-tip {
      position: relative;
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url('../../img/tip.png') no-repeat;
      background-size: 100%;
      outline: none;
      cursor: pointer;
      &.show {
        background: url('../../img/active-tip.png') no-repeat;
        background-size: 100%;
      }
      .red-dot {
        position: absolute;
        width: 6px;
        height: 6px;
        opacity: 1;
        background: #f5222d;
        border-radius: 3px;
        top: 0;
        right: 0;
      }
    }
  }

  .warn-popover {
    &.el-popover {
      padding: 0;
    }
    .bottom-opt-box {
      height: 40px;
      border-top: 1px solid #f0f0f0;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #fa7516;
      line-height: 40px;
      cursor: pointer;
    }

    .warn-label {
      height: 37px;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #303133;
      line-height: 37px;
      padding-left: 16px;
    }

    .warn-list {
      max-height: 297px;
      overflow-y: auto;
    }

    .warn-item {
      box-sizing: border-box;
      margin: 0 17px;
      border-bottom: 1px solid #f0f0f0;
    }
    .clear-border {
      border-bottom: none;
    }
    .warn-content {
      opacity: 1;
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #303133;
      line-height: 18px;
      margin-top: 16px;
    }
    .warn-time {
      opacity: 1;
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #b1b5bd;
      line-height: 18px;
      margin-top: 8px;
      margin-bottom: 16px;
    }
  }
</style>
