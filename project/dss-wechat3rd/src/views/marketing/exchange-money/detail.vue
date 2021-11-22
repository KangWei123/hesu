<template>
  <div>
    <el-breadcrumb class="wkt-breadcrumb-container" separator="/">
      <el-breadcrumb-item :to="{ path: '/marketing/exchange-money' }" replace> 积分兑钱</el-breadcrumb-item>
      <el-breadcrumb-item> {{ isEdit ? '编辑' : '新增' }}积分兑钱规则 </el-breadcrumb-item>
    </el-breadcrumb>

    <form-page-layout
      :model="form"
      :rules="rules"
      label-width="130px"
      :title-visible="false"
      :submit-handler="onSubmit"
    >
      <el-form-item label="适用项目" :prop="'storeId'">
        <el-select v-model="form.storeId" class="w250" filterable v-if="!isEdit">
          <el-option v-for="(item, index) in storeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <div v-else>{{ form.storeName }}</div>
      </el-form-item>

      <el-form-item label="兑钱规则" :prop="'proportion'">
        <div><el-input size="mini" v-model.trim="form.proportion" class="score-input"></el-input>积分=1元</div>
        <div class="tip">注：不可为空或为“0”</div>
      </el-form-item>

      <el-form-item label="最低兑换积分" :prop="'miniScore'">
        <div><el-input size="mini" v-model.trim="form.miniScore" class="score-input"></el-input>积分</div>
      </el-form-item>

      <el-form-item label="是否启用">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <template #footer>
        <form-button action="cancel" />
        <form-button />
      </template>
    </form-page-layout>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import exchangeApi from '@/dss-wechat3rd/src/api/exchange-money.js';
  import regexps from '@/dss-common/utils/regexps';
  import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';

  export default {
    name: 'Detail',
    components: { FormPageLayout, FormGroup, FormButton },
    data() {
      return {
        suitStoreTypeEnum,
        loading: false,
        form: {
          proportion: null,
          miniScore: null,
          storeId: null,
          status: 0,
        },
        rules: {
          proportion: [
            { required: true, message: '请输入兑钱规则', trigger: ['blur', 'change'] },
            { pattern: regexps.littleeIntNum.reg, message: regexps.littleeIntNum.msg, trigger: 'blur' },
          ],
          miniScore: [
            { required: true, message: '请输入最低兑换积分', trigger: ['blur', 'change'] },
            { pattern: regexps.littleeIntNum.reg, message: regexps.littleeIntNum.msg, trigger: 'blur' },
          ],
          storeId: [{ required: true, message: '请选择适用项目', trigger: ['blur', 'change'] }],
        },
      };
    },
    computed: {
      ...mapState({
        env: 'env',
        storeList: state => state.storeList.filter(i => !!i.id),
      }),
      isEdit() {
        return !!this.$route.query.id;
      },
    },

    mounted() {
      if (this.isEdit) {
        this.getDetail();
      }
    },

    methods: {
      getDetail() {
        const params = {
          id: this.$route.query.id,
        };
        exchangeApi
          .getById(params)
          .then(res => {
            this.form = res.data;
          })
          .catch(err => {
            console.error(err);
          });
      },

      async onSubmit() {
        const params = {
          ...this.form,
        };
        params.storeName = (
          this.storeList.find(item => {
            return item.id === params.storeId;
          }) || {}
        ).name;
        const key = this.isEdit ? 'update' : 'create';
        await exchangeApi[key](params);
      },
    },
  };
</script>

<style scoped lang="less">
  .wkt-breadcrumb-container {
    background: #fff;
  }

  .tip {
    color: #aba7a7;
  }

  .score-input {
    width: 70px;
    margin: 0 10px 0 0;
  }
</style>
