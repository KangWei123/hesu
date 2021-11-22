<template>
  <div class="staff-list" v-loading="loading">
    <div class="list-opt-box">
      <el-button class="btn" type="primary" @click="batchExport" :disabled="disableBatchExport">批量导出</el-button>
      <el-button class="btn" @click="oneKeyExport" :disabled="disabledOneKeyExport">一键导出</el-button>
    </div>

    <div class="staff-list el-table-list">
      <!-- 员工列表 -->
      <el-table
        class="wkt-table"
        ref="multipleTable"
        :data="dataList"
        stripe
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" v-if="dataList && dataList.length" width="70"></el-table-column>

        <el-table-column label="所属门店" prop="storeName" min-width="120"></el-table-column>

        <el-table-column label="所属部门" prop="department" min-width="120"></el-table-column>

        <el-table-column label="申请人" prop="name" min-width="80"></el-table-column>

        <el-table-column label="职位" prop="role" min-width="105">
          <template slot-scope="scope">
            <span>{{ role(scope.row.type) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="微信昵称" prop="nickname" min-width="100"></el-table-column>

        <el-table-column label="手机号" prop="phone" min-width="110"></el-table-column>

        <el-table-column label="申请时间" prop="applyTime" :formatter="timeFormatter" min-width="150"></el-table-column>

        <el-table-column label="申请活动" prop="activityType" min-width="150">
          <template slot-scope="scope">
            {{ activityTypeDesc(scope.row.activityType) }}
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="applyStatus" width="120">
          <template slot-scope="scope">
            {{ applyStatusDesc(scope.row.applyStatus, scope.row.isAutoAudit) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <div v-if="!scope.row.applyStatus">
              <a @click="updateDisPersonStatus(scope.row, 1)">通过</a>
              <a @click="updateDisPersonStatus(scope.row, -1)">拒绝</a>
            </div>

            <!-- 同意申请显示的文字 -->
            <el-popover placement="bottom-end" width="200" trigger="click" v-else-if="scope.row.applyStatus === 1">
              <div class="promo-code-title">员工推广码:{{ scope.row.name }}</div>
              <img :src="scope.row.promoCodeUrl" v-if="scope.row.promoCodeUrl !== null" class="promo-code" />
              <div v-else v-loading="true" class="promo-code-loading"></div>
              <a href="javascript:;" slot="reference" class="table-href">推广码</a>
            </el-popover>

            <!-- 拒绝申请显示的文字 -->
            <span v-else style="cursor: not-allowed">推广码</span>
          </template>
        </el-table-column>

        <!--修改无数据时的展示-->
        <template slot="empty">
          <place-holder></place-holder>
        </template>
      </el-table>

      <!-- 分页区域 -->
      <div style="text-align: center">
        <el-pagination
          v-if="totalCount"
          layout="prev, pager, next, jumper, sizes, total"
          :total="totalCount"
          :page-size="pageParams.pageSize"
          :current-page="pageParams.pageNo"
          @size-change="onSizeChange"
          @current-change="onPageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 一键导出温馨提示对话弹框 -->
    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size: 14px">分销员正在导出，请等候...</span>
    </el-dialog>
  </div>
</template>

<script>
  import utils from '@/dss-common/utils/index.js';
  import placeHolder from '@/dss-common/components/placeholder/index.vue';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
  import distributionApi from '@/dss-wechat3rd/src/api/distribution.js';
  import exportExcel from '@/dss-common/utils/exportExcel.js';

  const unionKeys = ['id']; // 统一标识key集合数组，唯一id标识，可能有多个key，用于记录选中的分页数据

  export default {
    name: 'StaffList',
    mixins: [tableCheckedHelperMixin],
    components: {
      placeHolder,
    },

    props: {
      // 搜索列表类型
      listType: {
        type: String,
        default: 'all',
      },
      // 列表查询条件
      filterParams: {
        type: Object,
        default: {},
      },
    },

    data() {
      return {
        loading: false,

        activityType: -1, // 活动类型，0：全员分销；1：员工内购；-1：全部

        totalCount: 0, // 总条数
        pageParams: {
          pageNo: 1, // 页数
          pageSize: 10, // 每页条数
        },

        dataList: [], // 数据列表

        multipleSelection: [], // 当前页面选中维护的分销选项

        // 导出相关参数
        disableBatchExport: false, // 是否禁止批量导出操作按钮
        disabledOneKeyExport: false, // 是否禁止一件导出操作按钮
        showTipDialog: false, // 是否显示一键导出温馨提示对话弹框
      };
    },

    computed: {
      // 职位
      role() {
        return roleType => {
          if (roleType === 2) {
            return '店长';
          }
          return '店员';
        };
      },
      // 申请的活动类型描述
      activityTypeDesc() {
        return activityType => {
          // 根据员工类型activityType：0：全员营销；1：员工内购；-1：全部，转换申请的活动类型描述
          let typeDesc = '全部';
          if (activityType === 0) {
            typeDesc = '全员营销';
          } else if (activityType === 1) {
            typeDesc = '员工内购';
          }
          return typeDesc;
        };
      },
      // 申请状态描述转换
      applyStatusDesc(row, column, cellValue, index) {
        return (applyStatus, isAutoAudit) => {
          // 根据申请状态applyStatus：0：待审核；1：已通过；-1：已拒绝，转换状态描述
          let statusDesc = '待审核';
          if (applyStatus === 1) {
            statusDesc = '匹配通过';
            if (isAutoAudit == 0) statusDesc = '审核通过';
          } else if (applyStatus === -1) {
            statusDesc = '已拒绝';
          } else if (applyStatus === 2) {
            statusDesc = '冻结中';
          }
          return statusDesc;
        };
      },
    },
    watch: {
      // 监听父组件传过来的列表查询条件，以便实时查询分销人员列表
      filterParams: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          // 判断父组件传过来的列表类型设置activityType活动类型参数（0：全员分销；1：员工内购；-1：全部）
          if (this.listType === 'marketing') {
            this.activityType = 0;
          } else if (this.listType === 'purchase') {
            this.activityType = 1;
          }

          this.pageParams.pageNo = 1;
          this.getDisPersonList(); // 查询分销人员列表
        },
      },
    },

    methods: {
      /**
       * 格式化时间
       */
      timeFormatter(row, column, cellValue, index) {
        return utils.timeFormat(cellValue);
      },

      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageNo = 1;
        this.pageParams.pageSize = size;
        this.getDisPersonList(); // 查询分销人员列表
      },
      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.getDisPersonList(); // 查询分销人员列表
      },

      /**
       * 查询分销人员列表
       */
      getDisPersonList() {
        // 获取数据之前，需要重新计算一次选中的item
        this.mUpdateTotalListBySelection(this.dataList, this.multipleSelection, unionKeys);

        const params = {
          activityType: this.activityType, // 分销类型，0：全员营销；1：员工内购；-1：全部
          ...this.filterParams,
          ...this.pageParams,
          departmentIds: this.filterParams.departmentIds ? this.filterParams.departmentIds.slice(-1)[0] : null,
        };

        this.loading = true;
        distributionApi.staffManage
          .queryDisPersonQueryList(params)
          .done(res => {
            this.dataList = res.data || [];
            this.totalCount = res.totalCount || 0;

            // 成功获取数据之后，重新构建pageList的选中状态
            this.mBuildMultipleTableSelection(this.dataList, 'multipleTable', unionKeys);
          })
          .always(res => {
            this.loading = false;
          });
      },

      /**
       * 审核分销人员
       */
      updateDisPersonStatus(row, status) {
        const statusDesc = status === 1 ? '通过' : '拒绝';
        this.$confirm('确定' + statusDesc + '该申请人的分销员申请吗？', '审核分销人员', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            const params = {
              activityType: row.activityType, // 分销类型，0：全员营销；1：员工内购；-1：全部
              id: row.id,
              status,
            };

            this.loading = true;
            distributionApi.staffManage
              .updateDisPersonStatus(params)
              .done(res => {
                if (res.data) {
                  this.$message.success(statusDesc + '成功');

                  this.pageParams.pageNo = 1;
                  this.getDisPersonList(); // 查询分销人员列表
                }
              })
              .always(res => {
                this.loading = false;
              });
          })
          .catch(() => {
            console.log('取消' + statusDesc);
          });
      },

      /**
       * 改变员工列表列表选项
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      /**
       * 批量操作成功之后，清空之前选中的操作数据列表
       */
      emptyMultipleSelection() {
        // 清除之前已选中的状态，重新计算选中的item。
        this.multipleSelection = [];
        this.mResetCheckedData();
        this.mUpdateTotalListBySelection(this.dataList, this.multipleSelection, unionKeys);
      },

      /**
       * 批量导出分销员
       */
      batchExport() {
        // 每次批量操作时，主动触发一次计算全部选择的列表
        this.mUpdateTotalListBySelection(this.dataList, this.multipleSelection, unionKeys);

        // 所有被选中的列表list长度小于1
        if (this.mTotalCheckedList.length < 1) {
          this.$message.error('请选择要导出的分销员');
          return;
        }

        this.$confirm('确定批量导出过滤后的分销员吗？', '批量导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            const params = {
              activityType: this.activityType, // 分销类型，0：全员营销；1：员工内购；-1：全部
              ...this.filterParams,
            };

            // 批量所有被选中的列表list的id集合
            const idList = [];
            this.mTotalCheckedList.forEach(item => {
              idList.push(item.id);
            });
            params.idList = idList;

            if (params.startDate && params.endDate) {
              const day = this.gatDateInterval(params); // 获取时间间隔
              if (day > 31) {
                return this.$message({
                  message: '时间跨度不得超过31天',
                  type: 'error',
                });
              }
            }

            // post下载
            this.disableBatchExport = true;
            exportExcel
              .getDownload(distributionApi.staffManage.disPersonExport, params)
              .then(res => {
                this.$message({
                  message: '分销员导出成功，正在下载',
                  type: 'success',
                });

                this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表
                this.getDisPersonList(); // 查询分销人员列表
              })
              .always(() => {
                this.disableBatchExport = false;
              });
          })
          .catch(() => {
            console.log('取消导出');
          });
      },

      /**
       * 一键导出分销员
       */
      oneKeyExport() {
        this.$confirm('确定一键导出过滤后的分销员吗？', '一键导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            const params = {
              activityType: this.activityType, // 分销类型，0：全员营销；1：员工内购；-1：全部
              ...this.filterParams,
            };

            // 判断是否选择了时间
            if (!params.startDate || !params.endDate) {
              return this.$message({
                message: '请选择导出数据的时间',
                type: 'error',
              });
            }

            const day = this.gatDateInterval(params); // 获取时间间隔
            if (day > 31) {
              return this.$message({
                message: '时间跨度不得超过31天',
                type: 'error',
              });
            }

            // post下载
            this.disabledOneKeyExport = true;
            this.showTipDialog = true;
            exportExcel.getDownload(distributionApi.staffManage.disPersonExport, params).always(() => {
              this.disabledOneKeyExport = false;
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
        const startDate = new Date(params.startDate);
        const endDate = new Date(params.endDate);
        const time = endDate.getTime() - startDate.getTime();
        const day = parseInt(time / (1000 * 60 * 60 * 24));
        return day;
      },
    },
  };
</script>
