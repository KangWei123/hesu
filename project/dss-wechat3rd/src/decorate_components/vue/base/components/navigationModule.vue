<template>
  <div>
    <div class="no-data" v-if="!dataSource.list">图片导航</div>
    <div
      class="navigation-module"
      :class="dataSource.rowNum === 2 ? 'navigation-module-2' : ''"
      :style="
        'padding:' +
        dataSource.marginUp +
        'px ' +
        dataSource.marginLeftRight +
        'px ' +
        dataSource.marginDown +
        'px;border-radius:' +
        dataSource.radius +
        'px;background:' +
        dataSource.backgroundColor
      "
    >
      <div class="item-wrap" v-for="(item, index) in list" :class="'item-row-' + dataSource.rowNum" :key="index">
        <div class="item">
          <div
            class="img"
            :style="{
              'background-image': item.wkLogo ? `url(${item.wkLogo})` : 'none',
              'background-color': `${item.wkLogo ? '' : '#f5f7fa'}`,
              'border-radius': dataSource.circularCorner === 1,
            }"
          />
          <div class="name" v-if="item.name" :style="itemStyle">{{ item.name }}</div>
        </div>
      </div>
      <div class="down-angle" v-if="dataSource.list.length > dataSource.rowNum * 2">
        <img src="../images/down-angle.png" @click="clickToggleShow" />
      </div>
    </div>
  </div>
</template>
<script>
  import ImageFilter from './image-filter';

  export default {
    name: 'NavigationModule',
    data() {
      return {
        allShowed: false,
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
    watch: {
      'dataSource.list': {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal) {
            this.addWkbImage(newVal, 'logo', 'wkLogo');
          }
        },
      },
    },

    computed: {
      itemStyle() {
        return {
          color: this.dataSource.titleColor,
        };
      },
      list() {
        const { list, rowNum } = this.dataSource;
        if (this.allShowed) {
          return list;
        }
        return list.filter((i, idx) => idx < rowNum * 2);
      },
    },

    methods: {
      addWkbImage(items, originKey, addKey) {
        (items || []).forEach(item => {
          if (item[originKey]) {
            const originImage = item[originKey];
            // const reg = new RegExp('https://.*?com', '');
            // this.$set(item, addKey, originImage.replace(reg, ''));
            this.$set(item, addKey, ImageFilter(originImage));
            // item[addKey] = ImageFilter(originImage);
            // item[addKey] = ;
          }
        });
      },
      clickToggleShow() {
        this.allShowed = !this.allShowed;
      },
    },
  };
</script>
<style lang="less" scoped>
  .navigation-module {
    background: rgba(255, 255, 255, 1);
    font-size: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .navigation-module-2 {
    padding-left: 20px !important;
  }

  .navigation-module-2 .item-wrap {
    margin-top: 10px;
  }

  .item-wrap {
    // display: inline-block;
    margin-top: 5px;
  }

  .item-row-2 {
    width: 160px;
  }

  .item-row-4 {
    width: 25%;
  }

  .item-row-5 {
    width: 20%;
  }

  .item-row-2:nth-child(odd) {
    margin-right: 15px;
  }

  .item-row-2 .item {
    width: 100%;

    .img {
      width: 100%;
      height: 80px;
      border-radius: 4px;
    }

    .name {
      width: 100%;
      color: #343434;
      font-size: 15px;
      height: 21px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(52, 52, 52, 1);
      line-height: 21px;
      margin-top: 16px;
    }
  }

  .item {
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;

    .img {
      width: 44px;
      height: 44px;
      margin-bottom: 4px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    .name {
      width: 60px;
      overflow: hidden;
      white-space: nowrap;
      text-align: center;
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      height: 18px;
    }
  }

  .down-angle img {
    width: 17px;
    height: 10px;
  }

  .down-angle {
    margin: 4px auto 0;
    text-align: center;
  }

  .reverse {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
  }

  .no-data {
    width: 100%;
    height: 100px;
    line-height: 100px;
    background-color: rgb(78, 123, 229);
    text-align: center;
  }
</style>
