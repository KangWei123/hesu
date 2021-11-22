<template>
  <!-- <div class="start-up-industry">
    <div class="title">店铺类型选择</div>
    <div v-if="loading"
         v-loading="loading"
         element-loading-spinner="el-icon-loading"
         class="_loading"></div>
    <div class="_block_wrap">
      <div v-for="(item,index) in data"
           :key="index"
           class="item"
           :class="blockClass(item)">
        <div :class="item['bgClass']">
          <i class="logo"></i>
          <div class="name">{{item.name}}</div>
        </div>
        <div class="desc">{{item.description}}</div>
        <a class="go"
           href="javascript:void(0);"
           @click="toCreate(item.id,item.key)">立即开店</a>
      </div>
    </div>
  </div> -->
    <div class="start-up-industry">
    <div class="title">店铺类型选择</div>
    <div v-if="loading" v-loading="loading" element-loading-spinner="el-icon-loading" class="_loading"></div>
    <div class="_block_wrap">
      <div v-for="(item,index) in data" :key="index" class="item" :class="blockClass(item)">
        <div :class="item['bgClass']" class="item-top" :style="{'background-color': item.bgColor}">
          <i class="logo"></i>
          <div class="name">{{item.name}}</div>
        </div>
        <div class="desc">{{item.desc}}</div>
        <a class="go"
           href="javascript:void(0);"
           @click="toCreate(item)">立即开店</a>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/dss-wechat3rd/src/api';
import './Industry.less';
export default {
  data() {
    return {
      loading: false,
      keys: {
        beautiful: { bgClass: 'beautiful' },
        retail: { bgClass: 'retail' },
        clother: { bgClass: 'clother' },
        education: { bgClass: 'education' },
        bodybuilding: { bgClass: 'bodybuilding' },
        fruit: { bgClass: 'fruit' }
      },
      data: []
    };
  },
  mounted() {
    this.list();
  },
  methods: {
    blockClass(item) {
      let cls = [item.bgClass + '_block'];
      if (item.key === 'beautiful' || item.key === 'retail') {
        cls.push('_block');
      } else {
        cls.push('_disable_block');
      }
      return cls.join(' ');
    },

    list() {
      const staticData = [
        {
          name: '美业',
          desc: '适用各种美容美发美甲店铺，支持连锁',
          id: 1,
          key: 'beautiful',
          bgClass: 'beautiful',
          icon: 'beautiful-logo',
          bgColor: '#FF3160'
        },
        {
          name: '商超零售',
          desc: '适用各种零售门店、连锁超市、线上销售电商、微商',
          id: 3,
          key: 'retail',
          bgClass: 'retail',
          icon: 'retail-logo',
          bgColor: '#FFBB3B'
        },
        {
          name: '鞋服',
          desc: '专为鞋服行业定制，适用箱包鞋帽、衣服配饰等行业',
          id: 3,
          key: 'retail',
          bgClass: 'clother',
          icon: 'clother-logo',
          bgColor: '#F45555'
        },
        {
          name: '教育',
          desc: '精品课程、课程预约、名师风采等功能，适用于各种培训机构',
          id: 1,
          key: 'beautiful',
          bgClass: 'education',
          icon: 'education-logo',
          bgColor: '#2E8DFF'
        },
        {
          name: '健身',
          desc: '私教预约、课程体验、办理健身卡、储值卡等功能',
          id: 1,
          key: 'beautiful',
          bgClass: 'bodybuilding',
          icon: 'bodybuilding-logo',
          bgColor: '#3A435E'
        },
        {
          name: '生鲜',
          desc: '适用于蔬果行业、水产生鲜行业，线上促销，到店提货',
          id: 3,
          key: 'retail',
          bgClass: 'fruit',
          icon: 'fruit-log',
          bgColor: '#9DC623'
        },
        {
          name: '旅游',
          desc: '适用于旅游行业',
          id: 31,
          key: 'tourism',
          bgClass: 'beautiful',
          icon: 'beautiful-logo',
          bgColor: '#badcff'
        },
        {
          name: '地产',
          desc: '适用于地产行业',
          id: 88,
          key: 'estate',
          bgClass: 'retail',
          icon: 'retail-logo',
          bgColor: '#ffce87'
        }
      ];

      this.loading = true;
      api
        .queryIndustry(0)
        .then(res => {
          const { data } = res;
          if (data && data.length) {
            staticData.forEach(item => {
              data.forEach(item1 => {
                if (item.key === item1.key) {
                  item.id = item1.id;
                }
              });
            });
            this.data = staticData;
          }
        })
        .always(data => {
          this.loading = false;
        });
    },

    // list() {
    //   api.queryIndustry(0).then(res => {
    //     console.log(res)
    //       const { data } = res;
    //       if (data && data.length) {
    //         data.forEach(item => {
    //           if (!!this.keys[item.key]) {
    //             item.bgClass = this.keys[item.key].bgClass;
    //           }
    //         });
    //         this.data = data;
    //       }
    //     })
    //     .always(data => {
    //       this.loading = false;
    //     });
    // },

    toCreate(item) {
      // this.$router.push({
      //   path: '/startup/create',
      //   query: { industryId: id, industryKey: key }
      // });
      if (item.key === 'restaurant') {
        this.$message({
          message: '行业暂未开放, 敬请期待...',
          type: 'warning',
          duration: 3000
        });
        return;
      }
      this.$router.push({
        path: '/startup/template-list',
        query: { industryId: item.id, industryKey: item.key, bgImgae: item.bgClass }
      });
    }
  }
};
</script>

