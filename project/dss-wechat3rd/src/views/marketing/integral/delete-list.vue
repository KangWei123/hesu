<template>
  <div class="integral integral-delete"
       v-loading="isLoading"
       :element-loading-text="msg.update">
    <div class="integral-filter">
      <el-form @submit.native.prevent
               inline
               class="wkt-opt-label-container">
        <el-form-item label="活动名称：">
          <el-input style="width:250px"
                    placeholder="搜索活动名称"
                    size="mini"
                    maxlength="80"
                    v-model.trim="keyword.itemName"
                    clearable></el-input>
        </el-form-item>
          <el-button @click="handleSearch"
                     class="search-btn"
                     type="primary">搜索</el-button>
      </el-form>
    </div>
    <div class="integral-list">
      <el-table :data="tableData"
                style="width: 100%"
                class="wkt-table"
                v-loading="listLoading">
        <el-table-column align="center"
                         prop="itemName"
                         label="活动名称"
                         :show-overflow-tooltip="true" />

        <el-table-column align="center"
                         label="有效期">
          <template slot-scope="scope">
            <span>{{scope.row.startTime|fitTime}} - {{scope.row.endTime|fitTime}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         prop="exchangeRestrict"
                         label="兑换限制(件/人)" />

        <el-table-column align="center"
                         prop="paidNum"
                         label="已兑换/可兑换数量">
          <template slot-scope="scope">
            <span>{{scope.row.paidNum}} / {{scope.row.exchangeNum}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         prop="sequence"
                         label="排序" />

        <el-table-column align="center"
                         label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status===0">未开始</span>
            <span v-if="scope.row.status===1">进行中</span>
            <span v-if="scope.row.status===2">已结束</span>
            <span v-if="scope.row.status===3">已删除</span>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         prop="methods"
                         label="操作"
                         :width="90">
          <div slot-scope="scope">
            <a @click="onDetail(scope.row)">详情</a>
            <a v-if="scope.row.status === 0||scope.row.status===1"
               type="text"
               @click="onEnd(scope.row,2)">结束活动</a>
            <a v-if="scope.row.status===2"
               @click="onDelete(scope.row,3)">删除</a>
          </div>
        </el-table-column>
      </el-table>
      <!-- <el-pagination layout="prev, pager, next, jumper, sizes, total"
                     :total="totalCount"
                     :page-size="page.pageSize"
                     :current-page="page.pageNo"
                     :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                     @size-change="onSizeChange"
                     @current-change="onPageChange"></el-pagination> -->
      <el-pagination
          v-if="totalCount"
          :hide-on-single-page="true"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-size="page.pageSize"
          layout="sizes, prev, pager, next"
          :total="totalCount">
        </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import integralApi from '@/dss-wechat3rd/src/api/integral';
import utils from '@/dss-common/utils/index';
import store from '@/business-common/store.js';

export default {
  data() {
    return {
      keyword: {
        status: null,
        name: null
      },
      msg: {
        update: ''
      },
      switchStatus: 0, // 是否开启积分商城
      tableData: [],
      page: {
        pageSize: 10,
        pageNo: 1
      },
      totalCount: 0,
      isLoading: false,
      listLoading: false,
      status: 0,
      delItem: {}
    };
  },
  computed: {
    ...mapState({
      curApp: 'curApp'
    })
  },
  filters: {
    fitTime(value) {
      return utils.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
    }
  },
  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getList(); // 获取列表
    });
  },

  mounted() {
    if (!!this.curApp.useIntegralShop || this.curApp.useIntegralShop === 0) {
      this.switchStatus = this.curApp.useIntegralShop;
    }
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      integralApi
        .list({
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          itemName: this.keyword.itemName,
          status: 3
        })
        .then(res => {
          this.tableData = res.data || [];
          this.totalCount = res.totalCount;
        })
        .catch(err => {
          console.error('活动列表err', err);
        })
        .always(() => {
          this.listLoading = false;
        });
    },
    handleSwitchUpdate(status) {
      const params = {
        switchStatus: status
      };
      integralApi
        .control(params)
        .then(res => {
          if (!res.data) {
            return;
          }

          this.$message.success('操作成功');
          this.switchStatus = status;

          this.curApp.useIntegralShop = status;
          store.commit('update_curApi', this.curApp);
        })
        .catch(err => {
          console.error('积分商城设置err', err);
        });
    },
    handleSearch() {
      this.page.pageNo = 1;
      this.getList();
    },
    updateStatus(item, status) {
      let params = {
        activityId: item.id,
        status: status
      };

      integralApi
        .updateStatus(params)
        .then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.getList();
        })
        .catch(err => {
          console.error('更新状态失败', err);
        });
    },
    onAdd() {
      this.$router.push('/marketing/integral/delete/add');
    },
    onEnd(item, status) {
      this.delItem = item;
      this.$confirm('活动结束后不可重启，你还要继续吗?', '确定结束活动?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.msg.update = '请稍候，结束活动中...';
          //调用更改状态接口
          this.updateStatus(this.delItem, status);
        })
        .catch(err => {
          console.log('取消结束', err);
        });
    },
    onDetail(row) {
      console.log(row);
      this.$router.push({
        path: '/marketing/integral/delete/add',
        query: {
          id: row.id,
          status: row.status,
          itemNo: row.itemNo
        }
      });
    },
    onDelete(item, status) {
      this.delItem = item;
      this.$confirm('活动删除后不可恢复，所有活动相关数据都将被删除，你还要继续吗？', '确定删除该活动吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.msg.update = '请稍候，删除中...';
          this.loading = true;
          this.updateStatus(this.delItem, status);
        })
        .catch(err => {
          console.log('取消删除', err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.getList();
    },
    onPageChange(page) {
      this.page.pageNo = page;
      this.getList();
    }
  }
};
</script>
<style lang="less">
.integral-delete {
  // padding: 0 20px;

  .switch-container {
    display: flex;
    align-items: center;
    padding: 20px 0;
  }

  .title {
    height: 50px;
    font-size: 20px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
    line-height: 50px;
  }

  .integral-list {
    // padding: 20px 0;
    background: white;
    border-radius: 4px;
  }

  .integral-filter {
    background: #fff;
    position: relative;

    .el-input__inner {
      border-radius: 4px 0 0 4px;
    }

    .integral-box {
      position: absolute;
      top: 30px;
      right: 20px;
    }
  }
  .el-table .cell {
    text-align: left;
  }
  .el-table .disabled-qrcode {
    color: #ccc;
    cursor: no-drop;
  }

  .el-table .disabled-qrcode:hover {
    color: #ccc;
    cursor: no-drop;
  }

  .el-switch.is-disabled .el-switch__core,
  .el-switch.is-disabled .el-switch__label {
    cursor: pointer;
  }
}

.switch-container {
  .el-switch.is-disabled {
    opacity: 1;
  }
}
</style>
