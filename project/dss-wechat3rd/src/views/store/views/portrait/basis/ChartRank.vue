<template>
  <div class="dss_chart_rank" :class="phoneModelRank?'phone-model-rank':''" :style="{height:`${height}`}">
    <table>
      <tr v-for="(item,index) in data.slice(0, 10)" :key="index">
        <td><span :class="getCssClass(index)">{{index+1}}</span></td>
        <td>{{item[keyName]}}</td>
        <td v-if="showMember">{{Number(item[valName]).toLocaleString()}}</td>
        <td>{{item[rateName]|rate}}</td>
      </tr>
    </table>
    <template v-if="!data.length">
      <span class="dss_chart_rank-tips">暂无数据</span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: 'auto'
    },
    type: {
      type: String,
      default: '城市'
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    count: {
      type: Number,
      default: 0
    },
    keyName: {
      type: String,
      default: 'fName'
    },
    valName: {
      type: String,
      default: 'fUserCount'
    },
    rateName: {
      type: String,
      default: 'fRate'
    },
    memberTitle: {
      type: String,
      default: '客户数量'
    },
    // 是否展示客户数量
    showMember: {
      type: Boolean,
      default: true
    },
    phoneModelRank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getCssClass(index) {
      switch (index) {
        case 0: {
          return 'order-num primary-bg';
        }
        case 1: {
          return 'order-num warning-bg';
        }
        case 2: {
          return 'order-num danger-bg';
        }
      }
      return '';
    }
  }
};
</script>
<style scoped>
.dss_chart_rank {
  text-align: center;
}

.dss_chart_rank-tips{
  position: absolute;
  top: 0;
  left: 15px;
}

.dss_chart_rank table {
  width: 100%;
}
.dss_chart_rank th:nth-child(2)
.dss_chart_rank td:nth-child(2) {
  text-align: left
}
.dss_chart_rank th,
.dss_chart_rank td {
  color: #566980;
  height: 40px;
}

.order-num {
  display: inline-block;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  color: white;
}

.primary-bg {
  background: #4379ED;
}

.warning-bg {
  background: #FF7F56;
}

.danger-bg {
  background: #FF5B56;
}
.phone-model-rank .danger-bg {
  background: #FFDE74;
}
</style>
