<template>
  <div class="group-management">
    <div class="wkt-opt-label-container">
      <div class="filter-field">
        <span>活动名称：</span>
        <el-input v-model="activityName" placeholder="输入活动名称" />
      </div>

      <div class="filter-field" v-if="!singleStore">
        <span>活动门店：</span>
        <store-select
          :select-stores.sync="selectStores"
          :show-dept="isEnterManger"
          :show-store="!isEnterManger"
          class="store-select"
        />
      </div>
    </div>

    <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="group-list-box">
      <el-tab-pane v-for="tab in tabs" :lazy="true" :label="tab.label" :name="tab.name" :key="tab.name">
        <group-list
          :status="tab.status"
          :activity-name="activityName"
          :activity-id="activityId"
          :store-ids="selectStores.join(',')"
        ></group-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import GroupList from './List.vue';
import { groupStatus } from '@/dss-wechat3rd/src/constants/enum.js';
import StoreSelect from '@/dss-wechat3rd/src/bz_components/store-select-dialog/simple-cascader';

export default {
  components: {
    GroupList,
    StoreSelect
  },

  computed: {
    ...mapState({
      roleList: 'roleList',
      userInfo: 'userInfo',
      epStoreList: 'storeList'
    }),

    singleStore() {
      return this.epStoreList && this.epStoreList.length === 1 && this.isStoreKeeper;
    },

    // 店长角色
    isStoreKeeper() {
      return !!~this.roleList.split(',').indexOf('common_role_storeKeeper');
    },

    // key管/企业管理员享有相同权限
    isEnterManger() {
      return (
        !!~this.roleList.split(',').indexOf('common_role_enterprise') ||
        !!~this.roleList.split(',').indexOf('common_role_admin')
      );
    }
  },

  data() {
    return {
      // 拼团状态
      tabs: [
        { name: 'all', label: '全部', status: [] },
        { name: 'doing', label: '拼团中', status: [groupStatus.ON_PROGRESS] },
        {
          name: 'successed',
          label: '拼团成功',
          status: [groupStatus.SUCCESS]
        },
        {
          name: 'failed',
          label: '拼团失败',
          status: [groupStatus.REFUND_COMPLETED, groupStatus.REFUNDING, groupStatus.FAILED]
        }
      ],
      // 当前激活的状态
      activeTab: 'all',
      activityName: '',
      activityId: null,
      selectStores: []
    };
  },

  watch: {
    activityName() {
      this.activityId = null;
    }
  },

  created() {
    const query = this.$route.query;
    if (query && query.activityId) {
      this.activityId = parseInt(query.activityId);
    }
  },

  methods: {
    handleTabClick() {}
  }
};
</script>

<style lang="less">
.group-management {
  .group-management-search {
    margin: 10px 0 0 20px;
  }
  .wkt-opt-label-container {
    padding-left: 20px;
    padding-bottom: 16px;
  }
  .group-list-box {
    background: transparent;
    border-radius: 4px;
    padding: 20px 0px 0px 0px;
    .el-tabs__header {
      margin-left: 20px;
      .el-tabs__nav-wrap::after {
        background: #f5f7fa;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.wkt-opt-label-container {
  display: flex;

  .filter-field {
    & > span {
      margin-right: 8px;
      word-break: keep-all;
    }

    margin-right: 24px;
    color: #333;
    display: flex;
    line-height: 30px;
  }
}
</style>

