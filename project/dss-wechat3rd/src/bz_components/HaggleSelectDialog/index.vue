<template>
  <el-dialog @open="onDialogOpen"
             :visible.sync="showSelectGoodsDialog">
    <div class="haggle-table">
      <goods-list-filter :goods-type="goodsType"
                         class="list-filter"
                         @filter="onFilter" />
      <el-table @selection-change="handleSelectionChange"
                :data="goodsList">

        <el-table-column type="selection"
                         width="45">
        </el-table-column>
        <el-table-column label="砍价"
                         width="400">
          <span slot-scope="scope">
            <div class="goods-product">
              <div class="card-type"
                   :style="scope.row.thumbnail | bgImage"></div>
              <span>{{scope.row.itemName}}</span>
            </div>
          </span>
        </el-table-column>
        <el-table-column align="center" label="最低价">
          <span slot-scope="scope">
            {{scope.row.lowestPrice | price}}
          </span>
        </el-table-column>
        <el-table-column align="center" label="原价">
          <span slot-scope="scope">
            {{scope.row.salePrice | price}}
          </span>
        </el-table-column>
        <el-table-column align="center" prop="bargainPeople"
                         label="参与人数">
        </el-table-column>
        <!-- <el-table-column label="操作">
              <span slot-scope="scope">
                <el-button @click="onSelectCard(scope.row)">选择</el-button>
              </span>
            </el-table-column> -->
        <!--修改无数据时的展示-->
        <template slot="empty">
          <place-holder></place-holder>
        </template>
      </el-table>
      <div style="text-align: center">
        <el-pagination v-if="totalGoodsCount"
                       layout="prev, pager, next, jumper, sizes, total"
                       :total="totalGoodsCount"
                       :page-size="pageParams.pageSize"
                       :current-page="pageParams.pageNo"
                       @size-change="onSizeChange"
                       @current-change="onPageChange"
                       class="dss-pagination">
        </el-pagination>
      </div>
    </div>

    <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="showSelectGoodsDialog = false">取 消</el-button>
      </div> -->

    <div slot="footer">
      <el-button @click="showSelectGoodsDialog = false">取 消</el-button>
      <el-button type="primary"
                 @click="handleSelectGoods">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moneyUtil from '@/dss-common/utils/money';
import services from '@/dss-common/utils/services';
import PlaceHolder from '@/dss-common/components/placeholder/index';
import GoodsListFilter from '@/dss-wechat3rd/src/components/goods/GoodsListFilter';
import cutPriceAPI from '@/dss-wechat3rd/src/api/cutprice.js';

import './index.less';
/**
 * 管理商品的商品列表
 */
export default {
  name: 'GoodsList',
  model: {
    prop: 'showDialog'
  },
  components: {
    PlaceHolder,
    GoodsListFilter
  },

  props: {
    goodsType: {
      type: Object,
      default: function() {
        return null;
      }
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },

  filters: {
    toPageUnit(val) {
      return moneyUtil.convertHundredMoneyUnit(val, true);
    },
    bgImage(val) {
      if (val) {
        return {
          backgroundImage: 'url(' + val + ')'
        };
      }
    }
  },

  data() {
    return {
      loading: false,
      goodsList: null,
      totalGoodsCount: 0,
      pageParams: {
        pageSize: 10, //每页条数
        pageNo: 1 //页数
      },
      //选中的服务
      multipleSelection: [],
      showSelectGoodsDialog: false
    };
  },

  watch: {
    showDialog(newVal, oldVal) {
      this.showSelectGoodsDialog = newVal;
      if (newVal) {
        this.toggleSelection();
      }
    },
    showSelectGoodsDialog(newVal, oldVal) {
      this.$emit('input', newVal);
    }
  },

  methods: {
    // 取消选中
    toggleSelection() {
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection();
      }
    },
    /**
     * 根据商品类型获取门店下的商品列表,分页
     * @param goodsType 商品类型
     */
    getList() {
      console.log('fuck->');
      this.loading = true;
      const params = { ...this.pageParams };
      //   DELETED(-1, "已删除"),
      //   NOT_STARTED(0, "未开始"),
      //   ON_GOING(1, "进行中"),
      //   ENDED(2, "已结束"),;
      params.activityStatus = 1; //进行中
      cutPriceAPI.bargain
        .manage_list(params)
        .then(res => {
          console.log('fuck->', res);
          this.totalGoodsCount = res.totalCount;
          this.goodsList = res.data || [];
        })
        .finally(_ => {
          this.loading = false;
        });
    },

    onDialogOpen() {
      if (!this.goodsList) {
        // this.getList();
      }
    },

    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.getList();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.getList();
    },

    onFilter(filter) {
      this.queryParams = { ...this.queryParams, ...filter };
      this.getList();
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleSelectGoods() {
      this.showSelectGoodsDialog = false;
      console.log('this.$plain(this.multipleSelection)', this.$plain(this.multipleSelection));
      this.$emit('choose', this.$plain(this.multipleSelection));
    }

    // onSelectCard(item) {
    //   this.showSelectGoodsDialog = false;
    //   this.$emit('choose', [item]);
    // }
  },

  mounted() {}
};
</script>

<style lang="less">
.haggle-table {
  margin: 0 20px;

  .card-type {
    width: 80px;
    height: 45px;
    vertical-align: middle;
    margin-right: 12px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: inline-block;
  }
}
</style>
