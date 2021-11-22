import services from '../utils/services';

export default {
  stat(params) {
    return services.post('/dwifi/wifi/stat.do', params, {
      action: '设置门店WIFI配置',
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: function(data, config, test) {
        return JSON.stringify(data);
      }
    });
  },

  info(params) {
    return services.get('/dwifi/wifi/info.do', {
      action: '获取门店WIFI配置',
      params
    });
  },

  delete(params) {
    return services.get('/dwifi/wifi/delete.do', {
      action: '删除门店WIFI配置',
      params
    });
  },

  getList(params) {
    return services.get('/dwifi/wifi/list.do', {
      action: '门店表列表接口',
      params
    });
  },

  //
  replace(params) {
    return services.post('/dwifi/wifi/replace.do', params, {
      action: '修改门店WIFI配置'
    });
  },

  upload(params) {
    return services.post('/dwifi/file/upload.do', params, {
      action: '文件上传'
    });
  },

  imageUploadUrl: '/dwifi/file/upload.do'
};
