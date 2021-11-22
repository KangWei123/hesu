export default function (valueList) {
  return valueList.map(({ value, relation, rules }, i) => {
    if (!value) {
      throw new Error('未填写标签值名称');
    }
    if (!rules[0].rules.length && !rules[1].rules.length) {
      throw new Error('标签值无标签条件');
    }

    return {
      valueSeq: i,
      value,
      relation: ['OR', 'AND'][relation],
      rules: [
        {
          type: 'profile_rule',
          relation: ['OR', 'AND'][rules[0].relation],
          rules: rules[0].rules.map(({ field, operatorOptions, operator, params }) => {
            const { inputType } = operatorOptions.find(({ filterCode }) => filterCode === operator);
            if (params) {
              if (Array.isArray(params)) {
                if (!params[0] || ![params[1]]) {
                  throw new Error('请输入值');
                }
                params = params.map(item => {
                  if (item.constructor === Date) {
                    return item.toISOString().split('T')[0].split('-').join('');
                  } else {
                    return item;
                  }
                });
                params = params.join();
              } else if (params.constructor === Date) {
                params = params.toISOString().split('T')[0].split('-').join('');
              }
            } else if (inputType !== 1) {
              throw new Error('请输入值');
            }
            return {
              field,
              operator,
              params: [params],
            };
          }),
        },
        {
          type: 'event_rule',
          relation: ['OR', 'AND'][rules[1].relation],
          rules: rules[1].rules.map(
            ({
              timeParams,
              field,
              eventFilter: { relation, subFilters },
              measureOptions,
              measure,
              operatorOptions,
              operator,
              params,
            }) => {
              const { measures, specifiedMeasure, paramConfig } = measureOptions.find(
                ({ paramCode }) => paramCode === measure[0]
              );
              if (specifiedMeasure) {
                measure = {
                  aggregator: paramConfig,
                };
              } else if (measures) {
                measure = {
                  measureParam: measure[0],
                  aggregator: measure[1],
                };
              } else {
                measure = {
                  aggregator: measure[0],
                };
              }
              const { inputType } = operatorOptions.find(({ filterCode }) => filterCode === operator);
              if (params) {
                if (Array.isArray(params)) {
                  if (!params[0] || ![params[1]]) {
                    throw new Error('请输入值');
                  }
                  params = params.map(item => {
                    if (item.constructor === Date) {
                      return item.toISOString().split('T')[0].split('-').join('');
                    } else {
                      return item;
                    }
                  });
                  params = params.join();
                } else if (params.constructor === Date) {
                  params = params.toISOString().split('T')[0].split('-').join('');
                }
              } else if (inputType !== 1) {
                throw new Error('请输入值');
              }
              return {
                timeType: 'time_relation',
                timeParams: [timeParams],
                field,
                eventFilter: {
                  relation: ['OR', 'AND'][relation],
                  subFilters: subFilters.map(
                    ({ filterParam, operatorOptions, operator, params, filterParamOptions }) => {
                      const { inputType } = operatorOptions.find(({ filterCode }) => filterCode === operator);
                      const { paramConfig } = filterParamOptions.find(fp => fp.paramCode === filterParam);
                      if (params) {
                        if (Array.isArray(params)) {
                          if (!params[0] || ![params[1]]) {
                            throw new Error('请输入值');
                          }
                          params = params.map(item => {
                            if (item.constructor === Date) {
                              return item.toISOString().split('T')[0].split('-').join('');
                            } else {
                              return item;
                            }
                          });
                          params = params.join();
                        } else if (params.constructor === Date) {
                          params = params.toISOString().split('T')[0].split('-').join('');
                        }
                      } else if (inputType !== 1) {
                        throw new Error('请输入值');
                      }
                      const subfilter = {
                        filterParam: paramConfig,
                        operator,
                      };
                      if (params) {
                        subfilter.params = [params];
                      }
                      return subfilter;
                    }
                  ),
                },
                measure,
                operator,
                params: [params],
              };
            }
          ),
        },
      ],
    };
  });
}
