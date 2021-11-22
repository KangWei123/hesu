<template>
  <div v-loading="isLoading"
       class="pintuan-activity-setting wkb-market-setting">
    <div class="setting">
      <el-form label-width="100px"
               :disabled="!isEnterManger"
               ref="elForm"
               :model="form"
               :rules="rules"
               class="setting-from"
               size="mini">
        <div class="title">拼团规则</div>
        <el-form-item label="规则名称："
                      prop="title">
          <el-input v-model="form.title"
                    placeholder="请输入标题"
                    @blur="removeSpace('title')"></el-input>
        </el-form-item>
        <el-form-item label="规则说明："
                      prop="content">
          <el-input v-model="form.content"
                    type="textarea"
                    :rows="6"
                    placeholder="请输入说明"></el-input>
        </el-form-item>
        <div class="title">
          <div>海报设置</div>
          <div class="poster-preview-box-new">
            <div class="poster-preview">
              <div class="phone-head"></div>
              <img class="poster-img"
                   src="../../../images/marketing/bg-poster-preview-new.png" />
              <div class="nick-header-box"
                   v-if="form.posterType === posterTypeEnum.classify.value">
                <div class="nick-header">
                  <img class="nick-img"
                       src="../../../../../dss-common/img/avatar-default.jpg" />
                  <div class="nick-name">王安筠向你推荐</div>
                  <div class="poster-content">{{form.posterContent || '物美价廉的好货，赶紧来拼团吧！'}}</div>
                </div>
              </div>
              <img class="customer-header"
                   :src="form.posterLogo.imgUrl"
                   v-if="form.posterType === posterTypeEnum.custom.value" />
              <div class="poster-label">拼团价</div>
              <!-- <div class="label-price">活动结束价: ￥300</div> -->
            </div>
          </div>
        </div>
        <el-form-item label="样式设置："
                      prop="posterContent">
          <el-radio v-model="form.posterType"
                    style="display: block;margin-top: 6px;margin-bottom: 10px;"
                    :label="posterTypeEnum.classify.value">{{posterTypeEnum.classify.label}}</el-radio>
          <el-input v-model="form.posterContent"
                    maxlength="15"
                    placeholder="请输入文案内容"
                    @blur="removeSpace('posterContent')"></el-input>
          <div class="img-notes">默认文案：物美价廉的好货，赶紧来拼团吧！(最长15个字符)</div>
        </el-form-item>
        <el-form-item prop="posterLogo">
          <el-radio v-model="form.posterType"
                    style="display: block;margin-bottom: 10px;"
                    :label="posterTypeEnum.custom.value">{{posterTypeEnum.custom.label}}</el-radio>
          <image-selector :canReset="false"
                          v-model="form.posterLogo"
                          @delete="onDeleteImg" />
          <div class="img-notes">建议尺寸：513x90，图片不大于1M</div>
        </el-form-item>
      </el-form>

    </div>
    <div class="bottom-button">
      <el-button @click="onSave"
                  type="primary">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ImageSelector from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import regexps from '@/dss-common/utils/regexps.js';
import groupApi from '@/dss-wechat3rd/src/api/group.js';
import posterTypeEnum from '@/dss-wechat3rd/src/constants/poster-type-enum.js';
import '../marketing.less';

export default {
  components: {
    ImageSelector
  },
  data() {
    // 自定义海报校验
    const checkPosterLogo = (rule, value, callback) => {
      if (this.form.posterType === posterTypeEnum.custom.value && (!value || !value.imgUrl)) {
        return callback('请选择自定义海报图片');
      }
      return callback();
    };

    return {
      posterTypeEnum,
      form: {
        title: '',
        content: '',
        posterType: posterTypeEnum.classify.value,
        posterContent: '',
        posterLogo: {
          id: '',
          imgUrl: ''
        }
      },
      rules: {
        title: [
          {
            required: true,
            message: '请输入标题'
          },
          {
            max: 20,
            message: '长度在20个字符内',
            trigger: 'blur'
          },
          {
            pattern: regexps.name.reg,
            message: regexps.name.msg,
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '请输入说明'
          },
          {
            max: 200,
            message: '长度在200个字符内',
            trigger: 'blur'
          }
        ],
        posterLogo: [
          {
            validator: checkPosterLogo.bind(this),
            trigger: ['blur', 'change']
          }
        ]
      },
      isLoading: true
    };
  },

  watch: {
    // 监听海报样式设置类型变更
    'form.posterType'(newVal, oldVal) {
      // 手动触发自定义海报验证
      this.$refs.elForm.validateField('posterLogo');
    },
    // 监听自定义海报链接变更
    'form.posterLogo': {
      deep: true,
      handler(newVal, oldVal) {
        // 手动触发自定义海报验证
        this.$refs.elForm.validateField('posterLogo');
      }
    }
  },

  mounted() {
    this.fetchData();
  },
  methods: {
    onDeleteImg() {
      this.form.posterLogo = {
        id: '',
        imgUrl: ''
      };
    },
    onSave() {
      this.$refs.elForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.save();
      });
    },
    save() {
      this.isLoading = true;
      const params = { ...this.form };
      if (this.form.posterLogo) {
        const posterLogo = this.form.posterLogo.imgUrl;
        delete params.posterLogo;
        params.posterLogo = posterLogo;
      }
      this.isLoading = true;
      groupApi
        .updateActitvitySetting(params)
        .done(res => {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        })
        .always(() => {
          this.isLoading = false;
        });
    },
    fetchData() {
      this.isLoading = true;
      groupApi
        .getActivitySetting()
        .done(res => {
          const data = res.data;
          this.form.title = data.title;
          this.form.content = data.content;
          this.form.posterType = data.posterType || posterTypeEnum.classify.value;
          this.form.posterContent = data.posterContent;
          this.form.posterLogo = {
            id: '',
            imgUrl: data.posterLogo
          };
        })
        .always(() => {
          this.isLoading = false;
        });
    },

    //去除等级名称输入框的前后空格
    removeSpace(key) {
      this.form[key] = this.form[key] ? this.form[key].replace(/(^\s*)|(\s*$)/g, '') : '';
    }
  },

  computed: {
    ...mapState({ roleList: 'roleList' }),
    //key管/企业管理员享有相同权限
    isEnterManger() {
      return (
        !!~this.roleList.split(',').indexOf('common_role_enterprise') ||
        !!~this.roleList.split(',').indexOf('common_role_admin')
      );
    }
  }
};
</script>

<style lang="less">
.pintuan-activity-setting {
  .setting {
    background: white;
    padding: 10px 20px;
    .img-notes {
      color: #A1A4AB;
    }
  }

  .setting-from {
    max-width: 505px;
  }

  .setting-img {
    .avatar {
      width: 440px;
      height: 153px;
    }
  }

  .title {
    font-weight: bold;
    color: rgba(49, 52, 59, 1);
    font-size: 14px;
    line-height: 19px;
    margin-bottom: 21px;
  }
  
}
</style>
