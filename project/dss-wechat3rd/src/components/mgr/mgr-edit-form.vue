<template>
  <div class="mgr-edit-form"
       v-loading="loading">
    <div class="mgr-slot">
      <span class="slot-title">{{mgrType.label}}类别：</span>
      <el-radio-group v-model="mgrType.value === mgrTypeEnum.hotel.value ? form.hotelType : form.ticketType"
                      :disabled="!!this.itemNo">
        <el-radio :label="mgrTypeEnum[mgrType.type].oddDay.value">{{mgrType.oddDay.label}}</el-radio>
        <el-radio :label="mgrTypeEnum[mgrType.type].combo.value"
                  :disabled="mgrType.value === mgrTypeEnum.hotel.value">{{mgrType.combo.label}}</el-radio>
      </el-radio-group>
    </div>
    <el-form class="edit-form"
             v-if="!!showForm"
             :model="form"
             ref="form"
             :rules="rules"
             label-width="100px"
             :disabled='$route.query.status==0'>
      <el-form-item :label="`${mgrType.label}名称：`"
                    prop="name">
        <el-input v-model="form.name"
                  class="form-input-w366"
                  :placeholder="`请输入${mgrType.label}名称`"></el-input>
      </el-form-item>
      <el-form-item label="房间数量："
                    prop="hotelAmount"
                    v-if="mgrType.value === mgrTypeEnum.hotel.value">
        <el-input v-model="form.hotelAmount"
                  :disabled="!!this.itemNo"
                  class="form-input-w366"></el-input>
      </el-form-item>
      <el-form-item label="优惠价："
                    prop="salePrice"
                    :rules="rules.salePrice">
        <el-input v-model="form.salePrice"
                  :disabled="isDisabledEdit"
                  class="form-input-w188"></el-input>
        <span class="form-unit">元</span>
      </el-form-item>
      <el-form-item label="原价："
                    :rules="rules.labelPrice"
                    prop="labelPrice">
        <el-input v-model="form.labelPrice"
                  :disabled="isDisabledEdit"
                  class="form-input-w188"></el-input>
        <span class="form-unit">元</span>
      </el-form-item>
      <el-form-item v-if="form.ticketType !== mgrTypeEnum.ticket.combo.value"
                    label="预订方式："
                    :prop="`${mgrType.type}ReservationTimeType`">
        <el-radio-group v-model="reservationType">
          <template v-if="mgrType.value === mgrTypeEnum.hotel.value">
            <el-radio :label="mgrTypeEnum.reservationTimeType.number">可预订N天内的客房</el-radio>
            <el-radio :label="mgrTypeEnum.reservationTimeType.range">指定可预订时间段</el-radio>
          </template>
          <template v-else>
            <el-radio :label="mgrTypeEnum.reservationTimeType.number">当日有效</el-radio>
            <el-radio :label="mgrTypeEnum.reservationTimeType.range">指定预订日期（可预订60天内的票）</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预订天数："
                    :rules="rules.hotelReservationDaysAfter"
                    v-if="form.hotelReservationTimeType === mgrTypeEnum.reservationTimeType.number &&
                     mgrType.value === mgrTypeEnum.hotel.value">
        <el-form-item prop="hotelReservationDaysAfter">
          <el-input placeholder="请输入可预订天数"
                    class="form-input-w366"
                    v-model="form.hotelReservationDaysAfter"></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="预订天数："
                    :rules="rules.ticketReservationDays"
                    v-else-if="form.ticketReservationType === mgrTypeEnum.reservationTimeType.range &&
                    mgrType.value === mgrTypeEnum.ticket.value &&
                    form.ticketType === mgrTypeEnum.ticket.oddDay.value">
        <el-form-item prop="ticketReservationDays">
          <el-input placeholder="请输入可预订天数"
                    class="form-input-w366"
                    v-model="form.ticketReservationDays"></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="预订范围："
                    :rules="rules.hotelReservationStatTime"
                    v-else-if="mgrType.value === mgrTypeEnum.hotel.value">
        <el-form-item prop="hotelReservationStatTime">
          <el-date-picker v-model="form.hotelReservationStatTime"
                          :picker-options="pickerStartTime"
                          type="date"
                          format="yyyy-MM-dd"
                          placeholder="开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="hotelReservationEndTime">
          <el-date-picker v-model="form.hotelReservationEndTime"
                          :picker-options="pickerEndTime"
                          type="date"
                          format="yyyy-MM-dd"
                          placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item label="床型尺寸："
                    prop="hotelBedSize"
                    v-if="mgrType.value === mgrTypeEnum.hotel.value">
        <el-input v-model="form.hotelBedSize"
                  class="form-input-w366"
                  placeholder="请填写尺寸，例如1.8*2.0"></el-input>
      </el-form-item>
      <el-form-item label="房间设施："
                    prop="hotelFacility"
                    v-if="mgrType.value === mgrTypeEnum.hotel.value">
        <el-input v-model="form.hotelFacility"
                  class="form-input-w366"
                  placeholder="请填写房间设施"></el-input>
      </el-form-item>

      <el-form-item label="过闸方式："
                    prop="faceEnter"
                    v-if="mgrType.value === mgrTypeEnum.ticket.value">
        <div class="item">
          <el-checkbox v-model="form.faceEnter">人脸过闸</el-checkbox>
          <el-checkbox v-model="form.vccodeEnter">扫码过闸</el-checkbox>
          <div class="form-tips">至少选择一项，人脸过闸需要打通闸机摄像头，请联系您的销售经理</div>
        </div>
      </el-form-item>

      <el-form-item label="特色标签："
                    prop="ticketSpecialLabels"
                    v-if="mgrType.value === mgrTypeEnum.ticket.value">
        <el-input v-model="form.ticketSpecialLabels"
                  class="form-input-w366"
                  placeholder="请填写标签"></el-input>
        <div class="form-tips">请使用英文的逗号做分割，如：刺激,亲子,水上乐园</div>
      </el-form-item>
      <el-form-item prop="ticketValidityPeriod"
                    label="有效期："
                    :rules="rules.ticketValidityPeriod"
                    v-if="form.ticketType === mgrTypeEnum.ticket.combo.value">
        <el-input v-model="form.ticketValidityPeriod"
                  class="form-input-w188"></el-input>
        <span class="form-unit">天</span>
        <div class="form-tips">从购买当日开始生效</div>
      </el-form-item>
      <el-form-item prop="images"
                    :label="`${mgrType.label}图片：`"
                    :style="$route.query.status==0 ? 'pointer-events: none;' : ''">
        <choose-images v-model="form.images[index]"
                       :is-disabled-edit="isDisabledEdit"
                       :height="176"
                       style="margin-right: 10px;"
                       @input="onImageAdd(index)"
                       @delete="onDeleteImg(index)"
                       v-for="(item, index) in form.images"
                       :key="index"
                       :limit='limit'
                       :multiple='!form.images[index].imgUrl'
                       :disable='index<5'></choose-images>
        <div class="form-tips">上传图片的最佳尺寸：640像素*640像素，其他尺寸会影响页效果，格式png，jpeg，jpg，gif。大小不超过2M，{{mgrType.label}}图片一共可以上传5张，默认第一张为主图封面
        </div>
      </el-form-item>
      <el-form-item prop="describe"
                    :label="`${mgrType.label}描述：`">
        <w-editor style="margin-bottom: -3px"
                  :key="editorKey"
                  :dataSource="form"></w-editor>
      </el-form-item>
      <el-form-item prop="ticketPurchaseNotice"
                    label="购票须知："
                    :rules="rules.ticketPurchaseNotice"
                    v-if="mgrType.value === mgrTypeEnum.ticket.value">
        <w-editor style="margin-bottom: -3px"
                  :key="editorKey"
                  paramName="ticketPurchaseNotice"
                  :dataSource="form"></w-editor>
      </el-form-item>
      <div class="bottom-button">
        <el-button type="primary"
                   @click="onSubmit('form')">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import mgrTypeEnum from '@/dss-wechat3rd/src/constants/mgrTypeEnum.js';
import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import WEditor from '@/dss-wechat3rd/src/components/wEditor/index.vue';
import regexps from '@/dss-common/utils/regexps.js';
import urlList from '@/dss-wechat3rd/src/constants/index';
import services from '@/dss-common/utils/services';
import moneyUtil from '@/dss-common/utils/money';

export default {
  props: {
    //商品id
    itemNo: {
      type: String
    },
    //商品管理的常量
    mgrType: {
      type: Object
    },
    //完成返回的路径
    backUrl: {
      type: String
    },
    // 是否不允许编辑敏感信息
    isDisabledEdit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ChooseImages,
    WEditor
  },
  data() {
    //1-60整数验证
    const littleIntNumValidator = (rule, value, callback) => {
      if (!this.sixtydays.reg.test(value)) {
        callback('数值范围在1~999的整数');
      } else {
        callback();
      }
    };
    //价格验证
    const priceValidator = (rule, value, callback) => {
      if (!value) {
        callback();
      } else if (!regexps.money.reg.test(value)) {
        callback(regexps.money.msg);
      } else {
        callback();
      }
    };
    //正整数验证
    const positiveIntegerValidator = (rule, value, callback) => {
      if (!regexps.positiveInteger.reg.test(value)) {
        callback(regexps.positiveInteger.msg);
      } else {
        callback();
      }
    };
    //自然数验证
    const naturalNumberValidator = (rule, value, callback) => {
      if (!regexps.naturalNumber.reg.test(value)) {
        callback(regexps.naturalNumber.msg);
      } else {
        callback();
      }
    };
    const imageValidator = (rule, value, callback) => {
      if (!value[0].imgUrl) {
        callback('请选择至少一张图片');
      } else {
        callback();
      }
    };
    const editorValidator = (rule, value, callback) => {
      // 处理富文本格式
      let edit = value;
      edit = edit.replace(/<[^<>]+>/g, '');
      edit = edit.replace(/&nbsp;/gi, '');

      let reg = /^[ ]+$/;
      if (reg.test(edit)) {
        callback('不可仅输入空格');
      } else {
        callback();
      }
    };
    return {
      sixtydays: {
        reg: /^[1-9][0-9]{0,2}$/
      },
      mgrTypeEnum,
      loading: false,
      showForm: true,
      editorKey: 0,
      limit: 5,
      //门店ID
      storeId: null,
      form: {
        type: '',
        hotelType: this.mgrType.value === mgrTypeEnum.hotel.value ? mgrTypeEnum.hotel.oddDay.value : '',
        ticketType: this.mgrType.value === mgrTypeEnum.ticket.value ? mgrTypeEnum.ticket.oddDay.value : '',
        name: '',
        faceEnter: true,
        vccodeEnter: false,
        salePrice: '',
        labelPrice: '',
        //图片对象数组
        images: [{}],
        materialUrls: [],
        describe: '',
        hotelBedSize: '',
        hotelAmount: '',
        hotelFacility: '',
        hotelReservationTimeType:
          this.mgrType.value === mgrTypeEnum.hotel.value ? mgrTypeEnum.reservationTimeType.number : '',
        hotelReservationDaysAfter: '',
        hotelReservationStatTime: '',
        hotelReservationEndTime: '',
        ticketSpecialLabels: '',
        ticketReservationType:
          this.mgrType.value === mgrTypeEnum.ticket.value ? mgrTypeEnum.reservationTimeType.number : '',
        ticketReservationDays: '',
        ticketPurchaseNotice: '',
        ticketValidityPeriod: ''
      },
      pickerStartTime: {
        disabledDate: time => {
          let beginDate = this.form.hotelReservationEndTime;
          let yesterDay = new Date();
          yesterDay.setTime(yesterDay.getTime() - 3600 * 1000 * 24);
          if (beginDate) {
            return time.getTime() > beginDate || time.getTime() < yesterDay;
          } else {
            return time.getTime() < yesterDay;
          }
        }
      },
      pickerEndTime: {
        disabledDate: time => {
          let endDate = this.form.hotelReservationStatTime;
          let yesterDay = new Date();
          yesterDay.setTime(yesterDay.getTime() - 3600 * 1000 * 24);
          if (endDate) {
            return time.getTime() < endDate || time.getTime() < yesterDay;
          } else {
            return time.getTime() < yesterDay;
          }
        }
      },
      rules: {
        name: [
          { required: true, message: `请输入${this.mgrType.label}名称`, trigger: 'blur' },
          { min: 2, max: 80, message: '长度在 2 到 80 个字符', trigger: 'blur' }
        ],
        salePrice: [
          { required: true, message: '请输入优惠价', trigger: 'blur' },
          { validator: priceValidator, trigger: 'blur' }
        ],
        labelPrice: [{ validator: priceValidator, trigger: 'blur' }],
        hotelAmount: [
          { required: true, message: '请输入房型数量', trigger: 'blur' },
          { validator: littleIntNumValidator, trigger: 'blur' }
        ],
        hotelReservationDaysAfter: [
          { required: true, message: '请输入天数', trigger: 'blur' },
          { validator: littleIntNumValidator, trigger: 'blur' }
        ],
        faceEnter: [{ required: true, message: '过闸方式不能为空', trigger: 'blur' }],
        hotelReservationStatTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        hotelReservationEndTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
        images: [{ required: true, validator: imageValidator, trigger: 'change' }],
        ticketReservationDays: [
          { required: true, message: '请输入天数', trigger: 'blur' },
          { validator: littleIntNumValidator, trigger: 'blur' }
        ],
        hotelBedSize: [{ max: 20, message: '长度在20个字符内', trigger: 'blur' }],
        hotelFacility: [{ max: 30, message: '长度在30个字符内', trigger: 'blur' }],
        ticketSpecialLabels: [{ max: 30, message: '长度在30个字符内', trigger: 'blur' }],
        ticketPurchaseNotice: [
          { required: true, message: '请填写购票须知', trigger: 'blur' },
          { validator: editorValidator, trigger: 'blur' }
        ],
        ticketValidityPeriod: [
          { required: true, message: '请输入有效期', trigger: 'blur' },
          { validator: littleIntNumValidator, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    //预约的类型
    reservationType: {
      get() {
        return this.mgrType.value === mgrTypeEnum.hotel.value
          ? this.form.hotelReservationTimeType
          : this.form.ticketReservationType;
      },
      set(newVal) {
        if (this.mgrType.value === mgrTypeEnum.hotel.value) {
          this.form.hotelReservationTimeType = newVal;
        } else {
          this.form.ticketReservationType = newVal;
        }
      }
    }
  },
  mounted() {
    //设置管理的类型
    this.form.type = this.mgrType.value;
    //是修改，则获取商品详情
    if (!!this.itemNo) {
      this.getRoomsDetail();
    }
  },
  methods: {
    getRoomsDetail() {
      let url = urlList.Api.goods.detail;
      let params = { itemNo: this.itemNo, status: this.$route.query.status };
      this.loading = true;
      services
        .post(url, params, {
          action: `获取${this.mgrType.label}详情`
        })
        .done(res => {
          this.form = Object.assign(this.form, res.data.wxItem);
          // 传入详情数据时，editor重新渲染
          this.editorKey++;
          //图片链接字符串数组转换为图片对象数组
          res.data.materialUrls.forEach((item, index) => {
            this.form.images.splice(index, 0, {
              imgUrl: item
            });
          });
          this.getLimit();
          //价格缩一百
          this.form.salePrice = moneyUtil.convertHundredMoneyUnit(this.form.salePrice, true);
          this.form.labelPrice = moneyUtil.convertHundredMoneyUnit(this.form.labelPrice, true);
        })
        .always(() => {
          this.loading = false;
        });
    },
    onSubmit(ref) {
      this.$refs[ref].validate(valid => {
        if (!valid) return;
        if (!this.form.faceEnter && !this.form.vccodeEnter && this.mgrType.value === mgrTypeEnum.ticket.value) {
          return this.$message({
            message: '请至少选择一项过闸方式',
            type: 'warning'
          });
        }
        //图片对象数组转换为图片链接字符串数组
        this.form.materialUrls = [];
        this.form.images.forEach(item => {
          if (item.imgUrl) {
            this.form.materialUrls.push(item.imgUrl);
          }
        });
        let url = !!this.itemNo ? urlList.Api.goods.update : urlList.Api.goods.add;
        let params = {
          wxItem: {
            ...this.form
          }
        };
        this.limit = 5 - this.form.images.length;
        delete params.wxItem.images;
        //parseInt防止小数相乘失精
        params.wxItem.salePrice = moneyUtil.convertHundredMoneyUnit(params.wxItem.salePrice, false);
        params.wxItem.labelPrice = moneyUtil.convertHundredMoneyUnit(params.wxItem.labelPrice, false);
        this.loading = true;
        services
          .json(url, params, {
            action: `${this.mgrType.label}${!!this.itemNo ? '修改' : '添加'}`
          })
          .done(res => {
            this.$router.push(this.backUrl);
          })
          .always(() => {
            this.loading = false;
          });
      });
    },
    onImageAdd(index) {
      //多选返回的是图片数组，遍历数组
      if (index === this.form.images.length - 1) {
        const deletedUrl = this.form.images.splice(index, 1);
        deletedUrl[0].forEach(item => {
          if (this.form.images.length < 5) {
            this.form.images.push(item);
          }
        });
        index = this.form.images.length - 1;
      }
      if (index === this.form.images.length - 1) {
        this.form.images.push({});
      }
      this.getLimit();
    },

    getLimit() {
      this.limit = 5 - this.form.images.length + 1;
    },

    onDeleteImg(index) {
      this.form.images.splice(index, 1);
      this.getLimit();
    }
  }
};
</script>

<style lang="less">
@import '~@/dss-common/style/wkt-constants.less';

.mgr-edit-form {
  padding: 20px 20px 0;
  overflow: hidden;
  background: #fff;
  margin-bottom: 30px;
  
  .mgr-slot {
    border-bottom: 1px solid @border-color;
    padding-bottom: 20px;
    margin-bottom: 20px;

    .slot-title {
      display: inline-block;
      width: 90px;
      text-align: right;
    }
  }

  .edit-form {
    .form-input-w366 {
      width: 366px;
    }

    .form-input-w188 {
      width: 188px;
    }

    .form-input-w50 {
      width: 50px;
    }
  }

  .form-unit {
    width: 40px;
    display: inline-block;
    text-align: right;
  }

  .form-tips {
    color: @light-black-color;
  }
}
</style>
