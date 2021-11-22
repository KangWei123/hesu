<template>
  <div>
    <div class="container">
      <el-breadcrumb class="breadcrumb">
        <el-breadcrumb-item to="/quote/list">工程报价单</el-breadcrumb-item>
        <el-breadcrumb-item>报价单详情</el-breadcrumb-item>
      </el-breadcrumb>

      <el-form :model="form" ref="form" size="mini" v-loading="loading" class="integar-form" label-position="left">
        <div class="form-group-title">基本信息</div>
        <el-form-item label="报价单编号：" prop="outOrderNo">
          {{ form.outOrderNo }}
        </el-form-item>

        <el-form-item label="报价单名称：" prop="quotationName">
          {{ form.quotationName }}
        </el-form-item>

        <el-form-item label="客户：" prop="clientName">
          {{ form.clientName }}
        </el-form-item>

        <el-form-item label="报价人：" prop="employeeName">
          {{ form.employeeName }}
        </el-form-item>

        <el-form-item label="报价人联系方式：" prop="employeePhone">
          {{ form.employeePhone }}
        </el-form-item>

        <el-form-item label="创建日期：" prop="createTime">
          {{ form.createTime | formatDate }}
        </el-form-item>

        <el-form-item label="报价公司：" prop="quotationCompany">
          {{ form.quotationCompany }}
        </el-form-item>
      </el-form>

      <div class="section">
        <div class="section-title">商品信息</div>
        <el-table class="table" v-loading="loading" :data="goodsList">
          <el-table-column label="序号" type="index" width="80" />
          <el-table-column label="产品型号" prop="itemSubheading" min-width="160px" />
          <el-table-column label="产品名称" prop="itemName" min-width="200" />

          <el-table-column label="面价" prop="salePrice">
            <template slot-scope="scope">
              {{ scope.row.salePrice | price }}
            </template>
          </el-table-column>

          <el-table-column label="外观图" prop="thumbnail" width="200px">
            <template slot-scope="scope">
              <img :src="scope.row.thumbnail" alt="" width="160" />
            </template>
          </el-table-column>

          <!-- <el-table-column label="尺寸规格图" prop="measureImg" width="200px">
            <template slot-scope="scope">
              <img :src="scope.row.measureImg" alt="" width="160" />
            </template>
          </el-table-column> -->

          <el-table-column label="参考尺寸" prop="dimensionsImg" width="200px">
            <template slot-scope="scope">
              <img :src="scope.row.dimensionsImg" alt="" width="160" />
            </template>
          </el-table-column>

          <!-- <el-table-column label="技术参数说明" prop="paramLabelImg" width="200px">
            <template slot-scope="scope">
              <img :src="scope.row.paramLabelImg" alt="" width="160" />
            </template>
          </el-table-column> -->

          <!-- <el-table-column label="说明/规格" prop="paramSetting" max-width="200px" /> -->

          <el-table-column label="说明/规格" prop="paramSetting" width="200px">
            <template slot-scope="scope">
              <div v-for="(item, i) in formatParamSetting(scope.row.paramSetting)" :key="i">{{item}}</div>
            </template>
          </el-table-column>

          <el-table-column label="水效" prop="measureImg" width="200px">
            <template slot-scope="scope">
              <div v-for="(item, i) in formatParamSetting(scope.row.measureImg)" :key="i">{{item}}</div>
            </template>
          </el-table-column>

          <el-table-column label="单位" prop="unit" max-width="50px" />
          <el-table-column label="数量" prop="itemCount" max-width="200px" />
          <el-table-column label="单位重量" prop="weight" min-width="160px" />

          <!-- <el-table-column label="折扣率" prop="discountRate" max-width="200px">
            <template slot-scope="scope">{{ scope.row.discountRate | formatPercent }}</template>
          </el-table-column> -->

          <el-table-column label="折扣" prop="discountRate" max-width="200px">
            <template slot-scope="scope">{{ scope.row.discountRate | formatDiscount }}</template>
          </el-table-column>

          <el-table-column label="不含税单价(元)" prop="feeExcludeTax" min-width="160px">
            <template slot-scope="scope">{{ scope.row.feeExcludeTax | price }}</template>
          </el-table-column>

          <el-table-column label="税率" prop="taxRate">
            <template slot-scope="scope">{{ scope.row.taxRate | formatPercent }}</template>
          </el-table-column>

          <el-table-column label="含税单价" prop="feeIncludeTax" min-width="160px">
            <template slot-scope="scope">{{ scope.row.feeIncludeTax | price }}</template>
          </el-table-column>

          <el-table-column label="备注" prop="otherExpensesRemark" min-width="160px" align="left" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import date from '@/dss-common/utils/date';

export default {
  name: 'quotation-detail',
  data() {
    return {
      loading: false,
      form: {
        outOrderNo: '',
        quotationName: null,
        clientName: null,
        employeeName: null,
        employeePhone: null,
        createTime: null,
        quotationCompany: null
      },
      goodsList: []
    };
  },

  filters: {
    formatDate(val) {
      if (!val) return '';
      return date.format(new Date(val), 'YYYY-MM-DD HH:mm:ss');
    },

    formatPercent(val) {
      if (!val) return '0.00%';
      const percent = +val / 100;
      return percent.toFixed(2) + '%';
    },

    formatDiscount(val) {
      if (!val && val !== 0) return '';
      if (val === 10000) return '';
      return parseFloat((val / 1000).toFixed(1)) + '折';
    }
  },

  mounted() {
    const id = this.$route.query.id || '';
    this.fetchDetailData(id);
  },

  methods: {
    fetchDetailData(quotationId) {
      if (!quotationId) return;
      this.loading = true;
      const params = { quotationId };
      const url = constants.Api.quote.quotationDetail;
      services
        .get(url, {
          params,
          action: '报价单详情'
        })
        .then(res => {
          this.form = res.data || {};
          this.goodsList = (res.data || {}).quotationOrderItemDTOList;
        })
        .always(() => {
          this.loading = false;
        });
    },
    formatParamSetting(val) {
      return (val || '').split(/[(\r\n)\r\n]+/);
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  padding: 10px 20px;

  .tip-msg {
    color: #999;
    font-size: 12px;
  }
  .ml5 {
    margin-left: 5px;
  }
  .ml10 {
    margin-left: 10px;
  }

  .form-group-title {
    color: #333333;
    font-weight: 700;
    font-size: 14px;
    border-bottom: 1px solid #dcdee0;
    margin: 20px 0;
    padding: 10px 0;
  }

  .live-cover {
    width: 120px;
    height: 120px;
    display: inline-block;
    vertical-align: bottom;
  }
}
</style>
