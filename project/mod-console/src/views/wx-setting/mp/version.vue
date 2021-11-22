<template>
  <div class="wx-mp">
    <mp-is-empty v-if="!wxAuthInfo || !wxAuthInfo.wxMaAppId"></mp-is-empty>
    <mp-is-attached v-if="!!wxAuthInfo && !!wxAuthInfo.wxMaAppId"></mp-is-attached>
  </div>
</template>

<script>
  import './version.less';
  import { mapState } from 'vuex';
  import MpIsAttached from './mpIsAttached.vue';
  import MpIsEmpty from './mpIsEmpty.vue';
  export default {
    components: { MpIsAttached, MpIsEmpty },
    computed: {
      ...mapState({
        global_info: 'global_info',
        wxAuthInfo: 'wxAuthInfo',
      }),
    },
    data() {
      return {};
    },
  };
</script>
