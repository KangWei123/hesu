<template>
  <form-page-layout
    :model="form"
    :rules="rules"
    label-width="126px"
    :title-visible="false"
    :submit-handler="handleSubmit"
    submit-sucess-text="会员合并成功"
    class="form-container"
  >
    <form-group>
      <template #title>会员合并合并规则</template>
      <div class="rule-content">
        会员合并时，积分、优惠券、礼品卡、账户余额将累计记录到主账户中，会员等级和成长值取最高等级及最高级的成长值，历史数据、基础信息等将作为增量信息补充到主账户中，如信息冲突，以主账号信息为准。
      </div>
    </form-group>

    <form-group>
      <template #title>会员合并设置</template>
      <div class="merge-container">
        <el-form-item prop="main" style="margin: 0">
          <member-select
            label="会员账户1："
            :ext-params="{ key: 'main' }"
            @selected="handleSelected"
            :member="form['main']"
            :check-function="handleCheck"
          >
            <span slot="tag" class="tag">主会员</span>
          </member-select>
        </el-form-item>
        <img
          v-if="!!form['main'].id || !!form['sub'].id"
          src="../../../images/icon/exchange.png"
          class="exchange"
          @click="convertValue"
        />
        <span v-else class="split-line" />
        <el-form-item prop="sub">
          <member-select
            label="会员账户2："
            :ext-params="{ key: 'sub' }"
            :member="form['sub']"
            @selected="handleSelected"
            :check-function="handleCheck"
          />
        </el-form-item>
      </div>
    </form-group>

    <template #footer>
      <form-button action="cancel" />
      <form-button />
    </template>
  </form-page-layout>
</template>

<script>
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import MemberSelect from '@/mod-member/src/components/member-select';
  import api from '@/mod-member/src/api/memberAPI';

  export default {
    name: 'MemberMergeEdit',
    components: {
      FormPageLayout,
      FormGroup,
      FormButton,
      MemberSelect,
    },
    data() {
      return {
        origin: {},
        form: {
          main: {},
          sub: {},
        },
        /**
         * 验证规则
         */
        rules: {
          main: [{ required: true, message: '请选择合并账号1', trigger: 'change' }],
          sub: [{ required: true, message: '请选择合并账号2', trigger: 'change' }],
        },
      };
    },
    computed: {},
    methods: {
      handleSelected({ key }, member) {
        this.form[key] = member;
      },

      convertValue() {
        const main = this.$plain(this.form.main);
        this.form.main = this.form.sub;
        this.form.sub = main;
      },

      handleCheck(item) {
        return (
          item.uniqueAccountId !== this.form.main.uniqueAccountId &&
          item.uniqueAccountId !== this.form.sub.uniqueAccountId
        );
      },
      async handleSubmit() {
        const { main, sub } = this.form;
        if (!main.uniqueAccountId || !sub.uniqueAccountId) {
          this.$message.error('请选择合并账号');
          throw new Error('');
        }
        await api.memberCenter.addMerge({
          mainUniqueAccountId: main.uniqueAccountId,
          mergedUniqueAccountId: sub.uniqueAccountId,
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .form-container {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #717378;
    text-align: left;
  }
  .rule-content {
    background: #e6f7ff;
    border-radius: 2px;
    padding: 14px;
    line-height: 22px;
  }
  .tag {
    font-size: 10px;
    color: #ffffff;
    line-height: 16px;
    background: #52c41a;
    border-radius: 8px;
    padding: 0 6px;
    margin-right: 6px;
  }
  .split-line {
    width: 1px;
    height: 210px;
    // border-left: 1px solid #eff4fa;
    margin: 0 150px;
  }
  .merge-container {
    display: flex;
  }
  .exchange {
    width: 22px;
    height: 22px;
    margin: 90px 150px 0 150px;
    cursor: pointer;
  }
  /deep/ .el-form-item__content {
    margin: 0 !important;
  }
</style>
