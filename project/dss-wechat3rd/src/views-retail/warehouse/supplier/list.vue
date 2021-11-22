<template>
  <div class="supplier-list-container">
    <div class="Add-Manage-Button">
      <el-button icon="el-icon-plus" @click="onAdd" type="primary">新增供应商</el-button>
    </div>
    <div class="wkt-opt-label-container">
      <span style="color: #717378; padding-right: 12px">供应商名称:</span>
      <el-input
        style="width: 250px"
        placeholder="请输入供应商名称或联系电话"
        v-model.trim="keyword"
        clearable
      ></el-input>
      <el-button type="primary" class="single-search-btn" @click="onSearch">搜索</el-button>
    </div>
    <div class="supplier-list" v-loading="loading.update" element-loading-text="更新中...">
      <el-table :data="tableData" style="width: 100%" v-loading="loading.list" class="wkt-table">
        <el-table-column prop="code" label="编号" class-name="stress-font" />
        <el-table-column prop="name" label="供应商名称" class-name="stress-font" />
        <el-table-column prop="officeTel" label="单位电话" />
        <el-table-column prop="contacts" label="联系人" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column prop="status" label="状态" width="150">
          <template slot-scope="scope">
            <!-- <el-switch v-model="scope.row.status" 
                       active-color="#4379ed" 
                       inactive-color="rgba(0, 0, 0, 0.25)" 
                       active-text="启用" 
                       inactive-text="停用" 
                       :active-value="1" 
                       :inactive-value="0"
                        @change="onStatusChange($event, scope.row)">

            </el-switch> -->

            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#52C41A"
              inactive-color="#B1B5BD"
              @change="onStatusChange($event, scope.row)"
            >
            </el-switch>

            <span class="statusTip Show" v-if="scope.row.status">启用</span>
            <span class="statusTip hidden" v-else>停用</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="操作" :width="135">
          <span slot-scope="scope">
            <a class="table-href" href="javascript:;" @click="onAlter(scope.row)">编辑</a>
            <a class="table-href" href="javascript:;" @click="onGotoDetail(scope.row)">详情</a>
          </span>
        </el-table-column>
      </el-table>
      <!-- <el-pagination layout="prev, pager, next, jumper, sizes, total" :total="totalCount" :page-size="page.pageSize" :current-page="page.pageNo" :page-sizes="[5, 10, 20, 30, 40, 50, 100]" @size-change="onSizeChange" @current-change="onPageChange" class="wkt-pagination">
      </el-pagination> -->

      <el-pagination
        v-if="totalCount"
        :hide-on-single-page="true"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :page-size="page.pageSize"
        :page-sizes="[5, 10, 20, 30, 40, 50]"
        layout="sizes, prev, pager, next"
        :total="totalCount"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import api from '@/dss-wechat3rd/src/api/supplier.js';

  const supplierApi = api.supplier;

  export default {
    data() {
      return {
        tableData: [],
        page: {
          keyword: '',
          pageNo: 1,
          pageSize: 20,
        },
        totalCount: 0,
        loading: {
          update: false,
          list: false,
        },
        keyword: '',
      };
    },
    // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.fetchData(); // 获取供应商列表
      });
    },

    mounted() {
      // this.fetchData();
    },
    methods: {
      onAdd() {
        this.$router.push('/warehouse/supplier/list/edit');
      },
      onAlter(row) {
        this.$router.push(`/warehouse/supplier/list/edit?id=${row.id}`);
      },
      onDelete(row) {
        this.$confirm('删除后团购中的订单都会失败并且退款回客户', '删除活动', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            this.updateStatus(row.id, '删除成功', '请稍候，正中删除中...');
          })
          .catch(() => {
            console.log('取消删除');
          });
      },
      onGotoDetail(row) {
        this.$router.push(`/warehouse/supplier/list/detail?id=${row.id}`);
      },
      onStatusChange(v, row) {
        this.loading.update = true;
        supplierApi
          .update_supplier_status({
            supplierId: row.id,
            status: v,
          })
          .then(
            res => {
              this.$message({
                message: `${v === 0 ? '停用' : '启用'}成功`,
                type: 'success',
              });
            },
            res => {
              row.status = v === 1 ? 0 : 1;
            }
          )
          .always(() => {
            this.loading.update = false;
          });
      },
      onSearch() {
        this.page.keyword = this.keyword;
        this.page.pageNo = 1;
        this.fetchData();
      },
      updateStatus(id, status, successMsg, loadingMsg) {
        this.msg.update = loadingMsg;
        this.loading.update = true;
        supplierApi
          .update_supplier_status({
            activityId: id,
            status,
          })
          .done(res => {
            this.$message({
              message: successMsg,
              type: 'success',
            });
            this.page.pageNo = 1;
            this.fetchData();
          })
          .always(() => {
            this.loading.update = false;
          });
      },
      fetchData() {
        const params = {
          ...this.page,
        };
        this.loading.list = true;
        supplierApi
          .query(params)
          .done(res => {
            this.tableData = res.data || [];
            this.totalCount = res.totalCount;
          })
          .always(res => {
            this.loading.list = false;
          });
      },
      onSizeChange(size) {
        this.page.pageSize = size;
        this.page.pageNo = 1;
        this.fetchData();
      },
      onPageChange(page) {
        this.page.pageNo = page;
        this.fetchData();
      },
    },
  };
</script>

<style lang="less" scoped>
  .supplier-list-container {
    .wkt-opt-label-container {
      padding: 20px;
    }
    .single-search-btn {
      margin-left: 24px;
    }
    .supplier-list {
      // padding: 0 20px 20px;
      margin-top: 16px;
      background: white;
      border-radius: 4px;
      .el-table {
        padding-top: 0px;
      }
    }
    .el-switch__core {
      width: 58px !important;
    }
    .statusTip {
      position: relative;
      z-index: 10;
      color: #fff;
      top: 1px;
      font-size: 12px;
    }
    .Show {
      right: 52px;
    }
    .hidden {
      right: 42px;
    }

    // .Add-Manage-Button {
    //   float: right;
    //   margin-top: 20px;
    // }
  }
</style>
