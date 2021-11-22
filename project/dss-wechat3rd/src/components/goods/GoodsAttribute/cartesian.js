export default  {
  /** 将所有的子规格做笛卡尔积运算，形成各个规格的排列
   * 如：[{"a":"a"}, {"b":"b"}] [{"m":"m"}, {"n":"n"}]
   * 最后的结果是：[[{"a":"a"},{"m":"m"}],[{"a":"a"},{"n":"n"}],[{"b":"b"},{"m":"m"}],[{"b":"b"},{"n":"n"}]]
   */
  cartesianProduct(sets) {
    let head = sets.shift();
    if (sets.length === 0) {
      return map(
        item => [item],
        head
      );
    }
    let tailProduct = this.cartesianProduct(sets);
    return flatMap(
      item => flatMap(
        items => [[item, ...items]],
        tailProduct
      ),
      head
    );
  }
}

function concat(array) {
  return [].concat.apply([], array);
}

function map(fn, array) {
  return [].map.call(array, fn);
}

function flatMap(fn, array) {
  return concat(map(fn, array));
}
