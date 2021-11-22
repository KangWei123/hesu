/**
 * Created by love on 18/10/11.
 * @author trumpli<李志伟>
 */
import constants from '@/dss-wechat3rd/src/constants/index';
import services from '@/dss-common/utils/services';

const Store = [];
export default {
  type: null,

  //商品规格列表
  Store,

  init(type) {
    this.type = type;
    return this.apiGetGoodAttribute();
  },

  apiGetGoodAttribute() {
    return services
      .get(constants.Api.goods.attribute.list, {
        action: '商品规格',
        params: {
          type: this.type
        }
      })
      .then(res => {
        Store.length = 0;
        (res.data || []).forEach(item => {
          Store.push(item);
        });
        return Store;
      });
  },

  apiAddGoodAttribute(attrName) {
    const params = {
      type: this.type,
      attrName: attrName
    };
    return services
      .post(constants.Api.goods.attribute.add, params, {
        action: '添加规格'
      })
      .then(res => {
        Store.push({ attrName: attrName, id: res.data, type: this.type });
        return new Promise((resolve, reject) => {
          resolve(Store[Store.length - 1]);
        });
      });
  }
};
