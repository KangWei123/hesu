<template>
  <div class="card-course"
       v-loading="loading"
       element-loading-spinner="el-icon-loading">
    <el-breadcrumb separator-class="el-icon-arrow-right"
                   style="font-size: 12px; margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/setting/wx/card'}"
                          replace>
        微信卡券
      </el-breadcrumb-item>
      <el-breadcrumb-item>添加教程</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="course">
      <p class="title">同步会员卡到微信卡包操作说明</p>
      <div class="course-group">
        <p>1.登录微信公众号后台，点击左侧【添加功能插件】，确定已添加【卡券功能】</p>
        <img src="../../../../images/setting/wx-card/course-icon1.png"
             alt=""
             class="course-icon" />
      </div>
      <div class="course-group">
        <p>2.点击左侧【卡券功能】，确定已有【会员卡】权限</p>
        <img src="../../../../images/setting/wx-card/course-icon2.png"
             alt=""
             class="course-icon" />
      </div>
    </div>
  </div>
</template>
<script>
import './course.less';

export default {
  data() {
    return {
      loading: false
    };
  },
  methods: {}
};
</script>
