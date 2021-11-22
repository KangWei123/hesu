<template>
  <div class="create-activity-container">
    <el-row type="flex" justify="space-between">
      <el-col :span="14">
        <activity-form class="create-form dss-card" @submit-create="onSubmitCreate" v-loading="loading"/>
      </el-col>
      <el-col :span="6">
        <div class="dss-card" style="height: 700px">
          <p>活动目标</p>
          <span>选择相应的活动目标，将以报表形式呈现在效果分析，对比分析活动之前与活动期间各项指标差异</span>
          <span style="margin-top: 30px">销售相关指标需要打通销售数据</span>
          <span style="margin-top: 8px">会员相关指标需要打通会员数据</span>
          <p>活动预算</p>
          <span>正确估算有助于商家更好衡量投入产出比</span>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  import ActivityForm from './ActivityForm';
  import activityRequestor from '../../api/activityRequestor';

  export default {
    name: 'CreateActivity',

    components: {
      ActivityForm
    },

    data() {
      return {
        loading: false
      };
    },

    methods: {
      onSubmitCreate(activityParams) {
        this.loading = true;
        activityRequestor
          .createActivity(activityParams)
          .done(res => {
            this.$alert('活动创建成功', {
              confirmButtonText: '确定',
              callback: () => {
                this.$router.push('/activity/list');
              }
            });
          })
          .always(() => {
            this.loading = false;
          });
      }
    }
  };
</script>

<style lang="less" scoped>
  .create-activity-container {
    margin: 0 5%;
    overflow: auto;
    min-width: 1000px;

    .create-form {
      min-width: 600px;
      height: 700px;
    }

    p {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #606266;
    }

    span {
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #606266;
      display: block;
      line-height: 150%;

    }
  }
</style>
