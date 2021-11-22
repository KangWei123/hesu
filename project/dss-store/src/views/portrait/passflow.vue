<template>
  <div class="dss_portrait">

    <el-row :gutter="30">
      <el-col :span="8">
        <el-card v-loading="loading" style="height:310px">
          <div slot="header">
            <h2 class="dss_portrait_title">年龄占比</h2>
            <p class="dss_portrait_desc">各年龄段 / 整个品牌全体会员</p>
            <img @click="showPushDialog('年龄')" class="dss_portrait_push" title="投放"
                 src="@/dss-common/img/porperties/push.png"/>
          </div>
          <chart-bar :data="dataAge.data" v-if="dataAge.data.length"></chart-bar>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card v-loading="loading" style="height:310px">
          <div slot="header">
            <h2 class="dss_portrait_title">婚恋人群占比</h2>
            <p class="dss_portrait_desc">婚恋（单身） / 整个品牌全体会员</p>
          </div>
          <div style="position:relative">
            <el-row>
              <el-col :span="12">
                <chart-pie class="dss_portrait_people_pie" :count="dataMarital.married"
                           :other-count="dataMarital.unmarried" bg-color="#F9B723"></chart-pie>
              </el-col>
              <el-col :span="12">
                <div class="dss_portrait_people">
                  <dl>
                    <dt>{{dataMarital.married|rate}}</dt>
                    <dd>婚恋人士</dd>
                  </dl>
                  <dl>
                    <dt class="fix">{{dataMarital.unmarried|rate}}</dt>
                    <dd>单身人士</dd>
                  </dl>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card v-loading="loading" style="height:310px">
          <div slot="header">
            <h2 class="dss_portrait_title">性别占比</h2>
            <p class="dss_portrait_desc">性别 / 整个品牌全体会员</p>
            <img @click="showPushDialog('性别')" class="dss_portrait_push" title="投放"
                 src="@/dss-common/img/porperties/push.png"/>
          </div>
          <dl class="dss_portrait_sex">
            <dt><img src="@/dss-store/src/images/boy.png"/>男性</dt>
            <dd>{{dataGender.male|rate}}</dd>
            <dt><img src="@/dss-store/src/images/girl.png"/>女性</dt>
            <dd style="color:#F4516C">{{dataGender.female|rate}}</dd>
          </dl>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="30" style="margin-top: 17px;">
      <el-col :span="8">
        <el-card v-loading="loading" style="height:310px">
          <div slot="header">
            <h2 class="dss_portrait_title">收入水平</h2>
            <p class="dss_portrait_desc"></p>
          </div>
          <chart-cross-bar :data="dataIncome.data" v-if="dataIncome.data.length"></chart-cross-bar>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card v-loading="loading" style="height:310px">
          <div slot="header">
            <h2 class="dss_portrait_title">消费水平</h2>
            <p class="dss_portrait_desc"></p>
          </div>
          <chart-cross-bar
            :data="dataConsumption.data"
            :startColor="'rgba(255,111,58,0.5)'"
            :endColor="'rgba(255,111,58,1)'"
            v-if="dataConsumption.data.length"></chart-cross-bar>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card v-loading="loading" style="height:310px">
          <div slot="header">
            <h2 class="dss_portrait_title">学历水平</h2>
            <p class="dss_portrait_desc"></p>
          </div>
          <chart-cross-bar
            :startColor="'rgba(249,183,35,0.5)'"
            :endColor="'rgba(249,183,35,1)'"
            :data="dataEducational.data"
            v-if="dataEducational.data.length"></chart-cross-bar>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card v-loading="loading" class="dss_portrait_mt">
      <div slot="header">
        <h2 class="dss_portrait_title">常驻地域</h2>
        <p class="dss_portrait_desc">常驻地域 / 整个品牌全体会员</p>
      </div>
      <div class="dss_portrait_tab">
        <el-radio-group v-model="areaType">
          <el-radio-button label="城市"></el-radio-button>
          <el-radio-button label="省份"></el-radio-button>
        </el-radio-group>
        <el-row :gutter="30" style="padding:50px 0">
          <el-col :span="16">
            <chart-map height="500px" :data="dataMap.data" :type="areaType" key-name="portraitName"
                       val-name="portraitRate"></chart-map>
          </el-col>
          <!-- <el-col :span="8">
            <chart-trend :data="dataMap.data"></chart-trend>
          </el-col> -->
          <el-col :span="8">
            <chart-rank :data="dataMap.data" :count="dataMap.count" :type="areaType" key-name="portraitName"
                        val-name="portraitCount" rate-name="portraitRate" :show-member="false"></chart-rank>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card v-loading="loading" class="dss_portrait_mt">
      <div slot="header">
        <h2 class="dss_portrait_title">职业分布</h2>
        <p class="dss_portrait_desc">top10职业 / 整个品牌全体会员</p>
        <img @click="showPushDialog('职业')" class="dss_portrait_push" title="投放"
             src="@/dss-common/img/porperties/push.png"/>
      </div>
      <div class="dss_portrait_jobs" v-if="dataJob.data.length">
        <chart-pie v-for="(item,index) in dataJob.data" :key="index" :count="item.portraitRate"
                   :title="item.portraitName"></chart-pie>
      </div>
      <div v-else>
        暂无数据
      </div>
    </el-card>
    <el-row class="dss_portrait_mt" :gutter="30">
      <el-col :span="12">
        <el-card v-loading="loading">
          <div slot="header">
            <h2 class="dss_portrait_title">内容行为</h2>
            <p class="dss_portrait_desc">top10内容行为 / 整个品牌全体会员</p>
            <img @click="showPushDialog('内容行为')" class="dss_portrait_push" title="投放"
                 src="@/dss-common/img/porperties/push.png"/>
          </div>
          <top-chart :data="dataContent.data" key-name="portraitName" val-name="portraitRate" height="380px"
                     color="#3499FE" hide-bg percent v-if="dataContent.data.length"></top-chart>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card v-loading="loading">
          <div slot="header">
            <h2 class="dss_portrait_title">消费行为</h2>
            <p class="dss_portrait_desc">top10消费行为 / 整个品牌全体会员</p>
            <img @click="showPushDialog('消费行为')" class="dss_portrait_push" title="投放"
                 src="@/dss-common/img/porperties/push.png"/>
          </div>
          <top-chart :data="dataGame.data" key-name="portraitName" val-name="portraitRate" height="380px"
                     color="#F9B723" hide-bg percent v-if="dataGame.data.length"></top-chart>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
    </el-row>
    <push-dialog v-model="showPush" :content="dialog.content" :consume="dialog.consume" :job="dialog.job"
                 :age="dialog.age" :default-category-name="pushCategoryName"></push-dialog>
  </div>
</template>

<script>
  import passflowLess from './passflow.less';
  import ChartBar from '@/dss-common/components/ChartBar';
  import ChartPie from '@/dss-common/components/ChartPie';
  import ChartMap from '@/dss-common/components/ChartMap';
  import ChartRank from '@/dss-common/components/ChartRank';
  import ChartTrend from '@/dss-common/components/ChartTrend';
  import TopChart from '@/dss-common/components/GlobalTop';
  import PushDialog from '@/dss-common/components/PushDialog';
  import portraitsApi from '@/dss-common/api/portraits';
  import ChartCrossBar from './ChartCrossBar';

  export default {
    components: {
      ChartBar,
      ChartPie,
      ChartMap,
      ChartRank,
      ChartTrend,
      TopChart,
      PushDialog,
      ChartCrossBar
    },
    data() {
      return {
        api: 'all',
        loading: true,
        showPush: false,
        pushCategoryName: '',
        areaType: '',
        dialog: {
          content: [],
          consume: [],
          job: [],
          age: []
        },
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
          data: []
        },
        dataMarital: {
          unmarried: 0,
          married: 0
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
        dataContent: {
          data: [],
          count: 0
        },
        dataGame: {
          data: [],
          count: 0
        },
        dataEducational: {
          data: []
        },
        dataConsumption: {
          data: []
        },
        dataIncome: {
          data: []
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
      }
    },
    computed: {
      curStore() {
        return this.$store.state.curStore;
      }
    },
    methods: {
      showPushDialog(val) {
        this.showPush = true;
        this.pushCategoryName = val;
      },
      formatter(x, y, max, index) {
        const val = max ? ((y / max) * 100).toFixed(2) + '%' : '0.00%';
        return `<div class="dss_tooltip_t">${val}</div><div class="dss_tooltip_d">${x}</div>`;
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
              break;
            case 'mz_user_marriage':
              item.data.forEach(subItem => {
                if (subItem.portraitName === '已婚') {
                  this.dataMarital.married = subItem.portraitRate;
                } else if (subItem.portraitName === '未婚') {
                  this.dataMarital.unmarried = subItem.portraitRate;
                }
              });
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
            case 'app_read_tag':
              this.dataContent.data = item.data;
              this.dataContent.count = this.getTotal(item.data);
              break;
            case 'user_consumption_pref':
              this.dataGame.data = item.data;
              this.dataGame.count = this.getTotal(item.data);
              break;
            case 'user_educational_status':
              this.dataEducational.data = item.data;
              break;
            case 'user_consumption':
              this.dataConsumption.data = item.data;
              break;
            case 'user_income_jg':
              this.dataIncome.data = item.data;
              break;
          }
        });
      },
      getData() {
        this.loading = true;
        portraitsApi[this.api]().then(
          ({ data }) => {
            this.loading = false;
            //this.setData(data || {})
            this.setData(data || []);
            this.areaType = '城市';
          },
          () => {
            this.loading = false;
          }
        );
      },
      setBodyClass(flag) {
        if (flag) {
          document.body.className += ' dss_portrait_min';
        } else {
          document.body.className = document.body.className.replace(/ dss_portrait_min/g, '');
        }
      }
    },
    mounted() {
      this.getData();
    },
    created() {
      this.setBodyClass(true);
    },
    beforeDestroy() {
      this.setBodyClass(false);
    }
  };
</script>
