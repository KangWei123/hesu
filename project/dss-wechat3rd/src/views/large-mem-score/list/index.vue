<template>
  <list-page-layout>
    <template #filters>
      <el-form
        ref="form"
        @submit.prevent.native="$refs.table.search()"
        :model="form"
        inline
        label-width="80px"
        label-suffix=":"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.trim="form.phone" placeholder="请输入手机号" maxlength="11" class="w220" />
        </el-form-item>
        <el-form-item label="小票号" prop="orderNum">
          <el-input v-model.trim="form.orderNum" placeholder="请输入小票号" maxlength="36" class="w220" />
        </el-form-item>
        <el-form-item label="商户" prop="subStoreName">
          <el-input v-model.trim="form.subStoreName" placeholder="请输入商户" maxlength="20" class="w220" />
        </el-form-item>
        <br />
        <el-form-item label="积分渠道" prop="scoreType">
          <el-select v-model="form.scoreType" placeholder="请选择积分渠道" class="w220">
            <el-option label="全部" value="" />
            <el-option v-for="(item, index) in SCORE_TYPE_MAP" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="消费金额" prop="consumeAmounts">
          <number-range
            v-model="form.consumeAmounts"
            placeholder="请输入金额"
            :precision="2"
            :max-number="99999999"
            class="w220"
          />
        </el-form-item>
        <el-form-item label="消费时间" prop="consumeTime">
          <date-range-picker v-model="form.consumeTime" type="daterange" :picker-options="options" />
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.form.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-button class="export-order" :disabled="showTipDialog" @click="exportExcel">导出订单</el-button>
    <fat-table ref="table" :fetch-handler="handleFetch" row-key="id" :state.sync="form">
      <el-table-column label="积分单编号" prop="scoreNum" min-width="160" align="center" fixed="left"></el-table-column>
      <el-table-column label="小票号" prop="orderNum" min-width="100" align="center" fixed="left"></el-table-column>
      <el-table-column label="消费人" v-slot="{ row }" width="210px" fixed="left">
        <user-info-field :avatar="row.avatarImg" :name="row.nickName" :phone="row.phone" />
      </el-table-column>
      <el-table-column label="创建时间" prop="submitTime" min-width="130" align="center"></el-table-column>
      <el-table-column label="项目" prop="storeName" width="120" align="center"></el-table-column>
      <el-table-column label="商户" prop="subStoreName" min-width="120" align="center"></el-table-column>
      <el-table-column label="消费时间" prop="consumeTime" min-width="130" align="center"></el-table-column>
      <el-table-column label="积分渠道" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ SCORE_TYPE_MAP[scope.row.scoreType].label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消费金额" prop="consumeAmount" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.consumeAmount | price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="获得积分" prop="availableScore" width="120" align="center"></el-table-column>
      <el-table-column label="操作人" prop="operator" width="120" align="center"></el-table-column>
    </fat-table>
    <!-- 一键导出温馨提示对话弹框 -->
    <el-dialog title="温馨提示" :visible.sync="showTipDialog" :close-on-click-modal="false" width="500px">
      <span style="font-size: 14px">信息正在导出，请等候...</span>
    </el-dialog>
  </list-page-layout>
</template>

<script>
  import { ListPageLayout, FatTable } from '@/dss-common/components/list-page/index';
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import exporter from '@/dss-common/utils/exportExcel';
  import dateUtils from '@/dss-common/utils/date';
  import utils from '@/dss-common/utils';
  import api from '@/dss-wechat3rd/src/api/large-mem-score';
  import UserInfoField from '@/business-common/components/user-info-field/index.vue';
  import NumberRange from '@/dss-common/components/number-range/index.vue';

  const SCORE_TYPE = {
    CUSTOMER: 0,
    PICTURE: 1,
    WX: 2, // 微信支付
    ALIPAY: 3, // 支付宝支付
  };

  const SCORE_TYPE_MAP = [
    { label: '服务台积分', value: SCORE_TYPE.CUSTOMER },
    { label: '拍照积分', value: SCORE_TYPE.PICTURE },
    { label: '微信无感积分', value: SCORE_TYPE.WX },
    { label: '支付宝无感积分', value: SCORE_TYPE.ALIPAY },
  ];

  export default {
    name: 'OfflineScoreList',
    components: { DateRangePicker, FatTable, ListPageLayout, UserInfoField, NumberRange },
    data() {
      return {
        SCORE_TYPE,
        SCORE_TYPE_MAP,
        // 搜索条件form
        form: {
          scoreType: '',
          phone: '',
          orderNum: undefined,
          subStoreName: '',
          consumeTime: null,
          consumeAmounts: null,
        },
        // dialog可视状态
        showTipDialog: false,
        options: utils.getDatepickerOptions(null, dateUtils.endOfDay(new Date())),
      };
    },
    methods: {
      // 导出参数
      getParams() {
        const { consumeTime, consumeAmounts, ...other } = this.form;
        let params = other;
        if (consumeTime) {
          const [submitStartTime, submitEndTime] = consumeTime;
          params = { ...params, submitStartTime, submitEndTime };
        }
        // 后台拿取分，所以需要乘以100
        if (consumeAmounts) {
          if (consumeAmounts[0]) {
            params.consumeMinAmount = consumeAmounts[0] * 100;
          }
          if (consumeAmounts[1]) {
            params.consumeMaxAmount = consumeAmounts[1] * 100;
          }
          if (consumeAmounts[0] && consumeAmounts[1] && params.consumeMinAmount > params.consumeMaxAmount) {
            params = {
              ...params,
              consumeMinAmount: params.consumeMaxAmount,
              consumeMaxAmount: params.consumeMinAmount,
            };
          }
        }

        return { ...params, status: 1 };
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

      // 导出
      async exportExcel() {
        this.$confirm('确定导出线下积分记录报表吗？', '导出', {
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
              .download(api.exportList, params, '导出线下积分记录报表')
              .then(() => {
                this.$message.success('导出线下积分记录报表成功，正在下载');
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
