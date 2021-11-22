<template>
  <div style="position: relative">
    <day-week-report-item class="day-week-report"
                          @day="onGoTo('day')"
                          v-if="activeName === 'probe-passflow' || activeName === 'probe-customer'"
                          @week="onGoTo('week')" />
    <el-tabs v-model="activeName"
             class="store-tab"
             @tab-click="handleClick">

      <el-tab-pane label="AP客流量"
                   name="probe-passflow"
                   :disabled='!DeviceExist'>
        <el-popover placement="bottom"
                    slot="label"
                    v-if="!DeviceExist"
                    width="200"
                    trigger="hover"
                    content='需安装AP设备'>
          <span slot="reference">AP客流量</span>
        </el-popover>
        <overview v-if="activeName === 'probe-passflow'"></overview>

      </el-tab-pane>

      <el-tab-pane label="AP客户量"
                   name="probe-customer"
                   :disabled='!DeviceExist'>
        <el-popover placement="bottom"
                    slot="label"
                    v-if="!DeviceExist"
                    width="200"
                    trigger="hover"
                    content='需安装AP设备'>
          <span slot="reference">AP客户量</span>
        </el-popover>
        <overview v-if="activeName === 'probe-customer'"
                  type="客户"></overview>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Overview from './overview';
import CameraFlow from './camera-flow/camera-flow.vue';
import DayWeekReportItem from '../../components/statistics/DayWeekReportItem';
import storeApi from '@/dss-common/api/store';
import { mapState } from 'vuex';
export default {
  components: {
    Overview,
    CameraFlow,
    DayWeekReportItem
  },
  data() {
    return {
      activeName: 'probe-passflow',
      DeviceExist: true,
      CAMERA: true
    };
  },
  computed: {
    ...mapState({
      curStore: state => state.curStore
    })
  },
  watch: {},
  mounted() {
    this.queryDeviceExist();
  },
  methods: {
    //判断是否有设备
    queryDeviceExist() {
      storeApi
        .queryDeviceExist({})
        .then(rs => {
          if (rs.data) {
            this.CAMERA = rs.data.indexOf('CAMERA') >= 0;
            this.DeviceExist = rs.data.indexOf('AP') >= 0;
          } else {
            this.CAMERA = false;
            this.DeviceExist = false;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    onGoTo(type) {
      this.$router.push({
        path: '/passflow/overview/report',
        query: { type: type }
      });
    },
    handleClick() {
      if (typeof Event === 'function') {
        const evt = new Event('resize');
        if (window.dispatchEvent) {
          window.dispatchEvent(evt);
        } else {
          window.fireEvent(evt);
        }
      } else {
        let resizeEvent = window.document.createEvent('UIEvents');
        resizeEvent.initUIEvent('resize', true, false, window, 0);
        if (window.dispatchEvent) {
          window.dispatchEvent(resizeEvent);
        } else {
          window.fireEvent(resizeEvent);
        }
      }
    }
  }
};
</script>

<style lang="less">
.day-week-report {
  position: absolute;
  right: 0;
  z-index: 9;
}
.store-tab {
  .el-tabs__item.is-disabled {
    opacity: 0.8;
    cursor: not-allowed;
    background: 0 0 !important;
  }
}
</style>


