<template>
  <div v-loading="isLoading">
    <div class="select-store">
      <!-- span class="select-tip">23432</span -->
      <el-cascader :options="areas" v-model="area" separator="-" @change="handleChange" expand-trigger="hover" @active-item-change="handleItemChange" filterable :props="{label:'name', value: 'id', children: 'childNode'}" style="width:100%;">
      </el-cascader>

    </div>
    <el-row :gutter="32">
      <el-col :sm="24" :md="12" :lg="12" :xl="6" v-for="(pie, index) in pieList" :key="index">
        <div class="card">
          <chart :options="pie" height="275px"></chart>
          <place-holder v-if="pie.isEmpty"></place-holder>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :md="12">
        <div class="card">
          <chart :options="ageOption" height="280px"></chart>
          <place-holder v-if="ageOption.isEmpty"></place-holder>
          <!-- span class="card-tip">有效用户占比：88%</span -->
        </div>
      </el-col>
      <el-col :xs="24" :md="12">
        <div class="card">
          <chart :options="marriageOption" height="280px"></chart>
          <place-holder v-if="marriageOption.isEmpty"></place-holder>
          <!-- span class="card-tip">有效用户占比：88%</span -->
        </div>
      </el-col>
      <el-col :span="24">
        <div class="card">
          <chart :options="interestOption" height="320px"></chart>
          <place-holder v-if="interestOption.isEmpty"></place-holder>
          <!-- span class="card-tip">有效用户占比：88%</span -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Chart from '@/dss-common/components/Chart';
import PlaceHolder from '@/dss-common/components/placeholder/index';
import chartOption from './chartOption.js';
import storeApi from '@/dss-common/api/store';
import reportApi from '@/dss-common/api/report';
import { mapState } from 'vuex';
import Vue from 'vue';

const charts = [
  { title: '性别分布', code: 'cpl_indm_gend_s', type: 'pie' },
  { title: '学历分布', code: 'cpl_indm_edu_level', type: 'pie' },
  { title: '职业占比', code: 'som_ocm_career', type: 'pie' },
  // { title: '是否有车', code: '', type: 'pie' },
  // { title: '是否有房', code: '', type: 'pie' },
  { title: '孩子阶段', code: 'cpl_hhm_child_hc', type: 'pie' },
  { title: '婚姻状况', code: 'cpl_indm_marrc2', type: 'horizonbar', key: 'marriageOption' },
  { title: '兴趣偏好', code: 'gbm_hbm_s', type: 'bar', key: 'interestOption' },
  { title: '年龄分布', code: 'cpl_indm_age_c5', type: 'bar', key: 'ageOption' }
];

export default {
  components: {
    Chart,
    PlaceHolder
  },
  data() {
    return {
      area: [],
      pieList: [],
      ageOption: null,
      marriageOption: null,
      interestOption: null,
      areas: [],
      isLoading: false
    };
  },
  computed: {
    ...mapState({
      selectedEp: state => state.selectedEp
    })
  },
  created() {
    this.setOption([]);
    this.fetchAreas();
    this.fetchData();
  },
  methods: {
    fetchData() {
      // epId可从url获取，或门店选择框获取，url优先级比门店选择框高
      let epId = this.$route.query.epId;
      if (!epId && this.selectedEp && this.selectedEp.epId) {
        epId = this.selectedEp.epId;
      }

      if (!epId) {
        return;
      }

      const params = {
        epId: epId
      };
      const area = this.area;
      if (area[0]) {
        params.provId = area[0];
      }
      if (area[1]) {
        params.cityId = area[1];
      }
      if (area[2]) {
        params.districtId = area[2];
      }
      this.isLoading = true;
      reportApi.getDmpAnalysis(params).done(res => {
        this.setOption(res.data || []);
      }).always(() => {
        this.isLoading = false;
      });
    },
    setOption(list) {
      this.pieList = [];
      charts.forEach(chart => {
        const {code, title, key, type} = chart;
        const fidend = list.find(item => item.tagCode === code) || {};
        switch (type) {
          case 'pie': {
            const pieData = this.formatPieData(fidend.data || [], title);
            this.pieList.push(chartOption.getPieOption(pieData));
            break;
          }
          case 'bar': {
            const barData = this.formatBarData(fidend.data || [], title);
            const barOption = chartOption.getBarOption(barData);
            Vue.set(this, key, barOption);
            break;
          }
          case 'horizonbar': {
            const barData = this.formatBarData(fidend.data || [], title, true);
            const barOption = chartOption.getBarOption(barData, true);
            Vue.set(this, key, barOption);
            break;
          }
        }
      });
    },
    formatPieData(data, title) {
      const list = data || [];
      const config = {
        title: title,
        isEmpty: list.length === 0
      };
      config.data = list.map(item => {
        return {
          value: item.count,
          name: item.name
        };
      });
      return config;
    },
    formatBarData(data, title, isHorizon = false) {
      const list = data || [];
      const config = {
        title: title,
        isEmpty: list.length === 0,
        data: []
      };
      const xAxis = [];

      const serieData = list.map(item => {
        xAxis.push(item.name);
        return {
          value: item.tagRate,
          count: item.count,
          name: item.name
        };
      });

      const serie = {
        name: title,
        data: serieData
      };

      config.xAxisData = xAxis;
      config.data.push(serie);

      if (isHorizon) {
        serie.barMaxWidth = 13;
        serie.labelPosition = 'right';
      }

      return config;
    },
    handleItemChange(ids) {
      if (ids && ids.length) {
        this.fetchAreas(ids[ids.length - 1]);
      }
    },
    handleChange() {
      this.fetchData();
    },
    fetchAreas(id) {
      if (id) {
        const node = this.getNodeById(this.areas, id);
        if (!node || node.isloaded) {
          return;
        }
        return storeApi.queryRegion(id).done(({ data }) => {
          node.isloaded = true;
          node.childNode = this.addChildren(data);
        });
      }

      return storeApi.queryRegion().done(({ data }) => {
        this.areas = this.addChildren(data);
      });
    },
    addChildren(nodes) {
      if (!nodes || nodes.length === 0) {
        return null;
      }
      for (const node of nodes) {
        if (!node.isLeaf) {
          node.childNode = [];
        }
      }
      return nodes;
    },
    getNodeById(areas, id) {
      for (const area of areas) {
        if (area.id === id) {
          return area;
        }
        if (area.childNode && area.childNode.length) {
          const findedNode = this.getNodeById(area.childNode, id);
          if (findedNode) {
            return findedNode;
          }
        }
      }
    },
    // 获取路径初始化值
    fetchInitAreas(index, ids) {
      if (index >= ids.length || index >= 2) {
        // 超过数组和3级节点，不加载
        return;
      }

      const promise = this.fetchAreas(ids[index]);
      if (promise) {
        promise.done(() => {
          this.fetchInitAreas(index + 1, ids);
        });
      } else {
        this.fetchInitAreas(index + 1, ids);
      }
    },
    getPath(areaIds) {
      let list = this.areas;
      const path = [];
      for (const areaId of areaIds) {
        const finded = list.find(a => a.id === areaId);
        if (!finded) {
          return path;
        }
        path.push(finded);
        list = finded.childNode;
      }
      return path;
    }
  }
};
</script>

<style lang="less" >
.select-store {
  position: relative;
  width: 100%;
  max-width: 293px;
  margin-bottom: 32px;
  background: white;
  border-radius: 4px;
}

.select-store .el-cascader .el-input,
.el-cascader .el-input__inner {
  background: transparent;
  border-color: rgba(224, 231, 237, 1);
}

.select-tip {
  position: absolute;
  top: 10px;
  right: 30px;
  color: #8ca2b2;
}

.card {
  padding: 24px 0;
  margin-bottom: 32px;
  position: relative;
  box-sizing: border-box;
  background: white;
  border-radius: 8px;
}

.card .placeholder {
  position: absolute;
  top: 50px;
  width: 100%;
}

.card .echart div:first-child {
  width: 100% !important;
}

.card-tip {
  position: absolute;
  top: 26px;
  right: 32px;
  font-size: 12px;
  color: rgba(96, 98, 102, 1);
}
</style>
