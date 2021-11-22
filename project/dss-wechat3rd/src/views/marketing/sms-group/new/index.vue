<template>
  <div class="sms-new-task"
       v-loading="false">

    <el-breadcrumb class="wkt-breadcrumb-container" separator="/">
      <el-breadcrumb-item :to="{ path: '/marketing/sms-group'}">短信群发</el-breadcrumb-item>
      <el-breadcrumb-item>新建群发</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :model="ruleForm"
             :rules="rules"
             ref="ruleForm"
             label-width="100px"
             class="sms-form">

      <el-form-item label="群发对象"
                    prop="target">
        <el-select size="small"
                   @change="onSelectChanged"
                   v-model="ruleForm.target"
                   placeholder="请选择群发对象">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="手机号码"
                    v-if="ruleForm.target === SMSTargetEnum.PHONE"
                    prop="phones">
        <el-input class="phone"
                  type="textarea"
                  placeholder="一行一个手机号，多个手机号码请换行"
                  :autosize="{ minRows: 6, maxRows: 10}"
                  v-model="ruleForm.phones"></el-input>
      </el-form-item>

      <el-form-item label="用户等级"
                    v-else-if="ruleForm.target === SMSTargetEnum.LEVEL"
                    prop="filterUserLevelIds">
        <el-checkbox :indeterminate="isLevelIndeterminate"
                     v-model="levelCheckAll"
                     @change="handleLevelCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="ruleForm.filterUserLevelIds"
                           @change="handleLevelCheckedChange">
          <el-checkbox v-for="(level, index) in levels"
                       :key="index"
                       :label="level.id">
            {{level.levelName}}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="用户标签"
                    v-else-if="ruleForm.target === SMSTargetEnum.TAG"
                    prop="filterUserLabelIds">
        <el-checkbox :indeterminate="isTagIndeterminate"
                     v-model="tagCheckAll"
                     @change="handleTagCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="ruleForm.filterUserLabelIds"
                           @change="handleTagCheckedChange">
          <el-checkbox v-for="(tag, index) in tags"
                       :key="index"
                       :label="tag">
            {{tag}}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="短信内容"
                    prop="message">
        <el-input class="message"
                  type="textarea"
                  :autosize="{ minRows: 6, maxRows: 10}"
                  v-model="ruleForm.message" />
        <span class="new-msg-tip">* 注：70 字算一条，超过 70 字符后，超过部分，每 67 个字符增加 1 条</span>
        <div class="new-msg-tip">
          已输入 {{ inputLength }} 字（包含签名）
        </div>
      </el-form-item>

      <el-form-item label="群发时间"
                    prop="sendWay">
        <el-radio-group v-model="ruleForm.sendWay">
          <el-radio :label="0">立即</el-radio>
          <el-radio :label="1">定时群发</el-radio>
          <el-date-picker class="send-time"
                          v-model="ruleForm.sendTime"
                          size="mini"
                          :disabled="ruleForm.sendWay === 0"
                          type="datetime"
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button class="sms-btn"
                   size="mini"
                   @click="cancelForm('ruleForm')">取消</el-button>
        <el-button class="sms-btn"
                   size="mini"
                   type="primary"
                   @click="submitForm('ruleForm')">保存</el-button>

      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import SMSTargetEnum from '@/dss-wechat3rd/src/constants/SMSTargetEnum.js';
import Regexps from '@/dss-common/utils/regexps.js';
import DateUtil from '@/dss-common/utils/date.js';
import MemberApi from '@/dss-wechat3rd/src/api/memberAPI.js';
import SMSGroupApi from '@/dss-wechat3rd/src/api/marketingAPI.js';

const selectOptions = [
  {
    value: 0,
    label: '所有会员'
  },
  {
    value: 1,
    label: '手机号'
  },
  {
    value: 2,
    label: '指定等级'
  },
  {
    value: 3,
    label: '指定标签'
  }
];

export default {
  data() {
    const checkPhones = (rule, value, callback) => {
      console.log('checkPhones ------->', value);
      if (!value) {
        return callback(new Error('请输入手机号码'));
      }

      let phones = value.split('\n');
      console.log(phones);
      phones.forEach(phone => {
        if (!Regexps.phone.reg.test(phone)) {
          return callback(new Error('错误手机号码: ' + phone));
        }
      });

      return callback();
    };

    return {
      SMSTargetEnum,
      loading: false,
      options: selectOptions,
      selected: '',
      levelCheckAll: false,
      tagCheckAll: false,
      isLevelIndeterminate: true,
      isTagIndeterminate: true,
      levels: [],
      tags: [],
      SMSCountInfo: {
        remainCount: 0,
        smsSignature: ''
      },
      ruleForm: {
        // 群发对象
        target: '',
        // 手机号码
        phones: '',
        // 用户等级，用逗号隔开
        filterUserLevelIds: [],
        // 用户标签，用逗号隔开
        filterUserLabelIds: [],
        // 短信内容
        message: '',
        // 发送时间，立即 -->传空
        sendTime: null,
        sendWay: 0
      },
      rules: {
        target: [{ required: true, message: '请选择群发对象', trigger: 'change' }],
        phones: [{ validator: checkPhones, required: true, trigger: 'blur' }],
        filterUserLevelIds: [{ type: 'array', required: true, message: '请至少选择一个用户等级', trigger: 'change' }],
        filterUserLabelIds: [{ type: 'array', required: true, message: '请至少选择一个用户标签', trigger: 'change' }],
        message: [
          { required: true, message: '请输入短信内容', trigger: 'blur' },
          { max: 137, message: '请不要超过 2 条短信的长度，即 137 个字符。', trigger: 'blur' }
        ],
        sendTime: [{ required: true, message: '请选群发时间方式', trigger: 'change' }]
      }
    };
  },

  computed: {
    inputLength() {
      return this.ruleForm.message.length + this.SMSCountInfo.smsSignature.length + 2;
    }
  },
  mounted() {
    this.apiGetSMSCountInfo();
  },

  methods: {
    submitForm(formName) {
      console.log('submitForm start ---->');
      this.$refs[formName].validate(valid => {
        console.log('submitForm start ---->', valid);

        if (valid) {
          console.log('submitForm ----->', this.ruleForm);
          this.apiCreateSMSTask();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    apiGetSMSCountInfo() {
      SMSGroupApi.querySMSCountInfo()
        .then(res => {
          this.SMSCountInfo = res.data || {};
        })
        .catch(err => {
          console.error('apiGetSMSCountInfo, error --->', err);
        });
    },

    cancelForm(formName) {
      this.$router.back(-1);
    },

    onSelectChanged(selectedItem) {
      console.log('onSelectChanged ---->', selectedItem);
      if (selectedItem === SMSTargetEnum.LEVEL && !!this.levels && this.levels.length === 0) {
        this.apiGetLevels();
      }

      if (selectedItem === SMSTargetEnum.TAG && !!this.tags && this.tags.length === 0) {
        this.apiGetTags();
      }
    },

    handleLevelCheckAllChange(isSelectLevelAll) {
      console.log('handleLevelCheckAllChange ---->');
      let levelIds = [];
      this.levels.forEach(level => {
        levelIds.push(level.id);
      });
      this.ruleForm.filterUserLevelIds = isSelectLevelAll ? levelIds : [];
      this.isLevelIndeterminate = false;
    },

    handleLevelCheckedChange(val) {
      console.log('handleLevelCheckedChange ---->', val);
      let checkedCount = val.length;
      this.levelCheckAll = checkedCount === this.levels.length;
      this.isLevelIndeterminate = checkedCount > 0 && checkedCount < this.levels.length;
    },

    handleTagCheckAllChange(isSelectTagAll) {
      console.log('handleTagCheckAllChange ---->');
      this.ruleForm.filterUserLabelIds = isSelectTagAll ? this.tags : [];
      this.isTagIndeterminate = false;
    },

    handleTagCheckedChange(val) {
      console.log('handleTagCheckAllChange ---->', val);
      let checkedCount = val.length;
      this.tagCheckAll = checkedCount === this.tags.length;
      this.isTagIndeterminate = checkedCount > 0 && checkedCount < this.tags.length;
    },

    apiGetLevels() {
      // 获取等级列表
      MemberApi.getLevelSimplyList()
        .then(res => {
          this.levels = res.data || [];
          console.log('getLevels ---->', JSON.stringify(this.levels));
        })
        .catch(err => {
          console.error('apiGetLevels', err);
        });
    },

    // 获取用户标签
    apiGetTags() {
      let params = {
        pageNo: 1,
        pageSize: 1000
      };
      MemberApi.getMemberLabelList(params)
        .then(res => {
          console.log('apiGetTags ------------->', JSON.stringify(res));
          this.tags = res.data || [];
        })
        .catch(err => {
          console.error('apiGetTags', err);
        });
    },

    apiCreateSMSTask() {
      this.loading = true;
      let params = this.buildParams();
      SMSGroupApi.createSMSGroupSendTask(params)
        .then(res => {
          console.log('apiCreateSMSTask ---->', res.data);
          if (!!res && res.data) {
            this.$router.back(-1);
          }
        })
        .catch(err => {
          console.error('querySMSPackages', err);
        })
        .always(() => {
          this.loading = false;
        });
    },

    buildParams() {
      let params = {};
      params.message = this.ruleForm.message + '【' + this.SMSCountInfo.smsSignature + '】';
      params.filterType = this.ruleForm.target;
      if (this.ruleForm.sendWay === 1 && !!this.ruleForm.sendTime) {
        params.sendTime = DateUtil.format(new Date(this.ruleForm.sendTime));
      }

      switch (this.ruleForm.target) {
        case SMSTargetEnum.MEMBER:
          break;

        case SMSTargetEnum.PHONE:
          let phones = this.ruleForm.phones.split('\n');
          if (!!phones && phones.length > 0) {
            params.phones = phones.toString();
          }
          break;

        case SMSTargetEnum.LEVEL:
          params.filterUserLevelIds = this.ruleForm.filterUserLevelIds.toString();
          break;

        case SMSTargetEnum.TAG:
          params.filterUserLabelIds = this.ruleForm.filterUserLabelIds.toString();
          break;
      }
      console.log('apiCreateSMSTask ----------->', JSON.stringify(params));
      return params;
    }
  }
};
</script>

<style lang="less">
.sms-new-task {
  .new-msg-tip {
    color: @light-black-color;
    font-size: @small-font;
  }
  .sms-form {
    margin-top: 20px;
  }

  .select {
    margin: 20px;
  }

  .phone {
    width: 300px;
  }

  .message {
    width: 300px;
  }

  .send-time {
    margin-left: 10px;
  }
}
</style>
