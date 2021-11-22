<style lang="less">
.shopGuide {
  .business-card {
    position: relative;
    margin: 10px 15px;
    padding: 10px 15px;
    box-shadow: 0px 4px 10px 0px rgba(82, 96, 112, 0.11);
    border-radius: 4px;
    border: 1px solid rgba(221, 227, 236, 1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    .business-card-content {
      display: flex;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid rgba(221, 227, 236, 1);
      }
      p {
        margin-left: 9px;
        .name {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(51, 55, 62, 1);
        }
        .position {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(136, 147, 166, 1);
          margin-top: 2px;
        }
      }
    }
    .card {
      // text-align: center;
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      // background-color: #f35f28;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100px;
    }
  }
  .float-window {
    margin-right: 15px;
    position: relative;
    float: right;
    img {
      width: 55px;
      height: 55px;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12);
      border: 2px solid rgba(255, 255, 255, 1);
      border-radius: 50%;
    }
    p {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 1px 5px 0px rgba(93, 93, 93, 0.3);
      border-radius: 9px;
      border: 1px solid rgba(221, 227, 236, 1);
      display: inline-block;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(136, 147, 166, 1);
      width: 45px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      position: absolute;
      bottom: -1px;
      left: 6px;
    }
  }
}
</style>

<template>
  <div class="shopGuide">
    <div class="business-card" v-show="dataSource.cardStyle === 3">
      <div class="business-card-content">
        <img src="../../../../images/add.png" alt="" />
        <p>
          <span class="name">张艺馨</span><br />
          <span class="position">职业顾问</span>
        </p>
      </div>
      <div class="card">
        <img style="width: 30px" src="../images/shopping-guide/sg-contact.png" alt="" srcset="" />
        <img style="width: 30px" src="../images/shopping-guide/sg-message.png" alt="" srcset="" />
      </div>
    </div>
    <div class="float-window" v-show="dataSource.cardStyle === 6">
      <img src="../../../../images/add.png" alt="" /> <br />
      <p>咨询</p>
    </div>
  </div>
</template>
<script>
import ImageFilter from './image-filter';
export default {
  name: 'shopCardModule',
  props: {
    dataSource: {
      type: Object,
      default: {}
    }
  },

  watch: {
    'dataSource.cardStyle': {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.nowIndex = 0;
        if (newVal) {
        }
      }
    }
  },

  methods: {}
};
</script>
