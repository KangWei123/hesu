<template>
  <check-ma>
    <div class="all">
      <div class="da-title">获取分析</div>
      <!--日期选择组件-->
      <!--<DateRange @pick="receiveDateRage"></DateRange>-->
      <date-range @pick="onSelectDateRange" visible-short-cut style="margin-left: 20px"/>
      <!--趋势图-->
      <AcquireTrendChart :parentrendmap="parentrendmap"></AcquireTrendChart>
      <!--表格组件-->
      <AcquireAnalysisList :parenformtable="parenformtable, status" :strDateRange="strDateRange"></AcquireAnalysisList>
      <Pagination v-if="totalpage" :totalpage="totalpage" @pick="changepage"></Pagination>
    </div>
  </check-ma>
</template>

<script>
  import Pagination from '../../components/ma/Pagination';
  import AcquireTrendChart from '../../components/ma/AcquireTrendChart';
  import AcquireAnalysisList from '../../components/ma/AcquireAnalysisList';
  import daApi from '@/dss-da/src/api/da';
  import DateRange from '../../components/date-range.vue';
  import CheckMa from './check-ma.vue';
  const APPKEY = 'app_key';
  const NUMBERS = 'numbers';
  export default {
    components: { DateRange, AcquireAnalysisList, AcquireTrendChart, Pagination, CheckMa },
    name: 'application',
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
        parenformtable: [],
        parentrendmap: [],
        pn: '',
        numbers: '',
        totalpage: '',
        strDateRange: []
      };
    },
    mounted() {},
    methods: {
      onSelectDateRange(range) {
        this.appKey = window.localStorage.getItem(APPKEY);
        this.startdate = range[0];
        this.enddate = range[1];
        this.numbers = parseInt(window.localStorage.getItem(NUMBERS) ? window.localStorage.getItem(NUMBERS) : 15);
        this.getactive();
        this.getActiveTrendChart();
        this.strDateRange = [this.startdate, this.enddate];
      },
      //获取分析的数据
      getActiveTrendChart() {
        daApi.ma
          .getAnalysis({
            // appKey: this.appKey,
            beginDate: this.startdate,
            endDate: this.enddate
          })
          .then(res => {
            this.items = res.data;
            this.parentrendmap = res.data.list;
          });
      },
      getactive() {
        daApi.ma
          .getAnalysis({
            // appKey: this.appKey,
            beginDate: this.startdate,
            endDate: this.enddate,
            pn: this.pn,
            numbers: this.numbers
          })
          .then(res => {
            this.items = res.data;
            this.parenformtable = res.data.list;
            //总的页数
            this.totalpage = res.data.pageNum;
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
