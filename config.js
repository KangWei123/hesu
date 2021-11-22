// @ts-check
/**
 * 项目配置
 */
const path = require('path');
const pkg = require('./package.json');

/**
 * 主域名
 */
const DOMAIN = 'wakecloud.com';
/**
 * HTTP 协议
 */
const PROTOCOL = 'https';
/**
 * CDN 域名
 */
const CDN_DOMAIN = process.env.WK_CDN_DOMAIN || `cdn.${DOMAIN}`;
/**
 * API 域名
 */
const BACKEND_DOMAIN = process.env.WK_DOMAIN || `www.${DOMAIN}`;
const ASSETS_DIR = 'resources/dss-web-portal/';

/**
 * 如果后台session 设置的cookie 域名和当前开发域名不一致，则需要进行 rewrite
 * 正则表达式字符串
 */
const SESSION_DOMAIN = 'wakecloud\\.com';

/**
 * 前端版本号
 */
const VERSION = pkg.version;

module.exports = {
  /**
   * 可以在代码中访问的内置常量
   */
  constants: {
    DOMAIN,
    CDN_DOMAIN,
    BACKEND_DOMAIN,
    ASSETS_DIR,
    VERSION,
    PROTOCOL,
    ASSETS_URL: `//${CDN_DOMAIN}/${ASSETS_DIR}`,
    CDN_URL: `${PROTOCOL}://${CDN_DOMAIN}`,
    BACKEND_URL: `${PROTOCOL}://${BACKEND_DOMAIN}`,
  },
  /**
   * 静态资源部署位置
   */
  publicPath: `//${CDN_DOMAIN}/`,
  // 暂不设置cdn域名
  // publicPath: '/',
  /**
   * 静态资源放置的子目录
   */
  assetsDir: ASSETS_DIR,
  /**
   * 开发环境接口代理
   */
  proxy: {
    '/mock': {
      changeOrigin: true,
      secure: false,
      ws: true,
      target: 'http://yapi.wakedata.com',
    },
    ...[
      '/dw',
      '/crossGetUserInfo',
      '/fd',
      '/wp',
      '/c',
      '/dwifi',
      '/image',
      '/dsp',
      '/athena',
      '/dmp2',
      '/from-material',
      '/mem',
      '/plt',
      '/scrmm',
      '/sale',
      '/mall',
      '/ky',
      '/org',
      '/p',
      '/mc',
      '/business',
      '/base',
      '/am',
      '/mtool',
    ].reduce((pre, cur) => {
      pre[cur] = {
        changeOrigin: true,
        secure: false,
        ws: true,
        target: `${PROTOCOL}://${BACKEND_DOMAIN}`,
        // 修改cookie DOMAIN, 否则可能导致无法登陆
        onProxyRes(proxyRes, req, res) {
          const cookies = proxyRes.headers['set-cookie'];
          if (cookies) {
            // cookie 域名替换
            const newCookie = cookies.map(function (cookie) {
              return cookie.replace(new RegExp(`Domain=${SESSION_DOMAIN}`, 'i'), 'Domain=' + DOMAIN);
            });
            proxyRes.headers['set-cookie'] = newCookie;
          }
        },
      };
      return pre;
    }, {}),
  },

  /**
   * 静态资源拷贝
   * TODO: 这些资源都是需要的吗？
   * 注意：这些静态资源只有在全量编译的时候才会被拷贝
   * 具体参数见：https://github.com/webpack-contrib/copy-webpack-plugin/tree/version-6
   */
  resourceCopy: {
    patterns: [
      {
        from: path.resolve(__dirname, './project/dss-common/static'),
        to: ASSETS_DIR,
        filter: p => !p.endsWith('.ico'),
      },
      {
        from: path.resolve(__dirname, './third-dist/libs/resources/'),
        to: 'resources/',
      },
      {
        from: path.resolve(__dirname, './third-dist/fonts/fontawesome/'),
        to: path.join(ASSETS_DIR, '/fonts/'),
      },
      {
        from: path.resolve(__dirname, './third-dist/fonts/roboto/'),
        to: path.join(ASSETS_DIR, '/fonts/'),
      },
      {
        from: path.resolve(__dirname, './third-dist/fonts/Montserrat-Bold/'),
        to: path.join(ASSETS_DIR, '/fonts/'),
      },
      {
        from: path.resolve(__dirname, './third-dist/fonts/NotCourierSans/'),
        to: path.join(ASSETS_DIR, '/fonts/'),
      },
      // 微信验证文件
      // {
      //   from: path.resolve(__dirname, './third-dist/wx-verify/'),
      // },
      {
        from: path.resolve(__dirname, './third-dist/cdn/resources/'),
        to: 'resources/',
      },
      {
        from: path.resolve(__dirname, './third-dist/authorization/authorization.html'),
      },
      {
        from: path.resolve(__dirname, './third-dist/authorization/work-wechat-authorization-success.html'),
      },
      {
        from: path.resolve(__dirname, './third-dist/authorization/resources/'),
        to: 'resources/',
      },
      {
        from: path.resolve(__dirname, './project/dss-wechat3rd/src/lib/video.html'),
      },
      {
        from: path.resolve(__dirname, './project/dss-wechat3rd/src/lib/minapp.html'),
      },
    ],
  },
};
