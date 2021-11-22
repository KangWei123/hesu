<template>
  <div class="short-chain-touch blue-shadow-box">
    <div class="box-title">
      <div>营销触达</div>
    </div>
    <div class="short-list">
      <div class="head" v-show="arriveRecordList.length">
        <div class="th">打开时间</div>
        <div class="th" style="width: 150px">活动名称</div>
        <div class="th" style="width: 70px">停留时长</div>
      </div>
      <div class="short-item" v-for="(item, index) in arriveRecordList" :key="index">
        <div>
          <span class="td">{{ item.openTime }}</span>
          <span class="td name">{{ item.actName }}</span>
          <span class="td" style="width: 70px">{{ item.sessionDur }}分钟</span>
        </div>
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
        if (val && val.memberId) {
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
    // mounted() {
    //   //测试
    //   this.getArriveRecordList({ memberId: 309 });
    // },
    methods: {
      getArriveRecordList(row) {
        cameraFlowApi
          .getSelect_by_memberId({
            memberId: row.memberId,
            pageNo: 1,
            pageSize: 3,
          })
          .then(result => {
            const { data = [] } = result;
            if (!data) {
              this.arriveRecordList = [];
            }
            this.arriveRecordList = data.map(item => {
              return {
                actName: item.actName,
                openTime: utils.format(new Date(item.openTime), 'MM/DD HH:mm:ss'),
                sessionDur: this.getTime(item.sessionDur),
              };
            });
          })
          .always(_ => {});
      },
      getTime(time) {
        let date = time / 1000 / 60 || 1; // 如果为0默认1分钟
        if (date % 1 !== 0) {
          date = parseInt(date) + 1;
        } else {
          date = parseInt(date);
        }
        return date;
      },
    },
  };
</script>

<style lang="less" scoped>
  @import '../css/base.less';
  .short-chain-touch {
    box-sizing: border-box;
    width: 100%;
    height: 100%;

    .head {
      margin-left: 52px;
      line-height: 39px;
      font-size: 14px;
      color: #feffff;
      font-weight: 600;
      overflow: hidden;
      .th {
        float: left;
        width: 130px;
      }
    }

    .short-item {
      position: relative;
      // width: 122px;
      height: 24px;
      line-height: 24px;
      padding-left: 29px;
      border-left: 1px solid @border-blue;
      color: #19c1ff;
      font-size: 14px;
      margin-left: 22px;
      .td {
        float: left;
        width: 130px;
      }
      .name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-right: 20px;
      }
    }

    .point {
      position: absolute;
      left: -4.5px;
      top: 8px;
      width: 1px;
      height: 1px;
      border: 3px solid #25b5ff;
      border-radius: 50%;
    }
  }
</style>
