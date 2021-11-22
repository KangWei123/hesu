<template>

  <div class="dss-wp-table-top"
       v-loading="loading">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="会员信息"
        width="180">
        <template slot-scope="scope">
          <div class="user-info">
            <div class="icon"
                 :style="'background: transparent url('+scope.row.avatar+') no-repeat 0 0;'"></div>
            <div class="info">
              <div class="up">{{scope.row.nickName}}</div>
              <div class="bottom">{{scope.row.userName}} {{scope.row.phone}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemName"
        label="预约服务"
        width="180">
      </el-table-column>
      <el-table-column
        prop="technicianName"
        label="预约技师">
      </el-table-column>
      <el-table-column
        label="预约时间"
        width="180">
        <div slot-scope="scope">
          <span class="scheduledTime1">{{scope.row.scheduledTime | scheduledTime1}}</span>
          <span class="scheduledTime2">{{scope.row.scheduledTime | scheduledTime2}}</span>
        </div>
      </el-table-column>
      <el-table-column
        prop="name"
        label="支付"
        width="180">
        <span slot-scope="scope">{{scope.row | payDesc}}</span>
      </el-table-column>
      <el-table-column
        prop="storeName"
        label="预约门店">
      </el-table-column>
      <el-table-column
        prop="address"
        label="预约人">
        <div slot-scope="scope" class="subscriber-info">
          <div class="up">{{scope.row.subscriberName}}</div>
          <div class="bottom">{{scope.row.subscriberMobile}}</div>
        </div>
      </el-table-column>
      <el-table-column
        prop="orderMessage"
        label="备注">
      </el-table-column>
      <el-table-column v-if="enableOperationBtn" label="操作" width="180">
        <div slot-scope="scope">
          <a href="javascript:;"
             v-if="scope.row.payStatus === 10"
             @click="clickOpenBill(scope.row)">开单</a>
          <a href="javascript:;"
             v-if="scope.row.payStatus === 20"
             @click="clickComplete(scope.row)">完成</a>
          <a href="javascript:;"
             @click="clickEdit(scope.row)">编辑</a>
          <a href="javascript:;"
             @click="clickCancel(scope.row)">取消订单</a>
        </div>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="onPageSizeChange"
                   @current-change="onPageNumChange"
                   :current-page="pageNo"
                   :page-size="pageSize"
                   :page-sizes="[10, 15, 50, 100]"
                   layout="prev, pager, next, jumper, sizes, total"
                   v-if="totalCount"
                   :total="totalCount">
    </el-pagination>
    <el-dialog width="650px"
               class="dialog-appoint-edit"
               title="修改预约"
               :visible.sync="editorVisible"
               append-to-body>

      <appoint-edit ref="ae"
                    :appoint="editorAppoint">
      </appoint-edit>

      <div slot="footer">
        <el-button :loading="submitting"
                   @click="editorVisible = false">
          取消
        </el-button>
        <el-button type="primary"
                   :loading="submitting"
                   @click="saveAppoint">保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import saeApi from '@/dss-wechat3rd/src/api/scheduledAndEmployeeMgr';
import payConstants from '@/dss-wechat3rd/src/constants/pay';
import appointmentStatusEnum from '@/dss-wechat3rd/src/constants/appointmentStatusEnum.js';
import AppointEdit from './edit.vue';
import './index.less';
//const FullWidths = [20, 10, 10, 10, 10, 20, 20];
//const Widths = [19, 15, 15, 15, 15, 19];

const FullWidths = [15, 10, 10, 10, 10, 10, 15, 10, 10];
const Widths = [20, 10, 10, 10, 10, 10, 20, 10];

const PAY_CHANNEL_NAME = payConstants.PAY_CHANNEL_NAME;
const PAY_STATUS = payConstants.PAY_STATUS;

export default {
  components: { AppointEdit },
  props: {
    //开始预约时间
    startScheduledDate: {
      type: Date,
      default: null
    },
    //结束预约时间
    endScheduledDate: {
      type: Date,
      default: null
    },
    //预约状态，默认为 待服务
    scheduledStatusCode: {
      type: Number,
      default: appointmentStatusEnum.STATUS.WAIT_PAY.value // 预约状态			Integer         60-已完成  -1-已取消  70-待服务  80-已超时
    },
    //预约状态，可传多个状态
    orderStatusList: {
      type: Array,
      default: function() {
        return null;
      }
    },
    //会员id
    userId: {
      type: Number,
      default: null
    },
    //用户电话
    phone: {
      type: String,
      default: null
    },
    //来源，根据从哪一个模块进入该组件的，用于判断是否显示操作按钮
    source: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      //查询列表相关信息
      loading: false,
      totalCount: 0,
      pageNo: 1,
      pageSize: 10,
      tableData: [],

      columnWidth: FullWidths,

      enableOperationBtn: true,
      submitting: false, //变更中
      editorVisible: false,
      editorAppoint: null
    };
  },
  filters: {
    payDesc(row) {
      switch (row.payStatus) {
        case PAY_STATUS.NOT_PAY:
          return '待支付';
        case PAY_STATUS.NO_NEET_PAY:
          return '无需支付';
        case PAY_STATUS.PAID:
          return '已支付(' + PAY_CHANNEL_NAME[row.payChannel] + ')';
        case PAY_STATUS.REFUND:
          return '退款中(' + PAY_CHANNEL_NAME[row.payChannel] + ')';
        case PAY_STATUS.REFUND_COMPLETED:
          return '退款完成(' + PAY_CHANNEL_NAME[row.payChannel] + ')';
      }
    },
    empty(val) {
      return !!val ? val : '-';
    },
    scheduledTime1(val) {
      return val ? val.split(' ')[0] : val;
    },
    scheduledTime2(val) {
      return val ? val.split(' ')[1] : val;
    }
  },
  watch: {
    phone() {
      this.fresh();
    },
    startScheduledDate() {
      this.fresh();
    },
    scheduledStatusCode(newVal) {
      this.enableOperationBtn = newVal == '70' || newVal == '80' || newVal == '10';
      this.columnWidth = this.enableOperationBtn ? FullWidths : Widths;
      this.fresh();
    }
  },
  mounted() {
    this.apiList();

    //判断若是从会员详情进入该组件的，隐藏操作按钮
    if (this.source === 'memberDetail') {
      this.enableOperationBtn = false;
      this.columnWidth = this.enableOperationBtn ? FullWidths : Widths;
    }
  },
  methods: {
    fresh() {
      this.pageNo = 1;
      this.apiList();
    },
    // 页数
    onPageSizeChange(val) {
      this.pageSize = val;
      this.fresh();
    },
    // 页码
    onPageNumChange(val) {
      this.pageNo = val;
      this.apiList();
    },
    //查询预约列表
    apiList() {
      this.loading = true;
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        startScheduledDate: this.startScheduledDate ? this.startScheduledDate.toString() : undefined,
        endScheduledDate: this.endScheduledDate ? this.endScheduledDate.toString() : undefined,
        userId: this.userId ? this.userId : undefined,
        phone: this.phone ? this.phone : undefined
      };
      if (this.orderStatusList && this.orderStatusList.length) {
        this.orderStatusList.forEach((item, index) => {
          Object.assign(params, { [`orderStatusList[${index}]`]: item });
        });
      } else {
        Object.assign(params, { scheduledStatusCode: this.scheduledStatusCode });
      }
      saeApi
        .getScheduledList(params)
        .then(res => {
          const { data, totalCount } = res;
          this.tableData = data || [];
          this.totalCount = totalCount;
        })
        .always(() => {
          this.loading = false;
        });
    },
    //取消
    clickCancel(row) {
      saeApi.cancelScheduled({ orderNoStr: row.id }).then(() => {
        this.$message({ message: '预约取消成功', type: 'success' });
        this.apiList();
      });
    },
    //更改
    clickEdit(row) {
      this.editorVisible = true;
      this.editorAppoint = row;
    },
    //开单
    clickOpenBill(row) {
      this.$router.push({
        path: '/cashier',
        query: { orderId: row.id, userId: row.userId }
      });
    },
    //已完成
    clickComplete(row) {
      saeApi.completeScheduled({ orderNoStr: row.id }).then(() => {
        this.$message({ message: '预约标记完成成功', type: 'success' });
        this.apiList();
      });
    },
    //保存预约
    saveAppoint() {
      this.submitting = true;
      let data = this.$refs.ae.collect();
      if (!data) {
        return;
      }
      saeApi
        .updateScheduled(data)
        .then(() => {
          this.$message({ message: '预约更改成功', type: 'success' });
          this.apiList();
          this.$nextTick(() => {
            this.editorVisible = false;
          });
        })
        .always(() => {
          this.submitting = false;
        });
    }
  }
};
</script>
