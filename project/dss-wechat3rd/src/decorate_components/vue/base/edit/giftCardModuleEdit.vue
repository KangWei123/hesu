<template>
  <div>
    <!-- <div class="com-title">
      <span>卡项</span>
    </div> -->
    <edit-header :data-source="dataSource" name="礼品卡"></edit-header>

    <div class="com-body">
      <size :data-source="dataSource"></size>
      <commonEdit
        :data-source="dataSource"
        :type="type"
        :enable-edit-nav="false"
        nav-text="礼品卡商城"
        :nav-page="linkedPages.page.MORE_GIFT_CARD_PAGE"
        @chooseList="onChooseGoods"
      ></commonEdit>
      <div class="gift-card-preview-container">
        <div
          v-for="(item, index) in dataSource.data"
          :key="index"
          class="card-preview"
          :style="item.bgImg | bgImage"
          :draggable="true"
        >
          <i class="com-close" @click="deteleImage(item)"></i>
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
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index.js';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields.js';
  import size from './size.vue';
  import drag from './drag.js';
  import EditHeader from './edit-header.vue';

  export default {
    name: 'RiftCardModuleEdit',
    components: {
      commonEdit,
      size,
      EditHeader,
    },
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        linkedPages,
        type: goodsTypeEnum.giftCard,
      };
    },

    filters: {
      bgImage(val) {
        if (val) {
          return {
            backgroundImage: 'url(' + val + ')',
          };
        }
      },
    },

    watch: {
      'dataSource.data': {
        deep: true,
        handler(newVal, oldVal) {
          drag.list = this.dataSource.data;
        },
      },
    },

    mounted() {
      // 绑定拖拽容器，绑定拖拽事件
      const node = document.querySelector('.gift-card-preview-container');
      node.ondragstart = drag.ondragstart;
      node.ondragover = drag.ondragover;
      drag.list = this.dataSource.data;
      drag.nodeClassName = 'card-preview';
    },

    methods: {
      onChooseGoods(choosedGoodsList) {
        // 删除不需要的字段
        this.dataSource.data = utils.saveAvailableFields(choosedGoodsList, fields.giftCard);
      },

      deteleImage(item) {
        utils.deteleItem(this.dataSource.data, item);
      },
    },
  };
</script>

<style lang="less">
  .gift-card-preview-container {
    display: flex;
    flex-wrap: wrap;
    margin-left: 75px;

    .card-preview {
      margin-top: 10px;
      width: 75px;
      height: 75px;
      position: relative;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      margin-right: 4px;

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
        top: 0;
        right: 0;
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
