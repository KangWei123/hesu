<template>
  <WkbPageNav :menuList="realMenu"
              parentsPath="/setting/"></WkbPageNav>
</template>

<script>
import { mapState } from 'vuex';
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
export default {
  components: {
    WkbPageNav
  },
  computed: {
    ...mapState({
      env: 'env',
      curApp: 'curApp',
      curStore: 'curStore'
    }),
    realMenu() {
      return [
        {
          name: '店铺设置',
          path: 'app'
        },
        {
          name: '会员设置',
          path: 'member',
          children: [
            {
              name: '会员等级',
              path: 'level'
            },
            {
              name: '积分设置',
              path: 'score'
            },
            {
              name: '标签设置',
              path: 'label'
            }
          ]
        }
      ];
    }
  }
};
</script>
