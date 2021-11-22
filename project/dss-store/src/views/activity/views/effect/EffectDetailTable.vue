<template>
  <el-table :data="data" style="width: 100%" max-height="540"> <!-- v-loading="data === null" -->
    <el-table-column label="时间" align="center" prop="time"></el-table-column>
    <el-table-column label="客流量" align="center">
      <span slot-scope="scope">{{ scope.row.passengerNum | number }}</span>
    </el-table-column>
    <el-table-column label="客户量" align="center" prop="click_count_sum">
      <span slot-scope="scope">{{ scope.row.customerNum | number }}</span>
    </el-table-column>

    <el-table-column label="新客数量" align="center">
      <template slot-scope="scope">{{ scope.row.newCustomerNum | number }}</template>
    </el-table-column>
    <el-table-column label="老客数量" align="center">
      <template slot-scope="scope">{{ scope.row.oldCustomerNum | number }}</template>
    </el-table-column>
    <el-table-column label="入店率" prop="entryRate" align="center"></el-table-column>
    <el-table-column label="客户质量" align="center">
      <template slot-scope="scope">{{ scope.row.customerQuality | number }}</template>
    </el-table-column>
    <!--修改无数据时的展示-->
    <template slot="empty">
      <place-holder></place-holder>
    </template>
  </el-table>
</template>

<script>
  import PlaceHolder from '@/dss-common/components/placeholder/index';
  import ArrowRate from '../../components/ArrowRate';

  export default {
    components: {
      PlaceHolder,
      ArrowRate
    },
    props: {
      data: Array
    }
  };
</script>
