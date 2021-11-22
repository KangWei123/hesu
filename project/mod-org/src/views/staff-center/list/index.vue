<template>
  <list-page-layout>
    <template #main-actions>
      <el-button class="delete-color btn-gap" href="javascript:;" @click="clickViewDelList">删除记录</el-button>
      <el-button type="primary" :disabled="positionList && !positionList.length" @click="clickAddEmployee">
        新增员工
      </el-button>
    </template>
    <template #filters>
      <div v-show="!operType">
        <el-form class="header-wrap" :inline="true">
          <div class="header-left">
            <el-form-item class="serach-item" label="账号姓名">
              <el-input
                class="v-sec-inp"
                type="input"
                v-model.trim="keyword"
                prefix-icon="el-icon-search"
                placeholder="搜索账号，姓名"
                @change="triggerSearchKeyChanged('keyword')"
                @keyup.enter.native="triggerSearchKeyChanged('keyword')"
              ></el-input>
            </el-form-item>

            <el-form-item label="选择角色:">
              <el-select v-model="roleId" placeholder="请选择角色" @change="triggerSearchKeyChanged('roleId')">
                <el-option :key="-1" label="全部角色" :value="''"></el-option>
                <el-option v-for="item in positionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="search-btn" @click="triggerApiList('keyword')">搜索</el-button>
              <el-button type="plain" class="search-btn" @click="handleReset">重置</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </template>
    <template #sub-actions>
      <div v-loading="loading" class="staff-mgr-content">
        <div class="export-box">
          <el-button :disabled="isExport || !totalCount" @click="exportAll">一键导出 </el-button>
          <el-button :disabled="isExport || !(multipleSelection && multipleSelection.length > 0)" @click="exportMulti"
            >批量导出</el-button
          >
        </div>
      </div>
    </template>
    <div class="table-content">
      <!-- 左侧树状筛选 -->
      <div
        class="tree-selector"
        v-loading="treeLoading"
        v-if="(treeData.length == 1 && treeData[0].children) || treeData.length > 2"
      >
        <div style="display: flex; justify-content: center; padding-top: 200px; color: #909399" v-show="isGlobalSearch">
          暂无数据
        </div>
        <el-scrollbar style="height: 100%" class="scrollbar" v-if="!treeLoading && !isGlobalSearch">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            :indent="10"
            highlight-current
            ref="tree"
            node-key="deptId"
            :default-expanded-keys="expandIds"
            :current-node-key="curTreeId"
            @node-click="handleNodeClick"
            :expand-on-click-node="false"
          >
            <span
              class="custom-tree-node type"
              :class="data.deptId == 1 ? 'type0' : `type${data.type}`"
              slot-scope="{ node, data }"
            >
              <el-tooltip class="item" effect="dark" :content="node.label" placement="right">
                <span class="label">{{ node.label }}</span>
              </el-tooltip>
              <span v-if="data.employeeNum" class="count">({{ data.employeeNum }})</span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>

      <div
        :class="(treeData.length == 1 && treeData[0].children) || treeData.length > 2 ? 'table-wrap' : 'table-wrap-all'"
      >
        <div style="margin-top: 20px; min-width: 200px; padding: 0 20px">
          <span> {{ isGlobalSearch ? '筛选出' : currentNodeName }} 员工 {{ totalCount }} 人</span>
        </div>
        <el-table :data="tableData" ref="staffTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="70px"></el-table-column>
          <el-table-column prop="phone" label="账号"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <!-- <el-table-column label="组织名称">
            <template slot-scope="scope">
              <template v-if="!scope.row.id">总部</template>
              <template v-else>
                <div v-for="(item, index) in (scope.row.employeeStoreRoleList || []).slice(0, 2)" :key="item.id">
                  {{ item.deptName }}
                  {{ (scope.row.employeeStoreRoleList || []).length > 2 && index == 1 ? '...' : '' }}
                </div>
              </template>
            </template>
          </el-table-column> -->
          <el-table-column label="角色">
            <template slot-scope="scope">
              <template v-if="!scope.row.id">企业管理员</template>
              <template v-else>
                <!-- 去除多角色，只保留第一级 -->
                {{ ((scope.row.employeeStoreRoleList || [])[0] || {}).roleName }}
                <!-- <div v-for="(item, index) in (scope.row.employeeStoreRoleList || []).slice(0,2)" :key="item.id">
                    {{item.roleName}}
                    {{(scope.row.employeeStoreRoleList || []).length > 2 && index == 1 ? '...': ''}}
                </div>-->
              </template>
            </template>
          </el-table-column>
          <!-- <el-table-column>
            <template slot="header" slot-scope="scope">
              关联企微/微信
              <el-tooltip class="item" placement="top-start" effect="light">
                <div slot="content" class="tooltipContent">
                  <strong>关联企微：</strong
                  >员工成为企微成<br />员，且企微手机号与员工账号<br />一致时。将自动关联；<br />
                  <strong>关联微信：</strong>店长及导购员在导<br />购助手激活后，即可关联到员工个<br />人微信
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              {{ scope.row.wxWorkUserName || '未关联' }}/{{ scope.row.wxNickName || '未关联' }}
            </template>
          </el-table-column> -->
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <span v-if="scope.row.createTime">{{ scope.row.createTime | time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" v-slot="scope">
            <template
              v-if="!(scope.row.isSystem && organizationType == organizationTypeEnum.enterprise) || isGlobalSearch"
            >
              <table-actions :options="tableActions(scope)"></table-actions>
            </template>
          </el-table-column>
        </el-table>
        <div style="float: left; margin-top: 20px">
          <el-button
            :disabled="!totalCount || !hasPatchDel || !multipleSelection.length"
            v-if="!(organizationType === organizationTypeEnum.enterprise && !isGlobalSearch)"
            @click="patchDel"
            >批量删除
          </el-button>
        </div>
        <el-pagination
          class="wkt-pagination"
          @size-change="onPageSizeChange"
          @current-change="onPageNumChange"
          :current-page="pageNo"
          :page-size="pageSize"
          :page-sizes="[5, 10, 15, 50, 100]"
          layout="prev, pager, next, jumper, sizes, total"
          v-if="totalCount"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
    <div class="staff-box">
      <!--子菜单面包屑-->
      <div v-if="!!operType" class="el-breadcrumb">
        <span class="el-breadcrumb__item">
          <span role="link" class="el-breadcrumb__inner is-link" @click="refreshList">员工管理</span>
          <span class="el-breadcrumb__separator">/</span>
        </span>
        <span class="el-breadcrumb__item">
          <span role="link" class="el-breadcrumb__inner">{{
            operType == OperTypes.View
              ? '查看详情'
              : operType == OperTypes.Add
              ? '添加员工'
              : operType == OperTypes.Update
              ? '编辑员工'
              : operType == OperTypes.WorkOrderMgr
              ? '排班管理'
              : operType == OperTypes.DelList
              ? '删除记录'
              : ''
          }}</span>
          <span class="el-breadcrumb__separator">/</span>
        </span>
      </div>

      <!--批量导入-->
      <upload
        :visible.sync="dialog.upload"
        :title="'会员导入'"
        @upload-success="onUploadSuccess"
        :template-down-url="templateDownUrl"
        :upload-server-url="uploadServerUrl"
        :template-desc="'您可以下载我们提供的模版，批量上传会员信息。 模版下载'"
      ></upload>

      <!-- 一键导出温馨提示对话弹框 -->
      <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
        <span style="font-size: 14px">员工信息正在导出，请等候...</span>
      </el-dialog>
    </div>
  </list-page-layout>
</template>

<script>
  import { mapState } from 'vuex';
  import dateUtil from '@/dss-common/utils/date';
  import { templateApi } from '@/business-common/api/index';
  import * as staffApi from '@/mod-org/src/api/staffApi';
  import Upload from '@/dss-common/components/upload';
  import { ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper';
  import exportExcel from '@/dss-common/utils/exportExcel';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';

  const unionKeys = ['id'];
  const organizationTypeEnum = {
    enterprise: 0,
    dealer: 1,
    direct_store: 2,
    dealer_store: 3,
    fields: ['appId', 'dealerId', 'storeId', 'storeId'],
  };

  const IDENTIFIER = {
    enterprise: 'common_role_enterprise',
    areaManager: 'common_role_area_manager',
    dealerManager: 'common_role_dealer_manager',
    storeKeeper: 'common_role_storeKeeper',
    guide: 'common_role_sales',
    operator: 'common_role_operator',
  };

  export default {
    mixins: [tableCheckedHelperMixin],
    components: {
      ListPageLayout,
      TableActions,
      Upload,
    },
    filters: {
      time(val) {
        return dateUtil.format(new Date(val));
      },
      filterName: function (employeeStoreRoleList, flag) {
        for (let i = 0; i <= employeeStoreRoleList.length; i++) {
          if (
            employeeStoreRoleList[i + 1] &&
            employeeStoreRoleList[i].storeId !== employeeStoreRoleList[i + 1].storeId
          ) {
            return employeeStoreRoleList[i + 1].flag;
          }
        }
      },
    },
    data() {
      return {
        // 查询列表相关信息
        loading: true,
        totalCount: 0,
        pageNo: 1,
        pageSize: 10,
        tableData: [],
        positionId: undefined,
        roleId: '',
        keyword: '',
        organizationType: null,
        storeId: undefined,
        dealerId: null,
        appId: null,
        query_cache: {
          keyword: '',
          roleId: '',
        },

        OperTypes: {
          View: 'view',
          Add: 'add',
          Update: 'update',
          WorkOrderMgr: 'workOrderMgr',
          DelList: 'DelList',
        },
        operType: '',
        processEmployee: null,
        multipleSelection: [],
        // 模板下载地址
        templateDownUrl: templateApi.templateDownloadUrl + '?fileName=employeeImportTemplate',
        // 模板上传接口
        uploadServerUrl: staffApi.importEmployeeUrl,
        dialog: {
          upload: null,
        },
        isExport: false,
        showTipDialog: false,
        resultStoreList: [],
        organizationTypeEnum,
        treeData: [],
        treeLoading: true,
        expandIds: [],
        curTreeId: '',
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        isGlobalSearch: false, // 区分全局搜索 or 组织层级搜索
        hasPatchDel: true,
        currentNode: {},
        positionList: [],
      };
    },
    computed: {
      ...mapState({
        userInfo: 'userInfo',
        env: 'env',
        curStore: 'curStore',
        curApp: 'curApp',
        storeList: 'storeList',
        rootScopeMenu: 'rootScopeMenu',
        roleList: 'roleList',
        companyScopeMenu: 'companyScopeMenu',
      }),
      /**
       * 上级可以修改下级，经销商同级可以修改经销商同级
       */
      modifiable() {
        return identifier => {
          return !!this.positionList.find(item => item.identifier === identifier);
        };
      },
      /**
       * 自己不能编辑删除自己
       */
      isMyself() {
        return perUserId => {
          return perUserId !== this.userInfo.userId;
        };
      },
      storeLabel() {
        return this.env.ESTATE ? '区域' : '门店';
      },
      showWorkOrder() {
        return !this.env.ESTATE;
      },
      isRequireStore() {
        return true;
      },
      // 父级Id
      deptIdList() {
        return this.currentNode.deptId;
      },
      // 父级Id
      currentNodeName() {
        return this.currentNode.name;
      },
    },

    async mounted() {
      await this.getPositionList();
      this.initStoreList();
      this.getDeptTree();
    },

    methods: {
      tableActions(scope) {
        const editable =
          this.modifiable(
            scope.row.employeeStoreRoleList && scope.row.employeeStoreRoleList[0]
              ? scope.row.employeeStoreRoleList[0].identifier
              : ''
          ) && this.isMyself(scope.row.perUserId);
        return [
          {
            name: '排班',
            visible: !this.isShowWorkOrder(scope.row),
            onClick: () => this.clickWorkOrder(scope.row),
          },
          {
            name: '详情',
            onClick: () => this.clickViewDetail(scope.row),
          },
          {
            name: '编辑',
            onClick: () => this.clickEditDetail(scope.row),
            visible: editable,
          },
          {
            name: '删除',
            onClick: () => this.clickRemove(scope.row),
            visible: editable,
          },
        ];
      },
      // 重置搜索
      handleReset() {
        this.keyword = '';
        this.query_cache = {
          keyword: '',
          roleId: '',
        };
        this.roleId = '';
        this.isGlobalSearch = false;
        this.currentNode = this.treeData.length ? this.treeData[0] : {};
        this.apiList();
      },
      // 管理层不需要排班
      isShowWorkOrder(row) {
        const identifier = row.employeeStoreRoleList ? row.employeeStoreRoleList[0].identifier : '';
        const manageList = new Set([
          IDENTIFIER.enterprise,
          IDENTIFIER.areaManager,
          IDENTIFIER.dealerManager,
          IDENTIFIER.operator,
        ]);
        return manageList.has(identifier);
      },
      initStoreList() {
        this.resultStoreList = JSON.parse(JSON.stringify(this.storeList));
        this.resultStoreList.unshift({
          id: -1,
          name: '全部门店',
        });
      },
      // 获取组织树
      getDeptTree() {
        const data = {
          queryEmployee: true,
          queryStore: true,
          queryType: 2, // 查询列表，1 根据角色查询，2 全量查询
          showDeptApp: false, // 是否显示组织下的应用
        };
        staffApi
          .getOrganizationTree(data)
          .then(res => {
            this.treeData = res.data || [];
            this.currentNode = this.treeData.length ? this.treeData[0] : {};
            this.expandIds = this.treeData.length ? [this.treeData[0].deptId] : [];
            this.apiList();
          })
          .finally(() => {
            this.treeLoading = false;
          });
      },

      handleNodeClick(current, node, arr) {
        // 将表格多选框清空
        this.multipleSelection = [];
        // 点击组织树时将页数置为1
        this.pageNo = 1;
        const field = organizationTypeEnum.fields[current.organizationType];

        this.appId = null;
        this.dealerId = null;
        this.storeId = null;
        this.organizationType = current.organizationType;
        this.currentNode = current;
        this[field] = current[field];

        // 重置全局搜索
        this.isGlobalSearch = false;
        for (const key in this.query_cache) {
          this[key] = null;
          this.query_cache[key] = null;
        }

        this.apiList();
      },

      // 获取角色列表
      getPositionList() {
        return staffApi.getPositionList().then(res => {
          this.positionList = res.data;
        });
      },
      // 页数
      onPageSizeChange(val) {
        this.pageSize = val;
        this.pageNo = 1; // allPositionList
        this.apiList();
      },
      // 页码
      onPageNumChange(val) {
        this.pageNo = val;
        this.apiList();
      },
      triggerSearchKeyChanged(key) {
        if (this.query_cache[key] !== this[key]) {
          this.query_cache[key] = this[key];
        }
      },
      // 触发更新
      triggerApiList() {
        this.isGlobalSearch = true;
        this.pageNo = 1;
        this.apiList();
      },

      patchDel() {
        this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);
        if (this.mTotalCheckedList && this.mTotalCheckedList.length) {
          this.$confirm('确认删除所有已选记录？ ', '批量删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'wkt-warning',
          }).then(() => {
            const ids = this.mTotalCheckedList.map(item => item.id).join(',');
            this.loading = true;
            staffApi
              .deleteEmployee({ ids: ids })
              .done(res => {
                this.$message({
                  message: '批量删除成功',
                  type: 'success',
                });
                this.multipleSelection = [];
                this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);
                this.pageNo = 1;
                this.apiList();
              })
              .always(() => {
                this.loading = false;
              });
          });
        }
      },

      onUploadSuccess(message) {
        this.apiList();
      },

      openVipUpload() {
        const permis = this.getPermis();
        if (!permis) {
          this.$message.error(`批量导入失败：您当前职位无权限操作`);
        } else {
          this.dialog.upload = true;
        }
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
        const hasPatchDel = this.multipleSelection.filter(({ perUserId }) => {
          return perUserId === this.userInfo.userId;
        });
        this.hasPatchDel = !hasPatchDel.length;
      },

      clickRemove(row) {
        this.$confirm('是否删除员工?', '删除员工', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        }).then(() => {
          staffApi.delEmployee({ id: row.id }).then(() => {
            this.$message({ message: '删除成功', type: 'success' });
            this.apiList();
          });
        });
      },
      uniqObjInArray(objarray) {
        const obj = {};
        const peon = objarray.reduce((cur, next) => {
          obj[next.storeId] ? '' : (obj[next.storeId] = true && cur.push(next));
          return cur;
        }, []); // 设置cur默认类型为数组，并且初始值为空的数组
        return peon;
      },

      // 搜索参数
      searchParams() {
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          status: 1,
          queryGuideRel: true,
        };

        if (this.isGlobalSearch) {
          params = {
            ...params,
            roleId: this.roleId ? this.roleId : '',
            keyword: this.keyword ? this.keyword : '',
          };
        } else {
          params = {
            ...params,
            deptIdList: this.deptIdList,
          };
        }

        return params;
      },

      // 查询员工列表
      apiList() {
        this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);
        this.loading = true;
        staffApi
          .getEmployeeListV3(this.searchParams())
          .then(res => {
            const { data, totalCount } = res;
            this.tableData = data || [];
            this.totalCount = totalCount;
            this.mBuildMultipleTableSelection(this.tableData, 'staffTable', unionKeys);
            this.tableData.forEach(item => {
              item.employeeStoreRoleList = this.uniqObjInArray(item.employeeStoreRoleList);
            });
          })
          .always(() => {
            this.loading = false;
          });
      },
      // 排班
      clickWorkOrder(row) {
        this.$router.push({
          path: '/companyManage/staff-center/list/work-order',
          query: { id: row.id },
        });
      },
      // 详情
      clickViewDetail(row) {
        this.$router.push({
          path: '/companyManage/staff-center/list/detail',
          query: { id: row.id },
        });
      },
      // 编辑
      clickEditDetail(row) {
        this.$router.push({
          path: '/companyManage/staff-center/list/add',
          query: { id: row.id },
        });
      },
      // 添加员工
      clickAddEmployee() {
        this.$router.push('/companyManage/staff-center/list/add');
      },
      // 查看删除历史
      clickViewDelList() {
        // this.operType = this.OperTypes.DelList;
        this.$router.push('/companyManage/staff-center/list/del-list');
      },
      // 刷新列表
      refreshList() {
        this.operType = null;
        this.processEmployee = null;
        this.apiList();
      },

      // 获取导出权限
      getPermis() {
        const employeeButton = scopeMenuEnum.dictionary.companyChildMenu.staffCenterChildMenu.employeeButton;
        const tempMenu = scopeMenuEnum.getMenuScopeByIdentifier(
          this.companyScopeMenu,
          employeeButton.employee_manage_export
        );
        if (tempMenu) {
          return tempMenu.isHasPermission;
        }
      },
      // 批量导出
      exportMulti() {
        const permis = this.getPermis();
        if (!permis) {
          this.$message.error(`员工批量导出失败：您当前职位无权限操作`);
        } else {
          const params = { status: 1 };
          params.ids = this.multipleSelection.map(item => item.id).toString();
          this.handleExport(0, params);
        }
      },

      // 一键导出
      exportAll() {
        const permis = this.getPermis();
        if (!permis) {
          this.$message.error(`员工一键导出失败：您当前职位无权限操作`);
        } else {
          this.handleExport(1, this.searchParams());
        }
      },

      handleExport(index, params) {
        const str = `${['批量导出', '一键导出'][index]}`;

        this.$confirm(`确定${str}过滤后的员工信息吗？ `, str, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        }).then(() => {
          this.isExport = true;
          index === 1 && (this.showTipDialog = true);
          exportExcel
            .getDownload(staffApi.exportEmployee, params)
            .then(res => {
              this.$message({
                message: '导出员工信息成功，正在下载',
                type: 'success',
              });
              if (index === 0) {
                this.$refs.staffTable.clearSelection();
              }
            })
            .always(() => {
              this.isExport = false;
              this.showTipDialog = false;
            });
        });
      },
    },
  };
</script>
<style scoped lang="less">
  .staff-box {
    padding-bottom: 20px;

    .header-wrap {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      background: white;
      padding: 20px 20px 0;

      .header-left {
        min-width: 600px;

        /** 搜索账号姓名部分 */

        .serach-item {
          .v-sec-inp {
            width: 195px;
          }

          // .search-btn {
          // margin: 0 5px;
          // }
        }

        /** 选择角色部分 */
      }
    }

    .staff-mgr-content {
      box-sizing: border-box;
      background: white;
      margin-top: 20px;

      .export-box {
        padding: 20px;
        border-bottom: 1px solid #e4e7ed;

        .btn-gap {
          margin-right: 10px;
        }
      }

      .btn-operation {
        display: inline-block;
      }

      /** 左侧的选择列表部分 */

      .table-content {
        display: flex;
        justify-content: space-between;

        .tree-selector {
          height: 650px;
          flex: 0 0 280px;
          width: 280px;
          background: #f2f4f7;
          margin-top: 20px;
          margin-right: 20px;
          font-size: 14px;
          position: relative;

          .custom-tree-node {
            flex: 1;
            display: flex;
            align-items: center;
            overflow: hidden;

            .label {
              display: inline-block;
              max-width: 180px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .count {
              margin-left: 5px;
            }

            .el-dropdown-link {
              position: relative;
              top: 5px;
            }

            &.type::before,
            &.type1::before {
              content: '';
              width: 20px;
              height: 20px;
              background: url('../../../images/dept.png') 0 0 no-repeat;
              background-size: cover;
              display: inline-block;
              margin-right: 7px;
            }

            &.type3::before {
              content: '';
              width: 20px;
              height: 20px;
              background: url('../../../images/store.png') 0 0 no-repeat;
              background-size: cover;
              display: inline-block;
              margin-right: 7px;
            }

            &.type2::before {
              content: '';
              width: 20px;
              height: 20px;
              background: url('../../../images/dealer.png') 0 0 no-repeat;
              background-size: cover;
              display: inline-block;
              margin-right: 7px;
            }

            &.type0::before {
              content: '';
              width: 20px;
              height: 20px;
              background: url('../../../images/organization.png') 0 0 no-repeat;
              background-size: cover;
              display: inline-block;
              margin-right: 7px;
            }

            //&:before {
            //  content: '';
            //  width: 20px;
            //  height: 20px;
            //  background: url("../../../images/company-manage/folder.svg") 0 0 no-repeat;
            //  background-size: cover;
            //  display: inline-block;
            //  margin-right: 7px;
            //}

            /deep/ .el-dropdown {
              position: absolute;
              right: 5px;
            }
          }

          /deep/ .el-tree {
            background: #f2f4f7;
            width: 100%;
          }

          /deep/ .el-tree-node__content {
            height: 40px;
            line-height: 40px;
            width: 100%;
            border-top: none;
          }

          &.gray {
            .el-tree {
              color: #999;
            }
          }
        }

        /** 右侧的操作列表部分 */
      }
    }
  }

  .table-content {
    display: flex;
    justify-content: space-between;

    .table-wrap {
      width: calc(100% - 310px);
    }

    .table-wrap-all {
      width: 100%;
    }
  }

  .wkt-opt-label-container {
    padding: 30px 20px 10px 20px;
  }

  .condition {
    position: relative;
  }

  .scrollbar /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .tree-selector {
    height: 700px;
    flex: 0 0 280px;
    width: 280px;
    background: #f2f4f7;
    margin-top: 20px;
    font-size: 14px;
    position: relative;

    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;

      .label {
        display: inline-block;
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .count {
        margin-left: 5px;
      }

      .el-dropdown-link {
        position: relative;
        top: 5px;
      }

      &.type3::before {
        content: '';
        width: 20px;
        height: 20px;
        background: url('../../../images/store.png') 0 0 no-repeat;
        background-size: cover;
        display: inline-block;
        margin-right: 7px;
      }

      &.type2::before {
        content: '';
        width: 20px;
        height: 20px;
        background: url('../../../images/dealer.png') 0 0 no-repeat;
        background-size: cover;
        display: inline-block;
        margin-right: 7px;
      }

      &.type1::before {
        content: '';
        width: 20px;
        height: 20px;
        background: url('../../../images/dept.png') 0 0 no-repeat;
        background-size: cover;
        display: inline-block;
        margin-right: 7px;
      }

      &.type0::before {
        content: '';
        width: 20px;
        height: 20px;
        background: url('../../../images/organization.png') 0 0 no-repeat;
        background-size: cover;
        display: inline-block;
        margin-right: 7px;
      }

      //&:before {
      //  content: '';
      //  width: 20px;
      //  height: 20px;
      //  background: url("../../../images/company-manage/folder.svg") 0 0 no-repeat;
      //  background-size: cover;
      //  display: inline-block;
      //  margin-right: 7px;
      //}

      /deep/ .el-dropdown {
        position: absolute;
        right: 5px;
      }
    }

    /deep/ .el-tree {
      background: #f2f4f7;
      width: 100%;
    }

    /deep/ .el-tree-node__content {
      height: 40px;
      line-height: 40px;
      width: 100%;
      border-top: none;
    }

    &.gray {
      .el-tree {
        color: #999;
      }
    }
  }

  .form-btns {
    // float: right;
    position: absolute;
    right: 20px;
    top: 25px;
    padding: 5px 0 10px;

    .el-button,
    a {
      position: static !important;
      margin: 0 10px 0 0;
    }
  }

  .reset-btn {
  }

  .tooltipContent {
    line-height: 20px;
  }
</style>
