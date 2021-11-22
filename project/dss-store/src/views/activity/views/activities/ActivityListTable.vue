<template>
  <div class="activity-list-table">
    <el-table :data="activityList" stripe style="width: 100%">
      <el-table-column prop="id" label="活动ID" width="100"></el-table-column>
      <el-table-column label="活动名称" width="180">
        <span slot-scope="scope" class="ellipsis" :title="scope.row.name">{{ scope.row.name }}</span>
      </el-table-column>
      <el-table-column prop="dateRange" label="活动时间" width="220"></el-table-column>
      <el-table-column prop="passengerNum" label="客流量" width="120"></el-table-column>
      <el-table-column label="环比" width="150">
        <template slot-scope="scope">
          <arrow-rate :rate="scope.row.passengerRate"></arrow-rate>
        </template>
      </el-table-column>
      <el-table-column prop="customerNum" label="客户数" width="120"></el-table-column>
      <el-table-column label="环比" width="150">
        <template slot-scope="scope">
          <arrow-rate :rate="scope.row.customerRate"></arrow-rate>
        </template>
      </el-table-column>
      <el-table-column prop="newCustomerNum" label="新客户数" width="120"></el-table-column>
      <el-table-column label="环比" width="150">
        <template slot-scope="scope">
          <arrow-rate :rate="scope.row.newCustomerRate"></arrow-rate>
        </template>
      </el-table-column>
      <el-table-column prop="oldCustomerNum" label="老客户数" width="120"></el-table-column>
      <el-table-column label="环比" width="150">
        <template slot-scope="scope">
          <arrow-rate :rate="scope.row.oldCustomerRate"></arrow-rate>
        </template>
      </el-table-column>
      <el-table-column label="详情">
        <template slot-scope="scope">
          <div class="detail-button">
            <router-link :to="{ path:'/activity/effect', query: { activityId: scope.row.id} }">
              详情
            </router-link>
          </div>
        </template>
      </el-table-column>
      <!--修改无数据时的展示-->
      <template slot="empty">
        <place-holder></place-holder>
      </template>

    </el-table>
  </div>
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
      activityList: {
        type: Array,
        default: function() {
          return [];
        }
      }
    }
  };
</script>

<style lang="less">
  .activity-list-table {
    .detail-button {
      cursor: pointer;
      width: 40px;
      color: #409eff;
    }
  }
</style>
