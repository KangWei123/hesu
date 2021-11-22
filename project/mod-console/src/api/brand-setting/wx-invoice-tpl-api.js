import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  postInvoiceStatus(params) {
    return services.post(WpSchema + '/app/setting/invoice', params, {
      action: '是否开启发票功能',
    });
  },

  addInvoice(params) {
    return services.json(WpSchema + '/invoice/createTemplate', params, {
      action: '添加发票模板',
    });
  },

  getInvoice(params) {
    return services.get(WpSchema + '/invoice/listTemplate', {
      action: '获取发票模板列表',
      params,
    });
  },

  updateInvoice(params) {
    return services.json(WpSchema + '/invoice/updateTemplate', params, {
      action: '修改发票模板',
    });
  },

  deleteInvoice(templateId) {
    return services.get(`${WpSchema}/invoice/deleteTemplate?templateId=${templateId}`, {
      action: '删除发票模板',
    });
  },

  invoiceDetail(templateId) {
    return services.get(`${WpSchema}/invoice/detailTemplate?templateId=${templateId}`, {
      action: '获取发票信息',
    });
  },

  setDefaultInvoice(params) {
    return services.get(WpSchema + '/invoice/setDefault', {
      action: '设置默认模板',
      params,
    });
  },

  saveEntInfo(params, nsrsbh) {
    return services.json(WpSchema + '/invoice/saveEnterprise', params, nsrsbh, {
      action: '保存企业信息',
    });
  },

  async getEntInfo() {
    try {
      const res = await services.get(WpSchema + '/invoice/getEnterprises');
      return res.data || [];
    } catch (error) {
      return error;
    }
  },

  deleteEntInfo(nsrsbh) {
    return services.get(`${WpSchema}/invoice/deleteEnterprise?nsrsbh=${nsrsbh}`, {
      action: '删除企业信息',
    });
  },
};
