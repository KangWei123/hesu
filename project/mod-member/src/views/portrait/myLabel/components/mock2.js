export default {
  data: [
    {
      id: 1,
      appId: 0,
      parentId: 0,
      childList: [
        {
          id: 10,
          appId: 0,
          parentId: 1,
          relatedItem: 'WX_LIST',
          eventPropertyName: '关注公众号',
          eventPropertyType: 0,
          eventPropertyLevel: 2,
        },
        {
          id: 11,
          appId: 0,
          parentId: 1,
          relatedItem: 'WX_LIST',
          eventPropertyName: '取消关注公众号',
          eventPropertyType: 0,
          eventPropertyLevel: 2,
        },
      ],
      relatedItem: '',
      eventPropertyName: '公众号事件',
      eventPropertyType: 0,
      eventPropertyLevel: 1,
    },
    {
      id: 2,
      appId: 0,
      parentId: 0,
      childList: [
        {
          id: 15,
          appId: 0,
          parentId: 2,
          relatedItem: '',
          eventPropertyName: '访问小程序',
          eventPropertyType: 0,
          eventPropertyLevel: 2,
        },
        {
          id: 20,
          appId: 0,
          parentId: 2,
          relatedItem: '',
          eventPropertyName: '签到',
          eventPropertyType: 0,
          eventPropertyLevel: 2,
        },
        {
          id: 29,
          appId: 0,
          parentId: 2,
          relatedItem: '',
          eventAttrList: [
            {
              id: 62,
              appId: 0,
              parentId: 29,
              relatedItem: '',
              eventPropertyName: '全部商品',
              eventPropertyType: 0,
              eventPropertyLevel: 3,
            },
            {
              id: 63,
              appId: 0,
              parentId: 29,
              relatedItem: 'GOODS',
              eventPropertyName: '指定商品',
              eventPropertyType: 0,
              eventPropertyLevel: 3,
            },
            {
              id: 64,
              appId: 0,
              parentId: 29,
              relatedItem: 'CLASSIFICATION',
              eventPropertyName: '指定分类',
              eventPropertyType: 0,
              eventPropertyLevel: 3,
            },
            {
              id: 65,
              appId: 0,
              parentId: 29,
              relatedItem: 'GOODS_TAG',
              eventPropertyName: '指定标签',
              eventPropertyType: 0,
              eventPropertyLevel: 3,
            },
          ],
          eventPropertyName: '购买商品',
          eventPropertyType: 0,
          eventPropertyLevel: 2,
        },
      ],
      relatedItem: '',
      eventPropertyName: '小程序事件',
      eventPropertyType: 0,
      eventPropertyLevel: 1,
    },
    {
      id: 3,
      appId: 0,
      parentId: 0,
      childList: [
        {
          id: 39,
          appId: 0,
          parentId: 3,
          relatedItem: '',
          eventAttrList: [
            {
              id: 88,
              appId: 0,
              parentId: 39,
              relatedItem: '',
              eventPropertyName: '全部门店',
              eventPropertyType: 0,
              eventPropertyLevel: 3,
            },
            {
              id: 89,
              appId: 0,
              parentId: 39,
              relatedItem: 'CLASSIFICATION',
              eventPropertyName: '指定分类',
              eventPropertyType: 0,
              eventPropertyLevel: 3,
            },
          ],
          eventPropertyName: '到店行为',
          eventPropertyType: 0,
          eventPropertyLevel: 2,
        },
      ],
      relatedItem: '',
      eventPropertyName: '门店行为事件',
      eventPropertyType: 0,
      eventPropertyLevel: 1,
    },
  ],
  dataList: {
    labelValue: 'hjq0311',
    description: 'desc',
    useDefaultDesc: 0,
    updRule: 1,
    values: [
      {
        behaviorProperty: {
          propertyDetailList: [
            {
              detailList: [
                {
                  dimCondition: 'eq',
                  dimDataType: 'text',
                  dimName: '消费商品',
                  dimSeq: 2,
                  dimValue: '商品ID',
                },
                {
                  dimCondition: 'eq',
                  dimDataType: 'numerical',
                  dimName: '消费金额',
                  dimValue: '362',
                },
              ],
              dimRelation: 'OR',
              endDate: '2020-02-22',
              propertyName: '消费行为',
              startDate: '2020-02-20',
            },
          ],
          propertyType: 'behavior',
        },
        customerProperty: {
          propertyDetailList: [
            {
              dimCondition: 'eq',
              dimDataType: 'text',
              dimName: '性别',
              dimSeq: 1,
              dimValue: '男',
              propertyName: '基本信息',
            },
            {
              dimCondition: 'eq',
              dimDataType: 'text',
              dimName: '手机号',
              dimSeq: 3,
              dimValue: '17324398232',
              propertyName: '基本信息',
            },
            {
              dimCondition: 'eq',
              dimDataType: 'date',
              dimName: '出生年月日',
              dimSeq: 2,
              dimValue: '2020-02-19',
              propertyName: '基本信息',
            },
          ],
          propertyDetailRelation: 'AND',
          propertyType: 'customer',
        },
        labelValue: '标签值1',
        orderProperty: {
          propertyDetailList: [
            {
              dimCondition: 'eq',
              dimDataType: 'numerical',
              dimName: '订单金额',
              dimSeq: 1,
              dimValue: '522.2',
              propertyName: '订单属性',
            },
            {
              dimCondition: 'eq',
              dimDataType: 'date',
              dimName: '下单日期',
              dimSeq: 3,
              dimValue: '2020-02-22',
              propertyName: '订单属性',
            },
            {
              dimCondition: 'eq',
              dimDataType: 'text',
              dimName: '来源渠道',
              dimSeq: 2,
              dimValue: '2号直播间',
              propertyName: '订单属性',
            },
          ],
          propertyDetailRelation: 'AND',
          propertyType: 'orders',
        },
        propertyRelation: 'OR',
        labelSeq: 1,
      },
    ],
  },
};
