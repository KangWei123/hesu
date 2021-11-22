export default {
  index: () => import(/* webpackChunkName: "estate-goods-mgr" */ '../../../views-estate/goods-mgr/index.vue'),
  building: {
    index: () => import(/* webpackChunkName: "estate-good-mgr" */ '../../../views-estate/goods-mgr/building/index.vue'),
    list: () =>
      import(/* webpackChunkName: "estate-good-mgr" */ '../../../views-estate/goods-mgr/building/list/index.vue'),
    addGoods: () =>
      import(/* webpackChunkName: "estate-good-mgr" */ '../../../views-estate/goods-mgr/building/add/index.vue'),
    patchShelves: () =>
      import(
        /* webpackChunkName: "estate-good-mgr" */ '../../../views-estate/goods-mgr/building/patch-shelves/index.vue'
      ),
    labelManage: () => import(/* webpackChunkName: "estate-good-mgr" */ '../../../views/label/index.vue'),
    layoutList: () =>
      import(
        /* webpackChunkName: "estate-good-mgr" */ '../../../views-estate/goods-mgr/building/layout/list/index.vue'
      ),
    addLayout: () =>
      import(/* webpackChunkName: "estate-good-mgr" */ '../../../views-estate/goods-mgr/building/layout/add/index.vue')
  },
  comments: {
    index: () => import(/* webpackChunkName: "estate-good-mgr" */ '../../../views-estate/goods-mgr/comment/index.vue'),
    list: () =>
      import(/* webpackChunkName: "estate-good-mgr" */ '../../../views-estate/goods-mgr/comment/list/index.vue'),
    edit: () =>
      import(/* webpackChunkName: "estate-good-mgr" */ '../../../views-estate/goods-mgr/comment/detail/index.vue')
  },
  shelf: {
    index: () => import(/* webpackChunkName: "estate-good-mgr" */ '../../../views-estate/goods-mgr/shelf/index.vue'),
    list: () =>
      import(/* webpackChunkName: "estate-good-mgr" */ '../../../views-estate/goods-mgr/shelf/list/index.vue'),
    detail: () =>
      import(/* webpackChunkName: "estate-good-mgr" */ '../../../views-estate/goods-mgr/shelf/detail/index.vue')
  }
};
