import constants from '@/dss-wechat3rd/src/constants/index';
import services from '@/dss-common/utils/services';

// 查询所有商品标签
export async function queryItemLabelAll() {
  const url = constants.Api.goods.label.cateList;
  let params = { pageNo: 1, pageSize: 1000 };
  const res = await services.get(url, { params, action: '标签分类列表' });
  const data = res.data || [];
  data.unshift({ categoryName: '默认分类', id: '0' });
  return data;
}
