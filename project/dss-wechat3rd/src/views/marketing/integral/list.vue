<template>
  <div class="integral" v-loading="isLoading" :element-loading-text="msg.update">
    <div class="Add-Manage-Button">
      <div class="switch-container">
        <span style="color: #717378">是否启用：</span>
        <!-- <el-switch class="wkt-switch"
                  v-model="switchStatus"
                  @click.native='handleSwitch(switchStatus)'
                  disabled
                  :width="53"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#3879FB"
                  inactive-color="#DCDDE0"
                  active-text="启用"
                  inactive-text="关闭">
        </el-switch> -->

        <el-switch
          :width="53"
          v-model="switchStatus"
          disabled
          :active-value="1"
          :inactive-value="0"
          active-color="#52C41A"
          inactive-color="#B1B5BD"
          @click.native="handleSwitch(switchStatus)"
        >
        </el-switch>

        <span class="statusTip Show" v-if="switchStatus">开启</span>
        <span class="statusTip hidden" v-else>关闭</span>
      </div>
      <el-button @click="onAdd" icon="el-icon-plus" :disabled="!switchStatus" type="primary">添加商品</el-button>
    </div>

    <div class="integral-filter">
      <el-form @submit.native.prevent :model="keyword" ref="keyword" inline class="wkt-opt-label-container">
        <el-form-item label="活动名称：" prop="itemName">
          <el-input
            placeholder="搜索活动名称"
            maxlength="80"
            v-model.trim="keyword.itemName"
            @input="handleSearch"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select clearable v-model="keyword.status" placeholder="选择活动状态" @change="handleStatus">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="integral-list">
      <el-table :data="tableData" style="width: 100%" class="wkt-table" v-loading="listLoading">
        <el-table-column align="center" prop="itemName" label="活动名称" :show-overflow-tooltip="true" />

        <el-table-column align="center" label="有效期">
          <template slot-scope="scope">
            <p>{{ scope.row.startTime | fitTime }}</p>
            <p>{{ scope.row.startTime ? '至' : '-' }}</p>
            <p>{{ scope.row.endTime | fitTime }}</p>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="exchangeRestrict" label="兑换限制(件/人)" />

        <el-table-column align="center" prop="paidNum" label="已兑换/可兑换数量">
          <template slot-scope="scope">
            <span>{{ scope.row.paidNum }} / {{ scope.row.exchangeNum }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="sequence" label="排序" />

        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">未开始</span>
            <span v-if="scope.row.status === 1">进行中</span>
            <span v-if="scope.row.status === 2">已结束</span>
            <span v-if="scope.row.status === 3">已删除</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="methods" label="操作" :width="150" fixed="right">
          <div slot-scope="scope">
            <a @click="onDetail(scope.row)">详情</a>
            <a v-if="scope.row.status === 0 || scope.row.status === 1" type="text" @click="onEnd(scope.row, 2)"
              >结束活动</a
            >
            <a v-if="scope.row.status === 2" class="table-delete" @click="onDelete(scope.row, 3)">删除</a>
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
        :total="totalCount"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import integralApi from '@/dss-wechat3rd/src/api/integral';
  import utils from '@/dss-common/utils/index';
  import store from '@/business-common/store';
  import debounce from 'lodash/debounce';

  export default {
    data() {
      const itemName = decodeURIComponent(this.$route.query.name || '');
      return {
        keyword: {
          status: null,
          itemName,
        },
        msg: {
          update: '',
        },
        switchStatus: 0, // 是否开启积分商城
        options: [
          {
            value: null,
            label: '所有状态',
          },
          {
            value: 0,
            label: '未开始',
          },
          {
            value: 1,
            label: '进行中',
          },
          {
            value: 2,
            label: '已结束',
          },
        ],
        tableData: [],
        page: {
          pageSize: 10,
          pageNo: 1,
        },
        totalCount: 0,
        isLoading: false,
        listLoading: false,
        status: 0,
        delItem: {},
      };
    },
    computed: {
      ...mapState({
        curApp: 'curApp',
      }),
    },
    filters: {
      fitTime(value) {
        return utils.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
      },
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
            status: this.keyword.status,
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
      handleSwitch(switchStatus) {
        let msgTitle = null;
        let msgContent = null;
        let status = 0;

        if (switchStatus === 0) {
          msgContent = '确定开启积分商城插件吗?';
          msgTitle = '开启后微商城个人中心将打开积分商城入口，请尽快添加商品！';
          status = 1; // 开启状态
        } else {
          msgContent = '确定关闭积分商城插件吗?';
          msgTitle = '请确定手动结束所有兑换活动后再关闭插件';
          status = 0; // 关闭状态
        }

        this.$confirm(msgTitle, msgContent, {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            this.handleSwitchUpdate(status);
          })
          .catch(() => {});
      },
      handleSwitchUpdate(status) {
        const params = {
          switchStatus: status,
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
      handleSearch: debounce(function () {
        this.page.pageNo = 1;
        this.getList();
      }, 800),
      updateStatus(item, status) {
        const params = {
          activityId: item.id,
          status: status,
        };

        integralApi
          .updateStatus(params)
          .then(res => {
            this.$message({
              type: 'success',
              message: '操作成功',
            });
            this.getList();
          })
          .catch(err => {
            console.error('更新状态失败', err);
          });
      },
      handleStatus(e) {
        this.page.pageNo = 1;
        this.getList();
      },
      onAdd() {
        this.$router.push('/marketing/integral/list/add');
      },
      onEnd(item, status) {
        this.delItem = item;
        this.$confirm('活动结束后不可重启，你还要继续吗?', '确定结束活动?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.msg.update = '请稍候，结束活动中...';
            // 调用更改状态接口
            this.updateStatus(this.delItem, status);
          })
          .catch(err => {
            console.log('取消结束', err);
          });
      },
      onDetail(row) {
        console.log(row);
        this.$router.push({
          path: '/marketing/integral/list/add',
          query: {
            id: row.id,
            status: row.status,
            itemNo: row.itemNo,
          },
        });
      },
      onDelete(item, status) {
        this.delItem = item;
        this.$confirm('活动删除后不可恢复，所有活动相关数据都将被删除，你还要继续吗？', '确定删除该活动吗', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
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
      },
      handleReset() {
        this.$refs.keyword.resetFields();
        this.getList();
      },
    },
  };
</script>
<style lang="less">
  .integral {
    // padding: 0 20px;
    .Add-Manage-Button {
      display: flex;
    }
    .wkt-opt-label-container {
      box-shadow: none;
      padding-left: 20px;
      padding-top: 5px;
    }
    .switch-container {
      display: flex;
      align-items: center;
      padding: 0;
      .statusTip {
        position: relative;
        z-index: 10;
        color: #fff;
        top: 1px;
        font-size: 12px;
      }
      .Show {
        right: 46px;
      }
      .hidden {
        right: 32px;
      }
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
      padding-bottom: 20px;
      background: white;
      border-radius: 4px;
      .table-mixin;
      // thead {
      //   th:last-child > .cell {
      //     text-align: right;
      //   }
      // }
    }

    .integral-filter {
      position: relative;

      .el-form-item {
        margin-bottom: 10px;
      }

      // .integral-box {
      //   position: absolute;
      //   top: 30px;
      //   right: 20px;
      // }
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
