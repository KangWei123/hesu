<template>
  <form-page-layout :model="form" :rules="rules" label-width="120px" :title-visible="false" :submit-handler="onSubmit">
    <template>
      <el-form-item label="经销商编号" prop="dealerNo">
        <el-radio-group v-model="isCustom" v-if="!isEdit" @change="changeNo">
          <el-radio :label="0">自定义</el-radio>
          <el-radio :label="1">系统生成</el-radio>
        </el-radio-group>
        <div style="margin-top: 5px" v-if="!isCustom">
          <el-input class="w220" type="input" v-model="form.dealerNo" placeholder="请输入经销商编码"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="经销商名称" prop="dealerName">
        <el-input class="w220" type="input" v-model="form.dealerName" placeholder="请输入经销商名称"></el-input>
      </el-form-item>

      <el-form-item label="负责人" prop="chargePerson">
        <el-input class="w220" type="input" v-model="form.chargePerson" placeholder="请输入负责人姓名"></el-input>
      </el-form-item>

      <el-form-item label="负责人手机" prop="chargePersonPhone">
        <el-input
          class="w220"
          type="input"
          v-model="form.chargePersonPhone"
          placeholder="请输入负责人手机号"
        ></el-input>
      </el-form-item>
    </template>

    <template #footer>
      <form-button action="cancel" />
      <form-button />
    </template>
  </form-page-layout>
</template>

<script>
  import { mapState } from 'vuex';
  import * as dealerApi from '@/mod-org/src/api/dealerApi';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import regexps from '@/dss-common/utils/regexps';

  export default {
    props: {},

    components: {
      FormPageLayout,
      FormGroup,
      FormButton,
    },

    computed: {
      ...mapState({
        curStore: 'curStore',
        curApp: 'curApp',
        storeList: 'storeList',
        env: 'env',
      }),
    },
    data() {
      const validateNo = (rule, value, callback) => {
        if (!this.isCustom && !this.form.dealerNo) {
          callback(new Error('请输入经销商编号'));
        } else {
          callback();
        }
      };

      return {
        submitting: false,
        id: null,
        isEdit: true,
        isCustom: 0,
        form: {
          dealerNo: null,
          dealerName: null,
          chargePerson: null,
          chargePersonPhone: null,
        },
        rules: {
          dealerName: [{ required: true, message: '请输入经销商名称', trigger: 'change' }],
          dealerNo: [
            {
              validator: validateNo,
              trigger: 'change',
            },
          ],
          chargePersonPhone: [{ pattern: regexps.phone.reg, message: regexps.phone.msg, trigger: 'blur' }],
        },
      };
    },
    mounted() {
      this.id = this.$route.query.id;
      this.isEdit = !!this.$route.query.id;
      if (this.id) {
        this.getDetail();
      }
    },
    methods: {
      changeNo() {},

      async onSubmit() {
        if (!this.isEdit) {
          this.apiAdd();
        } else {
          this.apiUpdate();
        }
      },

      // 新增
      async apiAdd() {
        const params = this.form;
        if (this.isCustom) {
          delete params.dealerNo;
        }

        await dealerApi.add(params);
        this.$router.push('/companyManage/dealer-center');
      },

      // 修改
      async apiUpdate() {
        const params = { ...this.form, id: this.id };

        await dealerApi.update(params);
        this.$router.push('/companyManage/dealer-center');
      },

      // 获取数据
      getDetail() {
        dealerApi.detail({ id: this.id }).then(res => {
          const { data, totalCount } = res;
          this.form = data;
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .dealer-mgr {
    background: white;

    .tree-container {
      padding: 20px;
    }

    .el-input {
      width: 200px;
    }
  }
</style>
