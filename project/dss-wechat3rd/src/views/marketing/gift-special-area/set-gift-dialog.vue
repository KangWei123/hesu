<template>
  <!-- 设置商品佣金dialog -->
  <el-dialog
    title="设置"
    width="600px"
    v-loading="loading"
    @open="onGiftDialogOpen"
    @closed="onGiftDialogClosed"
    :visible.sync="mShowDialog"
    class="set-gift-dialog gift-specical-area"
  >
    <el-form ref="form" :model="form" :rules="rules" :disabled="isDisable" label-width="120px">
      <el-form-item label="活动时间：" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <div class="amount-box">
        <el-form-item label="限领人群：" prop="levelId">
          <el-select v-model="form.levelId" placeholder="请选择">
            <el-option v-for="item in allMemberList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="每人限领数量：" prop="everyoneLimitCount">
          <el-input
            class="setting-input"
            style="width: 200px;"
            v-model="form.everyoneLimitCount"
            placeholder="请输入限领数量"
          ></el-input>
          <div class="desc-tip">默认为0，0表示不限制</div>
        </el-form-item>

        <el-form-item label="可发放数量：" prop="limitTotal">
          <el-input
            class="setting-input"
            style="width: 200px;"
            v-model="form.limitTotal"
            placeholder="请输入可发放数量"
          ></el-input>
          <div class="desc-tip">默认为0，0表示不限制</div>
        </el-form-item>

        <el-form-item prop="suitStoreType" label="适用门店：">
          <el-radio-group v-model="form.suitStoreType">
            <el-radio :label="suitStoreTypeEnum.all">全部门店</el-radio>
            <el-radio :label="suitStoreTypeEnum.part">选定门店</el-radio>
          </el-radio-group>
          <div v-if="form.suitStoreType === suitStoreTypeEnum.part" class="btn-rules-div">
              <el-button
                class="btn-rules left10"
                @click="handleSelectStore()"
                >选择门店
              </el-button>
              <el-button
                class="btn-rules left10"
                @click="handleImportStore()"
                >导入门店
              </el-button>
            </div>
        </el-form-item>

        <div
          class="store-list-box"
          v-if="form.suitStores && form.suitStores.length && form.suitStoreType === suitStoreTypeEnum.part"
        >
          <div class="store-label">已选门店</div>
          <div class="store-content">
            <div class="store-item-box" v-for="(storeList, groupIndex) in groupStoreList" :key="groupIndex">
              <el-tag
                v-for="(store, storeIndex) in storeList"
                :key="store.id"
                @close="handleDelStoreItem(groupIndex, storeIndex)"
                :closable="!isDisable"
                >{{ store.name }}</el-tag
              >
            </div>
          </div>
        </div>
      </div>
    </el-form>

    <div slot="footer">
      <el-button @click="mShowDialog = false">取 消</el-button>
      <el-button type="primary" :disabled="isDisable" @click="handleSetting('form')">确 定 </el-button>
    </div>

    <local-resolve-xls
      inner-dialog
      @resolve="onResolveImportStore"
      :visible.sync="resolveXlsDialogVisible"
      title="导入门店"
    />

    <store-select-dialog
      inner-dialog
      :selected-stores="form.suitStores"
      enable-multiple
      v-model="showStoreDialog"
      @choosed="onStoreChoosed"
    >
    </store-select-dialog>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/dss-common/mixins/dialog-mixin.js';
import giftApi from '@/dss-wechat3rd/src/api/gift.js';
import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
import regexps from '@/dss-common/utils/regexps.js';
import StoreSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
import LocalResolveXls from '@/dss-wechat3rd/src/bz_components/local-resolve-xls';
import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';

const storeGroupCount = 6;

function getInitForm() {
  return {
    dateRange: null,
    levelId: null,
    everyoneLimitCount: 0,
    limitTotal: 0,
    suitStoreType: suitStoreTypeEnum.all,
    suitStores: []
  };
}

export default {
  name: 'set-gift-dialog',
  mixins: [dialogMixin, AdapterIfr.AdapterMixins],
  components: {
    LocalResolveXls,
    StoreSelectDialog
  },
  props: {
    giftActivityIdList: {
      type: Array,
      default: null
    },
    allMemberList: {
      type: Array,
      default: null
    }
  },
  watch: {
    showStoreDialog(newVal, oldVal) {
      setTimeout(() => {
        this.adapterIfmMask(true);
      });
    }
  },
  data() {
    const storeValidator = (rule, value, callback) => {
      if (this.form.suitStoreType === suitStoreTypeEnum.all) {
        return callback();
      } else {
        if (this.form.suitStores && this.form.suitStores.length) {
          return callback();
        } else {
          return callback('请选择门店');
        }
      }
    };
    return {
      resolveXlsDialogVisible: false,
      suitStoreTypeEnum,
      loading: false,
      showLevelDialog: false,
      showStoreDialog: false,
      groupStoreList: [],
      form: getInitForm(),
      isDisable: false,
      rules: {
        dateRange: {
          type: 'array',
          required: true,
          message: '请选择活动时间'
        },
        levelId: [{ required: true, message: '请选择限领人群' }],
        everyoneLimitCount: [
          {
            required: true,
            message: '请输入每人限领数量'
          },
          {
            pattern: regexps.intWithZero.reg,
            message: regexps.intWithZero.msg
          }
        ],
        limitTotal: [
          {
            required: true,
            message: '请输入可发放总量'
          },
          {
            pattern: regexps.intWithZero.reg,
            message: regexps.intWithZero.msg
          }
        ],
        suitStoreType: [{ required: true, validator: storeValidator, trigger: 'change' }]
      }
    };
  },
  methods: {
    handleImportStore() {
      this.resolveXlsDialogVisible = true;
    },

    onResolveImportStore(storeList) {
      this.form.suitStores = storeList;
      this.assembleGroupStoreList();
      this.$refs.form.validateField('suitStoreType');
    },
    handleSelectLevel() {
      this.showLevelDialog = true;
    },
    onGiftDialogOpen() {
      this.form = getInitForm();
      this.isDisable = false;
      if (this.giftActivityIdList && this.giftActivityIdList.length === 1) {
        const initForm = this.giftActivityIdList[0];
        if (initForm.startTime && initForm.endTime) {
          this.form.dateRange = [new Date(initForm.startTime), new Date(initForm.endTime)];
        }
        //未开始才能编辑设置
        this.isDisable = initForm.status !== 0;
        this.form.levelId = initForm.levelId || null;
        this.form.everyoneLimitCount = initForm.everyoneLimitCount || 0;
        this.form.limitTotal = initForm.limitTotal || 0;
        this.form.suitStoreType = initForm.suitStoreType || suitStoreTypeEnum.all;
        this.form.suitStores = [...(initForm.suitStores || [])];
        this.assembleGroupStoreList();
      }
    },
    onGiftDialogClosed() {
      this.form = getInitForm();
    },
    handleSetting(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        }
        const params = {};
        const { dateRange, levelId, everyoneLimitCount, limitTotal, suitStoreType, suitStores } = this.form;
        if (dateRange[1].getTime() < new Date().getTime()) {
          return this.$message({
            type: 'warning',
            message: '结束时间不能小于当前时间'
          });
        }
        params.startTime = dateRange[0].getTime();
        params.endTime = dateRange[1].getTime();
        params.levelId = levelId;
        params.everyoneLimitCount = everyoneLimitCount;
        params.limitTotal = limitTotal;
        params.suitStoreType = suitStoreType;
        if (suitStoreType === suitStoreTypeEnum.part) {
          params.storeIds = suitStores.map(store => {
            return store.id;
          });
        }
        params.idList = this.giftActivityIdList.map(gift => {
          return gift.id;
        });
        this.loading = true;
        giftApi
          .batchSet(params)
          .then(res => {
            this.mShowDialog = false;
            this.$emit('done');
          })
          .always(() => {
            this.loading = false;
          });
      });
    },
    handleSelectStore() {
      this.showStoreDialog = true;
    },
    onStoreChoosed(storeList) {
      this.form.suitStores = storeList;
      this.assembleGroupStoreList();
      this.$refs.form.validateField('suitStoreType');
    },
    assembleGroupStoreList() {
      this.groupStoreList = [];
      let start = 0;
      while (start < this.form.suitStores.length) {
        //每6个分成一组展示
        this.groupStoreList.push(this.form.suitStores.slice(start, start + storeGroupCount));
        start += storeGroupCount;
      }
    },
    handleDelStoreItem(groupIndex, storeIndex) {
      this.form.suitStores.splice(groupIndex * storeGroupCount + storeIndex, 1);
      this.assembleGroupStoreList();
      this.$refs.form.validateField('suitStoreType');
    }
  }
};
</script>

<style lang="less">
.gift-specical-area {
    .el-form-item__error {
      left: 17px;
    }
}
.set-gift-dialog {
  .amount-box {
    .el-form-item__content {
      width: 231px;
    }
    .el-form-item {
      margin-bottom: 16px;
    }
    .desc-tip {
      height: 20px;
      line-height: 20px;
      text-align: left;
      margin-left: 17px;
    }
    .btn-rules-div {
      text-align: left;
      margin-left: 17px;
    }
    .btn-rules {
      height: 26px;
      line-height: 26px;
      padding: 0px 10px;
      border-color: @ui-blue-default;
      span {
        color: @ui-blue-default;
      }
    }
  }
  .el-dialog__body {
    padding-bottom: 10px;
  }
}
</style>
