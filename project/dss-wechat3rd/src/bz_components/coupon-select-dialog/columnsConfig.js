import Handler from '@/dss-wechat3rd/src/components/table-select-dialog/handler.js';
import NumColomn from './num-column.vue';
import ExpireTimeColumn from './expire-time-column.vue';
import ReceiveMethodColumn from './receive-method-column.vue';
import DiscountColumn from './discount-column.vue';
import useScope from './use-scope.vue';
import memberRestrict from './member-restrict.vue';
import PriceColumn from '@/dss-wechat3rd/src/components/table-select-dialog/common-component/priceColumn.vue';
import suitGoods from './suit-goods.vue';
import SuitStoreColumn from './suit-store-column.vue';

export default {
  default: [
    {
      prop: 'name',
      label: '名称',
      propsHandler: Handler.propsHanler
    },

    {
      prop: 'discountFee',
      label: '优惠券面值',
      component: DiscountColumn
    },

    {
      prop: 'minimumFee',
      label: '最低消费金额',
      component: PriceColumn
    },

    {
      prop: 'fixedTerm',
      label: '有效期',
      component: ExpireTimeColumn
    },

    {
      prop: 'quantity',
      label: '数量',
      component: NumColomn
    },
    {
      prop: 'receiveMethod',
      label: '领取方式',
      component: ReceiveMethodColumn
    }
  ],
  'card-pack': [
    {
      prop: 'name',
      label: '名称',
      propsHandler: Handler.propsHanler
    },

    {
      prop: 'discountFee',
      label: '优惠券面值',
      width: '120px',
      component: DiscountColumn
    },

    {
      prop: 'minimumFee',
      label: '最低消费金额',
      width: '150px',
      component: PriceColumn
    },

    {
      prop: 'fixedTerm',
      label: '有效期',
      component: ExpireTimeColumn
    },

    {
      prop: 'memberRestrictType',
      label: '使用人群',
      component: memberRestrict
    },

    {
      prop: 'useScopeType',
      label: '使用场景',
      component: useScope
    },

    {
      prop: 'suitItemType',
      label: '可用商品',
      'show-overflow-tooltip': true,
      component: suitGoods
    }
  ],
  lucky: [
    {
      prop: 'name',
      label: '名称',
      propsHandler: Handler.propsHanler
    },

    {
      prop: 'discountFee',
      label: '优惠券面值',
      component: DiscountColumn
    },

    {
      prop: 'minimumFee',
      label: '最低消费金额',
      component: PriceColumn
    },

    {
      prop: 'fixedTerm',
      label: '有效期',
      component: ExpireTimeColumn
    },

    {
      prop: 'quantity',
      label: '数量',
      component: NumColomn
    },
    {
      prop: 'receiveMethod',
      label: '领取方式',
      component: ReceiveMethodColumn
    },
    {
      prop: 'storeNameList',
      label: '参与门店',
      'show-overflow-tooltip': true,
      component: SuitStoreColumn
    }
  ]
};
