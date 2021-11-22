const reg = new RegExp('https://.*?com', '');

/**
 * 素材路径替换, 以支持跨域
 * @param {string} originImage
 * @returns
 */
export function materialUrlReplace(originImage) {
  if (originImage == null) {
    return originImage;
  }

  // 判断是腾讯云线上素材地址还是测试环境素材地址,需配合nginx反向代理到不同的地址
  // location ~* /from-material/online/
  // location ~* /from-material/test/
  let envPrefix = '';
  if (originImage.indexOf('test-material') !== -1) {
    envPrefix = '/test';
  } else if (originImage.indexOf('online-material') !== -1) {
    envPrefix = '/online';
  } else {
    return originImage;
  }

  let tail = originImage.replace(reg, '');
  if (!!tail && tail.indexOf('from-material') === -1 && tail.indexOf('/image') === -1) {
    tail = '/from-material' + envPrefix + tail;
  }
  return tail;
}
