<template>
  <div class="mine-info-module">
    <div class="header" :style="itemStyle()">
      {{ dataSource.name }}
    </div>
    <!-- <div
      class="info"
      :style="{
        color: dataSource.textMode === 'default' ? dataSource.defaultTextColor : dataSource.textColor,
      }"
    >
      <img
        class="bg-img"
        :src="dataSource.bgMode === 'default' ? dataSource.defaultBgUrl : dataSource.bgUrl || dataSource.defaultBgUrl"
      />
      <div class="left-horizon-user-info" v-if="dataSource.avatarDisplay === 'left'">
        <img class="left-avatar" :src="defaultAvatar" />
        <span class="left-name" :style="{ top: dataSource.showLevel ? '18px' : '28px' }">KALY</span>
        <span class="left-level" v-if="dataSource.showLevel">白银会员</span>
      </div>
      <div class="right-horizon-user-info" v-if="dataSource.avatarDisplay === 'right'">
        <img class="right-avatar" :src="defaultAvatar" />
        <span class="right-name" :style="{ top: dataSource.showLevel ? '18px' : '28px' }">KALY</span>
        <span class="right-level" v-if="dataSource.showLevel">白银会员</span>
      </div>
      <div class="vertical-user-info" v-if="dataSource.avatarDisplay === 'center'">
        <img class="avatar" :src="defaultAvatar" />
        <div class="name">KALY{{ dataSource.showLevel ? ' 白银会员' : '' }}</div>
      </div>
      <el-row type="flex" justify="space-between" style="position: relative">
        <el-col :span="6" class="info-item" v-if="showInfoItem('charge')">
          <div class="info-item-text">1000</div>
          <div class="info-item-text">余额·充值</div>
        </el-col>
        <el-col :span="6" class="info-item" v-if="showInfoItem('integral')">
          <div class="info-item-text">200</div>
          <div class="info-item-text">积分商城</div>
        </el-col>
        <el-col :span="6" class="info-item" v-if="showInfoItem('giftCard')">
          <div class="info-item-text">2</div>
          <div class="info-item-text">礼品卡</div>
        </el-col>
        <el-col :span="6" class="info-item" v-if="showInfoItem('coupon')">
          <div class="info-item-text">4</div>
          <div class="info-item-text">优惠券</div>
        </el-col>
      </el-row>
    </div> -->
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
        defaultAvatar: cdnResConfig.mine.defaultAvatar,
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
  .mine-info-module {
    .header {
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
    .info {
      width: 100%;
      height: 150px;
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;
      .bg-img {
        position: absolute;
        width: 375px;
        height: 150px;
      }
    }
    .left-horizon-user-info {
      position: relative;
      margin-left: 15px;
      padding-top: 15px;
      margin-bottom: 10px;
      height: 45px;
      .left-avatar {
        width: 45px;
        height: 45px;
        border-radius: 50%;
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
      margin-bottom: 10px;
      .right-avatar {
        position: absolute;
        right: 15px;
        top: 15px;
        width: 45px;
        height: 45px;
        border-radius: 50%;
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
      position: relative;
      padding-top: 15px;
      text-align: center;
      .avatar {
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }
      .name {
        text-align: center;
      }
    }

    .info-item {
      margin-top: 10px;
      display: inline-block;
      width: 24%;
      height: 50px;
      font-size: 0;
    }
    .info-item-text {
      font-size: 14px;
      text-align: center;
    }
  }
</style>
