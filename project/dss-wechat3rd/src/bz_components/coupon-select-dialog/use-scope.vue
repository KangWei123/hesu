
<template>
  <div>
    {{ row.useScopeType | useScope}}
  </div>
</template>

<script>
import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum';

export default {
  props: ['row', 'col'],

  data() {
    return {};
  },
  filters: {
    useScope(val) {
      if (val === couponEnum.useScopeType.online.value) {
        return couponEnum.useScopeType.online.label;
      } else if (val === couponEnum.useScopeType.offline.value) {
        return couponEnum.useScopeType.offline.label;
      } else {
        return couponEnum.useScopeType.common.label;
      }
    }
  }
};
</script>
