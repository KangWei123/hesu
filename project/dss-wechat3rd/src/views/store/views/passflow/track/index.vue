<template>
  <div class="track">
    <div class="filter-box">
      <span class='label'>洞察区域:</span>
      <el-select v-model="insightArea.areaId"
                 size="mini"
                 placeholder="区域名称"
                 filterable
                 @change="onFilter">
       <el-option  v-for="(item, index) in areaList"
                   :key="index"
                   :label="item.name"
                   :value="item.id"></el-option>
      </el-select>
      <span class='label'>时间:</span>
      <el-date-picker v-model="insightArea.statDate"
                          :picker-options="pickerStartTime"
                          type="date"
                          @change='onTimePick'
                          format="yyyy-MM-dd"
                          placeholder="时间">
       </el-date-picker>
    </div>

    <el-row :gutter="20">
      <!-- 轨迹分布 -->
      <el-col :span="14">
        <div class="dss-card track-analysis">
          <card-title text="轨迹分布">
          </card-title>
          <div v-if='!areaList||!areaList.length'
               class="empty"><span>未设置当前门店布局，无法统计轨迹数据，请前往门店布局设置</span>
            <a href="javascript:;" @click='goStoreMgr'>立即前往</a>
          </div>
          <Sankey :data='sankeyData'
                  :areaName='insightArea.areaName'
                  v-else-if="sankeyData&&sankeyData.length"></Sankey>
          <div v-else>暂无数据</div>
        </div>
      </el-col>

      <!-- 入口转换 -->
      <el-col :span="10">
        <div class="dss-card entrance">
          <card-title text="入口转化">
          </card-title>
          <Funnel :data='funnelData'
                  v-if="funnelData&&funnelData.length"></Funnel>
          <div v-else>暂无数据</div>
        </div>
      </el-col>

    </el-row>

    <el-row :gutter="20"
            style="margin-top:20px">

      <!-- 区域联动分析 -->
      <el-col :span="12">
        <div class="dss-card"
             style="height:450px">
          <card-title text="区域联动分析">
          </card-title>
          <div>
            <el-select v-model="insightArea.areaGangedId"
                       size="mini"
                       filterable
                       placeholder="区域名称"
                       @change="onAreaFilter">
            <el-option  v-for="(item, index) in areaGangedList"
                   :key="index"
                   :label="item.name"
                   :value="item.id"></el-option>
            </el-select>
          </div>
          <bar :data='areaData'
               v-if="areaData&&areaData.length"></bar>
          <div v-else style='margin-top:20px'>暂无数据</div>
        </div>
      </el-col>

      <!-- 入口区域联动分析 -->
      <el-col :span="12">
        <div class="dss-card"
             style="height:450px">
          <card-title text="入口区域联动分析">
          </card-title>
          <div>
            <el-select v-model="insightArea.entranceId"
                       size="mini"
                       filterable
                       placeholder="入口名称"
                       @change="onEntranceFilter">
            <el-option  v-for="(item, index) in entranceList"
                   :key="index"
                   :label="item.name"
                   :value="item.id"></el-option>
            </el-select>
          </div>
          <bar :data='entranceData'
               v-if="entranceData&&entranceData.length"></bar>
          <div v-else style='margin-top:20px'>暂无数据</div>
        </div>
      </el-col>

    </el-row>

  </div>
</template>

<script>
import storeApi from '@/dss-common/api/store';
import CardTitle from '../../../components/card-title/index';
import Sankey from './sankey.vue';
import Funnel from './funnel.vue';
import Bar from './bar.vue';
import DateRange from '@/dss-common/components/DateRange';
import { mapState } from 'vuex';
import utilsDate from '@/dss-common/utils/date';
export default {
  components: { CardTitle, Sankey, Funnel, Bar, DateRange },
  data() {
    return {
      insightArea: {
        areaId: null,
        areaName: null,
        areaGangedId: null,
        entranceId: null,
        statDate: utilsDate.addDays(new Date(), -1)
      },
      pickerStartTime: {
        disabledDate: time => {
          let yesterDay = new Date();
          yesterDay.setTime(yesterDay.getTime() - 3600 * 1000 * 24);
          return time.getTime() > yesterDay;
        }
      },
      sankeyData: [],
      funnelData: [],
      areaData: [],
      areaList: [], //区域列表
      areaGangedList: [], //联动区域列表
      entranceList: [], //入口列表
      entranceData: [],
      maxDate: utilsDate.addDays(new Date(), -1)
    };
  },
  computed: {
    ...mapState({
      curStore: state => state.curStore
    })
  },
  watch: {},
  mounted() {
    this.getArea();
  },
  methods: {
    // 时间选择器变化时
    onTimePick() {
      this.getFunnelData();
      this.getTrackData();
      this.getEntrance();
      this.getGanged();
    },

    //获取区域列表
    getArea() {
      let params = {
        pageNo: 1,
        pageSize: 1000
      };
      storeApi
        .getAreaList(params)
        .then(result => {
          this.areaList = result.data || [];

          this.entranceList = this.areaList.filter(item => {
            return item.type === 1;
          });

          this.areaGangedList = this.areaList.filter(item => {
            return item.type !== 1;
          });

          //默认选第一个
          if (this.areaList && this.areaList.length) {
            this.insightArea.areaId = this.areaList[0].id;
            this.areaList.forEach(item => {
              if (this.insightArea.areaId === item.id) {
                this.insightArea.areaName = item.name;
              }
            });
          }
          if (this.areaGangedList && this.areaGangedList.length) {
            this.insightArea.areaGangedId = this.areaGangedList[0].id;
          }
          if (this.entranceList && this.entranceList.length) {
            this.insightArea.entranceId = this.entranceList[0].id;
          }
          this.getFunnelData();
          this.getTrackData();
          this.getEntrance();
          this.getGanged();
        })
        .always(() => {});
    },

    goStoreMgr() {
      this.$router.push('/passflow/store-layout');
    },

    //获取区域联动分析数据
    getGanged() {
      if (!this.insightArea.areaGangedId) {
        return;
      }
      let params = {
        storeAreaId: this.insightArea.areaGangedId,
        statDate: utilsDate.format(this.insightArea.statDate, 'YYYY/MM/DD')
      };
      storeApi
        .getGanged(params)
        .then(result => {
          this.areaData = result.data || [];
        })
        .always(() => {});
    },

    //获取入口联动分析数据
    getEntrance() {
      if (!this.insightArea.entranceId) {
        return;
      }
      let params = {
        storeAreaId: this.insightArea.entranceId,
        statDate: utilsDate.format(this.insightArea.statDate, 'YYYY/MM/DD')
      };
      storeApi
        .getGanged(params)
        .then(result => {
          this.entranceData = result.data || [];
        })
        .always(() => {});
    },

    //获取轨迹分布数据
    getTrackData() {
      if (!this.insightArea.areaId) {
        return;
      }
      let params = {
        storeAreaId: this.insightArea.areaId,
        statDate: utilsDate.format(this.insightArea.statDate, 'YYYY/MM/DD')
      };
      storeApi
        .getTrackTransform(params)
        .then(result => {
          this.sankeyData = result.data || [];
        })
        .always(() => {});
    },

    //获取入口转换数据
    getFunnelData() {
      if (!this.insightArea.areaId) {
        return;
      }

      let params = {
        statDate: utilsDate.format(this.insightArea.statDate, 'YYYY/MM/DD')
      };
      storeApi
        .getEntrance(params)
        .then(result => {
          this.funnelData = result.data;
        })
        .always(() => {});
    },

    onFilter() {
      this.areaList.forEach(item => {
        if (this.insightArea.areaId === item.id) {
          this.insightArea.areaName = item.name;
        }
      });
      this.getTrackData();
    },

    onAreaFilter() {
      this.getGanged();
    },
    onEntranceFilter() {
      this.getEntrance();
    }
  }
};
</script>

<style lang="less">
.track {
  .track-analysis {
    height: 600px;
  }
 
  .filter-box{
    padding :10px 0px;
  }

  .label{
    padding:0 16px 0 20px;
  }
  .entrance {
    height: 600px;
  }
  .empty {
    text-align: center;
    height: 500px;
    line-height: 500px;
  }
}
</style>


