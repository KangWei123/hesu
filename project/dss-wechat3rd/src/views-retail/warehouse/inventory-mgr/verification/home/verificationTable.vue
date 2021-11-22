/*
 * @Author: Neexz
 * @Date: 2018-11-06 10:01:36
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-12-23 16:07:27
 */

<template>

  <el-table :data="verificationList"
            v-loading="isLoading"
            class="wkt-table verification-table">

    <el-table-column label="制单号"
                     min-width="150"
                     prop="invoiceNo">
    </el-table-column>

    <el-table-column label="盘点状态"
                     min-width="100">
      <template slot-scope="scope">
          <span :style="{color: scope.row.status === 0 ? 'red': 'black'}">
            {{ statusDesc[scope.row.status] }}
          </span>
      </template>
    </el-table-column>

    <el-table-column label="仓库"
                     prop="warehouseName"
                     min-width="100">
    </el-table-column>

    <el-table-column label="盘点商品"
                     min-width="100"
                     prop="productNum">
    </el-table-column>

    <el-table-column label="是否盘平"
                     min-width="100">
      <template slot-scope="scope">
          <span :style="{color: scope.row.isBalance === 0 ? 'red': 'black'}">
            {{ scope.row.isBalance === 0 ? '否' : '是' }}
          </span>
      </template>
    </el-table-column>

    <el-table-column prop="operator"
                     min-width="150"
                     label="经办人">
    </el-table-column>

    <el-table-column label="制单时间"
                     min-width="200"
                     prop="createTime"
                     :formatter="formatTimeWithHour">
    </el-table-column>

    <el-table-column prop="remark"
                     min-width="100"
                     label="备注">
        <span class="limit-line line-6"
              slot-scope="scope">
          {{scope.row.remark}}
        </span>
    </el-table-column>

    <el-table-column label="操作"
                     width="150">
      <template slot-scope="scope">
        <div class="optionsButton" v-if="scope.row.status === 1">
          <a class="verification-cancel" href="javascript:;"
             @click="cancel(scope.row.id)">作废</a>
          <a href="javascript:;"
             @click="continueVerification(scope.row.id)">继续盘点</a>
        </div>
        <div class="optionsButton" v-else-if="scope.row.status === 2">
          <a href="javascript:;"
             @click="showInfo(scope.row.id)">详情</a>
        </div>
      </template>
    </el-table-column>
  </el-table>

</template>

<script>
import datetimeUtil from '@/dss-common/utils/date.js';
import inventoryMgrAPI from '@/dss-wechat3rd/src/api/retail/goodsMgr/inventoryMgrAPI.js';

const verificationStatusDesc = ['已作废', '进行中', '已完成'];

export default {
  props: {
    verificationList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },

  data() {
    return {
      isLoading: false,
      statusDesc: verificationStatusDesc
    };
  },

  methods: {
    cancel(verificationId) {
      let params = {
        reviewId: verificationId
      };

      this.isLoading = true;

      inventoryMgrAPI
        .cancelVerification(params)
        .then(res => {
          console.log('cancelVerification -->', res.data);
          if (!!res.data) {
            this.$message({
              message: '该条记录已作废',
              type: 'success'
            });
          } else {
            this.$message({
              message: '操作失败',
              type: 'error'
            });
          }
          this.$emit('refresh');
        })
        .catch(err => {
          console.error('cancelVerification error', err);
          this.$message({
            message: '操作失败',
            type: 'error'
          });
        })
        .always(() => {
          this.isLoading = false;
        });
    },

    showInfo(verificationId) {
      console.log('verification detail page --> ', verificationId);
      this.$router.push({
        path: '/warehouse/inventory-mgr/verification/detail',
        query: { id: verificationId }
      });
    },

    continueVerification(verificationId) {
      console.log('continueVerification add-modify page --> ', verificationId);
      this.$router.push({
        path: '/warehouse/inventory-mgr/verification/add-modify',
        query: { id: verificationId }
      });
    },

    formatTimeWithHour: function(row, column) {
      let date = row[column.property];
      if (date) {
        return datetimeUtil.format(new Date(date), 'YYYY-MM-DD HH:mm:ss');
      }
      return '';
    }
  }
};
</script>

<style lang="less" scoped>
.verification-table {
  .verification-cancel {
    color: @red-color;
  }
  .verification-cancel:hover {
    color: @red-color-hover;
  }
  .optionsButton > a {
    color: @ui-function-color-link !important;
  }
}
</style>
