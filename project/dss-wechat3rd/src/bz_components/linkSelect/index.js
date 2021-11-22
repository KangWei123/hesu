import activityAPI from '@/dss-wechat3rd/src/api/activity.js';
import categoryAPI from '@/dss-wechat3rd/src/api/wx_store_item.js';
import luckyApi from '@/dss-wechat3rd/src/api/lucky.js';
import checkinApi from '@/dss-wechat3rd/src/api/checkin.js';
import cardPackApi from '@/dss-wechat3rd/src/api/cardPack.js';
import { STATUS as cardPackSTATUS, CHANNEL as cardPackCHANNEL } from '@/dss-wechat3rd/src/constants/cardPackEnum';
import { queryFormList } from '@/dss-wechat3rd/src/views/marketing/form-utils/api/form.js';

import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
const object = (function () {
  const instance = {};

  /**
   * 获取自定义页
   * @param customPages
   * @param currentEditPageIndex
   * @return instance.id 定时队列的id
   */
  instance.getCustomPage = (customPages, currentEditPageIndex) => {
    return new Promise((resolve, reject) => {
      instance.customPages = [];
      (customPages || []).forEach(item => {
        const obj = {
          value: JSON.stringify({
            id: item.index,
            name: item.name,
          }),
          label: item.name,
          imgUrl: item.imgUrl,
        };
        if (currentEditPageIndex === item.index) {
          obj.disabled = true;
        }
        instance.customPages.push(obj);
      });
      console.log('getCustomPage', instance.customPages);
      resolve(true);
    });
  };

  /**
   * 获取活动
   */
  instance.getActivity = () => {
    const params = {
      pageSize: 1000,
      pageNo: 1,
    };
    return activityAPI.supplier.query(params).then(res => {
      if (res.success === true) {
        instance.activity = [];
        (res.data || []).forEach(item => {
          const obj = {
            value: JSON.stringify({
              id: item.topicId,
              name: item.topicName,
            }),
            label: item.topicName,
          };
          instance.activity.push(obj);
        });
        console.log('getActivity', instance.activity);
      }
      return res.success;
    });
  };

  /**
   * 获取幸运大转盘的列表
   */
  instance.getLuckyList = () => {
    const params = {
      pageSize: 1000,
      pageNo: 1,
      // 已删除的转盘不显示
      deleteFlag: 'N',
      // 只查询已开始的活动
      statusList: '0,1,2,3',
      activityScenario: 0,
    };
    return luckyApi.list(params).then(res => {
      const luckyList = (res.data || []).map(item => {
        return {
          value: JSON.stringify({
            id: item.id,
            name: item.activityName,
          }),
          label: item.activityName,
        };
      });

      instance.luckyList = luckyList;
      console.log('getLuckyList', instance.luckyList);
      return res.success;
    });
  };

  /**
   * 获取分类
   */
  instance.getCategory = (type = goodsTypeEnum.product.value) => {
    const params = {
      type,
      pageSize: 1000,
      pageNo: 1,
    };
    return categoryAPI.queryRootCategoryList(params).then(res => {
      if (res.success === true) {
        const specCategories = (res.data || []).map(item => {
          return {
            value: JSON.stringify({
              id: item.id,
              name: item.category,
            }),
            label: item.category,
          };
        });
        switch (type) {
          case goodsTypeEnum.product.value:
            instance.category = specCategories;
            break;
          case goodsTypeEnum.server.value:
            instance.serverCategory = specCategories;
            break;
        }
        console.log('getCategory', instance.category);
      }
      return res.success;
    });
  };

  /**
   * 获取签到详情
   */
  instance.getCheckinDetail = () => {
    return checkinApi.query().then(res => {
      instance.checkinId = res.data && res.data.activityStatus === 1 ? res.data.id : null;
      console.log('getCheckinDetail', res);
      return res.success;
    });
  };

  /**
   * 获取代金卡包
   */
  instance.getCardPack = () => {
    const params = {
      pageSize: 1000,
      pageNo: 1,
      channel: cardPackCHANNEL.REGION.value,
      'statusList[0]': cardPackSTATUS.INITIAL.value,
      'statusList[1]': cardPackSTATUS.ONGOING.value,
      'statusList[2]': cardPackSTATUS.SELL_OUT.value,
    };
    return cardPackApi.list(params).then(res => {
      if (res.success === true) {
        instance.cardPackList = [];
        (res.data || []).forEach(item => {
          const obj = {
            value: JSON.stringify({
              itemNo: item.itemNo,
              name: item.name,
            }),
            label: item.name,
          };
          instance.cardPackList.push(obj);
        });
        console.log('getCardPack', instance.cardPackList);
      }
      return res.success;
    });
  };

  /**
   * 获取表单列表
   */
  instance.getFormList = () => {
    const params = {
      pageSize: 1000,
      pageNo: 1,
    };
    // return queryFormList(params).then(res => {
    //   if (res.success === true) {
    //     instance.formTool = (res.data || []).map(item => {
    //       return {
    //         value: JSON.stringify({
    //           id: item.id,
    //           name: item.name
    //         }),
    //         label: item.name
    //       };
    //     });
    //     console.log('getForm', instance.formTool);
    //   }
    //   return res.success;
    // });
    return [];
  };

  instance.customPages = [];
  instance.activity = [];
  instance.category = [];
  instance.luckyList = [];
  instance.serverCategory = [];
  instance.cardPackList = [];
  instance.formTool = [];
  instance.hasCheckin = false;
  return instance;
})();
export default object;
