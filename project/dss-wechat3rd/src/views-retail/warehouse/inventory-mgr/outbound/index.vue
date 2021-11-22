<template>
  <div class="inventory inventory-outbound">
    <!--新的出库-->
    <div class="Add-Manage-Button">
      <el-button plain @click="handleInbound()">批量多仓出库</el-button>
      <el-button icon="el-icon-plus" type="primary" @click="handleOutbound()">新建出库单</el-button>
    </div>
    <io-bound-filter bound-type="out" class="wkt-opt-label-container" @filter="handleFilter" />

    <div class="Batch-btn">
      <el-button type="primary" v-if="status === ioboundEnum.boundStatus.PENDING.value" @click="handAudit"
        >批量审核</el-button
      >
      <el-button type="primary" v-if="status === ioboundEnum.boundStatus.THROUGH.value" @click="handleStorage"
        >批量确认出库</el-button
      >
      <div
        style="margin-top: 5px; color: #a1a4ab"
        v-if="status === ioboundEnum.boundStatus.PENDING.value || status === ioboundEnum.boundStatus.THROUGH.value"
      >
        注：批量一次只能操作50个
      </div>
    </div>

    <div class="tabs-box">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="custom-label">
        <el-tab-pane class="bound-status" label="全部" name=""></el-tab-pane>
        <el-tab-pane
          class="bound-status"
          label="待审核"
          :name="changeType(ioboundEnum.boundStatus.PENDING.value)"
        ></el-tab-pane>
        <el-tab-pane
          class="bound-status"
          label="待确认入库"
          :name="changeType(ioboundEnum.boundStatus.THROUGH.value)"
        ></el-tab-pane>
        <el-tab-pane
          class="bound-status"
          label="已完成"
          :name="changeType(ioboundEnum.boundStatus.FINISHED.value)"
        ></el-tab-pane>
      </el-tabs>

      <div class="export-box">
        <el-button class="rect-btn" :disabled="disabledOneKeyExport" @click="patchDerived">一键导出</el-button>
        <el-button class="rect-btn" :disabled="disabledOutBound" @click="patchDerivedDelivery"
          >一键导出发货单</el-button
        >
      </div>
    </div>

    <!-- <div class="custom-label">
      <div class="bound-left">
        审核状态：
        <span class="bound-status" @click="setStatus()" :class="status == null ? 'checked' : ''">全部</span>
        <span
          class="bound-status"
          @click="setStatus(ioboundEnum.boundStatus.PENDING.value)"
          :class="status === ioboundEnum.boundStatus.PENDING.value ? 'checked' : ''"
          >待审核</span
        >
        <span
          class="bound-status"
          @click="setStatus(ioboundEnum.boundStatus.THROUGH.value)"
          :class="status === ioboundEnum.boundStatus.THROUGH.value ? 'checked' : ''"
          >待确认出库</span
        >
        <span
          class="bound-status"
          @click="setStatus(ioboundEnum.boundStatus.FINISHED.value)"
          :class="status === ioboundEnum.boundStatus.FINISHED.value ? 'checked' : ''"
          >已完成</span
        >
      </div>

      
      
      
    </div> -->

    <div class="wkt-card inventory-content" v-loading="loading">
      <el-row>
        <el-table :data="outboundList" ref="outboundTable" @selection-change="handleSelectionChange" class="wkt-table">
          <el-table-column
            type="selection"
            v-if="status === ioboundEnum.boundStatus.PENDING.value || status === ioboundEnum.boundStatus.THROUGH.value"
            width="55"
          >
          </el-table-column>
          <el-table-column label="出库单号" min-width="205px" prop="outboundNo"> </el-table-column>
          <el-table-column label="出库类型" min-width="110" prop="typeDesc"> </el-table-column>
          <el-table-column label="出库时间" min-width="190" prop="outboundTime"> </el-table-column>
          <el-table-column label="经办人" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.contact || scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关联单据号" min-width="205">
            <template slot-scope="scope">
              <span>{{ scope.row.relocateNo || scope.row.orderNo || '- -' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="仓库" min-width="100" prop="warehouseName"> </el-table-column>
          <el-table-column label="备注" min-width="100" prop="remark">
            <template slot-scope="scope">
              <span class="ellipsis" :title="scope.row.remark">{{ scope.row.remark }}</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" min-width="100" prop="status">
            <template slot-scope="scope">
              <!-- 待审批 1-->
              <span v-if="scope.row.status === ioboundEnum.boundStatus.PENDING.value">{{
                ioboundEnum.boundStatus.PENDING.label
              }}</span>
              <!-- 审核通过 20-->
              <span v-if="scope.row.status === ioboundEnum.boundStatus.THROUGH.value">{{
                ioboundEnum.boundStatus.THROUGH.label
              }}</span>
              <!-- 拒绝 21-->
              <span v-if="scope.row.status === ioboundEnum.boundStatus.REFUSE.value">{{
                ioboundEnum.boundStatus.REFUSE.label
              }}</span>
              <!-- 审核失败 22-->
              <span v-if="scope.row.status === ioboundEnum.boundStatus.FAILURE.value">{{
                ioboundEnum.boundStatus.FAILURE.label
              }}</span>
              <!-- 出入库完成 3-->
              <span v-if="scope.row.status === ioboundEnum.boundStatus.FINISHED.value">{{
                ioboundEnum.boundStatus.FINISHED.label
              }}</span>
              <!-- 用户申请取消 5-->
              <span v-if="scope.row.status === ioboundEnum.boundStatus.CANCEL.value">{{
                ioboundEnum.boundStatus.CANCEL.label
              }}</span>
              <!-- 全部退款 7-->
              <span v-if="scope.row.status === ioboundEnum.boundStatus.REFUND_ALL.value">{{
                ioboundEnum.boundStatus.REFUND_ALL.label
              }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <!--确认出库不能修改!-->
              <div class="operation">
                <a
                  href="javascript:;"
                  @click="update_status(scope.row, ioboundEnum.boundStatus.THROUGH.value)"
                  v-if="scope.row.status === ioboundEnum.boundStatus.PENDING.value"
                  >通过</a
                >

                <!-- </div>
              <div> -->
                <!-- 销售出库不能确认出库，由系统自动确认 类型20, 确认出入库 如果第三方仓库系统隐藏确认出入库-->
                <a
                  href="javascript:;"
                  @click="confirm(scope.row)"
                  v-if="
                    scope.row.status === ioboundEnum.boundStatus.THROUGH.value &&
                    scope.row.type !== ioboundEnum.outboundType.SALE.value &&
                    !scope.row.useThirdWMS
                  "
                  >确认出库</a
                >

                <a
                  href="javascript:;"
                  @click="handleToEdit(scope.row)"
                  v-if="
                    scope.row.status === ioboundEnum.boundStatus.REFUSE.value ||
                    scope.row.status === ioboundEnum.boundStatus.PENDING.value ||
                    scope.row.status === ioboundEnum.boundStatus.FAILURE.value
                  "
                  >编辑</a
                >
                <a href="javascript:;" @click="toStockDetail(scope.row)">详情</a>

                <a
                  href="javascript:;"
                  style="color: !important"
                  @click="update_status(scope.row, ioboundEnum.boundStatus.REFUSE.value)"
                  v-if="scope.row.status === ioboundEnum.boundStatus.PENDING.value"
                  >拒绝</a
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <!-- <el-pagination
          layout="prev, pager, next, jumper, sizes, total"
          :total="totalCount"
          :page-size="pageParams.pageSize"
          :current-page="pageParams.pageNo"
          :page-sizes="[5, 10, 20, 30, 40, 50]"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          class="wkt-pagination"
        >
        </el-pagination> -->

        <el-pagination
          v-if="totalCount"
          @size-change="onSizeChange"
          :hide-on-single-page="true"
          @current-change="onPageChange"
          :page-size="pageParams.pageSize"
          :page-sizes="[5, 10, 20, 30, 40, 50]"
          layout="sizes, prev, pager, next"
          :total="totalCount"
        >
        </el-pagination>
      </el-row>
    </div>

    <!-- 一键导出温馨提示对话弹框 -->
    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size: 14px">商品出库单正在导出，请等候...</span>
    </el-dialog>

    <!-- 多仓出库对话框  会出现双重弹窗，待商榷 -->
    <!-- <batchDialog :dialogFormVisible="dialogFormVisible" @closeDialog="closeDialog">

    </batchDialog> -->
  </div>
</template>

<script>
  import inventoryMgrAPI from '@/dss-wechat3rd/src/api/retail/goodsMgr/inventoryMgrAPI.js';
  import ioboundEnum from '@/dss-wechat3rd/src/constants/ioboundEnum.js';
  import utils from '@/dss-common/utils/index.js';
  import IoBoundFilter from '../IoBoundFilter.vue';
  import { mapState } from 'vuex';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
  import exportExcel from '@/dss-common/utils/exportExcel';

  // import batchDialog from './batch-outbound/batch-out-dialog.vue';
  const unionKeys = ['outboundNo'];
  export default {
    name: 'Outbound',
    mixins: [tableCheckedHelperMixin],
    components: {
      IoBoundFilter,
      // batchDialog
    },
    data() {
      return {
        ioboundEnum,
        loading: false,
        filterParams: {},
        outboundList: [],
        totalCount: 0,
        pageParams: {
          pageSize: 10,
          pageNo: 1,
        },
        status: null,
        multipleSelection: [],
        typeList: null,
        outboundTypeList: Object.keys(ioboundEnum.outboundType).map(key => {
          return ioboundEnum.outboundType[key];
        }),

        // 导出相关参数
        disabledOneKeyExport: false, // 是否禁止一件导出操作按钮
        disabledOutBound: false, // 是否禁止导出出库单操作按钮
        showTipDialog: false, // 是否显示一键导出温馨提示对话弹框

        activeName: '0', // tabs数据切换初始化值
        // dialogFormVisible: false, //多仓出库对话框
      };
    },

    computed: {
      ...mapState({
        curApp: 'curApp',
      }),
    },

    // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.handleListOutboundList(); // 获取出库列表
      });
    },

    mounted() {
      // this.handleListOutboundList();
    },

    methods: {
      handleOutbound() {
        this.$router.push('/warehouse/inventory-mgr/outbound/new-outbound');
      },
      toStockDetail(outboundItem) {
        this.$router.push({
          name: 'outbound-detail',
          query: { outboundNo: outboundItem.outboundNo },
        });
      },

      handleInbound() {
        this.$router.push('/warehouse/inventory-mgr/outbound/batch-outbound');
        // this.dialogFormVisible = true;
      },
      // closeDialog() {
      //   this.dialogFormVisible = false;
      // },

      // 状态筛选
      setStatus(status) {
        this.status = status;
        this.pageParams.pageNo = 1;

        const typelist = [];
        if (this.status === ioboundEnum.boundStatus.THROUGH.value) {
          this.outboundTypeList.forEach(item => {
            if (item.value !== 20) {
              typelist.push(item.value);
            }
          });
          this.typeList = typelist;
        } else {
          this.typeList = null;
        }

        this.multipleSelection = [];
        this.mBuildMultipleTableSelection(this.outboundList, this.multipleSelection, unionKeys);
        this.handleListOutboundList();
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      // 批量审核
      handAudit() {
        this.mUpdateTotalListBySelection(this.outboundList, this.multipleSelection, unionKeys);
        if (this.mTotalCheckedList && this.mTotalCheckedList.length) {
          this.$confirm('确认审核所有已选择单据？ ', '批量审核', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'wkt-warning',
          })
            .then(() => {
              const outboundNos = [];
              this.mTotalCheckedList.forEach((item, index) => {
                if (index < 50) {
                  outboundNos.push(item.outboundNo);
                }
              });
              this.loading = true;
              inventoryMgrAPI
                .batchOutbound({ status: ioboundEnum.boundStatus.THROUGH.value, outboundNos: outboundNos })
                .done(res => {
                  const message = res.data.message ? ' \n 提示:' + res.data.message : '';
                  this.$message({
                    message: '成功数目:' + res.data.successNum + ' \n 失败数目:' + res.data.failuresNum + message,
                    type: res.data.failuresNum ? 'error' : 'success',
                  });
                  this.multipleSelection = [];
                  this.mBuildMultipleTableSelection(this.outboundList, this.multipleSelection, unionKeys);
                  this.pageParams.pageNo = 1;
                  this.handleListOutboundList();
                })
                .always(() => {
                  this.loading = false;
                });
            })
            .catch(() => {
              console.log('取消批量审核');
            });
        }
      },

      // 批量确认出库
      handleStorage() {
        this.mUpdateTotalListBySelection(this.outboundList, this.multipleSelection, unionKeys);
        if (this.mTotalCheckedList && this.mTotalCheckedList.length) {
          this.$confirm('确认所有单据已正常出库？ ', '批量确认出库', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'wkt-warning',
          })
            .then(() => {
              this.mUpdateTotalListBySelection(this.outboundList, this.multipleSelection, unionKeys);
              const outboundNos = [];
              this.mTotalCheckedList.forEach((item, index) => {
                if (index < 50) {
                  outboundNos.push(item.outboundNo);
                }
              });
              this.loading = true;
              inventoryMgrAPI
                .batchConfirmOutbound({ outboundNos: outboundNos })
                .done(res => {
                  const message = res.data.message ? ' \n 提示:' + res.data.message : '';
                  this.$message({
                    message: '成功数目:' + res.data.successNum + ' \n 失败数目:' + res.data.failuresNum + message,
                    type: res.data.failuresNum ? 'error' : 'success',
                  });
                  this.multipleSelection = [];
                  this.mBuildMultipleTableSelection(this.outboundList, this.multipleSelection, unionKeys);
                  this.pageParams.pageNo = 1;
                  this.handleListOutboundList();
                })
                .always(() => {
                  this.loading = false;
                });
            })
            .catch(() => {
              console.log('取消批量确认出库');
            });
        }
      },

      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.handleListOutboundList(this.keyword);
      },

      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.handleListOutboundList(this.keyword);
      },

      handleFilter(filterParams) {
        this.filterParams = filterParams;
        this.pageParams.pageNo = 1;
        this.handleListOutboundList();
      },

      update_status(row, status) {
        const text = status === 20 ? '审核' : '拒绝审核';
        this.$confirm('确定' + text + '出库单吗?', text, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            this.loading = true;
            inventoryMgrAPI
              .update_Outstatus({ outboundNo: row.outboundNo, status: status })
              .then(result => {
                if (!result.data) {
                  this.$message({
                    message: result.errorMessage,
                    type: 'warning',
                  });
                }
                this.handleListOutboundList();
              })
              .always(() => {
                this.loading = false;
              });
          })
          .catch(() => {});
      },

      confirm(row, status) {
        this.$confirm('确认所有商品都正常出库？', '确认出库', {
          confirmButtonText: '确定',
          cancelButtonText: '差异出库',
          distinguishCancelAndClose: true,
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            this.loading = true;
            inventoryMgrAPI
              .confirmOutbound({ outboundNo: row.outboundNo })
              .then(result => {
                this.handleListOutboundList();
              })
              .always(() => {
                this.loading = false;
              });
          })
          .catch(action => {
            if (action === 'cancel') {
              this.$router.push({
                path: '/warehouse/inventory-mgr/outbound/outbound-detail',
                query: { outboundNo: row.outboundNo, confirm: true },
              });
            }
          });
      },

      handleToEdit(row) {
        this.$router.push({
          path: '/warehouse/inventory-mgr/outbound/new-outbound',
          query: { outboundNo: row.outboundNo },
        });
      },

      handleListOutboundList() {
        this.mUpdateTotalListBySelection(this.outboundList, this.multipleSelection, unionKeys);
        this.loading = true;
        const params = {
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          ...this.filterParams,
          status: this.status,
          useThirdWMS: this.status === ioboundEnum.boundStatus.THROUGH.value ? false : undefined, // 批量出库不显示第三方仓库的
        };

        if (this.typeList) {
          this.typeList.forEach((item, index) => {
            params['typeList[' + index + ']'] = item;
          });
        }

        inventoryMgrAPI
          .listOutbounds(params)
          .then(rs => {
            this.outboundList = rs.data || [];
            this.parseOutboundList();
            this.totalCount = rs.totalCount;
            this.mBuildMultipleTableSelection(this.outboundList, 'outboundTable', unionKeys);
          })
          .always(() => {
            this.loading = false;
          });
      },
      parseOutboundList() {
        this.outboundList.forEach(outbound => {
          const outboundTypeKeys = Object.keys(ioboundEnum.outboundType);
          const len = outboundTypeKeys.length;
          for (let index = 0; index < len; index++) {
            const key = outboundTypeKeys[index];
            if (ioboundEnum.outboundType[key].value === outbound.type) {
              outbound.typeDesc = ioboundEnum.outboundType[key].label;
              break;
            }
          }
          outbound.outboundTime = utils.timeFormat(new Date(outbound.outboundTime), 'YYYY-MM-DD HH:mm:ss');
        });
      },

      // 一键导出
      patchDerived() {
        this.$confirm('确定一键导出过滤后的数据吗？ ', '一键导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            const params = {
              ...this.filterParams,
              status: this.status,
              typeList: this.typeList,
            };

            // 判断是否选择了时间
            if (!params.startTime || !params.endTime) {
              return this.$message({
                message: '请选择导出数据的时间',
                type: 'error',
              });
            }

            // 判断时间跨度
            const day = this.gatDateInterval(params);
            if (!params.startTime || !params.endTime || day > 60) {
              return this.$message({
                message: '时间跨度不得超过60天',
                type: 'error',
              });
            }

            // 删除请求参数中的空值
            Object.keys(params).forEach(key => {
              if (!params[key] || params[key] === null || params[key] === '') {
                delete params[key];
              }
            });

            // post下载
            this.disabledOneKeyExport = true;
            this.showTipDialog = true;
            exportExcel.getDownload(inventoryMgrAPI.outboundExport, params).always(() => {
              this.disabledOneKeyExport = false;
              this.showTipDialog = false;
            });
          })
          .catch(() => {
            console.log('取消一键导出');
          });
      },

      // 一键导出发货单
      patchDerivedDelivery() {
        this.$confirm('确定一键导出过滤后的数据吗？ ', '一键导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            const params = {
              ...this.filterParams,
              status: this.status,
              typeList: this.typeList,
            };

            // 判断是否选择了时间
            if (!params.startTime || !params.endTime) {
              return this.$message({
                message: '请选择导出数据的时间',
                type: 'error',
              });
            }

            // 判断时间跨度
            const day = this.gatDateInterval(params);
            if (!params.startTime || !params.endTime || day > 60) {
              return this.$message({
                message: '时间跨度不得超过60天',
                type: 'error',
              });
            }

            // 删除请求参数中的空值
            Object.keys(params).forEach(key => {
              if (!params[key] || params[key] === null || params[key] === '') {
                delete params[key];
              }
            });

            // post下载
            this.disabledOutBound = true;
            this.showTipDialog = true;
            exportExcel.getDownload(inventoryMgrAPI.deliveryExport, params).always(() => {
              this.disabledOutBound = false;
              this.showTipDialog = false;
            });
          })
          .catch(() => {
            console.log('取消一键导出');
          });
      },

      /**
       * 获取时间间隔
       */
      gatDateInterval(params) {
        const startTime = new Date(params.startTime);
        const endTime = new Date(params.endTime);
        const time = endTime.getTime() - startTime.getTime();
        const day = parseInt(time / (1000 * 60 * 60 * 24));
        return day;
      },

      // name属性转String类型
      changeType(name) {
        return String(name);
      },

      // tabs切换
      handleClick(tab, even) {
        if (tab.name) {
          this.setStatus(Number(tab.name));
        } else {
          this.setStatus();
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .inventory {
    .Batch-btn {
      margin-top: 16px;
      background: #fff;
      padding-left: 20px;
      padding-top: 16px;
    }

    .custom-label {
      margin-top: 0;
      background: #fff;
      padding: 0 20px;
    }

    .tabs-box {
      position: relative;
      background: #fff;
      padding-bottom: 15px;

      .export-box {
        position: absolute;
        top: 9px;
        right: 20px;
      }
    }

    .inventory-content {
      padding: 0;

      .el-table .cell {
        text-overflow: clip;
      }
    }
  }

  .el-table__fixed-right,
  .el-table__fixed {
    top: 20px !important;
  }
</style>

<style lang="less">
  .inventory {
    // tabs下划线

    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
</style>
