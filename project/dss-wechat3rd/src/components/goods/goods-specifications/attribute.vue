<template>
  <div class="goods-attribute">
    <div class="attr-select-container">
      <span>{{breadcrumb}}</span>
      <el-checkbox class="check-add-image"
                   :true-label="1"
                   :false-label="0"
                   v-model="attrImageChecked"
                   :disabled="isDisabledEdit"
                   @change="toggleShowAttrImage">添加规格图片</el-checkbox>
    </div>

    <div class="attr-item-container">
      <div class="attr-val"
           v-for="(item, index) in attrChildSelectedItems"
           :key="item.valId">

        <el-tag class="attr-val-tag"
                :closable="!isDisabledEdit"
                :disable-transitions="false"
                @close="handleRemoveAttrItem(item)">{{item.valName}}</el-tag>
        <choose-images style="margin-top: 10px"
                       v-if="attrImageChecked"
                       :is-disabled-edit="isDisabledEdit"
                       @delete="onDeleteImg(index)"
                       :value="{imgUrl:item.imageUrl}"
                       :unique="index"
                       @input="onAttrImgChange"
                       :width="60"
                       :height="60" />
        <div class="attr-explanation" :key="index">
          <el-button size="mini" type="text" @click="addAttrExplanation(index)" style="padding: 0 2px 0 14px;">添加说明</el-button>
          <el-popover
            popper-class="attr-explanation-popper"
            placement="bottom"
            width="300"
            trigger="click">
            <div class="minapp-explain">
              <div
                class="minapp-explain-item">
                <img :src="item.imageUrl" class="cover">
                <div class="title">{{item.valName}}</div>
                <div class="tips">
                  {{item.skuExplain || '说明内容'}}
                </div>
              </div>
            </div>
            <i slot="reference" class="el-icon-question" style="color: rgb(64, 158, 255);"></i>
          </el-popover>
        </div>
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

      <el-button 
                 round
                 @click="onShowAttrChildSelector"
                 :disabled="isDisabledEdit">+规格选项</el-button>
    </div>

    <div class="show-type-container">
      展示方式：
      <el-radio-group v-model="skuTree.skuShowType">
        <el-radio :label="0">文字</el-radio>
        <el-radio :label="1">图片</el-radio>
        <el-radio :label="2">图片+文字</el-radio>
      </el-radio-group>
    </div>

    <attr-explain-dialog
      v-if="showAttrExplainDialog"
      :show.sync="showAttrExplainDialog"
      :att-item="attrChildSelectedItems[currentEditAttrItemIndex]"
      @save="setAttrItemExplain"
    ></attr-explain-dialog>
  </div>
</template>

<script>
/*商品规格*/
import './attribute.less';
import utils from '@/dss-common/utils';
import constants from '@/dss-wechat3rd/src/constants/index';
import services from '@/dss-common/utils/services';
import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
// import AttributesStore from './AttributesStore';
import AttrExplainDialog from './attr-explain-dialog.vue';

export default {
  name: 'Attribute',
  components: {
    ChooseImages,
    AttrExplainDialog
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
    // 当前操作的分类
    skuTree: {
      type: Object,
      default: function() {
        return null;
      }
    },

    breadcrumb: {
      type: String,
      default: ''
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
      //是否展示规格图片
      attrImageChecked: 1,
      //选中的当前规格的值的集合
      attrChildSelectedItems: [],
      //单个规格的value
      currentAttrChildItem: '',
      // 当前分类下规格列表
      attrChildOptions: [],
      attrChildSelectorVisible: false,
      showAttrExplainDialog: false,
      currentEditAttrItemIndex: null
    };
  },

  computed: {
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
    skuTree: {
      immediate: true,
      handler(newVal, oldVal) {
        this.filterSkuTree();
        if (newVal && oldVal && newVal.keyId !== oldVal.keyId) this.onAttrParentSelect();
      }
    }
  },

  methods: {
    filterSkuTree() {
      let skuTree = this.skuTree;
      if (skuTree) {
        // this.attrImageChecked = (utils.isUndefined(skuTree.showImage) ? true : !!skuTree.showImage);
        this.attrImageChecked = skuTree.showImage;

        this.attrChildSelectedItems = skuTree.treeValList || [];
      }
    },

    //规格 子项 更新 图片信息
    onAttrImgChange(e, unique) {
      let item = this.attrChildSelectedItems[unique];
      if (!!item) {
        // item.imageId = e.id;
        // item.imageUrl = e.imgUrl;
        this.$set(this.attrChildSelectedItems[unique], 'imageId', e.id);
        this.$set(this.attrChildSelectedItems[unique], 'imageUrl', e.imgUrl);
      }
    },

    /**
     * 获取当前选中的父规格下所有的子规格
     */
    listAttributeChildItems() {
      const params = {
        attrKeyId: this.skuTree.keyId
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
    // 展示规格图片切换
    toggleShowAttrImage(val) {
      this.skuTree.showImage = this.attrImageChecked;
    },
    // 新增规格
    onShowAttrChildSelector() {
      this.attrChildSelectorVisible = true;
    },
    // 删除规格
    handleRemoveAttrItem(attrChildItem) {
      this.attrChildSelectedItems.splice(this.attrChildSelectedItems.indexOf(attrChildItem), 1);
      this.emitSelectAttribute();
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
    // 规格内容改变触发更新
    emitSelectAttribute() {
      this.$emit('select-attribute', {
        // index: this.index,
        attrTree: {
          showImage: this.attrImageChecked,
          keyId: this.skuTree.keyId,
          keyName: this.skuTree.keyName,
          treeValList: this.attrChildSelectedItems
        }
      });
    },

    onDeleteImg(index) {
      this.attrChildSelectedItems[index].imageId = null;
    },

    onAttrChildSelect(attrValue) {
      if (!this.currentAttrChildItem) {
        const params = {
          attrKeyId: this.skuTree.keyId,
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
              attrKeyId: this.skuTree.keyId
            };
            this.attrChildOptions.unshift(newChildItem);
            this.currentAttrChildItem = newChildItem;
            this.addAttrChildSelected();
          });
      } else {
        this.addAttrChildSelected();
      }
    },

    addAttrChildSelected() {
      const selectedChildItem = {
        keyId: this.skuTree.keyId,
        keyName: this.skuTree.keyName,
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

    onAttrParentSelect(attrName) {
      this.attrChildOptions = [];
      // this.attrChildSelectedItems = [];
      this.currentAttrChildItem = '';
      this.listAttributeChildItems();
    },
    // 添加说明
    addAttrExplanation(index) {
      this.currentEditAttrItemIndex = index;
      this.showAttrExplainDialog = true;
    },
    setAttrItemExplain(text) {
      // this.attrChildSelectedItems[this.currentEditAttrItemIndex].skuExplain = text;
      this.$set(this.attrChildSelectedItems[this.currentEditAttrItemIndex], 'skuExplain', text);
      this.currentEditAttrItemIndex = null;
    }
  }
};
</script>

<style lang="less" >
.custom-select {
  z-index: 10002 !important;
}
</style>
