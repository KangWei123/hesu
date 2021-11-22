<template>
  <list-page-layout class="store-list-container">
    <template #main-actions>
      <el-button type="primary" v-if="isShowAddButton" :disabled="hasAddStore" @click="clickAddStore">
        新增{{ storeLabel }}
      </el-button>
    </template>
    <template #filters>
      <el-form ref="query" :model="filterForm" inline>
        <el-form-item label="门店搜索" prop="storeName">
          <el-input
            style="width: 230px; height: 30px"
            :placeholder="`请输入${storeLabel}名称/${storeLabel}简称`"
            v-model="filterForm.storeName"
          />
        </el-form-item>
        <el-form-item label="状态筛选" prop="isOpen">
          <el-select v-model="filterForm.isOpen" style="width: 122px" placeholder="请选择" clearable>
            <el-option label="全部" :value="null"></el-option>
            <el-option label="营业" :value="1"></el-option>
            <el-option label="打烊" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button plain @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #sub-actions>
      <el-button :disabled="disableBatchButton || disableBatchExport" @click="clickExportStore">批量导出</el-button>
      <!-- <el-button type="primary" v-if="isShowAddButton" :disabled="hasAddStore" @click="clickAddStore">
        新增{{ storeLabel }}
      </el-button> -->
    </template>
    <!-- TODO:重构列表 -->
    <div class="store-container" v-loading="treeloading">
      <div class="tree-selector" v-if="organizationTree.length">
        <el-scrollbar style="height: 100%" class="scrollbar">
          <div
            style="display: flex; justify-content: center; padding-top: 200px; color: #909399"
            v-show="isGlobalSearch"
          >
            暂无数据
          </div>
          <el-tree
            :data="organizationTree"
            :props="defaultProps"
            :indent="18"
            highlight-current
            ref="tree"
            node-key="deptId"
            :default-expanded-keys="defaultExpandedKey"
            @node-click="handleNodeClick"
            :expand-on-click-node="false"
            v-if="!isGlobalSearch"
          >
            <span
              class="custom-tree-node type"
              :class="data.deptId == 1 ? 'type0' : `type${data.type}`"
              slot-scope="{ node, data }"
            >
              <!-- <el-tooltip class="item" effect="dark" :content="node.label" placement="bottom-end"> -->
              <span>
                {{ node.label }}
                <label v-show="data.directStoreNum">（{{ data.directStoreNum }}）</label>
              </span>
              <!-- </el-tooltip> -->
              <div class="buttonLine" style="z-index: 10" @click.stop v-if="isEnterpriseManager && !isScrmIndustry">
                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" style="margin-top: 0; overflow: inherit; padding: 0">
                    <el-dropdown-item
                      v-show="(data.type == 1 || (data.type !== 2 && data.type !== 3)) && data.dep < 4"
                      :command="{ ...data, handleType: 'handleAddTree' }"
                      >新增子节点</el-dropdown-item
                    >
                    <el-dropdown-item v-show="data.deptId != 1" :command="{ ...data, handleType: 'handleAddTreeSame' }"
                      >新增同级节点</el-dropdown-item
                    >
                    <el-dropdown-item
                      :command="{ ...data, handleType: 'handleEditTree' }"
                      v-show="data.deptId != 1"
                      :disabled="data.deptId == 1"
                      >编辑组织</el-dropdown-item
                    >
                    <el-dropdown-item :command="{ ...data, handleType: 'handleRemovetree' }" v-show="data.deptId != 1">
                      删除
                    </el-dropdown-item>
                    <el-dropdown-item disabled> ID:{{ data.deptId }} </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="table-box">
        <div>
          {{ `${isGlobalSearch ? '筛选出' : currentNodeName} 门店 ${totalCount} 家` }}
        </div>
        <el-table
          :data="tableData"
          ref="multipleTable"
          @select="select"
          @select-all="selectAll"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column :label="`${storeLabel}名称`" width="240">
            <template slot-scope="scope">
              <span
                v-if="scope.row.logo"
                :style="'background: transparent url(' + scope.row.logo + ') no-repeat 0 0;'"
                class="icon"
              ></span>
              <span
                v-else
                :style="
                  'background: transparent url(' + require('../../../../images/logo-default.png') + ') no-repeat 0 0;'
                "
                class="icon"
              ></span>
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="`${storeLabel}简称`" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.abbreviation || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column width="80" label="模式">
            <template slot-scope="scope">
              <span>{{ scope.row.mode ? '经销' : '直营' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="tel" label="客服电话" width="140"></el-table-column>
          <el-table-column width="260" prop="address" v-if="showDetailAddress" label="地址"></el-table-column>
          <el-table-column
            prop="outStoreId"
            v-if="showOutStoreId"
            :label="`${storeLabel}ID`"
            width="120"
          ></el-table-column>
          <el-table-column :label="ownerLabel" width="140">
            <template slot-scope="scope">{{ scope.row.ownerName }} {{ scope.row.ownerTel }} </template>
          </el-table-column>
          <el-table-column label="状态" width="180">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isOpen"
                @change="switchBusiness(scope.row)"
                :width="53"
                :active-value="1"
                active-color="#50DAAA"
                inactive-color="#DCDDE0"
                active-text="营业"
                inactive-text="打烊"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="会员数量" width="110" prop="memberCount"></el-table-column>
          <el-table-column label="开通时间" prop="createTime" width="200">
            <template slot-scope="scope">
              {{ scope.row.createTime | datatime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="110" fixed="right">
            <template slot-scope="scope">
              <a href="javascript:;" class="table-href" @click="clickEditDetail(scope.row)">编辑</a>
              <a href="javascript:;" class="table-href" @click="clickViewStore(scope.row)">详情</a>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          class="wkt-pagination"
          @size-change="onPageSizeChange"
          @current-change="onPageNumChange"
          :current-page="pageNo"
          :page-size="pageSize"
          :page-sizes="[5, 10, 15, 50]"
          layout="prev, pager, next, jumper, sizes, total"
          v-if="totalCount"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
    <setStoreSuperior
      :set-store-superior="setStoreSuperior"
      ref="setStoreSuperior"
      :dept-tree="data"
      :store-id="storeId"
      :api="getStoreList"
    ></setStoreSuperior>
    <!--  删除组织 -->
    <el-dialog
      title="删除组织"
      :visible.sync="delTreeDialogVisible"
      width="500px"
      class="dialog"
      :close-on-click-modal="false"
      center
    >
      <p>删除本组织，本组织下的子组织层级将一同删除，是否确认</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delTreeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRemoveTree">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`${isAdd ? '新增' : '编辑'}组织`"
      :visible.sync="addTreeDialogVisible"
      width="500px"
      class="dialog"
      :close-on-click-modal="false"
      :show-close="false"
      center
    >
      <el-form ref="organizationTreeObj" :model="organizationTreeObj" :rules="rules" label-width="100px">
        <el-form-item label="上级组织" prop="parentIds">
          <el-cascader
            v-model="organizationTreeObj.parentIds"
            :options="addOrganizationCascader"
            :props="{ value: 'deptId', label: 'name' }"
            change-on-select
            @change="handleCascaderChange"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="组织名称" prop="name">
          <el-input
            v-model="organizationTreeObj.name"
            placeholder="请输入组织名称"
            @change="ifArrName"
            maxlength="10"
          ></el-input>
          <p style="color: red">{{ errorHasNameMsg }}</p>
        </el-form-item>
        <el-form-item label="组织属性">
          <el-select v-model="organizationTreeObj.type" placeholder="请选择组织属性">
            <el-option v-for="item in attrList" :key="item.id" :label="item.attrName" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织编号" prop="dealerNoType">
          <el-radio v-show="!!isAdd" v-model="organizationTreeObj.dealerNoType" label="1">自定义 </el-radio>
          <el-radio v-show="!!isAdd" v-model="organizationTreeObj.dealerNoType" label="0">系统生成 </el-radio>
          <el-input
            v-show="organizationTreeObj.dealerNoType == 1"
            maxlength="18"
            v-model="organizationTreeObj.dealerNo"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSaveAddTree">确 定</el-button>
      </span>
    </el-dialog>
  </list-page-layout>
</template>

<script>
  import { ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import { exportStoreListNew } from '@/mod-org/src/api/storeApi';
  import * as orApi from '@/mod-org/src/api/organizationFramework';
  import DeptSelect from '@/mod-org/src/components/departmentSelect';
  import setStoreSuperior from '@/mod-org/src/components/setStoreSuperior';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper';
  import exportExcel from '@/dss-common/utils/exportExcel';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import datetime from '@/dss-common/utils/date';
  import { mapState } from 'vuex';
  import { industryHelperMixin } from '@/register/wechat3rd';

  const unionKeys = ['id'];

  export default {
    name: 'StoreList',
    mixins: [tableCheckedHelperMixin, industryHelperMixin],
    components: {
      ListPageLayout,
      TableActions,
      DeptSelect,
      setStoreSuperior,
    },
    filters: {
      datatime: function (value) {
        return datetime.format(new Date(value), 'YYYY-MM-DD HH:mm:ss');
      },
    },
    data() {
      return {
        value: false,
        totalCount: 0,
        pageNo: 1,
        pageSize: 5,
        tableData: [],
        multipleSelection: [],
        data: [],
        loading: false,
        treeloading: false,
        filterForm: {
          storeName: null,
          isOpen: null,
        },
        rules: {
          parentIds: [{ required: true, message: '请选择上级组织', trigger: 'change' }],
          name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
          dealerNoType: [{ required: true, message: '请输入组织编号', trigger: 'blur' }],
        },
        organizationTreeObj: {
          parentIds: [],
          parentId: null,
          type: '',
          name: '',
          isDealerType: false,
          dealerNo: '',
          dealerNoType: '1',
        },
        addTreeDialogVisible: false,
        delTreeDialogVisible: false,
        dialogFormStoreVisible: false,
        deptIds: null,
        selected: [],
        storeId: null,
        disableBatchExport: false,
        organizationTree: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        selectTreeObj: {},
        currentOrganization: {},
        errorHasNameMsg: '',
        defaultExpandedKey: [],
        addOrganizationCascader: [],
        currentDeptId: '',
        isAdd: false,
        isGlobalSearch: false,
        currentNodeName: '',
        attrList: [],
      };
    },
    computed: {
      ...mapState({
        userInfo: 'userInfo',
        curApp: 'curApp',
        storeList: 'storeList',
        env: 'env',
        appFeatures: 'appFeatures',
        roleList: 'roleList',
        companyScopeMenu: 'companyScopeMenu',
      }),
      // 店长和区域管理员不能添加门店
      hasAddStore() {
        return (
          !!this.roleList &&
          (this.roleList.split(',').includes('common_role_storeKeeper') ||
            this.roleList.split(',').includes('common_role_area_manager'))
        );
      },

      // 是否企业管理员
      isEnterpriseManager() {
        const roleList = this.userInfo.roleList;
        return !!roleList && roleList.split(',').includes('common_role_enterprise');
      },

      isShowDealer() {
        return this.organizationTree && this.organizationTree.length > 0;
      },

      storeLabel() {
        // return this.env.ESTATE ? '区域' : '门店';
        if (this.appFeatures && this.appFeatures.indexOf('zhongjun') > -1) {
          return '商场';
        } else {
          return this.env.ESTATE ? '区域' : '门店';
        }
      },
      ownerLabel() {
        // return this.env.ESTATE ? '区域负责人' : '店长';
        return '联系人';
      },
      addressLabel() {
        return this.env.ESTATE ? '所属城市' : '门店地址';
      },
      showOutStoreId() {
        return !this.env.ESTATE;
      },
      showDetailAddress() {
        return !this.env.ESTATE;
      },
      // 判断是否禁止底部批量操作按钮
      disableBatchButton() {
        if (
          this.multipleSelection.length > 0 || // 当前页选中操作的数据数组长度大于0
          this.mTotalCheckedList.length > 0 // 所有被选中的列表list长度大于0
        ) {
          return false;
        }
        return true;
      },
      // 按钮权限-新增门店
      isShowAddButton() {
        //  scrm业态的账号创建门店时，只要门店数量大于0，则不允许继续添加门店
        if (this.isScrmIndustry && (this.totalCount > 0 || this.tableData.length > 0)) {
          return false;
        } else {
          const storeManageButton = scopeMenuEnum.dictionary.companyChildMenu.storeCenterChildMenu;
          const tempMenu = scopeMenuEnum.getMenuScopeByIdentifier(
            this.companyScopeMenu,
            storeManageButton.store_manage_add
          );
          return !!(tempMenu && tempMenu.isHasPermission);
        }
      },
    },

    mounted() {
      this.getOrganizationTreeData();
      this.getAttrList();
    },
    methods: {
      tableActions(row) {
        return [
          {
            name: '详情',
            onClick: () => {
              this.clickViewStore(row);
            },
          },
          {
            name: '编辑',
            onClick: () => {
              this.clickEditDetail(row);
            },
          },
        ];
      },
      getAttrList() {
        const data = {
          queryAll: true,
        };
        orApi.getAttrList(data).then(res => {
          this.attrList = res.data || [];
        });
      },
      handleCommand(command) {
        this[command.handleType](command);
      },
      hasStore(arr) {
        let hasEdit = false;
        const dfs = (newArr, target, path) => {
          for (let i = 0; i < newArr.length; i++) {
            const data = newArr[i];
            if (data.directStoreNum || data.employeeNum) {
              return (hasEdit = true);
            }
            if (Array.isArray(newArr[i].children)) {
              dfs(newArr[i].children);
            }
          }
        };
        dfs(arr);
        return hasEdit;
      },
      hasEdit(children) {
        if (Array.isArray(children)) {
          return this.hasStore(children);
        } else {
          return false;
        }
      },
      // 重置
      handleReset() {
        this.filterForm = {
          storeName: null,
          isOpen: null,
        };
        this.isGlobalSearch = false;
        this.deptIdList = this.organizationTree.length ? this.organizationTree[0].deptId : '';
        this.currentNodeName = this.organizationTree.length ? this.organizationTree[0].name : '';
        this.getStoreList();
      },
      // 查找所有上级/当前item
      findParents(arr, target) {
        let res;
        let parent;

        const dfs = (newArr, newTarget, path) => {
          for (let i = 0; i < newArr.length; i++) {
            if (res) break;
            if (newArr[i].deptId === newTarget) {
              res = newArr[i];
              parent = path;
              return;
            }
            if (Array.isArray(newArr[i].children)) {
              dfs(newArr[i].children, newTarget, path.concat(newArr[i]));
            }
          }
        };
        dfs(arr, target, []);
        return { res, parent };
      },
      // 编辑组织树
      handleEditTree(data) {
        this.isAdd = false;
        // 查找当前节点的所有上级
        const { res, parent } = this.findParents(this.organizationTree, data.deptId);
        this.organizationTreeObj.selectParentIds = [];
        // 上级组织 ids （默认选中）
        parent.forEach(({ deptId }) => {
          this.organizationTreeObj.selectParentIds.push(deptId);
        });
        this.defaultExpandedKey = this.organizationTreeObj.selectParentIds;
        this.organizationTreeObj.parentIds = [...this.organizationTreeObj.selectParentIds];
        // 上级组织 id
        this.organizationTreeObj.parentId =
          this.organizationTreeObj.selectParentIds[this.organizationTreeObj.selectParentIds.length - 1];
        // 获取子级最长长度
        const { count } = this.maxLengthChildren([data] || []);
        this.organizationTreeObj.maxLengthChildren = count;
        // 保留一份已选组织树数据
        this.selectTreeObj = { ...data };

        this.organizationTreeObj.name = { ...data }.name;
        const hasEmplyoeeNum = data.employeeNum;
        // 经销商是否可编辑
        this.organizationTreeObj.isDealerType =
          (parent.length && parent.some(({ type }) => type == 2)) || Array.isArray(data.children) || hasEmplyoeeNum;
        // 是否经销商
        this.organizationTreeObj.type = this.selectTreeObj.type;
        if (this.organizationTreeObj.type) {
          this.organizationTreeObj.dealerNo = { ...data }.dealerNo || '';
        }
        this.addOrganizationCascader = this.getOrganizationCascader(
          this.organizationTree,
          0,
          this.selectTreeObj.deptId
        );
        this.addTreeDialogVisible = true;
      },
      // 查找当前节点的最长下级
      maxLengthChildren(arr) {
        let res;
        let count = 0;

        const dfs = (newArr, num) => {
          for (let i = 0; i < newArr.length; i++) {
            res = newArr[i];
            count = Math.max(num, count);
            if (!newArr.children) {
              count = Math.max(num, count);
            }
            if (Array.isArray(newArr[i].children)) {
              dfs(newArr[i].children, ++num);
            }
          }
        };

        dfs(arr, 0);
        return { res, count };
      },
      // 删除组织树
      handleRemovetree(data) {
        if (data.directStoreNum || data.employeeNum || this.hasEdit(data.children)) {
          return this.$message({
            message: '该组织存在门店或者员工，无法删除',
          });
        }
        this.currentDeptId = data.deptId;
        this.delTreeDialogVisible = true;
      },
      async submitRemoveTree() {
        const params = {
          deptId: this.currentDeptId,
        };
        try {
          await orApi
            .delOrganization(params)
            .then(res => {
              this.getOrganizationTreeData();
              this.$message({
                type: 'success',
                message: '删除成功',
              });
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err.message,
              });
            });
        } finally {
          this.delTreeDialogVisible = false;
        }
      },
      filterNode(value, data) {
        if (data.type == 2) return true;
        return false;
      },
      // 获取已选的组织数据
      ifArrVal(arr, target, current = 'deptId') {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i][current] === target) {
            return arr[i];
          }
          if (Array.isArray(arr[i].children)) {
            const result = this.ifArrVal(arr[i].children, target);
            if (result) {
              return result;
            }
          }
        }
      },
      // 判断下一级是否有与 target 相同的名称
      ifArrName(target) {
        this.errorHasNameMsg = '';
        if (this.currentOrganization.children) {
          const hasName = this.currentOrganization.children.some(({ name }) => target == name);
          if (hasName) {
            this.errorHasNameMsg = '该组织名称已存在，请重新输入';
          }
        }
      },
      // 选择组织树
      handleCascaderChange(value) {
        const parentLength = value.length;
        this.overMaxLength = false;
        if (parentLength + this.organizationTreeObj.maxLengthChildren > 4) {
          this.overMaxLength = true;
          return this.$message({
            type: 'error',
            message: '组织树层级不能大于6级',
          });
        }
        const parentId = value[value.length - 1];
        // 获取当前选中组织树信息
        this.currentOrganization = this.ifArrVal(this.organizationTree, parentId);

        this.organizationTreeObj.parentId = parentId;
        const { res, parent } = this.findParents(this.organizationTree, this.currentOrganization.deptId);
        if (this.isAdd) {
          this.organizationTreeObj.isDealerType = parent && parent.some(({ type }) => type == 2);
        } else {
          // 当前选中下级是否有节点 || 当前编辑节点是否有下级节点
          const isDealerType =
            Array.isArray(this.currentOrganization.children) || Array.isArray(this.selectTreeObj.children);
          // 经销商是否可选
          this.organizationTreeObj.isDealerType = (parent && parent.some(({ type }) => type == 2)) || isDealerType;
        }
      },
      // 经销商不能添加下级 || 层级不能大于4级不能填加下级 || 不能选择自己本身
      getOrganizationCascader(arr, ind, targetId) {
        const dfs = (newArr, num, newTargetId) => {
          for (let i = 0; i < newArr.length; i++) {
            newArr[i].disabled = false;
            newArr[i].dep = num;
            if (newArr[i].type === 2 || newTargetId === newArr[i].deptId || num === 4) {
              newArr[i].disabled = true;
            }
            if (Array.isArray(newArr[i].children)) {
              dfs(newArr[i].children, num + 1, newTargetId);
            }
          }
        };
        dfs(arr, ind, targetId);
        return arr;
      },
      // 添加组织树
      handleAddTree(data) {
        // 查找当前节点的所有上级
        const { res, parent } = this.findParents(this.organizationTree, data.deptId);
        this.organizationTreeObj.selectParentIds = [];
        this.organizationTreeObj.parentId = data.deptId;
        // 上级组织 ids （默认选中）
        parent.forEach(({ deptId }) => {
          this.organizationTreeObj.selectParentIds.push(deptId);
        });
        this.defaultExpandedKey = this.organizationTreeObj.selectParentIds;
        // 默认带入已选组织
        this.organizationTreeObj.parentIds = [...this.organizationTreeObj.selectParentIds, data.deptId];
        // 获取当前节点下的下级
        this.currentOrganization = this.ifArrVal(this.organizationTree, data.deptId);

        this.addOrganizationCascader = this.getOrganizationCascader(this.organizationTree, 0);

        this.isAdd = true;
        this.addTreeDialogVisible = true;
      },
      handleAddTreeSame(data) {
        const { parent } = this.findParents(this.organizationTree, data.deptId);
        const res = parent[parent.length - 1];
        this.organizationTreeObj.selectParentIds = [];
        this.organizationTreeObj.parentId = res.deptId;
        const currentParent = parent.slice(0, -1);
        currentParent.forEach(({ deptId }) => {
          this.organizationTreeObj.selectParentIds.push(deptId);
        });
        this.defaultExpandedKey = this.organizationTreeObj.selectParentIds;
        this.organizationTreeObj.parentIds = [...this.organizationTreeObj.selectParentIds, res.deptId];
        this.currentOrganization = this.ifArrVal(this.organizationTree, res.deptId);
        this.addOrganizationCascader = this.getOrganizationCascader(this.organizationTree, 0);
        this.isAdd = true;
        this.addTreeDialogVisible = true;
      },
      handleSaveAddTree() {
        if (this.overMaxLength) {
          return this.$message({
            type: 'error',
            message: '组织树层级不能大于6级',
          });
        }
        this.$refs.organizationTreeObj.validate(valid => {
          if (valid) {
            if (this.errorHasNameMsg)
              return this.$message({
                type: 'error',
                message: this.errorHasNameMsg,
              });
            const data = {
              name: this.organizationTreeObj.name,
              parentId: this.organizationTreeObj.parentId,
            };
            data.type = this.organizationTreeObj.type;
            // 勾选了 经销商 而且选择了 自定义组织编号
            if (this.organizationTreeObj.dealerNoType == 1) {
              if (!this.organizationTreeObj.dealerNo) {
                return this.$message({
                  type: 'error',
                  message: '请输入组织编号',
                });
              }
              data.dealerNo = this.organizationTreeObj.dealerNo;
            }
            if (this.isAdd) {
              this.submitAddTree(data);
            } else {
              data.dealerNo = this.organizationTreeObj.dealerNo;
              data.deptId = this.selectTreeObj.deptId;
              this.submitEditTree(data);
            }
          }
        });
      },
      submitEditTree(data) {
        orApi.updateOrganization(data).then(res => {
          this.getOrganizationTreeData();
          this.addTreeDialogVisible = false;
          this.$message.success('编辑成功');
          this.resetForm('organizationTreeObj');
        });
      },
      submitAddTree(data) {
        orApi.addOrganization(data).then(res => {
          this.getOrganizationTreeData();
          this.addTreeDialogVisible = false;
          this.$message({ type: 'success', message: '新增成功' });
          this.resetForm('organizationTreeObj');
        });
      },
      handleClose() {
        this.addTreeDialogVisible = false;
        this.resetForm('organizationTreeObj');
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.errorHasNameMsg = '';
        this.organizationTreeObj = {
          parentIds: [],
          parentId: null,
          type: '',
          name: '',
          isDealerType: false,
          dealerNo: '',
          dealerNoType: '1',
        };
      },
      // 点击组织树
      handleNodeClick(draggingNode, dropNode, ev) {
        this.currentNodeName = draggingNode.name;
        this.deptIdList = draggingNode.deptId;
        this.emptyMultipleSelection(); // 更换查询条件时，清空之前选中的操作数据列表
        this.pageNo = 1;
        this.getStoreList();
      },
      /**
       * 批量导出门店
       */
      clickExportStore() {
        const storeManageButton = scopeMenuEnum.dictionary.companyChildMenu.storeCenterChildMenu;
        const tempMenu = scopeMenuEnum.getMenuScopeByIdentifier(
          this.companyScopeMenu,
          storeManageButton.store_manage_export
        );

        if (!tempMenu.isHasPermission) {
          this.$message.error('门店批量导出失败：您当前职位无权限操作');
        } else {
          // 每次批量操作时，主动触发一次计算全部选择的列表
          this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);

          // 所有被选中的列表list长度小于1
          if (this.mTotalCheckedList.length < 1) {
            this.$message.error('请选择要导出的门店');
            return;
          }

          // 批量所有被选中的列表list的itemNo集合
          const stores = [];
          this.mTotalCheckedList.forEach(item => {
            stores.push(item.id);
          });

          this.$confirm(`确定批量导出${this.storeLabel}吗？`, '批量导出', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'wkt-warning',
          })
            .then(() => {
              // post下载
              this.disableBatchExport = true;
              exportExcel
                .getDownload(exportStoreListNew, {
                  storeIds: stores.join(','),
                })
                .then(res => {
                  this.$message({
                    message: '门店导出成功，正在下载',
                    type: 'success',
                  });

                  this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表
                })
                .always(() => {
                  this.disableBatchExport = false;
                });
            })
            .catch(() => {
              console.log('取消导出');
            });
        }
      },
      switchBusiness(store) {
        store.isOpen = !store.isOpen;
        try {
          orApi
            .setStoreIsOpen({
              storeId: store.id,
              isOpen: +!store.isOpen,
            })
            .then(res => {
              store.isOpen = +!store.isOpen;
            });
        } catch (e) {}
      },
      selectAll(selection) {
        this.selected = selection;
      },
      select(selection) {
        this.selected = selection;
      },
      getStoreId() {
        let ids = [];
        this.selected.forEach(item => {
          ids.push(item.id);
        });
        ids = ids.toString();
        return ids;
      },
      setStoreSuperior() {
        try {
          this.storeId = this.getStoreId();
        } catch (e) {}
        if (this.selected.length) {
          this.$refs.setStoreSuperior.open();
        } else {
          this.$message({
            type: 'error',
            message: '请选择门店',
          });
        }
      },
      // 获取子组件的所有部门id
      getDeptId(data) {
        // 数组去重，转换成字符串
        const set = new Set(data);
        let newArr = Array.from(set);
        newArr = newArr.toString();
        this.deptIds = newArr;
        this.getStoreList();
      },
      departmentSelect() {
        this.$refs.departmentSelect.open();
      },
      // 获取部门树
      getDeptTree() {
        this.data = [];
        orApi.getDeptTree({}).then(async res => {
          this.data.push(res.data);
          this.data = await this.changeTreeName(this.data);
        });
      },
      changeTreeName(data) {
        return data.map(item => {
          if (item) {
            const menu = item;
            menu.label = menu.name;
            if (item.children) {
              this.changeTreeName(item.children);
            }
            return menu;
          } else return item;
        });
      },
      // 同步至企业微信
      syncCompanyWx() {
        orApi.syncCompanyWx().then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '同步至企业微信成功',
            });
          } else {
            this.$message({
              type: 'error',
              message: '同步至企业微信失败，请重试',
            });
          }
        });
      },
      /**
       * 批量操作成功之后，清空之前选中的操作数据列表
       */
      emptyMultipleSelection() {
        // 清除之前已选中的状态，重新计算选中的item。
        this.multipleSelection = [];
        this.mResetCheckedData();
        this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);
      },
      search() {
        this.isGlobalSearch = true;
        // 全局搜索清除经销商条件
        this.emptyMultipleSelection(); // 更换查询条件时，清空之前选中的操作数据列表
        this.pageNo = 1;
        this.getStoreList();
      },

      // 页数
      onPageSizeChange(val) {
        this.pageSize = val;
        this.pageNo = 1;
        this.getStoreList();
      },
      // 页码
      onPageNumChange(val) {
        this.pageNo = val;
        this.getStoreList();
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 获取门店数据
      getStoreList() {
        // 获取数据之前，需要重新计算一次选中的item
        this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);
        let isDept = null;
        if (this.deptIds) {
          isDept = 1;
        }
        this.loading = true;
        this.treeloading = true;
        const params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          parentDeptIdList: this.isGlobalSearch ? '' : this.deptIdList,
          isDept,
          ...this.filterForm,
        };

        orApi
          .getStoreList(params)
          .then(res => {
            const { data, totalCount } = res;
            this.tableData = data;
            this.totalCount = totalCount;
            // 成功获取数据之后，重新构建pageList的选中状态
            this.mBuildMultipleTableSelection(this.tableData, 'multipleTable', unionKeys);
          })
          .always(() => {
            this.loading = false;
            this.treeloading = false;
            isDept = null;
          });
      },
      // 查看详情
      clickViewStore(row) {
        this.$router.push({
          path: '/companyManage/store-center/store-mgr/detail',
          query: {
            storeId: row.id,
            data: this.data,
          },
        });
      },
      // 编辑门店
      clickEditDetail(row) {
        this.$router.push({
          path: '/companyManage/store-center/store-mgr/add',
          query: {
            storeId: row.id,
            data: this.data,
          },
        });
      },
      // 新增门店
      clickAddStore() {
        this.$router.push({
          path: '/companyManage/store-center/store-mgr/add',
          query: {
            type: 'add',
            data: this.data,
            valueId: 1,
          },
        });
      },

      // 获取组织树
      getOrganizationTreeData() {
        const data = {
          queryEmployee: false,
          queryStore: false, // 是否显示门店
          queryType: 2, // 查询列表，1 根据角色查询，2 全量查询
          showDeptApp: false, // 是否显示组织下的应用
        };
        orApi.getOrganizationTree(data).then(res => {
          const result = res.data || [];
          if (!this.defaultExpandedKey.length) {
            this.defaultExpandedKey = (result.length && [result[0].deptId]) || [];
          }
          this.deptIdList = result.length ? result[0].deptId : '';
          this.currentNodeName = result.length ? result[0].name : '';
          const depList = arr => {
            const dfs = (newArr, num) => {
              for (let i = 0; i < newArr.length; i++) {
                newArr[i].dep = num;
                if (Array.isArray(newArr[i].children)) {
                  dfs(newArr[i].children, num + 1);
                }
              }
            };
            dfs(arr, 0);
            return arr;
          };
          this.organizationTree = depList(result);
          this.getStoreList();
          // if (this.organizationTree.length) {
          //   this.getDeptList();
          // }
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .store-list-container {
    /deep/ .list-page__main-actions {
      top: 24px;
    }

    .title {
      position: relative;
      font-size: 20px;
      background: white;
      top: -38px;
    }

    .content {
      padding: 20px;
      background: white;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
      }

      .selector {
        color: #333;
        font-size: 12px;
        margin-left: 20px;
        display: inline-block;

        /deep/ .el-button {
          width: 20px;
          display: inline-block;
          padding: 0;
        }
      }

      .button_bar {
        display: flex;
        justify-content: space-between;
      }
    }

    .tree-selector {
      height: 701px;
      width: 285px;
      background: #f2f4f7;
      font-size: 14px;
      position: relative;
      margin-right: 20px;

      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;

        /deep/ .el-scrollbar__bar {
          z-index: 0;
        }

        span {
          flex: 1;
          text-align: left;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
          background: url('../../../../images/dept.png') 0 0 no-repeat;
          background-size: cover;
          display: inline-block;
          margin-right: 7px;
        }

        &.type3::before {
          content: '';
          width: 20px;
          height: 20px;
          background: url('../../../../images/store.png') 0 0 no-repeat;
          background-size: cover;
          display: inline-block;
          margin-right: 7px;
        }

        &.type2::before {
          content: '';
          width: 20px;
          height: 20px;
          background: url('../../../../images/dealer.png') 0 0 no-repeat;
          background-size: cover;
          display: inline-block;
          margin-right: 7px;
        }

        &.type0::before {
          content: '';
          width: 20px;
          height: 20px;
          background: url('../../../../images/organization.png') 0 0 no-repeat;
          background-size: cover;
          display: inline-block;
          margin-right: 7px;
        }
      }

      /deep/ .el-popper {
        margin: 0;
      }

      /deep/ .el-dropdown-menu {
        margin: 0;
        padding: 0;
        overflow: inherit;
      }

      /deep/ .el-scrollbar__wrap {
        z-index: 2;
      }

      /deep/ .el-tree {
        background: #f2f4f7;

        /*  .el-tree-node{
              min-width: 100%;
              display:inline-block;
            } */

        /deep/ .el-button {
          padding: 0;
          margin: 0;
          color: #000;
          z-index: 2;
        }

        /deep/ .el-button.is-disabled {
          background: transparent;
          color: #ccc;
          border: none;
        }
      }

      /deep/ .el-tree-node__content {
        height: 40px;
        line-height: 40px;
        width: 100%;
        box-sizing: border-box;
        padding-right: 10px;
      }
    }

    .store-container {
      display: flex;
      background: white;
    }

    .table-box {
      vertical-align: top;
      flex: 1;
      // overflow-x: scroll;
      overflow: hidden;
      margin: 20px 0;

      /deep/ .el-table {
        width: 100%;
      }

      .table-href {
        margin-left: 10px;
      }

      .table-href:first-child {
        margin-left: 0;
      }
    }

    .icon {
      width: 34px;
      height: 34px;
      border-radius: 100%;
      vertical-align: middle;
      display: inline-block;
      margin-right: 10px;
      background-size: cover !important;
    }

    .pagination {
      /deep/ .el-pagination {
        margin-right: 100px;
      }

      /deep/ .btn-next {
        position: relative;

        &::after {
          content: '尾页';
          font-size: 14px;
          position: absolute;
          top: 0;
          left: 27px;
        }
      }

      /deep/ .el-pagination__jump {
        margin-left: 50px;
        margin-right: 20px;
      }
    }
  }

  /deep/ .dialog .el-input__inner {
    width: 230px;
  }

  /deep/ .el-table {
    td {
      height: 120px;

      div.cell {
        min-height: 32px;
      }
    }
  }
</style>
