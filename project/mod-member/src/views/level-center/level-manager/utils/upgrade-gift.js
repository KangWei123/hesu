import { UPGRADE_GIFTS_TYPE } from '@/mod-member/src/enum/levelConst';
import couponEnum from '@/mod-member/src/enum/couponEnum';
import Vue from 'vue';

/**
 * 格式化升级礼包
 * @param { [appId]: { score: number, coupons: [] } } data 升级礼包数据
 * @param { [{id}] } appList 应用列表
 * @returns
 */
export function formatUpgradeGifts(data, appList) {
  const upgradeGifts = [];
  for (const { id: appId } of appList) {
    const { score, coupons } = data[appId];
    const gifts = [];

    if (score && score > 0) {
      gifts.push({
        score,
        giftType: UPGRADE_GIFTS_TYPE.SCORE,
        coupons: [],
      });
    }

    if (coupons.length) {
      gifts.push({
        coupons,
        score: 0,
        giftType: UPGRADE_GIFTS_TYPE.COUPON,
      });
    }

    gifts.length && upgradeGifts.push({ appId, gifts });
  }

  return upgradeGifts;
}

export function pretreatmentCoupon(coupon) {
  coupon.originStatus = coupon.status; // 保留原状态
  // FINISH的转换为VALID
  if (coupon.status === couponEnum.status.FINISH) {
    coupon.status = couponEnum.status.VALID;
  }

  coupon.count || Vue.set(coupon, 'count', ''); // 初始化赠券数

  const isValid = !!coupon.couponId;
  Vue.set(coupon, 'couponId', coupon.id || coupon.couponId); // 保证couponId存在

  return isValid;
}

/**
 * 从礼包中提取积分及优惠券
 */
export function getScoreAndCoupons(gifts) {
  const gift = { coupons: [], score: 0 };
  for (const item of gifts) {
    if (item.giftType === UPGRADE_GIFTS_TYPE.SCORE) {
      gift.score += item.score;
    } else if (item.giftType === UPGRADE_GIFTS_TYPE.COUPON) {
      gift.coupons.push(...item.coupons.filter(pretreatmentCoupon));
    }
  }

  if (!gift.score) {
    gift.score = '';
  }

  return gift;
}

/**
 * 计算最大赠券数
 */
export function calcMaxCount({ quantity, issueAmount }) {
  return 999999;
  // if (quantity === couponEnum.QUANTITY.UNLIMITED) {
  //   return Number.MAX_VALUE;
  // }

  // return quantity - issueAmount;
}

/**
 * 检测赠券数是否有效
 */
export function validateCount({ count, quantity, issueAmount, status }) {
  if (status !== couponEnum.status.VALID) return true;
  return !!count && count <= calcMaxCount({ quantity, issueAmount });
}
