<template>
  <div class="page-content">
    <div class="container">
      <el-form
        ref="form"
        v-loading="loading"
        :model="form"
        :rules="rules"
        label-width="140px"
        @submit.native.prevent="handleSave"
      >
        <div>
          <el-form-item label="活动名称" prop="name" :error="titleError">
            <el-input v-if="!freezed" v-model="form.name" maxlength="25" class="w220" placeholder="请输入"></el-input>
            <p v-else>{{ form.name }}</p>
          </el-form-item>

          <el-form-item label="活动类型" prop="typeId">
            <el-select v-if="!freezed" v-model="form.typeId" class="w220">
              <el-option v-for="item of types" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
            <p v-else>{{ origin.typeName }}</p>
          </el-form-item>

          <el-form-item label="活动范围" prop="prjScopeType">
            <div>
              <el-radio v-model="form.prjScopeType" :label="1" :disabled="freezed">不限制</el-radio>
              <el-radio v-model="form.prjScopeType" :label="2" :disabled="freezed">选择项目</el-radio>
            </div>

            <div class="table-in-form" v-if="form.prjScopeType === 2">
              <el-table :data="form.projects" size="mini" style="width: 400px">
                <el-table-column prop="name" label="项目名称" width="150"></el-table-column>
                <el-table-column prop="areaName" label="所属区域" width="120"></el-table-column>
                <el-table-column v-if="!freezed" label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button @click="onRemoveProject(scope.$index)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <el-button v-if="!freezed" type="primary" @click="onClickAddProject">+新增</el-button>
            </div>
          </el-form-item>

          <el-form-item label="活动时间" prop="dateRange">
            <el-date-picker
              v-if="!freezed"
              v-model="form.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :format="FORMAT4ELM_MINUTES"
              :value-format="FORMAT4ELM_24HOURS"
              :default-time="['08:00:00', '22:00:00']"
            >
            </el-date-picker>
            <p v-else>{{ `${origin.startTime.slice(0, -3)}至${origin.endTime.slice(0, -3)}` }}</p>
          </el-form-item>

          <el-form-item label="截止报名时间" prop="signUpDeadlineTime">
            <el-date-picker
              v-if="!freezed"
              v-model="form.signUpDeadlineTime"
              type="datetime"
              :value-format="FORMAT4ELM_24HOURS"
              :format="FORMAT4ELM_MINUTES"
              placeholder="选择日期"
            ></el-date-picker>
            <p v-else>{{ origin.signUpDeadlineTime.slice(0, -3) }}</p>
          </el-form-item>

          <el-form-item label="是否允许用户取消" prop="signUpCancelFlag">
            <div>
              <el-radio v-model="form.signUpCancelFlag" :label="1" :disabled="freezed">是</el-radio>
              <el-radio v-model="form.signUpCancelFlag" :label="0" :disabled="freezed">否</el-radio>
            </div>

            <div class="start-at" v-if="form.signUpCancelFlag === 1">
              <span class="start-at__label">活动开始前：</span>
              <el-input-number
                v-if="!freezed"
                class="start-at__control"
                v-model="form.signUpCancelLimit"
              ></el-input-number>
              <span v-else>{{ form.signUpCancelLimit }}</span>
              <span>小时取消</span>
            </div>
          </el-form-item>

          <el-form-item label="活动地址" prop="address">
            <address-select
              v-model="form.address"
              :disabled="freezed"
              :clear-lat-lng-when-type="true"
              :get-lat-lng="true"
            />
          </el-form-item>

          <el-form-item label="活动封面" prop="coverImg">
            <choose-image-single v-model="form.coverImg" :width="80" :height="80" :disabled="freezed" />
            <span class="ml14 tip">建议尺寸 690px * 228px，图片不大于 2M</span>
          </el-form-item>

          <el-form-item label="虚拟报名人数" prop="virtualCount">
            <el-input-number
              v-if="!freezed"
              v-model="form.virtualCount"
              class="w220"
              :controls="false"
              :min="0"
              :max="9999999"
              maxlength="7"
              placeholder="请输入"
            />
            <p v-else>{{ form.virtualCount }}</p>
          </el-form-item>

          <el-form-item label="随行限制人数" prop="followCount">
            <el-input-number
              v-if="!freezed"
              v-model="form.followCount"
              class="w220 vmiddle"
              :controls="false"
              :min="0"
              :max="9999999"
              maxlength="7"
              placeholder="请输入"
            />
            <p v-else>{{ form.followCount }}</p>
          </el-form-item>

          <el-form-item label="咨询人" prop="consultants">
            <div class="table-in-form">
              <el-table :data="form.consultants" size="mini" style="width: 400px">
                <el-table-column prop="name" label="咨询人姓名" width="120"> </el-table-column>
                <el-table-column prop="phone" label="咨询人电话" width="150"></el-table-column>
                <el-table-column v-if="!freezed" label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button @click="onRemoveConsultant(scope.$index)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <el-button v-if="!freezed" type="primary" @click="onClickAddConsultantBtn()">+新增</el-button>
            </div>
          </el-form-item>

          <el-form-item label="活动详情" prop="detail">
            <template v-if="loaded">
              <w-editor v-if="!freezed" :data-source="form.detail" :is-show-minapp="false" :image-limit="30"></w-editor>
              <div v-else v-html="origin.content" />
            </template>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="page-footer">
      <el-button @click="$router.go(-1)">{{ freezed ? '返回' : '取消' }}</el-button>
      <el-button v-if="!freezed" plain :loading="loading" type="primary" @click="onClickSaveToDraft()"
        >存草稿</el-button
      >
      <el-button v-if="!freezed" type="primary" @click="handleSave">{{ isEdit ? '应用' : '发布' }}</el-button>
    </div>

    <project-selector
      v-if="projectSelectorVisible"
      :select-ids="form.projects.map(item => item.id)"
      :selected="form.projects"
      @update:select-data="onSelectedProjectsChanged"
      @confirm="onSelectProject"
      @cancel="projectSelectorVisible = false"
    ></project-selector>

    <consultant-form-dialog ref="consultant" @add="onAddConsultant"></consultant-form-dialog>
  </div>
</template>

<script>
  import {
    FORMAT_4_ELM,
    DATE_FORMAT_4_ELM,
    ChooseImageSingle,
    ChooseImageMulti,
    ChooseVideoMulti,
    AddressSelect,
    ProjectSelector,
  } from '@/register/kangyang';
  import { activityApi } from '@/mod-kangyang/src/api/activity';
  import regexps from '@/dss-common/utils/regexps';
  import { WEditor } from '@/register/wechat3rd';
  import ConsultantFormDialog from '@/mod-kangyang/src/components/consultant-form-dialog';
  import { FORMAT4ELM_24HOURS, FORMAT4ELM_MINUTES } from '@/mod-kangyang/src/constants/config';
  import { formatDateIfNeed } from '@/mod-kangyang/src/utils';

  const required = message => ({ required: true, message: message || '不能为空' });
  const rules = {
    name: [required('请输入活动名称')],
    typeId: [required('请选择活动类型')],
    dateRange: [required('请选择活动时间')],
    signUpDeadlineTime: [required('请选择截止报名时间')],
    labelList: [
      required('请添加项目标签'),
      {
        validator(rule, value, callback) {
          if (value == null || value.length === 0) {
            callback(new Error('请添加项目标签'));
          } else if (value.some(i => i.name == null || i.name.trim() === '')) {
            callback(new Error('请输入标签名'));
          } else {
            callback();
          }
        },
      },
    ],
    address: [
      required('请输入活动地址'),
      {
        validator(rule, value, callback) {
          const { address, latitude, longitude } = value;
          if (!address || !latitude || !longitude) {
            callback(new Error('请选择活动地址'));
          } else {
            callback();
          }
        },
        trigger: 'change',
      },
    ],
    coverImg: [required('请选择活动封面')],
    floorArea: [required('请输入建筑面积')],
    openTime: [required('请输入开业时间')],
    totalBed: [required('请输入总床位')],
    albums: [
      required('请上传相册'),
      {
        validator(rule, value, callback) {
          if (value.some(i => i.name == null || i.name.trim() === '')) {
            callback(new Error('请输入相册名称'));
          } else if (value.some(i => i.urls.length === 0)) {
            callback(new Error('有相册遗漏相片'));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
    mainImgs: [
      required('请上传院区风采首页'),
      {
        validator(rule, value, callback) {
          if (value == null || value.length !== 3) {
            callback(new Error('请选择 3 张照片'));
          } else {
            callback();
          }
        },
      },
    ],
    videos: [
      required('请上传院区视频'),
      {
        validator(rule, value, callback) {
          if (value.some(i => i.name === null || i.name.trim() === '')) {
            callback(new Error('请输入视频名称'));
          } else if (value.some(i => !i.url || !i.coverUrl)) {
            callback(new Error('请设置视频和封面'));
          } else {
            callback();
          }
        },
      },
    ],
    price: [
      required('请输入价格'),
      {
        validator(rule, value, callback) {
          const { start: _start, end: _end } = value;
          const start = parseFloat(_start);
          const end = parseFloat(_end);
          if (Number.isNaN(start)) {
            callback(new Error('请输入最低价格'));
          } else if (Number.isNaN(end)) {
            callback(new Error('请输入最高价格'));
          } else if (end <= start) {
            callback(new Error('最低价格不能高于最高价格'));
          } else {
            callback();
          }
        },

        trigger: 'blur',
      },
    ],
    contacts: [
      required('请输入咨询电话'),
      { pattern: regexps.servicePhone.reg, message: '请输入正确的联系电话', trigger: 'blur' },
    ],
    detail: [required('请输入活动详情')],
  };

  /**
   * 创建和编辑活动
   */
  export default {
    name: 'CreateOrEditActivity',
    components: {
      ChooseImageSingle,
      ChooseImageMulti,
      ChooseVideoMulti,
      AddressSelect,
      WEditor,
      ProjectSelector,
      ConsultantFormDialog,
    },
    data() {
      return {
        FORMAT_4_ELM,
        DATE_FORMAT_4_ELM,
        FORMAT4ELM_24HOURS,
        FORMAT4ELM_MINUTES,
        types: [],
        rules,
        loading: false,
        loaded: false,
        activeStep: 0,
        origin: {},
        form: {
          id: undefined,
          name: '',
          typeId: undefined,
          prjScopeType: 1,
          dateRange: undefined,
          startTime: undefined,
          endTime: undefined,
          signUpDeadlineTime: undefined, // 报名截止时间
          signUpCancelFlag: 1, // 是否允许取消报名
          signUpCancelLimit: undefined, // 活动开始前多少小时可以取消
          address: {},
          coverImg: '',
          virtualCount: undefined, // 虚拟报名人数
          followCount: undefined, // 随行人数
          detail: {},
          projects: [],
          consultants: [] /** @type {Array<{id: number | undefined, name: string, phone: string}>} */,
        },
        projectSelectorVisible: false,
        addConsultantsDialogVisible: false,
        selectedProjects: [],
        titleError: '',
      };
    },
    computed: {
      code() {
        return this.$route.params.code;
      },
      isEdit() {
        return !!this.code;
      },
      freezed() {
        return !!Number(this.$route.query.readOnly);
      },
    },
    watch: {
      'form.dateRange': {
        handler(range) {
          if (!range) {
            this.form.startTime = null;
            this.form.endTime = null;
            return;
          }
          const [startTime, endTime] = range;
          if (startTime) {
            this.form.startTime = startTime;
          }
          if (endTime) {
            this.form.endTime = endTime;
          }
        },
      },
    },

    async mounted() {
      this.getTypes();
      if (this.isEdit) {
        if (this.$route.query.draft) {
          const { data } = await activityApi.getDraftDetail({ code: this.code });
          this.origin = data;
          const normalized = this.fromPayload(data);
          Object.assign(this.form, normalized);
        } else {
          const { data } = await activityApi.getDetail({ code: this.code });
          this.origin = data;
          const normalized = this.fromPayload(data);
          Object.assign(this.form, normalized);
        }
      }
      this.loaded = true;
    },

    methods: {
      onClickAddProject() {
        this.projectSelectorVisible = true;
      },
      onRemoveProject(index) {
        this.form.projects.splice(index, 1);
      },
      onSelectedProjectsChanged(ev) {
        this.selectedProjects = ev;
      },
      onSelectProject() {
        this.form.projects = this.selectedProjects;
        this.projectSelectorVisible = false;
      },
      onClickAddConsultantBtn() {
        this.$refs.consultant.open();
      },
      onAddConsultant(consultant) {
        this.form.consultants.push(consultant);
      },
      onRemoveConsultant(index) {
        this.form.consultants.splice(index, 1);
      },
      onClickSaveToDraft() {
        this.titleError = '';
        const name = this.form.name || '';

        if (!name.trim()) {
          this.titleError = '请输入活动名称';
          return;
        }
        this.saveToDraft();
      },
      handleSave() {
        this.titleError = '';
        this.$refs.form
          .validate()
          .then(res => {
            if (new Date(this.form.signUpDeadlineTime).getTime() > new Date(this.form.dateRange[1]).getTime()) {
              this.$message.error('截止报名时间不能晚于活动结束时间');
              return;
            }
            this.save();
          })
          .catch(err => {
            console.log('检验失败', err);
          });
      },

      fromPayload(data) {
        const {
          // 过滤掉不需要的字段
          appId,
          epId,
          isCancel,
          isDeleted,
          isShelf,
          updateBy,
          updateTime,
          createBy,
          createTime,

          activityAdviserList,
          prjScopeList,
          activityTicketList,
          addressName,
          addressLatitude,
          addressLongitude,
          signUpCancelFlag,
          startTime,
          endTime,
          signUpDeadlineTime,

          content,
          ...others
        } = data;
        const normalized = {
          address: {
            address: addressName,
            latitude: parseFloat(addressLatitude),
            longitude: parseFloat(addressLongitude),
          },
          signUpCancelFlag: signUpCancelFlag === true ? 1 : 0,

          projects: (prjScopeList || []).map(item => {
            return {
              id: item.projectId,
              name: item.projectName,
              areaName: item.areaName || '',
            };
          }),
          dateRange: [new Date(startTime), new Date(endTime)],
          signUpDeadlineTime: new Date(signUpDeadlineTime),
          consultants: activityAdviserList || [],
          detail: {
            describe: content,
          },
          ...others,
        };
        return normalized;
      },

      toPayload() {
        const {
          projects,
          address: { address, latitude, longitude },
          bannerUrl,
          consultants,
          detail: { describe },
          startTime,
          endTime,
          signUpDeadlineTime,
          dateRange,
          ...others
        } = this.form;

        const payload = {
          ...others,
          prjScopeList: projects.map(item => {
            return {
              projectId: item.id,
              projectName: item.name,
            };
          }),
          addressName: address,
          addressLatitude: latitude,
          addressLongitude: longitude,
          activityAdviserList: consultants,
          content: describe || '',
          startTime: formatDateIfNeed(startTime, '00:00:00'),
          endTime: formatDateIfNeed(endTime, '23:59:59'),
          signUpDeadlineTime: formatDateIfNeed(signUpDeadlineTime, '00:00:00'),
        };

        return payload;
      },

      async getTypes() {
        const { data } = await activityApi.getTypes({});
        this.types = data;
      },

      async save() {
        const payload = this.toPayload();
        try {
          this.loading = true;
          await activityApi.publish(payload);
          this.$message.success('保存成功');
          this.$router.go(-1);
        } finally {
          this.loading = false;
        }
      },

      async saveToDraft() {
        const payload = this.toPayload();
        try {
          this.loading = true;
          await activityApi.saveDraft(payload);
          this.$message.success('保存草稿成功');
          this.$router.go(-1);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .page-content {
    background-color: #fff;
    padding-bottom: 60px;
    position: relative;

    /deep/ .el-input-number .el-input__inner {
      text-align: left;
    }

    /deep/ .el-step__icon {
      color: #fff;
      background-color: #d4d4d4;
    }

    /deep/ .el-step .is-process {
      .el-step__icon {
        background-color: #fa7516;
        border-color: #fa7516;
      }
    }

    /deep/ .is-process.el-step__title {
      color: #fa7516;
    }

    .page-footer {
      position: fixed;
      z-index: 99;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 10px 0;
      width: 100vw;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
    }
  }

  .el-steps {
    padding: 20px;
  }

  .w220 {
    width: 220px;
  }

  .vmiddle {
    vertical-align: middle;
  }

  .ml14 {
    margin-left: 14px;
  }

  .tip {
    color: #717378;
  }

  .start-at {
    display: flex;
    align-items: center;

    &__label {
      font-size: 14px;
      font-weight: 400;
      color: #717378;
    }

    &__control {
      width: 150px;
      margin-right: 5px;
    }
  }

  .table-in-form {
    width: 500px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    /deep/ .el-table th {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
</style>
