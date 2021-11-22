<template>
  <div class="coupon-list">
    <list-page-layout class="app-list-container">
      <template #main-actions>
        <el-button icon="el-icon-plus" type="primary" @click="handleAddCoupon"> 新建优惠券 </el-button>
      </template>
      <template #filters>
        <el-form ref="form" inline :model="form" class="wkt-opt-label-container" label-suffix="：">
          <el-form-item label="名称搜索" prop="name">
            <el-input
              prefix-icon="el-icon-search"
              v-model="form.name"
              class="w220"
              maxlength="100"
              clearable
              placeholder="请输入优惠券名称"
            />
          </el-form-item>
          <br />
          <el-form-item label="类型搜索" prop="couponCategoryStr">
            <el-select class="w220" v-model="form.couponCategoryStr" clearable placeholder="全部优惠券类型">
              <el-option v-for="item in couponTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态搜索" prop="status">
            <el-select class="w220" v-model="form.status" clearable placeholder="全部优惠券状态">
              <el-option v-for="item in couponStatusList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <br />
          <el-form-item label="活动门店" prop="selectStores">
            <store-select
              ref="stroeSelect"
              :select-stores.sync="form.selectStores"
              :show-dept="isEnterManger"
              :show-store="!isEnterManger"
              :show-total-console="false"
              class="w220"
            />
          </el-form-item>
          <el-form-item label="投放渠道" prop="couponCentreStatus">
            <el-select class="w220" v-model="form.couponCentreStatus" clearable placeholder="全部投放渠道">
              <el-option v-for="item in provideChannelList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button plain @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="coupons-tips">
          注意：创建优惠券后，请到 <a @click="toMiniIndex" class="table-href">页面装修</a>将优惠券配置
        </div>
      </template>
      <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" selectable row-key="id">
        <el-table-column label="优惠券名称" width="120" :show-overflow-tooltip="true" fixed="left" prop="name" />
        <el-table-column label="优惠券类型" width="120">
          <template slot-scope="scope">
            <span>{{ couponTypeMap[scope.row.couponCategory] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template slot-scope="scope">
            <span>{{ couponStatusMap[scope.row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最低消费金额" width="140">
          <template slot-scope="scope">
            <span v-if="!scope.row.minimumFee">无门槛</span>
            <span v-else>￥{{ scope.row.minimumFee | price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="优惠面值" width="140">
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
        <el-table-column label="使用场景" width="120">
          <template slot-scope="scope">
            <span>{{ couponUseScopeTypeMap[scope.row.useScopeType] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效时间" width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.couponType === CouponValidDate.DEFAULT">领取后{{ scope.row.fixedTerm }}天过期</span>
            <span v-else>{{ scope.row.beginTime | time }} 至 {{ scope.row.endTime | time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="140">
          <template slot-scope="scope">
            <div>总量：{{ !scope.row.quantity ? '无限制' : scope.row.quantity }}</div>
            <div>已领：{{ scope.row.issueAmount }}</div>
          </template>
        </el-table-column>
        <el-table-column label="投放渠道" width="120">
          <template slot-scope="scope">
            <span>{{ provideChannelMap[scope.row.couponCentreStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" width="130">
          <template slot-scope="scope"> {{ scope.row.employeeName }}({{ scope.row.roleName }}) </template>
        </el-table-column>
        <el-table-column label="适用项目" width="140" :show-overflow-tooltip="true">
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

        <el-table-column label="操作" min-width="250" fixed="right" v-slot="scope">
          <div style="display: flex; align-items: center">
            <a
              v-if="
                (scope.row.status === CouponStatus.VALID || scope.row.status === CouponStatus.FINISH) &&
                scope.row.isModifyPermitted
              "
              class="table-href"
              @click="handleEditCoupon(scope.row.id)"
              >编辑</a
            >
            <a class="table-href" @click="handleDetail(scope.row.id)">详情</a>
            <el-popover placement="bottom" title="二维码" width="200" trigger="click">
              <img :src="qrCode" v-if="qrCode !== null" class="qr-code" />
              <div v-loading="qrCodeLoading" v-else class="qr-code-loading"></div>
              <a
                v-if="scope.row.status === CouponStatus.VALID || scope.row.status === CouponStatus.FINISH"
                slot="reference"
                class="table-href"
                @click="getCode(scope.row.id)"
                >二维码</a
              >
            </el-popover>
            <a
              v-if="
                scope.row.isModifyPermitted &&
                (scope.row.status === CouponStatus.VALID ||
                  scope.row.status === CouponStatus.FINISH ||
                  scope.row.status === CouponStatus.EXPIRE)
              "
              class="table-href danger"
              @click="handleRemove(scope.row.id)"
            >
              删除
            </a>
          </div>
        </el-table-column>
      </fat-table>
    </list-page-layout>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import couponApi from '@/dss-wechat3rd/src/api/couponApi';
  import StoreSelect from '@/dss-wechat3rd/src/bz_components/store-select-dialog/simple-cascader/index.vue';
  import { FatTable, ListPageLayout } from '@/dss-common/components/list-page/index';
  import SubStoreInfo from '@/dss-wechat3rd/src/components/sub-store-info/index.vue';

  import {
    CouponType,
    couponTypeMap,
    couponTypeList,
    CouponStatus,
    couponStatusMap,
    couponStatusList,
    provideChannelList,
    provideChannelMap,
    couponUseScopeTypeMap,
    CouponValidDate,
  } from '@/dss-wechat3rd/src/constants/coupon';

  export default {
    name: 'CouponList',
    components: { StoreSelect, FatTable, ListPageLayout, SubStoreInfo },
    data() {
      return {
        form: {
          name: '',
          type: '',
          status: '',
          couponAttr: '',
          couponCategoryStr: '',
          couponCentreStatus: '',
          selectStores: [],
        },
        qrCode: null,
        qrCodeLoading: true,
        CouponType,
        couponTypeList, // 优惠券类型
        couponTypeMap,
        CouponStatus,
        couponStatusList, // 优惠券状态
        couponStatusMap,
        provideChannelList, // 发放渠道
        provideChannelMap,
        couponUseScopeTypeMap, // 适用场景
        CouponValidDate,
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
    beforeRouteEnter(to, from, next) {
      next(t => {
        t.$refs.table.refresh();
      });
    },
    methods: {
      handleReset() {
        this.$refs.stroeSelect.reset();
        this.$refs.form.resetFields();
      },
      // 跳转页面装修
      toMiniIndex() {
        this.$router.switchPage('/setting/homedecorate');
      },
      /**
       * 获取优惠券列表
       */
      async handleFetch(e) {
        const { pagination } = e;
        const { selectStores, couponCategoryStr, ...other } = this.form;
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
        const { data, totalCount } = await couponApi.queryV2(params);
        return {
          list: data,
          total: totalCount || 0,
        };
      },
      handleAddCoupon() {
        this.$router.push('/marketing/coupon/coupon-list/add');
      },
      handleEditCoupon(couponNo) {
        this.$router.push(`/marketing/coupon/coupon-list/add?couponNo=${couponNo}`);
      },
      handleDetail(id) {
        this.$router.push(`/marketing/coupon/coupon-list/detail?id=${id}`);
      },
      async getCode(couponId) {
        const { data } = await couponApi.getQrcode({
          maPath: 'wxat-common/pages/coupon-detail/index',
          couponId,
        });
        this.qrCode = data;
      },
      handleRemove(couponInfoId) {
        this.$confirm('确定删除优惠券吗？删除后顾客之前已领到的优惠券，在有效期内还能继续使用。', '删除优惠券', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
          closeOnClickModal: false,
        }).then(() => {
          couponApi.deleteCoupon({ couponInfoId }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功',
            });
            this.$refs.table.fetch();
          });
        });
      },
      handleRemoveAudit(couponInfoId) {
        this.$confirm('确认撤销优惠券申请？', '撤销优惠券申请', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
          closeOnClickModal: false,
        }).then(() => {
          couponApi.removeAudit({ couponInfoId }).then(() => {
            this.$message({
              type: 'success',
              message: '撤销成功',
            });
            this.$refs.table.fetch();
          });
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .coupon-list {
    .wkt-opt-label-container {
      box-shadow: none;
    }

    .coupons-tips {
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #909399;
      line-height: 20px;
      padding-bottom: 16px;
      padding-left: 14px;

      a {
        color: #2e8dff;
      }
    }

    .table-href {
      padding-right: 6px;

      &.danger {
        color: #f5222d;
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

  .qr-code {
    width: 200px;
    height: 200px;
  }

  .qr-code-loading {
    width: 200px;
    height: 200px;
  }
</style>
