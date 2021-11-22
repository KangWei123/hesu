<template>
  <div v-loading="loading">
    <el-row :gutter="20">
      <el-col :xs="24"
              :span="8"
              style="margin-bottom:20px">
        <el-card style="height:455px">
          <div slot="header">
            <h2 class="dss_profile_title">年龄占比<span class="dss_profile_sub_title">最近30天</span></h2>
            <p class="dss_profile_desc">各年龄段 / 整个品牌全体会员</p>
          </div>
          <chart :options="dataAge.options"
                 height="321px"
                 v-if="dataAge.data.length"></chart>
          <div class="none-data"
               v-else><i class="key-icon key-icon-btn key-icon-none"></i>暂无数据</div>
        </el-card>
      </el-col>
      <el-col :xs="24"
              :span="8"
              style="margin-bottom:20px">
        <el-card style="height:455px">
          <div slot="header">
            <h2 class="dss_profile_title">性别占比<span class="dss_profile_sub_title">最近30天</span></h2>
            <p class="dss_profile_desc">性别 / 整个品牌全体会员</p>
          </div>
          <el-row class="dss_portrait_sex">
            <el-col :span="12"
                    style="text-align:center">
              <img src="../../../asserts/images/boy.png"
                   style="height:90px;margin-left: -10px" />
              <div class="item-num primary-color">
                {{dataGender.male}}<span class="rate-symbole">%</span>
              </div>
              <div>男性</div>
            </el-col>
            <el-col :span="12"
                    style="text-align:center">
              <img src="../../../asserts/images/girl.png"
                   style="height:90px;margin-left: -10px" />
              <div class="item-num danger-color">
                {{dataGender.female}}<span class="rate-symbole">%</span>
              </div>
              <div>女性</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :xs="24"
              :span="8"
              style="margin-bottom:20px">
        <el-card style="height:455px;overflow:visible">
          <div slot="header">
            <h2 class="dss_profile_title">职业占比<span class="dss_profile_sub_title">最近30天</span></h2>
            <p class="dss_profile_desc">职业 / 整个品牌全体会员</p>
          </div>
          <pie-chart style="margin-top:40px;"
                     :data="dataJob.data"
                     v-if="dataJob.data.length"
                     legend="职业"></pie-chart>
          <div class="none-data"
               v-else><i class="key-icon key-icon-btn key-icon-none"></i>暂无数据</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import '../passflow.less';
import convert from '../convert';
import { Chart, GlobalPie as PieChart } from '@/dss-common/components';

const getDefaultGender = function() {
  return {
    male: 0,
    female: 0,
    count: 0
  };
};

const getDefaultAge = () => {
  return {
    data: [],
    options: null
  };
};
const getDefaultJob = () => {
  return {
    data: [],
    count: 0
  };
};
export default {
  components: {
    Chart,
    PieChart
  },
  props: {
    paramType: {
      type: String,
      default: ''
    },

    dateRange: {
      type: [Array, Object],
      default: function() {
        return [];
      }
    },
    portraitData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    rateData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  watch: {
    portraitData: {
      deep: true,
      handler(newVal, oldVal) {
        if (oldVal != null) {
          this.setData(this.portraitData || []);
        }
      }
    }
  },
  data() {
    return {
      dataGender: getDefaultGender(),
      dataAge: getDefaultAge(),
      dataJob: getDefaultJob()
    };
  },
  methods: {
    rate(value, decimal = 1) {
      return (value * 100).toFixed(decimal);
    },
    //  每次setData前先设置成默认的数据
    setDefaultData() {
      this.dataGender = getDefaultGender();
      this.dataAge = getDefaultAge();
      this.dataJob = getDefaultJob();
    },
    setData(data) {
      this.setDefaultData();
      data.forEach(item => {
        switch (item.tag) {
          case 'sex':
            item.data.forEach(subItem => {
              if (subItem.portraitName === '男' || subItem.portraitName === 'male') {
                this.dataGender.male = subItem.portraitRate;
              } else if (subItem.portraitName === '女' || subItem.portraitName === 'female') {
                this.dataGender.female = subItem.portraitRate;
              }
            });
            break;
          case 'user_age':
            this.dataAge.data = item.data || [];
            this.dataAge.options = convert.ageToBar(this.dataAge.data, 1);
            break;
          case 'user_job':
            this.dataJob.data = item.data;
            break;
        }
      });
    }
  }
};
</script>

