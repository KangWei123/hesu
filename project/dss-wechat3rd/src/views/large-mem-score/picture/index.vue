<template>
  <list-page-layout>
    <template #main-actions>
      <el-button type="primary" @click="handleAdd">配置快捷回复</el-button>
    </template>
    <template #filters>
      <el-form
        ref="form"
        @submit.prevent.native="$refs.table.search()"
        :model="form"
        inline
        label-width="80px"
        label-suffix=":"
      >
        <el-form-item label="提交时间" prop="submitTime">
          <date-range-picker v-model="form.submitTime" type="daterange" />
        </el-form-item>
        <el-form-item label="审核时间" prop="auditTime">
          <date-range-picker v-model="form.auditTime" type="daterange" />
        </el-form-item>
        <br />
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.trim="form.phone" placeholder="请输入手机号" maxlength="11" class="w220" />
        </el-form-item>
        <el-form-item label="小票号" prop="orderNum">
          <el-input v-model.trim="form.orderNum" placeholder="请输入小票号" maxlength="36" class="w220" />
        </el-form-item>
        <el-form-item label="商户名称" prop="subStoreName">
          <el-input v-model.trim="form.subStoreName" placeholder="请输入商户名" maxlength="20" class="w220" />
        </el-form-item>
        <br />
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" class="w220">
            <el-option label="全部状态" :value="null"></el-option>
            <el-option label="待审核" :value="PictureStatus.WAIT_CHECK"></el-option>
            <el-option label="审核成功" :value="PictureStatus.SUCCESS"></el-option>
            <el-option label="驳回" :value="PictureStatus.REJECTED"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button plain @click="$refs.form.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-button class="export-order" :disabled="showTipDialog" @click="exportExcel">导出订单</el-button>
    <fat-table ref="table" :fetch-handler="handleFetch" row-key="id" :state.sync="form">
      <el-table-column label="积分单编号" prop="scoreNum" width="120" fixed="left"></el-table-column>
      <el-table-column label="小票号" prop="orderNum" width="120" fixed="left"></el-table-column>
      <el-table-column label="消费人" v-slot="{ row }" width="210px" fixed="left">
        <user-info-field :avatar="row.avatarImg" :name="row.nickName" :phone="row.phone" />
      </el-table-column>
      <el-table-column label="会员等级" prop="memberLevelName" width="120"></el-table-column>
      <el-table-column label="项目名称" prop="storeName" width="120"></el-table-column>
      <el-table-column label="提交时间" prop="submitTime" width="190"></el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <span>{{ PictureStatusMap[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消费日期" prop="consumeTime" width="190"></el-table-column>
      <el-table-column label="消费金额" prop="consumeAmount" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.consumeAmount != null">{{ scope.row.consumeAmount | price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次积分" prop="availableScore" width="120"></el-table-column>
      <el-table-column label="商户名称" prop="subStoreName" width="120"></el-table-column>
      <el-table-column label="驳回原因" prop="reason" width="120"></el-table-column>
      <el-table-column label="审核人" prop="operator" width="120"></el-table-column>
      <el-table-column label="审核时间" prop="auditTime" width="190"></el-table-column>
      <el-table-column label="操作" v-slot="scope" width="140" fixed="right">
        <table-actions :options="tableActions(scope.row)"> </table-actions>
      </el-table-column>
    </fat-table>
    <!-- 一键导出温馨提示对话弹框 -->
    <el-dialog title="温馨提示" :visible.sync="showTipDialog" :close-on-click-modal="false" width="500px">
      <span style="font-size: 14px">信息正在导出，请等候...</span>
    </el-dialog>
  </list-page-layout>
</template>

<script>
  import { PictureStatus, PictureStatusMap } from './constants.ts';
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  import UserInfoField from '@/business-common/components/user-info-field/index.vue';
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import exporter from '@/dss-common/utils/exportExcel';
  import api from '@/dss-wechat3rd/src/api/large-mem-score';

  export default {
    name: 'Customer',
    components: { DateRangePicker, FatTable, ListPageLayout, TableActions, UserInfoField },
    data() {
      return {
        // 审核状态
        PictureStatus,
        PictureStatusMap,
        // 搜索条件form
        form: {
          scoreType: 1,
          phone: '',
          orderNum: undefined,
          subStoreName: '',
          status: this.$route.query.status ? +this.$route.query.status : null,
          submitTime: null,
          auditTime: null,
        },
        // dialog可视状态
        showTipDialog: false,
      };
    },
    methods: {
      // 导出参数
      getParams() {
        const { submitTime, auditTime, ...other } = this.form;
        let params = other;
        if (submitTime) {
          const [submitStartTime, submitEndTime] = submitTime;
          params = { ...params, submitStartTime, submitEndTime };
        }
        if (auditTime) {
          const [auditStartTime, auditEndTime] = auditTime;
          params = { ...params, auditStartTime, auditEndTime };
        }
        return params;
      },
      // 跳转到配置快速回复页面
      handleAdd() {
        this.$router.push('/largeMemScore/picture/config');
      },
      // 获取数据
      async handleFetch(params) {
        const { pagination } = params;

        const payload = {
          ...this.getParams(),
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };
        const { data, totalCount } = await api.picture.list(payload);

        return {
          list: data,
          total: totalCount,
        };
      },
      tableActions(row) {
        const options = [{ name: '查看', link: { path: '/largeMemScore/picture/detail', query: { id: row.id } } }];
        if (row.status === PictureStatus.WAIT_CHECK) {
          options.push({
            name: '审核',
            link: { path: '/largeMemScore/picture/detail', query: { id: row.id, isAudit: 'audit' } },
          });
        } else {
          options.push({
            name: '重新审核',
            link: { path: '/largeMemScore/picture/detail', query: { id: row.id, isAudit: 'reAudit' } },
          });
        }
        return options;
      },
      // 导出
      async exportExcel() {
        this.$confirm('确定导出拍照积分报表吗？', '导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
          closeOnClickModal: false,
        })
          .then(() => {
            this.showTipDialog = true;
            const params = this.getParams();
            console.log('导出信息数据参数', params);
            exporter
              .download(api.export, params, '导出拍照积分报表')
              .then(() => {
                this.$message.success('导出拍照积分报表成功，正在下载');
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
    },
  };
</script>

<style lang="scss" scoped>
  .export-order {
    margin: 20px 0 0 20px;
  }
</style>
