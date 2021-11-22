<template>
  <list-page-layout>
    <template #main-actions>
      <el-button type="primary" @click="Add">新增经营类目</el-button>
    </template>
    <template #filters>
      <el-form inline :model="toolForm" ref="toolForm" @submit.prevent.native="$refs.table.search()" label-suffix=":">
        <el-form-item label="经营类目" prop="fuzzyCategoryName">
          <el-input
            class="w220"
            placeholder="搜索经营类目"
            v-model.trim="toolForm.fuzzyCategoryName"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.toolForm.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table
      ref="table"
      :fetch-handler="handleFetch"
      :remove-handler="handleRemove"
      :remove-confirm-message="removeConfirmMessage"
      row-key="id"
      :state.sync="toolForm"
    >
      <el-table-column label="经营类目名称" prop="categoryName" align="left"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="left"></el-table-column>
      <el-table-column label="操作人" align="left">
        <template slot-scope="scope">
          <div>{{ scope.row.operatorName }}</div>
          <div>{{ scope.row.operatorPhone }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" v-slot="scope">
        <table-actions :options="tableActions(scope.row)" />
      </el-table-column>
    </fat-table>
    <category-list-add
      v-if="showCategoryListAdd"
      :visible.sync="showCategoryListAdd"
      :show-category-list-add="showCategoryListAdd"
      @closedialog="closedialog"
      :dialog="dialog"
    ></category-list-add>
  </list-page-layout>
</template>

<script>
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  import CategoryListAdd from '@/dss-wechat3rd/src/components/category-list-dialog/add.vue';
  import api from '@/dss-wechat3rd/src/api/category';

  export default {
    components: { ListPageLayout, FatTable, TableActions, CategoryListAdd },
    data() {
      return {
        // 过滤区
        toolForm: {
          fuzzyCategoryName: '',
        },
        // 弹窗数据
        dialog: {
          title: '',
          value: '',
          id: '',
        },
        // 弹窗显示
        showCategoryListAdd: false,
        // 删除弹窗提示
        removeConfirmMessage: '请确认该经营分类下是否存在商户，删除后将无法通过经营分类查询到对应商户，请谨慎操作',
      };
    },
    methods: {
      // 根据当前页码数以及最大列表容量数获取列表
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;
        // 传给后台的参数
        const payload = {
          ...this.toolForm,
          id: this.dialog.id,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          searchCount: true,
          sortingFields: [
            {
              asc: true,
              column: '',
            },
          ],
        };
        // 获取列表数据
        const { data, totalCount } = await api.category.list(payload);
        return {
          list: data,
          total: totalCount,
        };
      },
      // 删除
      async handleRemove(ids) {
        return api.category.delete({ id: ids[0] });
      },
      // 显示弹窗
      Add() {
        this.dialog.title = '新增经营类目';
        this.showCategoryListAdd = true;
      },
      // 关闭弹窗
      closedialog() {
        this.showCategoryListAdd = false;
        // 清空弹窗数据
        this.dialog = {
          title: '',
          value: '',
          id: '',
        };
        // 刷新页面
        this.$refs.table.refresh();
      },
      // 操作功能
      tableActions(row) {
        return [
          {
            name: '编辑',
            // 显示编辑弹窗
            onClick: () => {
              this.dialog = {
                title: '编辑经营类目',
                value: row.categoryName,
                id: row.id,
              };
              this.showCategoryListAdd = true;
            },
          },
          {
            name: '删除',
            // 显示删除弹窗
            onClick: () => {
              this.$refs.table.remove(row.id);
            },
          },
        ];
      },
    },
  };
</script>

<style lang="less" scoped>
  /deep/ .list-page__filter .el-form {
    .el-form-item {
      .el-form-item__content {
        .el-input {
          input {
            // padding: 0 30px 0 30px;
          }
        }
      }
    }
  }
</style>
>
