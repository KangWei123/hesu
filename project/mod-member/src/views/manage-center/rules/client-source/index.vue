<template>
  <div class="client-source">
    <div class="container" v-loading="isLoading">
      <div class="container-header" v-if="hasPermission">
        <el-button class="add-button" type="primary" @click="onAdd" style=""> 新增渠道 </el-button>
      </div>
      <div class="source-list-content">
        <el-table :data="list" stripe class="wkt-table" ref="memberTable">
          <el-table-column label="客户来源" prop="name" min-width="100"></el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">
              <span>{{ scope.row.type | type }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.createTime">{{ scope.row.createTime | time('YYYY-MM-DD HH:mm:ss') }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="250">
            <template slot-scope="scope" v-if="scope.row.type !== 0">
              <a href="javascript:;" @click="onEdit(scope.row)">编辑</a>
              <a href="javascript:;" @click="onDelete(scope.row, scope.$index)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <add-dialog :item="activeItem" v-model="dialogVisible" @success="onSuccess"></add-dialog>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import api from '../../../../api/manage.js';
  import addDialog from './add.vue';
  import clientSource from '../../../../mixins/client-source.js';
  export default {
    components: {
      addDialog,
    },
    mixins: [clientSource],
    data() {
      return {
        isLoading: false,
        dialogVisible: false,
        list: [],
        form: {
          name: '',
        },
        activeItem: null,
      };
    },
    filters: {
      type(val) {
        return val === 0 ? '系统' : '人工';
      },
    },
    computed: {
      ...mapState({
        roleList: state => state.userInfo && state.userInfo.roleList,
      }),
      hasPermission() {
        return this.roleList.indexOf('common_role_enterprise') !== -1;
      },
    },
    methods: {
      getData() {
        this.isLoading = true;
        api
          .getClientSource({}, false)
          .then(res => {
            this.list = res.data;
            this.totalCount = res.totalCount;
            // 更新全局客户来源，自定义客户来源
            this.saveClientSource(this.list);
          })
          .finally(() => {
            this.isLoading = false;
          });
      },
      onAdd() {
        this.activeItem = null;
        this.dialogVisible = true;
      },
      onEdit(row) {
        this.activeItem = row;
        this.dialogVisible = true;
      },
      onSuccess(newItem) {
        if (!newItem) {
          this.getData(); // 新增成功，刷新列表
        } else {
          this.activeItem.name = newItem.name;
        }
      },
      onDelete(row, index) {
        this.$confirm(`确定删除该客户来源吗？`, '删除客户来源', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            this.isLoading = true;
            return api.deleteClientSource({
              id: row.id,
            });
          })
          .then(res => {
            this.$message.success('删除客户来源成功！');
            this.list.splice(index, 1);
            this.saveClientSource(this.list);
          })
          .finally(() => {
            this.isLoading = false;
          });
      },
    },
    mounted() {
      this.getData();
    },
  };
</script>
<style lang="less" scoped>
  .client-source {
    .container-header {
      height: 71px;
      padding: 21px 20px 20px 20px;
      background: rgba(250, 250, 250, 1);
      box-sizing: border-box;
      .add-button {
        float: right;
        border-radius: 15px;
        width: 100px;
        height: 30px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }
    .source-list-content {
      padding: 0 20px 40px;
    }
  }
  /deep/.dialog-footer {
    justify-content: flex-end;
  }
  .el-button.is-disabled {
    background: none;
    color: #cdcdcd;
    border: 0;
  }
</style>
