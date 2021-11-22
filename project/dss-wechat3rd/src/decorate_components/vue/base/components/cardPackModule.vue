<template>
  <div
    class="haggle-module"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
      background: dataSource.backgroundColor || 'white',
    }"
  >
    <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
    <div
      class="haggle-module-container"
      v-if="dataSource.data.length"
      :style="{ padding: '0 ' + dataSource.componentsPadding + 'px' }"
    >
      <marketing-style-module
        :data-source="dataSource"
        :list="computeDataList"
        :marketing-type="goodsTypeEnum['card-pack'].type"
      >
        <!-- 限购 -->
        <span class="sale-limit" slot="sale-limit" slot-scope="scope">{{ scope.item.limit }}</span>

        <!-- 一行两个、三个、滑动 -->
        <div class="card-pack-content" slot-scope="scope" slot="card-pack-content">
          <div class="goods-price">
            <div>￥{{ scope.item.salePrice | money }}</div>
          </div>
          <div class="goods-btn-box" v-if="scope.showBtn !== false">
            <div class="goods-btn">{{ scope.item.btn }}</div>
            <div class="sale-count">{{ scope.item.saleAmount }}</div>
          </div>
        </div>
      </marketing-style-module>
    </div>
    <div class="no-data" v-else>
      <div>点击编辑卡包</div>
    </div>
  </div>
</template>

<script>
  import textNavModule from './textNavModule.vue';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields';
  import ImageFilter from './image-filter';
  import MarketingStyleModule from '../base_style_components/marketingStyleModule.vue';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import cardPackApi from '@/dss-wechat3rd/src/api/cardPack';
  import { STATUS } from '@/dss-wechat3rd/src/constants/cardPackEnum';

  export default {
    name: 'CardPackModule',
    components: {
      textNavModule,
      MarketingStyleModule,
    },

    props: {
      dataSource: {
        type: Object,
        default: function () {
          return null;
        },
      },
    },

    filters: {
      money(val) {
        return parseFloat((val / 100).toFixed(2));
      },
    },

    computed: {
      computeDataList() {
        const data = this.baseDataList;

        const list = data.map(item => {
          return {
            name: item.name,
            wkThumbnail: item.itemImageUrls[0],
            salePrice: item.salePrice,
            subtitle: item.subtitle,
            saleAmount: `已售${item.cardSalesVolume || 0}`,
            limit: item.buyLimit ? `限购 ${item.buyLimit} 组` : '',
            btn: '立即购买',
          };
        });
        return list;
      },
      baseDataList() {
        return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
      },
    },

    watch: {
      baseDataList: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal) {
            this.addWkbImage(newVal, 'itemImageUrls', 'wkThumbnail');
          }
        },
      },
    },

    data() {
      return {
        goodsTypeEnum,
      };
    },

    mounted() {
      this.getList();
    },

    methods: {
      getList() {
        const data = this.dataSource.data;
        if (data && data.length) {
          const ids = utils.pickUpItemNos(data, 'id');

          cardPackApi
            .list({
              pageNo: 1,
              pageSize: ids.length,
              'statusList[0]': STATUS.INITIAL.value,
              'statusList[1]': STATUS.ONGOING.value,
              'statusList[2]': STATUS.SELL_OUT.value,
              pocketIds: ids.join(','),
            })
            .then(res => {
              // eslint-disable-next-line vue/no-mutating-props
              this.dataSource.data = utils.saveAvailableFields(res.data, fields.cardPack);
            });
        }
      },
      addWkbImage(items, originKey, addKey) {
        (items || []).forEach(item => {
          if (item[originKey]) {
            const originImage = item[originKey][0];
            // const reg = new RegExp('https://.*?com', '');
            // item[addKey] = originImage.replace(reg, '');
            item[addKey] = ImageFilter(originImage);
          }
        });
      },
    },
  };
</script>
