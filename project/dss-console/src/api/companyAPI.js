/**
 * Created by allenhe on 18/9/5.
 * @author allen
 */
import services from '@/dss-common/utils/services';
import {app} from "@/dss-console/src/api/index";

export function listApp(params) {
  /*return services.get(app.list, {
    action: '获取应用列表',
    params
  });*/
  return {
    data: [{
      name: '零售商城',
      appId: 309,
      channel: '零售',
      createTime:'2020-10-09',
      createUser: 'sr',
      concat: '13824177351'
    }],
    totalCount: 1
  }
}

export function addOrUpdateApp(params) {
  const url = params.id ? app.update : app.add;
  return services.post(url, params, {
    action: '添加/更新应用'
  });
}
