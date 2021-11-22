<template>
  <form-page-layout
    :model="scoreForm"
    :rules="rules"
    ref="scoreForm"
    label-width="100px"
    class="scoreForm"
    :back-on-submit-sucess="false"
    :submit-handler="handleCheckBeforeSubmit"
    :title-visible="false"
    :disabled="disabled"
    :submit-sucess-text="''"
  >
    <form-group>
      <template #title>{{ title }}</template>
      <el-form-item label="积分动作" prop="eventKey">
        <template v-if="!id">
          <score-type-select
            v-model="scoreForm.eventKey"
            placeholder="请选择积分动作"
            remote
            filter-system-event
            :source="scoreType"
            :disabled-item="disabledItem"
            @change="onChangeSelectType"
            @getOpentionId="getOpentionId"
          >
          </score-type-select>
          <el-tooltip v-if="globalIsUmpPlatformApp" content="如积分动作已被创建，将无法再次选择" placement="top">
            <i class="el-icon-warning select-tip"></i>
          </el-tooltip>
        </template>
        <el-input v-else :value="scoreForm.eventName || scoreForm.eventKey" disabled />
      </el-form-item>

      <template v-if="!globalIsUmpPlatformApp && formContent">
        <template v-if="env.BUSINESS_CENTER ? true : scoreForm.eventKey !== 'event_offline_consume'">
          <label class="label-content">{{ formContent.content }}</label>
          <label class="label-set" @click="onSet()">去设置</label>
        </template>
        <template v-else>
          <label class="label-content">暂不支持配置该规则</label>
        </template>
      </template>

      <el-form-item
        label="规则名称"
        prop="ruleName"
        placeholder="请输入规则名称"
        v-if="!globalIsUmpPlatformApp && scoreForm.eventKey === 'event_consume'"
      >
        <el-input v-model="scoreForm.ruleName" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item
        label="有效时间"
        prop="validType"
        v-if="globalIsUmpPlatformApp || scoreForm.eventKey === 'event_consume'"
      >
        <el-radio-group v-model="scoreForm.validType">
          <el-radio :label="1">永久有效</el-radio>
          <el-radio :label="2">固定时间段</el-radio>
        </el-radio-group>
        <div>
          <el-form-item v-if="scoreForm.validType === validityType.custom" prop="dateRange">
            <el-date-picker
              v-model="scoreForm.dateRange"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerStart"
              value-format="yyyy-MM-dd HH:mm:ss"
              @blur="handleChange"
            />
          </el-form-item>
        </div>
      </el-form-item>

      <el-form-item
        label="获取规则"
        placeholder="10"
        prop="rule"
        v-if="!globalIsUmpPlatformApp && scoreForm.eventKey === 'event_consume'"
      >
        每消耗
        <el-input
          v-model="configDetail.consume"
          @input="checkProportion('consume', 1, 10000)"
          maxlength="10"
          style="width: 60px"
        ></el-input>
        元获得1积分；<br />单笔订单获取积分上限为消费金额的
        <el-input
          v-model="configDetail.proportion"
          @input="checkProportion('proportion', 1, 100)"
          maxlength="10"
          style="width: 60px"
        ></el-input>
        %
      </el-form-item>

      <el-form-item label="适用应用" prop="appType" v-if="globalIsUmpPlatformApp">
        <el-radio-group v-model="scoreForm.appType" style="margin-top: 13px">
          <el-radio :label="1">不限制</el-radio>
          <el-radio :label="2" @click.native="handleGetscore">选择应用</el-radio>
        </el-radio-group>
        <div v-if="scoreForm.appType === AppType.custom && appList && appList.length">
          <el-table :data="appList" class="wkt-table">
            <el-table-column label="应用名称" width="200" prop="appName" />
            <el-table-column label="对应业态" width="180" prop="category" />
            <el-table-column label="appId" width="100" prop="id" />
            <el-table-column label="操作" min-width="120" v-if="!disabled">
              <template slot-scope="scope">
                <a href="javascript:;" class="table-href" @click="handleRemoveApp(scope.row)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>

      <select-good
        v-if="!globalIsUmpPlatformApp && scoreForm.eventKey === 'event_consume'"
        :value="configDetail"
        :disabled="disabled"
        @update="handleUpdateConfig"
      />
    </form-group>

    <app-select-dialog
      ref="appSelect"
      :selected-list="appList"
      enable-multiple
      v-model="showAppDialog"
      @selected="onAppItemChoosed"
    />

    <base-dialog ref="dialog">
      <template #content>
        <div class="dialog_content">{{ tipContent }}</div>
        <div class="dialog_content">{{ tipContentSub }}</div>
      </template>
      <template #footer>
        <el-button @click="handleSubmit">保 存</el-button>
        <el-button type="primary" @click="handleClose">取 消</el-button>     
      </template>
    </base-dialog>

    <template v-if="disabledFoot" #footer>
      <form-button action="cancel"></form-button>
      <form-button></form-button>
    </template>
  </form-page-layout>
</template>

<script>
  import { mapState } from 'vuex';
  import { validityType, appType as AppType } from '../enum/score';
  import AppSelectDialog from '@/business-common/components/app-select-dialog';
  import memberApi from '@/mod-member/src/api/memberAPI';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import ScoreTypeSelect from '@/mod-member/src/components/score-type-select/index.vue';
  import BaseDialog from '@/dss-common/components/base-dialog';
  import SelectGood from './select-good.vue';
  import { CHOOSE_TYPE, EVENT_TYPE } from './constants.ts';

  export default {
    components: {
      FormPageLayout,
      FormButton,
      AppSelectDialog,
      ScoreTypeSelect,
      FormGroup,
      BaseDialog,
      SelectGood,
    },
    props: {
      scoreType: {
        type: Number,
        default: 1,
      },
      // eslint-disable-next-line vue/require-default-prop
      title: String,
    },
    data() {
      return {
        validityType,
        AppType,
        tipContent: '',
        tipContentSub: '',
        // 原始数据
        origin: null,
        scoreForm: {
          ruleName: '',
          eventKey: null,
          validStartTime: null,
          validType: validityType.permanent,
          dateRange: [],
          appType: AppType.none,
          parentId: '',
        },
        configDetail: {
          categories: [], // 适用的商品分类
          consume: '', // 消费金额
          dimension: 1, // 适用维度:1:商品,2:商户
          items: [], // 适用的商品
          proportion: '', // 消费金额比例
          type: CHOOSE_TYPE.CATEGORY,
          showTags: [], // 显示列表
        },
        rules: {
          ruleName: [
            { required: true, message: '请输入规则名称', trigger: 'blur' },
            { min: 1, max: 80, message: '长度在 1 到 80 个字符', trigger: 'blur' },
          ],
          eventKey: [{ required: true, message: '请选择积分动作', trigger: 'change' }],
          validType: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (value === validityType.custom) {
                  if (this.scoreForm.dateRange == null || !this.scoreForm.dateRange.length) {
                    return callback(new Error('请选择时间段'));
                  }
                }
                callback();
              },
            },
          ],
          rule: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!this.configDetail.consume || !this.configDetail.proportion) {
                  return callback(new Error('请设置获取规则'));
                }
                callback();
              },
            },
          ],
          appType: [
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (value === AppType.custom && (this.appList == null || !this.appList.length)) {
                  return callback(new Error('请选择应用'));
                }
                callback();
              },
            },
          ],
          goodType: [
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, callback) => {
                switch (this.configDetail.type) {
                  case CHOOSE_TYPE.GOODS:
                    if (!this.configDetail.items.length) {
                      return callback(new Error('请选择商品'));
                    }
                    break;
                  case CHOOSE_TYPE.CATEGORY:
                    if (!this.configDetail.categories.length) {
                      return callback(new Error('请选择商品分类'));
                    }
                    break;
                }
                callback();
              },
            },
          ],
        },
        showAppDialog: false,
        appList: [],
        formContent: null,
      };
    },
    computed: {
      ...mapState({
        env: 'env',
      }),
      pickerStart() {
        return {
          disabledDate: time => time.getTime() < Date.now() - 24 * 60 * 60 * 1000, // 只能选择今天以后的日期
        };
      },
      id() {
        return this.$route.query.id;
      },
      isEdit() {
        return !!this.id;
      },
      disabled() {
        return !!this.$route.query.disabled;
      },
      disabledFoot() {
        if (this.$route.query.disabled) {
          // 详情
          return false;
        } else {
          if (this.globalIsUmpPlatformApp) {
            // 集团
            return true;
          } else {
            if (this.scoreForm.eventKey === 'event_consume') {
              return true;
            } else {
              return false;
            }
          }
        }
      },
    },
    mounted() {
      if (this.isEdit) {
        this.getDetail();
      }
    },
    methods: {
      handleChange() {
        this.$refs.scoreForm.validate();
      },
      checkProportion(type = 'proportion', min = 0, max = 10000) {
        const regex = /^\d+$/;
        // value=value.replace(/[^0-9.]/g,'')"
        if (type === 'proportion') {
          if (regex.test(this.configDetail.proportion)) {
            if (this.configDetail.proportion > max || this.configDetail.proportion < min) {
              this.configDetail.proportion = '';
            }
          } else {
            this.configDetail.proportion = '';
          }
        } else {
          if (regex.test(this.configDetail.consume)) {
            if (this.configDetail.consume > max || this.configDetail.consume < min) {
              this.configDetail.consume = '';
            }
          } else {
            this.configDetail.consume = '';
          }
        }
      },
      handleGetscore() {
        if (!this.disabled) {
          this.showAppDialog = true;
        }
      },
      getOpentionId(item) {
        // 非集团的新增修改传parentId，用于后台在集团中判断此应用是否可以删除
        if (!this.globalIsUmpPlatformApp) {
          this.scoreForm.parentId = item.id;
        }
      },

      onChangeSelectType() {
        this.formContent = EVENT_TYPE[this.scoreForm.eventKey] || null;
      },
      handleUpdateConfig(config) {
        this.configDetail = { ...this.configDetail, ...config };
        this.$refs.scoreForm.validateField('goodType');
      },
      disabledItem(item) {
        if (this.isEdit && this.origin && item.eventKey === this.origin.eventKey) {
          return false;
        }
        return !!item.exist;
      },
      isDisabled() {
        return this.isEdit;
      },
      async getDetail() {
        const { data } = await memberApi.scoreCenter.detail({ id: this.id });
        this.origin = data;

        // 规范化数据
        const { validApp, validStartTime, validEndTime, configDetail, ...other } = data;
        const form = other;
        if (data.validType === validityType.custom) {
          form.dateRange = [validStartTime, validEndTime];
        } else {
          form.validStartTime = validStartTime;
        }
        if (configDetail) {
          configDetail.type = configDetail.categories.length ? CHOOSE_TYPE.CATEGORY : CHOOSE_TYPE.GOODS;
          configDetail.showTags = configDetail.categories.length
            ? configDetail.categories
            : configDetail.items.map(i => ({ ...i, itemNo: i.id }));
          configDetail.items = configDetail.items.map(i => i.id);
          configDetail.categories = configDetail.categories.map(i => i.id);
          this.configDetail = configDetail;
        }

        if (validApp === '0') {
          form.appType = AppType.none;
        } else {
          form.appType = AppType.custom;
          this.appList = await this.$refs.appSelect.initial(validApp.split(','));
        }

        // appList 回显
        this.scoreForm = form;
      },
      onAppItemChoosed(row) {
        // this.appList = uniqBy(this.appList.concat(row), 'id');

        this.appList = row;
        this.$refs.scoreForm.validateField('appType');
      },
      handleRemoveApp({ id }) {
        this.appList.splice(
          this.appList.findIndex(i => i.id === id),
          1
        );
      },

      // 各种跳转
      onSet() {
        if (this.formContent.url && this.formContent.url.indexOf('.html') > -1) {
          window.top.location.href = this.formContent.url;
        } else if (this.formContent.url && this.formContent.url.indexOf('.com') > -1) {
          window.open(this.formContent.url, '_blank');
        } else {
          this.$router.push({ path: this.formContent.url });
        }
      },
      getParams() {
        const { dateRange, appType, ...params } = this.scoreForm;
        params.ruleType = this.scoreType;

        // 时间段处理
        if (this.scoreForm.validType === validityType.custom) {
          params.validStartTime = dateRange[0];
          params.validEndTime = dateRange[1];
        }

        if (appType === AppType.none) {
          params.appIdList = [0];
        } else {
          params.appIdList = this.appList.map(i => i.id);
        }

        // 后台没有对对象中的值做验证，所以要去掉
        if (this.scoreForm.eventKey === 'event_consume' || this.scoreForm.eventKey === 'event_deduction') {
          params.configDetail = this.configDetail;
        }
        if (this.id) {
          params.id = this.id;
        }
        return params;
      },
      handleClose() {
        this.$refs.dialog.hide();
      },
      handleCheckBeforeSubmit() {
        if (!this.isEdit) {
          this.handleSubmit();
          return;
        }
        const params = this.getParams();
        memberApi.scoreCenter.checkUpdateConfig(params).then(({ data: { appName, isUpdate } }) => {
          if (!isUpdate) {
            this.handleSubmit();
            return;
          }
          if (appName.length) {
            let msg = `涉及到的应用有：`;
            msg += appName.map(i => `【${i}】`).join('、');
            this.tipContent = `警告：此次【${params.ruleName}】积分动作权限修改，将导致部分适用应用下相关动作的事件将直接失效，请确认是否保存此次积分动作修改？`;
            this.tipContentSub = msg;
          } else {
            this.tipContent = `警告：此次【${params.ruleName}】积分动作权限修改，将导致部分适用应用无法继续创建该动作下的事件，请确认是否保存此次积分动作修改？`;
            this.tipContentSub = '';
          }
          this.$refs.dialog.show();
        });
      },
      async handleSubmit() {
        const params = this.getParams();
        if (this.isEdit) {
          await memberApi.scoreCenter.update(params);
        } else {
          await memberApi.scoreCenter.add(params);
        }
        this.$router.go(-1);
        this.$message.success('保存成功');
      },
    },
  };
</script>

<style lang="less" scoped>
  .el-input,
  .el-select {
    width: 220px;
  }

  .select-tip {
    color: #3591ff;
    margin-left: 6px;
  }

  .label-content {
    color: #959595;
    margin-left: 100px;
    margin-right: 25px;
  }

  .label-set {
    color: #fa7516;
    cursor: pointer;
  }

  .dialog_content {
    text-align: left;
    margin-bottom: 10px;
  }
</style>
