<template>
  <div class="scores">
    <div class="filters">
      <el-form ref="query" :model="form" inline @submit.native.prevent="$refs.table.search()">
        <el-form-item label="应用">
          <app-select v-model="form.appId" placeholder="请选择应用" clearable></app-select>
        </el-form-item>
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input v-model="form.couponName" placeholder="请输入优惠券名称" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="领取时间" prop="dateRange">
          <date-range-picker v-model="form.dateRange" type="daterange" clearable></date-range-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" clearable placeholder="请选择状态">
            <el-option v-for="val in Status" :key="val" :value="val" :label="StatusName[val]"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button plain @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <fat-table ref="table" :state="form" :fetch-handler="handleFetch">
        <el-table-column label="优惠券名称" prop="name"></el-table-column>
        <el-table-column label="券码" prop="codeStr"></el-table-column>
        <el-table-column label="发放应用" prop="appName"></el-table-column>
        <el-table-column label="优惠券类型" v-slot="{ row }" prop="couponType">
          {{ couponEnum.couponTypeMap[row.couponCategory] }}
        </el-table-column>
        <el-table-column label="消费门槛" v-slot="{ row }">
          <span v-if="row.minimumFee">{{ row.minimumFee | price }}</span>
          <span v-else>无门槛</span>
        </el-table-column>
        <el-table-column label="优惠面值" min-width="120">
          <template slot-scope="{ row }">
            <span v-if="row.couponCategory === couponEnum.CouponType.DISCOUNT_COUPON" class="orange">
              {{ row.discountFee | discount }}折
            </span>
            <span
              v-else-if="
                row.couponCategory === couponEnum.CouponType.PARKING_DURATION_COUPON ||
                row.couponCategory === couponEnum.CouponType.PARKING_AMOUNT_COUPON
              "
              class="orange"
            >
              <template v-if="!row.discountFee"> 免停车费 </template>
              <template v-else-if="row.couponCategory === couponEnum.CouponType.PARKING_DURATION_COUPON">
                {{ (row.discountFee * 60) | time2String }}
              </template>
              <template v-else> ￥{{ row.discountFee | price }} </template>
            </span>
            <span
              v-else-if="row.couponCategory === couponEnum.CouponType.LOGISTICS_COUPON && row.discountFee === 0"
              class="orange"
            >
              免运费
            </span>
            <span v-else-if="row.couponCategory === couponEnum.CouponType.GIFT_COUPON" class="orange">实物</span>
            <span v-else class="orange">￥{{ row.discountFee | price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" v-slot="{ row }">{{ StatusName[row.status] || '-' }}</el-table-column>
        <el-table-column label="领取时间" v-slot="{ row }">{{ row.receiveTime | dateTimeFormat }}</el-table-column>
        <el-table-column label="过期时间" v-slot="{ row }">{{ row.endTime | dateTimeFormat }}</el-table-column>
        <el-table-column label="核销时间" v-slot="{ row }">{{ row.useTime | dateTimeFormat }}</el-table-column>
        <el-table-column label="核销应用" v-slot="{ row }">{{ row.useTime ? row.appName : '' }}</el-table-column>
        <el-table-column label="核销项目" prop="useStoreName"></el-table-column>
        <el-table-column label="核销子项目" prop="subStoreName"></el-table-column>
      </fat-table>
    </div>
  </div>
</template>

<script>
  import { FatTable } from '@/dss-common/components/list-page/index';
  import AppSelect from '@/business-common/components/app-select';
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import api from '@/mod-member/src/api/memberAPI';
  import { couponEnum } from '@/register/wechat3rd';

  const Status = {
    Unused: 1,
    Used: 2,
    Expired: 3,
  };

  const StatusName = {
    [Status.Unused]: '未使用',
    [Status.Used]: '已使用',
    [Status.Expired]: '已过期',
  };

  export default {
    name: 'Coupons',
    components: {
      AppSelect,
      FatTable,
      DateRangePicker,
    },
    props: {
      info: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        Status,
        StatusName,
        couponEnum,
        form: {
          couponName: null,
          status: null,
          appId: null,
          dateRange: null,
        },
      };
    },
    methods: {
      async handleFetch(params) {
        const { dateRange, ...other } = this.form;
        if (dateRange) {
          const [receiveStartTime, receiveEndTime] = dateRange;
          Object.assign(other, { receiveStartTime, receiveEndTime });
        }

        // 分页信息
        const { pagination } = params;
        // 请求参数
        const payload = {
          ...other,
          userId: this.info.id,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        const { data, totalCount } = await api.memberCenter.getCouponRecords(payload);

        return {
          list: data || [],
          total: totalCount,
        };
      },
      onReset() {
        this.form.appId = null;
        this.$refs.query.resetFields();
      },
    },
  };
</script>

<style scoped>
  .orange {
    color: rgba(255, 86, 45, 1);
  }

  .filters {
    padding: 20px;
  }

  .table {
    padding-bottom: 20px;
  }
</style>
