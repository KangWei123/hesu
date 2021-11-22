<template>
  <div
    class="mine-order-module"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
    }"
  >
    <div class="info">
      <el-row type="flex" justify="space-between" style="position: relative">
        <el-col :span="5" class="info-item" v-if="showInfoItem('wait_pay')">
          <img class="order-icon" :src="cdnResConfig.mine.waitPay" />
          <div class="info-item-text">{{ itemName('wait_pay') || '待付款' }}</div>
        </el-col>
        <el-col :span="5" class="info-item" v-if="showInfoItem('estate_wait_pay')">
          <img class="order-icon" :src="cdnResConfig.mine.waitPay" />
          <div class="info-item-text">{{ itemName('estate_wait_pay') || '待认筹' }}</div>
        </el-col>
        <el-col :span="5" class="info-item" v-if="showInfoItem('wait_shipping')">
          <img class="order-icon" :src="cdnResConfig.mine.waitShipping" />
          <div class="info-item-text">{{ itemName('wait_shipping') || '待发货' }}</div>
        </el-col>
        <el-col :span="5" class="info-item" v-if="showInfoItem('wait_off')">
          <img class="order-icon" :src="cdnResConfig.mine.waitShipping" />
          <div class="info-item-text">{{ itemName('wait_off') || '待核销' }}</div>
        </el-col>
        <el-col :span="5" class="info-item" v-if="showInfoItem('wait_receive')">
          <img class="order-icon" :src="cdnResConfig.mine.waitReceive" />
          <div class="info-item-text">{{ itemName('wait_receive') || '待收货' }}</div>
        </el-col>
        <el-col :span="5" class="info-item" v-if="showInfoItem('after_sale')">
          <img class="order-icon" :src="cdnResConfig.mine.afterSale" />
          <div class="info-item-text">{{ itemName('after_sale') || '售后' }}</div>
        </el-col>
        <el-col :span="5" class="info-item" v-if="showInfoItem('done')">
          <img class="order-icon" :src="cdnResConfig.mine.afterSale" />
          <div class="info-item-text">{{ itemName('done') || '已完成' }}</div>
        </el-col>
        <el-col :span="5" class="info-item" v-if="showInfoItem('all')">
          <img class="order-icon" :src="cdnResConfig.mine.allOrder" />
          <div class="info-item-text">{{ itemName('all') || '全部订单' }}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import cdnResConfig from '@/business-common/utils/cdnResConfig.js';
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
  .mine-order-module {
    background: white;
    .info {
      width: 100%;
      height: 80px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(136, 147, 166, 1);
      line-height: 16px;
      padding: 10px;
    }
    .left-horizon-user-info {
      position: relative;
      margin-left: 15px;
      padding-top: 15px;
      height: 45px;
      .left-avatar {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: black;
      }

      .left-name {
        position: absolute;
        top: 18px;
        left: 55px;
      }

      .left-level {
        position: absolute;
        top: 40px;
        left: 55px;
      }
    }

    .right-horizon-user-info {
      position: relative;
      padding-top: 15px;
      height: 45px;
      .right-avatar {
        position: absolute;
        right: 15px;
        top: 15px;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: black;
      }

      .right-name {
        position: absolute;
        top: 18px;
        left: 15px;
      }

      .right-level {
        position: absolute;
        top: 40px;
        left: 15px;
      }
    }

    .vertical-user-info {
      padding-top: 15px;
      text-align: center;
      .avatar {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: black;
      }
      .name {
        text-align: center;
      }
    }

    .info-item {
      display: inline-block;
      font-size: 0;
      text-align: center;
      margin-top: 3px;
    }
    .order-icon {
      width: 28px;
      height: 28px;
    }
    .info-item-text {
      font-size: 14px;
      text-align: center;
    }
  }
</style>
