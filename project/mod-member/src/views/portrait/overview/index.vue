<template>
  <div>
    <ul class="sub-header">
      <li><router-link class="light-bread" :to="{ path: '/portrait/manage/all' }">全部标签/</router-link></li>
      <li><a class="default-bread">画像分析</a></li>
    </ul>
    <condition-bar
      :is-bold="true"
      :primary-btn-text="primaryBtnText"
      :show-back-btn="false"
      :conditions="conditions"
    ></condition-bar>
    <query-result :total="total" :count="valueConditions.length" :rate="rate"></query-result>
    <!-- 筛选条件 -->
    <div class="page-content portrait_overview position-rel">
      <el-row class="portrait-analysis">
        <el-col :span="12">
          <div class="portrait_overview_radar">
            <h2>画像分析</h2>
            <!-- 雷达图 -->
            <overview-radar :data="tableData" :retotal="totalRecord" :loading="loading"></overview-radar>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="flex-item-12 portrait_overview_table" style="padding-top: 70px">
            <!-- 表格 -->
            <overview-table :data="tableData" @conditon-data-change="conditonDataChange"></overview-table>
          </div>
        </el-col>
      </el-row>
      <div class="portrait-top">
        <div class="position-back" v-if="isFromGroup">
          <button class="btn back-btn" @click="goGroup">返回</button>
        </div>
        <div class="position-abs" v-else>
          <button class="btn large-btn" @click="goBack">返回上一步，选择标签</button>
          <div class="center">
            <button class="btn" @click="goInsight(conditions)">继续洞察人群</button>
            <button @click="gotoGroupEdit" class="btn primary-btn">直接保存人群</button>
          </div>
        </div>
      </div>
    </div>
    <group-edit :conditions="conditions" :total="total" :model="groupInfo" :visible.sync="dialog.edit"></group-edit>
    <customer-insight
      :total-count="total"
      :conditions="conditions"
      :str-cdn="strCdn"
      :visible.sync="dialog.insight"
    ></customer-insight>
  </div>
</template>

<script>
  import Vue from 'vue';
  import './overview.less';
  import api from '@/mod-member/src/api/new-dmp';
  import QueryResult from '@/mod-member/src/components/queryResult';
  import customerInsight from '@/mod-member/src/components/customer-insight/index';
  import groupEdit from '../group-manage/GroupEdit';
  import OverviewRadar from './OverviewRadar';
  import OverviewTable from './OverviewTable';
  import ConditionBar from './ConditionBar';

  export default {
    components: {
      groupEdit,
      QueryResult,
      OverviewRadar,
      OverviewTable,
      customerInsight,
      ConditionBar,
    },
    data() {
      return {
        total: -1,
        count: 0,
        rate: 0,
        tableData: [],
        totalRecord: 0,
        loading: false,
        conditions: [], // 从路由参数获取
        strCdn: '', // 从路由参数获取
        groupInfo: null, // 从路由参数获取
        area: [], // 从路由参数获取
        dialog: {
          edit: false,
          insight: false,
        },
        primaryBtnText: '增加条件',
        isFromGroup: false,
      };
    },
    computed: {
      valueConditions() {
        return this.conditions.filter(cdn => cdn.type !== 'symbol');
      },
      // 是否包含人群条件
      hasGroupCdn() {
        return !!this.conditions.find(cdn => cdn.type === 'group');
      },
    },
    created() {
      // 来自人群管理
      if (this.$route.params.isFromGroup) {
        this.isFromGroup = true;
        this.strCdn = this.$route.params.strCdn;
        this.conditions = this.$route.params.conditions;
        localStorage.setItem('strCdn', this.strCdn);
        localStorage.setItem('conditions', JSON.stringify(this.conditions));
      }
      // 来自全部标签
      else {
        // 画像分析跳转的请求后台的参数conditions
        const myCdn = localStorage.getItem('portraitRouter');
        // this.strCdn=myCdn
        // 有缓存优先读取缓存
        if (myCdn) {
          this.strCdn = myCdn;
          if (localStorage.getItem('conditionsRouter')) {
            this.conditions = JSON.parse(localStorage.getItem('conditionsRouter'));
          }
        } else {
          const { cdns, strCdn, groupInfo = null, area = [] } = this.$route.params;
          this.conditions = cdns;
          this.strCdn = strCdn;
        }
        this.groupInfo = this.$route.params.groupInfo;
        this.area = this.$route.params.area;
      }
      // 当前页面刷新

      this.fetchData();
    },
    methods: {
      goInsight() {
        this.dialog.insight = true;
      },
      gotoGroupEdit(path) {
        this.dialog.edit = true;
      },

      conditonDataChange(item, index, value) {
        for (let i = 0, len = this.tableData.length; i < len; i++) {
          const row = this.tableData[i];
          if (row === item) {
            item.fenabled = value;
            Vue.set(this.tableData, i, item);
          }
        }
      },
      goGroup() {
        this.$router.push({
          name: 'groupList',
        });
      },
      goBack() {
        this.$router.push({
          name: 'portrait',
          params: {
            conditions: this.conditions,
          },
        });
      },
      fetchData() {
        this.loading = true;
        api
          .getAnalysisCount({
            // stores: this.area ? JSON.stringify(helper.areasToString(this.area)) : null,
            conditions: this.strCdn,
          })
          .done(res => {
            const result = res.data || {};
            this.total = result.countSum;
            if (result.countRateVos && result.countRateVos.length) {
              this.tableData = result.countRateVos.map(item => {
                item.fenabled = true;
                return item;
              });
            }
          })
          .always(() => {
            this.loading = false;
          });
      },
    },
    beforeDestroy() {
      localStorage.removeItem('strCdn');
      localStorage.removeItem('conditions');
    },
  };
</script>
