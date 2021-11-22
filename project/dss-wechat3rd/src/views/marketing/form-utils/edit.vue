<template>
  <div class="form-util-edit">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/form-utils/list'}">表单列表</el-breadcrumb-item>
      <el-breadcrumb-item>表单内容</el-breadcrumb-item>
    </el-breadcrumb>
    <form-edit-input ref="editForm" :editId="editId" @load="handleLoad" @errorLoad="error=true"/>
    <div class="bottom-button" v-if="!error">
      <el-button :disabled="loading.load" @click="handleCancle">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading.submit" :disabled="loading.load">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import utils from '@/dss-common/utils';
import FormEditInput from './components/form-edit-input';
import { createForm, updateForm } from './api/form';

export default {
  data() {
    return {
      loading: {
        submit: false,
        load: false
      },
      widgetValue: [],
      error: false
    };
  },

  components: {
    FormEditInput
  },

  methods: {
    async handleSubmit() {
      const valid = await this.$refs.editForm.validate();
      if (!valid) {
        this.$message({ type: 'error', message: '预约表单内容填写不完整' });
        return;
      }
      const form = this.$refs.editForm.getWidgetValue();
      const params = {
        name: form.name,
        avatar: form.bannerUrl,
        avatarHeight: form.bannerHeight,
        hideAvatar: !form.bannerVisible,
        buttonName: form.btnText,
        formBody: JSON.stringify(
          form.widgetValue.map(w => ({
            ...w,
            options: w.options && w.options.map((str, ind) => ({ label: str })),
            dateRange:
              w.dateRange && w.dateRange.map(d => utils.date.format(d instanceof Date ? d : new Date(d), 'YYYY-MM-DD'))
          }))
        )
      };

      try {
        this.loading.submit = true;
        if (this.editId) {
          const res = await updateForm({ ...params, id: this.editId });
        } else {
          const res = await createForm(params);
        }
        this.$message({ type: 'success', message: `${this.editId ? '修改' : '新增'}预约表单成功` });
        this.$router.push({
          name: 'form-list',
          params: { toRefresh: true, pageNo: this.editId ? null : 1 }
        });
      } catch (e) {
        this.$message({ type: 'error', message: e.message });
      } finally {
        this.loading.submit = false;
      }
    },

    handleLoad() {
      this.loading.load = false;
    },

    handleCancle() {
      this.$router.back();
    }
  },

  computed: {
    ...mapState({
      storeList: 'storeList',
      curStore: 'curStore'
    }),
    editId() {
      return this.$route.query.id;
    }
  },

  watch: {
    editId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.loading.load = true;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.form-util-edit {
  .bg-mixin;
  overflow: hidden;
  padding-bottom: 60px;
}
.submit {
  height: 100px;
  width: 1050px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
