<template>
  <transition name="el-zoom-in-top" @before-enter="handleMenuEnter" @after-leave="handleMenuLeave">
    <div v-show="visible" class="multi-el-cascader-menus el-popper" :class="popperClass" ref="wrapper">
      <div x-arrow class="popper__arrow"></div>
      <ul
        :class="{
          'multi-el-cascader-menu': true,
          'multi-el-cascader-menu--flexible': false,
        }"
        refInFor
        ref="menus"
        role="menu"
        :style="{
          minWidth: inputWidth + 'px',
          position: expandTrigger === 'hover' && activeValue.length - 1 === menuIndex ? 'relative' : '',
        }"
        :key="`menu-${id}-${menuIndex}`"
        :id="`menu-${id}-${menuIndex}`"
        v-for="(menu, menuIndex) in activeOptions"
      >
        <li
          :class="{
            'multi-el-cascader-menu__item': true,
            'multi-el-cascader-menu__item--extensible': item.children,
            'is-active': item.value === activeValue[menuIndex],
            'is-disabled': item.disabled,
          }"
          :ref="item.value === activeValue[menuIndex] ? 'activeItem' : null"
          :tabindex="item.disabled ? null : -1"
          role="menuitem"
          :aria-haspopup="!!item.children"
          :aria-expanded="item.value === activeValue[menuIndex]"
          :id="!item.disabled && !item.children ? `${`menu-${id}-${menuIndex}`}-${itemIndex}` : null"
          :aria-owns="!item.children ? null : `menu-${id}-${menuIndex + 1}`"
          v-for="(item, itemIndex) in menu"
          :key="item.id"
          @click="handleClickItem(item, menuIndex)"
          @mouseenter="handleMouseenterItem(item, menuIndex)"
          @mousedown="handleMousedownItem(item)"
          @focus="handleFocusItem(item, menuIndex)"
        >
          <el-checkbox
            v-if="multiple"
            class="multi-el-cascader-checkbox"
            :indeterminate="dissIndeterminate(item)"
            :value="dissCheckValue(item)"
            :disabled="isDisabledCheckbox(item)"
            @change="value => handleChangeCheckbox(item, menuIndex, value)"
          ></el-checkbox>
          <!-- 如果item是disabled的，或者只能选末级的 -->
          <span>{{ item.label }}</span>
        </li>
        <svg
          v-if="expandTrigger === 'hover' && activeValue.length - 1 === menuIndex"
          ref="hoverZone"
          :style="{
            position: 'absolute',
            top: 0,
            height: '100%',
            width: '100%',
            left: 0,
            pointerEvents: 'none',
          }"
        />
      </ul>
    </div>
  </transition>
</template>

<script>
  import { isDef } from 'element-ui/src/utils/shared';
  import scrollIntoView from 'element-ui/src/utils/scroll-into-view';
  import { generateId } from 'element-ui/src/utils/util';
  const copyArray = (arr, props) => {
    if (!arr || !Array.isArray(arr) || !props) return arr;
    const result = [];
    const configurableProps = ['__IS__FLAT__OPTIONS', 'label', 'value', 'disabled', 'parent', 'path', 'isLeafNode'];
    const childrenProp = props.children || 'children';
    arr.forEach(item => {
      const itemCopy = {};
      configurableProps.forEach(prop => {
        let name = props[prop];
        let value = item[name];
        if (value === undefined) {
          name = prop;
          value = item[name];
        }
        if (value !== undefined) itemCopy[name] = value;
      });
      if (Array.isArray(item[childrenProp])) {
        itemCopy[childrenProp] = copyArray(item[childrenProp], props);
      }
      result.push(itemCopy);
    });
    return result;
  };
  // 1：自身在数组中或者父级在数组中则checked，2：有子菜单且：子菜单全部checked，则自身checked，3：有子菜单且部分子菜单checked，则处于不确定状态，，4：未check状态
  const CHECKED = 1;
  const CHILD_ALL_CHECKED = 2;
  const CHILD_SOME_CHECKED = 3;
  const UNCHECKED = 4;

  export default {
    name: 'ElMultiCascaderMenu',
    data() {
      return {
        inputWidth: 0,
        options: [],
        props: {},
        visible: false,
        activeValue: [],
        activeMultiValue: [],
        value: [],
        expandTrigger: 'click',
        changeOnSelect: false,
        popperClass: '',
        hoverTimer: 0,
        clicking: false,
        multiple: false,
        currentActiveValue: [],
        selectChildren: false,
        onlyOutPutLeafNode: false, //
        id: generateId(),
      };
    },
    watch: {
      activeMultiValue(value) {
        // console.log(value);
      },
      visible(value) {
        if (value) {
          if (this.multiple) {
            this.activeMultiValue = this.value;
            if (this.currentActiveValue.length > 0) {
              this.activeValue = this.currentActiveValue;
              this.currentActiveValue = [];
            }
          } else {
            this.activeValue = this.value;
          }
        }
      },
      value: {
        immediate: true,
        handler(value) {
          if (this.multiple) {
            this.activeMultiValue = this.value;
            if (this.currentActiveValue.length > 0) {
              this.activeValue = this.currentActiveValue;
              this.currentActiveValue = [];
            }
          } else {
            this.activeValue = value;
          }
        },
      },
    },
    computed: {
      activeOptions() {
        const activeValue = this.activeValue;
        const configurableProps = ['label', 'value', 'children', 'disabled'];
        // 需要记下路径每个item的路径, 方便渎职
        const formatOptions = (options, currentPath) => {
          options.forEach(option => {
            if (option.__IS__FLAT__OPTIONS) return;
            configurableProps.forEach(prop => {
              const value = option[this.props[prop] || prop];
              if (value !== undefined) option[prop] = value;
            });
            option.path = [...currentPath, option.value];
            if (Array.isArray(option.children)) {
              formatOptions(option.children, option.path);
            }
          });
        };

        const loadActiveOptions = (options, activeOptions = []) => {
          const level = activeOptions.length;
          activeOptions[level] = options;
          const active = activeValue[level];
          if (isDef(active)) {
            options = options.filter(option => option.value === active)[0];
            if (options && options.children) {
              loadActiveOptions(options.children, activeOptions);
            }
          }
          return activeOptions;
        };

        const optionsCopy = copyArray(this.options, this.props);
        formatOptions(optionsCopy, []);
        return loadActiveOptions(optionsCopy);
      },
    },
    methods: {
      triggerHandler(item, menuIndex) {
        if (this.visible) {
          this.activeItem(item, menuIndex);
          if (this.multiple) {
            this.select(item, menuIndex);
          }
          this.$nextTick(() => {
            // adjust self and next level
            this.scrollMenu(this.$refs.menus[menuIndex]);
            this.scrollMenu(this.$refs.menus[menuIndex + 1]);
          });
        }
      },
      handleMousedownItem(item) {
        if (!item.children) return;
        this.clicking = true;
      },
      handleFocusItem(item, menuIndex) {
        if (!item.children) return;
        if (this.clicking) {
          this.clicking = false;
          return;
        }
        this.triggerHandler(item, menuIndex);
      },
      handleMouseenterItem(item, menuIndex) {
        if (item.disabled || this.expandTrigger === 'click') return;
        if (item.children) {
          this.triggerHandler(item, menuIndex);
        }
      },
      handleClickItem(item, menuIndex) {
        if (item.disabled) return;
        if (this.expandTrigger === 'hover' && this.changeOnSelect) {
          if (this.activeValue.indexOf(item.value) !== -1) {
            if (!this.multiple) {
              this.$emit('closeInside', true);
            }
          }
        }
        if (this.expandTrigger === 'hover') return;

        if (item.children) {
          this.triggerHandler(item, menuIndex);
        } else {
          this.select(item, menuIndex);
          this.$nextTick(() => this.scrollMenu(this.$refs.menus[menuIndex]));
        }
      },
      isDisabledCheckbox(item) {
        if (this.selectChildren === false && this.onlyOutPutLeafNode === true) {
          // 如果选父节点子节点不联动，且只输出子节点，选父节点没有任何效果等同于changeOnSelect为false
          this.changeOnSelect = false;
        }

        // 如果item是disabled的，或者只能选末级的
        return item.disabled || (!this.changeOnSelect && Array.isArray(item.children) && item.children.length > 0);
      },
      dissCheckValue(item) {
        const result = this.multiple ? this.isItemChecked(item) : 0;
        return result === CHECKED || result === CHILD_ALL_CHECKED;
      },

      dissIndeterminate(item) {
        const result = this.multiple ? this.isItemChecked(item) : 0;
        return result === CHILD_SOME_CHECKED;
      },
      handleChangeCheckbox(item, menuIndex, valueCheckBox) {
        if (!this.multiple || item.disabled) {
          return;
        }
        this.select(item, menuIndex, valueCheckBox);
        this.$nextTick(() => this.scrollMenu(this.$refs.menus[menuIndex]));
      },
      isArrayEqual(source, target) {
        if (!Array.isArray(source) || !Array.isArray(target)) {
          return false;
        }
        if (source === target) {
          return true;
        }
        if (source.length !== target.length) {
          return false;
        }
        if (source.length === 0) {
          return true;
        }
        return !source.some((ele, idx) => source[idx] !== target[idx]);
      },
      isItemChecked(item) {
        if (!item) {
          return;
        }
        let isChecked = UNCHECKED;
        if (item.__IS__FLAT__OPTIONS && !item.path) {
          item.path = item.value;
        }
        if (this.multiple) {
          if (this.activeMultiValue.find(ele => this.isArrayEqual(item.path, ele))) {
            isChecked = CHECKED; // path在activeMultiValue中
          } else if (
            item.path.length > 0 &&
            this.activeMultiValue.find(ele => this.isArrayEqual(item.path.slice(0, item.path.length - 2), ele))
          ) {
            if (this.selectChildren) {
              isChecked = CHECKED; // 如果选中父级自动选中子菜单(selectChildren: true) 且非第一级菜单，且父节点的path在activeMultiValue中
            }
          } else if (item.children && item.children.length > 0) {
            // 有大于0个的子菜单
            // 且父子联动或者可输出所有层级的节点
            if (this.selectChildren || this.onlyOutPutLeafNode) {
              if (
                item.children.every(ele => {
                  const tmp = this.isItemChecked(ele);
                  return tmp === CHECKED || tmp === CHILD_ALL_CHECKED;
                })
              ) {
                isChecked = CHILD_ALL_CHECKED; // 如果所有的子菜单都checked
              } else if (!item.children.every(ele => this.isItemChecked(ele) === UNCHECKED)) {
                isChecked = CHILD_SOME_CHECKED; // 如果所有的子菜单不全是unchecked
              }
            }
          } else if (item.__IS__FLAT__OPTIONS) {
            const options = this.activeOptions[0].filter(ele => {
              const path = ele.path;
              return (
                this.isLeafNode(ele) &&
                path.length > item.path.length &&
                this.isArrayEqual(path.slice(0, item.path.length), item.path)
              );
            });
            if (options.length > 0) {
              if (this.selectChildren || this.onlyOutPutLeafNode) {
                if (
                  options.every(child => {
                    return this.activeMultiValue.find(ele => this.isArrayEqual(child.path, ele));
                  })
                ) {
                  isChecked = CHILD_ALL_CHECKED; // 如果所有的子菜单都checked
                } else if (
                  options.some(child => {
                    return this.activeMultiValue.find(ele => this.isArrayEqual(child.path, ele));
                  })
                ) {
                  isChecked = CHILD_SOME_CHECKED; // 如果所有的子菜单不全是unchecked
                }
              }
            }
          }
        }
        return isChecked;
      },
      pushAllChild(item) {
        // 判断是否是搜索情况，如果是则找出所有的子节点放入
        if (item.__IS__FLAT__OPTIONS) {
          const options = this.activeOptions[0].filter(ele => {
            const path = ele.path;
            return path.length > item.path.length && this.isArrayEqual(path.slice(0, item.path.length), item.path);
          });
          options.forEach(child => {
            if (this.isNodeCanpush(child) && !this.activeMultiValue.find(ele => this.isArrayEqual(child.path, ele))) {
              this.activeMultiValue.push(child.path);
            }
          });
        } else if (Array.isArray(item.children)) {
          item.children.forEach(child => {
            if (this.isNodeCanpush(child) && !this.activeMultiValue.find(ele => this.isArrayEqual(child.path, ele))) {
              this.activeMultiValue.push(child.path);
            }
            this.pushAllChild(child);
          });
        }
      },
      findParent(item) {
        if (item.path.length > 1) {
          const parentMenuIndex = item.path.length - 2;
          const parentValue = item.path[parentMenuIndex];
          return this.activeOptions[parentMenuIndex].find(ele => ele.value === parentValue);
        }
      },
      pushParent(item, __IS__FLAT__OPTIONS) {
        // 子节点全checked时push父节点
        if (!this.isNodeCanpush(item)) {
          return;
        }
        const parent =
          (item.__IS__FLAT__OPTIONS || __IS__FLAT__OPTIONS) && item.parent ? item.parent : this.findParent(item);
        if (parent) {
          const parentStatus = this.isItemChecked(parent);
          if (
            parentStatus === CHILD_ALL_CHECKED &&
            !this.activeMultiValue.find(ele => this.isArrayEqual(parent.path, ele))
          ) {
            if (this.isNodeCanpush(parent)) {
              this.activeMultiValue.push(parent.path);
              this.pushParent(parent, true);
            }
          }
        }
      },
      isLeafNode(item) {
        if (item.__IS__FLAT__OPTIONS) {
          return item.isLeafNode;
        }
        return !(Array.isArray(item.children) && item.children.length > 0);
      },
      isNodeCanpush(item) {
        // 只有在只输出叶子节点且节点为叶子或者 输出所有选中节点是才push
        return !this.onlyOutPutLeafNode || (this.onlyOutPutLeafNode && this.isLeafNode(item));
      },
      select(item, menuIndex, multipleCheckBox) {
        if (this.multiple) {
          if (multipleCheckBox) {
            if (this.isNodeCanpush(item) && !this.activeMultiValue.find(ele => this.isArrayEqual(item.path, ele))) {
              this.activeMultiValue.push(item.path);
            }
            if (this.selectChildren) {
              this.pushAllChild(item);
            }
            // !selectChildren && !onlyOutPutLeafNode
            if (!this.onlyOutPutLeafNode && this.selectChildren) {
              // if(this.selectChildren) {
              this.pushParent(item);
              // }
            }
          } else if (multipleCheckBox === false) {
            if (this.selectChildren) {
              // 子节点如果随着父节点联动，则子节点取消也会取消父节点的选中状态, 并取消孙子节点的状态
              // 删除父节点
              item.path.forEach((ele, idx) => {
                const currentPath = item.path.slice(0, idx + 1);
                const currentIndex = this.activeMultiValue.findIndex(ele => this.isArrayEqual(currentPath, ele));
                if (currentIndex !== -1) {
                  this.activeMultiValue.splice(currentIndex, 1); // 循环删除导致有问题
                }
              });
              // 删除子节点
              this.activeMultiValue = this.activeMultiValue.filter(
                ele => !(ele.length > item.path.length && this.isArrayEqual(item.path, ele.slice(0, item.path.length)))
              );
            } else {
              const currentIndex = this.activeMultiValue.findIndex(ele => this.isArrayEqual(item.path, ele));
              if (currentIndex !== -1) {
                this.activeMultiValue.splice(currentIndex, 1);
              }
            }
          }
        }
        if (item.__IS__FLAT__OPTIONS) {
          this.activeValue = JSON.parse(JSON.stringify(item.value));
        } else if (menuIndex) {
          this.activeValue.splice(menuIndex, this.activeValue.length - 1, item.value);
        } else {
          this.activeValue = [item.value];
        }
        if (this.multiple && multipleCheckBox !== void 0) {
          this.$emit('pick', this.activeMultiValue.slice());
          this.value = this.activeMultiValue.slice();
        } else if (!this.multiple && multipleCheckBox === void 0) {
          this.$emit('pick', this.activeValue.slice());
        }
      },
      handleMenuLeave() {
        this.$emit('menuLeave');
      },
      activeItem(item, menuIndex) {
        if (this.multiple) {
          const len = this.activeOptions.length;
          this.activeValue.splice(menuIndex, len, item.value);
          this.activeOptions.splice(menuIndex + 1, len, item.children);
          // if (this.changeOnSelect) {
          //   this.$emit('pick', this.activeMultiValue.slice(), false);
          // }
          this.$emit('activeItemChange', this.activeValue);
          return;
        }
        const len = this.activeOptions.length;
        this.activeValue.splice(menuIndex, len, item.value);
        this.activeOptions.splice(menuIndex + 1, len, item.children);
        if (this.changeOnSelect) {
          this.$emit('pick', this.activeValue.slice(), false);
        } else {
          this.$emit('activeItemChange', this.activeValue);
        }
      },
      scrollMenu(menu) {
        if (menu) {
          scrollIntoView(menu, menu.getElementsByClassName('is-active')[0]);
        }
      },
      handleMenuEnter() {
        this.$nextTick(() => this.$refs.menus.forEach(menu => this.scrollMenu(menu)));
      },
    },
  };
</script>

<style></style>
