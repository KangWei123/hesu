// @ts-check
/**
 * 页面入口
 * @type {PageEntry[]}
 */
module.exports = [
  // 惟客宝 微信授权成功
  {
    name: 'wechat_authorization_success',
    entry: 'src/html/authorization-success/index.js',
    template: 'src/html/authorization-success/index.html',
  },
  // 惟客宝 微信授权失败
  {
    name: 'wechat_authorization_fail',
    entry: 'src/html/authorization-fail/index.js',
    template: 'src/html/authorization-fail/index.html',
  },
  // 惟客宝
  {
    name: 'wkb',
    entry: 'src/html/wkb/index.js',
    template: 'src/html/wkb/index.html',
  },
  {
    name: 'ai',
    entry: 'src/views/store/views/ai/index.js',
    template: 'src/views/store/views/ai/index.html',
    filename: 'store/ai.html',
  },
  {
    name: 'dataScreen',
    entry: 'src/views/store/views/data-screen/index.js',
    template: 'src/views/store/views/data-screen/index.html',
    filename: 'store/data-screen.html',
  },
  {
    name: 'faceScore',
    entry: 'src/views/store/views/face-score/index.js',
    template: 'src/views/store/views/face-score/index.html',
    filename: 'store/face-score.html',
  },
  {
    name: 'enterFaceScore',
    entry: 'src/views/store/views/face-score/enter.js',
    template: 'src/views/store/views/face-score/enter.html',
    filename: 'store/enter-face-score.html',
  },
  {
    name: 'wakeScore',
    entry: 'src/views/store/views/wake-score/index.js',
    template: 'src/views/store/views/wake-score/index.html',
    filename: 'store/wake-score.html',
  },
  {
    name: 'socketAi',
    entry: 'src/views/store/views/socket-ai/index.js',
    template: 'src/views/store/views/socket-ai/index.html',
    filename: 'store/socket-ai.html',
  },
  {
    name: 'socketDataScreen',
    entry: 'src/views/store/views/socket-data-screen/index.js',
    template: 'src/views/store/views/socket-data-screen/index.html',
    filename: 'store/socket-data-screen.html',
  },
];
