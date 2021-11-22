<template>
  <check-ma>
    <div class="all">
      <div class="da-title">留存分析</div>
      <!--日期选择组件-->
      <date-range @pick="onSelectDateRange" visible-short-cut style="margin-left: 20px"/>
      <!--表格组件-->
      <RetentAnalysisList :parenformtable="parenformtable, status" @toSwitch="updatedata" :strDateRange="strDateRange"></RetentAnalysisList>
      <Pagination v-if="totalpage" :totalpage="totalpage" @pick="changepage"></Pagination>
    </div>
  </check-ma>
</template>

<script>
  import Pagination from '../../components/ma/Pagination';
  import DateRange from '../../components/date-range.vue';
  import RetentAnalysisList from '../../components/ma/RetentAnalysisList';
  import daApi from '@/dss-da/src/api/da';
  import CheckMa from './check-ma.vue';
  const APPKEY = 'app_key';
  const NUMBERS = 'numbers';
  export default {
    components: { DateRange, RetentAnalysisList, Pagination, CheckMa },
    data() {
      return {
        status: [
          {
            activepage: 'newadd',
            select: false,
            eltable: false
          }
        ],
        startdate: '',
        enddate: '',
        parenformtable: [],
        pn: '',
        numbers: '',
        totalpage: '',
        strDateRange: []
      };
    },
    mounted() {
      // this.getappkey();
    },
    methods: {
      //根据子组件返回值重新刷新内容
      updatedata(val) {
        this.status.activepage = val;
        this.numbers = parseInt(window.localStorage.getItem(NUMBERS) ? window.localStorage.getItem(NUMBERS) : 15);
        if (this.status.activepage === 'newadd') {
          this.getactive();
        } else if (this.status.activepage === 'activeadd') {
          this.getactivekeep();
        }
      },
      onSelectDateRange(range) {
        this.numbers = parseInt(window.localStorage.getItem(NUMBERS) ? window.localStorage.getItem(NUMBERS) : 15);
        this.appKey = window.localStorage.getItem(APPKEY);
        this.startdate = range[0];
        this.enddate = range[1];
        this.status.activepage = this.status.activepage ? this.status.activepage : 'newadd';
        if (this.status.activepage === 'newadd') {
          this.getactive();
        } else if (this.status.activepage === 'activeadd') {
          this.getactivekeep();
        }
        this.strDateRange = [this.startdate, this.enddate];
      },
      //获取留存分析的数据
      getactive() {
        daApi.ma
          .retainAnalysis({
            // appKey: this.appKey,
            beginDate: this.startdate,
            endDate: this.enddate,
            pn: this.pn,
            numbers: this.numbers
          })
          .then(res => {
            this.status.activepage = 'newadd';
            this.items = res.data;
            this.parenformtable = this.items.list;
            //总的页数
            this.totalpage = res.data.pageNum;
          });
      },
      //获取活跃留存的数据
      getactivekeep() {
        daApi.ma
          .activeretainAnalysis({
            appKey: this.appKey,
            beginDate: this.startdate,
            endDate: this.enddate,
            pn: this.pn,
            numbers: this.numbers
          })
          .then(res => {
            this.status.activepage = 'activeadd';
            this.items = res.data;
            this.parenformtable = this.items.list;
            //总的页数
            this.totalpage = res.data.pageNum;
          });
      },
      //请求第几页参数pn
      changepage(val) {
        this.pn = val.pn ? val.pn : this.pn;
        this.numbers = val.numbers ? val.numbers : this.numbers;
        if (this.status.activepage === 'newadd') {
          this.getactive();
        } else if (this.status.activepage === 'activeadd') {
          this.getactivekeep();
        }
      }
    }
  };
</script>

<style scoped>

</style>
