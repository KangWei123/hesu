<template>
  <div class="view-app">
    <div class="row">
      <div class="title">发货方式：</div>
      <div class="value">{{expressTypeText || '-'}}</div>
    </div>

    <el-button type="primary"
               style="margin-top: 20px"
               @click="$emit('edit')">编辑</el-button>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      curApp: 'curApp'
    }),
    // 快递类型名称
    expressTypeText: function() {
      let expressType = 1;
      if (!!this.curApp.expressType || this.curApp.expressType === 0) {
        expressType = this.curApp.expressType;
      }
      if (expressType === 1) {
        return '仅快递';
      } else if (expressType === 0) {
        return '仅自提';
      } else if (expressType === 2) {
        return '快递或自提';
      }
    }
  },
  data() {
    return {};
  },
  mounted() {}
};
</script>
