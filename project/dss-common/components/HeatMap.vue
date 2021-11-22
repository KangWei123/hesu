<template>
  <div class="dss_chart_heatmap"
       :style="{width:`${width}px`,height:`${height}px`}"
       ref="chart">
    <div id="heatmap"
         :style="{width:`${width}px`,height:`${height}px`}"></div>
  </div>
</template>

<script>
import Heatmap from 'heatmap.js';
export default {
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    type: {
      type: String,
      default: ''
    },
    areaData: {
      type: Array,
      default() {
        return [];
      }
    },
    heatRange: {
      type: Object,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      heatmapInstance: null
    };
  },
  watch: {
    areaData() {
      this.drawChart();
    }
  },
  mounted() {
    // 初始化渲染一次，不能重复渲染画布
    this.initHeatMap();
  },
  methods: {
    initHeatMap() {
      this.heatmapInstance = Heatmap.create({
        container: document.getElementById('heatmap'),
        radius: 50,
        maxOpacity: 0.8,
        minOpacity: 0,
        blur: 0.95,
        scaleRadius: true,
        useLocalExtrema: true,
        gradient: {
          '1': '#FF3030',
          '0.75': '#FFD729',
          '0.5': '#34FF8C',
          '0.25': '#6BB6FF'
        }
      });
    },
    drawChart() {
      const range = this.heatRange;
      let data = {
        min: 0,
        max: range.max,
        data: this.areaData
      };

      this.heatmapInstance.setData(data);
    }
  }
};
</script>

<style>
</style>
