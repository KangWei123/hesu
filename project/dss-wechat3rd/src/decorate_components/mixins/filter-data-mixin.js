import { mapState } from 'vuex';
import categoryApi from '@/dss-wechat3rd/src/api/category';

export default {
  data() {
    return {
      categoryOptions: [],
    };
  },
  computed: {
    ...mapState(['storeList']),
    storeOptions() {
      const storeList = this.storeList;

      return storeList.slice(1).map(item => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    },
  },
  mounted() {
    this.getFilterData();
  },
  methods: {
    async getFilterData() {
      const [categoryRes] = await Promise.all([categoryApi.category.list()]);

      this.categoryOptions = this.formatCategoryOptions(categoryRes.data);
    },
    formatCategoryOptions(data) {
      return data.map(item => {
        return {
          value: item.id,
          label: item.categoryName,
        };
      });
    },
  },
};
