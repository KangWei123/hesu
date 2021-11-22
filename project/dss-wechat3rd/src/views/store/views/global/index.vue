<template>
  <div style="position: relative">
    <!--fixme 暂时隐藏ap客流-->
    <el-tabs v-if="CAMERA && DeviceExist && false"
             v-model="activeName"
             class="store-tab"
             @tab-click="handleClick">
      <el-tab-pane label="AI人脸客流"
                   name="face-passflow"
                   :disabled='!CAMERA'>
        <el-popover placement="bottom"
                    slot="label"
                    width="200"
                    trigger="hover"
                    v-if="!CAMERA"
                    content='需安装摄像头设备'>
          <span slot="reference">AI人脸客流</span>
        </el-popover>
      </el-tab-pane>

      <el-tab-pane label="AP客流"
                   name="probe-passflow"
                   :disabled='!DeviceExist'>
        <el-popover placement="bottom"
                    slot="label"
                    v-if="!DeviceExist"
                    width="200"
                    trigger="hover"
                    content='需安装AP设备'>
          <span slot="reference">AP客流</span>
        </el-popover>
      </el-tab-pane>
    </el-tabs>
    <!-- key值变化重新渲染组件 -->
    <global-flow :deviceType="deviceType"
                 :key="deviceType"></global-flow>
  </div>
</template>

<script>
import GlobalFlow from './GlobalFlow.vue';
import storeApi from '@/dss-common/api/report';
import PassengerFlowEnum from '@/dss-common/enums/PassengerFlow.js';
import { mapState } from 'vuex';
export default {
  components: {
    GlobalFlow
  },
  data() {
    return {
      DeviceExist: false,
      CAMERA: false,
      activeName: 'face-passflow',
      PassengerFlowEnum
    };
  },
  computed: {
    ...mapState({
      curStore: state => state.curStore
    }),
    deviceType() {
      //fixme 暂时隐藏ap客流
      /*if (this.CAMERA && this.DeviceExist) {
        return this.activeName === 'face-passflow'
          ? PassengerFlowEnum.deviceType.camera
          : PassengerFlowEnum.deviceType.ap;
      }
      return this.CAMERA ? PassengerFlowEnum.deviceType.camera : PassengerFlowEnum.deviceType.ap;*/
      return PassengerFlowEnum.deviceType.camera;
    }
  },
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
            this.DeviceExist = true;
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


