<template>
  <form-page-layout :title-visible="false">
    <div class="settings">
      <el-form
        ref="form"
        v-loading="loading"
        :rules="rules"
        :model="form"
        label-width="120px"
        @submit.native.prevent="handleSave"
      >
        <el-form-item label="选择项目">
          <el-select v-if="!isEdit" v-model="form.projId" :disabled="isEdit" placeholder="请选择" clearable>
            <el-option v-for="item in allProjects" :key="item.id" :label="item.prjName" :value="item.id"></el-option>
          </el-select>

          <el-select v-else v-model="form.projName" :disabled="isEdit" placeholder="请选择" clearable>
            <el-option v-for="item in allProjects" :key="item.id" :label="item.prjName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="预约时间" prop="weekDays">
          <el-select v-model="form.weekDays" multiple style="min-width: 500px">
            <el-option v-for="item of WEEKS" :key="item" :label="`周${item}`" :value="`星期${item}`"></el-option>
          </el-select>
          <duration-select ref="durationSelect" v-model="form.timeRule"></duration-select>
        </el-form-item>

        <el-form-item label="预约范围" prop="scope">
          可预约
          <el-input-number
            v-model="form.scope"
            style="width: 100px"
            :min="0"
            :step="1"
            :precision="0"
            :controls="false"
          ></el-input-number>
          天内的时间（从今日开始往后计算，包含今天）
        </el-form-item>

        <el-form-item label="不可预约日期">
          <el-date-picker
            v-model="form.unAppointDate"
            type="dates"
            placeholder="请选择"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :disabled="(form.unAppointDate || []).length >= 10"
            :picker-options="pickerOptions"
          ></el-date-picker>

          <span class="tip" style="margin-left: 10px; color: gray">例如节假日、公休日</span>
          <div class="tags">
            <el-tag
              v-for="(item, idx) of form.unAppointDate"
              :key="item"
              type="info"
              closable
              @close="form.unAppointDate.splice(idx, 1)"
              >{{ item }}</el-tag
            >
            <span style="color: gray">最多可添加 10 个</span>
          </div>
        </el-form-item>

        <el-form-item label="长者预约次数" prop="elderAppointNums">
          每周可被预约
          <el-input-number
            v-model="form.elderAppointNums"
            style="width: 100px"
            :min="0"
            :step="1"
            :precision="0"
            :controls="false"
          ></el-input-number>
          次
        </el-form-item>

        <el-form-item label="取消规则" prop="cancelScope" class="form-item">
          预约者可提前
          <el-input-number
            v-model="form.cancelScope"
            style="width: 100px"
            :min="0"
            :step="1"
            :precision="0"
            :controls="false"
          ></el-input-number>
          小时取消预约（备注：不设置默认为 0，设置 x 小时后，预约人在预约时间前 x 小时可取消）
        </el-form-item>

        <el-form-item label="预约须知" prop="notice">
          <el-input
            v-model="form.notice"
            show-word-limit
            maxlength="500"
            type="textarea"
            style="width: 400px"
            rows="5"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="$router.go(-1)">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSave">保存</el-button>
    </template>
  </form-page-layout>
</template>

<script>
  import DurationSelect from '@/mod-kangyang/src/components/duration-select';
  import { elderAppointmentApi } from '@/mod-kangyang/src/api';
  import { FormPageLayout } from '@/dss-common/components/form-page';
  import { WEEKS } from '@/mod-kangyang/src/constants';
  import { getTimeStamp } from '@/mod-kangyang/src/utils';

  export default {
    name: 'ProjectElderAppointmentSetting',
    components: {
      DurationSelect,
      FormPageLayout,
    },
    data() {
      return {
        WEEKS,
        loading: false,
        form: {
          projId: undefined,
          weekDays: WEEKS.map(i => `星期${i}`),
          timeRule: [],
          unAppointDate: [],
          scope: null,
          elderAppointNums: undefined,
          cancelScope: null,
          notice: '',
        },
        rules: {
          weekDays: { required: true, message: '请选择预约时间', trigger: 'blur' },
          timeRule: { required: true, message: '请设置预约时间段', trigger: 'blur' },
          scope: { required: true, message: '请设置预约范围', trigger: 'blur' },
          notice: { required: true, message: '请设置预约须知', trigger: 'blur' },
        },
        pickerOptions: {
          disabledDate: () => {
            return (this.form.unAppointDate || []).length >= 10;
          },
        },
        allProjects: [],
      };
    },
    computed: {
      settingId() {
        return this.$route.params.settingId;
      },
      isEdit() {
        return !!this.settingId;
      },
    },
    mounted() {
      if (this.isEdit) {
        this.handleGetDetail();
      }

      this.getProjects();
    },
    methods: {
      async handleGetDetail() {
        const { data } = await elderAppointmentApi.getSetting({
          id: this.settingId,
        });
        const { appId, epId, appointDate, timeRule, unAppointDate = [], appointDateList, ...rest } = data;
        rest.timeRule = (timeRule || []).sort((a, b) => {
          return getTimeStamp(a.startTime) > getTimeStamp(b.startTime) ? 1 : -1;
        });
        rest.unAppointDate = unAppointDate;
        rest.weekDays = (appointDate || []).map(item => {
          return `星期${WEEKS[item - 1]}`;
        });
        Object.assign(this.form, rest);
      },
      async handleSave() {
        const childs = this.$refs.durationSelect.$children;
        if (childs.length > 0) {
          for (let i = 0; i < childs.length; i++) {
            if (!(await childs[i].validate())) {
              return;
            }
          }
        } else {
          this.$message.warning('请新增至少一条预约时间段');
          return;
        }

        if (!(await this.$refs.form.validate())) {
          return;
        }
        const { projName, timeRule, weekDays, ...payload } = this.form;
        payload.appointDate = weekDays.map(item => {
          return WEEKS.findIndex(week => week === item.replace('星期', '')) + 1;
        });
        payload.unAppointDateList = payload.unAppointDateList || [];
        payload.timeRule = timeRule.map(i => {
          const { id, ...item } = i;
          if (!(typeof id === 'string' && id.startsWith('temp_'))) {
            item.id = id;
          }
          return item;
        });

        this.loading = true;
        try {
          if (this.isEdit) {
            await elderAppointmentApi.updateSetting(payload);
          } else {
            await elderAppointmentApi.addSetting(payload);
          }

          this.$message.success('保存成功');

          if (this.isEdit) {
            this.handleGetDetail();
          } else {
            this.$router.go(-1);
          }
        } finally {
          this.loading = false;
        }
      },

      async getProjects() {
        const { data } = await elderAppointmentApi.getAvailableProjects();
        this.allProjects = data;
      },
    },
  };
</script>

<style scoped>
  .tags .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .plh {
    height: 50px;
  }

  .fixed-footer {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: white;
    z-index: 1000;
    padding: 12px;
    text-align: center;
    box-shadow: 0 -2px 3px #f3f3f3;
  }
</style>
