import { validityType } from '../enum/score';
import date from '@/dss-common/utils/date';

export default {
  methods: {
    /**
     * 处理规则删除
     * @param {*} items
     */
    getRulesRemoveMessage(items) {
      const [item] = items;

      const dangerMessage = '当前活动仍在有效期内，删除后活动将终止，是否确认删除?';

      if (item.validType === validityType.permanent) {
        return dangerMessage;
      } else if (item.validType === validityType.custom) {
        const start = date.parse(item.validStartTime);
        const end = date.parse(item.validEndTime);
        const now = new Date();

        if (now >= start && now <= end) {
          return dangerMessage;
        }
      }

      return '是否确认删除该活动?';
    },
  },
};
