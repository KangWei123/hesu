<template>
  <div class="multi-goods-attribute">
    <attribute :goods-type="goodsType"
               multi-enable
               v-for="(item, index) in skuTreeList"
               :key="item.keyId"
               :index="index"
               :skuTree="item"
               :del-able="addAble"
               :showAttrImage="index === 0"
               @del-attr="onDelAttr(index)"
               @select-attribute="onUpdateSkuTree"
               :is-disabled-edit='isDisabledEdit'></attribute>

    <div class="add-attr-btn-container">
      <el-button v-if="addAble"
                 :disabled="isDisabledEdit"
                 @click="onAddSkuTree">+添加规格</el-button>
      <el-popover v-else
                  placement="bottom"
                  width="200"
                  trigger="hover"
                  content="编辑商品不允许新增规格">
        <el-button slot="reference"
                   class="btn-rules"
                   :disabled="isDisabledEdit"
                   style="cursor: not-allowed">+添加规格</el-button>
      </el-popover>
      <span class="add-attr-tip">先添加规格分类，如级别、颜色等，再添加规格值，如初级、中级、高低等</span>
    </div>
  </div>
</template>

<script>
import './index.less';
import cartesian from './cartesian';
import Attribute from './Attribute';
import AttributesStore from './AttributesStore';

export default {
  name: 'MultiGoodsAttribute',
  model: {
    prop: 'skuTreeList'
  },
  props: {
    // 是否禁止编辑
    isDisabledEdit: {
      type: Boolean,
      default: false
    },
    goodsType: {
      type: Object,
      default: function() {
        return null;
      }
    },
    addSkuInfoUniqueKeys: {
      type: Function,
      default: null
    },
    skuTreeList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    /*是否能够新增规格，商品在编辑状态下不允许新增规格值,不允许删除规格值*/
    addAble: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Attribute
  },
  data() {
    return {
      disableAddSkuTree: false
    };
  },
  watch: {},
  mounted() {
    AttributesStore.init(this.goodsType.value).then(() => {
      //获取规格成功后，初始化设置不可以重复选择的规格
      this.resetDisableAttribute();
    });
  },
  methods: {
    onDelAttr(index) {
      this.skuTreeList.splice(index, 1);
      this.resetDisableAttribute();
      this.$emit('assemble-sku', this.assembleSkuInfos());
    },

    /**
     * 列表里新增一个sku 规格
     **/
    onAddSkuTree() {
      this.skuTreeList.push({});
    },

    /**
     * 增加或者更改某个规格，更改/增加父规格或者父规格中的子规格增/删都会发生变化
     * 该规格对应保存一个索引#skuTree.index，即规格的位置，根据该索引对整个打包的规格进行更新
     */
    onUpdateSkuTree(skuTree) {
      this.skuTreeList.splice(skuTree.index, 1, skuTree.attrTree);
      this.resetDisableAttribute();
      this.$emit('assemble-sku', this.assembleSkuInfos());
    },

    /**
     * 重置规格的禁选状态，已选择的规格不允许再选
     */
    resetDisableAttribute() {
      AttributesStore.Store.forEach(parentItem => {
        this.$set(parentItem, 'disabled', false);
        const selectedAttribute = this.skuTreeList.find(selectAttr => {
          return parentItem.id === selectAttr.keyId;
        });
        if (selectedAttribute) {
          this.$set(parentItem, 'disabled', true);
        }
      });
    },

    /**
     * 根据选择的规格，组装sku数据
     * @returns {*}
     */
    assembleSkuInfos() {
      //每个父规格下的选择的子规格是一个数组，将这些数组都存放到这个数组里，形成一个二维数组，做笛卡尔积运算使用
      const packedAttrChildList = [];

      this.skuTreeList.forEach(item => {
        //只有选中了某一个子规格才认为该规格是合理的，所以加个判断过滤掉不合理的规格输入
        //因为可能存在用户选择了子规格后，又将子规格统统删除的行为
        if (item.treeValList && item.treeValList.length) {
          item.treeValList.forEach(sub => {
            sub.keyId = item.keyId;
            sub.keyName = item.keyName;
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
          //一个sku的规格集：每个父规格下的某个子规格形成的一列数据
          skuInfoNames: skuItem //[{'颜色': '红色'}, {'尺寸': '中'}]
        };

        return extraSkuItem;
      });

      //设置唯一组合标识
      this.addSkuInfoUniqueKeys(assembleSkuInfos);
      return assembleSkuInfos;
    }
  }
};
</script>

<style lang="less">
</style>
