<template>
  <div class="employee">
    <header>
      <div class="match-model" v-loading="loading.rule">
        企业员工匹配模式
        <el-switch
          class="switch"
          active-text="开启"
          inactive-text="关闭"
          v-model="switchMode"
          @change="handleSwitchChange"
        />
        <p class="tip">
          开启后，分销员申请手机号匹配员工手机号则自动审核通过，且不再支持手动审核；同时，若同步到员工离职状态，则该员工的分销权限将被冻结。
        </p>
      </div>
      <div class="filter">
        <span style="line-height: 36px;">姓名或手机号：</span>
        <search-input
          v-model="filterKw"
          placeholder="搜索员工姓名或手机号"
          clearable
          @search="handleSearch"
          style="width: 280px"
        />
      </div>
    </header>
    <main class="container">
      <div class="left">
        <el-tree
          default-expand-all
          class="org-tree"
          ref="tree"
          :expand-on-click-node="false"
          icon-class=""
          :data="treeData"
          @node-click="handleTreeNodeClick"
          :props="{ label: 'name', children: 'children' }"
          v-loading="loading.org"
        />
      </div>
      <div class="right">
        <h2>{{ (current && current.name) || '未选择部门' }}</h2>
        <el-table :data="employeeList" v-loading="loading.employee">
          <el-table-column prop="name" label="员工信息">
            <span slot-scope="scope" class="emp-info">
              <span>{{ scope.row.name }}</span>
              <span>{{ scope.row.phone }}</span>
            </span>
          </el-table-column>
          <el-table-column prop="department" label="部门" />
          <el-table-column prop="positionName" label="职位" />
          <el-table-column prop="gender" label="性别">
            <span slot-scope="scope">
              {{ scope.row.gender == 2 ? '男' : '女' }}
            </span>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="status" label="状态">
            <span slot-scope="scope">
              {{ scope.row.status == 1 ? '在职' : '离职' }}
            </span>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
            <span slot-scope="scope">
              {{ scope.row.createTime | time }}
            </span>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间">
            <span slot-scope="scope">
              {{ scope.row.updateTime | time }}
            </span>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handlePageNoChange"
          :current-page="employeePage.pageNo"
          :page-size="employeePage.pageSize"
          :page-sizes="[10, 15, 50, 100]"
          layout="prev, pager, next, jumper, sizes, total"
          v-if="employeePage.totalCount"
          :total="employeePage.totalCount"
        />
      </div>
    </main>
  </div>
</template>

<script>
import SearchInput from '@/dss-wechat3rd/src/components/search-input';
import api from '@/dss-wechat3rd/src/api/distribution';

export default {
  data() {
    return {
      filterKw: '',
      treeData: [],
      tableData: [],
      orgData: null,
      current: null,
      employeePage: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      },
      employeeList: [],
      loading: {
        employee: false,
        org: false,
        rule: false
      },
      ruleData: {}
    };
  },
  components: { SearchInput },
  methods: {
    handleSearch() {
      this.employeePage.pageNo = 1;
      this.queryEmployee();
    },

    async queryOrg() {
      this.loading.org = true;
      try {
        const { data } = await api.queryOrg();
        const rootData = this.genTreeData(
          (data || []).filter(d => !d.upperOrgId),
          data
        );
        this.treeData = rootData;
        if (!this.current) {
          this.current = rootData[0];
        }
      } finally {
        this.loading.org = false;
      }
    },

    async queryEmployee() {
      this.loading.employee = true;
      try {
        const { data, totalCount } = await api.queryEmployee({
          ...this.employeePage,
          departmentIds: (this.genDepartmentIds(this.current) || []).join(','),
          keyword: this.filterKw
        });
        this.employeeList = data;
        this.employeePage.totalCount = totalCount;
      } finally {
        this.loading.employee = false;
      }
    },

    genTreeData(nodeArr, data) {
      const res = nodeArr.map(node => {
        const children = this.genTreeData(
          data.filter(d => d.upperOrgId === node.id),
          data
        );
        return { ...node, children };
      });
      return res;
    },

    handleTreeNodeClick(node) {
      this.current = node;
      this.employeePage.pageNo = 1;
      this.queryEmployee();
      const container$ = document.querySelector('.wkt-sub-nav-container');
      if (!container$) return;

      if (container$.scrollTo) {
        container$.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        container$.scrollTop = 0;
      }
    },

    handlePageNoChange(pageNo) {
      this.employeePage.pageNo = pageNo;
      this.queryEmployee();
    },

    handlePageSizeChange(pageSize) {
      this.employeePage.pageSize = pageSize;
      this.queryEmployee();
    },

    flatten(arr) {
      return arr.reduce((pre, cur) => {
        if (cur instanceof Array) {
          pre.push(...this.flatten(cur));
        } else {
          pre.push(cur);
        }
        return pre;
      }, []);
    },

    genDepartmentIds(node) {
      if (!node) return [];
      const ids = [node.id, ...node.children.map(this.genDepartmentIds)];
      return this.flatten(ids);
    },

    async queryRule() {
      this.loading.rule = true;
      try {
        const { data } = await api.queryItemSetting();
        this.ruleData = { isAutoMatching: data.isAutoMatching, id: data.id };
      } finally {
        this.loading.rule = false;
      }
    },

    async updateRule(isAutoMatching) {
      this.loading.rule = true;
      try {
        api.updateItemSetting({ ...this.ruleData, isAutoMatching });
      } finally {
        this.loading.rule = false;
      }
    },

    handleSwitchChange(data) {
      this.updateRule(data ? 1 : 0);
    }
  },
  async mounted() {
    this.queryRule();
    await this.queryOrg();
    await this.queryEmployee();
  },
  computed: {
    switchMode: {
      get() {
        return !!this.ruleData.isAutoMatching;
      },
      set(val) {
        this.ruleData.isAutoMatching = val ? 1 : 0;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.employee {
  background: #fff;
  padding-bottom: 30px;
}
.match-model {
  display: flex;
  align-content: center;
  color: rgba(51, 51, 51, 1);
  font-size: 14px;
  text-align: left;
  font-family: PingFangSC-Regular;
  padding: 4px 20px;
  .switch {
    margin: 0 20px 0 10px;
  }
  .tip {
    color: rgba(162, 162, 162, 1);
    font-size: 14px;
    text-align: left;
    font-family: PingFangSC-Regular;
  }
}

.filter {
  height: 86px;
  display: flex;
  align-content: center;
  // background-color: rgba(245, 247, 250, 1);
  padding: 0 20px;
  margin: 20px 0;
}

.container {
  display: flex;
  flex-direction: row;
  padding-left: 20px;
  .left {
    flex-shrink: 0;
    width: 300px;
  }
  .right {
    flex: 1;
    margin-left: 30px;
  }
}

.emp-info {
  display: flex;
  flex-direction: column;
}
.employee {
  /deep/.el-tree .el-tree-node__content {
    border: 0;
  }
}
.left {
  background-color: rgba(245, 247, 250, 1);
  padding: 20px;
  .org-tree {
    background-color: rgba(245, 247, 250, 1);
  }
}
</style>