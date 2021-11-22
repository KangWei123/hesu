<template>
  <div class="integration-order-list"
       v-loading="loading">
    <el-form inline
             class="wkt-opt-label-container" style="padding: 22px 20px 0;">
      <el-form-item label="下单时间:">
        <el-date-picker v-model="queryTimes"
                        type="daterange"
                        range-separator="至"
                        @change="onQueryTimeChange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单搜索:">
        <el-input type="input"
                  size="mini"
                  class="dss-filter-input"
                  v-model="filterParams.phone"
                  placeholder="请输入手机号码或姓名"></el-input>
      </el-form-item>
    </el-form>
    <div class="order-list-body">
      <el-tabs v-model="listType"
               @tab-click="handleOrderList" style="padding: 0 20px; margin-bottom: 10px;">
        <el-tab-pane :label="appointmentStatusEnum.STATUS.ALL.label"
                     :name="appointmentStatusEnum.STATUS.ALL.name"></el-tab-pane>
        <el-tab-pane :label="appointmentStatusEnum.STATUS.WAIT_PAY.label"
                     :name="appointmentStatusEnum.STATUS.WAIT_PAY.name"></el-tab-pane>
        <el-tab-pane :label="appointmentStatusEnum.STATUS.PAID.label"
                     :name="appointmentStatusEnum.STATUS.PAID.name"></el-tab-pane>
        <el-tab-pane v-if="isRooms"
                     :label="appointmentStatusEnum.STATUS.CHECK_IN.label"
                     :name="appointmentStatusEnum.STATUS.CHECK_IN.name"></el-tab-pane>
        <el-tab-pane v-if="isTicket"
                     :label="appointmentStatusEnum.STATUS.BEING_USED.label"
                     :name="appointmentStatusEnum.STATUS.BEING_USED.name"></el-tab-pane>
        <el-tab-pane :label="appointmentStatusEnum.STATUS.COMPLETE.label"
                     :name="appointmentStatusEnum.STATUS.COMPLETE.name"></el-tab-pane>
        <el-tab-pane :label="appointmentStatusEnum.STATUS.REFUNDING.label"
                     :name="appointmentStatusEnum.STATUS.REFUNDING.name"></el-tab-pane>
        <el-tab-pane :label="appointmentStatusEnum.STATUS.REFUND_COMPETE.label"
                     :name="appointmentStatusEnum.STATUS.REFUND_COMPETE.name"></el-tab-pane>
      </el-tabs>
      <order-list-table @refresh="refreshCurrentPage"
                        :order-tab="listType"
                        :order-list="orderList"
                        :goods-type="goodsType"></order-list-table>
      <el-pagination v-if="totalCount"
                     layout="prev, pager, next, jumper, sizes, total"
                     hide-on-single-page
                     :total="totalCount"
                     :page-size="pageParams.pageSize"
                     :current-page="pageParams.pageNo"
                     :page-sizes="[5, 10, 20,50, 100, 500]"
                     @size-change="onSizeChange"
                     @current-change="onPageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import appointmentStatusEnum from '@/dss-wechat3rd/src/constants/appointmentStatusEnum';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import OrderListTable from '../order-list/order-list-table';
import utils from '@/dss-common/utils';
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';

export default {
  props: {
    //商品类型
    goodsType: {
      type: Object
    }
  },
  components: {
    OrderListTable
  },
  data() {
    return {
      appointmentStatusEnum,
      loading: false,
      queryTimes: '',
      //列表类型名称
      listType: appointmentStatusEnum.STATUS.ALL.name,
      filterParams: {
        phone: '',
        startDate: '',
        endDate: ''
      },
      orderList: null,
      pageParams: {
        pageNo: 1,
        pageSize: 5
      },
      totalCount: 0,
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
  computed: {
    // 是否是客房类型
    isRooms() {
      return this.goodsType === goodsTypeEnum.rooms;
    },
    // 是否是票务类型
    isTicket() {
      return this.goodsType === goodsTypeEnum.ticket;
    },
    orderStatus() {
      // 如果为查询所有订单，则返回空
      if (this.listType !== appointmentStatusEnum.STATUS.ALL.name) {
        return appointmentStatusEnum.STATUS[this.listType].value; //订单列表类型
      }
      return null;
    },
    listUrl() {
      // 如果是查询退款列表，则跟换查询接口
      if (
        this.orderStatus === appointmentStatusEnum.STATUS.REFUNDING.value ||
        this.orderStatus === appointmentStatusEnum.STATUS.REFUND_COMPETE.value
      ) {
        return constants.Api.order.refundList;
      }
      return constants.Api.order.list;
    }
  },
  watch: {
    'filterParams.phone'() {
      this.refresh();
    }
  },
  mounted() {
    //判断是否跳到指定列表
    if (this.$route.query.scheduledStatusCode) {
      this.listType = parseInt(this.$route.query.scheduledStatusCode);
    }
    this.getOrderList();
  },
  methods: {
    getOrderList() {
      let params = {
        ...this.pageParams,
        ...this.filterParams,
        'itemTypeList[0]': this.goodsType.value, // 订单类型
        orderStatus: this.orderStatus
      };
      // 如果查询退款列表，则替换替换查询参数
      if (
        this.orderStatus === appointmentStatusEnum.STATUS.CANCEL.value ||
        this.orderStatus === appointmentStatusEnum.STATUS.REFUND_COMPETE.value
      ) {
        params.itemType = this.goodsType.value;
        params.status = this.orderStatus;
        delete params['itemTypeList[0]'];
        delete params.orderStatus;
      }
      this.loading = true;
      services
        .get(this.listUrl, {
          params,
          action: '订单查询'
        })
        .done(res => {
          const orderList = res.data || [];
          orderList.forEach(order => {
            order.checked = false;
          });
          this.orderList = orderList; // 重新赋值是为了避免切换查询条件的时候会短暂保留原数据的bug
          this.totalCount = res.totalCount;
        })
        .always(() => {
          this.loading = false;
        });
    },
    //时间发生改变
    onQueryTimeChange() {
      this.filterParams.startDate = !!this.queryTimes ? utils.timeFormat(this.queryTimes[0], 'YYYY-MM-DD') : null;
      this.filterParams.endDate = !!this.queryTimes ? utils.timeFormat(this.queryTimes[1], 'YYYY-MM-DD') : null;
      this.refresh();
    },
    // tab的值改变
    handleOrderList() {
      this.pageParams.pageNo = 1;
      this.getOrderList();
    },
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.getOrderList();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.getOrderList();
    },
    // 刷新当前页
    refreshCurrentPage() {
      this.getOrderList();
    },
    // 刷新列表
    refresh() {
      this.pageParams.pageNo = 1;
      this.getOrderList();
    }
  }
};
</script>

<style lang="less">
@import '~@/dss-common/style/wkt-constants.less';

.integration-order-list {
  .order-list-body {
    margin-top: 16px;
    // padding: 20px;

    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
}
</style>

