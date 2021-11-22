<template>
  <div class="lucky-add-gift">
    <el-dialog title="添加奖品" width="568px" :visible="true" :before-close="onCancel">
      <el-form
        :model="form1"
        ref="form1"
        :rules="rules1"
        class="lucky-add-form"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="奖品名称:" prop="giftName">
          <el-input v-model.trim="form1.giftName" class="shot-input"></el-input>
        </el-form-item>

        <el-form-item label="奖品:" prop="giftType">
          <el-radio-group v-model="form1.giftType">
            <el-radio label="1" @change="form1.giftType = '1'">优惠券</el-radio>
            <el-radio label="0" @change="form1.giftType = '0'">积分</el-radio>
          </el-radio-group>

          <div v-show="form1.giftType === '1'">
            <p style="display: inline" v-show="form1.couponName">{{ `已选优惠券: ${form1.couponName} ` }}</p>

            <el-button
              @click="
                showCouponDialog = true;
                showPoint = false;
              "
              >选择优惠券</el-button
            >
          </div>

          <div v-show="form1.giftType === '0'">
            <el-input v-model="form1.giftPoints" class="shot-input"></el-input>
          </div>
        </el-form-item>

        <el-form-item label="奖品图:" prop="giftPhotoUrl">
          <add-image @success="onAddImageDone">
            <template v-if="form1.giftPhotoUrl">
              <div
                class="avatar"
                :style="{
                  background: 'transparent url(' + form1.giftPhotoUrl + ') no-repeat center center / cover',
                  maxWidth: '176px',
                  maxHeight: '176px'
                }"
              ></div>
              <span class="upload-desc">点击重选</span>
            </template>
            <div class="avatar-empty" v-else>
              <i class="el-icon-plus" :style="{ 'line-height': '176px' }"></i>
            </div>
          </add-image>
          <p style="display: inline;font-size:12px;color:#A1A4AB;">建议尺寸96X96像素，支持JPG、PNG、JPEG格式</p>
        </el-form-item>

        <el-form-item label="发放数量:" prop="amountGifts">
          <el-input class="shot-input" v-model="form1.amountGifts"></el-input>份
        </el-form-item>
        <el-form-item label="中奖率:" prop="winningRate" class="winningRate-item">
          <el-input-number
            style="width: 175px;"
            v-model="form1.winningRate"
            placeholder="请输入0~100"
            controls-position="right"
            :min="0"
            :max="100"
          />
          %
        </el-form-item>

        <el-form-item label="转盘位置" prop="giftIndex" placeholder="请选择">
          <el-select v-model="form1.giftIndex" style="width: 175px;">
            <el-option v-for="item in position" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <p style="color:#A1A4AB;">选择排序后，本奖品将显示在转盘如下位置</p>
          <img src="./image/giftindex.png" alt style="width: 200px;height: 200px;" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form1')">确定</el-button>
      </span>
    </el-dialog>

    <coupon-select-dialog
      v-model="showCouponDialog"
      :limit="5"
      :checkFunction="checkCoupon"
      :enable-multiple="false"
      type="lucky"
      @single-choosed="onCouponsSelected"
    />
  </div>
</template>

<script>
import AddImage from '@/dss-wechat3rd/src/components/materials/addImage.vue';
import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';
import CouponSelectDialog from '@/dss-wechat3rd/src/bz_components/coupon-select-dialog/index.vue';
import regexps from '@/dss-common/utils/regexps.js';
import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum';
import { webMarketingCdnPrefix } from '@/dss-wechat3rd/src/constants/marketingEnum';

import './add-gift.less';

const giftImageDefault = [
  webMarketingCdnPrefix + 'gift-integral-default.png',
  webMarketingCdnPrefix + 'gift-coupon-default.png'
];

export default {
  mixins: [AdapterIfr.AdapterMixins],
  components: { AddImage, CouponSelectDialog },
  props: {
    form: {
      type: Object,
      default: null
    },
    position: {
      type: Array,
      default: function() {
        return [];
      },
      required: true
    },
    giftsListEditIndex: {
      type: Number
    },
    time: {
      type: Array
    }
  },

  computed: {
    editIndex: function() {
      return this.giftsListEditIndex;
    }
  },
  data() {
    const { positiveInt } = regexps;

    const giftTypeValidator = (rule, value, callback) => {
      switch (value) {
        case '1':
          if (!this.form1.couponId) {
            callback(new Error('请选择优惠券'));
          } else {
            callback();
          }
          break;
        case '0':
          if (!this.form1.giftPoints) {
            callback(new Error('请输入积分'));
          } else if (!positiveInt.reg.test(this.form1.giftPoints)) {
            callback(new Error(positiveInt.msg));
          } else {
            callback();
          }
          break;
      }
    };

    const amountGiftsValidator = (rule, value, callback) => {
      let message;
      let { giftType, couponId, couponRemainAmount, amountGifts } = this.form1;
      //优惠券
      if (giftType == 1) {
        if (!!Number(amountGifts) && !!couponId) {
          if (Number(couponRemainAmount) < Number(amountGifts)) {
            message = '当前可用优惠券为' + couponRemainAmount + ',发放数量超过可用数量';
          }
        }
      }
      if (!positiveInt.reg.test(value)) {
        callback(new Error(positiveInt.msg));
      } else if (!!message) {
        callback(new Error(message));
      } else {
        callback();
      }
    };
    return {
      //是否是编辑模式   还需要把对应的giftlist数组的index传入进来 目前还未找到方法
      isEdit: false,
      // editIndex: -1,
      // 转盘位置
      couponlist: [],
      //显示优惠券按钮
      showCouponbtn: true,
      //显示选择优惠券对话框
      showCouponDialog: false,
      showPoint: false,

      form1: {
        // 奖品名称
        giftName: '',
        // 奖品种类
        giftType: '1',
        // 中奖率
        winningRate: '',
        // 序号
        giftIndex: '',
        // 礼物url
        giftPhotoUrl: giftImageDefault[1],
        //  积分
        giftPoints: '',
        //优惠券id
        couponId: 0,
        //礼券名
        couponName: '',
        //优惠券存量数量
        couponRemainAmount: 0,
        //  发放数量
        amountGifts: '',
        //  剩余数量
        remainGifts: 0
      },
      // 添加礼物弹窗校验规则
      rules1: {
        // 奖品名称
        giftName: [
          { required: true, message: '请输入奖品名称', trigger: 'blur' },
          { min: 1, max: 5, message: '奖品名称太长，最多5个字符', trigger: 'change' }
        ],
        // 奖品
        giftType: [{ required: true, validator: giftTypeValidator, trigger: 'change' }],
        // 发放数量
        amountGifts: [
          { required: true, message: '请输入发放数量', trigger: 'blur' },
          {
            validator: amountGiftsValidator,
            trigger: ['change', 'blur']
          }
        ],
        // 中奖率

        winningRate: [
          { required: true, message: '请输入该奖品中奖率，所有奖品中奖率加起来不能超过100%', trigger: 'blur' }
          // {
          //   validator: (rule, value, callback) => {
          //     debugger;
          //     if (!positiveInt.reg.test(value)) {
          //       debugger;
          //       callback(new Error(positiveInt.msg));
          //     } else if (parseInt(value) > 100) {
          //       debugger;
          //       callback(new Error('请输入1到100的整数'));
          //     } else {
          //       callback();
          //     }
          //   },
          //   trigger: 'change'
          // }
        ],
        //转盘位置
        giftIndex: [{ required: true, message: '请选择转盘位置', trigger: 'change', type: 'number' }],
        //  奖品图
        giftPhotoUrl: [{ required: true, message: '请添加奖品图片', trigger: 'change' }]
      }
    };
  },

  mounted() {
    if (!!this.form) {
      this.isEdit = true;
    }
    const newObj = JSON.parse(JSON.stringify(this.form || {}));
    for (let key in this.form1) {
      if (!!newObj[key]) {
        this.form1[key] = newObj[key];
      }
    }
    // 处理 JSON 过滤掉的 Infinite
    for (const key in this.form) {
      if (this.form[key] === Infinity) {
        this.form1[key] = Infinity;
      }
    }
    this.adapterIfmMask(true);
  },
  watch: {
    'form1.giftType'(val, oldVal) {
      if (this.form1.giftPhotoUrl !== giftImageDefault[+oldVal]) return;
      this.form1.giftPhotoUrl = giftImageDefault[+val];
    }
  },

  methods: {
    onCouponsSelected(coupon) {
      this.form1.couponId = coupon.id;
      this.form1.couponName = coupon.name;
      this.form1.couponRemainAmount =
        coupon.quantity === couponEnum.QUANTITY.UNLIMITED ? Infinity : coupon.remainAmount;
      console.log(coupon);
      //console.log('onCouponsSelected(coupon)',coupon)
    },

    onAddImageDone(url) {
      this.form1.giftPhotoUrl = url;
    },
    onCancel() {
      this.adapterIfmMask(false);
      this.$emit('cancel');
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //让剩余数量等于发放数量
          this.form1.remainGifts = this.form1.amountGifts;
          console.log('editindex', this.editIndex);
          if (this.editIndex !== -1) {
            this.adapterIfmMask(false);
            this.$emit('onEditGiftOk', this.form1);
          } else {
            this.adapterIfmMask(false);
            this.$emit('onAddGiftOk', this.form1);
          }
        } else {
          console.log('addgift 校验失败');
          return false;
        }
      });
    },
    checkCoupon(couponItem) {
      let flag = true;

      if (!this.time || !this.time[1]) {
        flag = false;
        this.$message.error('请先填写活动时间');
      } else if (couponItem.fixedTerm == null && couponItem.endTime < new Date(this.time[1]).getTime()) {
        flag = false;
        this.$message.error('该活动结束时间必须小于等于优惠券的结束时间！');
      } else if (couponItem.receiveMethod === couponEnum.receiveMethod.custom) {
        flag = false;
        this.$message.error('该活动只支持免费领取的优惠券！');
      }
      return flag;
    },
    handleNolucky() {}
  }
};
</script>

<style type="less" scoped>
.wrap {
  width: 300px;
  height: 300px;
  padding: 3% 0 0 3%;
  color: black;
  /*text-align: center;*/
}

.square {
  float: left;
  background: #f2f2f2;
  width: 30%;
  height: 30%;
  padding: 30% 0 0 0;
  margin: 0 3% 3% 0;
  /*border-radius: 4%;*/
}

.hidden-item {
  visibility: hidden;
}

.selectedindex {
  border: 2px solid red;
}
</style>
