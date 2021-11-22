export default {
  /**
   * 根据规格树，递归抽取各叶节点下的规格选项数据，拼装到一级分类节点treeValList下
   * @returns {*}
   */
  mergeTreeList(treeList, firstTreeItem) {
    if (!treeList.length) return [];
    treeList.forEach(item => {
      if (item.mapLevel === 1) firstTreeItem = item;

      if (item.childAttrMap && item.childAttrMap.length) {
        this.mergeTreeList(item.childAttrMap, firstTreeItem);
      } else if (item.mapLevel !== 1 && item.treeValList && item.treeValList.length) {
        // 仅处理二级(及以上)分类
        item.treeValList.forEach(sub => {
          firstTreeItem.treeValList.push(sub);
        });
      }
    });
  }
};
