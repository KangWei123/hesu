<template>
  <div class="member-real-today"
       v-loading="loading">
    <div class="real-title"
         v-if="title">{{title}}</div>

    <div class="real-list">
      <real-time class="real-time"
                 v-for="(item,index) in realData"
                 :key="index"
                 :itemData="item"></real-time>
    </div>

  </div>
</template>

<script>
import realTime from '@/dss-da/src/components/real-time.vue';
import memberApi from '@/dss-da/src/api/member.js';

export default {
  name: 'member-real-today',

  components: { realTime },

  props: {
    title: {
      type: String,
      default: '今日实时指标'
    },
    realTime: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      realData: [
        { realName: '新增会员', realCount: '0', lastRatio: '0' },
        { realName: '活跃会员数', realCount: '0', lastRatio: '0' },
        { realName: '新增会员占比', realCount: '0', lastRatio: '0' },
        { realName: '会员客单价', realCount: '0', lastRatio: '0' }
      ]
    };
  },

  computed: {},
  mounted() {
    this.getMemberRealData();
  },
  methods: {
    getMemberRealData() {
      this.loading = true;
      const params = {};
      const request = this.realTime ? memberApi.getMemberRealData() : memberApi.getMemberTData(params);
      request
        .then(res => {
          if (res.data && res.data.length) {
            return res.data[0];
          } else {
            return null;
          }
        })
        .then(realRes => {
          if (realRes) {
            const { activeUser, newUser, weekActiveUser, weekCustPrice, weekNewUser, custPrice } = realRes;
            this.realData[0].realCount = newUser || '0';
            this.realData[0].lastRatio = this.computeRate(newUser, weekNewUser) || '0';

            this.realData[1].realCount = activeUser || '0';
            this.realData[1].lastRatio = this.computeRate(activeUser, weekActiveUser) || '0';

            const newUserPro = newUser && activeUser ? newUser / activeUser : null;
            const weekUserPro = weekNewUser && weekActiveUser ? weekNewUser / weekActiveUser : null;
            this.realData[2].realCount = newUserPro ? parseFloat(newUserPro * 100).toFixed(2) + '%' : '0';
            this.realData[2].lastRatio = this.computeRate(newUserPro, weekUserPro) || '0';

            this.realData[3].realCount = custPrice || '0';
            this.realData[3].lastRatio = this.computeRate(custPrice, weekCustPrice) || '0';
          }
        })
        .always(() => {
          this.loading = false;
        });
    },
    computeRate(newData, weekData) {
      if (!newData) {
        return 0;
      }
      if (weekData === 0) {
        return 100;
      }
      if (weekData === null) {
        return 0;
      }
      return parseFloat((newData - weekData) / weekData);
    }
  }
};
</script>
<style lang="less">
.member-real-today {
  overflow: hidden;

  .real-title {
    font-size: 16px;
    color: rgba(51, 51, 51, 1);
    margin: 20px 0 10px 20px;
  }

  .real-list {
    overflow: hidden;
    .real-box {
      width: 24%;
    }

    .real-time {
      float: left;
    }
  }
}
</style>
