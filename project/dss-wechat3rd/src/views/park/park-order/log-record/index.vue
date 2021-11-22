<template>
  <div class="mask">
    <div class="log-record">
      <div class="head">
        <h3 class="head-tit">日志详情</h3>
        <img class="head-close" @click="closeLogRecord" src="../../../../images/park/close.png" alt="" />
      </div>
      <el-table :data="list" class="table">
        <el-table-column type="index" label="序号" width="100" align="center">
          <template scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="message" label="订单流程" width="500" align="left"> </el-table-column>

        <el-table-column prop="createTime" label="触发时间" width="220" align="center"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import parkApi from '@/dss-wechat3rd/src/api/park.js';
  export default {
    name: 'LogRecord',
    props: {
      orderId: {
        type: [String, Number],
        default: '',
      },
    },
    data() {
      return {
        list: [{}],
      };
    },
    watch: {
      orderId(newVal) {
        this.requestData(newVal);
      },
    },
    methods: {
      closeLogRecord() {
        this.$emit('closeLogRecord');
      },
      requestData(orderId) {
        parkApi
          .checkLog({ orderNo: orderId })
          .then(res => {
            this.list = res.data;
            this.totalOrderCount = res.totalOrderCount;
          })
          .catch(err => {
            console.error(err);
          })
          .always(() => {});
      },
    },
  };
</script>

<style scoped lang="less">
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #0006;
    z-index: 10;

    .log-record {
      overflow: hidden;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 863px;
      min-height: 616px;
      background: white;
      z-index: 10;
      transform: translate(-50%, -50%);

      .head {
        height: 60px;
        background: white;
        border-bottom: solid 1px #bbb;

        .head-tit {
          line-height: 60px;
          margin-left: 20px;
        }

        .head-close {
          float: right;
          margin-top: -40px;
          margin-right: 20px;
          color: white;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }

      .table {
        width: 863px;
        margin-top: 50px;
        padding: 0 20px;
        box-sizing: border-box;
      }
    }
  }
</style>
