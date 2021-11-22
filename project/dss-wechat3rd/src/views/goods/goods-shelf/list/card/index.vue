<template>
  <goods-list-table ref="list"
                    :goods-type="goodsType"
                    v-if="goodsType"
                    v-model="goodsList"
                    :goodsShow="goodsShow"
                    :goodsShelf="goodsShelf"
                    :goodsPrice="goodsPrice"
                    :goodEdit="goodEdit"/>
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import GoodsListTable from '@/dss-wechat3rd/src/components/goods/ShelfGoodsListTable';
import scopeMenuEnum from '@/business-common/scopeMenuEnum.js';
import { mapState } from 'vuex';
export default {
  name: 'index',
  components: {
    GoodsListTable
  },
  computed: {
    ...mapState({
      curStore: state => state.curStore,
      wkbScopeMenu: 'wkbScopeMenu',
      roleList: 'roleList'
    })
  },
  watch: {
    wkbScopeMenu: {
      immediate: true,
      handler() {
        this.queryUserPower();
      }
    }
  },
  data() {
    return {
      goodsShow: true,
      goodsShelf: true,
      goodsPrice: true,
      goodEdit: true,
      goodsType: goodsTypeEnum.card,
      dialogFormVisible: false,
      goodsList: null
    };
  },
  methods: {
    queryUserPower() {
      if (this.wkbScopeMenu) {
      }
    }
  },
  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.listStoreItemsByType(); // 根据商品类型获取门店下的商品列表
    });
  }
};
</script>

<style scoped>
</style>
