<template>
  <div style="padding: 15px 15px 45px 15px;overflow: hidden;"
       v-loading="loading"
       element-loading-spinner="el-icon-loading">
    <div class="start-header">
      <span class="title">选择店铺</span>
      <el-button class="add-btn"
                 type="primary"
                 @click="toCreate">
        创建店铺
      </el-button>
    </div>
    <chose-item v-for="(item,index) in data"
                :key="index"
                :item="item">
    </chose-item>
  </div>
</template>
<script>import api from '@/dss-wechat3rd/src/api';
import menu from '@/dss-wechat3rd/src/menu/index.js';
import ChoseItem from './ChoseItem.vue';

export default {
  components: { ChoseItem },
  data() {
    return {
      loading: true,
      data: []
    };
  },
  mounted() {
    this.apiList();
  },
  methods: {
    apiList() {
      api
        .getUserStoreList()
        .then(res => {
          this.data = res.data || [];
        })
        .always(res => {
          this.loading = false;
        });
    },
    toCreate() {
      this.$router.push({ path: menu.path.START_CREATE_APP });
    }
  }
};
</script>

<style lang="less">
.start-header {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 42px;

  .title {
    text-align: center;
    font-size: 20px;
    color: #000;
    font-weight: 500;font-family: PingFangSC, PingFangSC-Medium;
  }
}
.add-btn {
  position: absolute;
  right: 0;
  text-align: right;
  border: 1px solid #fa7516 !important;
  background: #fa7516 !important;
  border-radius: 4px !important;
}
</style>

