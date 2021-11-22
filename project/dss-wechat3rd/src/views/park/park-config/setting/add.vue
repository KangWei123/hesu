<template>
  <el-dialog
    :title="isEdit ? '编辑规则' : '新增规则'"
    width="500px"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" v-loading="loading" class="add-form">
      <el-form-item label="规则生效时间：" prop="timeRuleRadio">
        <el-select v-model="form.timeRuleRadio">
          <el-option v-for="(item, index) in timeList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="积分抵扣类型：" prop="discountRadio">
        <el-select v-model="form.discountRadio">
          <el-option
            v-for="(item, index) in discountList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="积分使用规则：" prop="discountScore">
        <el-input style="width: 80px" v-model.trim="form.discountScore"></el-input>
        <span class="text">积分 =</span>
        <el-input style="width: 80px" v-model.trim="form.discountValue"></el-input
        ><span>{{ form.discountRadio === 1 ? ' 元' : ' 分钟' }}</span>
      </el-form-item>

      <el-form-item label="积分使用限制：" prop="limitNum">
        <el-radio-group v-model="isLimitNum">
          <div class="radio-item">
            <el-radio :label="0"> 不限制</el-radio>
          </div>
          <div class="radio-item">
            <el-radio :label="1"
              >每日
              <el-input style="width: 80px" :disabled="!isLimitNum" v-model.trim="form.limitNum"></el-input>
              次</el-radio
            >
          </div>
        </el-radio-group>
      </el-form-item>
      <div class="btmDiv">
        <el-button @click="cancelOpt" class="cancelBtn">取消 </el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
  import parkApi from '@/dss-wechat3rd/src/api/park';
  import RegExps from '@/dss-common/utils/regexps';

  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false,
      },
      isEdit: {
        type: Boolean,
        default: false,
      },
      editObj: {
        type: Object,
        default: {},
      },
    },
    model: {
      prop: 'isShow',
      event: 'input',
    },
    computed: {
      isVisible: {
        get() {
          return this.isShow;
        },
        set(show) {
          this.$emit('input', show);
        },
      },
    },
    data() {
      const that = this;
      const checkLimit = (rule, value, callback) => {
        if (that.isLimitNum && !value) {
          return callback(new Error('请输入积分使用限制'));
        }

        if (that.isLimitNum && !RegExps.littleeIntNum.reg.test(value)) {
          return callback(new Error('输入数值范围在1~9999999的整数'));
        }
        return callback();
      };
      const checkDiscountScore = (rule, value, callback) => {
        if (!that.form.discountValue || !value) {
          return callback(new Error('请输入积分使用规则'));
        }

        if (!RegExps.littleeIntNum.reg.test(that.form.discountValue) || !RegExps.littleeIntNum.reg.test(value)) {
          return callback(new Error('输入数值范围在1~9999999的整数'));
        }
        return callback();
      };
      return {
        loading: false,
        form: {
          timeRuleRadio: 1,
          discountRadio: 1,
          discountScore: null,
          discountValue: null,
          limitNum: null,
        },
        isLimitNum: 0,
        timeList: [
          { label: '全部时段', value: 1 },
          { label: '周末', value: 2 },
          { label: '工作日', value: 3 },
        ],
        discountList: [
          { label: '金额', value: 1 },
          { label: '时长', value: 2 },
        ],
        rules: {
          discountScore: [{ validator: checkDiscountScore, trigger: 'blur' }],
          limitNum: [{ validator: checkLimit, trigger: 'blur' }],
        },
      };
    },
    mounted() {
      if (this.isEdit) {
        this.queryDetail();
      }
    },

    methods: {
      queryDetail() {
        this.form = this.$plain(this.editObj || {});
        if (this.form.discountRadio == 1) {
          this.form.discountValue = this.form.discountValue / 100;
        }
        if (this.form.limitNum) {
          this.isLimitNum = 1;
        }
      },

      save() {
        this.$refs.form.validate(valid => {
          if (!valid) {
            return;
          }
          const params = {
            timeRuleRadio: this.form.timeRuleRadio,
            discountRadio: this.form.discountRadio,
            discountScore: this.form.discountScore,
            discountValue: this.form.discountValue,
            limitNum: Number(this.form.limitNum),
            status: this.form.status || 0,
            appScoreRuleId: this.form.appScoreRuleId,
          };
          if (!this.isLimitNum) {
            params.limitNum = 0;
          }
          // 金额转成分
          if (params.discountRadio == 1) {
            params.discountValue = params.discountValue * 100;
          }
          if (this.isEdit) {
            params.id = this.editObj.id;
          }
          this.isVisible = false;
          this.$emit('saveSuccess', params);
        });
      },

      cancelOpt() {
        this.isVisible = false;
      },
    },
  };
</script>

<style scoped lange="less">
  .add-form {
    text-align: left;
    padding: 0 20px;
  }

  .tipText {
    font-size: 14px;
    margin-left: 6px;
    line-height: 25px;
    font-family: PingFangSC-Regular;
  }

  .wkbItem {
    display: block;
  }

  .topDiv {
    margin-bottom: 20px;
  }

  .btmDiv {
    padding-bottom: 40px;
    text-align: center;
  }

  .numInput {
    width: 100px;
    margin-bottom: 10px;
    height: 25px;
  }

  .cancelBtn {
    margin-right: 100px;
  }

  .radio-item {
    line-height: 40px;
    white-space: break-spaces;
    text-align: left;
  }

  .rule-text {
    margin-left: 26px;
    position: relative;
    top: -25px;
    white-space: break-spaces;
  }

  .text {
    margin: 0 8px;
  }
</style>
