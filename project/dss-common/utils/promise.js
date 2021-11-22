/**
 * Promise 相关方法
 */

/**
 *
 * 当 promise 抛出异常时，返回 fb
 * @param {Promise<any>} promise
 * @param {any} fb
 */
export async function fallback(promise, fb) {
  try {
    return await promise;
  } catch (err) {
    console.warn('fallback to ', fb);
    return fb;
  }
}

/**
 * @param {any} obj
 * @returns {obj is Promise}
 */
export function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

/**
 * 执行器，fn 可以是普通对象、函数。函数可以返回 promise，该执行器会自动选择合适的方式执行和获取结果
 * @param {object | (T) => any} fn
 * @param {T} params
 */
export async function execute(fn, params) {
  if (typeof fn === 'function') {
    const rt = fn(params);
    if (isPromise(rt)) {
      return await rt;
    }

    return rt;
  }

  return fn;
}
