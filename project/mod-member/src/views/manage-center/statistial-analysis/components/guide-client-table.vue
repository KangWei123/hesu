<template>
  <div class="analysis-box guide-client-table">
    <div class="analysis-title">
      导购客户统计
      <span class="download-btn" @click="exportData">导出报表</span>
    </div>
    <el-table :data="list" style="width: calc(100% - 30px)" class="analysis-table" v-loading="loading">
      <el-table-column v-for="(key, val) of TABLE_COLS_ENUM" :key="key" :prop="val" :label="key" align="center">
      </el-table-column>
      <!-- 无数据 -->
      <template slot="empty">
        <place-holder></place-holder>
      </template>
    </el-table>
  </div>
</template>

<script>
  import utils from '@/dss-common/utils';
  import excel from '@/dss-common/utils/excel';
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import api from '@/mod-member/src/api/manage.js';
  import { mapState } from 'vuex';

  const TABLE_COLS_ENUM = {
    employeeName: '导购名称',
    totalClientCount: '客户总数',
    newClientCount: '今日新增',
  };

  export default {
    name: 'GuideClientTable',
    components: { PlaceHolder },
    props: {
      currentStore: null,
    },
    data() {
      return {
        TABLE_COLS_ENUM,
        loading: false,
        list: [],
      };
    },
    watch: {
      currentStore() {
        this.getData();
      },
    },
    methods: {
      getData() {
        this.loading = true;
        api
          .getClientData({
            storeId: this.currentStore,
          })
          .then(res => {
            this.list = (res.data || []).map(item => {
              return {
                employeeId: item.employeeId,
                employeeName: item.employeeName || '--',
                totalClientCount: item.totalClientCount || 0,
                newClientCount: item.newClientCount || 0,
              };
            });
          })
          .always(() => {
            this.loading = false;
          });
      },
      exportData() {
        const downloadTableData = this.$plain(this.list);
        excel.export2Excel(
          [
            { key: 'employeeName', label: '导购名称' },
            { key: 'totalClientCount', label: '客户总数' },
            { key: 'newClientCount', label: '今日新增' },
          ],
          downloadTableData,
          '导购客户统计'
        );
      },
    },
    mounted() {
      this.getData();
    },
  };
</script>

<style lang="less" scoped>
  .guide-client-table {
    padding: 20px 0 !important;
    .analysis-title {
      padding: 0 15px;
    }
    .download-btn {
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #2e8dff;
      line-height: 20px;
      float: right;
      margin: 0 15px;
    }
  }
  .analysis-table {
    margin: 15px;
    /deep/.cell {
      padding: 6px 15px;
    }
  }
</style>
