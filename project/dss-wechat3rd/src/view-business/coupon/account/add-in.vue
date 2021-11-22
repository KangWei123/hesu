<template>
  <form-page-layout
    class="coupon-container"
    ref="form"
    :model="form"
    :rules="rules"
    label-width="108px"
    :title-visible="false"
    :submit-handler="handleSubmit"
  >
    <form-group>
      <template #title>账号信息</template>
      <el-form-item prop="userIdList" class="not-margin">
        <el-transfer
          filterable
          :filter-method="filterMethod"
          :titles="['组织人员', '已选择组织人员']"
          filter-placeholder="请输入关键字"
          v-model="form.userIdList"
          :render-content="renderFunc"
          :data="staffList"
          class="tranfer-container"
        >
        </el-transfer>
      </el-form-item>

      <el-form-item class="flex-row" label="所属项目">
        <!-- <el-form-item prop="appId">
          <app-select style="margin-right: 16px" placeholder="请选择应用" v-model="form.appId" clearable class="w220" />
        </el-form-item> -->
        <el-form-item prop="storeId" v-if="form.appId">
          <project-select
            style="margin-right: 16px"
            placeholder="请选择项目"
            v-model="form.storeId"
            clearable
            class="w220"
          />
        </el-form-item>
        <el-form-item v-if="form.storeId">
          <merchant-select
            placeholder="请选择商户"
            v-model="form.subStoreId"
            clearable
            :store-id="form.storeId"
            class="w220"
            @onselect="onselect"
          />
        </el-form-item>
      </el-form-item>

      <el-form-item label="状态" prop="accountStatus">
        <el-switch
          class="switch-style"
          v-model="form.accountStatus"
          active-color="#13ce66"
          active-text="启用"
          inactive-color="#ff4949"
          inactive-text="禁用"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
      </el-form-item>
    </form-group>

    <form-group>
      <template #title>账号权限</template>
      <el-form-item label="发券宝权限" prop="menuIdList">
        <permission v-model="form.menuIdList" />
      </el-form-item>
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
  // import AppSelect from '@/business-common/components/app-select';
  import MerchantSelect from '@/business-common/components/merchant-select/index.vue';
  import ProjectSelect from '@/business-common/components/project-select';
  import Permission from '../../components/Permission.vue';
  import { getInAccount, addAccount } from '@/dss-wechat3rd/src/api/account-coupon';
  import { Type } from '../../enum';

  export default {
    components: {
      FormPageLayout,
      FormGroup,
      FormButton,
      Permission,
      // AppSelect,
      MerchantSelect,
      ProjectSelect,
    },
    data() {
      return {
        form: {
          appId: '',
          storeId: '',
          subStoreId: '',
          subStoreName: '',
          menuIdList: [],
          userIdList: [],
          accountStatus: 0,
          accountType: Type.In,
        },
        rules: {
          userIdList: [{ required: true, message: '请选择组织人员', trigger: 'blur' }],
          appId: [{ required: true, message: '请选择应用', trigger: 'blur' }],
          storeId: [{ required: true, message: '请选择项目', trigger: 'blur' }],
          menuIdList: [{ required: true, message: '请选择发券宝权限', trigger: 'change' }],
        },
        staffList: [],
        options: [],
        renderFunc(h, option) {
          return (
            <span class="transfer-desc">
              <span>{option.accountName}</span>
              <span>{option.accountNo}</span>
            </span>
          );
        },
        filterMethod(query, item) {
          return item.accountName.includes(query) || item.accountNo.includes(query);
        },
      };
    },
    computed: {
      ...mapState({
        userInfo: state => state.userInfo,
      }),
    },
    mounted() {
      this.generateData();

      this.form.appId = this.userInfo.appInfo.id;
    },
    methods: {
      async generateData() {
        const { data } = await getInAccount();
        const result = data.map(item => {
          return {
            key: Number(item.userId),
            accountName: item.accountName,
            accountNo: item.accountNo,
          };
        });
        this.staffList = result;
      },
      onselect(val) {
        this.form.subStoreName = val;
      },
      async handleSubmit() {
        const { userIdList } = this.form;
        const userAccountList = [];

        userIdList.forEach(item => {
          const account = this.staffList.find(rs => rs.key === item);
          userAccountList.push(account.accountNo);
        });

        this.form.userAccountList = userAccountList;

        const params = { ...this.form };

        await addAccount(params);
      },
    },
  };
</script>

<style lang="less" scoped>
  .coupon-container {
    .el-pagination {
      padding: 0;
      text-align: right;
      margin-top: 0;
    }

    /deep/ .el-transfer-panel__footer {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /deep/ .el-transfer-panel {
      width: 360px;
    }

    /deep/ .el-transfer-panel__filter {
      .el-input__inner {
        border-radius: 2px;
      }
    }

    /deep/ .transfer-desc {
      display: flex;
      justify-content: space-between;
    }

    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #333;
    }

    /deep/ .el-transfer-panel__item.el-checkbox {
      color: #717378;
    }

    /deep/ .el-checkbox:last-of-type {
      margin-right: 30px;
    }

    /deep/ .not-margin {
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }

    /deep/ .flex-row .el-form-item__content {
      display: flex;
    }

    .switch-style {
      .el-switch__label {
        position: absolute;
        color: #fff !important;
        z-index: 1;
        display: none;
      }

      .is-active {
        display: block;
      }

      .el-switch__label--left span {
        margin-left: 20px;
      }
    }
  }
</style>
