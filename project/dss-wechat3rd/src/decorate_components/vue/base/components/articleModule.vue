<template>
  <div
    class="articleModule"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
    }"
  >
    <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
    <div class="haggle-module-container" v-if="dataSource.data.length">
      <div v-for="(item, index) in computeDataList" :key="index" class="item clearfix">
        <!-- 突出标题 -->
        <template v-if="dataSource.graphicStyle !== 'image'">
          <div class="title-style">
            <div class="title-content">
              <div class="title">{{ item.title }}</div>
              <div class="title-footer">
                <div class="title-footer-comment">
                  <div style="margin-right: 10px"><span class="icon like-icon"></span>0</div>
                  <div style="margin-right: 10px"><span class="icon comment-icon"></span>0</div>
                </div>
                <div class="time">{{ (item.updateTime || '').substr(0, 10) }}</div>
              </div>
            </div>
            <img class="cover-img" :src="item.wkCoverUrl" alt />
          </div>
        </template>
        <!-- 突出图片 -->
        <template v-else>
          <div class="card-style">
            <div class="card-image" :style="'background-image: url(' + item.wkCoverUrl + ');'" />
            <div class="card-title">{{ item.title }}</div>
            <div class="card-footer">
              <div class="card-footer-comment">
                <div style="margin-right: 10px"><span class="icon like-icon"></span>0</div>
                <div style="margin-right: 10px"><span class="icon comment-icon"></span>0</div>
              </div>
              <div class="time">{{ (item.updateTime || '').substr(0, 10) }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="no-data" v-else>
      <div>点击编辑营销图文</div>
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
    name: 'MarketingGraph',
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
    mounted() {
      this.getList();
    },

    methods: {
      getList() {
        const data = this.dataSource.data;
        if (data && data.length) {
          const itemNos = utils.pickUpItemNos(data, 'id');
          service
            .idForArticleList({
              ids: itemNos.join(','),
            })
            .then(res => {
              // eslint-disable-next-line vue/no-mutating-props
              this.dataSource.data = utils.saveAvailableFields(res.data, fields.article);
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
  .articleModule {
    background-color: white;
    overflow: hidden;
    .haggle-module-container {
      height: 100%;
      .item {
        // padding: 20px;
        padding: 0px 10px 10px;
        box-sizing: border-box;
        border-top: 1px solid rgba(255, 255, 255, 0.3);
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          font-size: 14px;
          font-weight: 500;
          color: #333333;
          flex-grow: 1;
          // width: 228px;
          height: 44px;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .cover-img {
          width: 90px;
          height: 74px;
          border-radius: 8px;
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

    // 突出图片样式
    .card-style {
      width: 100%;
      background: #ffffff;
      // box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
      box-shadow: 0px 2px 18px 0px rgba(134, 133, 133, 0.3);
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
      // align-items: center;
      border-radius: 8px;
      .card-image {
        width: 100%;
        height: 120px;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        border-radius: 8px 8px 0px 0px;
      }
      .card-title {
        margin: 10px 0;
        padding: 0 10px;
        width: 100%;
        box-sizing: border-box;
        display: inline-block;
        // width: 200px;
        overflow: hidden;
        /*文本不会换行*/
        // white-space: nowrap;
        /*当文本溢出包含元素时，以省略号表示超出的文本*/
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .card-footer {
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        margin-bottom: 10px;
        align-self: flex-start;

        .card-footer-comment {
          float: left;
          display: flex;
        }

        .time {
          float: right;
        }
      }
    }
    // 突出标题样式
    .title-style {
      // border-bottom: 1px solid #eee;
      width: 100%;
      box-sizing: border-box;
      // padding-bottom: 8px;
      padding: 15px 15px 10px;
      display: flex;
      border-radius: 16px;
      box-shadow: 0px 2px 18px 0px rgba(134, 133, 133, 0.3);
      // flex-direction: column;
    }
    .title-content {
      box-sizing: border-box;
      // border-top: 1px solid rgba(255, 255, 255, 0.3);
      width: calc(100% - 90px);
      padding-right: 30px;
      // display: flex;
      // justify-content: space-between;
      // align-items: center;
    }

    .title-footer {
      height: 30px;
      line-height: 30px;
      margin-top: 6px;

      .title-footer-comment {
        float: left;
        display: flex;
      }

      .time {
        float: right;
      }
    }

    .icon {
      width: 14px;
      height: 14px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
    }

    .like-icon {
      background: url('../../../../images/marketing/micro-decorate/like-icon.png') no-repeat;
      background-size: 14px;
    }

    .comment-icon {
      background: url('../../../../images/marketing/micro-decorate/comment-icon.png') no-repeat;
      background-size: 14px;
    }
  }
</style>
