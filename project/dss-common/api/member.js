import services from '../utils/services'

export default {
  getProfile (per_epId) {
    return services.get(`/c/member/profile/query`, {
      action: '获取用户画像数据'
    })
  }
}
