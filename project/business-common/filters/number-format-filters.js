/**
 * 这里是常用的一些过滤器
 * 从 @dss-common/utils/filters 中迁移
 */
import utils from '@/dss-common/utils';

export function time(value, format) {
  return utils.timeFormat(value, format);
}

export function price(value, scale = 100) {
  return value ? (value / scale).toFixed(2) : '0.00';
}

export function percent(value, max = 100, decimal = 2) {
  return max ? `${((value / max) * 100).toFixed(decimal)}%` : '0.00%';
}

export function subPercent(value, max = 100, decimal = 2) {
  let num = (value / max) * 100;
  const str = num.toString().split('.');
  if (str[1]) {
    num = str[0] + '.' + str[1].substring(0, decimal);
  } else {
    num.toFixed(decimal);
  }
  return max ? `${num}%` : '0.00%';
}

export function rate(value) {
  return (value * 100).toFixed(2) + '%';
}

export function number(value) {
  return value !== null ? utils.addSeparator(value) : 'N/A';
}

export function discount(value) {
  if (value % 10 === 0) return value / 10;
  return (value / 10).toFixed(1);
}

export function Percentage(value) {
  let sign = '';
  if (value > 0) {
    sign = '+';
  }
  return sign + (value * 100).toFixed(2) + '%';
}

export function thousands(num) {
  num = num || 0;
  if (num.toString().indexOf('.') > 0) {
    const list = num.toString().split('.');
    return list[0].toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + list[1];
  } else {
    return num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }
}

/**
 * 转换天小时分钟
 * @param day
 * @param [time] 时间
 * @returns {[*,*]}
 */
export function time2String(t) {
  const days = parseInt(t / (3600 * 24));
  const hours = parseInt((t % (60 * 60 * 24)) / (60 * 60));
  const minutes = parseInt((t % (60 * 60)) / 60);
  let date = '';
  if (days) {
    date += days + '天';
  }
  if (hours) {
    date += hours + '时';
  }
  if (minutes) {
    date += minutes + '分';
  }
  return date;
}
