<template>
  <div class="voucher-setting"
       v-loading="loading">

    <el-form ref="form"
             :model="form"
             :rules="rules"
             label-width="160px">
      <!-- 派券设置 -->
      <div class="type">
        <div class="type-title">派券设置：</div>
        <!-- 首次进入内购页 -->
        <el-form-item label="首次进入内购页："
                      prop="firstEnterGiveNum">
          <div class="tab">
            <el-switch v-model="form.firstEnterSwitch"
                       :active-value="1"
                       :inactive-value="0"
                       active-color="#256EFF"
                       inactive-color="#ff4949"
                       active-text="开启"
                       inactive-text="关闭"></el-switch>
          </div>

          <div class="tab tab-middle"
               v-if="form.firstEnterSwitch">
            <span>送内购券</span>
            <el-input class="setting-input"
                      v-model="form.firstEnterGiveNum"
                      placeholder="请输入"></el-input>
            <span>张</span>
          </div>
        </el-form-item>

        <!-- 每日登录 -->
        <el-form-item label="每日登录："
                      prop="loginGiveNum">
          <div class="tab">
            <el-switch v-model="form.loginSwitch"
                       :active-value="1"
                       :inactive-value="0"
                       active-color="#256EFF"
                       inactive-color="#ff4949"
                       active-text="开启"
                       inactive-text="关闭"></el-switch>
          </div>

          <div class="tab tab-middle"
               v-if="form.loginSwitch">
            <span>送内购券</span>
            <el-input class="setting-input"
                      v-model="form.loginGiveNum"
                      placeholder="请输入"></el-input>
            <span>张</span>
          </div>
        </el-form-item>

        <!-- 好友助力 -->
        <el-form-item label="好友助力："
                      prop="friendHelpGiveNum">
          <div class="tab">
            <el-switch v-model="form.friendHelpSwitch"
                       :active-value="1"
                       :inactive-value="0"
                       active-color="#256EFF"
                       inactive-color="#ff4949"
                       active-text="开启"
                       inactive-text="关闭"></el-switch>
          </div>

          <div class="tab tab-middle"
               v-if="form.friendHelpSwitch">
            <span>送内购券</span>
            <el-input class="setting-input"
                      v-model="form.friendHelpGiveNum"
                      placeholder="请输入"></el-input>
            <span>张</span>
          </div>
        </el-form-item>

        <!-- 平台派送 -->
        <el-form-item label="平台派送："
                      prop="systemPeriodType">
          <div class="tab">
            <el-switch v-model="form.systemGiveSwitch"
                       :active-value="1"
                       :inactive-value="0"
                       active-color="#256EFF"
                       inactive-color="#ff4949"
                       active-text="开启"
                       inactive-text="关闭"
                       @change="handleChangeSystemStatus"></el-switch>
          </div>

          <div class="tab tab-middle"
               v-if="form.systemGiveSwitch">
            <el-date-picker v-model="form.systemGiveTime"
                            type="datetimerange"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm"
                            :picker-options="systemPeriodParams.optionsOfDate"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right"></el-date-picker>
            <span v-if="!form.systemPeriodSwitch">送内购券</span>
            <el-input class="setting-input"
                      v-model="form.systemGiveNum"
                      placeholder="请输入"
                      v-if="!form.systemPeriodSwitch"></el-input>
            <span v-if="!form.systemPeriodSwitch">张</span>
          </div>

          <!-- 平台派送中的周期派送 -->
          <div class="tab tab-middle period-box"
               v-if="form.systemGiveSwitch">
            <el-checkbox v-model="form.systemPeriodSwitch"
                         style="margin: 10px 0px 10px;">
              <span>周期派送</span>
              <span class="tips">（开启后将在大活动时间内开启周期派送）</span>
            </el-checkbox>
            <el-radio-group v-model="form.systemPeriodType"
                            v-if="form.systemPeriodSwitch">
              <el-radio :label="21">
                <span>每天</span>
                <work-hour-picker :initValue="{startTime:form.systemPeriodFrom.periodStartHourOfDay, endTime:form.systemPeriodFrom.periodEndHourOfDay}"
                                  :ableSupportRest="false"
                                  :is-division-region="false"
                                  number-or-string="string"
                                  @change="handlePPHourOfDayChange"></work-hour-picker>
                <span>送内购券</span>
                <el-input class="setting-input"
                          v-model="form.systemPeriodFrom.systemGiveNumOfDay"
                          placeholder="请输入"
                          :class="systemPeriodParams.isErrorSystemVoucherNumOfDay ? 'is-error' : ''"></el-input>
                <span>张</span>
              </el-radio>

              <el-radio :label="22">
                <span>每周</span>
                <el-select v-model="form.systemPeriodFrom.periodDayOfWeek"
                           multiple
                           placeholder="请选择"
                           @change="handlePPDayOfWeekSelect"
                           class="day-of-week-select"
                           :class="[systemPeriodParams.isDayOfWeekAll ? 'hideTag' : '',systemPeriodParams.isErrorPeriodDayOfWeek ? 'is-error' : '']">
                  <el-option v-for="(item,index) in systemPeriodParams.dayOfWeekOptions"
                             :key="index"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
                <work-hour-picker :initValue="{startTime:form.systemPeriodFrom.periodStartHourOfWeek, endTime:form.systemPeriodFrom.periodEndHourOfWeek}"
                                  :ableSupportRest="false"
                                  :is-division-region="false"
                                  number-or-string="string"
                                  @change="handlePPHourOfWeekChange"></work-hour-picker>
                <span>送内购券</span>
                <el-input class="setting-input"
                          v-model="form.systemPeriodFrom.systemGiveNumOfWeek"
                          placeholder="请输入"
                          :class="systemPeriodParams.isErrorSystemVoucherNumOfWeek ? 'is-error' : ''"></el-input>
                <span>张</span>
              </el-radio>

              <el-radio :label="23">
                <span>每月</span>
                <work-day-picker style="margin-right: 10px;"
                                 :initValue="{startDay:form.systemPeriodFrom.periodMonthStartDay, endDay:form.systemPeriodFrom.periodMonthEndDay}"
                                 is-division-region
                                 @change="handlePPWorkDayChange"></work-day-picker>
                <work-hour-picker :initValue="{startTime:form.systemPeriodFrom.periodStartHourOfMonth, endTime:form.systemPeriodFrom.periodEndHourOfMonth}"
                                  :ableSupportRest="false"
                                  :is-division-region="false"
                                  number-or-string="string"
                                  @change="handlePPHourOfMonthChange"></work-hour-picker>
                <span>送内购券</span>
                <el-input class="setting-input"
                          v-model="form.systemPeriodFrom.systemGiveNumOfMonth"
                          placeholder="请输入"
                          :class="systemPeriodParams.isErrorSystemVoucherNumOfMonth ? 'is-error' : ''"></el-input>
                <span>张</span>
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </div>

      <!-- 内购券时效设置 -->
      <div class="type">
        <div class="type-title">内购券时效设置：</div>
        <el-form-item label="内购券清空时间："
                      prop="lifeCycleSwitch">
          <div class="tab period-box">
            <el-radio-group v-model="form.lifeCycleSwitch">
              <el-radio :label="1">
                <span>每天</span>
                <el-select size="mini"
                           v-model="form.emptyVoucherPeriodFrom.periodHourOfDay"
                           placeholder="请选择"
                           class="empty-voucher-select">
                  <el-option v-for="item in HourOptions"
                             :key="item.k"
                             :label="item.n"
                             :value="item.n">
                  </el-option>
                </el-select>
                <span>清空内购券</span>
              </el-radio>

              <el-radio :label="2">
                <span>每周</span>
                <el-select size="mini"
                           v-model="form.emptyVoucherPeriodFrom.periodDayOfWeek"
                           placeholder="请选择"
                           class="empty-voucher-select">
                  <el-option v-for="item in emptyVoucherParams.dayOfWeekOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
                <el-select size="mini"
                           v-model="form.emptyVoucherPeriodFrom.periodHourOfWeek"
                           placeholder="请选择"
                           class="empty-voucher-select">
                  <el-option v-for="item in HourOptions"
                             :key="item.k"
                             :label="item.n"
                             :value="item.n">
                  </el-option>
                </el-select>
                <span>清空内购券</span>
              </el-radio>

              <el-radio :label="3">
                <span>每月</span>
                <el-select size="mini"
                           v-model="form.emptyVoucherPeriodFrom.periodDayOfMonth"
                           placeholder="请选择"
                           class="empty-voucher-select">
                  <el-option v-for="item in emptyVoucherParams.dayOfMonthOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
                <el-select size="mini"
                           v-model="form.emptyVoucherPeriodFrom.periodHourOfMonth"
                           placeholder="请选择"
                           class="empty-voucher-select">
                  <el-option v-for="item in HourOptions"
                             :key="item.k"
                             :label="item.n"
                             :value="item.n">
                  </el-option>
                </el-select>
                <span>清空内购券</span>
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </div>

      <div class="bottom-button">
        <el-button type="primary" @click="updateBasicSetting">保存</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
import distributionApi from '@/dss-wechat3rd/src/api/distribution.js';
import WorkHourPicker from '@/dss-wechat3rd/src/components/WorkHourPicker/index.vue';
import WorkDayPicker from '@/dss-wechat3rd/src/components/WorkDayPicker/index.vue';
import utilDate from '@/dss-common/utils/date.js';

const regexpsPositiveInteger = /^[1-9]\d{0,2}$/; // 1~999之间的正整数

const selectAllDayOfWeekNum = 7; // 每周全选中，一共为7天

// 每月日期选择项
const dayOfMonthOptions = [
  { label: '1日', value: 1 },
  { label: '2日', value: 2 },
  { label: '3日', value: 3 },
  { label: '4日', value: 4 },
  { label: '5日', value: 5 },
  { label: '6日', value: 6 },
  { label: '7日', value: 7 },
  { label: '8日', value: 8 },
  { label: '9日', value: 9 },
  { label: '10日', value: 10 },
  { label: '11日', value: 11 },
  { label: '12日', value: 12 },
  { label: '13日', value: 13 },
  { label: '14日', value: 14 },
  { label: '15日', value: 15 },
  { label: '16日', value: 16 },
  { label: '17日', value: 17 },
  { label: '18日', value: 18 },
  { label: '19日', value: 19 },
  { label: '20日', value: 20 },
  { label: '21日', value: 21 },
  { label: '22日', value: 22 },
  { label: '23日', value: 23 },
  { label: '24日', value: 24 },
  { label: '25日', value: 25 },
  { label: '26日', value: 26 },
  { label: '27日', value: 27 },
  { label: '28日', value: 28 },
  { label: '29日', value: 29 },
  { label: '30日', value: 30 },
  { label: '31日', value: 31 }
];

export default {
  components: {
    WorkHourPicker,
    WorkDayPicker
  },

  data() {
    // 首次进入内购页的内购券数量输入校验规则
    const checkFirstVoucherNum = (rule, value, callback) => {
      // 首次进入内购页派券状态为1：开启
      if (this.form.firstEnterSwitch) {
        if (!value && value !== 0) {
          return callback(new Error('请输入内购券数量'));
        } else if (!regexpsPositiveInteger.test(value)) {
          return callback(new Error('内购券数量为1~999之间的正整数，并且开头不能为0'));
        }
      }
      return callback();
    };
    // 每日登录的内购券数量输入校验规则
    const checkDailyVoucherNum = (rule, value, callback) => {
      // 每日登录派券状态为1：开启
      if (this.form.loginSwitch) {
        if (!value && value !== 0) {
          return callback(new Error('请输入内购券数量'));
        } else if (!regexpsPositiveInteger.test(value)) {
          return callback(new Error('内购券数量为1~999之间的正整数，并且开头不能为0'));
        }
      }
      return callback();
    };
    // 好友助力的内购券数量输入校验规则
    const checkAssistVoucherNum = (rule, value, callback) => {
      // 好友助力派券状态状态为1：开启
      if (this.form.friendHelpSwitch) {
        if (!value && value !== 0) {
          return callback(new Error('请输入内购券数量'));
        } else if (!regexpsPositiveInteger.test(value)) {
          return callback(new Error('内购券数量为1~999之间的正整数，并且开头不能为0'));
        }
      }
      return callback();
    };
    // 平台派送的内购券校验规则
    const checkSystemPeriodType = (rule, value, callback) => {
      // 平台派送状态为1：开启
      if (this.form.systemGiveSwitch) {
        const systemGiveTime = this.form.systemGiveTime || []; // 平台派送日期
        const systemGiveNum = this.form.systemGiveNum; // 平台派送内购券数量
        const systemPeriodSwitch = this.form.systemPeriodSwitch; // 平台派送周期设置状态，0：关闭，1：开启
        const systemGiveNumOfDay = this.form.systemPeriodFrom.systemGiveNumOfDay; // 每天派券数量
        const periodDayOfWeek = this.form.systemPeriodFrom.periodDayOfWeek || []; // 每周选中的天数
        const systemGiveNumOfWeek = this.form.systemPeriodFrom.systemGiveNumOfWeek; // 每周派券数量
        const systemGiveNumOfMonth = this.form.systemPeriodFrom.systemGiveNumOfMonth; // 每月派券数量

        this.systemPeriodParams.isErrorSystemVoucherNumOfDay = false; // 周期设置中的每天派券数量是否显示错误
        this.systemPeriodParams.isErrorPeriodDayOfWeek = false; // 周期设置中的每周类型是否显示错误
        this.systemPeriodParams.isErrorSystemVoucherNumOfWeek = false; // 周期设置中的每周派券数量是否显示错误
        this.systemPeriodParams.isErrorSystemVoucherNumOfMonth = false; // 周期设置中的每月派券数量是否显示错误

        if (systemGiveTime.length < 1) {
          return callback(new Error('请选择平台派送日期'));
        } else if (!systemGiveNum && systemGiveNum !== 0) {
          return callback(new Error('请输入平台派送内购券数量'));
        } else if (!regexpsPositiveInteger.test(systemGiveNum)) {
          return callback(new Error('内购券数量为1~999之间的正整数，并且开头不能为0'));
        } else if (systemPeriodSwitch && systemPeriodSwitch > 0) {
          if (value === 21) {
            // 平台派送周期类型为21：每天
            if (!systemGiveNumOfDay && systemGiveNumOfDay !== 0) {
              this.systemPeriodParams.isErrorSystemVoucherNumOfDay = true; // 周期设置中的每天派券数量是否显示错误
              return callback(new Error('请输入每天内购券数量'));
            } else if (!regexpsPositiveInteger.test(systemGiveNumOfDay)) {
              return callback(new Error('内购券数量为1~999之间的正整数，并且开头不能为0'));
            }
          } else if (value === 22) {
            // 平台派送周期类型为22：每周
            if (periodDayOfWeek.length < 1) {
              this.systemPeriodParams.isErrorPeriodDayOfWeek = true; // 周期设置中的每周类型是否显示错误
              return callback('请选择每周参与的天数');
            } else if (!systemGiveNumOfWeek && systemGiveNumOfWeek !== 0) {
              this.systemPeriodParams.isErrorSystemVoucherNumOfWeek = true; // 周期设置中的每周派券数量是否显示错误
              return callback(new Error('请输入每周派送内购券数量'));
            } else if (!regexpsPositiveInteger.test(systemGiveNumOfWeek)) {
              return callback(new Error('内购券数量为1~999之间的正整数，并且开头不能为0'));
            }
          } else if (value === 23) {
            // 平台派送周期类型为23：每月
            if (!systemGiveNumOfMonth && systemGiveNumOfMonth !== 0) {
              this.systemPeriodParams.isErrorSystemVoucherNumOfMonth = true; // 周期设置中的每月派券数量是否显示错误
              return callback(new Error('请输入每月派送内购券数量'));
            } else if (!regexpsPositiveInteger.test(systemGiveNumOfMonth)) {
              return callback(new Error('内购券数量为1~999之间的正整数，并且开头不能为0'));
            }
          }
        }
      }
      return callback();
    };
    // 平台清空内购券周期类型校验规则
    const checkEmptyVoucherType = (rule, value, callback) => {
      if (!value || value < 0) {
        return callback(new Error('请选择内购券清空时间类型'));
      }
      return callback();
    };

    return {
      loading: false,

      form: {
        firstEnterSwitch: 0, // 首次进入内购页派券状态，0：关闭，1：开启
        firstEnterGiveNum: null, // 首次进入内购页派券数量

        loginSwitch: 0, // 每日登录派券状态，0：关闭，1：开启
        loginGiveNum: null, // 每日登录派券数量

        friendHelpSwitch: 0, // 好友助力派券状态，0：关闭，1：开启
        friendHelpGiveNum: null, // 好友助力派券数量

        systemGiveSwitch: 0, // 平台派送状态，0：关闭，1：开启，(开启平台派送，未开启周期派送，保存设置时需要将systemGiveSwitch设置为10：大周期)
        systemGiveNum: null, // 平台派送派券数量
        systemGiveTime: [], // 平台派送时间（"startTime": "2019-08-30 00:00:00",  "endTime": "2019-09-30 00:00:00",）
        systemPeriodSwitch: false, // 平台派送周期设置状态，0：关闭，1：开启
        systemPeriodType: 21, // 平台派送周期类型，10：大周期，21：每天，22：每周，23：每月
        // 平台派送周期设置参数对象
        systemPeriodFrom: {
          periodStartHourOfDay: '00:00', // 每天开始时间
          periodEndHourOfDay: '00:30', // 每天结束时间
          systemGiveNumOfDay: null, // 每天派券数量

          periodDayOfWeek: [], // 每周选中的天数
          periodStartHourOfWeek: '00:00', // 每周的每天开始时间
          periodEndHourOfWeek: '00:30', // 每周的每天结束时间
          systemGiveNumOfWeek: null, // 每周派券数量

          periodMonthStartDay: 1, // 每月开始日期
          periodMonthEndDay: 2, // 每月结束日期
          periodStartHourOfMonth: '00:00', // 每月的每天开始时间
          periodEndHourOfMonth: '00:30', // 每月的每天结束时间
          systemGiveNumOfMonth: null // 每月派券数量
        },

        lifeCycleSwitch: 1, // 清空内购券周期类型，1：每天，2：每周，3：每月
        // 内购券清空周期设置参数对象
        emptyVoucherPeriodFrom: {
          periodHourOfDay: '00:00', // 每天的时间点
          periodDayOfWeek: 1, // 每周选中的某一天
          periodHourOfWeek: '00:00', // 每周的每天时间点
          periodDayOfMonth: 1, // 每月选中的某一天
          periodHourOfMonth: '00:00' // 每月的每天时间点
        }
      },

      // 平台派送周期设置参数备选项
      systemPeriodParams: {
        // 日期时间选择项
        optionsOfDate: {
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
        // 每周天数选择项
        dayOfWeekOptions: [
          { label: '全选', value: 7 },
          { label: '周日', value: 0 },
          { label: '周一', value: 1 },
          { label: '周二', value: 2 },
          { label: '周三', value: 3 },
          { label: '周四', value: 4 },
          { label: '周五', value: 5 },
          { label: '周六', value: 6 }
        ],
        isDayOfWeekAll: false, // 每周天数是否为全选状态
        isErrorSystemVoucherNumOfDay: false, // 周期设置中的每天派券数量是否显示错误
        isErrorPeriodDayOfWeek: false, // 周期设置中的每周类型是否显示错误
        isErrorSystemVoucherNumOfWeek: false, // 周期设置中的每周派券数量是否显示错误
        isErrorSystemVoucherNumOfMonth: false // 周期设置中的每月派券数量是否显示错误
      },

      // 内购券清空周期设置参数备选项
      emptyVoucherParams: {
        // 每周天数选择项
        dayOfWeekOptions: [
          { label: '周日', value: 0 },
          { label: '周一', value: 1 },
          { label: '周二', value: 2 },
          { label: '周三', value: 3 },
          { label: '周四', value: 4 },
          { label: '周五', value: 5 },
          { label: '周六', value: 6 }
        ],
        dayOfMonthOptions: dayOfMonthOptions // 每月天数的选择项
      },

      rules: {
        // 首次进入内购页派券数量
        firstEnterGiveNum: [{ validator: checkFirstVoucherNum, tigger: ['blur', 'change'] }],
        // 每日登录派券数量
        loginGiveNum: [{ validator: checkDailyVoucherNum, tigger: ['blur', 'change'] }],
        // 好友助力派券数量
        friendHelpGiveNum: [{ validator: checkAssistVoucherNum, tigger: ['blur', 'change'] }],
        // 平台派送周期
        systemPeriodType: [{ validator: checkSystemPeriodType, trigger: ['blur', 'change'] }],
        // 内购券清空周期
        lifeCycleSwitch: [{ validator: checkEmptyVoucherType, trigger: ['blur', 'change'] }]
      }
    };
  },

  computed: {
    // 时间点选择选项
    HourOptions() {
      const Max = 48;
      let list = [];
      let cur = 0;
      let isOdd = false;
      let i = 0;
      function getBefore(cur) {
        cur = parseInt(cur / 2);
        if (cur >= 24) {
          cur -= 24;
        }
        return cur > 9 ? cur : '0' + cur;
      }
      for (; i < Max; i++) {
        cur = i;
        isOdd = cur % 2 == 0; //偶数
        if (cur < Max) {
          list.push({
            k: cur,
            n: getBefore(cur) + ':' + (isOdd ? '00' : '30')
          });
        }
      }
      return list;
    }
  },

  mounted() {
    this.getVoucherRule(); // 获取内购券规则
  },
  methods: {
    /**
     * 获取内购券规则
     */
    getVoucherRule() {
      const params = {};

      this.loading = true;
      distributionApi.internalPurchase
        .getVoucherRule(params)
        .done(res => {
          const resData = res.data;
          if (resData) {
            Object.keys(this.form).forEach(key => {
              if (resData.hasOwnProperty(key) && resData[key]) {
                this.form[key] = resData[key];
              }
            });

            // 判断平台派送状态不等于关闭状态码，都设置为开启状态
            if (resData.systemGiveSwitch && resData.systemGiveSwitch !== 0) {
              this.form.systemGiveSwitch = 1;
              // 平台派送周期设置状态，false：关闭，true：开启
              if (resData.systemGiveSwitch !== 10) {
                this.form.systemPeriodSwitch = true;
                this.form.systemPeriodType = resData.systemGiveSwitch;
              }
            }

            // 平台派送时间
            if (resData.systemGiveTimeS && resData.systemGiveTimeE) {
              this.form.systemGiveTime = [new Date(resData.systemGiveTimeS), new Date(resData.systemGiveTimeE)];
            }

            // 设置平台派送周期对应每周的天数;
            this.form.systemPeriodFrom.periodDayOfWeek = [];
            if (resData.periodicityWeekNum) {
              let weekRange = resData.periodicityWeekNum.split(',');
              // 判断接口返回的每周选中天数是否为全选，是则在数组第一位添加全选的状态标识
              if (weekRange.length === selectAllDayOfWeekNum) {
                weekRange.unshift(selectAllDayOfWeekNum);
                this.systemPeriodParams.isDayOfWeekAll = true; // 每周天数是否为全选状态
              }
              weekRange.forEach(item => {
                this.form.systemPeriodFrom.periodDayOfWeek.push(Number(item));
              });
            }

            // 设置平台派送周期对应每月的天数
            if (resData.periodicityDayNumS && resData.periodicityDayNumE) {
              this.form.systemPeriodFrom.periodMonthStartDay = resData.periodicityDayNumS;
              this.form.systemPeriodFrom.periodMonthEndDay = resData.periodicityDayNumE;
            }

            // 设置平台派送周期对应的时间点数
            if (resData.periodicityTimeStringS && resData.periodicityTimeStringE) {
              if (this.form.systemPeriodType === 21) {
                this.form.systemPeriodFrom.periodStartHourOfDay = resData.periodicityTimeStringS;
                this.form.systemPeriodFrom.periodEndHourOfDay = resData.periodicityTimeStringE;
              } else if (this.form.systemPeriodType === 22) {
                this.form.systemPeriodFrom.periodStartHourOfWeek = resData.periodicityTimeStringS;
                this.form.systemPeriodFrom.periodEndHourOfWeek = resData.periodicityTimeStringE;
              } else if (this.form.systemPeriodType === 23) {
                this.form.systemPeriodFrom.periodStartHourOfMonth = resData.periodicityTimeStringS;
                this.form.systemPeriodFrom.periodEndHourOfMonth = resData.periodicityTimeStringE;
              }
            }

            // 设置平台派送周期对应的派券数量
            if (resData.systemGiveNum) {
              if (this.form.systemPeriodType === 21) {
                this.form.systemPeriodFrom.systemGiveNumOfDay = resData.systemGiveNum;
              } else if (this.form.systemPeriodType === 22) {
                this.form.systemPeriodFrom.systemGiveNumOfWeek = resData.systemGiveNum;
              } else if (this.form.systemPeriodType === 23) {
                this.form.systemPeriodFrom.systemGiveNumOfMonth = resData.systemGiveNum;
              }
            }

            // 设置清空内购券周期对应每周的天数
            this.form.emptyVoucherPeriodFrom.periodDayOfWeek = Number(resData.cleanWeekNum) || 1;

            // 设置清空内购券周期对应每月的天数
            this.form.emptyVoucherPeriodFrom.periodDayOfMonth = Number(resData.cleanDayNum) || 1;

            // 设置清空内购券周期对应的时间点数
            if (resData.cleanTime) {
              if (this.form.lifeCycleSwitch === 1) {
                this.form.emptyVoucherPeriodFrom.periodHourOfDay = resData.cleanTimeString;
              } else if (this.form.lifeCycleSwitch === 2) {
                this.form.emptyVoucherPeriodFrom.periodHourOfWeek = resData.cleanTimeString;
              } else if (this.form.lifeCycleSwitch === 3) {
                this.form.emptyVoucherPeriodFrom.periodHourOfMonth = resData.cleanTimeString;
              }
            }
          }
        })
        .always(res => {
          this.loading = false;
        });
    },

    handleChangeSystemStatus(value) {
      // 手动触发平台派送周期验证
      this.$refs.form.validateField('systemPeriodType');
    },

    /**
     * 接收每天开始结束时间变化
     */
    handlePPHourOfDayChange(opt) {
      this.form.systemPeriodFrom.periodStartHourOfDay = opt.startTime;
      this.form.systemPeriodFrom.periodEndHourOfDay = opt.endTime;
    },

    /**
     * 接收平台派送周期每周选中的天数变化
     */
    handlePPDayOfWeekSelect(value) {
      let allDays = [];

      if (this.systemPeriodParams.isDayOfWeekAll) {
        // 取消全选
        if (
          !value.includes(selectAllDayOfWeekNum) &&
          this.systemPeriodParams.dayOfWeekOptions.length - 1 === value.length
        ) {
          this.form.systemPeriodFrom.periodDayOfWeek = [];
          this.systemPeriodParams.isDayOfWeekAll = false;
        }
        // 任意选择取消全选
        if (
          value.includes(selectAllDayOfWeekNum) &&
          this.systemPeriodParams.dayOfWeekOptions.length - 1 === value.length
        ) {
          value.shift();
          this.form.systemPeriodFrom.periodDayOfWeek = value;
          this.systemPeriodParams.isDayOfWeekAll = false;
        }
      } else {
        // 选择全选
        if (value.includes(selectAllDayOfWeekNum)) {
          this.systemPeriodParams.dayOfWeekOptions.forEach(item => {
            allDays.push(item.value);
          });
          this.form.systemPeriodFrom.periodDayOfWeek = allDays;
          this.systemPeriodParams.isDayOfWeekAll = true;
        }
        // 全部勾选的时候，默认全选
        if (
          !value.includes(selectAllDayOfWeekNum) &&
          value.length === this.systemPeriodParams.dayOfWeekOptions.length - 1
        ) {
          value.unshift(selectAllDayOfWeekNum);
          this.form.systemPeriodFrom.periodDayOfWeek = value;
          this.systemPeriodParams.isDayOfWeekAll = true;
        }
      }
    },
    /**
     * 接收平台派送周期每周的每天开始结束时间变化
     */
    handlePPHourOfWeekChange(opt) {
      this.form.systemPeriodFrom.periodStartHourOfWeek = opt.startTime;
      this.form.systemPeriodFrom.periodEndHourOfWeek = opt.endTime;
    },

    /**
     * 接收平台派送周期每月开始结束日期的变化
     */
    handlePPWorkDayChange(opt) {
      this.form.systemPeriodFrom.periodMonthStartDay = opt.startDay;
      this.form.systemPeriodFrom.periodMonthEndDay = opt.endDay;
    },
    /**
     * 接收平台派送周期每月的每天开始结束时间变化
     */
    handlePPHourOfMonthChange(opt) {
      this.form.systemPeriodFrom.periodStartHourOfMonth = opt.startTime;
      this.form.systemPeriodFrom.periodEndHourOfMonth = opt.endTime;
    },

    /**
     * 保存设置
     */
    updateBasicSetting() {
      this.$refs.form.validate(valid => {
        // 判断是否表单验证通过
        if (!valid) {
          return false;
        }

        let params = {
          ...this.form
        };

        // 首次进入内购页派券
        params.firstEnterGiveNum = Number(params.firstEnterGiveNum);
        if (!params.firstEnterSwitch) {
          delete params.firstEnterGiveNum;
        }

        // 每日登录派券
        params.loginGiveNum = Number(params.loginGiveNum);
        if (!params.loginSwitch) {
          delete params.loginGiveNum;
        }

        // 好友助力派券
        params.friendHelpGiveNum = Number(params.friendHelpGiveNum);
        if (!params.friendHelpSwitch) {
          delete params.friendHelpGiveNum;
        }

        // 平台派送参数
        if (!params.systemGiveSwitch) {
          delete params.systemPeriodFrom;
          delete params.systemGiveNum;
        } else {
          params.systemGiveSwitch = params.systemPeriodSwitch ? params.systemPeriodType : 10;

          // 平台派送时间
          if (params.systemGiveTime && params.systemGiveTime.length > 0) {
            const timemat = 'YYYY-MM-DD HH:mm';
            if (typeof this.form.systemGiveTime[0] === 'string') {
              params.systemGiveTimeS = params.systemGiveTime[0];
            } else {
              params.systemGiveTimeS = utilDate.format(params.systemGiveTime[0], timemat);
            }
            if (typeof this.form.systemGiveTime[1] === 'string') {
              params.systemGiveTimeE = params.systemGiveTime[1];
            } else {
              params.systemGiveTimeE = utilDate.format(params.systemGiveTime[1], timemat);
            }
          }

          // 根据周期类型设置不同请求参数，平台派送周期类型，10：大周期，21：每天，22：每周，23：每月
          if (params.systemGiveSwitch === 21) {
            params.periodicityTimeS = params.systemPeriodFrom.periodStartHourOfDay;
            params.periodicityTimeE = params.systemPeriodFrom.periodEndHourOfDay;

            params.systemGiveNum = params.systemPeriodFrom.systemGiveNumOfDay;
          } else if (params.systemGiveSwitch === 22) {
            let weekRange = [];
            const periodDayOfWeek = params.systemPeriodFrom.periodDayOfWeek || [];
            // 去除数组中全选的状态标识
            periodDayOfWeek.forEach(item => {
              if (item < selectAllDayOfWeekNum) {
                weekRange.push(item);
              }
            });
            // 对每周选中的日期数组进行从小到大排序
            weekRange = weekRange.sort();
            // 将每周选中的天数组成字符串进行接口请求
            params.periodicityWeekNum = weekRange.toString();

            params.periodicityTimeS = params.systemPeriodFrom.periodStartHourOfWeek;
            params.periodicityTimeE = params.systemPeriodFrom.periodEndHourOfWeek;

            params.systemGiveNum = params.systemPeriodFrom.systemGiveNumOfWeek;
          } else if (params.systemGiveSwitch === 23) {
            params.periodicityDayNumS = params.systemPeriodFrom.periodMonthStartDay;
            params.periodicityDayNumE = params.systemPeriodFrom.periodMonthEndDay;

            params.periodicityTimeS = params.systemPeriodFrom.periodStartHourOfMonth;
            params.periodicityTimeE = params.systemPeriodFrom.periodEndHourOfMonth;

            params.systemGiveNum = params.systemPeriodFrom.systemGiveNumOfMonth;
          }
          params.systemGiveNum = Number(params.systemGiveNum);
        }
        delete params.systemGiveTime;
        delete params.systemPeriodType;
        delete params.systemPeriodSwitch;
        delete params.systemPeriodFrom;

        // 内购券清空周期参数
        // 根据周期类型设置不同请求参数，清空内购券周期类型，1：每天，2：每周，3：每月
        if (params.lifeCycleSwitch === 1) {
          params.cleanTime = params.emptyVoucherPeriodFrom.periodHourOfDay;
        } else if (params.lifeCycleSwitch === 2) {
          params.cleanWeekNum = params.emptyVoucherPeriodFrom.periodDayOfWeek.toString();
          params.cleanTime = params.emptyVoucherPeriodFrom.periodHourOfWeek;
        } else if (params.lifeCycleSwitch === 3) {
          params.cleanDayNum = params.emptyVoucherPeriodFrom.periodDayOfMonth;
          params.cleanTime = params.emptyVoucherPeriodFrom.periodHourOfMonth;
        }
        delete params.emptyVoucherPeriodFrom;

        this.saveBasicSetting(params); // 执行设置保存接口
      });
    },

    /**
     * 执行设置保存接口
     */
    saveBasicSetting(params) {
      this.loading = true;
      distributionApi.internalPurchase
        .saveVoucherRule(params)
        .done(res => {
          this.$message.success('保存成功');
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>
