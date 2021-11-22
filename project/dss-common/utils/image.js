/**
 * 图片处理相关服务
 */
// @ts-check
/**
 * @type {{[k: string]: string}}
 */

const cache = {};
/**
 * 圆形图片, 通常用于头像
 * @param {string} src
 * @param {{borderColor: string, borderWidth: number}} [options]
 *  borderColor 为边框颜色, 默认为 #FFF
 *  borderWidth 边框大小 百分比形式, 默认为 0
 * @returns Promise<string>
 */
export async function circlizeImage(src, options) {
  if (src in cache) {
    return cache[src];
  }

  const img = new Image();
  img.src = src;
  img.crossOrigin = 'Anonymous';

  return new Promise((res, rej) => {
    // 使用 Canvas 生成圆形图片
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // 按最小边来填充
      const width = (canvas.width = canvas.height = Math.min(img.naturalWidth, img.naturalHeight));
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        rej(new Error('failed to getContext'));
        return;
      }

      ctx.arc(width / 2, width / 2, width / 2, 0, 2 * Math.PI);
      ctx.clip();

      /**
       * @param {number} size
       * @param {number} targetSize
       */
      const getPosition = (size, targetSize) => {
        return size === targetSize ? 0 : Math.abs(targetSize - size) / 2;
      };

      ctx.drawImage(img, getPosition(img.naturalWidth, width), getPosition(img.naturalHeight, width));

      if (options && options.borderWidth) {
        const lineWidth = width * (options.borderWidth / 100);
        ctx.strokeStyle = options.borderColor || '#FFF';
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      const result = canvas.toDataURL('image/png', 1);
      cache[src] = result;
      res(result);
    };

    img.onerror = err => {
      const error = err || img;
      console.error('circlizeImage failed:', error);
      rej(error);
    };
  });
}
