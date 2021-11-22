<template>
  <div
    class="product-serve-container"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
      background: dataSource.backgroundColor || 'white',
    }"
  >
    <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
    <div
      class="goods-module"
      :style="{ padding: '0 ' + dataSource.componentsPadding + 'px' }"
      v-if="computeDataList && computeDataList.length"
    >
      <merchant :data-source="dataSource" :list="computeDataList" :type="type" />
    </div>
    <div class="no-data" v-else>
      <div>点击编辑商户</div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import textNavModule from './textNavModule.vue';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import addImg from '@/dss-wechat3rd/src/images/ic-add-cart.png';
  import ImageFilter from './image-filter';
  import Merchant from '../base_style_components/merchant/index.vue';
  import merchantApi from '@/dss-wechat3rd/src/api/merchant';

  export default {
    props: {
      dataSource: {
        type: Object,
        default: null,
      },

      type: {
        type: Object,
        default: null,
      },
    },
    components: {
      textNavModule,
      Merchant,
    },
    data() {
      return {
        addImg,
        goodsTypeEnum: goodsTypeEnum,
      };
    },
    watch: {
      computeDataList: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal) {
            this.addWkbImage(newVal, 'logo', 'wkThumbnail');
          }
        },
      },
    },

    computed: {
      ...mapState({
        env: 'env',
        curApp: 'curApp',
        curStore: 'curStore',
      }),
      computeDataList() {
        return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
      },
    },

    mounted() {
      this.getList();
    },

    methods: {
      getList() {
        const data = this.dataSource.data;
        if (data && data.length) {
          merchantApi.business
            .query({
              idList: utils.pickUpItemNos(data, 'id').join(','),
            })
            .then(res => {
              // eslint-disable-next-line vue/no-mutating-props
              this.dataSource.data = utils.saveAvailableFields(res.data, fields.merchant);
            });
        }
      },

      addWkbImage(items, originKey, addKey) {
        (items || []).forEach(item => {
          if (item.hasOwnProperty(originKey)) {
            const originImage = item[originKey];
            // const reg = new RegExp('https://.*?com', '');
            if (originImage) {
              // item[addKey] = originImage.replace(reg, '');
              item[addKey] = ImageFilter(originImage);
            }
          }
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .product-serve-container {
    background-color: white;
    overflow: hidden;

    .no-data {
      width: 100%;
      height: 193px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #909399;
    }
  }
</style>
