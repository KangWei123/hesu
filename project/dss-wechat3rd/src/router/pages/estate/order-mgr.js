export default {
  index: () => import(/* webpackChunkName: "estate-order-mgr" */ '../../../views-estate/order-mgr/index.vue'),
  list: () => import(/* webpackChunkName: "estate-order-mgr" */ '../../../views-estate/order-mgr/list/index.vue'),
  detail: () => import(/* webpackChunkName: "estate-order-mgr" */ '../../../views-estate/order-mgr/detail/index.vue')
};
