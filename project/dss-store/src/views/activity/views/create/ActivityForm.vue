<template>
  <el-form class="activity-form" :model="form" ref="form" :rules="rules" label-position="top">
    <el-form-item label="参加活动的门店" prop="relatedStore">
      <el-select class="store-select" v-model="form.relatedStore" collapse-tags filterable multiple size="medium" placeholder="请选择参加活动的门店">
        <el-option v-for="item in stores" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="活动名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>

    <el-form-item label="活动目标（最多选择4项）" prop="targets">
      <el-checkbox-group :max="4" v-model="form.targets">
        <div>
          <el-checkbox class="target-check-box" label="提升客流量" name="targets"></el-checkbox>
          <el-checkbox class="target-check-box" label="提升新客户数量" name="targets"></el-checkbox>
          <el-checkbox class="target-check-box" label="提升老客回访" name="targets"></el-checkbox>
          <el-checkbox class="target-check-box" label="提升客流质量" name="targets"></el-checkbox>
        </div>
        <div>
          <el-checkbox class="target-check-box" label="提升销量" name="targets" disabled></el-checkbox>
          <el-checkbox class="target-check-box" label="提升营业额" name="targets" disabled></el-checkbox>
          <el-checkbox class="target-check-box" label="提升客单价" name="targets" disabled></el-checkbox>
          <el-checkbox class="target-check-box" label="提升成交率" name="targets" disabled></el-checkbox>
        </div>
        <div>
          <el-checkbox class="target-check-box" label="提升会员量" name="targets" disabled></el-checkbox>
          <el-checkbox class="target-check-box" label="提升会员复购" name="targets" disabled></el-checkbox>
        </div>

      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="活动时间" prop="date">
      <el-col :span="6">
        <shortcut-date-picker v-model="form.date" :show-short-cut="false" :default-date-range="defaultDate" />
      </el-col>
    </el-form-item>
    <el-form-item label="活动预算" prop="budget">
      <el-col :span="8">
        <div class="budget">
          <i class="key-icon key-icon-money icon-search"></i>
          <el-input v-model="form.budget" />
        </div>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button @click="goToIndex">取消</el-button>
      <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from 'vuex';

import utils from '@/dss-common/utils';

import ShortcutDatePicker from '../../components/ShortcutDatePicker';
import MultiStoreSelector from '../../components/MultiStoreSelector';

export default {
  name: 'ActivityForm',

  components: {
    MultiStoreSelector,
    ShortcutDatePicker
  },

  computed: {
    ...mapState({
      stores: state => state.userInfo.storeList
    })
  },

  data() {
    const checkBudget = (rule, value, callback) => {
      const budgetReg = /^\d{1,9}$/; //大于0的浮点数

      if (value === '' || value == null) {
        return callback();
      } else if (isNaN(value) || value.charAt(value.length - 1) === '.') {
        //数字最后一位加'.'也认为是数字，剔除这个情况
        return callback(new Error('请输入数字值'));
      } else if (!budgetReg.test(value) || value === '0') {
        return callback(new Error('预算必须是1至999999999之间的整数'));
      } else {
        return callback();
      }
    };

    const checkDate = (rule, value, callback) => {
      if (utils.date.isLastDay(value[0])) {
        return callback(new Error('活动开始日期不能小于当前日期'));
      } else {
        return callback();
      }
    };

    return {
      defaultDate: [new Date(), new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30)],
      form: {
        relatedStore: [],
        name: '',
        targets: [],
        date: null,
        budget: null
      },
      rules: {
        relatedStore: [{ type: 'array', required: true, message: '请至少选择一个店铺', trigger: 'change' }],
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
        ],
        targets: [{ type: 'array', required: true, message: '请至少选择一个活动目标', trigger: 'change' }],
        date: [{ type: 'array', required: true, validator: checkDate, trigger: 'change' }],
        budget: [{ validator: checkBudget, trigger: 'blur' }]
      }
    };
  },
  methods: {
    goToIndex() {
      this.$router.push('/activity/list');
    },
    onSubmit(formName) {
      this.form.startTime = utils.timeFormat(this.form.date[0], 'YYYY-MM-DD');
      this.form.endTime = utils.timeFormat(this.form.date[1], 'YYYY-MM-DD');
      this.form.target = this.form.targets.join();
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit-create', this.$plain(this.form));
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.activity-form {
  .target-check-box {
    width: 122px;
  }

  .store-select {
    width: 100%;
  }

  .budget {
    position: relative;
    display: flex;
    align-items: center;

    .icon-search {
      position: absolute;
      z-index: 100;
      margin-left: 6px;
    }

    .el-input__inner {
      padding-left: 30px;
    }
  }
}
</style>
