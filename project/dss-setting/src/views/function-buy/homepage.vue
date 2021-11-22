<template>
  <div class="function-buy-view"
       v-loading="loading">
    <div class="purchased"
         v-if="wkbStatus || klbStatus">
      <p class="title">已购功能</p>
      <div class="tab-box"
           v-for="(item,index) in functionList"
           :key="index">
        <div class="tab"
             v-if="activeTab('purchased',item.type)">
          <div class="store-content">
            <div class="top-box">
              <img class="logo"
                   :src="item.logo" />
              <p class="name">{{item.name}}</p>
            </div>
            <p class="info">{{item.info}}</p>
          </div>
          <el-button type="primary"
                     class="btn"
                     @click="onOperation(item)">{{btnText(item.btnType)}}</el-button>
          <p class="tips"
             v-if="item.tips">{{item.tips}}</p>
        </div>
      </div>
    </div>
    <div class="more"
         v-if="!wkbStatus || !klbStatus">
      <p class="title">更多功能</p>
      <div class="tab-box"
           v-for="(item,index) in functionList"
           :key="index">
        <div class="tab"
             v-if="activeTab('more',item.type)">
          <div class="store-content">
            <div class="top-box">
              <img class="logo"
                   :src="item.logo" />
              <p class="name">{{item.name}}</p>
            </div>
            <p class="info">{{item.info}}</p>
          </div>
          <el-button type="primary"
                     class="btn"
                     @click="onOperation(item)">{{btnText(item.btnType)}}</el-button>
          <p class="tips"
             v-if="item.tips">{{item.tips}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import './homepage.less';
import { mapState } from 'vuex';
import api from '@/dss-setting/src/api';

export default {
  data() {
    return {
      loading: false,

      functionList: [
        {
          type: 'wkb',
          logo: require('@/dss-common/img/brand/logo-wkb.png'),
          name: '门店经营',
          info: '极速创建小程序，贴合行业特性的 UI 设计，抢占微信平台流量红利，打造一站式门店数字化经营系统',
          btnType: 'experience'
        },
        {
          type: 'klb',
          logo: require('@/dss-common/img/brand/logo-passflow.png'),
          name: '门店客流',
          info:
            'AI人脸识别，让线下零售快速认知客户，提供客户群画像分析，有针对性制定营销策略，根据客流、新客、回访等指标自动为门店客流健康值打分',
          btnType: 'contactUS',
          tips: '温馨提示：门店客流功能暂未开通线上体验，如需了解更多，请联系我们'
        }
      ]
    };
  },
  computed: {
    ...mapState({
      curApp: 'curApp',
      wkbStatus: 'wkbStatus',
      klbStatus: 'klbStatus'
    }),

    // 判断是否显示该tab
    activeTab() {
      return (tabType, functionType) => {
        if (tabType === 'purchased') {
          if (functionType === 'wkb' && !!this.wkbStatus) {
            return true;
          } else if (functionType === 'klb' && !!this.klbStatus) {
            return true;
          }
        } else {
          if (functionType === 'wkb' && !this.wkbStatus) {
            return true;
          } else if (functionType === 'klb' && !this.klbStatus) {
            return true;
          }
        }
      };
    },

    // 根据按钮类型显示不同按钮名称
    btnText() {
      return value => {
        return value === 'experience' ? '立刻体验' : '联系我们';
      };
    }
  },
  mounted() {
    // 判断是否已经订购惟客宝，是则将按钮改为联系我们
    if (!!this.wkbStatus) {
      this.functionList[0].btnType = 'contactUS';
    }
  },
  methods: {
    // 按钮操作
    onOperation(item) {
      if (item.btnType === 'experience') {
        this.onExperience();
      } else if (item.btnType === 'contactUS') {
        this.contactUS();
      }
    },

    // 立刻体验，订购惟客宝、客流宝功能
    onExperience() {
      this.loading = true;

      // 进入惟客宝工作台页面
      window.top.location.href = '/wkb.html';
    },

    // 立即续费
    /* onRenew() {
      const id = this.curApp.id ? this.curApp.id : null;
      this.$router.push({
        path: '/function-buy/order?id=' + id
      });
    }, */

    // 联系我们
    contactUS() {
      this.$router.push({
        path: '/function-buy/contact-us'
      });
    }
  }
};
</script>

