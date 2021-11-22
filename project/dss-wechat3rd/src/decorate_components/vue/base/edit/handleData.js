let handleData = (function() {
  function handleData() {}
  /**
   * 数据去重
   * @param originalList 源数组
   * @param appendList 追加数组
   * @param determineField 去重判定的字段
   */
  handleData.deweighting = function(originalList, appendList, determineField) {
    //合并两个数组，去重
    let concat_ = (arr1, arr2) => {
      //不要直接使用var arr = arr1，这样arr只是arr1的一个引用，两者的修改会互相影响
      if (arr1 && arr1.length) {
        let arr = arr1.concat();
        //或者使用slice()复制，var arr = arr1.slice(0)
        for (let i = 0; i < arr2.length; i++) {
          let sign = false;
          for (let j = 0; j < arr.length; j++) {
            if (arr2[i][determineField] == arr[j][determineField]) {
              sign = true;
              break;
            }
          }
          if (!sign) {
            arr.push(arr2[i]);
          }
        }
        return arr;
      } else {
        return arr2;
      }
    };
    return concat_(originalList, appendList);
  };

  /**
   * 保留可用字段
   * @param originalList 需要被修改的数组
   * @param fields 需要保留字段的数组
   * @return 返回一个被修改之后的数组
   */
  handleData.saveAvailableFields = function(originalList, fields) {
    let arr = [];
    (originalList || []).forEach(element => {
      let item = {};
      fields.forEach(field => {
        item[field] = element[field];
      });
      arr.push(item);
    });
    return arr;
  };

  /**
   * 删除多余的元素
   * @param originalList 需要被修改的数组
   * @param item 需要被剔除的元素
   * @return 返回一个被修改之后的数组
   */
  handleData.deteleItem = function(originalList, item) {
    const index = originalList.indexOf(item);
    originalList.splice(index, 1);
  };

  /**
   * 提取数组中指定字段的数据
   * @param originalList 需要被提取的数组
   * @param field 需要提取的字段
   * @return 提取特定字符的数组
   */
  handleData.pickUpItemNos = function(originalList, field) {
    let itemNos = [];
    (originalList || []).forEach(element => {
      if (element[field]) {
        itemNos.push(element[field]);
      }
    });
    return itemNos;
  };
  return handleData;
})();

export default handleData;
