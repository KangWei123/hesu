<template>
  <check-ma @checked="onMaChecked">
    <div class="all">
      <div class="da-title">活跃分析</div>
      <!--今日统计-->
      <TodayStatistics :parenTodayStatistics="parenTodayStatistics"></TodayStatistics>
      <!--日期选择组件-->
      <date-range @pick="onSelectDateRange" visible-short-cut style="margin-left: 20px"/>
      <!--今日小时趋势图class="hour-trend" -->
      <ActiveTrendChart :parenStackedArea="parenStackedArea" :strDateRange="strDateRange"></ActiveTrendChart>
      <!--表格组件-->
      <ActiveAnalysisList :parenformtable="parenformtable,status" :strDateRange="strDateRange">
      </ActiveAnalysisList>
      <Pagination v-if="totalpage" :totalpage="totalpage" @pick="changepage"></Pagination>
    </div>
  </check-ma>
</template>

<script>
  import Pagination from '../../components/ma/Pagination';
  import TodayStatistics from '../../components/ma/TodayStatistics';
  import DateRange from '../../components/date-range.vue';
  import ActiveTrendChart from '../../components/ma/ActiveTrendChart';
  import ActiveAnalysisList from '../../components/ma/ActiveAnalysisList';
  import daApi from '@/dss-da/src/api/da';
  import CheckMa from './check-ma.vue';

  const APPKEY = 'app_key';
  const NUMBERS = 'numbers';
  export default {
    components: { TodayStatistics, ActiveTrendChart, DateRange, ActiveAnalysisList, Pagination, CheckMa },
    data() {
      return {
        status: [
          {
            activepage: true,
            select: false,
            eltable: false
          }
        ],
        startdate: '',
        enddate: '',
        parenTodayStatistics: '',
        parenStackedArea: [],
        parenformtable: [],
        pn: '',
        numbers: '',
        totalpage: '',
        strDateRange: []
      };
    },
    methods: {
      onMaChecked(hasMa) {},
      onSelectDateRange(range) {
        this.appKey = window.localStorage.getItem(APPKEY);
        this.startdate = range[0];
        this.enddate = range[1];
        this.numbers = parseInt(window.localStorage.getItem(NUMBERS) ? window.localStorage.getItem(NUMBERS) : 15);
        this.getactive();
        this.strDateRange = [this.startdate, this.enddate];
      },
      //获取活动的数据
      getactive() {
        daApi.ma
          .activeAnalysis({
            // appKey: this.appKey,
            beginDate: this.startdate,
            endDate: this.enddate
            // pn: this.pn,
            // numbers: this.numbers
          })
          .then(res => {
            this.items = res.data;
            this.parenTodayStatistics = this.items.statistics ? this.items.statistics : '';
            this.parenStackedArea = this.items.list ? this.items.list : '';
            this.parenformtable = res.data.list ? res.data.list : '';
            this.totalpage = res.data.pageNum ? res.data.pageNum : '';
          });
      },
      //请求第几页参数pn
      changepage(val) {
        this.pn = val.pn ? val.pn : this.pn;
        this.numbers = val.numbers ? val.numbers : this.numbers;
        this.getactive();
      }
    }
  };
</script>

<style scoped>

</style>
