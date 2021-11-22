<template>
  <div class="mgr-gift-list">
    <div class="goods-btn-box">

    </div>
    <gift-filter class="wkt-opt-label-container"
                 :goods-type="goodsTypeEnum.gift"
                 @filter="onFilter" />
    <div class="mgr-list-content">
      <el-table ref="reuseTable"
                :data="mgrList"
                v-loading="loading">
        <el-table-column label="赠品名称"
                         min-width="200">
          <template slot-scope="scope">
            <div class="mgr-desc-box">
              <div class="mgr-img"><img :src="scope.row.thumbnail" /></div>
              <div class="mgr-desc">
                <div>{{ scope.row.name}} {{ scope.row.attrValCombineName?'('+scope.row.attrValCombineName+')':''   }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="营销属性">
          <span slot-scope="scope"
                class="ellipsis"
                :title="activityList(scope.row)">
            {{ activityList(scope.row) }}
          </span>
        </el-table-column>
        <el-table-column label="操作"
                         width="80">
          <template slot-scope="scope">
            <a href="javascript:;"
               @click="goDetail(scope.row)">详情</a>
          </template>
        </el-table-column>
        <!--修改无数据时的展示-->
        <template slot="empty">
          <place-holder></place-holder>
        </template>
      </el-table>
      <!-- <el-pagination layout="prev, pager, next, jumper, sizes, total"
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
          :total="totalGoodsCount">
        </el-pagination> 
    </div>

  </div>
</template>

<script>
import PlaceHolder from '@/dss-common/components/placeholder/index';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
import giftFilter from './gift-filter';
import giftApi from '@/dss-wechat3rd/src/api/gift.js';

export default {
  name: 'mgr-list-table',
  components: {
    PlaceHolder,
    giftFilter
  },
  data() {
    return {
      goodsTypeEnum,
      loading: false,
      mgrList: [],
      // 商品类型
      type: null,
      totalGoodsCount: 0,
      pageParams: {
        pageSize: 10, //每页条数
        pageNo: 1 //页数
      },
      queryParams: {
        type: goodsTypeEnum.gift.value
      },
      showDialog: false,
      //管理员权限
      create_item: false,
      update_item: false,
      manage_label: false
    };
  },
  filters: {
    toPageUnit(val) {
      let money = val;
      return money ? '￥' + money / 100 : '免费';
    }
  },
  computed: {
    activityList() {
      return function(item) {
        const inActivity = item.inActivity ? '会员权益,' : '';
        if (inActivity) {
          const activityText = inActivity;
          return activityText.slice(0, activityText.length - 1);
        } else {
          return '无';
        }
      };
    }
  },
  mounted() {},
  methods: {
    warnAlert(msg) {
      this.$message({
        message: msg,
        type: 'warning'
      });
    },

    goDetail(row) {
      this.$router.push({
        path: '/retail/goods-mgr/gift-mgr/discard/detail',
        query: { giftNo: row.giftNo, status: 0 }
      });
    },

    //获取商品列表
    getMgrList() {
      this.loading = true;
      let params = { ...this.pageParams, ...this.queryParams };
      giftApi
        .getAbandonGiftList(params)
        .done(res => {
          this.mgrList = res.data || [];
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

    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.getMgrList();
    },
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.getMgrList();
    },

    giftBatch() {
      this.showDialog = true;
    },

    onFilter(filter) {
      this.pageParams.pageNo = 1;
      this.queryParams = { ...this.queryParams, ...filter };
      this.getMgrList();
    }
  }
};
</script>

<style lang="less">
@import '~@/dss-common/style/wkt-constants.less';
@import './index.less';
</style>
