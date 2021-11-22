<template>
  <div class="quote-employee-page">
    <div class="quote-employee-filter">
      <el-form @submit.native.prevent inline class="wkt-opt-label-container goods-list-filter" @keypress.enter="handleSearch">
        <el-form-item label="员工姓名">
          <el-input placeholder="请输入员工姓名" size="mini" v-model.trim="filterForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="员工岗位">
          <el-select v-model="filterForm.positionName" @change="handleSearch">
            <el-option label="全部" :value="null" />
            <el-option v-for="item in positionOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="员工联系方式">
          <el-input placeholder="请输入员工手机号" size="mini" v-model.trim="filterForm.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="员工所属部门">
          <el-cascader
            :options="departmentOptions"
            v-model="filterForm.departmentIds"
            :show-all-levels="false"
            :change-on-select="true"
            @visible-change="val => val || handleSearch()"
          />
        </el-form-item>

        <el-form-item>
          <el-button class="single-search-btn" type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="list">
      <div class="tabs-wrapper">
        <el-tabs v-model="confirmStatus" class="tabs" @tab-click="handleStatusTabClick">
          <el-tab-pane label="已确认" name="1"> </el-tab-pane>
          <el-tab-pane label="未确认" name="2"> </el-tab-pane>
        </el-tabs>
        <el-button
          class="batch"
          @click="batchConfirm"
          type="primary"
          v-if="confirmStatus != 1"
          :disabled="selection.length === 0"
          :loading="batchConfirmLoading"
          >批量确定</el-button
        >
      </div>

      <el-table
        :data="tableList"
        style="width: 100%"
        class="wkt-table quote-table"
        v-loading="loading"
        @select="handleSelect"
        @select-all="handleSelect"
      >
        <el-table-column :selectable="() => confirmStatus != 1" type="selection" width="70"></el-table-column>
        <el-table-column prop="code" label="员工编号"></el-table-column>
        <el-table-column prop="name" label="员工姓名"></el-table-column>
        <el-table-column prop="phone" label="员工联系方式" width="200px"></el-table-column>
        <el-table-column prop="department" label="所属部门">
          <template slot-scope="scope">
            {{ scope.row.department || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="positionName" label="岗位"></el-table-column>
        <el-table-column prop="confirmStatus" label="确认状态">
          <template slot-scope="scope">
            {{ scope.row.confirmStatus == 1 ? '已确认' : '未确认' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="confirmStatus != 1">
          <template slot-scope="scope">
            <el-popover width="160" v-model="scope.row.popover">
              <p>确定该员工报价权限？</p>
              <div style="text-align: right; margin-top: 10px">
                <el-button size="mini" type="text" :disabled="confirmLoading" @click="scope.row.popover = false"
                  >取消</el-button
                >
                <el-button type="primary" size="mini" @click="confirm(scope.row)" :loading="confirmLoading">
                  确定
                </el-button>
              </div>
              <a slot="reference" class="table-href" href="javascript:;">确定</a>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :page-size="pageParams.pageSize"
        :total="totalCount"
        :current-page="pageParams.pageNo"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import date from '@/dss-common/utils/date';
import api from '@/dss-wechat3rd/src/api/distribution';

export default {
  name: 'employee-list',
  data() {
    return {
      loading: false,
      confirmLoading: false,
      batchConfirmLoading: false,

      filterForm: {
        departmentIds: null, // 部门
        name: null, // 名称
        positionName: null, // 岗位
        phone: null // 电话
      },
      tableList: [],
      pageParams: {
        pageSize: 10, //每页条数
        pageNo: 1 //页数
      },
      totalCount: 0,
      positionOptions: [],
      departmentOptions: [],
      confirmStatus: '1',
      // 已选择的员工
      selection: []
    };
  },

  filters: {
    formatDate(val) {
      if (!val) return '';
      return date.format(new Date(val), 'YYYY-MM-DD HH:mm:ss');
    }
  },

  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchList(); // 根据商品类型获取门店下的商品列表
      vm.getDepartmentOptions(); // 查询 部门信息
      vm.getPositionOptions(); // 查询 岗位
    });
  },

  methods: {
    // 搜索
    handleSearch() {
      this.fetchList();
    },
    fetchList() {
      this.loading = true;
      // 拿到叶节点的 ids
      const departmentIds = (this.filterForm.departmentIds || [null]).slice(-1)[0];
      const params = { ...this.pageParams, ...this.filterForm, confirmStatus: this.confirmStatus, departmentIds };
      const url = '';
      // 清空
      this.selection = [];

      return api
        .queryEmployee(params)
        .done(res => {
          this.totalCount = res.totalCount || 0;
          this.tableList = res.data || [];
        })
        .always(() => {
          this.loading = false;
        });
    },
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.fetchList();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.fetchList();
    },
    // 批量确定
    async batchConfirm() {
      const ids = this.selection.map(i => i.id).join(',');
      const url = `${constants.Api.quote.quotationConfirm}?employeeIdList=${ids}`;
      try {
        this.batchConfirmLoading = true;
        await services.post(url, {}, { action: '批量确定员工报价权限' });

        await this.fetchList();
      } finally {
        this.batchConfirmLoading = false;
      }
    },

    async confirm(row) {
      try {
        this.confirmLoading = true;

        const url = `${constants.Api.quote.quotationConfirm}?employeeIdList=${row.id}`;
        await services.post(url, {}, { action: '确定员工报价权限' });

        await this.fetchList();
      } finally {
        this.confirmLoading = false;
        row.popover = false;
      }
    },

    handleSelect(selection) {
      this.selection = selection;
    },

    handleStatusTabClick() {
      this.fetchList();
    },

    async getPositionOptions() {
      const { data } = await services.get(constants.Api.quote.positionList, { action: '查询岗位列表' });
      this.positionOptions = data;
    },

    async getDepartmentOptions() {
      const { data } = await api.queryOrg();

      const _data = (data || []).map(i => ({ ...i, label: i.name, value: i.id }));
      this.departmentOptions = this.genTreeData(
        _data.filter(d => !d.upperOrgId),
        _data
      );

      const genIdsVal = node => {
        node.value = this.genDepartmentIds(node).join(',');
        if (node.children) {
          node.children.forEach(c => genIdsVal(c));
        }
      };

      this.departmentOptions.forEach(genIdsVal);

      this.departmentOptions.unshift({
        value: null,
        label: '全部部门'
      });
    },

    // 将 department 转成树
    genTreeData(nodeArr, data) {
      const res = nodeArr.map(node => {
        const children = this.genTreeData(
          data.filter(d => d.upperOrgId === node.id),
          data
        );
        return { ...node, children: children && children.length ? children : null };
      });
      return res;
    },

    // 获得 department 下面所有（包括 children，递归获取）的 id
    genDepartmentIds(node) {
      if (!node) return [];
      const ids = [node.id, ...(node.children || []).map(this.genDepartmentIds)];
      return this.flatten(ids);
    },

    // 数组扁平化
    flatten(arr) {
      return arr.reduce((pre, cur) => {
        if (cur instanceof Array) {
          pre.push(...this.flatten(cur));
        } else {
          pre.push(cur);
        }
        return pre;
      }, []);
    }
  }
};
</script>

<style lang="less" scoped>
.quote-employee-page {
  .tabs {
    padding: 0 10px;
  }

  .quote-table {
    margin-top: 0;
  }

  .list {
    padding: 10px 0;
  }
}

.tabs-wrapper {
  position: relative;
}
.batch {
  position: absolute;
  top: 0;
  right: 10px;
}
</style>
