<template>
  <div class="screen-list dss-card">
    <div class="title">AI人脸大屏列表</div>
    <div class="screen-select-list" v-if="cameraExist">
      <div class="list-item">
        <a :href="'/store/ai.html?wkbStatus=' + wkbStatus" target="_blank">
          <img src="../../asserts/images/passflow-screen.png" class="screen-img" width="100%" />
        </a>
        <span class="screen-label">客流大屏</span>
      </div>
      <div class="list-item">
        <a :href="'/store/data-screen.html?wkbStatus=' + wkbStatus" target="_blank">
          <img src="../../asserts/images/customer-screen.png" class="screen-img" width="100%" />
        </a>
        <span class="screen-label">客户大屏</span>
      </div>
      <!-- <div class="list-item">
        <a :href="'/store/face-score.html?wkbStatus=' + wkbStatus"
           target="_blank">
          <img src="../../asserts/images/face-score.png"
               class="screen-img"
               width="100%">
        </a>
        <span class="screen-label">互动大屏</span>
      </div> -->
    </div>
    <div class="no-screen" v-else>需安装摄像头设备</div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import storeApi from '@/dss-common/api/store';

  export default {
    data() {
      return {
        cameraExist: false,
      };
    },
    computed: {
      ...mapState({
        wkbStatus: 'wkbStatus',
        klbStatus: 'klbStatus',
      }),
    },
    mounted() {
      this.queryDeviceExist();
    },
    methods: {
      queryDeviceExist() {
        storeApi
          .queryDeviceExist({})
          .then(rs => {
            if (rs.data) {
              this.cameraExist = rs.data.indexOf('CAMERA') >= 0;
            } else {
              this.cameraExist = false;
            }
          })
          .catch(err => {
            console.error(err);
          });
      },
    },
  };
</script>

<style scoped lang="less">
  .screen-list {
    min-width: 1000px;
    min-height: calc(100vh - 105px);
    padding: 0;
    .title {
      color: #333;
      letter-spacing: 0;
      padding: 11px 20px;
      font-size: 20px;
      font-weight: bold;
      line-height: 20px;
      border-bottom: 1px solid #e9ebf0;
    }

    .screen-select-list {
      margin: 20px;
      .list-item {
        display: inline-block;
        width: 23%;
        margin-right: 15px;
        text-align: center;
      }
      a {
        display: inline-block;
        width: 100%;
      }
      .screen-label {
        padding-top: 5px;
        display: inline-block;
      }
    }

    .no-screen {
      text-align: center;
      font-size: 15px;
      line-height: 15px;
      margin: 40px 0;
      color: #888;
    }
  }
</style>
