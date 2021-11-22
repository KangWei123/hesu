<template>
  <div>
    <goods-style-module :dataSource="dataSource" :list="list" :type="type">
      <!-- 经典列表 -->
      <template #vertical="data">
        <div
          class="goods-img"
          :style="{ background: 'transparent url(' + data.item.wkThumbnail + ') no-repeat center center / cover' }"
        ></div>
        <div class="goods-info-box">
          <div class="goods-name limit-line-ellipsis line-2">{{ data.item.name }}</div>
          <div class="goods-subName limit-line-ellipsis">{{ data.item.subName }}</div>
          <div class="sale-label"><span>特色标签</span></div>
          <div class="goods-label">
            <div class="price-container">
              <span class="unit">￥</span>{{ data.item.salePrice | money }}<span class="unit">/㎡</span>
            </div>
          </div>
        </div>
        <div class="goods-btn">立即认筹</div>
      </template>

      <!-- 滑动 -->
      <template #horizon="data">
        <div
          class="goods-img"
          :style="{ background: 'transparent url(' + data.item.wkThumbnail + ') no-repeat center center / cover' }"
        ></div>
        <div class="goods-content">
          <div class="goods-name limit-line-ellipsis">{{ data.item.name }}</div>
          <div class="goods-price">
            <span class="unit">￥</span>{{ data.item.salePrice | money }}<span class="unit">/㎡</span>
          </div>
        </div>
      </template>

      <!-- 一行一个 -->
      <template #oneRowOne="data">
        <div
          class="img"
          :style="{ background: 'transparent url(' + data.item.wkThumbnail + ') no-repeat center center / cover' }"
        ></div>
        <div class="goods-content">
          <div class="goods-name limit-line-ellipsis line-2">{{ data.item.name }}</div>
          <div class="goods-subName limit-line-ellipsis">{{ data.item.subName }}</div>
          <div class="sale-label"><span>特色标签</span></div>
          <div class="goods-price">
            <span class="unit">￥</span>{{ data.item.salePrice | money }}<span class="unit">/㎡</span>
          </div>
          <div class="goods-btn">立即认筹</div>
        </div>
      </template>

      <!-- 一行两个 -->
      <template #oneRowTwo="data">
        <div
          class="img"
          :style="{ background: 'transparent url(' + data.item.wkThumbnail + ') no-repeat center center / cover' }"
        ></div>
        <div class="goods-content">
          <div class="goods-name limit-line-ellipsis line-2">{{ data.item.name }}</div>
          <div class="goods-subName limit-line-ellipsis">{{ data.item.subName }}</div>
          <div class="sale-label"><span>特色标签</span></div>
          <div class="goods-price-info">
            <div class="goods-price">
              <span class="unit">￥</span>{{ data.item.salePrice | money }}<span class="unit">/㎡</span>
            </div>
            <div class="goods-btn">立即认筹</div>
          </div>
        </div>
      </template>

      <!-- 一行三个 -->
      <template #oneRowThree="data">
        <div
          class="img"
          :style="{ background: 'transparent url(' + data.item.wkThumbnail + ') no-repeat center center / cover' }"
        ></div>
        <div class="goods-content">
          <div class="goods-name limit-line-ellipsis line-1">{{ data.item.name }}</div>
          <div class="goods-price">
            <span class="unit">￥</span>{{ data.item.salePrice | money }}<span class="unit">/㎡</span>
          </div>
        </div>
      </template>
    </goods-style-module>
  </div>
</template>

<script>
import GoodsStyleModule from '../goodsStyleModule.vue';
import addImg from '@/dss-wechat3rd/src/images/ic-add-cart.png';
export default {
  components: {
    GoodsStyleModule
  },
  props: {
    dataSource: {
      type: Object,
      default: null
    },
    list: {
      type: [Object, Array],
      default: null
    },
    type: {
      type: Object,
      default: null
    }
  },
  filters: {
    money(mony) {
      return !!mony ? mony / 100 : 0;
    }
  },
  data() {
    return {
      addImg
    };
  }
};
</script>

<style lang="less" scoped>
.goods-list-ve {
  .goods-item {
    .goods-btn {
      width: 63px;
      height: 28px;
      line-height: 28px;
      font-size: 12px;
    }
  }
}

.goods-list-onetorow {
  .goods-onetorowTwo {
    .goods-btn {
      right: 0;
      bottom: 0;
      width: 63px;
      height: 28px;
      line-height: 28px;
      font-size: 12px;
    }
  }
}

.unit {
  font-size: 12px;
  color: rgba(255, 60, 0, 1);
  text-decoration: none;
  margin-left: 0;
}
</style>
