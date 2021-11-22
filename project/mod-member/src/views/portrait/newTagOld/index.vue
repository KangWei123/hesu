<template>
  <div class="newtag-container page-bg">
    <!-- breadcrumb -->
    <el-breadcrumb class="wkt-breadcrumb-container" separator="/">
      <el-breadcrumb-item :to="{ path: '/portrait/myTag' }" replace>我的标签</el-breadcrumb-item>
      <el-breadcrumb-item>查看标签</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page-content">
      <!-- form -->
      <el-form :disabled="true" :model="form" class="label-form" label-position="right" label-width="130px" ref="form">
        <el-form-item class="label-item" label="标签名称:" prop="labelValue" ref="rLabelValue">
          <el-input class="label-w366" placeholder="请输入标签名称" v-model="form.labelValue"></el-input>
        </el-form-item>

        <el-form-item class="label-item" label="自动打标签条件:" prop="whichCondition">
          <el-radio-group v-model="form.whichCondition">
            <div class="checkbox-condition">
              <el-form-item prop="totalConsume" ref="rTotalConsume">
                <el-radio :label="0">累计消费超过:</el-radio>
                <el-input class="label-w130" placeholder v-model="form.totalConsume"></el-input>
                <span>元</span>
              </el-form-item>
            </div>

            <div class="checkbox-condition">
              <el-form-item prop="totalCharge" ref="rTotalCharge">
                <el-radio :label="1">累计充值超过:</el-radio>
                <el-input class="label-w130" placeholder v-model="form.totalCharge"></el-input>
                <span>元</span>
              </el-form-item>
            </div>

            <div class="checkbox-condition">
              <el-form-item prop="buyFrequency" ref="rBuyFrequency">
                <el-radio :label="2">购买频次:</el-radio>
                <div class="radio-content">
                  <span>每</span>
                  <el-input class="label-w80" placeholder v-model.trim="form.frequencyDay"></el-input>
                  <span>天</span>
                  <el-input class="label-w80" placeholder v-model.trim="form.frequency"></el-input>
                  <span>次</span>
                </div>
                <div class="radio-tip">*例：用户每30天购买3次可打标为常客</div>
              </el-form-item>
            </div>

            <div class="checkbox-condition">
              <el-form-item prop="avgMoney" ref="rAvgMoney">
                <el-radio :label="3">平均金额:</el-radio>
                <div class="radio-content">
                  <span>每</span>
                  <el-input class="label-w80" placeholder v-model.trim="form.avgMoneyDay"></el-input>

                  <span>天平均</span>
                  <el-input class="label-w80" placeholder v-model.trim="form.avgMoney"></el-input>
                  <span>元</span>
                </div>

                <div class="radio-tip">*统计周期为360天内</div>
              </el-form-item>
            </div>
          </el-radio-group>
          <!-- <div style="color:red;">*注意：会员标签添加成功后，次日可在客户洞察平台查看</div> -->
        </el-form-item>
      </el-form>
      <div class="btn-group">
        <el-button @click="$router.back()" :round="true">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/mod-member/src/api/new-dmp';

  export default {
    name: 'NewTagOld',
    data() {
      return {
        form: {
          labelValue: '',
          totalConsume: '',
          totalCharge: '',
          frequencyDay: '',
          frequency: '',
          avgMoneyDay: '',
          avgMoney: '',
          whichCondition: 0,
        },
      };
    },
    async mounted() {
      const { id } = this.$route.query;
      const data = await api
        .getAutoLabelDetailById({
          labelId: id,
        })
        .then(d => {
          console.log(d.data);
          const data = d.data;
          // 标签名称
          this.form.labelValue = data.labelValue || '';
          // 累计消费
          data.totalConsume && (this.form.totalConsume = data.totalConsume || '') && (this.form.whichCondition = 0);
          // 累计充值
          data.totalCharge && (this.form.totalCharge = data.totalCharge || '') && (this.form.whichCondition = 1);
          // 购买频次
          if (data.frequencyDay) {
            this.form.frequencyDay = data.frequencyDay || '';
            this.form.frequency = data.frequency || '';
            this.form.whichCondition = 2;
          }
          // 购买金额
          if (data.avgMoneyDay) {
            this.form.avgMoneyDay = data.avgMoneyDay || '';
            this.form.avgMoney = data.avgMoney || '';
            this.form.whichCondition = 3;
          }
        })
        .catch(console.log);
    },
  };
</script>

<style lang="less" scoped>
  .page-content .el-input {
    width: auto;
  }

  .btn-group {
    margin-left: 150px;
    margin-top: 40px;
  }
</style>
