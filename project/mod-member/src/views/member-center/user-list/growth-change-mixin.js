import api from '@/mod-member/src/api/memberAPI';

/**
 * 积分变动方法
 */
export default {
  methods: {
    /**
     * @param {{
     * uniqueAccountId: string
     * value: number
     * appId?: number
     * appName?: string
     * desc: string
     * }} params
     */
    async doGrowthChange(params) {
      if (params.value === 0) {
        return;
      }

      // TODO: 接口联调
      return api.growthManager.growthValueChange({
        growthValue: params.value,
        ...params,
      });
    },
  },
};
