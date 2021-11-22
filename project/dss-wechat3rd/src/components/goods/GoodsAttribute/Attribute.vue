<template>
  <div class="goods-attribute">
    <div class="attr-select-container">

      <el-select v-model="computeCurrentParentItem"
                 filterable
                 allow-create
                 default-first-option
                 :disabled="!delAble"
                 class="primary-attr-select"
                 @change="onAttrParentSelect"
                 popper-class="custom-select"
                 placeholder="选择或输入规格">
        <el-option v-for="item in AttrStore"
                   :key="item.id"
                   :disabled="item.disabled"
                   :label="item.attrName"
                   :value="item.attrName"></el-option>
      </el-select>

      <el-checkbox class="check-add-image"
                   v-model="attrImageChecked"
                   :disabled="isDisabledEdit"
                   v-if="showAttrImage"
                   @change="toggleShowAttrImage">添加规格图片</el-checkbox>
      <i class="del-attr-btn"
         v-if="delAble"
         @click="handleDelAttr"></i>
    </div>

    <div class="attr-item-container"
         v-if="currentAttrParentItem">
      <div class="attr-val"
           v-for="(item, index) in attrChildSelectedItems"
           :key="item.valId">

        <el-tag class="attr-val-tag"
                :closable="!isDisabledEdit"
                :disable-transitions="false"
                @close="handleRemoveAttrItem(item)">{{item.valName}}</el-tag>
        <choose-images style="margin-top: 10px"
                       v-if="showAttrImage && attrImageChecked"
                       :is-disabled-edit="isDisabledEdit"
                       @delete="onDeleteImg(index)"
                       :value="{imgUrl:item.imageUrl}"
                       :unique="index"
                       @input="onAttrImgChange"
                       :width="60"
                       :height="60" />
      </div>

      <el-select v-if="attrChildSelectorVisible"
                 v-model="computeCurrentChildItem"
                 filterable
                 allow-create
                 default-first-option
                 popper-class="custom-select"
                 class="primary-attr-select align-top"
                 @change="onAttrChildSelect"
                 @visible-change="onAttrChildVisibleChange"
                 placeholder="选择或输入值">
        <el-option v-for="item in attrChildOptions"
                   :key="item.id"
                   :disabled="item.disabled"
                   :label="item.attrValue"
                   :value="item.attrValue"></el-option>
      </el-select>

      <el-button v-else
                 round
                 @click="onShowAttrChildSelector"
                 :disabled="isDisabledEdit">+规格选项</el-button>
      <div class="add-attr-image-tip"
           v-if="showAttrImage && attrImageChecked">目前仅支持第一个规格设置不同的规格图片，设置后，用户选择不同规格会显示不同图片，建议尺寸640x640像素</div>
    </div>
  </div>
</template>

<script>
/*商品规格*/
import './Attribute.less';
import utils from '@/dss-common/utils';
import constants from '@/dss-wechat3rd/src/constants/index';
import services from '@/dss-common/utils/services';
import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import AttributesStore from './AttributesStore';

export default {
  name: 'Attribute',
  components: {
    ChooseImages
  },
  props: {
    goodsType: {
      type: Object,
      default: function() {
        return null;
      }
    },
    // 是否禁止编辑
    isDisabledEdit: {
      type: Boolean,
      default: false
    },
    multiEnable: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    },
    skuTree: {
      type: Object,
      default: function() {
        return null;
      }
    },

    showAttrImage: {
      type: Boolean,
      default: false
    },
    /*是否允许删除规格值，如果是编辑商品状态，不允许删除之前的规格值*/
    delAble: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      AttrStore: AttributesStore.Store,
      visibleIcon: true,
      //所有规格的分类
      currentAttrParentItem: '',
      //单个规格的value
      currentAttrChildItem: '',
      attrChildOptions: [],
      //选中的当前规格的值的集合
      attrChildSelectedItems: [],
      attrChildSelectorVisible: false,
      //是否展示规格图片
      attrImageChecked: true
    };
  },

  computed: {
    computeCurrentParentItem: {
      get() {
        if (this.currentAttrParentItem) {
          return this.currentAttrParentItem.attrName;
        } else {
          return '';
        }
      },
      set(attrName) {
        this.currentAttrParentItem = this.AttrStore.find(item => {
          return item.attrName === attrName;
        });
      }
    },

    computeCurrentChildItem: {
      get() {
        if (this.currentAttrChildItem) {
          return this.currentAttrChildItem.attrValue;
        } else {
          return '';
        }
      },
      set(attrValue) {
        this.currentAttrChildItem = this.attrChildOptions.find(item => {
          return item.attrValue === attrValue;
        });
      }
    }
  },

  watch: {
    AttrStore: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (!!newVal && newVal.length > 0 && this.skuTree) {
          this.filterSkuTree();
        }
      }
    },
    skuTree: {
      immediate: true,
      handler(newVal, oldVal) {
        this.filterSkuTree();
        console.log(this.skuTree);
      }
    }
  },

  methods: {
    filterSkuTree() {
      let skuTree = this.skuTree;
      if (skuTree) {
        this.attrImageChecked =
          this.showAttrImage && (utils.isUndefined(skuTree.showImage) ? true : !!skuTree.showImage);

        this.currentAttrParentItem = this.AttrStore.find(item => {
          return item.id === skuTree.keyId;
        });

        this.attrChildSelectedItems = skuTree.treeValList || [];
      }
    },

    //规格 子项 更新 图片信息
    onAttrImgChange(e, unique) {
      let item = this.attrChildSelectedItems[unique];
      if (!!item) {
        item.imageId = e.id;
        item.imageUrl = e.imgUrl;
      }
    },

    /**
     * 获取当前选中的父规格下所有的子规格
     */
    listAttributeChildItems() {
      const params = {
        attrKeyId: this.currentAttrParentItem.id
      };

      services
        .get(constants.Api.goods.attribute.itemList, {
          action: '商品规格的值',
          params
        })
        .done(
          res => {
            this.attrChildOptions = res.data || [];
            this.resetAttrChildDisable();
          },
          error => {}
        );
    },

    hasParentItem(attrName) {
      return this.AttrStore.find(item => {
        return item.attrName === attrName;
      });
    },

    onAttrParentSelect(attrName) {
      this.skuTree.showImage = this.attrImageChecked;
      this.attrChildOptions = [];
      this.attrChildSelectedItems = [];
      this.currentAttrChildItem = '';

      if (!this.hasParentItem(attrName)) {
        AttributesStore.apiAddGoodAttribute(attrName).then(newAttrParentItem => {
          this.currentAttrParentItem = newAttrParentItem;
          this.emitSelectAttribute();
          this.listAttributeChildItems();
        });
      } else {
        this.emitSelectAttribute();
        this.listAttributeChildItems();
      }
    },

    onAttrChildSelect(attrValue) {
      if (!this.currentAttrChildItem) {
        const params = {
          //per_appId: 101,
          attrKeyId: this.currentAttrParentItem.id,
          attrValue: attrValue
        };
        services
          .post(constants.Api.goods.attribute.addItem, params, {
            action: '添加规格的值'
          })
          .done(res => {
            const newChildItem = {
              id: res.data,
              attrValue: attrValue,
              attrKeyId: this.currentAttrParentItem.id
            };
            this.attrChildOptions.unshift(newChildItem);
            this.currentAttrChildItem = newChildItem;
            this.addAttrChildSelected();
          });
      } else {
        this.addAttrChildSelected();
      }
    },

    onAttrChildVisibleChange(isVisible) {
      if (isVisible) {
        if (!(this.attrChildOptions && this.attrChildOptions.length)) {
          this.listAttributeChildItems();
        } else {
          this.resetAttrChildDisable();
        }
      }
    },

    resetAttrChildDisable() {
      this.attrChildOptions.forEach(item => {
        this.$set(item, 'disabled', false);
        const selectedItem = this.attrChildSelectedItems.find(attr => {
          return attr.valId === item.id;
        });
        if (selectedItem) {
          this.$set(item, 'disabled', true);
        }
      });
    },

    emitSelectAttribute() {
      this.$emit('select-attribute', {
        index: this.index,
        attrTree: {
          showImage: this.attrImageChecked,
          keyId: this.currentAttrParentItem.id,
          keyName: this.currentAttrParentItem.attrName,
          treeValList: this.attrChildSelectedItems
        }
      });
    },

    addAttrChildSelected() {
      const selectedChildItem = {
        keyId: this.currentAttrParentItem.id,
        keyName: this.currentAttrParentItem.attrName,
        valId: this.currentAttrChildItem.id,
        valName: this.currentAttrChildItem.attrValue,
        disabled: true,
        delAble: true //是否能够删除该规格值，新增的规格值允许删除
      };
      this.attrChildSelectedItems.push(selectedChildItem);
      this.emitSelectAttribute();

      this.attrChildSelectorVisible = false;
      this.currentAttrChildItem = '';
    },

    handleRemoveAttrItem(attrChildItem) {
      this.attrChildSelectedItems.splice(this.attrChildSelectedItems.indexOf(attrChildItem), 1);
      this.emitSelectAttribute();
    },

    onShowAttrChildSelector() {
      this.attrChildSelectorVisible = true;
    },

    toggleShowAttrImage(val) {
      this.skuTree.showImage = this.attrImageChecked;
    },

    handleDelAttr() {
      this.$emit('del-attr');
    },

    onDeleteImg(index) {
      this.attrChildSelectedItems[index].imageId = null;
    }
  }
};
</script>

<style lang="less" >
.custom-select {
  z-index: 10002 !important;
}
</style>
