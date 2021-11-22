<template>
  <list-page-layout>
    <template #main-actions>
      <el-button type="primary" @click="addRights(0, null)">+ 新增权益</el-button>
    </template>
    <template #filters>
      <el-form ref="query" @submit.prevent.native="$refs.table.search()" :model="form" inline>
        <el-form-item label="权益名称：" prop="name">
          <el-input class="w220" v-model="form.name" maxlength="18" placeholder="请输入权益名称"></el-input>
        </el-form-item>
        <el-form-item label="权益归属：" prop="appId">
          <el-select class="w220" v-model="form.appId" clearable placeholder="请选择权益归属">
            <el-option v-for="(item, index) in appList" :label="item.appName" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table
      ref="table"
      class="wkb-table-border"
      :fetch-handler="handleFetch"
      :remove-handler="handleRemove"
      :state.sync="form"
      row-key="id"
      remove-confirm-message="删除权益之后，该权益对应的会员等级都将失去该权益，确认是否删除。"
      remove-confirm-title="删除权益"
    >
      <el-table-column prop="name" label="权益名称" align="center"></el-table-column>
      <el-table-column prop="appName" label="权益归属" align="center">
        <template slot-scope="scope">
          <span v-text="scope.row.appId === 0 ? '通用权益' : scope.row.appName"></span>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="权益简介" align="center"></el-table-column>
      <!-- <el-table-column prop="serviceType" label="服务方式" align="center"></el-table-column> -->
      <el-table-column prop="obtainCount" label="领取人数" align="center"></el-table-column>
      <el-table-column label="操作" align="center" v-slot="scope">
        <!-- accountType===0,集团账号才有编辑和删除权限 -->
        <table-actions :options="optionsFn(scope)"></table-actions>
      </el-table-column>
    </fat-table>
    <el-dialog :visible.sync="deleteDialogVisible" title="删除权益" width="400">
      <span>删除权益之后，该权益对应的会员等级都将失去该权益，确认是否删除。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteAction()">确定</el-button>
      </span>
    </el-dialog>
  </list-page-layout>
</template>

<script>
  import * as listPageComponents from '@/dss-common/components/list-page';
  import memberApi from '@/mod-member/src/api/memberAPI';
  import { mapState } from 'vuex';

  export default {
    name: 'RightsList',
    components: {
      ...listPageComponents,
    },
    data() {
      return {
        deleteDialogVisible: false,
        appList: [],
        form: {
          name: null,
          appId: null,
        },
        data: {
          list: [],
          total: 0,
        },
        deleteItem: null,
      };
    },
    computed: {
      ...mapState({
        accountType: 'accountType',
        curApp: 'curApp',
      }),
    },
    mounted() {
      memberApi.application
        .getAppList({
          pageNo: 1,
          pageSize: 100,
        })
        .then(res => {
          const common = {
            appName: '通用权益',
            id: '0',
          };
          this.appList = res.data || [];
          this.appList.splice(0, 0, common);
        });
    },
    methods: {
      async handleFetch(params) {
        const { appId, name } = this.form;
        // 分页信息
        const { pagination } = params;
        const filterParams = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };
        if (appId !== '' && appId != null) {
          filterParams.appId = parseInt(appId);
        }
        if (name !== '' && name != null) {
          filterParams.name = name;
        }
        const res = await memberApi.rightsCenter.getConfigList(filterParams);
        return {
          list: res.data || [],
          total: res.totalCount,
        };
      },
      handleRemove(ids) {
        return memberApi.rightsCenter.deleteConfig(ids[0]);
      },
      deletePopup(item) {
        this.deleteDialogVisible = true;
        this.deleteItem = item;
      },
      // queryAppName(id) {
      //   for (let i = 0; i < this.appList.length; i++) {
      //     const item = this.appList[i];
      //     if (item.id === id) {
      //       console.log('权益归属:', item.appName);
      //       return item.appName;
      //     }
      //   }
      // },
      // 0: 新建， 1：编辑  2：查看
      addRights(status = 0, item = null) {
        const params = { status };
        if (item) {
          params.id = item.id;
        }
        this.$router.push({
          path: '/rights-center/add-rights',
          query: params,
        });
      },

      // 获取列表操作菜单
      optionsFn(scope) {
        const options = [
          { name: '查看', link: { path: '/rights-center/add-rights', query: { status: 2, id: scope.row.id } } },
        ];

        // 集团身份或者当前应用的权益
        if ((this.accountType === 0 && this.curApp.industryKey === 'ump') || scope.row.appId !== 0) {
          options.push(
            { name: '编辑', link: { path: '/rights-center/add-rights', query: { status: 1, id: scope.row.id } } },
            {
              name: '删除',
              onClick: () => this.$refs.table.remove(scope.row.id),
            }
          );
        }
        return options;
      },
    },
  };
</script>

<style lang="less"></style>
