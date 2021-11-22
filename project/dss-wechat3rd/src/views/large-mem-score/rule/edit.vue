<template>
  <form-page-layout
    ref="form"
    :model="configDetail"
    :rules="rules"
    label-width="126px"
    :title-visible="false"
    :submit-handler="handleSubmit"
    class="form-container"
  >
    <form-group>
      <template #title>{{ id ? '编辑' : '新增' }}积分规则</template>
      <el-form-item label="适用项目">
        {{ storeName }}
      </el-form-item>

      <el-form-item label="活动名称" prop="ruleName">
        <el-input
          type="text"
          style="width: 200px"
          placeholder="请输入活动名称"
          v-model.trim="configDetail.ruleName"
          autocomplete="off"
          maxlength="20"
        ></el-input>
      </el-form-item>

      <el-form-item label="获取规则" prop="consume">
        每消耗
        <el-input
          v-model="configDetail.consume"
          @input="checkProportion(1, 10000)"
          maxlength="10"
          style="width: 60px"
        ></el-input>
        元获得1积分；
      </el-form-item>

      <select-scope :value="configDetail" @update="handleUpdateConfig" />
    </form-group>

    <template #footer>
      <form-button action="cancel" />
      <form-button />
    </template>
  </form-page-layout>
</template>
<script>
  import { mapState } from 'vuex';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import { CHOOSE_TYPE } from './constant.ts';
  import SelectScope from './select-scope.vue';
  import api from '../../../api/large-mem-score';

  export default {
    name: 'Edit',
    components: { FormPageLayout, FormGroup, FormButton, SelectScope },
    computed: {
      ...mapState({
        curStore: state => state.curStore,
      }),
    },
    data() {
      return {
        loading: false,
        id: this.$route.query.id,
        storeName: '',
        configDetail: {
          ruleName: '',
          dimension: 2,
          consume: '',
          categories: [], // 经营类目
          items: [], // 商户
          type: CHOOSE_TYPE.BUSINESS_CATEGORY,
          showTags: [],
        },
        rules: {
          ruleName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          consume: [{ required: true, message: '请输入获取规则', trigger: 'blur' }],
          scope: [
            {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                switch (this.configDetail.type) {
                  case CHOOSE_TYPE.BUSINESS_CATEGORY:
                    if (!this.configDetail.categories.length) {
                      return callback(new Error('请选择经营类目'));
                    }
                    break;
                  case CHOOSE_TYPE.MERCHANT:
                    if (!this.configDetail.items.length) {
                      return callback(new Error('请选择商户'));
                    }
                    break;
                }
                callback();
              },
            },
          ],
        },
      };
    },
    mounted() {
      this.storeName = this.curStore.name;
      if (this.id) {
        this.getConfig();
      }
    },
    methods: {
      checkProportion(min = 0, max = 10000) {
        const regex = /^\d+$/;
        if (regex.test(this.configDetail.consume)) {
          if (this.configDetail.consume > max || this.configDetail.consume < min) {
            this.configDetail.consume = '';
          }
        } else {
          this.configDetail.consume = '';
        }
      },
      handleUpdateConfig(config) {
        this.configDetail = { ...this.configDetail, ...config };
        this.$refs.form.validateField('scope');
      },
      async getConfig() {
        const { data } = await api.rule.detail({ id: this.id });
        let { configDetail, ruleName, unionMap } = data;
        configDetail = {
          ...configDetail,
          ruleName,
          type: configDetail.categories.length ? CHOOSE_TYPE.BUSINESS_CATEGORY : CHOOSE_TYPE.MERCHANT,
          showTags: unionMap,
        };
        this.configDetail = configDetail;
      },
      getParams() {
        const params = this.configDetail;
        if (this.id) {
          params.id = this.id;
        }
        params.ruleSource = this.globalIsUmpPlatformApp ? 1 : 2;
        return params;
      },
      async handleSubmit() {
        const params = this.getParams();
        if (this.id) {
          await api.rule.update(params);
        } else {
          await api.rule.add(params);
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  .filter-box {
    height: 500px;
    display: flex;

    /deep/.el-input,
    /deep/.el-select {
      width: 100%;
    }

    /deep/.el-textarea__inner {
      height: 100%;
    }

    /deep/.el-button--text {
      color: #1890ff;
    }

    .integralDetail {
      width: 400px;

      .item {
        margin: 16px 0;
      }

      &.detail-panel {
        margin: 0 10px;
        background: #f3fbfe;
        color: #717378;
        padding: 42px;
        box-sizing: border-box;
      }
    }

    .el-form-item {
      margin-bottom: 20px !important;
    }
  }
</style>
