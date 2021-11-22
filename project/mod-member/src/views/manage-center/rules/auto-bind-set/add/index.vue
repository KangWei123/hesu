<template>
  <div class="auto-bind-set">
    <div class="auto-bind-container"></div>
    <el-form
      class="form"
      label-width="140px"
      @submit.native.prevent
      ref="form"
      :model="form"
      :rules="rules"
      label-position="right"
      v-loading="loading"
    >
      <el-form-item label="线索任务名称:" prop="taskName">
        <el-input class="form-input" v-model.trim="form.taskName"></el-input>
        <span :style="form.taskName.length > 32 && 'color: red;'"
          >{{ form.taskName ? form.taskName.length : 0 }}/32</span
        >
      </el-form-item>
      <el-form-item label="线索来源:" prop="clientSource">
        <el-select size="mini" class="form-select" v-model="form.clientSource" placeholder="线索来源">
          <el-option
            v-for="(item, index) in [
              { value: 3, taskName: '企业添加' },
              { value: 2, taskName: '会员导入' },
              { value: 4, taskName: '开放平台导入' },
              { value: 5, taskName: 'AI人脸绑定' },
              { value: 6, taskName: '公众号粉丝' },
              { value: 9, taskName: '企业推广' },
            ]"
            :key="index"
            :label="item.taskName"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <div class="sub-header">辅助自动分配规则</div>
      <draggable
        :list="distributeRuleList"
        v-if="distributeRuleList.length"
        class="list-drag"
        ghost-class="ghost"
        @start="dragging = true"
        @end="dragging = false"
      >
        <transition-group>
          <el-form-item :label="'优先级' + (index + 1)" v-for="(element, index) in distributeRuleList" :key="index">
            <div class="bind-rules">
              <div class="bind-item">
                <p class="bind-p">
                  筛选条件:
                  <span v-for="item in element.labels" :key="item.id">
                    {{ item.selection1 || '' }}
                    {{ item.selection2 === '自定义' ? '' : item.selection2 || '' }}
                    {{
                      Array.isArray(item.selection3)
                        ? item.selection3[0] + (item.selection1 === '创建时间' ? ' 至 ' : ' ') + item.selection3[1]
                        : item.selection3 || ''
                    }}
                  </span>
                </p>
              </div>
              <div class="bind-method">
                <a class="bind-btn" @click="onEditRule(element, index)">编辑</a>
                <a class="bind-btn" @click="onDelRule(index)">删除</a>
              </div>
            </div>
          </el-form-item>
        </transition-group>
      </draggable>
      <span class="add-rule" @click="onAddRule" v-if="distributeRuleList.length < 5">+添加分配规则</span>
      <span class="hint align">备注:最多只能添加5条条件规则,点击优先级框选中,可拖动调整优先级顺序</span>
      <!--规则设置-->
      <rule-set-dialog
        :single-list="singleRule"
        :show-rule-dialog="dialog.show"
        :rule-id="editId"
        @setRule="setRule"
        @close="dialog.show = false"
      ></rule-set-dialog>

      <div class="sub-header">收回规则设置</div>
      <el-form-item>
        <el-radio v-model="isAutoRecovery" :label="false">不自动收回</el-radio>
        <el-radio v-model="isAutoRecovery" :label="true">自动收回</el-radio>
        <p class="revoke-rule" v-if="isAutoRecovery">
          <el-form-item prop="hour">
            超过
            <el-input class="mini-input" v-model.number="form.hour" type="number"></el-input>小时
          </el-form-item>
          <el-form-item prop="minute">
            <el-input class="mini-input" v-model.number="form.minute" type="number"></el-input>分钟
            未处理，系统将线索自动收回进行重新分发
          </el-form-item>
        </p>
      </el-form-item>
      <div class="sub-header">领取规则</div>
      <el-form-item>
        <el-radio v-model="isRepeatReceive" :label="true">可重复领取</el-radio>
        <el-radio v-model="isRepeatReceive" :label="false">不可重复领取</el-radio>
        <p class="revoke-rule" v-if="!isRepeatReceive">
          <el-form-item prop="day">
            <el-input class="mini-input" v-model.number="form.day" type="number" autocomplete="off"></el-input>天
            内不能连续领取同一个线索
          </el-form-item>
        </p>
      </el-form-item>
      <div class="sub-header">线索分配范围设置</div>
      <el-form-item label="管理员:">
        <el-select
          size="mini"
          multiple
          default-first-option
          value-key="id"
          @visible-change="setOptions"
          v-model="form.adminIds"
          placeholder="管理员"
          clearable
        >
          <el-option v-for="item in employees" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分配范围员工:">
        <el-select
          size="mini"
          default-first-option
          multiple
          value-key="id"
          @visible-change="setOptions"
          v-model="form.employeeIds"
          placeholder="分配范围员工"
          clearable
        >
          <el-option v-for="item in employees" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSave">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import './index.less';
  import ruleSetDialog from '../component/rule-set-dialog';
  import draggable from 'vuedraggable';
  import api from '@/mod-member/src/api/manage.js';
  import RULES from './rules';
  export default {
    props: {
      id: Number,
    },
    data() {
      return {
        loading: false,
        form: {
          taskName: '',
          clientSource: null,
          hour: null,
          minute: null,
          day: null,
          adminIds: undefined,
          employeeIds: undefined,
        },
        rules: {
          taskName: [
            {
              pattern: /^[_\-0-9A-Za-z\u4e00-\u9fa5]+$/i,
              message: '任务名支持字母、数字、汉字、-、或 _',
              trigger: 'change',
            },
            { required: true, message: '请输入任务名称' },
            { min: 1, max: 32, message: '请输入任务名称，长度在 1 到 32 个字符', trigger: 'blur' },
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
                if (!this.form.employeeIds.length && !this.form.adminIds.length) {
                  return callback('请选择分配范围');
                }
              },
              trigger: 'change',
            },
          ],
        },
        employees: undefined,
        isAutoRecovery: false,
        isRepeatReceive: false,
        dialog: {
          show: false,
        },
        distributeRuleList: [], // 规则传参列表
        copyDistributeRuleList: [],
        singleRule: {},
        dragging: false,
        editId: null,
      };
    },
    components: {
      ruleSetDialog,
      draggable,
    },
    async mounted() {
      if (this.id) {
        console.log(20);
        this.loading = true;
        this.setOptions();
        // 调获取规则详情接口
        const { data } = await api
          .getTaskDetail({
            taskId: this.id,
          })
          .finally(() => {
            this.loading = false;
          });
        // 规则列表
        this.form.taskName = data.taskName;
        this.form.clientSource = data.clientSource;
        this.isAutoRecovery = data.isAutoRecovery;
        this.form.hour = Math.floor(data.autoRecoveryTerm / 60);
        this.form.minute = data.autoRecoveryTerm - this.form.hour * 60;
        this.isRepeatReceive = data.isRepeatReceive;
        this.form.day = data.unableReceiveTerm;
        this.form.adminIds = (data.adminIds && data.adminIds.split(',').map(id => +id)) || [];
        this.form.employeeIds = data.employeeIds && data.employeeIds.split(',').map(id => +id);
        // 规则填充
        if (data.distributeRuleList && data.distributeRuleList.length) {
          for (let i = 0; i < data.distributeRuleList.length; i++) {
            const label = [];
            for (let j = 0; j < data.distributeRuleList[i].conditionRuleList.length; j++) {
              const item = data.distributeRuleList[i].conditionRuleList[j];
              // id 加上当前序号j 避免id重复
              label.push({
                selection1: null,
                selection2: null,
                selection3: null,
                disabled: false,
                id: Date.now() + j,
              });
              label[j].dateRange = false;
              label[j].disabled = false;
              label[j].showDatePicker = false;
              if (item.fieldValue && item.fieldName !== 'createTime' && item.fieldName !== 'region') {
                const fieldValue = JSON.parse(item.fieldValue);
                label[j].selection3 = fieldValue.singleValue;
              }
              label[j].selection1 = RULES.FIELDNAME[item.fieldName];
              switch (item.fieldType) {
                case 0: {
                  label[j].selection2 = RULES.BASE[item.funcType];
                  if (item.funcType === 4 || item.funcType === 5) {
                    label[j].disabled = true;
                  }
                  break;
                }
                case 1: {
                  label[j].selection2 = RULES.TIME[item.funcType];
                  label[j].showDatePicker = true;
                  // 区间
                  if (item.funcType === 3) {
                    label[j].dateRange = true;
                    const start = this.formatTime(parseInt(JSON.parse(item.fieldValue).startTime));
                    const end = this.formatTime(parseInt(JSON.parse(item.fieldValue).endTime));
                    label[j].selection3 = [];
                    label[j].selection3.push(start, end);
                  }
                  // 单个时间
                  else {
                    const startTime = JSON.parse(item.fieldValue).startTime;
                    if (startTime) {
                      const start = this.formatTime(parseInt(startTime));
                      label[j].selection3 = start;
                    }
                  }
                  break;
                }
                case 2: {
                  label[j].selection2 = RULES.AREA[item.funcType];
                  if (label[j].selection2 === '为空' || label[j].selection2 === '不为空') {
                    label[j].disabled = true;
                    continue;
                  }
                  const province = JSON.parse(item.fieldValue).provinceId;
                  let provinceLabel;
                  const city = JSON.parse(item.fieldValue).cityId;
                  let cityLabel;
                  const district = JSON.parse(item.fieldValue).districtId;
                  let districtData;
                  let districtLabel;
                  label[j].area = [parseInt(province), parseInt(city), parseInt(district)];
                  let districtD;
                  api.region().then(({ data }) => {
                    this.loading = true;
                    if (data && data.length) {
                      provinceLabel = data.find(item => {
                        return item.id === parseInt(province);
                      }).name;
                      api
                        .region(province)
                        .done(({ data }) => {
                          cityLabel = (data || []).find(item => {
                            return item.id === parseInt(city);
                          }).name;
                          /**
                           * 获取区接口数据->数组查找
                           * **/
                          api.region(city).done(({ data }) => {
                            districtD = data || [];
                            if (districtD && districtD.length) {
                              districtData = districtD.find(item => {
                                return item.id === parseInt(district);
                              });
                              districtLabel = districtData.name;
                            }
                            if (district) {
                              label[j].selection3 = [provinceLabel, cityLabel, districtLabel];
                            } else {
                              label[j].selection3 = [provinceLabel, cityLabel];
                            }
                          });
                        })
                        .finally(() => {
                          this.loading = false;
                        });
                    }
                  });
                  if (item.funcType === 2 || item.funcType === 3) {
                    label[j].disabled = true;
                  }
                  break;
                }
              }
            }
            data.distributeRuleList[i].labels = label;
          }
          this.distributeRuleList = data.distributeRuleList;
        }
      }
    },
    methods: {
      setOptions() {
        if (!this.employees) {
          return api
            .getEmployee({
              status: 1, // 在职员工
              queryAll: true,
            })
            .then(({ data }) => {
              this.employees = data || [];
            });
        }
      },
      formatTime(time) {
        const date = new Date(time);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month}-${day}`;
      },
      // 数组转为字符串拼接
      joinStaff(arr) {
        const idArr = [];
        if (Array.isArray(arr)) {
          arr.forEach(item => {
            idArr.push(item.id);
          });
          const idStr = idArr.toString();
          return idStr;
        } else {
          return arr;
        }
      },
      onEditRule(element, index) {
        this.editId = element.id;
        this.singleRule = this.distributeRuleList[index];
        this.dialog.show = true;
      },
      onDelRule(index) {
        this.distributeRuleList.splice(index, 1);
      },
      setRule(labelList, rule, employeeIds, adminIds, id) {
        if (id !== undefined) {
          const index = this.distributeRuleList.find(item => {
            return item.id === id;
          });
          index.conditionRuleList = rule;
          index.labels = labelList;
          index.adminIds = adminIds;
          index.employeeIds = employeeIds;
        } else {
          this.distributeRuleList.push({
            id: Date.now(),
            conditionRuleList: rule,
            labels: labelList,
            adminIds,
            employeeIds: employeeIds,
            orderNum: this.distributeRuleList.length + 1,
          });
        }
      },
      onAddRule() {
        this.editId = null;
        this.singleRule = {};
        this.dialog.show = true;
      },
      onSave() {
        // 外层的线索分配范围
        this.$refs.form.validate(valid => {
          if (!valid) return false;
          // 去除id和label字段
          this.copyDistributeRuleList = this.distributeRuleList.map(item => {
            item.employeeIds = this.joinStaff(item.employeeIds);
            item.adminIds = this.joinStaff(item.adminIds);
            return item;
          });
          const params = {
            taskName: this.form.taskName,
            clientSource: this.form.clientSource,
            isAutoRecovery: this.isAutoRecovery,
            autoRecoveryTerm: this.isAutoRecovery ? this.form.hour * 60 + this.form.minute : null,
            isRepeatReceive: this.isRepeatReceive,
            unableReceiveTerm: !this.isRepeatReceive ? this.form.day : null,
            adminIds: this.form.adminIds.join(),
            employeeIds: this.form.employeeIds.join(),
            distributeRuleList: this.copyDistributeRuleList || null,
          };
          // 编辑
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
</script>
