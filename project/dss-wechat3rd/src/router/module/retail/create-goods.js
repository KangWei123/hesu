/*
 * @Author: Neexz
 * @Date: 2018-11-05 15:35:28
 * @Last Modified by: Neexz
 * @Last Modified time: 2018-11-07 13:08:12
 */

import retailPage from '../../pages/retail.js';
import page from '../../page.js';

export default {
  description: '零售行业的创建商品',
  route: {
    path: '/retail/create-goods',
    redirect: '/retail/create-goods/list',
    component: retailPage.createGoods.index,
    meta: {
      title: '创建商品'
    },
    children: [
      {
        path: '/retail/create-goods/list',
        component: retailPage.createGoods.list,
        meta: {
          title: '商品列表'
        }
      },
      {
        path: '/retail/create-goods/add-product',
        component: retailPage.createGoods.addGoods,
        meta: {
          title: '添加产品'
        }
      },
      {
        path: '/retail/create-goods/label-manage',
        component: retailPage.createGoods.labelManage,
        meta: {
          title: '管理标签'
        }
      }
    ]
  }
};
