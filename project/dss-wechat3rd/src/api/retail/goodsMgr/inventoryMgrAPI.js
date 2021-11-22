import services from '@/dss-common/utils/services.js';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

const itemExport = WpSchema + '/inout_item/export'; // 商品出入库明细导出
const stockExport = WpSchema + '/warehouse/stock/export'; // 库存查询导出
const reviewExport = WpSchema + '/warehouse/review/export'; // 库存盘点导出
const outboundExport = WpSchema + '/outbound/export'; // 商品出库单导出
const deliveryExport = WpSchema + '/outbound/invoice/export'; // 商品发货单导出
export default {
  itemExport,
  stockExport,
  reviewExport,
  outboundExport,
  deliveryExport,
  getVerificationList(params) {
    return services.get(WpSchema + '/warehouse/review/query', {
      action: '获取盘点列表',
      params
    });
  },

  getVerificationDetail(params) {
    return services.get(WpSchema + '/warehouse/review/review_detail', {
      action: '盘点详情',
      params
    });
  },

  addVerification(params) {
    return services.json(WpSchema + '/warehouse/review/add_review', params, {
      action: '新增盘点'
    });
  },

  updateVerification(params) {
    return services.json(WpSchema + '/warehouse/review/update_review', params, {
      action: '更新盘点'
    });
  },

  cancelVerification(params) {
    return services.post(WpSchema + '/warehouse/review/cancel_review', params, {
      action: '取消盘点'
    });
  },

  /*商品入库查询*/
  listInbounds(params) {
    return services.get(WpSchema + '/inbound/list', {
      action: '查询商品入库',
      params
    });
  },
  /*商品入库*/
  inbound(params) {
    return services.json(WpSchema + '/inbound/create', params, {
      action: '商品入库'
    });
  },
  /*入库明细*/
  inboundDetail(params) {
    return services.get(WpSchema + '/inbound/detail', {
      params,
      action: '入库明细'
    });
  },
  /*商品出库查询*/
  listOutbounds(params) {
    return services.get(WpSchema + '/outbound/list', {
      action: '查询商品出库',
      params
    });
  },
  /*商品出库*/
  outbound(params) {
    return services.json(WpSchema + '/outbound/create', params, {
      action: '商品出库'
    });
  },
  /*出库明细*/
  outboundDetail(params) {
    return services.get(WpSchema + '/outbound/detail', {
      params,
      action: '出库明细'
    });
  },
  /*出入库明细*/
  ioboundDetail(params) {
    return services.get(WpSchema + '/inout_item/list', {
      params,
      action: '出入库明细'
    });
  },

  /*更新入库单状态*/
  update_status(params) {
    return services.get(WpSchema + '/inbound/update_status', {
      params,
      action: '更新入库单状态'
    });
  },

  /*更新入库*/
  updateInbound(params) {
    return services.json(WpSchema + '/inbound/update', params, {
      action: '更新入库单'
    });
  },

  /*更新入库单状态*/
  update_Outstatus(params) {
    return services.get(WpSchema + '/outbound/update_status', {
      params,
      action: '更新出库单状态'
    });
  },

  /*更新入库*/
  updateOutbound(params) {
    return services.json(WpSchema + '/outbound/update', params, {
      action: '更新出库单'
    });
  },

  /*确认入库*/
  confirmInbound(params) {
    return services.json(WpSchema + '/inbound/confirm', params, {
      action: '确认入库'
    });
  },

  /*确认出库*/
  confirmOutbound(params) {
    return services.json(WpSchema + '/outbound/confirm', params, {
      action: '确认出库'
    });
  },
  /*批量出库待审核*/
  batchOutbound(params) {
    return services.json(WpSchema + '/outbound/batch/update_status', params, {
      action: '批量出库待审核'
    });
  },
  /*批量入库待审核*/
  batchInbound(params) {
    return services.json(WpSchema + '/inbound/batch/update_status', params, {
      action: '批量入库待审核'
    });
  },
  /*批量出库待审核*/
  batchConfirmOutbound(params) {
    return services.json(WpSchema + '/outbound/batch/confirm', params, {
      action: '批量出库确认出库'
    });
  },
  /*批量入库待审核*/
  batchConfirmInbound(params) {
    return services.json(WpSchema + '/inbound/batch/confirm', params, {
      action: '批量入库确认入库'
    });
  }
};
