<template>
  <list-page-layout>
    <template #main-actions>
      <el-button type="primary" @click="inputamount">新增积分规则</el-button>
    </template>
    <template #filters>
      <el-form
        ref="query"
        @submit.prevent.native="$refs.table.search()"
        :model="form"
        inline
        label-width="80px"
        label-suffix=":"
      >
        <el-form-item label="活动名称" prop="ruleName">
          <el-input
            class="w220"
            clearable
            v-model.trim="form.ruleName"
            maxlength="18"
            placeholder="请输入活动名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table
      ref="table"
      :fetch-handler="handleFetch"
      :state.sync="form"
      row-key="id"
      remove-confirm-message="删除后，可能会导致部分商户或经营分类下的商户的线下消费无法获得积分，请谨慎删除"
      remove-confirm-title="删除"
      :remove-handler="handleRemove"
    >
      <el-table-column label="活动名称" width="200" prop="ruleName"> </el-table-column>
      <el-table-column label="适用项目" min-width="200" prop="storeName"> </el-table-column>
      <el-table-column label="适用经营类目" min-width="240" prop="categoriesList">
        <template slot-scope="scope">
          {{ (scope.row.categoriesList || []).join('、') }}
        </template>
      </el-table-column>
      <el-table-column label="适用商户" width="240" prop="subStoreList">
        <template slot-scope="scope">
          {{ (scope.row.subStoreList || []).join('、') }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="200" prop="createBy"></el-table-column>
      <el-table-column label="操作" v-slot="scope" width="120" align="center">
        <table-actions
          :options="[
            {
              name: '编辑',
              onClick: () => {
                $router.push({
                  path: '/largeMemScore/rule/edit',
                  query: { id: scope.row.id },
                });
              },
            },
            {
              name: '删除',
              onClick: () => {
                $refs.table.remove(scope.row.id);
              },
            },
          ]"
        >
        </table-actions>
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import * as listPageComponents from '@/dss-common/components/list-page';
  import api from '../../../api/large-mem-score';

  export default {
    name: 'Index',
    components: { ...listPageComponents },
    data() {
      return {
        open: false, // 规则启用状态
        disabledOpen: false, // 能否开启规则
        loading: false,
        form: {
          ruleName: '',
        },
        revoke: {
          remark: '',
        },
        pageParams: {
          pageSize: 10, // 每页条数
          pageNo: 1, // 页数
        },
      };
    },
    methods: {
      getParams() {
        const params = {
          ...this.form,
          ...this.pageParams,
        };
        return params;
      },
      async handleFetch(params) {
        const { pagination } = params;
        this.pageParams = { pageNo: pagination.currentPage, pageSize: pagination.pageSize };

        const filterParams = this.getParams();
        const res = await api.rule.list(filterParams);

        return {
          list: res.data || [],
          total: res.totalCount,
        };
      },
      async handleRemove(ids) {
        return api.rule.delete({ id: ids[0] });
      },
      // 编辑积分规则
      inputamount() {
        this.$router.push('/largeMemScore/rule/edit');
      },
    },
  };
</script>
<style lang="less" scoped>
  /deep/.el-button--text {
    color: #1890ff;
  }

  /deep/.danger.el-button--text {
    color: #f56c6c;
  }
</style>
