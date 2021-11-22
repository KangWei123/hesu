<template>
  <div class="store"
       v-loading="loading">
    <store-form class="store-form"
                :btn-text="btnText"
                :create-power="createPower"
                @colsed="colsed"
                @alreadyStore="alreadyStore"></store-form>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import storeForm from '@/business-common/components/store-form.vue';
import wpBaseApi from '@/business-common/wp-base-api.js';
import storeUser from '@/business-common/store_user.js';

export default {
  components: { storeForm },
  data() {
    return {
      loading: false,
      btnText: '下一步',
      createPower: true // 是否允许继续创建门店
    };
  },
  mounted() {
    // 判断是否正确操作进入该页面
    if (!this.$route.query.isAllow || this.$route.query.isAllow != 1) {
      this.$router.replace({ path: '/create/brand' });
    }
    // 判断是否已有门店信息
    if (!!this.storeList && this.storeList.length > 1) {
      this.createPower = false; // 不允许继续创建门店
    }
  },
  computed: {
    ...mapState({
      curStore: 'curStore',
      storeList: 'storeList'
    })
  },
  methods: {
    /**
     * 门店创建成功
     */
    colsed() {
      this.createPower = false; // 不允许继续创建门店

      this.loading = true;
      // 获取品牌信息
      wpBaseApi
        .checkWpLogin()
        .then(res => {
          // 更新当前门店信息
          storeUser.methods.update_userInfo(res.data);
        })
        .always(() => {
          this.loading = false;

          //跳转创建门店成功页面
          this.$router.replace({
            path: '/create/store-success',
            query: {
              isAllow: 1
            }
          });
        });
    },

    /**
     * 当前品牌已有品牌门店
     */
    alreadyStore() {
      window.top.location.href = '/wkb.html';
    }
  }
};
</script>

<style lang="less">
.store {
  width: 650px;
  margin: 38px auto 20px;
  text-align: left;
  .store-form {
    display: inline-block;
    .head-info {
      .el-form-item__content {
        margin-left: 295px !important;
      }
    }
    .is-success {
      .el-input__inner {
        border-color: #dcdfe6;
      }
    }
  }
}
</style>
