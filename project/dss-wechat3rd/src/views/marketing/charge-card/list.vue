<template>
  <div class="goods-list-container charge-card-container">
    <div class="Add-Manage-Button">
      <el-button @click="onGotoDeal()">充值协议</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="onGotoDetail()"> 添加充值卡</el-button>
    </div>

    <div class="charge-card-list-filter">
      <el-form inline class="wkt-opt-label-container" @submit.native.prevent>
        <el-form-item label="充值卡：">
          <el-input
            @keyup.enter.native="handleFilterCard"
            @input="handleFilterCard"
            prefix-icon="el-icon-search"
            v-model="cardName"
            maxlength="30"
            placeholder="搜索充值卡"
            style="width: 220px"
          ></el-input>
        </el-form-item>
        <el-button style="margin-top: 2px" plain @click="handleReset">重置</el-button>
      </el-form>
    </div>

    <div class="goods-list">
      <div style="padding-top: 15px; margin-left: 20px">
        <el-button
          class="onshelf"
          :disabled="computeDisableShelfButton"
          @click="onToggleShelf(multipleSelection, false, true)"
          >批量上架</el-button
        >
        <el-button
          class="downshelf"
          :disabled="computeDisableShelfButton"
          @click="onToggleShelf(multipleSelection, true, true)"
          >批量下架</el-button
        >
      </div>
      <el-table
        ref="multipleTable"
        :data="goodsList"
        tooltip-effect="dark"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        class="wkt-table"
      >
        <el-table-column type="selection" v-if="goodsList && goodsList.length" width="70"> </el-table-column>
        <el-table-column label="充值卡名称" min-width="200">
          <template slot-scope="scope">
            <div class="goods-desc-box">
              <div class="goods-img" v-if="scope.row.style == null">
                <img :src="scope.row.thumbnail || scope.row.styleUrl" />
              </div>
              <div class="goods-img" v-else>
                <img
                  v-if="scope.row.style === cardEnum.cardStyle.custom"
                  :src="scope.row.thumbnail || scope.row.styleUrl"
                />
                <img v-else :src="scope.row.type === cardEnum.cardType.timesCard ? timeCardBg : chargeCardBg" />
              </div>
              <div class="goods-desc">
                <div>{{ scope.row.name }}</div>
                <span>￥{{ scope.row.salePrice | price }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="有效期">
          <span slot-scope="scope">
            {{ computeValidity(scope.row) }}
          </span>
        </el-table-column>

        <el-table-column label="上下架">
          <template slot-scope="scope">
            <div v-if="scope.row.isShelf" @click="onToggleShelf([scope.row], true)" class="el-switch-div">
              <span
                class="el-switch__core active"
                style="border-color: rgb(19, 206, 102); background-color: rgb(19, 206, 102)"
              ></span>
              <span class="el-switch-title up">上架</span>
            </div>
            <div v-else @click="onToggleShelf([scope.row], false)" class="el-switch-div">
              <span class="el-switch__core" style="border-color: #b1b5bd; background-color: #b1b5bd"></span>
              <span class="el-switch-title down">下架</span>
            </div>
            <!-- <div class="goods-shlef"
                 v-if="scope.row.isShelf">
              <el-button class="btn-state">已上架</el-button>
              <span class="goods-line"></span>
              <a class="table-href"
                 href="javascript:;"
                 @click="onToggleShelf([scope.row], true)">下架</a>
            </div>
            <div class="goods-lower"
                 v-else>
              <el-button class="btn-state">已下架</el-button>
              <span class="goods-line"></span>
              <a class="table-href"
                 href="javascript:;"
                 @click="onToggleShelf([scope.row], false)">上架</a>
            </div> -->
          </template>
        </el-table-column>

        <el-table-column label="总销量" prop="cardSalesVolume"> </el-table-column>

        <el-table-column label="操作" width="135px">
          <template slot-scope="scope">
            <a href="javascript:;" class="table-href" @click="onGotoDetail(scope.row.itemNo)">详情</a>
            <a
              href="javascript:;"
              class="table-del-a"
              v-if="scope.row.isShelf !== 1"
              @click="onGotoDel(scope.row.itemNo)"
              >删除</a
            >
          </template>
        </el-table-column>
        <!--修改无数据时的展示-->
        <template slot="empty">
          <place-holder></place-holder>
        </template>
      </el-table>

      <div style="text-align: center">
        <!-- <el-pagination v-if="totalGoodsCount"
                       layout="prev, pager, next, jumper, sizes, total"
                       :total="totalGoodsCount"
                       :page-size="pageParams.pageSize"
                       :current-page="pageParams.pageNo"
                       @size-change="onSizeChange"
                       @current-change="onPageChange">
        </el-pagination> -->

        <el-pagination
          v-if="totalGoodsCount"
          :hide-on-single-page="true"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-size="pageParams.pageSize"
          layout="sizes, prev, pager, next"
          :total="totalGoodsCount"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import '@/dss-wechat3rd/src/components/goods/css/CommonGoodsListTable.less';
  import moneyUtil from '@/dss-common/utils/money';
  import services from '@/dss-common/utils/services';
  import itemCardApi from '@/dss-wechat3rd/src/api/wx-item-card.js';
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
      PlaceHolder,
    },

    filters: {
      toPageUnit(val) {
        return moneyUtil.convertHundredMoneyUnit(val, true);
      },
    },

    data() {
      return {
        goodsList: [],
        cardEnum,
        loading: false,
        goodsTypeTab: goodsTypeEnum,
        totalGoodsCount: 0,
        pageParams: {
          pageSize: 10, // 每页条数
          pageNo: 1, // 页数
        },
        queryParams: {
          type: cardEnum.cardType.chargeCard,
          status: 1,
        },
        cardName: '',
        multipleSelection: [],
        timeCardBg: timeCardBg,
        chargeCardBg: chargeCardBg,
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
        return function (item) {
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
        return function (item) {
          if (item.validityType === cardEnum.validityType.permanent) {
            return '永久有效';
          } else if (item.validityType === cardEnum.validityType.custom) {
            return item.validity + '天';
          } else {
            return null;
          }
        };
      },
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
            action: '商品列表',
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

      onToggleShelf(itemNoList, isNowShelf, isPatch = false) {
        if (isPatch) {
          // 当前页操作选中状态时，需要重新计算一次选中的item。
          this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);
          itemNoList = this.mTotalCheckedList;
        }
        this.loading = true;

        const shelfParams = {
          shelf: isNowShelf ? 0 : 1,
          itemNo: itemNoList
            .map(item => {
              return item.itemNo;
            })
            .toString(),
        };

        services
          .post(constants.Api.card.shelf, shelfParams, {
            action: '上下架',
          })
          .then(res => {
            this.mResetCheckedData();
            this.checked = false;
            const params = { ...this.pageParams, ...this.queryParams };
            return services.get(constants.Api.card.list, {
              params,
              action: '充值卡列表',
            });
          })
          .done(res => {
            this.goodsList = res.data || [];
          })
          .always(() => {
            this.loading = false;
          });
      },

      handleFilterCard(cardName) {
        this.pageParams.pageNo = 1;
        this.queryParams = { ...this.queryParams, itemName: this.cardName };
        this.fetchChargeCardList();
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      onGotoDetail(itemNo) {
        if (itemNo) {
          this.$router.push({ path: '/marketing/charge-card/add', query: { itemNo: itemNo } });
        } else {
          this.$router.push('/marketing/charge-card/add');
        }
      },
      onGotoDeal() {
        this.$router.push('/marketing/charge-card/deal');
      },
      onGotoDel(itemNo) {
        this.$confirm('充值卡删除后不可撤销，已购买的充值卡可继续使用，是否确认删除? ', '删除充值卡', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            itemCardApi.delete({ itemNo: itemNo }).done(res => {
              this.$message({
                message: '删除成功',
                type: 'success',
              });
              this.fetchChargeCardList();
            });
          })
          .catch(() => {
            console.log('取消删除充值卡');
          });
      },
      handleReset() {
        this.cardName = '';
        this.handleFilterCard();
      },
    },
  };
</script>

<style lang="less" scoped>
  .charge-card-container {
    .charge-card-list-filter {
      // padding: 20px;
      padding-left: 20px;
      padding-top: 5px;
      background: #fff;
      border-radius: 0px 0px 4px 4px;
      // position: relative;
      .el-form-item {
        margin-bottom: 15px;
      }
      .wkt-opt-label-container {
        // padding-bottom: 10px;
        box-shadow: none;
      }
      // .new-card-box {
      //   position: absolute;
      //   right: 20px;
      //   top: 30px;
      // }
    }
    .goods-list {
      padding: 0px;
      padding-bottom: 20px;
      margin-top: 16px;
    }
  }

  .el-switch__core {
    margin: 0;
    display: inline-block;
    position: relative;
    width: 53px;
    height: 20px;
    border: 1px solid #dcdfe6;
    outline: none;
    border-radius: 10px;
    box-sizing: border-box;
    background: #dcdfe6;
    cursor: pointer;
    transition: border-color 0.3s, background-color 0.3s;
    vertical-align: middle;
  }

  .el-switch__core:after {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    border-radius: 100%;
    transition: all 0.3s;
    width: 16px;
    height: 16px;
    background-color: #fff;
  }
  .active:after {
    left: 33px;
  }
  .el-switch-div {
    position: relative;
  }
  .el-switch-title {
    width: 24px;
    height: 16px;
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #ffffff;
    line-height: 16px;
  }
  .up {
    position: absolute;
    left: 6px;
    top: 4px;
  }
  .down {
    position: absolute;
    top: 4px;
    left: 20px;
  }
</style>
