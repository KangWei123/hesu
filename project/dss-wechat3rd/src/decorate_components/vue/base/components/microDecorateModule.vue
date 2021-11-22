<template>
  <div
    class="micro-decorate-module"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
    }"
  >
    <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
    <div
      class="micro-decorate-module-container"
      v-if="dataSource.data.length"
      :style="{ padding: '0 ' + dataSource.componentsPadding + 'px' }"
    >
      <div class="item" v-for="(item, index) in computeDataList" :key="index">
        <div class="img-box">
          <img :src="item.thumbnail" />
          <div class="vr-label" v-if="item.vrUrl"></div>
        </div>
        <div class="content">
          <div class="name limit-line-ellipsis">{{ item.name }}</div>
          <div class="info">
            <div class="info-item">
              <div class="info-item">
                <img src="../../../../images/marketing/micro-decorate/icon-appointment.png" width="16" />{{
                  item.appointmentNum
                }}人预约
              </div>
              <div class="info-item ml20">
                <img src="../../../../images/marketing/micro-decorate/icon-view.png" width="16" />{{ item.viewNum }}
              </div>
            </div>
            <div class="info-item">
              <img src="../../../../images/marketing/micro-decorate/icon-like.png" width="16" />{{ item.approvalNum }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="no-data" v-else>
      <div>点击编辑微装</div>
    </div>
  </div>
</template>

<script>
  import textNavModule from './textNavModule.vue';
  import microDecorate from '@/dss-wechat3rd/src/api/micro-decorate';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index.js';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields.js';
  import ImageFilter from './image-filter';
  export default {
    name: 'MicroDecorateModule',
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
      computeDataList: {
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
          const ids = utils.pickUpItemNos(data, 'id');

          const params = {
            pageSize: ids.length,
            status: 1,
            isShelf: 1,
            idString: ids.join(','),
          };

          microDecorate.list(params).then(res => {
            // eslint-disable-next-line vue/no-mutating-props
            this.dataSource.data = utils.saveAvailableFields(res.data, fields.microDecorate);
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
  .micro-decorate-module {
    .item {
      margin-bottom: 10px;
      border-radius: 2px;
      overflow: hidden;
      &:last-child {
        margin: 0;
      }
    }
    .img-box {
      position: relative;
      height: 195px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .vr-label {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 118px;
      height: 38px;
      background: url(../../../../images/marketing/micro-decorate/icon-vr.png) no-repeat center/100% 100%;
      transform: translate(-50%, -50%);
    }
    .content {
      padding: 5px 12px 12px;
      background: #fff;
      font-size: 12px;
      color: #8893a6;
      .name {
        font-size: 15px;
        font-family: PingFangSC, PingFangSC-Semibold;
        font-weight: 600;
        color: #33373e;
      }
      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .info-item {
        display: flex;
        align-items: center;

        img {
          margin-right: 2px;
        }
      }
    }
    .ml20 {
      margin-left: 20px;
    }
  }
  .no-data {
    height: 145px;
    background-color: rgb(78, 123, 229);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: white;
  }
</style>
