const SimpleDayNames = ['日', '一', '二', '三', '四', '五', '六'];
/**
 * Created by admin on 2019/7/5.
 * @author lemon<李亦黎>
 */
function toDecimalDays(num) {
  // 周日 -> 周六
  const days = [!0, !0, !0, !0, !0, !0, !0];
  days.forEach((_, index) => {
    days[index] = (num >> index) % 2 == 1;
  });
  return days.reverse();
}

function toBinaryDays(days) {
  let str = '';
  days.forEach(n => {
    str += n ? 1 : 0;
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

export { toDecimalDays, toBinaryDays, toShowNames };
