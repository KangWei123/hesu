<template>
  <div class="edit-app"
       v-loading="loading">
    <div class="tab">
      <span>发货方式：</span>
      <el-radio-group v-model="expressType">
        <el-radio :label="1">仅快递</el-radio>
        <el-radio :label="0">仅自提</el-radio>
        <el-radio :label="2">快递或自提</el-radio>
      </el-radio-group>
    </div>

    <div class="logistics-edit-box">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary"
                 @click="onSave">保存</el-button>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/business-common/store.js';
import api from '@/dss-setting/src/api';
import './index.less';

export default {
  computed: {
    ...mapState({
      curApp: 'curApp'
    })
  },
  data() {
    return {
      loading: false,
      expressType: 1,
      rules: {}
    };
  },
  mounted() {
    //赋值
    if (!!this.curApp.expressType || this.curApp.expressType === 0) {
      this.expressType = this.curApp.expressType;
    }
  },
  methods: {
    // 保存
    onSave() {
      const params = {
        expressType: this.expressType
      };
      this.loading = true;
      api
        .updateExpress(params)
        .then(res => {
          // 全局更新物流状态
          this.curApp.expressType = this.expressType;
          store.commit('update_curApi', this.curApp);
          this.$emit('saved');
        })
        .catch(() => {
          this.$message.error('保存物流状态失败，请重试');
        })
        .always(() => {
          this.loading = false;
        });
    },
    // 取消
    onCancel() {
      this.$emit('cancel');
    }
  }
};
</script>
