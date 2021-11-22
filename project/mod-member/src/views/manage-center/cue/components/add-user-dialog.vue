<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="460px" v-loading="loding" :before-close="handleClose">
    <el-form
      class="dss-member-editor-form"
      :model="form"
      :rules="rules"
      ref="form"
      label-width="110px"
      v-loading="loading"
    >
      <el-form-item label="姓名：" prop="realName">
        <el-input v-model="form.realName" clearable :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="phone">
        <el-input v-model="form.phone" maxlength="11"></el-input>
        <i class="el-icon-loading" style="margin-left: 10px" v-show="loadingCheck"></i>
        <div v-if="tips && !isEffectiveScope" class="warn-tips">
          该客户已存在，基础信息需保持一致，{{ form.storeId ? '可切换' : '请选择' }}门店后添加
        </div>
        <div v-if="tips && isEffectiveScope" class="warn-tips">该客户已存在</div>
      </el-form-item>
      <!-- <div v-if="isShowInfo" class="info-box">
        <div>姓名：{{clientInfo.realName || clientInfo.nickName}}</div>
        <div>手机号码：{{clientInfo.phone}}</div>
        <div>
          性别：
          <span v-if="clientInfo.gender==1">男</span>
          <span v-else-if="clientInfo.gender==2">女</span>
          <span v-else>--</span>
        </div>
        <div>出生年月：{{clientInfo.birthday || '--'}}</div>
        <div v-if="clientInfo.province">
          客户区域：
          {{clientInfo.province}}
          {{clientInfo.city}}
          {{clientInfo.district}}
        </div>
        <el-button
          class="dss-btn-primary dss-btn-middle"
          type="primary"
          style="margin-top:15px"
          @click="save('form')"
        >添加该客户</el-button>
      </div>-->
      <el-form-item label="性别：" prop="gender">
        <el-radio v-model="form.gender" :label="1" :disabled="disabled">男</el-radio>
        <el-radio v-model="form.gender" :label="2" :disabled="disabled">女</el-radio>
      </el-form-item>
      <el-form-item label="出生年月：" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          :disabled="disabled"
          :readonly="loadingCheck"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="选择区域：">
        <area-select
          ref="area-select"
          class="area-select-item"
          @change="handleChangeArea"
          @clear="handleChangeArea"
          :init-area="initArea"
          :disabled="disabled"
          :readonly="loadingCheck"
        />
      </el-form-item>

      <el-form-item label="选择门店：" v-if="storeList.length > 0" prop="storeId">
        <el-select
          placeholder="请选择"
          size="mini"
          @change="handleChangeStore"
          default-first-option
          v-model="form.storeId"
          :disabled="tips && isEffectiveScope"
          filterable
          clearable
        >
          <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择导购：" prop="bindEmployeeId">
        <el-select
          v-model="form.bindEmployeeId"
          placeholder="请选择"
          :disabled="tips && isEffectiveScope"
          :loading="loadingGuide"
          filterable
          clearable
        >
          <el-option v-for="item in guideList" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
        >
          <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in plotList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户来源：" prop="customerSource">
        <el-select
          v-model="form.customerSource"
          placeholder="请选择"
          :disabled="tips && isEffectiveScope"
          filterable
          clearable
        >
          <el-option
            v-for="(item, index) in custormerClientSource"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          class="dss-btn-primary dss-btn-middle"
          type="primary"
          :disabled="disabledSubmitBtn"
          @click="save('form')"
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
  import manageApi from '@/mod-member/src/api/manage.js';
  import regexps from '@/dss-common/utils/regexps';
  import AreaSelect from '../../components/AreaSelect.vue';
  const DEFAULT_SOURCE_ID = 32; // 添加客户默认来源id

  export default {
    components: { AreaSelect },
    props: {
      doSearch: Function,
      visible: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '新增客户',
      },
      // 自定义客户来源
      custormerClientSource: {
        type: Array,
        default() {
          return [];
        },
      },
      // 默认所有客户来源
      sourceList: {
        type: Array,
        default() {
          return [];
        },
      },
      // 门店
      storeList: {
        type: Array,
        default() {
          return [];
        },
      },
      // 是否是企业一对一账户
      isEffectiveScope: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      const { name, phone } = regexps;
      const checkNum = (rule, value, callback) => {
        this.loadingCheck = false;
        if (!value) {
          this.cleanInfo();
          callback('请输入手机号码');
        } else if (value && !regexps.phone.reg.test(value)) {
          this.cleanInfo();
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
        loadingGuide: false,
        loadingCheck: false,
        loading: false,
        form: {
          realName: null,
          phone: null,
          gender: 1,
          birthday: null,
          bindEmployeeId: undefined,
          isClient: true,
          customerSource: null, // 总部添加客户，需要把来源归为 自定义来源
          storeId: '',
          estateId: '',
        },
        area: {
          province: null,
          city: null,
          district: null,
        },
        guideList: [], // 导购列表
        plotList: [], // 小区列表
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
        },

        tips: false,
        isShowInfo: false,
        disabled: false,
        clientInfo: null,
        initArea: [], // 赋值初始化
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

      disabledSubmitBtn() {
        // 企业一对一，存在客户直接不能添加
        if (this.tips && this.isEffectiveScope) {
          return true;
        }
        if (
          !this.form.storeId || // 未选择门店，相对于添加线索
          !this.clientInfo || // 当前手机号未匹配到客户，即当前添加的为新客户
          !this.clientInfo.clientEmployeeBinds || // 匹配到存在客户，但未绑定导购
          !this.clientInfo.clientEmployeeBinds.length // 匹配到存在客户，但未绑定导购
        ) {
          return false;
        }
        // 门店一对一，存在客户判断是否已在当前选中门店
        return this.clientInfo.clientEmployeeBinds.some(item => item.storeId === this.form.storeId);
      },
    },
    watch: {},
    mounted() {
      this.guideObj = {};
    },
    methods: {
      async checkPhone(val) {
        this.loadingCheck = true;
        try {
          const { data } = await api.getClientInfoByPhone({ phone: val });
          if (data && this.loadingCheck) {
            this.clientInfo = data;
            this.tips = true;
            this.isShowInfo = true;
            this.disabled = true;

            let storeId = null;
            let bindEmployeeId = null;
            this.initArea = [this.clientInfo.provinceId, this.clientInfo.cityId];
            if (Array.isArray(data.clientEmployeeBinds) && data.clientEmployeeBinds.length > 0) {
              storeId = data.clientEmployeeBinds[0].storeId;
              bindEmployeeId = data.clientEmployeeBinds[0].employeeId;
            }

            this.form = {
              ...this.form,
              realName: this.clientInfo.realName || this.clientInfo.nickName,
              gender: this.clientInfo.gender,
              birthday: this.clientInfo.birthday,
              bindEmployeeId: null,
              storeId,
            };

            if (storeId && !this.isEffectiveScope) {
              this.guideList = [];
              this.getGuideList(storeId, bindEmployeeId);
            }
          } else {
            this.cleanInfo();
          }
        } finally {
          this.loadingCheck = false;
        }
      },
      // 获取小区列表
      async getEstateList(storeId) {
        this.loadingPlot = true;
        try {
          const { data } = await api.queryEstateList({ storeId });
          this.plotList = data || [];
        } catch (e) {
          console.error(e);
        } finally {
          this.loadingPlot = false;
        }
      },
      // 获取导购列表
      getGuideList(storeId, bindEmployeeId) {
        if (this.guideObj[storeId]) {
          if (bindEmployeeId) {
            this.form.bindEmployeeId = bindEmployeeId;
          }
          this.guideList = this.guideObj[storeId];
          return;
        }
        this.loadingGuide = true;
        manageApi
          .getClientGuideList({
            storeId,
            queryAll: true,
            positionIds: 'common_role_storeKeeper,common_role_sales',
          })
          .then(({ data }) => {
            if (!data) {
              return;
            }
            if (bindEmployeeId) {
              this.form.bindEmployeeId = bindEmployeeId;
            }
            this.guideList = data;
            this.guideObj[storeId] = data;
          })
          .finally(_ => {
            this.loadingGuide = false;
          });
      },
      handleClose() {
        this.dialogVisible = false;
        this.tips = false;
        this.disabled = false;
        this.isShowInfo = false;
        this.$refs.form.resetFields();
        this.$refs.form.clearValidate();
        this.$refs['area-select'].clear();
      },
      cleanInfo() {
        this.clientInfo = null;
        this.form = {
          ...this.form,
          realName: '',
          gender: 1,
          birthday: '',
          bindEmployeeId: null,
          storeId: null,
        };
        this.tips = false;
        this.disabled = false;
        this.isShowInfo = false;
        this.initArea = [];
        this.$refs['area-select'].clear();
      },
      handleChangeStore(storeId) {
        this.form.bindEmployeeId = null;
        this.form.estateId = null;
        this.guideList = [];
        this.plotList = [];
        if (storeId) {
          this.getGuideList(storeId);
          this.getEstateList(storeId);
        }
      },
      save() {
        this.loading = true;
        if (!this.disabled) {
          this.rules.realName.push({ pattern: regexps.name.reg, message: regexps.name.msg });
        }
        this.$refs.form
          .validate()
          .then(_ => {
            const { ...params } = this.form;
            params.provinceId = this.area.province;
            params.cityId = this.area.city;
            params.districtId = this.area.district;
            params.isClient = !!params.bindEmployeeId;
            if (!params.customerSource) {
              params.source = DEFAULT_SOURCE_ID; // 默认为企业添加
            } else {
              params.isCustomerSource = true;
            }

            // 如果没有选择门店，isClient则不需要传值
            if (!params.storeId) {
              delete params.isClient;
            }
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
      handleChangeArea(selected) {
        this.area = { ...this.area, ...selected };
      },
    },
    beforeDestroy() {
      this.guideObj = null;
    },
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

  .loading-icon {
    width: 20px;
    height: 20px;
  }
</style>
