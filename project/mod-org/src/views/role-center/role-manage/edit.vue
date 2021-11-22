<template>
  <div class="role" v-loading="loading">
    <div class="content">
      <div class="content-function">
        <el-tabs v-model="activeName">
          <el-tab-pane label="功能权限" name="1"></el-tab-pane>
        </el-tabs>
        <div class="permission-tree">
          <TreePermission
            ref="role"
            v-if="selectedRole"
            :edit="edit"
            :is-mange="isSystemRole"
            :role-id="selectedRole && selectedRole.id"
          ></TreePermission>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" class="save_permis" @click="save" v-if="edit">保存</el-button>
      <el-button class="save_permis" @click="$router.go(-1)">取消</el-button>
    </div>
  </div>
</template>

<script>
  import { getPositionList } from '@/mod-org/src/api/staffApi';
  import TreePermission from './component/permission-tree.vue';
  import roleEnum from '@/mod-org/src/constants/roleEnum';

  export default {
    name: 'Index',
    components: {
      TreePermission,
    },
    data() {
      return {
        loading: false,
        activeName: '1',
        selectedRole: null,
        edit: !!(this.$route.query.isEdit * 1),
        allRoleList: [],
      };
    },
    computed: {
      isSystemRole() {
        return this.selectedRole && this.selectedRole.type === roleEnum.roleType.system;
      },
    },
    created() {
      this.fetchRoleList();
    },

    methods: {
      async fetchRoleList() {
        try {
          const { data } = await getPositionList();
          const cos = data.filter(o => o.id === this.$route.query.id * 1);
          this.selectedRole = cos?.length && cos[0];
        } finally {
          this.loading = false;
        }
      },
      save() {
        this.$refs.role.save();
      },
    },
  };
</script>

<style lang="less" scoped>
  .role {
    padding: 20px;
    box-sizing: border-box;
    background: white;

    .footer {
      position: fixed;
      left: 192px;
      right: 0;
      bottom: 0;
      height: 60px;
      background-color: white;
      box-shadow: 0 -1px 9px #e8e8e8;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
  }
</style>
