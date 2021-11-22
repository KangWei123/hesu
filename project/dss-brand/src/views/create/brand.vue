<template>
  <div class="brand" v-loading="loading">
    <el-form ref="form" :model="form" size="mini" :rules="rules">
      <el-form-item prop="logo" class="el-form-item-image">
        <img class="icon" v-if="form.logo" :src="form.logo" />
        <img class="icon" v-else :src="require('@/dss-common/img/brand/logo-default.png')" />
        <add-image @success="onLogoUploadSuccess" class="add-image">
          <a href="javascript:;" class="dss-upload-title">修改品牌logo</a>
        </add-image>
      </el-form-item>

      <el-form-item label="品牌名称：" prop="name">
        <el-input clear="brand-input" placeholder="请输入品牌名称" v-model.trim="form.name"></el-input>
      </el-form-item>

      <el-form-item label="品牌行业：" prop="industryTypeId" class="el-form-item-industryType">
        <div class="industryType-box">
          <div
            class="industry"
            v-for="(item, index) in industryTypeList"
            :key="index"
            :style="'background:url(' + item.bgImage + ') no-repeat;background-size: 100% 100%;'"
            :class="[
              item.type === selectedIndustryType.type ? 'selected-industryType' : '',
              disabled ? 'disabled' : ''
            ]"
            @click="choiceIndustry(item)"
          >
            <p class="name">{{ item.name }}</p>
            <div class="selected-logo-box">
              <img class="selected-logo" :src="require('@/dss-common/img/brand/selected.png')" />
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="主营业务：" prop="industryId">
        <el-select v-model.trim="form.industryId" placeholder="请选择主营业务" :disabled="disabled">
          <el-option
            v-for="(item, index) in industryList"
            :key="index"
            :label="item.name"
            :value="item.id"
            :disabled="item.id === 'optionDisabled'"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="负责人姓名：" prop="contactsName">
        <el-input clear="brand-input" placeholder="请输入负责人姓名" v-model.trim="form.contactsName"></el-input>
      </el-form-item>

      <el-form-item label="负责人电话：" prop="contactsPhone">
        <el-input clear="brand-input" placeholder="请输入负责人电话" v-model.trim="form.contactsPhone"></el-input>
      </el-form-item>

      <el-form-item label="客服电话：" prop="servicePhone">
        <el-input clear="brand-input" placeholder="请输入客服电话" v-model.trim="form.servicePhone"></el-input>
      </el-form-item>

      <el-form-item prop="agreement" class="el-form-item-agreement">
        <el-checkbox v-model.trim="form.agreement">我已阅读并同意</el-checkbox>
        <a href="javascript:;" @click="clickAgreement" class="agreement-text">《惟客数据产品及服务协议》</a>
      </el-form-item>
    </el-form>

    <div class="btn-box">
      <el-button type="primary" @click="onNext('form')">下一步 </el-button>
    </div>

    <agreement-dialog :visible.sync="dialog.agreement" protocol="wkb-product" style="text-align: left;">
    </agreement-dialog>
  </div>
</template>
<script>
import './brand.less';
import { mapState } from 'vuex';
import AddImage from '@/dss-wechat3rd/src/components/materials/addImage.vue';
import AgreementDialog from '@/dss-wechat3rd/src/bz_components/agreement/AgreementDialog';
import api from '@/dss-brand/src/api';
import regexps from '@/dss-common/utils/regexps';
import wpBaseApi from '@/business-common/wp-base-api.js';
import storeUser from '@/business-common/store_user.js';

export default {
  mixins: [storeUser],
  components: {
    AddImage,
    AgreementDialog
  },
  data() {
    //验证选择的品牌行业
    const checkIndustryType = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择品牌行业'));
      }
      return callback();
    };
    // 验证是否同意服务协议
    const checkAgreement = (rule, value, callback) => {
      if (!value) {
        return callback('请同意服务协议');
      }
      return callback();
    };

    return {
      loading: false,
      disabled: false, // 禁止点击
      form: {
        logo: null,
        name: null,
        industryTypeId: null,
        industryId: null,
        contactsName: null,
        contactsPhone: null,
        servicePhone: null,
        agreement: false
      },
      // 行业类型列表
      industryTypeList: [
        {
          name: '零售',
          id: 3,
          type: 'retail',
          key: 'retail',
          bgImage: require('@/dss-common/img/brand/industry/logo-retail.png')
        },
        {
          name: '鞋服',
          id: 42,
          type: 'costume',
          key: 'costume',
          bgImage: require('@/dss-common/img/brand/industry/logo-shoesAndClothing.png')
        },
        {
          name: '教育',
          id: 43,
          type: 'education',
          key: 'education',
          bgImage: require('@/dss-common/img/brand/industry/logo-education.png')
        },
        {
          name: '美业',
          id: 1,
          type: 'beautiful',
          key: 'beautiful',
          bgImage: require('@/dss-common/img/brand/industry/logo-beautyIndustry.png')
        },
        {
          name: '生鲜',
          id: 44,
          type: 'fresh',
          key: 'fresh',
          bgImage: require('@/dss-common/img/brand/industry/logo-fresh.png')
        },
        {
          name: '健身',
          id: 45,
          type: 'fitness',
          key: 'fitness',
          bgImage: require('@/dss-common/img/brand/industry/logo-bodybuilding.png')
        },
        {
          name: '旅游',
          id: 31,
          type: 'tourism',
          key: 'tourism',
          bgImage: require('@/dss-common/img/brand/industry/logo-tourism.png')
        },
        {
          name: '医药',
          id: 46,
          type: 'medicine',
          key: 'medicine',
          bgImage: require('@/dss-common/img/brand/industry/logo-medicine.png')
        },
        {
          name: '家居',
          id: 80,
          type: 'home',
          key: 'home',
          bgImage: require('@/dss-common/img/brand/industry/logo-home.png')
        },
        {
          name: '地产',
          id: 88,
          type: 'estate',
          key: 'estate',
          bgImage: require('@/dss-common/img/brand/industry/logo-estate.png')
        }
      ],
      // 选中的行业类型
      selectedIndustryType: {
        name: null,
        id: null,
        type: null
      },
      // 主营业务列表
      industryList: [
        {
          id: 'optionDisabled',
          name: '请先选择品牌行业'
        }
      ],
      // 服务协议弹框
      dialog: {
        agreement: false
      },
      rules: {
        name: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { pattern: regexps.simpleName.reg, message: '品牌名称字母、数字或汉字 组成', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
            trigger: 'blur'
          }
        ],
        industryTypeId: [{ required: true, validator: checkIndustryType, trigger: 'change' }],
        industryId: [{ required: true, message: '请选择主营业务', trigger: 'change' }],
        contactsName: [
          { required: true, message: '请输入负责人姓名', trigger: 'blur' },
          { pattern: regexps.simpleName.reg, message: '请输入正确的负责人姓名', trigger: 'blur' },
          {
            min: 1,
            max: 8,
            message: '长度在 1 到 8 个字符',
            trigger: 'blur'
          }
        ],
        contactsPhone: [
          { required: true, message: '请输入负责人电话', trigger: 'blur' },
          { pattern: regexps.phone.reg, message: '请输入正确的负责人电话', trigger: 'blur' }
        ],
        servicePhone: [{ pattern: regexps.servicePhone.reg, message: regexps.servicePhone.msg, trigger: 'blur' }],
        agreement: [{ validator: checkAgreement, trigger: ['blur', 'change'] }]
      }
    };
  },

  computed: {
    ...mapState({
      curApp: 'curApp',
      global_info: 'global_info'
    })
  },

  mounted() {
    // 默认填充当前账号注册时所填写的用户名及手机号码为负责人姓名及电话
    if (this.global_info) {
      const userName = this.global_info.userName || null;
      if (userName && !/^[0-9]*$/.test(userName)) {
        this.form.contactsName = userName;
      }
      this.form.contactsPhone = this.global_info.userPhone || null;
    }

    this.queryIndustryType(); // 查询品牌行业类目
  },

  methods: {
    // 查询品牌行业类目
    queryIndustryType() {
      this.loading = true;
      api
        .queryIndustry(0)
        .then(res => {
          const { data } = res;
          if (data && data.length) {
            this.industryTypeList.forEach(item => {
              data.forEach(item1 => {
                if (item.key === item1.key) {
                  item.id = item1.id;
                }
              });
            });
          }

          this.initBrandInfo(); // 初始化品牌信息
        })
        .always(data => {
          this.loading = false;
        });
    },

    /**
     * 初始化品牌信息
     * */
    initBrandInfo() {
      const brandForm = this.form;
      brandForm.logo = this.curApp.logo || null;
      brandForm.name = this.curApp.name || null;
      brandForm.industryId = this.curApp.categoryId || null;
      brandForm.industryTypeId = this.curApp.industryId || null;
      brandForm.contactsName = this.curApp.contactsName || null;
      brandForm.contactsPhone = this.curApp.contactsPhone || null;
      brandForm.servicePhone = this.curApp.servicePhone || null;
      const selectedIndustryType = this.industryTypeList.find(item => {
        return item.type === this.curApp.industryKey;
      });
      if (selectedIndustryType) {
        this.disabled = true; // 如果已有品牌行业，则不允许选择品牌行业及主营业务
        this.selectedIndustryType = selectedIndustryType;
        this.queryIndustryList(); // 查询主营业务列表
      }
    },

    /**
     * 修改品牌logo
     */
    onLogoUploadSuccess(url) {
      this.form.logo = url;
    },

    /**
     * 选择品牌行业
     * @param item
     */
    choiceIndustry(item) {
      // 判断是否允许选择品牌行业及主营业务
      if (this.disabled) {
        return false;
      }

      if (this.selectedIndustryType.type === item.type) {
        // 选中的品牌行业
        this.selectedIndustryType = {
          name: null,
          id: null,
          type: null
        };
        // 主营业务列表
        this.industryList = [
          {
            id: 'optionDisabled',
            name: '请先选择品牌行业'
          }
        ];
      } else {
        this.selectedIndustryType = item;
        this.queryIndustryList(); // 查询主营业务列表
      }

      // 选中的品牌行业id
      this.form.industryTypeId = this.selectedIndustryType.id;
      // 手动触发品牌行业的验证
      this.$refs.form.validateField('industryTypeId');

      // 切换品牌行业的时候取消选中的主营业务
      this.form.industryId = null;
    },

    /**
     * 查询主营业务列表
     */
    queryIndustryList() {
      this.loading = true;
      api
        .queryIndustry(this.selectedIndustryType.id)
        .then(res => {
          // 主营业务列表
          this.industryList = res.data;
        })
        .always(() => {
          this.loading = false;
        });
    },

    /**
     * 点击协议 todo
     */
    clickAgreement() {
      this.dialog.agreement = true;
    },

    /**
     * 点击下一步
     * @param form
     */
    onNext(form) {
      // 验证表单内容是否正确
      this.$refs[form].validate(valid => {
        if (valid) {
          const params = {
            logo: this.form.logo,
            name: this.form.name,
            industryId: this.form.industryId,
            contactsName: this.form.contactsName,
            contactsPhone: this.form.contactsPhone,
            servicePhone: this.form.servicePhone
          };

          // 判断是否已有品牌信息
          if (!this.curApp) {
            this.addBrand(params); // 创建品牌信息
            return;
          } else {
            this.updateBrand(params); // 更新品牌信息
          }
        } else {
          return false;
        }
      });
    },

    /**
     * 创建品牌信息
     */
    addBrand(params) {
      this.loading = true;

      api
        .addBrand(params)
        .then(() => {
          this.$message({
            message: '创建品牌信息成功！',
            type: 'success',
            duration: 2000
          });
          setTimeout(() => {
            this.checkWpLogin(); //检查登录，重新更新本地品牌信息
          }, 2000);
        })
        .catch(() => {
          this.$message.error('创建品牌信息失败，请重试');
        })
        .always(() => {
          this.loading = false;
        });
    },

    /**
     * 更新品牌信息
     */
    updateBrand(params) {
      params.id = this.curApp.id;

      this.loading = true;

      api
        .updateBrand(params)
        .then(res => {
          this.$message({
            message: '更新品牌信息成功！',
            type: 'success',
            duration: 2000
          });
          setTimeout(() => {
            this.checkWpLogin(); //检查登录，重新更新本地品牌信息
          }, 2000);
        })
        .catch(() => {
          this.$message.error('更新品牌信息失败，请重试');
        })
        .always(() => {
          this.loading = false;
        });
    },

    /**
     * 检查登录，重新更新本地品牌信息
     */
    checkWpLogin() {
      // 获取品牌信息
      this.loading = true;

      wpBaseApi
        .checkWpLogin()
        .then(res => {
          // 更新当前品牌信息
          this.update_userInfo(res.data);
        })
        .always(() => {
          this.loading = false;

          //跳转选购功能页面
          this.$router.push({
            path: '/create/function',
            query: {
              isAllow: 1
            }
          });
        });
    }
  }
};
</script>
