import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
import timesCardBg from '@/dss-wechat3rd/src/images/card/times-card.png';

function findPage(linkPages, choosedVals, index) {
  const specPage = linkPages.find(item => {
    return item.value === choosedVals[index];
  });
  if (index === choosedVals.length - 1) {
    return specPage;
  } else {
    return findPage(specPage.children, choosedVals, index + 1);
  }
}

function addMerchantDetailLink(links) {
  const idx = links.findIndex(i => i.value === 'merchant');
  if (links[idx] && !links[idx].children.find(i => i.linkId === 'merchant')) {
    links[idx].children.push({
      value: '{"linkType":"merchant","name":"商户"}',
      label: '商户详情',
      index: 'wxat-common/pages/merchant-detail/index?id=',
      linkType: 1,
      linkId: 'merchant',
      tips: '商户',
    });
  }
  return links;
}

export default {
  /**
   * @param {*} hasMerchantDetail 是否添加商户详情
   */
  initLinkPages(hasMerchantDetail) {
    const copyCustomPages = this.$plain(this.customPages);
    const navCustomPage = {
      value: 'custom-page',
      label: '自定义页面',
      children: [],
    };
    (copyCustomPages || []).forEach(item => {
      const copyItem = { ...item };
      copyItem.value = copyItem.id + '';
      copyItem.label = copyItem.name;
      navCustomPage.children.push(copyItem);
    });
    this.linkPages = JSON.parse(JSON.stringify(this.linkedPages || []));
    if (hasMerchantDetail) {
      this.linkPages = addMerchantDetailLink(this.linkPages);
    }
    if (navCustomPage && navCustomPage.children && navCustomPage.children.length) {
      this.linkPages.unshift(navCustomPage);
    }
  },

  handleChangeLinkPage(choosedVals, item) {
    const page = findPage(this.linkPages, choosedVals, 0);
    item.linkName = page.label;
    // 老版本的跳转链接，直接拿linkPage跳转，该字段需要保留，兼容老版本的跳转链接
    item.linkPage = page.index || page.page;
    // 为了保证小程序迭代过程中链接发生变更，增加linkPageKey唯一标识，链接替换后直接以这个key映射
    item.linkPageKey = page.value;
    this.$set(item, 'linkType', page.linkType || 0);
    this.$set(item, 'linkId', page.linkId);
    this.$set(item, 'tips', page.tips);
    // 更新选择对应详情的dialog
    if (page.linkType) {
      this.detailType = goodsTypeEnum[page.linkId];
    }
  },
  getNavLinkParams(pendingUpdateItem, choosedDetailItem) {
    // 康养扩展
    switch (this.detailType.type) {
      case goodsTypeEnum['kangyang-project'].type: {
        this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.id);
        this.$set(pendingUpdateItem, 'appId', choosedDetailItem.appId);
        this.$set(pendingUpdateItem, 'detailText', choosedDetailItem.prjName);
        return;
      }
      case goodsTypeEnum['kangyang-activity'].type: {
        this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.id);
        this.$set(pendingUpdateItem, 'detailText', choosedDetailItem.name);
        return;
      }
    }

    if (this.detailType.type === goodsTypeEnum.group.type) {
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.id);
      this.$set(pendingUpdateItem, 'itemNo', choosedDetailItem.itemNo);
    } else if (this.detailType.type === goodsTypeEnum.haggle.type) {
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.id);
    } else if (this.detailType.type === goodsTypeEnum.category.type) {
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.id);
      this.$set(pendingUpdateItem, 'detailText', choosedDetailItem.category);
    } else if (this.detailType.type === goodsTypeEnum['server-category'].type) {
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.id);
      this.$set(pendingUpdateItem, 'detailText', choosedDetailItem.category);
    } else if (this.detailType.type === goodsTypeEnum.activity.type) {
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.topicId);
      this.$set(pendingUpdateItem, 'detailText', choosedDetailItem.topicName);
    } else if (this.detailType.type === goodsTypeEnum.luckyDial.type) {
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.id);
      this.$set(pendingUpdateItem, 'detailText', choosedDetailItem.activityName);
    } else if (this.detailType.type === goodsTypeEnum.seckill.type) {
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.id);
      this.$set(pendingUpdateItem, 'itemNo', choosedDetailItem.itemNo);
      this.$set(pendingUpdateItem, 'status', choosedDetailItem.status);
    } else if (this.detailType.type === goodsTypeEnum.gift.type) {
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.id);
      this.$set(pendingUpdateItem, 'status', choosedDetailItem.status);
    } else if (this.detailType.type === goodsTypeEnum.formTool.type) {
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.id);
      this.$set(pendingUpdateItem, 'detailText', choosedDetailItem.name);
    } else if (this.detailType.type === goodsTypeEnum.merchant.type) {
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.id);
      this.$set(pendingUpdateItem, 'detailText', choosedDetailItem.name);
      this.$set(pendingUpdateItem, 'storeId', choosedDetailItem.storeId);
    } else if (this.detailType.type === goodsTypeEnum['merchant-category'].type) {
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.id);
      this.$set(pendingUpdateItem, 'detailText', choosedDetailItem.categoryName);
    } else {
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.itemNo);
    }
    this.$set(pendingUpdateItem, 'detailUrl', choosedDetailItem.thumbnail);
    if (this.detailType === goodsTypeEnum.card.type && choosedDetailItem.type === goodsTypeEnum.card.value) {
      this.$set(pendingUpdateItem, 'detailUrl', choosedDetailItem.styleUrl || timesCardBg);
    }
    if (this.detailType.type === goodsTypeEnum.article.type) {
      this.$set(pendingUpdateItem, 'detailUrl', choosedDetailItem.coverUrl);
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.id);
    }
    if (this.detailType.type === goodsTypeEnum.articleClassify.type) {
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.id);
      this.$set(pendingUpdateItem, 'detailText', choosedDetailItem.categoryName);
    }
    if (this.detailType.type === goodsTypeEnum['micro-decorate'].type) {
      this.$set(pendingUpdateItem, 'id', choosedDetailItem.id);
    }
    if (this.detailType.type === goodsTypeEnum.promotion.type) {
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.id);
      this.$set(pendingUpdateItem, 'detailText', choosedDetailItem.name);
    }
    if (this.detailType.type === goodsTypeEnum.scoreActivity.type) {
      this.$set(pendingUpdateItem, 'detailId', choosedDetailItem.link);
      this.$set(pendingUpdateItem, 'detailText', choosedDetailItem.title);
    }
  },
  addMerchantDetailLink,
};
