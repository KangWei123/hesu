<template>
  <div
    class="haggle-single-module"
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
      <marketing-style-module :data-source="dataSource" :list="computeDataList" />
    </div>
    <div class="no-data" v-else>
      <div>点击编辑砍价</div>
    </div>
  </div>
</template>

<script>
  import textNavModule from './textNavModule.vue';
  import service from '@/dss-wechat3rd/src/api/index';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields';
  import ImageFilter from './image-filter';
  import MarketingStyleModule from '../base_style_components/marketingStyleModule.vue';

  export default {
    name: 'HaggleModule',
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
            name: item.activityName,
            wkThumbnail: item.thumbnail,
            salePrice: item.salePrice,
            labelPrice: item.lowestPrice,
            saleAmount:
              item.virtualPeople + item.assistCount > 9999
                ? '9999+'
                : item.virtualPeople + item.assistCount + '人正在砍价',
            saleLabel: '最低价：',
            topSign: '砍',
            btn: '立即砍价',
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
          const ids = data.map(i => i.id);
          service
            .idsForHaggleList({
              ids: ids.join(','),
            })
            .then(res => {
              // eslint-disable-next-line vue/no-mutating-props
              this.dataSource.data = utils.saveAvailableFields(res.data, fields.haggle);
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
  .haggle-single-module {
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
  }
</style>
