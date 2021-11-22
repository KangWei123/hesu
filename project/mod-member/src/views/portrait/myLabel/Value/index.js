import profile_rule from './profile_rule/index.vue';
import event_rule from './event_rule/index.vue';

export default {
  components: { profile_rule, event_rule },
  props: ['item'],
  data() {
    return this.item;
  },
  methods: {
    changeRelation(rule) {
      if (this.$route.query.id) return;
      rule.relation = ++rule.relation % 2;
    },
    addProfileRule(rules) {
      rules.push({
        field: undefined,
        operator: undefined,
        params: undefined,
        key: Date.now(),
      });
    },
    addEventRule(rules) {
      rules.push({
        timeParams: 3,
        field: undefined,
        eventFilter: {
          relation: 0,
          subFilters: [],
        },
        measure: undefined,
        operator: undefined,
        params: undefined,
        key: Date.now(),
      });
    },
  },
};
