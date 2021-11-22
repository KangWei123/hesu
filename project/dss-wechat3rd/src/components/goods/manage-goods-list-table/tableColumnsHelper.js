import goodsInfo from './goods-info.vue';
import handler from './handler.vue';
import category from './categry.vue';
import marketing from './marketing.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';

export default {
  getColumns(goodsType) {
    const columns = [
      {
        label: `${goodsType.label}名称`,
        prop: 'itemName',
        goodsType: goodsType,
        component: goodsInfo
      }
    ];
    if (goodsType.type !== goodsTypeEnum.estate.type) {
      columns.push({
        label: `${goodsType.label}分类`,
        prop: 'category',
        component: category
      });
    }
    columns.push({
      label: '所属营销',
      prop: 'marketing',
      component: marketing
    });
    return columns;
  },
  getColumnsHandler(extConfig) {
    const {
      slotHandler,
      handlerConfig,
      goodsType,
      update_item,
      manage_item,
      qrCodePath,
      addProductPath,
      listeners
    } = extConfig;
    return cols => {
      return cols.concat({
        slotHandler,
        handlerConfig,
        goodsType,
        update_item,
        manage_item,
        qrCodePath,
        addProductPath,
        listeners,
        label: '操作',
        align: 'left',
        width: '310',
        component: handler
      });
    };
  }
};
