<template>
  <list-page-layout class="voucherConfig">
    <template #main-actions>
      <el-button @click="editDialog()" type="primary">+ 新增发券权限</el-button>
    </template>
    <template #filters>
      <el-form ref="$form" :model="formData" inline>
        <el-form-item label="券名称：" prop="couponName">
          <el-input :maxlength="100" class="w220" v-model="formData.couponName" clearable placeholder="请输入优惠券名称"
            ><i slot="prefix" class="el-input__icon el-icon-search"></i
          ></el-input>
        </el-form-item>
        <el-form-item label="权限状态：" prop="status">
          <el-select class="w220" v-model="formData.status" placeholder="请选择权限状态">
            <el-option label="全部" value="" />
            <el-option
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-for="item in voucherCouponStatusList"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetData">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table ref="$couponTable" :state.sync="formData" :fetch-handler="handleFetch">
      <el-table-column fixed="left" min-width="126" label="券名称" prop="couponName"></el-table-column>
      <el-table-column min-width="120" label="优惠券ID" prop="couponId"></el-table-column>
      <el-table-column min-width="96" label="类型">
        <template slot-scope="scope">
          <span>{{ couponTypeMap[scope.row.couponCategory] }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="126" label="门槛 " align="right">
        <template slot-scope="scope">
          <span v-if="!scope.row.minimumFee">无门槛</span>
          <span v-else>￥{{ scope.row.minimumFee | price }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="优惠金额" align="right">
        <template slot-scope="scope">
          <span v-if="scope.row.couponCategory === CouponType.DISCOUNT_COUPON" class="orange">
            {{ scope.row.discountFee | discount }}折
          </span>
          <span
            v-else-if="
              scope.row.couponCategory === CouponType.PARKING_DURATION_COUPON ||
              scope.row.couponCategory === CouponType.PARKING_AMOUNT_COUPON
            "
            class="orange"
          >
            <template v-if="!scope.row.discountFee"> 免停车费 </template>
            <template v-else-if="scope.row.couponCategory === CouponType.PARKING_DURATION_COUPON">
              {{ (scope.row.discountFee * 60) | time2String }}
            </template>
            <template v-else> ￥{{ scope.row.discountFee | price }} </template>
          </span>
          <span
            v-else-if="scope.row.couponCategory === CouponType.LOGISTICS_COUPON && scope.row.discountFee === 0"
            class="orange"
          >
            免运费
          </span>
          <span v-else-if="scope.row.couponCategory === CouponType.GIFT_COUPON" class="orange">实物</span>
          <span v-else class="orange">￥{{ scope.row.discountFee | price }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="210" label="权限有效期">
        <template slot-scope="scope">
          <span
            >{{ scope.row.beginTime | time('YYYY-MM-DD 00:00:00') }} 至
            {{ scope.row.endTime | time('YYYY-MM-DD 23:59:59') }}</span
          >
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="发券额度">
        <template slot-scope="scope">
          <span>{{ scope.row.quantity | isInfinite(scope.row.adjustType) }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="已用额度" prop="grantAmount"></el-table-column>
      <el-table-column min-width="120" label="剩余额度" prop="remainingQuantity">
        <template slot-scope="scope">
          <span>{{ scope.row.remainingQuantity | isInfinite(scope.row.adjustType) }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="权限状态" align="center">
        <template slot-scope="scope">
          <el-switch
            @change="changeStatus(scope.row, scope.$index)"
            :value="!!scope.row.status"
            active-text="启用"
            inactive-text="关闭"
          />
        </template>
      </el-table-column>
      <el-table-column min-width="160" label="配置人">
        <template slot-scope="{ row }">
          <div>{{ row.createUserName }}</div>
          <div>{{ row.createUserRoleName }}</div>
        </template>
      </el-table-column>
      <el-table-column min-width="130" label="配置时间" prop="createTime"></el-table-column>
      <el-table-column fixed="right" min-width="148" label="操作" align="right" v-slot="{ row }">
        <table-actions
          :options="[
            {
              name: '编辑',
              onClick: () => {
                editDialog(row);
              },
            },
            {
              name: '额度明细',
              onClick: () => {
                amountChange(row);
              },
            },
          ]"
        />
      </el-table-column>
    </fat-table>
    <!-- 额度变动明细 -->
    <amount-change-dialog ref="$AmountChangeDialog" />
    <!-- 配置优惠券权限 -->
    <edit-dialog @change-list="$refs.$couponTable.search()" ref="$editDialog" />
  </list-page-layout>
</template>

<script>
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page';
  import AmountChangeDialog from './amount-change-dialog.vue';
  import editDialog from './edit-dialog.vue';
  import { queryCouponPage, editCouponAuth } from '@/dss-wechat3rd/src/api/account-coupon';
  import { voucherCouponStatusList, couponTypeMap, CouponType } from '@/dss-wechat3rd/src/constants/coupon';
  import { adjustType } from '@/dss-wechat3rd/src/view-business/enum';

  export default {
    name: 'VoucherConfig',
    components: {
      ListPageLayout,
      FatTable,
      TableActions,
      AmountChangeDialog,
      editDialog,
    },
    data() {
      return {
        formData: {
          couponName: '',
          status: '',
        },
        voucherCouponStatusList,
        couponTypeMap,
        CouponType,
      };
    },
    filters: {
      isInfinite(val, type) {
        return type === adjustType.infinite ? '无上限' : val;
      },
    },
    methods: {
      resetData() {
        this.$refs.$form.resetFields();
        this.$refs.$couponTable.debouncedSearch();
      },
      async changeStatus(row, index) {
        const item = JSON.parse(JSON.stringify(row));
        item.status = +!item.status;
        await editCouponAuth({
          id: item.id,
          status: item.status,
        });
        this.$refs.$couponTable.handleRefreshItem(item, index);
      },
      async handleFetch({ pagination }) {
        const params = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          accountId: this.$route.query.id,
          ...this.formData,
        };
        const { data, totalCount } = await queryCouponPage(params);
        return { list: data, total: totalCount };
      },
      editDialog(row = null) {
        this.$refs.$editDialog.show(row);
      },
      amountChange(row) {
        this.$refs.$AmountChangeDialog.show({ couponId: row.couponId, accountId: this.$route.query.id });
      },
    },
  };
</script>

<style lang="less" scoped>
  .voucherConfig {
    /deep/ .list-page__main-actions {
      top: -1px;
    }

    .orange {
      color: rgba(255, 86, 45, 1);
    }
  }
</style>
