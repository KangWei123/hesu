<template>
  <el-dialog
    title="发货单"
    v-loading="loading"
    :visible="true"
    :append-to-body="true"
    :show-close="false"
    width="600px"
  >
    <el-table :data="orderLogisticsVOList" style="width: 100%;margin: 0;">
      <el-table-column label="商品" prop="itemList">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.itemList" :key="index">
            {{ item.itemName }}&nbsp;&nbsp;&nbsp;&nbsp;x{{ item.count }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="outBoundNo" label="出库单号"> </el-table-column>

      <el-table-column width="100px" label="操作">
        <template slot-scope="scope">
          <el-radio
            v-model="select"
            v-if="scope.row.status === orderStatusEnum.LOGISTICS.STATUS.TO_DELIVERY && !scope.row.useWMSConfig"
            :label="scope.$index"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSure()">确 定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum.js';

export default {
  props: {
    orderNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      orderLogisticsVOList: [],
      select: '',
      orderStatusEnum
    };
  },

  mounted() {
    this.queryLogistics();
  },

  methods: {
    // 查询发货单信息
    queryLogistics() {
      this.loading = true;

      const params = {
        orderNo: this.orderNo
      };
      services
        .get(constants.Api.order.queryLogistics, {
          params,
          action: '发货单'
        })
        .done(res => {
          this.orderLogisticsVOList = res.data || [];
        })
        .always(() => {
          this.loading = false;
        });
    },

    //取消
    handleCancel() {
      this.$emit('cancel');
    },

    //确定
    handleSure() {
      if (this.select === '') {
        this.$message({
          message: '请选择需要发货的商品',
          type: 'warning'
        });
        return;
      }
      this.$emit('done', this.orderLogisticsVOList[this.select].outBoundNo);
    }
  }
};
</script>
