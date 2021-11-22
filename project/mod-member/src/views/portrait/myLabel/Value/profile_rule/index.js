import services from '@/dss-common/utils/services';
import Api from '@/mod-member/src/api/new-myLabel';
import sourceEnum from '@/mod-member/src/enum/sourceEnum.js';

function paramsWidget() {}

let fieldOptions;
let user_level_name;

export default {
  props: ['item'],
  methods: {
    resetParams(a, b) {
      this.paramsWidget = {};
      const { paramDataType } = this.fieldOptions.find(({ paramCode }) => paramCode === this.field);
      const { inputType } = this.operatorOptions.find(({ filterCode }) => filterCode === this.operator);
      if (inputType === 1) {
        return (this.params = undefined);
      }
      if (this.field === 'user_sex') {
        this.paramsWidget.dom = 'el-select';
        this.paramsWidget.options = [
          { value: '男', label: '男' },
          { value: '女', label: '女' },
        ];
        this.params = this.paramsWidget.options[0].value;
      } else if (this.field === 'user_source') {
        this.paramsWidget.dom = 'el-select';
        this.paramsWidget.options = sourceEnum.CLIENT_SOURCE.map(item => {
          return { value: item.name, label: item.name };
        });
        this.params = this.paramsWidget.options[0].value;
      } else if (this.field === 'user_level_name') {
        this.paramsWidget.dom = 'el-select';
        if (!user_level_name) {
          user_level_name = Api.getVipList().then(({ data }) => {
            user_level_name = data.map(({ levelName }) => {
              return {
                value: levelName,
                label: levelName,
              };
            });
          });
        }
        const paramsWidget = this.paramsWidget;
        Promise.resolve(user_level_name).then(() => {
          if (this.paramsWidget === paramsWidget) {
            paramsWidget.options = user_level_name;
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
    if (this.item.fieldOptions) {
      this.item.operatorOptions = this.item.fieldOptions.find(({ paramCode }) => paramCode === this.item.field).filters;
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
          .get('/wp/portrait/dmp_tag/tag/user_param/list?analyzeModule=condition_tag')
          .then(({ data }) => {
            fieldOptions = data;
          });
      }
      this.item.fieldOptions = undefined;
      this.item.operatorOptions = undefined;
      this.item.paramsWidget = {};
      Promise.resolve(fieldOptions).then(() => {
        this.fieldOptions = fieldOptions;
        if (this.field) {
          this.operatorOptions = this.fieldOptions.find(({ paramCode }) => paramCode === this.field).filters;
          this.$forceUpdate();
        } else {
          this.field = fieldOptions[0].paramCode;
        }
      });
    }
    return this.item;
  },
  computed: {
    fieldModel: {
      get() {
        return this.field;
      },
      set(v) {
        if (v === this.field) return;
        this.field = v;
        this.operator = undefined;
      },
    },
  },
  created() {
    this.$watch(
      function () {
        return [this.field, this.operator];
      },
      function ([newField, newOperator], [oldField, oldOperator]) {
        if (newField !== oldField) {
          const { filters } = this.fieldOptions.find(({ paramCode }) => paramCode === this.field);
          this.operatorOptions = filters;
          if (this.operator === undefined) {
            this.operator = this.operatorOptions[0].filterCode;
            if (this.operator === oldOperator) {
              this.resetParams();
            }
          }
        } else if (newOperator !== oldOperator) {
          this.resetParams();
        }
      }
    );
  },
};
