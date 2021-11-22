import services from '@/dss-common/utils/services';

export default {
  getTagList() {
    return services.get('/wp/consumer_tag/list', {
      action: '获取标签列表'
    });
  },
  /**
   * 列表查询
   */
  list(params) {
    return services.get('/wp/subscribeQrCode/get/list', {
      params,
      action: '获取二维码列表'
    });
  },
  /**
   * 添加二维码
   */
  add(params) {
    return services.json('/wp/subscribeQrCode/create', params, { action: '添加二维码' });
  },
  /**
   * 删除二维码
   */
  delete(params) {
    return services.post('/wp/subscribeQrCode/delete', params, { action: '删除二维码' });
  },
  /**
   * 查询单个二维码
   */
  single(params) {
    return services.get(
      '/wp/subscribeQrCode/get/single',
      {
        params,
        action: '查询单个二维码'
      },
      {}
    );
  },
  /**
   * 下载二维码
   */
  download: '/wp/subscribeQrCode/qrCode/download/',
  /**
   * 修改二维码
   */
  updated(params) {
    const _params = Object.keys(params).reduce((pre, key) => {
      const type = Object.prototype.toString.call(params[key]).toLowerCase();
      if (typeof params[key] === 'object') {
        pre[key] = JSON.stringify(params[key]);
        return pre;
      }
      pre[key] = params[key];
      return pre;
    }, {});
    return services.put('/wp/subscribeQrCode/update', _params, {
      action: '修改二维码'
    });
  },
  /**
   * 修改标签名称
   */
  editTagName(params) {
    return services.json(
      '/wp/consumer_tag/update',
      {
        ...params
      },
      {
        action: '修改标签名称'
      }
    );
  },
  /**
   * 修改标签类型
   */
  editTagType(params) {
    return services.json(
      '/wp/consumer_tag/category/update',
      {
        ...params
      },
      {
        action: '修改标签类型'
      }
    );
  },
  /**
   * 新建标签
   */
  addTag(params) {
    return services.json(
      '/wp/consumer_tag',
      {
        ...params
      },
      {
        action: '新建标签'
      }
    );
  },
  /**
   * 新建标签类型
   */
  addTagType(params) {
    return services.json(
      '/wp/consumer_tag/category?categoryName=' + params.categoryName,
      {},
      {
        action: '新建标签类型'
      }
    );
  },
  /**
   * 删除标签名
   */
  deleteTag(id) {
    return services.get(
      `/wp/consumer_tag/delete/${id}`,
      {
        action: '删除标签名'
      },
      {}
    );
  },
  /**
   * 获取标签
   */
  getTags() {
    return services.get('/wp/subscribeQrCode/tags', {
      action: '获取标签'
    });
  },
  /**
   * 查询单个二维码
   */
  deleteTagType(id) {
    return services.get(
      `/wp/consumer_tag/category/delete/${id}`,
      {
        action: '删除标签名类型'
      },
      {}
    );
  }
};
