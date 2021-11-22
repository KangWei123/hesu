/**
 * 规范化 App 名称
 * @param {{appName?: string, appId: number, storeName?: string, storeId?: number }} item
 */
export function getAppName(item) {
  if (item.appName) {
    return item.appName;
  }

  if (item.appId) {
    return '-';
  }

  return '集团';
}

export function getStoreName(item) {
  return item.storeName || item.appName || (item.storeId ? '-' : '项目');
}
