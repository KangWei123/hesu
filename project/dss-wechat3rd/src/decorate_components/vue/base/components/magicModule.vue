<style lang="less">
  .magic-module {
    .magic-module-container {
      overflow: hidden;
      position: relative;
      box-sizing: border-box;
      height: 188px;

      .image {
        position: absolute;
        box-sizing: border-box;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
    .no-data {
      width: 100%;
      height: 188px;
      background-color: #f1f4f9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #303133;
    }
  }
</style>

<template>
  <div class="magic-module">
    <div
      class="magic-module-container"
      :style="{
        margin: dataSource.isMineCenter
          ? 0
          : dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      }"
      v-if="show"
    >
      <div class="image" v-for="(item, index) in dataSource.data" :key="index" :style="itemStyle(item)"></div>
    </div>
    <!-- 没有数据的时候 -->
    <div v-else class="no-data">
      <div>点击编辑魔方</div>
    </div>
  </div>
</template>
<script>
  import ImageFilter from './image-filter';
  export default {
    props: {
      dataSource: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        isShow: true,
        inv: 2000,
      };
    },

    computed: {
      show() {
        let x = false;
        (this.dataSource.data || []).forEach(element => {
          if (element.src) {
            x = true;
          }
        });
        return x;
      },
    },
    methods: {
      itemStyle(item) {
        this.addWkbImage(item, 'src', 'wkSrc');
        const margin = this.dataSource.margin;
        const componentsHeight = 188;
        const componentsPadding = this.dataSource.marginLeftRight || 0;
        const componentsWidth = 375 - componentsPadding * 2;

        let width = (parseInt(item.width) / 100) * componentsWidth;
        let height = (parseInt(item.height) / 100) * componentsHeight;
        let top = (parseInt(item.top) / 100) * componentsHeight;
        const left = (parseInt(item.left) / 100) * componentsWidth;

        if (item.width !== '100%' && item.width !== '33.33%' && item.width !== '25%') {
          width = width - margin / 2;
        } else if (item.width === '33.33%') {
          width = (componentsWidth - margin * 2) / 3;
        } else if (item.width === '25%') {
          width = (componentsWidth - margin * 2) / 4;
        }

        if (item.height !== '100%') {
          height = height - margin / 2;
        }

        if (item.top !== '0%') {
          top = top + margin / 2;
        }

        /* if (item.left !== '0%' && item.left !== '33.33%' && item.left !== '66.66%' && item.left !== '75%') {
        left = left + margin / 2;
      } else if (item.left === '33.33%') {
        left = width + margin;
      } else if (item.left === '66.66%') {
        left = (width + margin) * 2;
      } else if (item.left === '75%') {
        left = componentsWidth - width;
      } else {
        left = 0;
      } */
        if (item.wkSrc) {
          return {
            width: width + 'px',
            height: height + 'px',
            top: top + 'px',
            left: left + 'px',
            borderRadius: this.dataSource.radius + 'px',
            backgroundImage: 'url(' + item.wkSrc + ')',
          };
        }
      },

      // addWkbImage(item, originKey, addKey) {
      //   // if (!!item[originKey] && !item[addKey]) {
      //   const originImage = item[originKey];
      //   const reg = new RegExp('https://.*?com', '');
      //   item[addKey] = originImage.replace(reg, '');
      //   // }
      // }
      addWkbImage(item, originKey, addKey) {
        const originImage = item[originKey];
        item[addKey] = ImageFilter(originImage);
      },
    },
  };
</script>
