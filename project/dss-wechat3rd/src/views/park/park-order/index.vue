<template>
  <list-page-layout class="app-list-container">
    <template #filters>
      <el-form
        ref="query"
        class="nav-form"
        @submit.prevent.native="$refs.query.search()"
        :model="form"
        inline
        label-width="80px"
        label-suffix=":"
      >
        <el-form-item prop="startDateRange" label="入场时间">
          <el-date-picker
            class="el-form-item-view dss-filter-input"
            v-model="form.startDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="dateRange" label="缴费时间">
          <el-date-picker
            class="el-form-item-view dss-filter-input"
            v-model="form.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <br />
        <el-form-item prop="carNo" label="车牌号码">
          <el-input v-model="form.carNo" class="w220" placeholder="请输入车牌号" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号码">
          <el-input v-model="form.phone" class="w220" placeholder="请输入手机号" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item prop="orderStatus" label="订单状态">
          <el-select v-model="form.orderStatus" class="w220">
            <el-option
              v-for="(item, index) in orderStatusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item prop="payStatus" label="支付状态">
          <el-select v-model="form.payStatus" class="w220" placeholder="请选择支付状态">
            <el-option
              v-for="(item, index) in payStatusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="memSwitch" label="权益使用">
          <el-checkbox v-model="form.memSwitch" label="会员权益" :true-label="1" :false-label="0"></el-checkbox>
          <el-checkbox v-model="form.couponSwitch" label="停车券" :true-label="1" :false-label="0"></el-checkbox>
          <el-checkbox v-model="form.scoreSwitch" label="积分" :true-label="1" :false-label="0"></el-checkbox>
        </el-form-item>
        <el-form-item class="query-item">
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-button class="export-order" :disabled="!isSure" @click="patchOrder">导出订单</el-button>

    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" row-key="id">
      <el-table-column prop="parkName" label="车场名称" min-width="200" align="center" fixed="left">
        <template slot-scope="scope">
          <div>{{ scope.row.parkName }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="carNo" label="车牌号" min-width="150" align="center" fixed="left">
        <template slot-scope="scope">
          <div class="carNo">{{ scope.row.carNo }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="phone" label="手机号" min-width="150" align="center" fixed="left">
        <template slot-scope="scope">
          <div>{{ scope.row.phone || '--' }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="serviceTime" label="停车时长" min-width="150" align="center">
        <template slot-scope="scope">
          <div>{{ getTime(scope.row.serviceTime) }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="memberRightsDeductTime" label="会员权益抵扣" min-width="150" align="left">
        <template slot-scope="scope">
          <div>金额：{{ scope.row.memBenefitsDisFee | price }}</div>
          <div>时长：{{ getTime(scope.row.memBenefitsDisDur * 60) || 0 }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="parkingTicketDeductTime" label="停车券抵扣" min-width="120" align="left">
        <template slot-scope="scope">
          <div>金额：{{ scope.row.couponDisFee | price }}</div>
          <div>时长：{{ getTime(scope.row.couponDisDur * 60) || 0 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="bonusDeductTime" label="积分抵扣" min-width="120" align="left">
        <template slot-scope="scope">
          <div>金额：{{ scope.row.scoreFee | price }}</div>
          <div>时长：{{ getTime(scope.row.scoreDur * 60) || 0 }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="serviceFee" label="应付金额" min-width="120" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.serviceFee | price }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="totalDiscount" label="总优惠金额" min-width="150" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.discountFee | price }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="totalFee" label="实付金额" min-width="120" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.totalFee | price }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="tradeStatus" label="订单状态" min-width="120" align="center">
        <template slot-scope="scope">
          <div>{{ getOrderStatus(scope.row.tradeStatus) }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="outTransactionId" label="微信支付订单号" min-width="170" align="center"> </el-table-column>

      <el-table-column prop="orderNo" label="线上订单号" min-width="170" align="center"> </el-table-column>

      <el-table-column prop="outOrderNo" label="线下订单号" min-width="180" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.outOrderNo }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="startTime" label="入场时间" min-width="160" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.startTime }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="线上缴费时间" min-width="160" align="center"> </el-table-column>

      <el-table-column label="操作" fixed="right" align="left" min-width="150" v-slot="scope">
        <table-actions :options="[{ name: '查看日志', onClick: () => handleViewLog(scope.row) }]" />
      </el-table-column>
    </fat-table>

    <logRecord
      class="logRecord"
      v-show="isShowLogRecord"
      :order-id="orderId"
      @closeLogRecord="closeLogRecord"
    ></logRecord>

    <!-- 温馨提示dialog -->
    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size: 14px">订单正在导出，请等候...</span>
    </el-dialog>
  </list-page-layout>
</template>

<script>
  import parkApi from '@/dss-wechat3rd/src/api/park';
  import logRecord from './log-record/index.vue';
  import { timeFormat } from '@/business-common/filters/date-format-filters';
  import { mapState } from 'vuex';
  import exportExcel from '@/dss-common/utils/exportExcel';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';

  export default {
    name: 'ParkOrder',
    components: {
      logRecord,
      FatTable,
      ListPageLayout,
      TableActions,
    },
    data() {
      return {
        form: {
          dateRange: this.getTimeRange(30, new Date()),
          startDateRange: [],
          carNo: null,
          phone: null,
          payState: null,
          orderStatus: null,
          memSwitch: 0,
          scoreSwitch: 0,
          couponSwitch: 0,
        },
        showTipDialog: false,
        isSure: true,
        loading: false,
        payStatusList: [
          {
            label: '全部',
            value: null,
          },
          {
            label: '未支付',
            value: '10',
          },
          {
            label: '已支付',
            value: '20',
          },
        ],
        orderStatusList: [
          {
            label: '全部',
            value: null,
          },
          {
            label: '未支付',
            value: '10',
          },
          {
            label: '交易成功',
            value: '30',
          },
          {
            label: '已取消',
            value: '-1',
          },
        ],
        isShowLogRecord: false,
        orderId: '',
      };
    },
    computed: {
      ...mapState({
        curStore: 'curStore',
      }),
    },

    methods: {
      getOrderStatus(status) {
        const orderStatus = this.orderStatusList.find(i => Number(i.value) === status) || {};
        return orderStatus.label;
      },

      /**
       * 获取日期范围
       * @param day
       * @param [lastDate] 最后一天
       * @returns {[*,*]}
       */
      getTimeRange(day, lastDate) {
        const last = lastDate || new Date();
        const start = new Date(timeFormat(last, 'YYYY/MM/DD')); // 获取0点的时间
        const end = last;
        start.setTime(start.getTime() - 3600 * 1000 * 24 * day);
        return [start, new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59)];
      },

      /**
       * 转换天小时分钟
       * @param day
       * @param [time] 时间
       * @returns {[*,*]}
       */
      getTime(time) {
        const days = parseInt(time / (3600 * 24));
        const hours = parseInt((time % (60 * 60 * 24)) / (60 * 60));
        const minutes = parseInt((time % (60 * 60)) / 60);
        let date = '';
        if (days) {
          date += days + '天';
        }
        if (hours) {
          date += hours + '小时';
        }
        if (minutes) {
          date += minutes + '分钟';
        }
        return date;
      },

      async handleFetch(data) {
        const { pagination } = data;
        const params = {
          ...this.form,
          itemTypeList: [40],
          pageSize: pagination.pageSize,
          pageNo: pagination.currentPage,
          phone: this.form.phone ? this.form.phone : null,
        };
        if (this.form.dateRange && this.form.dateRange.length) {
          params.startDate = timeFormat(this.form.dateRange[0], 'YYYY-MM-DD 00:00:00');
          params.endDate = timeFormat(this.form.dateRange[1], 'YYYY-MM-DD 23:59:59');
        }
        if (this.form.startDateRange && this.form.startDateRange.length) {
          params.parkingStartTimeS = timeFormat(this.form.startDateRange[0], 'YYYY-MM-DD 00:00:00');
          params.parkingStartTimeE = timeFormat(this.form.startDateRange[1], 'YYYY-MM-DD 23:59:59');
        }
        delete params.dateRange;
        delete params.startDateRange;
        if (
          this.showMessage(params.startDate, params.endDate) &&
          this.showMessage(params.parkingStartTimeS, params.parkingStartTimeE)
        ) {
          return this.$message({
            message: '时间跨度不得超过一个月',
            type: 'warning',
          });
        }
        const { data: list, totalCount: total } = await parkApi.orderList(params);
        return { list: list || [], total };
      },

      patchOrder() {
        this.$confirm('确定一键导出过滤后的订单吗？ ', '一键导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
          closeOnClickModal: false,
        })
          .then(() => {
            const params = {
              ...this.form,
              itemTypeList: [40],
              phone: this.form.phone ? this.form.phone : null,
            };
            if (this.form.dateRange && this.form.dateRange.length) {
              params.startDate = timeFormat(new Date(this.form.dateRange[0]), 'YYYY-MM-DD 00:00:00');
              params.endDate = timeFormat(new Date(this.form.dateRange[1]), 'YYYY-MM-DD 23:59:59');
            }
            if (this.form.startDateRange && this.form.startDateRange.length) {
              params.parkingStartTimeS = timeFormat(new Date(this.form.startDateRange[0]), 'YYYY-MM-DD 00:00:00');
              params.parkingStartTimeE = timeFormat(new Date(this.form.startDateRange[1]), 'YYYY-MM-DD 23:59:59');
            }
            delete params.dateRange;
            delete params.startDateRange;
            if (
              this.showMessage(params.startDate, params.endDate) &&
              this.showMessage(params.parkingStartTimeS, params.parkingStartTimeE)
            ) {
              return this.$message({
                message: '时间跨度不得超过一个月',
                type: 'error',
              });
            }
            const api = parkApi.exportOrder;
            // post下载
            this.isSure = false;
            this.showTipDialog = true;
            exportExcel
              .download(api, params, '停车场订单')
              .then(res => {
                this.$message({
                  message: '导出订单成功，正在下载',
                  type: 'success',
                });
              })
              .always(() => {
                this.isSure = true;
                this.showTipDialog = false;
              });
          })
          .catch(() => {
            console.log('取消一键导出');
          });
      },

      // 判断时间选择是否超出
      showMessage(startDate, endDate) {
        if (!startDate || !endDate) {
          return true;
        }
        const startTime = new Date(startDate);
        const endTime = new Date(endDate);
        const time = endTime.getTime() - startTime.getTime();
        const day = parseInt(time / (1000 * 60 * 60 * 24));
        return day > 31;
      },

      handleViewLog(row) {
        this.isShowLogRecord = true;
        this.orderId = row.orderNo;
      },

      closeLogRecord() {
        this.isShowLogRecord = false;
      },
    },
  };
</script>

<style lang="less" scoped>
  .el-form-item {
    .dss-filter-input {
      width: 340px !important;
    }
  }

  .export-order {
    margin: 20px 20px 0 20px;
  }

  .carNo {
    min-width: 82px;
    padding: 0 10px;
    height: 24px;
    line-height: 24px;
    background: #7789aa;
    border-radius: 2px;
    font-size: 13px;
    font-weight: 400;
    text-align: center;
    color: #fff;
  }
</style>
