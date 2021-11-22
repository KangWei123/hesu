import goodsTypeEnum from '../../constants/goodsTypeEnum';

export default {
  /**
   * 获取标签面包屑
   * @param goodsType
   * @return {string}
   */
  getLabelBreadPath(goodsType) {
    let path = null;
    // 判断是否为美业
    if (this.env.BEAUTIFUL) {
      path = '/beauty/goods-mgr/goods/' + goodsType;
    } else if (goodsType === goodsTypeEnum.combinationItem.type) {
      // 判断商品类型是否为组合商品
      path = '/retail/goods-mgr/goods-combined/goods-list';
    } else if (goodsType === goodsTypeEnum.estate.type) {
      // 判断商品类型是否为楼盘
      path = '/estate/goods-mgr/building/list';
    } else {
      // 默认为商品类型
      path = '/retail/goods-mgr/product/list';
    }
    return path;
  },

  /**
   * 获取批量上下架的页面路由
   * @param goodsTypeValue
   */
  getPatchShelvesPath(goodsTypeValue) {
    let path = null;
    if (this.env.BEAUTIFUL) {
      path =
        goodsTypeValue === goodsTypeEnum.server.value
          ? '/beauty/goods-mgr/goods/server/patch-shelves'
          : '/beauty/goods-mgr/goods/product/patch-shelves';
    } else {
      path = '/retail/goods-mgr/product/list/patch-shelves';
    }
    return path;
  },
  getGoodsSelectDialogActiveTabs() {
    let activeTabList = [goodsTypeEnum.product];
    if (this.env.BEAUTIFUL) {
      activeTabList = [goodsTypeEnum.server, goodsTypeEnum.product];
    } else if (this.env.TOURISM) {
      activeTabList = [goodsTypeEnum.ticket, goodsTypeEnum.rooms, goodsTypeEnum.product];
    } else if (this.env.ESTATE) {
      activeTabList = [goodsTypeEnum.estate, goodsTypeEnum.product];
    }
    return activeTabList;
  }
};
