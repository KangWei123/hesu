<template>
  <div class="multi-mine-index" v-if="isAreaManager">
    <div class="home-decorate-tips">
      <span>1、支持个人中心模块化组合及样式自由编辑</span>
      <span>2、扩展性强，引入海报等提高转化率</span>
      <span>3、商家可根据不同活动灵活配置个人中心信息</span>
    </div>
    <!-- 门店管理员 -->
    <div class="home-decorate-container" v-loading="loading">
      <div class="custom-page-block" v-if="!!brandTemplate" :style="imgUrl(brandTemplate.imgUrl)">
        <div class="current-home-box">
          <div v-if="!storeTemplate || !storeTemplate.hasUse" class="current-home">当前使用</div>
        </div>
        <div class="name">品牌模板</div>
        <div class="mask">
          <div @click="reviewPage('brand')" class="oper-item">查看</div>
          <div class="oper-item" v-if="storeTemplate && storeTemplate.hasUse" @click="setMinePage('brand')">
            设为个人中心
          </div>
        </div>
      </div>

      <template>
        <div class="custom-page-block" v-if="!!storeTemplate" :style="imgUrl(storeTemplate.imgUrl)">
          <div class="current-home-box">
            <div v-if="storeTemplate.hasUse" class="current-home">当前使用</div>
          </div>
          <div class="name">门店模板</div>
          <div class="mask">
            <div @click="reviewPage('store')" class="oper-item">自定义</div>
            <div class="oper-item" v-if="!storeTemplate.hasUse" @click="setMinePage('store')">设为个人中心</div>
          </div>
        </div>
        <!-- <div class="custom-page-block" @click="addStoreMinePage" v-else>
          <div class="preview add">
            <i class="el-icon-plus"></i>
          </div>
          <div class="name custom-name">自定义主页</div>
        </div> -->
      </template>
    </div>
  </div>
  <mine-decorate v-else></mine-decorate>
</template>

<script>
import './index.less';
import service from '@/dss-wechat3rd/src/api/index.js';
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
import MineDecorate from './index.vue';

export default {
  name: 'multi-mine-decorate',
  mixins: [industryHelperMixin],
  components: { MineDecorate },
  data() {
    return {
      loading: false,
      dataSource: [],
      brandTemplate: null,
      storeTemplate: null,
      enterTime: +new Date()
    };
  },
  computed: {
    //获取当前主页模板图片
    imgUrl() {
      return imgUrl => {
        return imgUrl
          ? 'background: transparent url(' + imgUrl + '?t=' + this.enterTime + ') no-repeat 0 0;background-size: cover;'
          : null;
      };
    },
    // 区域管理员
    isAreaManager() {
      return (
        (!!~this.roleList.split(',').indexOf('common_role_area_manager') ||
          !!~this.roleList.split(',').indexOf('common_role_dealer_manager')) &&
        !!this.curApp.canCustomDecorate
      );
      // return true;
    }
  },
  mounted() {
    if (this.isAreaManager) {
      this.fetchBrandTemplate();
      this.fetchStoreTemplate();
    }
  },
  methods: {
    // 获取门店私有配置
    fetchStoreTemplate() {
      this.loading = true;
      const params = {
        storeId: this.curStore.id
      };

      service
        .getPersonalCenterConfig(params)
        .then(res => {
          if (res.data) this.storeTemplate = res.data;
        })
        .always(() => {
          this.loading = false;
        });
    },
    // 获取品牌配置
    fetchBrandTemplate() {
      service
        .getUserTemplate()
        .then(response => {
          if (response.data) this.brandTemplate = response.data;
        })
        .always(() => {
          this.loading = false;
        });
    },
    setMinePage(type) {
      const params = {
        id: this.storeTemplate.id,
        storeId: this.curStore.id,
        hasUse: type === 'brand' ? false : true
      };
      service
        .updateStorePersonalCenter(params)
        .then(response => {
          this.fetchStoreTemplate();
        })
        .always(() => {
          this.loading = false;
        });
    },
    // 查看||自定义
    reviewPage(type) {
      this.$router.push({
        path: '/setting/homedecorate/mine-decorate/detail',
        query: {
          editLibraryType: type
        }
      });
    },
    addStoreMinePage() {}
  }
};
</script>

<style lang="less" scoped>
.multi-mine-index {
  padding: 12px 20px 20px;

  .home-decorate-container {
    min-height: 300px;
    overflow: hidden;

    .custom-page-block {
      width: 220px;
      height: 392px;
      border: 1px solid @border-color;
      margin: 0px 10px 40px 0px;

      .current-home-box {
        position: absolute;
        width: 100%;
        height: 100%;

        .current-home {
          position: absolute;
          top: 20px;
          color: white;
          padding-left: 5px;
          height: 24px;
          line-height: 24px;
          width: 65px;
          background-color: #4e7be5;
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
          font-size: 12px;
        }
      }

      .name {
        text-align: center;
        height: 35px;
        line-height: 35px;
        font-size: @small-font;
        color: @black-color;
        position: absolute;
        bottom: -40px;
        background: none;
        border: none;
        width: 220px;
      }

      .mask {
        position: absolute;
        width: 100%;
        height: 292px;
        padding-top: 100px;

        .oper-item {
          width: 100px;
        }
      }

      .add {
        position: absolute;
        width: 220px;
        height: 392px;

        .el-icon-plus {
          margin-top: 156px;
          font-size: 80px;
        }
      }
    }

    .current-template {
      display: inline-block;
      float: left;

      img {
        width: 220px;
        background: rgba(242, 244, 247, 1);
        border-radius: 4px;
        padding: 4px;
      }

      .box {
        overflow: hidden;
        margin-top: 10px;
        padding: 0px 5px;

        .left {
          display: inline-block;
          float: left;
        }

        .right {
          display: inline-block;
          float: right;

          .blue {
            color: #2e8dff;
            margin-left: 20px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
