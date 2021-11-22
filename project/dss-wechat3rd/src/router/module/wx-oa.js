// import pages from '../page';
//
// /**
//  * Created by love on 18/11/2.
//  * @author trumpli<李志伟>
//  */
// export default {
//   description: '微信公众号管理',
//   route: {
//     path: '/wechatoa',
//     redirect: '/wechatoa/oa/overview',
//     component: pages.wechatoa.index,
//     meta: {
//       title: '微信公众号运营'
//     },
//     children: [
//       {
//         path: '/wechatoa/oa/menu',
//         component: pages.wechatoa.menu,
//         meta: {
//           title: '菜单管理'
//         }
//       },
//       {
//         path: '/wechatoa/oa/message',
//         component: pages.wechatoa.message.index,
//         redirect: '/wechatoa/oa/message/list',
//         meta: {
//           title: '消息回复'
//         },
//         children: [
//           {
//             path: '/wechatoa/oa/message/list',
//             component: pages.wechatoa.message.list,
//             meta: {
//               title: '回复列表'
//             }
//           },
//           {
//             path: '/wechatoa/oa/message/keyOperate',
//             component: pages.wechatoa.message.keyOperate,
//             meta: {
//               title: '关键字回复操作'
//             }
//           }
//         ]
//       },
//       {
//         path: '/wechatoa/oa/manage',
//         component: pages.wechatoa.Manage,
//         meta: {
//           title: '消息管理'
//         }
//       },
//       {
//         path: '/wechatoa/oa/materials',
//         component: pages.wechatoa.materials.index,
//         redirect: '/wechatoa/oa/materials/list',
//         meta: {
//           title: '素材管理'
//         },
//         children: [
//           {
//             path: '/wechatoa/oa/materials/list',
//             component: pages.wechatoa.materials.list,
//             meta: {
//               title: '图文素材'
//             }
//           },
//           {
//             path: '/wechatoa/oa/materials/addGraphic',
//             component: pages.wechatoa.materials.addGraphic,
//             meta: {
//               title: '新建图文素材'
//             }
//           },
//           {
//             path: '/wechatoa/oa/materials/addMultimedia',
//             component: pages.wechatoa.materials.addMultimedia,
//             meta: {
//               title: '新建视频音频素材'
//             }
//           }
//         ]
//       },
//       {
//         path: '/wechatoa/oa/overview',
//         component: pages.wechatoa.overview,
//         meta: {
//           title: '公众号概览'
//         }
//       },
//       {
//         path: '/wechatoa/oa/fans',
//         component: pages.wechatoa.fans.index,
//         meta: {
//           title: '粉丝管理'
//         }
//       },
//       {
//         path: '/wechatoa/oa/comment',
//         component: pages.wechatoa.comment,
//         meta: {
//           title: '留言管理'
//         }
//       },
//       {
//         path: '/wechatoa/oa/massMessage',
//         component: pages.wechatoa.massMessage.index,
//         redirect: '/wechatoa/oa/massMessage/list',
//         meta: {
//           title: '消息群发'
//         },
//         children: [
//           {
//             path: '/wechatoa/oa/massMessage/list',
//             component: pages.wechatoa.massMessage.list,
//             meta: {
//               title: '群发列表'
//             }
//           },
//           {
//             path: '/wechatoa/oa/massMessage/add',
//             component: pages.wechatoa.massMessage.add,
//             meta: {
//               title: '新建群发'
//             }
//           },
//           {
//             path: '/wechatoa/oa/massMessage/detail',
//             component: pages.wechatoa.massMessage.detail,
//             meta: {
//               title: '文章数据概览'
//             }
//           },
//           {
//             path: '/wechatoa/oa/massMessage/article',
//             component: pages.wechatoa.massMessage.article,
//             meta: {
//               title: '阅读原文'
//             }
//           }
//         ]
//       }
//     ]
//   }
// };
