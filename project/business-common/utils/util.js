const DayValueMap = [
  { label: '周日', value: 0 },
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 }
];
const SimpleDayNames = ['日', '一', '二', '三', '四', '五', '六'];
function toDecimalDays(num) {
  //周日 -> 周六
  const days = [!0, !0, !0, !0, !0, !0, !0];
  days.forEach((_, index) => {
    days[index] = (num >> index) % 2 == 1;
  });
  return days.reverse();
}

function toBinaryDays(days) {
  let str = '';
  days.forEach(n => {
    str += !!n ? 1 : 0;
  });
  return parseInt(str, 2);
}

function toShowNames(num) {
  const array = toDecimalDays(num);
  const names = [];
  array.forEach((is, index) => {
    if (is) {
      names.push(SimpleDayNames[index]);
    }
  });
  return names.length > 0 ? '周' + names.join(' ') : '';
}

export { DayValueMap, toDecimalDays, toBinaryDays, toShowNames };
