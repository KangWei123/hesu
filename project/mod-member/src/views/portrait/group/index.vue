<template>
  <div class="group" v-loading="isLoading">
    <ul class="sub-header">
      <li>
        <!-- <router-link class="light-bread" :to="{path:'/portrait/manage/all'}">全部标签/</router-link> -->
        <div class="light-bread" @click="allLabelChange">全部标签/</div>
      </li>
      <li>
        <router-link class="light-bread" :to="{ path: '/portrait/manage/overview' }">画像分析/</router-link>
      </li>
      <li>
        <a class="default-bread">客户洞察</a>
      </li>
    </ul>
    <div class="portrait-header position-rel">
      <!-- 筛选条件 -->
      <condition-bar
        :is-bold="true"
        :primary-btn-text="primaryBtnText"
        :show-back-btn="false"
        :conditions="conditions"
      ></condition-bar>
      <query-result :total="totalCount" :count="valueConditions.length" :rate="rate"></query-result>
    </div>

    <div class="cate_body portrait_group" :class="{ sidebar_hide: hideIndicatorbar }">
      <div class="portrait_group_content" :class="{ true: '', false: 'bg-gray' }[hideIndicatorbar]">
        <!-- 洞察指标显示栏 -->
        <div
          class="portrait_group_head group-head-con position-rel"
          style="border: 0; margin-bottom: 0"
          :class="{ true: 'pt0', false: 'pt30' }[hideIndicatorbar]"
        >
          <div v-if="!hideIndicatorbar" class="group-top">
            <p class="insight-index">客户洞察</p>
          </div>

          <div v-else class="portrait-title">
            <em class="portrait-title-head">客户洞察</em>
          </div>
          <!-- 已选指标 -->
          <div class="indicator_condition" :class="{ true: 'ml30', false: '' }[hideIndicatorbar]">
            <span class="no-index" v-if="!selectedTags && !selectedTags.length">暂无指标</span>
            <template v-else>
              <span class="indicator-dec">已选指标：</span>
              <selected-indicator
                :show-del-icon="false"
                :selected-tags="selectedTags"
                :hide-sidebar="hideIndicatorbar"
              ></selected-indicator>
            </template>
          </div>
        </div>
        <!-- 指标选择区 -->
        <div class="portrait_group_main">
          <div class="portrait_group_result position-rel">
            <echarts-view :result-list="analysisResult.value"></echarts-view>
          </div>
        </div>
      </div>
    </div>
    <div class="save-group">
      <button class="btn" @click="onCancel">取消</button>
      <button class="btn index-btn" :disabled="!selectedTags.length" @click="onSubmit">重新选择洞察指标</button>
      <button @click="gotoGroupEdit()" class="btn primary-btn">保存人群</button>
    </div>
    <group-edit
      :conditions="conditions"
      :total="totalCount"
      :model="groupInfo"
      :visible.sync="dialog.edit"
    ></group-edit>
    <customer-insight
      @changeInsight="changeInsight"
      @close="closeInsight"
      :rechoose-tags="selectedTags"
      :conditions="conditions"
      :str-cdn="strCdn"
      :visible.sync="dialog.insight"
    ></customer-insight>
  </div>
</template>

<script>
  import './portrait-group.less';
  import ConditionBar from '../overview/ConditionBar';
  import QueryResult from '../../../components/queryResult';
  import SelectedIndicator from './SelectedIndicator';
  import EchartsView from './EchartsView';
  import groupEdit from '../group-manage/GroupEdit';
  import customerInsight from '../../../components/customer-insight';

  export default {
    components: {
      groupEdit,
      ConditionBar,
      SelectedIndicator,
      EchartsView,
      QueryResult,
      customerInsight,
    },
    data() {
      return {
        conditions: [], // json对象，条件
        strCdn: '', // 传送后端条件，已经格式化完成的字符串
        groupInfo: null,
        area: [],
        MAX_TAG_COUNT: 50, // 分析指标时：最多可选数量
        tagKeyword: '', // 搜索关键字
        keyword: '',
        selectedTags: [],
        hideIndicatorbar: false, // 是否隐藏指标选择区
        totalCount: -1,
        analysisResult: {
          // 分析查询的结果
          value: [], // 具体的各标签结果
        },
        isLoading: false,
        count: 0,
        dialog: {
          edit: false,
          insight: false,
        },
        showShadow: false,
        title: '筛选条件',
        btnText: '继续选择',
        showBackBtn: false,
        primaryBtnText: '',
        rate: '',
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
    mounted() {
      if (!this.$route.params.conditions) {
        this.$router.push({ name: 'portrait' });
        return;
      }
      const { cdns, strCdn, result, groupInfo = null, area = [] } = this.$route.params;
      if (this.$route.params.analysisResult) {
        this.analysisResult.value = this.$route.params.analysisResult;
        this.hideIndicatorbar = true;
        this.selectedTags = this.$route.params.selectedTags;
        this.conditions = this.$route.params.conditions;
        this.strCdn = this.$route.params.strCdn;
        this.totalCount = this.$route.params.total;
        console.log('已选指标', this.selectedTags);
      } else {
        this.conditions = cdns;
        this.strCdn = strCdn;
      }
      console.log('analysisResult', this.analysisResult.value);
      this.groupInfo = groupInfo;
      this.area = area;
      this.total = (result && result.total) || -1;
    },
    methods: {
      // 分析查询
      onSubmit() {
        this.dialog.insight = true;
      },
      closeInsight() {
        this.dialog.insight = false;
      },
      // 重新选择洞察指标
      changeInsight(analysisResult, selectedTags, conditions, strCdn) {
        this.analysisResult.value = analysisResult;
        this.selectedTags = selectedTags;
        this.conditions = conditions;
        this.strCdn = strCdn;
      },
      // 搜索标签
      searchTags() {
        this.keyword = this.tagKeyword;
      },
      onCancel() {
        this.$router.push('/portrait');
      },
      gotoGroupEdit() {
        this.dialog.edit = true;
      },
      allLabelChange() {
        this.$router.push({
          path: '/portrait/manage/all',
        });
        localStorage.setItem('conditionsRouter', '');
        localStorage.setItem('portraitRouter', '');
      },
    },
    watch: {
      // 侧栏状态改变时触发 resize
      hideIndicatorbar: function (val, oldVal) {
        if (val !== oldVal) {
          // $(window).resize();
        }
      },
      analysisResult: {
        deep: true,
        handler() {},
      },
    },
  };
</script>

<style>
  .export.condition-label .condition-symbol {
    line-height: 18px !important;
    height: 20px;
  }

  .indicator_condition {
    height: 100px;
    /*background: #ffffff;*/
  }

  .save-group {
    width: 88%;
    height: 100px;
    position: fixed;
    bottom: 0;
    background: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .save-group .btn {
    /*position: absolute;*/
    /*left: 37%;*/
  }
</style>
