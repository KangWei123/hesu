<template>
  <div
    class="card-module"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
    }"
  >
    <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
    <div
      class="card-module-container"
      :style="{ 'padding-left': dataSource.componentsPadding + 'px' }"
      v-if="computeDataList && computeDataList.length"
    >
      <div class="dev-card-swiper-module">
        <div
          v-for="(item, index) in computeDataList"
          :key="index"
          class="card-preview"
          :class="{ 'recharge-card': item.type == 4 && !item.styleUrl, 'times-card': item.type == 3 && !item.styleUrl }"
          :style="item.wkStyleUrl | bgImage"
        >
          <!-- <div class="card-item"> -->
          <span class="card-name">{{ item.name }}</span>
          <span class="card-price">￥{{ item.salePrice | money }}</span>
          <span class="card-type">{{ computeCardType(item.type) }}</span>
          <!-- </div> -->
        </div>
      </div>
    </div>
    <div class="no-data" v-else>
      <div>点击编辑卡项</div>
    </div>
  </div>
</template>

<script>
  // require styles
  import 'swiper/dist/css/swiper.css';
  import textNavModule from './textNavModule.vue';
  import cardEnum from '@/dss-wechat3rd/src/constants/cardEnum';

  import service from '@/dss-wechat3rd/src/api/index';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields';
  import ImageFilter from './image-filter';

  export default {
    name: 'CardSwiperModule',
    props: {
      dataSource: {
        type: Object,
        default: function () {
          return null;
        },
      },

      title: {
        type: String,
        default: function () {
          return null;
        },
      },
    },

    watch: {
      'dataSource.data': {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          this.nowIndex = 0;
          if (newVal) {
            this.addWkbImage(newVal, 'styleUrl', 'wkStyleUrl');
          }
        },
      },
    },

    components: {
      textNavModule,
    },

    data() {
      return {
        env: true,
        swiperOption: {
          // 所有配置均为可选（同Swiper配置）
          slidesPerView: 2.5,
          spaceBetween: 10,
          freeMode: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        },
      };
    },

    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper;
      },
      computeDataList() {
        return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
      },
      computeCardType() {
        return function (type) {
          switch (type) {
            case cardEnum.cardType.timesCard:
              return '次数卡';
            case cardEnum.cardType.chargeCard:
              return '充值卡';
            default:
              return '未知卡类型';
          }
        };
      },
    },

    filters: {
      bgImage(val) {
        if (val) {
          return {
            backgroundImage: 'url(' + val + ')',
          };
        }
      },
      money(mony) {
        return mony ? mony / 100 : 0;
      },
    },

    mounted() {
      this.getList();
    },

    methods: {
      getList() {
        const data = this.dataSource.data;
        if (data && data.length) {
          service
            .itemNosForCardList({
              itemNo: utils.pickUpItemNos(data, 'itemNo').join(','),
            })
            .then(res => {
              // eslint-disable-next-line vue/no-mutating-props
              this.dataSource.data = utils.saveAvailableFields(res.data, fields.card);
            });
        }
      },

      addWkbImage(items, originKey, addKey) {
        (items || []).forEach(item => {
          if (item[originKey]) {
            const originImage = item[originKey];
            if (originImage) {
              // const reg = new RegExp('https://.*?com', '');
              // item[addKey] = originImage.replace(reg, '');
              item[addKey] = ImageFilter(originImage);
            }
          }
        });
      },
    },
  };
</script>

<style lang="less">
  .card-module {
    background-color: white;
    overflow: hidden;
    padding-bottom: 10px;
    box-sizing: border-box;
    .dev-card-swiper-module {
      display: flex;

      .card-preview {
        margin-right: 10px;
        width: 135px;
        height: 77px;
        flex-shrink: 0;
        position: relative;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        // .card-item {
        //   width: 135px;
        //   height: 77px;
        //   border-radius: 2px;
        //   position: relative;

        .card-name {
          display: inline-block;
          height: 15px;
          font-size: 12px;
          font-family: MicrosoftYaHei;
          color: rgba(255, 255, 255, 1);
          line-height: 15px;
          margin-left: 10px;
          margin-top: 8px;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-price {
          position: absolute;
          font-size: 12px;
          font-family: MicrosoftYaHei;
          color: rgba(255, 255, 255, 1);
          bottom: 8px;
          left: 10px;
          line-height: 13px;
        }

        .card-type {
          position: absolute;
          bottom: 8px;
          right: 15px;
          height: 13px;
          line-height: 13px;
          font-size: 10px;
          font-family: MicrosoftYaHei;
          color: rgba(255, 255, 255, 1);
        }
        // }
      }
      .recharge-card {
        background-image: url(../../../../images/card/recharge-card.png);
      }

      .times-card {
        background-image: url(../../../../images/card/times-card.png);
      }
    }

    .no-data {
      width: 100%;
      height: 77px;
      background-color: #f1f4f9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #303133;
    }
  }
</style>
