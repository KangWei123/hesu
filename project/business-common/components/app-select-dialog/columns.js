import Handler from '@/business-common/components/table-select-dialog/handler.js';

export default {
  default: [
    {
      prop: 'appName',
      label: '应用名称',
      propsHandler: Handler.propsHanler,
    },

    {
      prop: 'category',
      label: '对应业态',
      propsHandler: Handler.propsHanler,
    },

    {
      prop: 'id',
      label: 'appId',
      propsHandler: Handler.propsHanler,
    },
  ],
};
