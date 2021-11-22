<template>
  <div class="sms-group">
    <div class="row-1">
      <span class="remain-label">剩余短信: <span class="remain-count">{{SMSCountInfo.remainCount}}</span></span>
      <el-button class="recharge-btn"
                 size="mini"
                 @click="recharge">
        短信充值
      </el-button>
    </div>

    <div class="row-2">
      <span class="remain-label">短信签名: {{SMSCountInfo.smsSignature}}</span>
      <span class="store-warn">* 暂不支持修改短信签名，如需修改请联系客服。</span>
    </div>

    <record-table />
  </div>
</template>

<script>
import './index.less';
import SMSGroupApi from '@/dss-wechat3rd/src/api/marketingAPI.js';
import RecordTable from './record-table';

export default {
  name: 'sms-group',

  components: {
    RecordTable
  },

  data() {
    return {
      SMSCountInfo: {
        remainCount: 0,
        smsSignature: ''
      }
    };
  },

  mounted() {
    this.apiGetSMSCountInfo();
  },

  methods: {
    recharge() {
      console.log('recharge ---->', '短信充值');
      this.$router.push({
        path: '/marketing/sms-group/recharge',
        query: {
          remainCount: this.SMSCountInfo.remainCount,
          smsSignature: this.SMSCountInfo.smsSignature
        }
      });
    },

    apiGetSMSCountInfo() {
      SMSGroupApi.querySMSCountInfo()
        .then(res => {
          console.log('apiGetSMSCountInfo --->', JSON.stringify(res.data));
          this.SMSCountInfo = res.data || {};
        })
        .catch(err => {
          console.error('apiGetSMSCountInfo, error --->', err);
        });
    }
  }
};
</script>
