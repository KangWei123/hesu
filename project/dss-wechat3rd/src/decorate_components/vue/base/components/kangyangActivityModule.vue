<template>
  <div
    class="ky-activity-module"
    :style="{
      padding: dataSource.marginUpDown + 'px ' + dataSource.marginLeftRight + 'px',
      borderRadius: dataSource.radius + 'px',
    }"
  >
    <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
    <div class="ky-activity-module__content">
      <template v-if="list && list.length">
        <div v-for="item of list" :key="item.id" class="activity">
          <img class="activity__header" :src="item.coverImg" />
          <div class="activity__body">
            <span class="activity__name">
              <span :class="['activity__status', { active: item.activityStatus == ActivityStatus.Doing }]">{{
                ActivityStatusName[item.activityStatus]
              }}</span>
              {{ item.name }}</span
            >
          </div>
          <div class="activity__date">活动时间: {{ formatedDate(item) }}</div>
        </div>
      </template>
      <div v-else class="ky-activity-module__placeholder">点击编辑活动内容，图片建议尺寸260*140</div>
    </div>
  </div>
</template>

<script>
  import TextNavModule from './textNavModule.vue';
  import { activityApi } from '@/register/kangyang';
  import { ActivityStatusName, ActivityStatus } from '@/dss-wechat3rd/src/constants/kangyangEnum';
  import date from '@/dss-wechat3rd/src/utils/date';

  export default {
    name: 'KangyangActivityModule',
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
        ActivityStatusName,
        ActivityStatus,
        list: [],
      };
    },
    watch: {
      'dataSource.list': {
        immediate: true,
        async handler(value) {
          if (value && value.length) {
            const { data } = await activityApi.getIdsList(value);
            this.list = data;
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
    background: #f1f4f9;
  }

  .ky-activity-module__content {
    display: flex;
    width: 100%;
    overflow-x: hidden;
    padding-bottom: 10px;
    background: white;
  }

  .activity {
    width: 233px;
    flex-shrink: 0;
    margin-left: 15px;
    display: flex;
    flex-direction: column;
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
    font-size: 12px;
    padding: 2px 5px;
    border-radius: 3px;
    color: white;
    background: linear-gradient(90deg, #d7d5d5 3%, #babbba 99%);
    text-align: center;
    margin-right: 5px;
  }

  .activity__status.active {
    background: linear-gradient(90deg, #4ee2b6, #30cd9e);
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
</style>
