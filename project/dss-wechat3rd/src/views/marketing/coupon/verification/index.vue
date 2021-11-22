<template>
  <div class="coupon-list">
    <list-page-layout class="app-list-container">
      <template #filters>
        <div class="coupon-list-code">
          <span class="coupon-code-label">券码(验证码)</span>
          <el-input class="coupon-code-input" v-model="code" placeholder="请输入优惠券码" />
          <el-button type="primary" @click="handleCheck" :disabled="!code"> 校验 </el-button>
        </div>
        <el-form ref="form" inline :model="form" class="wkt-opt-label-container" label-suffix="：">
          <el-form-item label="名称搜索" prop="name">
            <el-input
              prefix-icon="el-icon-search"
              v-model="form.name"
              class="w220"
              maxlength="100"
              placeholder="请输入优惠券名称"
            />
          </el-form-item>
          <el-form-item label="券码(验证码)" prop="code">
            <el-input
              prefix-icon="el-icon-search"
              v-model="form.code"
              class="w220"
              maxlength="100"
              placeholder="请输入优惠券码"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              prefix-icon="el-icon-search"
              v-model="form.phone"
              class="w220"
              maxlength="11"
              placeholder="请输入手机号"
            />
          </el-form-item>
          <br />

          <el-form-item label="项目名称" prop="selectStores" :show-overflow-tooltip="true">
            <store-select
              ref="stroeSelect"
              :select-stores.sync="form.selectStores"
              :show-dept="isEnterManger"
              :show-store="!isEnterManger"
              :show-total-console="false"
              class="w220"
            />
          </el-form-item>
          <el-form-item label="类型搜索" prop="couponCategoryStr">
            <el-select class="w220" v-model="form.couponCategoryStr" clearable placeholder="全部优惠券类型">
              <el-option v-for="item in couponTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="核销来源" prop="verificationSource">
            <el-select class="w220" v-model="form.verificationSource" clearable placeholder="全部优惠券核销来源">
              <el-option
                v-for="item in verificationSourceList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <br />
          <el-form-item label="核销时间" prop="useTime">
            <date-range-picker v-model="form.useTime" type="daterange" />
          </el-form-item>

          <el-form-item>
            <el-button plain @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
      <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" selectable row-key="id">
        <el-table-column label="项目名称" min-width="150" v-slot="{ row }" :show-overflow-tooltip="true">
          <span :title="(row.storeNameList || []).join('，')">
            {{ (row.storeNameList || []).join('，') || '全部门店' }}
          </span>
        </el-table-column>
        <el-table-column label="子项目名称" min-width="150" v-slot="{ row }">
          <sub-store-info :data="row"></sub-store-info>
        </el-table-column>

        <el-table-column label="核销来源" width="120" v-slot="{ row }">
          <span>{{ row.verificationSource !== null ? verificationSourceMap[row.verificationSource] : '-' }}</span>
        </el-table-column>
        <el-table-column label="券名称" width="120" :show-overflow-tooltip="true" prop="name" />
        <el-table-column label="优惠券编码" width="220" :show-overflow-tooltip="true" prop="codeStr" />
        <el-table-column label="优惠券类型" width="120" v-slot="{ row }">
          <span>{{ couponTypeMap[row.couponCategory] }}</span>
        </el-table-column>
        <el-table-column label="核销时间" width="130" v-slot="{ row }">
          <span>{{ row.useTime | time }}</span>
        </el-table-column>
        <el-table-column label="消费门槛" width="120" v-slot="{ row }">
          <span v-if="!row.minimumFee">无门槛</span>
          <span v-else>￥{{ row.minimumFee | price }}</span>
        </el-table-column>
        <el-table-column label="优惠内容" width="140" v-slot="{ row }">
          <span v-if="row.couponCategory === CouponType.DISCOUNT_COUPON" class="orange">
            {{ row.discountFee | discount }}折
          </span>
          <span
            v-else-if="
              row.couponCategory === CouponType.PARKING_DURATION_COUPON ||
              row.couponCategory === CouponType.PARKING_AMOUNT_COUPON
            "
            class="orange"
          >
            <template v-if="!row.discountFee"> 免停车费 </template>
            <template v-else-if="row.couponCategory === CouponType.PARKING_DURATION_COUPON">
              {{ (row.discountFee * 60) | time2String }}
            </template>
            <template v-else>￥{{ row.discountFee | price }}</template>
          </span>
          <span v-else-if="row.couponCategory === CouponType.LOGISTICS_COUPON && row.discountFee === 0" class="orange">
            免运费
          </span>
          <span v-else-if="row.couponCategory === CouponType.GIFT_COUPON" class="orange">实物</span>
          <span v-else class="orange">￥{{ row.discountFee | price }}</span>
        </el-table-column>
        <el-table-column label="使用人" width="200" v-slot="{ row }">
          <user-info-field :avatar="row.avatarImgUrl" :name="row.memberNickName" :phone="row.phone" />
        </el-table-column>
        <el-table-column label="核销人员" width="120" prop="verifierName" />
        <el-table-column label="操作" min-width="220" fixed="right" v-slot="{ row }">
          <div style="display: flex; align-items: center">
            <table-actions :options="[{ name: '撤销核销', onClick: () => handleRevoke(row.codeStr) }]" />
          </div>
        </el-table-column>
      </fat-table>
      <verification-dialog ref="dialog" @submit="handleVerification" />
    </list-page-layout>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import couponApi from '@/dss-wechat3rd/src/api/couponApi';
  import StoreSelect from '@/dss-wechat3rd/src/bz_components/store-select-dialog/simple-cascader/index.vue';
  import UserInfoField from '@/business-common/components/user-info-field/index.vue';
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import SubStoreInfo from '@/dss-wechat3rd/src/components/sub-store-info/index.vue';
  import {
    CouponType,
    couponTypeList,
    couponTypeMap,
    verificationSourceMap,
    verificationSourceList,
    suitSubStoreTypeEnum,
  } from '@/dss-wechat3rd/src/constants/coupon';
  import VerificationDialog from './verification-dialog.vue';

  const end = new Date();
  end.setHours(23, 59, 59);
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30); // 前一个月
  start.setHours(0, 0, 0);

  export default {
    name: 'CouponVerification',
    components: {
      DateRangePicker,
      UserInfoField,
      StoreSelect,
      FatTable,
      ListPageLayout,
      TableActions,
      VerificationDialog,
      SubStoreInfo,
    },
    data() {
      return {
        code: '',
        form: {
          name: '',
          code: '',
          phone: '',
          couponCategoryStr: '',
          couponAttr: '',
          verificationSource: '',
          selectStores: [],
          useTime: [start, end],
        },
        CouponType,
        couponTypeList, // 优惠券类型
        couponTypeMap,
        verificationSourceMap,
        verificationSourceList,
        suitSubStoreTypeEnum,
      };
    },
    computed: {
      ...mapState({
        roleList: 'roleList',
      }),
      // key管/企业管理员享有相同权限
      isEnterManger() {
        return (
          !!~this.roleList.indexOf('common_role_enterprise') ||
          !!~this.roleList.indexOf('common_role_admin') ||
          !!~this.roleList.indexOf('common_role_platform_manage')
        );
      },
    },
    methods: {
      handleReset() {
        this.$refs.form.resetFields();
        this.$refs.stroeSelect.reset();
        this.form.useTime = [start, end];
      },
      /**
       * 获取优惠券列表
       */
      async handleFetch(e) {
        const { pagination } = e;
        const { selectStores, useTime, couponCategoryStr, ...other } = this.form;
        const params = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          storeIds: selectStores.toString(),
          couponCategoryStr:
            couponCategoryStr === CouponType.PARKING_COUPON
              ? `${CouponType.PARKING_AMOUNT_COUPON},${CouponType.PARKING_DURATION_COUPON}`
              : `${couponCategoryStr}`,
          ...other,
        };
        Object.keys(params).forEach(i => params[i] === '' && delete params[i]);
        if (useTime && useTime.length > 0) {
          params.useStartTime = new Date(useTime[0]);
          params.useEndTime = new Date(useTime[1]);
        }
        const { data, totalCount } = await couponApi.getVerificationList(params);
        return {
          list: data,
          total: totalCount,
        };
      },

      handleCheck() {
        this.$refs.dialog.show(this.code);
      },

      handleRevoke(code) {
        this.$confirm('此优惠券已核销，是否确认撤销核销？', '撤销核销', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
          closeOnClickModal: false,
        }).then(() => {
          couponApi.revokeVerification({ code }).then(() => {
            this.$message({
              type: 'success',
              message: '撤销成功!',
            });
            this.$refs.table.fetch();
          });
        });
      },

      handleVerification() {
        this.$message({
          type: 'success',
          message: '优惠券核销成功!',
        });
        this.$refs.table.fetch();
      },
    },
  };
</script>

<style scoped lang="less">
  .coupon-list {
    .wkt-opt-label-container {
      box-shadow: none;
    }

    .coupon-list-code {
      padding-bottom: 16px;
      margin-bottom: 16px;
      border-bottom: 1px solid #eff4fa;

      .coupon-code-label {
        min-width: 105px;
      }

      .coupon-code-input {
        width: 220px;
        margin: 0 16px;
      }
    }

    .el-input--mini .el-input__inner {
      height: 30px;
      line-height: 30px;
    }

    .orange {
      color: rgba(255, 86, 45, 1);
    }
  }
</style>
