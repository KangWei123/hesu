import services from '@/dss-common/utils/services';
import { WpSchema } from '@/business-common/constants/apiEnum';

export function querySetting(params) {
  return services.get(WpSchema + '/order/setting/query', {
    action: '查询配置',
  });
}

export async function submitSetting(params) {
  const { tag, customizedDistanceShop, customizedRegionShop } = params;
  const update$ = await services.get(WpSchema + '/order/setting/update', {
    params: { customizedDistanceShop, customizedRegionShop },
    action: '更新设置',
  });
  const tag$ = await services.post(
    WpSchema + '/app/update/tag',
    { tag },
    {
      action: '修改品牌配置项',
    }
  );
}
