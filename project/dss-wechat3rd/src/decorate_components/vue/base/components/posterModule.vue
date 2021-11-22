<template>
  <div class="poster-module-bgchanged">
    <div
      class="poster-module-container"
      v-if="dataSource.data.length"
      :style="{
        margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      }"
    >
      <div class="paved">
        <img
          :style="{ borderRadius: dataSource.radius + 'px', marginTop: index === 0 ? '0' : dataSource.margin + 'px' }"
          v-for="(item, index) in dataSource.data"
          :key="index"
          :src="item.wkSrc"
        />
      </div>
    </div>
    <!-- 没有数据的时候 -->
    <div v-else class="no-data">
      <img src="../images/decorate-bg.png" alt="" />
      <div>编辑图片</div>
      <div>建议宽度750px</div>
    </div>
  </div>
</template>
<script>
  import ImageFilter from './image-filter';

  export default {
    name: 'PosterModule',
    props: {
      dataSource: {
        type: Object,
        default: {},
      },
    },

    watch: {
      'dataSource.data': {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          this.nowIndex = 0;
          if (newVal) {
            this.addWkbImage(newVal, 'src', 'wkSrc');
          }
        },
      },
    },

    methods: {
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
  .poster-module-bgchanged {
    .poster-module-container {
      .paved {
        width: 100%;
        font-size: 0;

        img {
          width: 100%;
          height: auto;
        }
      }
    }

    .no-data {
      width: 100%;
      height: 120px;
      background-color: #f1f4f9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #303133;
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;

      img {
        width: 40px;
        height: 40px;
        margin-bottom: 10px;
      }
    }
  }
</style>
