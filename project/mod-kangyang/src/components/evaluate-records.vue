<template>
  <div class="activities">
    <div class="conditions">
      <el-form inline @submit.native.prevent="handleSearch">
        <el-form-item label="评估时间">
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
          <el-select v-model="query.orgName" clearable placeholder="全部项目">
            <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.name"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <fat-table :fetch-handler="handleFetch" ref="table">
      <el-table-column label="时间" prop="createTime"></el-table-column>
      <el-table-column label="项目" prop="orgName"></el-table-column>
      <el-table-column label="评估结果" prop="totalPrice">
        <template slot-scope="scope">
          <span>￥{{ scope.row.totalPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="checked(scope.row)" size="small">查看</el-button>
        </template>
      </el-table-column>
    </fat-table>
    <evaluate-dialog :visible="open" :evaluate-detail="detail" @close="handleClose" />
  </div>
</template>

<script>
  import { FatTable } from '@/dss-common/components/list-page/index';
  import { elderApi } from '@/mod-kangyang/src/api';
  import EvaluateDialog from '../views/elders/components/evaluate-detail-dialog';
  /**
   * 咨询记录
   */
  export default {
    components: {
      FatTable,
      EvaluateDialog,
    },
    props: {
      list: {
        type: Array,
        required: true,
      },
      wxOpenId: {
        type: String,
        required: true,
      },
    },
    computed: {
      detail() {
        return this.evaluateDetail;
      },
    },
    data() {
      return {
        query: {
          datetime: null,
          orgName: null,
        },
        open: false,
        evaluateDetail: {
          createTime: '',
          expectType: '',
          healthDTOList: [],
          id: 0,
          identityDTOList: [],
          insuranceSubsidyPrice: null,
          insuranceType: null,
          isEvaluate: true,
          loseBrainsLevel: null,
          loseBrainsPrice: null,
          loseEnergyLevel: null,
          loseEnergyPrice: null,
          orgId: 0,
          orgName: '',
          phone: '',
          totalPrice: 0,
          wxOpenId: '',
        },
      };
    },
    mounted() {
      // console.log(this.list);
    },
    methods: {
      handleSearch() {
        this.$refs.table.search();
      },
      handleClose() {
        this.open = false;
        this.evaluateDetail = {};
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
        if (this.wxOpenId) {
          const payload = {
            orgName: this.query.orgName,
            startTime: this.rTime(this.query.datetime && this.query.datetime[0]),
            endTime: this.rTime(this.query.datetime && this.query.datetime[1]),
            wxOpenId: this.wxOpenId,
            pageNo: params.pagination.currentPage,
            pageSize: params.pagination.pageSize,
          };
          // const res = await elderApi.getEvaluationRecords(payload);
          return {
            list: [],
            total: 0,
          };
        } else {
          return {
            list: [],
            total: 0,
          };
        }
      },
      checked(data) {
        elderApi
          .getEvaluationDetail({
            id: data.id,
          })
          .then(res => {
            this.open = true;
            this.evaluateDetail = { ...res.data };
          });
      },
    },
  };
</script>

<style scoped>
  .conditions {
    padding: 0 24px;
  }
</style>
