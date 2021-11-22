import { mapMutations } from 'vuex';
import manageApi from '@/mod-member/src/api/manage.js';
export default {
  data: function () {
    return {};
  },
  methods: {
    ...mapMutations(['set_client_source', 'set_custormer_client_source']),
    async saveClientSource(list) {
      if (!list) {
        const res = await manageApi.getClientSource();
        list = res.data || [];
      }
      const allSource = [];
      const customerSource = [];
      list.forEach(item => {
        const sourceItem = { ...item };
        if (item.type === 0) {
          sourceItem.requestValue = {
            source: item.id,
          };
        } else if (item.type === 1) {
          sourceItem.requestValue = {
            customerSource: item.id,
          };
          customerSource.push(sourceItem);
        }
        allSource.push(sourceItem);
      });
      this.set_client_source(allSource);
      this.set_custormer_client_source(customerSource);
    },
  },
};
