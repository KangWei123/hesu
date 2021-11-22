<template>
  <chack-ma @checked="onMaChecked">
    <div class="all">
      <div class="da-title">概览</div>
      <!--今日统计-->
      <TodayStatistics :parenTodayStatistics="parenTodayStatistics"></TodayStatistics>
      <!--今日小时趋势图class="hour-trend" -->
      <ApplyTrend :parenStackedArea="parenStackedArea"></ApplyTrend>
      <!--用户来源以及设备品牌比-->

      <div class="user-device">
        <div class="cla-user">
          <span class="title">获取场景 TOP5</span>
          <ApplyHorizontalBar :parenclauser="parenclauser"></ApplyHorizontalBar>
        </div>
        <div class="cla-device">
          <span class="title">用户设备品牌占比</span>
          <PieChart :parencladevice="parencladevice"></PieChart>
        </div>
      </div>
    </div>
  </chack-ma>
</template>

<script>
  import ApplyTrend from '../../components/ma/ApplyTrend';
  import ApplyHorizontalBar from '../../components/ma/ApplyHorizontalBar';
  import PieChart from '../../components/ma/PieChart';
  import TodayStatistics from '../../components/ma/TodayStatistics';
  import daApi from '@/dss-da/src/api/da';
  import ChackMa from './check-ma.vue';
  const APPKEY = 'app_key';
  export default {
    components: { TodayStatistics, ApplyTrend, ApplyHorizontalBar, PieChart, ChackMa },
    name: '',
    data() {
      return {
        appKey: '',
        items: '',
        parenTodayStatistics: [],
        parenStackedArea: null,
        parenclauser: null,
        parencladevice: null
      };
    },
    methods: {
      onMaChecked(hasMa) {
        if (hasMa) {
          this.getappkey();
        }
      },
      getappkey() {
        window.localStorage.setItem(APPKEY, 'abxgc');
        this.appKey = window.localStorage.getItem(APPKEY);
        this.getOverView();
      },
      //获取应用概览的数据
      getOverView() {
        daApi.ma.applicationOverView().then(res => {
          this.items = res.data;
          this.parenTodayStatistics = res.data ? res.data : '';
          this.parenStackedArea = res.data.hourTrendList ? res.data.hourTrendList : '';
          this.parenclauser = res.data.obtainAnalysisList ? res.data.obtainAnalysisList : '';
          this.parencladevice = res.data.crowdPortraitList ? res.data.crowdPortraitList : '';
        });
      }
    }
  };
</script>


<style lang="less">
  .all{
    box-sizing: content-box;
    margin-bottom:20px;
  }
  .user-device{
    font-size:0;
    position:relative;
    margin-top:20px;
    .cla-user{
      width:49.5%;
      margin-right:1%;
      display:inline-block;
      vertical-align:middle;
      background: #FFFFFF;
      padding: 20px;
      box-sizing: border-box;
      border-radius: 4px;
    }
    .cla-device{
      width:49.5%;
      display:inline-block;
      vertical-align:middle;
      background: #FFFFFF;
      border-radius: 4px;
      padding: 20px;
      box-sizing: border-box;
    }
  }
  .title{
    display:block;
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    margin-bottom: 15px;
  }

</style>
