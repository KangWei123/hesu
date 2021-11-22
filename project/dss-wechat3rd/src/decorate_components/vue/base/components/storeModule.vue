<template>
  <div>
    <div
      class="store-module"
      :style="{
        margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
        borderRadius: dataSource.radius + 'px',
      }"
    >
      <div
        class="store-img"
        :style="wkLogo ? 'background: transparent url(' + wkLogo + ') no-repeat center center / 100% 100%;' : ''"
      ></div>
      <div class="clickStore">
        <div class="store-name" style="width: auto">{{ curStore && curStore.name }}</div>
        <div class="address">{{ curStore && curStore.address }}</div>
      </div>
      <div class="right">
        <div class="right-icon"></div>
        <div class="right-icon"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import ImageFilter from './image-filter';
  export default {
    data() {
      return {
        wkLogo: '',
      };
    },
    props: {
      dataSource: {
        type: Object,
        default: function () {
          return null;
        },
      },
    },

    computed: {
      ...mapState({
        curApp: 'curApp',
        curStore: 'curStore',
      }),
    },

    mounted() {
      // eslint-disable-next-line vue/no-mutating-props
      this.dataSource.logo = this.curApp.logo;
      // const reg = new RegExp('https://.*?com', '');
      if (this.curApp && this.curApp.logo) {
        this.wkLogo = ImageFilter(this.curApp.logo);
      }
    },
  };
</script>
<style lang="less">
  .store-module {
    position: relative;
    height: 60px;
    background-color: white;
    padding: 0 10px;
    .store-img {
      position: absolute;
      width: 40px;
      height: 40px;
      text-align: center;
      top: 10px;
      overflow: hidden;
      background: rgba(240, 241, 245, 1);
      box-sizing: border-box;
      .image {
        width: 22px;
        height: 20px;
        vertical-align: middle;
        // background: transparent url('../images/store/store.png') center / cover no-repeat;
      }
    }

    .clickStore {
      position: absolute;
      top: 10px;
      left: 60px;
      width: 230px;
      .store-name {
        font-size: 13px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(55, 58, 68, 1);
      }
      .address {
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(162, 162, 164, 1);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .right {
      position: absolute;
      top: 15px;
      right: 10px;

      .right-icon {
        width: 24px;
        height: 24px;
        display: inline-block;
      }

      & > .right-icon:nth-child(1) {
        background: url('../images/store/location.png') no-repeat;
        background-size: cover;
      }
      & > .right-icon:nth-child(2) {
        background: url('../images/store/phone.png') no-repeat;
        background-size: cover;
      }
    }
  }
</style>
