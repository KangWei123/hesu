<template>
  <div class="goods-list-container charge-card-container">
    <div class="charge-card-list-filter">
      <el-form inline
               class="wkt-opt-label-container"
               @submit.native.prevent>
        <el-form-item label="充值卡：">
          <el-input size="mini"
                    @keyup.enter.native="handleFilterCard"
                    @input="handleFilterCard"
                    v-model="cardName"
                    placeholder="搜索充值卡"
                    style="width: 220px"></el-input>
        </el-form-item>

        <el-button plain @click="handleReset">重置</el-button>
      </el-form>
    </div>

    <div class="goods-list">
      <el-table ref="multipleTable"
                :data="goodsList"
                tooltip-effect="dark"
                v-loading="loading"
                @selection-change="handleSelectionChange"
                class="wkt-table">
        <el-table-column type="selection"
                         v-if="goodsList && goodsList.length"
                         width="70">
        </el-table-column>
        <el-table-column label="充值卡名称"
                         min-width="300">
          <template slot-scope="scope">
            <div class="goods-desc-box">
              <div class="goods-img"
                   v-if="scope.row.style==null">
                <img :src="scope.row.thumbnail || scope.row.styleUrl" />
              </div>
              <div class="goods-img"
                   v-else>
                <img v-if="scope.row.style===cardEnum.cardStyle.custom"
                     :src="scope.row.thumbnail || scope.row.styleUrl" />
                <img v-else
                     :src="scope.row.type===cardEnum.cardType.timesCard?timeCardBg:chargeCardBg" />
              </div>
              <div class="goods-desc">
                <div>{{ scope.row.name}}</div>
                <span>￥{{ scope.row.salePrice | price}}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="有效期">
          <span slot-scope="scope">
            {{computeValidity(scope.row)}}
          </span>
        </el-table-column>

        <el-table-column label="总销量"
                         prop="cardSalesVolume">
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <a href="javascript:;"
               class="table-href"
               @click="onGotoDetail(scope.row.itemNo)">
              详情
            </a>
          </template>
        </el-table-column>
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
                       @current-change="onPageChange">
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
import '@/dss-wechat3rd/src/components/goods/css/CommonGoodsListTable.less';
import moneyUtil from '@/dss-common/utils/money';
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import cardEnum from '@/dss-wechat3rd/src/constants/cardEnum';
import PlaceHolder from '@/dss-common/components/placeholder/index';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';

import timeCardBg from '@/dss-wechat3rd/src/images/goods/time-card-bg.png';
import chargeCardBg from '@/dss-wechat3rd/src/images/goods/charge-bg.png';
import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';

const unionKeys = ['itemNo'];
/**
 * 管理商品的商品列表
 */
export default {
  name: 'ChargeCardIndex',
  mixins: [tableCheckedHelperMixin],
  components: {
    PlaceHolder
  },

  filters: {
    toPageUnit(val) {
      return moneyUtil.convertHundredMoneyUnit(val, true);
    }
  },

  data() {
    return {
      goodsList: [],
      cardEnum,
      loading: false,
      goodsTypeTab: goodsTypeEnum,
      totalGoodsCount: 0,
      pageParams: {
        pageSize: 10, //每页条数
        pageNo: 1 //页数
      },
      queryParams: {
        type: cardEnum.cardType.chargeCard,
        status: 0
      },
      cardName: '',
      multipleSelection: [],
      timeCardBg: timeCardBg,
      chargeCardBg: chargeCardBg
    };
  },

  computed: {
    // 判断是否禁止底部批量操作按钮
    computeDisableShelfButton() {
      if (
        this.multipleSelection.length > 0 || // 当前页选中操作的数据数组长度大于0
        this.mTotalCheckedList.length > 0 // 所有被选中的列表list长度大于0
      ) {
        return false;
      }
      return true;
    },
    computeCategory() {
      return function(item) {
        if (item.typeDesc) {
          return item.typeDesc;
        } else if (item.categoryDTO) {
          return item.categoryDTO ? item.categoryDTO.category : null;
        } else {
          return null;
        }
      };
    },
    computeValidity() {
      return function(item) {
        if (item.validityType === cardEnum.validityType.permanent) {
          return '永久有效';
        } else if (item.validityType === cardEnum.validityType.custom) {
          return item.validity + '天';
        } else {
          return null;
        }
      };
    }
  },
  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchChargeCardList(); // 根据商品类型获取门店下的商品列表
    });
  },

  mounted() {},
  methods: {
    /**
     * 根据商品类型获取门店下的商品列表,分页
     * @param goodsType 商品类型
     */
    fetchChargeCardList() {
      this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);
      this.loading = true;
      const params = { ...this.pageParams, ...this.queryParams };
      services
        .get(constants.Api.card.list, {
          params,
          action: '商品列表'
        })
        .done(res => {
          this.totalGoodsCount = res.totalCount;
          this.goodsList = res.data || [];
          this.mBuildMultipleTableSelection(this.goodsList, 'multipleTable', unionKeys);
        })
        .always(() => {
          this.loading = false;
        });
    },

    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.fetchChargeCardList();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.fetchChargeCardList();
    },

    handleFilterCard(cardName) {
      this.queryParams = { ...this.queryParams, itemName: this.cardName };
      this.fetchChargeCardList();
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onGotoDetail(itemNo) {
      if (itemNo) {
        this.$router.push({ path: '/marketing/charge-card/add', query: { itemNo: itemNo, isDiscard: 1 } });
      } else {
        this.$router.push('/marketing/charge-card/add');
      }
    },
    handleReset() {
      this.cardName = '';
      this.handleFilterCard();
    }
  }
};
</script>

<style lang="less">
.charge-card-container {
  .charge-card-list-filter {
    position: relative;
    .wkt-opt-label-container {
      padding-bottom: 10px;
    }
    .new-card-box {
      position: absolute;
      right: 20px;
      top: 30px;
    }
  }
  .goods-list {
    padding: 0 20px 20px;
  }
}
</style>
