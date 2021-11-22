<template>
  <el-form id="form" class="filter-form order-filter-container" inline label-width="8.7rem">
    <!-- 订单号 -->
    <el-form-item label="流水单号:">
      <el-input class="order-search" placeholder="搜索流水单号" v-model.trim="filter.orderNo"></el-input>
    </el-form-item>

    <!-- 会员名称 -->
    <el-form-item label="会员名称:">
      <el-input v-model.trim="filter.name" placeholder="搜索会员名称"></el-input>
    </el-form-item>

    <!-- 商品名称 -->
    <el-form-item label="商品名称:">
      <el-input v-model.trim="filter.goodname" placeholder="搜索商品名称"></el-input>
    </el-form-item>

    <!-- 订单状态 -->
    <el-form-item label="订单状态:">
      <el-select placeholder="全部" @change="onFilter" v-model="filter.refundStatus">
        <el-option
          class="dss-query-select-dropdown__item"
          v-for="item in orderStatusEnum.ORDER_REFUND_OPTIONS"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <!-- 用餐方式 -->
    <el-form-item label="用餐方式:">
      <el-select placeholder="全部" @change="onFilter" v-model="filter.refundStatus">
        <el-option
          class="dss-query-select-dropdown__item"
          v-for="item in orderStatusEnum.ORDER_REFUND_OPTIONS"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <!-- 下单时间 -->
    <el-form-item label="下单时间:">
      <el-date-picker
        style="padding-top: 1px"
        class="dss-filter-input"
        v-model="filter.dateRange"
        @change="onQueryTimeChange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <el-button style="margin-left: 2.4rem" type="primary" @click="search">查询</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';
  import utils from '@/dss-common/utils';
  // import orApi from '@/dss-wechat3rd/src/api';

  export default {
    props: {
      // 导出类型判断
      refundType: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        orderStatusEnum,
        filter: {
          orderNo: null, // 订单编号
          name: null, // 店铺类型
          goodname: null, // 店铺名称或编号
          refundStatus: null, // 退款状态
          dateRange: null, // 支付时间
          startDate: null, // 开始时间
          endDate: null, // 结束时间
        },
        loading: false,
      };
    },
    // mounted() {},
    methods: {
      /**
       * 根据下单时间进行查询
       */
      onQueryTimeChange(date) {
        this.dateRange = date;
        this.onFilter();
      },
      /**
       * 改变查询条件通知父组件进行查询
       */
      onFilter() {
        // 下单时间
        if (this.filter.dateRange) {
          this.filter.startDate = utils.timeFormat(this.filter.dateRange[0], 'YYYY-MM-DD');
          this.filter.endDate = utils.timeFormat(this.filter.dateRange[1], 'YYYY-MM-DD');
        }

        for (const key in this.filter) {
          if (!this.filter[key]) {
            this.filter[key] = null;
          }
        }
        this.$emit('filter', this.filter);
      },
      // 搜索
      search() {
        console.log('111');
      },
      // 重置
      reset() {
        const filter = this.filter;
        for (const key in filter) {
          filter[key] = null;
        }

        this.onFilter();
      },
    },
  };
</script>
<style lang="less" scoped>
  .el-button--primary {
    color: #fff;
    background-color: #95b91f;
    border-color: #95b91f;
  }

  .el-button:hover,
  .el-button:focus {
    color: #606266;
    border-color: #dcdfe6;
    background-color: #fff;
  }

  .order-filter-container {
    font-size: 12px;
    position: relative;
    transition: max-height 0.25s;
    min-width: 950px;

    .filter-tab {
      display: inline-block;
      margin-left: 30px;
      vertical-align: middle;
    }

    .filter-tab:first-child {
      margin-left: 0;
    }

    .order-search,
    .el-select {
      width: 200px;
    }

    .hide-container {
      display: flex;
      flex-wrap: wrap;
    }

    &.not-visible {
      max-height: 132px;
      overflow: hidden;
    }

    &.visible {
      height: auto;
      max-height: 496px;
    }
  }

  .filter-select-store {
    width: 200px;

    .el-input.el-input--suffix {
      width: 200px;
    }
  }

  .toggle {
    cursor: pointer;
  }

  .toggle-btn-hidden {
    display: none;
  }

  .toggle-btn-visible {
    display: block;
    position: absolute;
    left: 934px;
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #2196f3;
    line-height: 22px;

    .btn {
      position: relative;
      white-space: nowrap;

      &::after {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        content: '';
        width: 0;
        height: 0;
        margin-left: 3px;
        border-style: solid;
        border-width: 0 6px 6px 6px;
        border-color: transparent transparent #2196f3 transparent;
      }

      &.btn-down {
        &::after {
          margin-top: -3px;
          transform: rotate(180deg);
          -webkit-transition: -webkit-transform 0.25s ease;
          transition: transform 0.25s ease;
        }
      }
    }
  }
</style>
