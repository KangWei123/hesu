<template>
      <div>
         <el-form class=""
             :class="disabled ? 'form-disabled' : ''"
             :model="form"
              ref="drugForm"
             label-width="140px"
             :disabled='disabled'>

        <!--药品通用名称-->
        <el-form-item label="药品通用名称:" class="goods-label" prop="drugCommonName"   :rules="isRequired?rules.drugCommonName:max100">
          <el-input
            placeholder="请输入药品通用名称"
            class="goods-w366 primary-inputHeight"
            v-model="form.drugCommonName"
          ></el-input>
        </el-form-item>

        <!--批准文号-->
        <el-form-item label="批准文号:" class="goods-label" prop="drugApprovalNumber" :rules="isRequired?rules.drugApprovalNumber:max100">
          <el-input
            placeholder="请输入药品批准文号"
            class="goods-w366 primary-inputHeight"
            v-model="form.drugApprovalNumber"
          ></el-input>
        </el-form-item>

        <!--品牌-->
        <el-form-item label="品牌:" class="goods-label" prop="drugBrand"  :rules="isRequired?rules.drugBrand:{}">
          <el-input
            placeholder="请输入品牌名称"
            class="goods-w366 primary-inputHeight"
            v-model="form.drugBrand"
          ></el-input>
        </el-form-item>

        <!--品牌-->
        <el-form-item label="药品生产商:" class="goods-label" prop="drugManufacturer" :rules="isRequired?rules.drugManufacturer:max100">
          <el-input
            placeholder="请输入药品生产商名称"
            class="goods-w366 primary-inputHeight"
            v-model="form.drugManufacturer"
          ></el-input>
        </el-form-item>

        <!--药品类别：-->
        <el-form-item label="药品类别:" class="goods-label" prop="drugCategory"  :rules="isRequired?rules.drugCategory:max100">
          <el-input
            placeholder="请输入药品类别，如：中成药"
            class="goods-w366 primary-inputHeight"
            v-model="form.drugCategory"
          ></el-input>
        </el-form-item>

        <!--药品剂型-->
        <el-form-item label="药品剂型:" class="goods-label" prop="drugDosageForm"  :rules="isRequired?rules.drugDosageForm:max50">
          <el-input
            placeholder="请输入药品剂型，如：颗粒"
            class="goods-w366 primary-inputHeight"
            v-model="form.drugDosageForm"

          ></el-input>
        </el-form-item>

        <!--药品单位-->
        <el-form-item label="药品单位:" class="goods-label" prop="drugUnit"  :rules="isRequired?rules.drugUnit:max50">
          <el-input
            placeholder="请输入药品单位，如：粒"
            class="goods-w366 primary-inputHeight"
            v-model="form.drugUnit"

          ></el-input>
        </el-form-item>

        <!--药品规格-->
        <el-form-item label="药品规格:" class="goods-label" prop="drugSpecification"  :rules="isRequired?rules.drugSpecification:max50">
          <el-input
            placeholder="请输入商品规格，如：0.25克*30粒"
            class="goods-w366 primary-inputHeight"
            v-model="form.drugSpecification"

          ></el-input>
        </el-form-item>

        <!--使用方法-->
        <el-form-item label="使用方法:" class="goods-label" prop="usageMethod"  :rules="isRequired?rules.usageMethod:max50">
          <el-input
            placeholder="请输入药品使用方法，如：口服"
            class="goods-w366 primary-inputHeight"
            v-model="form.usageMethod"
          ></el-input>
        </el-form-item>

        <!--使用剂量-->
        <el-form-item label="使用剂量:" class="goods-label" prop="usageAndDosage" :rules="max500">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows:8 }"
            placeholder="请输入药品使用剂量说明"
            class="goods-w366 primary-inputHeight"
            v-model="form.usageAndDosage"
          ></el-input>
        </el-form-item>

        <!--服用频率：-->
        <el-form-item label="用法用量:" class="goods-label" prop="usageFrequencyUnit"
                      v-if="form.drugType===drugEnum.drugType.drug" :rules="isRequired?rules.usageFrequencyUnit:{}">
          <el-input
            class="goods-price primary-inputHeight"
            v-model="form.usageFrequencyUnit"
          ></el-input>
          <span style="margin:0 10px">天</span>
          <el-input
            class="goods-price primary-inputHeight"
            v-model="form.usageFrequencyCount"
          ></el-input>
          <span style="margin:0 10px">次,每次</span>
          <el-input
            class="goods-price primary-inputHeight"
            v-model="form.usagePerUseCount"
          ></el-input>

          <el-select v-model="form.usagePerUseUnit" size="mini" placeholder="" class="shelf-life-unit-select">
            <el-option
              v-for="item in unitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

        </el-form-item>



        <!--服用天数：-->
        <el-form-item label="服用天数:" class="goods-label" prop="usageDays"
                      v-if="form.drugType===drugEnum.drugType.drug"  :rules="isRequired?rules.usageDays:{}">
          <el-input
            placeholder=""
            class="goods-price primary-inputHeight"
            v-model="form.usageDays"
          ></el-input>
          <span class="goods-unit">天</span>
        </el-form-item>

        <!--适用人群：-->
        <el-form-item label="适用人群:" class="goods-label" prop="applicablePeople"  :rules="max50">
          <el-input
            placeholder="请输入药品适用人群"
            class="goods-w366 primary-inputHeight"
            v-model="form.applicablePeople"
          ></el-input>
        </el-form-item>

        <!--有效期：-->
        <el-form-item label="有效期:" class="goods-label" prop="validateTime">
          <el-input
            placeholder="请输入有效期"
            class="goods-price primary-inputHeight"
            v-model="form.validateTime"
          ></el-input>

          <el-select v-model="form.validateTimeUnit" size="mini" placeholder="" class="shelf-life-unit-select">
            <el-option
              v-for="item in shelfLifeUnitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

        </el-form-item>

        <!--存储条件-->
        <el-form-item label="存储条件:" class="goods-label" prop="storeCondition"    :rules="max100">
          <el-input
            placeholder="请输入药品使存储条件"
            class="goods-w366 primary-inputHeight"
            v-model="form.storeCondition"
          ></el-input>
        </el-form-item>

        <!--适用症状/功能主治-->
        <el-form-item label="适用症状/功能主治:" class="goods-label" prop="applicableSymptom"  :rules="max500">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 8}"
            placeholder="请输入药品用法用药说明"
            class="goods-w366 primary-inputHeight"
            v-model="form.applicableSymptom"
          ></el-input>
        </el-form-item>


        <!--用药禁忌-->
        <el-form-item label="用药禁忌:" class="goods-label" prop="usageTaboo"  :rules="max500">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 8}"
            placeholder="请输入药品用法用药说明"
            class="goods-w366 primary-inputHeight"
            v-model="form.usageTaboo"
          ></el-input>
        </el-form-item>

        <!--用药注意事项：-->
        <el-form-item label="用药注意事项:" class="goods-label" prop="consideration"   :rules="max500">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 8}"
            placeholder="请输入药品用法用药说明"
            class="goods-w366 primary-inputHeight"
            v-model="form.consideration"
          ></el-input>
        </el-form-item>


      </el-form>
  </div>
</template>

<script>
import drugEnum from '@/dss-wechat3rd/src/constants/drug';
import regexps from '@/dss-common/utils/regexps.js';

const shelfLifeUnitOptions = [
  { value: 0, label: '小时' },
  { value: 1, label: '天' },
  { value: 2, label: '月' },
  { value: 3, label: '年' }
];

const unitOptions = [
  { value: '粒', label: '粒' },
  { value: '片', label: '片' },
  { value: '丸', label: '丸' },
  { value: '袋', label: '袋' },
  { value: '瓶', label: '瓶' },
  { value: '支', label: '支' },
  { value: 'mg', label: 'mg' },
  { value: 'g', label: 'g' },
  { value: 'ml', label: 'ml' }
];

export default {
  name: 'drugForm',
  props: {
    data: {
      type: Object,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 用法用量校验
    const usageFrequencyUnitValidator = (rule, value, callback) => {
      if (!this.form.usagePerUseUnit) {
        return callback('请选择每次单位');
      }
      if (!this.form.usageFrequencyCount || !this.form.usagePerUseCount) {
        return callback('请输入用法用量');
      } else {
        if (
          !regexps.positiveInteger.reg.test(this.form.usagePerUseCount) ||
          !regexps.positiveInteger.reg.test(this.form.usageFrequencyCount)
        ) {
          return callback(regexps.positiveInteger.msg);
        }
      }
      return callback();
    };

    return {
      drugEnum,
      shelfLifeUnitOptions,
      unitOptions,
      form: {},
      max100: {
        max: 100,
        message: '长度在 1 到 100 个字符',
        trigger: 'blur'
      },
      max50: {
        max: 50,
        message: '长度在 1 到 50 个字符',
        trigger: 'blur'
      },
      max500: {
        max: 500,
        message: '长度在 1 到 500 个字符',
        trigger: 'blur'
      },
      rules: {
        drugCommonName: [
          {
            required: true,
            message: '请输入药品通用名称',
            trigger: 'change'
          },
          {
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        drugApprovalNumber: [
          {
            required: true,
            message: '请输入药品批准文号',
            trigger: 'blur'
          },
          {
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        drugManufacturer: [
          {
            required: true,
            message: '请输入药品生产商名称',
            trigger: 'blur'
          },
          {
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        drugDosageForm: [
          {
            required: true,
            message: '请输入药品剂型，如：颗粒',
            trigger: 'blur'
          },
          {
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        drugUnit: [
          {
            required: true,
            message: '请输入药品单位，如：粒',
            trigger: 'blur'
          },
          {
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        drugSpecification: [
          {
            required: true,
            message: '请输入商品规格，如：0.25克*30粒',
            trigger: 'blur'
          },
          {
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        usageMethod: [
          {
            required: true,
            message: '请输入药品使用方法，如：口服',
            trigger: 'blur'
          },
          {
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        usageFrequencyUnit: [
          {
            required: true,
            message: '请输入用法用量',
            trigger: 'blur'
          },
          {
            pattern: regexps.positiveInteger.reg,
            message: regexps.positiveInteger.msg,
            trigger: 'blur'
          },
          ,
          {
            validator: usageFrequencyUnitValidator,
            trigger: 'blur'
          }
        ],
        usageDays: [
          {
            required: true,
            message: '请输入服用天数',
            trigger: 'blur'
          },
          {
            pattern: regexps.positiveInteger.reg,
            message: regexps.positiveInteger.msg,
            trigger: 'blur'
          }
        ]
      }
    };
  },

  watch: {
    'form.drugType'(newVal) {
      this.form.validateTimeUnit = Number(this.form.validateTimeUnit);
      this.$refs.drugForm.clearValidate();
      if (this.form.drugType && !this.form.usagePerUseUnit) {
        this.form.usagePerUseUnit = '粒';
      }
    }
  },
  computed: {
    isRequired() {
      return this.form.drugType === drugEnum.drugType.drug;
    }
  },

  mounted() {
    this.form = this.data || {};
  },
  methods: {
    FormValidate() {
      let validate = true;
      this.$refs.drugForm.validate(valid => {
        validate = valid;
      });
      return validate;
    }
  }
};
</script>
