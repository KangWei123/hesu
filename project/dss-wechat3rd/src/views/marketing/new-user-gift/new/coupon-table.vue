<template>
  <div class="wkt-card">
    <el-table class="wkt-table"
              :data="coupons">
      <el-table-column prop="name"
                       label="名称">
      </el-table-column>
      <el-table-column label="赠送数量"
                       width="150"
                       prop="quantitys">
        <template slot-scope="scope">
          <el-input maxlength="10"
                    v-model.number="scope.row.quantitys" />
        </template>
      </el-table-column>
      <el-table-column prop="minimumFee"
                       label="最低消费金额">
        <template slot-scope="scope">
          {{ scope.row.minimumFee | price}}
        </template>
      </el-table-column>
      <el-table-column prop="discountFee"
                       label="优惠券面值">
        <template slot-scope="scope">
          <span v-if="scope.row.couponCategory === couponEnum.couponCategory.discount">{{scope.row.discountFee | discount}}折</span>
          <span v-else>{{ scope.row.discountFee | price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remainAmount"
                       label="剩余数量">
        <template slot-scope="scope">{{scope.row.quantity === couponEnum.QUANTITY.UNLIMITED ? '无限制' : scope.row.remainAmount}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a class="dss-link"
             href="javascript:;"
             @click="handleRemove(scope.row)">删除</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import emitter from 'element-ui/lib/mixins/emitter.js';
import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum.js';
export default {
  props: {
    coupons: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      couponEnum
    };
  },

  mixins: [emitter],

  watch: {
    coupons: {
      deep: true,
      handler(newVal) {
        this.$emit('input', newVal);
        this.dispatch('ElFormItem', 'el.form.change', [newVal]);
      }
    }
  },

  methods: {
    handleRemove(item) {
      this.$confirm('确定删除该优惠券吗？', '删除优惠券', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          let index = this.coupons.indexOf(item);
          if (index !== -1) {
            this.coupons.splice(index, 1);
          }
        })
        .catch(() => {
          console.log('取消删除');
        });
    }
  }
};
</script>

<style scoped>
</style>
