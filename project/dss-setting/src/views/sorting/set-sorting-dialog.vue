<template>
  <!-- 设置商品佣金dialog -->
  <el-dialog title='设置'
             width="600px"
             v-loading="loading"
             @open="onGiftDialogOpen"
             @closed="onGiftDialogClosed"
             :visible.sync="mShowDialog">
    <div class="tip">当前门店:{{form.storeName}}</div>
    <el-form ref="form"
             :model="form"
             :rules="rules"
             label-width="140px">

      <el-form-item label="微信支付商户号："
                    prop="mchId">
        <el-input class="setting-input"
                  type="text"
                  style="width:200px;"
                  maxlength="32"
                  v-model="form.mchId"
                  show-word-limit
                  placeholder="请输入微信支付商户号"></el-input>
        <span>{{form.mchId && form.mchId.length || 0}}/32</span>
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

      <div class="check-box">
        <el-checkbox  v-model="locked">锁定商户号，经销商批量设置商户号时不影响本门店商户号</el-checkbox>
      </div>

    </el-form>

    <div slot="footer">
      <el-button @click="mShowDialog = false">取 消</el-button>
      <el-button type="primary"
                 @click="handleSetting('form')">确 定
      </el-button>
    </div>

    <store-select-dialog inner-dialog
                         :selected-stores="form.suitStores"
                         enable-multiple
                         v-model="showStoreDialog">
    </store-select-dialog>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/dss-common/mixins/dialog-mixin.js';
import sortingApi from '@/dss-setting/src/api/sorting';
import regexps from '@/dss-common/utils/regexps.js';
import StoreSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';

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
  components: {
    StoreSelectDialog
  },
  props: {
    storeIdList: {
      type: Array,
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
      isAdd: true,
      loading: false,
      locked: false,
      showStoreDialog: false,
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
      if (this.storeIdList && this.storeIdList.length === 1) {
        const initForm = this.$plain(this.storeIdList[0]);
        this.form.mchId = initForm.mchId;
        this.form.commissionPercent = initForm.commissionPercent;
        this.form.storeName = initForm.storeName;
        this.locked = initForm.locked;
        if (this.storeIdList[0].locked) {
          this.isAdd = false;
        } else {
          this.isAdd = true;
        }
      }
    },

    onGiftDialogClosed() {
      this.form = getInitForm();
      this.$refs.form.clearValidate();
    },

    delete() {
      let params = {
        storeId: this.storeIdList[0].storeId
      };
      sortingApi
        .delete(params)
        .then(res => {
          this.mShowDialog = false;
          this.$message.success('操作成功');
          this.$emit('done');
        })
        .always(() => {
          this.loading = false;
        });
    },

    /**
     * 完成门店选择
     */
    batchToggleAdd() {
      let list = [];
      list = this.storeIdList.map(item => {
        return {
          storeId: item.storeId,
          storeName: item.storeName,
          ownerName: item.ownerName,
          ownerPhone: item.ownerTel,
          address: item.address,
          mchId: this.form.mchId,
          commissionPercent: this.form.commissionPercent
        };
      });

      sortingApi
        .batchAdd(list)
        .then(res => {
          this.mShowDialog = false;
          this.$message.success('操作成功');
          this.$emit('done');
        })
        .catch(err => {});
    },

    updateStore() {
      const params = { mchId: this.form.mchId, commissionPercent: this.form.commissionPercent };
      params.storeIds = this.storeIdList.map(item => {
        return item.storeId;
      });
      sortingApi
        .updateStore(params)
        .then(res => {
          this.mShowDialog = false;
          this.$message.success('操作成功');
          this.$emit('done');
        })
        .always(() => {
          this.loading = false;
        });
    },

    async handleSetting(formName) {
      //如果不锁定移除
      if (!this.locked) {
        await this.delete();
      }
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        }
        if (this.isAdd) {
          this.batchToggleAdd();
        } else {
          this.updateStore();
        }
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
