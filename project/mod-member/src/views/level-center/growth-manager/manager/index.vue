<template>
  <list-page-layout>
    <template #main-actions>
      <el-button class="main-actions-button" type="primary" @click="addGrowth">+ 新增成长值</el-button>
    </template>
    <template #filters v-if="globalIsUmpPlatformApp">
      <el-form ref="form" :model="form" @submit.prevent.native="$refs.table.search()" inline>
        <el-form-item label="选择应用" prop="appId">
          <app-select
            v-model="form.appId"
            clearable
            need-all-app
            @allAppData="getAppsName"
            placeholder="请选择应用"
          ></app-select>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.form.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table ref="table" :fetch-handler="handleFetch" :remove-handler="handleRemove" :state.sync="form" row-key="id">
      <el-table-column align="center" prop="appId" label="应用" v-if="globalIsUmpPlatformApp">
        <template slot-scope="scope">{{ appsName.get(scope.row.appId) }}</template>
      </el-table-column>
      <el-table-column align="center" label="适用项目">
        <template #default="{ row }">
          <el-tooltip :content="row.storeNames">
            <div class="clamp2">{{ row.storeNames }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="ftype" label="获取方式">
        <template #default="{ row }">
          <el-tooltip :content="row.configText">
            <div class="clamp2">{{ row.configText }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="limitPerMonth" label="月获取上限">
        <template slot-scope="{ row }">{{ row.limitPerMonth || '无限制' }}</template>
      </el-table-column>
      <el-table-column align="center" prop="createBy" label="创建人"> </el-table-column>
      <el-table-column align="center" label="操作" v-slot="scope">
        <table-actions
          :options="[
            {
              name: '编辑',
              link: { path: '/level-center/growth-mgr/add-growth', query: { status: 1, id: scope.row.id } },
            },
            {
              name: '删除',
              onClick: () => $refs.table.remove(scope.row.id),
            },
          ]"
        ></table-actions>
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import memberApi from '@/mod-member/src/api/memberAPI';
  import AppSelect from '@/business-common/components/app-select';
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  import { SCORE_EVENT_DESC } from '../add-growth/score-event';

  export default {
    name: 'Manager',
    components: {
      ListPageLayout,
      FatTable,
      AppSelect,
      TableActions,
    },
    data() {
      return {
        form: {
          appId: '',
        },
        appsName: new Map(),
      };
    },
    methods: {
      async handleFetch({ pagination: { currentPage: pageNo, pageSize } }) {
        const params = {
          ...this.form,
          pageSize,
          pageNo,
        };
        const { data, totalCount } = await memberApi.growthConfig.getConfigList(params);

        return {
          list: (data || []).map(this.formatConfigs),
          total: totalCount,
        };
      },
      handleRemove(ids) {
        return memberApi.growthConfig.deleteConfig({ id: ids[0] });
      },
      addGrowth() {
        this.$router.push({
          path: '/level-center/growth-mgr/add-growth',
          query: { status: 0 },
        });
      },
      formatConfigs(item) {
        const text = [];
        item.configs.forEach(
          v => v.value && SCORE_EVENT_DESC.has(v.eventCode) && text.push(SCORE_EVENT_DESC.get(v.eventCode))
        );

        item.configText = text.join(',');
        return item;
      },
      async getAppsName(apps) {
        apps.forEach(app => this.appsName.set(app.id, app.appName));
        await this.$nextTick();
        this.$forceUpdate();
      },
    },
  };
</script>

<style lang="less">
  @import '../index.less';

  .main-actions-button {
    height: 36px;
    border-radius: 4px;
  }

  .clamp2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
</style>
