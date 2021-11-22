<template>
  <list-page-layout>
    <template #main-actions>
      <el-switch
        style="display: inline; margin-right: 50px"
        v-model="isOpen"
        active-value="1"
        inactive-value="0"
        active-color="#fa7516"
        inactive-color="#cccccc"
        @change="updateSwitchStatus"
        active-text="开启功能"
        inactive-text="关闭功能"
      >
      </el-switch>
      <el-button type="primary" @click="handleShowDialog()">新增IP</el-button>
    </template>
    <el-tabs v-model="activeName" style="padding: 10px 20px">
      <el-tab-pane label="白名单" name="white">
        <fat-table ref="whiteTable" style="width: 100%" :fetch-handler="getListData" v-if="activeName === 'white'">
          <el-table-column prop="ruleName" label="规则名称" align="center"></el-table-column>
          <el-table-column label="白名单IP段" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.fromIp }}</span>
              <span>-</span>
              <span>{{ scope.row.toIp }}</span>
            </template>
          </el-table-column>
          <el-table-column label="修改时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.updateTime | updateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="modifiedBy" label="修改人" align="center"></el-table-column>
          <el-table-column label="启用状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.ipStatus === 1"><span class="status-icon status-icon-on">●</span>启用</div>
              <div v-else><span class="status-icon status-icon-off">●</span>禁用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" style="color: #409eff" @click="handleShowDialog(scope.row)">编辑</el-button>
              <el-button type="text" style="color: red" @click="deleteRule(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </fat-table>
      </el-tab-pane>
      <el-tab-pane label="黑名单" name="black">
        <fat-table ref="blackTable" style="width: 100%" :fetch-handler="getListData" v-if="activeName === 'black'">
          <el-table-column prop="ruleName" label="规则名称" align="center"></el-table-column>
          <el-table-column label="黑名单IP段" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.fromIp }}</span>
              <span>-</span>
              <span>{{ scope.row.toIp }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.updateTime | updateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="modifiedBy" label="修改人" align="center"></el-table-column>
          <el-table-column label="启用状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.ipStatus === 1"><span class="status-icon status-icon-on">●</span>启用</div>
              <div v-else><span class="status-icon status-icon-off">●</span>禁用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" style="color: #409eff" @click="handleShowDialog(scope.row)">编辑</el-button>
              <el-button type="text" style="color: red" @click="deleteRule(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </fat-table>
      </el-tab-pane>
    </el-tabs>
    <add-ip-dialog
      :add-rule-dialog-visible.sync="addRuleDialogVisible"
      :dialog-title.sync="dialogTitle"
      :dialog-form.sync="dialogForm"
      :ip-type.sync="activeName"
      :handle-flag.sync="handleFlag"
      @done="handleSearchRule"
    >
    </add-ip-dialog>
  </list-page-layout>
</template>
<script>
  import { ListPageLayout, FatTable } from '@/dss-common/components/list-page/index';
  import AddIpDialog from '../components/add-ip-dialog.vue';
  import dateFormat from '@/dss-common/utils/date';
  import * as whiteSettingApi from '@/mod-org/src/api/whiteSettingApi';

  export default {
    components: {
      ListPageLayout,
      FatTable,
      AddIpDialog,
    },
    provide() {
      return {
        ipReactiveRange: () => this.dialogForm,
      };
    },
    data() {
      return {
        isOpen: '',
        addRuleDialogVisible: false,
        activeName: 'white',
        dialogTitle: '',
        dialogForm: {},
        handleFlag: 0,
        configKey: 'ip_white_list_switch',
      };
    },
    filters: {
      updateTime(timedot) {
        const date = new Date(timedot);
        return dateFormat.format(date);
      },
    },
    created() {
      this.getSwitchStatus();
    },
    methods: {
      handleShowDialog(param) {
        this.addRuleDialogVisible = true;
        if (param) {
          this.dialogForm = this.$plain(param);
          this.dialogTitle = '编辑';
          this.handleFlag = 1;
        } else {
          this.dialogTitle = '新增IP规则';
          this.handleFlag = 0;
        }
      },

      async getSwitchStatus() {
        const { data } = await whiteSettingApi.getSwitchStatus({ configKey: this.configKey });
        this.isOpen = data;
      },
      async updateSwitchStatus() {
        await whiteSettingApi.updateSwitchStatus({ configValue: this.isOpen, configKey: this.configKey });
        this.$message.success('操作成功');
      },

      async getListData(params) {
        const { pagination } = params;
        const payload = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          ipType: this.activeName === 'white' ? 1 : 0,
        };
        const { data, totalCount } = await whiteSettingApi.getWhiteBlackList(payload);
        return {
          list: data,
          total: totalCount,
        };
      },

      deleteRule(params) {
        this.$alert('是否删除规则吗？', '删除规则', {
          confirmButtonText: '确定',
          callback: async action => {
            if (action === 'confirm') {
              const { data } = await whiteSettingApi.ipDelete({ id: params.id });
              if (data) {
                this.handleSearchRule();
              }
            }
          },
        });
      },

      handleSearchRule() {
        if (this.activeName === 'white') {
          this.$refs.whiteTable.search();
        } else {
          this.$refs.blackTable.search();
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  .status-icon {
    display: inline-block;
    width: 20px;
  }

  .status-icon-on {
    color: #a5df65;
  }

  .status-icon-off {
    color: #f56c6c;
  }
</style>
