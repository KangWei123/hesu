<template>
  <div class="wrap">
    <el-form
      :model="form"
      ref="form"
      class="info-form"
      label-width="150px"
      style="margin-top: 10px; height: 100%"
      :rules="rules"
      v-loading="loading"
    >
      <!--关于我们-->
      <el-form-item label="积分抵现消耗阶梯：" :prop="form.consumeType === 1 ? 'consumeMultiples' : 'consumeType'">
        <el-radio-group v-model="form.consumeType" @change="clearValidate()">
          <el-radio :label="0">不限制</el-radio>
          <el-radio :label="1">倍数限制</el-radio>
        </el-radio-group>
        <div v-if="form.consumeType === 1" class="box">
          <div>
            积分消耗必须为<el-input size="mini" v-model="form.consumeMultiples" class="score-input"></el-input>整数倍
          </div>
          <div class="tip">
            若填写1000，则积分消耗至少使用1000积分，并根据商品实付金额及积分金额，整数倍递增使用积分
          </div>
        </div>
      </el-form-item>

      <el-form-item label="积分抵现上限：" :prop="form.scoreCashType === 1 ? 'scoreCashUpperLimit' : 'scoreCashType'">
        <el-radio-group v-model="form.scoreCashType" @change="clearValidate()">
          <el-radio :label="0">不限制</el-radio>
          <el-radio :label="1">按商品百分比</el-radio>
        </el-radio-group>
        <div v-if="form.scoreCashType === 1" class="box">
          <div>
            每单折扣金额上限为订单中支持积分抵现的商品总金额的<el-input
              size="mini"
              v-model="form.scoreCashUpperLimit"
              class="score-input"
            ></el-input
            ><span>%</span>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="积分抵现规则说明：" prop="description">
        <el-input
          type="textarea"
          v-model="form.description"
          :rows="8"
          class="score-describe"
          placeholder="请输入积分抵现说明"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否启用：">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
    </el-form>
    <div class="bottom-button">
      <el-button type="primary" @click="goBack()">取消</el-button>
      <el-button type="primary" @click="onSubmit('form')">保存</el-button>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import api from '@/dss-wechat3rd/src/api/score';
  import regexps from '@/dss-common/utils/regexps';

  export default {
    name: 'ScoreSetOff',
    components: {},
    data() {
      return {
        loading: false,
        form: {
          consumeType: 0,
          consumeMultiples: null,
          scoreCashType: 0,
          scoreCashUpperLimit: null,
          description: null,
          status: 0,
        },
        config: {
          ruleName: '积分抵现',
          ruleSource: 2,
          eventKey: 'event_deduction',
          validType: 1,
          parentId: 180,
          ruleType: 2,
          appIdList: [0],
        },
        rules: {
          consumeMultiples: [
            { required: true, message: '请输入积分消耗倍数', trigger: ['blur', 'change'] },
            { pattern: regexps.positiveInteger.reg, message: regexps.positiveInteger.msg, trigger: ['blur', 'change'] },
            {
              validator: (rule, value, callback) => {
                if (value > 999999) {
                  callback(new Error('积分消耗倍数不能大于999999'));
                } else {
                  callback();
                }
              },
              trigger: 'blur',
            },
          ],
          scoreCashUpperLimit: [
            { required: true, message: '请输入积分抵现比例', trigger: ['blur', 'change'] },
            {
              pattern: regexps.littleeTwoIntNum.reg,
              message: regexps.littleeTwoIntNum.msg,
              trigger: ['blur', 'change'],
            },
          ],
          description: [
            { required: true, message: '请输入积分抵现规则说明', trigger: ['blur', 'change'] },
            { max: 256, message: '最多输入256个字符', trigger: ['blur', 'change'] },
            {
              validator: (rule, value, callback) => {
                if (!value.trim()) {
                  callback(new Error('积分抵现规则说明不能为纯空格'));
                } else {
                  callback();
                }
              },
              trigger: 'blur',
            },
          ],
        },
      };
    },
    computed: {
      ...mapState({
        env: 'env',
      }),
    },

    mounted() {
      this.getDetail();
    },

    methods: {
      getDetail() {
        this.loading = true;
        const params = {};
        api
          .getConfig(params)
          .then(res => {
            this.form = res.data.scoreCashConfigDetail;
            this.config = {
              ruleName: res.data.ruleName,
              eventKey: res.data.eventKey,
              validType: res.data.validType,
              parentId: res.data.parentId,
              ruleType: res.data.ruleType,
              appIdList: [res.data.appId],
              id: res.data.id,
              ruleSource: 2,
            };
          })
          .catch(err => {
            console.error(err);
          })
          .always(() => {
            this.loading = false;
          });
      },

      goBack() {
        this.$router.push('/marketing/template');
      },

      clearValidate() {
        this.$refs.form.clearValidate();
      },

      onSubmit(refName) {
        this.$refs[refName].validate(valid => {
          if (valid) {
            console.log(this.config);
            this.loading = true;
            const params = {
              ...this.config,
              scoreCashConfigDetail: this.form,
            };
            const key = this.config.id ? 'update' : 'add';
            api[key](params)
              .then(res => {
                this.$message.success('操作成功');
              })
              .catch(err => {
                console.error(err);
              })
              .always(() => {
                this.loading = false;
              });
          }
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .wrap {
    background: #fff;
    padding: 20px;

    .score-describe {
      width: 500px;
    }

    .tip {
      color: #aba7a7;
    }

    .box {
    }

    .score-input {
      width: 70px;
      margin: 0 10px;
    }
  }
</style>
