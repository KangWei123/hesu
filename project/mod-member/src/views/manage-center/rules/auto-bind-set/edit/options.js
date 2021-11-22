export default [
  {
    value: 'realName',
    label: '姓名',
    funcTypes: [
      { value: 0, label: '等于' },
      { value: 1, label: '不等于' },
      { value: 2, label: '包含' },
      { value: 3, label: '不包含' },
      { value: 4, label: '为空' },
      { value: 5, label: '不为空' },
    ],
  },
  {
    value: 'phone',
    label: '电话',
    funcTypes: [
      { value: 0, label: '等于' },
      { value: 1, label: '不等于' },
      { value: 2, label: '包含' },
      { value: 3, label: '不包含' },
      { value: 4, label: '为空' },
      { value: 5, label: '不为空' },
    ],
  },
  {
    value: 'createTime',
    label: '创建时间',
    funcTypes: [
      { value: 0, label: '等于' },
      { value: 1, label: '早于' },
      { value: 2, label: '晚于' },
      { value: 3, label: '自定义' },
    ],
  },
  {
    value: 'region',
    label: '地区',
    funcTypes: [
      { value: 0, label: '等于' },
      { value: 1, label: '不等于' },
      { value: 2, label: '为空' },
      { value: 3, label: '不为空' },
    ],
  },
  {
    value: 'sellRemark',
    label: '销售线索备注',
    funcTypes: [
      { value: 0, label: '等于' },
      { value: 1, label: '不等于' },
      { value: 2, label: '包含' },
      { value: 3, label: '不包含' },
      { value: 4, label: '为空' },
      { value: 5, label: '不为空' },
    ],
  },
];
