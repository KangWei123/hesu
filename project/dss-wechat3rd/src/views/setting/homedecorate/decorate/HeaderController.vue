<template>
  <div class="decorate-header-nav">
    <div class="nav-box" id="key-header">
      <div class="pc">
        <div class="header">
          <div class="left-box">
            <div class="back" @click="onBack">
              <i class="el-icon-caret-left"></i>
              <span>返回</span>
            </div>
            <div class="desc">微商城装修</div>
          </div>
          <div v-if="canSave" class="btn-box">
            <el-button type="primary" :loading="loading" @click="onSave">保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      canSave: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      onBack() {
        if (!this.canSave) {
          this.$router.back(-1);
          return;
        }
        this.$confirm('模板未保存，继续操作将丢失已设置的内容。', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$router.back(-1);
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            });
          });
      },
      onSave() {
        this.$emit('onSave');
      },
    },
  };
</script>

<style lang="less" scoped>
  .decorate-header-nav {
    .pc {
      position: fixed;
      top: 0px;
      padding: 0;
      width: 100%;
      min-width: 1000px;
      z-index: 99;

      .header {
        display: flex;
        justify-content: space-between;
        height: 56px;
        padding-right: 30px;
        // padding: 0 30px;
        text-align: right;
        background-color: #fff;
        border-bottom: 1px solid #e0e0e0;

        .index {
          .pchm-index {
            opacity: 1;
          }
        }

        .btn-box {
          display: inline-block;
          height: 56px;
          line-height: 56px;

          a {
            display: inline-block;
            vertical-align: middle;
            width: 80px;
            text-align: center;
            line-height: 30px;
            box-sizing: border-box;
            border-radius: 4px;
            color: #fff;
            font-size: 14px;
          }

          .save {
            background: #fa7516;
            border-radius: 4px;
          }
        }

        .avatar-box {
          display: inline-block;
          vertical-align: middle;
          margin-left: 25px;
          height: 60px;
          position: relative;
          width: auto !important;
          opacity: 1;
          transition: opacity 0.4s ease;

          img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: inline-block;
            vertical-align: middle;
          }

          .avatar-blue {
            display: none;
          }

          .user-info {
            display: inline-block;
            vertical-align: middle;
            margin-left: 10px;
            color: #fff;
            font-size: 16px;
            height: 60px;
            line-height: 60px;
          }

          .avatar-ul {
            position: absolute;
            padding: 12px 0;
            width: 114px;
            left: 50%;
            background-color: #ffffff;
            border-radius: 4px;
            box-shadow: 0 7px 47px 0 rgba(148, 148, 148, 0.21);
            z-index: 9999;
            transform: scaleY(0) translateX(-50%);
            -ms-transform: scaleY(0) translateX(-50%);
            -moz-transform: scaleY(0) translateX(-50%);
            -webkit-transform: scaleY(0) translateX(-50%);

            a {
              display: block;
              width: 80%;
              text-align: center;
              padding: 5px 0;
              color: #333333;
              font-size: 16px;
              margin: 0 auto;
              border-radius: 4px;
            }

            a:hover {
              color: #3268d5 !important;
            }
          }
        }

        .avatar-box:hover {
          .avatar-ul {
            transform: scaleY(1) translateX(-50%);
            -ms-transform: scaleY(1) translateX(-50%);
            -moz-transform: scaleY(1) translateX(-50%);
            -webkit-transform: scaleY(1) translateX(-50%);
          }
        }
      }

      .left-box {
        display: flex;
        align-items: center;

        .back {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 107px;
          height: 56px;
          line-height: 56px;
          background: #f4f7fe;

          i {
            font-size: 21px;
            color: #717378;
            margin-right: 6px;
          }

          span {
            font-size: 16px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            color: #191c3d;
          }
        }
      }

      .desc {
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        color: #191c3d;
        line-height: 16px;
        margin-left: 30px;
      }
    }
  }
</style>
