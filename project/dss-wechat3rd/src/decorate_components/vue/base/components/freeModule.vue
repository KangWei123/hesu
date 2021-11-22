<template>
  <div
    class="haggle-module"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
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
        :marketing-type="goodsTypeEnum.gift.type"
      >
        <div class="slot-content" slot="custom-rowTwo">
          <div class="btn btn-two">立即领取</div>
        </div>
        <div class="slot-content" slot="custom-rowThree">
          <div class="btn btn-three">立即领取</div>
        </div>
      </marketing-style-module>
    </div>
    <div class="no-data" v-else>
      <div>点击编辑赠品</div>
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
  import giftApi from '@/dss-wechat3rd/src/api/gift';

  export default {
    name: 'FreeModule',
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
            wkThumbnail: item.thumbnail,
            skuName: item.attrValCombineName,
            memberLabel: item.levelName,
            limitAmount: item.everyoneLimitCount ? '限购' + item.everyoneLimitCount + '件' : 0,
            saleAmount: '已兑换' + item.receivedCount + '件',
            btn: '立即领取',
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
          giftApi
            .listActivity({
              idList: utils.pickUpItemNos(data, 'id').join(','),
            })
            .then(res => {
              console.log(res.data);
              // eslint-disable-next-line vue/no-mutating-props
              this.dataSource.data = utils.saveAvailableFields(res.data, fields.freeGoods);
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
  .haggle-module {
    background-color: white;
    overflow: hidden;
    .haggle-module-container {
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

    .btn {
      margin: 0 auto;
      background: rgba(243, 95, 40, 1);
      border-radius: 4px;
      font-weight: 500;
      color: #fff;
      text-align: center;
    }

    .btn-two {
      width: 130px;
      height: 34px;
      line-height: 34px;
      font-size: 16px;
    }

    .btn-three {
      width: 76px;
      height: 24px;
      line-height: 24px;
      font-size: 12px;
    }
  }
</style>
