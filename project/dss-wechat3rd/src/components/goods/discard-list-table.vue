<template>
  <div class="goods-list-container manage-goods-list">
    <goods-list-filter :show-label="false"
                       class="wkt-opt-label-container"
                       :goods-type="goodsType"
                       @filter="onFilter" />
    <div class="goods-list"
         style="margin-top: 16px; border-radius: 4px;"
         v-if="goodsType !== null"
         v-loading="loading">
      <el-table :data="goodsList"
                stripe
                class="wkt-table">
        <el-table-column :label="goodsType.label + '名称'"
                         min-width="200">
          <template slot-scope="scope">
            <div class="goods-desc-box">
              <div class="goods-img"><img :src="scope.row.thumbnail" /></div>
              <div class="goods-desc">
                <div>{{ scope.row.name}}</div>
                <span>{{ scope.row.salePrice | price | toPageUnit}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="goodsType.label + '分类'"
                         v-if="goodsType.value === goodsTypeEnum.product.value">
          <span slot-scope="scope"
                class="category ellipsis"
                :title="scope.row.categoryDTO.category">
            {{ scope.row.categoryDTO.category }}
          </span>
        </el-table-column>

        <el-table-column label="分类"
                         v-else>
          <template slot-scope="scope">
            <span>{{!scope.row[`${goodsType.type}Type`]?goodsType.oddDay.label:goodsType.combo.label}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作"
                         width="80">
          <template slot-scope="scope">
            <el-popover placement="top-start"
                        width="200"
                        trigger="hover"
                        v-if="!lookitem"
                        :content="scopeMenuEnum.disabledBtnTip">
              <a href="javascript:;" slot="reference">查看</a>
            </el-popover>
            <a href="javascript:;" v-else @click="editGoods(scope.row)">查看</a>
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
                       @current-change="onPageChange"
                       class="wkt-pagination">
        </el-pagination> -->

        <el-pagination
          v-if="totalGoodsCount"
          :hide-on-single-page="true"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-size="pageParams.pageSize"
          layout="sizes, prev, pager, next"
          :total="totalGoodsCount">
        </el-pagination> 
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import './css/CommonGoodsListTable.less';

import services from '@/dss-common/utils/services';
import constants from '../../constants/index';
import PlaceHolder from '@/dss-common/components/placeholder/index';
import goodsTypeEnum from '../../constants/goodsTypeEnum';
import wpBaseApi from '@/business-common/wp-base-api.js';
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
import GoodsListFilter from './GoodsListFilter';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';
const MoneyUnit = '￥';
/**
 * 管理商品的商品列表
 */
export default {
  name: 'GoodsList',
  mixins: [industryHelperMixin],
  components: {
    PlaceHolder,
    GoodsListFilter
  },
  props: {
    goodsType: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      goodsTypeEnum,
      scopeMenuEnum,
      loading: false,
      goodsList: [],
      totalGoodsCount: 0,
      create_item: false,
      update_item: false,
      manage_label: false,
      pageParams: {
        pageSize: 10, //每页条数
        pageNo: 1 //页数
      },
      queryParams: {
        type: this.goodsType.value
      },

      qrCode: null,
      qrCodeLoading: true,

      // 按钮接口返回的权限
      lookitem: false // 查看
    };
  },

  filters: {
    toPageUnit(val) {
      let money = val;
      return money ? MoneyUnit + money : '免费';
    }
  },

  computed: {
    ...mapState({
      env: 'env',
      wkbScopeMenu: 'wkbScopeMenu'
    }),
    //根据商品类型定义标签类型
    labelType() {
      if (this.goodsType.type === 'product') {
        return 1;
      } else if (this.goodsType.type === 'server') {
        return 0;
      }
    }
  },
  watch: {
    wkbScopeMenu: {
      immediate: true,
      handler() {
        if (this.wkbScopeMenu) {
          this.assembleOrderMgrMenu();
        }
      }
    }
  },
  mounted() {},

  methods: {
    assembleOrderMgrMenu() {
      const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.goodsListButton.abandoned_goods
      );
      scopeMenu.childMenu &&
        scopeMenu.childMenu.forEach(item => {
          if (item.identifier == 'abandoned_goods_show' && item.isHasPermission == 1) {
            this.lookitem = true;
          }
        });
    },
    /**
     * 根据商品类型获取商品列表
     * @param goodsType 商品类型
     */
    listGoodsByType() {
      this.loading = true;
      const params = { ...this.pageParams, ...this.queryParams };
      params.status = 0;
      const url =
        this.goodsType.value === goodsTypeEnum.card.value ? constants.Api.card.list : constants.Api.goods.list;
      if (this.goodsType.value === goodsTypeEnum.card.value) {
        params.type = null;
      }
      services
        .get(url, {
          params,
          action: '商品列表'
        })
        .done(res => {
          //console.log('商品列表: ' + JSON.stringify(res));
          this.goodsList = res.data || [];
          this.totalGoodsCount = res.totalCount;
        })
        .always(() => {
          this.loading = false;
        });
    },

    warnTip(msg) {
      this.$message({
        message: msg,
        type: 'warning'
      });
    },

    editGoods(row) {
      let url = '/retail/goods-mgr/product/discard/add';
      if (this.goodsType.value === goodsTypeEnum.product.value) {
        url = '/retail/goods-mgr/product/discard/add';
      } else {
        if (this.goodsType.value === goodsTypeEnum.rooms.value) {
          url = '/hotel-mgr/rooms-mgr/detail';
        } else {
          url = '/ticketing-mgr/ticket/detail';
        }
      }

      this.$router.push({
        path: url,
        query: {
          itemNo: row.itemNo,
          labelType: this.labelType,
          mgrLabel: this.goodsType.type,
          disableEdit: 1,
          status: 0
        }
      });
    },

    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.listGoodsByType();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.listGoodsByType();
    },

    onFilter(filter) {
      this.pageParams.pageNo = 1;
      this.queryParams = { ...this.queryParams, ...filter };
      this.listGoodsByType();
    }
  }
};
</script>

<style lang="less" scoped>
.manage-goods-list .wkt-opt-label-container {
  padding-bottom: 10px !important;
  padding-right: 220px !important;
}
</style>
