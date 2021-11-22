<template>
  <el-table :data="list" ref="table" v-on="$listeners" :class="{ 'coupon-table': hasCount }">
    <el-table-column type="selection" width="70" v-if="hasSelection" fixed="left"></el-table-column>
    <el-table-column
      label="优惠券名称"
      prop="name"
      min-width="120"
      :show-overflow-tooltip="true"
      fixed="left"
    ></el-table-column>
    <el-table-column label="赠券数" v-if="globalIsUmpPlatformApp && hasCount" min-width="144" fixed="left">
      <template slot-scope="{ row }">
        <count-input :data="row" :selected-ids="selectedIds"></count-input>
      </template>
    </el-table-column>
    <el-table-column label="优惠券类型" min-width="120">
      <template slot-scope="{ row }">{{ couponCategory(row.couponCategory) }}</template>
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="{ row }">{{ STATUS_DESC[row.status] }}</template>
    </el-table-column>
    <el-table-column label="最低消费金额" min-width="140">
      <template slot-scope="scope">
        <span v-if="scope.row.minimumFee === couponEnum.MINIMUMFEE.UNLIMITED">无门槛</span>
        <span v-else>￥{{ scope.row.minimumFee | price }}</span>
      </template>
    </el-table-column>
    <el-table-column label="优惠面值" min-width="120">
      <template slot-scope="scope">
        <span v-if="scope.row.couponCategory === couponEnum.couponCategory.discount" class="orange">
          {{ scope.row.discountFee | discount }}折
        </span>
        <span v-else class="orange">￥{{ scope.row.discountFee | price }}</span>
      </template>
    </el-table-column>
    <el-table-column label="使用场景" min-width="120">
      <template slot-scope="{ row }">{{ useScope(row.useScopeType) }}</template>
    </el-table-column>
    <el-table-column label="有效时间" min-width="200">
      <template slot-scope="scope">
        <span v-if="scope.row.couponType === couponEnum.couponType.default">
          领取后{{ scope.row.fixedTerm }}天过期
        </span>
        <span v-else>{{ formatTime(scope.row.beginTime) }} 至 {{ formatTime(scope.row.endTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="数量" min-width="140">
      <template slot-scope="{ row }">
        <!-- <div>总量：{{ row.quantity === couponEnum.QUANTITY.UNLIMITED ? '无限制' : row.quantity }}</div> -->
        <div>已领：{{ row.issueAmount }}</div>
      </template>
    </el-table-column>
    <template v-if="!globalIsUmpPlatformApp">
      <el-table-column label="赠券数" v-if="hasCount" min-width="144" fixed="right">
        <template slot-scope="{ row }">
          <count-input :data="row" :selected-ids="selectedIds"></count-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" v-if="!hasSelection">
        <template slot-scope="{ $index }">
          <el-link type="danger" @click="$emit('delete', $index)">删除</el-link>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
  import couponEnum from '@/mod-member/src/enum/couponEnum';
  import dateUtil from '@/dss-common/utils/date';
  import CountInput from './count-input.vue';

  export default {
    components: { CountInput },
    props: {
      hasSelection: Boolean, // 是否能选择
      hasCount: Boolean, // 是否可输入赠券数
      list: {
        type: Array,
        default: () => [],
      },
      selectedIds: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        couponEnum,
        STATUS_DESC: couponEnum.getStatusDesc(),
      };
    },
    methods: {
      couponCategory(val) {
        switch (val) {
          case couponEnum.couponCategory.default:
            return '满减券';
          case couponEnum.couponCategory.freight:
            return '运费券';
          case couponEnum.couponCategory.discount:
            return '折扣券';
        }
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
      formatTime(val) {
        return dateUtil.format(new Date(val), 'YYYY-MM-DD HH:mm');
      },
    },
    computed: {
      elTable: {
        cache: false,
        get() {
          return this.$refs.table;
        },
      },
    },
  };
</script>

<style lang="less" scoped>
  .coupon-table /deep/ td {
    padding: 5px 0 !important;
  }
</style>
