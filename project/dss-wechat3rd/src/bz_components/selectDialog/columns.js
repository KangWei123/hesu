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
    // 多层遍历
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
        label: '名称',
        prop: 'itemName',
        width: 350,
        component: iconColumn,
      },
      {
        label: '分类',
        prop: 'categoryDTO.category',
        propsHandler: propsHandler,
      },
      {
        label: '售价',
        prop: 'salePrice',
        component: moneyColumn,
      },
      {
        label: '实际销量',
        prop: 'itemSalesVolume',
        propsHandler: propsHandler,
      },
    ],
  },
  estate: {
    url: `${REQUEST_PREFIX}/item/queryList`,
    column: [
      {
        label: '名称',
        prop: 'itemName',
        width: 350,
        component: iconColumn,
      },
      {
        label: '区域',
        prop: 'storeName',
        propsHandler: propsHandler,
      },
      {
        label: '均价',
        prop: 'averagePrice',
        component: moneyColumn,
      },
      {
        label: '认筹金',
        prop: 'recognitionOfGold',
        component: moneyColumn,
      },
    ],
  },
  server: {
    url: `${REQUEST_PREFIX}/item/queryList`,
    column: [
      {
        label: '名称',
        prop: 'itemName',
        width: 350,
        component: iconColumn,
      },
      {
        label: '分类',
        prop: 'categoryDTO.category',
        propsHandler: propsHandler,
      },
      {
        label: '售价',
        prop: 'salePrice',
        component: moneyColumn,
      },
      {
        label: '实际销量',
        prop: 'itemSalesVolume',
        propsHandler: propsHandler,
      },
      // ,{
      //   label: '可用库存',
      //   prop: 'itemCount',
      //   propsHandler: propsHandler
      // }
    ],
  },
  rooms: {
    url: `${REQUEST_PREFIX}/item/queryList`,
    column: [
      {
        label: '房型',
        prop: 'name',
        width: 350,
        component: iconColumn,
      },
      {
        label: '分类',
        prop: 'hotelType',
        component: hotelTypeColumn,
      },
      {
        label: '售价',
        prop: 'salePrice',
        component: moneyColumn,
      },
      {
        label: '房间数量',
        prop: 'hotelAmount',
        propsHandler: propsHandler,
      },
    ],
  },
  ticket: {
    url: `${REQUEST_PREFIX}/item/queryList`,
    column: [
      {
        label: '门票名称',
        prop: 'name',
        width: 350,
        component: iconColumn,
      },
      {
        label: '类型',
        prop: 'hotelType',
        component: ticketTypeColumn,
      },
      {
        label: '售价',
        prop: 'salePrice',
        component: moneyColumn,
      },
      {
        label: '真实销量',
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
      // 只展示已上架的文章
      deleteFlag: 'N',
      status: 1,
    },
    unionKeys: ['id'],
    column: [
      {
        label: '文章标题',
        prop: 'title',
        width: 350,
        component: iconColumn,
      },
      {
        label: '更新时间',
        prop: 'createTime',
        component: giftCardDateColumn,
      },
      {
        label: '状态',
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
      // 只展示已上架的文章
      deleteFlag: 'N',
    },
    unionKeys: ['id'],
    column: [
      {
        label: '分类名称',
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
        label: '名称',
        prop: 'itemName',
        width: 350,
        component: cardIconColumn,
      },
      {
        label: '类型',
        prop: 'typeDesc',
      },
      {
        label: '售价',
        prop: 'salePrice',
        component: moneyColumn,
      },
      {
        label: '有效期',
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
      // 只显示放入领券中心的优惠券，1：放入领券中心的优惠券，0：不放入领券中心的优惠券
      // fixme 修复自定义页面bug853：不放入领券中心的优惠券不应该显示
      couponCentreStatus: 1,
    },
    unionKeys: ['id'],
    column: [
      {
        label: '优惠券名称',
        prop: 'name',
        width: 150,
        propsHandler: propsHandler,
      },
      {
        label: '优惠券类型',
        prop: 'couponCategory',
        component: couponCategoryColumn,
      },
      {
        label: '最低消费金额',
        prop: 'minimumFee',
        component: minimumFeeColumn,
      },
      {
        label: '优惠面值',
        prop: 'discountFee',
        component: couponDiscountColumn,
      },
      {
        label: '有效时间',
        prop: 'fixedTerm',
        sortable: true,
        width: 230,
        component: couponDateColumn,
      },
      {
        label: '总量',
        prop: 'quantity',
        sortable: true,
        width: 100,
        component: couponQuantityColumn,
      },
    ],
  },
  seckill: {
    // 秒杀活动列表
    url: `${REQUEST_PREFIX}/seckill/list`,
    hiddenFilter: true,
    showNormalFilter: true,
    exParams: {
      statusList: seckillActivityStatus.NOT_STARTED + ',' + seckillActivityStatus.ON_GOING,
    },
    unionKeys: ['id'],
    column: [
      {
        label: '名称',
        prop: 'name',
        width: 150,
        component: iconColumn,
      },
      {
        label: '活动类型',
        prop: 'activityLevel',
        component: activityColumn,
      },
      {
        label: '参与门店',
        prop: 'storeBriefVOS',
        component: storeColumn,
      },
      {
        label: '秒杀价',
        prop: 'priceRange',
        propsHandler: propsHandler,
      },
      {
        label: '限购',
        prop: 'peopleLimitAmount',
        propsHandler: propsHandler,
      },
      {
        label: '开始时间',
        prop: 'startTime',
        width: 130,
        propsHandler: propsHandler,
      },
      {
        label: '结束时间',
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
        label: '名称',
        prop: 'itemName',
        width: 150,
        component: iconColumn,
      },
      {
        label: '活动类型',
        prop: 'createStoreId',
        component: haggleTypeColumn,
      },
      {
        label: '参与门店',
        prop: 'storeBriefVOS',
        'show-overflow-tooltip': true,
        component: suitStoreColumn,
      },
      {
        label: '售价',
        prop: 'salePrice',
        component: moneyColumn,
      },
      {
        label: '可砍最低价',
        prop: 'lowestPrice',
        component: moneyColumn,
      },
      {
        label: '发起砍价次数',
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
        label: '名称',
        prop: 'name',
        width: 350,
        component: iconColumn,
      },
      {
        label: '开始时间',
        prop: 'startTime',
        width: 150,
        component: timeStampColumn,
      },
      {
        label: '结束时间',
        prop: 'endTime',
        width: 150,
        component: timeStampColumn,
      },
      {
        label: '限领人群',
        prop: 'levelName',
        width: 150,
        propsHandler: propsHandler,
      },
      {
        label: '限领总数',
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
        label: '卡包名称',
        prop: 'name',
        component: iconColumn,
      },
      {
        label: '开始时间',
        prop: 'startTime',
        width: 130,
        propsHandler: propsHandler,
      },
      {
        label: '结束时间',
        prop: 'endTime',
        width: 130,
        propsHandler: propsHandler,
      },
      {
        label: '售价',
        prop: 'salePrice',
        component: moneyColumn,
      },
      {
        label: '数量',
        prop: 'provNum',
        default: '无限制',
        propsHandler: propsHandler,
      },
      {
        label: '已售出数量',
        prop: 'cardSalesVolume',
        default: '0',
        propsHandler: propsHandler,
      },
      {
        label: '活动门店',
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
        label: '名称',
        prop: 'name',
        propsHandler: propsHandler,
      },
      {
        label: '预约人数',
        prop: 'appointmentNum',
        propsHandler: propsHandler,
      },
      {
        label: '浏览人数',
        prop: 'viewNum',
        propsHandler: propsHandler,
      },
      {
        label: '点赞人数',
        prop: 'approvalNum',
        propsHandler: propsHandler,
      },
      {
        label: '创建组织',
        'show-overflow-tooltip': true,
        component: createGroup,
      },
    ],
  },
  // 电子画册
  ebooks: {
    url: `${REQUEST_PREFIX}/picture_album/query/list`,
    unionKeys: ['id'],
    hiddenFilter: true,
    exParams: {
      // 只展示已上架的画册
      albumStatus: 1,
    },
    column: [
      {
        label: '画册名称',
        prop: 'title',
        propsHandler: propsHandler,
      },

      {
        label: '更新时间',
        prop: 'updateTime',
        propsHandler: propsHandler,
      },
      {
        label: '状态',
        prop: 'albumStatus',
        component: shelveColumn,
      },
      // {
      //   label: '分享数量',
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
        label: '名称',
        prop: 'name',
        width: 350,
        component: iconColumn,
      },
      {
        label: '有效时间',
        prop: 'fixedTerm',
        sortable: true,
        width: 250,
        component: couponDateColumn,
      },
      {
        label: '兑换限制',
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
        label: '名称',
        prop: 'itemName',
        width: 150,
        component: iconColumn,
      },
      {
        label: '活动类型',
        prop: 'activityLevel',
        component: activityColumn,
      },
      {
        label: '参与门店',
        prop: 'storeBriefVOS',
        component: storeColumn,
      },
      {
        label: '拼团人数',
        prop: 'people',
        propsHandler: propsHandler,
      },
      {
        label: '团购价格',
        prop: 'priceRange',
        propsHandler: propsHandler,
      },
      {
        label: '原价',
        prop: 'labelPrice',
        component: moneyColumn,
      },
      {
        label: '真实销量',
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
        label: '名称',
        prop: 'itemName',
        width: 350,
        component: iconColumn,
      },
      {
        label: '创建时间',
        prop: 'createTime',
        component: giftCardDateColumn,
      },
      {
        label: '更新时间',
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
        label: '名称',
        prop: 'topicName',
        width: 250,
        component: iconColumn,
      },
      {
        label: '创建时间',
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
        label: '分类名称',
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
        label: '分类名称',
        prop: 'category',
        width: 510,
        propsHandler: propsHandler,
      },
    ],
  },
  lucky: {
    // 首页转盘列表
    url: `${REQUEST_PREFIX}/lucky_turning/query_list_new?activityScenario=0`,
    hiddenFilter: true,
    showNormalFilter: true,
    exParams: {
      // 已删除的营销图文不显示
      deleteFlag: 'N',
      // 只查询已开始的活动
      // statusList: '0,1,2,3'
      activityStatus: '0,1,2,3',
    },
    unionKeys: ['id'],
    column: [
      {
        label: '名称',
        prop: 'activityName',
        width: 200,
        component: iconColumn,
      },
      {
        label: '参与门店',
        prop: 'storeNameList',
        'show-overflow-tooltip': true,
        component: LuckySuitStoreColumn,
      },
      {
        label: '开始时间',
        prop: 'activityStartTime',
        // component: iconColumn
      },
      {
        label: '结束时间',
        prop: 'activityEndTime',
        // component: iconColumn
      },
    ],
  },
  luckyDial: {
    // 幸运转盘列表
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
        label: '名称',
        prop: 'activityName',
        width: 200,
        component: iconColumn,
      },
      {
        label: '开始时间',
        prop: 'activityStartTime',
        width: 150,
        propsHandler: propsHandler,
      },
      {
        label: '结束时间',
        prop: 'activityEndTime',
        width: 150,
        propsHandler: propsHandler,
      },
    ],
  },
  formTool: {
    // 问卷
    url: `/am/questionnaire/list`,
    requestMethod: 'post',
    hiddenFilter: true,
    unionKeys: ['id'],
    column: [
      {
        label: '问卷名称',
        prop: 'name',
        width: 200,
        component: iconColumn,
      },
      {
        label: '提交数',
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
        label: '活动名称',
        prop: 'name',
        width: 300,
        propsHandler: propsHandler,
      },
      {
        label: '优惠内容',
        prop: 'ruleName',
        propsHandler: propsHandler,
      },
      {
        label: '开始时间',
        prop: 'startTime',
        width: 150,
        component: timeStampColumn,
      },
      {
        label: '结束时间',
        prop: 'endTime',
        width: 150,
        component: timeStampColumn,
      },
      {
        label: '状态',
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
        label: '素材ID',
        prop: 'mid',
        width: 300,
        propsHandler: propsHandler,
      },
      {
        label: '商品名',
        prop: 'name',
        propsHandler: propsHandler,
      },
      {
        label: '消耗积分',
        prop: 'pointCost',
        propsHandler: propsHandler,
      },
      {
        label: '剩余量',
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
        label: '活动ID',
        prop: 'activityId',
        width: 300,
        propsHandler: propsHandler,
      },
      {
        label: '活动标题',
        prop: 'title',
        propsHandler: propsHandler,
      },
      {
        label: '活动类型',
        prop: 'activityCategory',
        propsHandler: propsHandler,
      },
      {
        label: '活动模板',
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
        label: '活动ID',
        prop: 'activityId',
        width: 300,
        propsHandler: propsHandler,
      },
      {
        label: '活动标题',
        prop: 'title',
        propsHandler: propsHandler,
      },
      {
        label: '活动类型',
        prop: 'pointCost',
        propsHandler: propsHandler,
      },
      {
        label: '活动模板',
        prop: 'activityTemplateId',
        propsHandler: propsHandler,
      },
    ],
  },
  'kangyang-project': {
    // 康养项目
    url: `/ky/prj/info/page`,
    requestMethod: 'post',
    hiddenFilter: true,
    column: [
      {
        label: '名称',
        prop: 'prjName',
      },
      {
        label: '编号',
        prop: 'prjNo',
      },
      {
        label: '价格',
        component: {
          functional: true,
          props: ['row'],
          render(h, ctx) {
            return h('span', ctx.data, `${ctx.props.row.lessPrice}-${ctx.props.row.maxPrice}/元/月/床`);
          },
        },
      },
      {
        label: '上架状态',
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
    // 康养活动
    url: '/ky/web/activity/page',
    requestMethod: 'post',
    hiddenFilter: true,
    showNormalFilter: true,
    filterList: [
      {
        type: 'input',
        paramName: 'name',
        label: '活动名称',
      },
      {
        type: 'input',
        paramName: 'typeId',
        label: '活动类型',
      },
    ],
    column: [
      {
        label: '名称',
        prop: 'name',
      },
      {
        label: '编号',
        prop: 'code',
      },
      {
        label: '状态',
        component: {
          functional: true,
          props: ['row'],
          render(h, ctx) {
            return h(
              'span',
              ctx.data,
              ctx.props.row.status === kangyangTypeEnum.ActivityStatus.Pending ? '未开始' : '进行中'
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
        label: '商户编号',
        prop: 'code',
      },
      {
        label: '商户名',
        prop: 'name',
        component: iconColumn,
      },
      {
        label: '所属项目',
        prop: 'storeName',
      },
      {
        label: '经营分类',
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
        label: '经营品类名称',
        prop: 'categoryName',
        width: 510,
        propsHandler: propsHandler,
      },
    ],
  },
};
