<template>
  <div class="body-wrapper client-analysis">
    <div class="analysis-header">
      <header>客户分析</header>
      <el-select v-model="curStore" placeholder="请选择" class="data-range">
        <el-option v-for="(item, index) in options" :key="index" :label="item.name" :value="item.id"> </el-option>
      </el-select>
    </div>
    <div class="container">
      <indicators label=" " :current-store="curStore"></indicators>
      <new-client-trend :current-store="curStore"></new-client-trend>
      <client-life-cycle :current-store="curStore"></client-life-cycle>
      <div v-if="roleList === 'common_role_enterprise'">
        <div class="invalid-client-analysis">
          <div class="chart-div">
            <invalid-reason :current-store="curStore"></invalid-reason>
          </div>
          <div class="chart-div">
            <invalid-channel :current-store="curStore"></invalid-channel>
          </div>
        </div>
        <div class="top-ten-analysis">
          <div class="chart-div">
            <new-client-rank :current-store="curStore" rank-type="SOURCE"></new-client-rank>
          </div>
          <div class="chart-div">
            <new-client-rank :current-store="curStore" rank-type="STORE"></new-client-rank>
          </div>
          <div class="chart-div">
            <new-client-rank :current-store="curStore" rank-type="EMPLOYEE"></new-client-rank>
          </div>
        </div>
      </div>
      <div v-else-if="roleList === 'common_role_dealer_manager'">
        <guide-client-table :current-store="curStore"></guide-client-table>
      </div>
    </div>
  </div>
</template>

<script>
  import PortraitTitle from '@/mod-member/src/components/portraitTitle/index.vue';
  import Indicators from './components/indicators.vue';
  import NewClientTrend from './components/new-client-trend.vue';
  import ClientLifeCycle from './components/client-life-cycle.vue';
  import InvalidReason from './components/invalid-reason.vue';
  import InvalidChannel from './components/invalid-channel.vue';
  import NewClientRank from './components/new-client-rank.vue';
  import GuideClientTable from './components/guide-client-table.vue';
  import './chart-base.less';
  import { mapState } from 'vuex';
  export default {
    components: {
      PortraitTitle,
      Indicators,
      NewClientTrend,
      ClientLifeCycle,
      InvalidReason,
      InvalidChannel,
      NewClientRank,
      GuideClientTable,
    },
    data() {
      return {
        curStore: undefined,
        options: [],
      };
    },
    computed: {
      ...mapState({
        roleList: state => (state.roleList || '').split(',')[0],
      }),
    },
    watch: {
      roleList() {
        this.init();
      },
    },
    methods: {
      init() {
        const storeList = this.$store.state.storeList || [];
        if (this.roleList === 'common_role_enterprise') {
          this.curStore = null;
          this.options = [{ name: '企业看板', id: null }];
        } else if (storeList.length) {
          this.curStore = storeList[0].id;
          this.options = storeList;
        } else {
          this.curStore = null;
          this.options = [];
        }
      },
    },
    mounted() {
      if (this.roleList) {
        this.init();
      }
    },
  };
</script>

<style lang="less">
  .client-analysis {
    width: calc(100vw - 260px);
    background: #f2f4f7;
    .analysis-header {
      margin-bottom: 20px;
      background: #fff;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.06);
      header {
        height: 50px;
        font-size: 20px;
        font-family: PingFangSC-Regular;
        font-weight: 600;
        color: #333;
        line-height: 50px;
        padding: 0 20px;
      }
      .data-range {
        margin: 15px 20px;
      }
    }
    .container {
      background: #f2f4f7;
      width: 100%;
    }
    .invalid-client-analysis {
      display: flex;
      justify-content: space-between;
      .chart-div {
        flex-basis: 49.4%;
      }
    }
    .top-ten-analysis {
      display: flex;
      justify-content: space-between;
      .chart-div {
        flex-basis: 32.5%;
      }
    }
    .analysis-box {
      margin-top: 20px;
      padding: 20px 15px;
      background: #fff;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.06);
      border-radius: 4px;
      border: 1px solid #f2f2f2;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      .analysis-title {
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #404040;
        height: 20px;
        margin-bottom: 20px;
        position: relative;
        overflow: hidden;
      }
    }
  }
</style>
