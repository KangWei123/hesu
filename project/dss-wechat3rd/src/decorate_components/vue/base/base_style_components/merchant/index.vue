<template>
  <div>
    <merchant-style-module :data-source="dataSource" :list="list" :type="type" :show-all="showAll">
      <!-- 经典列表 -->
      <template #vertical="data">
        <div
          class="goods-img"
          :style="{ background: 'transparent url(' + data.item.wkThumbnail + ') no-repeat center center / cover' }"
        ></div>
        <div class="goods-info-box">
          <div class="goods-name limit-line-ellipsis line-2">{{ data.item.name }}</div>
          <span class="goods-tags">{{ data.item.tenantCategoryName }}</span>
          <div class="goods-subName limit-line-ellipsis">{{ data.item.subtitle }}</div>
          <div class="goods-label">
            <div class="price-container">
              <span>人均：{{ data.item.avgConsume }}元</span>
            </div>
            <span class="floor">{{ data.item.floor }} - {{ data.item.mallStoreCode }}</span>
          </div>
        </div>
      </template>

      <!-- 滑动 -->
      <template #horizon="data">
        <div
          class="goods-img"
          :style="{ background: 'transparent url(' + data.item.wkThumbnail + ') no-repeat center center / cover' }"
        ></div>
        <div class="goods-content">
          <div class="goods-name limit-line-ellipsis">{{ data.item.name }}</div>
          <div class="floor">{{ data.item.floor }} - {{ data.item.mallStoreCode }}</div>
          <div class="goods-price">人均：{{ data.item.avgConsume }}元</div>
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
          <div class="goods-price" v-if="!data.item.salesType">
            ￥{{ data.item.salePrice | money }}{{ data.item.mode === 1 ? `+${data.item.integralPrice}积分` : ''
            }}<span class="label-price">￥{{ data.item.labelPrice | money }}</span>
          </div>
          <div class="goods-price limit-line-ellipsis line-1" v-else>{{ data.item.displayPrice || '到店咨询' }}</div>
          <div v-if="dataSource.type === 'product'" class="sale-count">{{ data.item.virtualSalesVolume }}人已购买</div>
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
          <div class="goods-subName limit-line-ellipsis">{{ data.item.subtitle }}</div>
          <div class="goods-label">
            <div class="price-container">
              <span>人均：{{ data.item.avgConsume }}元</span>
            </div>
            <span class="floor">{{ data.item.floor }} - {{ data.item.mallStoreCode }}</span>
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
          <div class="goods-name limit-line-ellipsis">{{ data.item.name }}</div>
          <div class="floor">{{ data.item.floor }} - {{ data.item.mallStoreCode }}</div>
          <div class="goods-price">人均：{{ data.item.avgConsume }}元</div>
        </div>
      </template>
    </merchant-style-module>
  </div>
</template>

<script>
  import MerchantStyleModule from './merchantStyleModule.vue';

  export default {
    components: {
      MerchantStyleModule,
    },
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
    filters: {
      money(mony) {
        return mony ? mony / 100 : 0;
      },
    },
  };
</script>
