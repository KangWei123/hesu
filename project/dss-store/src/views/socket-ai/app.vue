<template>
  <div class="report-screen">
    <layout :row-height="1"
            :margin="[0,0]"
            :col-num="0"
            :size="{width: 1920, height: 1080}">
      <grid-item :x="1"
                 :y="136"
                 :w="1108"
                 :h="940">
        <!-- <img style="width:100%;height:100%"
             src="../../asserts/images/bg.png" /> -->
      </grid-item>
      <grid-item :x="701"
                 :y="33"
                 :w="1219"
                 :h="109">
        <ai-title />
      </grid-item>
      <url-loader url="/c/faceHistory/proportion/new"
                  desc="获取客流占比信息"
                  :time="2000">
        <div slot-scope="{ isLoading, response }">
          <grid-item :x="20"
                     :y="176"
                     :w="410"
                     :h="280">
            <bar :data="response.data.ageProportion"
                 title="年龄占比"></bar>
          </grid-item>
          <grid-item :x="20"
                     :y="476"
                     :w="410"
                     :h="280">
            <pie :data="response.data.genderProportion"
                 title="性别占比"
                 type="gender"></pie>
          </grid-item>
          <grid-item :x="20"
                     :y="776"
                     :w="410"
                     :h="280">
            <pie :data="response.data.vipProportion"
                 title="会员占比"
                 type="member"></pie>
          </grid-item>
        </div>
      </url-loader>
      <url-loader-socket url="/user/topic/faceHistory/list/anchor/"
                         desc="获取实时客流信息"
                         :isAll='true'
                         data-type="Array">
        <div slot-scope="{ isLoading, response }">
          <grid-item :x="450"
                     :y="176"
                     :h="580"
                     :w="900">
            <face-table :data="response.data || []"></face-table>
          </grid-item>
          <grid-item :x="1370"
                     :y="176"
                     :h="880"
                     :w="531">
            <user-info :wkbStatus='wkbStatus'
                       :data="response.data && response.data.length ? response.data[0] : {}"></user-info>
          </grid-item>
        </div>
      </url-loader-socket>
      <url-loader-socket url="/user/topic/faceHistory/flow/"
                         desc="获取客流信息">
        <div slot-scope="{ isLoading, response }">
          <grid-item :x="20"
                     :y="22"
                     :h="117"
                     :w="369">
            <flow-panel :data="response.data ? response.data.ctDay : {}"></flow-panel>
          </grid-item>
          <grid-item :x="389"
                     :y="22"
                     :h="117"
                     :w="292">
            <flow-panel :data="response.data ? response.data.ctMonth : {}"></flow-panel>
          </grid-item>
        </div>
      </url-loader-socket>

      <url-loader url="/c/faceHistory/dayFlowList"
                  desc="获取日客流信息"
                  :time="5000"
                  data-type="Array">
        <div slot-scope="{ isLoading, response }"
             style="color: white;">
          <grid-item :x="450"
                     :y="776"
                     :h="280"
                     :w="440">
            <line-chart :data="response.data || []"
                        title="日客流趋势"
                        type="day"></line-chart>
          </grid-item>
        </div>
      </url-loader>

      <url-loader url="/c/faceHistory/monthFlowList"
                  desc="获取月客流信息"
                  :time="5000"
                  data-type="Array">
        <div slot-scope="{ isLoading, response }"
             style="color: white;">
          <grid-item :x="910"
                     :y="776"
                     :h="280"
                     :w="440">
            <line-chart :data="response.data || []"
                        title="月客流趋势"></line-chart>
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
import UrlLoaderSocket from '@/dss-store/src/components/url-loader-socket.js';
import FaceTable from './bz-cmps/face-table.vue';
import UserInfo from './bz-cmps/user-info/index.vue';
import FlowPanel from './bz-cmps/flow-panel.vue';
import Pie from './bz-cmps/pie.vue';
import Bar from './bz-cmps/bar.vue';
import LineChart from './bz-cmps/line.vue';
import AiTitle from './bz-cmps/ai-title.vue';
import url from '@/dss-common/utils/url.js';

export default {
  components: {
    Layout,
    GridItem,
    FaceTable,
    UrlLoader,
    UrlLoaderSocket,
    FlowPanel,
    UserInfo,
    Pie,
    Bar,
    LineChart,
    AiTitle
  },
  data() {
    return {
      time: 500,
      wkbStatus: 0
    };
  },

  mounted() {
    this.time = 500;
    this.wkbStatus = ~~url.queryString('wkbStatus');
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
  background: rgba(28, 26, 27, 1);
  z-index: 1999;
}
</style>
