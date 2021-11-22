export default function (valueList) {
  const note = [{}, {}];
  valueList.forEach(({ rules }) => {
    rules[0].rules.forEach(({ fieldOptions, field, operatorOptions, operator }) => {
      note[0][field] = note[0][field] || {
        paramName: fieldOptions.find(({ paramCode }) => paramCode === field).paramName,
        filters: {},
      };
      if (!note[0][field].filters[operator]) {
        const { filterName, inputType } = operatorOptions.find(({ filterCode }) => filterCode === operator);
        note[0][field].filters[operator] = {
          filterName,
          inputType,
        };
      }
    });
    rules[1].rules.forEach(
      ({ fieldOptions, field, eventFilter: { subFilters }, measureOptions, measure, operatorOptions, operator }) => {
        const fieldInfo = (note[1][field] = note[1][field] || {
          eventName: fieldOptions.find(({ event }) => event === field).eventName,
          eventMeasures: {},
        });
        const { paramName, specifiedMeasure, paramConfig, measures } = measureOptions.find(
          ({ paramCode }) => paramCode === measure[0]
        );
        let value;
        if (specifiedMeasure) {
          value = paramConfig;
        } else {
          value = measure[0];
        }
        const { eventMeasures } = fieldInfo;
        eventMeasures[value] = eventMeasures[value] || {
          paramName,
          filters: {},
        };
        if (measures) {
          eventMeasures[value].measures = eventMeasures[value].measures || {};
          eventMeasures[value].measures[measure[1]] = {
            statisticName: measures.find(({ paramCode }) => paramCode === measure[1]).paramName,
          };
        }
        if (!eventMeasures[value].filters[operator]) {
          const { filterName, inputType } = operatorOptions.find(({ filterCode }) => filterCode === operator);
          eventMeasures[value].filters[operator] = {
            filterName,
            inputType,
          };
        }
        subFilters.forEach(({ filterParamOptions, filterParam, operatorOptions, operator }) => {
          fieldInfo.eventFilters = fieldInfo.eventFilters || {};
          fieldInfo.eventFilters[filterParam] = fieldInfo.eventFilters[filterParam] || {
            paramName: filterParamOptions.find(({ paramCode }) => paramCode === filterParam).paramName,
            filters: {},
          };
          const { filterName, inputType } = operatorOptions.find(({ filterCode }) => filterCode === operator);
          fieldInfo.eventFilters[filterParam].filters[operator] = {
            filterName,
            inputType,
          };
        });
      }
    );
  });
  return note;
}
