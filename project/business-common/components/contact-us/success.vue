<template>
  <div class="contact-us-success">
    <div class="content">
      <p class="title">完成</p>
      <div class="top">
        <img class="logo-finish"
             :src="require('@/dss-common/img/logo-finish.png')" />
        <div class="top-tips">
          <p class="main-title">提交成功</p>
          <p class="sub-title">请耐心等待，我们即将安排专人为您服务，请保持电话畅通</p>
        </div>
      </div>
      <div class="store-content">
        <div class="tab">
          <p class="tab-title">品牌名称：</p>
          <p class="tab-text">{{addContent.brandName}}</p>
        </div>
        <div class="tab">
          <p class="tab-title">联系人：</p>
          <p class="tab-text">{{addContent.contactName}}</p>
        </div>
        <div class="tab">
          <p class="tab-title">联系电话：</p>
          <p class="tab-text">{{addContent.phone}}</p>
        </div>
        <div class="tab">
          <p class="tab-title">备注：</p>
          <p class="tab-text">{{addContent.remark}}</p>
        </div>
      </div>
      <div class="btn-box">
        <el-button type="primary"
                   @click="onFinish('form')">完成
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    addContent: {
      type: Object,
      default: function() {
        return null;
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    // 点击完成
    onFinish() {
      this.$emit('finish');
    }
  }
};
</script>

