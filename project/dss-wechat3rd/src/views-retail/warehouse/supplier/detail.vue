<template>
  <div v-loading="isLoading"
       class="supplier-edit">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/warehouse/supplier/list' }">供应商管理</el-breadcrumb-item>
      <el-breadcrumb-item>供应商详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form label-width="105px"
             label-position="right"
             class="supplier-edit-form">
      <div class="line-title">基本信息</div>
      <hr class="split-line" />
      <el-form-item label="供应商名称：">
        <span>{{form.name}}</span>
      </el-form-item>
      <el-form-item label="单位电话：">
        <span>{{form.officeTel}}</span>
      </el-form-item>

      <el-form-item label="联系人：">
        <span>{{form.contacts}}</span>
      </el-form-item>
      <el-form-item label="手机号码：">
        <span>{{form.phone}}</span>
      </el-form-item>
      <el-form-item label="地址：">
        <div>{{form.province + form.city + form.region}}</div>
        <div>{{form.address}}</div>
      </el-form-item>
      <el-form-item label="备注：">
        <span>{{form.remark}}</span>
      </el-form-item>

      <div class="line-title">更多信息</div>
      <hr class="split-line" />

      <el-form-item label="QQ：">
        <span>{{form.qq}}</span>
      </el-form-item>
      <el-form-item label="微信号：">
        <span>{{form.wechat}}</span>
      </el-form-item>
      <el-form-item label="邮箱：">
        <span>{{form.email}}</span>
      </el-form-item>
      <el-form-item label="传真：">
        <span>{{form.fax}}</span>
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancle">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '@/dss-wechat3rd/src/api/supplier.js';
const supplierApi = api.supplier;

export default {
  components: {},
  data() {
    return {
      id: null,
      form: {},
      isLoading: false
    };
  },
  mounted() {
    const id = this.$route.query.id;
    if (!id) {
      this.$message.info('参数错误。');
      return;
    }
    this.id = id;
    this.isLoading = true;
    supplierApi
      .supplier_detail(id)
      .done(res => {
        this.form = res.data || {};
      })
      .always(res => {
        this.isLoading = false;
      });
  },
  methods: {
    onCancle() {
      this.$router.push('/warehouse/supplier/list');
    }
  }
};
</script>

<style lang="less">
@import './edit.less';
</style>
