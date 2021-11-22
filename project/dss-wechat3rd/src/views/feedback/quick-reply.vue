<template>
  <list-page-layout>
    <template #sub-actions>
      <div class="table-top">
        <span>配置快捷回复</span>
        <el-button type="primary" @click="$refs.editor.show()">新增</el-button>
      </div>
    </template>
    <fat-table
      ref="table"
      class="wkb-table-border"
      :fetch-handler="handleFetch"
      :remove-handler="handleRemove"
      remove-confirm-title="删除"
      remove-confirm-message="是否确认删除该快捷回复"
      row-key="id"
    >
      <el-table-column label="回复类型" prop="replyType"></el-table-column>
      <el-table-column label="回复内容" prop="replyContant"></el-table-column>
      <el-table-column label="操作" align="right" v-slot="scope">
        <table-actions
          :options="[
            {
              name: '编辑',
              onClick: () => {
                $refs.editor.show(scope.row, true);
              },
            },
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

    <quick-reply-dialog ref="editor" @update="$refs.table.refresh()" />
  </list-page-layout>
</template>

<script>
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  import feedBackApi from '@/dss-wechat3rd/src/api/feedback';
  import QuickReplyDialog from './quick-reply-dialog.vue';

  export default {
    components: {
      ListPageLayout,
      FatTable,
      TableActions,
      QuickReplyDialog,
    },
    data() {
      return {};
    },
    methods: {
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;

        // 请求参数
        const payload = {
          typeStatus: 1,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        const { data, totalCount } = await feedBackApi.getQuickReplyList(payload);

        return {
          list: data,
          total: totalCount,
        };
      },
      async handleRemove(ids) {
        return feedBackApi.deleteQuickFeedBack({ id: ids[0] });
      },
    },
  };
</script>
<style lang="less" scoped>
  .table-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    color: #303133;
    line-height: 26px;
  }
</style>
