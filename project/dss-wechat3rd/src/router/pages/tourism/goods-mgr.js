export default {
  hotelMgr: {
    index: () => import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/hotel-mgr/index.vue'),
    roomsMgr: {
      index: () => import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/hotel-mgr/rooms-mgr/index.vue'),
      list: () =>
        import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/hotel-mgr/rooms-mgr/rooms-list/index.vue'),
      discard: () =>
        import(
          /* webpackChunkName: "goods-mgr-mgr" */
          '../../../views-tourism/hotel-mgr/rooms-mgr/rooms-list/discard-list.vue'
        ),
      detail: () =>
        import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/hotel-mgr/rooms-mgr/rooms-detail/index.vue'),
      create: () =>
        import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/hotel-mgr/rooms-mgr/rooms-create/index.vue'),
      shelf: () =>
        import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/hotel-mgr/rooms-mgr/rooms-shelf/index.vue')
    },
    shelf: {
      index: () => import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/hotel-mgr/shelf/index.vue'),
      list: () => import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/hotel-mgr/shelf/list.vue'),
      detail: () => import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/hotel-mgr/shelf/detail.vue')
    },
    comments: {
      index: () => import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/hotel-mgr/comment-mgr/index.vue'),
      edit: () =>
        import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/hotel-mgr/comment-mgr/detail/index.vue')
    }
  },

  ticketingMgr: {
    index: () => import(/* webpackChunkName: "ticketing-mgr" */ '../../../views-tourism/ticketing-mgr/index.vue'),
    ticketMgr: {
      index: () =>
        import(/* webpackChunkName: "ticketing-mgr" */ '../../../views-tourism/ticketing-mgr/ticket-mgr/index.vue'),
      list: () =>
        import(
          /* webpackChunkName: "ticketing-mgr" */
          '../../../views-tourism/ticketing-mgr/ticket-mgr/ticket-list/index.vue'
        ),
      discard: () =>
        import(
          /* webpackChunkName: "goods-mgr-mgr" */
          '../../../views-tourism/ticketing-mgr/ticket-mgr/ticket-list/discard-list.vue'
        ),
      detail: () =>
        import(
          /* webpackChunkName: "ticketing-mgr" */
          '../../../views-tourism/ticketing-mgr/ticket-mgr/ticket-detail/index.vue'
        ),
      create: () =>
        import(
          /* webpackChunkName: "ticketing-mgr" */
          '../../../views-tourism/ticketing-mgr/ticket-mgr/ticket-create/index.vue'
        ),
      shelf: () =>
        import(
          /* webpackChunkName: "ticketing-mgr" */
          '../../../views-tourism/ticketing-mgr/ticket-mgr/ticket-shelf/index.vue'
        )
    },
    shelf: {
      index: () => import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/ticketing-mgr/shelf/index.vue'),
      list: () => import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/ticketing-mgr/shelf/list.vue'),
      detail: () => import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/ticketing-mgr/shelf/detail.vue')
    },
    comments: {
      index: () =>
        import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/ticketing-mgr/comment-mgr/index.vue'),
      edit: () =>
        import(/* webpackChunkName: "hotel-mgr" */ '../../../views-tourism/ticketing-mgr/comment-mgr/detail/index.vue')
    }
  }
};
