<template>
  <div class="report-screen">
    <layout
      :row-height="1"
      :margin="[0,0]"
      :col-num="0"
      :size="{width: 1920, height: 1080}"
    >
      <grid-item
        :x="20"
        :y="20"
        :w="470"
        :h="59"
      >
        <flow-title />
      </grid-item>

      <grid-item
        :x="1200"
        :y="38"
        :w="700"
        :h="42"
      >
        <realtime-date />
      </grid-item>

      <url-loader
        url="/c/stat/screen/rt_info"
        desc="获取实时客流信息"
        :time="2000"
        data-type="Object"
      >

        <grid-item
          :x="20"
          :y="100"
          :h="260"
          :w="930"
          slot-scope="{ isLoading, response }"
        >
          <overview :data="response.data || {}" />
        </grid-item>
      </url-loader>

      <url-loader
        url="/c/stat/screen/passenger_distribute"
        desc="获取客群分布"
        :time="600000"
        data-type="Array"
      >
          <grid-item
            :x="20"
            :y="380"
            :h="430"
            :w="930"
            slot-scope="{ isLoading, response }"
          >
            <map-chart title="客群分布" :data="response.data" />
          </grid-item>
      </url-loader>

      <url-loader
        url="/c/stat/screen/passenger_trend"
        desc="获取实时客流趋势"
        :time="30000"
        data-type="Array"
      >
          <grid-item
            :x="20"
            :y="830"
            :h="228"
            :w="930"
            slot-scope="{ isLoading, response }"
          >
            <Line-chart title="实时客流趋势" :data="response.data || []" />
          </grid-item>
      </url-loader>

      <url-loader
        url="/c/stat/screen/portraits"
        desc="获取画像信息"
        :params="{type: 0}"
        :time="600000"
        data-type="Array"
      >
        <div slot-scope="{ isLoading, response }">
          <grid-item
            :x="970"
            :y="100"
            :w="455"
            :h="306"
          >
            <bar
              :data="response.data"
              tag="sex"
              :is-sex="true"
              title="顾客年龄性别占比"
            />
          </grid-item>
          <grid-item
            :x="1445"
            :y="100"
            :w="455"
            :h="306"
          >
            <bar
              :data="response.data"
              tag="user_age"
              title="顾客年龄占比"
            />
          </grid-item>
          <grid-item
            :x="970"
            :y="426"
            :w="455"
            :h="306"
          >
            <pie
              :data="response.data"
              tag="user_educational_status"
              title="顾客学历占比"
            />
          </grid-item>
          <grid-item
            :x="1445"
            :y="426"
            :w="455"
            :h="306"
          >
            <pie
              :data="response.data"
              tag="user_consumption"
              title="消费水平分布"
            />
          </grid-item>
          <grid-item
            :x="970"
            :y="752"
            :w="930"
            :h="306"
          >
            <bubble
              :data="response.data"
              title="顾客设备品牌分布"
            ></bubble>
          </grid-item>
        </div>
      </url-loader>
    </layout>
  </div>
</template>

<script>
import Layout from '@/dss-store/src/components/layout/index.vue';
import GridItem from '@/dss-store/src/components/layout/grid-item.vue';
import UrlLoader from '@/dss-store/src/components/url-loader.js';
import FlowTitle from './bz-cmps/flow-title.vue';
import RealtimeDate from './bz-cmps/realtime-date.vue';
import Overview from './bz-cmps/overview.vue';
import Pie from './bz-cmps/pie.vue';
import Bar from './bz-cmps/bar.vue';
import LineChart from './bz-cmps/line.vue';
import Bubble from './bz-cmps/bubble.vue';
import MapChart from './bz-cmps/map.vue';

export default {
  components: {
    FlowTitle,
    RealtimeDate,
    Layout,
    GridItem,
    Overview,
    UrlLoader,
    Pie,
    Bar,
    LineChart,
    Bubble,
    MapChart
  }
};
</script>

<style lang="less" scoped>
.report-screen {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(27, 25, 55, 1);
  z-index: 1999;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial;
}
</style>
