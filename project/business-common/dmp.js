const initState = {
  openClientAttribution: undefined, // 是否开启客户归属关系
  effectiveScope: undefined, // 客户归属规则
  isTelesales: undefined, // 是否需要电销
  clientSourceList: [], // 客户来源
  custormerClientSource: [], // 自定义客户来源
};

const mutations = {
  set_attribution(state, isOpen) {
    state.openClientAttribution = isOpen;
  },
  set_effective_scope(state, effectiveScope) {
    state.effectiveScope = effectiveScope;
  },
  set_client_source(state, source) {
    state.clientSourceList = source;
  },
  set_custormer_client_source(state, source) {
    state.custormerClientSource = source;
  },
  set_isTelesales(state, isTelesales) {
    state.isTelesales = isTelesales;
  },
};

const actions = {};

export default {
  state: initState,
  mutations,
  actions,
  strict: false,
};
