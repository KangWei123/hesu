<template>
  <div
    class="scoreTaskModule"
    :style="{
      background: dataSource.bgMode != 'default' ? dataSource.backgroundColor : '',
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
    }"
  >
    <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
    <div v-if="dataSource.data.length" :class="dataSource.display">
      <div v-for="(item, index) in computeDataList" :key="index" class="item">
        <img class="cover-img" :src="item.icon" alt />
        <div class="content">
          <div class="title">{{ item.name }}</div>
          <div class="score">{{ item.pointCost }}积分</div>
          <div class="price">{{ item.value ? '￥' : '' }}{{ item.value }}</div>
        </div>
        <div class="btn">立即兑换</div>
      </div>
    </div>
    <div class="no-data" v-else>
      <div>点击编辑权益商品</div>
    </div>
  </div>
</template>

<script>
  import textNavModule from './textNavModule.vue';
  import service from '@/dss-wechat3rd/src/api/index';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields';
  import ImageFilter from './image-filter';

  export default {
    name: 'ScoreTaskModule',
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
    computed: {
      computeDataList() {
        return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
      },
    },
    watch: {
      'dataSource.data': {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal) {
            this.addWkbImage(newVal, 'coverUrl', 'wkCoverUrl');
          }
        },
      },
    },
    mounted() {},

    methods: {
      addWkbImage(items, originKey, addKey) {
        (items || []).forEach(item => {
          if (item[originKey]) {
            const originImage = item[originKey];
            item[addKey] = ImageFilter(originImage);
          }
        });
      },
    },
  };
</script>

<style lang="less">
  .scoreTaskModule {
    background-color: white;
    overflow: hidden;

    // 列表

    .vertical {
      height: 100%;

      .item {
        padding: 8px 13px;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        // align-items: center;
        position: relative;

        .cover-img {
          width: 100px;
          height: 100px;
          border-radius: 6px;
        }

        .content {
          margin-left: 8px;
          line-height: 22px;

          .title {
            line-height: 22px;
            height: 44px;
            color: #33373e;
            font-size: 14px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }

          .score {
            margin-top: 16px;
            color: #f35f28;
            font-size: 16px;
            line-height: 22px;
            font-weight: 500;
          }

          .price {
            margin-top: 2px;
            font-size: 10px;
            font-weight: 400;
            text-decoration: line-through;
            color: #97a1b2;
            line-height: 14px;
          }
        }

        .btn {
          position: absolute;
          font-size: 14px;
          bottom: 8px;
          right: 8px;
          text-align: center;
          width: 84px;
          height: 32px;
          line-height: 32px;
          background: #fa7516;
          color: #fff;
          border-radius: 4px;
        }
      }
    }

    //滑动

    .horizon {
      box-sizing: border-box;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      position: relative;
      padding: 0 0 0 13px;

      .item {
        width: 150px;
        margin-right: 8px;

        .cover-img {
          display: block;
          width: 150px;
          height: 150px;
          background: #ebf2fb;
          border-radius: 6px 6px 0 0;
        }

        .content {
          line-height: 22px;

          .title {
            margin: 6px 10px 8px 10px;
            line-height: 18px;
            font-size: 13px;
            color: #33373e;
            font-size: 14px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }

          .score {
            color: #f35f28;
            font-size: 12px;
            line-height: 17px;
            font-weight: 500;
            margin: 0 0 9px 10px;
          }

          .price {
            display: none;
          }
        }

        .btn {
          display: none;
        }
      }
    }

    //大图

    .oneRowOne {
      .item {
        padding: 16px 5px 16px 5px;
        position: relative;

        .cover-img {
          display: block;
          width: 100%;
          height: 195px;
          background: #ebf2fb;
          border-radius: 6px 6px 0 0;
        }

        .title {
          margin: 8px 10px 0 10px;
          font-size: 15px;
          font-weight: 400;
          text-align: left;
          color: #33373e;
          line-height: 21px;
          height: 42px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .score {
          color: #f35f28;
          font-size: 14px;
          line-height: 17px;
          font-weight: 500;
          margin: 10px 0 9px 10px;
        }

        .price {
          font-size: 10px;
          font-weight: 400;
          text-decoration: line-through;
          color: #97a1b2;
          margin-left: 10px;
          line-height: 14px;
        }

        .btn {
          position: absolute;
          bottom: 16px;
          right: 16px;
          text-align: center;
          width: 84px;
          height: 32px;
          line-height: 32px;
          background: #fa7516;
          color: #fff;
          border-radius: 4px;
          font-size: 14px;
        }
      }

      .item:first-child {
        padding-top: 0;
      }
    }

    //1行2个

    .oneRowTwo {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      overflow: hidden;
      padding: 0 6px;

      .item {
        padding: 8px 0;
        margin-right: 7px;
        position: relative;
        box-sizing: content-box;
        width: calc(50% - 4px);

        .cover-img {
          display: block;
          width: 100%;
          height: 170px;
          background: #ebf2fb;
          border-radius: 6px 6px 0 0;
        }

        .title {
          margin: 6px 10px 11px 10px;
          font-size: 13px;
          color: #33373e;
          line-height: 18px;
          max-height: 36px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .score {
          color: #f35f28;
          font-size: 12px;
          line-height: 17px;
          font-weight: 500;
          margin: 0 0 5px 10px;
        }

        .price {
          font-size: 10px;
          font-weight: 400;
          text-decoration: line-through;
          color: #97a1b2;
          margin-left: 10px;
          line-height: 14px;
        }

        .btn {
          position: absolute;
          bottom: 8px;
          right: 8px;
          text-align: center;
          width: 64px;
          height: 24px;
          line-height: 24px;
          background: #fa7516;
          color: #fff;
          font-size: 12px;
          border-radius: 2px;
        }
      }

      .item:nth-child(2n) {
        margin-right: 0;
      }
    }

    //1行3个

    .oneRowThree {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      overflow: hidden;
      padding: 0 8px;

      .item {
        padding: 8px 0;
        margin-right: 6px;
        position: relative;
        box-sizing: content-box;
        width: calc(33.33% - 4px);

        .cover-img {
          display: block;
          width: 100%;
          height: 110px;
          background: #ebf2fb;
          border-radius: 6px 6px 0 0;
        }

        .title {
          margin: 6px 9px 4px 10px;
          font-size: 13px;
          color: #33373e;
          line-height: 18px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }

        .score {
          color: #f35f28;
          font-size: 16px;
          line-height: 17px;
          font-weight: 500;
          margin: 0 0 5px 10px;
        }

        .price {
          display: none;
        }

        .btn {
          display: none;
        }
      }

      .item:nth-child(3n) {
        margin-right: 0;
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
