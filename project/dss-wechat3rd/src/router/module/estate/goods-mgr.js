import estatePage from '../../pages/estate/index.js';

export default {
  description: '地产行业的商品管理',

  route: {
    path: '/estate/goods-mgr',
    redirect: '/estate/goods-mgr/building',
    component: estatePage.goodsMgr.index,
    meta: {
      title: '楼盘管理'
    },

    children: [
      {
        path: '/estate/goods-mgr/building',
        redirect: '/estate/goods-mgr/building/list',
        component: estatePage.goodsMgr.building.index,
        meta: {
          title: '楼盘列表'
        },
        children: [
          {
            path: '/estate/goods-mgr/building/list',
            component: estatePage.goodsMgr.building.list,
            meta: {
              title: '楼盘列表',
              keepAlive: true
            }
          },
          {
            path: '/estate/goods-mgr/building/list/add',
            component: estatePage.goodsMgr.building.addGoods,
            meta: {
              title: '添加楼盘'
            }
          },
          {
            path: '/estate/goods-mgr/building/list/patch-shelves',
            component: estatePage.goodsMgr.building.patchShelves,
            meta: {
              title: '区域上下架'
            }
          },
          {
            path: '/estate/goods-mgr/building/list/label-manage',
            component: estatePage.goodsMgr.building.labelManage,
            meta: {
              title: '管理标签'
            }
          },
          {
            path: '/estate/goods-mgr/building/list/layout/list',
            component: estatePage.goodsMgr.building.layoutList,
            meta: {
              title: '户型列表'
            }
          },
          {
            path: '/estate/goods-mgr/building/list/layout/add',
            component: estatePage.goodsMgr.building.addLayout,
            meta: {
              title: '编辑户型'
            }
          }
        ]
      },
      {
        path: '/estate/goods-mgr/comment',
        redirect: '/estate/goods-mgr/comment/list',
        component: estatePage.goodsMgr.comments.index,
        meta: {
          title: '评论列表'
        },
        children: [
          {
            path: '/estate/goods-mgr/comment/list',
            component: estatePage.goodsMgr.comments.list,
            meta: {
              title: '评论列表',
              keepAlive: true
            }
          },
          {
            path: '/estate/goods-mgr/comment/list/edit',
            component: estatePage.goodsMgr.comments.edit,
            meta: {
              title: '添加虚拟评论'
            }
          }
        ]
      },
      {
        path: '/estate/goods-mgr/shelf',
        redirect: '/estate/goods-mgr/shelf/list',
        component: estatePage.goodsMgr.shelf.index,
        meta: {
          title: '上下架'
        },
        children: [
          {
            path: '/estate/goods-mgr/shelf/list',
            component: estatePage.goodsMgr.shelf.list,
            meta: {
              title: '商品列表',
              keepAlive: true
            }
          },
          {
            path: '/estate/goods-mgr/comment/list/edit',
            component: estatePage.goodsMgr.shelf.detail,
            meta: {
              title: '商品详情'
            }
          }
        ]
      }
    ]
  }
};
