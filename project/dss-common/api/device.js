import services from '../utils/services';

export default {
  list(params) {
    return services.post('/c/buz/device/ownDevices', params, {
      action: '获取设备列表'
    });
  },
  add(params) {
    return services.post('/c/buz/device/add', params, {
      action: '新增设备'
    });
  },
  update(params) {
    return services.post('/c/buz/device/update', params, {
      action: '更新设备'
    });
  },
  delete(params) {
    return services.post('/c/buz/device/delete', params, {
      action: '删除设备'
    });
  }
};
