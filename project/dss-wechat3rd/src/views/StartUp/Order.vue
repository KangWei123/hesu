<template>
  <div class="start-up-order"
       v-loading="loading"
       element-loading-spinner="el-icon-loading">

    <div class="container">
      <div :class="wrapClass">
        <div class="block"
             :key="index"
             v-for="(item,index) in data">

          <div class="up">
            <div class="icon"
                 :class="item.packageType==1?'single-app-icon':'chain-app-icon'"></div>
            <div class="industry">{{item.name}}</div>
          </div>

          <div class="price">
            <span class="rmb">￥</span>
            <span>{{item.price/100}}</span>
            <span>/</span>
            <span class="year">年</span>
          </div>

          <el-button class="min-red-btn"
                     size="small"
                     type="primary"
                     @click="toPay(item.id,item.name,item.price,item.expireYear,item.packageType)">{{isUpgrade?'立即升级':'立即购买'}}
          </el-button>

          <div class="industry-able">适用行业</div>
          <div class="industry-desc">{{item.industries}}</div>

          <div class="func-able">功能</div>
          <div class="func-desc">{{item.desc}}</div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/dss-wechat3rd/src/api';
import './Order.less';

export default {
  data() {
    return {
      loading: true,
      isUpgrade: false,
      id: 0, //店铺id
      data: []
    };
  },
  mounted() {
    const { id, upgrade } = this.$route.query;
    this.isUpgrade = upgrade == 'upgrade';
    this.id = id;
    this.apiList();
  },
  computed: {
    wrapClass() {
      const length = this.data.length;
      return length < 2 ? 'wrap1' : length < 3 ? 'wrap2' : 'wrap3';
    }
  },
  methods: {
    /**
     * 获取指定店铺 能 购买 的套餐
     */
    apiList() {
      api
        .getPackageList({
          appId: this.id,
          isUpgrade: this.isUpgrade ? true : undefined
        })
        .then(res => {
          console.log('apiList', res);
          this.data = res.data;
        })
        .always(() => {
          this.loading = false;
        });
    },

    /**
     * 去付款
     */
    toPay(id, name, price, expireYear, packageType) {
      this.$router.push({
        path: '/startup/pay',
        query: {
          appId: this.id,
          itemId: id,
          name: name,
          price: price,
          expireYear: expireYear,
          packageType: packageType
        }
      });
    }
  }
};
</script>
