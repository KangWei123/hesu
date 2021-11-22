<template>
  <div class="live-module">
    <div
      class="live-module-container"
      v-if="dataSource.data.src"
      :style="{
        margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      }"
    >
      <div class="paved">
        <img :style="{ borderRadius: dataSource.radius + 'px', marginTop: '0px' }" :src="dataSource.data.src" />
      </div>
    </div>
    <!-- 没有数据的时候 -->
    <div v-else class="no-data">
      <div>点击编辑海报</div>
      <div>建议宽度750px</div>
    </div>
  </div>
</template>
<script>
  import ImageFilter from './image-filter';

  export default {
    name: 'LiveModule',
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
          if (newVal) {
            this.addWkbImage(newVal, 'src', 'wkSrc');
          }
        },
      },
    },

    methods: {
      addWkbImage(data, originKey, addKey) {
        if (data[originKey]) {
          const originImage = data[originKey];
          data[addKey] = ImageFilter(originImage);
        }
      },
    },
  };
</script>
<style lang="less">
  .live-module {
    .live-module-container {
      .paved {
        width: 100%;
        font-size: 0px;
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
    }
  }
</style>
