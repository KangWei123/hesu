<template>
  <div class="view-app">
    <div class="_header">
      <img class="icon"
           v-if="form.logo"
           :src="form.logo" />
      <img class="icon"
           v-else
           :src="require('@/dss-common/img/brand/logo-default.png')" />
      <div class="info-wrap">
        <div class="_name">{{form.name}}</div>
        <div class="_industry">主营：{{form.industryName}}</div>
      </div>
    </div>

    <div class="row"
         :class="index==0?'first':''"
         v-for="(key,index) in order"
         :key="index">
      <div class="title">{{names[key]}} ：</div>
      <div class="value">{{form[key] | empty}}</div>
    </div>

    <el-button type="primary"
               class="btn"
               @click="$emit('modify')">修改品牌</el-button>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      curApp: 'curApp'
    })
  },
  data() {
    return {
      order: ['name', 'servicePhone', 'contactsName', 'contactsPhone'],
      names: {
        name: '品牌名称',
        servicePhone: '客服电话',
        contactsName: '联系人姓名',
        contactsPhone: '联系人电话'
      },
      form: {
        name: '',
        industryName: '',
        servicePhone: '',
        contactsName: '',
        contactsPhone: '',
        logo: ''
      }
    };
  },
  filters: {
    empty(val) {
      if (!val) {
        return '-';
      }
      return val;
    }
  },
  mounted() {
    //赋值
    for (let key in this.form) {
      if (!!this.curApp && this.curApp.hasOwnProperty(key)) {
        this.form[key] = this.curApp[key];
      }
    }
  }
};
</script>
