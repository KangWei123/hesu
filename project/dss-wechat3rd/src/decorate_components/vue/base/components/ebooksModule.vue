<template>
  <div
    class="ebooks-module"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
      background: dataSource.backgroundColor || 'white',
    }"
  >
    <div>
      <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
      <div
        class="ebooks-module-container"
        v-if="dataSource.data.length"
        :style="{
          margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
        }"
      >
        <div class="item" v-for="(item, index) in dataSource.data" :key="index">
          <img class="ebooks-cover" :src="item.coverUrl" />
          <span class="ebooks-title">{{ item.title }}</span>
        </div>
      </div>
      <div class="no-data" v-else>
        <div>点击新增电子相册</div>
      </div>
    </div>
  </div>
</template>
<script>
  import textNavModule from './textNavModule.vue';

  export default {
    name: 'EbooksModule',
    components: {
      textNavModule,
    },
    props: {
      dataSource: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {};
    },
  };
</script>
<style lang="less">
  .ebooks-module {
    background-color: white;
    overflow: hidden;
    .ebooks-module-container {
      display: flex;
      padding-bottom: 8px;
      .item {
        flex-shrink: 0;
        height: 190px;
        width: 115px;
        margin-right: 10px;
        border-radius: 3px;
        position: relative;
        .ebooks-cover {
          position: absolute;
          height: 86%;
          width: 100%;
        }
        .ebooks-title {
          width: 100px;
          position: absolute;
          font-size: 16px;
          color: #333333;
          bottom: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .no-data {
      width: 100%;
      height: 180px;
      background-color: #f1f4f9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #303133;
    }
  }
</style>
