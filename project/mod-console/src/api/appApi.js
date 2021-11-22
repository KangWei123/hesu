import services from '@/dss-common/utils/services';
import { WpSchema, FdSchema, PlatformSchema, OrgSchema } from '@/business-common/constants/apiEnum';

export const url = {
  list: PlatformSchema + '/app/query',
  listAppApp: PlatformSchema + '/app/queryList',
  allApp: PlatformSchema + '/app/queryAllApp',
  add: PlatformSchema + '/app/create',
  update: PlatformSchema + '/app/update',
  setAdmin: PlatformSchema + '/app/set/admin',
  industry: OrgSchema + '/industry/pageQuery',
};

/**
 * 查询当前企业的所有应用
 */
export function listApp(params) {
  return services.json(url.list, params, {
    action: '获取应用列表',
  });
}

/**
 * 获取所有应用列表
 */
export function listAllApp(params) {
  return services.json(url.listAppApp, params, { action: '获取所有应用', removeEmpty: true });
}

/**
 * 查询业态账号下所有应用列表
 */
export function allApp(params) {
  return services.json(url.allApp, params, { action: '获取所有应用', removeEmpty: true });
}

listAllApp.URL = url.listAppApp;

export function addOrUpdateApp(params) {
  const finalUrl = params.id ? url.update : url.add;
  return services.json(finalUrl, params, {
    action: '添加应用',
  });
}

export function setAdmin(params) {
  return services.json(url.setAdmin, params, {
    action: '设置管理员账号',
  });
}

/**
 * 查询行业类目
 * @param industryCategoryId 0：查询业态，传业态id则是查询该业态下的主营类目
 */
export function listIndustries(parentId) {
  return services.get(url.industry, {
    action: '查询行业类目',
    params: {
      parentId,
    },
  });
}
