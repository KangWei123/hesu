<template>
  <list-page-layout>
    <template #main-actions>
      <el-button type="primary" @click="handleCloseEdit">+ 新增角色</el-button>
    </template>
    <div class="log-wrap">
      <el-table ref="table" :fetch-handler="fetchRoleList" :data="roleList" style="width: 100%" class="log-content">
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="permissionName" label="角色类型">
          <template slot-scope="scope">
            {{ scope.row.type === 1 ? '系统角色' : '非系统角色' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="最后修改时间" min-width="150">
          <template slot-scope="scope">{{ scope.row.updateTime | time }} </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <table-actions :options="tableActions(scope)"></table-actions>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 删除角色 -->
    <el-dialog
      title="删除角色"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="27%"
      :before-close="handleClose"
      style="padding: 0"
    >
      <el-form
        :model="delForm"
        :rules="delrules"
        ref="delForm"
        label-width="100px"
        class="demo-ruleForm"
        style="width: 90%"
      >
        <el-form-item style="text-align: left; margin-bottom: 10px" label-width="0"
          >该角色下有{{ staffNum }}名员工，请给员工指定新角色后完成删除</el-form-item
        >
        <el-form-item prop="newId" style="width: 100%; margin-bottom: 20px" label-width="0">
          <el-select style="width: 60%" v-model="delForm.newId" placeholder="请选择角色" :popper-append-to-body="false">
            <el-option v-for="item in optionUllist" :key="item.name" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <div class="del_button">
          <div slot="footer" class="button_in">
            <el-button type="primary" plain @click="handleClose">取消</el-button>
            <el-button type="primary" @click="delRoleConfire('delForm')">确认</el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
    <!-- 确定删除弹窗 -->
    <el-dialog title="删除角色" :visible.sync="delShow" width="20%" center :before-close="handleClose">
      <span>此操作将删除该角色，是否确认删除?</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="onDel">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
      :title="`${role_label}角色`"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      width="27%"
      :before-close="handleCloseEdit"
      style="padding: 0"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        style="width: 90%"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model.trim="ruleForm.name" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="角色级别" prop="level">
          <el-select v-model="ruleForm.level" placeholder="请选择">
            <el-option v-for="item in roleLevelList" :key="item.level" :label="item.name" :value="item.level">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input
            type="textarea"
            v-model.trim="ruleForm.desc"
            rows="8"
            maxlength="120"
            resize="none"
            style="width: 99%"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" plain @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save('ruleForm')">确认</el-button>
      </div>
    </el-dialog>
  </list-page-layout>
</template>

<script>
  import { ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import { getRoleLevel, getRoleStaffNum, delRole, addOrUpdateRole } from '@/mod-org/src/api/roleApi';
  import { getPositionList } from '@/mod-org/src/api/staffApi';

  function initFormData() {
    return {
      id: null,
      name: null,
      level: null,
      desc: null,
    };
  }

  export default {
    components: {
      ListPageLayout,
      TableActions,
    },
    computed: {
      role_label() {
        return this.ruleForm.id ? '编辑' : '添加';
      },
    },
    data() {
      return {
        ruleForm: initFormData(),
        roleLevelList: [],
        delForm: {
          newId: null,
        },
        rules: {
          name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
          level: [{ required: true, message: '请选择角色级别', trigger: 'change' }],
        },
        delrules: {
          newId: { required: true, message: '请选择角色', trigger: 'blur' },
        },
        dialogVisible: false,
        delShow: false,
        staffNum: 0,
        optionUllist: [],
        roleList: [],
        addDialogVisible: false,
      };
    },
    created() {
      this.getRoleLevel();
      this.fetchRoleList();
    },
    methods: {
      tableActions(scope) {
        return [
          {
            name: '详情',
            onClick: () => this.clickEditDetail(scope.row, 0),
          },
          {
            name: '编辑',
            onClick: () => this.clickEditDetail(scope.row, 1),
            visible: !!scope.row.id && scope.row.type !== 1,
          },
          {
            name: '删除',
            onClick: () => this.clickRemove(scope.row),
            visible: !!scope.row.id && scope.row.type !== 1,
          },
        ];
      },
      async getRoleLevel() {
        const { data } = await getRoleLevel();
        this.roleLevelList = data || [];
      },
      async fetchRoleList(res) {
        const { data } = await getPositionList();
        this.roleList = data || [];
      },
      clickEditDetail(row, isEdit) {
        this.$router.push({
          path: '/companyManage/role-center/edit',
          query: { id: row.id, isEdit: isEdit },
        });
      },
      handleClose() {
        this.ruleForm = initFormData();
        this.dialogVisible = false;
        this.delShow = false;
      },
      handleCloseEdit() {
        this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
        this.addDialogVisible = !this.addDialogVisible;
      },
      async clickRemove(row) {
        Object.assign(this.ruleForm, row);
        const { data } = await getRoleStaffNum({ roleId: row.id });
        this.staffNum = data;
        if (this.staffNum === 0) {
          this.delShow = true;
        } else {
          const clearPermis = this.roleList.filter(o => o.id !== row.id);
          this.optionUllist = clearPermis;
          this.dialogVisible = true;
        }
      },
      async onDel() {
        const { id } = this.ruleForm;
        await delRole({ id });
        this.$message.success('删除成功');
        this.delShow = false;
        this.fetchRoleList();
      },
      delRoleConfire(delForm) {
        this.$refs[delForm].validate(async valid => {
          if (valid) {
            const params = {
              id: this.ruleForm.id,
              newId: this.delForm.newId,
            };
            await delRole(params);
            this.$message.success('删除成功');
            this.handleClose();
            this.fetchRoleList();
          } else {
            return false;
          }
        });
      },
      save(name) {
        this.$refs[name].validate(async valid => {
          if (valid) {
            try {
              await addOrUpdateRole(this.ruleForm, this.edit);
              this.$message.success('操作成功');
              this.fetchRoleList();
            } finally {
              this.loading = false;
              this.addDialogVisible = false;
            }
          }
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .log-wrap {
    position: relative;

    .filter-form {
      background: white;
      padding: 20px 20px 0;
    }

    .log-content {
      margin-top: 20px;
    }
  }

  .button_in {
    text-align: center;
  }
</style>
