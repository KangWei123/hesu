import materialType from '../views/new-picture/components/material-type';
import videoIcon from '../images/video.png';
import emptyIcon from '../images/category/empty.png';
import utils from '@/dss-common/utils/index';
import { PROJECT_STORAGE_KEY } from '@/mod-kangyang/src/constants';

export function formatCardId(carId) {
  carId = carId || '';
  return carId.substr(0, 3) + '***********' + carId.substr(-4);
}

/**
 * 是否支持文件夹编辑
 * @param {*} item
 */
export function isEditableFolder(item) {
  // null 或为 0 的支持编辑
  return !item.folderType;
}

/**
 * 获取素材封面
 * @param {*} item
 */
export function getCover(item) {
  if (!item) {
    return emptyIcon;
  }

  return item.type === materialType.materialType.VIDEO
    ? item.coverUrl || videoIcon
    : item.type === materialType.materialType.IMAGE
    ? item.coverUrl || item.cdnUrl || item.localUrl
    : emptyIcon;
}

export function formatEmptyTextInTable(str) {
  let ret = str;
  if (ret === undefined || ret === null || ret === '') {
    ret = '-';
  }
  return ret;
}

export function getTimeStamp(time) {
  const arr = time.split(':').map(i => Number(i));
  return arr[0] * 3600 + arr[1] * 60;
}

/**
 * 为数组元素添加序号
 * @param Array<T> list
 * @param number pageNo
 * @param number pageSize
 * @returns Array<T>
 */
export function addIdxToListItem(list, pageNo, pageSize) {
  return list.map((item, i) => ({ ...item, idx: (pageNo - 1) * pageSize + i + 1 }));
}

export function formatDateIfNeed(value, tail) {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  const formatted = utils.timeFormat(value, 'YYYY-MM-DD');
  if (tail) {
    return `${formatted} ${tail}`;
  }
  return formatted;
}

export function getSelectedProjectIdFromStorage() {
  const value = window.localStorage.getItem(PROJECT_STORAGE_KEY) || 0;
  return +value;
}

export function setProjectIdToStorage(value) {
  window.localStorage.setItem(PROJECT_STORAGE_KEY, value);
}
