<template>
  <div class="dss_portrait">
    <el-row :gutter="11">
      <el-col :span="24" class="report-sub-title">
        客流画像
      </el-col>
      <el-col :span="8" class="el-col-card">
        <el-card v-loading="loading.portrait" style="height:375px;">
          <div slot="header">
            <h2 class="dss_portrait_title">性别占比</h2>
          </div>
          <el-row class="dss_portrait_sex">
            <el-col :span="12" style="text-align:center">
              <img src="../../../asserts/images/boy.png" style="height:90px;margin-left: -10px" />
              <div class="item-num primary-color">
                {{dataGender.male}}
                <span class="rate-symbole">%</span>
              </div>
              <div>男性</div>
            </el-col>
            <el-col :span="12" style="text-align:center">
              <img src="../../../asserts/images/girl.png" style="height:90px;margin-left: -10px" />
              <div class="item-num danger-color">
                {{dataGender.female}}
                <span class="rate-symbole">%</span>
              </div>
              <div>女性</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8" class="el-col-card">
        <el-card v-loading="loading.portrait" style="height:375px">
          <div slot="header">
            <h2 class="dss_portrait_title">年龄占比</h2>
          </div>
          <chart :options="dataAge.options" height="264px" v-if="dataAge.data.length"></chart>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="el-col-card">
        <el-card v-loading="loading.portrait" style="height:375px">
          <div slot="header">
            <h2 class="dss_portrait_title">学历水平</h2>
            <div class="portrait-legend" v-if="dataEducational.data.length">
            </div>
          </div>
          <chart-cross-bar :has-avg="true" :scale="1" :data="dataEducational.data" height="264px" v-if="dataEducational.data.length"></chart-cross-bar>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="el-col-card">
        <el-card v-loading="loading.portrait" style="height:375px">
          <div slot="header">
            <h2 class="dss_portrait_title">婚恋人群占比</h2>
          </div>

          <el-row>
            <el-col :span="24">
              <chart :svg="true" :options="dataMarital.options" height="168px"></chart>
            </el-col>
            <el-col :span="24">
              <div class="dss_portrait_people" style="text-align:center">
                <div class="people-item" style="margin-right:12px;">
                  <div class="item-num primary-color">
                    {{dataMarital.married}}
                    <span class="rate-symbole">%</span>
                  </div>
                  <div>婚恋人士</div>
                  <span class="item-point " style="background: #487CED"></span>
                </div>
                <div class="people-item" style="margin-left:12px">
                  <div class="item-num danger-color">
                    {{dataMarital.unmarried}}
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
      <el-col :span="8" class="el-col-card">
        <el-card v-loading="loading.portrait" class="dss_portrait_mt" style="height:375px">
          <div slot="header">
            <h2 class="dss_portrait_title">职业分布</h2>
          </div>
          <chart height="264px" :options="dataJob.options" v-if="dataJob.data.length"></chart>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card v-loading="loading.portrait" style="height:375px">
          <div slot="header">
            <h2 class="dss_portrait_title">消费水平</h2>
          </div>
          <chart-cross-bar height="267px" :scale="1" :data="dataConsumption.data" v-if="dataConsumption.data.length"></chart-cross-bar>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="el-col-card">
        <el-card v-loading="loading.portrait" style="height:549px">
          <div slot="header">
            <h2 class="dss_portrait_title">品类偏好</h2>
          </div>
          <chart-cross-bar :max-rate="1" :scale="1" :data="dataPreference.data" height="438px" color="#3499FE" v-if="dataPreference.data.length"></chart-cross-bar>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="el-col-card">
        <el-card v-loading="loading.portrait" style="height:549px">
          <div slot="header">
            <h2 class="dss_portrait_title">应用偏好</h2>
          </div>
          <chart-cross-bar :max-rate="1" :scale="1" :data="dataApplication.data" height="438px" color="#3499FE" v-if="dataApplication.data.length"></chart-cross-bar>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="report-sub-title">
        客流趋势
      </el-col>

      <el-col :span="24" class="el-col-card">
        <el-card v-loading="loading.global">
          <el-row>
            <el-col :span="8" class="passflow-content ">
              <div class="title">新客流量</div>
              <div class="value">{{newCustomer.value}}</div>
              <div class="rate">环比&nbsp;&nbsp;
                <span>{{newCustomer.rate}}</span>
                <span :class="newCustomer.cssClass"></span>
              </div>
            </el-col>
            <el-col :span="8" class="passflow-content ">
              <div class="title">老客流量</div>
              <div class="value">{{oldCustomer.value}}</div>
              <div class="rate">环比&nbsp;&nbsp;
                <span>{{oldCustomer.rate}}</span>
                <span :class="oldCustomer.cssClass"></span>
              </div>
            </el-col>
            <el-col :span="8" class="passflow-content ">
              <div class="title">总客流量</div>
              <div class="value">{{customer.value}}</div>
              <div class="rate">环比&nbsp;&nbsp;
                <span>{{customer.rate}}</span>
                <span :class="customer.cssClass"></span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :span="24" class="el-col-card" v-for="field in fieldPassflow" :key="field.key">
        <el-card v-loading="loading.passflow"  style="height:549px">
          <div slot="header">
            <h2 class="dss_portrait_title">{{field.key}}客流趋势</h2>
          </div>
          <chart :options="field.options" height="438px" v-if="field.data.length"></chart>
          <div v-else>
            暂无数据
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import '../../portrait/passflow.less';
import Chart from '@/dss-common/components/Chart';
import ChartCrossBar from '../../portrait/ChartCrossBar';
import convert from '../../portrait/convert';

const portraitKey = {
  sex: { key: 'dataGender' },
  user_age: { key: 'dataAge', method: 'ageToBar' },
  user_educational_status: { key: 'dataEducational' },
  mz_user_marriage: { key: 'dataMarital' },
  user_job: { key: 'dataJob', method: 'jobToPie' },
  user_consumption: { key: 'dataConsumption' },
  user_application_preference: { key: 'dataApplication' },
  user_category_preference: { key: 'dataPreference' }
};

export default {
  components: {
    Chart,
    ChartCrossBar
  },
  props: {
    loading: {
      type: Object,
      default() {
        return {
          portrait: false,
          passflow: false,
          global: false
        };
      }
    },
    portraitData: {
      type: Array,
      default() {
        return [];
      }
    },
    passflowData: {
      type: Array,
      default() {
        return [];
      }
    },
    globalPassflowData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      // 客流画像
      dataAge: {
        data: [],
        options: null
      },
      dataGender: {
        male: 0,
        female: 0
      },
      dataEducational: {
        data: []
      },
      dataMarital: {
        unmarried: 0,
        married: 0,
        options: convert.marriToPie(0, 0, ['60%', '85%'])
      },
      dataJob: {
        data: [],
        options: null
      },
      dataConsumption: {
        data: []
      },
      dataApplication: {
        data: []
      },
      dataPreference: {
        data: []
      },
      // 客流趋势
      newCustomer: {
        rate: 0,
        value: 0,
        cssClass: ''
      },
      oldCustomer: {
        rate: 0,
        value: 0,
        cssClass: ''
      },
      customer: {
        rate: 0,
        value: 0,
        cssClass: ''
      },
      fieldPassflow: [{
        key: '文旅',
        data: [],
        options: null,
        color: 'blue'
      }, {
        key: '地产',
        data: [],
        options: null,
        color: 'red'
      }]
    };
  },
  watch: {
    portraitData(val) {
      this.setPortraitData(val || []);
    },
    globalPassflowData(val) {
      this.setGlobalPassflowData();
    },
    passflowData(val) {
      this.setPassflowData();
    }
  },
  created() {
    this.setPortraitData(this.portraitData);
    this.setGlobalPassflowData();
    this.setPassflowData();
  },
  methods: {
    rate(value, decimal = 1) {
      return (value * 100).toFixed(decimal);
    },
    setPortraitData() {
      this.reInitPortrait(portraitKey);
      this.portraitData.forEach(item => {
        const key = item.tag;
        const value = portraitKey[key];
        if (!value) {
          return;
        }

        switch (value.key) {
          // 性别处理
          case 'dataGender': {
            item.data.forEach(subItem => {
              if (subItem.portraitName === '男' || subItem.portraitName === 'male') {
                this.dataGender.male = subItem.portraitRate;
              } else if (subItem.portraitName === '女' || subItem.portraitName === 'female') {
                this.dataGender.female = subItem.portraitRate;
              }
            });
            return;
          }
          // 婚恋处理
          case 'dataMarital': {
            item.data.forEach(subItem => {
              if (subItem.portraitName === '已婚') {
                this.dataMarital.married = subItem.portraitRate;
              } else if (subItem.portraitName === '未婚') {
                this.dataMarital.unmarried = subItem.portraitRate;
              }
            });
            const {married, unmarried} = this.dataMarital;
            this.dataMarital.options = convert.marriToPie(married, unmarried, ['60%', '85%']);
            return;
          }
        }
        const newData = {
          data: item.data || []
        };
        if (value.method) {
          newData.options = convert[value.method](newData.data, 1);
        }
        this.$set(this, value.key, newData);
      });
    },
    reInitPortrait(keys) {
      for (const key in keys) {
        const value = keys[key];

        switch (value.key) {
          case 'dataGender': {
            this.dataGender.male = 0;
            this.dataGender.female = 0;
            continue;
          }
          case 'dataMarital': {
            this.dataMarital.married = 0;
            this.dataMarital.unmarried = 0;
            this.dataMarital.options = convert.marriToPie(0, 0, ['60%', '85%']);
            continue;
          }
        }
        const newData = {
          data: []
        };
        if (value.method) {
          newData.options = null;
        }
        console.log(value.key)
        this.$set(this, value.key, newData);
      }
    },
    setGlobalPassflowData() {
      this.reInitGlobalPassflow();
      this.globalPassflowData.forEach(c => {
        let symbol = '';
        let cssClass = '';
        if (c.dayOnDay !== 0) {
          if (c.dayOnDay > 0) {
            symbol = '+';
            cssClass = 'rete-up';
          } else {
            cssClass = 'rate-down';
          }
        }
        const data = {
          cssClass: cssClass,
          rate: symbol + c.dayOnDay + '%',
          value: c.value
        };
        this.$set(this, c.name, data);
      });
    },
    reInitGlobalPassflow() {
      this.newCustomer.reat = 0;
      this.newCustomer.value = 0;
      this.newCustomer.cssClass = '';

      this.oldCustomer.reat = 0;
      this.oldCustomer.value = 0;
      this.oldCustomer.cssClass = '';

      this.customer.reat = 0;
      this.customer.value = 0;
      this.customer.cssClass = '';
    },
    setPassflowData() {
      this.fieldPassflow.forEach(f => {
        f.data = [];
        f.options = null;
      });

      this.passflowData.forEach(item => {
        // item.filed
        const field = this.fieldPassflow.find(f => f.key === item.filed);
        if (!field) {
          return;
        }
        field.data = item.passengerFlowVOList;
        field.options = convert.passflowToLine(item.passengerFlowVOList, `${field.key}客流趋势`, field.color);
      });
    }
  }
};
</script>

<style lang="less">
.dss_portrait {
  .el-card {
    background: #fff;
    margin-bottom: 0px;
  }

  .el-col {
    margin-bottom: 10px;
  }
}
.passflow-content {
  text-align: center;
  color: #2c3641;

  .title {
    font-size: 14px;
    font-weight: 400;
    color: #566980;
    margin-bottom: 6px;
  }

  .value {
    font-size: 26px;
    font-weight: bold;
    color: #2c3641;
    margin-bottom: 24px;
  }

  .rate {
    color: #858c99;
    font-size: 14px;

    span {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .rete-up,
  .rate-down {
    width: 14px;
    height: 16px;
    display: inline-block;
  }

  .rete-up {
    background: url('../../../../../dss-common/img/icons/increase.png') no-repeat center / cover;
  }

  .rate-down {
    background: url('../../../../../dss-common/img/icons/reduce.png') no-repeat center / cover;
  }
}

.rate-symbole {
  font-size: 16px;
}

.report-sub-title {
  font-size: 18px;
  font-family: 'Microsoft YaHei', Arial;
  font-weight: 600;
  margin-bottom: 14px;
  margin-top: 20px;
}
</style>
