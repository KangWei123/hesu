<template>
  <div class="dss_portrait">
    <el-row class="dss_portrait_mt" :gutter="11" >
      <el-col :span="24" :md="24" :lg="12">
        <el-card v-loading="loading" style="height:549px">
          <div slot="header">
            <h2 class="dss_portrait_title">兴趣爱好</h2>
          </div>
          <chart-cross-bar :max-rate="1" :data="dataHobby.data" key-name="portraitName" val-name="portraitRate" height="438px" color="#3499FE" v-if="dataHobby.data.length"></chart-cross-bar>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
      <el-col :span="24" :md="24" :lg="12">
        <el-card v-loading="loading" style="height:549px">
          <div slot="header">
            <h2 class="dss_portrait_title">阅读偏好</h2>
          </div>
          <chart-cross-bar :max-rate="1" :data="dataRead.data" key-name="portraitName" val-name="portraitRate" height="438px" color="#3499FE" v-if="dataRead.data.length"></chart-cross-bar>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
      <el-col :span="24" :md="24" :lg="12">
        <el-card v-loading="loading" style="height:549px">
          <div slot="header">
            <h2 class="dss_portrait_title">应用偏好</h2>
          </div>
          <chart-cross-bar :max-rate="1" :data="dataApplication.data" key-name="portraitName" val-name="portraitRate" height="438px" color="#3499FE" v-if="dataApplication.data.length"></chart-cross-bar>
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
      default: ''
    }
  },
  data() {
    return {
      api: 'all',
      loading: true,
      dataAge: {
        data: [],
        options: null
      },
      dataApplication: {
        data: []
      },
      dataRead: {
        data: []
      },
      dataHobby: {
        data: []
      },
      dataContent: {
        data: [],
        count: 0
      },
      dataConsumption: {
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
          case 'user_application_preference':
            this.dataApplication.data = item.data || [];
            break;
          case 'app_read_tag':
            this.dataRead.data = item.data || [];
            break;
          case 'user_hobby':
            this.dataHobby.data = item.data || [];
            break;
          case 'user_age':
            this.dataAge.data = item.data || [];
            this.dataAge.options = convert.ageToBar(this.dataAge.data);
            break;
          case 'user_job':
            this.dataJob.data = item.data;
            break;
          case 'app_read_tag':
            this.dataContent.data = item.data;
            this.dataContent.count = this.getTotal(item.data);
            break;
          case 'user_consumption':
            this.dataConsumption.data = item.data;
            break;
        }
      });
    },
    getData() {
      this.loading = true;
      portraitsApi.interest(this.paramType).then(
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
