// @ts-check
import dateUtils from '@/dss-common/utils/date';

/**
 * 日期格式化
 * @param {Date | number | string} date
 * @param {string} format
 * @returns
 */
export function dateFormat(date, format = 'YYYY/MM/DD') {
  return dateTimeFormat(date, format);
}

/**
 * 时间格式化
 * @param {Date | number | string} date
 * @param {string} format
 */
export function timeFormat(date, format = 'HH:mm') {
  return dateTimeFormat(date, format);
}

/**
 * 日期时间格式化
 * @param {Date | number | string} date
 * @param {string} format
 */
export function dateTimeFormat(date, format = 'YYYY/MM/DD HH:mm') {
  if (!date) {
    return '-';
  }

  return dateUtils.format(typeof date === 'number' || typeof date === 'string' ? new Date(date) : date, format);
}
