<template>
  <div class="recommend blue-shadow-box"> 
       <!-- v-if="!noVip" -->
    <div class="box-title">
      <div>智能推荐</div>
    </div>
    <div class="recommend-list">
      <div class="recommend-item gradual-bg"
           v-for="(item, index) in list"
           :key="index">
         <img class="recommend-item-logo"
              :src="item.pic"
              alt>
        <div class="recommend-item-detail">
          <span class="recommend-item-name hidden-over">{{item.name}}</span>
          <span class="recommend-item-money">
            <span>￥</span>
            {{item.price}}
          </span>
        </div>
      </div>
    </div>
    <div class="no-data"
            v-show="list && !list.length">暂无推荐</div>
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
      return !(this.data.memberId && this.wkbStatus);
    },
  },
  methods: {
    getList(row) {
      cameraFlowApi
        .getRecommendList({
          memberId: row.memberId,
          pageSize: 3
        })
        .then(result => {
          const wxItemDetailList = (result.data || {}).wxItemDetailList;
          this.list = (wxItemDetailList || []).map(item => {
            const { wxItem = {} } = item;
            return {
              pic: wxItem.thumbnail,
              price: this.formatMoney(wxItem.salePrice),
              name: wxItem.name || '--'
            };
          });
        })
        .always(_ => {});
    },
    formatMoney(money, precision = 2) {
      return (~~money / 100).toFixed(precision);
    },
  }
};
</script>

<style lang="less" scoped>
@import '../css/base.less';
.recommend {
  height: 100%;
}
.recommend-list {
  margin: 16px 27px;
  .recommend-item {
    width: 113px;
    height: 127px;
    border-radius: 2px;
    padding: 7px 18px;
    box-sizing: border-box;
    display: inline-block;
    margin-left: 7px;
    .recommend-item-logo {
      height: 78px;
      width: 78px;
    }
    .recommend-item-detail {
      font-size: 0;
    }
    .recommend-item-name {
      color: @font-blue;
      display: inline-block;
      width: 100%;
      font-size: 13px;
      line-height: 25px;
    }
    .recommend-item-money {
      font-size: 13px;
      line-height: 13px;
      display: inline-block;
      width: 100%;
      color: #FFF;
    }
  }
}
</style>
