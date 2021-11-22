import Handler from '@/business-common/components/table-select-dialog/handler.js';

export default {
  default: [
    {
      prop: 'name',
      label: '项目名称',
      propsHandler: Handler.propsHanler,
    },

    {
      prop: 'area',
      label: '项目区域',
      propsHandler: Handler.propsHanler,
    },

    {
      prop: 'storeId',
      label: '所属应用',
      propsHandler: Handler.propsHanler,
    },
  ],
};
