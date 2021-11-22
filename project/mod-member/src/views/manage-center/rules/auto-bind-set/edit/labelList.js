/**
 * Created by admin on 2020/1/9.
 * @author lemon<李亦黎>
 */
export default {
  labelList: [
    {
      name: '姓名',
      id: 1,
      fieldName: 'realName',
      fieldType: 0,
      children: [
        { name: '等于', id: 6, funcType: 0 },
        { name: '不等于', id: 7, funcType: 1 },
        { name: '包含', id: 8, funcType: 2 },
        { name: '不包含', id: 9, funcType: 3 },
        { name: '为空', id: 10, funcType: 4, disabled: true },
        { name: '不为空', id: 11, funcType: 5, disabled: true },
      ],
    },
    {
      name: '电话',
      id: 2,
      fieldName: 'phone',
      fieldType: 0,
      isNumber: true,
      children: [
        { name: '等于', id: 12, funcType: 0 },
        { name: '不等于', id: 13, funcType: 1 },
        { name: '包含', id: 14, funcType: 2 },
        { name: '不包含', id: 15, funcType: 3 },
        { name: '为空', id: 16, funcType: 4, disabled: true },
        { name: '不为空', id: 17, funcType: 5, disabled: true },
      ],
    },
    {
      name: '创建时间',
      id: 3,
      fieldName: 'createTime',
      fieldType: 1,
      children: [
        { name: '等于', value: 18, funcType: 0, showDatePicker: true },
        { name: '早于', value: 19, funcType: 1, showDatePicker: true },
        { name: '晚于', value: 20, funcType: 2, showDatePicker: true },
        { name: '自定义', value: 21, funcType: 3, showDatePicker: true, dateRange: true },
      ],
    },
    {
      name: '地区',
      id: 4,
      fieldName: 'region',
      fieldType: 2,
      children: [
        { name: '等于', funcType: 0, id: 22 },
        { name: '不等于', funcType: 1, id: 23 },
        { name: '为空', funcType: 2, id: 24, disabled: true },
        { name: '不为空', funcType: 3, id: 25, disabled: true },
      ],
    },
    {
      name: '销售线索备注',
      id: 5,
      fieldName: 'sellRemark',
      fieldType: 0,
      children: [
        { name: '等于', funcType: 0, id: 26 },
        { name: '不等于', funcType: 1, id: 27 },
        { name: '包含', id: 28, funcType: 2 },
        { name: '不包含', id: 29, funcType: 3 },
        { name: '为空', id: 30, funcType: 4, disabled: true },
        { name: '不为空', id: 31, funcType: 5, disabled: true },
      ],
    },
  ],
};
