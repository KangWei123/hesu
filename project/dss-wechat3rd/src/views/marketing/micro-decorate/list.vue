<template>
  <div class="courtesy marketing-page goods-list-container">
    <div class="Add-Manage-Button">
      <el-button @click="onAdd" type="primary" v-if="hasPermission">新增方案</el-button>
      <el-popover
        placement="top-start"
        width="200"
        trigger="click"
        v-else
        content="当前角色无法进行新增"
      >
        <el-button type="primary" slot="reference">新增方案</el-button>
      </el-popover>
    </div>
    <div class="courtesy-filter">
      <el-input
        style="width: 200px; margin-right: 20px"
        placeholder="请输入方案名称"
        v-model.trim="keyword.name"
        @change="handleSearch"
        clearable
      ></el-input>

      <el-select v-model="keyword.isShelf" placeholder="全部状态" @change="handleSearch" style="width: 200px; margin-right: 20px">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button class="single-search-btn" type="primary">
          搜索
      </el-button>
    </div>
    <div class="courtesy-box">
      <el-button @click="onDelete()" :disabled="computeDisableBatchButton || !hasPermission">批量删除</el-button>
    </div>
    <div class="micro-list element-tags wkb-table-border">
      <el-table :data="tableData"
                style="width: 100%"
                class="wkt-table"
                v-loading="loading"
                ref="multipleTable"
                @sort-change="sortChange"
                @selection-change="handleSelectionChange">

        <el-table-column type="selection"
                         width="70">
        </el-table-column>
        <el-table-column prop="name" label="方案名称" :show-overflow-tooltip="true" />

        <el-table-column prop="appointmentNum" sortable="custom" label="预约人数" width="130" />

        <el-table-column prop="viewNum" label="浏览人数" width="100" />

        <el-table-column prop="approvalNum" label="点赞人数" width="100" />

        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <div :class="scope.row.isShelf? 'goods-shlef':'goods-lower'">
              <el-switch  v-if="userInfo.userId === scope.row.createUser"
                          v-model="scope.row.isShelf"
                          :active-value="1"
                          :inactive-value="0"
                          active-text="上架"
                          inactive-text="下架"
                          active-color="#52C41A"
                          inactive-color="#B1B5BD"
                          @change="onToggleSwitch(scope.row)" />

              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                v-else
                :content="`您无权对${scope.row.storeId? '门店':'总部'}方案进行操作`"
              >
                <el-switch  slot="reference"
                            v-model="scope.row.isShelf"
                            disabled
                            :active-value="1"
                            :inactive-value="0"
                            active-text="上架"
                            inactive-text="下架"
                            active-color="#52C41A"
                            inactive-color="#B1B5BD" />
              </el-popover>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="创建人" :show-overflow-tooltip="true">
          <template slot-scope="scope">
             {{scope.row.createUserName || '--'}} ({{scope.row.storeId? '区域':'超级'}}管理员)
          </template>
        </el-table-column>

        <el-table-column label="创建组织" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{scope.row.storeId? '区域 (' + scope.row.storeName + ')':'总部'}}
          </template>
        </el-table-column>

        <el-table-column min-width="120" label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime | datatime}}
          </template>
        </el-table-column>

        <el-table-column min-width="150" label="操作">
          <div slot-scope="scope">
            <a @click="onEdit(scope.row.id, 1)">查看</a>
            <a @click="onEdit(scope.row.id, 0)" v-if="userInfo.userId === scope.row.createUser">编辑</a>
            <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                v-else
                :content="`您无权对${scope.row.storeId? '门店':'总部'}方案进行编辑`"
              >
              <a slot="reference">编辑</a>
            </el-popover>
            <br>
            <a @click="viewData(scope.row)">预约详情</a>
            <a @click="onDelete(scope.row.id)" v-if="userInfo.userId === scope.row.createUser">删除</a>
            <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                v-else
                :content="`您无权对${scope.row.storeId? '门店':'总部'}方案进行删除`"
              >
              <a slot="reference">删除</a>
            </el-popover>
          </div>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalCount"
        :page-size="page.pageSize"
        :current-page="page.pageNo"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import datetime from '@/dss-common/utils/date.js';
import microDecorate from '@/dss-wechat3rd/src/api/micro-decorate';
import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';

const unionKeys = ['id'];

export default {
  mixins: [tableCheckedHelperMixin],
  data() {
    return {
      keyword: {
        isShelf: null,
        name: '',
        orderByAN: null
      },
      statusOptions: [
        {
          value: null,
          label: '全部状态'
        },
        {
          value: 1,
          label: '上架'
        },
        {
          value: 0,
          label: '下架'
        }
      ],
      tableData: [],
      page: {
        pageSize: 10,
        pageNo: 1
      },
      totalCount: 0,
      isLoading: false,
      loading: false,
      multipleSelection: []
    };
  },

  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getList(); // 获取列表
    });
  },

  mounted() {
    this.getList();
  },

  computed: {
    // 判断是否禁止批量操作按钮
    computeDisableBatchButton() {
      if (
        this.multipleSelection.length > 0 || // 当前页选中操作的数据数组长度大于0
        this.mTotalCheckedList.length > 0 // 所有被选中的列表list长度大于0
      ) {
        return false;
      }
      return true;
    },
    ...mapState({
      roleList: 'roleList',
      userInfo: 'userInfo'
    }),
    /**
     * 是否企业管理员
     */
    isEnterpriseManager() {
      return !!this.roleList && this.roleList.indexOf('common_role_enterprise') !== -1;
    },

    /**
     * 是否区域管理员
     */
    isAreaManager() {
      return (
        !!this.roleList &&
        (this.roleList.indexOf('common_role_area_manager') !== -1 ||
          this.roleList.indexOf('common_role_dealer_manager') !== -1)
      );
    },

    hasPermission() {
      if (this.isEnterpriseManager || this.isAreaManager) {
        return true;
      }

      return false;
    }
  },

  filters: {
    datatime: function(value) {
      return datetime.format(new Date(value), 'YYYY-MM-DD HH:mm:ss');
    }
  },

  methods: {
    getList() {
      // 获取数据之前，需要重新计算一次选中的item
      this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);

      this.loading = true;
      return microDecorate
        .list({
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          name: this.keyword.name,
          isShelf: this.keyword.isShelf,
          orderByAN: this.keyword.orderByAN,
          status: 1
        })
        .then(res => {
          this.tableData = res.data || [];
          this.totalCount = res.totalCount;

          this.mBuildMultipleTableSelection(this.tableData, 'multipleTable', unionKeys);
        })
        .always(() => {
          this.loading = false;
        });
    },

    reLoad() {
      this.page.pageNo = 1;
      this.getList();
    },

    handleSearch() {
      this.reLoad();
    },

    sortChange(info) {
      let sortParms = {
        ascending: 1,
        descending: 2
      };

      this.keyword.orderByAN = sortParms[info.order];
      this.reLoad();
    },

    onAdd() {
      this.$router.push('/marketing/micro-decorate/list/add');
    },

    onEdit(id, flag) {
      this.$router.push({
        path: '/marketing/micro-decorate/list/add',
        query: {
          id,
          isView: flag
        }
      });
    },

    viewData(row) {
      this.$router.push({
        path: '/marketing/form-utils/list/submit-data',
        query: {
          id: row.formId,
          activityId: row.id
        }
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
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

    onDelete(id) {
      if (id) {
        this._ids = [id];
      } else {
        // 每次批量操作时，主动触发一次计算全部选择的列表
        this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);

        this._ids = this.mTotalCheckedList.map(item => item.id);

        let hasPermission = this.mTotalCheckedList.every(item => item.createUser === this.userInfo.userId);

        if (!hasPermission) {
          this.$message({
            showClose: true,
            type: 'error',
            duration: 2000,
            message: '存在无权限操作的数据'
          });
          return false;
        }
      }
      this.handleDelete();
    },

    handleDelete() {
      this.$confirm(
        `确认删除选中的${this._ids.length}个方案吗？删除后不可恢复，可在已删除方案中查看历史预约数据`,
        '删除方案',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning'
        }
      ).then(() => {
        this.loading = true;

        microDecorate
          .del({ ids: this._ids.toString() })
          .then(res => {
            this.emptyMultipleSelection();
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.reLoad();
          })
          .always(() => {
            this.loading = false;
          });
      });
    },

    onToggleSwitch(row) {
      row.isShelf = !row.isShelf;
      this.onToggleShelf(row);
    },

    //开关
    onToggleShelf(row) {
      this.loading = true;

      microDecorate
        .shelf({
          id: row.id,
          shelf: row.isShelf ? 0 : 1
        })
        .then(res => {
          this.reLoad();
        })
        .always(() => {
          this.loading = false;
        });
    },

    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.getList();
    },

    onPageChange(page) {
      this.page.pageNo = page;
      this.getList();
    }
  }
};
</script>

<style lang="less">
.courtesy-filter {
  display: flex;
  align-items: center;
  .bg-mixin;
  background: #ffffff;
  padding: 6px 20px 16px;
  margin-bottom: 16px;
}

.courtesy-box{
  padding-top: 16px;
  display: flex;
  margin-left: auto;
  background: #fff;


  .el-button{
    margin-left: 20px;
  }
}

.micro-list {
  .bg-mixin;
  border-radius: 4px;
  padding-bottom: 20px;
}
</style>
