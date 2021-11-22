<template>
  <div class="expense-record blue-shadow-box" :class="showVersions">
    <!-- v-if="!noVip" -->
    <div class="box-title">
      <div>消费记录</div>
    </div>
    <transition-group class="record-list" name="vuelist" tag="div">
      <div class="record-item" v-for="(item, index) in list" :key="index">
        <span class="record-item-name hidden-over">
          <span v-if="(item.tag2 & tag2Enum.qrCode) === tag2Enum.qrCode" class="tag">扫码购</span>
          <span v-else-if="(item.tag2 & tag2Enum.pos) === tag2Enum.pos" class="tag-pos">POS</span>
          <span v-else :class="['tag-app', getSourceClass(item)]">{{ getSource(item) }}</span>
          <span>{{ item.name }}</span>
        </span>
        <span class="record-item-count">x{{ item.count }}</span>
        <span class="record-item-money">￥{{ item.money }}</span>
        <span class="record-item-date">{{ item.time }}</span>
      </div>
    </transition-group>
    <div class="no-data" v-show="list && !list.length">暂无消费记录</div>
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
        },
      },
      wkbStatus: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        list: [],
        consumeAmount: '',
        orderTotalCount: '--',
        tag2Enum: {
          pos: 1 << 5,
          qrCode: 1 << 7,
        },
      };
    },
    watch: {
      data(val, oldVal) {
        if (val && val.memberId) {
          this.getList(val);
        } else {
          this.list = [];
        }
      },
    },
    computed: {
      noVip() {
        console.log(!(this.data.memberId && this.wkbStatus));
        return !(this.data.memberId && this.wkbStatus);
      },
      showVersions() {
        // return this.data.memberId && this.wkbStatus ? '' : 'no-vip';
        return this.noVip ? 'no-vip' : '';
      },
    },
    methods: {
      // 获取消费记录
      getList(row) {
        cameraFlowApi
          .getUserOrderList({
            userId: row.memberId,
            pageNo: 1,
            pageSize: 6,
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
                  count,
                };
              }, {});
              const time = item.orderTime || new Date().toString();

              return {
                time: utils.format(new Date(time), 'MM/DD HH:mm:ss', 8),
                name: desc.name,
                count: desc.count || 0,
                money: this.formatMoney(item.payFee),
                tag2: item.tag2,
                payType: item.payType,
              };
            });
          });
      },
      formatMoney(money, precision = 2) {
        return (~~money / 100).toFixed(precision);
      },

      getSourceClass(item) {
        console.log(item);
        let className = '';
        switch (item.payType) {
          case 1:
            className = 'tag-wx';
            break;
          case 2:
            className = 'tag-oa';
            break;
          case 3:
            className = 'tag-h5';
            break;
          case 10:
            className = 'tag-tt';
            break;
          case 11:
            className = 'tag-dy';
            break;
          case 12:
            className = 'tag-tt';
            break;
          default:
            className = 'tag-wx';
        }
        return className;
      },

      getSource(item) {
        let text = '';
        switch (item.payType) {
          case 1:
            text = '微信小程序';
            break;
          case 2:
            text = '公众号';
            break;
          case 3:
            text = 'H5';
            break;
          case 10:
            text = '字节小程序';
            break;
          case 11:
            text = '抖音小程序';
            break;
          case 12:
            text = '头条小程序';
            break;
          default:
            text = '微信小程序';
        }
        return text;
      },
    },
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

  .tag {
    box-sizing: border-box;
    display: inline-block;
    width: 72px;
    height: 20px;
    line-height: 20px;
    border: 1px solid #0cf;
    border-radius: 5px;
    color: #0cf;
    font-size: 12px;
    text-align: center;
    background: rgba(0, 204, 255, 0.2);
    margin-right: 9px;
  }

  .tag-pos {
    box-sizing: border-box;
    display: inline-block;
    width: 72px;
    height: 20px;
    line-height: 20px;
    border: 1px solid #00e98f;
    border-radius: 5px;
    color: #00e98f;
    font-size: 12px;
    text-align: center;
    background: rgba(0, 233, 143, 0.2);
    margin-right: 9px;
  }

  .tag-app {
    box-sizing: border-box;
    display: inline-block;
    width: 72px;
    height: 20px;
    line-height: 20px;
    border: 1px solid #ff8e7c;
    border-radius: 5px;
    color: #ff8e7c;
    font-size: 12px;
    text-align: center;
    background: rgba(255, 142, 124, 0.2);
    margin-right: 9px;
  }

  .tag-wx {
    border: 1px solid #ff7c7c;
    color: #ff7b7b;
    background: rgba(255, 124, 124, 0.2);
  }

  .tag-tt {
    border: 1px solid #dcc670;
    color: #dcc670;
    background: rgba(220, 198, 112, 0.2);
  }

  .tag-h5 {
    border: 1px solid #a3c5ff;
    color: #a3c5ff;
    background: rgba(163, 197, 255, 0.2);
  }

  .tag-oa {
    border: 1px solid #c69cff;
    color: #c69cff;
    background: rgba(198, 156, 255, 0.2);
  }

  .tag-dy {
    border: 1px solid #ff9a50;
    color: #ff9a50;
    background: rgba(255, 154, 80, 0.2);
  }

  .record-item {
    padding-left: 20px;
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
    color: #fff;
    text-align: right;
  }
</style>
