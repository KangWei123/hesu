<template>
  <el-dialog :visible.sync="mShowDialog" title="已选择订单" width="720px">
    <div class="preview-order-dialog-content">
      <el-table :data="orderList">
        <el-table-column label="订单编号" prop="orderNo" width="230px"></el-table-column>
        <el-table-column label="会员" width="200px">
          <span slot-scope="scope">{{scope.row.userWxNickName || '未知'}}</span>
        </el-table-column>
        <el-table-column label="商品信息">
          <template slot-scope="scope" v-if="scope.row.itemList">
            <div v-for="item in scope.row.itemList">{{item.itemName}}{{item.itemAttribute ? '(' + item.itemAttribute +')' : ''}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" style="text-align: center">
      <el-button class="primary-white" type="primary"
                 @click="handlePreviewOrderOk">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import dialogMixin from '@/dss-common/mixins/dialog-mixin.js';
  export default {
    name: 'preview-order-dialog',
    mixins: [dialogMixin],
    props: {
      orderList: {
        type: Array,
        default: function() {
          return [];
        }
      }
    },
    methods: {
      handlePreviewOrderOk() {
        this.mShowDialog = false;
        this.$emit('preview-ok');
      }
    }
  };
</script>

<style lang="less">
  .preview-order-dialog-content {
    max-height: 500px;
    overflow: auto;
    .el-table {
      margin-top: 0;
    }
  }
</style>
