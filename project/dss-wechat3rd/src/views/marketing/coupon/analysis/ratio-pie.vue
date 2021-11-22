<template>
  <div class="ratio-pie-container">
    <el-card class="coupon-card">
      <div slot="header">
        <h3 class="card-title">人群占比</h3>
      </div>
      <div class="cart-content">
        <chart :options="chartOptions"
               height="100%"></chart>
      </div>
    </el-card>
  </div>

</template>

<script>
import Chart from '@/dss-common/components/Chart';
import CouponApi from '@/dss-wechat3rd/src/api/couponApi.js';
export default {
  components: {
    Chart
  },
  props: {
    couponId: {
      type: Number,
      default: ''
    },
    type: {
      type: Number,
      default: 0
    },
    dateRange: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return { chartOptions: null, loading: false };
  },
  watch: {
    type: {
      deep: true,
      handler() {
        this.geRatioPie();
      }
    },
    dateRange: {
      deep: true,
      handler() {
        this.geRatioPie();
      }
    }
  },
  mounted() {},
  methods: {
    geRatioPie() {
      this.loading = true;
      let queryParams = {
        type: this.type,
        couponInfoId: this.couponId,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1]
      };
      CouponApi.queryPeopleRatioPie(queryParams)
        .then(rs => {
          let pieData = [];
          const list = rs.data ? rs.data.percent || [] : [];
          for (let item in list) {
            let pie = {
              name: item,
              value: list[item]
            };
            if (pieData.length < 8) {
              pieData.push(pie);
            }
          }
          this.chartOptions = this.getCustomerPie(pieData);
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.loading = false;
        });
    },
    /**
     *
     * @param {Object} data {name 名称, value 数值}
     * @returns
     */
    getCustomerPie(data) {
      const colors = [
        {
          textColor: '#000',
          itemColor: '#32FFEA'
        },
        {
          textColor: '#000',
          itemColor: '#697EFF'
        },
        {
          textColor: '#000',
          itemColor: '#32A7FF'
        },
        {
          textColor: '#000',
          itemColor: '#324EFF'
        },
        {
          textColor: '#000',
          itemColor: '#FF5732'
        },
        {
          textColor: '#000',
          itemColor: '#FF327A'
        },
        {
          textColor: '#000',
          itemColor: '#02C43C'
        },
        {
          textColor: '#000',
          itemColor: '#34D3F4'
        }
      ];

      const seriesData = [];

      data.forEach((item, index) => {
        const color = colors[index % colors.length];
        seriesData.push({
          name: item.name,
          value: item.value,
          itemStyle: {
            normal: { color: color.itemColor }
          },
          label: {
            formatter: '{b} ({d}%)',
            position: 'center',
            padding: [20, -30],
            show: true,
            position: 'outside',
            textStyle: {
              fontSize: '12',
              fontWeight: 'normal',
              color: color.textColor,
              fontFamily: 'PingFangSC-Regular'
            },
            rich: {
              value: {
                fontSize: 24,
                fontFamily: 'din',
                color: color.textColor
              },
              percent: {
                fontSize: 16,
                color: color.textColor,
                fontFamily: 'din',
                verticalAlign: 'bottom'
              }
            }
          }
        });
      });

      const options = {
        title: {
          show: false
        },
        series: [
          {
            type: 'pie',
            center: ['51%', '50%'],
            radius: ['45%', '60%'],
            clockwise: true,
            hoverAnimation: false,
            labelLine: {
              show: false,
              lineStyle: {
                color: '#34D3F4'
              }
            },
            data: seriesData
          }
        ]
      };
      return options;
    }
  }
};
</script>

<style lang="less">
.ratio-pie-container {
  padding: 10px 20px 10px 10px;
}
</style>
