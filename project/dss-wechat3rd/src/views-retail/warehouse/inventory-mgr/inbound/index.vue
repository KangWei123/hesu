<template>
  <div class="inventory-iobound">
    <io-bound-filter bound-type="in" class="wkt-opt-label-container" @filter="handleFilter" />

    <div class="Add-Manage-Button">
      <el-button plain @click="handleInbound('batch')">批量多仓入库</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleInbound('purchase')">新建入库</el-button>
    </div>

    <div class="Batch-btn">
      <el-button type="primary" v-if="status === ioboundEnum.boundStatus.PENDING.value" @click="handAudit"
        >批量审核</el-button
      >
      <el-button type="primary" v-if="status === ioboundEnum.boundStatus.THROUGH.value" @click="handleStorage"
        >批量确认入库</el-button
      >
      <div
        style="margin-top: 5px; color: #a1a4ab"
        v-if="status === ioboundEnum.boundStatus.PENDING.value || status === ioboundEnum.boundStatus.THROUGH.value"
      >
        注：批量一次只能操作50个
      </div>
    </div>
    <!--新的入库-->
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

    <!-- <div class="custom-label">
      <div class="bound-left">审核状态：
        <span class="bound-status"
              @click="setStatus()"
              :class="status==null?'checked':''">全部</span>
        <span class="bound-status"
              @click="setStatus(ioboundEnum.boundStatus.PENDING.value)"
              :class="status===ioboundEnum.boundStatus.PENDING.value?'checked':''">待审核</span>
        <span class="bound-status"
              @click="setStatus(ioboundEnum.boundStatus.THROUGH.value)"
              :class="status===ioboundEnum.boundStatus.THROUGH.value?'checked':''">待确认入库</span>
        <span class="bound-status"
              @click="setStatus(ioboundEnum.boundStatus.FINISHED.value)"
              :class="status===ioboundEnum.boundStatus.FINISHED.value?'checked':''">已完成</span>
      </div> -->

    <!-- <el-button size="mini"
                 type="primary"
                 @click="handleInbound('purchase')">新建入库</el-button>
      <el-button size="mini"
                 @click="handleInbound('batch')">批量多仓入库</el-button> -->
    <!-- </div> -->
    <div class="wkt-card inventory-iobound-content" v-loading="loading">
      <el-row>
        <el-table :data="inboundList" ref="inboundTable" @selection-change="handleSelectionChange" class="wkt-table">
          <el-table-column
            type="selection"
            v-if="status === ioboundEnum.boundStatus.PENDING.value || status === ioboundEnum.boundStatus.THROUGH.value"
            width="55"
          >
          </el-table-column>
          <el-table-column label="入库单号" min-width="205" prop="inboundNo"> </el-table-column>
          <el-table-column label="入库类型" min-width="100" prop="typeDesc"> </el-table-column>
          <el-table-column label="入库时间" min-width="100" prop="inboundTime"> </el-table-column>
          <el-table-column label="经办人" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关联单据号" min-width="205" prop="relocateNo">
            <template slot-scope="scope">
              <span>{{ scope.row.relocateNo || '- -' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="仓库" min-width="100" prop="warehouseName"> </el-table-column>

          <el-table-column label="状态" min-width="100" prop="status">
            <template slot-scope="scope">
              <!-- 待审批 1-->
              <span v-if="scope.row.status === ioboundEnum.boundStatus.PENDING.value">{{
                ioboundEnum.boundStatus.PENDING.label
              }}</span>
              <!-- 部分入库 4-->
              <span v-if="scope.row.status === ioboundEnum.boundStatus.PART.value">{{
                ioboundEnum.boundStatus.PART.label
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
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="214">
            <template slot-scope="scope">
              <div class="operation">
                <a
                  href="javascript:;"
                  @click="update_status(scope.row, ioboundEnum.boundStatus.THROUGH.value)"
                  v-if="scope.row.status === ioboundEnum.boundStatus.PENDING.value"
                  >通过</a
                >

                <!-- </div>
              <div> -->
                <!-- 第三方仓库标识useThirdWMS 0否,1是 -->
                <a
                  href="javascript:;"
                  @click="confirm(scope.row, ioboundEnum.boundStatus.FINISHED.value)"
                  v-if="scope.row.status === ioboundEnum.boundStatus.THROUGH.value && !scope.row.useThirdWMS"
                  >确认入库</a
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
                  style="color: #f5222d"
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
        <!-- <el-pagination layout="prev, pager, next, jumper, sizes, total"
                       :total="totalCount"
                       :page-size="pageParams.pageSize"
                       :current-page="pageParams.pageNo"
                       :page-sizes="[5, 10, 20, 30, 40, 50]"
                       @size-change="onSizeChange"
                       @current-change="onPageChange"
                       class="wkt-pagination">
        </el-pagination> -->

        <el-pagination
          v-if="totalCount"
          @size-change="onSizeChange"
          :hide-on-single-page="true"
          @current-change="onPageChange"
          :page-size="pageParams.pageSize"
          layout="sizes, prev, pager, next"
          :total="totalCount"
        >
        </el-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
  import inventoryMgrAPI from '@/dss-wechat3rd/src/api/retail/goodsMgr/inventoryMgrAPI.js';
  import ioboundEnum from '@/dss-wechat3rd/src/constants/ioboundEnum.js';
  import utils from '@/dss-common/utils/index.js';
  import IoBoundFilter from '../IoBoundFilter.vue';
  import { mapState } from 'vuex';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';

  const unionKeys = ['inboundNo'];
  export default {
    name: 'Inbound',
    mixins: [tableCheckedHelperMixin],
    components: {
      IoBoundFilter,
    },
    data() {
      return {
        loading: false,
        ioboundEnum,
        inboundList: [],
        totalCount: 0,
        pageParams: {
          pageSize: 10,
          pageNo: 1,
        },
        status: null,
        multipleSelection: [],
        filterParams: {},
        useThirdWMS: null,
        // tabs切换
        activeName: '0',
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
        vm.handleListInboundList(); // 获取入库列表
      });
    },

    mounted() {
      // this.handleListInboundList();
    },

    methods: {
      changeType(name) {
        return String(name);
      },
      handleInbound(inboundType) {
        this.$router.push(`/warehouse/inventory-mgr/inbound/${inboundType}-inbound`);
      },

      // 跳出入库明细
      toStockDetail(inboundItem) {
        this.$router.push({
          path: '/warehouse/inventory-mgr/inbound/inbound-detail',
          query: { inboundNo: inboundItem.inboundNo },
        });
      },

      // 状态筛选
      setStatus(status) {
        this.status = status;
        this.pageParams.pageNo = 1;
        this.multipleSelection = [];
        this.mBuildMultipleTableSelection(this.inboundList, this.multipleSelection, unionKeys);
        this.handleListInboundList();
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      handAudit() {
        this.mUpdateTotalListBySelection(this.inboundList, this.multipleSelection, unionKeys);
        if (this.mTotalCheckedList && this.mTotalCheckedList.length) {
          this.$confirm('确认审核所有已选择单据？ ', '批量审核', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'wkt-warning',
          })
            .then(() => {
              const inboundNos = [];
              this.mTotalCheckedList.forEach((item, index) => {
                if (index < 50) {
                  inboundNos.push(item.inboundNo);
                }
              });
              this.loading = true;
              inventoryMgrAPI
                .batchInbound({ status: ioboundEnum.boundStatus.THROUGH.value, inboundNos: inboundNos })
                .done(res => {
                  this.$message({
                    message: '批量操作成功',
                    type: 'success',
                  });
                  this.multipleSelection = [];
                  this.mBuildMultipleTableSelection(this.inboundList, this.multipleSelection, unionKeys);
                  this.pageParams.pageNo = 1;
                  this.handleListInboundList();
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

      // 批量入库
      handleStorage() {
        this.mUpdateTotalListBySelection(this.inboundList, this.multipleSelection, unionKeys);
        if (this.mTotalCheckedList && this.mTotalCheckedList.length) {
          this.$confirm('确认所有单据已正常入库？ ', '批量确认入库', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'wkt-warning',
          })
            .then(() => {
              const inboundNos = [];
              this.mTotalCheckedList.forEach((item, index) => {
                if (index < 50) {
                  inboundNos.push(item.inboundNo);
                }
              });
              this.loading = true;
              inventoryMgrAPI
                .batchConfirmInbound({ inboundNos: inboundNos })
                .done(res => {
                  const message = res.data.message ? ' \n 提示:' + res.data.message : '';
                  this.$message({
                    message: '成功数目:' + res.data.successNum + ' \n 失败数目:' + res.data.failuresNum + message,
                    type: res.data.failuresNum ? 'error' : 'success',
                  });
                  this.multipleSelection = [];
                  this.mBuildMultipleTableSelection(this.inboundList, this.multipleSelection, unionKeys);
                  this.pageParams.pageNo = 1;
                  this.handleListInboundList();
                })
                .always(() => {
                  this.loading = false;
                });
            })
            .catch(() => {
              console.log('取消批量确认入库');
            });
        }
      },

      handleToEdit(row) {
        let inboundType = '';
        if (
          row.type === ioboundEnum.inboundType.PURCHASE.value ||
          row.type === ioboundEnum.inboundType.OTHER_IN.value
        ) {
          inboundType = 'purchase';
        }
        if (row.type === ioboundEnum.inboundType.RELOCATE_IN.value) {
          inboundType = 'allot';
        }
        this.$router.push({
          path: `/warehouse/inventory-mgr/inbound/${inboundType}-inbound`,
          query: { inboundNo: row.inboundNo },
        });
      },

      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.handleListInboundList(this.keyword);
      },

      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.handleListInboundList(this.keyword);
      },
      handleFilter(filterParams) {
        this.filterParams = filterParams;
        this.pageParams.pageNo = 1;
        this.handleListInboundList();
      },

      handleListInboundList() {
        this.mUpdateTotalListBySelection(this.inboundList, this.multipleSelection, unionKeys);
        this.loading = true;
        const params = {
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          ...this.filterParams,
          status: this.status,
          useThirdWMS: this.status === ioboundEnum.boundStatus.THROUGH.value ? false : undefined, // 批量出库不显示第三方仓库的
        };
        inventoryMgrAPI
          .listInbounds(params)
          .then(rs => {
            this.inboundList = rs.data || [];
            this.parseInboundList();
            this.totalCount = rs.totalCount;
            this.mBuildMultipleTableSelection(this.inboundList, 'inboundTable', unionKeys);
          })
          .always(() => {
            this.loading = false;
          });
      },

      update_status(row, status) {
        const text = status === 20 ? '审核' : '拒绝审核';
        this.$confirm('确定' + text + '入库单吗?', text, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            this.loading = true;
            inventoryMgrAPI
              .update_status({ inboundNo: row.inboundNo, status: status })
              .then(result => {
                this.handleListInboundList();
              })
              .always(() => {
                this.loading = false;
              });
          })
          .catch(() => {});
      },

      confirm(row, status) {
        this.$confirm('确认所有商品都正常入库？', '确认入库', {
          confirmButtonText: '确定',
          cancelButtonText: '差异入库',
          distinguishCancelAndClose: true,
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            this.loading = true;
            inventoryMgrAPI
              .confirmInbound({ inboundNo: row.inboundNo })
              .then(result => {
                this.handleListInboundList();
              })
              .always(() => {
                this.loading = false;
              });
          })
          .catch(action => {
            if (action === 'cancel') {
              this.$router.push({
                path: '/warehouse/inventory-mgr/inbound/inbound-detail',
                query: { inboundNo: row.inboundNo, confirm: true },
              });
            }
          });
      },

      parseInboundList() {
        this.inboundList.forEach(inbound => {
          const inboundTypeKeys = Object.keys(ioboundEnum.inboundType);
          const len = inboundTypeKeys.length;
          for (let index = 0; index < len; index++) {
            const key = inboundTypeKeys[index];
            if (ioboundEnum.inboundType[key].value === inbound.type) {
              inbound.typeDesc = ioboundEnum.inboundType[key].label;
              break;
            }
          }
          inbound.inboundTime = utils.timeFormat(new Date(inbound.inboundTime), 'YYYY-MM-DD HH:mm:ss');
        });
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

<style lang="less">
  @import '../inventory-query/index.less';

  .wkt-opt-label-container {
    padding-top: 16px;
  }
</style>
