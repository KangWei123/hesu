<template>
  <div class="coupon-list" v-loading="isLoading">
    <div class="coupon-list-filter">
      <div class="coupon-list-filter-box"></div>
      <el-form inline :model="filter" ref="filter" @submit.native.prevent class="wkt-opt-label-container">
        <el-form-item label="名称搜索：" prop="keyword">
          <el-input
            type="input"
            v-model="filter.keyword"
            class="dss-filter-large-input"
            @blur="onFliter"
            @keyup.enter.native="onFliter"
            maxlength="100"
            @input="doSearch"
            placeholder="请输入优惠券名称"
          ></el-input>
        </el-form-item>
        <!-- 优惠券类型 -->
        <el-form-item label="状态搜索：" prop="couponCategory">
          <el-select
            placeholder="全部优惠券类型"
            v-model="filter.couponCategory"
            style="margin-left: 5px"
            clearable
            @change="onFliter"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.value"
              :label="item.type"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 投放渠道 -->
        <el-form-item label="投放渠道：" prop="couponCentreStatus">
          <el-select
            placeholder="全部投放渠道"
            v-model="filter.couponCentreStatus"
            style="margin-left: 5px"
            clearable
            @change="onFliter"
          >
            <el-option v-for="item in channeList" :key="item.value" :label="item.type" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button class="single-search-btn" plain @click="onReset"> 重置 </el-button>
        </el-form-item>
      </el-form>
      <div class="coupons-tips">
        注意：创建优惠券后，请到<a @click="toMiniIndex" class="table-href">页面装修</a>将优惠券配置
      </div>
    </div>

    <div class="goods-list">
      <el-row>
        <el-table :data="couponlist" class="wkt-table">
          <el-table-column label="优惠券名称" width="280" fixed="left">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status === couponEnum.status.INVALID">无效</span>
              <span v-if="scope.row.status === couponEnum.status.VALID">有效</span>
              <span v-if="scope.row.status === couponEnum.status.EXPIRE">过期</span>
              <span v-if="scope.row.status === couponEnum.status.FINISH">发放完毕</span>
            </template>
          </el-table-column>

          <el-table-column label="最低消费金额" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.minimumFee === couponEnum.MINIMUMFEE.UNLIMITED">无门槛</span>
              <span v-else>￥{{ scope.row.minimumFee | price }}</span>
            </template>
          </el-table-column>

          <el-table-column label="优惠面值" width="150">
            <template slot-scope="scope">
              <span class="orange">￥{{ scope.row.discountFee | price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="使用场景" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.useScopeType | useScope }}</span>
            </template>
          </el-table-column>

          <el-table-column label="有效时间" width="250">
            <template slot-scope="scope">
              <span v-if="scope.row.couponType === couponEnum.couponType.default"
                >领取后{{ scope.row.fixedTerm }}天过期</span
              >
              <span v-else>{{ scope.row.beginTime | time }} 至 {{ scope.row.endTime | time }}</span>
            </template>
          </el-table-column>

          <el-table-column label="删除人" width="130" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.updateName }}
            </template>
          </el-table-column>

          <el-table-column label="数量" width="150">
            <template slot-scope="scope">
              <div>
                总量：{{ scope.row.quantity === couponEnum.QUANTITY.UNLIMITED ? '无限制' : scope.row.quantity }}
              </div>
              <div>已领：{{ scope.row.issueAmount }}</div>
            </template>
          </el-table-column>

          <el-table-column label="投放渠道" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.couponCentreStatus === couponEnum.couponCentreStatus.COUPON_CENTER">领券中心</span>
              <span v-else-if="scope.row.couponCentreStatus === couponEnum.couponCentreStatus.MARKETING_USE"
                >营销专用</span
              >
              <span v-else-if="scope.row.couponCentreStatus === couponEnum.couponCentreStatus.GUIDE_USE">导购专用</span>
            </template>
          </el-table-column>

          <el-table-column label="项目名称" min-width="150" v-slot="{ row }" :show-overflow-tooltip="true">
            <span :title="(row.storeNameList || []).join('，')">
              {{ (row.storeNameList || []).join('，') || '全部门店' }}
            </span>
          </el-table-column>
          <el-table-column label="子项目名称" min-width="150" v-slot="{ row }">
            <sub-store-info :data="row"></sub-store-info>
          </el-table-column>

          <el-table-column label="操作" min-width="80" fixed="right">
            <template slot-scope="scope">
              <div>
                <a href="javascript:;" class="table-href" @click="handleDetail(scope.row.id)">详情</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <div class="block">
          <!-- <el-pagination v-if="totalMemberCount"
                         layout="prev, pager, next, jumper, sizes, total"
                         :total="totalMemberCount"
                         :page-size="pageParams.pageSize"
                         :current-page="pageParams.pageNo"
                         :page-sizes="[5, 10, 20, 30, 40, 50]"
                         @size-change="onSizeChange"
                         @current-change="onPageChange"
                         class="wkt-pagination">
          </el-pagination> -->
          <el-pagination
            v-if="totalMemberCount"
            :hide-on-single-page="true"
            @size-change="onSizeChange"
            @current-change="onPageChange"
            :page-size="pageParams.pageSize"
            layout="sizes, prev, pager, next"
            :total="totalMemberCount"
          >
          </el-pagination>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
  import couponApi from '@/dss-wechat3rd/src/api/couponApi';
  import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum';
  import dateUtil from '@/dss-common/utils/date';
  import { suitSubStoreTypeEnum } from '@/dss-wechat3rd/src/constants/coupon';
  import SubStoreInfo from '@/dss-wechat3rd/src/components/sub-store-info/index.vue';

  export default {
    name: 'Couponlist',
    components: { SubStoreInfo },
    data() {
      return {
        suitSubStoreTypeEnum,
        couponEnum,
        couponlist: [],
        filter: {
          keyword: '',
          couponCategory: '',
          couponCentreStatus: '',
        },
        totalMemberCount: 0,
        pageParams: {
          pageSize: 10,
          pageNo: 1,
        },
        isLoading: false,
        qrCode: null,
        qrCodeLoading: true,
        categoryList: [
          { value: couponEnum.couponCategory.default, type: '满减券' },
          { value: couponEnum.couponCategory.freight, type: '运费券' },
          { value: couponEnum.couponCategory.discount, type: '折扣券' },
        ],
        channeList: [
          { value: couponEnum.couponCentreStatus.COUPON_CENTER, type: '领券中心' },
          { value: couponEnum.couponCentreStatus.MARKETING_USE, type: '营销专用' },
          { value: couponEnum.couponCentreStatus.GUIDE_USE, type: '导购专用' },
        ],
      };
    },
    filters: {
      time(val) {
        return dateUtil.format(new Date(val), 'YYYY-MM-DD');
      },
      useScope(val) {
        if (val === couponEnum.useScopeType.online.value) {
          return couponEnum.useScopeType.online.label;
        } else if (val === couponEnum.useScopeType.offline.value) {
          return couponEnum.useScopeType.offline.label;
        } else {
          return couponEnum.useScopeType.common.label;
        }
      },
    },
    // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.doSearch(); // 获取优惠券列表
      });
    },

    mounted() {},
    methods: {
      onFliter: function (key) {
        this.pageParams.pageNo = 1;
        this.doSearch(key);
      },
      // 跳转页面装修
      toMiniIndex() {
        this.$router.switchPage('/setting/homedecorate');
      },
      /**
       * 获取优惠券列表
       */
      doSearch: function (key) {
        this.isLoading = true;
        couponApi
          .queryV2({
            name: this.filter.keyword ? this.filter.keyword : undefined,
            pageNo: this.pageParams.pageNo,
            pageSize: this.pageParams.pageSize,
            status: 0,
            couponCategory: this.filter.couponCategory,
            couponCentreStatus: this.filter.couponCentreStatus,
          })
          .then(rs => {
            this.couponlist = rs.data || [];
            this.totalMemberCount = rs.totalCount;
          })
          .catch(err => {
            console.error(err);
          })
          .always(() => {
            this.isLoading = false;
          });
      },
      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.doSearch();
      },
      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.doSearch();
      },

      handleDetail(couponId) {
        this.$router.push({
          path: '/marketing/coupon/discard/detail',
          query: {
            id: couponId,
          },
        });
      },
      onReset() {
        this.$refs.filter.resetFields();
        this.pageParams.pageNo = 1;
        this.doSearch();
      },
    },
  };
</script>

<style scoped lang="less">
  .coupon-list {
    .coupon-list-filter {
      position: relative;
      padding-left: 20px;
      padding-bottom: 10px;
      background: #fff;

      .coupon-list-filter-box {
        position: absolute;
        top: 30px;
        right: 20px;
      }

      .wkt-opt-label-container {
        /* padding-bottom: 10px; */
        margin-bottom: -13px;
        box-shadow: none;
      }
    }

    .coupons-tips {
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #909399;
      line-height: 20px;
      padding-left: 20px;

      a {
        color: #2e8dff;
      }
    }

    .dss-link {
      padding: 0 10px;
    }

    .avatar-size {
      font-size: 40px;
      color: #e4e4e4;
    }

    .table-container {
      padding: 30px 20px;
      background: white;
      margin-bottom: 30px;
    }

    .el-input--mini .el-input__inner {
      height: 30px;
      line-height: 30px;
    }

    .goods-list {
      /* padding: 20px 20px; */
      border-radius: 4px;
      background: white;
      margin-top: 16px;

      .el-table {
        padding-top: 0;
      }
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
