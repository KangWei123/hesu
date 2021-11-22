import services from '../utils/services'

export default {
  list (params) {
    return services.post('/c/user/list', params, {
      action: '获取用户列表'
    })
  },
  storeList (params) {
    return services.post('/c/buz/store/querylist', params, {
      action: '获取门店列表'
    })
  },
  update (params) {
    return services.post(`/c/user/update`, params, {
      action: '更新用户'
    })
  },
  create (params) {
    return services.post(`/c/user/add`, params, {
      action: '新增用户'
    })
  },
  delete (params) {
    return services.post(`/c/user/delete`, params, {
      action: '删除用户'
    })
  },
  roleList (params) {
    return services.post(`/c/role/list`, params, {
      action: '查询权限列表'
    })
  },
  queryCanGrantRoles (params) {
    return services.post(`/c/role/querycangrantroles`, params, {
      action: '查询用户可授予角色列表'
    })
  },
  batchUploadUrl: '/c/user/import'
}
