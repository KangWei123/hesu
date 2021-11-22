import services from '../utils/services'

export default {
  all () {
    return services.get('/c/stat/portrait/all', {
      action: '获取客流画像数据'
    })
  },
  new () {
    return services.get('/c/stat/portrait/new', {
      action: '获取新客画像数据'
    })
  },
  old () {
    return services.get('/c/stat/portrait/old', {
      action: '获取老客画像数据'
    })
  },
  base(type) {
    return services.get(`/c/stat/portrait/base_portrait?type=${type}`, {
      action: '获取基础画像'
    });
  },
  consume(type) {
    return services.get(`/c/stat/portrait/consume_portrait?type=${type}`, {
      action: '获取消费画像'
    });
  },
  interest(type) {
    return services.get(`/c/stat/portrait/interest_portrait?type=${type}`, {
      action: '获取兴趣画像'
    });
  }
};
