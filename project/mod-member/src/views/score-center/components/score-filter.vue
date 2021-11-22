<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-form
    ref="query"
    :model="form"
    inline
    class="filter-form score-filter-container"
    @submit.prevent.native="handleSubmit"
    label-suffix=":"
  >
    <!-- <el-form-item label="事件名称" prop="ruleName">
      <el-input class="order-search" v-model.trim="form.ruleName" placeholder="请输入事件名称"></el-input>
    </el-form-item> -->

    <template v-if="globalIsUmpPlatformApp">
      <el-form-item label="配置应用" prop="appId">
        <app-select class="w220" group-selectable v-model="form.appId" clearable placeholder="请选择应用" />
      </el-form-item>
    </template>

    <template v-else>
      <el-form-item label="规则名称" prop="refName">
        <el-input class="w220" v-model.trim="form.refName" maxlength="50" placeholder="请输入规则名称" />
      </el-form-item>

      <el-form-item label="积分动作" prop="eventKey">
        <score-type-select
          class="w220"
          v-model="form.eventKey"
          placeholder="请选择积分动作"
          filter-system-event
          :source="form.ruleType"
          :disabled-item="disabledItem"
        />
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-select class="w220" clearable v-model="form.state" placeholder="请选择状态">
          <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </template>

    <el-form-item>
      <el-button plain @click="$refs.query.resetFields()">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import AppSelect from '@/business-common/components/app-select';
  import ScoreTypeSelect from '@/mod-member/src/components/score-type-select/index.vue';

  export default {
    name: 'ScoreFilter',
    components: {
      AppSelect,
      ScoreTypeSelect,
    },
    props: {
      form: {
        type: Object,
        required: true,
      },
    },

    computed: {
      disabledItem() {
        return item => {
          if (this.isEdit && item.eventKey === (this.form && this.form.eventKey)) {
            return false;
          }
          return !!item.exist;
        };
      },
    },

    data() {
      return {
        statusList: [
          {
            label: '全部',
            value: '',
          },
          {
            label: '未开始',
            value: 1,
          },
          {
            label: '进行中',
            value: 2,
          },
          {
            label: '已结束',
            value: 3,
          },
        ],
      };
    },

    methods: {
      // 改变查询条件通知父组件进行查询
      handleSubmit() {
        this.$emit('submit');
      },
    },
  };
</script>
