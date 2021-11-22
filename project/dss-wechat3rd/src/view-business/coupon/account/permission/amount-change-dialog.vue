<template>
  <drawer-layout v-model="isShow" ref="$drawerLayout" title="额度变动明细">
    <template #content>
      <fat-table ref="$table" :fetch-handler="handleFetch">
        <el-table-column min-width="100" label="操作" align="center">
          <template slot-scope="scope">
            <span>{{ handleMap[scope.row.action] }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100" label="变动张数" align="center" prop="changeNumber">
          <template slot-scope="scope">
            <span>{{ scope.row.changeNumber || '无上限' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100" label="剩余张数" align="center" prop="remainNumber">
          <template slot-scope="scope">
            <span>{{ scope.row.adjustType == adjustType.infinite ? '无上限' : scope.row.remainNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100" label="变动时间" align="center" prop="updateTime"></el-table-column>
      </fat-table>
    </template>
    <template #button>
      <el-button @click="close">取 消</el-button>
    </template>
  </drawer-layout>
</template>

<script>
  import DrawerLayout from './components/drawer-layout.vue';
  import { FatTable } from '@/dss-common/components/list-page';
  import { queryCreditPage } from '@/dss-wechat3rd/src/api/account-coupon';
  import { adjustType } from '@/dss-wechat3rd/src/view-business/enum';

  const handleEnum = {
    issued: 1, // 发放
    manual: 0, // 手动修改
  };

  const handleMap = {
    [handleEnum.issued]: '发放',
    [handleEnum.manual]: '手动修改',
  };

  export default {
    name: 'AmountChangeDialog',
    components: {
      DrawerLayout,
      FatTable,
    },
    data() {
      return {
        isShow: false,
        searchData: {},
        handleMap,
        adjustType,
      };
    },
    watch: {
      searchData: {
        deep: true,
        handler() {
          this.$refs.$table && this.$refs.$table.search();
        },
      },
    },
    methods: {
      async handleFetch({ pagination }) {
        const params = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          ...this.searchData,
        };
        const { data, totalCount } = await queryCreditPage(params);
        return { list: data, total: totalCount };
      },
      show(row) {
        this.isShow = true;
        this.searchData = row;
      },
      close() {
        this.isShow = false;
      },
    },
  };
</script>

<style lang="less" scoped></style>
