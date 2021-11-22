<template>
  <form-page-layout
    class="store-setting-container"
    :model="form"
    :rules="rules"
    label-width="140px"
    :submit-handler="onSubmit"
  >
    <template>
      <el-form-item label="门店展示范围设置">
        <div>
          <el-switch
            v-model="form.openRange"
            :active-value="1"
            :inactive-value="0"
            active-text="开启"
            inactive-text="关闭"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
          展示
          <el-input-number
            class="range"
            :disabled="!form.openRange"
            v-model="form.rangeValue"
            :min="0"
            controls-position="right"
            size="small"
          ></el-input-number>
          km内的门店
        </div>
        <div style="margin-top: 20px">
          <el-switch
            v-model="form.openRegion"
            :active-value="1"
            :inactive-value="0"
            active-text="开启"
            inactive-text="关闭"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
          展示

          <el-select
            style="width: 130px; margin: 0 10px"
            v-model="form.regionValue"
            :disabled="!form.openRegion"
            placeholder="请选择"
          >
            <el-option label="同省" :value="1" />
            <el-option label="同市" :value="2" />
            <el-option label="同区域" :value="3" />
          </el-select>
          内的门店
          <el-popover
            placement="top-start"
            width="400"
            trigger="hover"
            title="温馨提示："
            content="区域范围的门店设置优先级高"
          >
            <i class="icon-tip" slot="reference" style="margin-bottom: 10px">?</i>
          </el-popover>
        </div>
      </el-form-item>
      <el-form-item label="门店管理设置">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.canModifyItem">
          支持多门店多价格
          <el-popover
            placement="top-start"
            width="400"
            trigger="hover"
            title="温馨提示："
            content="开关开启时，允许门店自行修改所在门店商品价格，新创建的门店默认继承品牌设定的商品价格，允许编辑；开关关闭后，品牌修改商品价格将同步至所有门店，如品牌未进行修改价格操作，则不会对之前门店的商品价格产品产生影响。"
          >
            <i class="icon-tip" slot="reference" style="margin-bottom: 10px">?</i>
          </el-popover>
        </el-checkbox>
      </el-form-item>
      <el-form-item label="分享店铺设置">
        <div>
          <el-radio v-model="form.useShareUserLocation" :label="0">定位附近门店 </el-radio>
          <el-radio v-model="form.useShareUserLocation" :label="1">分享者分享时的门店 </el-radio>
        </div>
        <div class="tip">
          {{
            form.useShareUserLocation == 0
              ? '打开分享链接时，将定位当前位置附近的门店'
              : '打开分享链接时，门店将定位到分享者分享时定位的门店'
          }}
        </div>
      </el-form-item>
    </template>
    <template #footer>
      <form-button action="cancel" />
      <form-button />
    </template>
  </form-page-layout>
</template>

<script>
  import { querySetting, submitSetting } from '@/mod-org/src/api/storeSettingApi';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import { sharedLoginApi } from '@/mod-org/ref/api';
  import { mapState } from 'vuex';

  export default {
    components: {
      FormPageLayout,
      FormGroup,
      FormButton,
    },
    computed: {
      ...mapState({ curApp: 'curApp' }),
    },
    data() {
      return {
        form: {
          openRange: 0,
          openRegion: 0,
          regionValue: 1,
          rangeValue: 0,
          canModifyItem: 0,
          useShareUserLocation: 0,
        },
        loading: {
          submit: false,
          reload: false,
        },
      };
    },
    async mounted() {
      try {
        this.loading.reload = true;
        const res = await sharedLoginApi.getUserInfo();
        this.$store.commit('set_userInfo', res.data);
        const { data } = await querySetting();
        this.form.canModifyItem = this.curApp.canModifyStore === 1 ? 1 : 0;
        this.form.openRange = data.customizedDistanceShop > 0 ? 1 : 0;
        this.form.rangeValue = data.customizedDistanceShop > 0 ? parseInt(data.customizedDistanceShop) : 0;
        this.form.openRegion = data.customizedRegionShop != -1 ? 1 : 0;
        this.form.regionValue = data.customizedRegionShop != -1 ? data.customizedRegionShop : 1;
        this.form.useShareUserLocation = this.curApp.useShareUserLocation || 0;
      } finally {
        this.loading.reload = false;
      }
    },
    methods: {
      async onSubmit() {
        const updateParams = {
          customizedDistanceShop: this.form.openRange ? this.form.rangeValue : 0, // 门店距离展示设置
          customizedRegionShop: this.form.openRegion ? this.form.regionValue : -1,
        };

        const tag = {
          canModifyItem: this.form.canModifyItem,
          useShareUserLocation: this.form.useShareUserLocation,

          forbidRecharge: this.curApp.forbidRecharge === 0 ? 0 : 1, // 是否允许手动充值，0：允许，1：不允许
          canCustomDecorate: this.curApp.canCustomDecorate === 1 ? 1 : 0, // 不同门店不同装扮支持，0：允许，1：不允许
        };

        const tagParams = {
          tag: JSON.stringify(tag),
        };

        try {
          this.loading.submit = true;
          await submitSetting({ ...updateParams, ...tagParams });
          this.$message({ type: 'success', message: '保存成功' });
        } finally {
          this.loading.submit = false;
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .store-setting-container {
    padding: 10px 20px;
    background: white;

    .form {
      margin-top: 20px;
    }

    .tip {
      color: #999;
    }

    .range {
      margin: 0 10px;
    }

    .icon-tip {
      display: inline-block;
      width: 18px;
      height: 18px;
      cursor: pointer;
      font-size: 14px;
      border-radius: 50%;
      color: #fff;
      background: #999;
      text-align: center;
      line-height: 18px;
      margin-left: 5px;
    }

    .submit-btn {
      margin-left: 140px;
    }
  }
</style>
