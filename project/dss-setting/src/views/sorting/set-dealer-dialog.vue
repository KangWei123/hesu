<template>
  <!-- 设置商品佣金dialog -->
  <el-dialog title='设置'
             width="600px"
             v-loading="loading"
             @open="onGiftDialogOpen"
             @closed="onGiftDialogClosed"
             :visible.sync="mShowDialog">
    <div class="tip">{{dealerObj.dealerName}}下所有门店（除锁定门店外）将同步如下设置</div>
    <el-form ref="form"
             :model="form"
             :rules="rules"
             label-width="140px">

      <el-form-item label="微信支付商户号："
                    prop="mchId">
        <el-input class="setting-input"
                  style="width:200px;"
                  v-model="form.mchId"
                  placeholder="请输入微信支付商户号"></el-input>
      </el-form-item>

      <el-form-item label="品牌分账比例："
                    prop="commissionPercent">
        <el-input class="setting-input"
                  style="width: 200px;"
                  v-model="form.commissionPercent"
                  placeholder="请输入品牌分账比例"></el-input>
        <span>%</span>
        <div class="desc-tip">请输入0-30之间的数字</div>
      </el-form-item>

    </el-form>

    <div slot="footer">
      <el-button @click="mShowDialog = false">取 消</el-button>
      <el-button type="primary"
                 @click="handleSetting('form')">确 定
      </el-button>
    </div>

  </el-dialog>
</template>

<script>
import dialogMixin from '@/dss-common/mixins/dialog-mixin.js';
import sortingApi from '@/dss-setting/src/api/sorting';
import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
import regexps from '@/dss-common/utils/regexps.js';

function getInitForm() {
  return {
    mchId: null,
    commissionPercent: null
  };
}
const regexpsPercent = /^(([1-9]\d|[1-9])(\.\d{1,2})?|0\.[1-9]\d|0\.\d[1-9]|0\.[1-9])$/;

export default {
  name: 'set-gift-dialog',
  mixins: [dialogMixin],
  components: {},
  props: {
    dealerObj: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkComServicePercent = (rule, value, callback) => {
      if (!regexpsPercent.test(value) || value > 29.99) {
        if (value != 0) {
          return callback(new Error('允许输入比例为大于等于0~小于30的数字，保留两位小数'));
        }
      }
      return callback();
    };

    return {
      loading: false,
      groupStoreList: [],
      form: getInitForm(),
      isDisable: false,
      rules: {
        mchId: [
          {
            required: true,
            message: '请输入微信支付商户号',
            trigger: ['blur']
          }
        ],
        commissionPercent: [
          {
            required: true,
            message: '请输入分账比例',
            trigger: ['blur']
          },
          { validator: checkComServicePercent, trigger: ['blur'] }
        ]
      }
    };
  },

  mounted() {},

  methods: {
    onGiftDialogOpen() {
      this.form = getInitForm();
      if (this.dealerObj) {
        this.getDealerSetting();
      }
    },

    onGiftDialogClosed() {
      this.form = getInitForm();
      this.$refs.form.clearValidate();
    },

    //获取供应商列表
    getDealerSetting() {
      let params = {
        dealerId: this.dealerObj.dealerId
      };
      sortingApi
        .dealer_setting(params)
        .then(res => {
          if (res.data) {
            this.form = res.data;
          }
        })
        .always(() => {});
    },

    handleSetting(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        }
        const params = {
          dealerId: this.dealerObj.dealerId,
          mchId: this.form.mchId,
          commissionPercent: this.form.commissionPercent
        };
        let key = 'dis_add';
        if (this.form.id) {
          key = 'dis_update';
        }
        sortingApi[key](params)
          .then(res => {
            this.mShowDialog = false;
            this.$message.success('操作成功');
            this.$emit('done');
          })
          .always(() => {
            this.loading = false;
          });
      });
    }
  }
};
</script>
<style lang="less">
  .tip{
    margin-left: 10px;
    color: #999;
    font-size: 12px;
  }
  .check-box{
    margin-left: 10px;
    .el-checkbox__inner{
      border-radius:100% ;
    }
  }
</style>
