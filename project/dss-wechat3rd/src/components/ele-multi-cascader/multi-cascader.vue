<template>
  <div style="width:100%;height:100%;">
    <el-select
      class="multi-cascader-select"
      style="width:100%;height:100%;"
      v-model="selectedLabels"
      multiple
      :popper-class="innerPopperClass"
      @remove-tag="removeOne"
      :filterable="filterable"
      :filter-method="innerFilterMethod"
      :reserve-keyword="reserveKeyword"
      @change="changeLabel"
      v-bind="$attrs"
      @blur="handleBlur"
      @visible-change="visibleChange"
      @focus="handleFocus"
      @clear="handleClear"
      :allow-create="false"
    >
      <span slot="prefix" v-if="$slots.prefix">
        <slot name="prefix"></slot>
      </span>
      <template v-if="!isSearching">
        <el-option value="__root">
          <div class="ground" @click.stop>
            <render-list
              :only-last="onlyLast"
              :list="root.childNodes"
              :level="1"
              :active-list="activeList"
              @handle-click="handleClick"
              @handle-check="handleCheck"
              :label-key="labelKey"
              :expand-trigger="expandTrigger"
            ></render-list>
            <template v-for="item in maxLevellist">
              <div
                :class="`floor-item floor-position-left-${item.id + 1}`"
                :key="item.id"
                v-if="item.rendered"
                v-show="activeList.length >= item.id"
              >
                <render-list
                  :only-last="onlyLast"
                  :list="showData[item.id]"
                  :level="item.id + 1"
                  :active-list="activeList"
                  @handle-click="handleClick"
                  @handle-check="handleCheck"
                  :label-key="labelKey"
                  :expand-trigger="expandTrigger"
                ></render-list>
              </div>
            </template>
          </div>
        </el-option>
      </template>
      <template v-if="isSearching">
        <el-option
          v-for="item in searchResult"
          :value="item.showLabel"
          :key="getKey(item)"
        >
          <div style="width:100%;height:100%" @click.stop="selectOne(item)">
            {{item.totalLabel}}
          </div>
        </el-option>
      </template>
    </el-select>
  </div>
</template>

<script>
import TreeStore from './lib/Tree.js';
import renderList from './render-list.vue';
// import _ from 'lodash'
import { _findByObj } from './tool/unit';
export default {
  name: 'el-cascader-multi',
  components: {
    renderList
  },
  props: {
    data: {
      type: Array,
      default: () => [],
      required: true
    },
    value: {
      type: Array,
      default: () => [],
      required: true
    },
    separator: {
      type: String,
      default: '-'
    },
    filterable: {
      type: Boolean,
      default: false
    },
    filterMethod: {
      type: Function
    },
    popperClass: {
      type: String,
      default: ''
    },
    reserveKeyword: {
      type: Boolean,
      default: true
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    expandTrigger: {
      type: String,
      default: 'click'
    },
    onlyLast: {
      type: Boolean,
      default: false
    },
    isTwoDimensionValue: {
      type: Boolean,
      default: true
    },
    showLeafLabel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedLabels: [],
      selectedIds: [],
      selectedNodes: [],
      activeClass: 'floor-width-1',
      store: {},
      root: [],
      maxLevellist: [],
      showData: {},
      activeList: [],
      searchText: '',
      searchResult: []
    };
  },
  computed: {
    isSearching() {
      return !(this.searchText.trim() === '');
    },
    innerPopperClass() {
      return `${this.popperClass} multi-cascader ${this.isSearching ? '' : 'multi-cascader-style'} ${this.activeClass}`;
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.init();
      }
    },
    value: {
      deep: true,
      handler() {
        // this.init()
        this.updateSelect(this.value, true, true);
      }
    },
    selectedNodes() {
      this.$emit('change', this.selectedNodes.map(o => o[this.isTwoDimensionValue ? '_idArr' : this.valueKey]));
    }
  },
  methods: {
    visibleChange(v) {
      this.activeList = [];
      this.activeClass = 'floor-width-1';
      if (!v) {
        this.searchText = '';
      }
      this.$emit('visible-change', v);
    },
    handleBlur(e) {
      this.searchText = '';
      this.$emit('blur', e);
    },
    handleFocus(e) {
      this.$emit('focus', e);
    },
    handleClear() {
      this.selectedNodes.forEach(node => {
        node.check(false);
      });
      this.$emit('input', []);
      this.$emit('clear');
    },
    selectOne(item) {
      item.checked = !item.checked;
      this.handleCheck(item);
    },
    changeLabel(v) {
      this.store.nodeList.forEach(node => {
        node.check(v.includes(node.showLabel));
      });
    },
    innerFilterMethod(v) {
      this.searchText = v;
      let tempResult = this.store.nodeList;
      if (v.trim() !== '') {
        this.activeClass = '';
        if (typeof this.filterMethod === 'function') {
          this.searchResult = this.filterMethod(tempResult, v);
        } else {
          tempResult = tempResult.filter(o => o.isLeaf);
          tempResult = tempResult.filter(o => o.showLabel.includes(v));
          this.searchResult = tempResult;
        }
      } else {
        this.activeClass = 'floor-width-1';
      }
    },
    getKey() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = (Math.random() * 16) | 0;
        let v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    handleClick(node, levelIndex, level) {
      if (this.maxLevellist[level - 1]) {
        this.maxLevellist[level - 1].rendered = true;
      }
      this.activeClass = `floor-width-${node.isLeaf ? level : level + 1}`;
      let tempList = [...this.activeList];
      if (level < tempList.length) {
        tempList.splice(level);
      }
      tempList[level - 1] = node.id;
      this.showData[level] = node.childNodes;
      this.activeList = tempList;
    },
    handleCheck(node) {
      node.check(node.checked);
      this.selectedIds = this.store.selectedIds;
      this.updateSelect(this.store.selectedIds);
      this.$emit('input', this.selectedNodes.map(o => o[this.isTwoDimensionValue ? '_idArr' : this.valueKey]));
    },
    removeOne(v) {
      let targetNode = this.selectedNodes.find(o => o.showLabel === v) || {};
      targetNode.checked = false;
      this.handleCheck(targetNode);
      this.$emit('remove-tag', v);
    },
    updateSelect(data = [], needCheckNode = false, setValue = false) {
      let tempSelectedNodes = [];
      let tempSelectedLabels = [];
      let tempSelectedIds = [];
      this.store.nodeList.forEach(node => {
        node.checked && node.check(false);
      });
      data.forEach(o => {
        let targetNode;
        if (setValue) {
          targetNode =
            _findByObj(this.store.nodeList, { [this.isTwoDimensionValue ? '_idArr' : this.valueKey]: o }) || {};
          // targetNode = _.find(this.store.nodeList, { [this.isTwoDimensionValue ? '_idArr' : this.valueKey]: o }) || {}
          tempSelectedIds.push(targetNode.id);
        } else {
          targetNode = this.store.nodesMap[o];
          tempSelectedIds.push(o);
        }
        if (targetNode) {
          needCheckNode && targetNode.check(true);
          tempSelectedNodes.push(targetNode);
          tempSelectedLabels.push(targetNode.showLabel);
        }
      });
      this.selectedNodes = tempSelectedNodes;
      this.selectedLabels = tempSelectedLabels;
      this.selectedIds = tempSelectedIds;
      this.markParentIndeterminate();
    },
    init() {
      this.store = new TreeStore({
        data: this.data,
        separator: this.separator,
        valueKey: this.valueKey,
        labelKey: this.labelKey,
        childrenKey: this.childrenKey,
        showLeafLabel: this.showLeafLabel
      });
      this.root = this.store.root;
      this.maxLevellist = Array.from({ length: this.store.maxLevel - 1 }, (v, i) => {
        this.showData[i + 1] = [];
        return {
          id: i + 1,
          rendered: false
        };
      });
      this.updateSelect(this.value, true, true);
    },
    markParentIndeterminate() {
      (this.store.nodeList || []).forEach(item => {
        item.indeterminate = false;
      });
      (this.selectedNodes || []).forEach(node => {
        if (node.parent && !node.parent.isLeaf) {
          this.mark(node.parent);
        }
      });
    },
    mark(node) {
      if (node && node.level < 1) return;
      if (node.childNodes && !node.isLeaf) {
        node.indeterminate = node.childNodes.some(child => child.checked || child.indeterminate) && !node.checked;
      }
      if (node.parent) {
        this.mark(node.parent);
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="less">
.el-select-dropdown.el-popper.is-multiple.multi-cascader {
  .el-select-dropdown__item.selected::after {
    top: 0;
  }
}
.el-select-dropdown.el-popper.is-multiple.multi-cascader-style{
  min-width: 200px!important;
  .el-select-dropdown__list {
    padding: 0;
    position: relative;
  }
  .el-select-dropdown__item {
    padding: 0;
    height: 216px;
    &.hover {
      background-color: #fff;
    }
  }
  .li-style {
    height: 34px;
    padding: 0px 20px;
    box-sizing: border-box;
    list-style: none;
    width: 200px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 34px;
    &:hover{
      background-color: rgba(69,200,220,.1);
    }
    &.selected {
      color: #45c8dc;
    }
    &.active-li {
      background-color: rgba(69,200,220,.1);
      color: #45c8dc;
    }
    .li-label-style{
      text-align: left;
      width: 100%;
      box-sizing: border-box;
      padding-right: 15px;
      position: relative;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      .li-label-icon {
        position: absolute;
        right: 0px;
        top: 50%;
        transform: translate(0, -50%);
      }
      .el-checkbox {
        margin-right: 10px;
      }
    }
  }
  .ground {
    width: 100%;
    height: 204px;
    padding: 6px 0;
  }
  .floor-item {
    width: 200px;
    padding: 6px 0;
    border-left: 1px solid #eee;
    position: absolute;
    top: 0;
    height: 204px;
    overflow-y: auto;
    overflow-x: hidden;
  }

}
.multi-cascader-style {
  p {
    margin: 0;
    padding: 0;
  }
  ol, ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}

@width: 200px;

.loop(@i) when (@i > 0) {
   .loop((@i - 1)); // 递归调用自身
   &.floor-width-@{i} {
     width: @i * @width;
   }
   .floor-position-left-@{i} {
     left: (@i - 1) * @width;
   }
 }

.multi-cascader-style {
  .loop(10);
}

.multi-cascader-select.el-select {
  .el-select__tags > span {
    display: inline-block;
    max-width: 100%;
  }
  .el-tag.el-tag--info.el-tag--small {
    display: inline-block;
    max-width: 100%;
    position: relative;
    padding: 0 12px 0 8px;

    .el-select__tags-text {
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .el-tag__close.el-icon-close {
      position: absolute;
      top: 6px;
      right: -2px;
    }
  }
}
</style>
