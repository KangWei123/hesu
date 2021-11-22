<template>
  <div
    class="mine-vipcard-module"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
      color: dataSource.textMode === 'default' ? dataSource.defaultTextColor : dataSource.textColor,
      backgroundImage: `url(${
        dataSource.bgMode === 'default' ? dataSource.defaultBgUrl : dataSource.bgUrl || dataSource.defaultBgUrl
      })`,
    }"
  >
    <div class="left-horizon-user-info">
      <img class="left-avatar" :src="defaultAvatar" />
      <div class="left-content">
        <div class="left-name" :style="{ top: '28px' }">KALY</div>
        <div class="left-level"><img :src="vipIcon" /> 白银会员</div>
        <template v-if="dataSource.cardMode === '2'">
          <div class="growth-num">当前成长值：300</div>
          <div class="growth"><div class="growth-progress" /></div>
          <div class="growth-tip"><span>距离下一等级还需100成长值</span> <span>成长值明细 ></span></div>
        </template>
      </div>
      <div class="vip-code">会员码</div>
    </div>

    <el-row v-if="dataSource.cardMode === '2'" type="flex" justify="space-between" class="bottom line-bg">
      <el-col :span="6" class="info-item" v-if="showInfoItem('charge')">
        <div class="info-item-num">￥100<span class="txt-small">.00</span></div>
        <div class="info-item-text">余额</div>
      </el-col>
      <el-col :span="6" class="info-item" v-if="showInfoItem('integral')">
        <div class="info-item-num">9981</div>
        <div class="info-item-text">积分</div>
      </el-col>
      <el-col :span="6" class="info-item" v-if="showInfoItem('coupon')">
        <div class="info-item-num">800</div>
        <div class="info-item-text">优惠券</div>
      </el-col>
      <el-col :span="6" class="info-item" v-if="showInfoItem('giftCard')">
        <div class="info-item-num">4</div>
        <div class="info-item-text">礼品卡</div>
      </el-col>
    </el-row>
    <div v-else class="bottom">
      <div class="growth-num">当前成长值：300</div>
      <div class="growth"><div class="growth-progress" /></div>
      <div class="growth-tip"><span>距离下一等级还需100成长值</span> <span>成长值明细 ></span></div>
    </div>
  </div>
</template>
<script>
  import cdnResConfig from '@/business-common/utils/cdnResConfig';

  export default {
    components: {},
    props: {
      dataSource: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        defaultAvatar: cdnResConfig.mine.defaultAvatar,
        vipIcon: cdnResConfig.mine.vipIcon,
      };
    },
    methods: {
      itemStyle() {
        return {
          bgColor: this.dataSource.bgColor,
        };
      },
    },
    computed: {
      showInfoItem() {
        return itemType => {
          return this.dataSource.checkedItems.indexOf(itemType) !== -1;
        };
      },
    },
  };
</script>

<style lang="less">
  .mine-vipcard-module {
    height: 200px;
    font-size: 12px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 400;
    line-height: 20px;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    overflow: hidden;
    .bg-img {
      width: 100%;
      height: 100%;
    }
    .left-horizon-user-info {
      height: 100%;
      position: relative;
      padding: 30px;
      display: flex;
      .left-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: self-start;
      }
      .left-avatar {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .left-name {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 4px;
      }
      .left-level {
        background: #000;
        border-radius: 50px;
        padding: 2px 10px;
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        color: #fff;
        img {
          width: 12px;
          height: 12px;
          margin-right: 2px;
        }
      }

      .vip-code {
        position: absolute;
        right: 0;
        padding: 5px 17px;
        color: #fff;
        background: #ffb130;
        border-radius: 100px 0 0 100px;
        font-weight: 500;
      }
    }
    .growth-num {
      margin-bottom: 2px;
    }
    .growth {
      width: 100%;
      height: 4px;
      background: #fff;
      border-radius: 4px;
      margin-bottom: 2px;
      .growth-progress {
        width: 75%;
        height: 100%;
        border-radius: 4px;
        background-image: linear-gradient(to right, #ff7e3d, #ffcd71);
      }
    }
    .growth-tip {
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-family: PingFangSC, PingFangSC-Regular;
      margin-bottom: 2px;
    }
    .bottom {
      position: absolute;
      width: 100%;
      padding: 10px 30px;
      bottom: 0;
    }
    .line-bg {
      background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
    }
    .info-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 50px;
      flex: 1;
      text-align: center;
    }
    .info-item-num {
      font-size: 15px;
      font-family: DINPro, DINPro-Medium;
      font-weight: 500;
      line-height: 20px;
    }
    .txt-small {
      font-size: 13px;
    }
  }
</style>
