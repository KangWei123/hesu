import Api from '@/mod-member/src/api/new-myLabel';
import { GoodsSelectDialog } from '@/register/wechat3rd';

let store_name;

export default {
  props: ['item'],
  methods: {
    resetParams(a, b) {
      this.paramsWidget = {};
      const { paramDataType } = this.filterParamOptions.find(({ paramCode }) => paramCode === this.filterParam);
      const { filterName, inputType } = this.operatorOptions.find(({ filterCode }) => filterCode === this.operator);
      this.item.operatorName = filterName;
      if (inputType === 1) {
        return (this.params = undefined);
      }
      if (this.filterParam === 'store_name') {
        this.paramsWidget.dom = 'el-select';
        if (!store_name) {
          store_name = Api.getStoreList().then(({ data }) => {
            store_name = data.map(({ name }) => {
              return {
                value: name,
                label: name,
              };
            });
          });
        }
        const paramsWidget = this.paramsWidget;
        Promise.resolve(store_name).then(() => {
          if (this.paramsWidget === paramsWidget) {
            paramsWidget.options = store_name;
            this.params = paramsWidget.options[0].value;
          }
        });
      } else if (inputType === 0) {
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
    const { fieldOptions, field } = this.$parent;
    const filterParamOptions = fieldOptions.find(({ event }) => event === field).eventFilters;
    this.item.filterParamOptions = filterParamOptions;
    this.item.filterParam = this.item.filterParam || filterParamOptions[0].paramCode;
    this.item.operatorOptions = filterParamOptions.find(({ paramCode }) => paramCode === this.item.filterParam).filters;
    this.item.operator = this.item.operator || this.item.operatorOptions[0].filterCode;
    return this.item;
  },
  created() {
    if (this.params) {
      const params = this.params;
      this.resetParams();
      this.params = params;
    } else {
      this.resetParams();
    }
    this.$watch(
      function () {
        return [this.filterParam, this.operator, this.params];
      },
      function (newVal, oldVal) {
        if (newVal[0] !== oldVal[0]) {
          const { paramName, filters } = this.filterParamOptions.find(
            ({ paramCode }) => paramCode === this.filterParam
          );
          this.item.filterParamName = paramName;
          this.operatorOptions = filters;
          if (this.operator === this.operatorOptions[0].filterCode) {
            this.resetParams();
          } else {
            this.operator = this.operatorOptions[0].filterCode;
          }
        } else if (newVal[1] !== oldVal[1]) {
          this.resetParams();
        }
      }
    );
  },
  components: { GoodsSelectDialog },
};
