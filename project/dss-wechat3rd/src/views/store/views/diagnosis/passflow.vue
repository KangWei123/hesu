<template>
  <div style="overflow-x: hidden;" v-loading="loading.chart">
    <el-card class="overview-card">
      <el-row :gutter="15">
        <el-col :md="24">
          <div class="header">
            <div class="header-title">
              客流诊断指标
            </div>
            <el-radio-group v-model="timeType" class="radio-time">
              <el-radio-button label="日"></el-radio-button>
              <el-radio-button label="周"></el-radio-button>
              <el-radio-button label="月"></el-radio-button>
            </el-radio-group>

          </div>
          <div class="sub-header">
            {{statDate}}
          </div>
        </el-col>
        <el-col :md="13" :sm="24">
          <chart :options="opts.radar" height="506px"></chart>
        </el-col>
        <el-col :md="11" :sm="24">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="index-block">
                <div class="index-title">客流指数
                  <el-popover placement="left" width="200" trigger="hover" content="客流指数：根据历史客流情况利用 AI 技术对每日（周/月）客流情况评价打分">
                    <i class="el-icon-question info-tip" slot="reference"></i>
                  </el-popover>
                </div>
                <div class="index-value value-blue">{{index.passflow.value}}</div>

                  <div class="index-tip">
                    {{index.passflow.tips}}
                  </div>
              </div>

            </el-col>
            <el-col :span="12">
              <div class="index-block">
                <div class="index-title">
                  新客指数
                  <el-popover placement="left" width="200" trigger="hover" content="新客指数：根据历史新客进店情况利用 AI 技术对每日（周/月）新客进店情况评价打分">
                    <i class="el-icon-question info-tip" slot="reference"></i>
                  </el-popover>
                </div>
                <div class="index-value value-red">{{index.newCustomer.value}}</div>

                  <div class="index-tip">
                    {{index.newCustomer.tips}}
                  </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="index-block">
                <div class="index-title">回访指数
                  <el-popover placement="left" width="200" trigger="hover" content="回访指数：根据历史老客回访情况利用 AI 技术对每日（周/月）老客回访情况评价打分">
                    <i class="el-icon-question info-tip" slot="reference"></i>
                  </el-popover>
                </div>
                <div class="index-value value-yellow">{{index.review.value}}</div>

                <div class="index-tip" >
                  {{index.review.tips}}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="index-block">
                <div class="index-title">客户质量指数
                  <el-popover placement="left" width="200" trigger="hover" content="客流质量：根据历史客流画像利用 AI 技术对每日（周/月）客流质量评价打分">
                    <i class="el-icon-question info-tip" slot="reference"></i>
                  </el-popover>
                </div>
                <div class="index-value value-blue">{{index.quality.value}}</div>

                  <div class="index-tip" slot="reference">
                    {{index.quality.tips}}
                  </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <el-row :gutter="15">
      <el-col :md="12" :sm="24">
        <el-card class="chart-card">
          <div slot="header" class="chart-title">
            客流指数趋势
          </div>
          <chart v-if="opts.passflow" :options="opts.passflow"></chart>
          <place-holder :height="400" v-else></place-holder>
        </el-card>
      </el-col>
      <el-col :md="12" :sm="24">
        <el-card class="chart-card">
          <div slot="header" class="chart-title">
            新客指数趋势
          </div>
          <chart v-if="opts.newCustomer" :options="opts.newCustomer"></chart>
          <place-holder :height="400" v-else></place-holder>
        </el-card>
      </el-col>
      <el-col :md="12" :sm="24">
        <el-card class="chart-card">
          <div slot="header" class="chart-title">
            回访指数趋势
          </div>
          <chart v-if="opts.review" :options="opts.review"></chart>
          <place-holder :height="400" v-else></place-holder>
        </el-card>
      </el-col>
      <el-col :md="12" :sm="24">
        <el-card class="chart-card">
          <div slot="header" class="chart-title">
            客户质量指数趋势
          </div>
          <chart v-if="opts.quality" :options="opts.quality"></chart>
          <place-holder :height="400" v-else></place-holder>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import Chart from '@/dss-common/components/ChartEmpty';
  import diagnosisApi from '@/dss-common/api/diagnosis-report';
  import options from './options';
  import utils from '@/dss-common/utils';
  import PlaceHolder from '@/dss-common/components/placeholder/index';

  export default {
    components: {
      Chart,
      PlaceHolder
    },
    data() {
      const config = this.getRadarConfig();

      return {
        opts: {
          radar: options.radar(config),
          review: null,
          passflow: null,
          newCustomer: null,
          quality: null
        },
        index: {
          newCustomer: {
            value: 0,
            tips: ''
          },
          quality: {
            value: 0,
            tips: ''
          },
          review: {
            value: 0,
            tips: ''
          },
          passflow: {
            value: 0,
            tips: ''
          }
        },
        loading: {
          index: false,
          chart: false
        },
        timeType: '日',
        statDate: '',
        height: 400
      }
    },
    computed: {
      ...mapState({
        curStore: state => state.curStore
      }),
      params() {
        if (!this.curStore || !this.curStore.id) {
          return null;
        }
        let type = '';
        switch (this.timeType) {
          case '日': {
            type = 'D';
            break;
          }
          case '周': {
            type = 'W';
            break;
          }
          case '月': {
            type = 'M';
            break;
          }
        }
        return {
          storeId: this.curStore.id,
          indexCodeList: '1, 2, 3, 4',
          indexCode: 3,
          size: 12,
          type: type
        }
      }
    },
    watch: {
      timeType() {
        this.fetchLineData()
        //this.fetchOneDay()
      }
    },
    mounted() {
      this.fetchLineData()
      //this.fetchOneDay()
    },
    methods: {
      fetchLineData() {
        const params = this.getParams();
        if (!params) {
          return;
        }

        this.loading.chart = true;

        this.resetLineChart()
        this.reset()

        diagnosisApi.diagnosis(params).done(res => {
          const values = res.data || [];
          this.setDashboard(values)
          this.setLineChart(values)
        }).always(() => {
          this.loading.chart = false
        });
      },
      setLineChart(data) {
        for (let key = 1; key <= 4; key++) {
          const values = data[key];
          if (!values || !values.length) {
            continue;
          }
          if (key === 1) {
            this.getPassflowConfig(values)
          } else if (key === 2) {
            this.getNewCustomerConfig(values)
          } else if (key === 3) {
            this.getReviewConfig(values)
          } else if (key === 4) {
            this.getQualityConfig(values)
          }
        }
      },
      setDashboard(data) {
        let statDate = null;

        for (let key = 1; key <= 4; key++) {
          const values = data[key];
          if (!values || !values.length) {
            continue;
          }
          const item = values[0];
          let temDate = this.converDate(item.statDate);
          if (temDate) {
            if (!statDate) {
              statDate = temDate
            } else if (statDate < temDate) {
              statDate = temDate
            }
          }
          if (key === 1) {
            this.index.passflow.value = item.indexScore
            this.index.passflow.tips = item.tips
          } else if (key === 2) {
            this.index.newCustomer.value = item.indexScore
            this.index.newCustomer.tips = item.tips
          } else if (key === 3) {
            this.index.review.value = item.indexScore
            this.index.review.tips = item.tips
          } else if (key === 4) {
            this.index.quality.value = item.indexScore
            this.index.quality.tips = item.tips
          }

        }
        if (statDate) {
          this.statDate = utils.timeFormat(statDate, 'YYYY-MM-DD')
        }

        this.opts.radar = options.radar(this.getRadarConfig());
      },
      reset() {
        this.statDate = '';
        const index = this.index;
        index.newCustomer.value = 0
        index.newCustomer.tips = ''

        index.quality.value = 0
        index.quality.tips = ''

        index.review.value = 0
        index.review.tips = ''

        index.passflow.value = 0
        index.passflow.tips = ''

      },
      resetLineChart() {

        this.opts.review = null
        this.opts.passflow = null
        this.opts.newCustomer = null
        this.opts.quality = null
      },
      fetchOneDay() {
        const params = this.getParams(1);
        if (!params) {
          return;
        }
        this.loading.index = true
        params.type = 'D'
        this.reset()
        diagnosisApi.diagnosis(params).done(res => {
          const data = res.data || {};
          let statDate = null;

          for (let key = 1; key <= 4; key++) {
            const values = data[key];
            if (!values || !values.length) {
              continue;
            }
            const item = values[0];
            let temDate = this.converDate(item.statDate);
            if (temDate) {
              if (!statDate) {
                statDate = temDate
              } else if (statDate < temDate) {
                statDate = temDate
              }
            }
            if (key === 1) {
              this.index.passflow.value = item.indexScore
              this.index.passflow.tips = item.tips
            } else if (key === 2) {
              this.index.newCustomer.value = item.indexScore
              this.index.newCustomer.tips = item.tips
            } else if (key === 3) {
              this.index.review.value = item.indexScore
              this.index.review.tips = item.tips
            } else if (key === 4) {
              this.index.quality.value = item.indexScore
              this.index.quality.tips = item.tips
            }

          }
          if (statDate) {
            this.statDate = utils.timeFormat(statDate, 'YYYY-MM-DD')
          }

          this.opts.radar = options.radar(this.getRadarConfig());
        }).always(() => {
          this.loading.index = false
        });
      },
      getParams(size = 10) {
        if (!this.curStore || !this.curStore.id) {
          return null;
        }
        let type = '';
        switch (this.timeType) {
          case '日': {
            type = 'D';
            break;
          }
          case '周': {
            type = 'W';
            break;
          }
          case '月': {
            type = 'M';
            break;
          }
        }
        return {
          storeId: this.curStore.id,
          indexCodeList: '1, 2, 3, 4',
          size: size,
          statDateS: utils.timeFormat(new Date(), 'YYYY-MM-DD'),
          type: type
        }
      },
      converDate(strDate) {
        if (!strDate) {
          return;
        }

        try {
          return new Date(strDate)
        } catch (e) {
          console.log(e)
        }
      },
      getRadarConfig() {
        //const {newCustomer = 0, quality = 0, review = 0, passflow = 0} = this.index;

        const config = {
          indicator: [
            { name: '客流指数', max: 100 },
            { name: '新客指数', max: 100 },
            { name: '回访指数', max: 100 },
            { name: '客户质量', max: 100 },
          ],
          //data: [ passflow.value,newCustomer.value, review.value, quality.value]
        }

        if (this.index) {
          const { newCustomer, quality, review, passflow } = this.index;
          config.data = [passflow.value, newCustomer.value, review.value, quality.value]
        } else {
          config.data = []
        }

        return config;

      },
      getLineConfig(title, data) {
        const config = {
          title: title,
          xAxisData: [],
          data: []
        }
        const tem = data || [];

        for (let i = tem.length - 1; i >= 0; i--) {
          const item = tem[i]
          config.xAxisData.push(item.statDate)
          config.data.push(item.indexScore)
        }
        return config;
      },
      getReviewConfig(data, setOpt = true) {
        const config = this.getLineConfig('回访指数趋势', data)
        if (setOpt) {
          this.opts.review = options.line(config)
        }
        return config;
      },
      getPassflowConfig(data, setOpt = true) {
        const config = this.getLineConfig('客流指数趋势', data)
        if (setOpt) {
          this.opts.passflow = options.line(config)
        }
        return config;
      },
      getNewCustomerConfig(data, setOpt = true) {
        const config = this.getLineConfig('新客指数趋势', data)
        if (setOpt) {
          this.opts.newCustomer = options.line(config)
        }
        return config;
      },
      getQualityConfig(data, setOpt = true) {
        const config = this.getLineConfig('客户质量指数趋势', data)
        if (setOpt) {
          this.opts.quality = options.line(config)
        }
        return config;
      }
    }
  }
</script>

<style>
  .overview-card .el-card__body {
    padding-top: 23px;
  }

  .el-card {
    margin-bottom: 20px;
  }

  .chart-card .el-card__body {
    padding: 0
  }

  .chart-card .echart div:first-child {
    width: 100% !important;
  }

  .header {
    text-align: center;
    position: relative;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(151, 151, 151, 0.20);
  }

  .header-title {
    position: absolute;
    left: 0;
    top: 3px;
    font-family: PingFangSC-Semibold;
    font-size: 18px;
    color: #3B4757;
    letter-spacing: 0;
    font-weight: bold;
  }

  .sub-header {
    margin-top: 18px;
    font-size: 18px;
    color: #3B4757;
    min-height: 24px;
  }

  .radio-time .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 24px 0 0 24px;
  }

  .radio-time .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0 24px 24px 0;
  }

  .radio-time .el-radio-button__inner {
    padding: 8px 20px;
    min-width: 80px;
  }

  .radio-time .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background-color: #3499FE;
  }

  .el-radio-button:focus:not(.is-focus):not(:active) {
    box-shadow: none !important;
  }

  .index-block {
    background: rgba(226, 238, 250, 0.3);
    border-radius: 3px;
    min-height: 243px;
    margin-bottom: 20px;
    text-align: center;
  }

  .index-title {
    font-family: PingFangSC-Semibold;
    font-size: 18px;
    color: #3B4757;
    text-align: left;
    letter-spacing: 0;
    padding: 12px 0 16px 16px;
  }

  .info-tip {
    float: right;
    color: rgba(116, 116, 116, 0.3);
    margin-right: 16px;
  }

  .index-value {
    font-family: HelveticaNeue-CondensedBold;
    font-size: 70px;
    text-align: center;

    letter-spacing: 3.3px;
    line-height: 130px;
  }

  .index-tip {
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #3B4757;
    letter-spacing: 0;
    padding: 0 15px;
    max-width: 200px;
    display: inline-block;
    text-align: justify;
    /*text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;*/
  }

  .value-blue {
    color: #3499FE;
  }

  .value-yellow {
    color: #F9B723;
  }

  .value-red {
    color: #FB6042;
  }

  .chart-title {
    font-family: PingFangSC-Semibold;
    font-size: 18px;
    font-weight: bold;
    color: #3B4757;
    letter-spacing: 0;
  }

  @media screen and (max-width: 850px) {
    .header-title {
      position: inherit;
      margin-bottom: 15px;
    }
  }
</style>
