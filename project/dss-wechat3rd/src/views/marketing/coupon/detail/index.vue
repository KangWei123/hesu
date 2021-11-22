<template>
  <div class="coupon-list">
    <list-page-layout class="app-list-container">
      <template #filters>
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
          <el-form-item label="券码" prop="code">
            <el-input
              prefix-icon="el-icon-search"
              v-model="form.code"
              class="w220"
              maxlength="100"
              placeholder="请输入券码"
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

          <el-form-item label="适用项目" prop="selectStores">
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
          <el-form-item label="状态搜索" prop="status">
            <el-select class="w220" v-model="form.status" clearable placeholder="全部优惠券状态">
              <el-option
                v-for="item in couponUseStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <br />
          <el-form-item label="有效时间" prop="activityTime">
            <date-range-picker v-model="form.activityTime" type="daterange" />
          </el-form-item>
          <br />
          <el-form-item label="领取时间" prop="receiveTime">
            <date-range-picker v-model="form.receiveTime" type="daterange" />
          </el-form-item>
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
        <el-table-column label="优惠券名称" width="120" :show-overflow-tooltip="true" prop="name" />
        <el-table-column label="优惠券编码" width="220" :show-overflow-tooltip="true" prop="codeStr" />
        <el-table-column label="优惠券类型" width="120" v-slot="{ row }">
          <span>{{ couponTypeMap[row.couponCategory] }}</span>
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
        <el-table-column label="有效期" width="200" v-slot="{ row }">
          <span>{{ row.beginTime | time }} 至 {{ row.endTime | time }}</span>
        </el-table-column>
        <el-table-column label="优惠券状态" width="120" v-slot="{ row }">
          <span>{{ couponUseStatusMap[row.status] }}</span>
        </el-table-column>
        <el-table-column label="领取人" width="200" v-slot="{ row }">
          <user-info-field :avatar="row.avatarImgUrl" :name="row.memberNickName" :phone="row.phone" />
        </el-table-column>
        <el-table-column label="领取时间" width="130" v-slot="{ row }">
          <span>{{ row.receiveTime | time }}</span>
        </el-table-column>
        <el-table-column label="核销时间" width="130" v-slot="{ row }">
          <span>{{ row.useTime | time }}</span>
        </el-table-column>
        <el-table-column label="操作记录" min-width="220" fixed="right" v-slot="{ row }">
          <div style="display: flex; align-items: center">
            <table-actions :options="[{ name: '详情', onClick: () => handleDetail(row) }]" />
          </div>
        </el-table-column>
      </fat-table>
      <coupon-lifecycle-dialog ref="dialog" />
    </list-page-layout>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import DateRangePicker from '@/dss-common/components/date-range-picker/index.vue';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import couponApi from '@/dss-wechat3rd/src/api/couponApi';
  import StoreSelect from '@/dss-wechat3rd/src/bz_components/store-select-dialog/simple-cascader/index.vue';
  import UserInfoField from '@/business-common/components/user-info-field/index.vue';
  import SubStoreInfo from '@/dss-wechat3rd/src/components/sub-store-info/index.vue';

  import {
    couponTypeList,
    couponUseStatusList,
    provideChannelList,
    CouponType,
    couponTypeMap,
    couponUseStatusMap,
    provideChannelMap,
    couponUseScopeTypeMap,
    suitSubStoreTypeEnum,
  } from '@/dss-wechat3rd/src/constants/coupon';
  import CouponLifecycleDialog from './coupon-lifecycle-dialog.vue';

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
      CouponLifecycleDialog,
      SubStoreInfo,
    },
    data() {
      return {
        couponNo: '',
        form: {
          code: '',
          name: '',
          type: '',
          status: '',
          couponNo: '',
          phone: '',
          couponCategoryStr: '',
          couponAttr: '',
          couponCentreStatus: '',
          selectStores: [],
          activityTime: [],
          receiveTime: [start, end],
          useTime: [],
        },
        CouponType,
        couponTypeList, // 优惠券类型
        couponTypeMap,
        couponUseStatusList, // 优惠券状态
        couponUseStatusMap,
        provideChannelList, // 发放渠道
        provideChannelMap,
        couponUseScopeTypeMap, // 适用场景
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
        this.form.receiveTime = [start, end];
      },
      /**
       * 获取优惠券列表
       */
      async handleFetch(e) {
        const { pagination } = e;
        const { selectStores, activityTime, receiveTime, useTime, couponCategoryStr, ...other } = this.form;
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
        if (activityTime && activityTime.length > 0) {
          params.activityStartTime = new Date(activityTime[0]);
          params.activityEndTime = new Date(activityTime[1]);
        }
        if (receiveTime && receiveTime.length > 0) {
          params.receiveStartTime = new Date(receiveTime[0]);
          params.receiveEndTime = new Date(receiveTime[1]);
        }
        if (useTime && useTime.length > 0) {
          params.useStartTime = new Date(useTime[0]);
          params.useEndTime = new Date(useTime[1]);
        }
        Object.keys(params).forEach(i => params[i] === '' && delete params[i]);
        const { data, totalCount } = await couponApi.getDetailList(params);
        return {
          list: data,
          total: totalCount || 0,
        };
      },

      handleDetail(coupon) {
        this.$refs.dialog.show(coupon);
      },
    },
  };
</script>

<style scoped lang="less">
  .coupon-list {
    .wkt-opt-label-container {
      box-shadow: none;
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
