<template>
  <div class="task-container" v-loading="loading">
    <div class="wp-table-top">
      <div class="wp-table-wrap"
           v-if="groupBuyList && groupBuyList.length">
        <div class="wp-table">
          <div class="header">
            <div style="width:35%"
                 class="th left">
              <span>商品信息</span>
            </div>
            <div style="width:11%"
                 class="th left">
              <span>数量金额</span>
            </div>
            <div style="width:15%"
                 class="th left">
              <span>实际付款</span>
            </div>
            <div style="width:13%"
                 class="th left">
              <span>下单店铺</span>
            </div>
            <div style="width:16%"
                 class="th left">
              <span>订单状态</span>
            </div>
            <div style="width:10%;min-width: 160px;text-align: center;"
                 class="th fr">
              <span>操作</span>
            </div>
          </div>
          <div class="body"
               v-for="item in groupBuyList"
               :key="item.orderNo">
            <div class="hd">
              <div style="width:14%"
                   class="td left inline-text">{{item.payTime}}</div>
              <div style="width:26%"
                   class="td left inline-text">订单编号：{{item.orderNo}}</div>
              <div style="width:15%"
                   class="td left inline-text">会员：
                <span :style="getCssBg(item.userWxAvstar)"
                      class="icon"></span>
                {{item.userWxNickName || '未知'}}
              </div>

              <div class="leader"
                   v-if="item.leader">团长</div>

            </div>
            <div class="bd">
              <div style="width:35%"
                   class="td left">
                <div class="goods-info"
                     v-if="item.itemList">
                  <!-- 卡券 -->
                  <!-- <div v-if="item.itemType === 3 || item.itemType === 4" :style="!!item.itemList[0].thumbnail ? 'background: transparent url('+item.itemList[0].thumbnail+') no-repeat 0 0;': ''" class="icon"></div> -->
                  <div class="card-type "
                       v-if="item.itemType === 3 || item.itemType === 4"
                       :class="{'recharge-card': item.itemType == 4 && !item.itemList[0].thumbnail, 'times-card': item.itemType == 3 && !item.itemList[0].thumbnail}"
                       :style="item.itemList[0].thumbnail | bgImage">
                  </div>
                  <!-- 非卡券 -->
                  <div v-else
                       :style="getCssBg(item.itemList[0].thumbnail)"
                       class="icon"></div>
                  <div class="info">
                    <div class="name">{{item.itemList ? item.itemList[0].itemName : '-'}}</div>
                    <div class="price">￥{{(item.itemList ? item.itemList[0].salePrice : 0) | price}}</div>
                  </div>
                </div>
              </div>
              <div style="width:11%"
                   class="td left">
                <div class="wp-table-row">
                  <span class="span">数量：{{item.itemList ? item.itemList[0].itemCount : '-'}}</span>
                  <span class="span">小计：{{ (item.itemList ? item.itemList[0].itemCount * item.itemList[0].salePrice : 0) | price }}
                  </span>
                  <span class="span">运费：{{item.logisticsFee|price}}</span>
                </div>
              </div>
              <div style="width:15%"
                   class="td left">
                <div class="wp-table-row">
                  <span class="span"
                        v-if="item.leader">团长优惠：￥{{(item.groupPromFee + item.leaderProm) | price}}</span>
                  <span class="span">合计：
                    <span class="important">￥{{item.payFee | price}}</span>
                  </span>
                  <span class="span">{{item.payChannel}}</span>
                </div>
              </div>
              <div style="width:13%"
                   class="td left">
                <span class="span">{{item.storeName}}</span>
              </div>
              <div style="width:16%"
                   class="td left">
                <div class="wp-table-row">
                  <span class="span">拼团状态：
                    <span :class="'group-status ' + getGroupStatusCss(item)">{{item.groupStatusDesc}}</span>
                  </span>
                  <span class="span important">{{item.orderStatusDesc}}</span>
                </div>

              </div>
              <div style="width:10%; min-width: 160px"
                   class="td fr wp-btn-areas">
                <div class="btn-box">
                  <a href="javascript:;"
                     @click="handleShowDetail(item)">订单详情</a>
                </div>
              </div>
            </div>
            <div class="bt inline-text">
              <span class="receive">收件人：{{item.consignee ? item.consignee : '-'}}</span>
              <span class="tel">电话：{{item.consigneeMobile ? item.consigneeMobile : '-'}}</span>
              <span class="address">地址：{{item.detailAddress ? item.detailAddress : '-'}}</span>
              <span class="marker">买家留言：{{item.userMessage ? item.userMessage : '--'}}</span>
            </div>
          </div>
          <el-pagination layout="prev, pager, next, jumper, sizes, total"
            :total="page.totalCount"
            :page-size="page.pageSize"
            :current-page="page.pageNo"
            :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
            @size-change="onSizeChange"
            @current-change="onPageChange"
            class="wkt-pagination">
          </el-pagination>
        </div>
      </div>
      <place-holder v-else />
    </div>
  </div>
</template>

<script>
import api from '@/dss-wechat3rd/src/api/task-center.js';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import { groupStatus } from '../../../../constants/enum';

export default {
  components: {
    PlaceHolder
  },
  data() {
    return {
      loading: false,
      groupBuyList: [],
      orderlist: '',
      page: {
        pageSize: 10,
        pageNo: 1,
        totalCount: null
      }
    };
  },
  created() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      try {
        this.loading = true;
        let params = {
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          shareId: this.$route.query.id
        };
        let res = await api.getTaskRecord(params);
        if (res && res.data) {
          let params = {
            pageNo: this.page.pageNo,
            pageSize: this.page.pageSize,
            ids: res.data.join()
          };
          api
            .getTaskGroupList(params)
            .done(res => {
              this.groupBuyList = res.data || [];
              this.page.totalCount = res.totalCount;
            })
            .always(res => {
              this.loading = false;
            });
        } else {
          this.loading = false;
        }
      } finally {
      }
    },
    onSizeChange(size) {
      this.page.pageSize = size;
      this.fetchData();
    },
    onPageChange(page) {
      this.page.pageNo = page;
      this.fetchData();
    },

    // 获取非卡项背景
    getCssBg(url) {
      return url ? `background: transparent url(${url}) no-repeat 0 0;` : '';
    },

    // 获取拼团状态
    getGroupStatusCss(item) {
      if (groupStatus.SUCCESS === item.groupStatus) {
        return 'group-success';
      }
      if (groupStatus.isFailed(item.groupStatus)) {
        return 'group-failed';
      }
      return '';
    },

    /**
     * 跳转拼团详情页面
     */
    handleShowDetail(item) {
      this.$router.push(`/marketing/task-center/operation/order/detail?orderNo=${item.orderNo}&orderType=group`);
    }
  }
};
</script>

<style lang="less" scoped>
.wp-table-top {
  background-color: #fff;
  font-family: MicrosoftYaHei;
}

.wp-table-wrap {
  margin: 0 20px;
  padding-bottom: 20px;
}

.wp-table .header {
  position: relative;
  font-weight: 700;
  height: 57px;
  background: #fff !important;
}

.wp-table .header .th {
  height: 19px;
  line-height: 19px;
  font-size: 14px;
  color: #20252c;
  padding: 19px 0;
  display: inline-block;
  float: left;
}

.wp-table .th:first-child span {
  padding-left: 20px;
}

.wp-table .body {
  height: 181px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(186, 198, 211, 1);
  margin-bottom: 10px;
}

.wp-table .inline-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.leader {
  font-size: 12px;
  line-height: 16px;
  color: rgba(255, 86, 45, 1);
  border: 1px solid rgba(255, 86, 45, 1);
  background: rgba(255, 86, 45, 0.23);
  border-radius: 2px;
  display: inline-block;
  padding: 0 3px;
}

.group-status {
  line-height: 20px;
  border-radius: 2px;
  font-size: 12px;
  padding: 0 4px;
  display: inline-block;
}

.group-success {
  background: rgba(55, 190, 143, 0.2);
  color: rgba(55, 190, 143, 1);
}

.group-failed {
  background: rgba(255, 86, 45, 0.23);
  color: rgba(255, 86, 45, 1);
}

/*----*/
.wp-table .hd {
  height: 38px;
  line-height: 38px;
  border-radius: 4px;
  border-bottom: 1px solid rgba(186, 198, 211, 1);
}

.wp-table .hd .td {
  font-size: 12px;
  color: rgba(86, 105, 128, 1);
  float: left;
}

.wp-table .hd .td:first-child {
  padding-left: 20px;
}

.wp-table .hd .icon {
  width: 24px;
  height: 24px;
  background: rgba(216, 216, 216, 1);
  display: inline-block;
  vertical-align: middle;
  margin-right: 7px;
  background-size: cover !important;
}

/*----*/
.wp-table .bt {
  height: 37px;
  line-height: 37px;
  font-size: 12px;
  color: rgba(86, 105, 128, 1);
  background: rgba(248, 249, 254, 1);

  .receive {
    padding-left: 20px;
  }

  .tel {
    margin-left: 62px;
  }

  .address {
    margin-left: 48px;
  }

  .marker {
    padding-left: 48px;
  }
}

/*----*/
.wp-table .bd {
  position: relative;
  height: 104px;
  line-height: 104px;
  border-radius: 4px;
}

.wp-table .bd .td {
  height: 104px;
  float: left;
}

.wp-table .span {
  height: 16px;
  line-height: 16px;
  font-size: 12px;
  color: #566980;
  display: inline-block;
  word-wrap: break-word;
  word-break: break-all;
}

.wp-table .right {
  text-align: right;
}

.wp-table .center {
  text-align: center;
}

.wp-table .left {
  text-align: left;
}

.wp-table .fr {
  position: absolute !important;
  right: 0;
}

.wp-table .important {
  color: rgba(255, 86, 45, 1);
}

/*---表格空----*/
.wp-table .empty {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #606266;
  margin: 20px 0;
}

/*-----多行----*/
.task-container .wp-table-row {
  padding-top: 21px;
}

.wp-table-row .span {
  display: table-row;
  line-height: 1.5;
}

/*---商品信息字段----*/
.wp-table .goods-info {
  display: inline-block;
  width: 100%;
  height: 62px;
  text-align: left;
  padding: 21px 19px 0 20px;

  .card-type {
    width: 62px;
    height: 35px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    float: left;
    margin-right: 19px;
  }
  // .recharge-card {
    // background-image: url('../../../../../../../decorate_components/vue/base/images/card/recharge-card.png');
  // }
  // .times-card {
    // background-image: url(../../../../../../../decorate_components/vue/base/images/card/times-card.png);
  // }
}

.wp-table .goods-info .icon,
.wp-table .goods-info .info {
  float: left;
}

.wp-table .goods-info .icon {
  background-size: cover !important;
  width: 62px;
  height: 62px;
  margin-right: 19px;
}

.wp-table .goods-info .info {
  width: 70%;
}

.wp-table .goods-info .name {
  font-size: 12px;
  color: rgba(32, 37, 44, 1);
  line-height: 16px;
}

.wp-table .goods-info .price {
  font-size: 12px;
  font-weight: bold;
  color: rgba(255, 86, 45, 1);
  line-height: 2.5;
  margin-top: 1px;
}

/*-----按钮区域-----*/
.wp-btn-areas .btn-box {
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.wp-btn-areas .btn,
.wp-btn-areas a {
  cursor: pointer;
  width: 72px;
  height: 24px;
  line-height: 1;
  font-size: 12px;
  border-radius: 2px;
  text-align: center;
}
.wp-btn-areas .btn {
  margin-top: 7px;
}

.wp-btn-areas .default-btn {
  background: rgba(255, 255, 255, 1);
  color: rgba(86, 105, 128, 1);
  border: 1px solid rgba(186, 198, 211, 1);
  display: block;
}

.wp-btn-areas .refund-btn-box {
  display: flex;
  flex-direction: column;
}

.refund-btn-box .btn-popover {
  display: block;
  height: 32px;
}

.wp-btn-areas .primary-btn {
  background: rgba(67, 121, 237, 1);
  border: 1px solid rgba(67, 121, 237, 1);
  color: rgba(248, 249, 254, 1);
  vertical-align: top;
}

.wp-btn-areas .primary-btn:hover {
  background: rgba(67, 121, 237, 0.8);
  border: 1px solid rgba(67, 121, 237, 0.8);
  color: rgba(248, 249, 254, 0.8);
}

.wp-btn-areas .danger-btn {
  background: rgba(255, 86, 45, 1);
  border: 1px solid rgba(255, 86, 45, 1);
  color: rgba(248, 249, 254, 1);
  vertical-align: top;
}

.wp-btn-areas .danger-btn:hover {
  background: rgba(255, 86, 45, 0.8);
  border: 1px solid rgba(255, 86, 45, 0.8);
  color: rgba(248, 249, 254, 0.8);
}

.wp-btn-areas .default-btn:hover {
  background: rgba(255, 255, 255, 0.8);
  color: rgba(86, 105, 128, 0.8);
  border: 1px solid rgba(186, 198, 211, 0.8);
}

.wp-btn-areas a {
  color: rgba(67, 121, 237, 1);
  line-height: 2;
  display: block;
}

.wp-btn-areas a:hover {
  color: rgba(67, 121, 237, 0.8);
}

.remark-dialog {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
