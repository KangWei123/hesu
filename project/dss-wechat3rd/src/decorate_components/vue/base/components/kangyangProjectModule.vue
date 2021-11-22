<template>
  <div
    class="ky-project-module"
    :style="{
      padding: dataSource.marginUpDown + 'px ' + dataSource.marginLeftRight + 'px',
      borderRadius: dataSource.radius + 'px',
    }"
  >
    <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
    <div class="ky-project-module__content">
      <template v-if="list && list.length">
        <div v-for="item of list" :key="item.id" class="project">
          <div class="project__header" :style="{ backgroundImage: `url(${item.bannerUrl})` }"></div>
          <div class="project__body">
            <div class="project__name">{{ item.prjName }}</div>
            <div class="project__labels">
              <div
                v-for="(label, index) of item.labelList"
                :key="index"
                class="project__label"
                :style="{ background: label.background, color: label.foreground }"
              >
                {{ label.name }}
              </div>
            </div>
            <div class="project__loc">
              <img :src="locationIcon" />
              <span>{{ item.address }}</span>
            </div>
            <div class="project__footer">
              <div class="project__meta">
                <div>总面积: {{ item.floorArea }} m²</div>
                <div>床位: {{ item.totalBed }} 个</div>
              </div>
              <div class="project__price">
                约<span>{{ item.lessPrice }} 元</span>/月起
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="ky-activity-module__placeholder">点击编辑活动内容</div>
    </div>
  </div>
</template>

<script>
  import TextNavModule from './textNavModule.vue';
  import { projectApi } from '@/register/kangyang';
  import locationIcon from '@/dss-wechat3rd/src/images/location.png';

  /**
   * 项目列表
   */
  export default {
    name: 'KangyangProjectModule',
    components: {
      TextNavModule,
    },
    props: {
      dataSource: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        locationIcon,
        list: [],
      };
    },
    watch: {
      'dataSource.list': {
        immediate: true,
        async handler(value) {
          if (value && value.length) {
            const { data } = await projectApi.getIdsList(value);
            this.list = data;
          } else {
            this.list = [];
          }
        },
      },
    },
    methods: {},
  };
</script>

<style scoped>
  .ky-project-module {
    background: linear-gradient(0, #f1f4f9, white);
    overflow: hidden;
  }

  /* .ky-project-module__content {
  padding: 0 15px;
} */

  .project {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
  }

  .project:last-child {
    margin-bottom: 0;
  }

  .project__header {
    width: 100%;
    height: 164px;
    background-size: cover;
  }

  .project__name {
    font-size: 16px;
    margin-bottom: 5px;
  }

  .project__body {
    padding: 5px 10px 10px;
  }

  .project__labels {
    font-size: 13px;
  }

  .project__label {
    display: inline-block;
    padding: 1px 6px;
    margin-right: 5px;
    margin-bottom: 5px;
    border-radius: 2px;
  }

  .project__loc >>> img {
    width: 13px;
    height: 13px;
    object-fit: contain;
  }

  .project__loc {
    display: flex;
    align-items: center;
    margin-bottom: 7px;
    font-size: 14px;
    color: #468bff;
  }

  .project__loc span {
    margin-left: 6px;
  }

  .project__footer {
    display: flex;
    padding-top: 8px;
    border-top: 1px solid #dde3ec;
  }

  .project__meta {
    font-size: 12px;
    color: #7b8798;
  }

  .project__price {
    flex: 1;
    color: #ff8400;
    font-size: 14px;
    text-align: right;
    padding-top: 5px;
  }

  .project__price >>> span {
    font-size: 1.5em;
  }

  .ky-activity-module__placeholder {
    height: 222px;
    width: 100%;
    background: #4e7be5;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
</style>
