/**
 * 礼品卡状态
 */
export const giftCardStatus = {
  SELF_ACTIVATION: 1,
  GIFT_INACTIVATION: 2,
  GIFT_ACTIVATION: 3,
  INACTIVATION: 4,
  getArray() {
    if (!this.array) {
      this.array = [
        {
          value: this.SELF_ACTIVATION,
          label: '自用已激活',
        },
        {
          value: this.GIFT_INACTIVATION,
          label: '赠送未激活',
        },
        {
          value: this.GIFT_ACTIVATION,
          label: '赠送已激活',
        },
        {
          value: this.INACTIVATION,
          label: '未激活',
        },
      ];
    }
    return this.array;
  },
};
