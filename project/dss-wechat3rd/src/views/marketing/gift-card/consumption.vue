<template>
  <div class="consumption" v-loading="isLoading">
    <el-breadcrumb
      separator=">"
      class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/gift-card/mgr' }">礼品卡</el-breadcrumb-item>
      <el-breadcrumb-item>消费记录</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card-sell-info">
      <div class="info-item">
        <span class="info-label">礼品卡：</span><span>{{cardInfo.cardItemName}}（{{cardInfo.cardItemNo}}）</span>
      </div>

      <el-table
        :data="cardInfo ? [cardInfo] : []"
        class="wkt-table"
      >
        <el-table-column
          label="礼品卡序号"
          prop="userCardNo"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="售价"
          prop="salePrice"
          align="center"
        >
          <template slot-scope="scope">￥{{scope.row.salePrice |price}}</template>
        </el-table-column>
        <el-table-column
          label="价值"
          prop="usableAmount"
          align="center"
        >
          <template slot-scope="scope">￥{{scope.row.usableAmount |price}}</template>
        </el-table-column>
        <el-table-column
          label="余额"
          prop="balance"
          align="center"
        >
          <template slot-scope="scope">￥{{scope.row.balance |price}}</template>
        </el-table-column>
        <el-table-column
          label="会员"
          prop="saleRevenue"
          align="center"
        >
          <template slot-scope="scope">
            <div class="text-over-hidden">{{scope.row.userNickname}}</div>
            <div class="text-over-hidden"> {{scope.row.userPhone}} {{scope.row.userRealName}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="购买时间"
          prop="buyTime"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="状态"
          prop="sendOutNum"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.ownerStatus === 0 ? (scope.row.cardStatus === 0 ? '' : '自用'): '赠送' }}{{scope.row.cardStatus === 0 ? '未激活': '已激活'}}
          </template>
        </el-table-column>
        <el-table-column
          label="获赠人"
          prop="inactiveNum"
          align="center"
        >
          <template slot-scope="scope">
            <div class="text-over-hidden">{{scope.row.receiveUserNickname}}</div>
            <div class="text-over-hidden"> {{scope.row.receiveUserPhone}} {{scope.row.receiveUserRealName}}</div>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <table-split class="consume-info">
      <template slot="thead">
        <table-split-col
          label="商品信息"
          width="40%"
        />
        <table-split-col label="金额" />
        <table-split-col label="实收" />
        <table-split-col label="下单门店" />
        <table-split-col
          label="订单状态"
          width="10%"
        />
      </template>
      <template v-for="(item,index) in list">
        <tr :key="'tr_' + index + '_1'">
          <td colspan="5">
            <el-row>
              <el-col :span="8">{{item.payTime}} 订单编号：{{item.orderNo}} </el-col>
              <el-col :span="8">会员：{{item.userWxNickName}} </el-col>
              <el-col :span="8" v-if="!!item.userMessage">留言：{{item.userMessage}}</el-col>
            </el-row>
          </td>
        </tr>

        <tr :key="'tr_' + index + '_2'">
          <td
            valign="middle"
            style="padding: 0;"
          >
            <div
              class="goods-item"
              style="border: none;"
              v-for="(goods, gIndex) in item.itemList"
              :key="goods.id"
              :style="{border: gIndex === 0 ? 'none' : ''}"
            >
              <img
                class="goods-img"
                :src="goods.thumbnail"
              />
              <div class="goods-info">
                <div class="text-over-hidden">{{goods.itemName}}</div>
                <div v-if="!!item.itemAttribute">规格：{{goods.itemAttribute}}</div>
                <div>单价：{{goods.salePrice|price}} 数量：{{goods.itemCount}}</div>
              </div>
            </div>
          </td>
          <td>
            <div>运费：{{item.logisticsFee |price}}</div>
            <div class="span"
                      v-if="item.groupLeaderPromFee || item.groupPromFee">拼团：￥-{{computeGroupPromFee(item) | price}}</div>
            <div class="span"
                      v-if="item.cardPromFee">卡项：￥-{{item.cardPromFee | price}}</div>
            <div class="span"
                      v-if="item.cashPromFee">现金：￥-{{item.cashPromFee | price}}</div>
            <div class="span"
                      v-if="item.couponPromFee">优惠券：￥-{{item.couponPromFee | price}}</div>
            <div class="span"
                      v-if="item.redPacketPromFee">红包：￥-{{item.redPacketPromFee | price}}</div>
            <div class="span"
                      v-if="item.bargainPromFee">砍价：￥-{{item.bargainPromFee | price}}</div>
            <div class="span"
                      v-if="item.userGiftCardPromFee">礼品卡：￥-{{item.userGiftCardPromFee | price}}</div>
            <div class="span"
                      v-if="item.memberPromFee">会员：￥-{{item.memberPromFee | price}}</div>

            <div class="span">合计：<span class="important">￥{{item.totalFee | price}}</span></div>
          </td>
          <td>
            <div>实收：￥{{item.payFee | price}}</div>
            <div>{{item.payChannel}}</div>
          </td>

          <td>
            <div>{{item.storeName}}</div>
          </td>

          <td align="center">
            <div>{{item.orderStatusDesc}}</div>
          </td>
        </tr>

        <tr :key="'tr_' + index + '_3'" style="margin-bottom: 20px;">
          <td colspan="5">
            <el-row>
              <el-col :span="8">收货人：{{item.consignee || '-'}} 电话：{{item.consigneeMobile || '-'}} </el-col>
              <el-col :span="16">地址：{{item.detailAddress || '-'}} </el-col>
            </el-row>
          </td>
        </tr>
        <tr :key="'tr_' + index + '_4'" >
          <td colspan="5" style="border: none;height:15px;padding:0;background: transparent;"></td>
        </tr>
      </template>
    </table-split>
    <place-holder v-if="!list || !list.length"></place-holder>

    <el-pagination
      v-if="totalCount"
      layout="prev, pager, next, jumper, sizes, total"
      :total="totalCount"
      :page-size="page.pageSize"
      :current-page="page.pageNo"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      class="wkt-pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
import TableSplit from './table-split.vue';
import TableSplitCol from './table-split-col.vue';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import itemCardApi from '@/dss-wechat3rd/src/api/wx-item-card.js';

export default {
  components: {
    TableSplit,
    TableSplitCol,
    PlaceHolder
  },
  data() {
    return {
      cardNo: null,
      userId: null,
      cardInfo: {},
      list: [],
      isLoading: false,
      page: {
        pageSize: 10,
        pageNo: 1
      },
      totalCount: 0
    };
  },
  mounted() {
    const { cardNo, id } = this.$route.query;
    if (!cardNo || !id) {
      this.$message({
        message: '缺少参数。',
        type: 'error'
      });
      return;
    }
    this.cardNo = cardNo;
    this.userId = id;
    this.getCardInfo();
    this.fetchData();
  },
  methods: {
    getCardInfo() {
      itemCardApi.query_user_info({ userCardNo: this.cardNo }).done(res => {
        this.cardInfo = res.data;
      });
    },
    fetchData() {
      this.isLoading = true;
      const params = {
        ...this.page,
        userGiftCardNo: this.cardNo,
        userId: this.userId
      };
      itemCardApi
        .query_order_list(params)
        .done(res => {
          this.list = res.data;
          this.totalCount = res.totalCount;
        })
        .always(() => {
          this.isLoading = false;
        });
    },
    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.fetchData();
    },
    onPageChange(page) {
      this.page.pageNo = page;
      this.fetchData();
    },
    onChange() {
      this.page.pageNo = 1;
      this.fetchData();
    }
  }
};
</script>

<style lang="less">
.consumption {
  .text-over-hidden {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .important {
    color: rgba(255, 86, 45, 1);
  }

  .card-sell-info, .consume-info {
    padding: 20px;
  }
  .goods-item {
    border-top: 1px solid #ebeef5;
    padding: 10px 8px;

    .goods-img {
      width: 80px;
      height: 80px;
      position: absolute;
      margin-left: 10px;
      vertical-align: middle;
    }
    .goods-info {
      box-sizing: border-box;
      padding-left: 100px;
      padding-top: 10px;
      min-height: 80px;
    }
  }
}
</style>
