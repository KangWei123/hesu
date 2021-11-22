<template>
  <div class="store-filter">
    <span>当前门店：</span>
    <el-select
      v-if="identities.length"
      v-model="dealerId"
      style="width: 120px"
      default-first-option
      v-loading="loading.dealer"
      filterable
      @change="handleChangeDealer"
    >
      <el-option v-for="item in identities" :key="item.id" :label="item.dealerName" :value="item.id"></el-option>
    </el-select>
    <el-select v-if="!loading.dealer" v-loading="loading.store" v-model="storeId" style="width: 120px" filterable>
      <el-option v-for="(item, index) in storeList" :key="index" :label="item.name" :value="item.id"></el-option>
    </el-select>
  </div>
</template>
<script>
  import api from '@/mod-member/src/api/manage-store';
  export default {
    // props: {
    //   targetDealerId: {
    //     type: Number,
    //     default: 0
    //   },
    //   targetStoreId: {
    //     type: Number,
    //     default: 0
    //   }
    // },
    data() {
      return {
        loading: {
          store: false,
          dealer: false,
          all: false,
        },
        identities: [],
        dealerId: null,
        storeId: null,
      };
    },
    computed: {
      storeList() {
        const selectedDealer = this.identities.find(item => {
          return item.id === this.dealerId;
        });
        return (selectedDealer && selectedDealer.storeDTOList) || [];
      },
    },
    watch: {
      storeId(val) {
        this.handleChangeStore();
      },
    },
    methods: {
      async getIdentities() {
        try {
          this.loading.dealer = true;
          const { data } = await api.queryDealer();
          this.identities = data || [];

          const estate = +this.$route.query.estate;
          const queryStoreId = +this.$route.query.storeId;
          const queryDealerId = +this.$route.query.dealerId;
          // 初次进入页面，设置选中值为路径携带值或默认第一项
          if (estate && queryDealerId) {
            this.dealerId = queryDealerId;
          } else if (this.identities.length) {
            this.dealerId = this.identities[0].id;
          }
          if (estate && queryStoreId) {
            this.storeId = queryStoreId;
          } else {
            const target = this.identities.find(item => {
              return item.id === this.dealerId;
            });
            this.storeId = target && target.storeDTOList && target.storeDTOList[0].id;
          }
        } finally {
          this.loading.dealer = false;
        }
      },
      handleChangeDealer() {
        this.storeId = this.storeList[0].id;
      },
      handleChangeStore() {
        this.$emit('doSearch', { storeId: this.storeId, identityId: this.dealerId });
      },
    },
    activated() {
      const estate = this.$route.query.estate;
      const queryStoreId = +this.$route.query.storeId;
      const queryDealerId = +this.$route.query.dealerId;

      if (this.storeId == queryStoreId) {
        this.handleChangeStore();
        return;
      }
      // 非初次进入页面，设置选中值为路径携带值
      if (this.identities.length && estate) {
        this.dealerId = queryDealerId;
        this.storeId = queryStoreId;
      }
    },
    mounted() {
      this.getIdentities();
    },
  };
</script>
<style lang="less" scoped>
  .store-filter {
    padding: 25px 0 35px 20px;
  }
</style>
