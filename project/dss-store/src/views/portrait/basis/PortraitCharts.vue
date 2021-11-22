<template>
  <div class="dss_portrait">
    <el-row :gutter="11">
      <el-col :span="8" :md="24" :sm="24" :lg="8">
        <el-card v-loading="loading" style="height:455px">
          <div slot="header">
            <h2 class="dss_portrait_title">年龄占比</h2>
          </div>
          <chart :options="dataAge.options" height="321px" v-if="dataAge.data.length"></chart>
          <div v-else>暂无数据</div>
        </el-card>
      </el-col>

      <el-col :span="8" :md="12" :sm="24" :lg="8">
        <el-card v-loading="loading" style="height:455px">
          <div slot="header">
            <h2 class="dss_portrait_title">婚恋人群占比</h2>
          </div>

          <el-row>
            <el-col :span="24">
              <chart :svg="true" :options="dataMarital.options" height="241px"></chart>
            </el-col>
            <el-col :span="24">
              <div class="dss_portrait_people" style="text-align:center">
                <div class="people-item" style="margin-right:12px;">
                  <div class="item-num primary-color">
                    {{rate(dataMarital.married)}}
                    <span class="rate-symbole">%</span>
                  </div>
                  <div>婚恋人士</div>
                  <span class="item-point" style="background: #487CED"></span>
                </div>
                <div class="people-item" style="margin-left:12px">
                  <div class="item-num danger-color">
                    {{rate(dataMarital.unmarried)}}
                    <span class="rate-symbole">%</span>
                  </div>
                  <div>单身人士</div>
                  <span class="item-point" style="background: #FF5C56"></span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :span="8" :md="12" :sm="24" :lg="8">
        <el-card v-loading="loading" style="height:455px">
          <div slot="header">
            <h2 class="dss_portrait_title">性别占比</h2>
          </div>
          <el-row class="dss_portrait_sex">
            <el-col :span="12" style="text-align:center">
              <img src="../../../asserts/images/boy.png" style="height:90px;margin-left: -10px">
              <div class="item-num primary-color">
                {{rate(dataGender.male)}}
                <span class="rate-symbole">%</span>
              </div>
              <div>男性</div>
            </el-col>
            <el-col :span="12" style="text-align:center">
              <img src="../../../asserts/images/girl.png" style="height:90px;margin-left: -10px">
              <div class="item-num danger-color">
                {{rate(dataGender.female)}}
                <span class="rate-symbole">%</span>
              </div>
              <div>女性</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="11" style="margin-top: 9px;">
      <el-col :span="12" :sm="24" :md="12">
        <el-card v-loading="loading" style="height:268px">
          <div slot="header">
            <h2 class="dss_portrait_title">学历水平</h2>
            <div class="portrait-legend" v-if="dataEducational.data.length">
              <span/>行业均值
            </div>
          </div>
          <chart-cross-bar
            :has-avg="true"
            :data="dataEducational.data"
            height="157px"
            v-if="dataEducational.data.length"
          ></chart-cross-bar>
          <div v-else>暂无数据</div>
        </el-card>

        <el-card v-loading="loading" style="height:268px">
          <div slot="header">
            <h2 class="dss_portrait_title">收入水平</h2>
            <div class="portrait-legend" v-if="dataIncome.data.length">
              <span/>行业均值
            </div>
          </div>
          <chart-cross-bar
            :has-avg="true"
            :data="dataIncome.data"
            height="157px"
            v-if="dataIncome.data.length"
          ></chart-cross-bar>
          <div v-else>暂无数据</div>
        </el-card>
      </el-col>
      <el-col :span="12" :sm="24" :md="12">
        <el-card v-loading="loading" class="dss_portrait_mt" style="height:546px">
          <div slot="header">
            <h2 class="dss_portrait_title">职业分布</h2>
          </div>
          <chart-cross-bar height="435px" :data="dataJob.data" v-if="dataJob.data.length"></chart-cross-bar>
          <div v-else>暂无数据</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="11" style="margin-top: 9px;" class="customized-block-top-device">
      <el-col :span="12" :md="24" :sm="24" :lg="12">
        <el-card v-loading="loading" style="margin-top: 9px; position: relative;">
          <div slot="header">
            <h2 class="dss_portrait_title">机型TOP10占比</h2>
          </div>
          <el-row :gutter="30">
            <el-col :span="16">
              <chart :svg="true" :options="dataPhoneModel.options" height="550px"></chart>
            </el-col>
            <el-col :span="8" style="margin-top:50px">
              <chart-rank
                  :data="dataPhoneModel.data"
                  :count="dataPhoneModel.count"
                  :type="areaType"
                  key-name="portraitName"
                  val-name="portraitCount"
                  rate-name="portraitRate"
                  :phone-model-rank="true"
                  :show-member="false">
              </chart-rank>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12" :md="24" :sm="24" :lg="12">
        <el-card
          v-loading="loading"
          class="dss_portrait_mt"
          style="margin-top: 9px; position: relative"
        >
          <div slot="header">
            <h2 class="dss_portrait_title">常驻地域</h2>
          </div>
          <div class="dss_portrait_tab">
            <el-radio-group v-model="areaType" class="dss-radios-group area-radios">
              <el-radio-button label="城市"></el-radio-button>
              <el-radio-button label="省份"></el-radio-button>
            </el-radio-group>
            <el-row :gutter="30" style="padding:50px 0 0;">
              <el-col :span="16">
                <chart-map
                  height="500px"
                  :data="dataMap.data"
                  :type="areaType"
                  key-name="portraitName"
                  val-name="portraitRate"
                ></chart-map>
              </el-col>
              <el-col :span="8">
                <chart-rank
                  :data="dataMap.data"
                  :count="dataMap.count"
                  :type="areaType"
                  key-name="portraitName"
                  val-name="portraitCount"
                  rate-name="portraitRate"
                  :show-member="false"
                ></chart-rank>
              </el-col>
            </el-row>
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
import ChartMap from '@/dss-common/components/ChartMap';
import ChartRank from './ChartRank';
import portraitsApi from '@/dss-common/api/portraits';
import ChartCrossBar from '../ChartCrossBar';

export default {
  components: {
    Chart,
    ChartMap,
    ChartRank,
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
      showPush: false,
      pushCategoryName: '',
      areaType: '',
      dataMap: {
        data: [],
        count: 0
      },
      dataGender: {
        male: 0,
        female: 0,
        count: 0
      },
      dataAge: {
        data: [],
        options: null
      },
      dataMarital: {
        unmarried: 0,
        married: 0,
        options: convert.marriToPie(0, 0)
      },
      dataJob: {
        data: [],
        count: 0
      },
      dataProvince: {
        data: [],
        count: 0
      },
      dataCity: {
        data: [],
        count: 0
      },
      dataArea: {
        data: [],
        count: 0
      },
      dataEducational: {
        data: []
      },
      dataIncome: {
        data: []
      },
      dataPhoneModel: {
        data: [],
        count: 0,
        options: {}
      }
    };
  },

  watch: {
    areaType(val) {
      switch (val) {
        case '省份':
          this.dataMap.data = this.dataProvince.data;
          this.dataMap.count = this.dataProvince.count;
          break;
        case '城市':
          this.dataMap.data = this.dataCity.data;
          this.dataMap.count = this.dataCity.count;
          break;
        case '地域':
          this.dataMap.data = this.dataArea.data;
          this.dataMap.count = this.dataArea.count;
          break;
      }
    },
    paramType(val) {
      this.getData();
    }
  },

  computed: {
    curStore() {
      return this.$store.state.curStore;
    }
  },

  methods: {
    rate(value, decimal = 1) {
      return (value * 100).toFixed(decimal);
    },

    percent(value, max = 100, decimal = 0) {
      return max ? `${((value / max) * 100).toFixed(decimal)}` : '0';
    },

    getTotal(data) {
      return data.reduce((prev, curr) => {
        return prev + curr.portraitCount;
      }, 0);
    },

    setData(data) {
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
            this.dataAge.options = convert.ageToBar(this.dataAge.data);
            break;
          case 'mz_user_marriage':
            item.data.forEach(subItem => {
              if (subItem.portraitName === '已婚') {
                this.dataMarital.married = subItem.portraitRate;
              } else if (subItem.portraitName === '未婚') {
                this.dataMarital.unmarried = subItem.portraitRate;
              }
            });
            const { married, unmarried } = this.dataMarital;
            this.dataMarital.options = convert.marriToPie(married, unmarried);
            break;
          case 'user_job':
            this.dataJob.data = item.data;
            break;
          case 'user_life_city_province':
            this.dataProvince.data = item.data;
            this.dataProvince.count = this.getTotal(item.data);
            break;
          case 'user_life_city':
            this.dataCity.data = item.data;
            this.dataCity.count = this.getTotal(item.data);
            break;
          case '常驻地域':
            this.dataArea.data = item.data;
            this.dataArea.count = this.getTotal(item.data);
            break;
          case 'user_educational_status':
            this.dataEducational.data = item.data;
            break;
          case 'user_income_jg':
            this.dataIncome.data = item.data;
            break;
          case 'mobile_phone_brand':
            this.dataPhoneModel.data = item.data;
            this.dataPhoneModel.count = this.getTotal(item.data);
            this.dataPhoneModel.options = convert.phoneModelToPie(item.data, this.dataPhoneModel.count);
            break;
        }
      });
    },

    getData() {
      this.loading = true;
      portraitsApi.base(this.paramType).then(
        ({ data }) => {
          this.loading = false;
          this.setData(data || []);
          this.areaType = '城市';
        },
        () => {
          this.loading = false;
        }
      );
    }
  },

  mounted() {
    this.getData();
  }
};
</script>

<style>
.area-radios {
  position: absolute;
  top: 34px;
}

.rate-symbole {
  font-size: 16px;
}
</style>
