<template>
  <form-page-layout
    :model="form"
    :rules="rules"
    ref="formPage"
    label-width="126px"
    :title-visible="false"
    :submit-handler="handleSubmit"
  >
    <form-group>
      <template #title>{{ status === 0 ? '新增倍率活动' : status === 1 ? '编辑倍率活动' : '倍率活动详情' }}</template>
      <el-form-item label="活动名称" prop="activityName">
        <el-input
          class="w220"
          v-model="form.activityName"
          :disabled="status === 2"
          placeholder="请输入活动名称"
          @blur="checkActivityName"
        ></el-input>
      </el-form-item>
      <el-form-item label="有效时间" prop="validateTime">
        <el-radio-group v-model="timeType" :disabled="status === 2">
          <el-radio :label="1"
            >永久有效
            <el-date-picker
              class="w200 date-picker"
              :disabled="timeType !== 1 || status === 2"
              type="datetime"
              v-model="form.startTime"
              placeholder="开始日期"
              style="margin-left: 10px"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-radio>
          <el-radio :label="2"
            >固定时间段
            <el-date-picker
              class="w420"
              :disabled="timeType !== 2 || status === 2"
              type="datetimerange"
              v-model="form.period"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="margin-left: 10px"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="积分规则" prop="ruleId">
        <el-button class="button-plain" v-if="status !== 2" type="plain" :disabled="status === 2" @click="ruleSelect"
          >选择积分规则</el-button
        >
        <br v-if="status !== 2" />
        <span v-if="status !== 2" class="form-item-span">分辨率活动适用范围遵循积分规则创建时使用范围</span>
        <el-table v-if="scoreList.length > 0" ref="table" :data="scoreList" style="width: 800px">
          <el-table-column header-align="center" align="center" prop="ruleName" label="规则名称"> </el-table-column>
          <el-table-column header-align="center" align="center" prop="score" label="积分数量">
            <template slot-scope="">
              <span>-</span>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="validStartTime" label="有效时间" width="240">
            <template slot-scope="scope">
              <span v-if="scope.row.validType === validityType.permanent">永久</span>
              <div v-else>
                <div>{{ scope.row.validStartTime.slice(0, -3) }}</div>
                <div>{{ scope.row.validEndTime.slice(0, -3) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="createBy" label="创建人"> </el-table-column>
          <el-table-column header-align="center" align="center" label="适用范围">
            <template slot-scope="scope">
              <span v-text="scope.row.validAppName ? scope.row.validAppName : '全部'"></span>
            </template>
          </el-table-column>
          <el-table-column v-if="status !== 2" header-align="center" align="center" prop="prop" label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="onDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="参与会员" prop="partakeMembers">
        <el-radio-group v-model="memberMatchRule" :disabled="status === 2">
          <el-radio :label="1">满足一项选中条件即可</el-radio>
          <el-radio :label="0">满足全部选中条件</el-radio>
          <el-radio :label="2">无限制</el-radio>
        </el-radio-group>
        <el-checkbox-group v-model="partakeMembers" :disabled="status === 2 || memberMatchRule === 2">
          <el-checkbox class="checkbox" label="1">
            <div @click.capture.prevent>
              会员级别：
              <el-select
                class="w220"
                v-model="form.level"
                multiple
                clearable
                :disabled="!partakeMembers.includes('1') || status === 2"
                placeholder="请选择会员级别"
                @change="levelChange"
              >
                <el-option v-for="item in levelList" :key="item.id" :label="item.levelName" :value="item.levelNumber">
                </el-option>
              </el-select>
            </div>
          </el-checkbox>
          <br />
          <el-checkbox class="checkbox" label="2">会员性别：</el-checkbox>
          <el-radio-group
            style="margin-top: -10px"
            v-model="form.gender"
            @change="$forceUpdate()"
            :disabled="!partakeMembers.includes('2') || status === 2"
          >
            <el-radio v-for="(item, index) in genders" :key="index" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
          <!-- <br>
          <el-checkbox class="checkbox" label="会员卡尾数" name="3"></el-checkbox>
          <el-select class="w220" v-model="form.mantissa" multiple placeholder="请选择会员卡尾数">
            <el-option
              v-for="item in [0,1,2,3,4,5,6,7,8,9]"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select> -->
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="触发时间">
        <el-radio-group v-model="triggerMatchRule" :disabled="status === 2">
          <el-radio :label="1">满足一项选中条件即可</el-radio>
          <el-radio :label="0">满足全部选中条件</el-radio>
          <el-radio :label="2">无限制</el-radio>
        </el-radio-group>
        <el-checkbox-group v-model="triggerTime" :disabled="status === 2 || triggerMatchRule === 2">
          <el-checkbox label="1">
            <div @click.capture.prevent>
              每周
              <el-select
                class="w220"
                v-model="form.weekly"
                multiple
                placeholder="请选择"
                :disabled="!triggerTime.includes('1') || status === 2"
                @change="weekChange"
              >
                <!--  :disabled='item.disabled' -->
                <el-option v-for="item in weekly" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <span style="margin-left: 40px; margin-right: 10px">时间段</span>
              <el-time-picker
                class="w220"
                format="HH:mm"
                value-format="HH:mm"
                is-range
                :disabled="!triggerTime.includes('1') || status === 2"
                v-model="form.weekTime"
                :clearable="false"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                @change="weekTimeChange"
              >
              </el-time-picker>
            </div>
          </el-checkbox>
          <br />
          <el-checkbox label="2">
            <div @click.capture.prevent>
              每月
              <el-select
                class="w220"
                v-model="form.perMonth"
                multiple
                placeholder="请选择"
                :disabled="!triggerTime.includes('2') || status === 2"
                @change="perMonthChange"
              >
                <el-option v-for="(item, index) in month" :key="index" :label="item" :value="index + 1"> </el-option>
              </el-select>
              <span style="margin-left: 40px; margin-right: 10px">时间段</span>
              <el-time-picker
                class="w220"
                format="HH:mm"
                value-format="HH:mm"
                is-range
                :clearable="false"
                :disabled="!triggerTime.includes('2') || status === 2"
                v-model="form.monthTime"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              >
              </el-time-picker>
            </div>
          </el-checkbox>
          <br />
          <el-checkbox label="3"
            >每天
            <span style="margin-left: 40px; margin-right: 10px">时间段</span>
            <el-time-picker
              class="w220"
              format="HH:mm"
              value-format="HH:mm"
              is-range
              :clearable="false"
              :disabled="!triggerTime.includes('3') || status === 2"
              v-model="form.dayTime"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            >
            </el-time-picker>
          </el-checkbox>
          <br />
          <el-checkbox label="4">会员生日当天</el-checkbox>
          <br />
          <el-checkbox label="5">会员生日当月</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="积分倍率" prop="scoreMulti">
        <el-input
          :disabled="status === 2"
          style="width: 100px; margin-right: 10px"
          min="1"
          max="300"
          type="number"
          step="0.5"
          v-model="form.scoreMulti"
        ></el-input
        >倍
      </el-form-item>
    </form-group>
    <template v-if="status !== 2" #footer>
      <form-button action="cancel" />
      <form-button />
    </template>
    <score-rule-select ref="ruleSelectDialog" @selected="selected"></score-rule-select>
  </form-page-layout>
</template>
<script>
  import { validityType } from '@/mod-member/src/views/score-center/enum/score';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import ScoreRuleSelect from '@/mod-member/src/components/score-rule-select/list';
  import memberApi from '@/mod-member/src/api/memberAPI';

  export default {
    components: {
      FormPageLayout,
      FormGroup,
      FormButton,
      ScoreRuleSelect,
    },
    data() {
      const checkActivityName = (rule, value, callback) => {
        if (value.length === 0) {
          return callback(new Error('请输入活动名称'));
        } else if (this.activityNameExist) {
          return callback(new Error('活动名称已存在，请重新输入'));
        } else return callback();
      };
      const checkoutValidateTime = (rule, value, callback) => {
        if (!this.form.startTime && this.form.period.length === 0) {
          return callback(new Error('请选择有效时间'));
        } else {
          return callback();
        }
      };
      const checkScoreMulti = (rule, value, callback) => {
        if (value === 0 || value === '') {
          return callback(new Error('请输入积分倍率'));
        } else if (value <= 1) {
          return callback(new Error('积分倍率必须大于1'));
        }
        return callback();
      };
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7; // 当天之后的时间可选
            // return time.getTime() > Date.now() - 8.64e7;//当天之前的时间可选
            // return time.getTime() > Date.now() ;//当天之前的时间可选---不包括当天
          },
        },
        status: 0,
        validityType,
        activityNameExist: false,
        memberMatchRule: 1,
        triggerMatchRule: 1,
        scoreList: [],
        // 会员级别
        levelList: [],
        genders: [
          {
            label: '全部',
            value: '',
          },
          {
            label: '男',
            value: '1',
          },
          {
            label: '女',
            value: '2',
          },
        ],
        // 会员卡尾数
        // mantissa: [
        //   {
        //     label:
        //   }
        // ],
        weekly: [
          {
            label: '一',
            value: '1',
          },
          {
            label: '二',
            value: '2',
          },
          {
            label: '三',
            value: '3',
          },
          {
            label: '四',
            value: '4',
          },
          {
            label: '五',
            value: '5',
          },
          {
            label: '六',
            value: '6',
          },
          {
            label: '日',
            value: '0',
          },
        ],
        month: [...Array(31)].map((k, i) => i + 1 + '日'),
        triggerTime: [],
        partakeMembers: [],
        timeType: 1,
        ruleName: '',
        detail: null,
        triggerMemRuleJson: null,
        form: {
          activityName: '',
          startTime: null,
          validateTime: '',
          endTime: null,
          ruleId: null,
          // 固定时间段
          period: [],
          level: [],
          gender: null,
          mantissa: [],
          weekly: [],
          perMonth: [],
          weekTime: [],
          monthTime: [],
          dayTime: [],
          scoreMulti: '',
        },
        rules: {
          // message: '请输入活动名称',
          activityName: [{ required: true, validator: checkActivityName, trigger: 'blur' }],
          validateTime: [{ required: true, validator: checkoutValidateTime, trigger: 'blur' }],
          ruleId: [{ required: true, message: '请选择积分规则', trigger: 'change' }],
          scoreMulti: [{ required: true, validator: checkScoreMulti, trigger: 'blur' }],
        },
      };
    },
    watch: {
      timeType: {
        handler(newVal, oldVal) {
          if (newVal === 1) {
            this.form.period = [];
          } else {
            this.form.startTime = '';
          }
        },
      },
      partakeMembers: {
        handler(newVal, oldVal) {
          if (newVal.includes('1')) {
            this.form.level = this.form.level.length === 0 ? [] : this.form.level;
          }
          if (newVal.includes('2')) {
            this.form.gender = '' || this.triggerMemRuleJson ? this.triggerMemRuleJson.sex : '';
          }
          if (!newVal.includes('2') && this.triggerMemRuleJson) {
            this.triggerMemRuleJson.sex = '';
          }
          if (!newVal.includes('1')) {
            this.form.level = [];
          }
          if (!newVal.includes('2')) {
            this.form.gender = null;
          }
        },
      },
      triggerTime: {
        handler(newVal, oldVal) {
          if (newVal.includes('1')) {
            // this.form.weekly = [''];
            this.form.weekTime = ['00:00', '23:59'];
          }
          if (newVal.includes('2')) {
            this.form.monthTime = ['00:00', '23:59'];
            // this.form.perMonth = ['全部'];
          }
          if (newVal.includes('3')) {
            this.form.dayTime = ['00:00', '23:59'];
          }

          if (!newVal.includes('1')) {
            this.form.weekTime = [];
            this.form.weekly = [];
          }
          if (!newVal.includes('2')) {
            this.form.monthTime = [];
            this.form.perMonth = [];
          }
          if (!newVal.includes('3')) {
            this.form.dayTime = [];
          }
        },
      },
      memberMatchRule: {
        handler(newVal, oldVal) {
          if (newVal === 2) {
            this.partakeMembers = [];
          }
        },
      },
      triggerMatchRule: {
        handler(newVal, oldVal) {
          if (newVal === 2) {
            this.triggerTime = [];
          }
        },
      },
    },
    mounted() {
      // this.month.splice(0, 0, '全部');
      // console.log(this.$route.query);
      this.status = parseInt(this.$route.query.status);
      memberApi.levelManager.getLevelList().then(res => {
        this.levelList = res.data;
      });
      if (this.$route.query.id !== undefined) {
        memberApi.scoreCenter.scoreMultipleDetail({ id: this.$route.query.id }).then(res => {
          if (res.success) {
            const data = res.data;
            this.detail = data;
            this.form = { ...res.data };
            this.timeType = data.endTime ? 2 : 1;
            if (data.endTime !== null) {
              this.form.period = [data.startTime, data.endTime];
            } else {
              this.form.startTime = data.startTime;
            }
            const triggerMemRuleJson = JSON.parse(data.triggerMemRuleJson);
            this.triggerMemRuleJson = triggerMemRuleJson;
            const triggerTimeRuleJson = JSON.parse(data.triggerTimeRuleJson);
            this.memberMatchRule = triggerMemRuleJson.triggerOff;
            if (triggerMemRuleJson.level !== null) {
              this.partakeMembers.push('1');
              this.form.level = triggerMemRuleJson.level === '' ? ['全部'] : triggerMemRuleJson.level || [];
            }
            if (triggerMemRuleJson.sex !== null) {
              this.partakeMembers.push('2');
              this.form.gender = triggerMemRuleJson.sex;
            }
            this.triggerMatchRule = triggerTimeRuleJson.triggerOff;

            if (triggerTimeRuleJson.weekly !== null) {
              this.form.weekly = triggerTimeRuleJson.weekly === '' ? ['全部'] : triggerTimeRuleJson.weekly || [];
              this.$set(this.form, 'weekTime', [triggerTimeRuleJson.weekStartTime, triggerTimeRuleJson.weekEndTime]);
              this.triggerTime.push('1');
            } else {
              this.$set(this.form, 'weekTime', []);
            }
            if (triggerTimeRuleJson.perMonth !== null) {
              this.form.perMonth = triggerTimeRuleJson.perMonth === '' ? ['全部'] : triggerTimeRuleJson.perMonth || [];
              this.$set(this.form, 'monthTime', [triggerTimeRuleJson.monthStartTime, triggerTimeRuleJson.monthEndTime]);
              this.triggerTime.push('2');
            } else {
              this.$set(this.form, 'monthTime', []);
            }
            if (triggerTimeRuleJson.dayStartTime !== null) {
              // this.form.dayTime = [triggerTimeRuleJson.dayStartTime, triggerTimeRuleJson.dayEndTime];
              this.$set(this.form, 'dayTime', [triggerTimeRuleJson.dayStartTime, triggerTimeRuleJson.dayEndTime]);
              this.triggerTime.push('3');
            } else {
              this.$set(this.form, 'dayTime', []);
            }
            if (triggerTimeRuleJson.birthDay !== null) {
              this.triggerTime.push('4');
            }
            if (triggerTimeRuleJson.birthMonth !== null) {
              this.triggerTime.push('5');
            }

            // data.scoreRuleConfigDTO.id 数据没返回，前端兼容
            if (data.scoreRuleConfigDTO.id === null) {
              data.scoreRuleConfigDTO.id = data.ruleId;
            }
            this.scoreList = [data.scoreRuleConfigDTO];
          }
        });
      }
    },
    methods: {
      async handleSubmit() {
        if (this.memberMatchRule !== 2 && this.partakeMembers.length === 0) {
          this.$message.error('请至少选择一条参与会员条件');
          throw new Error('');
        }
        if (this.triggerMatchRule !== 2 && this.triggerTime.length === 0) {
          this.$message.error('请至少选择一条触发时间');
          throw new Error('');
        }

        const timeRuleJson = {
          weekly: this.triggerTime.includes('1') ? (this.form.weekly[0] === '全部' ? '' : this.form.weekly) : null,
          weekStartTime: this.triggerTime.includes('1') ? this.form.weekTime[0] : null,
          weekEndTime: this.triggerTime.includes('1') ? this.form.weekTime[1] : null,
          perMonth: this.triggerTime.includes('2')
            ? this.form.perMonth[0] === '全部'
              ? ''
              : this.form.perMonth
            : null,
          monthStartTime: this.triggerTime.includes('2') ? this.form.monthTime[0] : null,
          monthEndTime: this.triggerTime.includes('2') ? this.form.monthTime[1] : null,
          dayStartTime: this.triggerTime.includes('3') ? this.form.dayTime[0] : null,
          dayEndTime: this.triggerTime.includes('3') ? this.form.dayTime[1] : null,
          birthDay: this.triggerTime.includes('4') ? '1' : null,
          birthMonth: this.triggerTime.includes('5') ? '1' : null,
        };
        let triggerTimeRuleJson = {};
        if (this.triggerMatchRule !== 2) {
          triggerTimeRuleJson = {
            ...timeRuleJson,
            triggerOff: this.triggerMatchRule,
          };
        } else {
          triggerTimeRuleJson = {
            triggerOff: this.triggerMatchRule,
          };
        }

        const triggerMemRuleJson = {
          triggerOff: this.memberMatchRule,
          // 如果选择了参与会员条件   全部传
          level: this.partakeMembers.includes('1')
            ? this.form.level.length === 1 && this.form.level[0] === '全部'
              ? ''
              : this.form.level
            : null,
          sex: this.partakeMembers.includes('2') ? this.form.gender : null,
        };
        if (this.memberMatchRule === 2) {
          delete triggerMemRuleJson.level;
          delete triggerMemRuleJson.sex;
        }
        const score = this.scoreList[0];
        const params = {
          ...this.detail,
          activityName: this.form.activityName,
          startTime: this.timeType === 1 ? this.form.startTime : this.form.period[0],
          endTime: this.timeType === 2 ? this.form.period[1] : null,
          scoreMulti: this.form.scoreMulti,
          ruleId: score.id,
          triggerTimeRuleJson: JSON.stringify(triggerTimeRuleJson),
          triggerMemRuleJson: JSON.stringify(triggerMemRuleJson),
          eventKey: score.eventKey,
        };
        if (this.status === 0) {
          await memberApi.scoreCenter.addScoreMultiple(params);
        } else {
          params.id = this.$route.query.id;
          await memberApi.scoreCenter.updateScoreMultiple(params);
        }
      },
      onDelete() {
        this.ruleName = '';
        this.form.ruleId = null;
        this.scoreList = [];
      },
      ruleSelect() {
        this.$refs.ruleSelectDialog.open();
      },
      selected(item) {
        console.log('selected:', this.$refs);
        this.$refs.formPage.$refs.form.clearValidate('ruleId');
        this.ruleName = item.ruleName;
        this.form.ruleId = item.eventKey;
        this.scoreList = [item];
      },
      levelChange(e) {
        this.$forceUpdate();
        if (e.length > 1 && e.includes('全部')) {
          this.form.level.splice(0, 1);
        }
        if (e.length >= this.levelList.length) {
          this.form.level = ['全部'];
        }
      },
      weekChange(e) {
        this.$forceUpdate();
        if (e.length > 1 && e.includes('全部')) {
          this.form.weekly.splice(0, 1);
        }
        if (e.length >= 7) {
          this.form.weekly = ['全部'];
        }
      },
      perMonthChange(e) {
        this.$forceUpdate();
        if (e.length > 1 && e.includes('全部')) {
          this.form.perMonth.splice(0, 1);
        }
        if (e.length >= 31) {
          this.form.perMonth = ['全部'];
        }
      },
      weekTimeChange(e) {
        console.log(e);
        this.$forceUpdate();
      },
      checkActivityName() {
        memberApi.scoreCenter.checkActivityName({ activityName: this.form.activityName }).then(res => {
          if (res.success) {
            this.activityNameExist = res.data;
          }
        });
      },
    },
  };
</script>
<style lang="less">
  .select-level {
    margin-top: -90px;
    margin-left: 96px;
    margin-bottom: 20px;
  }

  .select-trigger {
    margin: -224px 0 80px 60px;
  }

  .date-picker {
    .el-input__inner {
      padding: 0 0 0 30px;
    }
  }

  .form-item-span {
    color: rgb(102, 102, 102);
  }

  .checkbox {
    margin-right: 10px;
  }

  .button-plain {
    color: @ui-theme-color-orange;
    border-color: @ui-theme-color-orange;
  }

  .score-rules {
    display: flex;
    justify-content: space-between;
    width: 220px;
    padding: 0 15px;
    height: 36px;
    // background-color: #dedede;
    border: 1px solid #dedede;

    .score-delete {
      margin-left: auto;
      margin: auto 0;
      color: #999;
    }
  }
</style>
