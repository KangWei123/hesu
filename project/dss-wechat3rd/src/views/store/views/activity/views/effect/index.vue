<template>
  <div class="activity-effect">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/activity/list' }">活动监测</el-breadcrumb-item>
      <el-breadcrumb-item>效果分析</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="dss-card">
      <!--活动效果-->
      <card-title text="活动效果">
        <template slot="right">
          <activity-selector v-model="selectedActivity"
                             :disabled="selectorDisabled"
                             :default-activity="defaultActivity"
                             :activities="activityList" />
        </template>
      </card-title>

      <effect-chart-category :data="effectOverviewData"
                             v-loading="loading"></effect-chart-category>
    </div>

    <div class="dss-card"
         style="margin-top: 30px">
      <!--效果明细-->
      <card-title text="效果明细">
        <!--<template slot="right">
          <el-button class="download-circle" icon="el-icon-download" round @click="downloadEffectData"></el-button>
        </template>-->
      </card-title>
      <effect-detail-table :data="pageEffectDetailList"
                           v-loading="loading"></effect-detail-table>
      <div>
        <el-pagination layout="prev, pager, next, jumper, sizes, total"
                       :total="effectDetailTotalLength"
                       :page-size="page.size"
                       :current-page.sync="page.num">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import CardTitle from '../../components/CardTitle';
import ActivitySelector from './ActivitySelector';
import EffectDetailTable from './EffectDetailTable';
import EffectChartCategory from './EffectChartCategory';

import mock from '../../api/mock';
import responseParser from '../../api/responseParser';
import activityRequestor from '../../api/activityRequestor';
import url from '@/dss-common/utils/url';

export default {
  components: {
    ActivitySelector,
    CardTitle,
    EffectDetailTable,
    EffectChartCategory
  },
  data() {
    return {
      loading: true,
      //是否禁用活动选择，当互动列表没加载出来时禁用
      selectorDisabled: true,
      //默认的活动，从上一个页面来或者默认选中第一个
      defaultActivity: null,
      //被选中的活动
      selectedActivity: null,
      //活动列表
      activityList: null,
      page: {
        num: 1,
        size: 10
      },

      //效果明细表格数据的个数
      effectDetailTotalLength: 0,
      //效果明细表格数据
      effectDetailList: [],
      //效果概览数据，包括图表和总览
      effectOverviewData: null
    };
  },
  created() {
    this.fetchActivityList();
  },
  computed: {
    // 前端表格分页
    pageEffectDetailList() {
      if (!this.effectDetailList || !this.effectDetailList) {
        return this.effectDetailList;
      }

      const data = this.$plain(this.effectDetailList);
      const begin = (this.page.num - 1) * this.page.size;
      return data.reverse().slice(begin, begin + this.page.size);
    }
  },
  watch: {
    selectedActivity(newVal, oldVal) {
      if (this.activityList) {
        this.fetchEffectData();
      } else {
        this.fetchActivityList();
      }
    }
  },
  methods: {
    fetchActivityList() {
      this.selectorDisabled = true;
      activityRequestor.listCondensedActivity().then(
        res => {
          if (res && res.data && res.data.length) {
            this.activityList = res.data;
            if (this.$route.query.activityId) {
              this.defaultActivity = Number(this.$route.query.activityId);
            } else {
              this.defaultActivity = this.activityList[0].id;
            }
            this.selectorDisabled = false;
          } else {
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
        }
      );
    },

    fetchEffectData() {
      this.loading = true;

      const params = { activityId: this.selectedActivity };

      activityRequestor
        .getActivityEffect(params)
        .done(
          res => {
            if (res && res.data) {
              const effectData = responseParser.parseEffectResponse(res.data);
              this.effectDetailList = effectData.detail;
              this.effectDetailTotalLength = this.effectDetailList.length;

              this.effectOverviewData = effectData.overview;
            }
          },
          error => {
            this.effectDetailList = null;
            this.effectDetailTotalLength = 0;

            this.effectOverviewData = null;
          }
        )
        .always(() => {
          this.loading = false;
        });
    },

    // 下载分析数据
    downloadEffectData() {
      activityRequestor.downloadEffectData(this.selectedActivity);
    }
  }
};
</script>

<style lang="less">
.activity-effect {
  .download-circle {
    box-sizing: border-box;
    padding: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
}
</style>
