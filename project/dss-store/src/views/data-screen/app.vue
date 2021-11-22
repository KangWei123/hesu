<template>
  <div class="report-screen">
    <layout :row-height="1" :margin="[0, 0]" :col-num="0" :size="{ width: 1920, height: 1080 }">
      <grid-item :x="0" :y="0" :w="1920" :h="122">
        <ai-title />
      </grid-item>
      <grid-item :x="185" :y="219" :w="1735" :h="861">
        <decorative-border></decorative-border>
      </grid-item>

      <url-loader url="/c/faceHistory/flow" desc="获取客流信息" :time="2000">
        <div slot-scope="{ isLoading, response }">
          <grid-item :x="575" :y="130" :h="58" :w="257">
            <flow-panel :data="response.data ? response.data.ctDay : {}" :border-left="true"></flow-panel>
          </grid-item>
          <grid-item :x="832" :y="130" :h="58" :w="257">
            <flow-panel :data="response.data ? response.data.ctWeek : {}"></flow-panel>
          </grid-item>
          <grid-item :x="1089" :y="130" :h="58" :w="257">
            <flow-panel :data="response.data ? response.data.ctMonth : {}" :border-right="true"></flow-panel>
          </grid-item>
        </div>
      </url-loader>

      <url-loader-table
        url="/c/faceHistory/list/anchor"
        desc="获取实时客流信息"
        :time="time"
        data-type="Array"
        :static="isStatic"
      >
        <div slot-scope="{ isLoading, response }">
          <!-- 实时客流列表 -->
          <grid-item :x="0" :y="219" :h="861" :w="185">
            <flow-list :data="response.data || []" @choose="setIndex"></flow-list>
          </grid-item>
          <!-- 用户标签 -->
          <grid-item :x="320" :y="251" :h="357" :w="445">
            <user-label
              :wkb-status="wkbStatus"
              :data="response.data && response.data.length ? response.data[selectIndex] : {}"
            >
              <decoration slot="decoration" :decoration="{ left: [152] }" />
            </user-label>
          </grid-item>
          <!-- 基本信息 -->
          <grid-item :x="810" :y="303" :h="673" :w="301">
            <user-info
              :wkb-status="wkbStatus"
              :data="response.data && response.data.length ? response.data[selectIndex] : {}"
            ></user-info>
          </grid-item>
          <!-- 到店记录 -->
          <grid-item :x="1172" :y="251" :h="263" :w="137">
            <arrive-record
              :wkb-status="wkbStatus"
              :data="response.data && response.data.length ? response.data[selectIndex] : {}"
            ></arrive-record>
          </grid-item>
          <!-- 消费记录 -->
          <grid-item :x="1395" :y="251" :h="255" :w="475">
            <expense-record
              :wkb-status="wkbStatus"
              :data="response.data && response.data.length ? response.data[selectIndex] : {}"
            ></expense-record>
          </grid-item>
          <!-- 持有优惠券 -->
          <grid-item :x="1146" :y="524" :h="260" :w="290">
            <coupon
              :wkb-status="wkbStatus"
              :data="response.data && response.data.length ? response.data[selectIndex] : {}"
            ></coupon>
          </grid-item>
          <!-- 智能推荐 -->
          <grid-item :x="1455" :y="806" :h="204" :w="416">
            <recommend
              :wkb-status="wkbStatus"
              :data="response.data && response.data.length ? response.data[selectIndex] : {}"
            ></recommend>
          </grid-item>
          <!-- 用户价值 -->
          <grid-item :x="320" :y="626" :w="445" :h="384">
            <radar
              :data="response.data && response.data.length ? response.data[selectIndex] : {}"
              title="用户价值"
              :max="5"
            >
              <decoration slot="decoration" :decoration="{ left: [12], right: [29, 283] }" />
            </radar>
          </grid-item>
          <!-- 消费品类占比 -->
          <grid-item :x="1455" :y="525" :h="261" :w="415">
            <radar
              :data="response.data && response.data.length ? response.data[selectIndex] : {}"
              title="消费品类占比"
              :max="1"
            ></radar>
          </grid-item>
          <!-- 浏览记录 -->
          <grid-item :x="1146" :y="806" :h="201" :w="290">
            <browse-record
              :wkb-status="wkbStatus"
              :data="response.data && response.data.length ? response.data[selectIndex] : {}"
            ></browse-record>
          </grid-item>
        </div>
      </url-loader-table>
    </layout>
  </div>
</template>

<script>
  import Layout from '@/dss-store/src/components/layout/index.vue';
  import GridItem from '@/dss-store/src/components/layout/grid-item.vue';
  import UrlLoader from '@/dss-store/src/components/url-loader.js';
  import UrlLoaderTable from '@/dss-store/src/components/url-loader-table.js';
  import FlowList from './bz-cmps/flow-list.vue';
  import UserInfo from './bz-cmps/user-info.vue';
  import UserLabel from './bz-cmps/user-label.vue';
  import FlowPanel from './bz-cmps/flow-panel.vue';
  import AiTitle from './bz-cmps/ai-title.vue';
  import DecorativeBorder from './bz-cmps/decorative-border.vue';
  import Decoration from './bz-cmps/decoration.vue';
  import ArriveRecord from './bz-cmps/arrive-record.vue';
  import ExpenseRecord from './bz-cmps/expense-record.vue';
  import BrowseRecord from './bz-cmps/browse-record.vue';
  import Coupon from './bz-cmps/coupon.vue';
  import Recommend from './bz-cmps/recommend.vue';
  import Radar from './bz-cmps/radar.vue';
  import url from '@/dss-common/utils/url.js';

  export default {
    components: {
      Layout,
      GridItem,
      FlowList,
      UrlLoader,
      UrlLoaderTable,
      FlowPanel,
      UserInfo,
      UserLabel,
      AiTitle,
      DecorativeBorder,
      Decoration,
      ArriveRecord,
      ExpenseRecord,
      BrowseRecord,
      Coupon,
      Recommend,
      Radar,
    },
    data() {
      return {
        time: 500,
        wkbStatus: 0,
        selectIndex: 0,
        isStatic: false,
      };
    },

    mounted() {
      this.time = 500;
      this.wkbStatus = ~~url.queryString('wkbStatus');
    },
    methods: {
      setIndex(index, status) {
        this.selectIndex = index;
        this.isStatic = status;
      },
    },
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
    background: #1a1e37;
    z-index: 1999;
  }
</style>
