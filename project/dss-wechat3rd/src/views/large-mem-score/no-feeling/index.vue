<template>
  <list-page-layout class="app-list-container">
    <template #main-actions>
      <el-button type="primary" @click="gotoSetting">无感积分配置</el-button>
    </template>
    <template #filters>
      <el-form
        ref="query"
        @submit.prevent.native="$refs.query.search()"
        :model="form"
        inline
        label-width="80px"
        label-suffix=":"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input class="w220" maxlength="20" v-model.trim="form.phone" clearable placeholder="请输入手机号" />
        </el-form-item>

        <br />

        <el-form-item label="商户" prop="subStoreName">
          <el-input class="w220" maxlength="30" v-model.trim="form.subStoreName" clearable placeholder="请输入商户" />
        </el-form-item>

        <el-form-item label="消费时间" prop="dateRange">
          <el-date-picker
            v-model="form.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>

        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-button @click="handleExport" class="export-btn">导出积分明细</el-button>

    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" row-key="id">
      <el-table-column label="消费人" v-slot="{ row }" width="210px" fixed="left">
        <user-info-field :avatar="row.avatarImg" :name="row.nickName" :phone="row.phone" />
      </el-table-column>
      <el-table-column label="会员等级" prop="memberLevelName"></el-table-column>
      <el-table-column label="项目名称" prop="storeName"> </el-table-column>
      <el-table-column label="商户名称" prop="subStoreName"> </el-table-column>
      <el-table-column label="消费日期" prop="consumeTime" width="200px"></el-table-column>
      <el-table-column label="消费金额" prop="consumeAmount">
        <template slot-scope="scope">
          <span>{{ scope.row.consumeAmount | price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次积分" prop="availableScore"></el-table-column>
      <el-table-column label="服务商" prop="invoiceTime">
        <template slot-scope="scope">
          <div v-if="scope.row.scoreType === PAY_TYPE.WX">微信</div>
          <div v-else-if="scope.row.scoreType === PAY_TYPE.ALIPAY">支付宝</div>
        </template>
      </el-table-column>
    </fat-table>

    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size: 14px">信息正在导出，请等候...</span>
    </el-dialog>
  </list-page-layout>
</template>

<script>
  import scoreApi from '@/dss-wechat3rd/src/api/large-mem-score';
  import { timeFormat } from '@/business-common/filters/date-format-filters';
  import { FatTable, ListPageLayout } from '@/dss-common/components/list-page/index';
  import UserInfoField from '@/business-common/components/user-info-field/index.vue';
  import exportExcel from '@/dss-common/utils/exportExcel';
  import cdnResConfig from '@/business-common/utils/cdnResConfig';

  const PAY_TYPE = {
    WX: 2, // 微信支付
    ALIPAY: 3, // 支付宝支付
  };

  export default {
    name: 'NoFeeling',
    components: { FatTable, ListPageLayout, UserInfoField },
    data() {
      return {
        showTipDialog: false,
        form: {
          keyword: null,
          subStoreName: null,
          dateRange: [],
        },
        PAY_TYPE,
        defaultAvatar: cdnResConfig.mine.defaultAvatar,
        pickerOptions: {
          disabledDate: time => {
            const now = new Date().setHours(23, 59, 59);
            return time.getTime() > now;
          },
        },
      };
    },

    methods: {
      gotoSetting() {
        this.$router.push('/largeMemScore/no-feeling/setting');
      },
      handleExport() {
        this.$confirm('确定导出无感积分报表吗？', '导出积分明细', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
          closeOnClickModal: false,
        })
          .then(() => {
            const params = {
              ...this.form,
            };
            if (params.dateRange && params.dateRange.length) {
              params.consumeStartTime = timeFormat(params.dateRange[0], 'YYYY-MM-DD 00:00:00');
              params.consumeEndTime = timeFormat(params.dateRange[1], 'YYYY-MM-DD 23:59:59');
            }
            delete params.dateRange;
            this.showTipDialog = true;
            exportExcel
              .download(scoreApi.export_offline, params, '无感积分报表')
              .then(res => {
                this.$message({
                  message: '导出无感积分报表成功，正在下载',
                  type: 'success',
                });
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

      async handleFetch(data) {
        const { pagination } = data;
        const params = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          ...this.form,
        };
        if (params.dateRange && params.dateRange.length) {
          params.consumeStartTime = timeFormat(params.dateRange[0], 'YYYY-MM-DD 00:00:00');
          params.consumeEndTime = timeFormat(params.dateRange[1], 'YYYY-MM-DD 23:59:59');
        }
        delete params.dateRange;
        const { data: list, totalCount: total } = await scoreApi.score_offline_list(params);
        return { list: list || [], total };
      },
    },
  };
</script>

<style scoped lang="less">
  .export-btn {
    margin: 20px 20px 0 20px;
  }

  /deep/ .el-range-editor .el-input__inner {
    padding: 0 10px;
  }

  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .avatar-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
</style>
