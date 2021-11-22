<template>
  <list-page-layout>
    <template #sub-actions>
      <div class="table-top">
        <span>配置快捷回复</span>
        <el-button type="primary" @click="handleAdd()">新增</el-button>
      </div>
    </template>
    <fat-table
      ref="table"
      :fetch-handler="handleFetch"
      :remove-handler="handleRemove"
      :remove-confirm-message="removeConfirmMessage"
      row-key="id"
    >
      <el-table-column label="回复类型" prop="replyType" align="center"></el-table-column>
      <el-table-column label="回复内容" prop="replyContant" align="center"></el-table-column>
      <el-table-column label="操作" align="center" v-slot="scope">
        <table-actions
          :options="[
            {
              name: '编辑',
              onClick: () => handleAdd(scope.row),
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

    <el-dialog
      width="435px"
      :visible.sync="visible"
      :title="form.id ? '编辑' : '新增'"
      :close-on-click-modal="false"
      append-to-body
      destory-on-close
    >
      <el-form ref="dialogForm" :rules="rules" :model="form" label-width="90px" label-suffix=":">
        <el-form-item label="回复类型" prop="replyType">
          <el-input v-model.trim="form.replyType" maxlength="20" placeholder="不超过20个字"></el-input>
        </el-form-item>

        <el-form-item label="回复内容" prop="replyContant">
          <el-input
            type="textarea"
            maxlength="250"
            v-model.trim="form.replyContant"
            placeholder="不超过250个字"
            :rows="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button @click="handleSubmit" type="primary">保存</el-button>
      </span>
    </el-dialog>
  </list-page-layout>
</template>

<script>
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  import api from '@/dss-wechat3rd/src/api/large-mem-score';
  import { mapState } from 'vuex';

  export default {
    name: 'Config',
    components: { TableActions, FatTable, ListPageLayout },
    data() {
      return {
        // 删除message
        removeConfirmMessage: '是否确认删除该快捷回复',
        // dialog可视状态
        visible: false,
        // 新增、编辑dialog表单
        form: this.initForm(),
        // 校验规则
        rules: {
          replyType: [{ required: true, message: '请输入回复类型', trigger: 'blur' }],
          replyContant: [{ required: true, message: '请输入回复内容', trigger: 'blur' }],
        },
      };
    },
    computed: {
      ...mapState({
        curStore: state => state.curStore,
      }),
    },
    methods: {
      initForm() {
        return {
          // type：1为意见反馈，2为积分快捷回复
          typeStatus: 2,
          replyType: '',
          replyContant: '',
        };
      },
      // 添加快捷回复
      handleAdd(row) {
        if (row) {
          this.form = { ...row };
        } else {
          this.form = this.initForm();
        }
        this.visible = true;
      },
      // 获取快捷回复列表
      async handleFetch(params) {
        const { pagination } = params;
        const payload = {
          typeStatus: this.form.typeStatus,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };
        const { data, totalCount } = await api.picture.configList(payload);

        return {
          list: data,
          total: totalCount,
        };
      },
      // 删除快捷回复
      async handleRemove(ids) {
        return api.picture.deleteQuickReply(ids[0]);
      },
      // 保存新增 & 修改快捷回复
      async handleSubmit() {
        this.$refs.dialogForm.validate(async valid => {
          if (valid) {
            if (this.form.id) {
              await api.picture.updateQuickReply(this.form);
            } else {
              await api.picture.addQuickReply(this.form);
            }
            this.$message.success('快捷回复保存成功');
            this.visible = false;
            this.$refs.table.refresh();
          }
        });
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
