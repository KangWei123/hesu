/**
* 多级商品规格
*/
<template>
  <div class="multi-goods-specifications">
    <template>
    <el-button round v-if="addAble" @click="addFirstCategory">添加一级分类</el-button>
    <el-popover v-else
                  placement="bottom"
                  width="200"
                  trigger="hover"
                  content="编辑商品不允许新增规格分类">
        <el-button slot="reference"
                   class="btn-rules"
                   :disabled="isDisabledEdit"
                   style="cursor: not-allowed">添加一级分类</el-button>
      </el-popover>
    </template>


    <div class="content">
      <div class="category-tree">
        <el-tree
          v-if="skuTreeList.length"
          :data="skuTreeList"
          node-key="keyId"
          class="specifications-tree"
          default-expand-all
          highlight-current
          accordion
          :props="treeProps"
          @node-click="handleNodeClick"
          :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ data.keyName }}</span>
            <span v-if="data.mapLevel < 5">
              <i
                v-show="!isDisabledEdit && addAble && !(data.treeValList && data.treeValList.length) && data.mapLevel < 4"
                class="el-icon-circle-plus-outline"
                style="padding: 0 4px;margin-right: 4px;"
                @click="addCategory(data)"></i>
              <i
                v-show="!isDisabledEdit && addAble && !(data.treeValList && data.treeValList.length) && !(data.childAttrMap && data.childAttrMap.length)"
                class="el-icon-delete"
                style="padding: 0 4px;"
                @click.stop="deleteCategory(data)"></i>
            </span>
          </span>
        </el-tree>
      </div>
      <div class="specifications-content" v-if="curEditCategory">
        <attribute
          v-if="curEditCategory && !(curEditCategory.childAttrMap && curEditCategory.childAttrMap.length)"
          multi-enable
          :is-disabled-edit="isDisabledEdit"
          :del-able="addAble"
          :skuTree="curEditCategory"
          :breadcrumb="curEditCategoryBread"
          @select-attribute="onUpdateSkuTree"
        ></attribute>
        <second-category-explain
          v-else-if="curEditCategory && curEditCategory.mapLevel === 2 && curEditCategory.childAttrMap && curEditCategory.childAttrMap.length"
          :skuTree="curEditCategory"
          :breadcrumb="curEditCategoryBread">
        </second-category-explain>
      </div>
    </div>

    <!-- 新增分类弹窗 -->
    <add-category-dialog
      :show.sync="showAddCategoryDialog"
      :parent-node="curAddCategoryNode"
      :sku-tree-list="skuTreeList"
      @save="addCategorySucceed"></add-category-dialog>
  </div>
</template>

<script>
import AddCategoryDialog from './add-category-dialog.vue';
import Attribute from './attribute.vue';
import SecondCategoryExplain from './second-category-explain.vue';
import cartesian from './cartesian';

export default {
  name: 'goods-specifications',
  components: {
    AddCategoryDialog,
    Attribute,
    SecondCategoryExplain
  },
  model: {
    prop: 'skuTreeList'
  },
  props: {
    // 是否禁止编辑
    isDisabledEdit: {
      type: Boolean,
      default: false
    },
    skuTreeList: {
      type: Array,
      default: () => []
    },
    addSkuInfoUniqueKeys: {
      type: Function,
      default: null
    },
    /*是否能够新增规格，商品在编辑状态下不允许新增规格值,不允许删除规格值*/
    addAble: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showAddCategoryDialog: false,
      treeProps: {
        children: 'childAttrMap'
      },
      categoryList: [],
      curEditCategory: null, // 当前选中的分类
      curEditCategoryIndexList: [],
      curEditCategoryBread: '',
      curAddCategoryNode: null, // 当前选中（即将添加子分类）分类
      curAddCategoryNodeIndexList: [] // 当前选中（即将添加子分类）分类的索引集合
    };
  },
  computed: {},
  methods: {
    // 添加一级分类
    addFirstCategory() {
      this.curAddCategoryNode = null;
      this.curAddCategoryNodeIndexList = [];
      this.showAddCategoryDialog = true;
    },
    handleNodeClick(data) {
      if (!data) return;
      if (data.mapLevel === 1) {
        this.curEditCategory = null;
        return;
      }
      const parentCategoryList = this.findParentCategoryIndex(data, this.skuTreeList) || {};
      this.curEditCategoryIndexList = (parentCategoryList && parentCategoryList.index) || [];
      this.curEditCategoryBread = (parentCategoryList && parentCategoryList.title) || '';
      if (data.mapLevel === 3 && data.childAttrMap.length) {
        this.curEditCategory = null;
        return;
      }
      this.curEditCategory = data;
      // 在前端补充treeValList中keyId keyName
      if (this.curEditCategory && this.curEditCategory.treeValList.length) {
        this.curEditCategory.treeValList.forEach(item => {
          item.keyId = this.curEditCategory.keyId;
          item.keyName = this.curEditCategory.keyName;
        });
      }
    },
    // 添加子分类
    addCategory(data) {
      this.curAddCategoryNode = data;
      this.curAddCategoryNodeIndexList = this.findParentCategoryIndex(data, this.skuTreeList).index || [];
      this.showAddCategoryDialog = true;
    },
    // 处理添加分类
    addCategorySucceed(val) {
      if (this.curAddCategoryNodeIndexList && this.curAddCategoryNodeIndexList.length) {
        let targetNode = {};
        this.curAddCategoryNodeIndexList.forEach((item, i) => {
          if (i === 0) {
            targetNode = this.skuTreeList[item];
          } else {
            targetNode = targetNode.childAttrMap[item];
          }
        });
        targetNode.childAttrMap.push(val);
        targetNode.leafTag = 1;
      } else {
        this.skuTreeList.push(val);
      }
    },
    // 删除分类
    deleteCategory(data) {
      // 如果节点下存在规格或子节点，不允许删除
      if (data.treeValList.length || data.childAttrMap.length) {
        this.$message({
          type: 'warning',
          message: '该分类下存在规格或子分类，不允许删除'
        });
        return;
      }
      let targetNode = {};
      const indexList = this.findParentCategoryIndex(data, this.skuTreeList).index || [];
      // 删除一级分类
      if (indexList.length < 2) {
        this.skuTreeList.splice(indexList[indexList.length - 1], 1);
        this.curEditCategory = null;
        return;
      }
      // 删除多级分类
      indexList.forEach((item, i) => {
        if (i === 0) {
          targetNode = this.skuTreeList[item];
        } else if (i < indexList.length - 1) {
          targetNode = targetNode.childAttrMap[item];
        }
      });

      targetNode.childAttrMap.splice(indexList[indexList.length - 1], 1);
      if (!targetNode.childAttrMap.length) targetNode.leafTag = 1;
      this.$set(this.curEditCategory, null);
    },
    /**
     * 根据选择当前选中的规格分类，寻找其父级分类及组合规格展示字段curEditCategoryBread
     * @returns 返回当前选中节点对应树级的索引集 例：[0, 1, 0] => treeList[0][1][0]
     */
    // findParentCategoryIndex(val, skuTreeList) {
    //   // if (!val || !val.parentId) return
    //   let targetIndex = [];
    //   for(let i = 0; i < skuTreeList.length; i++) {
    //     if (skuTreeList[i].keyId === val.keyId) {
    //       return {
    //         index: targetIndex.concat(i),
    //         title: skuTreeList[i].keyName
    //       }
    //       break;
    //     }else if(skuTreeList[i].childAttrMap && skuTreeList[i].childAttrMap.length) {
    //       let secondItem = skuTreeList[i].childAttrMap;
    //       for(let j = 0; j < secondItem.length; j++) {
    //         if (secondItem[j].keyId === val.keyId) {
    //           return {
    //             index: targetIndex.concat(i, j),
    //             title: `${skuTreeList[i].keyName}/${secondItem[j].keyName}`
    //           }
    //           break;
    //         }else if (secondItem[j].childAttrMap && secondItem[j].childAttrMap.length) {
    //           let thirdItem = secondItem[j].childAttrMap;
    //           for(let k = 0; k < thirdItem.length; k++) {
    //             if (thirdItem[k].keyId === val.keyId) {
    //               return {
    //                 index: targetIndex.concat(i, j, k),
    //                 title: `${skuTreeList[i].keyName}/${secondItem[j].keyName}/${thirdItem[k].keyName}`
    //               }
    //               break;
    //             }else if (thirdItem[k].childAttrMap && thirdItem[k].childAttrMap.length) {
    //               let fourthItem = thirdItem[k].childAttrMap;
    //               for(let l = 0; l < fourthItem.length; l++) {
    //                 if (fourthItem[l].keyId === val.keyId) {
    //                   return {
    //                     index: targetIndex.concat(i, j, k, l),
    //                     title: `${skuTreeList[i].keyName}/${secondItem[j].keyName}/${thirdItem[k].keyName}/${fourthItem[l].keyName}`
    //                   }
    //                   break;
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // },
    findParentCategoryIndex(val, skuTreeList) {
      let targetIndex = [];
      let title = '';
      let lastIndexList = [];
      let lastTitleList = '';
      // 获取选中的分类对应所在树索引及title
      const res = this.recursiveTree(val, skuTreeList, targetIndex, title, lastIndexList);
      if (!!res) {
        targetIndex = res.index;
        title = res.title;
        return {
          index: targetIndex,
          title
        };
      }
    },
    /**
     * 根据选择当前选中的规格分类，寻找其父级分类及组合规格展示字段curEditCategoryBread
     * @returns index返回当前选中节点对应树级的索引集 例：[0, 1, 0] => treeList[0][1][0]
     * @returns title返回当前选中节点对应标题 例：分类1/分类1-1/分类1-1-1
     */
    recursiveTree(val, list, targetIndex, title, lastIndexList, lastTitleList) {
      let lastIndex = lastIndexList;
      let childItem = list;
      let lastTitle = lastTitleList;
      for (let j = 0; j < childItem.length; j++) {
        // 判断已寻找到对应keyid
        if (childItem[j].keyId === val.keyId) {
          targetIndex = lastIndex.concat(j);
          title = childItem[j].mapLevel === 1 ? `${childItem[j].keyName}` : `${lastTitle}${childItem[j].keyName}`;
          return {
            index: targetIndex,
            title
          };
          break;
        } else if (childItem[j].keyId !== val.keyId && childItem[j].childAttrMap && childItem[j].childAttrMap.length) {
          let lastIndexList = lastIndex.concat(j);
          let lastTitleList =
            childItem[j].mapLevel === 1 ? `${childItem[j].keyName}/` : `${lastTitle}${childItem[j].keyName}/`;
          const res = this.recursiveTree(
            val,
            childItem[j].childAttrMap,
            targetIndex,
            title,
            lastIndexList,
            lastTitleList
          );
          if (!!res) {
            targetIndex = res.index;
            title = res.title;
            return {
              index: targetIndex,
              title
            };
          }
        }
      }
    },
    /**
     * 增加或者更改某个规格，更改/增加父规格或者父规格中的子规格增/删都会发生变化
     * 该规格对应保存一个索引#skuTree.index，即规格的位置，根据该索引对整个打包的规格进行更新
     */
    onUpdateSkuTree(skuTree) {
      // todo 更新规格分类数组
      // this.skuTreeList.splice(skuTree.index, 1, skuTree.attrTree);
      // this.resetDisableAttribute();
      this.$emit('assemble-sku', this.assembleSkuInfos());
    },
    /**
     * 根据选择的规格，组装sku数据
     * @returns {*}
     */
    assembleSkuInfos() {
      //每个父规格下的选择的子规格是一个数组，将这些数组都存放到这个数组里，形成一个二维数组，做笛卡尔积运算使用
      let packedAttrChildList = [];
      const list = this.$plain(this.skuTreeList);
      this.mergeTreeList(list);

      // 铺平规格树形数据,形成一个二维数组
      // this.formatTreeList(this.$plain(this.skuTreeList), packedAttrChildList);

      list.forEach(item => {
        //只有选中了某一个子规格才认为该规格是合理的，所以加个判断过滤掉不合理的规格输入
        //因为可能存在用户选择了子规格后，又将子规格统统删除的行为
        if (item.treeValList && item.treeValList.length) {
          item.treeValList.forEach(sub => {
            sub.ancestryKeyId = item.keyId;
            sub.ancestryKeyName = item.keyName;
          });
          packedAttrChildList.push(item.treeValList);
        }
      });

      if (!packedAttrChildList.length) {
        return;
      }
      /*将所有的子规格做笛卡尔积运算，形成各个规格的排列
       如：[{"a":"a"}, {"b":"b"}] [{"m":"m"}, {"n":"n"}]
       最后的结果是：[[{"a":"a"},{"m":"m"}],[{"a":"a"},{"n":"n"}],[{"b":"b"},{"m":"m"}],[{"b":"b"},{"n":"n"}]]
       */
      const attrSkuCartesian = cartesian.cartesianProduct(packedAttrChildList);

      //为每个sku添加额外的数据，如价格、条形码等
      const assembleSkuInfos = attrSkuCartesian.map(skuItem => {
        //解析每个sku下的所有子规格列表，包装成skuChildItemInfos
        //如[{'颜色': '红色'}, {'尺寸': '中'}]
        /*const skuChildItemInfos = skuItem.map(attrChildItem => {
         return {
         //父规格的id
         keyId: attrChildItem.keyId,
         //父规格的名字
         keyName: attrChildItem.keyName,
         //子规格的id
         valId: attrChildItem.valId,
         //子规格的名字
         valName: attrChildItem.valName
         };
         });*/

        //每个sku，包括额外的数据和子规格的集合
        const extraSkuItem = {
          //售价
          salePrice: '',
          //标价
          labelPrice: '',
          //条形码
          skuBarcode: '',
          // sku图片
          skuImg: null,
          // 禁用启用 0 启用 1 禁用
          notOptional: 0,
          //一个sku的规格集：每个父规格下的某个子规格形成的一列数据
          skuInfoNames: skuItem //[{'颜色': '红色'}, {'尺寸': '中'}]
        };

        return extraSkuItem;
      });

      //设置唯一组合标识
      this.addSkuInfoUniqueKeys(assembleSkuInfos);
      return assembleSkuInfos;
    },
    /**
     * 根据规格树，递归抽取各叶节点下的规格选项数据，形成一个二维数组
     * @returns {*}
     */
    formatTreeList(list, packedAttrChildList) {
      if (!list.length) return [];
      list.forEach(item => {
        if (item.treeValList && item.treeValList.length) {
          item.treeValList.forEach(sub => {
            sub.keyId = item.keyId;
            sub.keyName = item.keyName;
          });
          packedAttrChildList.push(item.treeValList);
        }
        if (item.childAttrMap && item.childAttrMap.length) {
          this.formatTreeList(item.childAttrMap, packedAttrChildList);
        }
      });
    },
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
            // firstTreeItem.treeValList.push(sub);
            firstTreeItem.treeValList.push(Object.assign({}, ...sub, { keyId: item.keyId, keyName: item.keyName }));
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.multi-goods-specifications {
  // margin-top: 10px;
  .content {
    display: flex;
    margin: 20px 0;

    .category-tree {
      width: 300px;

      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
      }
    }

    .specifications-content {
      flex: 1;
      max-width: 632px;
      margin-left: 20px;
      padding: 10px;
      border: 1px solid #d7e0ea;
    }
  }
}
</style>