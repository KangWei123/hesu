<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    :disabled="!!$route.query.id"
    :loading="loading"
  >
    <el-form-item label="标签名称" prop="name">
      <el-input :maxlength="20" v-model="ruleForm.name" placeholder="请输入标签名称" style="width: 350px"></el-input>
      <span v-if="!$route.query.id">{{ ruleForm.name.length }}/20</span>
    </el-form-item>
    <el-form-item label="更新规则" prop="rule">
      <el-select v-model="ruleForm.rule" placeholder="请选择" style="width: 250px">
        <el-option
          v-for="item in [
            { value: 1, label: '每日更新' },
            { value: 3, label: '不更新' },
          ]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="标签描述" prop="desc">
      <!-- <el-checkbox label="使用默认描述" v-model="useDefaultDesc" v-if="!$route.query.id"></el-checkbox> -->
      <!-- <br v-if="!$route.query.id" /> -->
      <el-input rows="4" :maxlength="600" type="textarea" v-model="desc" :readonly="useDefaultDesc"></el-input>
      <span v-if="!$route.query.id">{{ desc.length }}/600</span>
    </el-form-item>
    <ol style="padding-left: 100px">
      <Value v-for="(item, i) in valueList" :key="item.key" :item="item" @remove="valueList.splice(i, 1)" />
    </ol>
    <div class="add-rule" @click="addRule" style="margin-left: 100px" v-if="!$route.query.id">+标签值</div>
    <footer>
      <el-button type="primary" round @click="saveHandlerChange('ruleForm')" :loading="loading" v-if="!$route.query.id"
        >保 存</el-button
      >
      <div @click="$router.back()">{{ $route.query.id ? '返 回' : '取 消' }}</div>
    </footer>
  </el-form>
</template>

<script>
  import services from '@/dss-common/utils/services';
  import labelValue from './components/labelValue.vue';
  import CustomerAttribute from './components/CustomerAttribute';
  import BehaviorAttribute from './components/BehaviorAttribute.vue';
  import OrderAttribute from './components/OrderAttribute.vue';
  import Value from './Value/index.vue';
  import formatDisplay from './formatDisplay';
  import formatSubmit from './formatSubmit';
  import note from './note';

  export default {
    name: 'MyLabel',
    props: {
      echoData: {
        type: Object,
      },
      criteriaFrom: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        description: '',
        useDefaultDesc: false,
        ruleForm: {
          name: '',
          rule: 1,
          type: '条件标签',
          descripLabel: '',
          desc: '',
        },
        rules: {
          name: [
            {
              pattern: /^[_\-0-9A-Za-z\u4e00-\u9fa5]+$/i,
              message: '标签名称支持字母、数字、汉字、-、或 _',
              trigger: 'change',
            },
            {
              min: 1,
              max: 20,
              message: '请输入标签名称，长度在 1 到 20 个字符',
              trigger: 'blur',
              required: true,
            },
          ],
          rule: [{ required: true, message: '请选择更新规则', trigger: 'change' }],
          desc: [
            {
              validator: (rule, value, callback) => {
                callback(this.desc && undefined);
              },
              message: '请输入标签描述',
            },
          ],
        },
        labelData: [],
        loading: false,

        saveList: [],
        customerProperty: {},
        ordersProperty: {},
        behaviorProperty: {},
        valueList: [],
        paramsList: [],
        // 标签描述
        customerText: '',
        behaviorText: '',
        deatailValue: [],
        vipData: [],
        detailDimValue: [],
      };
    },
    components: {
      labelValue,
      CustomerAttribute,
      BehaviorAttribute,
      OrderAttribute,
      Value,
    },
    computed: {
      desc: {
        get() {
          if (this.useDefaultDesc) {
            return this.valueList
              .map(value => {
                return (
                  value.value +
                  ': ' +
                  value.rules[0].rules
                    .map(({ fieldOptions, field, operatorOptions, operator, params }) => {
                      return (
                        fieldOptions.find(({ paramCode }) => paramCode === field).paramName +
                        ' ' +
                        operatorOptions.find(({ filterCode }) => filterCode === operator).filterName +
                        ' ' +
                        params
                      );
                    })
                    .join() +
                  '；' +
                  value.rules[1].rules
                    .map(({ timeParams, fieldOptions, field, operatorOptions, operator, params }) => {
                      return timeParams + '天内，发生 ' + fieldOptions.find(({ event }) => event === field).eventName;
                    })
                    .join()
                );
              })
              .join();
          }
          return this.description;
        },
        set(v) {
          this.description = v;
        },
      },
    },
    created() {
      if (this.$route.query.id) {
        this.ruleForm = this.criteriaFrom;
        this.desc = this.criteriaFrom.desc;
        this.valueList = formatDisplay(this.echoData);
      } else {
        this.addRule();
      }
    },
    methods: {
      addRule() {
        this.valueList.push({
          value: '',
          relation: 0,
          rules: [
            {
              type: 'profile_rule',
              relation: 0,
              rules: [],
            },
            {
              type: 'event_rule',
              relation: 0,
              rules: [],
            },
          ],
          key: Date.now(),
        });
      },
      saveHandlerChange(ruleForm) {
        this.$refs[ruleForm].validate(valid => {
          if (!valid) return;
          if (!this.valueList.length) {
            return this.$message.error('无标签值');
          }
          let data;
          try {
            data = {
              labelName: this.ruleForm.name,
              updRule: this.ruleForm.rule,
              description: this.desc,
              useDefaultDesc: +!this.useDefaultDesc,
              valueList: formatSubmit(this.valueList),
              note: JSON.stringify(note(this.valueList)),
            };
          } catch (e) {
            // throw e
            return this.$message.error(e);
          }
          // return console.log(data, 'data')
          this.loading = true;
          services
            .json('/wp/portrait/dmp_tag/tag/auto_label/add', data, {
              action: '添加条件标签',
            })
            .then(() => {
              this.$router.back();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
    },
  };
</script>
<style lang="less" scoped>
  /deep/ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  ol {
    counter-reset: valueCounter;
  }

  .add-rule {
    background: #3879fb;
    height: 30px;
    line-height: 30px;
    width: 100px;
    border-radius: 15px;
    text-align: center;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
  }

  footer {
    padding: 66px 55px;
    text-align: center;
  }

  footer div {
    cursor: pointer;
    height: 28px;
    line-height: 28px;
    width: 84px;
    border-radius: 15px;
    color: #3879fb;
    border: 1px solid #3879fb;
    display: inline-block;
  }

  /deep/.el-input.is-disabled .el-input__inner {
    background: transparent;
    color: inherit;
    cursor: initial;
  }

  /deep/.el-checkbox__input.is-disabled .el-checkbox__inner {
    cursor: default;
    background: transparent;
  }

  /deep/.el-checkbox__input.is-disabled + span.el-checkbox__label {
    cursor: initial;
  }

  /deep/.el-textarea.is-disabled .el-textarea__inner {
    background: transparent;
    color: inherit;
    cursor: initial;
  }

  /deep/.el-input.is-disabled .el-input__icon {
    display: none;
  }

  /deep/.el-cascader.is-disabled .el-cascader__label {
    color: inherit;
    cursor: initial;
  }
</style>
