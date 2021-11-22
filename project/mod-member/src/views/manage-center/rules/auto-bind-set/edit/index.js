import ruleSetDialog from './rule-set-dialog.vue';
import draggable from 'vuedraggable';
import api from '@/mod-member/src/api/manage.js';
import options from './options';
import services from '@/dss-common/utils/services';
import sourceEnum from '../../../../../enum/sourceEnum';

function formatTime(time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
}

let regions;

export default {
  props: {
    id: Number,
  },
  data() {
    return {
      dialogVisible: false,
      loading: true,
      taskName: '',
      clientSource: undefined,
      form: {
        hour: null,
        minute: null,
        day: null,
      },
      employeeIds: [],
      adminIds: [],
      autoRecoveryTerm: [],
      channelsList: sourceEnum.CLUE_AUTO_BIND,
      rules: {
        taskName: [
          {
            pattern: /^[_\-0-9A-Za-z\u4e00-\u9fa5]+$/i,
            message: '任务名支持字母、数字、汉字、-、或 _',
            trigger: 'blur',
          },
          { required: true, message: '请输入任务名称' },
          { min: 1, max: 32, message: '请输入长度在 1 到 32 位之间的字符' },
        ],
        clientSource: [{ required: true, message: '请选择线索来源' }],
        hour: [
          { pattern: /^0|([1-9]+\d*)$/, message: '时间必须为大于等于0的整数', trigger: 'blur' },
          { required: true, message: '时间不能为空' },
          { type: 'number', min: 0, max: 24, message: '小时只能在0到24之间' },
        ],
        minute: [
          { pattern: /^[1-9]+\d*$/, message: '时间必须为大于0的整数', trigger: 'blur' },
          { required: true, message: '时间不能为空' },
          { type: 'number', min: 1, max: 60, message: '分钟只能在1到60之间' },
        ],
        day: [
          { pattern: /^[1-9]+\d*$/, message: '天数必须为大于0的整数', trigger: 'blur' },
          { required: true, message: '天数不能为空' },
          { type: 'number', min: 1, max: 99, message: '天数必须在1到99之间' },
        ],
        employeeIds: [
          {
            validator: (rule, val, callback) => {
              if (this.distributeRuleList.length >= 1) {
                callback();
              }
              if (!this.employeeIds.length && !this.adminIds.length) {
                return callback('请选择分配范围');
              }
            },
            trigger: 'change',
          },
        ],
      },
      employees: undefined,
      isAutoRecovery: undefined,
      isRepeatReceive: undefined,
      dialog: {
        show: false,
      },
      distributeRuleList: [], // 规则传参列表
      dragging: false,
      editingDistributeRule: undefined,
    };
  },
  filters: {
    source(value) {
      const target = sourceEnum.CLUE_AUTO_BIND.find(item => {
        return item.value === value;
      });
      return target ? target.name : '--';
    },
  },
  components: {
    ruleSetDialog,
    draggable,
  },
  async mounted() {
    if (!this.id) {
      this.loading = false;
      this.clientSource = 13;
      this.isAutoRecovery = false;
      this.isRepeatReceive = true;
      return;
    }
    this.setEmployeeOptions();
    this.loading = true;
    const {
      data: {
        taskName,
        clientSource,
        distributeRuleList,
        isAutoRecovery,
        autoRecoveryTerm,
        isRepeatReceive,
        unableReceiveTerm,
        employeeIds,
        adminIds,
      },
    } = await api.getTaskDetail({ taskId: this.id }).finally(() => {
      this.loading = false;
    });
    distributeRuleList.forEach(distributeRule => {
      distributeRule.adminIdsArr = (distributeRule.adminIds && distributeRule.adminIds.split(',')) || [];
      distributeRule.employeeIdsArr = (distributeRule.employeeIds && distributeRule.employeeIds.split(',')) || [];
      distributeRule.conditionRuleList.forEach(conditionRule => {
        if (conditionRule.fieldValue) {
          // conditionRule.fieldValue都是json字符串
          conditionRule.fieldValueParse = JSON.parse(conditionRule.fieldValue);
          if (conditionRule.fieldValueParse) {
            if (conditionRule.fieldName === 'createTime') {
              if (conditionRule.fieldValueParse.endTime) {
                conditionRule.fieldValueParse = [
                  new Date(+conditionRule.fieldValueParse.startTime),
                  new Date(+conditionRule.fieldValueParse.endTime),
                ];
              } else {
                conditionRule.fieldValueParse = new Date(+conditionRule.fieldValueParse.startTime);
              }
            } else if (conditionRule.fieldName === 'region') {
              conditionRule.regionName = conditionRule.fieldValueParse.regionName;
              conditionRule.fieldValueParse = [
                +conditionRule.fieldValueParse.provinceId,
                +conditionRule.fieldValueParse.cityId,
                +conditionRule.fieldValueParse.districtId,
              ];
            } else {
              conditionRule.fieldValueParse = conditionRule.fieldValueParse.singleValue;
            }
          } else {
            conditionRule.fieldValueParse = undefined;
          }
        } else {
          conditionRule.fieldValueParse = undefined;
        }
        this.parseConditionRule(conditionRule);
      });
    });
    this.taskName = taskName;
    this.clientSource = clientSource;
    this.distributeRuleList = distributeRuleList;
    this.isAutoRecovery = isAutoRecovery;
    this.autoRecoveryTerm = [Math.floor(autoRecoveryTerm / 60), autoRecoveryTerm % 60];
    this.form.hour = Math.floor(autoRecoveryTerm / 60);
    this.form.minute = autoRecoveryTerm - this.form.hour * 60;
    this.isRepeatReceive = isRepeatReceive;
    this.form.day = unableReceiveTerm;
    this.adminIds = (adminIds && adminIds.split(',').filter(adminId => adminId.length)) || [];
    this.employeeIds = (employeeIds && employeeIds.split(',').filter(employeeId => employeeId.length)) || [];
  },
  methods: {
    parseConditionRule(conditionRule) {
      const option = options.find(item => {
        return item.value === conditionRule.fieldName;
      });
      conditionRule.text = option.label;
      const funcType = option.funcTypes.find(item => {
        return item.value === conditionRule.funcType;
      });
      conditionRule.text += ' ' + funcType.label;
      if (conditionRule.fieldValueParse) {
        if (conditionRule.fieldName === 'createTime') {
          if (conditionRule.fieldValueParse.constructor === Date) {
            conditionRule.text += ' ' + formatTime(+conditionRule.fieldValueParse);
          } else {
            conditionRule.text +=
              ' ' +
              formatTime(+conditionRule.fieldValueParse[0]) +
              ' 至 ' +
              formatTime(+conditionRule.fieldValueParse[1]);
          }
        } else {
          if (conditionRule.fieldName === 'region') {
            conditionRule.text += ' ' + (conditionRule.regionName || '');
          } else {
            conditionRule.text += ' ' + conditionRule.fieldValueParse;
          }
        }
      }
    },
    onChange(res) {
      console.log(res);
    },
    setEmployeeOptions() {
      if (!this.employees) {
        services
          .get('/wp/client/guide/list', {
            action: '获取导购员列表',
            params: {
              queryAll: 1,
            },
          })
          .then(({ data }) => {
            this.employees = data || [];
          });
      }
    },
    edit(distributeRule) {
      this.editingDistributeRule = distributeRule;
      this.dialog.show = true;
    },
    close(distributeRule) {
      this.dialog.show = false;
      if (distributeRule) {
        distributeRule.conditionRuleList.forEach(this.parseConditionRule);
        if (this.editingDistributeRule) {
          this.editingDistributeRule.conditionRuleList = distributeRule.conditionRuleList;
          this.editingDistributeRule.adminIdsArr = distributeRule.adminIdsArr;
          this.editingDistributeRule.employeeIdsArr = distributeRule.employeeIdsArr;
        } else {
          this.distributeRuleList.push(distributeRule);
        }
      }
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (!valid) return false;
        if (!this.employeeIds.length) {
          return this.$message({
            message: '请选择其余线索随机分配导购',
          });
        }
        // 序列化处理
        this.distributeRuleList.forEach(distributeRule => {
          distributeRule.adminIds = distributeRule.adminIdsArr.join();
          distributeRule.employeeIds = distributeRule.employeeIdsArr.join();
          distributeRule.conditionRuleList.forEach(conditionRule => {
            conditionRule.relation = 0;
            if (conditionRule.fieldName === 'createTime') {
              if (conditionRule.fieldValueParse.constructor === Date) {
                conditionRule.fieldValue = {
                  startTime: +conditionRule.fieldValueParse + '',
                };
              } else {
                conditionRule.fieldValue = {
                  startTime: +conditionRule.fieldValueParse[0] + '',
                  endTime: +conditionRule.fieldValueParse[1] + '',
                };
              }
            } else if (conditionRule.fieldName === 'region') {
              if (conditionRule.fieldValueParse) {
                conditionRule.fieldValue = conditionRule.fieldValueParse[0] && {
                  provinceId: conditionRule.fieldValueParse[0] + '',
                  cityId: conditionRule.fieldValueParse[1] + '',
                  districtId: conditionRule.fieldValueParse[2] + '',
                  regionName: conditionRule.regionName,
                };
              } else {
                conditionRule.fieldValue = {};
              }
            } else {
              conditionRule.fieldValue = {
                singleValue: conditionRule.fieldValueParse,
              };
            }
            conditionRule.fieldValue = JSON.stringify(conditionRule.fieldValue);
          });
        });
        const params = {
          taskName: this.taskName,
          clientSource: this.clientSource,
          distributeRuleList: this.distributeRuleList,
          isAutoRecovery: this.isAutoRecovery,
          autoRecoveryTerm: this.isAutoRecovery ? this.form.hour * 60 + this.form.minute : null,
          unableReceiveTerm: !this.isRepeatReceive ? this.form.day : null,
          isRepeatReceive: this.isRepeatReceive,
          adminIds: this.adminIds.join(),
          employeeIds: this.employeeIds.join(),
        };
        if (this.id) {
          params.id = this.id;
        }
        this.loading = true;
        api
          .saveTask(params)
          .then(() => {
            this.$message({
              message: `${this.id ? '编辑' : '新增'}自动分发任务成功`,
              type: 'success',
            });
            this.$router.back();
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
};
