<template>
  <form-page-layout
    :model="form"
    :rules="rules"
    label-width="170px"
    :title-visible="false"
    :submit-handler="handleSubmit"
    :back-on-submit-sucess="false"
  >
    <template v-if="globalIsUmpPlatformApp">
      <form-group>
        <template #title>积分有效期设置</template>
        <el-form-item label="有效期" prop="scoreValidity">
          <el-radio-group v-model="form.scoreValidity" @change="form.scoreValidityAction = 0">
            <el-radio :label="0">永久有效</el-radio>
            <el-radio :label="1">
              当年获取的积分，第
              <el-input-number
                :disabled="form.scoreValidity === 0"
                class="inline-input"
                v-model.number="form.scoreValidityYear"
                :controls="false"
                :min="1"
                :max="100"
                :precision="0"
              ></el-input-number>
              年年底(12月31日 23:59:59) 失效
              <span class="tip">（填1则当年年底失效，填2则次年年底失效）</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="过期设置" prop="scoreValidityAction" v-if="form.scoreValidity">
          <el-radio-group v-model="form.scoreValidityAction">
            <el-radio :label="0">自动执行</el-radio>
            <el-radio :label="1">手动执行</el-radio>
          </el-radio-group>
          <span class="tip">（过期日不自动执行，可在之后选择手动执行）</span>
          <el-button
            type="primary"
            style="margin-left: 20px"
            :disabled="!form.scoreValidityAction || !form.scoreValidityYear"
            @click="doInvalid"
          >
            手动执行
          </el-button>
        </el-form-item>
      </form-group>

      <!-- <form-group>
        <template #title>商城积分设置</template>
        <el-form-item label="线上消费积分生效设置" prop="scoreValiditySetting">
          <el-radio-group v-model="form.scoreValiditySetting">
            <el-radio :label="0">确认收货后立即生效</el-radio>
            <el-radio :label="1">
              确认收货后
              <el-input
                class="inline-input"
                :disabled="form.scoreValiditySetting === 0"
                v-model.number="form.scoreValiditySettingHour"
              ></el-input>
              小时生效
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </form-group> -->

      <form-group>
        <template #title>积分比例设置</template>
        <el-form-item label="积分成本设置" prop="scoreProportion">
          <el-input class="inline-input" style="width: 78px" v-model.number="form.scoreProportion"></el-input>
          <span> 积分=1元</span>
          <div class="tip">注：不可为空或为“0”</div>
        </el-form-item>
      </form-group>
    </template>
    <template #footer="state">
      <form-button action="cancel" />
      <form-button :loading="state.saving" />
    </template>
  </form-page-layout>
</template>

<script>
  import * as FormPageComponents from '@/dss-common/components/form-page';
  import api from '@/mod-member/src/api/memberAPI';
  import regexps from '@/dss-common/utils/regexps';

  export default {
    name: 'ScoreRiskManagement',
    components: {
      ...FormPageComponents,
    },
    data() {
      return {
        form: {
          scoreValidity: 0,
          scoreValidityYear: 1,
          scoreValidityAction: 0,
          scoreValiditySetting: 0,
          scoreValiditySettingHour: 1,
          scoreProportion: null,
        },
        rules: {
          scoreValidity: {
            validator: (rule, value, callback) => {
              if (value > 0 && !this.form.scoreValidityYear) {
                callback(new Error('请设置有效期'));
              } else {
                callback();
              }
            },
          },
          scoreValiditySetting: {
            validator: (rule, value, callback) => {
              if (value > 0 && !this.form.scoreValiditySettingHour) {
                callback(new Error('请设置线上消费积分生效设置'));
              } else {
                callback();
              }
            },
          },
          scoreProportion: [
            { required: true, message: '请输入积分比例', trigger: ['blur', 'change'] },
            {
              validator: (rule, value, callback) => {
                if (!Number.isInteger(value)) {
                  callback(new Error('请输入数字值'));
                } else {
                  if (value > 999999) {
                    callback(new Error('数值不超过 999999'));
                  } else {
                    callback();
                  }
                }
              },
              trigger: 'blur',
            },
            { pattern: regexps.positiveInteger.reg, message: regexps.positiveInteger.msg, trigger: 'blur' },
          ],
        },

        originScoreValidityYear: -1, // 从服务器获取的过期时间
      };
    },
    mounted() {
      this.initial();
    },
    methods: {
      async initial() {
        const { data } = await api.scoreCenter.getRiskManagerment();
        const { scoreValidity, scoreValidityAction, scoreValiditySetting, ...other } = data;

        if (scoreValidity && scoreValidity > 0) {
          other.scoreValidity = 1;
          other.scoreValidityYear = scoreValidity;
        } else {
          other.scoreValidity = 0;
        }

        other.scoreValidityAction = scoreValidityAction ? 1 : 0;

        if (scoreValiditySetting && scoreValiditySetting > 0) {
          other.scoreValiditySetting = 1;
          other.scoreValiditySettingHour = scoreValiditySetting;
        } else {
          other.scoreValiditySetting = 0;
        }

        this.form = other;

        this.originScoreValidityYear = other.scoreValidityYear;
      },
      async handleSubmit() {
        const { scoreValidityYear, scoreValiditySettingHour, ...params } = this.form;
        if (params.scoreValidity > 0) {
          params.scoreValidity = scoreValidityYear;
        }
        if (params.scoreValiditySetting > 0) {
          params.scoreValiditySetting = scoreValiditySettingHour;
        }

        await api.scoreCenter.setRiskManagerment(params);
        this.originScoreValidityYear = scoreValidityYear;
      },
      async doInvalid() {
        const scoreValidityYear = this.form.scoreValidityYear;
        if (!scoreValidityYear) return;

        if (scoreValidityYear !== this.originScoreValidityYear) {
          return this.$message.error('有效期有修改，请保存后再手动执行');
        }

        try {
          await this._doInvalidConfirm(scoreValidityYear);
          const { msg } = await api.scoreCenter.manualSetScoreExpired();
          this.$message.success(msg);
        } catch (e) {
          //
        }
      },
      _doInvalidConfirm(scoreValidityYear) {
        const h = this.$createElement;

        return this.$msgbox({
          title: '手动执行',
          message: h('section', { style: 'text-align: center; margin-bottom: 10px' }, [
            h('h4', { style: 'color: #e00; margin: 0 0 10px' }, '注意！！！'),
            h('p', null, [
              '此操作将会把本该【',
              h('span', { style: 'color: #e00' }, `${new Date().getFullYear() - scoreValidityYear}`),
              '】年年底过期的积分变为过期状态',
            ]),
          ]),
          showCancelButton: true,
          confirmButtonText: '执行过期',
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .tip {
    color: #aba7a7;
  }

  .inline-input {
    width: 50px;
    margin: 0 5px;

    /deep/ .el-input__inner {
      padding: 5px 10px !important;
      text-align: left;
    }
  }
</style>
