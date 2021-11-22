<template>
  <div class="analysis-box channel-new-client">
    <div class="analysis-title">{{ typeEnum[rankType].title }}</div>
    <div v-loading="loading">
      <div class="bar-action-box">
        <span
          class="bar-action"
          :class="activeDateRange === 'YESTERDAY' ? 'bar-action-active' : ''"
          @click="activeDateRange = 'YESTERDAY'"
          >昨日</span
        >
        <span
          class="bar-action"
          :class="activeDateRange === 'LASTWEEK' ? 'bar-action-active' : ''"
          @click="activeDateRange = 'LASTWEEK'"
          >上周</span
        >
      </div>
      <chart
        :options="chartOptions[activeDateRange]"
        height="340px"
        v-if="list[activeDateRange] && list[activeDateRange].length"
      />
      <place-holder :height="340" v-else />
      <div style="color: #999; font-size: 12px; padding-top: 10px">更新时间：{{ updateTime | time }}</div>
    </div>
  </div>
</template>

<script>
  import Chart from '@/dss-common/components/ChartEmpty';
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import utils from '@/dss-common/utils/index.js';
  import { bar } from '@/dss-common/assembler/index.js';
  import api from '@/mod-member/src/api/manage.js';
  import { mapState } from 'vuex';

  const typeEnum = {
    SOURCE: { title: '来源新增客户排行-Top10', value: 1 },
    STORE: { title: '门店新增客户排行-Top10', value: 2 },
    EMPLOYEE: { title: '导购新增客户排行-Top10', value: 3 },
  };

  export default {
    name: 'NewClientRank',
    components: {
      Chart,
      PlaceHolder,
    },
    props: {
      currentStore: null,
      rankType: {
        type: String,
        default: 'SOURCE',
      },
    },
    data() {
      return {
        typeEnum,
        activeDateRange: 'YESTERDAY',
        loading: false,
        updateTime: null,
        dateRange: {
          YESTERDAY: null,
          LASTWEEK: null,
        },
        list: {
          YESTERDAY: [],
          LASTWEEK: [],
        },
        chartOptions: {
          YESTERDAY: null,
          LASTWEEK: null,
        },
      };
    },
    watch: {
      currentStore() {
        this.getData(true);
      },
      activeDateRange(val) {
        this.getData();
      },
    },
    mounted() {
      this.formatTime();
      this.getData(true);
    },
    methods: {
      getData(init) {
        if (!init && this.list[this.activeDateRange].length) return;
        this.loading = true;
        api
          .getNewClientRank(
            {
              storeId: this.currentStore,
              orderField: this.rankType,
              startDate: this.dateRange[this.activeDateRange].startDate,
              endDate: this.dateRange[this.activeDateRange].endDate,
            },
            `获取${this.typeEnum[this.rankType].title}`
          )
          .then(res => {
            this.updateTime = (res.data || [])[0].lastStatTime;
            this.list[this.activeDateRange] = (res.data || []).map(item => {
              return {
                itemName: item.orderFieldValue || '--',
                itemValue: item.newClientCount,
              };
            });
            this.getOption();
          })
          .always(() => {
            this.loading = false;
          });
      },
      getOption() {
        if (this.list[this.activeDateRange] && this.list[this.activeDateRange].length) {
          const opts = bar.assembleBarYOptions(
            this.list[this.activeDateRange],
            'itemName',
            'itemValue',
            'level',
            0,
            true
          );
          opts.color = ['#40C6F5'];
          const _this = this;
          opts.series.forEach((series, index) => {
            if (series.name === 'shadow') {
              series.data = null;
            }
            series.barMaxWidth = '10px';
            series.label = {
              normal: {
                color: '#A8A8A8',
                fontSize: 12,
                position: 'right',
                show: true,
              },
            };
          });
          (opts.yAxis[0].axisLabel.formatter = function (value, index) {
            const sortIndex = 0;
            if (value.length > 13) {
              value = value.substring(0, 13) + '...';
            }
            if (value === '') {
              return `   ${value}`;
            }
            if (index + sortIndex + 1 < 4) {
              return `{a|${index + sortIndex + 1}}   ${value}`;
            } else {
              return `{b|${index + sortIndex + 1}}   ${value}`;
            }
          }),
            (opts.yAxis[0].axisLabel.rich = {
              a: {
                align: 'center',
                fontSize: 10,
              },
              b: {
                align: 'center',
                fontSize: 10,
              },
            });
          opts.tooltip = {
            show: true,
            trigger: 'item',
            position(point, params, dom, rect, size) {
              return {
                top: point[1] - size.contentSize[1] + 'px',
                left: point[0] - Math.ceil(size.contentSize[0] / 2) + 'px',
              };
            },
            backgroundColor: 'transparent',
            formatter: (params, ticket, callback) => {
              let resName = '';
              if (params.name.length > 13) {
                const text = params.name;
                const length = text.length / 2;
                resName = _this.changString(text, length);
              } else {
                resName = params.name;
              }
              return `
            <div style="position: relative;text-align: center;padding:23px;background: #000;opacity:0.78;boder-radius: 4px" id="toolTipBox">
              <p style="font-size: 12px;margin-bottom:23px;color:#fff">${resName}</p>
              <p style="font-size: 12px;margin:0px;color:#fff">新增客户数：
                <span style="color: #40C6F5;display:inline-block;margin-left:10px">${params.value}</span>
              </p>
              <p style="position: absolute; bottom: -5px;padding:0;width:0;height:0;left:0;right:0;margin:auto;opacity:0.78;border: 5px solid #000;transform: rotate(45deg)"></p>
            </div>
          `;
            },
          };
          this.chartOptions[this.activeDateRange] = opts;
          console.log(this.chartOptions);
        }
      },
      changString(str, len) {
        function lenStat(str) {
          function isChinese(str) {
            // 判断是不是中文
            const reCh = /[u00-uff]/;
            return !reCh.test(str);
          }
          let strlen = 0; // 初始定义长度为0
          const text = str.trim();
          for (let i = 0; i < text.length; i++) {
            if (isChinese(text.charAt(i)) == true) {
              strlen = strlen + 1; // 中文为2个字符
            } else {
              strlen = strlen + 1; // 英文一个字符
            }
          }
          return strlen;
        }
        const strlen = lenStat(str);
        let strs = '';
        for (let i = 0; i < strlen; i = i + len) {
          strs += str.substring(i, i + len) + '<br>';
        }
        return strs;
      },
      formatTime() {
        const today = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const yesterday = today - oneDay;
        const week = new Date().getDay() || 7;
        const lastMon = today - oneDay * (week - 1 + 7);
        const lastSun = today - oneDay * week;
        this.dateRange.YESTERDAY = {
          startDate: utils.timeFormat(yesterday, 'YYYY-MM-DD'),
          endDate: utils.timeFormat(yesterday, 'YYYY-MM-DD'),
        };
        this.dateRange.LASTWEEK = {
          startDate: utils.timeFormat(lastMon, 'YYYY-MM-DD'),
          endDate: utils.timeFormat(lastSun, 'YYYY-MM-DD'),
        };
      },
    },
  };
</script>
<style lang="less" scoped>
  .sort-ranking-box {
    width: 100%;
    height: 380px;
    margin: 20px 0;
    background-color: #fff;
  }
</style>
