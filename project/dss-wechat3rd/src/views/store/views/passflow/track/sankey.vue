<template>
  <div class="track-chart">
    <chart :options="options"
           class="chart">
    </chart>
  </div>
</template>

<script>
import Chart from '@/dss-common/components/Chart.vue';
import options from './options.js';

export default {
  components: { Chart },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    areaName: {
      type: String,
      return: ''
    }
  },
  data() {
    return {
      options: null
    };
  },
  watch: {
    data(newVal) {
      if (this.data) {
        this.init();
      }
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      let track = this.getData(this.data);
      this.options = options.getTrack(track.data, track.links);
    },

    getData(data) {
      //桑基图理论上只支持有向无环图，所以逆向的name加空格
      data.forEach(item => {
        if (item.source !== this.areaName) {
          item.source = item.source + ' ';
        }
      });

      let list = [];
      //动线图路径
      let links = data.map(item => {
        item = {
          source: item.source,
          target: item.destination,
          value: item.value
        };
        return item;
      });

      //获取动线图所有路径
      data.forEach(item => {
        if (list.indexOf(item.source) < 0) {
          list.push(item.source);
        }
        if (list.indexOf(item.destination) < 0) {
          list.push(item.destination);
        }
      });

      list = list.map(item => {
        item = {
          name: item,
          value: 0
        };
        return item;
      });
      //计算每个区域的人数
      list.forEach(item => {
        if (item.name.indexOf(' ') < 0) {
          links.forEach(lk => {
            if (lk.target === item.name) {
              item.value += lk.value;
            }
          });
        } else {
          links.forEach(lk => {
            if (lk.source === item.name) {
              item.value += lk.value;
            }
          });
        }
      });

      let track = {
        data: list,
        links: links
      };

      return track;
    },
    getOptions() {
      this.options = options.getTrack(this.list, this.links);
    }
  }
};
</script>

<style scoped lang="less">
.track-chart {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 1);
  border-radius: 4px;

  .chart {
    margin-top: -40px;
    padding-top: 40px;
    box-sizing: border-box;
  }
}
</style>
