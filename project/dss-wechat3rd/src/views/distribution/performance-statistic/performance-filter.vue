<template>
  <div class="filter-box" v-loading="loading">
    <div class="filter-tab">
      <span class="filter-label">时间</span>
      <el-date-picker
        class="dss-filter-input"
        size="mini"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        range-separator="至"
        :picker-options="pickerOptions"
        v-model="filterParams.date"
        @change="onFilter"
      ></el-date-picker>
    </div>

    <!-- 门店选择 -->
    <div class="filter-tab">
      <el-select v-model="filterParams.storeId" filterable placeholder="请选择" @change="onFilter">
        <el-option v-for="item in storeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
    </div>

    <!-- 业绩类型选择 -->
    <div class="filter-tab" v-if="filterType === 'marketing'">
      <el-select v-model="filterParams.commissionMode" filterable placeholder="请选择" @change="onFilter">
        <el-option v-for="item in commissionModeOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>

    <div class="filter-tab" v-if="filterType !== 'order-detail'">
      <el-input
        class="filter-input"
        size="mini"
        placeholder="员工名字搜索"
        v-model="filterParams.name"
        maxlength="30"
      ></el-input>
    </div>

    <div class="filter-tab" v-if="filterType === 'order-detail'">
      <el-input
        class="filter-input"
        size="mini"
        placeholder="购买人名字搜索"
        v-model="filterParams.orderUserNickname"
        maxlength="30"
      ></el-input>
    </div>

    <el-button type="primary" size="mini" class="search-btn" @click="onFilter">搜索</el-button>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import utils from '@/dss-common/utils';
  import distributionApi from '@/dss-wechat3rd/src/api/distribution.js';

  export default {
    name: 'PerformanceFilter',

    props: {
      // 搜索筛选类型
      filterType: {
        type: String,
        default: 'marketing',
      },
      // 父组件传过来的默认的查询条件
      params: {
        type: Object,
        default: () => {
          return {};
        },
      },
    },

    data() {
      return {
        loading: false,

        filterParams: {
          date: null, // 时间
          storeId: null, // 门店id
          commissionMode: null, // 业绩类型
          name: null, // 员工名字
          orderUserNickname: null, // 购买人名字
        },

        storeOptions: [], // 门店列表选择项
        // 业绩类型选择
        commissionModeOptions: [
          { label: '推广业绩统计', value: 1 },
          { label: '服务业绩统计', value: 2 },
        ],

        // 日期时间选择选项
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              },
            },
          ],
        },
      };
    },

    computed: {
      ...mapState({
        userInfo: state => state.userInfo,
      }),
    },
    watch: {
      // 监听父组件传过来的默认的查询条件
      params: {
        deep: true,
        handler(newVal, oldVal) {
          if (newVal) {
            Object.keys(newVal).forEach(item => {
              this.filterParams[item] = newVal[item];
            });
          }
        },
      },
    },

    mounted() {
      this.getStoreList(); // 获取该商户下所有门店列表
    },
    methods: {
      /**
       * 获取该商户下所有门店列表
       */
      getStoreList() {
        const storeInfo = {
          per_chooseAppId: this.userInfo.appInfo.id,
          per_chooseEpId: this.userInfo.appInfo.epId,
        };
        const params = {
          storeInfo,
        };
        distributionApi.queryStoreList(params).done(res => {
          if (res.data) {
            res.data.forEach(e => {
              this.storeOptions.push({
                value: e.id,
                label: e.name,
              });
            });
            this.storeOptions.unshift({
              value: null,
              label: '全部门店',
            });
          }
        });
      },

      /**
       * 改变查询条件通知父组件进行查询
       */
      onFilter() {
        const filterParams = { ...this.filterParams };

        // 时间
        if (filterParams.date) {
          filterParams.startDate = utils.timeFormat(filterParams.date[0], 'YYYY-MM-DD');
          filterParams.endDate = utils.timeFormat(filterParams.date[1], 'YYYY-MM-DD');
        }

        delete filterParams.date; // 删除未转化的日期对象

        // 循环删除查询条件中为空的参数
        Object.keys(filterParams).forEach(key => {
          if (filterParams[key] === null || filterParams[key] === '') {
            delete filterParams[key];
          }
        });

        this.$emit('filter', filterParams);
      },
    },
  };
</script>
