<template>
  <div class="store-layout-container"
       v-loading="loading">
    <div class="store-layout-header">
      门店布局设置
    </div>
    <store-floor ref="storeFloor"
                 class="store-floor-box"
                 @loading="loading = true"
                 @done="loading = false"
                 @floor="onFloorSelected"></store-floor>
    <div class="right-layout">
      <decorate-component class="store-components-box"></decorate-component>
      <div class="floor-layout-box"
           v-if="floorItem && floorLayout && deviceList">
        <div class="floor-info">
          <span>{{floorItem.name}}</span>
          <el-button class="save-layout-btn is-plain"
                     @click="onSaveLayout">保存</el-button>
        </div>
        <div class="floor-canvas-panel-wrapper"
             :class="floorItem.containsOutdoor?'floor-canvas-panel-wrapper-outside':''"
             :style="{width: floorItem.floorShape === floorEnum.floorShape.rectangle ? '900px' : '540px'}">
          <canvas-panel :floor-item="floorItem"
                        :outside='floorItem.containsOutdoor'
                        :layout="floorLayout"
                        :device-list="deviceList"
                        @success="onSaveLayout"
                        @loading="loading = true"
                        @done="loading = false"></canvas-panel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import canvasPanel from './canvas-panel.vue';
import decorateComponent from './decorate-component.vue';
import storeFloor from './store-floor.vue';
import newStoreApi from '@/dss-store/src/api/index.js';
import deviceApi from '@/dss-common/api/device.js';
import floorEnum from '../floor-enum.js';

export default {
  name: 'store-layout',
  components: {
    canvasPanel,
    decorateComponent,
    storeFloor
  },
  data() {
    return {
      floorEnum,
      loading: false,
      floorItem: null,
      floorLayout: null,
      deviceList: null
    };
  },
  mounted() {
    this.getDeviceList();
  },
  computed: {
    ...mapState({
      curStore: 'curStore'
    })
  },
  methods: {
    getDeviceList() {
      deviceApi
        .list({
          queryStore: this.curStore.id,
          pageSize: 100,
          pageNo: 1,
          deviceType: 2 //摄像头
        })
        .then(res => {
          this.deviceList = res.data || [];
        });
    },

    onFloorSelected(floorItem) {
      this.floorItem = floorItem;
      this.getDeviceList();
      if (floorItem) {
        this.floorLayout = JSON.parse(floorItem.layoutJson || '[]');
      } else {
        this.floorLayout = [];
      }
    },
    onSaveLayout: function() {
      const invalidItem = this.floorLayout.find(floor => {
        return (
          (floor.type === floorEnum.decorateType.enter_exit ||
            floor.type === floorEnum.decorateType.shop ||
            floor.type === floorEnum.decorateType.outside ||
            floor.type === floorEnum.decorateType.cashier) &&
          !floor.deviceId
        );
      });
      if (!!invalidItem) {
        this.$message('请给' + invalidItem.areaName + '绑定摄像头');
        return;
      }
      this.loading = true;
      const floorLayout = this.handleRandomData();
      const layoutJson = JSON.stringify(floorLayout);
      newStoreApi
        .floorUpdate({
          id: this.floorItem.id,
          layoutJson: layoutJson
        })
        .then(res => {
          this.$refs.storeFloor.listFloors(false);
          this.getDeviceList();
        })
        .always(() => {
          this.loading = false;
        });
    },
    handleRandomData() {
      const floorLayout = this.floorLayout;
      floorLayout.forEach(item => {
        let pointData = [];
        if (!!item.id) {
          const max_x = item.left + item.width;
          const max_y = item.top + item.height;

          const range = Math.sqrt(item.width * item.width + item.height * item.height);
          const POINT_NUMBET = range > 100 ? 20 : 5;

          for (let i = 0; i < POINT_NUMBET; i++) {
            let point = {
              x: Math.floor((max_x - item.left + 1) * Math.random() + item.left),
              y: Math.floor((max_y - item.top + 1) * Math.random() + item.top)
            };
            pointData.push(point);
          }
          item.randomPoint = pointData;
        }
      });
      return floorLayout;
    }
  }
};
</script>

<style lang="less">
.store-layout-container {
  height: 100%;
  min-width: 1200px;
  min-height: 750px;
  box-sizing: border-box;
  padding: 0 0 10px;
  background: white;
  font-size: 0;

  .store-layout-header {
    height: 50px;
    box-sizing: border-box;
    line-height: 50px;
    padding-left: 20px;
    color: @black-color;
    font-size: 20px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    border-bottom: 1px solid #dadada;
    margin-bottom: 10px;
  }

  .store-floor-box {
    display: inline-block;
    vertical-align: top;
    height: calc(100% - 60px);
    margin-left: 10px;
  }

  .right-layout {
    width: calc(100% - 190px);
    height: calc(100% - 60px);
    padding: 10px;
    box-sizing: border-box;
    background: #f5f7fa;
    display: inline-block;
    font-size: 0;
    vertical-align: top;
  }

  .store-components-box {
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
  }

  .floor-layout-box {
    display: inline-block;
    vertical-align: top;
    background: white;
    width: calc(100% - 222px);
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
  }

  .floor-info {
    height: 47px;
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(37, 110, 255, 1);
    line-height: 30px;
    position: relative;
    box-sizing: border-box;

    .save-layout-btn {
      position: absolute;
      left: 840px;
      top: 0;
    }
  }

  .floor-canvas-panel-wrapper {
    position: relative;
    width: 900px;
    height: 540px;
    background: rgba(255, 255, 255, 1);
    border: 7px solid rgba(217, 230, 255, 1);
    box-sizing: border-box;
  }

  .floor-canvas-panel-wrapper-outside {
    border: 2px dashed rgba(220, 221, 224, 1);
  }
}
</style>
