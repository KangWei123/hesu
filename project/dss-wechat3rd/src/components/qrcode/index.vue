<template>
  <div class="qrcode">
    <!-- 能查看时 -->
    <el-popover placement="bottom" title="二维码" width="200" v-if="lookitem" trigger="click">
      <el-select v-model="platform" @change="changePlatform" placeholder="请选择平台">
        <el-option v-for="item in qrCodePlatformEnum" :key="item.key" :label="item.name" :value="item.key"> </el-option>
      </el-select>
      <img :src="qrCode" v-if="qrCode !== null" class="qr-code" width="200" />
      <div v-loading="qrCodeLoading" v-else class="qr-code-loading" style="width: 200px; height: 200px"></div>
      <a href="javascript:;" slot="reference">二维码</a>
    </el-popover>

    <!-- 没有权限时 -->
    <el-popover placement="top-start" width="200" v-else trigger="hover" :content="scopeMenuEnum.disabledBtnTip">
      <a href="javascript:void(0);" slot="reference">二维码</a>
    </el-popover>
  </div>
</template>

<script>
  import { qrCodePlatformEnum } from '../../constants/enum';
  import goodsTypeEnum from '../../constants/goodsTypeEnum';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import constants from '../../constants';
  import services from '@/dss-common/utils/services';
  import { mapState } from 'vuex';
  import './index.less';

  export default {
    name: 'Qrcode',
    props: {
      lookitem: {
        type: Boolean,
        default: true,
      },
      goodsType: {
        type: String,
        default: '',
      },
      itemNo: {
        type: String,
        default: '',
      },
      estatePath: {
        type: String,
        default: '',
      }, // 楼盘行业地址
    },
    data() {
      return {
        qrCodePlatformEnum,
        platform: '',
        qrCode: null,
        qrCodeLoading: false,
        scopeMenuEnum,
      };
    },
    methods: {
      /**
       * 选择平台
       */
      changePlatform(val) {
        switch (val) {
          case 'wx':
            this.getQRcode(this.itemNo);
            break;
          case 'bd':
            this.getQRcode(this.itemNo, 'tt');
            break;
          case 'h5':
            this.getQRcode(this.itemNo, 'h5');
            break;
        }
      },

      /**
       * 初始化数据
       */
      initData() {
        this.qrCode = null;
        this.qrCodeLoading = true;
      },

      /**
       * 格式化字符串成url参数
       */
      urlEncode(data) {
        const _result = [];
        for (const key in data) {
          const value = data[key];
          _result.push(`${key}=${value}`);
        }
        return _result.join('&');
      },

      /**
       * 获取二维码
       */
      getQRcode(itemNo, type = 'wx') {
        this.initData();
        let maPath = '';
        if (this.goodsType.type === goodsTypeEnum.server.type) {
          maPath = 'pages/serve-detail/index';
        } else if (this.goodsType.type === goodsTypeEnum.card.type) {
          maPath = 'pages/card-detail/index';
        } else if (this.goodsType.type === goodsTypeEnum.product.type) {
          maPath = 'wxat-common/pages/goods-detail/index';
        } else if (this.goodsType.type === goodsTypeEnum.estate.type) {
          maPath = this.estatePath;
        }

        let url = constants.Api.goods.getQRCode;
        let params = {
          verificationNo: itemNo,
          verificationType: 5,
          maPath,
        };

        // 头条或h5的二维码
        if (type === 'tt' || type === 'h5') {
          url = constants.Api.goods.getQRCodeOthers;
          if (maPath === '') maPath = 'wxat-common/pages/goods-detail/index';
          maPath = `${maPath}?itemNo=${itemNo}`;
          if (type === 'tt') {
            params = {
              qrCodeType: type,
              path: maPath,
              appName: 'douyin',
            };
          }
          if (type === 'h5') {
            // 生成租户信息(epId,appid,sellerId,sellerTemplateId)
            const e = encodeURIComponent(
              btoa(`${this.userInfo.appInfo.epId}_${this.userInfo.appInfo.id}_${this.sellerId}_${this.curTemplateId}`)
            );
            // 是否存在公众号aid
            let urlStr = '';
            if (this.wxAuthInfo && this.wxAuthInfo.wxMpAppId) {
              urlStr += `&aid=${this.wxAuthInfo.wxMpAppId}`;
            }
            // cid
            if (this.wxAuthInfo && this.wxAuthInfo.wxComponentAppId) {
              urlStr += `&cid=${this.wxAuthInfo.wxComponentAppId}`;
            }
            params = {
              qrCodeType: type,
              content: `${window.location.origin}/h5/?e=${e}${urlStr}#/${maPath}`,
            };
          }
        }
        services
          .get(url, {
            params,
            action: '获取商品二维码',
          })
          .then(rs => {
            this.qrCode = typeof rs.data === 'string' ? rs.data : rs.data.qrCode;
          })
          .catch(err => {
            console.error(err);
          })
          .always(() => {
            this.qrCodeLoading = false;
          });
      },
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
  };
</script>
