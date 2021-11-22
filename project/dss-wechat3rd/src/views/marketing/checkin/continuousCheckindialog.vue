<template>
  <div class="checkin-ccd">
    <el-dialog title="添加连签奖励" width="350px" :visible="true" :before-close="onCancel">
      <el-form
        class="checkin-ccd-form"
        @submit.native.prevent
        :model="form"
        ref="form"
        :rules="rules"
        size="mini"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="连续签到:" prop="continueSignedDay">
          <el-input
            class="shot-input"
            v-model="form.continueSignedDay"
            :disabled="!ableUpdateContinueSignedDay"
          ></el-input><span style="margin-left: -47px;">天</span> 
        </el-form-item>

        <el-form-item label="奖励类型:" prop="giftsType">
          <el-radio-group v-model="form.giftsType">
            <el-radio :label="1">优惠券</el-radio>
            <el-radio :label="0">积分</el-radio>
          </el-radio-group>

          <div class="content" v-show="form.giftsType===1">
            <p style="display: block; text-align: left;" v-show="form.couponName">{{`已选优惠券: ${form.couponName} `}}</p>
            <el-button @click="showCouponDialog=true;" class="coupon-button">选择优惠券</el-button>
          </div>

          <div class="content" v-show="form.giftsType === 0">
            <el-input v-model="form.points" class="shot-input"></el-input><span style="margin-left: -47px;">分</span> 
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')">确定</el-button>
      </span>
    </el-dialog>
    <coupon-select-dialog
      v-model="showCouponDialog"
      :limit="5"
      :checkFunction="checkCoupon"
      :enable-multiple="false"
      :ext-params="{status:'1'}"
      @single-choosed="onCouponsSelected"
    />
  </div>
</template>

<script>
import CouponSelectDialog from '@/dss-wechat3rd/src/bz_components/coupon-select-dialog/index.vue';
import regexps from '@/dss-common/utils/regexps.js';
import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';
import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum';
const { positiveInt } = regexps;
export default {
  name: 'continuousCheckindialog',
  mixins: [AdapterIfr.AdapterMixins],
  components: { CouponSelectDialog },
  props: {
    signedCycle: { type: Number, required: true },
    lianqianForm: {
      type: Object,
      required: false,
      default: null
    },
    giftLists: {
      type: Array,
      required: false,
      default: function() {
        return [];
      }
    },
    editIndex: {
      type: Number
    }
  },
  mounted() {
    if (!!this.lianqianForm && !!this.lianqianForm.continueSignedDay) {
      this.form = this.pure(this.lianqianForm);
    }
    let ableUpdateContinueSignedDay = 0;
    let maxSingedDayIndex = -100;
    this.giftLists.forEach((item, index) => {
      ableUpdateContinueSignedDay = Math.max(ableUpdateContinueSignedDay, item.continueSignedDay);
      if (ableUpdateContinueSignedDay === item.continueSignedDay) {
        console.log('mounted ableUpdateContinueSignedDay==', ableUpdateContinueSignedDay, 'index==', index);
        maxSingedDayIndex = index;
      }
    });
    this.maxSingedDayIndex = maxSingedDayIndex;
    this.maxThenContinueSignedDay = ableUpdateContinueSignedDay;
    this.adapterIfmMask(true);
    //console.log('mounted', this.maxThenContinueSignedDay,this.editIndex === -1);
  },
  data() {
    return {
      maxSingedDayIndex: -100,
      //能否修改连续签到的天数
      ableUpdateContinueSignedDay: this.editIndex === -1,
      //连续签到不能小于的天数
      maxThenContinueSignedDay: 0,

      //是否限制优惠券弹窗
      showCouponDialog: false,

      form: {
        //优惠券id
        couponId: 0,
        //优惠券名
        couponName: '',
        //连续签到
        continueSignedDay: '',
        //  奖励类型
        giftsType: 1,
        //积分
        points: ''
      },
      rules: {
        continueSignedDay: [
          {
            required: true,
            message: '请输入连签天数',
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              if (!positiveInt.reg.test(value)) {
                return callback(new Error(positiveInt.msg));
              }
              let day = parseInt(value);
              let isRepeat = false;
              let isOverMaxSingDay = false;
              let maxSingedDay = this.signedCycle === 0 ? 7 : 31;
              let minSingedDay = this.maxThenContinueSignedDay + 1;
              //1: 签到天数去重复 - 编辑过来的，如果是编辑项的天数相同，不算重复
              //2: 签到天数不能大于最大周期
              if (this.giftLists.length > 0) {
                this.giftLists.forEach((item, index) => {
                  if (item.continueSignedDay === day) {
                    if (this.editIndex === -1) {
                      isRepeat = true;
                    } else if (this.editIndex !== index) {
                      isRepeat = true;
                    }
                  }
                  if (day > maxSingedDay) {
                    isOverMaxSingDay = true;
                  }
                });
              } else if (value > maxSingedDay) {
                isOverMaxSingDay = true;
              }

              if (isOverMaxSingDay) {
                callback(new Error(`连签天数需小于或等于${maxSingedDay}天`));
              } else if (isRepeat) {
                callback(new Error('已有该连签天数'));
              } else if (day < minSingedDay && this.ableUpdateContinueSignedDay) {
                callback(new Error(`新增奖励需长于当前最长连签天数,当前最长为${this.maxThenContinueSignedDay}天`));
              } else {
                callback();
              }
            }
          }
        ],
        giftsType: [
          {
            validator: (rule, value, callback) => {
              //积分
              if (this.form.giftsType === 0) {
                let value = this.form.points;
                if (!positiveInt.reg.test(value)) {
                  return callback(new Error(positiveInt.msg));
                }
                if (parseInt(value) < 1) {
                  return callback(new Error('积分必须大于0'));
                }
              } else {
                if (this.form.couponId === 0) {
                  return callback(new Error('请选择优惠券'));
                }
              }
              callback();
            },
            trigger: 'change'
          }
        ]
      }
    };
  },
  methods: {
    pure(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    onSubmit(e) {
      this.$refs[e].validate(valid => {
        if (valid) {
          if (this.editIndex !== -1) {
            this.$set(this.giftLists, this.editIndex, this.pure(this.form));
          } else {
            this.giftLists.push(this.pure(this.form));
          }
          this.onCancel();
        } else {
          return false;
        }
      });
    },
    onCancel() {
      this.adapterIfmMask(false);
      this.$emit('close');
    },
    onCouponsSelected(e) {
      this.form.couponId = e.id;
      this.form.couponName = e.name;
      this.$refs.form.validate();
    },
    checkCoupon(couponItem) {
      let flag = couponItem.fixedTerm !== null;
      if (!flag) {
        this.$message.error('该活动不可选择有效期为时间段的优惠券！');
      } else if (couponItem.receiveMethod === couponEnum.receiveMethod.custom) {
        flag = false;
        this.$message.error('该活动只支持免费领取的优惠券！');
      }
      return flag;
    }
  }
};
</script>

<style lang="less" scoped>
.checkin-ccd {
  .content {
    padding-top: 5px;
    .coupon-button {
      margin-left: -60px;
    }
  }
  .shot-input {
    width: 130px;
  }
  .checkin-ccd-form {
    /deep/ .el-input--mini .el-input__inner {
      width: 100px;
      margin-left: -85px;
    }
    /deep/ .el-form-item--mini .el-form-item__content {
      width: 150px;
    }
    /deep/ .el-dialog__body {
      margin-bottom: 20px;
    }
  }

}
</style>
