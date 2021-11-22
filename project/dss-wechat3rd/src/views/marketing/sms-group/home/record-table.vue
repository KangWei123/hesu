<template>
  <div class="wkt-card sms-record-table">

    <div class="record-header">
      <span class="title">群发记录: </span>
      <el-button class="add-btn"
                 type="primary"
                 size="mini"
                 @click="createNewSMS">
        新建群发
      </el-button>
    </div>

    <el-table class="wkt-table"
              :data="sendRecords">
      <el-table-column prop="message"
                       label="短信内容">
      </el-table-column>
      <el-table-column prop="sendTime"
                       label="发送时间">
        <template slot-scope="scope">
          {{scope.row.sendTime | time}}
        </template>
      </el-table-column>
      <el-table-column prop="quantity"
                       label="发送人数">

      </el-table-column>
      <el-table-column prop="success"
                       label="到达人数">

      </el-table-column>
      <el-table-column prop="consumeCount"
                       label="消耗条数">

      </el-table-column>
      <el-table-column label="状态/操作" width="100">
        <template slot-scope="scope">
          <a @click="handleSMS(scope.row)"
             href="javascript:;">
            {{opMessage(scope.row)}}
          </a>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination layout="prev, pager, next, jumper, sizes, total"
                   :total="totalRecordsCount"
                   :current-page="pageParams.pageNo"
                   :page-size="pageParams.pageSize"
                   :page-sizes="[5, 10, 20, 30, 40, 50]"
                   @size-change="onSizeChange"
                   @current-change="onPageChange"
                   class="wkt-pagination">
    </el-pagination>
  </div>
</template>

<script>
import SMSGroupApi from '@/dss-wechat3rd/src/api/marketingAPI.js';
import SMSExecuteEnum from '@/dss-wechat3rd/src/constants/SMSExecuteEnum.js';

export default {
  data() {
    return {
      totalRecordsCount: 0,
      sendRecords: [],
      pageParams: {
        pageNo: 1,
        pageSize: 5
      }
    };
  },

  mounted() {
    this.apiQuerySMSSendRecords();
  },

  methods: {
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.apiQuerySMSSendRecords();
    },

    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.apiQuerySMSSendRecords();
    },

    createNewSMS() {
      this.$router.push('/marketing/sms-group/new');
    },

    handleSMS(item) {
      if (item.executeStatus === SMSExecuteEnum.status.WAIT.value) {
        this.apiSendSMSImmediately(item);
      }
    },

    opMessage(item) {
      if (item.executeStatus === SMSExecuteEnum.status.EXECUTING.value) {
        return SMSExecuteEnum.status.EXECUTING.label;
      }

      if (item.executeStatus === SMSExecuteEnum.status.FINISH.value) {
        return SMSExecuteEnum.status.FINISH.label;
      }

      if (item.executeStatus === SMSExecuteEnum.status.FAILED.value) {
        return SMSExecuteEnum.status.FAILED.label;
      }

      if (item.executeStatus === SMSExecuteEnum.status.WAIT.value) {
        if (item.sendType === SMSExecuteEnum.sendType.SCHEDULED) {
          return SMSExecuteEnum.status.WAIT.label;
        }
      }

      return '发送中';
    },

    apiQuerySMSSendRecords() {
      this.loading = true;
      let params = {
        ...this.pageParams
      };
      SMSGroupApi.querySMSGroupSendRecords(params)
        .then(res => {
          console.log('apiQuerySMSSendRecords', JSON.stringify(res.data));
          this.sendRecords = res.data || [];
          this.totalRecordsCount = res.totalCount;
        })
        .catch(err => {
          console.error('apiQuerySMSSendRecords', err);
        })
        .always(() => {
          this.loading = false;
        });
    },

    apiSendSMSImmediately(item) {
      this.loading = true;
      let params = {
        recordId: item.id
      };
      SMSGroupApi.sendSMSImmediately(params)
        .then(res => {
          console.log('apiSendSMSImmediately', JSON.stringify(res.data));
          if (!!res && res.data) {
            this.apiQuerySMSSendRecords();
          }
        })
        .catch(err => {
          console.error('apiSendSMSImmediately', err);
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" >
.sms-record-table {
  .record-header {
    margin-bottom: 20px;

    .title {
      width: 72px;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: @black-color;
      line-height: 20px;
    }

    .add-btn {
      float: right;
    }
  }
}
</style>
