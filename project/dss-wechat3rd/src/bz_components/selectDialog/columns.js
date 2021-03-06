import iconColumn from './column/iconColumn.vue';
import hotelTypeColumn from './column/hotelTypeColumn.vue';
import ticketTypeColumn from './column/ticketTypeColumn.vue';
import moneyColumn from './column/moneyColumn.vue';
import couponQuantityColumn from './column/couponQuantityColumn.vue';
import cardIconColumn from './column/cardIconColumn.vue';
import { groupActivityStatus, seckillActivityStatus } from '../../constants/enum';
import distcountEnum from '@/dss-wechat3rd/src/constants/distcountEnum';
import couponDateColumn from './column/couponDateColumn.vue';
import timeColumn from './column/timeColumn.vue';
import giftCardDateColumn from './column/giftCardDateColumn.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import articleStatusColumn from './column/articleStatusColumn.vue';
import couponDiscountColumn from './column/couponDiscountColumn.vue';
import timeStampColumn from './column/timeStampColumn.vue';
import giftLimitColumn from './column/giftLimitColumn.vue';
import suitStoreColumn from './column/suitStoreColumn.vue';
import LuckySuitStoreColumn from './column/lucky-suit-store-column.vue';
import giftEnum from '@/dss-wechat3rd/src/constants/giftEnum';
import activityColumn from './column/activityColumn.vue';
import haggleTypeColumn from './column/haggleTypeColumn.vue';
import storeColumn from './column/storeColumn.vue';
import statusColumn from './column/statusColumn.vue';
import shelveColumn from './column/shelveColumn.vue';
import createGroup from './column/createGroup.vue';
import minimumFeeColumn from './column/minimum-fee-column.vue';
import couponCategoryColumn from './column/coupon-category-column.vue';
import { STATUS as cardPackSTATUS, CHANNEL as cardPackCHANNEL } from '@/dss-wechat3rd/src/constants/cardPackEnum';
import kangyangTypeEnum from '@/dss-wechat3rd/src/constants/kangyangEnum';
const REQUEST_PREFIX = '/wp';
const CORAL_PREFIX = '/coral';

const propsHandler = function ({ row, col, column }) {
  const props = col.prop.split('.');
  if (props.length > 1) {
    let x = row[props[0]];
    // ????????????
    props.forEach((element, index) => {
      if (index > 0 && x) {
        x = x[element];
      }
    });
    row[col.prop] = x;
  }
  if (row[col.prop] == null) {
    row[col.prop] = '';
  }
  if (!row[col.prop] && col.default) {
    row[col.prop] = col.default;
  }
};

export default {
  product: {
    url: `${REQUEST_PREFIX}/item/queryList`,
    column: [
      {
        label: '??????',
        prop: 'itemName',
        width: 350,
        component: iconColumn,
      },
      {
        label: '??????',
        prop: 'categoryDTO.category',
        propsHandler: propsHandler,
      },
      {
        label: '??????',
        prop: 'salePrice',
        component: moneyColumn,
      },
      {
        label: '????????????',
        prop: 'itemSalesVolume',
        propsHandler: propsHandler,
      },
    ],
  },
  estate: {
    url: `${REQUEST_PREFIX}/item/queryList`,
    column: [
      {
        label: '??????',
        prop: 'itemName',
        width: 350,
        component: iconColumn,
      },
      {
        label: '??????',
        prop: 'storeName',
        propsHandler: propsHandler,
      },
      {
        label: '??????',
        prop: 'averagePrice',
        component: moneyColumn,
      },
      {
        label: '?????????',
        prop: 'recognitionOfGold',
        component: moneyColumn,
      },
    ],
  },
  server: {
    url: `${REQUEST_PREFIX}/item/queryList`,
    column: [
      {
        label: '??????',
        prop: 'itemName',
        width: 350,
        component: iconColumn,
      },
      {
        label: '??????',
        prop: 'categoryDTO.category',
        propsHandler: propsHandler,
      },
      {
        label: '??????',
        prop: 'salePrice',
        component: moneyColumn,
      },
      {
        label: '????????????',
        prop: 'itemSalesVolume',
        propsHandler: propsHandler,
      },
      // ,{
      //   label: '????????????',
      //   prop: 'itemCount',
      //   propsHandler: propsHandler
      // }
    ],
  },
  rooms: {
    url: `${REQUEST_PREFIX}/item/queryList`,
    column: [
      {
        label: '??????',
        prop: 'name',
        width: 350,
        component: iconColumn,
      },
      {
        label: '??????',
        prop: 'hotelType',
        component: hotelTypeColumn,
      },
      {
        label: '??????',
        prop: 'salePrice',
        component: moneyColumn,
      },
      {
        label: '????????????',
        prop: 'hotelAmount',
        propsHandler: propsHandler,
      },
    ],
  },
  ticket: {
    url: `${REQUEST_PREFIX}/item/queryList`,
    column: [
      {
        label: '????????????',
        prop: 'name',
        width: 350,
        component: iconColumn,
      },
      {
        label: '??????',
        prop: 'hotelType',
        component: ticketTypeColumn,
      },
      {
        label: '??????',
        prop: 'salePrice',
        component: moneyColumn,
      },
      {
        label: '????????????',
        prop: 'virtualSalesVolume',
        propsHandler: propsHandler,
      },
    ],
  },
  article: {
    url: `${REQUEST_PREFIX}/market_article/query/list`,
    hiddenFilter: true,
    showLimit: true,
    showNormalFilter: true,
    exParams: {
      // ???????????????????????????
      deleteFlag: 'N',
      status: 1,
    },
    unionKeys: ['id'],
    column: [
      {
        label: '????????????',
        prop: 'title',
        width: 350,
        component: iconColumn,
      },
      {
        label: '????????????',
        prop: 'createTime',
        component: giftCardDateColumn,
      },
      {
        label: '??????',
        prop: '',
        component: articleStatusColumn,
      },
    ],
  },
  articleClassify: {
    url: `${REQUEST_PREFIX}/article_category/query/list`,
    hiddenFilter: true,
    showLimit: false,
    showNormalFilter: false,
    exParams: {
      // ???????????????????????????
      deleteFlag: 'N',
    },
    unionKeys: ['id'],
    column: [
      {
        label: '????????????',
        prop: 'categoryName',
        width: 350,
        // component: iconColumn
      },
    ],
  },
  card: {
    url: `${REQUEST_PREFIX}/wx_item_card/query_list`,
    hiddenFilter: true,
    column: [
      {
        label: '??????',
        prop: 'itemName',
        width: 350,
        component: cardIconColumn,
      },
      {
        label: '??????',
        prop: 'typeDesc',
      },
      {
        label: '??????',
        prop: 'salePrice',
        component: moneyColumn,
      },
      {
        label: '?????????',
        prop: 'validity',
        component: timeColumn,
      },
    ],
  },
  coupon: {
    url: `${REQUEST_PREFIX}/coupon/listV2`,
    hiddenFilter: true,
    showNormalFilter: true,
    exParams: {
      // ??????????????????????????????????????????1????????????????????????????????????0????????????????????????????????????
      // fixme ?????????????????????bug853???????????????????????????????????????????????????
      couponCentreStatus: 1,
    },
    unionKeys: ['id'],
    column: [
      {
        label: '???????????????',
        prop: 'name',
        width: 150,
        propsHandler: propsHandler,
      },
      {
        label: '???????????????',
        prop: 'couponCategory',
        component: couponCategoryColumn,
      },
      {
        label: '??????????????????',
        prop: 'minimumFee',
        component: minimumFeeColumn,
      },
      {
        label: '????????????',
        prop: 'discountFee',
        component: couponDiscountColumn,
      },
      {
        label: '????????????',
        prop: 'fixedTerm',
        sortable: true,
        width: 230,
        component: couponDateColumn,
      },
      {
        label: '??????',
        prop: 'quantity',
        sortable: true,
        width: 100,
        component: couponQuantityColumn,
      },
    ],
  },
  seckill: {
    // ??????????????????
    url: `${REQUEST_PREFIX}/seckill/list`,
    hiddenFilter: true,
    showNormalFilter: true,
    exParams: {
      statusList: seckillActivityStatus.NOT_STARTED + ',' + seckillActivityStatus.ON_GOING,
    },
    unionKeys: ['id'],
    column: [
      {
        label: '??????',
        prop: 'name',
        width: 150,
        component: iconColumn,
      },
      {
        label: '????????????',
        prop: 'activityLevel',
        component: activityColumn,
      },
      {
        label: '????????????',
        prop: 'storeBriefVOS',
        component: storeColumn,
      },
      {
        label: '?????????',
        prop: 'priceRange',
        propsHandler: propsHandler,
      },
      {
        label: '??????',
        prop: 'peopleLimitAmount',
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'startTime',
        width: 130,
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'endTime',
        width: 130,
        propsHandler: propsHandler,
      },
    ],
  },
  haggle: {
    url: `${REQUEST_PREFIX}/bargain/activity/manage/listV2`,
    unionKeys: ['id'],
    hiddenFilter: true,
    showNormalFilter: true,
    exParams: {
      status: null,
    },
    column: [
      {
        label: '??????',
        prop: 'itemName',
        width: 150,
        component: iconColumn,
      },
      {
        label: '????????????',
        prop: 'createStoreId',
        component: haggleTypeColumn,
      },
      {
        label: '????????????',
        prop: 'storeBriefVOS',
        'show-overflow-tooltip': true,
        component: suitStoreColumn,
      },
      {
        label: '??????',
        prop: 'salePrice',
        component: moneyColumn,
      },
      {
        label: '???????????????',
        prop: 'lowestPrice',
        component: moneyColumn,
      },
      {
        label: '??????????????????',
        prop: 'bargainDuration',
        width: 150,
        propsHandler: propsHandler,
      },
    ],
  },

  gift: {
    url: `${REQUEST_PREFIX}/gift_activity/listActivity`,
    unionKeys: ['id'],
    exParams: {
      inStatusList: [giftEnum.status.pending, giftEnum.status.going],
    },
    hiddenFilter: true,
    column: [
      {
        label: '??????',
        prop: 'name',
        width: 350,
        component: iconColumn,
      },
      {
        label: '????????????',
        prop: 'startTime',
        width: 150,
        component: timeStampColumn,
      },
      {
        label: '????????????',
        prop: 'endTime',
        width: 150,
        component: timeStampColumn,
      },
      {
        label: '????????????',
        prop: 'levelName',
        width: 150,
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'limitTotal',
        component: giftLimitColumn,
      },
    ],
  },

  'card-pack': {
    url: `${REQUEST_PREFIX}/couponpocket/query`,
    unionKeys: ['id'],
    exParams: {
      channel: cardPackCHANNEL.REGION.value,
      'statusList[0]': cardPackSTATUS.INITIAL.value,
      'statusList[1]': cardPackSTATUS.ONGOING.value,
      'statusList[2]': cardPackSTATUS.SELL_OUT.value,
    },
    hiddenFilter: true,
    showNormalFilter: true,
    column: [
      {
        label: '????????????',
        prop: 'name',
        component: iconColumn,
      },
      {
        label: '????????????',
        prop: 'startTime',
        width: 130,
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'endTime',
        width: 130,
        propsHandler: propsHandler,
      },
      {
        label: '??????',
        prop: 'salePrice',
        component: moneyColumn,
      },
      {
        label: '??????',
        prop: 'provNum',
        default: '?????????',
        propsHandler: propsHandler,
      },
      {
        label: '???????????????',
        prop: 'cardSalesVolume',
        default: '0',
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'storeNames',
        'show-overflow-tooltip': true,
        component: suitStoreColumn,
      },
    ],
  },
  'micro-decorate': {
    url: `${REQUEST_PREFIX}/scenemodel/list`,
    unionKeys: ['id'],
    exParams: {
      status: 1,
      isShelf: 1,
      decorateFlg: 1,
    },
    showNormalFilter: true,
    hiddenFilter: true,
    column: [
      {
        label: '??????',
        prop: 'name',
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'appointmentNum',
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'viewNum',
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'approvalNum',
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        'show-overflow-tooltip': true,
        component: createGroup,
      },
    ],
  },
  // ????????????
  ebooks: {
    url: `${REQUEST_PREFIX}/picture_album/query/list`,
    unionKeys: ['id'],
    hiddenFilter: true,
    exParams: {
      // ???????????????????????????
      albumStatus: 1,
    },
    column: [
      {
        label: '????????????',
        prop: 'title',
        propsHandler: propsHandler,
      },

      {
        label: '????????????',
        prop: 'updateTime',
        propsHandler: propsHandler,
      },
      {
        label: '??????',
        prop: 'albumStatus',
        component: shelveColumn,
      },
      // {
      //   label: '????????????',
      //   prop: 'shareCount',
      //   propsHandler: propsHandler
      // }
    ],
  },
  integral: {
    url: `${REQUEST_PREFIX}/integral/shop/query/list`,
    hiddenFilter: true,
    exParams: {
      status: 1,
      needSkuList: true,
    },
    unionKeys: ['id'],
    column: [
      {
        label: '??????',
        prop: 'name',
        width: 350,
        component: iconColumn,
      },
      {
        label: '????????????',
        prop: 'fixedTerm',
        sortable: true,
        width: 250,
        component: couponDateColumn,
      },
      {
        label: '????????????',
        prop: 'exchangeRestrict',
        sortable: true,
        propsHandler: propsHandler,
      },
    ],
  },

  group: {
    url: `${REQUEST_PREFIX}/pt/listV2`,
    hiddenFilter: true,
    showNormalFilter: true,
    exParams: {
      // status: groupActivityStatus.SHELF,
      status: null,
    },
    unionKeys: ['id'],
    column: [
      {
        label: '??????',
        prop: 'itemName',
        width: 150,
        component: iconColumn,
      },
      {
        label: '????????????',
        prop: 'activityLevel',
        component: activityColumn,
      },
      {
        label: '????????????',
        prop: 'storeBriefVOS',
        component: storeColumn,
      },
      {
        label: '????????????',
        prop: 'people',
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'priceRange',
        propsHandler: propsHandler,
      },
      {
        label: '??????',
        prop: 'labelPrice',
        component: moneyColumn,
      },
      {
        label: '????????????',
        prop: 'actualCount',
        propsHandler: propsHandler,
      },
    ],
  },
  giftCard: {
    url: `${REQUEST_PREFIX}/item/gift_card/theme/select`,
    hiddenFilter: true,
    exParams: {
      status: groupActivityStatus.SHELF,
    },
    unionKeys: ['id'],
    column: [
      {
        label: '??????',
        prop: 'itemName',
        width: 350,
        component: iconColumn,
      },
      {
        label: '????????????',
        prop: 'createTime',
        component: giftCardDateColumn,
      },
      {
        label: '????????????',
        prop: 'updateTime',
        component: giftCardDateColumn,
      },
    ],
  },
  activity: {
    url: `${REQUEST_PREFIX}/topic_activity/list`,
    hiddenFilter: true,
    exParams: {
      status: groupActivityStatus.SHELF,
    },
    unionKeys: ['topicId'],
    column: [
      {
        label: '??????',
        prop: 'topicName',
        width: 250,
        component: iconColumn,
      },
      {
        label: '????????????',
        prop: 'createTime',
        component: giftCardDateColumn,
      },
    ],
  },
  category: {
    url: `${REQUEST_PREFIX}/item/query/app/category`,
    hiddenFilter: true,
    exParams: {
      itemType: goodsTypeEnum.product.value,
    },
    unionKeys: ['id'],
    column: [
      {
        label: '????????????',
        prop: 'category',
        width: 510,
        propsHandler: propsHandler,
      },
    ],
  },
  'server-category': {
    url: `${REQUEST_PREFIX}/item/query/app/category`,
    hiddenFilter: true,
    exParams: {
      itemType: goodsTypeEnum.server.value,
    },
    unionKeys: ['id'],
    column: [
      {
        label: '????????????',
        prop: 'category',
        width: 510,
        propsHandler: propsHandler,
      },
    ],
  },
  lucky: {
    // ??????????????????
    url: `${REQUEST_PREFIX}/lucky_turning/query_list_new?activityScenario=0`,
    hiddenFilter: true,
    showNormalFilter: true,
    exParams: {
      // ?????????????????????????????????
      deleteFlag: 'N',
      // ???????????????????????????
      // statusList: '0,1,2,3'
      activityStatus: '0,1,2,3',
    },
    unionKeys: ['id'],
    column: [
      {
        label: '??????',
        prop: 'activityName',
        width: 200,
        component: iconColumn,
      },
      {
        label: '????????????',
        prop: 'storeNameList',
        'show-overflow-tooltip': true,
        component: LuckySuitStoreColumn,
      },
      {
        label: '????????????',
        prop: 'activityStartTime',
        // component: iconColumn
      },
      {
        label: '????????????',
        prop: 'activityEndTime',
        // component: iconColumn
      },
    ],
  },
  luckyDial: {
    // ??????????????????
    url: `${REQUEST_PREFIX}/lucky_turning/query_list_new`,
    hiddenFilter: true,
    exParams: {
      deleteFlag: 'N',
      statusList: '0,1,2,3',
      activityScenario: 0,
      activityStatus: '0,1,2,3',
    },
    unionKeys: ['id'],
    column: [
      {
        label: '??????',
        prop: 'activityName',
        width: 200,
        component: iconColumn,
      },
      {
        label: '????????????',
        prop: 'activityStartTime',
        width: 150,
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'activityEndTime',
        width: 150,
        propsHandler: propsHandler,
      },
    ],
  },
  formTool: {
    // ??????
    url: `/am/questionnaire/list`,
    requestMethod: 'post',
    hiddenFilter: true,
    unionKeys: ['id'],
    column: [
      {
        label: '????????????',
        prop: 'name',
        width: 200,
        component: iconColumn,
      },
      {
        label: '?????????',
        prop: 'totalSubmitNum',
        // propsHandler: propsHandler
      },
    ],
  },
  promotion: {
    url: `${REQUEST_PREFIX}/much_buy/more_discount/getList`,
    showNormalFilter: false,
    exParams: {
      statusList: distcountEnum.ActivityStatus.NOT_STARTED + ',' + distcountEnum.ActivityStatus.ON_GOING,
    },
    unionKeys: ['id'],
    column: [
      {
        label: '????????????',
        prop: 'name',
        width: 300,
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'ruleName',
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'startTime',
        width: 150,
        component: timeStampColumn,
      },
      {
        label: '????????????',
        prop: 'endTime',
        width: 150,
        component: timeStampColumn,
      },
      {
        label: '??????',
        prop: 'status',
        width: 100,
        component: statusColumn,
      },
    ],
  },
  equityGoods: {
    url: `${CORAL_PREFIX}/b/item/list`,
    requestMethod: 'post',
    hiddenFilter: true,
    showNormalFilter: true,
    exParams: {
      status: 1,
    },
    unionKeys: ['mid'],
    column: [
      {
        label: '??????ID',
        prop: 'mid',
        width: 300,
        propsHandler: propsHandler,
      },
      {
        label: '?????????',
        prop: 'name',
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'pointCost',
        propsHandler: propsHandler,
      },
      {
        label: '?????????',
        prop: 'count',
        propsHandler: propsHandler,
      },
    ],
  },
  scoreActivity: {
    url: `${CORAL_PREFIX}/b/activity/list`,
    requestMethod: 'post',
    hiddenFilter: true,
    showNormalFilter: true,
    exParams: {
      status: 1,
    },
    unionKeys: ['activityId'],
    column: [
      {
        label: '??????ID',
        prop: 'activityId',
        width: 300,
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'title',
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'activityCategory',
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'activityTemplateName',
        propsHandler: propsHandler,
      },
    ],
  },
  scoreTask: {
    url: `${CORAL_PREFIX}/b/activity/list`,
    requestMethod: 'post',
    hiddenFilter: true,
    showNormalFilter: true,
    exParams: {
      status: 1,
    },
    unionKeys: ['activityId'],
    column: [
      {
        label: '??????ID',
        prop: 'activityId',
        width: 300,
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'title',
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'pointCost',
        propsHandler: propsHandler,
      },
      {
        label: '????????????',
        prop: 'activityTemplateId',
        propsHandler: propsHandler,
      },
    ],
  },
  'kangyang-project': {
    // ????????????
    url: `/ky/prj/info/page`,
    requestMethod: 'post',
    hiddenFilter: true,
    column: [
      {
        label: '??????',
        prop: 'prjName',
      },
      {
        label: '??????',
        prop: 'prjNo',
      },
      {
        label: '??????',
        component: {
          functional: true,
          props: ['row'],
          render(h, ctx) {
            return h('span', ctx.data, `${ctx.props.row.lessPrice}-${ctx.props.row.maxPrice}/???/???/???`);
          },
        },
      },
      {
        label: '????????????',
        component: {
          functional: true,
          props: ['row'],
          render(h, ctx) {
            return h('span', ctx.data, kangyangTypeEnum.ProjectStateTypeName[ctx.props.row.state]);
          },
        },
      },
    ],
  },
  'kangyang-activity': {
    // ????????????
    url: '/ky/web/activity/page',
    requestMethod: 'post',
    hiddenFilter: true,
    showNormalFilter: true,
    filterList: [
      {
        type: 'input',
        paramName: 'name',
        label: '????????????',
      },
      {
        type: 'input',
        paramName: 'typeId',
        label: '????????????',
      },
    ],
    column: [
      {
        label: '??????',
        prop: 'name',
      },
      {
        label: '??????',
        prop: 'code',
      },
      {
        label: '??????',
        component: {
          functional: true,
          props: ['row'],
          render(h, ctx) {
            return h(
              'span',
              ctx.data,
              ctx.props.row.status === kangyangTypeEnum.ActivityStatus.Pending ? '?????????' : '?????????'
            );
          },
        },
      },
    ],
  },
  merchant: {
    url: `/mall/b/tenant/queryList`,
    hiddenFilter: true,
    showNormalFilter: true,
    requestMethod: 'post',
    unionKeys: ['id'],
    column: [
      {
        label: '????????????',
        prop: 'code',
      },
      {
        label: '?????????',
        prop: 'name',
        component: iconColumn,
      },
      {
        label: '????????????',
        prop: 'storeName',
      },
      {
        label: '????????????',
        prop: 'tenantCategoryName',
        propsHandler: propsHandler,
      },
    ],
  },
  'merchant-category': {
    url: `/mall/b/tenant/category/queryList`,
    hiddenFilter: true,
    requestMethod: 'post',
    // exParams: {
    //   itemType: goodsTypeEnum.product.value,
    // },
    unionKeys: ['id'],
    column: [
      {
        label: '??????????????????',
        prop: 'categoryName',
        width: 510,
        propsHandler: propsHandler,
      },
    ],
  },
};
