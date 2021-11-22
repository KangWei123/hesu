<template>
  <div class="activities">
    <div class="conditions">
      <el-form inline @submit.native.prevent="handleSearch">
        <el-form-item label="咨询时间">
          <el-date-picker
            v-model="query.datetime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目">
          <el-select v-model="query.project" clearable placeholder="全部项目">
            <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <fat-table :fetch-handler="handleFetch" ref="table">
      <el-table-column label="时间" prop="createTime"></el-table-column>
      <el-table-column label="项目" prop="prjName"></el-table-column>
      <el-table-column label="客服">
        <template slot-scope="scope">
          <span>{{ scope.row.id || '-' }}</span>
        </template>
      </el-table-column>
    </fat-table>
  </div>
</template>

<script>
  import { FatTable } from '@/dss-common/components/list-page/index';
  /**
   * 咨询记录
   */
  export default {
    components: {
      FatTable,
    },
    props: {},
    data() {
      return {
        list: [],
        query: {
          datetime: null,
          project: null,
        },
      };
    },
    computed: {
      wxId() {
        return this.wxOpenId;
      },
    },
    mounted() {},
    methods: {
      handleSearch() {
        this.$refs.table.search();
      },
      rTime(date) {
        const json_date = new Date(date).toJSON();
        const ret =
          date &&
          new Date(new Date(json_date).getTime() + 8 * 3600 * 1000)
            .toISOString()
            .replace(/T/g, ' ')
            .replace(/\.[\d]ff{3}Z/, '')
            .substring(0, 19);
        return ret;
      },
      /**
       * 列表请求
       */
      async handleFetch(params) {
        return {
          list: [],
          total: 0,
        };
      },
    },
  };
</script>

<style scoped>
  .conditions {
    padding: 0 24px;
  }
</style>
