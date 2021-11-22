<template>
  <div class="market-template">
    <div class="nav">
      <div class="row" v-for="(row, index) in list" :key="index">
        <div class="sub-title">{{ row.title }}</div>
        <div class="item" v-for="(item, idx) in row.children" :key="idx" @click="click(item)">
          <div class="image">
            <div class="icon" :class="item.icon"></div>
          </div>
          <div>
            <div>{{ item.name }}</div>
            <div>{{ item.detail }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin.js';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';

  export default {
    mixins: [appFeaturesMixin],
    data() {
      return {};
    },

    computed: {
      ...mapState({
        env: 'env',
        wkbScopeMenu: 'wkbScopeMenu',
      }),

      list() {
        const obj = [
          {
            title: '店铺营销',
            children: [
              {
                name: '新客进店好礼',
                id: 'new-user-gift',
                detail: '首次登陆小程序即送优惠券',
                icon: 'icon-new-user-gift',
                identifier: 'new_guest_gift',
              },
              {
                name: '充值卡',
                id: 'charge-card',
                detail: '留存用户，沉淀资金',
                icon: 'icon-charge-card',
                identifier: 'recharge_card',
              },
              {
                name: '专题活动',
                id: 'activities',
                detail: '创建活动，生成海报，推荐商品',
                icon: 'icon-activities',
                identifier: 'topic_activity',
              },
              {
                name: '优惠券',
                id: 'coupon',
                detail: '发放优惠券，吸引新顾客',
                icon: 'icon-coupon',
                identifier: 'coupon',
              },
              {
                name: '定向群发优惠券',
                id: 'directional-cp',
                detail: '主动推荐优惠券，激活老会员',
                icon: 'icon-directional-coupons',
                identifier: 'coupon_batch_manage',
              },
              // {
              //   name: '全渠道二维码',
              //   id: 'qrCode',
              //   detail: '全渠道手机信息，定量吸粉',
              //   icon: 'icon-qrCode'
              // },
              {
                name: '营销图文',
                id: 'marketing-graph',
                detail: '软文，为你促进转化',
                icon: 'icon-marketing-graph',
                identifier: 'marketing_graphic',
              },
              {
                name: '签到有礼',
                id: 'checkin',
                detail: '签到送积分，客户更活跃',
                icon: 'icon-checkin',
                identifier: 'sign_in_polite',
              },
              {
                name: '幸运转盘',
                id: 'lucky',
                detail: '转盘式抽奖，增加互动趣味性',
                icon: 'icon-lucky',
                identifier: 'lucky_guy',
              },
              {
                name: '下单有礼',
                id: 'courtesy',
                detail: '下单送礼，促进转化',
                icon: 'icon-courtesy',
                identifier: 'order_courtesy',
              },
              {
                name: '积分商城',
                id: 'integral',
                detail: '积分抵扣，提升客户忠诚度',
                icon: 'icon-integral',
                identifier: 'integral_shop',
              },
              {
                name: '赠品专区',
                id: 'gift-special-area',
                detail: '设置赠品，提高销售吸引力',
                icon: 'icon-gift',
                identifier: 'mdjy_wscyx_zpzq',
              },
              {
                name: '代金卡包',
                id: 'card-pack',
                detail: '叠加优惠，提升复购利器',
                icon: 'icon-card-pack',
                identifier: 'yxzx_wscyx_djkb',
              },
              {
                name: '电子画册',
                id: 'electronic-books',
                detail: '宣传企业文化，客户案例',
                icon: 'icon-electronic-books',
                identifier: 'electronic_books',
              },
              {
                name: '微装方案',
                id: 'micro-decorate',
                detail: '微装方案，一键预约',
                icon: 'icon-micro-decorate',
                identifier: 'micro_decorate',
              },
              {
                name: '积分抵现',
                id: 'score-set-off',
                detail: '积分抵扣，提升客户忠诚度',
                icon: 'icon-score',
                identifier: 'score_set_off',
              },
              {
                name: '积分兑钱',
                id: 'exchange-money',
                detail: '线下积分兑钱，提升客户忠诚度',
                icon: 'icon-score',
                identifier: 'exchange_money',
              },
            ],
          },
          {
            title: '互动营销',
            children: [
              {
                name: '拼团',
                id: 'pintuan',
                detail: '多人拼团享受优惠价格',
                icon: 'icon-group',
                identifier: 'pt',
              },
              {
                name: '砍价',
                id: 'cutprice',
                detail: '邀请好友帮砍价，裂变引流',
                icon: 'icon-cut-price',
                identifier: 'bargain',
              },
              {
                name: '秒杀',
                id: 'seckill',
                detail: '限时秒杀，回馈客户，促进消费',
                icon: 'icon-seckill',
                identifier: 'seconds_kill',
              },
              {
                name: '裂变红包',
                id: 'redpacket',
                detail: '邀请好友瓜分红包，裂变引流',
                icon: 'icon-redpacket',
                identifier: 'fission_red_envelope',
              },
              {
                name: '礼品卡',
                id: 'gift-card',
                detail: '可指定商品，可转赠',
                icon: 'icon-giftcard',
                identifier: 'gift_card',
              },
              {
                name: '分享有礼',
                id: 'share-gift',
                detail: '裂变，从这一次分享开始',
                icon: 'icon-share-gift',
                identifier: 'sharing_courtesy',
              },
              {
                name: '品牌代言人',
                id: 'task-center',
                detail: '邀请新用户，得现金奖励',
                icon: 'icon-task-center',
                identifier: 'yxzx_wscyx_ppdy',
              },
              {
                name: '直播方案',
                id: 'live',
                detail: '直播营销，快速下单',
                icon: 'icon-task-center',
                identifier: 'live_solution',
              },
              {
                name: '第x件y折',
                id: 'discount',
                detail: '清库存，提销量利器',
                icon: 'icon-discount',
                identifier: 'discount',
              },
              {
                name: '满x件优惠',
                id: 'full-reduction',
                detail: '购买一定件数享受优惠',
                icon: 'icon-full-reduction',
                identifier: 'full_reduction',
              },
              {
                name: '一口价',
                id: 'mouthful',
                detail: '冲销量神器，刺激用户多买几件',
                icon: 'icon-mouthful',
                identifier: 'mouthful',
              },
            ],
          },
          {
            title: '互动工具',
            children: [
              {
                name: '服务通知',
                id: 'message',
                detail: '结合小程序，公众号推送消息',
                icon: 'icon-message',
                identifier: 'service_notification',
              },

              {
                name: '小程序二维码',
                id: 'minapp-qrcode',
                detail: '扫码推广，即刻拉新',
                icon: 'icon-qrcode',
                identifier: 'applet_qr_code',
              },
              {
                name: '表单工具',
                id: 'form-utils',
                detail: '客情一到，导购必达',
                icon: 'icon-form',
                identifier: 'form_tool',
              },
            ],
          },
        ];
        if (this.isByx) {
          obj[0].children.push({
            name: '加价换购',
            id: 'repurchase',
            detail: '加N元可以换购指定商品，提升连带率',
            icon: 'icon-courtesy',
          });
        }

        if (this.wkbScopeMenu) {
          const scopeMenu =
            scopeMenuEnum.getMenuScopeByIdentifier(
              this.wkbScopeMenu,
              scopeMenuEnum.dictionary.wkbChildMenu.ma_marketing
            ) &&
            scopeMenuEnum.getMenuScopeByIdentifier(
              this.wkbScopeMenu,
              scopeMenuEnum.dictionary.wkbChildMenu.ma_marketing
            ).childMenu;

          obj.forEach(menu => {
            menu.children = menu.children
              .filter(item => scopeMenu.some(val => item.identifier === val.identifier))
              .map(item => {
                const index = scopeMenu.findIndex(val => item.identifier === val.identifier);
                item.url = scopeMenu[index].childMenu && scopeMenu[index].childMenu[0].url;
                return item;
              });
          });

          return obj.filter(item => !!item.children.length);
        }

        return [];
      },
    },

    mounted() {
      // 重定向跳转，避免iframe屏蔽父级页面，直接打开子页面
      if (window.location.href.indexOf('hideTop&hideMenu&noGap') > -1) {
        window.top.location.href = '/dsp.html#/marketing';
      }
    },
    methods: {
      click(item) {
        if (item.url) {
          this.$router.push(item.url);
          return;
        }
        this.$router.push('/marketing/' + item.id);
      },
    },
  };
</script>
<style lang="less" scoped>
  @import '../../../../dss-common/style/wkt-constants.less';

  .wkt-sub-nav-container .sub-nav-content-container .sub-nav-content {
    background-color: transparent;
  }

  .market-template {
    .title {
      font-size: 20px;
      color: @black-color;
      padding-left: 20px;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid @border-color;
    }

    .row {
      background-color: #fff;
      margin-bottom: 20px;
      padding: 20px;
      border-radius: 4px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    }

    .nav {
      width: 100%;
      box-sizing: border-box;

      .sub-title {
        font-size: @middle-font;
        font-weight: 400;
        color: @black-color;
        padding-bottom: 15px;
        margin-bottom: 24px;
        border-bottom: 1px solid #dce1e6;
      }

      .item {
        width: 24%;
        height: 80px;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.11);
        background: #fff;
        margin-right: 10px;
        box-sizing: border-box;
        display: inline-block;
        position: relative;
        cursor: pointer;

        & > div {
          display: inline-block;
        }

        .image {
          width: 61px;
          height: 61px;
          margin: 10px;
        }

        & > div:last-child {
          height: 100%;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 81px;
          padding-top: 10px;
          box-sizing: border-box;

          & > div:first-child {
            height: 21px;
            font-size: @standard-font;
            font-family: MicrosoftYaHei-Bold;
            font-weight: bold;
            color: @black-color;
            line-height: 21px;
          }

          & > div:last-child {
            margin-top: 10px;
            margin-right: 20px;
            height: 16px;
            font-size: @small-font;
            font-family: MicrosoftYaHei;
            color: @light-black-color;
            line-height: 16px;
          }
        }
      }
    }

    .icon {
      width: 61px;
      height: 61px;
      background-size: cover !important;
    }

    .icon-coupon {
      background: url('../../images/marketing/template/coupon.png') 0 0 no-repeat transparent;
    }

    .icon-activities {
      background: url('../../images/marketing/template/activities.png') 0 0 no-repeat transparent;
    }

    .icon-cut-price {
      background: url('../../images/marketing/template/cut-price.png') 0 0 no-repeat transparent;
    }

    .icon-seckill {
      background: url('../../images/marketing/template/seckill.png') 0 0 no-repeat transparent;
    }

    .icon-group {
      background: url('../../images/marketing/template/group.png') 0 0 no-repeat transparent;
    }

    .icon-message {
      background: url('../../images/marketing/template/message.png') 0 0 no-repeat transparent;
    }

    .icon-redpacket {
      background: url('../../images/marketing/template/redpacket.png') 0 0 no-repeat transparent;
    }

    .icon-new-user-gift {
      background: url('../../images/marketing/template/new-user-gift.png') 0 0 no-repeat transparent;
    }

    .icon-charge-card {
      background: url('../../images/marketing/template/charge-card.png') 0 0 no-repeat transparent;
    }

    .icon-giftcard {
      background: url('../../images/marketing/template/gift-card.png') 0 0 no-repeat transparent;
    }

    .icon-directional-coupons {
      background: url('../../images/marketing/template/directional-coupons.png') 0 0 no-repeat transparent;
    }

    .icon-sms-group {
      background: url('../../images/marketing/template/sms-group.png') 0 0 no-repeat transparent;
    }

    .icon-qrcode {
      background: url('../../images/marketing/template/qr-code.png') 0 0 no-repeat transparent;
    }

    .icon-form {
      background: url('../../images/marketing/template/form-utils.png') 0 0 no-repeat transparent;
    }

    .icon-checkin {
      background: url('../../images/marketing/template/checkin.png') 0 0 no-repeat transparent;
    }

    .icon-courtesy {
      background: url('../../images/marketing/template/courtesy.png') 0 0 no-repeat transparent;
    }

    .icon-lucky {
      background: url('../../images/marketing/template/lucky.png') 0 0 no-repeat transparent;
    }

    .icon-share-gift {
      background: url('../../images/marketing/template/share-gift.png') 0 0 no-repeat transparent;
    }

    .icon-task-center {
      background: url('../../images/marketing/template/task-center.png') 0 0 no-repeat transparent;
    }

    .icon-discount {
      background: url('../../images/marketing/template/discount.png') 0 0 no-repeat transparent;
    }

    .icon-full-reduction {
      background: url('../../images/marketing/template/full-reduction.png') 0 0 no-repeat transparent;
    }

    .icon-mouthful {
      background: url('../../images/marketing/template/mouthful.png') 0 0 no-repeat transparent;
    }

    .icon-marketing-graph {
      background: url('../../images/marketing/template/marketing-graph.png') 0 0 no-repeat transparent;
    }

    .icon-integral {
      background: url('../../images/marketing/template/integral.png') 0 0 no-repeat transparent;
    }

    .icon-gift {
      background: url('../../images/marketing/template/ic-gift.png') 0 0 no-repeat transparent;
    }

    .icon-card-pack {
      background: url('../../images/marketing/template/card-pack.png') 0 0 no-repeat transparent;
    }

    .icon-micro-decorate {
      background: url('../../images/marketing/template/micro-decorate.png') 0 0 no-repeat transparent;
    }

    .icon-electronic-books {
      background: url('../../images/marketing/template/electronic-books.png') 0 0 no-repeat transparent;
    }

    .icon-score {
      background: url('../../images/marketing/template/score.png') 0 0 no-repeat transparent;
    }
  }
</style>
