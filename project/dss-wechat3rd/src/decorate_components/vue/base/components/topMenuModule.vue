<template>
  <div class="top-menu-module">
    <div
      :style="{
        backgroundColor: dataSource.bgColor,
        height: dataSource.alignType === 'center' ? '100%' : '35px',
        'justify-content': dataSource.alignType === 'center' ? 'space-around' : 'flex-start',
        'flex-wrap': dataSource.alignType === 'center' ? 'wrap' : 'nowrap',
      }"
      class="top-menu-module-item-container"
    >
      <div
        v-for="(item, index) in dataSource.data"
        :key="index"
        :style="{ color: index === 0 ? dataSource.fontActiveColor : dataSource.fontColor }"
        class="top-menu-module-item"
      >
        <div :style="{ color: dataSource.titleColor ? dataSource.titleColor : 'rgba(255, 255, 255, 1)' }">
          {{ item.title }}
        </div>
        <div
          class="indecator"
          :style="{ 'background-color': dataSource.titleColor ? dataSource.titleColor : 'rgba(255, 255, 255, 1)' }"
          v-if="index === 0"
        ></div>
      </div>
    </div>
    <div v-if="type === 'custom'">
      <div v-for="(item, index) in screenSource" :key="index + 'Module'">
        <div class="screen-x" v-if="item.id !== 'pageInfoModule'">
          <div class="field" :is="item.id" :data-source.sync="item.config"></div>
        </div>
      </div>
    </div>
    <!-- <div v-else-if="type==='activity'">
      <activityModule></activityModule>
    </div>
    <div v-else>

    </div> -->
  </div>
</template>

<script>
  import service from '@/dss-wechat3rd/src/api/index.js';
  import { mapState } from 'vuex';
  export default {
    name: 'TopMenuModule',
    props: {
      dataSource: {
        type: Object,
        default: function () {
          return null;
        },
      },
    },

    data() {
      return {
        firstItemIndex: null,
        screenSource: null,
        activitySource: null,
        categorySource: null,
        type: null,
      };
    },
    computed: {
      ...mapState({
        curTemplateId: 'sellerTemplateId',
      }),
    },

    watch: {
      'dataSource.data': {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (
            newVal &&
            newVal.length &&
            ((this.firstItem && newVal[0].linkPage !== this.firstItem.linkPage) || !this.firstItem)
          ) {
            this.getFirstItemData(newVal[0]);
          }
        },
      },
    },

    methods: {
      getFirstItemData(val) {
        // if (!val.linkPage) return;
        this.type = val.linkType;
        if (val.linkType === 'custom') {
          const params = {
            sellerTemplateId: this.curTemplateId,
            index: val.linkPage,
          };
          service.getPageConfig(params).then(res => {
            this.firstItemIndex = val.linkPage;
            this.screenSource = JSON.parse(res.data.config);
          });
        } else if (val.linkType === 'activity') {
          this.activitySource = { activityId: val.linkPage };
        } else {
          this.categorySource = null;
        }
      },
    },
  };
</script>
<style lang="less">
  .top-menu-module {
    font-size: 0px;
    .top-menu-module-item-container {
      height: 35px;
      width: 100%;
      overflow-x: auto;
      white-space: nowrap;
      display: flex;
      .top-menu-module-item {
        display: inline-block;
        margin: 5px 10px;
        color: white;
        font-size: 15px;
        height: 21px;
        line-height: 21px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }
      .indecator {
        background-color: white;
        height: 2px;
        margin-top: 1px;
      }
    }
  }
</style>
