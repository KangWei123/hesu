<template>
  <div class="box">
    <div v-if="isLogin">
      <img src="../images/qier.png" width="48" class="head" />
      <p class="name">肌肉小王子</p>
      <div class="menber-info">
        <p class="id">ID：8920191011</p>
        <p class="currency">和素币：1980</p>
        <p class="discount">优惠券：4张</p>
      </div>
      <div class="sign-out">退出账号</div>
    </div>
    <div v-else>
      <img src="../images/scancode.png" class="scancode" @click="scancode" />
      <el-input icon="el-icon-search" type="search" placeholder="输入手机号" class="search"></el-input>
    </div>
  </div>
</template>

<script>
  import './member-info.less';

  export default {
    data() {
      return {
        isLogin: true,
      };
    },

    methods: {
      scancode() {
        console.log('1111');
        window.navigator.mediaDevices
          .getUserMedia()
          .then(function (stream) {
            // 使用这个stream
            console.log(stream);
          })
          .catch(function (err) {
            console.log(err);
          });
      },
    },
  };
</script>
