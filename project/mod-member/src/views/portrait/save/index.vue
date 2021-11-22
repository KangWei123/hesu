<template>
  <div class="save">
    <i class="el-icon-success"></i>
    <span class="save-hint">保存人群成功</span>
    <div class="btn-group">
      <el-button class="btn" @click="checkGroup">查看人群包</el-button>
      <el-button class="btn" @click="onCreate">再创建一个</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
    components: {},
    methods: {
      checkGroup() {
        this.$router.push({
          name: 'groupList',
        });
      },
      onCreate() {
        this.$router.push({
          name: 'portrait',
        });
      },
    },
  };
</script>
<style lang="less">
  .save {
    min-height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .el-icon-success {
      color: #009a61;
      font-size: 80px;
    }
    .save-hint {
      font-size: 40px;
      color: #000000;
      margin: 30px 0 50px 0;
      display: inline-block;
    }
    .btn-group {
      display: flex;
      align-items: center;
    }
    .btn {
      width: 120px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 20px;
    }
  }
</style>
