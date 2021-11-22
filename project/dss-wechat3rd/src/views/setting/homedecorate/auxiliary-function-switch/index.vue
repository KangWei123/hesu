<template>
  <div class="auxiliary-function-switch" v-loading="loading">
    <div class="content">
      <!-- <div class="tab" v-if="isEstateSwitch">
        <span class="left">悬浮购物车：</span>
        <div class="right">
          <el-radio-group v-model="floatCartSwitch">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <div class="float-cart-switch-icon">
            <img :src="floatCartSwitchUrl" alt="" />
          </div>
        </div>
      </div>
      <div class="tab" v-if="false">
        <span class="left">开启在线客服：</span>
        <div class="right">
          <el-radio-group v-model="onlineServiceSwitch">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <p class="notice">*开启后，将会在“我的”菜单里增加“联系客服”按钮</p>
        </div>
      </div>
      <div class="tab" v-if="showScanCode && isEstateSwitch">
        <span class="left">开启扫码购：</span>
        <div class="right">
          <el-radio-group v-model="scanCodeSwitch">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="tab" v-if="showScanCode">
        <span class="left">首页搜索框：</span>
        <div class="right">
          <el-radio-group v-model="searchBox">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </div>
      </div> -->

      <div class="bg-content" :style="'background-image: url(' + bgUrl + ');'">
        <div class="tab buy-car" v-if="isEstateSwitch">
          <span class="left">悬浮购物车：</span>
          <div class="right">
            <el-switch v-model="floatCartSwitch"
                       :active-value="1"
                       :inactive-value="0"
                       active-text="开启"
                       inactive-text="关闭"
                       active-color="#52C41A"
                       inactive-color="#B1B5BD" />
          </div>
        </div>

        <div class="tab scan-box" v-if="showScanCode && isEstateSwitch">
          <span class="left">扫码购功能：</span>
          <div class="right">
            <el-switch v-model="scanCodeSwitch"
                       :active-value="1"
                       :inactive-value="0"
                       active-text="开启"
                       inactive-text="关闭"
                       active-color="#52C41A"
                       inactive-color="#B1B5BD" />
          </div>
        </div>

        <div class="tab search-box" v-if="showScanCode">
          <span class="left">首页搜索框：</span>
          <div class="right">
            <el-switch v-model="searchBox"
                       :active-value="1"
                       :inactive-value="0"
                       active-text="开启"
                       inactive-text="关闭"
                       active-color="#52C41A"
                       inactive-color="#B1B5BD" />
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-button">
      <el-button type="primary" style="margin-top: 20px" @click="saveSwitch">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import service from '@/dss-wechat3rd/src/api/index.js';
import img_bg from '@/dss-wechat3rd/src/images/setting/function-bg.png';
import img_bg_none from '@/dss-wechat3rd/src/images/setting/function-bg-none.png';
import store from '@/business-common/store.js';
import './index.less';

export default {
  data() {
    return {
      loading: false,
      floatCartSwitch: 0,
      onlineServiceSwitch: 0,
      showScanCode: false,
      scanCodeSwitch: 0,
      searchBox: 1,
      img_bg,
      img_bg_none
    };
  },

  computed: {
    ...mapState({
      curApp: 'curApp',
      env: 'env'
    }),
    floatCartSwitchUrl() {
      return this.floatCartSwitch === 0
        ? require('../../../../images/setting/floatCartSwitch2.png')
        : require('../../../../images/setting/floatCartSwitch1.png');
    },
    isEstateSwitch() {
      return !this.env.ESTATE;
    },
    bgUrl() {
      return !this.env.ESTATE ? img_bg : img_bg_none;
    }
  },

  mounted() {
    this.floatCartSwitch = this.curApp.floatCartSwitch || 0;
    this.searchBox = this.curApp.searchBox || 0;
    this.onlineServiceSwitch = this.curApp.onlineServiceSwitch || 0;
    if (this.curApp.hasOwnProperty('scanCodeSwitch')) {
      this.showScanCode = true;
      this.scanCodeSwitch = this.curApp.scanCodeSwitch || 0;
    }
  },

  methods: {
    /**
     * 保存辅助功能开关设置
     */
    saveSwitch() {
      this.loading = true;

      const switchObj = {
        floatCart: this.floatCartSwitch,
        onlineService: this.onlineServiceSwitch,
        searchBox: this.searchBox
      };
      if (this.showScanCode) {
        switchObj.scanCode = this.scanCodeSwitch;
      }
      const params = {
        tag: JSON.stringify(switchObj)
      };

      service
        .saveAuxiliaryFunctionSwitch(params)
        .then(res => {
          this.loading = false;

          // 全局更新辅助功能开关状态
          this.curApp.floatCartSwitch = this.floatCartSwitch;
          this.curApp.onlineServiceSwitch = this.onlineServiceSwitch;
          this.curApp.searchBox = this.searchBox;
          store.commit('update_curApi', this.curApp);

          this.$message.success('保存成功！');
        })
        .catch(res => {
          this.loading = false;
          this.$message.error('网络延缓，请稍后重试！');
        });
    }
  }
};
</script>
