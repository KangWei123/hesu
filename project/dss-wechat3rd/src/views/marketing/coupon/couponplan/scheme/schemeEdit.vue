<template>
  <div>
    <el-form :model="planForm"
             ref="planForm"
             :rules="rules"
             class="coupon-plain-form"
             v-loading="loading"
             :disabled="isEdit"
             label-width="162px">
      <el-form-item label="触发事件："
                    prop="eventType">
        <el-radio-group v-model="planForm.eventType">
          <!-- <el-radio :label="1">购买商品并付款（余额支付不触发）</el-radio> -->
          <el-radio :label="6">评论图文</el-radio>
          <el-radio :label="5">购买充值卡</el-radio>
        </el-radio-group>
        <el-button v-if="planForm.eventType === couponEnum.EVENTTYPE.RECHARGE_CARD && !isEdit"
                   @click="handleChooseCharge">选择充值卡</el-button>
        <el-table class="wkt-table"
                  v-if="chargeList && chargeList.length && planForm.eventType === couponEnum.EVENTTYPE.RECHARGE_CARD"
                  :data="chargeList">
          <el-table-column v-for="(column,index) in columns"
                           :key="index"
                           :label="column.label"
                           :prop="column.prop"
                           width="120"
                           align="center">
            <template slot-scope="scope">
              <span v-if="column.type === 'money'">{{scope.row[column.prop] | price}}</span>
              <span v-else>{{scope.row[column.prop]}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="!isEdit"
                           label="操作"
                           width="110">
            <template slot-scope="scope">
              <a href="javascript:;"
                 @click="isDelete(scope.row.id)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item v-if="!isEdit"
                    label="发放的优惠券："
                    prop="couponItem">
        <el-button @click="handleChooseCoupon">选择优惠券</el-button>
      </el-form-item>

      <el-form-item :label="isEdit ? '发放的优惠券：': ''"
                    v-if="planForm.couponItem && planForm.couponItem.length"
                    prop="couponItem"
                    :rules="[{validator: checkNum}]">
        <el-table :data="planForm.couponItem"
                  class="wkt-table">
          <el-table-column label="优惠券名称"
                           width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column label="发放数量"
                           width="180"
                           prop="couponAmount">
            <template slot-scope="scope">
              <el-input placeholder="请输入发放数量"
                        maxlength="10"
                        v-model.number="scope.row.couponAmount"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="状态"
                           width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status===couponEnum.status.INVALID">无效</span>
              <span v-if="scope.row.status===couponEnum.status.VALID">有效</span>
              <span v-if="scope.row.status===couponEnum.status.EXPIRE">过期</span>
              <span v-if="scope.row.status===couponEnum.status.FINISH">发放完毕</span>
            </template>
          </el-table-column>

          <el-table-column label="最低消费金额"
                           width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.minimumFee===couponEnum.MINIMUMFEE.UNLIMITED">无门槛</span>
              <span v-else>￥{{ scope.row.minimumFee | price}}</span>
            </template>
          </el-table-column>

          <el-table-column label="优惠面值"
                           width="150">
            <template slot-scope="scope">
              <span class="orange" v-if="scope.row.couponCategory === couponEnum.couponCategory.discount">{{scope.row.discountFee | discount}}折</span>
              <span class="orange" v-else>￥{{ scope.row.discountFee | price}}</span>
            </template>
          </el-table-column>

          <el-table-column label="使用场景"
                           width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.useScopeType | useScope}}</span>
            </template>
          </el-table-column>

          <el-table-column label="有效时间"
                           width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.couponType===couponEnum.couponType.default">领取后{{ scope.row.fixedTerm}}天过期</span>
              <span v-else>{{ scope.row.beginTime |time}} 至 {{ scope.row.endTime |time}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="remainAmount"
                           width="120"
                           label="剩余数量">
            <template slot-scope="scope">{{scope.row.quantity === couponEnum.QUANTITY.UNLIMITED ? '无限制' : scope.row.remainAmount}}</template>
          </el-table-column>

          <el-table-column label="数量"
                           width="150">
            <template slot-scope="scope">
              <div>总量：{{ scope.row.quantity===couponEnum.QUANTITY.UNLIMITED?'无限制':scope.row.quantity}}
              </div>
              <div>已领：{{ scope.row.issueAmount}}</div>
            </template>
          </el-table-column>

          <el-table-column v-if="!isEdit"
                           label="操作"
                           min-width="120">
            <template slot-scope="scope">
              <a href="javascript:;"
                 class="table-href"
                 @click="handleRemove(scope.row.id)">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="desc-tip"
             style="margin-left: 10px;">如不限制发放次数，请填写0</div>
      </el-form-item>

      <el-form-item label="组合优惠券发放上限："
                    prop="quantity">
        <el-input v-model.number="planForm.quantity"
                  maxlength="10"
                  style="width:150px;"></el-input>
        组
        <div class="desc-tip">如不限制发放上限，请填写0</div>
      </el-form-item>
<!-- 
      <el-form-item>
        <el-button v-if="!isEdit"
                   type="primary"
                   @click="onSubmit('planForm')">保存</el-button>
        <el-button @click="onCancel"
                   class="coupon-cancel">{{isEdit ? '关闭' : '取消'}}</el-button>
      </el-form-item> -->
    </el-form>

    <div class="bottom-button">
      <div>
        <el-button @click="onCancel"
                   class="coupon-cancel">{{isEdit ? '关闭' : '取消'}}</el-button>
        <el-button v-if="!isEdit"
                   type="primary"
                   @click="onSubmit('planForm')">保存</el-button>
      </div>
    </div>
    <coupon-select-dialog v-model="showCouponDialog"
                          type="coupon-v2"
                          :is-show-stores="true"
                          :is-enter-manger="isEnterManger"
                          :selectedCoupons="planForm.couponItem"
                          :checkFunction="couponSelectCheckFunction"
                          @selected="onSingleItemChoosed" /> 

    <charge-select-dialog v-model="showChargeDialog"
                          :selectedCoupons="chargeList"
                          @selected="onChargeItemChoosed" />
  </div>
</template>

<script>
import regex from '@/dss-wechat3rd/src/constants/regex';
import couponApi from '@/dss-wechat3rd/src/api/couponApi';
import moneyUtil from '@/dss-common/utils/money';
import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum.js';
import CouponSelectDialog from '@/dss-wechat3rd/src/bz_components/coupon-select-dialog/index.vue';
import ChargeSelectDialog from '@/dss-wechat3rd/src/bz_components/charge-select-dialog/index.vue';
import dateUtil from '@/dss-common/utils/date';
import { mapState } from 'vuex';

const columns = [
  {
    prop: 'name',
    label: '名称'
  },

  {
    prop: 'salePrice',
    label: '充值卡面值',
    type: 'money'
  },

  {
    prop: 'giftAmount',
    label: '赠送金额',
    type: 'money'
  }
];
export default {
  name: 'planForm',
  components: {
    CouponSelectDialog,
    ChargeSelectDialog
  },
  data() {
    // 价格校验规则
    const checkNum = (rule, value, callback) => {
      value.forEach(v => {
        if (!v.couponAmount) {
          return callback('请输入发放数量');
        } else if (!regex.quantity.reg.test(v.couponAmount)) {
          return callback(regex.quantity.msg);
        }
      });
      return callback();
    };
    return {
      checkNum,
      columns,
      couponEnum,
      showCouponDialog: false,
      showChargeDialog: false,
      isEdit: false,
      // couponItem: null,
      planForm: {
        eventType: 6,
        couponItem: [],
        couponList: [],
        itemCardNos: [],
        quantity: ''
      },
      loading: false,
      totalMemberCount: 0,
      chargeList: [],
      pageParams: {
        pageSize: 10,
        pageNo: 1
      },
      rules: {
        couponItem: [{ required: true, message: '请选择优惠券', trigger: 'blur' }],
        quantity: [
          { required: true, message: '请输入上限数量', trigger: 'blur' },
          {
            pattern: regex.quantity.reg,
            message: regex.quantity.msg,
            trigger: 'blur'
          }
        ]
      }
    };
  },
  filters: {
    time(val) {
      return dateUtil.format(new Date(val), 'YYYY-MM-DD');
    },
    useScope(val) {
      if (val === couponEnum.useScopeType.online.value) {
        return couponEnum.useScopeType.online.label;
      } else if (val === couponEnum.useScopeType.offline.value) {
        return couponEnum.useScopeType.offline.label;
      } else {
        return couponEnum.useScopeType.common.label;
      }
    }
  },
  computed: {
    ...mapState({
      roleList: 'roleList',
      userInfo: 'userInfo'
    }),
    //key管/企业管理员享有相同权限
    isEnterManger() {
      return (
        !!~this.roleList.split(',').indexOf('common_role_enterprise') ||
        !!~this.roleList.split(',').indexOf('common_role_admin')
      );
    }
  },
  mounted() {
    if (this.$route.query.couponPlanId) {
      this.getDeatil();
      this.isEdit = true;
    }
  },
  methods: {
    handleChooseCoupon() {
      this.showCouponDialog = true;
    },
    couponSelectCheckFunction(couponItem) {
      // 领取方式 免费领取的才可以选择
      let bool = couponItem.receiveMethod === couponEnum.receiveMethod.free;
      if (!bool) {
        this.$message.error('只能选择免费领取的优惠券');
      }
      return couponItem.receiveMethod === couponEnum.receiveMethod.free;
    },
    onSingleItemChoosed(couponItem) {
      if (couponItem) {
        this.planForm.couponItem = couponItem;
      }
    },
    handleChooseCharge() {
      this.showChargeDialog = true;
    },
    onChargeItemChoosed(chargeItem) {
      if (chargeItem && this.planForm.eventType === couponEnum.EVENTTYPE.RECHARGE_CARD) {
        this.chargeList = chargeItem;
      }
    },
    /**
     * 钱的单位转换 ,服务端返回的为分， 交互展示的为元
     * @param itemDetailDTO
     * @param isFromServer 是否转换服务端返回的数据，否则转换页面提交服务的数据
     */
    convertMoneyUnit(itemDetailDTO, isFromServer) {
      if (!itemDetailDTO) {
        return;
      }
      //转换函数
      let convert = isFromServer
        ? v => {
            return moneyUtil.convertHundredMoneyUnit(v, true);
          }
        : v => {
            return moneyUtil.convertHundredMoneyUnit(v, false);
          };
      //minimumFee：售价 , discountFee: 优惠金额
      if (!!itemDetailDTO) {
        itemDetailDTO.minimumFee = convert(itemDetailDTO.minimumFee);
        itemDetailDTO.discountFee = convert(itemDetailDTO.discountFee);
      }
    },

    setFormData(data) {
      for (const key in this.planForm) {
        this.planForm[key] = data[key];
      }

      if (data.eventType === couponEnum.EVENTTYPE.RECHARGE_CARD) {
        this.chargeList = data.itemCardDTOS;
      }

      let couponList = [];
      data.couponList.forEach(item => {
        let couponIno = item.couponInfoDTO;

        couponIno.couponAmount = item.couponAmount;
        couponList.push(couponIno);
      });
      this.planForm.couponItem = couponList;
    },

    getDeatil() {
      couponApi
        .detailPlan({
          couponAutoPlanId: this.$route.query.couponPlanId
        })
        .done(res => {
          this.setFormData(res.data || {});
        });
    },

    onCancel() {
      this.$router.push({
        path: '/marketing/coupon/plan'
      });
    },

    toCouponListParam() {
      let couponList = [];
      if (this.planForm.couponItem) {
        this.planForm.couponItem.forEach(item => {
          couponList.push({
            couponInfoId: item.id,
            couponAmount: item.couponAmount
          });
        });

        return couponList;
      }
    },

    onSubmit(refName) {
      if (this.chargeList.length === 0 && this.planForm.eventType === couponEnum.EVENTTYPE.RECHARGE_CARD) {
        this.$message('必须选择一张充值卡');
        return;
      }
      this.$refs[refName]
        .validate()
        .then(valid => {
          if (!valid) {
            return;
          }

          let params = {
            eventType: this.planForm.eventType,
            couponList: this.toCouponListParam(),
            itemCardNos: this.planForm.itemCardNos,
            quantity: this.planForm.quantity
          };

          this.isLoading = true;
          let keyMethod = 'addPlan';
          if (this.$route.query.couponPlanId) {
            keyMethod = 'updatePlan';
            params.couponPlanId = this.$route.query.couponPlanId;
          }
          params.itemCardNos = [];
          if (this.planForm.eventType === couponEnum.EVENTTYPE.RECHARGE_CARD) {
            this.chargeList.forEach(item => {
              if (item.itemNo) {
                params.itemCardNos.push(item.itemNo);
              }
            });
          }

          couponApi[keyMethod](params)
            .done(res => {
              this.$router.push({
                path: '/marketing/coupon/plan'
              });
            })
            .always(() => {
              this.isLoading = false;
            });
        })
        .catch(res => {
          return false;
        });
    },

    isDelete(id) {
      const index = this.chargeList.findIndex(item => item.id === id);
      this.chargeList.splice(index, 1);
    },
    handleRemove(id) {
      const index = this.planForm.couponItem.findIndex(item => item.id === id);
      this.planForm.couponItem.splice(index, 1);
    }
  }
};
</script>

<style lang="less">
.bottom-button {
  button {
    margin-right: 0px !important;
  }
}
.coupon-plain-form {
  padding: 20px;

  .el-input__inner {
    width: 100% !important;
  }

  .coupon-setting {
    display: flex;
    flex-direction: column;

    .el-radio {
      margin-top: 8px;
    }
  }
}
/*.wkt-table {*/
/*padding-bottom: 20px;*/
/*}*/
</style>
