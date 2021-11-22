<template>
  <div class="rule-setting"
       v-loading="loading">

    <!-- 分销开启设置 -->
    <el-form label-width="160px">
      <div class="type">
        <div class="type-title">分销开启设置：</div>
        <el-form-item label="分销商品功能："
                      prop="disStatus">
          <div class="tab">
            <el-radio-group v-model="form.disStatus">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </div>

          <div class="tab tips">备注：分销商品默认关闭，分销商品开启方可设置分销商品及分销佣金</div>
        </el-form-item>
      </div>
    </el-form>

    <el-form ref="form"
             :model="form"
             :rules="rules"
             label-width="160px"
             :disabled="isDisabled">
      <!-- 分销模式设置 -->
      <div class="type">
        <div class="type-title">分销模式设置：</div>
        <el-form-item label="分销模式："
                      prop="disMode">
          <div class="tab">
            <el-radio-group v-model="form.disMode">
              <el-radio :label="1">推广模式</el-radio>
              <el-radio :label="2">推广+服务模式</el-radio>
            </el-radio-group>
          </div>

          <div class="tab tips">备注：推广模式，分销佣金仅包括推广佣金，不涉及服务的门店佣金；推广+服务模式，分销佣金包括2个部分，推广佣金和服务佣金，服务佣金是购买后服务人员佣金</div>
        </el-form-item>
      </div>

      <!-- 推广佣金设置 -->
      <div class="type">
        <div class="type-title">推广佣金设置：</div>
        <el-form-item label="客户推广佣金："
                      prop="comFrequencyMode">
          <div class="tab">
            <el-radio-group v-model="form.comFrequencyMode">
              <el-radio :label="1">首单结算模式</el-radio>
              <el-radio :label="2">每笔订单结算模式</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>

        <!-- 首单结算模式才能进行佣金金额设置 -->
        <el-form-item label="推广佣金设置："
                      prop="comExtensionFirst"
                      v-if="showComExtensionFirst">
          <div class="tab">
            <el-input class="setting-input"
                      style="width: 120px;"
                      v-model="form.comExtensionFirst"
                      placeholder="请输入佣金金额"></el-input>
            <span>元</span>
          </div>

          <div class="tab tips">备注：首单模式佣金按照固定金额设置</div>
        </el-form-item>

        <!-- 每笔订单结算模式才能进行佣金计算类型设置 -->
        <el-form-item :label="showComExtensionFirst ? '服务佣金计算设置：': '佣金计算设置：'"
                      prop="commissionType"
                      v-if="showCommissionType">
          <div class="tab">
            <el-radio-group v-model="form.commissionType">
              <el-radio :label="1">按照单商品设置</el-radio>
              <el-radio :label="2">按照统一比例设置</el-radio>
            </el-radio-group>
          </div>

          <!-- 按照统一比例设置才设置佣金比例 -->
          <div class="tab tab-middle"
               v-if="showComExtensionPercent || showComServicePercent">
            <el-form-item prop="comExtensionPercent"
                          class="commission-box"
                          v-if="showComExtensionPercent">
              <span>推广佣金比例</span>
              <el-input class="setting-input"
                        v-model="form.comExtensionPercent"
                        placeholder="请输入"></el-input>
              <span>%</span>
            </el-form-item>

            <el-form-item prop="comServicePercent"
                          class="commission-box"
                          v-if="showComServicePercent">
              <span>服务佣金比例</span>
              <el-input class="setting-input"
                        v-model="form.comServicePercent"
                        placeholder="请输入"></el-input>
              <span>%</span>
            </el-form-item>
          </div>

          <!-- 按照单商品设置提示 -->
          <div class="tab tips"
               v-if="form.commissionType === 1">备注：设置商品佣金，请到分销商品列表进行单独设置</div>
          <!-- 按照统一比例设置提示 -->
          <div class="tab tips"
               v-else>备注：统一模式按照佣金比例自动计算提成，如果某些商品需要单独设置佣金比例，可以去分销商品列表选择对应商品点击设置按钮进行单独设置</div>
        </el-form-item>
      </div>

      <!-- 通用设置 -->
      <div class="type">
        <div class="type-title">通用设置：</div>
        <el-form-item label="充值分销佣金设置："
                      prop="rechargePercent">
          <div class="tab">
            <el-radio-group v-model="form.disRechargeStatus">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </div>

          <div class="tab"
               v-if="showRechargePercent">
            <span>储值佣金比例</span>
            <el-input class="setting-input"
                      v-model="form.rechargePercent"
                      placeholder="请输入"></el-input>
            <span>%</span>
          </div>
        </el-form-item>

        <el-form-item label="充值佣金有效期："
                      prop="effectDateArray"
                      v-if="showEffectForever">
          <div class="tab">
            <el-radio-group v-model="form.effectForever">
              <el-radio :label="0">固定时间段</el-radio>
              <el-radio :label="1">永久</el-radio>
            </el-radio-group>
          </div>
          <div class="tab tab-middle"
               v-if="showEffectDateArray">
            <el-date-picker v-model="form.effectDateArray"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"></el-date-picker>
          </div>

          <div class="tab tips"
               v-if="showEffectForever">如果设置佣金有效期，有效期结束后，充值分销将不再获得佣金，已获得的充值佣金则不受影响</div>
        </el-form-item>

        <el-form-item label="佣金展示设置：">
          <div class="tab">
            <el-checkbox v-model="form.isShowCommmission">显示佣金</el-checkbox>
            <el-checkbox v-model="form.isShowPercent">显示佣金比例</el-checkbox>
          </div>
          <div class="el-form-item__error"
               v-if="showCommmissionError">请选择佣金展示设置</div>
        </el-form-item>

        <el-form-item label="招募模式：">
          <div class="tab">
            <el-radio-group v-model="form.recruitStatus">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </div>
          <div class="tab"
               v-if="showQRCodeUrl">
            <p>员工分销招募注册二维码</p>
            <img class="qrCodeUrl"
                 :src="form.qrCodeUrl" />
          </div>
        </el-form-item>

        <!-- <el-form-item label="佣金发放时间设置">
          <el-radio-group v-model="form.commissionReleaseType">
            <el-radio :label="1">超过退款期限后发放佣金</el-radio>
            <el-radio :label="2">确认收货后发放佣金</el-radio>
            <p class="tip">注：确认收货发放佣金后，产生退款行为，不退还佣金</p>
          </el-radio-group>
        </el-form-item> -->
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
import utils from '@/dss-common/utils';
import moneyUtil from '@/dss-common/utils/money.js';

const regexpsPercent = /^(([1-9]\d|[1-9])(\.\d{1,2})?|0\.[1-9]\d|0\.\d[1-9]|0\.[1-9])$/;
const regexpsAmount = /^(([1-9]\d{1,4}|[1-9])(\.\d{1,2})?|0\.[1-9]\d|0\.\d[1-9]|0\.[1-9])$/;

export default {
  data() {
    // 验证推广佣金金额输入是否正确
    const checkComExtensionFirst = (rule, value, callback) => {
      if (
        this.form.comFrequencyMode === 1 // 推广佣金结算模式为1：首单结算模式
      ) {
        if (!value) {
          return callback(new Error('请输入推广佣金金额'));
        } else if (!regexpsAmount.test(value) && value != 100000) {
          return callback(new Error('允许输入佣金金额为0.01~100000，保留两位小数'));
        }
      }
      return callback();
    };

    // 验证推广佣金比例输入是否正确
    const checkComExtensionPercent = (rule, value, callback) => {
      if (
        this.form.comFrequencyMode === 2 && // 推广佣金结算模式为2：每笔订单结算模式
        this.form.commissionType === 2 // 佣金计算类型设置为2：按统一比例设置
      ) {
        if (!value) {
          return callback(new Error('请输入推广佣金比例'));
        } else if (!regexpsPercent.test(value) && value != 100) {
          return callback(new Error('允许输入比例为0.01~100，保留两位小数'));
        }
      }
      return callback();
    };

    // 验证服务佣金比例输入是否正确
    const checkComServicePercent = (rule, value, callback) => {
      if (
        this.form.disMode === 2 && // 分销模式为2：推广+服务模式
        this.form.commissionType === 2 // 佣金计算类型设置为2：按统一比例设置
      ) {
        if (!value) {
          return callback(new Error('请输入服务佣金比例'));
        } else if (!regexpsPercent.test(value) && value != 100) {
          return callback(new Error('允许输入比例为0.01~100，保留两位小数'));
        }
      }
      return callback();
    };

    // 验证充值分销佣金比例输入是否正确
    const checkRechargePercent = (rule, value, callback) => {
      // 充值分销佣金设置为1：是
      if (this.form.disRechargeStatus) {
        if (!value) {
          return callback(new Error('请输入储值佣金比例'));
        } else if (!regexpsPercent.test(value) && value != 100) {
          return callback(new Error('允许输入比例为0.01~100，保留两位小数'));
        }
      }
      return callback();
    };

    // 验证充值佣金有效期
    const checkEffectDateArray = (rule, value, callback) => {
      // 有效期类型为0：固定时间段
      if (!this.form.effectForever) {
        const startDate = value && value.length > 0 ? value[0].getTime() : null;
        const endDate = value && value.length > 0 ? value[1].getTime() : null;
        // const nowDate = new Date(new Date().toLocaleDateString()).getTime(); // 因为要校验的有效期开始及结束时间都是0时0分0秒，所以要获取当前时间的0时0分0秒

        if (!startDate || !endDate) {
          return callback(new Error('请输入充值佣金有效期'));
        }
        /* else if (endDate < nowDate) {
          return callback(new Error('结束日期不能小于当前日期'));
        } */
      }
      return callback();
    };

    return {
      loading: false,

      form: {
        activityType: 0, // 分销类型，0：全员营销；1：员工内购；-1：全部

        disStatus: 0, // 分销功能开启状态，0：关闭，1：开启
        disMode: 1, // 分销模式，1：推广模式，2：推广+服务模式

        comFrequencyMode: 2, // 推广佣金结算模式，1：首单结算模式，2：每笔订单结算模式
        comExtensionFirst: null, // 推广佣金金额，推广佣金结算模式为1：首单结算模式时，才能填写固定的佣金金额

        commissionType: 2, // 佣金计算类型设置，1：按单商品设置，2：按统一比例设置
        comExtensionPercent: null, // 推广佣金比例，推广佣金结算模式为2：每笔订单结算模式；且佣金计算类型设置为2：按统一比例设置时，才能填写推广佣金比例
        comServicePercent: null, // 服务佣金比例，佣金计算类型设置为2：按统一比例设置时，才能填写服务佣金比例

        disRechargeStatus: 1, // 充值分销佣金设置，0：否，1：是
        rechargePercent: null, // 储值佣金比例
        effectForever: 1, // 充值佣金有效期类型，0：固定时间段，1：永久
        effectDateArray: [], // 充值佣金有效期时间对象数组

        isShowCommmission: true, // 佣金展示设置：展示佣金
        isShowPercent: false, // 佣金展示设置：展示佣金比例

        recruitStatus: 0, // 招募模式，0：关闭，1：开启
        qrCodeUrl: null // 员工分销招募注册二维码

        // commissionReleaseType: 0
      },
      // 日期时间选择选项
      pickerOptions: {
        shortcuts: [
          {
            text: '未来一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '未来一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '未来三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },

      rules: {
        comExtensionFirst: [{ validator: checkComExtensionFirst, trigger: 'blur' }],
        comExtensionPercent: [{ validator: checkComExtensionPercent, trigger: 'blur' }],
        comServicePercent: [{ validator: checkComServicePercent, trigger: 'blur' }],
        rechargePercent: [{ validator: checkRechargePercent, trigger: 'blur' }],
        effectDateArray: [{ validator: checkEffectDateArray, trigger: 'blur' }]
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

    // 判断是否展示首单推广佣金金额
    showComExtensionFirst() {
      // 推广佣金结算模式为1：首单结算模式
      if (this.form.comFrequencyMode === 1) {
        return true;
      }
      return false;
    },

    // 判断是否显示佣金设置
    showCommissionType() {
      // 分销模式为1：推广模式，且推广佣金结算模式为2：每笔订单结算模式
      if (this.form.disMode === 1 && this.form.comFrequencyMode === 2) {
        return true;
      } else if (this.form.disMode === 2) {
        // 分销模式为2：推广+服务模式
        return true;
      }
      return false;
    },

    // 判断是否显示推广佣金比例
    showComExtensionPercent() {
      // 推广佣金结算模式为2：每笔订单结算模式，且佣金计算类型设置为2：按统一比例设置
      if (this.form.comFrequencyMode === 2 && this.form.commissionType === 2) {
        return true;
      }
      return false;
    },

    // 判断是否显示服务佣金比例
    showComServicePercent() {
      // 分销模式为2：推广+服务模式，且佣金计算类型设置为2：按统一比例设置
      if (this.form.disMode === 2 && this.form.commissionType === 2) {
        return true;
      }
      return false;
    },

    // 判断是否显示储值佣金比例
    showRechargePercent() {
      // 充值分销佣金设置为1：是
      if (this.form.disRechargeStatus) {
        return true;
      }
      return false;
    },

    // 判断是否显示充值佣金有效期类型
    showEffectForever() {
      // 充值分销佣金设置为1：是
      if (this.form.disRechargeStatus) {
        return true;
      }
      return false;
    },
    // 判断是否显示充值佣金有效期时间选择器
    showEffectDateArray() {
      // 充值佣金有效期类型为0：固定时间段
      if (!this.form.effectForever) {
        return true;
      }
      return false;
    },

    // 判断是否显示佣金展示错误提示
    showCommmissionError() {
      if (
        !this.form.isShowCommmission && // 佣金展示设置：不展示佣金
        !this.form.isShowPercent // 佣金展示设置：不展示佣金比例
      ) {
        return true;
      }
      return false;
    },

    // 判断是否显示员工分销招募注册二维码
    showQRCodeUrl() {
      if (
        !!this.form.disStatus && // 开启分销功能
        this.form.recruitStatus === 1 && // 招募模式为1：开启
        this.form.qrCodeUrl // 分销员招募注册二维码存在
      ) {
        return true;
      }
      return false;
    }
  },
  watch: {
    // 监听分销模式的改变
    'form.disMode'(newVal, oldVal) {
      // 分销模式为2：推广+服务模式
      if (newVal === 2) {
        // 将回调延迟到下次 DOM 更新循环之后执行
        this.$nextTick(() => {
          // 手动触发服务佣金比例的验证，以便切换分销模式时，实时去除服务佣金比例的错误提示
          this.$refs.form.validateField('comServicePercent');
        });
      } else {
        // 手动触发服务佣金比例的验证，以便切换分销模式时，实时去除服务佣金比例的错误提示
        this.$refs.form.validateField('comServicePercent');
      }
    },

    // 监听推广佣金结算模式的改变
    'form.comFrequencyMode'(newVal, oldVal) {
      // 推广佣金结算模式为1：首单结算模式
      if (newVal === 1) {
        // 手动触发推广佣金比例的验证，以便切换到首单结算模式时，实时去除推广佣金比例的错误提示
        this.$refs.form.validateField('comExtensionPercent');

        // 将回调延迟到下次 DOM 更新循环之后执行
        this.$nextTick(() => {
          // 手动触发推广佣金金额的验证，以便切换到每笔订单结算模式时，实时去除推广佣金金额的错误提示
          this.$refs.form.validateField('comExtensionFirst');
        });
      } else {
        // 手动触发推广佣金金额的验证，以便切换到每笔订单结算模式时，实时去除推广佣金金额的错误提示
        this.$refs.form.validateField('comExtensionFirst');

        // 将回调延迟到下次 DOM 更新循环之后执行
        this.$nextTick(() => {
          // 手动触发推广佣金比例的验证，以便切换到首单结算模式时，实时去除推广佣金比例的错误提示
          this.$refs.form.validateField('comExtensionPercent');
        });
      }
    },

    // 监听推广佣金金额的变更
    'form.comExtensionFirst'(newVal, oldVal) {
      // 手动触发推广佣金金额的验证，以便切换到每笔订单结算模式时，实时去除推广佣金金额的错误提示
      this.$refs.form.validateField('comExtensionFirst');
    },

    // 监听佣金计算类型设置的改变
    'form.commissionType'(newVal, oldVal) {
      if (newVal === 2) {
        // 将回调延迟到下次 DOM 更新循环之后执行
        this.$nextTick(() => {
          // 手动触发推广佣金比例的验证，以便切换到按照单商品设置时，实时去除推广佣金比例的错误提示
          this.$refs.form.validateField('comExtensionPercent');
          // 手动触发服务佣金比例的验证，以便服务佣金设置模式时，实时去除服务佣金比例的错误提示
          this.$refs.form.validateField('comServicePercent');
        });
      } else {
        // 手动触发推广佣金比例的验证，以便切换到按照单商品设置时，实时去除推广佣金比例的错误提示
        this.$refs.form.validateField('comExtensionPercent');
        // 手动触发服务佣金比例的验证，以便服务佣金设置模式时，实时去除服务佣金比例的错误提示
        this.$refs.form.validateField('comServicePercent');
      }
    },

    // 监听充值分销佣金设置的改变
    'form.disRechargeStatus'(newVal, oldVal) {
      // 手动触发储值佣金比例验证
      this.$refs.form.validateField('rechargePercent');

      if (!newVal) {
        // 手动触发有效期验证
        this.$refs.form.validateField('effectDateArray');
      } else {
        // 将回调延迟到下次 DOM 更新循环之后执行
        this.$nextTick(() => {
          // 手动触发有效期验证
          this.$refs.form.validateField('effectDateArray');
        });
      }
    },
    // 监听充值佣金有效期类型的改变
    'form.effectForever'(newVal, oldVal) {
      // 手动触发有效期验证
      this.$refs.form.validateField('effectDateArray');
    }
  },

  mounted() {
    this.ruleQuery(); // 分销规则查询
  },
  methods: {
    /**
     * 分销规则查询
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
            // 首单佣金金额转换为元
            if (res.data.comExtensionFirst) {
              res.data.comExtensionFirst = moneyUtil.convertHundredMoneyUnit(res.data.comExtensionFirst, true);
            }

            Object.keys(this.form).forEach(key => {
              // 判断以下输入框的返回值是否为0或空，是则直接设置为null
              if (
                !res.data[key] &&
                (key === 'comExtensionFirst' || // 推广首单佣金
                key === 'comExtensionPercent' || // 推广佣金比例
                key === 'comServicePercent' || // 服务佣金比例
                  key === 'rechargePercent') // 储值佣金比例
              ) {
                res.data[key] = null;
              }

              this.form[key] = res.data[key];
            });

            // 充值佣金有效期固定时间段
            if (res.data.effectStartTime && res.data.effectEndTime) {
              this.form.effectDateArray = [new Date(res.data.effectStartTime), new Date(res.data.effectEndTime)];
            }

            // 判断佣金展示设置是否两种类型都为false，是则默认设置展示类型为显示佣金
            if (!res.data.isShowCommmission && !res.data.isShowPercent) {
              this.form.isShowCommmission = true; // 佣金展示设置：展示佣金
              this.form.isShowPercent = false; // 佣金展示设置：展示佣金比例
            }

            // 判断分销功能开启状态，0：关闭，1：开启
            if (res.data.disStatus) {
              // 招募模式状态
              const recruitStatus = res.data.recruitStatus;
              this.form.recruitStatus = recruitStatus || recruitStatus === 0 ? recruitStatus : 1; // 招募模式，0：关闭，1：开启
            } else {
              this.form.recruitStatus = 0; // 招募模式，0：关闭，1：开启
            }
            // this.form.commissionReleaseType = res.data.commissionReleaseType;
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
        // 判断是否表单验证通过，及佣金展示设置是否有错误
        if (!valid || this.showCommmissionError) {
          return false;
        }

        let params = { ...this.form };

        // 分销模式为1：推广模式
        if (params.disMode === 1) {
          delete params.comServicePercent; // 服务佣金比例

          // 推广佣金结算模式为1：首单结算模式
          if (params.comFrequencyMode === 1) {
            delete params.commissionType; // 佣金计算类型设置
            delete params.comExtensionPercent; // 推广佣金比例
          } else {
            delete params.comExtensionFirst; // 推广佣金金额

            // 佣金计算类型设置为1：按单商品设置
            if (params.commissionType === 1) {
              delete params.comExtensionPercent; // 推广佣金比例
            }
          }
          // 分销模式为2：推广+服务模式
        } else {
          // 推广佣金结算模式为1：首单结算模式
          if (params.comFrequencyMode === 1) {
            delete params.comExtensionPercent; // 推广佣金比例
          } else {
            delete params.comExtensionFirst; // 推广佣金金额

            // 佣金计算类型设置为1：按单商品设置
            if (params.commissionType === 1) {
              delete params.comExtensionPercent; // 推广佣金比例
              delete params.comServicePercent; // 服务佣金比例
            }
          }
        }

        // 首单佣金金额转换为分
        if (params.comExtensionFirst) {
          params.comExtensionFirst = moneyUtil.convertHundredMoneyUnit(params.comExtensionFirst, false);
        }

        // 判断佣金比例是否大于100%
        if (
          params.disMode === 2 && // 分销模式为2：推广+服务模式
          params.comFrequencyMode !== 1 && // 推广佣金结算模式不等于 1：首单结算模式
          params.commissionType !== 1 // 佣金计算类型设置不等于 1：按单商品设置
        ) {
          // 佣金比例为推广佣金比例+服务佣金比例
          const commissionPercent = Number(params.comExtensionPercent) + Number(params.comServicePercent);
          if (commissionPercent > 100) {
            this.$confirm('当前佣金比例大于100%时，存在风险，是否保持设置? ', '设置佣金比例', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              customClass: 'wkt-warning'
            })
              .then(() => {
                this.saveBasicSetting(params); // 执行设置保存接口
              })
              .catch(() => {
                console.log('取消设置');
              });
            return;
          }
        }

        // 充值分销佣金设置为0：否
        if (!params.disRechargeStatus) {
          delete params.rechargePercent; // 储值佣金比例
          delete params.effectForever; // 有效期类型
          delete params.effectDateArray; // 有效期时间对象数组
          // 有效期类型为1：永久
        } else if (params.effectForever) {
          delete params.effectDateArray; // 有效期时间对象数组
        }

        // 时间转化
        if (params.effectDateArray) {
          params.effectStartTime = utils.timeFormat(params.effectDateArray[0], 'YYYY-MM-DD');
          params.effectEndTime = utils.timeFormat(params.effectDateArray[1], 'YYYY-MM-DD');
          delete params.effectDateArray; // 删除未转化的日期对象
        }

        delete params.qrCodeUrl; // 员工分销招募注册二维码

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
          this.ruleQuery(); // 分销规则查询
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.tip {
  font-size: 14px;
  color: #b9b9b9;
  margin-top: 4px;
}
</style>