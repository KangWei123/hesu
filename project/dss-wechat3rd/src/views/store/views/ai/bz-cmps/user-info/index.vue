<template>
  <div class="user-info">
    <img class="avetor" :style="{ opacity: curent === 1 ? 1 : 0 }" :src="img_1" />
    <img class="avetor" :style="{ opacity: curent === 2 ? 1 : 0 }" :src="img_2" />
    <i class="box"></i>

    <!-- 疑似标识 -->
    <span class="suspected" v-if="data.faceTag === 2">!</span>

    <div class="base">
      <div class="base-name">
        {{ hideName }} <span v-show="data.employeeName">导购：{{ data.employeeName || '--' }}</span>
      </div>
      <div class="base-attr">
        <span>{{ data.faceGender === 1 ? '男性' : '女性' }}</span>
        <span>{{ data.faceAge | age }}</span>
        <span>{{ data.count > 1 ? '老客户' : '新客户' }}</span>
      </div>
    </div>

    <!-- 店铺信息详情 -->
    <div class="store" :class="showVersions">
      <div class="row" v-for="(item, i) in tagList" :key="i">
        <span class="label">{{ item.name }}：</span>
        <span class="value">{{ item.value || '--' }}</span>
      </div>
    </div>

    <!-- 到店记录 -->
    <div class="arrive-record" v-if="noVip">
      <div class="box-title">
        <div>到店记录</div>
      </div>
      <div class="record-list">
        <div class="record-item" v-for="(item, index) in arriveRecordList" :key="index">
          <div>{{ item.time }}</div>
          <div>{{ item.name }}</div>
        </div>
        <span class="no-data" v-show="!arriveRecordList.length">暂无数据</span>
      </div>
    </div>

    <!-- 商家标签 -->
    <div class="merchant-impression" :class="showVersions">
      <label-box :is-vip="!!data.memberId" :label-list="ImpressionList" title="商家标签" />
    </div>
    <!-- 画像标签 -->
    <div class="user-label" :class="showVersions">
      <label-box :is-vip="!!data.memberId" :default-theme="false" :label-list="jiGuangTag" title="画像标签" />
    </div>
    <!-- 消费记录 -->
    <div class="accounts" :class="showVersions" v-if="!noVip">
      <div class="box-title">
        <div>消费记录</div>
        <div class="accounts-all">
          <p>
            消费总额：
            <span v-if="!!consumeAmount">￥{{ consumeAmount }}</span>
            <span v-else>--</span>
          </p>
          <p>
            消费次数：
            <span>{{ orderTotalCount }}</span>
          </p>
        </div>
      </div>
      <div class="accounts-list">
        <div class="accounts-item" v-for="(item, index) in orderList" :key="index">
          <span class="accounts-item-date">{{ item.time }}</span>
          <span class="accounts-item-name">{{ item.name }}</span>
          <span class="accounts-item-count">x{{ item.count }}</span>
          <span class="accounts-item-money">￥{{ item.money }}</span>
        </div>
        <span class="no-data" v-show="!orderList.length">暂无数据</span>
      </div>
    </div>
    <!-- 智能推荐 -->
    <div class="recommend" :class="showVersions" v-if="!noVip">
      <div class="box-title">
        <div>智能推荐</div>
      </div>
      <div class="recommend-list">
        <div class="recommend-item" v-for="(item, index) in recommendList" :key="index">
          <img class="recommend-item-logo" :src="item.pic" alt />
          <div>
            <span class="recommend-item-name">{{ item.name }}</span>
            <span class="recommend-item-money">
              <span>￥</span>
              {{ item.price }}
            </span>
          </div>
        </div>
        <span class="no-data" v-show="!recommendList.length">暂无数据</span>
      </div>
    </div>
    <!-- 优惠券 -->
    <div class="coupon" :class="showVersions" v-if="!noVip">
      <div class="coupon-title">持有优惠券</div>
      <div class="coupon-list">
        <div class="coupon-item" v-for="(item, index) in couponList" :key="index">
          <span class="coupon-item-discount">{{ item.desc }}</span>
          <span class="coupon-item-time">{{ item.time }}</span>
          <span class="coupon-item-name">{{ item.name }}</span>
        </div>
        <span class="no-data" v-show="!couponList.length">暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script>
  import utils from '@/dss-common/utils/date.js';
  import cameraFlowApi from '@/dss-common/api/camera-flow.js';
  import labelBox from './label-box';

  export default {
    props: {
      data: {
        type: Object,
        default() {
          return {};
        },
      },
      wkbStatus: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        img_1: '',
        img_2: '',
        curent: 1,
        tagList: [],
        jiGuangTag: [],
        userName: null,
        ImpressionList: [],
        recommendList: [],
        arriveRecordList: [],
        orderList: [],
        couponList: [],
        consumeAmount: '',
        orderTotalCount: '--',
      };
    },
    components: {
      labelBox,
    },
    computed: {
      noVip() {
        return !(this.data.memberId && this.wkbStatus);
      },
      showVersions() {
        // return this.data.memberId && this.wkbStatus ? '' : 'no-vip';
        return this.noVip ? 'no-vip' : '';
      },
      sex() {
        return {
          call: this.data.faceGender === 1 ? '先生' : '女士',
          sex: this.data.faceGender === 1 ? '男性' : '女性',
        };
      },
      hideName() {
        if (this.userName) {
          return this.userName.slice(0, 1) + this.sex.call;
        } else {
          return this.data.name ? this.data.name.slice(0, 1) + this.sex.call : '--';
        }
      },
    },
    watch: {
      data(val, oldVal) {
        if (val) {
          this.tagJson(val);
          this.getTagList(val);
          // this.getShopTag(val);
          this.getArriveRecordList(val);
          if (val.memberId) {
            this.getRecommendList(val);
            this.getUserOrderList(val);
            this.getCouponList(val);
          } else {
            this.recommendList = [];
            this.orderList = [];
            this.couponList = [];
          }
        }
        // if (oldVal && val.idStr === oldVal.idStr) {
        //   return;
        // }
        if (this.curent === 1) {
          this.img_2 = val.faceImgUrl;
          this.curent = 2;
          if (!oldVal) {
            this.img_1 = val.faceImgUrl;
          }
        } else {
          this.img_1 = val.faceImgUrl;
          this.curent = 1;
          if (!oldVal) {
            this.img_2 = val.faceImgUrl;
          }
        }
      },
    },
    filters: {
      textoverflow(val) {
        if (val.length > 16) {
          val = val.substring(0, 15) + '...';
        }
        return val;
      },

      age(val) {
        if (val < 18) {
          val = '< ' + 18;
        }
        return val;
      },
    },

    created() {
      if (this.data) {
        this.img_1 = this.data.faceImgUrl;
        this.img_2 = this.data.faceImgUrl;
      }
    },
    methods: {
      // 根据tagTemplate获取tag列表
      getTagList(row) {
        const tagList = [];
        if (row.tagTemplate) {
          const tagTemplate = JSON.parse(row.tagTemplate);
          const customTag = JSON.parse(row.tag) || {};
          if (!tagTemplate) {
            return;
          }
          tagTemplate.forEach(item => {
            const tag = {
              name: item.tagName,
              tagKey: item.tagKey,
              value: null,
            };
            // type为0从row里面取数据，1从customTag里取数据
            if (item.type === 0) {
              if (item.tagKey === 'vip') {
                tag.value = row[item.tagKey] === 0 ? '否' : '是';
              } else if (item.tagKey === 'updateTime') {
                tag.value = this.formatDate(row[item.tagKey]);
              } else if (item.tagKey === 'count') {
                tag.value = row[item.tagKey] + '次';
              } else {
                tag.value = row[item.tagKey];
              }
              tagList.push(tag);
            } else {
              // 如果有userName，替换name
              if (item.tagName === 'userName') {
                this.userName = customTag[item.tagKey];
              } else {
                tag.value = customTag[item.tagKey];
                tagList.push(tag);
              }
            }
          });
        }
        this.tagList = tagList;
      },

      // 获取序列化极光tag
      tagJson: function (item) {
        const list = [];
        if (item.jiGuangTag) {
          item.jiGuangTag = JSON.parse(item.jiGuangTag);
          // 消费能力
          if (item.jiGuangTag.fim_fism_conl_cir) {
            if (item.jiGuangTag.fim_fism_conl_cir !== '低')
              this.pushList(list, '消费能力' + item.jiGuangTag.fim_fism_conl_cir);
          }
          // 职业
          if (item.jiGuangTag.som_ocm_career && item.jiGuangTag.som_ocm_career !== '其他') {
            // list.push(item.jiGuangTag.som_ocm_career);
            this.pushList(list, item.jiGuangTag.som_ocm_career);
          }
          // 学历
          if (item.jiGuangTag.cpl_indm_edu_level) {
            if (item.jiGuangTag.cpl_indm_edu_level !== '低')
              this.pushList(list, '学历' + item.jiGuangTag.cpl_indm_edu_level);
          }
          // 消费偏好
          if (item.jiGuangTag.gbm_bhm_purb_conp) {
            // list.push(this.getOne(item.jiGuangTag.gbm_bhm_purb_conp));
            this.pushList(list, item.jiGuangTag.gbm_bhm_purb_conp);
          }
          // 上网目的
          if (item.jiGuangTag.gbm_bhm_purb_supr) {
            // list.push(this.getOne(item.jiGuangTag.gbm_bhm_purb_supr));
            this.pushList(list, item.jiGuangTag.gbm_bhm_purb_supr);
          }
          // 应用偏好
          if (item.jiGuangTag.gbm_bhm_appp_appr_s) {
            // list.push(this.getOne(item.jiGuangTag.gbm_bhm_appp_appr_s));
            this.pushList(list, item.jiGuangTag.gbm_bhm_appp_appr_s);
          }
          // 购买方式
          if (item.jiGuangTag.gbm_bhm_purb_purw) {
            // list.push(this.getOne(item.jiGuangTag.gbm_bhm_purb_purw));
            this.pushList(list, item.jiGuangTag.gbm_bhm_purb_purw);
          }
          // 兴趣爱好
          if (item.jiGuangTag.gbm_hbm_s) {
            // list.push(this.getOne(item.jiGuangTag.gbm_hbm_s));
            this.pushList(list, item.jiGuangTag.gbm_hbm_s);
          }
        }
        this.jiGuangTag = list;
      },

      pushList(list, tag) {
        if (!tag) {
          return;
        }
        // 从大类中取一个标签，过滤标签等于其他，取下一个
        const reg = /(其它)|(未知)|(-99999)/;
        tag = tag.split(',');
        for (let i = 0, j = tag.length; i < j; i++) {
          if (!!tag[i] && !reg.test(tag[i])) {
            return list.push(tag[i]);
          }
        }
      },

      // 获取商家印象
      getShopTag(row) {
        cameraFlowApi
          .getImpression({
            customerId: row.customerId,
          })
          .then(result => {
            this.ImpressionList = result.data;
          })
          .always(() => {});
      },
      // 获取消费记录
      getUserOrderList(row) {
        cameraFlowApi
          .getUserOrderList({
            userId: row.memberId,
            pageNo: 1,
            pageSize: 3,
          })
          .then(result => {
            const data = result.data || {};
            this.consumeAmount = this.formatMoney(~~data.consumeAmount);
            this.orderTotalCount = data.totalCount || '--';
            this.orderList = (data.orderList || []).map(item => {
              const desc = (item.itemList || []).reduce((acc, cur, index) => {
                const oldName = acc.name ? acc.name + ';' : '';
                const count = acc.count ? acc.count + cur.itemCount : cur.itemCount;
                return {
                  name: oldName + cur.itemName,
                  count,
                };
              }, {});
              const time = item.confirmTime || new Date().toString();
              return {
                time: utils.format(new Date(time), 'MM/DD', 8),
                name: desc.name,
                count: desc.count || 0,
                money: this.formatMoney(item.payFee),
              };
            });
          });
      },
      // 获取智能推荐列表
      getRecommendList(row) {
        cameraFlowApi
          .getRecommendList({
            memberId: row.memberId,
            pageSize: 3,
          })
          .then(result => {
            const wxItemDetailList = (result.data || {}).wxItemDetailList;
            this.recommendList = (wxItemDetailList || []).map(item => {
              const { wxItem = {} } = item;
              return {
                pic: wxItem.thumbnail,
                price: this.formatMoney(wxItem.salePrice),
                name: wxItem.name || '--',
              };
            });
          })
          .always(_ => {});
      },
      // 获取优惠券列表
      getCouponList(row) {
        cameraFlowApi
          .getCouponList({
            userId: row.memberId,
            pageSize: 4,
          })
          .then(result => {
            this.couponList = (result.data || []).map(item => {
              return {
                name: item.name,
                time: utils.format(new Date(item.endTime), 'MM/DD', 8) + '到期',
                desc: `满${this.formatMoney(item.minimumFee, 0)}减${this.formatMoney(item.discountFee, 0)}`,
              };
            });
          })
          .always(_ => {});
      },

      // 获取到店记录列表
      getArriveRecordList(row) {
        // 没有customerId不查询到店记录
        if (!row.customerId) {
          this.arriveRecordList = [];
          return;
        }
        cameraFlowApi
          .getArriveRecordList({
            customerId: row.customerId,
            pageNo: 1,
            pageSize: 3,
          })
          .then(result => {
            const { data = [] } = result;
            this.arriveRecordList = data.map(item => {
              return {
                name: item.storeName,
                time: utils.format(new Date(item.enterTime)),
              };
            });
          })
          .always(_ => {});
      },
      formatDate(strDate) {
        if (!strDate) {
          return '';
        }
        return utils.format(new Date(strDate), 'MM/DD HH:mm', 8);
      },
      formatMoney(money, precision = 2) {
        return (~~money / 100).toFixed(precision);
      },

      splitTag(tags) {
        if (!tags) {
          return [];
        }
        return tags.split(',');
      },
    },
  };
</script>

<style lang="less" scoped>
  .user-info {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-top: 14px;
    font-size: 24px;
    color: white;

    .avetor {
      width: 140px;
      height: 140px;
      border-radius: 4px;
      position: absolute;
      top: 0;
      left: 0;
      transition: opacity 1s;
      z-index: 1;
    }
    .box {
      width: 152px;
      height: 150px;
      display: block;
      top: -5px;
      left: -6px;
      position: absolute;
      z-index: 2;
      background: url('../../../../asserts/images/ai-box1.png') no-repeat;
      background-size: 100% 100%;
    }
    .suspected {
      display: inline-block;
      height: 30px;
      width: 30px;
      line-height: 30px;
      background: red;
      border-radius: 50%;
      position: absolute;
      top: -12px;
      left: 122px;
      text-align: center;
      color: white;
      z-index: 99999;
    }
    .base {
      width: 396px;
      height: 133px;
      margin-left: 140px;
      padding: 31px 0 0 20px;
      line-height: 24px;
      box-sizing: border-box;
      background: url('../../../../asserts/images/ai-box2.png') no-repeat;
      background-size: 100% 100%;
      .base-name {
        span {
          display: inline-block;
          width: 162px;
          text-align: right;
          white-space: nowrap;
        }
      }
      .base-attr {
        margin-top: 23px;
        display: flex;
        span {
          margin-right: 48px;
        }
      }
    }

    .store {
      width: 532px;
      // height: 68px;
      margin-top: 8px;
      display: flex;
      position: relative;
      flex-wrap: wrap;
      .row {
        width: 50%;
        height: 34px;
        box-sizing: border-box;
        padding-left: 9px;
        font-size: 18px;
        align-items: center;
        display: flex;
        background: linear-gradient(90deg, rgba(29, 35, 71, 1) 0%, rgba(29, 70, 67, 1) 100%);
        .label {
          width: 100px;
          color: rgba(255, 255, 255, 0.2959);
        }
        .value {
          flex: 1;
          text-align: center;
        }
      }
      &.no-vip {
        .row {
          width: 100%;
          padding-left: 24px;
          height: 60px;
          font-size: 20px;
          margin-bottom: 4px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .arrive-record {
      width: 532px;
      margin-top: 19px;
      .box-title {
        height: 40px;
      }
      .record-list {
        height: 127px;
        display: flex;
        position: relative;
        flex-direction: column;
        padding: 0 20px;
        background: linear-gradient(90deg, rgba(29, 35, 71, 1) 0%, rgba(29, 70, 67, 1) 100%);
        .record-item {
          display: flex;
          font-size: 16px;
          margin-top: 16px;
          div {
            width: 50%;
          }
        }
      }
    }

    .merchant-impression {
      position: relative;
      margin-top: 8px;
    }

    .user-label {
      position: relative;
      margin-top: 7px;
    }

    .accounts {
      width: 531px;
      font-size: 16px;
      height: 118px;
      box-sizing: border-box;
      margin-top: 7px;
      .accounts-list {
        height: 90px;
        padding: 0 20px;
        position: relative;
        background: linear-gradient(90deg, rgba(29, 35, 71, 1) 0%, rgba(29, 70, 67, 1) 100%);
        .accounts-item {
          display: flex;
          span {
            line-height: 30px;
          }
          .accounts-item-name {
            margin-left: 24px;
            width: 270px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .accounts-item-count {
            margin-left: 20px;
          }
          .accounts-item-money {
            margin-left: 52px;
            width: 110px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }

    .box-title {
      display: flex;
      padding: 0 20px;
      height: 28px;
      line-height: 28px;
      align-items: center;
      font-size: 18px;
      justify-content: space-between;
      background: linear-gradient(270deg, rgba(33, 107, 100, 1) 0%, rgba(33, 44, 107, 1) 100%);
      div:first-child {
        color: #32ffea;
      }
      .accounts-all {
        display: flex;
        font-size: 16px;
        // align-items: center;
        p {
          margin: 0;
          &:first-child {
            margin-right: 17px;
          }
        }
      }
    }

    .recommend {
      margin-top: 8px;
      width: 531px;
      height: 149px;
      overflow: hidden;
      .recommend-list {
        height: 121px;
        position: relative;
        box-sizing: border-box;
        padding: 22px 0 22px 10px;
        font-size: 14px;
        display: flex;
        background: linear-gradient(90deg, rgba(29, 35, 71, 1) 0%, rgba(29, 70, 67, 1) 100%);
        .recommend-item {
          width: 178px;
          height: 78px;
          border-radius: 2px;
          padding: 6px;
          box-sizing: border-box;
          display: flex;
          margin-left: 10px;
          background: rgba(255, 255, 255, 0.1531);
          .recommend-item-logo {
            height: 66px;
            width: 66px;
            border-radius: 2px;
            margin-right: 4px;
          }
          div {
            color: #32ffea;
            line-height: 22px;
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            .recommend-item-name {
              color: #fff;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .recommend-item-money {
              font-size: 18px;
              display: inline-block;
              width: 100px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              span {
                font-size: 14px;
              }
            }
          }
        }
      }
    }

    .coupon {
      margin-top: 8px;
      width: 540px;
      height: 114px;
      background: url('../../../../asserts/images/ai-box3.png') no-repeat;
      background-size: 100% 100%;
      .coupon-title {
        height: 29px;
        line-height: 29px;
        font-size: 18px;
        padding-left: 20px;
        color: #32ffea;
      }
      .coupon-list {
        height: 85px;
        width: 100%;
        position: relative;
        display: flex;
        padding: 11px 0 0 61px;
        box-sizing: border-box;
        .coupon-item {
          position: relative;
          margin-left: 10px;
          width: 100px;
          height: 50px;
          background: url('../../../../asserts/images/card.png') no-repeat;
          background-size: 100% 100%;
          box-sizing: border-box;
          padding-top: 10px;
          &-discount {
            font-size: 14px;
            text-align: center;
            color: #32ffea;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            line-height: 14px;
            display: block;
          }
          &-time {
            display: block;
            width: 100%;
            font-size: 10px;
            color: #fff;
            box-sizing: border-box;
            padding-right: 19px;
            line-height: 10px;
            text-align: right;
            margin-top: 8px;
          }
          &-name {
            position: absolute;
            bottom: -16px;
            left: 0;
            width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 10px;
            color: #32ffea;
          }
        }
      }
    }
    .no-vip {
      margin-top: 19px;
    }
    .no-data {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 16px;
      transform: translate(-50%, -50%);
    }
  }
</style>
