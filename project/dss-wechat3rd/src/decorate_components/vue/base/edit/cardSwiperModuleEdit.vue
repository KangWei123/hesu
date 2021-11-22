<style lang="less">
.card-preview-container {
  display: flex;
  flex-wrap: wrap;
  margin-left: 79px;
  .card-preview {
    margin-top: 20px;
    width: 115px;
    height: 80px;
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin-right: 10px;

    .card-name {
      position: absolute;
      height: 15px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(255, 255, 255, 1);
      line-height: 15px;
      left: 10px;
      top: 8px;
    }

    .card-price {
      position: absolute;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(255, 255, 255, 1);
      bottom: 8px;
      left: 10px;
      line-height: 12px;
    }

    .card-type {
      position: absolute;
      bottom: 8px;
      right: 15px;
      height: 13px;
      font-size: 10px;
      font-family: MicrosoftYaHei;
      color: rgba(255, 255, 255, 1);
      line-height: 13px;
    }

    .com-close {
      position: absolute;
      top: 0px;
      right: 0px;
    }
  }
  .recharge-card {
    background-image: url(../../../../images/card/recharge-card.png);
  }

  .times-card {
    background-image: url(../../../../images/card/times-card.png);
  }
}
</style>


<template>

  <div>
    <div class="com-title">
      <span>卡项</span>
    </div>
    <div class="com-body">
      <size :dataSource="dataSource"></size>
      <commonEdit :dataSource="dataSource"
                  :type="type"
                  :enable-edit-nav="false"
                  nav-text="更多卡项"
                  :nav-page="linkedPages.page.MORE_CARD_PAGE"
                  @chooseList="onChooseGoods"></commonEdit>

      <div class="card-preview-container">
        <div v-for="(item, index) in computeDataList"
             :key="index"
             class="card-preview"
             :class="{'recharge-card': item.type == 4 && !item.styleUrl, 'times-card': item.type == 3 && !item.styleUrl}"
             :style="item.styleUrl | bgImage">
          <span class="card-name">
            {{item.name}}
          </span>
          <span class="card-price">
            ￥{{item.salePrice | money}}
          </span>
          <span class="card-type">
            {{computeCardType(item.type)}}
          </span>
          <i class="com-close"
             @click="deteleImage(item)"></i>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import './css/common.less';
import linkedPages from '@/dss-wechat3rd/src/constants/wxLinkPages.js';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import commonEdit from './commonEdit.vue';
import cardEnum from '@/dss-wechat3rd/src/constants/cardEnum';
import utils from '@/dss-wechat3rd/src/decorate_components/utils/index.js';
import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields.js';
import size from './size.vue';

export default {
  name: 'cardModuleEdit',
  components: {
    commonEdit,
    size
  },
  props: {
    dataSource: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      linkedPages,
      type: goodsTypeEnum.card
    };
  },

  computed: {
    computeCardType() {
      return function(type) {
        switch (type) {
          case cardEnum.cardType.timesCard:
            return '次数卡';
          case cardEnum.cardType.chargeCard:
            return '充值卡';
          default:
            return '未知卡类型';
        }
      };
    },

    computeDataList() {
      return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
    }
  },

  filters: {
    bgImage(val) {
      if (val) {
        return {
          backgroundImage: 'url(' + val + ')'
        };
      }
    },
    money(mony) {
      return !!mony ? mony / 100 : 0;
    }
  },

  methods: {
    onChooseGoods(choosedGoodsList) {
      //删除不需要的字段
      this.dataSource.data = utils.saveAvailableFields(choosedGoodsList, fields.card);
    },

    deteleImage(item) {
      utils.deteleItem(this.dataSource.data, item);
    }
  }
};
</script>

