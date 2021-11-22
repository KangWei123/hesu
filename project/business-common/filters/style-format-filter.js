/**
 * 背景图片
 * @param {*} val
 * @returns
 */
export function bgImage(val) {
  if (val) {
    return {
      backgroundImage: 'url(' + val + ')',
    };
  }
}
