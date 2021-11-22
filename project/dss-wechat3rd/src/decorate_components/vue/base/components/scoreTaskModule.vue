<template>
  <div
    class="scoreTaskModule"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
    }"
  >
    <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
    <div class="haggle-module-container" v-if="dataSource.data.length">
      <div v-for="(item, index) in computeDataList" :key="index" class="item clearfix">
        <div class="title-style">
          <img class="cover-img" :src="item.wkCoverUrl" alt />
          <div class="content">
            <div class="title">活动标题ABC123</div>
            <div class="score">+10积分</div>
          </div>
          <div class="btn">去完成</div>
        </div>
      </div>
    </div>
    <div class="no-data" v-else>
      <div>点击编辑积分任务</div>
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

    .haggle-module-container {
      height: 100%;

      .item {
        padding: 8px 13px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;

        .cover-img {
          width: 88px;
          height: 88px;
          background: #ebf2fb;
          border-radius: 6px;
        }

        .content {
          margin-left: 8px;
          line-height: 22px;

          .title {
            margin-bottom: 16px;
            margin-top: 3px;
            height: 44px;
            color: #33373e;
            font-size: 16px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }

          .score {
            color: #f35f28;
            font-size: 20px;
            font-weight: 500;
          }
        }

        .btn {
          position: absolute;
          bottom: 8px;
          right: 8px;
          text-align: center;
          width: 84px;
          height: 32px;
          line-height: 32px;
          border: 1px solid #fa7516;
          color: #fa7516;
          border-radius: 4px;
        }
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
    // 突出标题样式

    .title-style {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      border-radius: 16px;
    }
  }
</style>
