<template>
  <div class="business-common-contact-us">
    <el-steps :active="active"
              process-status="wait"
              align-center>
      <el-step title="填写需求"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <edit v-if="isEdit"
          ref="edit"
          @saved="onSaved"></edit>
    <success :add-content='addContent'
             @finish="onFinish"
             v-else></success>
  </div>
</template>
<script>
import './index.less';
import edit from './edit.vue';
import success from './success.vue';

export default {
  name: 'contactUS',
  components: { edit, success },
  props: {
    isAllowOperation: {
      type: Boolean,
      default: false
    },
    jumpLink: {
      type: String,
      default: '/wkb.html'
    }
  },
  data() {
    return {
      isEdit: true,
      addContent: null
    };
  },
  computed: {
    active() {
      return this.isEdit ? 1 : 2;
    }
  },
  methods: {
    // 保存成功
    onSaved() {
      this.addContent = this.$refs.edit.form;
      this.isEdit = false;
    },
    // 点击完成
    onFinish() {
      window.top.location.href = this.jumpLink;
    }
  }
};
</script>

