<template>
  <div class="detail-table-container">

    <el-card class="coupon-card">
      <div slot="header">
        <h2 class="card-title">领取明细</h2>
      </div>

      <div class="export-box" v-if="detailDatas.length">
        <el-button type="primary"
                   @click="batchExport"
                   :disabled="disableBatchExport">批量导出</el-button>
        <el-button @click="oneKeyExport"
                   :disabled="disabledOneKeyExport">一键导出</el-button>
      </div>
      <el-table :data="detailDatas" 
                class="wkt-table" 
                ref="multipleTable"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="70">
        </el-table-column>

        <el-table-column label="会员">
          <template slot-scope="scope">
            <div class="member-info">
              <div class="member-img">
                <i v-if="scope.row.avatarImgUrl === ''"
                   class="el-icon-question avatar-size" />
                <img v-else
                     :src="scope.row.avatarImgUrl" />
              </div>

              <div class="member-desc">
                <div class="member-name"> {{ scope.row.nickname }}&nbsp;</div>
                <div class="user-phone"
                     :title="(scope.row.realName || '') + ' ' + (scope.row.phone || '')">{{scope.row.realName }} {{ scope.row.phone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="领取时间"
                         prop="receiveTime">
          <template slot-scope="scope">
            {{scope.row.receiveTime | time}}
          </template>
        </el-table-column>

        <el-table-column label="使用时间"
                         prop="useTime">
          <template slot-scope="scope">
            <span :style="{color: scope.row.status === 3? 'red': '' }">
              {{ computeUseTime(scope.row) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="核销员"
                         prop="verifierName">
        </el-table-column>

        <el-table-column label="关联订单金额"
                         prop="payFee">
          <template slot-scope="scope">
            ¥ {{scope.row.payFee | price}}
          </template>
        </el-table-column>
      </el-table>

      <el-pagination layout="prev, pager, next, jumper, sizes, total"
                     :total="totalCount"
                     :page-size="pageParams.pageSize"
                     :current-page="pageParams.pageNo"
                     @size-change="onSizeChange"
                     @current-change="onPageChange"
                     class="wkt-pagination">
      </el-pagination>
    </el-card>

        <!-- 一键导出温馨提示对话弹框 -->
    <el-dialog title="温馨提示"
               :visible.sync="showTipDialog"
               width="500px">
      <span style="font-size:14px;">领取明细正在导出，请等候...</span>
    </el-dialog>
  </div>
</template>

<script>
import CouponApi from '@/dss-wechat3rd/src/api/couponApi.js';
import utils from '@/dss-common/utils/index.js';
import './common.less';
import exportExcel from '@/dss-common/utils/exportExcel.js';
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';

const unionKeys = ['id'];
export default {
  name: 'CouponDetailTable',
  mixins: [industryHelperMixin, tableCheckedHelperMixin],
  props: {
    couponId: {
      type: Number,
      default() {
        return 0;
      }
    }
  },

  data() {
    return {
      loading: false,
      pageParams: {
        pageNo: 1,
        pageSize: 10
      },
      detailDatas: [],
      totalCount: 0,
      multipleSelection: [], // 当前页面选中维护的列表list
      // 导出相关参数
      disableBatchExport: false, // 是否禁止批量导出操作按钮
      disabledOneKeyExport: false, // 是否禁止一件导出操作按钮
      showTipDialog: false // 是否显示一键导出温馨提示对话弹框
    };
  },

  mounted() {
    this.apiGetDetailTableData();
    // this.detailDatas = MockData.detailTable.data;
    // this.totalCount = this.detailDatas.length;
  },

  methods: {
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.apiGetDetailTableData();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.apiGetDetailTableData();
    },

    computeUseTime(row) {
      console.log('------------>', row.status);
      if (row.status === 1 && !row.useTime) {
        return '未使用';
      }

      if (row.status === 3) {
        return '已过期';
      }

      return this.formatDate(row.useTime);
    },

    formatDate(datetime) {
      if (!!datetime) {
        return utils.timeFormat(datetime);
      }
      return null;
    },

    apiGetDetailTableData() {
      // 获取数据之前，需要重新计算一次选中的item
      this.mUpdateTotalListBySelection(this.detailDatas, this.multipleSelection, unionKeys);

      this.loading = true;
      let params = {
        couponInfoId: this.couponId,
        appId: 296,
        ...this.pageParams
      };
      CouponApi.queryDetailTable(params)
        .then(res => {
          console.log('apiGetDetailTableData ---->', res.data);
          this.detailDatas = res.data || [];
          this.totalCount = res.totalCount;

          // 成功获取数据之后，重新构建pageList的选中状态
          this.mBuildMultipleTableSelection(this.detailDatas, 'multipleTable', unionKeys);
        })
        .catch(err => {
          console.error('apiGetDetailTableData, error', err);
        })
        .always(() => {
          this.loading = false;
        });
    },

    computeUseTime(row) {
      console.log('------------>', JSON.stringify(row));
      if (row.status === 1 && !row.useTime) {
        return '未使用';
      }

      if (row.status === 3) {
        return '已过期';
      }

      return this.formatDate(row.useTime);
    },

    formatDate(datetime) {
      if (!!datetime) {
        return utils.timeFormat(datetime);
      }
      return null;
    },

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
      this.mUpdateTotalListBySelection(this.detailDatas, this.multipleSelection, unionKeys);
      this.$refs.multipleTable.clearSelection();
    },

    /**
     * 批量导出
     */
    batchExport() {
      // 每次批量操作时，主动触发一次计算全部选择的列表
      this.mUpdateTotalListBySelection(this.detailDatas, this.multipleSelection, unionKeys);

      // 所有被选中的列表list长度小于1
      if (this.mTotalCheckedList.length < 1) {
        this.$message.error('请选择要导出的领取明细');
        return;
      }

      this.$confirm('确定批量导出过滤后的领取明细吗？', '批量导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          let params = {
            couponInfoId: this.couponId
          };

          let ids = [];

          this.mTotalCheckedList.forEach(item => {
            ids.push(item.id);
          });
          params.ids = ids.toString();

          //post下载
          this.disableBatchExport = true;
          exportExcel
            .getDownload(CouponApi.couponInfoExport(), params)
            .then(res => {
              this.$message({
                message: '领取明细导出成功，正在下载',
                type: 'success'
              });
              this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表
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
     * 一键导出
     */
    oneKeyExport() {
      this.$confirm('确定一键导出过滤后的领取明细吗？', '一键导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          let params = {
            couponInfoId: this.couponId
          };

          //post下载
          this.disabledOneKeyExport = true;
          this.showTipDialog = true;

          exportExcel.getDownload(CouponApi.couponInfoExport(), params).always(() => {
            this.disabledOneKeyExport = false;
            this.showTipDialog = false;
          });
        })
        .catch(() => {
          console.log('取消一键导出');
        });
    }
  }
};
</script>

<style lang="less">
.detail-table-container {
  padding: 10px 20px;

  .member-info {
    overflow: hidden;

    .member-img {
      float: left;
      overflow: hidden;
      vertical-align: middle;
      line-height: 55px;
      margin-right: 13px;
      img {
        width: 40px;
        height: 40px;
        vertical-align: middle;
        border-radius: 100%;
      }
    }

    .member-desc {
      vertical-align: middle;

      .member-name {
        margin-bottom: 6px;
      }

      .user-phone {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>

