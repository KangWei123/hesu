<template>
  <check-ma>
    <div class="all">
      <div class="da-title">分享分析</div>
      <!--日期选择组件-->
      <date-range @pick="onSelectDateRange" visible-short-cut style="margin-left: 20px"/>
      <!--今日小时趋势图class="hour-trend" -->
      <ShareTrendChart :parenStackedArea="parenStackedArea" :strDateRange="strDateRange"></ShareTrendChart>
      <!--表格组件-->
      <ShareAnalysisList :parenformtable="parenformtable, status" :strDateRange="strDateRange"></ShareAnalysisList>
      <Pagination v-if="totalpage" :totalpage="totalpage" @pick="changepage"></Pagination>
    </div>
  </check-ma>
</template>

<script>
  import Pagination from '../../components/ma/Pagination';
  import DateRange from '../../components/date-range.vue';
  import ShareTrendChart from '../../components/ma/ShareTrendChart';
  import ShareAnalysisList from '../../components/ma/ShareAnalysisList';
  import CheckMa from './check-ma.vue';
  import daApi from '@/dss-da/src/api/da';
  const APPKEY = 'app_key';
  const NUMBERS = 'numbers';
  export default {
    components: { ShareTrendChart, DateRange, ShareAnalysisList, Pagination, CheckMa },
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
        parenStackedArea: '',
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
        this.numbers = parseInt(window.localStorage.getItem(NUMBERS) ? window.localStorage.getItem(NUMBERS) : 15);
        this.startdate = range[0];
        this.enddate = range[1];
        this.getactive();
        this.strDateRange = [this.startdate, this.enddate];
      },
      //获取分享分析的数据
      getactive() {
        daApi.ma
          .shareAnalysis({
            // appKey: this.appKey,
            beginDate: this.startdate,
            endDate: this.enddate
            // pn: this.pn,
            // numbers: this.numbers
          })
          .then(res => {
            this.items = res.data;
            this.parenformtable = res.data.list;
            this.parenStackedArea = res.data.list;
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

