<template>
  <div class="act-list-container">
    <el-form inline class="wkt-opt-label-container" @submit.native.prevent>
      <el-form-item label="活动名称：">
        <el-input class="input"
                  prefix-icon="el-icon-search"
                  placeholder="搜索活动名称"
                  @blur="doSearch"
                  @keyup.enter.native="doSearch"
                  v-model="activityName">
        </el-input>
      </el-form-item>

      <el-button class="single-search-btn"
                  type="primary"
                  @click="doSearch">
        搜索
      </el-button>

    <el-button plain @click="handleReset">重置</el-button>
    </el-form>

    
    <div class="act-record">
      <activity-table :single="false"
                      :queryParams="queryParams"/>
    </div>
  </div>
</template>

<script>
  import ActivityTable from '../component/activity-table.vue';

  export default {
    components: {
      ActivityTable
    },

    data() {
      return {
        activityName: '',
        queryParams: null
      };
    },

    methods: {
      doSearch() {
        console.log('doSearch ---->', this.activityName);
        this.queryParams = {
          name: this.activityName
        };
      },
      handleReset() {
        this.activityName = null;
        this.doSearch();
      }
    }
  };
</script>

<style lang="less">
  .act-list-container{
    .el-table {
      padding-top: 0px;
    }
    .act-record {
      padding-top: 16px;
    }
    .wkt-opt-label-container {
      padding-left: 20px;
      padding-bottom: 10px;
      .input {
        width: 220px;
      }
    }
  }
</style>
