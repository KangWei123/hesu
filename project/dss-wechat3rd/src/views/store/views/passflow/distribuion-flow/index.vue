<template>
  <div class="flow-container">
    <div class="tab-container">
      <div class="title-box">
        <div class="title-item"
             :class="title==='flow'?'checked':''"
             @click="title='flow'">客流量</div>
        <div class="title-item"
             :class="title==='Customer'?'checked':''"
             @click="title='Customer'">客户量</div>
      </div>
    </div>
    <div style="margin-top:20px;">
      <span class='label'>时间:</span>
      <el-date-picker v-model="statDate"
                      :picker-options="pickerStartTime"
                      type="date"
                      @change='onTimePick'
                      format="yyyy-MM-dd"
                      placeholder="时间">
      </el-date-picker>
    </div>
    <div class="dss-card floor-box">
      <card-title text="楼层分布">
        <template slot="right">
          <i title="导出Excel"
             class="key-icon key-icon-btn key-icon-download"
             @click="floorExcel"></i>
        </template>
      </card-title>
      <div v-if='!floorList||!floorList.length'
           class="empty"><span>未设置当前门店布局，无法统计轨迹数据，请前往门店布局设置</span>
        <a href="javascript:;"
           @click='goStoreMgr'>立即前往</a>
      </div>
      <div v-else>
        <bar :data='floorData'
             v-if="floorData&&floorData.length"
             :title="title">
        </bar>
        <div v-else
             style='margin:20px 0'
             class="empty">暂无数据</div>
        <div class="equipment-box">
          <div class="title">楼层设备分布</div>
          <div class="time-box">
            <div class="item"
                 v-for="(item,index) in  floorList"
                 :key='index'>
              <div class="content">
                <div class="floor-title"><span></span> F{{item.floorValue}}-{{item.name}}</div>
                <div class="area-name"
                     v-for="(area,i) in  item.layoutJson"
                     v-if='area.type=== floorEnum.decorateType.shop||area.type=== floorEnum.decorateType.enter_exit|| area.type ===floorEnum.decorateType.outside|| area.type ===floorEnum.decorateType.cashier'
                     :key='i'>{{area.areaName}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dss-card area-box">
      <card-title :text="title==='flow'?'客流转化':'客户转化'">
      </card-title>
      <convert :data='convertData'
               :title="title"
               v-if="convertData.status===convertEnum.NORMAL"></convert>
      <div v-else-if='convertData.status===convertEnum.NO_DATA'
           style='margin:20px 0'
           class="empty">暂无数据</div>
      <div v-else
           style='margin-top:20px'
           class="empty"><span>未设置当前门店布局，无法统计轨迹数据，请前往门店布局设置</span>
        <a href="javascript:;"
           @click='goStoreMgr'>立即前往</a>
      </div>
    </div>

    <!-- <div class="dss-card area-box">
      <card-title text="设备分布">
        <template slot="right">
          <i title="导出Excel"
             class="key-icon key-icon-btn key-icon-download"
             @click="areaExcel"></i>
        </template>
      </card-title>
      <bar :data='areaData'
           v-if="areaData&&areaData.length"
           :title="title"></bar>
      <div v-else
           style='margin-top:20px'
           class="empty">暂无数据</div>
    </div>
  </div> -->

  </div>

</template>

<script>
import dateUtil from '@/dss-common/utils/date';
import CardTitle from '../../../components/card-title/index';
import convert from './convert.vue';
import bar from './bar.vue';
import newapi from '@/dss-store/src/api/index.js';
import url from '@/dss-common/utils/url';
import floorEnum from '../floor-enum.js';
const convertEnum = {
  NO_STORE: 0, //'没有配置门店区域'
  NO_DATA: 1, //暂无数据
  NORMAL: 2 //正常有数据
};
export default {
  components: { CardTitle, bar, convert },
  watch: {
    title(newVal) {
      this.getArea();
      this.getFloor();
      this.getConvert();
    }
  },
  data() {
    return {
      convertEnum,
      floorEnum,
      title: 'flow',
      statDate: new Date(),
      floorData: [],
      areaData: [],
      convertData: {},
      floorList: [],
      pickerStartTime: {
        disabledDate: time => {
          let yesterDay = new Date();
          yesterDay.setTime(yesterDay.getTime());
          return time.getTime() > yesterDay;
        }
      }
    };
  },
  mounted() {
    this.getArea();
    this.getFloor();
    this.getfoorList();
    this.getConvert();
  },
  methods: {
    getFloor() {
      newapi
        .floor_customer_portrait({
          queryCustomer: this.title === 'Customer',
          statDate: dateUtil.format(this.statDate, 'YYYY/MM/DD')
        })
        .then(res => {
          this.floorData = res.data || [];
          this.floorData.sort((a, b) => {
            return a.storeFloorValue - b.storeFloorValue;
          });
          this.format(this.floorData);
        });
    },

    //获取客流转化
    getConvert() {
      newapi
        .funnel_conversion({
          time: dateUtil.format(this.statDate, 'YYYY/MM/DD')
        })
        .then(res => {
          this.convertData = res.data || {};
        });
    },

    goStoreMgr() {
      this.$router.push('/passflow/store-layout');
    },

    getArea() {
      newapi
        .area_customer_portrait({
          queryCustomer: this.title === 'Customer',
          statDate: dateUtil.format(this.statDate, 'YYYY/MM/DD')
        })
        .then(res => {
          this.areaData = res.data || [];
          this.format(this.areaData);
        });
    },

    getfoorList() {
      newapi
        .floorList({
          pageNo: 1,
          pageSize: 100
        })
        .then(res => {
          this.floorList = res.data || [];
          this.floorList.forEach(item => {
            item.layoutJson = JSON.parse(item.layoutJson);
          });
        });
    },

    format(data) {
      data.forEach(item => {
        item.name = item.storeFloorName || item.storeAreaName;
        item.value = item.totalCount;
      });
    },
    onTimePick() {
      this.getArea();
      this.getFloor();
      this.getConvert();
    },
    floorExcel() {
      if (!this.floorData || !this.floorData.length) {
        return this.$message({
          type: 'warning',
          message: '数据为空不能下载'
        });
      }
      window.open(
        url.makeUrl(newapi.floor_download, {
          queryCustomer: this.title === 'Customer',
          statDate: dateUtil.format(this.statDate, 'YYYY/MM/DD')
        })
      );
    },
    areaExcel() {
      if (!this.areaData || !this.areaData.length) {
        return this.$message({
          type: 'warning',
          message: '数据为空不能下载'
        });
      }
      window.open(
        url.makeUrl(newapi.area__download, {
          queryCustomer: this.title === 'Customer',
          statDate: dateUtil.format(this.statDate, 'YYYY/MM/DD')
        })
      );
    }
  }
};
</script>

<style lang="less" >
.flow-container {
  .tab-container {
    background-color: #fff;
    padding: 14px 20px;
  }
  .empty {
    text-align: center;
    height: 400px;
    line-height: 400px;
  }
  .title-box {
    display: inline-block;
    .title-item {
      display: inline-block;
      cursor: pointer;
      font-size: 16px;
      font-weight: 400;
      color: #999999;
      line-height: 22px;
      margin-right: 60px;
    }
    .checked {
      color: #3d77f1;
      font-weight: 500;
    }
  }
  .card-title h3 {
    font-size: 14px;
    color: #333333;
    font-weight: 600;
  }

  .area-box {
    margin-top: 20px;
  }
  .floor-box {
    margin-top: 20px;
    min-height: 500px;
    .equipment-box {
      padding: 0 20px;
      background: rgba(241, 244, 247, 1);
      overflow: hidden;
      .title {
        font-size: 14px;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        margin-top: 10px;
      }
      .time-box {
        margin-bottom: 20px;
        overflow: hidden;
        .item {
          float: left;
          margin-top: 20px;
          margin-right: 20px;
          width: 165px;
          height: 135px;
          background: rgba(255, 255, 255, 1);
          border-radius: 2px;
          border: 1px solid rgba(62, 158, 255, 1);
          overflow: hidden;
          .content {
            overflow: hidden;
            overflow-y: auto;
            width: 165px;
            height: 135px;
            padding-right: 20px;
          }
          .floor-title {
            font-size: 12px;
            color: rgba(51, 51, 51, 1);
            margin-top: 6px;
            line-height: 17px;
            padding: 0 20px;
            position: relative;
            width: 165px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            box-sizing: border-box;
            span {
              display: inline-block;
              width: 8px;
              height: 8px;
              background: rgba(255, 255, 255, 1);
              border: 2px solid rgba(62, 158, 255, 1);
              border-radius: 50%;
              vertical-align: middle;
              position: absolute;
              left: 5px;
              top: 1px;
            }
          }
          .area-name {
            padding: 0 20px;
            font-size: 12px;
            width: 165px;
            color: rgba(168, 168, 168, 1);
            margin-top: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}
</style>


