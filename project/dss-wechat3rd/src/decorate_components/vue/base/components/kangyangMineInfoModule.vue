<template>
  <div class="mine-kangyang-info-module">
    <div
      class="info"
      :style="{
        color: dataSource.textMode === 'default' ? dataSource.defaultTextColor : dataSource.textColor,
      }"
    >
      <img
        class="bg-img"
        :src="dataSource.bgMode === 'default' ? dataSource.defaultBgUrl : dataSource.bgUrl || dataSource.defaultBgUrl"
      />
      <div class="kangyang-user-info">
        <img class="avatar" :src="defaultAvatar" />
        <span class="name">惟客康养</span>
      </div>
      <div v-if="dataSource.showStatus" class="kangyang-status">已认证</div>
    </div>
  </div>
</template>

<script>
  import defaultAvatar from '@/dss-common/img/avatar-kangyang.png';

  export default {
    props: {
      dataSource: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        defaultAvatar,
      };
    },
    methods: {
      itemStyle() {
        return {
          bgColor: this.dataSource.bgColor,
        };
      },
    },
  };
</script>

<style lang="less">
  .mine-kangyang-info-module {
    margin-top: -30px;

    .info {
      position: relative;
      width: 100%;
      height: 177px;
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;
      display: flex;
      align-items: center;

      .bg-img {
        position: absolute;
        width: 100%;
        height: 100%;
      }
    }

    .kangyang-status {
      position: absolute;
      right: 0;
      bottom: 45px;
      font-size: 14px;
      background-color: white;
      color: #fd8301;
      line-height: 30px;
      padding: 0 15px 0 20px;
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
    }

    .kangyang-user-info {
      position: absolute;
      left: 36px;
      bottom: 31px;
      display: flex;
      align-items: center;
      justify-content: center;

      .avatar {
        width: 56px;
        height: 56px;
        border-radius: 50%;
      }

      .name {
        margin-left: 8px;
        font-size: 17px;
      }
    }
  }
</style>
