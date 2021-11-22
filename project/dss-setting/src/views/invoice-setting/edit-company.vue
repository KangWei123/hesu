<template>
  <div class="invoice-edit">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/invoice-setting' }">发票模板</el-breadcrumb-item>
      <el-breadcrumb-item>填写企业信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div v-for="(item,index) in list"
           :key="index"
           class="form-container">
        <company-form :companyData="item"
                      :count="index"
                      :len="list.length"
                      :isDelete="isDelete"
                      @handleDelete="handleDelete" />
      </div>
    </div>
    <el-button type="primary"
               icon="el-icon-plus"
               class="add-btn"
               @click="handleAdd">新增企业信息</el-button>
  </div>
</template>

<script>
import CompanyForm from './CompanyForm';
import wxInvoiceTplApi from '@/dss-setting/src/api/wx-invoice-tpl-api';
const MIN_ENT_NUMBER = 1;
export default {
  components: {
    CompanyForm
  },
  data() {
    return {
      MIN_ENT_NUMBER,
      list: [{}],
      index: 0
    };
  },
  mounted() {
    this.getEntInfo();
  },
  watch: {
    list(newVal, oldVal) {
      this.list = newVal;
    }
  },
  computed: {
    isDelete() {
      let len = 0;
      this.list.forEach(item => {
        if (item.id) {
          len++;
        }
      });
      return len <= MIN_ENT_NUMBER ? false : true;
    }
  },
  methods: {
    handleAdd() {
      let count = this.list.length;
      this.index = count++;
      if (this.index < 5) {
        this.list.push({});
      } else {
        this.$message({
          message: '添加企业信息最多可添加 5 个',
          type: 'warning'
        });
      }
    },
    async getEntInfo() {
      this.list = await wxInvoiceTplApi.getEntInfo();
      if (!this.list.length) {
        this.list.push({});
      }
    },
    handleDelete(id, index) {
      const len = this.list.length;

      // 至少保留 1 条企业信息
      if (len <= MIN_ENT_NUMBER) {
        this.$message.warning('至少要保留 1 条企业信息');
        return;
      }

      if (!!id) {
        wxInvoiceTplApi
          .deleteEntInfo(id)
          .then(res => {
            if (res.success) {
              this.list.splice(index, 1);
              this.$message.success('删除成功');
            }
          })
          .catch(error => {
            this.$message.error(error);
          });
        return;
      }

      // 数据为空时前端删除
      this.list.splice(index, 1);
      this.$message.success('删除成功');
    }
  }
};
</script>

<style lang="less" scoped>
.invoice-edit {
  padding-bottom: 20px;
}

.add-btn {
  margin: 20px;
  cursor: pointer;
}

.form-container {
  border-bottom: 1px solid #dcdee0;

  &:last-child {
    border-bottom: 0;
  }
}
</style>


