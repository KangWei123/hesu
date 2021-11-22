<template>
  <div class="level">
    <header v-if="!info.isMaxLevel" class="title">
      距离{{ info.nextLevelName }}还差 <span style="color: #fa7c21">{{ info.nextLevelGrowthValue }}</span> 成长值
    </header>
    <div class="timeline-wrapper">
      <i :class="['timeline-left', 'el-icon-caret-left', { disabled: !canGoLeft }]" @click="handleLeft"></i>
      <i :class="['timeline-right', 'el-icon-caret-right', { disabled: !canGoRight }]" @click="handleRight"></i>

      <div class="timeline" ref="timeline" @scroll="handleScroll">
        <div
          :class="['timeline__item', { ready }]"
          :style="{ width: timelineWidth + 'px' }"
          v-for="(item, idx) of list"
          :key="idx"
        >
          <div :class="['timeline__line', { unreach: item.type === RecordType.Next }]"></div>
          <div class="timeline__icon">
            <img :src="ICONS[item.type]" />
          </div>
          <div class="timeline__name" style="color: #ff6a1e">
            {{ item.targetLevelName }}
            <!--<i class="icon el-icon-success" style="color: #52c41a"></i> -->
          </div>
          <div v-if="item.createTime" class="timeline__date">
            <div>{{ item.createTime | dateFormat }}</div>
            <div>{{ item.createTime | timeFormat }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成长值记录 -->
    <infinite-scroll-list class="logs" :fetch-handler="handleGrowthListFetch">
      <template #default="scope">
        <div class="log" v-for="i of scope.list" :key="i.id">
          <div class="log__date">{{ i.createdTime.slice(0, -3) }}</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="log__content" v-html="i.desc"></div>
        </div>
      </template>
    </infinite-scroll-list>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce';
  import api from '@/mod-member/src/api/memberAPI';
  import date from '@/dss-common/utils/date';
  import InfiniteScrollList from '@/dss-common/components/infinite-scroll-list';

  import FirstIcon from './first.svg';
  import UpgradeIcon from './upgrade.svg';
  import DowngradeIcon from './downgrade.svg';
  import KeepIcon from './keep.svg';
  import NextIcon from './next.svg';

  const RecordType = {
    Keep: 0,
    Upgrade: 1,
    DownGrade: 2,
    First: 3, // 首次接触，前端自定义
    Next: 4, // 下一个级别，前端自定义
  };

  /**
   * 图标
   */
  const ICONS = {
    [RecordType.First]: FirstIcon,
    [RecordType.Keep]: KeepIcon,
    [RecordType.Upgrade]: UpgradeIcon,
    [RecordType.DownGrade]: DowngradeIcon,
    [RecordType.Next]: NextIcon,
  };

  const MIN_WIDTH = 145;

  export default {
    name: 'Level',
    components: {
      InfiniteScrollList,
    },
    props: {
      info: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        ICONS,
        ready: false,
        RecordType,
        timelineWidth: MIN_WIDTH,
        canGoLeft: false,
        canGoRight: false,
        list: [],
      };
    },
    mounted() {
      this.fetchList();
      this.calculateTimelineWidth();
      const resizeListener = debounce(this.calculateTimelineWidth, 500);
      window.addEventListener('resize', resizeListener);
      this.globalAddRelease(() => window.removeEventListener('resize', resizeListener));
      setTimeout(() => {
        this.handleScroll();
      }, 1000);
    },
    methods: {
      async fetchList() {
        const { data } = await api.memberCenter.getLevelRecords({
          uniqueAccountId: this.info.uniqueAccountId,
          pageNo: 1,
          pageSize: 1000,
        });
        const normalized = [
          // 首次接触
          {
            type: RecordType.First,
            targetLevelName: data && data[0] ? data[0].srcLevelName : this.info ? this.info.levelName : '普通会员',
            targetLevelId: -1,
            createTime: this.info.registerTime,
          },
          ...data,
        ].map(i => {
          if (i.createTime) {
            i.createTime = date.parse(i.createTime);
          }
          return i;
        });

        // 下一个等级
        if (!this.info.isMaxLevel) {
          normalized.push({
            type: RecordType.Next,
            targetLevelId: -2,
            targetLevelName: this.info.nextLevelName,
          });
        }

        this.list = normalized;
        setTimeout(() => {
          const el = this.$refs.timeline;
          if (!el) {
            return;
          }
          el.scrollLeft = el.scrollWidth;
        }, 1000);
      },
      // 获取成长值记录
      async handleGrowthListFetch(params) {
        const { data } = await api.memberCenter.getGrowthRecords({
          ...params,
          uniqueAccountId: this.info.uniqueAccountId,
        });
        return data;
      },
      calculateTimelineWidth() {
        const el = this.$refs.timeline;
        if (el) {
          this.timelineWidth = Math.max(el.offsetWidth / 6, MIN_WIDTH);
        }
        this.ready = true;
      },
      handleScroll() {
        const el = this.$refs.timeline;
        if (el == null) {
          return;
        }
        this.canGoLeft = el.scrollLeft !== 0;
        this.canGoRight = el.scrollLeft + el.offsetWidth < el.scrollWidth;
      },
      handleLeft() {
        const el = this.$refs.timeline;
        if (el == null || !this.canGoLeft) {
          return;
        }
        el.scrollLeft -= this.timelineWidth;
      },
      handleRight() {
        const el = this.$refs.timeline;
        if (el == null || !this.canGoRight) {
          return;
        }
        el.scrollLeft += this.timelineWidth;
      },
    },
  };
</script>

<style scoped lang="less">
  .level {
    .title {
      font-size: 16px;
      color: #303133;
      margin-left: 28px;
      font-weight: 600;
    }

    .timeline-wrapper {
      width: 100%;
      height: 195px;
      position: relative;
      padding: 25px;
      box-sizing: border-box;
      overflow: hidden;
    }

    .timeline-left,
    .timeline-right {
      position: absolute;
      top: 30%;
      font-size: 42px;
      color: #b1b5bd;
      transform: translateY(-50%);
      cursor: pointer;

      &.disabled {
        opacity: 0.4;
      }
    }

    .timeline-left {
      left: 0;
    }

    .timeline-right {
      right: 0;
    }

    .timeline {
      width: 100%;
      height: 188px;
      overflow: auto;
      display: flex;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      box-sizing: border-box;

      &__item {
        position: relative;
        box-sizing: border-box;
        flex-shrink: 0;
        display: none;
        flex-direction: column;
        align-items: center;
        padding: 0 30px;
        scroll-snap-align: start;

        &.ready {
          display: flex;
        }
      }

      &__line {
        display: none;
        height: 1px;
        width: 100%;
        position: absolute;
        top: 33px;
        left: 50%;
        overflow: hidden;

        &::after {
          content: '';
          display: block;
          width: 100%;
          border-top: 2px dashed #ff6a1e;
        }

        &.unreach::after {
          border-color: #979797;
        }
      }

      &__item:not(:last-child) > .timeline__line {
        display: block;
      }

      &__icon {
        position: relative;
        padding: 5px;
        text-align: center;
        z-index: 1;

        & > img {
          width: 60px;
          height: 60px;
          border-radius: 60px;
        }
      }

      &__name {
        font-size: 14px;
        margin-top: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;

        & > .icon {
          margin-left: 5px;
        }
      }

      &__date {
        font-size: 12px;
        color: #717378;
        margin-top: 8px;
        text-align: center;
      }
    }

    .logs {
      border-top: 1px solid #dce1e6;
      padding: 16px 28px;
      margin-top: 16px;
      max-height: 275px;
      overflow: auto;
    }

    .log {
      display: flex;
      font-size: 14px;
      color: #717378;
      line-height: 28px;

      &__date {
        width: 125px;
        white-space: nowrap;
      }

      &__content {
        margin-left: 24px;
      }
    }
  }
</style>
