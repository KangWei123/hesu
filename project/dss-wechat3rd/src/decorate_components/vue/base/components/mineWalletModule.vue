<template>
  <div
    class="mine-wallet-module"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
      background: dataSource.backgroundColor || 'white',
    }"
  >
    <div class="info" :style="style">
      <el-row type="flex" justify="center" style="position: relative">
        <el-col :span="6" class="info-item" v-if="showInfoItem('charge')">
          <div class="info-item-num" :style="style">￥100<span class="txt-small">.00</span></div>
          <div class="info-item-text">余额</div>
        </el-col>
        <el-col :span="6" class="info-item" v-if="showInfoItem('integral')">
          <div class="info-item-num" :style="style">9981</div>
          <div class="info-item-text">积分</div>
        </el-col>
        <el-col :span="6" class="info-item" v-if="showInfoItem('coupon')">
          <div class="info-item-num" :style="style">800</div>
          <div class="info-item-text">优惠券</div>
        </el-col>
        <el-col :span="6" class="info-item" v-if="showInfoItem('giftCard')">
          <div class="info-item-num" :style="style">4</div>
          <div class="info-item-text">礼品卡</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import cdnResConfig from '@/business-common/utils/cdnResConfig';

  export default {
    props: {
      dataSource: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        cdnResConfig,
      };
    },
    methods: {},
    computed: {
      style() {
        return this.dataSource.textMode === 'custom'
          ? { color: this.dataSource.textColor || this.dataSource.defaultTextColor }
          : {};
      },
      showInfoItem() {
        return itemType => {
          return this.dataSource.checkedItems.indexOf(itemType) !== -1;
        };
      },
      itemName() {
        return itemType => {
          const orderItemName = this.dataSource.orderItemName;
          return orderItemName ? orderItemName[itemType] : null;
        };
      },
    },
  };
</script>

<style lang="less">
  .mine-wallet-module {
    background: white;
    .info {
      width: 100%;
      height: 80px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #7e859f;
      line-height: 17px;
      padding: 10px;
    }

    .info-item {
      margin-top: 10px;
      display: inline-block;
      height: 50px;
      flex: 1;
      text-align: center;
    }
    .info-item-num {
      font-size: 15px;
      font-family: DINPro, DINPro-Medium;
      font-weight: 500;
      color: #27292f;
      line-height: 20px;
      padding-bottom: 4px;
    }
    .txt-small {
      font-size: 13px;
    }
  }
</style>
