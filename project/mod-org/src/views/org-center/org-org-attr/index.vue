<template>
  <list-page-layout class="org-list-container">
    <template #main-actions>
      <el-button type="primary" @click="handleAdd">+ 新增属性</el-button>
    </template>
    <template #filters>
      <div class="tip">
        <div class="tip-container">
          组织属性字段用于标记组织，用于系统识别组织属性，以便对特定组织进行数据统计，数据分析等场景。
        </div>
      </div>
    </template>
    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" selectable row-key="id">
      <el-table-column label="组织属性" min-width="90" prop="attrName"></el-table-column>
      <el-table-column label="组织数量" min-width="90" prop="refNum"></el-table-column>
      <el-table-column label="操作" fixed="right" align="left" min-width="240" v-slot="scope">
        <table-actions :options="tableActions(scope.row)" />
      </el-table-column>
    </fat-table>
    <org-dialog :visible.sync="showAddDialog" :active-item="activeItem" @confirm="handleSearchApp" />
  </list-page-layout>
</template>

<script>
  import { mapState } from 'vuex';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import { getAttrList, deleteOrganizationAttr } from '@/mod-org/src/api/organizationFramework';
  import OrgDialog from '@/mod-org/src/components/org-dialog/index.vue';

  /**
   * 会员列表
   */
  export default {
    name: 'UserList',
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
      OrgDialog,
    },
    data() {
      return {
        form: {
          appName: null,
          industryId: null,
        },
        showAddDialog: false,
        curEditApp: null,
        activeItem: null,
      };
    },
    computed: {
      ...mapState({
        companyScopeMenu: 'companyScopeMenu',
      }),
    },
    methods: {
      handleAdd() {
        this.activeItem = null;
        this.showAddDialog = true;
      },
      handleSearchApp() {
        this.$refs.table.search();
      },
      tableActions(row) {
        return [
          this.buttonPermission('edit') && {
            name: '编辑',
            onClick: () => {
              this.activeItem = row;
              this.showAddDialog = true;
            },
          },
          this.buttonPermission('delete') && {
            name: '删除',
            onClick: () => {
              this.onDelete(row.id);
            },
          },
        ];
      },
      async onDelete(id) {
        try {
          await this.$confirm('确认删除该组织属性吗？', '删除组织属性', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'wkt-warning',
          });
          this.loading = true;
          await deleteOrganizationAttr({ id });
          this.$message.success('删除组织属性成功！');
          this.$refs.table.refresh();
        } catch (err) {
          console.log('Error: ', err);
        } finally {
          this.loading = false;
        }
      },
      // 操作按钮权限 企业管理员可增删改，其他角色不可
      buttonPermission(key) {
        const orgPropertyButton =
          scopeMenuEnum.dictionary.companyChildMenu.storeCenterChildMenu.organizationPropertyButton;
        const identifier = {
          add: orgPropertyButton.org_property_add,
          delete: orgPropertyButton.org_property_delete,
          edit: orgPropertyButton.org_property_edit,
        };
        const tempMenu = scopeMenuEnum.getMenuScopeByIdentifier(this.companyScopeMenu, identifier[key]);
        return !!(tempMenu && tempMenu.isHasPermission);
      },
      async handleFetch(params) {
        console.log('handleFetch', this.form);
        // 分页信息
        const { pagination } = params;

        // 请求参数
        const payload = {
          ...this.form,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          queryAll: false,
        };

        const { data: list, totalCount: total } = await getAttrList(payload);
        return { list: list || [], total };
      },
    },
  };
</script>

<style lang="less">
  .org-list-container {
    .tip {
      box-sizing: border-box;
      font-size: 14px;
      color: #303133;
      width: 90%;
      line-height: 60px;
      padding: 0 17px;

      .tip-container {
        margin-bottom: 20px;
      }
    }

    .user-label {
      width: 70px;
      display: inline-block;
    }

    .app-logo {
      width: 50px;
      height: 50px;
    }
  }

  .el-table::before {
    height: 0;
  }
</style>
