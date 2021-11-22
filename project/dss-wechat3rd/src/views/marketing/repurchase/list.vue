<template>
  <div class="repurchase" v-loading="loading">
    <h3 class="title">加价换购</h3>
    <div class="repurchase-filter">
      <el-form @submit.native.prevent inline class="wkt-opt-label-container">
        <el-form-item>
          <el-input
            style="width:250px"
            placeholder="搜索活动名称"
            size="mini"
            v-model.trim="keyword.repurchaseActivityName"
            clearable
            @change="changeInput"
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleChange" class="search-btn" size="mini" type="primary">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dateValue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            @change="handleChange($event, 'date')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select
            clearable
            v-model="keyword.storeId"
            placeholder="选择参与门店"
            size="mini"
            @change="handleChange"
          >
            <el-option
              v-for="item in shopOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            clearable
            v-model="keyword.status"
            placeholder="选择活动状态"
            size="mini"
            @change="handleChange"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="repurchase-box">
        <el-button style="float: right;" @click="onAdd" round type="primary" size="mini">创建活动</el-button>
      </div>
    </div>
    <div class="repurchase-list">
      <el-table
        :data="tableData"
        style="width: 100%"
        class="wkt-table"
        v-loading="listLoading"
      >
        <el-table-column align="left" prop="repurchaseActivityName" label="活动名称" />
        <el-table-column align="center" prop="" label="活动详情">
          <template slot-scope="scope">
            <span>满{{ parseInt(scope.row.repurchaseThresholdFee || 0) / 100 }}元，加{{ parseInt(scope.row.repurchaseMarkupFee || 0) / 100 }}元换购</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="currentCount" label="参与人数" />
        <el-table-column align="center" prop="startTime" label="开始时间" />
        <el-table-column align="center" prop="endTime" label="结束时间" />
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">未开始</span>
            <span v-if="scope.row.status === 1">进行中</span>
            <span v-if="scope.row.status === 2">已结束</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="操作">
          <div slot-scope="scope">
            <a @click="onEdit(scope.row)">编辑</a>
            <a @click="onEnd(scope.row)" :class="[ scope.row.status === 2 ? 'a-disabled' : '' ]">终止活动</a>
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
  import courtesyApi from '@/dss-wechat3rd/src/api/courtesy';
  import repurchaseApi from '@/dss-wechat3rd/src/api/repurchaseApi.js';
  import { mapState } from 'vuex';
  export default {
    data() {
      return {
        loading: false,
        keyword: {
          repurchaseActivityName: null,
          storeId: null,
          status: null,
          startTime: null,
          endTime: null
        },
        dateValue: [],
        shopOptions: [],
        options: [
          { value: null, label: '所有状态' },
          { value: 0, label: '未开始' },
          { value: 1, label: '进行中' },
          { value: 2, label: '已结束' }
        ],
        listLoading: false,
        tableData: [],
        page: {
          pageSize: 10,
          pageNo: 1
        },
        totalCount: 0,
        storeInfo: {
          per_chooseAppId: null,
          per_chooseEpId: null
        }
      };
    },

    computed: {
      ...mapState({
        userInfo: state => state.userInfo
      })
    },

    mounted() {
      this.getAllStores();
    },

    methods: {
      // 获取全部门店
      getAllStores() {
        this.loading = true;
        this.storeInfo.per_chooseAppId = this.userInfo.appInfo.id;
        this.storeInfo.per_chooseEpId = this.userInfo.appInfo.epId;
        const params = {
          ...this.storeInfo
        };
        courtesyApi
          .queryList(params)
          .then(res => {
            this.stores = res.data;
            this.stores.forEach(e => {
              this.shopOptions.push({
                value: e.id,
                label: e.name
              });
            });
            this.shopOptions.unshift({
              value: null,
              label: '全部门店'
            });
            this.getList();
          })
          .always(_ => {
            this.loading = false;
          });
      },

      // 获取列表
      getList() {
        this.listLoading = true;
        const params = {
          ...this.page,
          ...this.keyword
        };
        repurchaseApi
          .query(params)
          .then(res => {
            this.tableData = res.data || [];
            this.totalCount = res.totalCount || 0;
          })
          .always(() => {
            this.listLoading = false;
          });
      },

      changeInput(val) {
        if (val === '') {
          this.keyword.repurchaseActivityName = null;
        }
      },

      handleChange(e, type) {
        if (type === 'date') {
          if (e) {
            this.keyword.startTime = e[0];
            this.keyword.endTime = e[1];
          } else {
            this.keyword.startTime = null;
            this.keyword.endTime = null;
          }
        }
        this.getList();
      },

      onAdd() {
        this.$router.push('/marketing/repurchase/add');
      },

      onEdit(row) {
        this.$router.push(`/marketing/repurchase/add?id=${row.id}`);
      },

      onEnd(row) {
        if (row.status === 2) return;
        this.$confirm('确定要终止活动吗，终止后不可恢复。', '终止活动提示', {
          cancelButtonText: '取消',
          confirmButtonText: '终止',
          type: 'warning'
        })
          .then(() => {
            let params = {
              activityId: row.id,
              status: 2
            };
            this.listLoading = true;
            repurchaseApi
              .statusUpdate(params)
              .then(res => {
                this.$message.success('终止成功');
                this.getList();
              })
              .always(() => {
                this.listLoading = false;
              });
          })
          .catch(() => {
            console.log('取消终止活动');
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

<style lang="less" scoped>
  .repurchase {
    padding: 0 20px;
    .title {
      height: 50px;
      font-size: 20px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #333333;
      line-height: 50px;
    }

    .repurchase-list {
      padding: 20px 0;
      background: white;
      border-radius: 4px;
    }

    .repurchase-filter {
      position: relative;

      .el-input__inner {
        border-radius: 4px 0 0 4px;
      }

      .repurchase-box {
        position: absolute;
        top: 30px;
        right: 20px;
      }
    }
    .el-table .cell {
      text-align: left;
    }
    .el-table .disabled-qrcode {
      color: #ccc;
      cursor: no-drop;
    }

    .el-table .disabled-qrcode:hover {
      color: #ccc;
      cursor: no-drop;
    }

    .el-table .a-disabled {
      color: #c0c4cc;
      cursor: no-drop;
    }
  }
</style>
