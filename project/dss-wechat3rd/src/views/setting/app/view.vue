<template>
  <div class="view-app">
    <div class="_header">
      <img class="icon"
           v-if="form.logo"
           :src="form.logo" />
      <img class="icon"
           v-else
           src="/resources/dss-web-portal/img/beautiful.png?t=2df8512" />
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
      <div class="value">{{key === 'expressType' ? expressType : form[key] | empty}}</div>
    </div>

    <el-button size="mini"
               type="primary"
               class="btn"
               @click="$emit('modify')">修改店铺</el-button>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      curApp: 'curApp'
    }),
    expressType: function() {
      if (this.form.expressType === 1) {
        return '仅快递';
      } else if (this.form.expressType === 0) {
        return '仅自提';
      } else if (this.form.expressType === 2) {
        return '快递或自提';
      }
    }
  },
  data() {
    return {
      order: ['name', 'servicePhone', 'contactsName', 'contactsPhone', 'expressType'],
      names: {
        name: '品牌名称',
        servicePhone: '客服电话',
        contactsName: '联系人姓名',
        contactsPhone: '联系人电话',
        expressType: '发货方式'
      },
      form: {
        name: '',
        industryName: '',
        servicePhone: '',
        contactsName: '',
        contactsPhone: '',
        expressType: '',
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
      if (this.curApp.hasOwnProperty(key)) {
        this.form[key] = this.curApp[key];
      }
    }
  }
};
</script>
