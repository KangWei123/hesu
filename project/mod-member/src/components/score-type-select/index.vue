<template>
  <el-select v-bind="$props" v-on="$listeners" clearable :disabled="isDisabled()">
    <el-option
      v-for="item in list"
      :key="item.eventKey"
      :disabled="disabledItem(item)"
      :label="item.eventName"
      :value="item.eventKey"
    >
      <span style="display: inline-block; width: 100%" @click="handleOpention(item)">{{ item.eventName }}</span>
    </el-option>
  </el-select>
</template>

<script>
  import { Select } from 'element-ui';
  import memberApi from '@/mod-member/src/api/memberAPI';

  const eventList = {};

  /**
   * 积分动作选择器
   * 注意：积分动作等价于积分类型
   */
  export default {
    name: 'ScoreTypeSelect',
    props: {
      ...Select.props,
      /**
       * 积分动作的类型, 可以是 0: 混合  1: give  2: consume
       * 默认混合类型
       */
      source: {
        type: Number,
        default: 0,
      },
      disabledItem: {
        type: Function,
        default: item => false,
      },
      // 是否可编辑  true：不可编辑； false：可编辑
      isDisabled: {
        type: Function,
        default: () => false,
      },
      /**
       * 是否从后台接口请求获取积分动作列表
       */
      remote: {
        type: Boolean,
        default: false,
      },
      /**
       * 是否过滤系统事件
       */
      filterSystemEvent: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        list: [],
      };
    },
    mounted() {
      this.fetchList();
    },
    methods: {
      async fetchList() {
        if (this.remote) {
          let res;
          // 接口请求积分动作列表
          if (this.globalIsUmpPlatformApp) {
            res = await memberApi.scoreCenter.eventList({
              eventType: this.source,
              exist: 1,
            });
          } else {
            res = await memberApi.scoreCenter.eventUmpPlatList({
              ruleType: this.source,
            });
          }
          // 是否过滤系统事件
          this.list = this.filterSystemEvent ? res.data.filter(i => i.sysEventStatus !== 1) : res.data;
        } else {
          if (!eventList[this.source]) {
            const { data } = await memberApi.scoreCenter.allEvent({ eventType: this.source });
            eventList[this.source] = this.filterSystemEvent ? data.filter(i => i.sysEventStatus !== 1) : data;
          }
          this.list = eventList[this.source];
        }
      },
      handleOpention(item) {
        this.$emit('getOpentionId', item);
      },
    },
  };
</script>

<style></style>
