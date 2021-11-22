<template>
  <el-dialog title="分配线索" :visible.sync="dialogVisible" width="550px">
    <el-form label-position="right" :model="form" :rules="rules" ref="Form" label-width="110px">
      <el-form-item label-width="30px">
        <el-checkbox class="employee-check" v-model="form.checkEmployee"></el-checkbox>
        <el-form-item style="display: inline-block" label-width="82px" prop="employeeIds" label="门店导购：">
          <el-select
            :disabled="!form.checkEmployee"
            :loading="loading.guide"
            size="mini"
            multiple
            value-key="id"
            @change="setRatioOptions"
            v-model="form.employeeIds"
            placeholder="请选择导购"
            filterable
            clearable
          >
            <el-option v-for="item in employees" :key="item.id" :label="item.name" :value="item" />
          </el-select> </el-form-item
        ><br />
      </el-form-item>
      <el-form-item prop="elecSales" label="分配规则：">
        <template>
          <el-radio size="small" v-model="form.ruleType" :label="1">随机平均分配</el-radio>
          <el-radio size="small" v-model="form.ruleType" :label="2">指定分配数（已选中{{ clueNum }}人）</el-radio>
        </template>
      </el-form-item>
      <div v-if="form.ruleType == 2">
        <div v-for="(item, index) in form.ratioBox" :key="index">
          <el-form-item
            label-width="200px"
            :rules="rules.checkRatio"
            :prop="`ratioBox.${index}.value`"
            :key="index"
            :label="`${item.name}：`"
          >
            <el-input v-model.number="item.value" maxlength="20" placeholder="请输入" style="width: 50%"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="warn-tips">{{ tips }}</div>
      <span class="tips">说明：已有导购跟进小区线索将不会被分配</span>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button v-loading="loading.submit" type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import api from '@/mod-member/src/api/manage-store.js';
  export default {
    props: {
      visible: {},
      estateId: {
        type: Number,
        default: null,
      },
      storeId: {
        type: Number,
        default: null,
      },
      isRefresh: {
        type: Function,
      },
      clueNum: {
        type: Number,
        default: null,
      },
    },

    data() {
      const checkNo = (rule, value, callback) => {
        const reg = /^[1-9]{1}[0-9]*$/;
        if (this.form.ruleType != 2) {
          callback();
        } else if (!value) {
          callback('请输入分配数量');
        } else if (!reg.test(value)) {
          callback('请正确输入分配数量');
        } else {
          callback();
        }
      };
      return {
        form: {
          employeeIds: null, // 选中导购
          ruleType: 1,
          ratioBox: [], // 加上外包电销的选择
          checkEmployee: true,
        },
        employees: [],
        rules: {
          checkRatio: [{ required: true, validator: checkNo, trigger: 'change' }],
        },
        loading: {
          guide: false,
          submit: false,
        },
        tips: '',
      };
    },
    watch: {
      'form.employeeIds': {
        handler(nVal, oVal) {
          this.setRatioOptions();
        },
      },
      'form.ruleType': {
        handler(nVal, oVal) {
          this.setRatioOptions();
        },
      },
      'form.ratioBox.length': {
        handler(nVal, oVal) {
          if (nVal) {
            this.tips = null;
          }
        },
      },
      'form.checkEmployee': {
        handler(nVal, oVal) {
          if (!nVal) this.form.employeeIds = [];
        },
      },
    },
    methods: {
      onSubmit() {
        this.$refs.Form.validate(valid => {
          if (!valid) return;
          // 验证分配数量相加
          const sum = this.form.ratioBox.reduce((pre, cur) => pre + cur.value, 0);
          if (!this.form.ratioBox.length) {
            this.tips = '线索分配不能为空';
            return false;
          } else if (this.form.ruleType == 2 && sum != this.clueNum) {
            this.tips = `请正确填写，可分配线索数量为${this.clueNum}`;
            return false;
          } else {
            this.tips = '';
          }
          this.loading.submit = true;
          const employeeRateDTOList = this.form.ratioBox.map(item => {
            return {
              employeeId: item.id,
              rate: item.value,
            };
          });
          // 随机分配规则清空比例
          if (this.form.ruleType == 1) {
            employeeRateDTOList.forEach(item => (item.rate = null));
          }
          const params = {
            estateId: this.estateId,
            distributeRule: this.form.ruleType,
            employeeRateDTOList,
          };
          api
            .batchEstateList(params)
            .then(res => {
              this.dialogVisible = false;
              this.$emit('showTipDialog', res.data);
              this.isRefresh();
              this.$refs.Form.resetFields();
            })
            .catch(err => {
              this.$message.error(err.message);
            })
            .always(() => {
              this.loading.submit = false;
            });
        });
      },
      getEmployees() {
        this.loading.guide = true;
        api
          .queryGuideList({
            storeId: this.storeId,
            queryAll: true,
            positionIds: 'common_role_storeKeeper,common_role_sales',
          })
          .then(({ data }) => {
            this.employees = (data || []).map(item => {
              return {
                id: item.id,
                name: item.name,
              };
            });
          })
          .finally(() => {
            this.loading.guide = false;
          });
      },
      setRatioOptions() {
        this.form.ratioBox = [];
        this.form.ratioBox.push(...this.form.employeeIds);
      },
    },

    computed: {
      dialogVisible: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        },
      },
    },
    mounted() {
      this.getEmployees();
    },
  };
</script>
<style lang="less" scoped>
  .employee-check {
    margin: 10px 0 0 0;
    vertical-align: top;
    margin-right: 0;
  }
  .tips {
    color: #999;
    margin-left: 30px;
  }
  .warn-tips {
    padding-left: 17%;
    color: #fb4938;
    font-size: 12px;
  }
</style>
