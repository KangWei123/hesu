<template>
  <div class="rule-setting"
       v-loading="loading">

    <!-- 内购开启设置 -->
    <el-form label-width="160px">
      <div class="type">
        <div class="type-title">内购开启设置：</div>
        <el-form-item label="内购功能："
                      prop="disStatus">
          <div class="tab">
            <el-radio-group v-model="form.disStatus">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </div>
    </el-form>

    <el-form ref="form"
             :model="form"
             :rules="rules"
             label-width="160px"
             :disabled="isDisabled">
      <!-- 佣金设置 -->
      <div class="type">
        <div class="type-title">佣金设置：</div>
        <el-form-item label="佣金计算设置："
                      prop="comServicePercent">
          <div class="tab">
            <el-radio-group v-model="form.commissionType">
              <el-radio :label="1">按照单商品设置</el-radio>
              <el-radio :label="2">按照统一比例设置</el-radio>
            </el-radio-group>
          </div>

          <!-- 按照统一比例设置才设置佣金比例 -->
          <div class="tab tab-middle"
               v-if="showComServicePercent">
            <span>佣金比例</span>
            <el-input class="setting-input"
                      v-model="form.comServicePercent"
                      placeholder="请输入"></el-input>
            <span>%</span>
          </div>
        </el-form-item>

        <!-- 佣金发放时间设置 -->
        <el-form-item label="佣金发放时间设置："
                      prop="commissionReleaseType">
          <div class="tab">
            <el-radio-group v-model="form.commissionReleaseType">
              <el-radio :label="1">超过退款期限后发放佣金</el-radio>
              <el-radio :label="2">确认收货后发放佣金</el-radio>
            </el-radio-group>
            <p class="tips">注：确认收货发放佣金后，产生的退款行为，不退还佣金</p>
          </div>
        </el-form-item>
      </div>

      <!-- 招募设置 -->
      <div class="type">
        <div class="type-title">招募设置：</div>
        <el-form-item label="招募模式：">
          <div class="tab">
            <el-radio-group v-model="form.recruitStatus">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </div>
          <div class="tab"
               v-if="showQRCodeUrl">
            <p>员工内购招募注册二维码</p>
            <img class="qrCodeUrl"
                 :src="form.qrCodeUrl" />
          </div>
        </el-form-item>
      </div>

    </el-form>

    <!-- 底部操作按钮 -->
    <div class="bottom-button">
      <el-button type="primary" @click="updateRuleSetting">保存</el-button>
    </div>
    
  </div>
</template>

<script>
import distributionApi from '@/dss-wechat3rd/src/api/distribution.js';

const regexpsPercent = /^(([1-9]\d|[1-9])(\.\d{1,2})?|0\.[1-9]\d|0\.\d[1-9]|0\.[1-9])$/;

export default {
  data() {
    // 验证佣金比例输入是否正确
    const checkComServicePercent = (rule, value, callback) => {
      if (
        this.form.disStatus && // 内购功能开启状态为1：开启
        this.form.commissionType === 2 // 佣金计算类型设置为2：按统一比例设置
      ) {
        if (!value) {
          return callback(new Error('请输入佣金比例'));
        } else if (!regexpsPercent.test(value) || value > 29.99) {
          return callback(new Error('允许输入比例为大于0~小于30的数字，保留两位小数'));
        }
      }
      return callback();
    };

    return {
      loading: false,

      form: {
        activityType: 1, // 分销类型，0：全员营销；1：员工内购；-1：全部

        disStatus: 0, // 内购功能开启状态，0：关闭，1：开启

        commissionType: 2, // 佣金计算类型设置，1：按单商品设置，2：按统一比例设置
        comServicePercent: null, // 佣金比例，佣金计算类型设置为2：按统一比例设置时，才能填写佣金比例
        commissionReleaseType: 1, //佣金发放设置，1：超过退款期限后发放，2：确认收货后发放
        recruitStatus: 1, // 招募模式，0：关闭，1：开启
        qrCodeUrl: null // 员工内购招募注册二维码
      },

      rules: {
        comServicePercent: [{ validator: checkComServicePercent, trigger: ['blur', 'change'] }]
      }
    };
  },

  computed: {
    // 判断是否禁止编辑其他参数
    isDisabled() {
      // 关闭内购功能
      if (!this.form.disStatus) {
        return true;
      }
      return false;
    },

    // 判断是否显示佣金计算设置
    showComServicePercent() {
      // 佣金计算类型设置为2：按统一比例设置
      if (this.form.commissionType === 2) {
        return true;
      }
      return false;
    },

    // 判断是否显示员工内购招募注册二维码
    showQRCodeUrl() {
      if (
        !!this.form.disStatus && // 开启内购功能
        this.form.recruitStatus === 1 && // 招募模式为1：开启
        this.form.qrCodeUrl // 内购员招募注册二维码存在
      ) {
        return true;
      }
      return false;
    }
  },
  watch: {
    // 监听佣金计算类型设置的改变
    'form.commissionType'(newVal, oldVal) {
      if (newVal === 2) {
        // 将回调延迟到下次 DOM 更新循环之后执行
        this.$nextTick(() => {
          // 手动触发佣金比例的验证，以便切换到按照单商品设置时，实时去除佣金比例的错误提示
          this.$refs.form.validateField('comServicePercent');
        });
      } else {
        // 手动触发佣金比例的验证，以便切换到按照单商品设置时，实时去除佣金比例的错误提示
        this.$refs.form.validateField('comServicePercent');
      }
    }
  },

  mounted() {
    this.ruleQuery(); // 内购规则查询
  },
  methods: {
    /**
     * 内购规则查询
     */
    ruleQuery() {
      const params = {
        activityType: this.form.activityType // 分销类型，0：全员营销；1：员工内购；-1：全部
      };

      this.loading = true;
      distributionApi
        .ruleQuery(params)
        .done(res => {
          if (res.data) {
            Object.keys(this.form).forEach(key => {
              // 判断佣金比例输入框的返回值是否为0或空，是则直接设置为null
              if (!res.data[key] && key === 'comServicePercent') {
                res.data[key] = null;
              }

              //如果未初始化过，则默认选择一个发放佣金类型
              if (key === 'commissionReleaseType' && res.data[key] === undefined) {
                res.data[key] = 1;
              }
              this.form[key] = res.data[key];
            });

            // 判断分销功能开启状态，0：关闭，1：开启
            if (res.data.disStatus) {
              // 招募模式状态
              const recruitStatus = res.data.recruitStatus;
              this.form.recruitStatus = recruitStatus || recruitStatus === 0 ? recruitStatus : 1; // 招募模式，0：关闭，1：开启
            } else {
              this.form.recruitStatus = 0; // 招募模式，0：关闭，1：开启
            }
          }
        })
        .always(res => {
          this.loading = false;
        });
    },

    /**
     * 保存设置
     */
    updateRuleSetting() {
      this.$refs.form.validate(valid => {
        // 判断是否表单验证通过
        if (!valid) {
          return false;
        }

        let params = { ...this.form };

        // 佣金计算类型设置为1：按单商品设置
        if (params.commissionType === 1) {
          delete params.comServicePercent; // 佣金比例
        }

        this.saveBasicSetting(params); // 执行设置保存接口
      });
    },

    /**
     * 执行设置保存接口
     */
    saveBasicSetting(params) {
      this.loading = true;
      distributionApi
        .ruleInsertOrUpdate(params)
        .done(res => {
          this.$message.success('保存成功');
          this.ruleQuery(); // 内购规则查询
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>
