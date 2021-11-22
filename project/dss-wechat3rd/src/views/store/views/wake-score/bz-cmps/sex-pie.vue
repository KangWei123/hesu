<template>
  <div class="pie-chart">
    <!-- 卡片边框 -->
    <card-border />

    <!-- 标题 -->
    <div class="title">性别占比：</div>

    <!-- 详细信息 -->
    <div class="male">
      <img src="../../../asserts/images/face-score/male.png" />
      <span class="persons">{{data[1]| percent(max)}}</span>
    </div>

    <div class="chart-box">
      <chart :options='options'></chart>
    </div>

    <div class="female">
      <img src="../../../asserts/images/face-score/female.png" />
      <span class="persons">{{data[0]| percent(max)}}</span>
    </div>

    <!-- 连接线 -->
    <div class="line-box">
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script>
import Chart from '@/dss-common/components/Chart.vue';
import options from './options.js';
import cardBorder from './card-border.vue';
export default {
  components: { cardBorder, Chart },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      options: options.getPie(this.list, this.title),
      max: 1
    };
  },
  computed: {
    list() {
      let data = [];
      if (this.data[0] == null) {
        data[0] = 0;
      }
      for (let key in this.data) {
        let name = this.getSexName(key);
        data.push({ name: name, value: this.data[key] });
      }
      return data;
    }
  },
  watch: {
    data(val) {
      this.max = this.data[0] + this.data[1];
      this.options = this.options = options.getPie(this.list);
    }
  },

  methods: {
    getSexName(val) {
      let name = val;
      switch (val) {
        case '0':
          name = '女';
          break;
        case '1':
          name = '男';
          break;
      }
      return name;
    }
  }
};
</script>

<style scoped lang="less">
.pie-chart {
  width: 100%;
  height: 100%;
  background-image: url('../../../asserts/images/face-score/sex-bg.png');
  position: relative;
  .title {
    position: absolute;
    top: 15px;
    left: 31px;
    font-size: 18px;
    font-weight: 400;
    color: rgba(124, 250, 255, 1);
    line-height: 25px;
  }
  .chart-box {
    display: inline-block;
    width: 158px;
    height: 158px;
    position: absolute;
    top: 23px;
    left: 182px;
  }
  .male {
    img {
      position: absolute;
      top: 82px;
      left: 31px;
      width: 38px;
      height: 40px;
    }
    span {
      position: absolute;
      top: 89px;
      left: 92px;
      font-size: 18px;
      font-family: 'DIN-Medium';
      color: rgba(255, 255, 255, 1);
    }
  }
  .female {
    img {
      position: absolute;
      top: 82px;
      left: 382px;
      width: 38px;
      height: 40px;
    }
    span {
      position: absolute;
      top: 89px;
      left: 443px;
      font-size: 18px;
      font-family: 'DIN-Medium';
      color: rgba(255, 255, 255, 1);
    }
  }
  .line-box {
    right: -50px;
    top: 80px;
  }
}
</style>
