import services from '@/dss-common/utils/services';
import { WpSchema, OrgSchema } from '@/business-common/constants/apiEnum';

export const exportDealerUrl = WpSchema + '/dealer/export';

export function add(params) {
  return services.json(WpSchema + '/dealer/add', params, {
    action: '添加经销商',
  });
}

export function update(params) {
  return services.json(WpSchema + '/dealer/update', params, {
    action: '修改经销商',
  });
}

export function updateStatus(params) {
  return services.post(WpSchema + '/dealer/updateStatus', params, {
    action: '修改状态',
  });
}

export function queryList(params) {
  return services.get(OrgSchema + '/dealer/queryList', {
    action: '查询经销商列表',
    params,
  });
}

export function detail(params) {
  return services.get(WpSchema + '/dealer/detail', {
    action: '查询经销商详情',
    params,
  });
}

export function queryDealerStoreTree(params) {
  return services.get(WpSchema + '/dealer/queryDealerStoreStatistic', {
    action: '查询经销商列表',
    params,
  });
}

export const dealerTemplateDownUrl = WpSchema + '/materials/template/download?fileName=dealerImportTemplate';

export const dealerImportUrl = WpSchema + '/dealer/import';

export const dealerExportUrl = WpSchema + '/dealer/export';
