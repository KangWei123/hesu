<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400px" v-loading="loding" :before-close="handleClose">
    <el-form
      class="dss-member-editor-form"
      :model="form"
      :rules="rules"
      ref="form"
      label-width="110px"
      v-loading="loading"
    >
      <el-form-item label="姓名：" prop="realName" :disabled="disabled">
        <el-input v-model="form.realName" :disabled="disabled" clearable></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="phone">
        <el-input v-model="form.phone" maxlength="11"></el-input>
        <i class="el-icon-loading" style="margin-left: 10px" v-show="loadingCheck"></i>
        <div v-if="showTips" class="warn-tips">{{ tips }}</div>
      </el-form-item>
      <el-form-item label="性别：" prop="gender">
        <el-radio v-model="form.gender" :label="1" :disabled="disabled">男</el-radio>
        <el-radio v-model="form.gender" :label="2" :disabled="disabled">女</el-radio>
      </el-form-item>
      <el-form-item label="出生年月：" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          style="width: 270px"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          :disabled="disabled"
          :picker-options="pickerOptions"
          :readonly="loadingCheck"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="选择区域：">
        <area-select
          ref="area-select"
          @change="handleChangeArea"
          @clear="handleChangeArea"
          :init-area="initArea"
          :disabled="disabled"
          :readonly="loadingCheck"
          class="area-select-item"
        />
      </el-form-item>
      <el-form-item v-if="!isCue" label="选择导购：" prop="bindEmployeeId">
        <el-select
          v-model="form.bindEmployeeId"
          placeholder="请选择"
          :no-data-text="guideList ? null : '暂无数据...'"
          :disabled="addDisabled"
          :readonly="loadingCheck"
        >
          <el-option v-for="item in guideList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <div v-if="showTips && guideName" class="warn-tips">原导购为：</div>
      </el-form-item>
      <el-form-item label="客户来源：" prop="customerSource">
        <el-select v-model="form.customerSource" placeholder="请选择" :disabled="addDisabled" :readonly="loadingCheck">
          <el-option v-for="(item, index) in sourceList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择小区：" prop="estateId">
        <el-select
          style="margin-right: auto"
          :loading="loadingPlot"
          placeholder="请选择"
          clearable
          filterable
          v-model="form.estateId"
          :disabled="addDisabled"
          :readonly="loadingCheck"
        >
          <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in plotList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="dss-btn-primary dss-btn-middle" type="primary" :disabled="addDisabled" @click="save('form')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer"></span>
  </el-dialog>
</template>

<script>
  import { mapState } from 'vuex';
  import api from '@/mod-member/src/api/manage-store.js';
  import regexps from '@/dss-common/utils/services';
  import AreaSelect from '../../components/AreaSelect';

  const DEFAULT_SOURCE_ID = 32; // 添加客户默认来源id
  export default {
    components: {
      AreaSelect,
    },
    props: {
      doSearch: Function,
      visible: {},
      storeId: {
        type: Number,
        default: null,
      },
      sourceList: {
        type: Array,
        default() {
          return [];
        },
      },
      title: {
        type: String,
        default: '新增客户',
      },
      guideList: {
        type: Array,
        default() {
          return [];
        },
      },
      plotList: {
        type: Array,
        default() {
          return [];
        },
      },
      // 是否为线索页面使用->新增区域选择器屏蔽选择导购
      isCue: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      const { name, phone } = regexps;
      const checkNum = (rule, value, callback) => {
        this.loadingCheck = false;
        if (!value) {
          this.handleClean();
          callback('请输入手机号码');
        } else if (value && !regexps.phone.reg.test(value)) {
          this.handleClean();
          callback('请输入正确的手机号码');
        } else if (value && regexps.phone.reg.test(value) && !this.loading) {
          // 保存的时候已经校验过，不再校验手机号
          this.checkPhone(value);
        }
        callback();
      };
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        loding: false,
        loadingPlot: false,
        loadingCheck: false,
        form: {
          realName: null,
          phone: null,
          gender: 1,
          birthday: null,
          bindEmployeeId: null,
          customerSource: null,
          estateId: null,
        },
        guideName: null,
        loading: false,
        area: {
          province: null,
          city: null,
          district: null,
        },
        rules: {
          realName: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            {
              min: 1,
              max: 20,
              message: '长度在 1 到 20 个字符',
              trigger: 'blur',
            },
          ],
          phone: [
            { required: true, message: '请输入您的手机号码', trigger: 'blur' },
            { validator: checkNum, trigger: 'change' },
          ],
          gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
          storeId: [{ required: true, message: '请选择门店', trigger: 'change' }],
          bindEmployeeId: [{ required: true, message: '请选择导购员', trigger: 'blur' }],
        },
        tips: '',
        showTips: false,
        disabled: false,
        addDisabled: false,
        initArea: [],
      };
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
      effectiveScope() {
        // 1企业一对一，2门店一对一
        return this.$store.state.dmp.effectiveScope;
      },
    },
    methods: {
      async checkPhone(val) {
        this.loadingCheck = true;
        try {
          const { data } = await api.getClientInfoByPhone({ phone: val });
          if (data) {
            const clientEmployeeBinds = data.clientEmployeeBinds || [];
            const hasStoreId = clientEmployeeBinds.some(item => item.storeId == this.storeId);

            // 企业一对一
            if (this.effectiveScope == 1) {
              this.tips = '该客户已存在';
              this.addDisabled = true;
            } else {
              if (hasStoreId) {
                this.tips = '该客户已存在当前门店，不可重复添加';
                this.addDisabled = true;
              } else {
                this.tips = '该客户已存在其他门店，可添加至当前门店';
              }
            }

            this.form.realName = data.realName || data.nickName;
            this.guideName = data.bindEmployeeName;
            this.form.birthday = data.birthday;
            this.form.gender = data.gender;
            this.initArea = [data.provinceId, data.cityId];
            this.disabled = true;
            this.showTips = true;
          } else {
            this.handleClean();
          }
        } finally {
          this.loadingCheck = false;
        }
      },
      handleClean() {
        this.form.realName = '';
        this.guideName = null;
        this.form.birthday = '';
        this.form.gender = 1;
        this.$refs['area-select'].clear();
        this.disabled = false;
        this.showTips = false;
        this.addDisabled = false;
      },
      handleClose() {
        this.showTips = false;
        this.disabled = false;
        this.addDisabled = false;
        this.dialogVisible = false;
        this.$refs.form.resetFields();
        this.$refs.form.clearValidate();
        this.$refs['area-select'].clear();
      },
      save() {
        this.loading = true;
        if (!this.disabled) {
          this.rules.realName.push({ pattern: regexps.name.reg, message: regexps.name.msg });
        }
        this.$refs.form
          .validate()
          .then(_ => {
            const { customerSource, ...params } = this.form;
            if (!customerSource) {
              params.source = DEFAULT_SOURCE_ID; // 默认企业添加
            } else {
              params.customerSource = customerSource;
            }
            const { province, city, district } = this.area;
            params.cityId = city;
            params.provinceId = province;
            params.districtId = district;
            params.isClient = !this.isCue;
            params.storeId = this.storeId;
            return api.addClientCue(params);
          })
          .then(res => {
            if (res.success) {
              this.$message({ type: 'success', message: '添加成功' });
              this.handleClose();
              this.doSearch();
            }
          })
          .finally(() => {
            if (!this.disabled) {
              this.rules.realName.pop();
            }
            this.loading = false;
          });
      },
      // 获取地址参数
      handleChangeArea(params) {
        this.area = { ...this.area, ...params };
      },
    },
    mounted() {},
  };
</script>

<style scoped lang="less">
  .warn-tips {
    color: #fb4938;
    font-size: 12px;
  }
  .info-box {
    background: #d9d9d9;
    padding: 20px 40px 20px 120px;
    font-size: 12px;
    line-height: 24px;
  }
  .dss-member-editor-form {
    /deep/.el-input,
    /deep/.el-input__inner {
      width: 190px;
    }
    /deep/.area-select-item {
      .el-input,
      .el-input__inner {
        width: 95px;
      }
    }
  }
</style>
