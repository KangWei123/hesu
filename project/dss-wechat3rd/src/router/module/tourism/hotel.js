/*
 * @Author: yzd
 * @Date: 2019-06-14 15:00:00
 * @Last Modified by: yzd
 * @Last Modified time:  2019-6-14 15:54:00
 */

import tourismPage from '../../pages/tourism/index.js';

export default {
  description: '客房管理',
  route: {
    path: '/hotel-mgr',
    redirect: '/hotel-mgr/rooms-mgr',
    component: tourismPage.goodsMgr.hotelMgr.index,
    meta: {
      title: '客房管理'
    },

    children: [
      {
        path: '/hotel-mgr/rooms-mgr',
        redirect: '/hotel-mgr/rooms-mgr/list',
        component: tourismPage.goodsMgr.hotelMgr.roomsMgr.index,
        meta: {
          title: '房型管理'
        },
        children: [
          {
            path: '/hotel-mgr/rooms-mgr/list',
            component: tourismPage.goodsMgr.hotelMgr.roomsMgr.list,
            meta: {
              title: '房型列表',
              keepAlive: true
            }
          },

          {
            path: '/hotel-mgr/rooms-mgr/discard',
            component: tourismPage.goodsMgr.hotelMgr.roomsMgr.discard,
            meta: {
              title: '废弃列表',
              keepAlive: true
            }
          },
          {
            path: '/hotel-mgr/rooms-mgr/detail',
            component: tourismPage.goodsMgr.hotelMgr.roomsMgr.detail,
            meta: {
              title: '房型详情'
            }
          },
          {
            path: '/hotel-mgr/rooms-mgr/create',
            component: tourismPage.goodsMgr.hotelMgr.roomsMgr.create,
            meta: {
              title: '添加房型'
            }
          },
          {
            path: '/hotel-mgr/rooms-mgr/operation-shelves',
            component: tourismPage.goodsMgr.hotelMgr.roomsMgr.shelf,
            meta: {
              title: '门店上下架'
            }
          }
        ]
      },
      {
        path: '/hotel-mgr/shelf',
        redirect: '/hotel-mgr/shelf/list',
        component: tourismPage.goodsMgr.hotelMgr.shelf.index,
        meta: {
          title: '门店上架'
        },
        children: [
          {
            path: '/hotel-mgr/shelf/list',
            component: tourismPage.goodsMgr.hotelMgr.shelf.list,
            meta: {
              title: '门店上架',
              keepAlive: true
            }
          },
          {
            path: '/hotel-mgr/shelf/detail',
            component: tourismPage.goodsMgr.hotelMgr.shelf.detail,
            meta: {
              title: '房型详情'
            }
          }
        ]
      },
      {
        path: '/hotel-mgr/comment',
        component: tourismPage.goodsMgr.hotelMgr.comments.index,
        meta: {
          title: '评论管理',
          keepAlive: true
        }
      },
      {
        path: '/hotel-mgr/comment/edit',
        component: tourismPage.goodsMgr.hotelMgr.comments.edit,
        meta: {
          title: '新增虚拟评论'
        }
      }
    ]
  }
};
