<template>
  <div class="analysis-box">
    <div class="analysis-title">新增客户趋势图</div>
    <div v-loading="loading">
      <el-select
        v-model="choosedSourceList"
        value-key="name"
        multiple
        collapse-tags
        placeholder="选择客户来源"
        style="width: 210px"
        @change="hasChange = true"
        @visible-change="handleFinishSelect"
        @remove-tag="getData"
      >
        <li class="el-select-dropdown__item" :class="checkAll ? 'selected' : ''" @click="handleCheckAll">
          <span>全部来源</span>
        </li>
        <el-option v-for="(item, index) in clientSource" :key="index" :label="item.name" :value="item"> </el-option>
      </el-select>
      <date-pick
        style="display：inline-block；margin: 20px 0 10px"
        :visible-short-cut="true"
        label=""
        @pick="pickDate"
      ></date-pick>
      <el-button type="text" class="download-btn" @click="exportData" :disabled="!list || !list.length"
        >导出报表</el-button
      >
      <chart :options="chartOptions" height="300px" v-if="list && list.length"></chart>
      <place-holder :height="300" v-else />
    </div>
  </div>
</template>

<script>
  import utils from '@/dss-common/utils';
  import Chart from '@/dss-common/components/ChartEmpty';
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import excel from '@/dss-common/utils/excel';
  import { line } from '@/dss-common/assembler/index.js';
  import DatePick from '@/dss-common/components/date-pick/index.vue';

  import api from '@/mod-member/src/api/manage.js';
  import { mapState } from 'vuex';

  export default {
    name: 'RealtimeTrendChart',
    components: { Chart, PlaceHolder, DatePick },
    props: {
      currentStore: null,
    },
    data() {
      return {
        choosedSourceList: [],
        dateRange: [],
        list: null,
        chartOptions: null,
        loading: false,
        hasChange: false,
      };
    },
    watch: {
      currentStore() {
        this.getData();
      },
    },
    computed: {
      ...mapState({
        clientSource(state) {
          this.choosedSourceList = state.dmp.clientSourceList;
          this.$nextTick(() => {
            this.getData();
          });
          return state.dmp.clientSourceList;
        },
      }),
      checkAll() {
        if (this.choosedSourceList && this.clientSource) {
          return this.choosedSourceList.length === this.clientSource.length;
        } else {
          return false;
        }
      },
    },
    methods: {
      getData() {
        if (!this.clientSource || !this.clientSource.length) return;
        if (!this.choosedSourceList || !this.choosedSourceList.length) {
          this.list = [];
          this.$message.warning('新增客户趋势数据请选择客户来源！');
          return;
        }
        this.loading = true;
        api
          .getNewClientTrend({
            startDate: this.dateRange && this.dateRange[0],
            endDate: this.dateRange && this.dateRange[1],
            storeId: this.currentStore,
            clientSources:
              this.choosedSourceList.length === this.clientSource.length
                ? null
                : this.choosedSourceList.map(item => item.id),
          })
          .then(res => {
            const sources = this.choosedSourceList.map(item => item.name);
            this.list = (res.data || []).map(item => {
              item.sources = sources;
              item.statDate = utils.timeFormat(item.statDate, 'YYYY-MM-DD');
              return item;
            });
            this.setOptions(this.list);
          })
          .always(() => {
            this.loading = false;
          });
      },
      setOptions(data) {
        const options = line.assembleLineOptions(
          this.list,
          'statDate',
          'newClientCount',
          null,
          utils.getTimeList(new Date(this.dateRange[0]), new Date(this.dateRange[1]))
        );
        (options.grid = {
          top: '42',
          left: '25',
          right: '47',
          bottom: '0%',
          containLabel: true,
        }),
          (options.tooltip = {
            position(point, params, dom, rect, size) {
              return {
                top: point[1] - size.contentSize[1] + 'px',
                left: point[0] - Math.ceil(size.contentSize[0] / 2) + 'px',
              };
            },
            trigger: 'axis',
            show: true,
            backgroundColor: 'transparent',
            formatter: (params, ticket, callback) => {
              return `
            <div style="position:relative;text-align:center;padding:23px;background-color:#000;opacity:0.78;border-radius:4px" id="toolTipBox">
              <p style="font-size:12px;margin-bottom:23px;color:#fff">${params[0].name}</p>
              <p style="font-size:12px;margin:0px;color:#fff">合计：
                <span style="color:#40C6F5;display:inline-block;margin-left:10px">${params[0].value}</span>
              </p>
              <p style="position:absolute;bottom:-5px;padding:0;width:0;height:0;left:0;right:0;margin:auto;opacity:0.78;border:5px solid #000;transform:rotate(45deg)"></p>
            </div>
            `;
            },
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#999999',
                show: false,
              },
            },
          });
        options.series.forEach(item => {
          item.smooth = false;
          item.symbolSize = 6;
          item.areaStyle = null;
        });
        this.chartOptions = options;
      },
      handleCheckAll() {
        this.hasChange = true;
        this.choosedSourceList = this.checkAll ? [] : this.clientSource;
      },
      handleFinishSelect(show) {
        console.log(this.hasChange);
        if (!show && this.hasChange) {
          this.getData();
          this.hasChange = false;
        }
      },
      pickDate(range) {
        this.dateRange = range;
        this.getData();
      },
      exportData() {
        const downloadTableData = this.$plain(this.list);
        excel.export2Excel(
          [
            { key: 'sources', label: '来源' },
            { key: 'statDate', label: '时间' },
            { key: 'newClientCount', label: '新增客户数合计' },
          ],
          downloadTableData,
          '新增客户统计'
        );
      },
    },
  };
</script>

<style lang="less" scoped>
  .el-select {
    width: 200px;
    margin-left: -4px;
  }
  .date-range {
    display: inline-block;
  }
  .download-btn {
    float: right;
    margin: 20px;
    font-size: 14px !important;
  }
  .el-button.is-disabled,
  .el-button.is-disabled:hover {
    color: #999;
    background: none;
    border: 0;
  }
</style>
