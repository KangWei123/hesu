<template>
  <div class="newtag-container page-bg" v-loading="loading.page">
    <!-- breadcrumb -->
    <Breadcrumb></Breadcrumb>
    <!-- form -->
    <!-- 通用表单 -->
    <el-form
      :model="commonForm"
      :rules="rules"
      :disabled="!canEdit"
      ref="ruleForm"
      label-width="100px"
      class="ruleForm"
    >
      <el-form-item label="选择标签类型" prop="type">
        <el-radio-group v-model="commonForm.type">
          <el-radio label="商家印象"></el-radio>
          <el-radio label="条件标签"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <CommonForm ref="commonForm" v-show="commonForm.type == '商家印象'"></CommonForm>
    <!-- 非通用表单 -->
    <!-- 商家印象 -->
    <MerchantForm ref="merchantForm" v-show="commonForm.type == '商家印象'"></MerchantForm>
    <!-- 旧的条件标签 -->
    <ConditionForm ref="conditionForm" v-show="flag === 'true'"></ConditionForm>
    <!-- 新的条件标签 -->
    <newConditionForm
      v-if="commonForm.type == '条件标签' && flag === 'false' && (criteriaFrom.name || !$route.query.id)"
      :echo-data="echoData"
      :criteria-from="criteriaFrom"
    ></newConditionForm>
    <!-- 表单按钮 -->
    <div class="btn-group" v-show="commonForm.type === '商家印象'">
      <el-button :loading="loading.submit" @click="onSubmit('tagForm')" type="primary" v-if="canEdit">保存</el-button>
      <el-button @click="goTagListWithLastActiveTagName">{{ canEdit ? '取消' : '返回' }}</el-button>
    </div>
    <div v-if="commonForm.type === '商家印象'" style="margin: 0 0 40px 200px; padding-bottom: 40px" class="tip-text">
      创建的商家标签次日可在洞察平台进行圈人
    </div>
    <div v-show="flag === 'true'">
      <el-button :round="true" @click="returnList" style="margin-left: 47%; margin-top: 40px; margin-bottom: 20px"
        >返回</el-button
      >
      <div style="margin: 20px 0 40px 20px; text-align: center" class="tip-text">
        创建的商家标签次日可在洞察平台进行圈人
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/mod-member/src/api/new-dmp';
  import Breadcrumb from './components/Breadcrumb';
  import CommonForm from './components/CommonForm';
  import MerchantForm from './components/MerchantForm';
  import ConditionForm from './components/ConditionForm';
  import getFormData from '.';
  import newConditionForm from '../myLabel';
  import './main.less';

  export default {
    name: 'Tag',
    components: {
      Breadcrumb,
      CommonForm,
      MerchantForm,
      ConditionForm,
      newConditionForm,
    },
    provide() {
      return {
        canEdit: this.canEdit,
        formData: this.formData,
      };
    },
    data() {
      const formData = getFormData();
      return {
        ruleForm: {
          type: '商家印象',
        },
        rules: {},
        commonForm: formData.commonForm,
        conditionForm: formData.conditionForm,
        formData,
        loading: {
          page: false,
          submit: false,
        },
        lastActiveTagName: '',
        flag: false,
        criteriaFrom: {},
        echoData: undefined,
      };
    },
    computed: {
      // 是否创建模式
      canEdit() {
        return !this.$route.query.id;
      },
      // 是否商家印象
      ifMerchantTag() {
        return this.tagForm.type === '商家印象';
      },
    },
    methods: {
      labelChange(val) {
        this.commonForm.type == val;
      },
      // 返回列表
      goTagListWithLastActiveTagName() {
        this.$router.push({
          name: 'portraitMyTag',
          params: { lastActiveTagName: this.lastActiveTagName },
        });
      },
      // 提交表单
      onSubmit() {
        this.loading.submit = true;
        if (this.commonForm.type === '商家印象') {
          this.$refs.commonForm.$refs.commonForm.validate(ifCommonFormValid => {
            this.$refs.merchantForm.$refs.merchantForm.validate(ifMerchantFormValid => {
              if (ifCommonFormValid && ifMerchantFormValid) {
                const data = {
                  categoryId: this.formData.merchantForm.category,
                  description: this.formData.commonForm.desc,
                  name: this.formData.commonForm.name,
                };
                api
                  .addImpressionTag(data)
                  .then(d => {
                    this.$message.success('添加商家印象标签成功');
                    this.goTagListWithLastActiveTagName();
                  })
                  .catch(e => {
                    this.$message.error(e.errorMessage);
                  })
                  .finally(e => {
                    this.loading.submit = false;
                  });
              } else {
                this.loading.submit = false;
              }
            });
          });
        } else {
          // 通用表单
          const commonFormData = {
            labelValue: this.commonForm.name, // 标签名称
            description: this.commonForm.desc, // 标签描述
          };
          const commonFormValidator = this.$refs.commonForm.$refs.commonForm.validate;

          // 打标条件
          const conditions = this.conditionForm.condition;
          const conditionFormData = [];
          const conditionFormValidator = [];

          if (conditions.consumption) {
            // 消费打标条件数据和验证
            const consumptionFormData = this.conditionForm.consumptionForm;
            const consumptionFormRef = this.$refs.conditionForm.$refs.consumptionForm;
            // 表单数据
            const consumptionFormDataTemp = {
              consumeCalcDays: consumptionFormData.calcTime === 0 ? 0 : consumptionFormData.calcTime || '',
              consumeType: consumptionFormData.production,
            };
            if (consumptionFormData.production !== 'all') {
              consumptionFormDataTemp.consumeTarget = JSON.stringify(consumptionFormData.targetList) || '';
            }
            conditionFormData.push(consumptionFormDataTemp);
            conditionFormValidator.push(consumptionFormRef.$refs.consumptionForm.validate);

            if (consumptionFormData.productionOptions.includes('累计消费金额')) {
              // 累计消费金额
              conditionFormData.push({
                consumeMoneyMin: consumptionFormData.feeOptionForm.low,
                consumeMoneyMax: consumptionFormData.feeOptionForm.high,
              });
              conditionFormValidator.push(consumptionFormRef.$refs.feeOptionForm.validate);
            }
            if (consumptionFormData.productionOptions.includes('累计消费次数')) {
              // 累计消费次数
              conditionFormData.push({
                consumeTimeMin: consumptionFormData.countOptionForm.low,
                consumeTimeMax: consumptionFormData.countOptionForm.high,
              });
              conditionFormValidator.push(consumptionFormRef.$refs.countOptionForm.validate);
            }
            if (consumptionFormData.productionOptions.includes('上次消费距今')) {
              // 上次消费距今
              conditionFormData.push({
                consumeStopDays: consumptionFormData.lastOptionForm.day,
                consumeStopDayOps: consumptionFormData.lastOptionForm.condition,
              });
              conditionFormValidator.push(consumptionFormRef.$refs.lastOptionForm.validate);
            }
          }
          if (conditions.charge) {
            // 充值打标条件数据和验证
            const chargeFormData = this.conditionForm.chargeForm;
            const chargeFormRef = this.$refs.conditionForm.$refs.chargeForm;
            conditionFormData.push({
              chargeCalcDays: chargeFormData.calcTime === 0 ? 0 : chargeFormData.calcTime || '',
            });
            conditionFormValidator.push(chargeFormRef.$refs.chargeForm.validate);
            if (chargeFormData.chargeOptions.includes('累计充值金额')) {
              // 累计充值金额
              conditionFormData.push({
                chargeMoneyMin: chargeFormData.chargeOptionForm.low,
                chargeMoneyMax: chargeFormData.chargeOptionForm.high,
              });
              conditionFormValidator.push(chargeFormRef.$refs.chargeOptionForm.validate);
            }
            if (chargeFormData.chargeOptions.includes('累计充值次数')) {
              // 累计充值次数
              conditionFormData.push({
                chargeTimeMin: chargeFormData.countOptionForm.low,
                chargeTimeMax: chargeFormData.countOptionForm.high,
              });
              conditionFormValidator.push(chargeFormRef.$refs.countOptionForm.validate);
            }
          }
          if (conditions.scean) {
            // 浏览打标条件数据和验证
            const sceanFormData = this.conditionForm.sceanForm;
            const sceanFormRef = this.$refs.conditionForm.$refs.sceanForm;

            const sceanFormDataTemp = {
              browseCalcDays: sceanFormData.calcTime === 0 ? 0 : sceanFormData.calcTime || '',
              browseType: sceanFormData.production,
            };
            if (sceanFormData.production !== 'all') {
              sceanFormDataTemp.browseTarget = JSON.stringify(sceanFormData.targetList) || '';
            }
            conditionFormData.push(sceanFormDataTemp);
            conditionFormValidator.push(sceanFormRef.$refs.sceanForm.validate);
            if (sceanFormData.sceanOptions.includes('累计浏览次数')) {
              // 累计浏览次数
              conditionFormData.push({
                browseTimeMin: sceanFormData.countOptionForm.low,
                browseTimeMax: sceanFormData.countOptionForm.high,
              });
              conditionFormValidator.push(sceanFormRef.$refs.countOptionForm.validate);
            }
          }
          // 验证打标条件
          commonFormValidator(valid => {
            if (valid) {
              const validateResult = [];
              conditionFormValidator.forEach(validate => validate(res => validateResult.push(res)));
              if (!validateResult.length) {
                this.$message.error('请选择打标条件');
                this.loading.submit = false;
                return;
              }
              // 提交表单
              if (validateResult.every(item => item === true)) {
                let data = { ...commonFormData };
                conditionFormData.forEach(item => (data = { ...data, ...item }));
                console.log(data);
                this.loading.submit = true;
                api
                  .addAutoLabel(data)
                  .then(d => {
                    this.$message.success('新增条件标签成功');
                    this.goTagListWithLastActiveTagName();
                  })
                  .catch(e => {
                    this.$message.error(e.errorMessage);
                  })
                  .finally(e => {
                    this.loading.submit = false;
                  });
              } else {
                this.loading.submit = false;
              }
            } else {
              console.log('commonoForm not valid');
              this.loading.submit = false;
            }
          });
        }
      },
      // 返回列表
      returnList() {
        this.$router.push({
          name: 'portraitMyTag',
          // path: '/portrait/manage/myTag/new',
          params: { lastActiveTagName: 'conditionTag' },
        });
      },
    },
    async mounted() {
      this.flag = this.$route.query.flag;
      console.log(typeof this.$route.query.flag, '=====this.flag ');
      this.commonForm.type = this.$route.query.tabsName;
      console.log(this.commonForm.type, '=====this.flag ');
      // 缓存从标签列表跳出时的 active tag
      this.lastActiveTagName = this.$route.params.lastActiveTagName || '';
      // 查看模式下通过 query 根据 id 获取数据
      if (!this.canEdit) {
        this.loading.page = true;
        const { type, id } = this.$route.query;
        if (type === '商家印象') {
          api
            .getImpressionTagById({ id })
            .then(d => {
              const data = d.data;
              this.commonForm.type = type;
              this.commonForm.name = data.name;
              this.commonForm.desc = data.description;
              this.formData.merchantForm.category = data.categoryId;
            })
            .catch(e => this.$message.error(e.errorMessage))
            .finally(_ => {
              this.loading.page = false;
            });
        } else {
          // 条件标签
          const data = await api
            .getAutoLabelDetailById({
              labelId: id,
            })
            .then(d => d.data)
            .catch(console.log)
            .finally(_ => {
              this.loading.page = false;
            });
          // 回显条件标签的value
          console.log(data, '回显的value');
          this.criteriaFrom = {
            name: data.labelName,
            rule: data.updRule,
            type: '条件标签',
            descripLabel: data.useDefaultDesc == 0,
            desc: data.description,
          };
          this.echoData = data;
          console.log(this.echoData, '---->>>values');
          // commonForm
          (this.commonForm.type = type),
            (this.commonForm.name = data.labelValue),
            (this.commonForm.desc = data.description);
          // conditionForm
          this.conditionForm.condition = {
            charge: false,
            consumption: false,
            scean: false,
          };
          // 判断是否需要展示消费充值和浏览
          data.consumeType && (this.conditionForm.condition.consumption = true);
          data.browseType && (this.conditionForm.condition.scean = true);
          (data.chargeMoneyMin || data.chargeTimeMin) && (this.conditionForm.condition.charge = true);
          (data.chargeMoneyMin === 0 || data.chargeTimeMin === 0) && (this.conditionForm.condition.charge = true);
          // 消费打标条件
          this.conditionForm.consumptionForm = {
            calcTime: data.consumeCalcDays === 0 ? 0 : data.consumeCalcDays || '',
            production: data.consumeType || 'all',
            productionOptions: [],
            targetList: JSON.parse(data.consumeTarget) || [],
            countOptionForm: {
              low: data.consumeTimeMin === 0 ? 0 : data.consumeTimeMin || '',
              high: data.consumeTimeMax === 0 ? 0 : data.consumeTimeMax || '',
            },
            feeOptionForm: {
              low: data.consumeMoneyMin === 0 ? 0 : data.consumeMoneyMin || '',
              high: data.consumeMoneyMax === 0 ? 0 : data.consumeMoneyMax || '',
            },
            lastOptionForm: {
              condition: data.consumeStopDayOps || '',
              day: data.consumeStopDays === 0 ? 0 : data.consumeStopDays || '',
            },
          };
          // 判断是否展示消费打标条件中的细分条件
          const productionOptions = this.conditionForm.consumptionForm.productionOptions;
          (data.consumeMoneyMin === 0 ? true : data.consumeMoneyMin) && productionOptions.push('累计消费金额');
          (data.consumeTimeMin === 0 ? true : data.consumeTimeMin) && productionOptions.push('累计消费次数');
          (data.consumeStopDays === 0 ? true : data.consumeStopDays) && productionOptions.push('上次消费距今');

          this.conditionForm.chargeForm = {
            calcTime: data.chargeCalcDays === 0 ? 0 : data.chargeCalcDays || '',
            chargeOptions: [],
            chargeOptionForm: {
              low: data.chargeMoneyMin === 0 ? 0 : data.chargeMoneyMin || '',
              high: data.chargeMoneyMax === 0 ? 0 : data.chargeMoneyMax || '',
            },
            countOptionForm: {
              high: data.chargeTimeMax === 0 ? 0 : data.chargeTimeMax || '',
              low: data.chargeTimeMin === 0 ? 0 : data.chargeTimeMin || '',
            },
          };
          // 判断是否展示充值打标条件中的细分条件
          const chargeOptions = this.conditionForm.chargeForm.chargeOptions;
          (data.chargeMoneyMin === 0 ? true : data.chargeMoneyMin) && chargeOptions.push('累计充值金额');
          (data.chargeTimeMin === 0 ? true : data.chargeTimeMin) && chargeOptions.push('累计充值次数');

          this.conditionForm.sceanForm = {
            calcTime: data.browseCalcDays === 0 ? 0 : data.browseCalcDays || '',
            production: data.browseType || 'all',
            targetList: JSON.parse(data.browseTarget) || [],
            sceanOptions: [],
            countOptionForm: {
              low: data.browseTimeMin === 0 ? 0 : data.browseTimeMin || '',
              high: data.browseTimeMax === 0 ? 0 : data.browseTimeMax || '',
            },
          };
          // 判断是否展示浏览打标条件中的细分条件
          (data.browseTimeMin === 0 ? true : data.browseTimeMin) &&
            this.conditionForm.sceanForm.sceanOptions.push('累计浏览次数');
        }
      }
    },
  };
</script>

<style lang="less" scoped>
  .btn-group {
    margin-left: 200px;
    margin-top: 40px;
    margin-bottom: 20px;
  }
  .ruleForm {
    margin-left: 20px;
  }
  /deep/ .el-button.is-disabled {
    &:hover,
    & {
      background: none;
      color: #ccc;
      border: none;
    }
  }
</style>
