<template>
  <div class="best-cp">
    <el-button @click="selectGoods">选择商品</el-button>

    <div class="setting-content" v-if="recommendList.length">
      <el-table
        max-height="300"
        style="width: 100%;"
        :data="recommendList">
        <el-table-column
          label="商品信息">
          <template slot-scope="scope">
            <div class="goods-info">
              <img class="goods-img" :src="scope.row.recommendItemImg">
              <div class="goods-name">{{scope.row.recommendItemName}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="recommendItemPrice"
          label="商品价格"
          align="center">
          <template slot-scope="scope">
            <!-- ${{scope.row.recommendItemPrice}} -->
            <span>{{ scope.row.recommendItemPrice | price | toPageUnit}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          align="center">
          <template slot-scope="scope">
            <div style="text-align: center;">
              <el-button type="text" @click="onDelete(scope.$index)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <goods-select-dialog
      enable-multiple
      v-model="showSelectDialog"
      :active-tabs="computeActiveTabs"
      :selected-list="selectedList"
      @selected="onChooseSkuProduct"
    ></goods-select-dialog>
  </div>
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import GoodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';

const MoneyUnit = '￥';

export default {
  name: 'best-cp',
  components: { GoodsSelectDialog },
  props: {
    recommendList: {
      type: Array,
      default: () => []
    },
    // 是否不允许整个商品
    disabledForm: {
      type: Boolean,
      default: false
    },
    // 是否不允许编辑敏感信息
    isDisabledEdit: {
      type: Boolean,
      default: false
    },
    goodsType: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showSelectDialog: false,
      showDialog: false
    };
  },
  filters: {
    toPageUnit(val) {
      let money = val;
      return money ? MoneyUnit + money : '免费';
    }
  },
  computed: {
    computeActiveTabs() {
      return [goodsTypeEnum.product];
    },
    selectedList() {
      return this.recommendList.map(item => ({
        itemNo: item.recommendItemNo,
        name: item.recommendItemName,
        thumbnail: item.recommendItemImg,
        salePrice: item.recommendItemPrice
      }));
    },
    curItemNo() {
      return this.isEdit ? this.$route.query.itemNo : null;
    }
  },
  watch: {
    showSelectDialog() {
      if (!this.showSelectDialog) {
        this.showDialog = false;
      }
    }
  },
  methods: {
    selectGoods() {
      this.showDialog = true;
      this.showSelectDialog = true;
    },
    onDelete(index) {
      this.recommendList.splice(index, 1);
    },
    onChooseSkuProduct(goodsItem) {
      this.recommendList.splice(0, this.recommendList.length);
      (goodsItem || []).forEach(item => {
        if (this.curItemNo && item.itemNo === this.curItemNo) {
          this.$message({
            type: 'warning',
            message: '推荐商品不允许选择当前编辑商品'
          });
          return;
        }
        this.recommendList.push({
          recommendItemName: item.name,
          recommendItemImg: item.thumbnail,
          recommendItemPrice: item.salePrice,
          recommendItemNo: item.itemNo
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.best-cp {
  max-width: 1040px;

  .setting-content {
    width: 100%;

    .goods-info {
      // width: 60px;
      height: 60px;
      line-height: 60px;
      display: flex;

      .goods-img {
        display: inline-block;
        width: 60px;
        height: 100%;
      }

      .goods-name {
        margin-left: 8px;
      }
    }
  }
}
</style>