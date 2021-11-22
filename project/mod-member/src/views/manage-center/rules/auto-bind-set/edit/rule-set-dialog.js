import api from '../../../../../api/manage';
import options from './options';

export default {
  props: {
    employees: {
      type: Array,
    },
    showRuleDialog: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '规则设置',
    },
    editingDistributeRule: {
      type: Object,
    },
  },
  watch: {
    showRuleDialog() {
      if (this.editingDistributeRule) {
        const { conditionRuleList, adminIdsArr, employeeIdsArr } = this.editingDistributeRule;
        this.distributeRule = {
          conditionRuleList: conditionRuleList.map(({ fieldValueParse, fieldName, funcType }) => {
            return {
              fieldValueParse,
              fieldName,
              funcType,
            };
          }),
          adminIdsArr,
          employeeIdsArr,
        };
      } else {
        this.distributeRule = {
          adminIdsArr: [],
          conditionRuleList: [
            {
              fieldName: 'realName',
              funcType: 0,
              fieldValueParse: undefined,
            },
          ],
          employeeIdsArr: [],
        };
      }
    },
  },
  computed: {
    fieldNames() {
      return options.map(({ label, value }) => {
        if (
          this.distributeRule.conditionRuleList.find(conditionRule => {
            return value === conditionRule.fieldName;
          })
        ) {
          return {
            label,
            value,
            disabled: true,
          };
        } else {
          return {
            label,
            value,
          };
        }
      });
    },
    funcTypes() {
      return this.distributeRule.conditionRuleList.map(conditionRule => {
        return options.find(({ value }) => {
          return value === conditionRule.fieldName;
        }).funcTypes;
      });
    },
    fieldValues() {
      return this.distributeRule.conditionRuleList.map(conditionRule => {
        if (conditionRule.fieldName === 'createTime') {
          return {
            type: 'date',
            range: conditionRule.funcType === 3,
          };
        } else if (conditionRule.fieldName === 'region') {
          if (conditionRule.funcType === 2 || conditionRule.funcType === 3) {
            return null;
          } else {
            return {
              type: 'cascader',
            };
          }
        } else if (conditionRule.funcType === 4 || conditionRule.funcType === 5) {
          return null;
        } else {
          return {
            type: 'input',
          };
        }
      });
    },
  },
  methods: {
    funcTypeChange(index) {
      const conditionRule = this.distributeRule.conditionRuleList[index];
      conditionRule.fieldValueParse = undefined;
    },
    handleItemChange(ids) {
      if (ids && ids.length) {
        this.fetchAreas(ids[ids.length - 1]);
      }
    },
    // 查询下级市区
    getNodeById(areas, id) {
      for (const area of areas) {
        if (area.id === id) {
          return area;
        }
        if (area.childNode && area.childNode.length) {
          const findedNode = this.getNodeById(area.childNode, id);
          if (findedNode) {
            return findedNode;
          }
        }
      }
    },
    // 初始化区域数据格式
    addChildren(nodes) {
      if (!nodes || nodes.length === 0) {
        return null;
      }
      for (const node of nodes) {
        if (!node.isLeaf) {
          node.childNode = [];
        }
      }
      return nodes;
    },
    // 获取区域数据
    fetchAreas(id) {
      if (id) {
        const node = this.getNodeById(this.district, id);
        if (!node || node.isloaded) {
          return;
        }
        return api.region(id).done(({ data }) => {
          node.isloaded = true;
          node.childNode = this.addChildren(data);
        });
      }

      return api.region().done(({ data }) => {
        this.district = this.addChildren(data);
      });
    },
    onAddRule() {
      this.distributeRule.conditionRuleList.push({
        fieldName: this.fieldNames.find(fieldName => {
          return !fieldName.disabled;
        }).value,
        funcType: 0,
        fieldValueParse: undefined,
      });
    },
    onFilterDistrict(value, index) {
      /* if (value.selection2 === '为空' || value.selection2 === '不为空') {
         this.list[index].fieldValue = ''
       } else {
         let province = value.area[0] ? value.area[0] : '',
           provinceData,
           provinceLabel
         provinceData = this.district.find(item => {
           return item.id === province
         })
         if (provinceData) {
           provinceLabel = provinceData.name
         }
         let city = value.area[1] ? value.area[1] : '',
           cityData,
           cityLabel
         let district = value.area[2] ? value.area[2] : '',
           districtData,
           districtLabel
         /!**
          * 获取市接口数据->数组查找
          * **!/
         let cityD, districtD
         api.region(province).done(res => {
           cityD = res.data || []
           if (cityD) {
             cityData = cityD.find(item => {
               return item.id === city
             })
             cityLabel = cityData.name
           }
           /!**
            * 获取区接口数据->数组查找
            * **!/
           api.region(city).done(res => {
             districtD = res.data || []
             if (districtD && districtD.length) {
               districtData = districtD.find(item => {
                 return item.id === district
               })
               districtLabel = districtData.name
             }
             if (district) {
               if (this.distributeRule) {
                 this.copyList[index].fieldValue = JSON.stringify({
                   provinceId: province.toString(),
                   cityId: city.toString(),
                   districtId: district.toString()
                 })
                 this.copyLabelList[index].selection3 = [
                   provinceLabel,
                   cityLabel,
                   districtLabel
                 ]
               } else {
                 this.list[index].fieldValue = JSON.stringify({
                   provinceId: province.toString(),
                   cityId: city.toString(),
                   districtId: district.toString()
                 })
                 this.labelLists[index].selection3 = [
                   provinceLabel,
                   cityLabel,
                   districtLabel
                 ]
               }
             } else {
               if (this.distributeRule) {
                 this.copyList[index].fieldValue = JSON.stringify({
                   provinceId: province,
                   cityId: city
                 })
                 this.copyLabelList[index].selection3 = [
                   provinceLabel,
                   cityLabel
                 ]
               } else {
                 this.list[index].fieldValue = JSON.stringify({
                   provinceId: province,
                   cityId: city
                 })
                 this.labelLists[index].selection3 = [provinceLabel, cityLabel]
               }
             }
           })
         })
       } */
      this.index = index;
      // 去重
      /* const findIndex = this.selection1.findIndex(item => {
        return item.name === value.selection1
      })
      if (~findIndex) {
        this.selection1.splice(findIndex, 1)
      } */
    },
    beforeClose() {
      this.$emit('close');
    },
    ok() {
      if (
        this.fieldValues.find((fieldValue, i) => {
          return fieldValue && !this.distributeRule.conditionRuleList[i].fieldValueParse;
        })
      ) {
        return this.$message({
          message: '请填写内容',
        });
      }
      if (!this.distributeRule.employeeIdsArr || !this.distributeRule.employeeIdsArr.length) {
        return this.$message({
          message: '请填选择分配范围员工',
        });
      }
      if (this.$refs.regionSelect && this.$refs.regionSelect.length) {
        const menu = this.$refs.regionSelect[0].$el.innerText;
        this.distributeRule.conditionRuleList[this.index].regionName = menu;
      }
      this.$emit('close', this.distributeRule);
    },
  },
  created() {
    this.fetchAreas();
  },
  data() {
    return {
      distributeRule: {
        adminIds: [],
        conditionRuleList: [
          {
            fieldName: 'realName',
            funcType: 0,
            fieldValueParse: undefined,
          },
        ],
      },
      index: null,
    };
  },
};
