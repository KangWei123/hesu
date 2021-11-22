export default function ({ valueList, note }) {
  note = JSON.parse(note);
  note[0] = Object.keys(note[0]).map(key => {
    const fieldOption = note[0][key];
    fieldOption.paramCode = key;
    fieldOption.filters = Object.keys(fieldOption.filters).map(key => {
      fieldOption.filters[key].filterCode = key;
      return fieldOption.filters[key];
    });
    return fieldOption;
  });
  note[1] = Object.keys(note[1]).map(key => {
    const fieldOption = note[1][key];
    fieldOption.event = key;
    fieldOption.eventMeasures = Object.keys(fieldOption.eventMeasures).map(key => {
      const measureOption = fieldOption.eventMeasures[key];
      measureOption.paramCode = key;
      measureOption.filters = Object.keys(measureOption.filters).map(key => {
        measureOption.filters[key].filterCode = key;
        return measureOption.filters[key];
      });
      return measureOption;
    });
    fieldOption.eventFilters = Object.keys(fieldOption.eventFilters || {}).map(key => {
      const eventFilter = fieldOption.eventFilters[key];
      eventFilter.paramCode = key;
      eventFilter.filters = Object.keys(eventFilter.filters).map(key => {
        eventFilter.filters[key].filterCode = key;
        return eventFilter.filters[key];
      });
      return eventFilter;
    });
    return fieldOption;
  });
  valueList.forEach(value => {
    value.relation = { OR: 0, AND: 1 }[value.relation];
    value.rules[0].relation = { OR: 0, AND: 1 }[value.rules[0].relation];
    value.rules[0].rules.forEach(rule => {
      rule.fieldOptions = note[0];
      rule.relation = { OR: 0, AND: 1 }[rule.relation];
      rule.params = rule.params[0];
    });
    value.rules[1].relation = { OR: 0, AND: 1 }[value.rules[1].relation];
    value.rules[1].rules.forEach(rule => {
      rule.fieldOptions = note[1];
      rule.eventFilter.relation = { OR: 0, AND: 1 }[rule.eventFilter.relation];
      rule.timeParams = +rule.timeParams[0];
      rule.eventFilter.subFilters.forEach(item => {
        if (item.params.length === 1) {
          item.params = item.params[0];
        }
      });
      if (rule.measure.measureParam) {
        rule.measure = [rule.measure.measureParam, rule.measure.aggregator];
      } else {
        rule.measure = [rule.measure.aggregator];
      }
      if (rule.params.length === 1) {
        rule.params = rule.params[0];
      }
    });
  });
  return valueList;
}
