import api from '@/mod-member/src/api/memberAPI';
import { ScoreChangeType } from '@/mod-member/src/enum';

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
    async doScoreChange(params) {
      if (params.value === 0) {
        return;
      }

      return api.scoreCenter.changeValue({
        type: params.value > 0 ? ScoreChangeType.Inc : ScoreChangeType.Dec,
        amount: Math.abs(params.value),
        ...params,
      });
    },
  },
};
