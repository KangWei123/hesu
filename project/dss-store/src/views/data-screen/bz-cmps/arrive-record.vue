<template>
  <div class="arrive-record">
    <!-- v-if="noVip" -->
    <div class="record-title">
      <div>到店记录</div>
    </div>
    <div class="arrive-record-list">
      <div class="arrive-record-item" v-for="(item, index) in arriveRecordList" :key="index">
        <div>{{ item.time }}</div>
        <span class="point"></span>
      </div>
    </div>
    <div class="no-data" v-show="!arriveRecordList.length">暂无记录</div>
  </div>
</template>

<script>
  import utils from '@/dss-common/utils/date.js';
  import cameraFlowApi from '@/dss-common/api/camera-flow.js';
  export default {
    props: {
      data: {
        type: Object,
        default() {
          return {};
        },
      },
      wkbStatus: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        arriveRecordList: [],
      };
    },
    watch: {
      data(val, oldVal) {
        if (val) {
          this.getArriveRecordList(val);
        }
        if (oldVal && val.idStr === oldVal.idStr) {
        }
      },
    },
    computed: {
      noVip() {
        return !(this.data.memberId && this.wkbStatus);
      },
    },
    methods: {
      getArriveRecordList(row) {
        cameraFlowApi
          .getArriveRecordList({
            customerId: row.customerId,
            pageNo: 1,
            pageSize: 5,
          })
          .then(result => {
            const { data = [] } = result;
            if (!data) {
              this.arriveRecordList = [];
            }
            this.arriveRecordList = data.map(item => {
              return {
                name: item.storeName,
                time: utils.format(new Date(item.enterTime), 'MM/DD HH:mm:ss'),
              };
            });
          })
          .always(_ => {});
      },
    },
  };
</script>

<style lang="less" scoped>
  @import '../css/base.less';
  .arrive-record {
    box-sizing: border-box;

    .record-title {
      letter-spacing: 2px;
      color: #fff;
      margin-left: -15px;
      line-height: 40px;
      font-size: 18px;
      font-weight: bold;
    }

    &-item {
      position: relative;
      width: 122px;
      height: 44px;
      line-height: 44px;
      padding-left: 17px;
      border-left: 1px solid @border-blue;
      color: #fff;
      font-size: 14px;
    }

    .point {
      position: absolute;
      left: -4.5px;
      top: 17.5px;
      width: 1px;
      height: 1px;
      border: 3px solid #25b5ff;
      border-radius: 50%;
    }
  }
</style>
