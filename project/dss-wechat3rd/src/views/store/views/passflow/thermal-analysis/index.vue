<template>
  <div class="thermal-container"
       v-loading="loading">
    <div class="thermal-header">
      热力区域分布
    </div>

    <div class="filter-box">
      <span class='label'>日期：</span>
      <el-date-picker v-model="startDate"
                      :picker-options="pickerStartTime"
                      type="date"
                      @change='onTimePick'
                      placeholder="日期">
      </el-date-picker>
    </div>

    <div class="floor">当前楼层：{{floorItem.name}}</div>

    <!-- 热力区 -->
    <div>
      <div class="floor-canvas-panel-wrapper"
           :class="floorItem.containsOutdoor?'floor-canvas-panel-wrapper-outside':''"
           :style="{width: '900px'}">
        <div v-if='!floorList.length || !isDevice.length'
             class="empty"><span>未设置当前门店布局，无法统计热力数据，请前往门店布局设置摄像头位置</span>
          <a href="javascript:;"
             @click='goStoreMgr'>立即前往</a>
        </div>
        <canvas-panel v-if='floorList.length || isDevice.length'
                      :floor-item="floorItem"
                      :outside='floorItem.containsOutdoor'
                      :layout="floorLayout"
                      :device-list="[]"
                      :is-edit='false'
                      @loading="loading = true"
                      @done="loading = false"></canvas-panel>
        <heat-map v-if='floorList.length || isDevice.length'
                  class="map-wrapper"
                  :width="layout.WIDTH"
                  :height="layout.HEIGHT"
                  :heatRange="heatRange"
                  :areaData="areaData" />
      </div>
      <!-- 楼层区 -->
      <store-floor @floor="onFloorSelected"
                   @storeFloors="onFloors"></store-floor>
    </div>

    <div class="grade-box">
      <div class="grade">
        <span class="grade-max"
              v-if="heatRange.max > 0">&lt; {{heatRange.max}}</span>
      </div>
      <div class="grade-text">
        <span>人群密度低</span>
        <span style="margin-left:188px;">人群密度高</span>
      </div>
    </div>
    <!-- 底部时间轴 -->
    <timeaxis @selectTime="selectTime"
              :startDate="startDate"></timeaxis>
  </div>
</template>

<script>
import canvasPanel from '../store-layout/canvas-panel.vue';
import storeFloor from './store-floor.vue';
import timeaxis from './timeaxis.vue';
import HeatMap from '@/dss-common/components/HeatMap';
import dateUtil from '@/dss-common/utils/date';
import api from '@/dss-store/src/api/index.js';
const layout = {
  WIDTH: '886',
  HEIGHT: '526'
};

// 随机赋值人数区间
function makeHeatData(data, totalCount) {
  let heatData = [];
  let point = {};

  for (let i = 0; i < data.length; i++) {
    if (i % 4 === 0) {
      point = {
        x: data[i].x,
        y: data[i].y,
        value: totalCount * 0.75
      };
      heatData.push(point);
    } else if (i % 4 === 1) {
      point = {
        x: data[i].x,
        y: data[i].y,
        value: totalCount * 0.5
      };
      heatData.push(point);
    } else if (i % 4 === 2) {
      point = {
        x: data[i].x,
        y: data[i].y,
        value: totalCount * 0.25
      };
      heatData.push(point);
    } else if (i % 4 === 3) {
      point = {
        x: data[i].x,
        y: data[i].y,
        value: totalCount
      };
      heatData.push(point);
    }
  }
  return heatData;
}

export default {
  components: {
    canvasPanel,
    storeFloor,
    timeaxis,
    HeatMap
  },
  watch: {
    floorLayout: {
      deep: true,
      handler: function(val, oldVal) {
        this.fetchStoreData();
      }
    }
  },
  data() {
    return {
      loading: false,
      startDate: new Date(),
      floorItem: {},
      floorLayout: null,
      pickerStartTime: {
        disabledDate: time => {
          let yesterDay = new Date();
          yesterDay.setTime(yesterDay.getTime() - 3600 * 1000);
          return time.getTime() > yesterDay;
        }
      },
      areaData: [],
      heatData: [],
      layout,
      heatRange: {},
      startTime: '',
      endTime: '',
      floorList: '',
      isDevice: false
    };
  },
  methods: {
    onFloorSelected(floorItem) {
      this.floorItem = floorItem;
      if (floorItem) {
        this.floorLayout = JSON.parse(floorItem.layoutJson || '[]');
        this.isDevice = this.floorLayout.filter(item => item.id);
      } else {
        this.floorLayout = [];
      }
    },
    selectTime(start, end) {
      if (!this.startDate) {
        return;
      }

      this.startTime = start + ':00:00';
      this.endTime = end + ':00:00';

      if (this.floorItem.id) {
        this.fetchStoreData();
      }
    },
    fetchStoreData() {
      const date = dateUtil.format(this.startDate, 'YYYY/MM/DD');
      const startDate = date + ' ' + this.startTime;
      const endDate = date + ' ' + this.endTime;

      const params = {
        startDate: startDate,
        endDate: endDate,
        floorId: this.floorItem.id
      };

      if (this.startTime && this.endTime) {
        api.peopleDetail(params).then(res => {
          const data = res.data || [];
          this.handleStoreData(data);
        });
      }
    },

    onFloors(floors) {
      this.floorList = floors;
    },

    handleStoreData(data) {
      const floorLayout = this.floorLayout;

      this.heatRange.max = Math.max.apply(
        Math,
        data.map(item => {
          return item.passengerCount;
        })
      );
      this.heatRange.min = Math.min.apply(
        Math,
        data.map(item => {
          return item.passengerCount;
        })
      );

      let heatData = [];

      const result = floorLayout.filter(item => item.id);

      result.forEach(item => {
        const areaItem = data.find(area => area.storeAreaId === item.id);

        if (areaItem) {
          let point = makeHeatData(item.randomPoint, areaItem.passengerCount);
          heatData = heatData.concat(point);
        }
      });

      this.areaData = heatData;
    },
    goStoreMgr() {
      this.$router.push('/passflow/store-layout');
    },
    onTimePick() {}
  }
};
</script>

<style lang="less" scoped>
.thermal-container {
  height: 100%;
  min-width: 1200px;
  min-height: 850px;
  box-sizing: border-box;
  padding: 0 0 10px;
  background: white;
  font-size: 0;

  .thermal-header {
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

  .filter-box {
    font-size: 14px;
    color: rgba(51, 51, 51, 1);
    margin-top: 20px;
    padding-left: 30px;
  }

  .floor {
    margin-top: 17px;
    padding-left: 30px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(37, 110, 255, 1);
  }

  .map-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
  }

  .floor-canvas-panel-wrapper {
    margin-top: 20px;
    margin-left: 30px;
    position: relative;
    display: inline-block;
    width: 900px;
    height: 540px;
    background: rgba(255, 255, 255, 1);
    border: 4px solid rgba(140, 163, 252, 1);
    box-sizing: border-box;
    border-radius: 2px;
  }

  .floor-canvas-panel-wrapper-outside {
    border: 2px dashed rgba(220, 221, 224, 1);
  }

  .grade-box {
    position: relative;
    margin-top: 22px;
    padding-left: 30px;
    .grade {
      margin-left: 39px;
      width: 248px;
      height: 10px;
      background: linear-gradient(
        90deg,
        rgba(107, 182, 255, 1) 0%,
        rgba(52, 255, 140, 1) 33%,
        rgba(255, 215, 41, 1) 69%,
        rgba(255, 48, 48, 1) 100%
      );
      border-radius: 2px;
    }
    .grade-text {
      margin-top: 10px;
      margin-left: 9px;
      font-size: 12px;
      color: rgba(51, 51, 51, 1);
    }

    .grade-max {
      position: absolute;
      top: 0;
      left: 326px;
      color: #999999;
      font-size: 12px;
    }
  }
  .empty {
    position: absolute;
    width: 100%;
    text-align: center;
    height: 532px;
    line-height: 500px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    z-index: 100;
    background: #f5f7fa;

    a {
      font-size: 14px;
      font-weight: 500;
      color: rgba(37, 110, 255, 1);
    }
  }
}
</style>


