<template>
  <div class="warehouse-list" >
    <div class="Add-Manage-Button">
      <el-button icon="el-icon-plus" class="add-warehouse" @click="handleAdd" type="primary">新增仓库 </el-button>
    </div>

    <div class="wkt-opt-label-container condition">
      <span style="color: #717378;padding-right:12px;">仓库名称:</span>
      <el-input
        placeholder="请输入仓库名称"
        v-model.trim="keyword"
        maxlength="60"
        @keyup.enter.native="onFliter"
        style="width:200px;">
        <i class="el-icon-search el-input__icon" slot="suffix" @click="onFliter" style="cursor: pointer"> </i>
      </el-input>

      <span style="color: #717378; margin-left:52px;padding-right:12px;">状态:</span>
      <el-select v-model="status" placeholder="请选择" @change="handleFilter">
        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
      
      <el-button class="rect-btn" style="margin-left:24px;" @click="handleReset">
        重置
      </el-button>
      
    </div>

    <div class="warehouse-list-card" v-loading="isLoading">
      <el-button class="rect-btn" style="margin-top:20px; margin-left: 20px" :disabled="!isSure" @click="patchDerived">
        一键导出
      </el-button>
      <el-row>
        <el-table :data="warehouseList" class="wkt-table">
          <el-table-column label="仓库编码" prop="code"> </el-table-column>

          <el-table-column label="仓库名称" prop="name"> </el-table-column>

          <el-table-column label="仓库类型" prop="type">
            <template slot-scope="scope">
              <div v-if="scope.row.type === 20">区域仓</div>
              <div v-if="scope.row.type === 10">前置仓</div>
            </template>
          </el-table-column>

          <el-table-column label="仓库联系人" prop="contact"> </el-table-column>

          <el-table-column label="状态" width="145" prop="status">
            <template slot-scope="scope">
              <!-- <el-switch
                class="wkt-switch"
                v-model="scope.row.status"
                @change="switchBusiness(scope.row)"
                :width="53"
                :active-value="1"
                active-color="#3879FB"
                inactive-color="#DCDDE0"
                active-text="生效"
                inactive-text="关闭"
              >
              </el-switch> -->

              <el-switch v-model="scope.row.status"
                        :active-value="1"
                        active-color="#52C41A"
                        inactive-color="#B1B5BD"
                        @change="switchBusiness(scope.row)">
              
            </el-switch>

            <span class="statusTip Show" v-if="scope.row.status">生效</span>
            <span class="statusTip hidden" v-else>关闭</span>

            </template>
          </el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <a class="dss-link" href="javascript:;" @click="handleEdit(scope.row.id)">修改</a>

              <a class="dss-link" href="javascript:;" @click="handleExpress(scope.row.id)">配送方式</a>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center">
          <!-- <el-pagination
            v-if="totalGoodsCount"
            layout="prev, pager, next, jumper, sizes, total"
            :total="totalGoodsCount"
            :page-size="pageParams.pageSize"
            :current-page="pageParams.pageNo"
            @size-change="onSizeChange"
            @current-change="onPageChange"
            class="wkt-pagination"
          >
          </el-pagination> -->

          <el-pagination
            v-if="totalGoodsCount"
            :hide-on-single-page="true"
            @size-change="onSizeChange"
            @current-change="onPageChange"
            :page-size="pageParams.pageSize"
            layout="sizes, prev, pager, next"
            :total="totalGoodsCount">
          </el-pagination>
        </div>
      </el-row>
      
    </div>

    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size:14px;">订单正在导出，请等候...</span>
    </el-dialog>
  </div>
</template>

<script>
import wpBaseApi from '@/business-common/wp-base-api.js';
import warehouseApi from '@/dss-wechat3rd/src/api/retail/warehouseApi.js';
import storeUser from '@/business-common/store_user.js';
import exportExcel from '@/dss-common/utils/exportExcel';
export default {
  name: 'list',
  mixins: [storeUser],
  components: {},
  data() {
    return {
      isLoading: false,
      keyword: null,
      warehouseList: [],
      totalGoodsCount: 0,
      pageParams: {
        pageSize: 10, //每页条数
        pageNo: 1 //页数
      },
      status: '',
      statusList: [
        {
          value: '',
          label: '全部状态'
        },
        {
          value: 1,
          label: '生效'
        },
        {
          value: 0,
          label: '关闭'
        }
      ],
      isSure: true,
      showTipDialog: false
    };
  },
  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getWarehouseList(); // 获取仓库列表
    });
  },

  mounted() {
    // this.getWarehouseList();
  },

  methods: {
    getWarehouseList() {
      this.isLoading = true;
      wpBaseApi
        .queryList({ ...this.pageParams, name: this.keyword ? this.keyword : undefined, status: this.status })
        .then(rs => {
          this.warehouseList = rs.data || [];
          this.totalGoodsCount = rs.totalCount;
          this.warehouseList.forEach((item, index) => {
            item.order = index + 1;
          });
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.isLoading = false;
        });
    },

    onFliter() {
      this.pageParams.pageNo = 1;
      this.getWarehouseList();
    },

    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.getWarehouseList();
    },

    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.getWarehouseList();
    },

    //开关
    switchBusiness(row) {
      this.loading = true;
      warehouseApi
        .update_status({
          warehouseId: row.id,
          code: row.code,
          status: row.status ? 1 : 0
        })
        .then(res => {
          this.getWarehouseList();
          this.__updateWarehouse();
        })
        .always(() => {
          this.loading = false;
        });
    },

    handleAdd() {
      this.$router.push({
        path: '/warehouse/stock-mgr/list/add'
      });
    },

    handleEdit(id) {
      this.$router.push({
        path: '/warehouse/stock-mgr/list/add',
        query: { id: id }
      });
    },

    handleExpress(id) {
      this.$router.push({
        path: '/warehouse/stock-mgr/list/express',
        query: { id: id }
      });
    },

    handleFilter() {
      this.pageParams.pageNo = 1;
      this.getWarehouseList();
    },

    patchDerived() {
      this.$confirm('确定一键导出过滤后的数据吗？ ', '一键导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          //post下载
          this.isSure = false;
          this.showTipDialog = true;
          exportExcel
            .getDownload(warehouseApi.warehouseExport, {
              name: this.keyword ? this.keyword : undefined,
              status: this.status
            })
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
    // 重置
    handleReset() {
      this.status = '';
      this.keyword = null;
      this.onFliter();
    }
  }
};
</script>
<style lang="less">
.warehouse-list {
  overflow: hidden;
  .note {
    font-size: 12px;
    color: rgba(153, 153, 153, 1);
    margin-left: 20px;
  }
  .condition {
    position: relative;
    overflow: hidden;
    padding: 16px 20px;
    .add-warehouse {
      float: right;
    }
  }
  .warehouse-list-card {
    background: #fff;
    // padding: 0 20px 20px;
    margin-top: 16px;
  }

  .custom-switch {
    display: inline-block;
    overflow: hidden;
    height: 25px;
    position: relative;
    margin-right: 20px;
    .el-switch__label--left {
      position: absolute;
      top: 0px;
      left: 20px;
      width: 30px;
      color: #fff;
      z-index: 999;
      display: none;
      span {
        font-size: 12px;
      }
    }
    .el-switch__label--right {
      position: absolute;
      width: 30px;
      top: 0px;
      left: -3px;
      color: #fff;
      z-index: 999;
      display: none;
      span {
        font-size: 12px;
      }
    }
    .is-active {
      display: inline-block;
    }
  }
  .custom-active {
    font-size: 12px;
    color: rgba(255, 255, 255, 1);
  }
  .custom-inactive {
    font-size: 12px;
    color: rgba(255, 255, 255, 1);
  }
  .dss-link {
    color: @ui-function-color-link !important;
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
    right: 37px;
  }
}
</style>
