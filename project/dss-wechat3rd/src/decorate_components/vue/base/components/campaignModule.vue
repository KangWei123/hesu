<template>
  <div
    class="ky-activity-module"
    :style="{
      padding: dataSource.marginUpDown + 'px ' + dataSource.marginLeftRight + 'px',
      borderRadius: dataSource.radius + 'px',
    }"
  >
    <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
    <div class="ky-activity-module__content flex" v-if="dataSource.showType === decorateStyleEnum.SHOW_TYPE.horizon">
      <template v-if="list && list.length">
        <div v-for="item of list" :key="item.id" class="activity" :style="{ borderRadius: dataSource.radius + 'px' }">
          <img class="activity__header" :src="item.imgUrl" />
          <div class="activity__body">
            <span class="activity__name">
              <span :class="['activity__status', { active: +item.applyStatus === 2 }]">
                {{ item.applyStatusStr }}
              </span>
              {{ item.activityTitle }}</span
            >
          </div>
          <div class="activity__date">活动时间: {{ formatedDate(item) }}</div>
        </div>
      </template>
      <div v-else class="ky-activity-module__placeholder">点击编辑活动内容，图片建议尺寸260*140</div>
    </div>
    <!-- <div v-if="dataSource.showType === decorateStyleEnum.SHOW_TYPE.vertical"> -->
    <div class="ky-activity-module__content paddingleftRight" v-else>
      <template v-if="list && list.length">
        <div
          v-for="item of list"
          :key="item.id"
          class="vertical-item"
          :style="{ borderRadius: dataSource.radius + 'px' }"
        >
          <img class="vertical-header" :src="item.imgUrl" />
          <div class="vertical-body">
            <span class="vertical-name">
              <!-- item.applyStatus === 2 报名中 -->
              <span :class="['vertical-status', { active: +item.applyStatus === 2 }]">
                {{ item.applyStatusStr }}
              </span>
              {{ item.activityTitle }}</span
            >
          </div>
          <div class="vertical-date">活动时间: {{ formatedDate(item) }}</div>
        </div>
      </template>
      <div v-else class="ky-activity-module__placeholder">点击编辑活动内容，图片建议尺寸260*140</div>
    </div>
  </div>
</template>

<script>
  import TextNavModule from './textNavModule.vue';
  import api from '@/dss-wechat3rd/src/api/campaign';
  import date from '@/dss-wechat3rd/src/utils/date';
  import decorateStyleEnum from '@/dss-wechat3rd/src/constants/decorateStyleEnum.js';
  export default {
    name: 'CampaignModule',
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
        decorateStyleEnum,
        list: [],
      };
    },
    watch: {
      'dataSource.list': {
        immediate: true,
        async handler(value) {
          if (value && value.length) {
            const detail = await api.activity.getActivitiesByIds(value);
            this.list = detail;
          } else {
            this.list = [];
          }
        },
      },
    },
    methods: {
      formatedDate(item) {
        const list = item.itemDTOList;
        if (list && list.length) {
          return list
            .map(({ startTime, endTime }) => {
              const fs = date.format(new Date(startTime), 'MM/DD');
              const fe = date.format(new Date(endTime), 'MM/DD');
              if (fs === fe) {
                return fs;
              }
              return `${fs} - ${fe}`;
            })
            .join(', ');
        }
        return '待确定';
      },
    },
  };
</script>

<style scoped>
  .ky-activity-module {
    background: white;
  }

  .ky-activity-module__content {
    width: 100%;
    overflow-x: hidden;
    padding-bottom: 10px;
  }

  .flex {
    display: flex;
  }

  .activity {
    width: 233px;
    flex-shrink: 0;
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .activity__header {
    height: 126px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    object-fit: cover;
    border-radius: 5px;
  }

  .activity__body {
    font-size: 15px;
    margin-top: 10px;
    flex: 1;
  }

  .activity__status {
    font-size: 11px;
    padding: 1px 2px;
    border-radius: 3px;
    color: white;
    background-color: #d7d5d5;
    text-align: center;
    margin-right: 5px;
  }

  .activity__status.active {
    background-color: #4ee2b6;
  }

  .activity__name {
    -webkit-line-clamp: 2;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
  }

  .activity__date {
    font-size: 13px;
    color: #7b8798;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-top: 8px;
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

  .paddingleftRight {
    padding: 0 15px;
  }

  .vertical-item {
    border-radius: 10px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.12);
    overflow: hidden;
    margin-bottom: 15px;
    font-size: 0;
    padding-bottom: 10px;
  }

  .vertical-header {
    width: 100%;
    height: 185px;
    object-fit: cover;
  }

  .vertical-body {
    margin-top: 10px;
    padding: 0 10px;
  }

  .vertical-name {
    -webkit-line-clamp: 2;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    font-size: 14px;
    font-weight: 500;
    color: #33373e;
    vertical-align: middle;
  }

  .vertical-status {
    font-size: 11px;
    padding: 3px 4px;
    border-radius: 5px;
    color: white;
    background-color: #d7d5d5;
    text-align: center;
    margin-right: 5px;
  }

  .vertical-status.active {
    background-color: #4ee2b6;
  }

  .vertical-date {
    font-size: 12px;
    color: #8893a6;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-top: 5px;
    font-weight: 400;
    padding: 0 10px 0 28px;
    background: url('../images/time.png') no-repeat 10px 50%;
    background-size: 11px 11px;
  }
</style>
