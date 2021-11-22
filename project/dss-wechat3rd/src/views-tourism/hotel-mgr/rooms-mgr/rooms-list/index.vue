<template>
  <mgr-list-table
    ref="list"
    :mgrType="hotelType"
    mgrShelfPageUrl="/hotel-mgr/rooms-mgr/operation-shelves"
    mgrDetailPageUrl="/hotel-mgr/rooms-mgr/detail"
    mgrCreatePageUrl="/hotel-mgr/rooms-mgr/create"
  ></mgr-list-table>
</template>

<script>
import mgrTypeEnum from '@/dss-wechat3rd/src/constants/mgrTypeEnum.js';
import MgrListTable from '@/dss-wechat3rd/src/components/mgr/mgr-list-table.vue';

export default {
  name: 'rooms-list',
  components: {
    MgrListTable
  },
  data() {
    return {
      hotelType: mgrTypeEnum.hotel
    };
  },

  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.getMgrList(); // 获取商品列表
    });
  }
};
</script>
