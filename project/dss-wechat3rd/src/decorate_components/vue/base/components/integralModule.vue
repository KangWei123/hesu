<template>
  <div
    class="integral-module"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
    }"
  >
    <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
    <div
      class="integral-module-container"
      v-if="dataSource.data.length"
      :style="{ padding: '0 ' + dataSource.componentsPadding + 'px' }"
    >
      <div v-for="(item, index) in computeDataList" :key="index" class="item clearfix">
        <div class="image" :style="{ 'background-image': 'url(' + item.wkThumbnail + ')' }"></div>
        <div class="right-content">
          <div class="title">{{ item.itemName }}</div>
          <div class="price-content">
            <span v-if="item.itemList && item.itemList.length"
              >{{ item.itemList[0].exchangeIntegral }}积分+{{ item.itemList[0].exchangePrice | price }}元</span
            >
          </div>
          <div class="footer">
            <span class="label-price">￥100</span>
            <span class="count">已售{{ item.paidNum }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="no-data" v-else>
      <div>点击编辑积分商城</div>
    </div>
  </div>
</template>

<script>
  import textNavModule from './textNavModule.vue';
  import service from '@/dss-wechat3rd/src/api/integral';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields';
  import ImageFilter from './image-filter';

  export default {
    name: 'HaggleModule',
    components: {
      textNavModule,
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
        return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
      },
    },

    watch: {
      computeDataList: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal) {
            this.addWkbImage(newVal, 'itemThumbnail', 'wkThumbnail');
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
          const params = {
            status: 1,
          };
          const a = utils.pickUpItemNos(data, 'id');
          a.forEach((item, index) => {
            params['activityIdList[' + index + ']'] = item;
          });
          service.list(params).then(res => {
            // eslint-disable-next-line vue/no-mutating-props
            this.dataSource.data = utils.saveAvailableFields(res.data, fields.integral);
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
  .integral-module {
    background-color: white;
    overflow: hidden;
    .integral-module-container {
      height: 100%;
      .item {
        padding: 15px 0px;
        box-sizing: border-box;
        border-top: 1px solid rgba(229, 233, 243, 0.4);
        .image {
          width: 100px;
          height: 100px;
          border-radius: 2px;
          background-color: transparent;
          background-size: cover;
          background-position: center center;
          float: left;
        }

        .right-content {
          width: calc(100% - 112px);
          float: right;
          position: relative;
          color: rgba(152, 152, 152, 1);

          .title {
            font-size: 15px;
            font-family: PingFangSC-Semibold;
            font-weight: 400;
            line-height: 22px;
            height: 44px;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            color: rgba(51, 55, 62, 1);
          }

          .price-content {
            margin-top: 12px;
            font-size: 15px;
            font-family: PingFangSC;
            font-weight: 600;
            color: rgba(243, 95, 40, 1);
          }
          .footer {
            color: #8893a6;
            font-size: 12px;
            margin-top: 2px;
            .label-price {
              text-decoration: line-through;
            }
            .count {
              float: right;
            }
          }
        }
      }

      .clearfix:after {
        display: block;
        content: '';
        clear: both;
        height: 0;
      }
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
