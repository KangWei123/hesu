<template>
  <list-page-layout>
    <template #main-actions>
      <el-button type="primary" @click="inputamount">录入积分</el-button>
    </template>
    <template #filters>
      <el-form
        ref="query"
        @submit.prevent.native="$refs.table.search()"
        :model="form"
        inline
        label-width="80px"
        label-suffix=":"
      >
        <el-form-item label="录入时间" prop="submitTime">
          <date-range-picker v-model="form.submitTime" type="daterange"></date-range-picker>
        </el-form-item>
        <br />
        <el-form-item label="手机号" prop="phone">
          <el-input
            class="w220"
            clearable
            v-model.trim="form.phone"
            placeholder="请输入手机号"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="小票号" prop="orderNum">
          <el-input
            class="w220"
            clearable
            v-model.trim="form.orderNum"
            placeholder="请输入小票号"
            maxlength="36"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-button class="export-order" :disabled="showTipDialog" @click="exportExcel">导出订单</el-button>
    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" row-key="id">
      <el-table-column label="小票号" width="120" prop="orderNum" fixed="left"> </el-table-column>
      <el-table-column label="消费人" v-slot="{ row }" width="210px" fixed="left">
        <user-info-field :avatar="row.avatarImg" :name="row.nickName" :phone="row.phone" />
      </el-table-column>
      <el-table-column label="会员等级" width="125" prop="memberLevelName"> </el-table-column>
      <el-table-column label="项目名称" width="125" prop="storeName"></el-table-column>
      <el-table-column label="商户名称" width="145" prop="subStoreName"></el-table-column>
      <el-table-column label="消费日期" width="205" prop="consumeTime"></el-table-column>
      <el-table-column label="消费金额" width="125" prop="consumeAmount">
        <template slot-scope="scope">
          <span>{{ scope.row.consumeAmount | price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次积分" width="125" prop="availableScore"> </el-table-column>
      <el-table-column label="备注" width="185" prop="remark"></el-table-column>
      <el-table-column label="状态" width="135">
        <template slot-scope="scope">
          <span>{{ PictureStatusMap[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="撤销备注" width="185" prop="reason"></el-table-column>
      <el-table-column label="操作人" width="125" prop="operator"></el-table-column>
      <el-table-column label="录入时间" width="205" prop="submitTime"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="110" v-slot="scope">
        <table-actions
          :options="
            scope.row.status === 1
              ? [
                  {
                    name: '撤销录入',
                    onClick: () => {
                      handleClickRevoke(scope.row);
                    },
                  },
                ]
              : [
                  {
                    name: '补充备注',
                    onClick: () => {
                      supplementaryReason(scope.row);
                    },
                  },
                ]
          "
        >
        </table-actions>
      </el-table-column>
    </fat-table>
    <!-- 一键导出温馨提示对话弹框 -->
    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px" :close-on-click-modal="false">
      <span style="font-size: 14px">信息正在导出，请等候...</span>
    </el-dialog>
    <revoke-dialog ref="revokeDialog" @revoked="handleRevoked" />
  </list-page-layout>
</template>

<script>
  import * as listPageComponents from '@/dss-common/components/list-page';
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import UserInfoField from '@/business-common/components/user-info-field/index.vue';
  import { timeFormat } from '@/business-common/filters/date-format-filters';
  import exporter from '@/dss-common/utils/exportExcel';
  import RevokeDialog from './revoke-dialog.vue';

  import api from '../../../api/large-mem-score';

  const issafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

  export default {
    name: 'Index',
    components: { ...listPageComponents, RevokeDialog, DateRangePicker, UserInfoField },
    data() {
      return {
        showTipDialog: false,
        loading: false,
        form: {
          submitTime: [],
          phone: '',
          orderNum: '',
        },
        pageParams: {
          pageSize: 10, // 每页条数
          pageNo: 1, // 页数
        },
        PictureStatusMap: ['', '已录入', '撤销录入'],
      };
    },
    methods: {
      getParams() {
        const { submitTime = [], ...other } = this.form;
        const params = {
          scoreType: 0,
          submitStartTime: !!submitTime && submitTime[0] ? timeFormat(submitTime[0], 'YYYY-MM-DD 00:00:00') : null,
          submitEndTime: !!submitTime && submitTime[1] ? timeFormat(submitTime[1], 'YYYY-MM-DD 23:59:59') : null,
          ...other,
          ...this.pageParams,
        };

        if (issafariBrowser) {
          console.log('当前浏览器为：Safari');
          params.auditStartTime = params.auditStartTime ? params.auditStartTime + ' 00:00:00' : undefined;
          params.submitEndTime = params.submitEndTime ? params.submitEndTime + ' 23:59:59' : undefined;
        }
        return params;
      },

      async handleFetch(params) {
        const { pagination } = params;
        this.pageParams = { pageNo: pagination.currentPage, pageSize: pagination.pageSize };

        const filterParams = this.getParams();
        const res = await api.customer.list(filterParams);

        return {
          list: res.data || [],
          total: res.totalCount,
        };
      },
      // 导出
      async exportExcel() {
        this.$confirm('确定导出客服台积分报表吗？', '导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
          closeOnClickModal: false,
        })
          .then(() => {
            if (this.showTipDialog) {
              return;
            }
            this.showTipDialog = true;
            const params = this.getParams();
            console.log('导出信息数据参数', params);
            exporter
              .download(api.export, params, '导出客服台积分报表')
              .then(() => {
                this.$message.success('导出客服台积分报表成功，正在下载');
                this.showTipDialog = false;
              })
              .catch(() => {
                this.showTipDialog = false;
              });
          })
          .catch(() => {
            this.$message.info('取消导出');
            this.showTipDialog = false;
          });
      },
      handleClickRevoke(row) {
        this.$refs.revokeDialog.show(row);
      },
      handleRevoked() {
        this.$refs.table.refresh();
      },
      // 录入积分
      inputamount() {
        this.$router.push('/largeMemScore/customer/edit');
      },
      // 补充备注
      supplementaryReason(row) {
        this.$refs.revokeDialog.show(row, true);
      },
    },
  };
</script>
<style lang="less">
  /deep/.el-table__body {
    border-collapse: separate;
  }

  /deep/.el-table__header {
    border-collapse: separate;
  }

  .export-order {
    margin: 20px 20px 0 20px;
  }

  .dialog_input {
    width: 382px;
    height: 99px;

    & textarea {
      height: 100%;
    }
  }
</style>
