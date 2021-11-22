<template>
  <div class="card-pack-add">
    <el-table class="mb5" :data="coupons">
      <el-table-column prop="name" label="优惠券名称"> </el-table-column>
      <el-table-column label="卡包内优惠券数量" prop="quantitys" width="180">
        <template slot-scope="scope">
          <el-input
            maxlength="3"
            oninput="if(value<0)value=0"
            style="width: 150px"
            placeholder="请输入优惠券数量"
            :disabled="disabled"
            @blur="reCouponVerify"
            v-model.number="scope.row.quantitys"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status === couponEnum.status.INVALID">无效</span>
          <span v-if="scope.row.status === couponEnum.status.VALID">有效</span>
          <span v-if="scope.row.status === couponEnum.status.EXPIRE">过期</span>
          <span v-if="scope.row.status === couponEnum.status.FINISH">发放完毕</span>
        </template>
      </el-table-column>
      <el-table-column prop="minimumFee" label="最低消费金额">
        <template slot-scope="scope">
          {{ scope.row.minimumFee | price }}
        </template>
      </el-table-column>
      <el-table-column prop="discountFee" label="优惠券面值">
        <template slot-scope="scope">
          <span v-if="scope.row.couponCategory === couponEnum.couponCategory.discount"
            >{{ scope.row.discountFee | discount }}折</span
          >
          <span v-else>{{ scope.row.discountFee | price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券类型" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.couponCategory | couponCategory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效时间">
        <template slot-scope="scope">
          <span v-if="scope.row.couponType === couponEnum.couponType.default"
            >领取后{{ scope.row.fixedTerm }}天过期</span
          >
          <span v-else>{{ scope.row.beginTime | time }} 至 {{ scope.row.endTime | time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用人群">
        <template slot-scope="scope">
          {{ scope.row | level }}
        </template>
      </el-table-column>
      <el-table-column label="使用场景">
        <template slot-scope="scope">
          <span>{{ scope.row.useScopeType | useScope }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="可用商品">
        <template slot-scope="scope">
          {{ scope.row | suitGoods }}
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="!disabled">
        <template slot-scope="scope">
          <a class="dss-link" href="javascript:;" @click="handleRemove(scope.row)">删除</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import emitter from 'element-ui/lib/mixins/emitter.js';
  import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum.js';
  import dateUtil from '@/dss-common/utils/date';

  export default {
    props: {
      coupons: {
        type: Array,
        default() {
          return [];
        },
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        couponEnum,
      };
    },

    mixins: [emitter],

    watch: {
      coupons: {
        deep: true,
        handler(newVal) {
          this.$emit('input', newVal);
          this.dispatch('ElFormItem', 'el.form.change', [newVal]);
        },
      },
    },

    filters: {
      time(val) {
        return dateUtil.format(new Date(val), 'YYYY-MM-DD HH:mm');
      },
      couponCategory(val) {
        let msg = '';
        switch (val) {
          case couponEnum.couponCategory.default:
            msg = '满减券';
            break;
          case couponEnum.couponCategory.freight:
            msg = '运费券';
            break;
          case couponEnum.couponCategory.discount:
            msg = '折扣券';
            break;
        }
        return msg;
      },
      useScope(val) {
        if (val === couponEnum.useScopeType.online.value) {
          return couponEnum.useScopeType.online.label;
        } else if (val === couponEnum.useScopeType.offline.value) {
          return couponEnum.useScopeType.offline.label;
        } else {
          return couponEnum.useScopeType.common.label;
        }
      },
      level(row) {
        if (row.memberRestrictType === 2) {
          return '全部';
        }

        if (row.memberRestrictType === 0) {
          return '新人(首次下单)';
        }

        if (row.memberLevelDTOS) {
          return row.memberLevelDTOS.map(item => item.levelName).join(' ');
        }
      },
      suitGoods(row) {
        if (row.suitItemType === 0) {
          return '全部商品';
        } else if (row.suitItemType === 1) {
          return (row.itemBriefs || [])
            .map(v => {
              return v.name;
            })
            .join(' ');
        } else {
          return (row.categoryBriefs || [])
            .map(v => {
              return v.name;
            })
            .join(' ');
        }
      },
    },
    methods: {
      handleRemove(item) {
        this.$confirm('确定删除该优惠券吗？', '删除优惠券', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            const index = this.coupons.indexOf(item);
            if (index !== -1) {
              this.coupons.splice(index, 1);
            }
          })
          .catch(() => {
            console.log('取消删除');
          });
      },
      reCouponVerify() {
        this.$emit('reCouponVerify');
      },
    },
  };
</script>

<style lang="less">
  .card-pack-add {
    .mb5 {
      margin-bottom: 5px;
    }

    .el-table__body-wrapper {
      max-height: 342px;
      overflow-y: auto;
    }
  }
</style>
