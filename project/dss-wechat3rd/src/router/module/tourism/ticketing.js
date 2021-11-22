/*
 * @Author: yzd
 * @Date: 2019-06-22 17:05:00
 * @Last Modified by: yzd
 * @Last Modified time:  2019-6-22 17:22:00
 */

import tourismPage from '../../pages/tourism/index.js';

export default {
  description: '票务管理',
  route: {
    path: '/ticketing-mgr',
    redirect: '/ticketing-mgr/ticket',
    component: tourismPage.goodsMgr.ticketingMgr.index,
    meta: {
      title: '票务管理'
    },

    children: [
      {
        path: '/ticketing-mgr/ticket',
        redirect: '/ticketing-mgr/ticket/list',
        component: tourismPage.goodsMgr.ticketingMgr.ticketMgr.index,
        meta: {
          title: '票务管理'
        },
        children: [
          {
            path: '/ticketing-mgr/ticket/list',
            component: tourismPage.goodsMgr.ticketingMgr.ticketMgr.list,
            meta: {
              title: '票务列表',
              keepAlive: true
            }
          },

          {
            path: '/ticketing-mgr/ticket/discard',
            component: tourismPage.goodsMgr.ticketingMgr.ticketMgr.discard,
            meta: {
              title: '废弃列表',
              keepAlive: true
            }
          },
          {
            path: '/ticketing-mgr/ticket/detail',
            component: tourismPage.goodsMgr.ticketingMgr.ticketMgr.detail,
            meta: {
              title: '票务详情'
            }
          },
          {
            path: '/ticketing-mgr/ticket/create',
            component: tourismPage.goodsMgr.ticketingMgr.ticketMgr.create,
            meta: {
              title: '添加票务'
            }
          },
          {
            path: '/ticketing-mgr/ticket/operation-shelves',
            component: tourismPage.goodsMgr.ticketingMgr.ticketMgr.shelf,
            meta: {
              title: '门店上下架'
            }
          }
        ]
      },
      {
        path: '/ticketing-mgr/shelf',
        redirect: '/ticketing-mgr/shelf/list',
        component: tourismPage.goodsMgr.ticketingMgr.shelf.index,
        meta: {
          title: '门店上架'
        },
        children: [
          {
            path: '/ticketing-mgr/shelf/list',
            component: tourismPage.goodsMgr.ticketingMgr.shelf.list,
            meta: {
              title: '门店上架',
              keepAlive: true
            }
          },
          {
            path: '/ticketing-mgr/shelf/detail',
            component: tourismPage.goodsMgr.ticketingMgr.shelf.detail,
            meta: {
              title: '票务详情'
            }
          }
        ]
      },
      {
        path: '/ticketing-mgr/comment-mgr',
        component: tourismPage.goodsMgr.ticketingMgr.comments.index,
        meta: {
          title: '评论管理',
          keepAlive: true
        }
      },
      {
        path: '/ticketing-mgr/comment-mgr/edit',
        component: tourismPage.goodsMgr.ticketingMgr.comments.edit,
        meta: {
          title: '新增虚拟评论'
        }
      }
    ]
  }
};
