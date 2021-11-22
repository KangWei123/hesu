<template>
  <div class="wx-mp" v-loading=loading element-loading-spinner="el-icon-loading">
    <mp-is-empty v-if="!businessMp" :getUserTemplate="getUserTemplate"></mp-is-empty>
    <mp-is-attached v-if="businessMp" :businessMp="businessMp"></mp-is-attached>
    <mpAuth ref="mpAuth"/>
  </div>
</template>

<script>
import './version.less';
import { mapState } from 'vuex';
import MpIsAttached from './mpIsAttachedStaff.vue';
import MpIsEmpty from './mpIsEmptyStaff.vue';
import service from '../../../../api/index.js';
import settingsApi from '@/dss-wechat3rd/src/api/settings';
import mpAuth from '../../../../components/isMpAuth';
export default {
  components: { MpIsAttached, MpIsEmpty, mpAuth },
  computed: {
    ...mapState({
      global_info: 'global_info',
      wxAuthInfo: 'wxAuthInfo'
    })
  },
  methods: {
    getUserTemplate(vm) {
      vm ? (vm.loading = true) : (this.loading = true);
      service
        .getUserTemplate({
          maType: 1
        })
        .then(res => {
          if (res.data != null) {
            vm ? (vm.businessMp = res.data.maAppId) : (this.businessMp = res.data.maAppId);
          }
        })
        .finally(() => {
          vm ? (vm.loading = false) : (this.loading = false);
        });
    }
    /*getCompanyAuthCondition() {
      this.loading = true;
      settingsApi
        .getMpIsAuth({ appType: 3 })
        .then(res => {
          if (res.data.authStatus && res.data.agentId && res.data.agentSecret) {
            this.getUserTemplate();
          } else {
            this.loading = false;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }*/
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getUserTemplate();
    });
  },
  data() {
    return {
      businessMp: '',
      loading: false,
      isMpAuth: false
    };
  }
};
</script>
