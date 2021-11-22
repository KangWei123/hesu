<template>
  <div
    class="seckill-module"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
    }"
  >
    <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
    <div
      class="seckill-module-container"
      :style="{ padding: '0 ' + dataSource.componentsPadding + 'px' }"
      v-if="dataSource.data.length"
    >
      <marketing-style-module :data-source="dataSource" :list="computeDataList" />
    </div>
    <div class="no-data" v-else>
      <div>点击编辑秒杀</div>
    </div>
  </div>
</template>

<script>
  import textNavModule from './textNavModule.vue';
  import service from '@/dss-wechat3rd/src/api/index';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields';
  import { seckillActivityStatus } from '@/dss-wechat3rd/src/constants/enum';
  import ImageFilter from './image-filter';
  import MarketingStyleModule from '../base_style_components/marketingStyleModule.vue';

  const dealPrice = (price, position) => {
    let result = 0;
    if (price && price.indexOf('-') !== -1) {
      result = price.split('-')[0]; // 划线价取最低价格
    } else {
      result = parseFloat(price);
    }
    return result;
  };
  export default {
    name: 'SeckillModule',
    components: {
      textNavModule,
      MarketingStyleModule,
    },
    data() {
      return {
        queueId: '',
        time: 1000000, // 单位S
        status: seckillActivityStatus,
      };
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
            tipLabel: '距离结束：09:09:09',
            wkThumbnail: item.thumbnail,
            salePrice: dealPrice(item.priceRange) * 100,
            labelPrice: item.salePrice,
            saleAmount: item.salesVolume > 999 ? '已秒999+件' : '已秒' + item.salesVolume + '件',
            saleLabel: '秒杀价：',
            sign: '秒',
            btn: item.status === this.status.NOT_STARTED ? '即将开抢' : '立即秒杀',
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
            this.addWkbImage(newVal, 'thumbnail', 'wkThumbnail');
          }
        },
      },
    },

    mounted() {
      this.getList();
    },

    methods: {
      getList() {
        const data = this.dataSource.data;
        if (data && data.length) {
          const a = utils.pickUpItemNos(data, 'id');
          service
            .activityIdsForseckillList({
              activityIdList: a.join(','),
              statusList: seckillActivityStatus.NOT_STARTED + ',' + seckillActivityStatus.ON_GOING,
            })
            .then(res => {
              // eslint-disable-next-line vue/no-mutating-props
              this.dataSource.data = utils.saveAvailableFields(res.data, fields.seckill);
            });
        }
      },
      addWkbImage(items, originKey, addKey) {
        (items || []).forEach(item => {
          if (item[originKey]) {
            const originImage = item[originKey];
            // const reg = new RegExp('https://.*?com', '');
            // item[addKey] = originImage.replace(reg, '');
            item[addKey] = ImageFilter(originImage);
          }
        });
      },
    },
  };
</script>

<style lang="less">
  .seckill-module {
    background-color: white;
    .seckill-module-container {
      height: 100%;
    }

    .no-data {
      height: 145px;
      background-color: #f1f4f9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #303133;
    }
  }
</style>
