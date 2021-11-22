<template>
  <div class="qrcode-box" v-if="qrcodeUrl">
    <div class="icon-red"></div>
    <img class="qrcode" :src="qrcodeUrl" />
    <el-button type="primary" round class="btn-copy" @click="handleCopy(h5PageUrl)" v-if="h5PageUrl"
      >复制链接</el-button
    >
  </div>
</template>

<script>
  // eslint-disable-next-line local-rules/no-cross-import
  import constants from '@/dss-wechat3rd/src/constants';
  import services from '@/dss-common/utils/services';
  import { mapState } from 'vuex';

  export default {
    name: 'H5QrCode',
    data() {
      return {
        qrcodeUrl: '',
        h5PageUrl: '',
      };
    },
    mounted() {
      this.getQrcodeUrl();
    },
    computed: {
      ...mapState({
        curTemplateId: 'sellerTemplateId',
        curApp: 'curApp',
        userInfo: 'userInfo',
        sellerId: 'sellerId',
        wxAuthInfo: 'wxAuthInfo',
      }),
    },
    methods: {
      /**
       * 获取h5链接
       */
      async getQrcodeUrl() {
        const url = constants.Api.goods.getQRCodeOthers;
        const e = encodeURIComponent(
          btoa(`${this.userInfo.appInfo.epId}_${this.userInfo.appInfo.id}_${this.sellerId}_${this.curTemplateId}`)
        );
        let urlStr = '';
        // aid
        if (this.wxAuthInfo && this.wxAuthInfo.wxMpAppId) {
          urlStr += `&aid=${this.wxAuthInfo.wxMpAppId}`;
          // cid
          if (this.wxAuthInfo.wxComponentAppId) {
            urlStr += `&cid=${this.wxAuthInfo.wxComponentAppId}`;
          }
        }
        const params = {
          qrCodeType: 'h5',
          content: `${window.location.origin}/h5/?e=${e}${urlStr}`,
        };
        const { data } = await services.get(url, {
          params,
          action: '获取二维码',
        });
        if (data) {
          this.qrcodeUrl = data;
          this.h5PageUrl = params.content;
        }
      },

      /**
       * 复制
       * @param copyValue 要复制的值
       */
      handleCopy(copyValue) {
        // select()方法只对<input>和<textarea>有效，所以要先将值放到input标签中，再选中复制
        const oInput = document.createElement('input');
        oInput.value = copyValue;
        document.body.appendChild(oInput); // 在document.body末尾添加oInput
        oInput.select(); // 选择对象
        document.execCommand('Copy'); // 执行浏览器复制命令
        document.body.removeChild(oInput); // 删除document.body末尾的oInput

        this.$message({
          message: '复制成功',
          type: 'success',
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .qrcode-box {
    font-size: 12px;
    margin: 50px 0 0 0;
    width: 210px;
    height: 250px;
    position: relative;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #bac6d3;
    text-align: center;

    .icon-red {
      position: absolute;
      top: -23px;
      left: 50%;
      transform: translateX(-50%);
      width: 46px;
      height: 46px;
      background: transparent url(../../images/setting/red-mp-icon.png) no-repeat 0 0;
      background-size: cover;
    }

    .qrcode {
      width: 180px;
      height: 180px;
      margin: 35px auto;
    }

    .btn-copy {
      width: 160px;
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
