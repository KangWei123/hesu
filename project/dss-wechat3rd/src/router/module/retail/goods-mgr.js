/*
 * @Author: Neexz
 * @Date: 2018-11-05 15:35:28
 * @Last Modified by:
 * @Last Modified time: 2020-09-24 15:18:16
 */

import retailPage from '../../pages/retail.js';

export default {
  description: '零售行业的商品管理',

  route: {
    path: '/retail/goods-mgr',
    // redirect: '/retail/goods-mgr/product',
    component: retailPage.goodsMgr.index,
    meta: {
      title: '商品管理'
    },

    children: [
      {
        path: '/retail/goods-mgr/product',
        // redirect: '/retail/goods-mgr/product/list',
        component: retailPage.createGoods.index,
        meta: {
          title: '商品列表'
        },
        children: [
          {
            path: '/retail/goods-mgr/product/list',
            component: retailPage.createGoods.list,
            meta: {
              title: '商品列表',
              keepAlive: true
            }
          },
          {
            path: '/retail/goods-mgr/product/discard',
            component: retailPage.createGoods.discard,
            meta: {
              title: '废弃列表',
              keepAlive: true
            }
          },

          {
            path: '/retail/goods-mgr/product/parameter',
            component: retailPage.createGoods.parameter,
            meta: {
              title: '参数列表',
              keepAlive: true
            }
          },
          {
            path: '/retail/goods-mgr/product/parameter/add-template',
            component: retailPage.createGoods.parameterAdd,
            meta: {
              title: '参数新增模板'
            }
          },
          {
            path: '/retail/goods-mgr/product/question-answer',
            component: retailPage.createGoods.question,
            meta: {
              title: '问答列表',
              keepAlive: true
            }
          },
          {
            path: '/retail/goods-mgr/product/question-answer/add-template',
            component: retailPage.createGoods.questionAdd,
            meta: {
              title: '问答新增模板'
            }
          },

          {
            path: '/retail/goods-mgr/product/list/add',
            component: retailPage.createGoods.addGoods,
            meta: {
              title: '添加产品'
            }
          },
          {
            path: '/retail/goods-mgr/product/discard/add',
            component: retailPage.createGoods.addGoods,
            meta: {
              title: '废弃详情'
            }
          },
          {
            path: '/retail/goods-mgr/product/list/label-manage',
            component: retailPage.createGoods.labelManage,
            meta: {
              title: '管理标签'
            }
          },
          {
            path: '/retail/goods-mgr/product/list/patch-shelves',
            component: retailPage.createGoods.patchShelves,
            meta: {
              title: '门店上下架'
            }
          },
          {
            path: '/retail/goods-mgr/product/quote-list',
            component: retailPage.createGoods.quoteList,
            meta: {
              title: '产品管理',
              keepAlive: true
            }
          },
          {
            path: '/retail/goods-mgr/product/quote-list/add',
            component: retailPage.createGoods.addQuoteGoods,
            meta: {
              title: '添加产品'
            }
          }
        ]
      },
      {
        path: '/retail/goods-mgr/goods-combined',
        component: retailPage.goodsMgr.goodsCombined.index,
        meta: {
          title: '组合商品'
        },
        // redirect: '/retail/goods-mgr/goods-combined/goods-list',
        children: [
          {
            path: '/retail/goods-mgr/goods-combined/goods-list',
            component: retailPage.goodsMgr.goodsCombined.goodsList,
            meta: {
              title: '商品管理',
              keepAlive: true
            }
          },
          {
            path: '/retail/goods-mgr/goods-combined/goods-list/edit',
            component: retailPage.goodsMgr.goodsCombined.edit,
            meta: {
              title: '商品编辑'
            }
          },
          {
            path: '/retail/goods-mgr/goods-combined/goods-list/patch-shelves',
            component: retailPage.createGoods.patchShelves,
            meta: {
              title: '门店上下架'
            }
          },
          {
            path: '/retail/goods-mgr/goods-combined/goods-list/label-manage',
            component: retailPage.createGoods.labelManage,
            meta: {
              title: '管理标签'
            }
          },
          {
            path: '/retail/goods-mgr/goods-combined/discard-list',
            component: retailPage.goodsMgr.goodsCombined.discardList,
            meta: {
              title: '废弃商品',
              keepAlive: true
            }
          },
          {
            path: '/retail/goods-mgr/goods-combined/discard-list/detail',
            component: retailPage.goodsMgr.goodsCombined.edit,
            meta: {
              title: '废弃详情'
            }
          }
        ]
      },

      {
        path: '/retail/goods-mgr/gift-mgr',
        component: retailPage.goodsMgr.giftMgr.index,
        meta: {
          title: '赠品管理'
        },
        // redirect: '/retail/goods-mgr/gift-mgr/list',
        children: [
          {
            path: '/retail/goods-mgr/gift-mgr/list',
            component: retailPage.goodsMgr.giftMgr.goodsList,
            meta: {
              title: '赠品列表',
              keepAlive: true
            }
          },
          {
            path: '/retail/goods-mgr/gift-mgr/list/edit',
            component: retailPage.goodsMgr.giftMgr.edit,
            meta: {
              title: '编辑赠品'
            }
          },
          {
            path: '/retail/goods-mgr/gift-mgr/list/patch-shelves',
            component: retailPage.createGoods.giftPatchShelves,
            meta: {
              title: '门店上下架'
            }
          },
          {
            path: '/retail/goods-mgr/gift-mgr/discard',
            component: retailPage.goodsMgr.giftMgr.discardList,
            meta: {
              title: '废弃赠品',
              keepAlive: true
            }
          },
          {
            path: '/retail/goods-mgr/gift-mgr/discard/detail',
            component: retailPage.goodsMgr.giftMgr.edit,
            meta: {
              title: '废弃赠品详情'
            }
          }
        ]
      },
      {
        path: '/retail/goods-mgr/classfiy',
        component: retailPage.goodsMgr.classfiy.index,
        redirect: '/retail/goods-mgr/classfiy/Pm',
        meta: {
          title: '分类管理'
        },
        children: [
          {
            path: '/retail/goods-mgr/classfiy/Pm',
            component: retailPage.goodsMgr.classfiy.product,
            meta: {
              title: '产品列表'
            }
          },
          {
            path: '/retail/goods-mgr/classfiy/server',
            component: retailPage.goodsMgr.classfiy.server,
            meta: {
              title: '服务列表'
            }
          },
          {
            path: '/retail/goods-mgr/classfiy/detail',
            component: retailPage.goodsMgr.classfiy.detail,
            meta: {
              title: '分类详情'
            }
          },
          {
            path: '/retail/goods-mgr/classfiy/custom-classfiy',
            component: retailPage.goodsMgr.classfiy.custom,
            meta: {
              title: '定制分类'
            }
          }
        ]
      },
      {
        path: '/retail/goods-mgr/shelf',
        component: retailPage.goodsMgr.goodsList.index,
        // redirect: '/retail/goods-mgr/shelf/goods-shelf',
        meta: {
          title: '门店上架'
        },
        children: [
          {
            path: '/retail/goods-mgr/shelf/goods-shelf',
            component: retailPage.goodsMgr.goodsList.goodsShelf,
            meta: {
              title: '普通商品',
              keepAlive: true
            }
          },
          {
            path: '/retail/goods-mgr/shelf/goods-shelf/detail',
            component: retailPage.goodsMgr.goodsList.detail,
            meta: {
              title: '商品详情'
            }
          },
          {
            path: '/retail/goods-mgr/shelf/combined-shelf',
            component: retailPage.goodsMgr.goodsList.combinedShelf,
            meta: {
              title: '组合商品',
              keepAlive: true
            }
          },
          {
            path: '/retail/goods-mgr/shelf/combined-shelf/detail',
            component: retailPage.goodsMgr.goodsList.detail,
            meta: {
              title: '商品详情'
            }
          },
          {
            path: '/retail/goods-mgr/shelf/gift-shelf',
            component: retailPage.goodsMgr.goodsList.giftShelf,
            meta: {
              title: '赠品商品'
            }
          },
          {
            path: '/retail/goods-mgr/shelf/gift-shelf/detail',
            component: retailPage.goodsMgr.goodsList.giftDetail,
            meta: {
              title: '赠品详情'
            }
          }
        ]
      },
      {
        path: '/retail/goods-mgr/comment-mgr',
        component: retailPage.goodsMgr.commentMgr.index,
        // redirect: '/retail/goods-mgr/comment-mgr/list',
        meta: {
          title: '晒单管理',
          keepAlive: true
        },
        children: [
          {
            path: '/retail/goods-mgr/comment-mgr/list',
            component: retailPage.goodsMgr.commentMgr.index,
            meta: {
              title: '晒单管理',
              keepAlive: true
            }
          }
        ]
      },
      {
        path: '/retail/goods-mgr/comment-mgr/set-up',
        component: retailPage.goodsMgr.commentMgr.setUp,
        meta: {
          title: '晒单设置'
        }
      },
      {
        path: '/retail/goods-mgr/comment-mgr/list/edit',
        component: retailPage.goodsMgr.commentMgr.edit,
        meta: {
          title: '新增虚拟评论'
        }
      },
      {
        path: '/retail/goods-mgr/custom-classfiy',
        component: retailPage.goodsMgr.customClassfiy.index,
        meta: {
          title: '定制分类'
        }
      }
    ]
  }
};
