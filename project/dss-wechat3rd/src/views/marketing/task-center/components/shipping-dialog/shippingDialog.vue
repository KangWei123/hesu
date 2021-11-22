<template>
  <el-dialog title="产品发货"
             class="dss-dialog-wrapper"
             v-loading="loading"
             :visible="true"
             :append-to-body="true"
             :show-close="false"
             width="600px">
    <el-form :model="shippingInfo"
             :rules="shippingRules"
             label-width="100px"
             ref="shippingForm">
      <el-form-item label="物流选择"
                    prop="shippingType">
        <el-radio v-model="shippingInfo.shippingType"
                  size="mini"
                  v-if="expressType"
                  :label="orderStatusEnum.SHIPPING_TYPE.THIRD_PARTY">三方物流
        </el-radio>
        <el-radio v-model="shippingInfo.shippingType"
                  size="mini"
                  :label="orderStatusEnum.SHIPPING_TYPE.NO_NEED">无需物流
        </el-radio>
      </el-form-item>
      <el-form-item v-if="shippingInfo.shippingType===orderStatusEnum.SHIPPING_TYPE.THIRD_PARTY"
                    label="物流单号"
                    prop="shippingNo">
        <el-input placeholder="请输入物流单号"
                  size="mini"
                  style="width: 174px"
                  :maxlength="19"
                  v-model="shippingInfo.shippingNo"
                  auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="shippingInfo.shippingType===orderStatusEnum.SHIPPING_TYPE.THIRD_PARTY"
                    label="物流公司"
                    prop="shippingCompany">
        <el-select v-model="shippingInfo.shippingCompany"
                   placeholder="请输入物流公司"
                   size="mini"
                   auto-complete="off">
          <el-option v-for="item in CompanyList"
                     :key="item"
                     :label="item"
                     :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item prop="message"-->
      <!--label="商家留言">-->
      <!--<el-input type="textarea"-->
      <!--style="width: 400px;"-->
      <!--v-model="shippingInfo.message"-->
      <!--auto-complete="off">-->
      <!--</el-input>-->
      <!--</el-form-item>-->
    </el-form>
    <div slot="footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary"
                 @click="handleSure()">确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import regex from '@/dss-common/utils/regexps';
import api from '@/dss-wechat3rd/src/api/task-center.js';
import orderStatusEnum from '../../constants/orderStatusEnum';
import goodsTypeEnum from '../../constants/goodsTypeEnum.js';

const CompanyList = [];
export default {
  props: {
    orderNo: {
      type: String,
      default: ''
    },
    outBoundNo: {
      type: Number,
      default: 0
    },
    expressType: {
      type: Number,
      default: 1
    },
    orderType: {
      type: Number,
      default: 0
    }
  },

  filters: {},

  data() {
    let checkNo = (rule, value, callback) => {
      if (this.shippingInfo.shippingType != 2) {
        callback();
      } else if (!value) {
        callback('请输入物流单号');
      } else if (!regex.charAndNum.reg.test(value)) {
        callback('请输入由字母和数字组成的订单号');
      } else if (value.length > 19) {
        callback('长度在19个字符以内');
      } else {
        callback();
      }
    };
    let checkCompany = (rule, value, callback) => {
      if (this.shippingInfo.shippingType != 2) {
        callback();
      } else if (!value) {
        callback('请选择物流公司');
      } else {
        callback();
      }
    };

    return {
      orderStatusEnum,
      goodsTypeEnum,
      loading: false,

      shippingInfo: {
        orderNo: this.orderNo,
        outBoundNo: this.outBoundNo,
        shippingType: orderStatusEnum.SHIPPING_TYPE.THIRD_PARTY, //默认第三方物流公司
        shippingNo: null,
        shippingCompany: null
        // ,message: ''
      },

      shippingRules: {
        shippingNo: [{ required: true, validator: checkNo, trigger: 'change' }],
        shippingCompany: [{ required: true, validator: checkCompany, trigger: 'change' }]
      },

      CompanyList
    };
  },

  mounted() {
    if (this.expressType === orderStatusEnum.express_type.self_extraction) {
      this.shippingInfo.shippingType = orderStatusEnum.SHIPPING_TYPE.NO_NEED;
    }
    if (!CompanyList.length) {
      this.getShippingCompanyList();
    }
  },

  methods: {
    //获取物流公司列表
    getShippingCompanyList() {
      this.loading = true;
      api
        .getShippingCompanyList()
        .then(res => {
          (res.data || []).forEach(item => {
            CompanyList.push(item);
          });
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
      let methods = 'shipping';

      if (this.orderType === goodsTypeEnum.micro_order.value) {
        methods = 'micro_shipping';

        delete this.shippingInfo.orderNo;
        delete this.shippingInfo.outBoundNo;

        this.shippingInfo.customizeOrderNo = this.orderNo;
      }

      this.$refs.shippingForm.validate(valid => {
        if (valid) {
          this.loading = true;
          api[methods](this.shippingInfo)
            .done(res => {
              this.$emit('done');
            })
            .always(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less">
.dss-dialog-wrapper {
  .el-form-item {
    .el-form-item__content {
      .el-form-item__error {
        margin-left: 127px;
      }
    }
  }
}
</style>
