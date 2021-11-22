<template>
  <div class="wrap">
    <div class="head" @click="goBack">
      <span class="return-icon"></span>
      <span class="return-text">返回</span>
    </div>
    <section class="content">
      <p class="title">帮助说明</p>
      <div class="sub-title">
        <p>什么线索？</p>
        <span class="sub-content"
          >有别于传统的CRM对线索的定义，惟客平台所有线索指的未分配跟进员工的客户，与成交状态无关；</span
        >
      </div>
      <div class="sub-title">
        <p>什么客户？</p>
        <span class="sub-content">客户是指已经有对应员工跟进的客户；</span>
      </div>
      <div class="sub-title">
        <p>什么线索分配？</p>
        <span class="sub-content"
          >客户阶段是指客户对应的不同状态，分类潜在客户、验证客户、意向客户、成交客户、流失客户，潜在客户是指的未获取到手机号的客户，验证客户是指的获取到手机号的客户，意向客户是员工手动设置的客户，意指有成交机会的客户、成交客户已经购买商品或服务的客户，流失客户，员工将客户列为流失客户，代表不再跟进的客户；线索如果符合对应条件，也会进入对应的阶段状态；</span
        >
      </div>
      <div class="sub-title">
        <p>什么客户等级？</p>
        <span class="sub-content"
          >客户等级主要根据客户的成交概率和成交周期进行预判的等级，客户等级为员工根据意向情况的个人判断，分为5个等级，</span
        >
        <br />
        <p class="sub-text">
          <br />
          (1) A类客户，客户2周内成交概率在90%以 上客户: <br />
          (2) B类客户，客户30天内内成交概率大于70%以上客户: <br />
          (3) C类客户，客户在90天内成交概率大于40%以上客户: <br />
          (4) D类客户，客户在180天内成交概率大于15%以上客户: <br />
          (5) E类客户，客户成交180天后成交，成交概率小于15%客户:
        </p>
      </div>
      <div class="sub-title">
        <p>关于线索分配提醒及回收？</p>
        <span class="sub-content"
          >进行线索分配后，系统会自动提醒员工，员工点击领取确认后，正式领取；线索分配给员工后如果超时未领取企业可以设置回收回收后可以继续进入线索池进行线索分发；</span
        >
      </div>
      <div class="sub-title">
        <p>关于客户交接？</p>
        <span class="sub-content"
          >如果员工发生离职或工作变动，可将归属客户进行交接，交接后，客户的历史信息记录及利益关系将转角给下个员工；如果已经建立企业微信好友关系，则微信好友关系也同步变更；</span
        >
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'Help',
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.fromPath = from.path;
      });
    },
    data() {
      return {
        fromPath: '',
      };
    },
    methods: {
      goBack() {
        this.$router.push({
          path: this.fromPath,
        });
      },
    },
  };
</script>

<style scoped lang="less">
  p {
    margin: 0;
  }
  .wrap {
    font-family: PingFangSC-Regular, PingFang SC;
    .head {
      cursor: pointer;
      background-color: white;
      height: 62px;
      line-height: 62px;
      border-bottom: 1px solid #dcdde0;
      .return-icon {
        color: #cdcdcd;
        width: 6px;
        height: 10px;
        margin-left: 24px;
        font-size: 16px;
      }
      .return-text {
        font-size: 16px;

        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-left: 5px;
      }
    }
    .content {
      padding-left: 32px;
      padding-top: 32px;
      width: 70%;
      .title {
        font-size: 18px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      .sub-title {
        margin-top: 20px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        .sub-content {
          font-size: 12px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          display: inline-block;
          margin-top: 10px;
        }
        .sub-text {
          position: relative;
          top: -15px;
          margin-left: 5px;
          line-height: 20px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }
      }
    }
  }
</style>
