/* * @Author: Neexz * @Date: 2018-11-05 19:39:19 * @Last Modified by: mikey.zhaopeng * @Last Modified time: 2021-06-30
18:08:06 */

<template>
  <div class="inventory">
    <div class="Add-Manage-Button">
      <el-button type="primary" icon="el-icon-plus" @click="addNewVerification">新增盘点 </el-button>
    </div>
    <verification-filter @filter="onFilter" class="wkt-opt-label-container" />

    <div style="padding: 0 0 20px 0; background: #fff">
      <div class="custom-label">
        <el-button class="rect-btn" style="float: left" :disabled="!isSure" @click="patchDerived"> 一键导出 </el-button>
      </div>
      <verification-table :verification-list="verificationList" @refresh="handleRefresh" v-loading="isLoading" />

      <!-- <el-pagination layout="prev, pager, next, jumper, sizes, total"
                     :total="totalVerificationCount"
                     :page-size="pageParams.pageSize"
                     :current-page="pageParams.pageNo"
                     :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                     @size-change="onSizeChange"
                     @current-change="onPageChange"
                     class="wkt-pagination">
      </el-pagination> -->

      <el-pagination
        v-if="totalVerificationCount"
        :hide-on-single-page="true"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :page-size="pageParams.pageSize"
        layout="sizes, prev, pager, next"
        :total="totalVerificationCount"
      >
      </el-pagination>
    </div>

    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size: 14px">订单正在导出，请等候...</span>
    </el-dialog>
  </div>
</template>

<script>
  import VerificationFilter from './verificationFilter.vue';
  import VerificationTable from './verificationTable.vue';
  import inventoryMgrAPI from '@/dss-wechat3rd/src/api/retail/goodsMgr/inventoryMgrAPI.js';
  // import mockData from '../mock/mockData.js';
  import exportExcel from '@/dss-common/utils/exportExcel';

  export default {
    components: {
      VerificationFilter,
      VerificationTable,
    },

    data() {
      return {
        isLoading: false,
        pageParams: {
          pageSize: 5,
          pageNo: 1,
        },
        verificationList: [],
        totalVerificationCount: 0,
        filterParams: {},
        isSure: true,
        showTipDialog: false,
      };
    },

    // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.getVerificationList(); // 获取盘点列表
      });
    },

    mounted() {
      // 获取盘点列表
      // this.getVerificationList();
      // mock data
      // this.verificationList = mockData.mockVerificationList.data;
      // this.totalVerificationCount = this.verificationList.length;
      // console.log('verificationList --> ', JSON.stringify(this.verificationList));
    },

    methods: {
      getVerificationList() {
        this.isLoading = true;
        const params = {
          ...this.pageParams,
          ...this.filterParams,
        };

        inventoryMgrAPI
          .getVerificationList(params)
          .then(res => {
            this.verificationList = res.data || [];
            this.totalVerificationCount = res.totalCount;
          })
          .catch(err => {
            console.error('getVerificationList error ', err);
          })
          .always(() => {
            this.isLoading = false;
          });
      },

      gatDay(params) {
        const startTime = new Date(params.startTime);
        const endTime = new Date(params.endTime);
        const time = endTime.getTime() - startTime.getTime();
        const day = parseInt(time / (1000 * 60 * 60 * 24));
        return day;
      },

      patchDerived() {
        this.$confirm('确定一键导出过滤后的数据吗？ ', '一键导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            const params = this.filterParams;
            const day = this.gatDay(params);
            if (!params.startTime || !params.endTime || day > 30) {
              return this.$message({
                message: '时间跨度不得超过31天',
                type: 'error',
              });
            }
            // post下载
            this.isSure = false;
            this.showTipDialog = true;
            exportExcel
              .getDownload(inventoryMgrAPI.reviewExport, params)
              .then(res => {})
              .always(() => {
                this.isSure = true;
                this.showTipDialog = false;
              });
          })
          .catch(() => {
            console.log('取消一键导出');
          });
      },

      handleRefresh(e) {
        this.pageParams.pageNo = 1;
        this.getVerificationList();
      },

      onFilter(filterParams) {
        console.log('onFilter --> ', JSON.stringify(filterParams));
        this.filterParams = filterParams;
        this.getVerificationList();
      },

      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.getVerificationList();
      },

      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.getVerificationList();
      },

      addNewVerification() {
        console.log('addNewVerification');
        this.$router.push('/warehouse/inventory-mgr/verification/add-modify');
      },
    },
  };
</script>

<style lang="less">
  @import '../../inventory.less';
</style>
