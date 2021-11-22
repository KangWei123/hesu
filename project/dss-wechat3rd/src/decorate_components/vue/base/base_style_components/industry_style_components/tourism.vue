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
          <div
            v-if="type.value === goodsTypeEnum.rooms.value || type.value === goodsTypeEnum.ticket.value"
            class="sale-label"
          >
            <span>{{ type.value === goodsTypeEnum.rooms.value ? '床型:1.8*2.0' : '特色标签' }}</span>
          </div>
          <div class="goods-label">
            <div class="price-container">
              ￥{{ data.item.salePrice | money }}<span>￥{{ data.item.labelPrice | money }}</span>
            </div>
          </div>
        </div>
        <div class="goods-btn">{{ type.value === goodsTypeEnum.rooms.value ? '预订' : '预约' }}</div>
      </template>

      <!-- 滑动 -->
      <template #horizon="data">
        <div
          class="goods-img"
          :style="{ background: 'transparent url(' + data.item.wkThumbnail + ') no-repeat center center / cover' }"
        ></div>
        <div class="goods-content">
          <div class="goods-name limit-line-ellipsis">{{ data.item.name }}</div>
          <div class="goods-price">￥{{ data.item.salePrice | money }}</div>
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
          <div
            v-if="type.value === goodsTypeEnum.rooms.value || type.value === goodsTypeEnum.ticket.value"
            class="sale-label"
          >
            <span>{{ type.value === goodsTypeEnum.rooms.value ? '床型:1.8*2.0' : '特色标签' }}</span>
          </div>
          <div class="goods-price">
            ￥{{ data.item.salePrice | money }}<span class="label-price">￥{{ data.item.labelPrice | money }}</span>
          </div>
          <div class="goods-btn">{{ type.value === goodsTypeEnum.rooms.value ? '预订' : '预约' }}</div>
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
          <div
            v-if="type.value === goodsTypeEnum.rooms.value || type.value === goodsTypeEnum.ticket.value"
            class="sale-label"
          >
            <span>{{ type.value === goodsTypeEnum.rooms.value ? '床型:1.8*2.0' : '特色标签' }}</span>
          </div>
          <div class="goods-price-info">
            <div class="goods-price">￥{{ data.item.salePrice | money }}</div>
            <div class="goods-btn">{{ type.value === goodsTypeEnum.rooms.value ? '预订' : '预约' }}</div>
            <div class="footer-content">
              <span class="label-price">￥{{ data.item.labelPrice | money }}</span>
            </div>
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
          <div class="goods-price">￥{{ data.item.salePrice | money }}</div>
        </div>
      </template>
    </goods-style-module>
  </div>
</template>

<script>
import GoodsStyleModule from '../goodsStyleModule.vue';
import addImg from '@/dss-wechat3rd/src/images/ic-add-cart.png';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
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
      addImg,
      goodsTypeEnum
    };
  }
};
</script>

<style lang="less" scoped>
.goods-list-onetorow {
  .goods-onetorowTwo {
    .goods-btn {
      right: 0;
      bottom: 0;
    }
  }
}
</style>
