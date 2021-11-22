<template>
  <div class="address">
    <div class="address__header">
      <div class="title">车牌号码</div>
    </div>
    <fat-table ref="table" :fetch-handler="handleFetch" row-key="id" :fetch-on-mounted="false">
      <el-table-column label="序号" v-slot="scope">{{ scope.$index + 1 }}</el-table-column>
      <el-table-column label="车牌号码" prop="carNo">
        <template slot-scope="scope">
          <span class="default" v-if="scope.row.defaultStatus === 1">默认</span>
          <span>{{ scope.row.carNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌" prop="carCategoryName"></el-table-column>
      <el-table-column label="绑定渠道">
        <template slot-scope="scope">
          <div>{{ scope.row.bindingChannel ? '用户绑定' : '后台添加' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="绑定时间" prop="bindingTime"></el-table-column>
    </fat-table>
  </div>
</template>

<script>
  import { FatTable, TableActions } from '@/dss-common/components/list-page';
  import { AddressType, AddressTypeName } from '@/mod-member/src/enum/index';
  import api from '@/mod-member/src/api/memberAPI';

  export default {
    name: 'LicensePlate',
    props: {
      info: {
        type: Object,
        required: true,
      },
    },
    components: {
      FatTable,
      TableActions,
    },
    data() {
      return {
        AddressType,
        AddressTypeName,
      };
    },
    mounted() {
      setTimeout(() => {
        this.$refs.table.fetch();
      }, 1000);
    },
    methods: {
      async handleFetch(data) {
        const { pagination } = data;
        const params = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          memberId: this.info.id,
          bindingStatus: 0,
        };
        const { data: list, totalCount } = await api.memberCenter.getCarQueryList(params);
        return {
          list: list,
          total: totalCount,
        };
      },
    },
  };
</script>

<style scoped lang="less">
  .address {
    border-top: 1px solid #dce1e6;
    margin-top: 60px;
    padding-top: 50px;
  }

  .address__header {
    padding: 0 16px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eff4fa;
  }

  .title {
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    height: 26px;
    line-height: 26px;
    color: #303133;
  }

  .default {
    display: inline-block;
    border: 1px solid #fa7516;
    color: #fa7516;
    width: 40px;
    text-align: center;
    line-height: 22px;
    border-radius: 4px;
    margin-right: 5px;
  }
</style>
