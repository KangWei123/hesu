import Promise from './index';
import promiseFinally from './finally';

/** @suppress {undefinedVars} */
let globalNS = (function() {
  // the only reliable means to get the global object is
  // `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  throw new Error('unable to locate global object');
})();

console.log('检测polyfill挂载状态...', Promise);

if (!('Promise' in globalNS)) {
  globalNS.Promise = Promise;
} else if (!globalNS.Promise.prototype.finally) {
  globalNS.Promise.prototype.finally = promiseFinally;
}

export default globalNS.Promise;
