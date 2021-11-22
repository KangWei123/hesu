<template>
  <div>
    <el-tabs v-model="activeName" class="store-tab" @tab-click="onTabClick">
      <el-tab-pane v-for="tab in tabs" :label="tab.label" :key="tab.name" :name="tab.name">
        <portrait-charts :param-type="tab.name" v-if="tab.show"></portrait-charts>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PortraitCharts from './PortraitCharts';
import event from '@/dss-common/utils/event';
// 0 全部（进店） 1 新客   2 老客
export default {
  components: {
    PortraitCharts
  },
  data() {
    return {
      activeName: '0',
      tabs: [
        {
          label: '进店客流',
          show: true,
          name: '0'
        },
        {
          label: '新客户',
          show: false,
          name: '1'
        },
        {
          label: '老客户',
          show: false,
          name: '2'
        }
      ]
    };
  },
  methods: {
    onTabClick(e) {
      const tabConfig = this.tabs.find(tab => tab.name === this.activeName);
      tabConfig.show = true;
      setTimeout(() => {
        event.trigger('resize');
      }, 100);
    }
  }
};
</script>

<style>
</style>
