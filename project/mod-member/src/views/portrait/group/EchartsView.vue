<template>
  <div class="portrait_group_charts">
    <el-row :gutter="10">
      <el-col v-for="(item, index) in showList" :key="index" :span="8" :sm="24" :md="12" :lg="8">
        <chart :title="item.title" :options="item.options" height="310px" @view-data="onViewData(item)"></chart>
      </el-col>
    </el-row>
    <div v-if="showList.length === 0" class="no_result hide" :class="{ hide: !!echartList.length }">请选择指标分析</div>
    <table-dialog :table-data="curChartData" :visible.sync="showDetailInfo"></table-dialog>
  </div>
</template>

<script>
  import Chart from './Chart';
  import getEchartsOption from './format-echarts-options';
  import TableDialog from './TableDialog';

  // echarts 图表
  export default {
    components: {
      TableDialog,
      Chart,
    },
    props: {
      resultList: {
        defualt: {},
      },
    },
    data() {
      return {
        echartList: [],
        curChartData: {},
        rsFmetrics: [],
        keyType: false,
        showDetailInfo: false, // 是否显示当前数据图表 modal
      };
    },
    mounted() {},
    computed: {
      // 图表最多展示 30 个值
      showList() {
        const list = [];
        for (const item of this.resultList) {
          list.push({
            title: item.name,
            options: getEchartsOption.getBar(item),
            data: item,
          });
        }
        return list;
      },
    },
    watch: {},
    methods: {
      // 图表的层叠样式
      zIndex(index) {
        return 'z-index: ' + (index + 1) * 0.1 + 900;
      },
      // 查看数据详情
      onViewData(item) {
        this.curChartData = item.data;
        this.showDetailInfo = true;
      },
      // window.resize
      resize() {
        window.clearTimeout(this.resizeTimer);
        this.resizeTimer = window.setTimeout(() => {
          this.echartList.forEach(chart => {
            chart.resize();
          });
        }, 200);
      },
      // 显示或隐藏loading
      toggleLoading(value) {
        this.echart[value ? 'showLoading' : 'hideLoading']({
          effect: 'whirling',
        });
      },
    },
  };
</script>
<style lang="less">
  .dmp_echart_item {
    .fa {
      display: none;
      position: absolute;
      top: 20px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
      color: #849aa5;
      font-size: 18px;
      transition: all 0.2s;
      z-index: 1;

      &:hover {
        color: #000;
      }
    }

    &:hover .fa {
      display: block;
    }

    .fa.screenfull {
      right: 20px;
    }

    .fa.detail_info {
      right: 43px;
    }

    .tip {
      top: 3px;
      left: 10px;
      color: #999;
    }
  }

  .dmp_echart_item {
    position: relative;

    .dmp_echart_title {
      position: relative;
      padding-left: 12px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-weight: 600;
      font-size: 15px;
      color: #494949;
      letter-spacing: 2px;
      padding-right: 30px;
      margin-bottom: 15px;

      .tip {
        &:hover {
          color: #4b89dd;
        }
      }
    }

    .dmp_echart_content {
      width: 100%;
      margin-top: 0;

      &.sub {
        width: 90%;
        margin-left: 5%;
        height: 630px;
      }

      &.population-con {
        width: 80%;
        height: 300px;
      }

      &.all-device-con {
        height: 600px;
        width: 50%;
        float: left;
        margin-top: -30px;
      }
    }

    .dmp_echart_empty {
      position: absolute;
      top: 45%;
      width: 100%;
      text-align: center;
    }

    i.fullscreen {
      display: none;
      opacity: 0;
      position: absolute;
      top: 20px;
      right: 20px;
      width: 30px;
      height: 30px;
      text-align: center;
      cursor: pointer;
      color: #26b0dd;
      font-size: 18px;
      transition: all 0.2s;
      z-index: 1;

      &:hover {
        color: #5fb5e8;
      }
    }

    &:hover i.fullscreen {
      display: block;
      opacity: 1;
    }

    &.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 99.9%;
      background: #fff;
      z-index: 1;
      transition: all 0.2s;

      .dmp_echart_content {
        width: 100%;
        height: calc(~'100% - 50px') !important;
      }
    }
  }

  .portrait_group_chart {
    padding: 20px 15px;
    min-height: 360px;
    border: 1px solid #e7e7e7;
    border-radius: 5px;
    box-shadow: 0 0 15px 3px #eee;
    margin-bottom: 10px;

    &.fullscreen {
      border-radius: 0;
    }
  }
</style>
