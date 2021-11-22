<template>
  <!-- showRectType字段已废弃，此处判断作为兼容使用 -->
  <div class="clearfix" :class="showClassType">
    <div :class="showItemType" v-for="(item, index) in list" :key="index">
      <slot :name="dataSource.display" :item="item" />
    </div>
  </div>
</template>

<script>
  import addImg from '@/dss-wechat3rd/src/images/ic-add-cart.png';

  export default {
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
      list: {
        type: [Object, Array],
        default: null,
      },
      type: {
        type: Object,
        default: null,
      },
      showAll: {
        type: Boolean,
        default: true,
      },
    },
    mounted() {
      if (!this.dataSource.hasOwnProperty('display')) {
        const showRectType = parseInt(this.dataSource.showRectType);
        if (showRectType === 1) {
          this.$set(this.dataSource, 'display', 'vertical');
        } else if (showRectType === 1) {
          this.$set(this.dataSource, 'display', 'oneRowTwo');
        }
        delete this.dataSource.showRectType;
      }
    },
    computed: {
      showClassType() {
        const classType = new Map([
          ['vertical', 'goods-list-ve'],
          ['horizon', 'goods-list-hz'],
          ['oneRowOne', 'goods-list-onetorow'],
          ['oneRowTwo', 'goods-list-onetorow'],
          ['oneRowThree', 'goods-list-onetorow'],
        ]);

        return classType.get(this.dataSource.display);
      },
      showItemType() {
        const itemType = new Map([
          ['vertical', 'goods-item'],
          ['horizon', 'goods-hz'],
          ['oneRowOne', 'goods-onetorowOne'],
          ['oneRowTwo', 'goods-onetorowTwo'],
          ['oneRowThree', 'goods-onetorowThree'],
        ]);

        return itemType.get(this.dataSource.display);
      },
    },
    data() {
      return {
        addImg,
      };
    },
  };
</script>

<style lang="less" scoped>
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
    font-size: 0;
    box-sizing: border-box;

    .goods-hz {
      width: 36%;
      padding: 0 8px 0 0;
      overflow: hidden;
      display: inline-block;
      position: relative;

      .goods-img {
        width: 100%;
        height: 98px;
        border-radius: 8px 8px 0 0;

        img {
          width: 98px;
          height: 98px;
        }
      }

      .goods-name {
        width: 100%;
        margin: 6px 0;
        font-size: 14px;
        color: rgba(51, 51, 51, 1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        color: #333;
        font-weight: 600;
      }

      .goods-price {
        font-size: 12px;
        color: #333;
        margin-top: 6px;
      }

      .goods-content {
        background: #f9f9f9;
        padding: 1px 5px 6px;
        border-radius: 0 0 8px 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .floor {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .all {
    font-size: 12px;
    color: rgba(216, 216, 216, 1);
    text-align: center;
    padding-bottom: 15px;
  }

  // 经典列表

  .goods-item {
    padding: 16px;
    position: relative;
    font-size: 0;
    -webkit-text-size-adjust: none;
    display: flex;

    .goods-img {
      display: inline-block;
      width: 60px;
      height: 60px;
      margin: 20px 16px 0 4px;

      img {
        width: 60px;
        height: 60px;
      }
    }

    .goods-tags {
      padding: 0 4px;
      height: 15px;
      line-height: 15px;
      background: #f5f7f9;
      border-radius: 1px;
      color: #6e93b8;
      font-size: 12px;
    }

    .goods-chart {
      position: absolute;
      bottom: 19px;
      right: 7px;
      display: inline-block;
      width: 30px;
      height: 30px;
      background: #e70;
      border-radius: 50%;

      img {
        width: 30px;
        height: 30px;
      }
    }

    .floor {
      padding: 0 6px;
      height: 22px;
      line-height: 22px;
      background: #f9f9f9;
      border: 1px solid #e8e8e8;
      border-radius: 1px;
      color: #333;
      font-size: 12px;
    }

    .goods-info-box {
      position: relative;
      display: inline-block;
      overflow: hidden;
      vertical-align: top;
      flex: 1;
      height: 104px;

      .goods-name {
        width: 100%;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 6px;
      }

      .goods-subName {
        width: 100%;
        font-size: 12px;
        color: #a4a4a4;
        margin-top: 4px;
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
        width: 100%;
        position: absolute;
        bottom: 0;
        display: flex;
        justify-content: space-between;
      }

      .price-container {
        font-size: 12px;
        color: #333;
      }
    }
  }

  // 一行n个

  .goods-list-onetorow {
    padding: 0 5px;

    .goods-content {
      background: #f9f9f9;
      padding: 1px 10px 7px;
      border-radius: 0 0 8px 8px;
    }

    .goods-onetorowOne,
    .goods-onetorowTwo,
    .goods-onetorowThree {
      box-sizing: border-box;
      margin-bottom: 6px;
      border-radius: 2px;
      overflow: hidden;
      font-size: 0;
      position: relative;
      box-shadow: 0 4px 10px 0 rgba(82, 96, 112, 0.11);
    }

    .goods-onetorowOne {
      width: 100%;

      .img {
        width: 100%;
        height: 168px;
      }

      .cart {
        width: 40px;
        height: 40px;

        img {
          width: 40px;
          height: 40px;
        }
      }
    }

    .goods-onetorowTwo {
      width: calc(50% - 3px);

      .goods-content {
        min-height: 100px;
        box-sizing: border-box;
      }

      .goods-price-info {
        position: absolute;
        bottom: 8px;
        width: 90%;
      }

      .footer-content {
        display: flex;
        justify-content: space-between;
        margin-left: -10px;
      }

      .cart {
        bottom: 22px;
      }

      .goods-btn {
        width: 72px;
        height: 26px;
        line-height: 26px;
        bottom: 8px;
      }

      .goods-label {
        width: 90%;
        position: absolute;
        bottom: 12px;
        display: flex;
        justify-content: space-between;
      }

      .price-container {
        font-size: 12px;
        color: #333;
      }
    }

    .goods-onetorowThree {
      width: calc(33.33% - 8px);
      float: left;
      margin-right: 8px;

      .img {
        width: 100%;
        height: 104px;
      }

      .goods-content {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .goods-name {
        text-align: center;
      }
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

    .img {
      width: 100%;
      height: 160px;
      border-radius: 8px 8px 0 0;
    }

    .goods-name {
      margin: 6px 0;
      width: 100%;
      box-sizing: border-box;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .goods-subName {
      width: 100%;
      font-size: 12px;
      color: #8b97a9;
    }

    .goods-price {
      font-size: 12px;
      color: #333;
      margin-top: 6px;
    }

    .floor {
      font-size: 12px;
      color: #999;
    }

    .label-price {
      color: rgba(216, 216, 216, 1);
      font-size: 12px;
      text-decoration: line-through;
      margin-left: 10px;
    }

    .sale-count {
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #8893a6;
    }

    .cart {
      position: absolute;
      bottom: 5px;
      right: 5px;
      display: inline-block;
      width: 30px;
      height: 30px;
      background: #e70;
      border-radius: 50%;

      img {
        width: 30px;
        height: 30px;
      }
    }
  }

  .goods-btn {
    position: absolute;
    right: 10px;
    bottom: 7px;
    width: 78px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: rgba(243, 95, 40, 1);
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #fff;
  }

  .sale-label {
    display: inline-block;
    text-align: center;
    padding: 2px 8px;
    font-size: 12px;
    background: rgba(255, 239, 234, 1);
    border-radius: 2px;
    color: #f35f28;
    margin-top: 10px;
  }

  .clearfix::after {
    display: block;
    clear: both;
    content: '';
    visibility: hidden;
    height: 0;
  }

  .clearfix {
    zoom: 1;
  }
</style>
