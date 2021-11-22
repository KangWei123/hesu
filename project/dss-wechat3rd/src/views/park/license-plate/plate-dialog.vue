<template>
  <el-dialog
    :title="isEdit ? '编辑车牌号码' : '新建车牌号码'"
    width="500px"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" v-loading="loading" class="add-form" label-width="120px">
      <el-form-item label="会员手机号：" prop="memberPhone">
        <el-input
          class="wd220"
          v-model.trim="form.memberPhone"
          placeholder="请输入手机号"
          :disabled="isEdit"
        ></el-input>
      </el-form-item>

      <el-form-item label="车牌号：" prop="carNo">
        <el-input
          class="wd220"
          v-model.trim="form.carNo"
          placeholder="请输入车牌号"
          maxlength="20"
          :disabled="isEdit"
        ></el-input>
      </el-form-item>

      <el-form-item label="品牌：" prop="carCategoryId">
        <el-select v-model="form.carCategoryId" class="wd220" filterable placeholder="请选择车辆品牌">
          <el-option
            v-for="(item, index) in categoryList"
            :key="index"
            :label="item.carCategoryChnName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="默认车牌号：" prop="limitNum">
        <el-radio-group v-model="form.defaultStatus">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import parkApi from '@/dss-wechat3rd/src/api/park';
  import RegExps from '@/dss-common/utils/regexps';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';

  export default {
    components: {
      FormPageLayout,
      FormGroup,
      FormButton,
    },
    props: {
      isShow: {
        type: Boolean,
        default: false,
      },
      isEdit: {
        type: Boolean,
        default: false,
      },
      editObj: {
        type: Object,
        default: {},
      },
    },
    model: {
      prop: 'isShow',
      event: 'input',
    },
    computed: {
      isVisible: {
        get() {
          return this.isShow;
        },
        set(show) {
          this.$emit('input', show);
        },
      },
    },
    data() {
      return {
        loading: false,
        form: {
          carNo: null,
          memberPhone: null,
          carCategoryId: null,
          defaultStatus: 0,
        },
        categoryList: [],
        rules: {
          carNo: [{ required: true, message: '请输入车牌号码', trigger: 'blur' }],
          memberPhone: [
            { required: true, message: '请输入会员手机号码', trigger: 'blur' },
            {
              pattern: RegExps.phone.reg,
              message: RegExps.phone.msg,
              trigger: 'blur',
            },
          ],
        },
      };
    },
    mounted() {
      if (this.isEdit) {
        this.form = this.editObj;
      }
      this.getCarCategory();
    },

    methods: {
      async getCarCategory() {
        const res = await parkApi.car_category_list();
        this.categoryList = res.data || [];
      },

      handleConfirm() {
        this.$refs.form.validate(valid => {
          if (!valid) {
            return;
          }
          const params = {
            carNo: this.form.carNo,
            memberPhone: this.form.memberPhone,
            carCategoryId: this.form.carCategoryId,
            defaultStatus: this.form.defaultStatus,
          };
          params.carCategoryName = (
            this.categoryList.find(item => {
              return item.id === params.carCategoryId;
            }) || {}
          ).carCategoryChnName;
          let key = 'bindingCar';
          if (this.isEdit) {
            key = 'updateCar';
            params.id = this.editObj.id;
          }
          parkApi[key](params)
            .then(res => {
              if (res.data) {
                this.isVisible = false;
                this.$message.success('操作成功！');
                this.$emit('saveSuccess');
              }
            })
            .catch(() => {});
        });
      },
    },
  };
</script>

<style scoped lange="less">
  .add-form {
    text-align: left;
    padding: 0 20px;
  }

  .wd220 {
    width: 220px;
  }
</style>
