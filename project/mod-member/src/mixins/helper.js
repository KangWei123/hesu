let id = 1;

export default {
  /**
   * 生成一个新的唯一id
   */
  newId() {
    return id++;
  },
  /**
   * 将条件数组格式化成后端使用的字符串，
   * @param {Array} conditions数组
   */
  formatCondition(conditions) {
    const cdns = (conditions || []).map(cdn => {
      // 处理新建的条件标签值的name&value
      if (cdn.tag.labelVersion != null && cdn.tag.labelVersion == 2) {
        if (cdn.type === 'group') {
          return {
            tagCode: cdn.tag.tagCode,
            dimVals: [cdn.values.name],
            guiType: cdn.guiType,
          };
        }
        return {
          tagCode: cdn.tag.code,
          dimVals: (cdn.values || []).map(v => cdn.tag.name + '&' + v.dimValue),
          guiType: cdn.guiType,
        };
      } else {
        if (cdn.type === 'group') {
          return {
            tagCode: cdn.tag.tagCode,
            dimVals: [cdn.values.name],
            guiType: cdn.guiType,
          };
        }
        return {
          tagCode: cdn.tag.code,
          dimVals: (cdn.values || []).map(v => v.dimValue),
          guiType: cdn.guiType,
        };
      }
    });
    // 存储的值是用来路由跳转的请求conditions参数
    localStorage.setItem('conditionsRouter', JSON.stringify(conditions));
    localStorage.setItem('portraitRouter', JSON.stringify(cdns));
    return cdns;
  },
  /**
   *
   * @param {String}} strCdn 将后端传过来的字符串转化成前端数组
   */
  toConditions(strCdn) {
    let criteria = [];
    try {
      criteria = JSON.parse(strCdn) || [];
    } catch (e) {
      console.log(e);
    }

    const conditions = [];
    console.log(criteria, 'criteria');
    criteria.forEach(element => {
      if (element.operator) {
        if (element.foperator === 'AND' || element.foperator === 'OR') {
          conditions.push({
            id: this.newId(),
            type: 'symbol',
            tag: {
              name: element.foperator.toLowerCase(),
              code: element.foperator,
            },
          });
        } else {
          conditions.push({
            id: this.newId(),
            type: 'brackets',
            tag: {
              name: element.foperator.toLowerCase(),
              code: element.foperator,
            },
          });
        }
        return;
      }
      let strValue = '';
      const values = (element.foperands || []).map(item => {
        if (item.name != null) {
          if (item.name.indexOf('&') !== -1) {
            const name = item.name.replace('&', '、');
            strValue += `、${name}`;
            return { name: item.name, dimValue: item.value };
          } else {
            strValue += `、${item.name}`;
            return { name: item.name, dimValue: item.value };
          }
        }
      });
      const cdn = {
        id: this.newId(),
        tag: {
          name: element.fname,
          code: element.fcode,
        },
        values: values,
        strValue: strValue.replace('、', ''),
      };
      console.log('helper conditions', conditions);
      conditions.push(cdn);
    });
    return conditions;
  },
  /** 人群管理条件数组格式化为后端使用的格式**/
  groupToConditions(strCdn) {
    let criteria = [];
    try {
      criteria = JSON.parse(strCdn) || [];
    } catch (e) {
      console.log(e);
    }

    const conditions = [];

    criteria.forEach(element => {
      // -99999的dimVals转为未知
      const index = element.dimVals.indexOf('-99999');
      element.dimVals.splice(index, 1);
      console.log('dimVals', element);
      const strValue = '';

      const cdn = {
        id: this.newId(),
        tag: {
          name: element.dimVals,
          code: element.tagCode,
        },
        values: {
          name: element.dimVals[0],
          dimValue: element.dimVals[0],
        },
        strValue: strValue.replace('、', ''),
      };
      conditions.push(cdn);
    });
    console.log('helper conditions', conditions);
    return conditions;
  },
  areasToString(area) {
    const params = {};
    const areas = area || [];
    areas.forEach((areaId, index) => {
      if ((areaId + '').indexOf('store_') > -1) {
        params.storeIds = parseInt(areaId.replace('store_', ''));
        return;
      }
      if (index === 0) {
        params.epProv = areaId;
      } else if (index === 1) {
        params.epCity = areaId;
      } else if (index === 2) {
        params.epArea = areas[2];
      }
    });
    return params;
  },
};
