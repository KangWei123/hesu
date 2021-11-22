import services from '@/dss-common/utils/services';
import eventFilter from './eventFilter/index.vue';

let fieldOptions;

export default {
  props: ['item'],
  mounted() {
    this.addNewTimeType(this.timeParams);
  },
  methods: {
    onDayRangeChanged(val) {
      this.addNewTimeType(val);
    },
    addNewTimeType(val) {
      if (!val) {
        return;
      }
      let num = parseInt(val);
      if (!num) {
        num = 3;
      }

      this.allowCreate = false;
      if (this.timeTypes.indexOf(num) < 0) {
        this.timeTypes.push(num);
      }
      setTimeout(() => {
        this.timeParams = num;
        this.allowCreate = true;
      }, 0);
    },
    changeRelation() {
      if (this.$route.query.id) return;
      this.eventFilter.relation = ++this.eventFilter.relation % 2;
    },
    addFilter() {
      this.eventFilter.subFilters.push({
        filterParam: undefined,
        operator: undefined,
        params: undefined,
        key: Date.now(),
      });
    },
    resetParams(a, b) {
      this.paramsWidget = {};
      const { paramDataType } = this.measureOptions.find(({ paramCode }) => paramCode === this.measure[0]);
      const { filterName, inputType } = this.operatorOptions.find(({ filterCode }) => filterCode === this.operator);
      this.item.operatorName = filterName;
      if (inputType === 1) {
        return (this.params = undefined);
      }
      if (inputType === 0) {
        this.paramsWidget.dom = 'el-input';
        if (paramDataType === 'numeric') {
          this.paramsWidget.type = 'number';
        }
        this.params = undefined;
      } else if (inputType === 2) {
        this.paramsWidget.dom = 'el-date-picker';
        this.paramsWidget.type = 'daterange';
        this.params = undefined;
      } else if (inputType === 3) {
        this.paramsWidget.dom = 'el-date-picker';
        this.params = undefined;
      } else if (inputType === 4) {
        this.paramsWidget.dom = 2;
        if (paramDataType === 'numeric') {
          this.paramsWidget.type = 'number';
        }
        this.params = [];
      }
      if (a === b && this.params === undefined) {
        this.$forceUpdate();
      }
    },
  },
  data() {
    if (this.item.fieldOptions) {
      const { eventMeasures, eventFilters } = this.item.fieldOptions.find(({ event }) => event === this.item.field);
      this.item.measureOptions = eventMeasures;
      this.item.operatorOptions = eventMeasures.find(({ paramCode }) => paramCode === this.item.measure[0]).filters;
      this.item.eventFilters = eventFilters;
      this.item.paramsWidget = {};
      this.$nextTick(() => {
        let params = this.params;
        this.resetParams();
        if (this.paramsWidget.dom === 'el-date-picker') {
          params = new Date(params.slice(0, 4), params.slice(4, 6) - 1, params.slice(-2));
        }
        this.params = params;
        this.$forceUpdate();
      });
    } else {
      if (!fieldOptions) {
        fieldOptions = services
          .get('/wp/portrait/dmp_tag/tag/event/list?analyzeModule=condition_tag')
          .then(({ data }) => {
            data.forEach(({ eventMeasures }) => {
              eventMeasures &&
                eventMeasures.forEach(({ measures }) => {
                  measures &&
                    measures.forEach(item => {
                      item.paramName = item.statisticName;
                      item.paramCode = item.statisticCode;
                    });
                });
            });
            fieldOptions = data;
          });
      }
      this.item.fieldOptions = undefined;
      this.item.measureOptions = [];
      this.item.operatorOptions = undefined;
      this.item.paramsWidget = {};
      Promise.resolve(fieldOptions).then(() => {
        this.fieldOptions = fieldOptions;
        if (this.field) {
          const { eventMeasures, eventFilters } = this.fieldOptions.find(({ event }) => event === this.field);
          this.measureOptions = eventMeasures;
          this.eventFilters = eventFilters;
          this.$forceUpdate();
        } else {
          this.field = fieldOptions[0].event;
          this.item.fieldName = fieldOptions[0].eventName;
        }
      });
    }
    this.actualTimeTypes = [3, 7, 9];
    // this.timeTypes = [3, 7, 9];
    this.actualAllowCreate = true;
    return this.item;
  },
  computed: {
    timeTypes: {
      get() {
        return this.actualTimeTypes;
      },
      set(val) {
        this.actualTimeTypes = val;
      },
    },
    allowCreate: {
      get() {
        return this.actualAllowCreate;
      },
      set(val) {
        this.actualAllowCreate = val;
      },
    },
  },
  watch: {
    field() {
      const { eventName, eventMeasures, eventFilters } = this.fieldOptions.find(({ event }) => event === this.field);
      this.item.fieldName = eventName;
      this.measureOptions = eventMeasures;
      this.eventFilters = eventFilters;
      this.eventFilter.subFilters = [];
      if (!this.measureOptions) {
        return (this.measureOptions = []);
      }
      const measureOption = this.measureOptions[0];
      this.measure = [measureOption.paramCode];
      this.item.measureName = [measureOption.paramName];
      const measures = this.measureOptions[0].measures;
      if (measures) {
        this.measure.push(measures[0].paramCode);
        this.item.measureName.push(measures[0].paramName);
      }
    },
    measure() {
      this.operatorOptions = this.measureOptions.find(({ paramCode }) => paramCode === this.measure[0]).filters;
      if (this.operator === this.operatorOptions[0].filterCode) {
        this.resetParams();
      } else {
        this.operator = this.operatorOptions[0].filterCode;
      }
    },
    operator: 'resetParams',
  },
  components: { eventFilter },
};
