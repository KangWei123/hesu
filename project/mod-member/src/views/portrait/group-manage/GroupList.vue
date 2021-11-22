<template>
  <div class="group-list">
    <el-form class="group-form" inline @submit.native.prevent>
      <el-form-item class="input-item">
        <el-input
          @blur="onSearch"
          @keyup.enter.native="onSearch"
          placeholder="请输入人群关键字"
          v-model.trim="keyword.name"
        >
          <i @click="onSearch" class="el-icon-search el-input__icon" slot="suffix"></i>
        </el-input>
      </el-form-item>
      <el-form-item class="input-item">
        <el-select @change="onSearchUpdate" clearable placeholder="请选择人群更新机制" v-model.trim="keyword.update">
          <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in options"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="right-item">
        <!--<button type="button" @click.prevent="onImport" class="primary-btn">人群导入</button>-->
      </el-form-item>
      <el-form-item class="right-item">
        <button type="button" @click.prevent="onAdd" class="primary-btn">新建人群</button>
      </el-form-item>
    </el-form>
    <el-table :data="computedTable" class="dmp-table" style="width: 100%" v-loading="loading">
      <el-table-column label="人群名称" prop="name"></el-table-column>
      <el-table-column label="人群说明" prop="descriptions" show-overflow-tooltip></el-table-column>
      <el-table-column label="覆盖人数">
        <template slot-scope="scope">
          <span v-if="scope.row.coverNumber">{{ scope.row.coverNumber }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="人群更新机制">
        <template slot-scope="scope">
          <span v-if="scope.row.renewalMechanism === 0">不更新</span>
          <span v-else-if="scope.row.renewalMechanism === 1">每天更新</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="人群更新时间">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 'Y'">{{ scope.row.updateTime | fitTime }}</span>
          <span class="error-hint" v-else>更新人群标签失败</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="operator" label="操作" prop="address" width="300px">
        <template slot-scope="scope">
          <!--<button-->
          <!--@click="onExport(scope.row)"-->
          <!--class="table-btn"-->
          <!--v-if="scope.row.type != 'import'"-->
          <!--&gt;人群导出</button>-->
          <button @click="onPortrait(scope.row)" class="table-btn" v-if="scope.row.type != 'import'">人群画像</button>
          <button @click="onEdit(scope.row)" class="table-btn" v-if="scope.row.type != 'import'">编辑</button>
          <a @click="onDel(scope.row)" class="table-btn">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right">
      <el-pagination
        :current-page.sync="page.index"
        :page-size="page.size"
        :total="total"
        @current-change="onChangeIndex"
        background
        class="dmp-pagination"
        layout="total,prev, pager, next"
        style="margin-top: 10px"
      ></el-pagination>
    </div>
    <group-edit :is-from-list="true" :model="selected" :visible.sync="dialog.edit" @saved="onSaved"></group-edit>
    <group-out-in :model="selected" :visible.sync="dialog.outIn" @saved="onSaved"></group-out-in>
  </div>
</template>

<script>
  import utils from '@/dss-common/utils/index';
  import api from '@/mod-member/src/api/new-dmp';
  import helper from '@/mod-member/src/mixins/helper';
  import GroupEdit from './GroupEdit';
  import GroupOutIn from './GroupOutIn';

  export default {
    components: {
      GroupEdit,
      GroupOutIn,
    },
    data() {
      return {
        tableData: [],
        options: [
          { value: null, label: '全部人群' },
          { value: 0, label: '不更新' },
          { value: 1, label: 'T+1更新' },
        ],
        loading: false,
        page: {
          size: 10,
          index: 1,
        },
        total: 0,
        keyword: {
          name: null,
          update: null,
        },
        bindKeyowrd: '',
        dialog: {
          edit: false,
          outIn: false,
        },
        selected: null,
        conditions: [],
        isNewCreated: false,
      };
    },
    computed: {
      computedTable() {
        if (!this.keyword.name) {
          return this.tableData;
        }
        const lowerCaseName = this.keyword.name.toLowerCase();
        const filterTable = this.tableData.filter(item => {
          return item.name.toLowerCase().indexOf(lowerCaseName) > -1;
        });
        /* eslint-disable vue/no-side-effects-in-computed-properties */
        this.total = filterTable.length;
        return filterTable;
      },
    },
    filters: {
      fitTime(value) {
        return utils.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
      },
    },
    watch: {
      'keyword.name'(newVal) {
        this.fetchData();
      },
    },
    created() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        this.loading = true;
        const page = this.page;
        const params = {
          pageSize: page.size,
          pageNo: page.index,
          renewalMechanism: this.keyword.update,
          name: this.keyword.name,
        };
        api
          .getCrowd(params)
          .done(res => {
            this.tableData = res.data || [];
            this.total = res.totalCount || 0;
          })
          .catch(err => {
            this.$message.error(err.errorMessage);
          })
          .always(() => {
            this.loading = false;
          });
      },
      onSearchUpdate(e) {
        this.page.index = 1;
        this.keyword.update = e;
        this.fetchData();
      },
      /**
       * 跳转分析页面
       */
      onPortrait(row) {
        this.selected = row;
        const conditions = [];
        conditions.push({
          id: helper.newId(),
          type: 'group',
          tag: {
            name: '人群',
            groupId: row.id,
          },
          value: row.id,
          strValue: row.name,
        });
        this.$router.push({
          name: 'portraitOverview',
          params: {
            id: row.id,
            cdns: row.criteria,
            conditions: conditions,
            strCdn: row.criteria,
            isFromGroup: true,
          },
        });
      },
      // 展示人群导入弹窗
      onImport() {
        this.selected = null;
        this.dialog.outIn = true;
      },
      onAdd() {
        this.$router.push({ name: 'portrait' });
      },
      onDel(row) {
        this.$confirm('删除后不可恢复', '确定删除该人群吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            api.delCrowd(row.id).done(res => {
              this.$message({
                message: `删除${row.name}人群成功`,
                type: 'success',
              });
              this.page.index = 1;
              this.fetchData();
            });
          })
          .catch(() => {});
      },
      onSearch() {
        console.log(1111);
        this.page.index = 1;
        this.fetchData();
      },
      onEdit(row) {
        this.selected = row;
        this.dialog.edit = true;
      },
      onSaved() {
        this.$message.success('保存成功');
        // 编辑后重新调人群列表接口
        this.fetchData();
      },
      onChangeIndex(val) {
        this.page.index = val;
        this.fetchData();
      },
      // 人群导出操作
      onExport(row) {
        this.selected = row;
        this.dialog.outIn = true;
      },
    },
  };
</script>
<style lang="less">
  .group-list {
    min-height: 500px;
    margin: 0 !important;

    a {
      padding: 0 5px;
    }

    .el-message-box {
      width: 420px;
      height: 160px;
      box-sizing: border-box;
      border-radius: 4px;
    }
  }

  .input-item {
    width: 175px !important;
    height: 30px;
    border-radius: 0;
    margin-right: 10px;
  }

  .right-item {
    float: right;
  }

  .primary-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0 none;
    border-radius: 5px;
    color: #ffffff;
    background: #256eff;
    cursor: pointer;
  }

  .table-btn {
    border: 0 none;
    border-radius: 0;
    color: #256eff;
    background: transparent;
    outline: none;
    cursor: pointer;
  }

  .disable-btn {
    color: #dcdfe6;
  }
</style>
