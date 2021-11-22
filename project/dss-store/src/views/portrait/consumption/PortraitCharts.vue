<template>
  <div class="dss_portrait">

    <el-row :gutter="11">
      <el-col :span="12" :sm="24" :md="12">
        <el-card v-loading="loading" style="height:310px">
          <div slot="header">
            <h2 class="dss_portrait_title">消费水平</h2>
            <div class="portrait-legend" v-if="dataConsumption.data.length"><span />行业均值</div>
          </div>
          <chart-cross-bar height="200px"
            :has-avg="true"
            :data="dataConsumption.data"
            v-if="dataConsumption.data.length"></chart-cross-bar>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" :sm="24" :md="12">
        <el-card v-loading="loading" style="height:310px">
          <div slot="header">
            <h2 class="dss_portrait_title">消费品级</h2>
          </div>
          <chart :options="dataConsumptionGrade.options" height="200px" v-if="dataConsumptionGrade.data.length"></chart>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>

    </el-row>

    <el-row class="dss_portrait_mt" :gutter="11" >
      <el-col :span="12" :sm="24" :md="12">
        <el-card v-loading="loading" style="height:549px">
          <div slot="header">
            <h2 class="dss_portrait_title">品类偏好</h2>
          </div>
          <chart-cross-bar :max-rate="1" :data="dataCategory.data" key-name="portraitName" val-name="portraitRate" height="438px" color="#3499FE" v-if="dataCategory.data.length"></chart-cross-bar>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" :sm="24" :md="12">
        <el-card v-loading="loading" style="height:549px">
          <div slot="header">
            <h2 class="dss_portrait_title">购物方式</h2>
          </div>
          <chart-cross-bar :max-rate="1" :data="dataShopping.data" key-name="portraitName" val-name="portraitRate" height="438px" color="#3499FE" v-if="dataShopping.data.length"></chart-cross-bar>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" :sm="24" :md="12">
        <el-card v-loading="loading" style="height:549px">
          <div slot="header">
            <h2 class="dss_portrait_title">餐饮偏好</h2>
          </div>
          <chart-cross-bar :max-rate="1" :data="dataCater.data" key-name="portraitName" val-name="portraitRate" height="438px" color="#3499FE" v-if="dataCater.data.length"></chart-cross-bar>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" :sm="24" :md="12">
        <el-card v-loading="loading" style="height:549px">
          <div slot="header">
            <h2 class="dss_portrait_title">娱乐偏好</h2>
          </div>
          <chart-cross-bar :max-rate="1" :data="dataEntertainment.data" key-name="portraitName" val-name="portraitRate" height="438px" color="#3499FE" v-if="dataEntertainment.data.length"></chart-cross-bar>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import '../passflow.less';
import convert from '../convert';
import Chart from '@/dss-common/components/Chart';
import ChartBar from '@/dss-common/components/ChartBar';
import portraitsApi from '@/dss-common/api/portraits';
import ChartCrossBar from '../ChartCrossBar';

export default {
  components: {
    Chart,
    ChartBar,
    ChartCrossBar
  },
  props: {
    paramType: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      api: 'all',
      loading: true,
      dataConsumption: {
        data: []
      },
      dataConsumptionGrade: {
        data: [],
        options: null
      },
      dataCategory: {
        data: []
      },
      dataShopping: {
        data: []
      },
      dataCater: {
        data: []
      },
      dataEntertainment: {
        data: []
      }
    };
  },
  computed: {
    curStore() {
      return this.$store.state.curStore;
    }
  },
  watch: {
    paramType(val) {
      this.getData();
    }
  },
  methods: {
    getTotal(data) {
      return data.reduce((prev, curr) => {
        return prev + curr.portraitCount;
      }, 0);
    },
    setData(data) {
      data.forEach(item => {
        switch (item.tag) {
          case 'user_category_preference':
            this.dataCategory.data = item.data || [];
            break;
          case 'user_cater_brand_preference':
            this.dataCater.data = item.data || [];
            break;
          case 'user_consumption':
            this.dataConsumption.data = item.data || [];
            break;
          case 'user_entertainment_preference':
            this.dataEntertainment.data = item.data || [];
            break;
          case 'user_shopping_method':
            this.dataShopping.data = item.data || [];
            break;
          case 'user_consumption_grade':
            this.dataConsumptionGrade.data = item.data || [];
            this.dataConsumptionGrade.options = convert.ageToBar(this.dataConsumptionGrade.data);
            break;
        }
      });
    },
    getData() {
      this.loading = true;
      portraitsApi.consume(this.paramType).then(
        ({ data }) => {
          this.loading = false;
          this.setData(data || []);
        }
      ).always(() => {
        this.loading = false;
      });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
