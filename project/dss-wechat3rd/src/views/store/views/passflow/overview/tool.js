/**
 * Created by love on 18/7/9.
 * @author trumpli<李志伟>
 */

export default {
  /**
   * 过滤 客流分析数据 给到ui展示
   * @param result
   * @returns {{name: null, xAxis: null, value: null, table: null}}
   */
  processApiAnalyseData(result, valueKey = 'count', type = '客流'){
    const ret = {'name':null,'xAxis': null,'value':null,'table':null};
    const list = result.data || [];
    if(!!list.length){
      const xAxis = [];
      const value = [];
      list
        .slice()
        .sort((before,after)=>{
          return before.date > after.date ? 1 : -1;
        })
        .forEach((item)=>{
          if (item.dayOfWeek) {
            xAxis.push(item.date + "\n\n" + item.dayOfWeek);
          } else {
            xAxis.push(item.date);
          }
          value.push(item[valueKey])
        });
      ret.name = `${type}量`;
      ret.xAxis = xAxis;
      ret.value = value;
      ret.table = list;
    }
    return ret;
  },
  /**
   * 过滤 时段客流对比数据 给到ui展示
   * @param result
   * @returns {{customerCompare: null, customerCompareTable: null, customerPeriods: null}}
   */
  processApiCustomerCompareData(result, valueKey = 'passenger'){
    const data= result.data || {};
    const periods = {};
    const tables = [];

    const ret = {
      customerCompare : null,
      customerCompareTable : null,
      customerPeriods : null
    };

    //客流列表数据
    for(let date in data){
      tables.push({
        'tdate': date,
        'compareData': data[date]
          .map((item)=>{
            const thePeriod = !periods.hasOwnProperty(item.period) ? periods[item.period] = [] : periods[item.period];
            const passenger = item[valueKey] || 'N/A';
            thePeriod.push({
              date,'passenger':item[valueKey]
            });
            return {
              'period': item.period,
              'passenger': passenger
            }
          })
          //时段升序
          .sort((before,after)=>{
            return before.period > after.period ? 1 : -1;
          })
      })
    }

    //没有表格数据，空处理
    if(!tables.length){
      return ret;
    }

    //合成曲线数组
    const periodArray = [];
    ret.customerPeriods = [];
    for(let name in periods){
      ret.customerPeriods.push(name);
      const xAxis = [];
      const value = [];
      periods[name]
        .sort((before,after)=>{
          return before.date > after.date ? 1 : -1;
        })
        .forEach((item)=>{
          xAxis.push( item['date'] );
          value.push( item['passenger'] );
        });
      periodArray.push({xAxis,value,name});
    }

    //表格时段头，升序排序
    ret.customerPeriods.sort((before,after)=>{
      return before > after ? 1 : -1;
    });

    //曲线升序
    ret.customerCompare = periodArray.sort((before,after)=>{
      return before.name > after.name ? 1 : -1;
    });
    //列表降序
    ret.customerCompareTable = tables.sort((before,after)=>{
      return before.tdate > after.tdate ? -1 : 1;
    });

    return ret;
  }
};
