<template>
  <div v-loading="isLoading"
       class="gift-card-edit">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/gift-card/mgr' }">礼品卡</el-breadcrumb-item>
      <el-breadcrumb-item>{{isEdit ? '编辑' : '添加'}}礼品卡</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="wkt-card">
      <el-form :model="form"
               :rules="rules"
               label-width="100px"
               ref="elForm"
               size="mini"
               @submit.native.prevent
               :disabled="!canModify"
               class="activity-form">
        <el-form-item label="礼品卡名称:"
                      prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="礼品卡面值:"
                      prop="usableAmount">
          <el-input v-model="form.usableAmount"></el-input>
        </el-form-item>
        <el-form-item label="购买价格:"
                      prop="salePrice">
          <el-input v-model="form.salePrice"></el-input>
        </el-form-item>
        <el-form-item label="有效期:"
                      prop="validity">
          <el-radio-group v-model="form.validityType">
            <el-radio :label="cardEnum.validityType.permanent">永久有效</el-radio>
            <el-radio :label="cardEnum.validityType.custom">自定义</el-radio>
          </el-radio-group>
          <el-input :disabled="cardEnum.validityType.permanent === form.validityType"
                    style="width: 115px;margin: 0 5px 0 20px;"
                    v-model="form.validity" />天
        </el-form-item>

        <el-form-item label="销售库存:"
                      prop="buyLimit">
          <el-input v-model="form.buyLimit" />
          <div class="tip-msg">礼品卡的总量，默认为0，不限量</div>
        </el-form-item>
      </el-form>
    </div>
    <div class="bottom-button">
      <el-button @click="onCancle">{{canModify? '取消': '关闭'}}</el-button>
      <el-button type="primary"
                  v-if="canModify"
                  @click="onSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import itemCardApi from '@/dss-wechat3rd/src/api/wx-item-card.js';
import regexps from '@/dss-common/utils/regexps.js';
import cardEnum from '@/dss-wechat3rd/src/constants/cardEnum.js';
import moneyUtil from '@/dss-common/utils/money.js';

export default {
  data() {
    const { money, name, positiveInt, intWithZero } = regexps;
    let checkValidity = (rule, v, callback) => {
      let { validity, validityType } = this.form;

      if (validityType === cardEnum.validityType.custom) {
        if (!v) {
          return callback('请输入礼品卡有效期。');
        }
        if (!positiveInt.reg.test(validity)) {
          return callback(new Error(positiveInt.msg));
        }
      }
      callback();
    };
    return {
      itemNo: null,
      canModify: true,
      cardEnum,
      form: {
        type: cardEnum.cardType.giftCard,
        name: '', // 卡片名称
        salePrice: '', // 卡片购买价值
        usableAmount: '', // 面值
        validity: '1', // 卡片自定义有效期天数
        validityType: cardEnum.validityType.permanent, // 卡片有效类型
        buyLimit: 0 // 销售库存
      },
      rules: {
        name: [
          { required: true, message: '请输入卡片名称' },
          {
            pattern: name.reg,
            message: name.msg
          },
          {
            max: 16,
            message: '最大长度16个字符'
          }
        ],
        itemNo: {
          required: true,
          message: '请选择商品'
        },
        usableAmount: [
          {
            required: true,
            message: '请输入礼品卡面值'
          },
          {
            pattern: money.reg,
            message: money.msg
          }
        ],
        salePrice: [
          {
            required: true,
            message: '请输入购买价格'
          },
          {
            pattern: money.reg,
            message: money.msg
          }
        ],
        validity: [{ validator: checkValidity, trigger: 'change' }],
        buyLimit: [
          {
            required: true,
            message: '请输入销售库存'
          },
          {
            pattern: intWithZero.reg,
            message: intWithZero.msg
          }
        ]
      },
      isLoading: false
    };
  },
  computed: {
    isEdit() {
      return !!this.itemNo;
    }
  },
  watch: {
    'form.validityType'() {
      const form = this.$refs.elForm;
      form.validateField('validity');
    }
  },
  mounted() {
    const itemNo = this.$route.query.itemNo;
    if (!itemNo) {
      return;
    }

    itemCardApi.query({ itemNo }).then(
      res => {
        if (!res.data) {
          // 请求后端成功，但返回data为空（data为空，id有可能是乱填的），把id置为null
          this.itemNo = null;
          this.$router.push('/marketing/gift-card/mgr/edit');
          return;
        }
        this.itemNo = itemNo;
        this.setFormData(res.data || {});
      },
      () => {
        // 异常，路径去掉id进入新建态
        this.itemNo = null;
        this.$router.push('/marketing/gift-card/mgr/edit');
      }
    );
  },
  methods: {
    /**
     * 填充表单数据
     */
    setFormData(data) {
      for (const key in this.form) {
        this.form[key] = data[key];
      }
      if (this.form.salePrice) {
        this.form.salePrice /= 100;
      }
      if (this.form.usableAmount) {
        this.form.usableAmount /= 100;
      }
      this.canModify = data.canModify === 1;
    },
    onSave() {
      this.$refs.elForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.save();
      });
    },
    save() {
      const params = { ...this.form };
      params.salePrice = moneyUtil.convertHundredMoneyUnit(params.salePrice, false);
      params.usableAmount = moneyUtil.convertHundredMoneyUnit(params.usableAmount, false);

      let methodProp = 'add';
      if (this.isEdit) {
        //params.id = this.id;
        params.itemNo = this.itemNo;
        methodProp = 'update';
      }
      this.isLoading = true;

      itemCardApi[methodProp](params)
        .done(res => {
          this.$message({
            message: this.isEdit ? '修改成功' : '创建成功。',
            type: 'success'
          });
          this.$router.push('/marketing/gift-card/mgr');
        })
        .always(() => {
          this.isLoading = false;
        });
    },
    onCancle() {
      this.$router.push('/marketing/gift-card/mgr');
    }
  }
};
</script>

<style lang="less" scoped>
@import './edit.less';
</style>
