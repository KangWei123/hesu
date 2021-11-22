import services from '../utils/services'

export default {
  diagnosis(params) {
    return services.post('/c/stat/pf/dagnosis/query',  params, {
      action: '查询客流诊断'
    })
  }
}
