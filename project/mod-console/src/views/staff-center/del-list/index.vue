<template>
  <list-page-layout>
    <template #filters>
      <el-form
        ref="query"
        class="condition wkt-opt-label-container"
        @submit.prevent.native="$refs.table.search()"
        inline
        :model="form"
        style="background: #fff"
      >
        <el-form-item label="搜索账号" prop="keyword">
          <el-input
            type="input"
            v-model.trim="form.keyword"
            style="width: 200px; display: inline-block"
            placeholder="搜索账号，姓名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="search-btn" native-type="submit">搜索</el-button>
          <el-button type="plain" class="search-btn" @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <div v-loading="loading" class="staff-del-mgr">
      <div class="del-employee-table-content">
        <fat-table ref="table" :state="form" :fetch-handler="apiList" class="wkt-table">
          <el-table-column prop="phone" label="账号"> </el-table-column>
          <el-table-column prop="name" label="姓名"> </el-table-column>
          <!--<el-table-column prop="positionName"
                           label="职位">
          </el-table-column>-->
          <el-table-column label="角色">
            <template slot-scope="scope">
              <span>{{ scope.row.employeeStoreRoleList ? scope.row.employeeStoreRoleList[0].roleName : '' }}</span>
              <br />
              <span>{{
                scope.row.employeeStoreRoleList && scope.row.employeeStoreRoleList[1]
                  ? scope.row.employeeStoreRoleList[1].roleName
                  : ''
              }}</span>
              <span>{{ scope.row.employeeStoreRoleList && scope.row.employeeStoreRoleList[2] ? '...' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
            <span slot-scope="scope">
              {{ scope.row.createTime | time }}
            </span>
          </el-table-column>
          <!--<el-table-column prop="storeName"
                           label="所属门店">
          </el-table-column>-->
          <el-table-column :label="`所属${storeLabel}`">
            <template slot-scope="scope">
              <span>{{ scope.row.employeeStoreRoleList ? scope.row.employeeStoreRoleList[0].deptName : '' }}</span>
              <br />
              <span>{{
                scope.row.employeeStoreRoleList && scope.row.employeeStoreRoleList[1]
                  ? scope.row.employeeStoreRoleList[1].deptName
                  : ''
              }}</span>
              <span>{{ scope.row.employeeStoreRoleList && scope.row.employeeStoreRoleList[2] ? '...' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" v-slot="scope" width="80">
            <table-actions class="table-href" :options="tableActions(scope.row)" />
          </el-table-column>
        </fat-table>
      </div>
    </div>
  </list-page-layout>
</template>

<script>
  import * as staffApi from '@/mod-console/src/api/staffApi';
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  import { mapState } from 'vuex';

  export default {
    components: {
      ListPageLayout,
      FatTable,
      TableActions,
    },
    data() {
      return {
        // 查询列表相关信息
        loading: false,
        form: {
          keyword: '',
        },
      };
    },

    computed: {
      ...mapState({
        env: 'env',
      }),
      storeLabel() {
        return this.env.ESTATE ? '区域' : '组织';
      },
    },

    mounted() {
      // this.apiList();
    },

    methods: {
      tableActions(row) {
        return [
          {
            name: '恢复',
            onClick: () => {
              this.clickRecovery(row);
            },
          },
        ];
      },
      // triggerApiList(key, value) {
      //   this.isGlobalSearch = true;
      //   this.pageNo = 1;
      //   this.apiList();
      // },

      // 恢复员工
      clickRecovery(row) {
        staffApi.recoveryEmployee({ id: row.id }).then(() => {
          this.$message({ message: '恢复成功', type: 'success' });
          this.$nextTick(() => {
            this.$refs.table.refresh();
          });
        });
      },
      // 门店去重
      uniqObjInArray(objarray) {
        const obj = {};
        const peon = objarray.reduce((cur, next) => {
          obj[next.storeId] ? '' : (obj[next.storeId] = true && cur.push(next));
          return cur;
        }, []); // 设置cur默认类型为数组，并且初始值为空的数组
        return peon;
      },
      // 查询员工列表
      async apiList(params) {
        // 分页信息
        const { pagination } = params;
        // 请求参数
        const payload = {
          pageNo: pagination.pageNo,
          pageSize: pagination.pageSize,
          keyword: this.form.keyword ? this.form.keyword : undefined,
          positionId: this.positionId ? this.positionId : undefined,
          status: 2,
        };
        const { data, totalCount } = await staffApi.getEmployeeListV3(payload);
        data &&
          data.forEach(item => {
            item.employeeStoreRoleList = this.uniqObjInArray(item.employeeStoreRoleList);
          });
        return {
          list: data,
          total: totalCount,
        };
      },
    },
  };
</script>
<style scoped lang="less">
  .staff-del-mgr {
    padding: 20px;
    background: white;
    .wkt-opt-label-container {
      padding-left: 20px;
    }
  }
</style>
