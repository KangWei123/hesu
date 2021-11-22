<template>
  <div class="formtable">
    <div class="card-title">
      <span class="da-block-title">活跃详情列表</span>
      <span class="export-btn"
            v-if="this.tableData && this.tableData.length"
            style="cursor:pointer"
            @click="downloadExcel">导出报表</span>
    </div>
    <el-select v-model="value" placeholder="请选择" v-if="select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-table
      :data="this.tableData"
      stripe
      style="width: 100%"
      class="da-table">
      <el-table-column
        prop="statDate"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="visitNum"
        label="访问次数"
        width="180">
      </el-table-column>
      <el-table-column
        prop="visitor"
        label="访问人数">
      </el-table-column>
      <el-table-column
        prop="newUser"
        label="新增访问">
      </el-table-column>
      <el-table-column
        prop="perSecs"
        label="平均访问时长">
        <template slot-scope="scope">
          {{scope.row.perSecs<0 ? 0 : parseFloat(scope.row.perSecs).toFixed(0)}}s
        </template>
      </el-table-column>
      <el-table-column v-if="!this.tableData.bounceRate"
        prop="bounceRate"
        label="跳出率">
        <template slot-scope="scope">
          {{parseFloat(scope.row.bounceRate * 100).toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="eltable">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="toviewtrend">查看趋势</el-button>
          <el-button
            size="mini"
            type="text"
            @click="toviewparameter">查看参数</el-button>
        </template>
      </el-table-column>
      <!--修改无数据时的展示-->
      <template slot="empty">
        <place-holder></place-holder>
      </template>
    </el-table>
  </div>
</template>

<script>
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import utils from '@/dss-common/utils/index';
  const DateRange = 'dateRange';
  const APPKEY = 'app_key';
  function formatDate(t) {
    return utils.timeFormat(t, 'YYYY-MM-DD');
  }
  export default {
    props: ['parenformtable', 'status', 'strDateRange'],
    components: {
      PlaceHolder
    },
    data() {
      return {
        select: false,
        eltable: false,
        tableData: [],
        dateRange: [],
        url: ''
      };
    },
    watch: {
      parenformtable: function() {
        // this.parenformtable.forEach((column, index) => {
        //   column.perSecs += 's';
        //   column.bounceRate = column.bounceRate * 100 + '%';
        // });
        this.tableData = this.parenformtable;
      },
      status: function() {
        this.eltable = this.status.eltable;
        this.select = this.status.select;
      }
    },
    mounted() {
      // this.parenformtable.forEach((column, index) => {
      //   column.perSecs += 's';
      //   column.bounceRate = column.bounceRate * 100 + '%';
      // });
      this.tableData = this.parenformtable;
      this.eltable = this.status.eltable;
      this.select = this.status.select;
      this.getappkey();
    },
    methods: {
      toviewtrend() {
        this.$router.push({ path: '/count/viewtrend' });
      },
      toviewparameter() {
        this.$router.push({ path: '/count/viewparameter' });
      },
      getappkey() {
        this.appKey = window.localStorage.getItem(APPKEY);
      },
      // 下载表格
      downloadExcel() {
        this.dateRange = this.strDateRange;
        if (this.dateRange) {
          let beginDate = this.dateRange[0];
          let endDate = this.dateRange[1];
          let url =
            location.protocol +
            '//' +
            location.host +
            '/athena/reportforms/downloadactiveanalysisdata?appKey=' +
            this.appKey +
            '&' +
            'beginDate=' +
            beginDate +
            '&' +
            'endDate=' +
            endDate;
          window.open(url);
        }
      }
    }
  };
</script>

<style>
.formtable{
  padding:20px;
  box-sizing: border-box;
  background:rgba(255,255,255,1);
  margin-top:20px;
  margin-bottom:20px;
  border-radius: 4px;
}
.card-title {
  margin-bottom: 15px;

  .export-btn {
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(46, 141, 255, 1);
    line-height: 20px;
    float: right;
  }
}
</style>
