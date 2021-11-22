<template>
  <form-page-layout
    :model="form"
    :rules="rules"
    label-width="126px"
    :title-visible="false"
    :submit-handler="handleSubmit"
  >
    <form-group>
      <template #title>基础设置</template>
      <el-form-item label="客户阶段名称" prop="name" placeholder="请输入客户阶段名称">
        <el-input v-model.trim="form.name" class="w220"></el-input>
      </el-form-item>
      <el-form-item label="判定方式" prop="type">
        <el-select v-model="form.type" :disabled="isEdit" placeholder="请选择判定方式" class="w220">
          <el-option
            v-for="(val, key) of LifeCycleDetectTypeName"
            :key="val"
            :label="val"
            :value="parseInt(key)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="阶段描述" prop="desc">
        <el-input type="textarea" v-model="form.desc" class="w430" maxlength="200"></el-input>
      </el-form-item>
    </form-group>

    <form-group v-if="form.type === LifeCycleDetectType.System">
      <template #title>判定维度</template>
      <el-form-item label="入会时间" prop="sysPredicateJson.dayEnable">
        <el-radio-group v-model="form.sysPredicateJson.dayEnable">
          <el-radio :label="0">不限制</el-radio>
          <el-radio :label="1">
            <div class="custom-box">
              <el-col class="line" style="margin-right: 6px" :span="2">入会</el-col>
              <el-col :span="8">
                <el-form-item prop="date1">
                  <integer-input
                    style="width: 100%"
                    :disabled="!form.sysPredicateJson.dayEnable"
                    v-model="form.sysPredicateJson.minDay"
                    :min="0"
                    :max="999"
                  />
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="8">
                <el-form-item prop="date2">
                  <integer-input
                    style="width: 100%"
                    :disabled="!form.sysPredicateJson.dayEnable"
                    v-model="form.sysPredicateJson.maxDay"
                    :min="0"
                    :max="999"
                  />
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">天</el-col>
            </div>
          </el-radio>
        </el-radio-group>
        <div class="tip">填写 “0” 为不限制</div>
      </el-form-item>

      <el-form-item label="消费情况" prop="sysPredicateJson.amountEnable">
        <el-radio-group v-model="form.sysPredicateJson.amountEnable">
          <el-radio :label="0">不限制</el-radio>
          <el-radio :label="1">按时间段内消费情况限制</el-radio>
          <el-radio :label="2">按历史累计消费限制</el-radio>
          <el-radio :label="3">按入会时间消费情况限制</el-radio>
        </el-radio-group>

        <div style="margin-left: 96px">
          <template v-if="form.sysPredicateJson.amountEnable === 1">
            <el-radio-group v-model="form.sysPredicateJson.amountRadioTypea">
              <div class="mg-bt-20">
                <el-radio :label="0">
                  近
                  <integer-input
                    class="inline-input"
                    :disabled="form.sysPredicateJson.amountRadioTypea !== 0"
                    v-model="form.sysPredicateJson.amountMinDaya"
                    :min="0"
                    :max="999"
                  />
                  -
                  <integer-input
                    class="inline-input"
                    :disabled="form.sysPredicateJson.amountRadioTypea !== 0"
                    v-model="form.sysPredicateJson.amountMaxDaya"
                    :min="0"
                    :max="999"
                  ></integer-input>
                  天 有消费
                  <double-input
                    class="inline-input"
                    :disabled="form.sysPredicateJson.amountRadioTypea !== 0"
                    :max="99999.99"
                    v-model="form.sysPredicateJson.amounta"
                  ></double-input>
                  元
                  <div class="tip">填写 “0” 为不限制</div>
                </el-radio>
              </div>
              <div class="mg-bt-20">
                <el-radio :label="1">
                  近
                  <integer-input
                    class="inline-input"
                    :disabled="form.sysPredicateJson.amountRadioTypea !== 1"
                    v-model.number="form.sysPredicateJson.amountMinDayb"
                    :min="0"
                    :max="999"
                  />
                  -
                  <integer-input
                    class="inline-input"
                    :disabled="form.sysPredicateJson.amountRadioTypea !== 1"
                    v-model.number="form.sysPredicateJson.amountMaxDayb"
                    :min="0"
                    :max="999"
                  />
                  天 无消费
                  <div class="tip">填写 “0” 为不限制</div>
                </el-radio>
              </div>
            </el-radio-group>
          </template>

          <template v-else-if="form.sysPredicateJson.amountEnable === 2">
            <el-radio-group v-model="form.sysPredicateJson.amountRadioTypeb">
              <div class="mg-bt-20">
                <el-radio :label="0">
                  累计消费
                  <double-input
                    class="inline-input"
                    :disabled="form.sysPredicateJson.amountRadioTypeb !== 0"
                    v-model="form.sysPredicateJson.amountb"
                    :max="99999.99"
                  ></double-input>
                  元
                </el-radio>
              </div>
              <div class="mg-bt-20">
                <el-radio :label="1"> 累计无消费 </el-radio>
              </div>
            </el-radio-group>
          </template>
          <template v-else-if="form.sysPredicateJson.amountEnable === 3">
            <el-radio-group v-model="form.sysPredicateJson.amountRadioTypea">
              <div class="mg-bt-20">
                <el-radio :label="0">
                  入会
                  <integer-input
                    class="inline-input"
                    :disabled="form.sysPredicateJson.amountRadioTypea !== 0"
                    v-model="form.sysPredicateJson.amountMinDaya"
                    :min="0"
                    :max="999"
                  />
                  -
                  <integer-input
                    class="inline-input"
                    :disabled="form.sysPredicateJson.amountRadioTypea !== 0"
                    v-model="form.sysPredicateJson.amountMaxDaya"
                    :min="0"
                    :max="999"
                  ></integer-input>
                  天 消费
                  <double-input
                    class="inline-input"
                    :disabled="form.sysPredicateJson.amountRadioTypea !== 0"
                    :max="99999.99"
                    v-model="form.sysPredicateJson.amounta"
                  ></double-input>
                  元
                  <div class="tip">填写 “0” 为不限制</div>
                </el-radio>
              </div>
              <div class="mg-bt-20">
                <el-radio :label="1">
                  入会
                  <integer-input
                    class="inline-input"
                    :disabled="form.sysPredicateJson.amountRadioTypea !== 1"
                    v-model.number="form.sysPredicateJson.amountMinDayb"
                    :min="0"
                    :max="999"
                  />
                  -
                  <integer-input
                    class="inline-input"
                    :disabled="form.sysPredicateJson.amountRadioTypea !== 1"
                    v-model.number="form.sysPredicateJson.amountMaxDayb"
                    :min="0"
                    :max="999"
                  />
                  天 无消费
                  <div class="tip">填写 “0” 为不限制</div>
                </el-radio>
              </div>
            </el-radio-group>
          </template>
        </div>
      </el-form-item>

      <el-form-item label="会员等级" prop="sysPredicateJson.levelEnable">
        <el-radio-group v-model="form.sysPredicateJson.levelEnable">
          <el-radio :label="0">不限制</el-radio>
          <el-radio :label="1">
            <div class="custom-box">
              <level-select
                v-model="form.sysPredicateJson.levelNum"
                :disabled="!form.sysPredicateJson.levelEnable"
                placeholder="请选择会员等级"
                clearable
                multiple
              ></level-select>
            </div>
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </form-group>

    <template #footer>
      <form-button action="cancel" />
      <form-button />
    </template>
  </form-page-layout>
</template>

<script>
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import IntegerInput from '@/dss-common/components/integer-input';
  import DoubleInput from '@/dss-common/components/double-input';
  import { LifeCycleDetectTypeName, LifeCycleDetectType } from '@/mod-member/src/enum';
  import LevelSelect from '@/mod-member/src/components/level-select';
  import api from '@/mod-member/src/api/memberAPI';

  export default {
    components: {
      FormPageLayout,
      FormGroup,
      FormButton,
      LevelSelect,
      IntegerInput,
      DoubleInput,
    },
    data() {
      return {
        LifeCycleDetectTypeName,
        LifeCycleDetectType,
        origin: {},
        form: {
          name: '',
          type: LifeCycleDetectType.Manual,
          desc: '',
          level: '',
          sysPredicateJson: {
            amountEnable: 0,

            // 前端辅助字段
            amounta: 0,
            amountb: 0,
            amountMinDaya: 0,
            amountMaxDaya: 0,
            amountMinDayb: 0,
            amountMaxDayb: 0,
            amountRadioTypea: 0,
            amountRadioTypeb: 0,

            levelEnable: 0,
            levelNum: [],
            dayEnable: 0,
            maxDay: 0,
            minDay: 0,
          },
        },
        /**
         * 验证规则
         */
        rules: {
          name: [
            { required: true, message: '请输入客户阶段名称', trigger: 'blur' },
            { min: 1, max: 80, message: '长度在 1 到 80 个字符', trigger: 'blur' },
          ],
          type: [{ required: true, message: '请选择判定方式', trigger: 'change' }],
          'sysPredicateJson.dayEnable': {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback();
                return;
              }
              const { minDay, maxDay } = this.form.sysPredicateJson;
              if (minDay > 0 && maxDay > 0 && minDay >= maxDay) {
                callback(new Error('开始天数不能大于结束天数'));
              } else {
                callback();
              }
            },
          },
          'sysPredicateJson.amountEnable': {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              const form = this.form.sysPredicateJson;
              if (value === 0) {
                callback();
              } else if (value === 1 || value === 3) {
                if (form.amountRadioTypea === 0) {
                  if (form.amountMinDaya > 0 && form.amountMaxDaya > 0 && form.amountMinDaya > form.amountMaxDaya) {
                    callback(new Error('开始天数不能大于结束天数'));
                  }
                  if (form.amounta <= 0) {
                    callback(new Error('请输入消费金额'));
                    return;
                  }
                } else {
                  if (form.amountMinDayb > 0 && form.amountMaxDayb > 0 && form.amountMinDayb > form.amountMaxDayb) {
                    callback(new Error('开始天数不能大于结束天数'));
                  }
                }
              } else {
                if (form.amountb <= 0) {
                  callback(new Error('请输入消费金额'));
                  return;
                }
              }
              callback();
            },
          },
          'sysPredicateJson.levelEnable': {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback();
                return;
              }

              const levelNum = this.form.sysPredicateJson.levelNum;
              if (levelNum == null || levelNum.length === 0) {
                callback(new Error('请选择等级'));
              } else {
                callback();
              }
            },
          },
        },
      };
    },
    computed: {
      id() {
        return this.$route.query.id;
      },
      isEdit() {
        return !!this.id;
      },
    },

    mounted() {
      if (this.isEdit) {
        this.getDetail();
      }
    },

    methods: {
      async getDetail() {
        const { data } = await api.lifeCycle.getDetail(this.id);
        this.origin = data;
        const { sysPredicateJson: rawJSON, ...other } = data;
        const { amount, amountMinDay, amountMaxDay, ...json } = JSON.parse(rawJSON || '{}');
        const sysPredicateJson = { ...this.form.sysPredicateJson, ...json };

        console.log(111, json);
        switch (json.amountEnable) {
          case 3:
          case 1:
            if (!amount) {
              sysPredicateJson.amountRadioTypea = 1;
              sysPredicateJson.amountMinDayb = amountMinDay;
              sysPredicateJson.amountMaxDayb = amountMaxDay;
            } else {
              sysPredicateJson.amountMinDaya = amountMinDay;
              sysPredicateJson.amountMaxDaya = amountMaxDay;
              sysPredicateJson.amounta = amount;
            }
            break;
          case 2: {
            if (!amount) {
              sysPredicateJson.amountRadioTypeb = 1;
            } else {
              sysPredicateJson.amountb = amount;
            }
            break;
          }
        }

        this.form = { ...other, sysPredicateJson };
      },
      async handleSubmit() {
        const { sysPredicateJson: json, ...other } = this.form;

        // 规范化
        // what the fuck, 我怎么写出这么垃圾的代码
        const {
          amountRadioTypea,
          amountRadioTypeb,
          amountMinDaya,
          amountMaxDaya,
          amountMinDayb,
          amountMaxDayb,
          amounta,
          amountb,
          ...payload
        } = json;

        const setAmount = v => {
          switch (v) {
            case 0:
              payload.amountMinDay = amountMinDaya;
              payload.amountMaxDay = amountMaxDaya;
              payload.amount = amounta;
              break;
            case 1:
              payload.amountMinDay = amountMinDayb;
              payload.amountMaxDay = amountMaxDayb;
              payload.amount = 0;
              break;
          }
        };

        switch (payload.amountEnable) {
          case 3:
          case 1:
            setAmount(amountRadioTypea);
            break;
          case 2:
            payload.amount = amountRadioTypeb === 0 ? amountb : 0;
            break;
        }
        const sysPredicateJson = { ...payload };
        const params = { ...other, sysPredicateJson: JSON.stringify(sysPredicateJson) };

        if (!this.isEdit) {
          await api.lifeCycle.add(params);
        } else {
          await api.lifeCycle.update({ ...this.origin, ...params });
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .custom-box {
    display: inline-block;
    vertical-align: middle;
  }

  .line {
    text-align: center;
    line-height: 38px;
  }

  .mg-bt-20 {
    margin-bottom: 20px;
  }

  .inline-input {
    width: 100px;
  }

  .tip {
    color: #a7a7a7;
    line-height: 1.7;
  }
</style>
