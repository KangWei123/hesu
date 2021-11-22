import utils from '@/dss-common/utils';

export default {
  /**
   * 解析活动效果数据，组装成前端展示的数据
   * */
  parseEffectResponse(res) {
    const { total, activityPeriod, lastPeriod } = res;

    const result = {
      overview: { chart: { passengerNum: [], customerNum: [], newCustomerNum: [], oldCustomerNum: [] }, total: null },
      detail: null
    };

    const xAxis = [];

    //组装活动期间各个tab的数据
    //活动期间客流数
    const afterPassengerNum = [];
    //活动期间客户数
    const afterCustomerNum = [];
    //活动期间新客户数
    const afterNewCustomerNum = [];
    //活动期间老客户数
    const afterOldCustomerNum = [];

    if (activityPeriod && activityPeriod.length) {
      activityPeriod.forEach(item => {
        item.time = utils.timeFormat(new Date(item.time), 'YYYY-MM-DD');
        item.entryRate = item.entryRate !== null ? utils.decimalToPercent(item.entryRate) + '%' : 'N/A';
        xAxis.push(item.time);
        afterPassengerNum.push(item.passengerNum);
        afterCustomerNum.push(item.customerNum);
        afterNewCustomerNum.push(item.newCustomerNum);
        afterOldCustomerNum.push(item.oldCustomerNum);
      });
    }

    //组装活动之前各个tab的数据
    const prePassengerNum = [];
    const preCustomerNum = [];
    const preNewCustomerNum = [];
    const preOldCustomerNum = [];

    if (lastPeriod && lastPeriod.length) {
      lastPeriod.forEach(item => {
        prePassengerNum.push(item.passengerNum);
        preCustomerNum.push(item.customerNum);
        preNewCustomerNum.push(item.newCustomerNum);
        preOldCustomerNum.push(item.oldCustomerNum);
      });
    }

    result.overview.chart.passengerNum.push(
      { value: prePassengerNum, xAxis: xAxis, name: '活动之前' },
      { value: afterPassengerNum, xAxis: xAxis, name: '活动期间' }
    );
    result.overview.chart.customerNum.push(
      { value: preCustomerNum, xAxis: xAxis, name: '活动之前' },
      { value: afterCustomerNum, xAxis: xAxis, name: '活动期间' }
    );
    result.overview.chart.newCustomerNum.push(
      { value: preNewCustomerNum, xAxis: xAxis, name: '活动之前' },
      { value: afterNewCustomerNum, xAxis: xAxis, name: '活动期间' }
    );
    result.overview.chart.oldCustomerNum.push(
      { value: preOldCustomerNum, xAxis: xAxis, name: '活动之前' },
      { value: afterOldCustomerNum, xAxis: xAxis, name: '活动期间' }
    );
    result.overview.total = total;
    result.detail = activityPeriod || [];
    return result;
  }
};
