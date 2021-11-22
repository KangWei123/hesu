<template>
  <div class="expense-record blue-shadow-box"
       :class="showVersions"> 
       <!-- v-if="!noVip" -->
    <div class="box-title">
      <div>消费记录</div>
    </div>
    <transition-group class="record-list" name="vuelist" tag="div">
      <div class="record-item"
            v-for="(item, index) in list"
            :key="index">
        <span class="record-item-name hidden-over">{{item.name}}</span>
        <span class="record-item-count">x{{item.count}}</span>
        <span class="record-item-money">￥{{item.money}}</span>
        <span class="record-item-date">{{item.time}}</span>
      </div>
    </transition-group>
    <div class="no-data"
            v-show="list && !list.length">暂无消费记录</div>
  </div>
</template>

<script>
import utils from '@/dss-common/utils/date.js';
import cameraFlowApi from '@/dss-common/api/camera-flow.js';
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    wkbStatus: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      list: [],
      consumeAmount: '',
      orderTotalCount: '--'
    };
  },
  watch: {
    data(val, oldVal) {
      if (val && val.memberId) {
        this.getList(val);
      } else {
        this.list = [];
      }
    }
  },
  computed: {
    noVip() {
      console.log(!(this.data.memberId && this.wkbStatus));
      return !(this.data.memberId && this.wkbStatus);
    },
    showVersions() {
      // return this.data.memberId && this.wkbStatus ? '' : 'no-vip';
      return this.noVip ? 'no-vip' : '';
    }
  },
  methods: {
    // 获取消费记录
    getList(row) {
      cameraFlowApi
        .getUserOrderList({
          userId: row.memberId,
          pageNo: 1,
          pageSize: 6
        })
        .then(result => {
          const data = result.data || {};
          this.consumeAmount = this.formatMoney(~~data.consumeAmount);
          this.orderTotalCount = data.totalCount || '--';
          this.list = (data.orderList || []).map(item => {
            const desc = (item.itemList || []).reduce((acc, cur, index) => {
              const oldName = acc.name ? acc.name + ';' : '';
              const count = acc.count ? acc.count + cur.itemCount : cur.itemCount;
              return {
                name: oldName + cur.itemName,
                count
              };
            }, {});
            const time = item.confirmTime || new Date().toString();
            return {
              time: utils.format(new Date(time), 'MM/DD HH:mm:ss', 8),
              name: desc.name,
              count: desc.count || 0,
              money: this.formatMoney(item.payFee)
            };
          });
        });
    },
    formatMoney(money, precision = 2) {
      return (~~money / 100).toFixed(precision);
    }
  }
};
</script>

<style lang="less" scoped>
@import '../css/base.less';
.expense-record {
  height: 100%;
}

.record-list {
  margin: 7px 0;
}

.record-item-name {
  display: inline-block;
  width: 44%;
  padding-right: 10px;
  vertical-align: bottom;
}

.record-item-count {
  display: inline-block;
  width: 10%;
}

.record-item-money {
  display: inline-block;
  width: 14%;
}

.record-item-date {
  display: inline-block;
  width: 25%;
  color: #FFF;
  text-align: right;
}
</style>
