<template>
  <list-page-layout>
    <template #main-actions>
      <el-button type="primary" @click="$refs.editor.show()">+ 新增会员</el-button>
    </template>
    <template #filters>
      <el-form ref="query" @submit.prevent.native="$refs.table.search()" :model="form" inline label-suffix=":">
        <el-form-item label="会员信息" prop="searchKeyWord">
          <el-input
            prefix-icon="el-icon-search"
            placeholder="搜索用户名/手机号"
            v-model.trim="form.searchKeyWord"
            :maxlength="32"
            class="w220"
          />
        </el-form-item>
        <br />
        <el-form-item label="会员等级" prop="levelNum">
          <level-select placeholder="请选择会员等级" v-model="form.levelNum" clearable class="w220" />
        </el-form-item>
        <!-- <el-col :span="6">
            <el-form-item label="付费会员" prop="ftype">
              <el-select placeholder="请选择" v-model="form.ftype" clearable>
                <el-option :value="MemberType.Paying" label="是"></el-option>
                <el-option :value="MemberType.Normal" label="否"></el-option>
              </el-select>
            </el-form-item> 
          </el-col> -->
        <el-form-item label="来源应用" prop="appId">
          <app-select placeholder="请选择来源应用" v-model="form.appId" clearable class="w220" />
        </el-form-item>
        <el-form-item label="来源渠道" prop="channelId">
          <channel-select placeholder="请选择来源渠道" v-model="form.channelId" clearable class="w220" />
        </el-form-item>
        <br />
        <el-form-item label="会员状态" prop="status">
          <el-select placeholder="请选择会员状态" v-model="form.status" clearable class="w220">
            <el-option v-for="val of MemberStatus" :key="val" :label="MemberStatusName[val]" :value="val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间" prop="registerDate">
          <date-range-picker v-model="form.registerDate" type="daterange" />
        </el-form-item>
        <el-form-item>
          <el-button plain @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #sub-actions>
      <el-button :disabled="!selected.length" @click="handleBatchEdit">批量打标</el-button>
      <export-button
        title="批量导出"
        :selected="selected"
        :params="getExportParams"
        @clearSelected="clearSelected"
        :confirm-options="{
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确 认',
          cancelButtonText: '取 消',
          type: 'warning',
          customClass: 'dss-dialog',
        }"
        >批量导出</export-button
      >
      <import-button
        title="会员导入"
        :template-url="importParams.templateDownUrl"
        template-desc="您可以下载我们提供的模版，批量上传会员信息。"
        :action="importParams.uploadServerUrl"
        @success="$refs.table.search()"
        >会员导入</import-button
      >
    </template>
    <fat-table
      ref="table"
      :fetch-handler="handleFetch"
      :state.sync="form"
      selectable
      :selected.sync="selected"
      row-key="id"
    >
      <el-table-column label="会员信息" v-slot="{ row }" width="200px">
        <user-info-field
          :avatar="row.avatarImgUrl"
          :name="row.realname || row.nickname || row.wxNickname"
          :phone="row.phone"
        >
          状态:
          <span :style="{ color: MemberStatusColor[row.status] }">{{ MemberStatusName[row.status] }}</span>
        </user-info-field>
      </el-table-column>
      <el-table-column label="会员一账通ID" prop="uniqueAccountId" width="180px"></el-table-column>
      <el-table-column label="会员等级" prop="levelName" width="120px"></el-table-column>
      <!-- <el-table-column label="付费会员" v-slot="{ row }" width="120px">{{
        row.ftype == MemberType.Paying ? '是' : '否'
      }}</el-table-column> -->
      <el-table-column label="来源应用" prop="appName" min-width="150px"></el-table-column>
      <el-table-column label="来源渠道" prop="channelName" min-width="200px"></el-table-column>
      <el-table-column label="注册时间" v-slot="{ row }" min-width="190px">
        <span>{{ row.registerTime || row.createTime }}</span>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="left" v-slot="scope" min-width="234px">
        <table-actions :max="3" :options="tableActions(scope.row)" />
      </el-table-column>
    </fat-table>
    <edit-dialog ref="editor" @update="$refs.table.refresh()"></edit-dialog>
    <value-change-dialog ref="valueChangeDialog"></value-change-dialog>
    <batch-edit-dialog ref="batchEdit" :fetch-handler="getTags" />
    <status-change-dialog ref="statusDialog" @status-change-success="handleChangeStatus" />
  </list-page-layout>
</template>

<script>
  import ExportButton from '@/dss-common/components/export-button/index.vue';
  import ImportButton from '@/dss-common/components/import-button/index.vue';
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import AppSelect from '@/business-common/components/app-select';
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  import { MemberType, MemberStatusName, MemberStatusColor, MemberStatus } from '@/mod-member/src/enum';
  import LevelSelect from '@/mod-member/src/components/level-select';
  import ChannelSelect from '@/mod-member/src/components/channel-select';
  import UserInfoField from '@/business-common/components/user-info-field/index.vue';
  import api from '@/mod-member/src/api/memberAPI';
  import EditDialog from './create-or-edit-dialog.vue';
  import ValueChangeDialog from './value-change-dialog.vue';
  import BatchEditDialog, { EDIT_TYPE } from './batch-edit-dialog.vue';
  import StatusChangeDialog from './status-change-dialog.vue';
  import ScoreChangeMixin from './score-change-mixin';
  import GrowthChangeMixin from './growth-change-mixin';

  /**
   * 会员列表
   */
  export default {
    name: 'UserList',
    mixins: [ScoreChangeMixin, GrowthChangeMixin],
    components: {
      AppSelect,
      FatTable,
      ListPageLayout,
      TableActions,
      EditDialog,
      LevelSelect,
      ExportButton,
      ImportButton,
      ValueChangeDialog,
      BatchEditDialog,
      DateRangePicker,
      ChannelSelect,
      UserInfoField,
      StatusChangeDialog,
    },
    data() {
      return {
        MemberType,
        MemberStatus,
        MemberStatusName,
        MemberStatusColor,

        importParams: {
          templateDownUrl: api.memberCenter.UPLOAD_TEMPLATE,
          uploadServerUrl: api.memberCenter.UPLOAD_URL,
        },
        selected: [],
        form: {
          searchKeyWord: '',
          levelNum: null,
          appId: null,
          channelId: null,
          status: null,
          ftype: null,
          registerDate: null,
        },
      };
    },
    computed: {
      isNormal() {
        return this.$route.path.includes('/normal');
      },
    },
    watch: {
      isNormal() {
        // 重新请求
        if (this.$refs.table) {
          this.$refs.table.search();
        }
      },
    },
    methods: {
      // 导出参数
      getExportParams({ scope, selected }) {
        const params = {
          url: api.memberCenter.EXPORT_URL,
          data: this.getParams(),
        };

        if (scope === 'selected') {
          params.data.memberIdList = selected;
          params.text = '确定批量导出过滤后的会员信息?';
        } else {
          params.text = '确定批量导出过滤后的<b>所有</b>会员信息?';
        }

        return params;
      },
      tableActions(row) {
        return [
          {
            name: '详情',
            link: {
              name: this.isNormal ? 'member.normal-user-detail' : 'member.company-user-detail',
              params: { id: row.id },
            },
          },
          {
            name: '编辑',
            onClick: () => {
              this.$refs.editor.show(row);
            },
          },
          {
            name: '增减积分',
            onClick: () => {
              this.$refs.valueChangeDialog.show({
                valueName: '积分',
                value: row.totalMemberScore,
                onConfirm: async params => {
                  await this.doScoreChange({ ...params, uniqueAccountId: row.uniqueAccountId });
                  this.$refs.table.refresh();
                },
              });
            },
          },
          {
            name: '增减成长值',
            onClick: () => {
              this.$refs.valueChangeDialog.show({
                valueName: '成长值',
                value: row.totalGrowthValue,
                onConfirm: async params => {
                  params.accessType = 4;
                  await this.doGrowthChange({ ...params, uniqueAccountId: row.uniqueAccountId });
                  this.$refs.table.refresh();
                },
              });
            },
          },
          this.globalIsUmpPlatformApp && {
            name: row.status === MemberStatus.Active ? '冻结' : '激活',
            type: 'danger',
            onClick: async () => {
              this.$refs.statusDialog.show(row);
            },
          },
        ].filter(Boolean);
      },
      handleChangeStatus() {
        this.$refs.table.refresh();
      },
      handleReset() {
        let isEmpty = true;
        const form = this.$refs.query.model;
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key) && form[key] !== null) {
            isEmpty = false;
          }
        }
        if (!isEmpty) {
          this.$refs.query.resetFields();
        }
      },
      async getTags() {
        return await api.getUserLabelList({});
      },
      handleBatchEdit() {
        this.$refs.batchEdit.show({
          type: EDIT_TYPE.TAG,
          selected: this.selected,
          onConfirm: async ({ tagId }) => {
            try {
              await api.addUserLabel(
                this.selected.map(i => ({ userId: i, tagIdList: typeof tagId === 'number' ? [tagId] : tagId }))
              );
              return true;
            } catch (error) {
              return false;
            }
          },
        });
      },
      getParams() {
        const { registerDate, ...other } = this.form;

        if (registerDate) {
          const [createStartTime, createEndTime] = registerDate;
          Object.assign(other, { createStartTime, createEndTime });
        }
        console.log('orther:', other);
        delete other.levelNumber;
        return other;
      },
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;

        // 请求参数
        const payload = {
          ...this.getParams(),
          isNormal: this.isNormal,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        const { data, totalCount } = await api.memberCenter.getList(payload);
        return {
          list: data,
          total: totalCount,
        };
      },
      clearSelected() {
        this.selected = [];
      },
    },
  };
</script>

<style lang="less">
  .el-input--prefix {
    .el-input__inner {
      padding-left: 30px;
    }
  }
</style>
