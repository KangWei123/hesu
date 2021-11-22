<template>
  <div class="storeRank">
    <div class="store-box"
         v-for="(item,index) in storeData"
         :key="index">
      <div class="store-item"
           v-for="(it,i) in item"
           :key="i"
           @click="setSelectedStore(it.storeId)"><span class="order"
              :class="it.order>3?'min':''">{{it.order}}</span><span class="name">{{it.storeName}}</span><span class="count">{{it.value|thousands}}</span></div>
    </div>
    <place-holder :height="153"
                  :min-height="153"
                  v-if="!storeData||!storeData.length" />
  </div>

</template>

<script>
import utils from '@/dss-common/utils';
import storage from '@/dss-common/utils/storage';
import daApi from '@/dss-da/src/api/da';
import services from '@/dss-common/utils/services';
import date from '@/dss-common/utils/date';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import { mapState } from 'vuex';
export default {
  name: 'storeRank',
  components: { PlaceHolder },

  props: {
    data: {
      type: Array,
      default: []
    },
    // 字段
    field: {
      type: String,
      default: 'saleFee'
    }
  },

  data() {
    return {
      storeData: null
    };
  },
  computed: {
    ...mapState({
      selectedStore: state => state.selectedStore,
      storeList: state => state.storeList,
      userInfo: 'userInfo'
    })
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.dataGroup();
      }
    }
  },
  mounted() {
    this.dataGroup();
  },
  methods: {
    setSelectedStore(val) {
      let store = this.storeList.find(item => item.id === val);
      if (!store) {
        return;
      }
      const preStore = this.selectedStore;
      store.store_name = store.name;
      if (preStore && preStore.id === store.id) {
        return;
      }
      this.$store.commit('setSelectedStore', store);
    },
    dataGroup() {
      this.data.forEach((item, index) => {
        item.order = index + 1;
        item.value = item[this.field];
      });
      let result = [];
      for (let i = 0; i < this.data.length; i += 3) {
        result.push(this.data.slice(i, i + 3));
      }
      this.storeData = result;
    }
  }
};
</script>
<style lang="less" scoped>
.storeRank {
  overflow: hidden;
  .store-box {
    border-right: 1px solid #f2f4f7;
    width: 410px;
    height: 146px;
    box-sizing: border-box;
    padding: 10px 0;
    float: left;
    .store-item {
      overflow: hidden;
      cursor: pointer;
      padding: 10px 20px;
      .order {
        display: inline-block;
        border-radius: 100%;
        width: 22px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        background: rgba(56, 121, 251, 1);
        font-size: 14px;
        color: rgba(255, 255, 255, 1);
      }
      .min {
        background: #dcdde0;
      }
      .name {
        display: inline-block;
        width: 230px;
        text-align: left;
        margin-left: 10px;
        font-size: 14px;
        color: rgba(51, 51, 51, 1);
      }
      .count {
        font-size: 14px;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
}
</style>
