<template>
  <div class="appoint-mgr">

    <div class="wkt-opt-label-container">
      <span class="dss-filter-label"
            style="text-align: left">下单时间</span>
      <el-date-picker v-model="queryTimes"
                      type="daterange"
                      range-separator="至"
                      @change="onQueryTimeChange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions">
      </el-date-picker>

      <el-input type="input"
                size="mini"
                class="dss-filter-input"
                v-model="condition.phone"
                placeholder="搜索账号，名称"></el-input>
    </div>

    <div class="appoint-body">
      <el-tabs v-model="updateModelNameType"
               @tab-click="apiScheduledCount">
        <el-tab-pane label="待支付"
                     :name="updateTabNameType(appointmentStatusEnum.STATUS.WAIT_PAY.value)">

        </el-tab-pane>
        <el-tab-pane label="待服务"
                     :name="updateTabNameType(appointmentStatusEnum.STATUS.WAIT.value)"></el-tab-pane>
        <el-tab-pane :label="dynaLabelOverTime"
                     :name="updateTabNameType(appointmentStatusEnum.STATUS.TIMEOUT.value)"></el-tab-pane>
        <el-tab-pane label="已完成"
                     :name="updateTabNameType(appointmentStatusEnum.STATUS.COMPLETE.value)"></el-tab-pane>
        <el-tab-pane :label="dynaLabelCancel"
                     :name="updateTabNameType(appointmentStatusEnum.STATUS.CANCEL.value)"></el-tab-pane>
      </el-tabs>

      <appoint-table :close-on-click-modal="false"
                     :phone.sync="condition.phone"
                     :startScheduledDate.sync="condition.startScheduledDate"
                     :endScheduledDate.sync="condition.endScheduledDate"
                     :scheduledStatusCode.sync="condition.scheduledStatusCode"
                     :orderStatusList.sync="condition.scheduledStatusCodeList">
      </appoint-table>
    </div>

  </div>
</template>

<script>
import appointmentStatusEnum from '@/dss-wechat3rd/src/constants/appointmentStatusEnum.js';
import saeApi from '@/dss-wechat3rd/src/api/scheduledAndEmployeeMgr';
import AppointTable from '@/dss-wechat3rd/src/bz_components/appoint-table/index.vue';
import './index.less';

export default {
  components: { AppointTable },
  data() {
    return {
      appointmentStatusEnum,
      queryTimes: '',

      condition: {
        phone: null,
        startScheduledDate: null, //  预约起始时间		Date 			可选
        endScheduledDate: null, //    预约终止时间		Date 			可选
        scheduledStatusCode: appointmentStatusEnum.STATUS.WAIT_PAY.value, // 预约状态			Integer 10-待支付         60-已完成  -1-已取消  70-待服务  80-已超时
        scheduledStatusCodeList: null
      },

      count: {
        //超时数量
        cancelCount: 0,
        //取消数量
        overtimeCount: 0
      },

      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              //start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    };
  },
  mounted() {
    //判断是否跳到指定列表
    if (this.$route.query.scheduledStatusCode) {
      this.condition.scheduledStatusCode = parseInt(this.$route.query.scheduledStatusCode);
    }

    this.apiScheduledCount();
  },
  computed: {
    dynaLabelOverTime() {
      return '已超时' + (this.count.overtimeCount ? '(' + this.count.overtimeCount + ')' : '');
    },
    dynaLabelCancel() {
      return '已取消' + (this.count.cancelCount ? '(' + this.count.cancelCount + ')' : '');
    },
    //变更选中的tab名字传值的参数类型
    updateModelNameType: {
      get() {
        return String(this.condition.scheduledStatusCode);
      },
      set(val) {
        this.condition.scheduledStatusCode = Number(val);
      }
    },
    //变更标题tab名字传值的参数类型
    updateTabNameType() {
      return function(type) {
        return String(type);
      };
    }
  },
  methods: {
    //时间发生改变
    onQueryTimeChange() {
      this.condition.startScheduledDate = !!this.queryTimes ? this.queryTimes[0] : null;
      this.condition.endScheduledDate = !!this.queryTimes ? this.queryTimes[1] : null;
    },
    //查询消息数量
    apiScheduledCount() {
      /* if (this.condition.scheduledStatusCode === appointmentStatusEnum.STATUS.CANCEL.value) {
        this.condition.scheduledStatusCodeList = [
          appointmentStatusEnum.STATUS.CANCEL.value,
          appointmentStatusEnum.STATUS.REFUNDING.value,
          appointmentStatusEnum.STATUS.REFUND_COMPETE.value,
          appointmentStatusEnum.STATUS.REFUND_REFUSE.value
        ];
      } else {
        this.condition.scheduledStatusCodeList = null;
      } */
      saeApi.getScheduledCount().then(res => {
        const { cancelCount, overtimeCount } = res.data || {};
        this.count.cancelCount = cancelCount || 0;
        this.count.overtimeCount = overtimeCount || 0;
      });
    }
  }
};
</script>
