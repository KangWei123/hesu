<template>
  <div class="common-module" :class="isCardPack ? 'card-pack-module' : ''">
    <!-- 经典列表 -->
    <div class="goods-list-ve" v-if="dataSource.showType === decorateStyleEnum.SHOW_TYPE.vertical">
      <div class="goods-item" v-for="(item, index) in list" :key="index">
        <div
          class="goods-img"
          :style="{ background: 'transparent url(' + item.wkThumbnail + ') no-repeat center center / cover' }"
        ></div>
        <div class="goods-info-box">
          <div class="goods-name limit-line-ellipsis line-2">
            <slot name="sale-limit" v-if="item.limit" :item="item"></slot>
            <span v-if="item.collageLabel" class="group-num">{{ item.collageLabel }}</span
            >{{ item.name }}{{ item.skuName ? '(' + item.skuName + ')' : '' }}
          </div>
          <div v-if="item.memberLabel" class="sale-label">{{ item.memberLabel }}</div>
          <div v-if="item.limitAmount" class="sale-label">{{ item.limitAmount }}</div>
          <div class="goods-label">
            <div v-if="item.salePrice" class="price-container">
              ￥{{ item.salePrice | money }}<span>￥{{ item.labelPrice | money }}</span>
            </div>
            <div class="sale-count">{{ item.saleAmount }}</div>
          </div>
        </div>
        <div class="goods-btn">{{ item.btn }}</div>
      </div>
    </div>
    <!-- 左右滑动 -->
    <div class="goods-list-hz" v-else-if="dataSource.showType === decorateStyleEnum.SHOW_TYPE.horizon">
      <div class="goods-hz" v-for="(item, index) in list" :key="index">
        <div
          class="goods-img"
          :style="{ background: 'transparent url(' + item.wkThumbnail + ') no-repeat center center / cover' }"
        ></div>
        <div v-if="item.topSign" class="cut-price">
          <span class="cut-price-desc">{{ item.topSign }}</span>
        </div>
        <div class="goods-content">
          <div class="goods-name">{{ item.name }}{{ item.skuName ? '(' + item.skuName + ')' : '' }}</div>

          <slot name="card-pack-content" v-if="isCardPack" :show-btn="false" :item="item"></slot>

          <div style="margin-top:10px;" v-else-if="marketingType">
            <slot name="custom-rowThree"></slot>
          </div>
          <div v-else class="goods-price">
            <span v-if="item.sign" class="goods-sign">{{ item.sign }}</span
            >￥{{ item.salePrice | money }}
          </div>
        </div>
      </div>
    </div>
    <!-- 一行一个(大图模式) -->
    <div class="goods-list-onetorow" v-else-if="dataSource.showType === decorateStyleEnum.SHOW_TYPE.rowOne">
      <div class="goods-list-onetorow-container clearfix">
        <div class="goods-onetorow goods-onetorowOne" v-for="(item, index) in list" :key="index">
          <div
            class="img"
            :style="{ background: 'transparent url(' + item.wkThumbnail + ') no-repeat center center / cover' }"
          ></div>
          <div class="goods-content">
            <div v-if="item.tipLabel" class="group-box">
              <span class="goods-sign">{{ item.sign }}</span
              >{{ item.tipLabel }}
            </div>
            <div class="goods-name limit-line-ellipsis line-2">
              <slot name="sale-limit" v-if="item.limit" :item="item"></slot>
              {{ item.name }}{{ item.skuName ? '(' + item.skuName + ')' : '' }}
            </div>
            <div v-if="item.memberLabel" style="margin-left: 8px;" class="sale-label">{{ item.memberLabel }}</div>
            <div v-if="item.limitAmount" class="sale-label">{{ item.limitAmount }}</div>
            <div v-if="item.subtitle" class="sale-subtitle limit-line-ellipsis">
              {{ item.subtitle }}
            </div>
            <div v-if="item.salePrice" class="goods-price">
              <span class="goods-sale-label">{{ item.saleLabel }}</span
              >￥{{ item.salePrice | money }}<span class="goods-label-price">￥{{ item.labelPrice | money }}</span>
            </div>
            <div class="sale-count">
              {{ isCardPack ? `${item.saleAmount.replace(/\D/g, '')}人已购买` : item.saleAmount }}
            </div>
          </div>
          <div class="goods-btn">{{ item.btn }}</div>
        </div>
      </div>
    </div>
    <!-- 一行两个 -->
    <div class="goods-list-onetorow" v-else-if="dataSource.showType === decorateStyleEnum.SHOW_TYPE.rowTwo">
      <div class="goods-list-onetorow-container clearfix">
        <div class="goods-onetorow goods-onetorowTwo" v-for="(item, index) in list" :key="index">
          <div
            class="img"
            :style="{ background: 'transparent url(' + item.wkThumbnail + ') no-repeat center center / cover' }"
          ></div>
          <div class="goods-content">
            <div v-if="item.tipLabel" class="group-box">
              <span class="goods-sign">{{ item.sign }}</span
              >{{ item.tipLabel }}
            </div>
            <div class="goods-name limit-line-ellipsis line-2">
              <slot name="sale-limit" v-if="item.limit" :item="item"></slot>
              {{ item.name }}{{ item.skuName ? '(' + item.skuName + ')' : '' }}
            </div>
            <div v-if="item.memberLabel" style="margin-left: 8px;" class="sale-label">{{ item.memberLabel }}</div>
            <div v-if="item.limitAmount" class="sale-label">{{ item.limitAmount }}</div>

            <slot name="card-pack-content" v-if="isCardPack" :item="item"></slot>

            <div v-else-if="marketingType">
              <slot name="custom-rowTwo"></slot>
              <div class="sale-count" style="text-align:center;">{{ item.saleAmount }}</div>
            </div>
            <div v-else>
              <div class="sale-count">{{ item.saleAmount }}</div>
              <div class="row-two-box">
                <div class="two-goods-price">￥{{ item.salePrice | money }}</div>
                <div class="two-goods-btn">{{ item.btn }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 一行三个 -->
    <div class="goods-list-onetorow" v-else>
      <div class="goods-list-onetorow-container clearfix">
        <div class="goods-onetorow goods-onetorowThree" v-for="(item, index) in list" :key="index">
          <div
            class="img"
            :style="{ background: 'transparent url(' + item.wkThumbnail + ') no-repeat center center / cover' }"
          ></div>
          <div v-if="item.topSign" class="cut-price">
            <span class="cut-price-desc">{{ item.topSign }}</span>
          </div>
          <div class="goods-content">
            <div class="goods-name limit-line-ellipsis">
              {{ item.name }}{{ item.skuName ? '(' + item.skuName + ')' : '' }}
            </div>

            <slot name="card-pack-content" v-if="isCardPack" :show-btn="false" :item="item"></slot>
            <div style="margin-top:10px;" v-else-if="marketingType">
              <slot name="custom-rowThree"></slot>
            </div>
            <div v-else class="goods-price">
              <span v-if="item.sign" class="goods-sign">{{ item.sign }}</span
              >￥{{ item.salePrice | money }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/dss-common/style/base.less';
import { mapState } from 'vuex';
import decorateStyleEnum from '@/dss-wechat3rd/src/constants/decorateStyleEnum.js';
export default {
  props: {
    dataSource: {
      type: Object,
      default: null
    },
    list: {
      type: [Object, Array],
      default: null
    },
    marketingType: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      env: 'env'
    }),
    isCardPack() {
      return this.marketingType === 'card-pack';
    }
  },
  filters: {
    money(mony) {
      return !!mony ? mony / 100 : 0;
    }
  },
  data() {
    return {
      decorateStyleEnum
    };
  }
};
</script>

<style lang="less" scoped>
.common-module {
  .goods-list-ve {
    display: block;
    background: rgba(255, 255, 255, 1);
  }

  // 水平滑动
  .goods-list-hz {
    display: block;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    font-size: 0px;
    box-sizing: border-box;

    .goods-hz {
      width: 36%;
      padding: 0 7px 0 0;
      overflow: hidden;
      display: inline-block;
      position: relative;

      .goods-img {
        width: 100%;
        height: 112px;
        border-radius: 5px 5px 0px 0px;
        img {
          width: 110px;
          height: 112px;
        }
      }
      .goods-name {
        width: 100%;
        margin-top: 5px;
        font-size: 12px;
        color: rgba(51, 51, 51, 1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .goods-price {
        font-size: 14px;
        color: rgba(255, 60, 0, 1);
        font-weight: 600;
        margin-top: 10px;
      }
      .goods-content {
        background: #fff;
        padding: 1px 5px 4px;
        border-radius: 0px 0px 5px 5px;
      }
    }
  }

  // 经典列表
  .goods-item {
    padding: 10px 0;
    position: relative;
    font-size: 0;
    -webkit-text-size-adjust: none;
    .goods-img {
      display: inline-block;
      width: 124px;
      height: 124px;
      border-radius: 6px;
      margin-left: 1px;
      img {
        width: 124px;
        height: 124px;
      }
    }
    .goods-chart {
      position: absolute;
      bottom: 19px;
      right: 7px;
      display: inline-block;
      width: 30px;
      height: 30px;
      background: #ee7700;
      border-radius: 50%;
      img {
        width: 30px;
        height: 30px;
      }
    }
    .goods-info-box {
      position: relative;
      display: inline-block;
      overflow: hidden;
      vertical-align: top;
      max-width: 195px;
      width: 195px;
      height: 124px;
      margin-left: 10px;
      .group-num {
        display: inline-block;
        text-align: center;
        width: 45px;
        height: 18px;
        line-height: 18px;
        font-size: 12px;
        background: #ffefea;
        border-radius: 15px;
        color: #f35f28;
        border: 1px solid #f35f28;
        margin-right: 5px;
      }
      .goods-name {
        font-size: 14px;
        font-family: PingFangSC-Semibold;
        color: #33373e;
        line-height: 20px;
      }
      .goods-desc {
        font-size: 10px;
        height: 14px;
        .tag {
          width: 28px;
          height: 14px;
          line-height: 14px;
          color: #657eff;
          background: rgba(101, 126, 255, 0.3);
        }
      }
      .goods-label {
        position: absolute;
        bottom: 0;
      }
      .price-container {
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 60, 0, 1);
        span {
          color: rgba(216, 216, 216, 1);
          margin-left: 10px;
          font-size: 12px;
          text-decoration: line-through;
        }
      }
    }
  }
}

// 一行n个
.goods-list-onetorow {
  padding: 0px 0px 10px 0px;
  margin-bottom: 10px;

  .goods-list-onetorow-container {
    .goods-content {
      background: #fff;
      // padding: 1px 5px 7px;
      padding-bottom: 10px;
      border-radius: 0px 0px 5px 5px;
    }
    .goods-onetorow {
      box-sizing: border-box;
      margin-bottom: 6px;
      border-radius: 2px;
      overflow: hidden;
      font-size: 0px;
      position: relative;
      box-shadow: 0px 4px 10px 0px rgba(82, 96, 112, 0.11);
    }
    .goods-onetorowOne {
      width: 100%;
    }
    .goods-onetorowTwo {
      width: calc(50% - 3px);

      .group-box {
        font-size: 13px;
      }
      .goods-name {
        height: 50px;
      }
    }
    .goods-onetorowThree {
      width: calc(33.33% - 3px);
      float: left;
      margin-right: 4px;
    }
    & > .goods-onetorowTwo:nth-child(2n + 1) {
      float: left;
    }
    & > .goods-onetorowTwo:nth-child(2n) {
      float: right;
    }
    & > .goods-onetorowThree:nth-child(3n) {
      margin-right: 0;
    }
    .goods-onetorowOne .img {
      width: 100%;
      height: 168px;
    }
    .img {
      width: 100%;
      height: 112px;
      border-radius: 5px 5px 0px 0px;
    }
    .group-box {
      text-align: left;
      height: 25px;
      line-height: 25px;
      background: linear-gradient(90deg, rgba(255, 177, 111, 1) 0%, rgba(243, 95, 40, 1) 100%);
      border-radius: 0px 0px 2px 2px;
      padding-left: 10px;
      font-size: 16px;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);

      .goods-sign {
        display: inline-block;
        width: 18px;
        height: 18px;
        line-height: 18px;
        background: rgba(255, 255, 255, 0.17);
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        margin-right: 10px;
      }
    }
    .goods-sale-label {
      font-size: 18px;
      color: #f35f28;
    }
    .goods-name {
      padding: 8px 8px 0;
      width: 100%;
      box-sizing: border-box;
      font-size: 13px;
      font-weight: 400;
      color: rgba(55, 58, 68, 1);
    }

    .goods-price {
      font-size: 18px;
      color: rgba(255, 60, 0, 1);
      font-weight: 600;
      margin-top: 14px;
      margin-left: 8px;
      display: flex;
      align-items: center;
    }
    .sale-count {
      margin-left: 8px;
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #8893a6;
      margin-top: 4px;
    }
  }

  .row-two-box {
    display: flex;
    align-items: center;
    padding: 8px;
    .two-goods-price {
      display: inline-block;
      width: 83px;
      height: 34px;
      border-radius: 5px 0px 0px 5px;
      border: 2px solid rgba(255, 243, 239, 1);
      font-size: 18px;
      text-align: center;
      font-weight: 600;
      color: #f35f28;
    }
    .two-goods-btn {
      display: inline-block;
      width: 83px;
      height: 34px;
      line-height: 34px;
      background: rgba(243, 95, 40, 1);
      border-radius: 0px 5px 5px 0px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: #fff;
    }
  }
}

.sale-count {
  font-size: 12px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #8893a6;
}

.goods-sign {
  display: inline-block;
  width: 18px;
  height: 18px;
  line-height: 18px;
  background: linear-gradient(90deg, rgba(255, 177, 110, 1) 0%, rgba(243, 95, 40, 1) 100%);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  text-align: center;
}

.goods-label-price {
  font-size: 12px;
  font-weight: 400;
  color: #8893a6;
  text-decoration: line-through;
  margin-left: 5px;
}

.goods-btn {
  position: absolute;
  right: 10px;
  bottom: 12px;
  width: 78px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #f35f28;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #fff;
}

.cut-price {
  position: absolute;
  top: 0;
  left: 20px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  background: url('../../../../images/cut-icon.png') no-repeat top center / cover;

  .cut-price-desc {
    font-size: 12px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
  }
}

.sale-label {
  display: inline-block;
  text-align: center;
  padding: 2px 8px;
  font-size: 12px;
  background: rgba(255, 239, 234, 1);
  border-radius: 2px;
  color: #f35f28;
  margin-top: 4px;
  margin-right: 5px;
  margin-bottom: 14px;
}

.clearfix:after {
  display: block;
  clear: both;
  content: '';
  visibility: hidden;
  height: 0;
}
.clearfix {
  zoom: 1;
}

// 代金卡包
.sale-subtitle {
  margin-top: 5px;
  color: #8893a6;
  font-size: 13px;
  padding: 0 8px;
  height: 20px;
  line-height: 20px;
}

.sale-limit {
  display: inline-block;
  line-height: 16px;
  color: #fff;
  font-size: 9px;
  background: linear-gradient(180deg, #ff693c 0%, #ff381c 100%);
  border-radius: 10px 10px 0px 10px;
  padding: 0 5px;
  margin-right: 6px;
}
.card-pack-module {
  .goods-onetorowOne {
    .goods-name {
      font-size: 16px;
    }
  }

  .goods-content {
    padding-bottom: 0;
  }

  .card-pack-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: -10px;
    .goods-price {
      margin-top: 0;
      display: block;
    }
    .goods-btn {
      position: static;
      width: 66px;
      height: 27px;
      line-height: 27px;
      font-size: 12px;
    }
    .goods-label-price {
      display: inline-block;
      vertical-align: top;
      margin-top: -2px;
    }
    .goods-btn-box {
      margin-right: 5px;
    }
    .sale-count {
      margin-top: 3px;
      text-align: right;
    }
  }
  .goods-list-hz {
    .card-pack-content {
      margin-bottom: -5px;
    }
  }
  .price-container > span,
  .goods-label-price {
    display: none;
  }
}
</style>
