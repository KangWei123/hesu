<template>
  <div class="park-module">
    <div class="park-top">
      <div class="park-location">
        <div class="content">
          <img src="../../../../images/park/location.png" />
          <span>港湾一号停车场</span>
          <img class="arrow-dow" src="../../../../images/park/icon_line.png" />
        </div>
      </div>
      <div class="log-box">
        <div class="log-title">缴费记录</div>
        <div class="log-title">｜</div>
        <div class="log-title">缴费说明</div>
      </div>
    </div>

    <div class="tips-box">
      <img src="../../../../images/park/top.png" />
      <div class="tips">提示车辆<span> 【未入场】 </span>时，请检查左上角定位车场是否准确，点击切换</div>
    </div>

    <div class="park-box">
      <div class="label">请输入车牌号</div>
      <div class="carNo-box">
        <div class="carNo"></div>
        <div class="carNo"></div>
        <div class="break"></div>
        <div class="carNo"></div>
        <div class="carNo"></div>
        <div class="carNo"></div>
        <div class="carNo"></div>
        <div class="carNo"></div>
        <div class="carNo new">新</div>
      </div>
      <div class="do-pay">
        <div class="button">查询停车缴费</div>
      </div>
    </div>

    <div class="record-box">
      <div class="record-title">历史车号</div>
      <div class="record-list">
        <div class="record-item">
          <span>粤C10086</span>
          <img src="../../../../images/park/close-icon.png" />
        </div>
        <div class="record-item">
          <span>粤C10085</span>
          <img src="../../../../images/park/close-icon.png" />
        </div>
        <div class="record-item">
          <span>粤C10083</span>
          <img src="../../../../images/park/close-icon.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    mixins: [],
    components: {},
    data() {
      return {};
    },
    methods: {},
  };
</script>
<style lang="less" scoped>
  .park-module {
    margin-top: 10px;
    overflow: hidden;

    .park-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 16px 8px 16px;

      .log-box {
        font-size: 12px;
        color: #787878;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .log-title {
          color: #259eff;
        }
      }
    }

    .park-location {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 15px;
      padding: 0 10px;
      text-align: center;
      color: #fff;
      font-size: 12px;
      background: rgba(0, 0, 0, 1);
      opacity: 0.28;
      max-width: 250px;

      .content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
        vertical-align: middle;
      }

      span {
        vertical-align: middle;
      }

      .arrow-dow {
        width: 12px;
        height: 12px;
        margin-left: 6px;
      }
    }

    .tips-box {
      margin: 0 19px 16px 19px;
      font-size: 13px;
      font-weight: 400;
      color: #97a1b2;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      img {
        width: 30px;
        height: 30px;
        margin-right: 4px;
      }

      .tips {
        width: 265px;
      }

      span {
        color: rgba(250, 117, 22, 1);
      }
    }

    .record-box {
      margin: 0 auto;
      width: 347px;
      height: 106px;
      background: #fff;
      border-radius: 6px;
      margin-top: 23px;
      overflow: hidden;

      .record-title {
        color: #000;
        font-size: 15px;
        font-weight: 600;
        margin: 15px 12px 0 12px;
      }
    }

    .record-list {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      justify-items: center;
      flex-wrap: nowrap;
      margin: 15px 17px 0 17px;

      .record-item {
        overflow: hidden;
        box-sizing: border-box;
        width: 96px;
        height: 26px;
        line-height: 26px;
        padding-left: 8px;
        background: #f3f5f8;
        border-radius: 2px;
        margin-right: 16px;
        font-size: 14px;
        color: #999;
        display: flex;
        justify-content: space-around;
        align-items: center;
        justify-items: center;

        img {
          width: 16px;
          height: 16px;
          vertical-align: middle;
          margin-left: 3px;
        }
      }

      .record-item:nth-child(3) {
        margin-right: 0;
      }
    }

    .park-box {
      margin: 0 auto;
      overflow: hidden;
      width: 347px;
      height: 170px;
      opacity: 1;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.05);

      .label {
        margin: 16px 0 8px 11px;
        font-size: 13px;
        color: #000;
      }

      .button {
        margin: 24px auto;
        width: 271px;
        height: 44px;
        line-height: 44px;
        opacity: 0.24;
        background: #fa7516;
        border-radius: 22px;
        font-size: 16px;
        font-weight: 400;
        text-align: center;
        color: #fff;
      }

      .carNo-box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-left: 11px;

        .carNo {
          box-sizing: border-box;
          width: 36px;
          height: 36px;
          line-height: 36px;
          opacity: 1;
          background: #fff;
          border: 1px solid #d7d7d7;
          border-radius: 4px;
          margin-right: 4px;
        }

        .carNo:first-child {
          border: 1px solid #fba787;
        }

        .new {
          border: 1px solid #f2f2f2;
          font-size: 9px;
          text-align: center;
          color: #999;
        }

        .break {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin: 3px 4px 3px 3px;
          border-radius: 50%;
          background: #d8d8d8;
        }
      }
    }
  }
</style>
