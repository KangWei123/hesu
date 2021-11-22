<template>
  <div class="selling-details">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item v-if="!isDiscard"
                          :to="{ path: '/marketing/gift-card/mgr' }">礼品卡</el-breadcrumb-item>
      <el-breadcrumb-item v-else
                          :to="{ path: '/marketing/gift-card/discard' }">废弃礼品卡</el-breadcrumb-item>
      <el-breadcrumb-item>售卖详情</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="gift-card-info">
      <div>
        <div>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="bg-purple">
                <span class="bg-card-line"></span>
                <span class="card-title">{{staticInfo.giftCardItemName}}</span>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="grid-content bg-purple">
                <span class="bg-card-line"></span>
                <el-row :gutter="20">
                  <el-col :span="6" style="margin-left: 14%;">
                    <div class="content-item">
                      <div class="item-lable">
                        <div>当前总销量：</div>
                        <div>售价：</div>
                        <div>面值：</div>
                        <div>总价值：</div>
                      </div>
                      <div class="item-value">
                        <div class="item-value-margin">{{staticInfo.saleVolume || 0}}张</div>
                        <div>￥{{staticInfo.salePrice |price}}</div>
                        <div>￥{{staticInfo.usableAmount |price}}</div>
                        <div>￥{{staticInfo.totalValue |price}}</div>
                      </div>
                    </div>
                  </el-col>

                  <el-col :span="4">
                    <span class="separate-line"></span>
                  </el-col>

                  <el-col :span="6">
                    <div class="content-item">
                      <div class="item-lable">
                        <div>销售总收入：</div>
                        <div>自用数量：</div>
                        <div>赠送数量：</div>
                        <div>未激活数量：</div>
                      </div>
                      <div class="item-value">
                        <div>￥{{staticInfo.saleRevenue |price}}</div>
                        <div class="item-value-margin">{{staticInfo.personalNum || 0}}张</div>
                        <div class="item-value-margin">{{staticInfo.sendOutNum || 0}}张</div>
                        <div class="item-value-margin">{{staticInfo.inactiveNum || 0}}张</div>
                      </div>
                    </div>
                  </el-col>
                </el-row>  
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- <div class="gift-card-label">
          <span class="info-label">礼品卡：</span>
          <span>{{staticInfo.giftCardItemName}}（{{staticInfo.giftCardItemNo}}）</span>
        </div>
        <el-table :data="staticInfo ? [staticInfo] : []"
                  stripe
                  class="wkt-table">
          <el-table-column label="当前总销量"
                           prop="saleVolume">
            <template slot-scope="scope">{{scope.row.saleVolume || 0}}张</template>
          </el-table-column>
          <el-table-column label="售价"
                           prop="salePrice">
            <template slot-scope="scope">￥{{scope.row.salePrice |price}}</template>
          </el-table-column>
          <el-table-column label="面值"
                           prop="usableAmount">
            <template slot-scope="scope">￥{{scope.row.usableAmount |price}}</template>
          </el-table-column>
          <el-table-column label="总价值"
                           prop="totalValue">
            <template slot-scope="scope">￥{{scope.row.totalValue |price}}</template>
          </el-table-column>
          <el-table-column label="销售总收入"
                           prop="saleRevenue">
            <template slot-scope="scope">￥{{scope.row.saleRevenue |price}}</template>
          </el-table-column>
          <el-table-column label="自用数量"
                           prop="personalNum">
            <template slot-scope="scope">￥{{scope.row.personalNum || 0}}张</template>
          </el-table-column>
          <el-table-column label="赠送数量"
                           prop="sendOutNum">
            <template slot-scope="scope">￥{{scope.row.sendOutNum || 0}}张</template>
          </el-table-column>
          <el-table-column label="未激活数量"
                           prop="inactiveNum">
            <template slot-scope="scope">￥{{scope.row.inactiveNum || 0}}张</template>
          </el-table-column>
        </el-table> -->

        <div class="card-list-filter-box">
          筛选：
          <el-select size="mini"
                     v-model="filterStatus"
                     @change="onChange">
            <el-option v-for="s in status"
                       :key="s.value"
                       :value="s.value"
                       :label="s.label"></el-option>
          </el-select>
        </div>
      </div>
      <el-table :data="tableData"
                style="width: 100%"
                class="wkt-table"
                v-loading="loading.list">
        <el-table-column prop="userCardNo"
                         label="礼品卡序号"
                         width="200"
                         class-name="stress-font">
        </el-table-column>
        <el-table-column prop="cardItemName"
                         label="名称">
        </el-table-column>
        <el-table-column prop="priceRange"
                         label="会员"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="text-over-hidden">{{scope.row.userNickname}}</div>
            <div class="text-over-hidden"> {{scope.row.userPhone ? scope.row.userPhone:'-'}} {{scope.row.userRealName ? scope.row.userRealName:'-'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="buyTime"
                         label="购买时间">
        </el-table-column>
        <el-table-column prop="address"
                         label="状态">
          <template slot-scope="scope">
            {{scope.row.ownerStatus === 0 ? (scope.row.cardStatus === 0 ? '' : '自用'): '赠送' }}{{scope.row.cardStatus === 0 ? '未激活': '已激活'}}
          </template>
        </el-table-column>
        <el-table-column prop="priceRange"
                         label="获赠人">
          <template slot-scope="scope">
            <div class="text-over-hidden">{{scope.row.receiveUserNickname}}</div>
            <div class="text-over-hidden"> {{scope.row.receiveUserPhone ? scope.row.receiveUserPhone: '-'}} {{scope.row.receiveUserRealName ? scope.row.receiveUserRealName : '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="address"
                         label="操作"
                         :width="120">
          <span slot-scope="scope">
            <el-button type="text"
                       @click="onViewConsumption(scope.row)">消费记录</el-button>
          </span>
        </el-table-column>
      </el-table>

      <!-- <el-pagination layout="prev, pager, next, jumper, sizes, total"
                     :total="totalCount"
                     v-if="totalCount"
                     :page-size="page.pageSize"
                     :current-page="page.pageNo"
                     :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                     @size-change="onSizeChange"
                     @current-change="onPageChange">
      </el-pagination> -->

      <el-pagination
        v-if="totalCount"
        :hide-on-single-page="true"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :page-size="page.pageSize"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        layout="sizes, prev, pager, next"
        :total="totalCount">
      </el-pagination> 
    </div>
  </div>
</template>

<script>
import itemCardApi from '@/dss-wechat3rd/src/api/wx-item-card.js';
import { giftCardStatus } from '@/dss-wechat3rd/src/constants/enum.js';

export default {
  data() {
    return {
      isDiscard: !!this.$route.query.isDiscard,
      itemNo: null,
      staticInfo: {},
      list: [],
      loading: false,
      tableData: [],
      status: [{ value: '', label: '所有' }].concat(giftCardStatus.getArray()),
      page: {
        pageSize: 20,
        pageNo: 1
      },
      totalCount: 0,
      filterStatus: ''
    };
  },
  computed: {
    selectedStatus() {
      switch (this.filterStatus) {
        case giftCardStatus.SELF_ACTIVATION: {
          return {
            ownerStatus: 0, // 自用
            cardStatus: 1 //激活
          };
        }
        case giftCardStatus.GIFT_INACTIVATION: {
          return {
            ownerStatus: 1, // 赠送
            cardStatus: 0 //未激活
          };
        }
        case giftCardStatus.GIFT_ACTIVATION: {
          return {
            ownerStatus: 1, // 赠送
            cardStatus: 1 //激活
          };
        }
        case giftCardStatus.INACTIVATION: {
          return {
            ownerStatus: 0, // 自用
            cardStatus: 0 //未激活
          };
        }
      }
      return {};
    }
  },
  mounted() {
    const itemNo = this.$route.query.itemNo;
    if (!itemNo) {
      this.$message({
        message: '缺少礼品卡编号。',
        type: 'error'
      });
      return;
    }
    this.itemNo = itemNo;
    this.getCardData(itemNo);
    this.fetchData();
  },
  methods: {
    getCardData(itemNo) {
      itemCardApi.query_sell_statistic({ itemNo }).done(res => {
        this.staticInfo = res.data;
      });
    },
    fetchData() {
      const params = {
        itemNo: this.itemNo,
        ...this.page,
        ...this.selectedStatus
      };
      itemCardApi.query_sell_list(params).done(res => {
        this.totalCount = res.totalCount;
        this.tableData = res.data;
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
    },
    onViewConsumption(row) {
      this.$router.push(
        `/marketing/gift-card/mgr/selling-details/consumption?cardNo=${row.userCardNo}&id=${row.receiveUserId ||
          row.userId}`
      );
    }
  }
};
</script>

<style lang="less">
.el-tooltip__popper {
  max-width: 700px;
}
.selling-details {
  .gift-card-label {
    color: @black-color;
    font-weight: bold;
    font-size: 14px;
  }
  .gift-card-info {
    // padding: 20px;
    margin-top: 16px;
    .card-list-filter-box {
      margin-top: 20px;
      color: @black-color;
      margin-bottom: 16px;
      color: #717378;
    }
  }

  // 礼品卡表格样式更改
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    height: 158px;
    background: #fff;
    box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.06);
    border-radius: 4px;
    color: #717378;
    .el-row {
      padding: 20px;
      padding-top: 35px;
    }
    .bg-card-line {
      width: 100%;
      height: 4px;
      background: #FA7516;
      display: inherit;
    }
    .card-title {
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #303133;
      line-height: 22px;
      margin-top: 50px;
      text-align: center;
      display: block;
    }
    .content-item {
      display: flex;
      justify-content: space-around;
      .item-value-margin {
        margin-left: 15px;
      }
    }
    .separate-line {
      width: 0px;
      height: 88px;
      display: block;
      border: 1px solid #dce1e6;
      margin-left: 50%;
    }
    .item-lable {
      text-align: right;
    }
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .el-pagination {
    background: #fff;
    padding-top: 20px;
    margin-top: 0px;
  }
}
</style>

