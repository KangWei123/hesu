import baseApi from '@/dss-common/api/base';
import storeApi from '@/dss-common/api/store';

export default {
  getStoreMenus(storeMenus, klbStatus, wkbStatus, curStore, curRole) {
    // const storeMenus = [
    //   {
    //     url: '/overview',
    //     name: '全局概览',
    //     business: '/store.html#',
    //     disabled: !klbStatus,
    //     popTitle: '需购买客流宝套餐'
    //   },

    //   {
    //     url: '/passflow/camera-flow',
    //     name: '门店概览',
    //     business: '/store.html#',
    //     disabled: !klbStatus,
    //     popTitle: '需购买客流宝套餐'
    //   },

    //   {
    //     url: '/passflow/thermal-analysis',
    //     name: '热力分析',
    //     business: '/store.html#',
    //     disabled: !klbStatus,
    //     popTitle: '需购买客流宝套餐'
    //   },

    //   {
    //     url: '/passflow/distribuion-flow',
    //     name: '客流分布',
    //     business: '/store.html#',
    //     disabled: !klbStatus,
    //     popTitle: '需购买客流宝套餐'
    //   },

    //   {
    //     url: '/passflow/usermanage',
    //     name: '客流列表',
    //     business: '/store.html#',
    //     disabled: !klbStatus,
    //     popTitle: '需购买客流宝套餐'
    //   }

    //   // {
    //   //   url: '/camera-flow',
    //   //   name: 'AI人脸客流',
    //   //   business: '/store.html#',
    //   //   childMenu: [
    //   //     {
    //   //       url: '/passflow/camera-flow',
    //   //       name: '门店概览',
    //   //       disabled: !klbStatus,
    //   //       popTitle: '需购买客流宝套餐'
    //   //     },
    //   //     {
    //   //       url: '/passflow/usermanage',
    //   //       name: '用户列表',
    //   //       disabled: !klbStatus,
    //   //       popTitle: '需购买客流宝套餐'
    //   //     },
    //   //     // {
    //   //     //   url: '',
    //   //     //   name: 'AI人脸大屏',
    //   //     //   redirect: '/store/ai.html',
    //   //     //   disabled: !klbStatus,
    //   //     //   popTitle: '需购买客流宝套餐'
    //   //     // }
    //   //     // {
    //   //     //   url: '/passflow/store-layout',
    //   //     //   name: '门店布局',
    //   //     //   disabled: !klbStatus,
    //   //     //   popTitle: '需购买客流宝套餐'
    //   //     // },
    //   //     {
    //   //       url: '/passflow/thermal-analysis',
    //   //       name: '热力分析',
    //   //       disabled: !klbStatus,
    //   //       popTitle: '需购买客流宝套餐'
    //   //     },
    //   //     // {
    //   //     //   url: '/track',
    //   //     //   name: '轨迹分析',
    //   //     //   disabled: !klbStatus,
    //   //     //   popTitle: '需购买客流宝套餐'
    //   //     // },
    //   //     {
    //   //       url: '/passflow/distribuion-flow',
    //   //       name: '客流分布',
    //   //       disabled: !klbStatus,
    //   //       popTitle: '需购买客流宝套餐'
    //   //     }
    //   //   ]
    //   // } //,
    //   //fixme 暂时隐藏ap客流
    //   /*{
    //     url: '/passflow',
    //     name: 'AP客流',
    //     business: '/store.html#',
    //     childMenu: [
    //       {
    //         url: '/passflow/overview',
    //         name: 'AP客流分析',
    //         disabled: !klbStatus,
    //         popTitle: '需购买客流宝套餐'
    //       },
    //       {
    //         url: '/passflow/review',
    //         name: '回访分析',
    //         disabled: !klbStatus,
    //         popTitle: '需购买客流宝套餐'
    //       },
    //       {
    //         url: '/passflow/enterrate',
    //         name: '进店分析',
    //         disabled: !klbStatus,
    //         popTitle: '需购买客流宝套餐'
    //       },
    //       {
    //         url: '/diagnosis/passflow',
    //         name: '客流诊断',
    //         disabled: !klbStatus,
    //         popTitle: '需购买客流宝套餐'
    //       }
    //     ]
    //   },

    //   {
    //     url: '/portrait',
    //     name: '画像分析',
    //     business: '/store.html#',
    //     childMenu: [
    //       {
    //         url: '/portrait/basis',
    //         name: '基础画像',
    //         disabled: !klbStatus,
    //         popTitle: '需购买客流宝套餐'
    //       },
    //       {
    //         url: '/portrait/consumption',
    //         name: '消费画像',
    //         disabled: !klbStatus,
    //         popTitle: '需购买客流宝套餐'
    //       },
    //       {
    //         url: '/portrait/avocation',
    //         name: '兴趣画像',
    //         disabled: !klbStatus,
    //         popTitle: '需购买客流宝套餐'
    //       }
    //     ]
    //   },
    //   {
    //     url: '/activity/list',
    //     name: '活动监测',
    //     business: '/store.html#',
    //     disabled: !klbStatus,
    //     popTitle: '需购买客流宝套餐'
    //   }*/
    // ];

    // // AI人脸大屏菜单项
    // const AIScreenItem = {
    //   url: '',
    //   // name: 'AI人脸大屏',
    //   name: '客流大屏',
    //   disabled: !klbStatus,
    //   business: '/store.html#',
    //   redirect: '',
    //   popTitle: '需购买客流宝套餐'
    // };
    const AIScreenItem = storeMenus.find(item => item.identifier === 'ai_screen');

    if (AIScreenItem) {
      if (!wkbStatus) {
        AIScreenItem.redirect = '/store/ai.html';
        AIScreenItem.url = '';
      } else {
        AIScreenItem.redirect = '';
        AIScreenItem.url = '/passflow/screen-list';
      }
      storeMenus.push(AIScreenItem);
    }

    storeMenus.findIndex(item => item.identifier === 'ai_screen') > 0 &&
      storeMenus.splice(
        storeMenus.findIndex(item => item.identifier === 'ai_screen'),
        1
      );
    storeMenus.findIndex(item => item.identifier === 'store_layout') > 0 &&
      storeMenus.splice(
        storeMenus.findIndex(item => item.identifier === 'store_layout'),
        1
      );

    const storeRequest = storeApi.queryDeviceExist({}).then(rs => {
      let apExist = false;
      let cameraExist = false;
      if (rs.data) {
        cameraExist = rs.data.indexOf('CAMERA') >= 0;
        apExist = rs.data.indexOf('AP') >= 0;
      } else {
        cameraExist = false;
        apExist = false;
      }
      //fixme 暂时隐藏ap客流
      // if (!apExist && storeMenus.length >= 3) {
      //   storeMenus[2].disabled = true;
      //   storeMenus[2].popTitle = '需安装AP设备';
      // }
      // if (!cameraExist) {
      //   storeMenus[1].disabled = true;
      //   storeMenus[1].popTitle = '需安装摄像头设备';
      // }

      if (!cameraExist) {
        storeMenus.forEach((item, i) => {
          if (i > 1) {
            item.disabled = true;
            item.popTitle = '需安装摄像头设备';
          }
        });
      }

      /*商圈不展示人脸*/
      if (curStore && curStore.type === 1) {
        // storeMenus.splice(1, 1);
        storeMenus.splice(1, storeMenus.length);
      }

      /*管理员展示全局概览*/
      if (curRole && curRole !== 'common_role_enterprise') {
        storeMenus.splice(0, 1);
      }

      return storeMenus;
    });

    return Promise.all([storeRequest]).then(result => {
      const finalStoreMenus = result[0] || [];
      return finalStoreMenus;
    });
  }
};
