<style lang="less">
  .video-module {
    .video-module-container {
      .paved {
        width: 100%;
        font-size: 0px;
        video {
          width: 100%;
          height: 220px;
          object-fit: fill;
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

<template>
  <div class="video-module">
    <div
      class="video-module-container"
      v-if="dataSource.data"
      :style="{
        margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      }"
    >
      <div class="paved">
        <video class="video" width="100%" height="100%" :src="dataSource.data.cdnUrl"></video>
      </div>
    </div>
    <!-- 没有数据的时候 -->
    <div v-else class="no-data">
      <div>点击编辑视频内容</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VideoModule',
    props: {
      dataSource: {
        type: Object,
        default: {},
      },
    },
    methods: {},
  };
</script>
