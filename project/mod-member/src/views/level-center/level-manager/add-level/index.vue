<template>
  <form-page-layout
    class="form-page-layout-container"
    :model="form"
    :rules="rules"
    label-width="126px"
    :title-visible="false"
    :submit-handler="handleSubmit"
  >
    <form-group>
      <template #title>基本信息</template>
      <el-form-item label="会员等级" prop="levelNumber">
        <el-select class="w220" v-model="form.levelNumber" :disabled="status !== 0" @change="levelNumberChange">
          <el-option
            v-for="(item, index) in levelList"
            :key="index"
            :label="item.desc"
            :value="item.code"
            :disabled="item.disabled"
          ></el-option>
        </el-select>
        <br />
        <span class="tips">数字越大，等级越高</span>
      </el-form-item>
      <el-form-item label="等级名称" prop="levelName">
        <el-input class="w220" v-model.trim="form.levelName" placeholder="请输入等级名称"></el-input>
      </el-form-item>
      <el-form-item label="升级条件" prop="upgradeCondition" v-show="form.levelNumber !== 1">
        <el-input
          class="w220"
          type="number"
          :min="0"
          :max="999999"
          v-model="form.upgradeCondition"
          placeholder="请输入升级条件"
        />
        <span class="span">成长值</span><br />
        <div>
          <el-row :gutter="10">
            <el-col>
              <el-checkbox v-model="form.rules" @change="rulesChange">直升规则</el-checkbox>
            </el-col>
            <el-col v-if="form.rules">
              <el-form-item label="单日累计">
                <el-input
                  class="span-input"
                  type="number"
                  :min="1"
                  :max="999999"
                  v-model="form.directUpgradeRule.singleDay"
                  :disabled="!form.rules"
                ></el-input>
                <span class="span" style="margin-left: 0">成长值</span>
              </el-form-item>
            </el-col>
            <el-col v-if="form.rules">
              <!--  :rules="rules.month"  prop="month" -->
              <el-form-item label="连续30天累计">
                <el-input
                  class="span-input"
                  type="number"
                  :min="1"
                  :max="999999"
                  v-model="form.directUpgradeRule.month"
                  :disabled="!form.rules"
                ></el-input
                ><span class="span">成长值</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item label="保级条件" v-show="form.levelNumber !== 1">
        <el-input
          class="w220"
          type="number"
          :min="0"
          :max="999999"
          v-model="form.relegationRule.relegationCondition"
          placeholder="请输入保级条件"
        /><span class="span">成长值</span>
      </el-form-item>
      <el-form-item label="等级背景" prop="bgImgType">
        <el-radio-group v-model="form.bgImgType">
          <el-radio :label="0">默认</el-radio>
          <el-radio :label="1">自定义图片（建议375*210）</el-radio>
        </el-radio-group>
        <br />
        <img v-if="form.bgImgType === 0" class="img" :src="form.defaultImgUrl" alt="" />
        <choose-images
          v-else
          :value="{ imgUrl: form.imgUrl }"
          :height="210"
          :width="375"
          unique="dimensionsImg"
          @input="onExtraImageAdd"
          @delete="onExtraDeleteImg('dimensionsImg')"
        />
      </el-form-item>
    </form-group>

    <gifts :init-gifts="form.upgradeGifts" ref="gifts" />

    <template #footer>
      <form-button action="cancel" />
      <form-button />
    </template>
  </form-page-layout>
</template>

<script>
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import memberApi from '@/mod-member/src/api/memberAPI';
  import { ChooseImages } from '@/mod-member/ref';
  import Gifts from './gifts.vue';

  const validateLevelName = (rule, value, callback) => {
    if (value === undefined || value === '') {
      return callback(new Error('请输入等级名称'));
    } else if (value.length > 6) {
      return callback(new Error('等级名称的长度不要超过6个字'));
    } else callback();
  };
  const validateSingleDay = form => (rule, value, callback) => {
    if (form.rules && (form.directUpgradeRule.singleDay === undefined || form.directUpgradeRule.singleDay === '')) {
      return callback(new Error('请输入直升规则单日成长值条件'));
    } else callback();
  };
  const validateMonth = form => (rule, value, callback) => {
    if (form.rules && (form.directUpgradeRule.month === undefined || form.directUpgradeRule.month === '')) {
      return callback(new Error('请输入直升规则30天成长值条件'));
    } else callback();
  };

  export default {
    components: {
      FormPageLayout,
      FormGroup,
      FormButton,
      ChooseImages,
      Gifts,
    },
    data() {
      return {
        // 0: 新建， 1：编辑
        status: 0,
        levelList: [],
        form: {
          levelId: '',
          levelNumber: '',
          levelName: '',
          upgradeCondition: null,
          rules: false,
          defaultImgUrl: 'https://' + process.env.VUE_APP_CDN_DOMAIN + '/resources/dss-web-portal/cdn/vip/VIP_0.png',
          imgUrl: '',
          bgImgType: 0,
          directUpgradeRule: {
            singleDay: null,
            month: null,
          },
          relegationRule: {
            relegationCondition: null,
          },
          upgradeGifts: [], // 升级礼包
        },
      };
    },
    computed: {
      rules() {
        const tmp = {
          levelNumber: [{ required: true, message: '请选择等级', trigger: 'blur' }],
          levelName: [{ required: true, validator: validateLevelName, trigger: 'blur' }],
        };
        if (this.form.levelNumber !== 1) {
          return {
            ...tmp,
            upgradeCondition: [{ required: true, message: '请输入升级条件', trigger: 'blur' }],
            relegationCondition: [{ required: true, message: '请输入保级条件', trigger: 'blur' }],
            singleDay: [{ required: true, validator: validateSingleDay(this.form), trigger: 'blur' }],
            month: [{ required: true, validator: validateMonth(this.form), trigger: 'blur' }],
          };
        }
        return tmp;
      },
    },
    async mounted() {
      this.status = parseInt(this.$route.query.status);
      if (this.$route.query.id) {
        const id = this.$route.query.id;
        this.levelDetail({ id });
      }
      const result = await memberApi.levelManager.getLevelList();
      const res = await memberApi.levelManager.levelList();
      if (result.success && res.success) {
        res.data.forEach((item, index) => {
          for (let i = 0; i < result.data.length; i++) {
            const e = result.data[i];
            if (e.levelNumber === item.code) {
              item.disabled = true;
              break;
            }
          }
          if (item.disabled === undefined) {
            item.disabled = false;
          }
          this.levelList.push(item);
        });
      }
    },
    methods: {
      levelDetail(id) {
        memberApi.levelManager.levelDetail(id).then(res => {
          if (res.success) {
            let rules = false;
            const { directUpgradeRule, levelNumber, relegationRule } = res.data;
            if (directUpgradeRule != null) {
              const { singleDay = 0, month = 0 } = directUpgradeRule;
              if (singleDay > 0 || month > 0) {
                rules = true;
              }
            }

            res.data.upgradeGifts = res.data.upgradeGifts || [];
            const url =
              'https://' +
              process.env.VUE_APP_CDN_DOMAIN +
              '/resources/dss-web-portal/cdn/vip/VIP_' +
              (levelNumber - 1) +
              '.png';
            this.form = {
              ...res.data,
              defaultImgUrl: url,
              directUpgradeRule: directUpgradeRule || {}, // directUpgradeRule可能为null，防止空指针
              relegationRule: relegationRule || { relegationCondition: null }, // relegationRule可能为null，防止空指针
            };

            this.$set(this.form, 'rules', rules);
          }
        });
      },
      rulesChange(e) {
        if (!e) {
          this.form.directUpgradeRule.singleDay = null;
          this.form.directUpgradeRule.month = null;
        }
        this.form.rules = e;
      },
      levelNumberChange(e) {
        const url =
          'https://' + process.env.VUE_APP_CDN_DOMAIN + '/resources/dss-web-portal/cdn/vip/VIP_' + (e - 1) + '.png';
        this.form = { ...this.form, imgUrl: url, defaultImgUrl: url };
      },
      async handleSubmit() {
        const params = { ...this.form };
        params.epId = '10';

        const upgradeGifts = (params.upgradeGifts = this.$refs.gifts.getGifts());
        if (typeof upgradeGifts === 'string') {
          this.$message.error(upgradeGifts);
          throw new Error();
        }

        if (params.bgImgType === 0 || !params.imgUrl) {
          params.imgUrl = params.defaultImgUrl;
        }

        params.upgradeCondition = parseInt(this.form.upgradeCondition || '0');
        const directUpgradeRule = {
          singleDay: parseInt(this.form.directUpgradeRule.singleDay),
          month: parseInt(this.form.directUpgradeRule.month),
        }; // ;
        params.directUpgradeRule = directUpgradeRule;
        params.relegationRule = {
          relegationCondition: parseInt(this.form.relegationRule.relegationCondition),
        };
        if (this.status === 0) {
          await memberApi.levelManager.addLevel(params);
        } else if (this.status === 1) {
          await memberApi.levelManager.updateLevel(params);
        }
      },
      onExtraImageAdd(imgObj) {
        if (imgObj && imgObj.imgUrl) {
          this.form.imgUrl = imgObj.imgUrl;
        }
      },
      onExtraDeleteImg(e) {
        //
      },
    },
  };
</script>

<style lang="less">
  .form-page-layout-container {
    h3 {
      margin-left: -50px;
    }

    .tips {
      margin-top: -10px;
      color: #666;
      font-size: 12px;
    }

    .el-radio__label,
    .el-checkbox__label {
      color: @ui-font-color-black;
      font-weight: 400;
    }

    .item-el-input {
      width: 208px;
    }

    .span-input {
      width: 80px;
      height: 30px;
    }

    .span-margin {
      margin-left: 5px;
      margin-right: 5px;
    }

    .span {
      margin-left: 5px;
      color: #333;
    }

    .img {
      width: 375px;
      height: 210px;
    }

    .el-button-text {
      padding: 0 10px;
      height: 30px;
      border: solid @ui-theme-color-orange 1px;
    }
  }
</style>
