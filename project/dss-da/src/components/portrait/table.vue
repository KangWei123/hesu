<template>
  <!--表格-->
  <el-table :data="data" style="width: 100%"> <!-- v-loading="data === null" -->
    <el-table-column label="分布" align="center" prop="name"></el-table-column>
    <el-table-column label="曝光量" align="center">
      <span slot-scope="scope">{{ $utils.addSeparator(scope.row.imp_count_sum) }}</span>
    </el-table-column>
    <el-table-column label="点击量" align="center" prop="click_count_sum">
      <span slot-scope="scope">{{ $utils.addSeparator(scope.row.click_count_sum) }}</span>
    </el-table-column>
    <el-table-column label="点击率" align="center" prop="ctr" min-width="120"></el-table-column>
    <el-table-column label="平均点击单价（￥）" align="center">
      <template slot-scope="scope">{{ $utils.addSeparator(scope.row.avg_price_click) }}</template>
    </el-table-column>
    <el-table-column label="平均千次展示费用（￥）" align="center">
      <template slot-scope="scope">{{ $utils.addSeparator(scope.row.avg_price_pv) }}</template>
    </el-table-column>
    <el-table-column label="预算（￥）" align="center">
      <template slot-scope="scope">{{ $utils.addSeparator(scope.row.budget) }}</template>
    </el-table-column>
    <el-table-column label="总花费（￥）" align="center">
      <template slot-scope="scope">{{ $utils.addSeparator(scope.row.cost) }}</template>
    </el-table-column>
    <!--修改无数据时的展示-->
    <template slot="empty">
      <place-holder></place-holder>
    </template>
  </el-table>
</template>

<script>
  import PlaceHolder from '@/dss-common/components/placeholder/index';

  export default {
    components: {
      PlaceHolder
    },
    props: {
      data: Array
    }
  };
</script>
