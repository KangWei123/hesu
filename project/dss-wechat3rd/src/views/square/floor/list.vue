<template>
  <list-page-layout>
    <template #main-actions>
      <el-button type="primary" @click="onToAdd">新增楼栋</el-button>
    </template>
    <template #filters>
      <el-form ref="query" @submit.prevent.native="$refs.table.search()" :model="form" inline label-suffix=":">
        <el-form-item label="楼栋信息" prop="fuzzyName">
          <el-input
            class="w220"
            clearable
            v-model.trim="form.fuzzyName"
            maxlength="18"
            placeholder="请输入楼栋"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table
      ref="table"
      class="wkb-table-border"
      :state.sync="form"
      :fetch-handler="handleFetch"
      :remove-handler="handleRemove"
      remove-confirm-message="请确认该楼层下是否存在商户，删除后将无法通过楼层查询到对应商户，请谨慎操作。"
      row-key="id"
    >
      <el-table-column label="楼栋" prop="name"></el-table-column>
      <el-table-column label="楼层" v-slot="{ row }">{{ onFloor(row.floor) }}</el-table-column>
      <el-table-column label="操作人">
        <template slot-scope="scope">
          <p>{{ scope.row.operatorName || '未知' }}</p>
          <p>{{ scope.row.operatorPhone || '未知' }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="right" v-slot="scope">
        <table-actions
          :options="[
            { name: '编辑', link: { path: '/square/floor/edit', query: { id: scope.row.id } } },
            {
              name: '删除',
              onClick: () => {
                $refs.table.remove(scope.row.id);
              },
            },
          ]"
        />
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  import merchantApi from '@/dss-wechat3rd/src/api/merchant';

  export default {
    components: {
      ListPageLayout,
      FatTable,
      TableActions,
    },
    data() {
      return {
        form: {
          fuzzyName: null,
        },
      };
    },
    computed: {
      onFloor() {
        return rowJson => {
          const arr = JSON.parse(rowJson || '{}');
          let str = '';
          arr.forEach((e, index) => {
            str += `${e.name}${index === arr.length - 1 ? '' : '、'}`;
          });
          return str;
        };
      },
    },
    methods: {
      onToAdd() {
        this.$router.push('/square/floor/edit');
      },
      async handleRemove(ids) {
        return merchantApi.floor.deleteFloor({ id: ids[0] });
      },
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;
        const filterParams = {
          ...this.form,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        const res = await merchantApi.floor.queryFloor(filterParams);
        return {
          list: res.data || [],
          total: res.totalCount,
        };
      },
    },
  };
</script>
