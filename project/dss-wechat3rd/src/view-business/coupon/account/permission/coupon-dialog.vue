<template>
  <drawer-layout append-to-body v-model="isShow" title="选择优惠券" size="64%">
    <template #content>
      <div class="coupon-filter">
        <el-form label-width="86px" ref="$couponForm" inline :model="conponData">
          <el-form-item label="优惠券：" prop="name">
            <el-input
              v-model="conponData.name"
              :maxlength="100"
              placeholder="请输入优惠券名称"
              clearable
              class="w200"
            />
          </el-form-item>
          <el-form-item label="券类型：" prop="couponCategoryStr">
            <el-select clearable v-model="conponData.couponCategoryStr" class="w200">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in couponTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="售卖项目：" prop="selectStores">
            <store-select
              ref="$stroeSelect"
              :show-dept="isEnterManger"
              :show-store="!isEnterManger"
              :show-total-console="false"
              :select-stores.sync="conponData.selectStores"
              class="w200"
            />
          </el-form-item>
          <el-form-item>
            <el-button class="reset-btn" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <fat-table
        ref="$table"
        need-select-data
        :selected-data.sync="selectedData"
        :selected.sync="selectedCouponId"
        selectable
        :check-selectable="selectable"
        row-key="id"
        :search-on-state-change="false"
        :fetch-handler="handleFetch"
      >
        <el-table-column fixed="left" min-width="140" label="名称" prop="name"></el-table-column>
        <el-table-column min-width="100" label="ID" prop="id"></el-table-column>
        <el-table-column min-width="100" label="类型">
          <template slot-scope="scope">
            <span>{{ couponTypeMap[scope.row.couponCategory] }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="140" label="消费门槛" align="right">
          <template slot-scope="scope">
            <span v-if="!scope.row.minimumFee">无门槛</span>
            <span v-else>￥{{ scope.row.minimumFee | price }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="140" label="优惠券金额" align="right">
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
        <el-table-column min-width="160" label="有效时间">
          <template slot-scope="scope">
            <span v-if="scope.row.couponType === CouponValidDate.DEFAULT">领取后{{ scope.row.fixedTerm }}天过期</span>
            <span v-else>{{ scope.row.beginTime | time }} 至 {{ scope.row.endTime | time }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="140" label="数量">
          <template slot-scope="scope">
            <div>总量：{{ !scope.row.quantity ? '无限制' : scope.row.quantity }}</div>
            <div>已领：{{ scope.row.issueAmount }}</div>
          </template>
        </el-table-column>
        <el-table-column min-width="140" label="适用项目" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="scope.row.suitStoreType" :title="(scope.row.storeNameList || []).join('，')">
              {{ (scope.row.storeNameList || []).join('，') }}
            </span>
            <span v-else>全部门店</span>
          </template>
        </el-table-column>
        <el-table-column label="适用子项目" width="140" v-slot="{ row }">
          <sub-store-info :data="row"></sub-store-info>
        </el-table-column>
      </fat-table>
    </template>
    <template #button>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </drawer-layout>
</template>

<script>
  import { mapState } from 'vuex';
  import { FatTable } from '@/dss-common/components/list-page';
  import DrawerLayout from './components/drawer-layout.vue';
  import StoreSelect from '@/dss-wechat3rd/src/bz_components/store-select-dialog/simple-cascader/index.vue';
  import {
    couponTypeList,
    ProvideChannel,
    couponTypeMap,
    CouponType,
    CouponValidDate,
  } from '@/dss-wechat3rd/src/constants/coupon';
  import couponApi from '@/dss-wechat3rd/src/api/couponApi';
  import { queryAccountCouponAuthByList } from '@/dss-wechat3rd/src/api/account-coupon';
  import SubStoreInfo from '@/dss-wechat3rd/src/components/sub-store-info/index.vue';

  export default {
    name: 'CouponDialog',
    components: {
      FatTable,
      DrawerLayout,
      StoreSelect,
      SubStoreInfo,
    },
    props: {
      couponSelect: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        isShow: false,
        conponData: {
          name: null,
          couponCategoryStr: '',
          selectStores: [],
        },
        selectCouponList: [],
        selectedCouponId: [],
        selectedData: [],
        couponTypeList,
        couponTypeMap,
        CouponType,
        CouponValidDate,
      };
    },
    watch: {
      conponData: {
        deep: true,
        handler() {
          this.$refs.$table && this.$refs.$table.debouncedSearch();
        },
      },
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
      searchTable() {
        this.$refs.$table.debouncedSearch();
      },
      selectable(row) {
        return row._isSelect;
      },
      handleReset() {
        this.$refs.$stroeSelect.reset();
        this.$refs.$couponForm.resetFields();
      },
      submit() {
        this.$emit('update:coupon-select', this.selectedData);
        this.close();
      },
      changeIds(ids) {
        this.selectedCouponId = ids;
      },
      async handleFetch({ pagination }) {
        const { selectStores, couponCategoryStr, ...other } = this.conponData;
        const params = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          storeIds: selectStores.toString(),
          couponCentreStatus: ProvideChannel.MARKETING_CENTER,
          couponCategoryStr:
            couponCategoryStr === CouponType.PARKING_COUPON
              ? `${CouponType.PARKING_AMOUNT_COUPON},${CouponType.PARKING_DURATION_COUPON}`
              : `${couponCategoryStr}`,
          ...other,
        };
        const { data: checkList } = await queryAccountCouponAuthByList({
          accountId: this.$route.query.id,
        });
        const { data, totalCount } = await couponApi.queryV2(params);
        if (data) {
          data.forEach(item => {
            item._isSelect = !checkList.some(citem => {
              return citem.couponId.toString() === item.id.toString();
            });
          });
        }
        return {
          list: data || [],
          total: totalCount || 0,
        };
      },
      show() {
        this.isShow = true;
      },
      close() {
        this.isShow = false;
      },
    },
  };
</script>

<style lang="less" scoped>
  .coupon-filter {
    padding: 0 20px 10px 20px;

    .reset-btn {
      margin-left: 10px;
    }
  }

  .orange {
    color: rgba(255, 86, 45, 1);
  }
</style>
