<template>
  <el-popover :placement="placement" trigger="click" attribute @show="getQrcode">
    <div class="container-img" v-loading="loading">
      <el-image :src="qrcodeUrl" :alt="loadingText" />
    </div>
    <slot slot="reference"></slot>
  </el-popover>
</template>

<script>
  import { projectApi } from '@/mod-kangyang/src/api/project';

  export default {
    name: 'Popover',
    props: {
      path: {
        type: String,
        default: '',
      },
      placement: {
        type: String,
        default: 'left-end',
      },
      trigger: {
        type: String,
        default: 'click',
      },
      queryId: [String, Number],
    },
    data() {
      return {
        loading: false,
        loadingText: '加载失败',
        qrcodeUrl: '',
      };
    },
    methods: {
      getQrcode() {
        this.loading = true;
        /**
         * TODO: 待验证，正式版未上线
         */
        projectApi
          .getQrcode({ urlPath: this.path, shareParam: this.queryId })
          .done(res => {
            const { data, success, detailMessage } = res;
            if (success) {
              /**
               * const BASE64Prefix = "data:iamge/*;url "
               * 如果后端返回数据不是完整的格式，加上 data url 前缀
               */
              this.qrcodeUrl = data;
              this.loadingText = detailMessage;
            }
          })
          .always(() => {
            this.loading = false;
          });
      },
    },
  };
</script>

<style lang="less" scoped>
  .container-img {
    width: 150px;
    height: 150px;
    background: white;

    .el-image {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
  }
</style>
