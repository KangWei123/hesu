<template>
  <div class="dss_chart_rank" :style="{height:`${height}`}">
    <table>
      <tr>
        <th></th>
        <th>城市</th>
        <th v-if="showMember">{{memberTitle}}</th>
        <th>{{type}}占比</th>
      </tr>
      <tr v-for="(item,index) in data.slice(0, 10)" :key="index">
        <td>{{index+1}}.</td>
        <td>{{item[keyName]}}</td>
        <td v-if="showMember">{{Number(item[valName]).toLocaleString()}}</td>
        <td>{{item[rateName]|rate}}</td>
      </tr>
      <tr v-if="!data.length">
        <td colspan="4">暂无数据</td>
      </tr>
    </table>
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
      default () {
        return []
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
    //是否展示客户数量
    showMember: {
      type: Boolean,
      default: true,
    }
  }
}
</script>
<style>
.dss_chart_rank {
  position: relative
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
  color: #3B4757;
  height: 40px;
}
</style>
