const data = [
  {
    id: 7,
    appId: 0,
    parentId: 0,
    eventPropertyName: '基本信息',
    childList: [
      {
        id: 90,
        appId: 0,
        parentId: 7,
        relatedItem: 'NUM_INPUT',
        dimDataType: 'text',
        eventPropertyName: '客户ID',
        eventAttrList: [
          {
            id: 'eq',
            relatedItem: '',
            eventPropertyName: '等于',
          },
          {
            id: 'ne',
            relatedItem: '',
            eventPropertyName: '不等于',
          },
          {
            id: 'hv',
            relatedItem: '',
            eventPropertyName: '有值',
          },
          {
            id: 'nv',
            relatedItem: '',
            eventPropertyName: '无值',
          },
        ],
      },
      {
        id: 91,
        appId: 0,
        parentId: 7,
        relatedItem: 'DATE',
        dimDataType: 'date',
        eventPropertyName: '出生年月',
        eventAttrList: [
          {
            id: 'eq',
            eventPropertyName: '绝对时间/=',
          },
          {
            id: 'sec',
            eventPropertyName: '绝对时间/区间',
          },
          {
            id: 'in',
            eventPropertyName: '相对当前时间/N天内',
          },
          {
            id: 'before',
            eventPropertyName: '相对当前时间/N天前',
          },
        ],
      },
      {
        id: 92,
        appId: 0,
        parentId: 7,
        relatedItem: 'INPUT',
        dimDataType: 'text',
        eventPropertyName: '客户名称',
        eventAttrList: [
          {
            id: 'eq',
            relatedItem: '',
            eventPropertyName: '等于',
          },
          {
            id: 'ne',
            relatedItem: '',
            eventPropertyName: '不等于',
          },
          {
            id: 'hv',
            relatedItem: '',
            eventPropertyName: '有值',
          },
          {
            id: 'nv',
            relatedItem: '',
            eventPropertyName: '无值',
          },
        ],
      },
      {
        id: 93,
        appId: 0,
        parentId: 7,
        relatedItem: 'PHONE_INPUT',
        dimDataType: 'text',
        eventPropertyName: '手机号',
        eventAttrList: [
          {
            id: 'eq',
            relatedItem: '',
            eventPropertyName: '等于',
          },
          {
            id: 'ne',
            relatedItem: '',
            eventPropertyName: '不等于',
          },
          {
            id: 'hv',
            relatedItem: '',
            eventPropertyName: '有值',
          },
          {
            id: 'nv',
            relatedItem: '',
            eventPropertyName: '无值',
          },
        ],
      },
      {
        id: 94,
        appId: 0,
        parentId: 7,
        relatedItem: 'SEX',
        dimDataType: 'text',
        eventPropertyName: '性别',
        eventAttrList: [
          {
            id: 'eq',
            relatedItem: '',
            eventPropertyName: '等于',
          },
          {
            id: 'ne',
            relatedItem: '',
            eventPropertyName: '不等于',
          },
          {
            id: 'hv',
            relatedItem: '',
            eventPropertyName: '有值',
          },
          {
            id: 'nv',
            relatedItem: '',
            eventPropertyName: '无值',
          },
        ],
      },
      {
        id: 96,
        appId: 0,
        parentId: 7,
        relatedItem: 'SOURCE',
        dimDataType: 'text',
        eventPropertyName: '来源渠道',
        eventAttrList: [
          {
            id: 'eq',
            relatedItem: '',
            eventPropertyName: '等于',
          },
          {
            id: 'ne',
            relatedItem: '',
            eventPropertyName: '不等于',
          },
          {
            id: 'hv',
            relatedItem: '',
            eventPropertyName: '有值',
          },
          {
            id: 'nv',
            relatedItem: '',
            eventPropertyName: '无值',
          },
        ],
      },
      {
        id: 97,
        appId: 0,
        parentId: 7,
        relatedItem: 'WX_SOURCE',
        dimDataType: 'text',
        eventPropertyName: '微信关注来源',
        eventAttrList: [
          {
            id: 'eq',
            relatedItem: '',
            eventPropertyName: '等于',
          },
          {
            id: 'ne',
            relatedItem: '',
            eventPropertyName: '不等于',
          },
          {
            id: 'hv',
            relatedItem: '',
            eventPropertyName: '有值',
          },
          {
            id: 'nv',
            relatedItem: '',
            eventPropertyName: '无值',
          },
        ],
      },
      {
        id: 98,
        appId: 0,
        parentId: 7,
        relatedItem: 'REGION',
        dimDataType: 'text',
        eventPropertyName: '国家-省份-城市-区县',
        eventAttrList: [
          {
            id: 'eq',
            relatedItem: '',
            eventPropertyName: '等于',
          },
          {
            id: 'ne',
            relatedItem: '',
            eventPropertyName: '不等于',
          },
          {
            id: 'hv',
            relatedItem: '',
            eventPropertyName: '有值',
          },
          {
            id: 'nv',
            relatedItem: '',
            eventPropertyName: '无值',
          },
        ],
      },
      {
        id: 102,
        appId: 0,
        parentId: 7,
        relatedItem: 'EMAIL_INPUT',
        dimDataType: 'text',
        eventPropertyName: '邮箱',
        eventAttrList: [
          {
            id: 'eq',
            relatedItem: '',
            eventPropertyName: '等于',
          },
          {
            id: 'ne',
            relatedItem: '',
            eventPropertyName: '不等于',
          },
          {
            id: 'hv',
            relatedItem: '',
            eventPropertyName: '有值',
          },
          {
            id: 'nv',
            relatedItem: '',
            eventPropertyName: '无值',
          },
        ],
      },
    ],
  },
  {
    id: 8,
    appId: 0,
    parentId: 0,
    eventPropertyName: '会员信息',
    childList: [
      {
        id: 105,
        appId: 0,
        parentId: 8,
        relatedItem: 'NUM_INPUT',
        dimDataType: 'text',
        eventPropertyName: '会员ID',
        eventAttrList: [
          {
            id: 'eq',
            relatedItem: '',
            eventPropertyName: '等于',
          },
          {
            id: 'ne',
            relatedItem: '',
            eventPropertyName: '不等于',
          },
          {
            id: 'hv',
            relatedItem: '',
            eventPropertyName: '有值',
          },
          {
            id: 'nv',
            relatedItem: '',
            eventPropertyName: '无值',
          },
        ],
      },
      {
        id: 106,
        appId: 0,
        parentId: 8,
        relatedItem: 'NUM_INPUT',
        dimDataType: 'numerical',
        eventPropertyName: '会员积分',
        eventAttrList: [
          {
            id: 'eq',
            eventPropertyName: '=',
          },
          {
            id: 'ne',
            eventPropertyName: '≠',
          },
          {
            id: 'it',
            eventPropertyName: '>',
          },
          {
            id: 'gt',
            eventPropertyName: '<',
          },
          {
            id: 'ge',
            eventPropertyName: '≥',
          },
          {
            id: 'le',
            eventPropertyName: '≤',
          },
          {
            id: 'sec',
            eventPropertyName: '区间',
          },
          {
            id: 'nv',
            eventPropertyName: '有值',
          },
          {
            id: 'hv',
            eventPropertyName: '无值',
          },
        ],
      },
      {
        id: 107,
        appId: 0,
        parentId: 8,
        relatedItem: 'VIP_LEVEL',
        dimDataType: 'text',
        eventPropertyName: '会员等级',
        eventAttrList: [
          {
            id: 'eq',
            relatedItem: '',
            eventPropertyName: '等于',
          },
          {
            id: 'ne',
            relatedItem: '',
            eventPropertyName: '不等于',
          },
          {
            id: 'hv',
            relatedItem: '',
            eventPropertyName: '有值',
          },
          {
            id: 'nv',
            relatedItem: '',
            eventPropertyName: '无值',
          },
        ],
      },
      {
        id: 108,
        appId: 0,
        parentId: 8,
        relatedItem: 'VIP_LEVEL',
        dimDataType: 'text',
        eventPropertyName: '会员优惠券',
        eventAttrList: [
          {
            id: 'eq',
            relatedItem: '',
            eventPropertyName: '等于',
          },
          {
            id: 'ne',
            relatedItem: '',
            eventPropertyName: '不等于',
          },
          {
            id: 'hv',
            relatedItem: '',
            eventPropertyName: '有值',
          },
          {
            id: 'nv',
            relatedItem: '',
            eventPropertyName: '无值',
          },
        ],
      },
    ],
  },
  {
    id: 9,
    appId: 0,
    parentId: 0,
    eventPropertyName: '标签信息',
    childList: [
      {
        id: 105,
        appId: 0,
        parentId: 8,
        relatedItem: 'NUM_INPUT',
        dimDataType: 'text',
        eventPropertyName: '标签',
        eventAttrList: [
          {
            id: 'eq',
            relatedItem: '',
            eventPropertyName: '等于',
          },
          {
            id: 'ne',
            relatedItem: '',
            eventPropertyName: '不等于',
          },
          {
            id: 'hv',
            relatedItem: '',
            eventPropertyName: '有值',
          },
          {
            id: 'nv',
            relatedItem: '',
            eventPropertyName: '无值',
          },
        ],
      },
    ],
  },
];
export default {
  data,
  list: [
    {
      id: 0,
      appId: 0,
      parentId: 0,
      eventPropertyName: '产生积分',
      childList: [
        {
          id: 10,
          appId: 0,
          parentId: 1,
          relatedItem: 'NUM_INPUT',
          dimDataType: 'numerical',
          eventPropertyName: '产生积分',
          eventAttrList: [
            {
              id: 'eq',
              eventPropertyName: '=',
            },
            {
              id: 'ne',
              eventPropertyName: '≠',
            },
            {
              id: 'it',
              eventPropertyName: '>',
            },
            {
              id: 'gt',
              eventPropertyName: '<',
            },
            {
              id: 'ge',
              eventPropertyName: '≥',
            },
            {
              id: 'le',
              eventPropertyName: '≤',
            },
            {
              id: 'sec',
              eventPropertyName: '区间',
            },
            {
              id: 'nv',
              eventPropertyName: '有值',
            },
            {
              id: 'hv',
              eventPropertyName: '无值',
            },
          ],
        },
      ],
    },
    {
      id: 1,
      appId: 0,
      parentId: 0,
      eventPropertyName: '订单金额',
      childList: [
        {
          id: 11,
          appId: 0,
          parentId: 2,
          relatedItem: 'NUM_INPUT',
          dimDataType: 'numerical',
          eventPropertyName: '订单金额',
          eventAttrList: [
            {
              id: 'eq',
              eventPropertyName: '=',
            },
            {
              id: 'ne',
              eventPropertyName: '≠',
            },
            {
              id: 'it',
              eventPropertyName: '>',
            },
            {
              id: 'gt',
              eventPropertyName: '<',
            },
            {
              id: 'ge',
              eventPropertyName: '≥',
            },
            {
              id: 'le',
              eventPropertyName: '≤',
            },
            {
              id: 'sec',
              eventPropertyName: '区间',
            },
            {
              id: 'nv',
              eventPropertyName: '有值',
            },
            {
              id: 'hv',
              eventPropertyName: '无值',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      appId: 0,
      parentId: 0,
      eventPropertyName: '来源渠道',
      childList: [
        {
          id: 12,
          appId: 0,
          parentId: 0,
          relatedItem: 'SOURCE',
          dimDataType: 'text',
          eventPropertyName: '来源渠道',
          eventAttrList: [
            {
              id: 'eq',
              relatedItem: '',
              eventPropertyName: '等于',
            },
            {
              id: 'ne',
              relatedItem: '',
              eventPropertyName: '不等于',
            },
            {
              id: 'hv',
              relatedItem: '',
              eventPropertyName: '有值',
            },
            {
              id: 'nv',
              relatedItem: '',
              eventPropertyName: '无值',
            },
          ],
        },
      ],
    },
    {
      id: 3,
      appId: 0,
      parentId: 0,
      eventPropertyName: '下单日期',
      childList: [
        {
          id: 13,
          appId: 0,
          parentId: 3,
          relatedItem: 'DATE',
          dimDataType: 'date',
          eventPropertyName: '下单日期',
          eventAttrList: [
            {
              id: 'eq',
              eventPropertyName: '绝对时间/=',
            },
            {
              id: 'sec',
              eventPropertyName: '绝对时间/区间',
            },
            {
              id: 'in',
              eventPropertyName: '相对当前时间/N天内',
            },
            {
              id: 'before',
              eventPropertyName: '相对当前时间/N天前',
            },
          ],
        },
      ],
    },
  ],
};
