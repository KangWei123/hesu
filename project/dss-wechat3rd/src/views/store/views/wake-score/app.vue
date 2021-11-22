<template>
  <div class="report-screen">
    <layout :row-height="1"
            :margin="[0,0]"
            :col-num="0"
            :size="{width: 1920, height: 1080}">

      <!-- 顶部头 -->
      <grid-item :x="0"
                 :y="0"
                 :w="1920"
                 :h="120">
        <ai-title :is-enter-face-score="isEnterFaceScore"
                  :wkbTitle='wkbTitle' />
      </grid-item>

      <!-- 签到嘉宾 -->
      <url-loader url="/c/faceHistory/flow"
                  desc="获取客流信息"
                  :time="2000">
        <div slot-scope="{ isLoading, response }">
          <grid-item :x="49"
                     :y="120"
                     :w="522"
                     :h="55">
            <sign-in :is-enter-face-score="isEnterFaceScore"
                     :data="response.data ? response.data.ctMonth : {}" />
          </grid-item>
        </div>
      </url-loader>

      <url-loader url="/c/faceHistory/proportion/new"
                  desc="获取客流占比信息"
                  :time="2000">
        <div slot-scope="{ isLoading, response }">

          <!-- 性别占比 -->
          <grid-item :x="49"
                     :y="196"
                     :w="522"
                     :h="205">
            <sex-pie :data="response.data.genderProportion" />
          </grid-item>

          <!-- 年龄占比 -->
          <grid-item :x="49"
                     :y="425"
                     :w="522"
                     :h="217">
            <bar :data="response.data.ageProportion" />
          </grid-item>
        </div>
      </url-loader>

      <!-- 地区分布 -->
      <url-loader url="/c/fuli/region/report"
                  desc="获取地区分布信息"
                  :time="2000"
                  data-type="Array">
        <div slot-scope="{ isLoading, response }">
          <grid-item :x="49"
                     :y="669"
                     :w="522"
                     :h="389">
            <area-pie :data='response.data||[]' />
          </grid-item>
        </div>
      </url-loader>

      <!-- 签到列表 -->
      <url-loader-table :url="'/c/fuli/face/history_anchor' + (isEnterFaceScore && cosmetic ? ('?cosmetic=' + cosmetic) : '')"
                        desc="获取实时客流信息"
                        :time="time"
                        data-type="Array">
        <div slot-scope="{ isLoading, response }">
          <grid-item :x="619"
                     :y="120"
                     :h="941"
                     :w="682">
            <face-table :is-enter-face-score="isEnterFaceScore"
                        :data="response.data || []"></face-table>
          </grid-item>

          <!-- 个人信息 -->
          <grid-item :x="1349"
                     :y="120"
                     :w="522"
                     :h="450">
            <user-info :is-enter-face-score="isEnterFaceScore"
                       :wkbTitle='wkbTitle'
                       :data="response.data && response.data.length ? response.data[0] : {}" />
          </grid-item>
        </div>
      </url-loader-table>

      <!-- 日客流分布 -->
      <url-loader url="/c/faceHistory/dayFlowList"
                  desc="获取客流占比信息"
                  :time="2000"
                  data-type="Array">
        <div slot-scope="{ isLoading, response }">
          <grid-item :x="1349"
                     :y="594"
                     :w="522"
                     :h="464">
            <flow-line :data='response.data||[]' />
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
import UrlLoaderTable from './bz-cmps/url-loader-table.js';
import FaceTable from './bz-cmps/face-table.vue';
import UserInfo from './bz-cmps/user-info.vue';
import sexPie from './bz-cmps/sex-pie.vue';
import AreaPie from './bz-cmps/area-pie.vue';
import Bar from './bz-cmps/bar.vue';
import FlowLine from './bz-cmps/flow-line.vue';
import SignIn from './bz-cmps/sign-in.vue';
import AiTitle from './bz-cmps/ai-title.vue';
import url from '@/dss-common/utils/url.js';

export default {
  components: {
    Layout,
    GridItem,
    FaceTable,
    UrlLoader,
    UrlLoaderTable,
    AreaPie,
    UserInfo,
    sexPie,
    Bar,
    FlowLine,
    SignIn,
    AiTitle
  },
  data() {
    return {
      time: 500,
      wkbTitle: '',
      //是否为入店大屏
      isEnterFaceScore: false,
      //入店大屏url拼接参数
      cosmetic: ''
    };
  },

  mounted() {
    this.time = 500;
    this.wkbTitle = url.queryString('wkbTitle');
    this.setIsEnterFaceScore();
  },
  methods: {
    setIsEnterFaceScore() {
      const curHref = window.location.href;
      this.isEnterFaceScore = curHref.indexOf('enter-face-score') !== -1;
      this.cosmetic = url.queryString('cosmetic');
    }
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
  background: rgba(5, 12, 46, 1);
  z-index: 1999;
  background-image: url('../../asserts/images/face-score/bg.png');
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
