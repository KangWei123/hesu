import Vue from 'vue';
import Vuex from 'vuex';
import baseApi from '@/dss-common/api/base';
Vue.use(Vuex);

const initState = {
  userInfo: {
    epId: '',
    storeId: ''
  },
  // 指标说明
  tips: null,
  selectedEp: {
    epId: '',
    epName: ''
  },
  // 店铺列表
  stores: [],
  // 选中店铺
  curStore: null,
  // 用来做filter的选中的店铺
  selectedStore: null,
  wkbStatus: 0,
  klbStatus: 0
};

const mutations = {
  set_userInfo(state, userInfo) {
    state.userInfo = userInfo;
    if (userInfo.epId) {
      state.selectedEp = {
        epId: userInfo.epId,
        epName: userInfo.epName
      };
    } else if (userInfo.epList && userInfo.epList.length) {
      const firstEp = userInfo.epList[0];
      state.selectedEp = {
        epId: firstEp.id,
        epName: firstEp.name
      };
    }
  },
  set_epInfo(state, epInfo) {
    state.selectedEp = epInfo;
  },
  setTips(state, tips) {
    state.tips = tips;
  },
  setStores(state, stores) {
    state.stores = stores;
    // 默认store，由后台选中
    if (!!state.userInfo.storeId && !!stores && stores.length > 0) {
      const finded = stores.find(store => store.id === state.userInfo.storeId);
      if (finded) {
        state.curStore = finded;
        state.curStore.store_name = finded.name;
      } else {
        const firstStore = stores[0];
        baseApi.changeEp(firstStore.epId, firstStore.id).done(res => {
          state.curStore = firstStore;
          state.curStore.store_name = firstStore.name;
        });
      }
    }
  },
  setCurStore(state, curStore) {
    state.curStore = curStore;
  },
  setUserStore(state, store) {
    state.userInfo.storeId = store.id;
    state.userInfo.storeName = store.name;
  },
  setSelectedStore(state, selectedStore) {
    state.selectedStore = selectedStore;
  },
  /*全局惟客宝的状态，是否存在惟客宝，以及惟客宝的店铺过期情况*/
  setWkbStatus(state, wkbStatus) {
    state.wkbStatus = wkbStatus;
  },
  /*全局客流宝的状态，是否存在客流宝*/
  setKlbStatus(state, klbStatus) {
    state.klbStatus = klbStatus;
  }
};

const actions = {
  // 获取店铺列表
  fetchStores(store) {
    return baseApi.storeList().then(({ data }) => {
      store.commit('setStores', data);
    });
  },
  // 查询指标说明
  fetchTips(store) {
    return baseApi.quota().then(({ data }) => {
      store.commit('setTips', data);
    });
  }
};

export default new Vuex.Store({
  state: initState,
  mutations,
  actions,
  strict: false
});
